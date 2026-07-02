# Docker Compose / Traefik / MySQL Shared Skill

## Purpose

Use this standard for all VPS projects using Docker Compose, Traefik and MySQL.

The default architecture should be:

```text
Traefik
│
├── App 1
├── App 2
├── App 3
│
└── mysql_shared
    ├── database_1
    ├── database_2
    └── database_3
```

---

# General Rules

* Use `docker compose`, never `docker-compose`.
* Public applications must be connected to the external `traefik` network.
* Applications using MySQL must also be connected to the external `mysql_shared` network.
* Use a single shared MySQL container by default.
* Do not create a dedicated MySQL container for every project unless explicitly requested.
* Always use `_` in container names.
* Never use `-` in container names.
* Always declare `image:` explicitly in the compose, together with `build:`.
  * Image names may use `-` (e.g. `bl_financeiro-app`).
  * Container names must use `_` only.
* Always load application config through `env_file: .env` at the **project root** — do not duplicate variables in `environment:` unless strictly necessary for Compose interpolation.
* The `.env` for Docker lives at the **root** (same level as `docker-compose.yml`). Local development without Docker may use a separate `.env` inside the app folder (e.g. `backend/.env`).

Examples:

```text
Correct:
bl_financeiro          (container_name)
bl_financeiro-app      (image)
mysql_shared

Wrong:
bl-financeiro          (container — no hifen)
mysql-shared
```

---

# Shared MySQL Rules

Applications must connect using:

```env
MYSQL_HOST=NOME_CONTAINER_MYSQL
MYSQL_PORT=3306
```

Never use:

```env
MYSQL_HOST=localhost
```

The database (`MYSQL_DATABASE`) and user must exist in the shared MySQL **before** the first deploy. The application container does not create the database itself — only tables (via app startup, when applicable).

---

# APP_BASE_URL and DOMAIN

Do **not** set `APP_BASE_URL` in the root `.env` for Docker deploys.

The backend resolves the public URL automatically from `DOMAIN`:

```text
DOMAIN=financeiro.seudominio.com.br  →  APP_BASE_URL=https://financeiro.seudominio.com.br
```

Rules:

* In Docker/production: set only `DOMAIN` in the root `.env`.
* `APP_BASE_URL` is derived as `https://` + `DOMAIN` (trimmed, no trailing slash).
* Use `APP_BASE_URL` only in local development (e.g. `backend/.env` with `http://localhost:8000`) when `DOMAIN` is empty.
* Links de reset de senha, e-mails e URLs absolutas devem usar esse valor resolvido — nunca hardcodar domínio no código.

---

# Traefik Rules

Every public HTTP application must include:

```yaml
labels:
  - traefik.enable=true
  - traefik.docker.network=traefik
  - "traefik.http.routers.PROJECT.rule=Host(`${DOMAIN}`)"
  - traefik.http.routers.PROJECT.entrypoints=${TRAEFIK_ENTRYPOINT:-websecure}
  - traefik.http.routers.PROJECT.tls=true
  - traefik.http.routers.PROJECT.tls.certresolver=${TRAEFIK_CERT_RESOLVER:-letsencrypt}
  - traefik.http.services.PROJECT.loadbalancer.server.port=APP_INTERNAL_PORT
```

Optional (when www redirect is needed):

```yaml
- "traefik.http.routers.PROJECT.rule=Host(`${DOMAIN}`) || Host(`www.${DOMAIN}`)"
```

Replace `PROJECT` with the same identifier used in `container_name` (underscores).

---

# Standard Compose — Application with MySQL

Reference: projeto **Financeiro** (FastAPI, porta interna **8000**).

```yaml
services:
  app:
    image: bl_financeiro-app
    build: .
    container_name: bl_financeiro
    restart: always
    env_file:
      - .env
    networks:
      - mysql_shared
      - traefik
    labels:
      - traefik.enable=true
      - traefik.docker.network=traefik
      - "traefik.http.routers.bl_financeiro.rule=Host(`${DOMAIN}`)"
      - traefik.http.routers.bl_financeiro.entrypoints=${TRAEFIK_ENTRYPOINT:-websecure}
      - traefik.http.routers.bl_financeiro.tls=true
      - traefik.http.routers.bl_financeiro.tls.certresolver=${TRAEFIK_CERT_RESOLVER:-letsencrypt}
      - traefik.http.services.bl_financeiro.loadbalancer.server.port=8000

networks:
  mysql_shared:
    external: true
  traefik:
    external: true
```

