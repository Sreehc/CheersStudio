# Production Deployment

This repository deploys to `studio.wandcheers.xyz` with Docker Compose on the server.

## Production Topology

- Nginx on the host listens on `80`
- Frontend container listens on `127.0.0.1:3001`
- Backend container listens on `127.0.0.1:8081`
- `https://studio.wandcheers.xyz/` proxies to the frontend
- `https://studio.wandcheers.xyz/api/` proxies to the backend

The localhost-only port bindings avoid conflicts with the existing sites already running on the server.

## Files Added For Deployment

- `backend/src/main/resources/application-prod.yml`
- `backend/Dockerfile`
- `frontend/Dockerfile`
- `docker-compose.prod.yml`
- `deploy/deploy.sh`
- `deploy/nginx/cheersstudio.conf`
- `.github/workflows/deploy.yml`
- `.env.prod.example`

## Required GitHub Secrets

- `DEPLOY_HOST`: `103.85.227.161`
- `DEPLOY_PORT`: `22`
- `DEPLOY_USER`: the SSH user used by Actions
- `DEPLOY_PRIVATE_KEY`: private key content for that user
- `DEPLOY_PATH`: recommended `/www/wwwroot/cheersstudio`
- `PROD_ENV_FILE`: full contents of `.env.prod`

## Recommended `.env.prod`

Start from `.env.prod.example` and replace all placeholder values before deployment.

Important values:

- `NEXT_PUBLIC_API_BASE_URL=` must stay empty for same-origin `/api` requests
- `APP_CORS_ALLOWED_ORIGINS=https://studio.wandcheers.xyz`
- `SPRING_PROFILES_ACTIVE=prod`
- `FRONTEND_PORT_MAPPING=127.0.0.1:3001:3000`
- `BACKEND_PORT_MAPPING=127.0.0.1:8081:8080`

## Database

The server already has MySQL running. Create a dedicated database and user for this project before the first deployment.

Example:

```sql
CREATE DATABASE cheersstudio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'cheersstudio'@'%' IDENTIFIED BY 'replace-with-a-strong-password';
GRANT ALL PRIVILEGES ON cheersstudio.* TO 'cheersstudio'@'%';
FLUSH PRIVILEGES;
```

Then import:

```bash
mysql -uroot -p cheersstudio < sql/001_schema.sql
mysql -uroot -p cheersstudio < sql/002_seed.sql
```

## First Deployment Checklist

1. Add the GitHub repository secrets listed above.
2. Create the MySQL database and import the SQL files.
3. Point `studio.wandcheers.xyz` DNS to the server.
4. Push to `main` or run the workflow manually.

## Notes

- The backend now reads production settings from `application-prod.yml`.
- The frontend now supports an empty `NEXT_PUBLIC_API_BASE_URL`, which is required for same-origin `/api` proxying.
- The backend container reaches the host MySQL instance through `host.docker.internal`.
