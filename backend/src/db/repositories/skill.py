from typing import Self

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.db import AbstractSQLAlchemyStorage
from src.db.models import Skill, SkillResult, SkillType


class SkillRepository:
    storage: AbstractSQLAlchemyStorage

    def __init__(self, storage: AbstractSQLAlchemyStorage) -> None:
        self.storage = storage

    def update_storage(self, storage: AbstractSQLAlchemyStorage) -> Self:
        self.storage = storage
        return self

    def _create_session(self) -> AsyncSession:
        return self.storage.create_session()

    async def create_skill(
        self,
        weight: float,
        details: str,
        skill_type_id: int,
        vacancy_id: int,
    ) -> Skill:
        async with self._create_session() as session:
            skill = Skill(
                weight=weight,
                details=details,
                skill_type_id=skill_type_id,
                vacancy_id=vacancy_id,
            )
            session.add(skill)
            await session.commit()
            return skill

    async def get_skill(self, skill_id: int) -> Skill | None:
        async with self._create_session() as session:
            skill = await session.get(Skill, skill_id)
            return skill

    async def delete_skill(self, skill_id: int) -> Skill | None:
        async with self._create_session() as session:
            skill = await session.get(Skill, skill_id)
            if skill is None:
                return None

            await session.delete(skill)
            await session.commit()
            return skill

    async def edit_skill(
            self,
            skill_id: int,
            weight: float | None = None,
            details: str | None = None,
            skill_type_id: int | None = None,
            vacancy_id: int | None = None,
    ) -> Skill | None:
        async with self._create_session() as session:
            skill = await session.get(Skill, skill_id)
            if skill is None:
                return None

            if weight is not None:
                skill.weight = weight
            if details is not None:
                skill.details = details
            if skill_type_id is not None:
                skill.skill_type_id = skill_type_id
            if vacancy_id is not None:
                skill.vacancy_id = vacancy_id

            await session.commit()
            return skill


class SkillTypeRepository:
    storage: AbstractSQLAlchemyStorage

    def __init__(self, storage: AbstractSQLAlchemyStorage) -> None:
        self.storage = storage

    def update_storage(self, storage: AbstractSQLAlchemyStorage) -> Self:
        self.storage = storage
        return self

    def _create_session(self) -> AsyncSession:
        return self.storage.create_session()

    async def create_skill_type(
        self,
        name: str,
    ) -> SkillType:
        async with self._create_session() as session:
            skill_type = SkillType(
                name=name,
            )
            session.add(skill_type)
            await session.commit()
            return skill_type

    async def get_skill_type(self, skill_type_id: int) -> SkillType | None:
        async with self._create_session() as session:
            skill_type = await session.get(SkillType, skill_type_id)
            return skill_type

    async def get_all_skill_types(self) -> list[SkillType]:
        async with self._create_session() as session:
            skill_types = await session.execute(select(SkillType))
            return skill_types.scalars().all()

    async def delete_skill_type(self, skill_type_id: int) -> SkillType | None:
        async with self._create_session() as session:
            skill_type = await session.get(SkillType, skill_type_id)
            if skill_type is None:
                return None

            await session.delete(skill_type)
            await session.commit()
            return skill_type

    async def edit_skill_type(
        self,
        skill_type_id: int,
        name: str | None = None,
    ) -> SkillType | None:
        async with self._create_session() as session:
            skill_type = await session.get(SkillType, skill_type_id)
            if skill_type is None:
                return None

            if name is not None:
                skill_type.name = name

            await session.commit()
            return skill_type


class SkillResultRepository:
    storage: AbstractSQLAlchemyStorage

    def __init__(self, storage: AbstractSQLAlchemyStorage) -> None:
        self.storage = storage

    def update_storage(self, storage: AbstractSQLAlchemyStorage) -> Self:
        self.storage = storage
        return self

    def _create_session(self) -> AsyncSession:
        return self.storage.create_session()

    async def create_skill_result(
        self,
        score: float,
        skill_id: int,
        application_id: int,
    ) -> SkillResult:
        async with self._create_session() as session:
            skill_result = SkillResult(
                score=score,
                application_id=application_id,
                skill_id=skill_id,
            )
            session.add(skill_result)
            await session.commit()
            return skill_result

    async def get_skill_result(self, skill_id: int) -> SkillResult:
        async with self._create_session() as session:
            skill_result = await session.get(SkillResult, skill_id)
            return skill_result

    async def get_application_results(self, application_id: int) -> list[SkillResult]:
        async with self._create_session() as session:
            result = await session.execute(select(SkillResult).filter(SkillResult.application_id == application_id))
            return result.scalars().all()

    async def bulk_create_skill_results(self, application_id: int, items: list[dict]) -> list[SkillResult]:
        if not items:
            return []

        async with self._create_session() as session:
            objs: list[SkillResult] = []
            for it in items:
                objs.append(
                    SkillResult(
                        application_id=application_id,
                        skill_id=int(it["skill_id"]),
                        score=float(it["score"]),
                    )
                )

            session.add_all(objs)
            await session.commit()

            return objs
