---
name: python-project-guide
description: >-
  Scaffold a Python backend using FastAPI, SQLAlchemy 2.0, and Pydantic
  Settings, with a manual SQL schema folder, a quote_plus-encoded MySQL
  connection string, and a Docker Compose stack behind Traefik on a shared
  MySQL network. Use when starting a new Python project, building a FastAPI
  REST API, wiring SQLAlchemy to MySQL, or setting up Docker/Traefik deployment
  for a Python service.
disable-model-invocation: true
---

# Python Project Guide

Build new Python backends that mirror this team's conventions: FastAPI +
SQLAlchemy 2.0 + Pydantic Settings, a manually applied SQL schema, and a Docker
Compose stack served by Traefik over a shared external MySQL network.

Use the templates below as the source of truth. Replace `myapp`, `mydb`, and
domain placeholders with project-specific names. Keep all source comments and
docstrings in the project's language; this guide is in English.

## Tech stack & requirements

Pin these in `backend/requirements.txt`:

```text
fastapi==0.115.6
uvicorn[standard]==0.34.0
sqlalchemy==2.0.36
pymysql==1.1.1
pydantic==2.10.4
pydantic-settings==2.7.1
pyjwt==2.10.1
passlib[bcrypt]==1.7.4
bcrypt==4.0.1
python-multipart==0.0.20
python-dotenv==1.0.1
email-validator==2.2.0
cryptography>=45.0.4
```

`cryptography` is required: PyMySQL needs it to authenticate against modern
MySQL/MariaDB users (sha256/caching_sha2 auth plugins). Do not drop it even if
the code never imports it directly.

## Project layout

```
backend/
  app/
    __init__.py
    config.py            # Pydantic Settings, database_url, storage_dir
    database.py          # engine, SessionLocal, Base, get_db
    main.py              # FastAPI app, routers, static frontend, /health
    auth/
      security.py        # password hashing + JWT encode/decode
      deps.py            # get_current_user / active / admin dependencies
    models/
      __init__.py        # import every model so SQLAlchemy registers tables
      user.py
    schemas/             # Pydantic request/response models
    routers/             # APIRouter modules (one per resource)
    services/            # business logic, kept out of routers
    utils/               # enums, constants, helpers
  sql/
    mydb.sql             # manual schema dump (applied by hand)
  requirements.txt
  entrypoint.sh
frontend/                # optional static HTML/CSS/JS served by FastAPI
Dockerfile
docker-compose.yml
.env
.env.example
.dockerignore
```

## Config (Pydantic Settings)

`backend/app/config.py` — no fallbacks; every variable must exist in `.env`.
The connection string is built with `quote_plus` so passwords or users with
special characters (`@`, `#`, `:`, `/`, ...) are URL-encoded correctly.

```python
from __future__ import annotations

from functools import lru_cache
from pathlib import Path
from urllib.parse import quote_plus

from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parent.parent
PROJECT_ROOT = BACKEND_DIR.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(PROJECT_ROOT / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    mysql_host: str
    mysql_port: int
    mysql_database: str
    mysql_user: str
    mysql_password: str

    jwt_secret: str
    jwt_algorithm: str
    access_token_expire_minutes: int

    storage_path: str
    evidence_max_bytes: int
    evidence_max_files: int

    app_name: str

    @property
    def database_url(self) -> str:
        user = quote_plus(self.mysql_user)
        password = quote_plus(self.mysql_password)
        return (
            f"mysql+pymysql://{user}:{password}"
            f"@{self.mysql_host}:{self.mysql_port}/{self.mysql_database}?charset=utf8mb4"
        )

    @property
    def storage_dir(self) -> Path:
        path = Path(self.storage_path)
        if not path.is_absolute():
            path = BACKEND_DIR / path
        return path


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
```

Key rules:
- Always wrap user and password with `quote_plus` when assembling the DSN.
- Always append `?charset=utf8mb4`.
- Cache settings with `@lru_cache` and expose a module-level `settings`.

## Database (SQLAlchemy 2.0)

`backend/app/database.py`:

```python
from __future__ import annotations

from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.config import settings

engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,
    pool_recycle=3600,
    future=True,
)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)


class Base(DeclarativeBase):
    """Declarative base for all ORM models."""


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

## Models / Schemas / Routers / Services

Models use the SQLAlchemy 2.0 typed mapping (`Mapped` / `mapped_column`):

```python
from __future__ import annotations

from datetime import datetime

from sqlalchemy import DateTime, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(180), nullable=False, unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, server_default=func.now()
    )
```

Register every model in `app/models/__init__.py` so the tables load:

```python
from app.models.user import User

__all__ = ["User"]
```

Schemas are Pydantic v2; use `ConfigDict(from_attributes=True)` for ORM output:

```python
from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: EmailStr


class RegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)
```

Routers use `APIRouter(prefix=..., tags=...)` and inject `get_db`. Run queries
with SQLAlchemy 2.0 `select(...)`:

```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.auth import UserResponse

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)) -> User:
    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found.")
    return user
```

Keep business logic in `app/services/` (functions that take `db: Session` plus
arguments and `commit()` / `refresh()`), so routers stay thin.

Auth follows the same split: `app/auth/security.py` hashes passwords with
`passlib` bcrypt and encodes/decodes JWTs with `pyjwt`; `app/auth/deps.py`
exposes `get_current_user` / `get_current_active_user` / `get_current_admin`
dependencies built on `OAuth2PasswordBearer`.

## Manual SQL folder

The schema is applied by hand, never auto-created. Store it as
`backend/sql/mydb.sql` (a phpMyAdmin-style dump), using
`ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`.

Rules:
- Do not call `Base.metadata.create_all()` and do not add automatic migrations.
- The app assumes the schema already exists at startup.
- NEVER execute SQL automatically. Provide the SQL script and instruct the user
  to run it manually (phpMyAdmin, DBeaver, or similar). Prefer
  `IF EXISTS` / `IF NOT EXISTS` and explain risks before destructive changes.

## main.py

```python
from __future__ import annotations

