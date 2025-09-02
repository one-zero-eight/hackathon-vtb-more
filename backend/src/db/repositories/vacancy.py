import datetime
from typing import Self

from sqlalchemy.ext.asyncio import AsyncSession

from src.db import AbstractSQLAlchemyStorage
from src.db.models import Vacancy


class VacancyRepository:
    storage: AbstractSQLAlchemyStorage

    def __init__(self, storage: AbstractSQLAlchemyStorage) -> None:
        self.storage = storage

    def update_storage(self, storage: AbstractSQLAlchemyStorage) -> Self:
        self.storage = storage
        return self

    def _create_session(self) -> AsyncSession:
        return self.storage.create_session()

    async def create_vacancy(self, name: str, description: str, salary: float | None, city: str, 
                             weekly_hours_occupancy: int, required_experience: int, open_time: datetime.datetime, 
                             close_time: datetime.datetime, is_active: bool, user_id: int) -> Vacancy:
        async with self._create_session() as session:
            vacancy = Vacancy(
                name=name,
                description=description,
                salary=salary,
                weekly_hours_occupancy=weekly_hours_occupancy,
                city=city,
                required_experience=required_experience,
                open_time=open_time,
                close_time=close_time,
                is_active=is_active,
                user_id=user_id
            )
            session.add(vacancy)
            await session.commit()
            return vacancy

    async def get_vacancy(self, vacancy_id: int) -> Vacancy | None:
        async with self._create_session() as session:
            vacancy = await session.get(Vacancy, vacancy_id)
            return vacancy

    async def delete_vacancy(self, vacancy_id: int) -> Vacancy | None:
        async with self._create_session() as session:
            vacancy = await session.get(Vacancy, vacancy_id)
            if vacancy is None:
                return None
            await session.delete(vacancy)
            await session.commit()
            return vacancy

    async def edit_vacancy(
        self,
        vacancy_id: int, 
        name: str | None = None, 
        description: str | None = None,
        salary: float | None = None,
        city: str | None = None,
        weekly_hours_occupancy: int | None = None,
        required_experience: int | None = None, 
        open_time: datetime.datetime | None = None, 
        close_time: datetime.datetime | None = None, 
        is_active: bool | None = None, 
        user_id: int | None = None,
    ) -> Vacancy | None:
        async with self._create_session() as session:
            vacancy = await session.get(Vacancy, vacancy_id)
            if vacancy is None:
                return None

            if name is not None:
                vacancy.name = name
            if description is not None:
                vacancy.description = description
            if salary is not None:
                vacancy.salary = salary
            if city is not None:
                vacancy.city = city
            if weekly_hours_occupancy is not None:
                vacancy.weekly_hours_occupancy = weekly_hours_occupancy
            if required_experience is not None:
                vacancy.required_experience = required_experience
            if open_time is not None:
                vacancy.open_time = open_time
            if close_time is not None:
                vacancy.close_time = close_time
            if is_active is not None:
                vacancy.is_active = is_active
            if user_id is not None:
                vacancy.user_id = user_id

            await session.commit()
            await session.refresh(vacancy)
            return vacancy
