from functools import lru_cache
from pathlib import Path
from typing import Any, cast

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "MediScan AI"
    database_path: Path = Path("backend/database/mediscan.sqlite3")
    upload_dir: Path = Path("backend/database/uploads")
    model_path: Path = Path("models/phi-3-mini.gguf")
    cors_origins: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://mediscan-ai-gamma-one.vercel.app",
    ]

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: Any) -> list[str]:
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return cast(list[str], v)

    model_config = SettingsConfigDict(env_prefix="MEDISCAN_", env_file=".env", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
