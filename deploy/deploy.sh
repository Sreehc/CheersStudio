#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/srv/cheersstudio}"
ENV_FILE="${ENV_FILE:-.env.prod}"
RELEASE_FILE="${RELEASE_FILE:-.env.release}"
COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.prod.yml}"
NGINX_SOURCE="${NGINX_SOURCE:-deploy/nginx/cheersstudio.conf}"
NGINX_TARGET="${NGINX_TARGET:-/www/server/panel/vhost/nginx/cheersstudio.conf}"

cd "$APP_DIR"

if ! command -v docker >/dev/null 2>&1; then
  echo "docker is required on the server" >&2
  exit 1
fi

if docker compose version >/dev/null 2>&1; then
  compose_cmd=(docker compose)
elif command -v docker-compose >/dev/null 2>&1; then
  compose_cmd=(docker-compose)
else
  echo "docker compose is required on the server" >&2
  exit 1
fi

if [[ ! -f "$ENV_FILE" ]]; then
  echo "missing $APP_DIR/$ENV_FILE" >&2
  exit 1
fi

if [[ ! -f "$RELEASE_FILE" ]]; then
  echo "missing $APP_DIR/$RELEASE_FILE" >&2
  exit 1
fi

if [[ ! -f "$NGINX_SOURCE" ]]; then
  echo "missing $APP_DIR/$NGINX_SOURCE" >&2
  exit 1
fi

if [[ -n "${GHCR_PULL_USERNAME:-}" && -n "${GHCR_PULL_TOKEN:-}" ]]; then
  printf '%s' "$GHCR_PULL_TOKEN" | docker login ghcr.io -u "$GHCR_PULL_USERNAME" --password-stdin >/dev/null
fi

read_env_value() {
  local file="$1"
  local key="$2"
  local default_value="${3:-}"
  local line

  line="$(grep -E "^${key}=" "$file" | tail -n 1 || true)"
  if [[ -n "$line" ]]; then
    printf '%s' "${line#*=}"
  else
    printf '%s' "$default_value"
  fi
}

frontend_host_port="$(read_env_value "$ENV_FILE" "FRONTEND_HOST_PORT" "8089")"
backend_host_port="$(read_env_value "$ENV_FILE" "BACKEND_HOST_PORT" "8081")"

wait_for_http() {
  local url="$1"
  local label="$2"
  local attempts="${3:-30}"

  for _ in $(seq 1 "$attempts"); do
    if curl -fsS --max-time 5 "$url" >/dev/null; then
      return 0
    fi
    sleep 2
  done

  echo "$label health check failed: $url" >&2
  return 1
}

"${compose_cmd[@]}" --env-file "$ENV_FILE" --env-file "$RELEASE_FILE" -f "$COMPOSE_FILE" pull backend frontend
"${compose_cmd[@]}" --env-file "$ENV_FILE" --env-file "$RELEASE_FILE" -f "$COMPOSE_FILE" up -d --no-deps backend
wait_for_http "http://127.0.0.1:${backend_host_port}/api/public/site-settings" "backend"
"${compose_cmd[@]}" --env-file "$ENV_FILE" --env-file "$RELEASE_FILE" -f "$COMPOSE_FILE" up -d --no-deps frontend
wait_for_http "http://127.0.0.1:${frontend_host_port}/" "frontend"

cp "$NGINX_SOURCE" "$NGINX_TARGET"
nginx -t
if systemctl is-active --quiet nginx 2>/dev/null; then
  systemctl reload nginx
elif [[ -x /www/server/nginx/sbin/nginx ]]; then
  /www/server/nginx/sbin/nginx -s reload
elif command -v nginx >/dev/null 2>&1; then
  nginx -s reload
else
  echo "nginx reload command not found" >&2
  exit 1
fi