### Why `env_file` instead of `environment:`

* Single source of truth: root `.env`.
* Compose injects all variables into the container as environment variables.
* The app reads them via Pydantic/dotenv — no `.env` file is copied into the image (excluded by `.dockerignore`).
* Traefik labels still interpolate `${DOMAIN}`, `${TRAEFIK_ENTRYPOINT}`, etc. from the same root `.env`.

### Why `image:` + `build:`

* `build: .` builds from the local `Dockerfile`.
* `image: bl_financeiro-app` names the resulting image explicitly (easier to identify in `docker images` and redeploys).

Adapt for other projects:

| Campo | Financeiro | Outro projeto |
|-------|------------|---------------|
| `image` | `bl_financeiro-app` | `nome-do-projeto-app` |
| `container_name` | `bl_financeiro` | `nome_do_projeto` |
| Router/service Traefik | `bl_financeiro` | mesmo que `container_name` |
| Porta interna | `8000` | porta exposta pelo container |

---

# Example `.env` (project root — Docker)

```env
# Dominio publico (Traefik). APP_BASE_URL = https://DOMAIN (automatico no backend).
DOMAIN=financeiro.seudominio.com.br
TRAEFIK_ENTRYPOINT=websecure
TRAEFIK_CERT_RESOLVER=letsencrypt

# MySQL compartilhado (nome do container na rede mysql_shared)
MYSQL_HOST=mysql_shared
MYSQL_PORT=3306
MYSQL_DATABASE=financeiro
MYSQL_USER=financeiro_user
MYSQL_PASSWORD=troque_esta_senha

# Seguranca / JWT
JWT_SECRET=troque-este-valor-por-uma-chave-aleatoria-longa
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=120
REMEMBER_ME_EXPIRE_MINUTES=43200

# Administrador (criado no primeiro startup, se aplicavel)
ADMIN_NAME=Administrador
ADMIN_EMAIL=admin@financeiro.com.br
ADMIN_PASSWORD=Admin@123

# Regras de dominio / e-mail
EMAIL_DOMAIN=@financeiro.com.br
PASSWORD_RESET_EXPIRE_MINUTES=30

# SMTP (opcional)
SMTP_ENABLED=false
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=nao-responda@financeiro.com.br
SMTP_TLS=true
```

Do **not** include `APP_BASE_URL` here — `DOMAIN` is enough.

---

# Financeiro — startup and database

When the container starts (`uvicorn app.main:app`):

1. Connects to MySQL using `MYSQL_*` from the injected environment.
2. Creates tables automatically (`create_all`) if they do not exist.
3. Applies incremental schema upgrades when needed.
4. Seeds the admin user from `ADMIN_EMAIL` / `ADMIN_PASSWORD` if no admin exists.

Manual steps still required:

* Create the MySQL database and user before first deploy.
* Optionally run `backend/seed_demo.sql` for demonstration data.

Local development (without Docker) uses `backend/.env` with `MYSQL_HOST=localhost` and may set `APP_BASE_URL=http://localhost:8000`.

---

# Standard Compose — No database

Use this pattern when a project does not use a database:

```yaml
services:
  app:
    image: nome-do-projeto-app
    build: .
    container_name: nome_do_projeto
    restart: always
    env_file:
      - .env
    networks:
      - traefik
    labels:
      - traefik.enable=true
      - traefik.docker.network=traefik
      - "traefik.http.routers.nome_do_projeto.rule=Host(`${DOMAIN}`)"
      - traefik.http.routers.nome_do_projeto.entrypoints=${TRAEFIK_ENTRYPOINT:-websecure}
      - traefik.http.routers.nome_do_projeto.tls=true
      - traefik.http.routers.nome_do_projeto.tls.certresolver=${TRAEFIK_CERT_RESOLVER:-letsencrypt}
      - traefik.http.services.nome_do_projeto.loadbalancer.server.port=3000

networks:
  traefik:
    external: true
```

---

# Deploy checklist

```bash
cp .env.example .env
# Edit root .env: DOMAIN, MYSQL_*, JWT_SECRET, ADMIN_*

docker compose build
docker compose up -d
docker logs bl_financeiro   # verify startup and DB connection
```

Always assume:

* Traefik already exists.
* `mysql_shared` network and MySQL container already exist.
* Root `.env` drives both Compose interpolation and app runtime.
* `DOMAIN` defines the public URL; do not duplicate it in `APP_BASE_URL` on Docker.
* Container names and Traefik router names use `_`.
* `image:` is always declared alongside `build:`.
