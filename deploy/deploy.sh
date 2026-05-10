#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/www/wwwroot/cheersstudio}"
ENV_FILE="${ENV_FILE:-.env.prod}"
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

if [[ ! -f "$NGINX_SOURCE" ]]; then
  echo "missing $APP_DIR/$NGINX_SOURCE" >&2
  exit 1
fi

"${compose_cmd[@]}" --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up -d --build --remove-orphans

cp "$NGINX_SOURCE" "$NGINX_TARGET"
nginx -t
systemctl reload nginx
