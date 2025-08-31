import os
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI

import src.api.logging_  # noqa: F401
from src.config import api_settings
from src.config_schema import Settings
from src.db import SQLAlchemyStorage


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Application startup
    storage = SQLAlchemyStorage.from_url(api_settings.db_url.get_secret_value())
    app.state.storage = storage

    settings_path = os.getenv("SETTINGS_PATH", "settings.yaml")
    app.state.settings = Settings.from_yaml(Path(settings_path))

    try:
        yield
    finally:
        # Application shutdown
        await storage.close_connection()
