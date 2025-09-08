from fastapi import Depends, Request

from src.config import api_settings
from src.db.repositories import (
    ApplicationRepository,
    InterviewMessageRepository,
    PreInterviewResultRepository,
    SkillRepository,
    SkillTypeRepository,
    UserRepository,
    VacancyRepository,
)
from src.db.storage import AbstractSQLAlchemyStorage
from src.services.converting import ConvertingRepository


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


def get_interview_message_repository(
    storage: AbstractSQLAlchemyStorage = Depends(get_storage),
) -> InterviewMessageRepository:
    return InterviewMessageRepository(storage)


def get_converting_repository() -> ConvertingRepository:
    return ConvertingRepository(api_settings.unoserver_server, api_settings.unoserver_port)
