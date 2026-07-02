from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.exc import OperationalError, ProgrammingError

from app.config import get_settings
from app.database import SessionLocal
from app.routers.auth import router as auth_router
from app.seed import seed_admin_user


def get_frontend_dir() -> Path:
    app_root = Path(__file__).resolve().parent.parent
    for candidate in (app_root / "frontend", app_root.parent / "frontend"):
        if (candidate / "index.html").exists():
            return candidate
    raise RuntimeError("Diretório frontend/ não encontrado.")


FRONTEND_DIR = get_frontend_dir()


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    db = SessionLocal()
    try:
        seed_admin_user(db, settings)
    except (OperationalError, ProgrammingError) as exc:
        raise RuntimeError(
            "Schema do banco não encontrado. Execute manualmente os scripts em "
            "backend/sql/ (baseados em backend/sql.example/) no MySQL compartilhado "
            "antes de iniciar a aplicação."
        ) from exc
    finally:
        db.close()
    yield


app = FastAPI(title="Bevilacqua Labs API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

settings = get_settings()

app.include_router(auth_router)


@app.get("/api/health")
def health():
    return {"status": "ok", "base_url": settings.public_base_url}


@app.get("/")
def index():
    return FileResponse(FRONTEND_DIR / "index.html")


@app.get("/admin.html")
def admin():
    return FileResponse(FRONTEND_DIR / "admin.html")


app.mount("/src", StaticFiles(directory=FRONTEND_DIR / "src"), name="static")