from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.config import BACKEND_DIR, settings
from app.routers import auth

FRONTEND_DIR = BACKEND_DIR.parent / "frontend"

app = FastAPI(title=f"{settings.app_name} API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def _on_startup() -> None:
    settings.storage_dir.mkdir(parents=True, exist_ok=True)


app.include_router(auth.router)


@app.get("/health", tags=["Infra"], summary="Healthcheck")
def health() -> dict[str, str]:
    return {"status": "ok"}


def _mount_static(route: str, directory: Path) -> None:
    if directory.is_dir():
        app.mount(route, StaticFiles(directory=directory), name=route.strip("/"))


_mount_static("/css", FRONTEND_DIR / "css")
_mount_static("/js", FRONTEND_DIR / "js")
```

## entrypoint.sh

Waits for the database TCP port, then starts uvicorn. Reminds that the schema
is manual.

```bash
#!/usr/bin/env bash
set -e

: "${MYSQL_HOST:?Set MYSQL_HOST in .env}"
: "${MYSQL_PORT:?Set MYSQL_PORT in .env}"

echo "Waiting for database at ${MYSQL_HOST}:${MYSQL_PORT}..."
python - <<'PY'
import os, sys, time, socket

host = os.environ["MYSQL_HOST"]
port = int(os.environ["MYSQL_PORT"])

for _ in range(60):
    try:
        with socket.create_connection((host, port), timeout=2):
            print("Database available.")
            break
    except OSError:
        time.sleep(2)
else:
    sys.exit("Database did not respond in time.")
PY

echo "Starting the application..."
echo "Note: the schema must already exist (run backend/sql/mydb.sql manually)."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## Dockerfile

Install requirements before copying the code so the layer is cached.

```dockerfile
FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /srv

COPY backend/requirements.txt /srv/backend/requirements.txt
RUN pip install --upgrade pip && pip install -r /srv/backend/requirements.txt

COPY backend /srv/backend
COPY frontend /srv/frontend

WORKDIR /srv/backend

RUN chmod +x /srv/backend/entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/srv/backend/entrypoint.sh"]
```

## docker-compose.yml

Single `app` service on two external networks (`mysql_shared` for the shared
database, `traefik` for ingress). Traefik labels drive routing/TLS; env vars
configure domain and entrypoint.

```yaml
services:
  app:
    build: .
    container_name: myapp
    restart: always

    env_file:
      - .env

    networks:
      - mysql_shared
      - traefik

    volumes:
      - evidence_data:/srv/backend/storage/evidence

    labels:
      - traefik.enable=true
      - traefik.docker.network=traefik
      - "traefik.http.routers.myapp.rule=Host(`${DOMAIN}`) || Host(`www.${DOMAIN}`)"
      - traefik.http.routers.myapp.entrypoints=${TRAEFIK_ENTRYPOINT:-websecure}
      - traefik.http.routers.myapp.tls=true
      - traefik.http.routers.myapp.tls.certresolver=${TRAEFIK_CERT_RESOLVER:-letsencrypt}
      - traefik.http.services.myapp.loadbalancer.server.port=8000

networks:
  mysql_shared:
    external: true

  traefik:
    external: true

volumes:
  evidence_data:
```

The `mysql_shared` and `traefik` networks must already exist on the host
(`docker network create ...`). Deploy with `docker compose up -d --build`.

## .env / .env.example

`.env` (real values, never committed) and `.env.example` (placeholders,
committed) share the same keys. Every variable is required; the app has no
fallbacks.

```env
DOMAIN=myapp.example.com
TRAEFIK_ENTRYPOINT=websecure
TRAEFIK_CERT_RESOLVER=letsencrypt

MYSQL_HOST=mysql_shared
MYSQL_PORT=3306
MYSQL_DATABASE=mydb
MYSQL_USER=myapp
MYSQL_PASSWORD=change-me-strong-password

JWT_SECRET=replace-with-a-long-random-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=720

STORAGE_PATH=storage/evidence
EVIDENCE_MAX_BYTES=2097152
EVIDENCE_MAX_FILES=10

APP_NAME=My App
```

Notes:
- Local dev (running uvicorn directly): set `MYSQL_HOST=127.0.0.1`.
- Docker deploy: set `MYSQL_HOST` to the shared MySQL container name (for
  example `mysql_shared`).
- `STORAGE_PATH` is resolved relative to `backend/` and created on startup.
- Add `.env` to `.dockerignore` and `.gitignore`; keep `.env.example` tracked.

## Scaffolding checklist

```
- [ ] Create the directory layout above
- [ ] Write backend/requirements.txt (include cryptography>=45.0.4)
- [ ] Write app/config.py (quote_plus DSN, ?charset=utf8mb4, no fallbacks)
- [ ] Write app/database.py (engine + Base + get_db)
- [ ] Add models under app/models/ and register them in app/models/__init__.py
- [ ] Add schemas (Pydantic v2, ConfigDict(from_attributes=True))
- [ ] Add routers (APIRouter prefix/tags + Depends(get_db)) and services
- [ ] Add auth/security.py and auth/deps.py if the API needs JWT auth
- [ ] Write app/main.py (CORS, startup storage_dir, include_router, /health)
- [ ] Write backend/sql/mydb.sql and tell the user to run it manually
- [ ] Write entrypoint.sh, Dockerfile, docker-compose.yml
- [ ] Write .env and .env.example, update .dockerignore / .gitignore
```
