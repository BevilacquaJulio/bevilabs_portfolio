from functools import lru_cache
from pathlib import Path
from urllib.parse import quote_plus

from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parent.parent
PROJECT_ROOT = BACKEND_DIR.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(str(PROJECT_ROOT / ".env"), str(BACKEND_DIR / ".env")),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    domain: str = ""
    app_base_url: str = ""

    mysql_host: str
    mysql_port: int
    mysql_database: str
    mysql_user: str
    mysql_password: str

    admin_password: str = ""

    jwt_secret: str
    jwt_algorithm: str
    access_token_expire_minutes: int

    @property
    def database_url(self) -> str:
        user = quote_plus(self.mysql_user)
        password = quote_plus(self.mysql_password)
        database = quote_plus(self.mysql_database)
        return (
            f"mysql+pymysql://{user}:{password}"
            f"@{self.mysql_host}:{self.mysql_port}/{database}?charset=utf8mb4"
        )

    @property
    def public_base_url(self) -> str:
        if self.domain.strip():
            return f"https://{self.domain.strip().rstrip('/')}"
        if self.app_base_url.strip():
            return self.app_base_url.strip().rstrip("/")
        return "http://localhost:8000"


@lru_cache
def get_settings() -> Settings:
    return Settings()
