from typing import Self

from sqlalchemy.ext.asyncio import AsyncSession

from src.db import AbstractSQLAlchemyStorage
from src.db.models import Skill, SkillType


class SkillRepository:
    storage: AbstractSQLAlchemyStorage

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
            skill_type_id: int = None,
            vacancy_id: int = None,
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
