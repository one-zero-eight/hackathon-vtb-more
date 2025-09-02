from fastapi import Depends, Request

from src.db.repositories import (
    ApplicationRepository,
    SkillRepository,
    SkillTypeRepository,
    UserRepository,
    VacancyRepository,
    PreInterviewResultRepository,
)
from src.db.storage import AbstractSQLAlchemyStorage


def get_storage(request: Request) -> AbstractSQLAlchemyStorage:
    storage = getattr(request.app.state, "storage", None)
    if storage is None:
        raise RuntimeError("Storage is not initialized. Check lifespan setup.")
    return storage


def get_application_repository(
    storage: AbstractSQLAlchemyStorage = Depends(get_storage),
) -> ApplicationRepository:
    return ApplicationRepository(storage)


def get_skill_repository(
    storage: AbstractSQLAlchemyStorage = Depends(get_storage),
) -> SkillRepository:
    return SkillRepository(storage)


def get_skill_type_repository(
    storage: AbstractSQLAlchemyStorage = Depends(get_storage),
) -> SkillTypeRepository:
    return SkillTypeRepository(storage)


def get_user_repository(
    storage: AbstractSQLAlchemyStorage = Depends(get_storage),
) -> UserRepository:
    return UserRepository(storage)


def get_vacancy_repository(
    storage: AbstractSQLAlchemyStorage = Depends(get_storage),
) -> VacancyRepository:
    return VacancyRepository(storage)

def get_preinterview_repository(
    storage: AbstractSQLAlchemyStorage = Depends(get_storage),
) -> PreInterviewResultRepository:
    return PreInterviewResultRepository(storage)
