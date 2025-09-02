from typing import Self

from sqlalchemy.ext.asyncio import AsyncSession

from src.db import AbstractSQLAlchemyStorage
from src.db.models import PreInterviewResult


class PreInterviewResultRepository:
    storage: AbstractSQLAlchemyStorage

    def __init__(self, storage: AbstractSQLAlchemyStorage):
        self.storage = storage

    def update_storage(self, storage: AbstractSQLAlchemyStorage) -> Self:
        self.storage = storage
        return self

    def _create_session(self) -> AsyncSession:
        return self.storage.create_session()

    async def create_result(self, is_recommended: bool, score: float, application_id: int) -> PreInterviewResult:
        async with self._create_session() as session:
            result = PreInterviewResult(is_recommended=is_recommended, score=score, application_id=application_id)
            session.add(result)
            await session.commit()
            return result

    async def get_result(self, result_id: int) -> PreInterviewResult | None:
        async with self._create_session() as session:
            return await session.get(PreInterviewResult, result_id)

    async def edit_result(
        self,
        result_id: int | None = None,
        is_recommended: bool | None = None,
        score: float | None = None,
        application_id: int | None = None,
    ) -> PreInterviewResult | None:
        async with self._create_session() as session:
            result = await session.get(PreInterviewResult, result_id)
            if result is None:
                return None

            if is_recommended is not None:
                result.is_recommended = is_recommended
            if score is not None:
                result.score = score
            if application_id is not None:
                result.application_id = application_id

            await session.commit()
            return result

    async def delete_result(self, result_id: int) -> PreInterviewResult | None:
        async with self._create_session() as session:
            result = await session.get(PreInterviewResult, result_id)
            if result is None:
                return None

            await session.delete(result)
            await session.commit()
            return result
