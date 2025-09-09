from typing import Self

from sqlalchemy.ext.asyncio import AsyncSession

from src.db import AbstractSQLAlchemyStorage
from src.db.models import PostInterviewResult


class PostInterviewResultRepository:
    storage: AbstractSQLAlchemyStorage

    def __init__(self, storage: AbstractSQLAlchemyStorage):
        self.storage = storage

    def update_storage(self, storage: AbstractSQLAlchemyStorage) -> Self:
        self.storage = storage
        return self

    def _create_session(self) -> AsyncSession:
        return self.storage.create_session()

    async def create_result(
        self,
        is_recommended: bool,
        score: float,
        interview_summary: str,
        candidate_response: str,
        summary: str,
        application_id: int,
    ) -> PostInterviewResult:
        async with self._create_session() as session:
            result = PostInterviewResult(
                is_recommended=is_recommended,
                score=score,
                interview_summary=interview_summary,
                candidate_response=candidate_response,
                summary=summary,
                application_id=application_id,
            )
            session.add(result)
            await session.commit()
            return result
