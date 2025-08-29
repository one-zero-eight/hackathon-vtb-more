from contextlib import asynccontextmanager

from fastapi import FastAPI

import src.api.logging_  # noqa: F401
from src.config import api_settings
from src.db import SQLAlchemyStorage


async def setup_repositories() -> SQLAlchemyStorage:
    from src.db.repositories import (  # noqa: PLC0415
        application_repository,
        skill_repository,
        skill_type_repository,
        user_repository,
        vacancy_repository,
    )

    storage = SQLAlchemyStorage.from_url(api_settings.db_url.get_secret_value())
    application_repository.update_storage(storage)
    skill_repository.update_storage(storage)
    skill_type_repository.update_storage(storage)
    user_repository.update_storage(storage)
    vacancy_repository.update_storage(storage)

    return storage


@asynccontextmanager
async def lifespan(_app: FastAPI):
    # Application startup
    storage = await setup_repositories()
    yield
    # Application shutdown
    await storage.close_connection()
