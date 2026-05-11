# Production Deployment

This repository is deployed as two application images behind Baota/Nginx:

- `ghcr.io/sreehc/cheersstudio-frontend`
- `ghcr.io/sreehc/cheersstudio-backend`

The server only keeps deployment assets, runtime env files, and pulled images. It does not build from source during normal releases.

## Runtime Topology

- Public entrypoint: `https://studio.wandcheers.xyz`
- Nginx host proxy:
  - `/` -> `127.0.0.1:8089`
  - `/api/` -> `127.0.0.1:8081`
- Frontend container:
  - Next.js standalone runtime
  - container port `3000`
  - host bind `127.0.0.1:8089`
- Backend container:
  - Spring Boot JAR runtime
  - container port `8080`
  - host bind `127.0.0.1:8081`
- Docker network:
  - `cheersstudio_net`

There is no active `/ws` route in the current codebase.

## Server Layout

Deploy into ` /srv/cheersstudio ` with these files:

- `docker-compose.prod.yml`
- `.env.prod`
- `.env.release`
- `.env.release.prev`
- `deploy/deploy.sh`
- `deploy/nginx/cheersstudio.conf`

Baota owns the public Nginx site configuration and HTTPS certificate. Docker Compose owns only the app containers.

## Environment Files

### `.env.prod`

Runtime configuration that changes rarely:

- `SPRING_PROFILES_ACTIVE=prod`
- `FRONTEND_HOST_PORT=8089`
- `BACKEND_HOST_PORT=8081`
- `NEXT_PUBLIC_API_BASE_URL=`
- `SPRING_DATASOURCE_URL=jdbc:mysql://host.docker.internal:3306/cheersstudio...`
- `SPRING_DATASOURCE_USERNAME=...`
- `SPRING_DATASOURCE_PASSWORD=...`
- `APP_JWT_SECRET=...`
- `APP_CORS_ALLOWED_ORIGINS=https://studio.wandcheers.xyz`
- optional OSS settings

Start from [.env.prod.example](/Users/cheers/Desktop/workspace/CheersStudio/.env.prod.example:1).

### `.env.release`

Release metadata written by CI:

- `FRONTEND_IMAGE`
- `FRONTEND_IMAGE_TAG`
- `BACKEND_IMAGE`
- `BACKEND_IMAGE_TAG`

Start from [.env.release.example](/Users/cheers/Desktop/workspace/CheersStudio/.env.release.example:1).

## First Deployment

1. Create ` /srv/cheersstudio ` on the server.
2. Copy deployment assets there.
3. Create the MySQL database and import:
   - `sql/001_schema.sql`
   - `sql/002_seed.sql`
4. Ensure the MySQL user can connect from Docker bridge containers.
   - Recommended: grant to `cheersstudio@'%'` or at least the Docker bridge range.
5. Create the Baota/Nginx site for `studio.wandcheers.xyz`.
6. Install `.env.prod` and `.env.release`.
7. Run `docker login ghcr.io`.
8. Run `deploy/deploy.sh`.

## Release Flow

GitHub Actions handles release in this order:

1. Build frontend image.
2. Build backend image.
3. Push both images to GHCR with:
   - immutable tag: commit SHA
   - moving tag: `main`
4. Copy deployment assets to the server.
5. Back up the previous `.env.release` to `.env.release.prev`.
6. Write the new `.env.release`.
7. Run `deploy/deploy.sh` remotely.

The deploy script:

1. Logs in to GHCR if pull credentials are supplied.
2. Pulls both images.
3. Restarts backend first.
4. Waits for `http://127.0.0.1:8081/api/public/site-settings`.
5. Restarts frontend second.
6. Waits for `http://127.0.0.1:8089/`.
7. Refreshes the Baota/Nginx config.

## Rollback

Rollback uses an existing image tag instead of rebuilding:

1. Trigger `workflow_dispatch`.
2. Set `release_tag` to the previous commit SHA.
3. CI writes that SHA into `.env.release`.
4. Server pulls the old images and re-runs Compose.

`.env.release.prev` keeps the last deployed tag values for manual reference.

## Required GitHub Secrets

- `DEPLOY_HOST`
- `DEPLOY_PORT`
- `DEPLOY_USER`
- `DEPLOY_PATH`
- `DEPLOY_PRIVATE_KEY`
- `GHCR_PULL_USERNAME`
- `GHCR_PULL_TOKEN`
- `PROD_ENV_FILE`

## Notes

- Frontend images are built with `NEXT_PUBLIC_API_BASE_URL=` so production traffic stays same-origin behind Nginx.
- Backend production settings are read from [backend/src/main/resources/application-prod.yml](/Users/cheers/Desktop/workspace/CheersStudio/backend/src/main/resources/application-prod.yml:1).
- OSS bucket env uses `ALIYUN_OSS_BUCKET_NAME` to match the Spring property binding.