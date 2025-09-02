from typing import Self

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.db import AbstractSQLAlchemyStorage
from src.db.models import Application
from src.schemas import Status


class ApplicationRepository:
    storage: AbstractSQLAlchemyStorage

    def __init__(self, storage: AbstractSQLAlchemyStorage) -> None:
        self.storage = storage

    def update_storage(self, storage: AbstractSQLAlchemyStorage) -> Self:
        self.storage = storage
        return self

    def _create_session(self) -> AsyncSession:
        return self.storage.create_session()

    async def create_application(self, cv: str, status: Status, user_id: int, vacancy_id: int) -> Application:
        async with self._create_session() as session:
            application = Application(
                cv=cv,
                status=status.value,
                user_id=user_id,
                vacancy_id=vacancy_id,
            )
            session.add(application)
            await session.commit()
            return application

    async def get_application(self, application_id: int) -> Application | None:
        async with self._create_session() as session:
            application = await session.get(Application, application_id)
            return application

    async def get_all_applications(self) -> list[Application]:
        async with self._create_session() as session:
            result = await session.execute(select(Application))
            return result.scalars().all()

    async def edit_application(
        self,
        application_id: int,
        *,
        cv: str | None = None,
        status: Status | None = None,
        user_id: int | None = None,
        vacancy_id: int | None = None,
    ) -> Application | None:
        async with self._create_session() as session:
            application = await session.get(Application, application_id)
            if application is None:
                return None

            if cv is not None:
                application.cv = cv
            if status is not None:
                application.status = status.value
            if user_id is not None:
                application.user_id = user_id
            if vacancy_id is not None:
                application.vacancy_id = vacancy_id

            await session.commit()
            return application

    async def delete_application(self, application_id: int) -> Application | None:
        async with self._create_session() as session:
            application = await session.get(Application, application_id)
            if application is None:
                return None
            await session.delete(application)
            await session.commit()
            return application
