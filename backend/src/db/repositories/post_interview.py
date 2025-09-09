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

    async def get_result(self, result_id: int) -> PostInterviewResult | None:
        async with self._create_session() as session:
            return await session.get(PostInterviewResult, result_id)

    async def edit_result(
        self,
        result_id: int,
        is_recommended: bool | None = None,
        score: float | None = None,
        interview_summary: str | None = None,
        candidate_response: str | None = None,
        summary: str | None = None,
        application_id: int | None = None,
    ) -> PostInterviewResult | None:
        async with self._create_session() as session:
            result = await session.get(PostInterviewResult, result_id)
            if result is None:
                return None

            if is_recommended is not None:
                result.is_recommended = is_recommended
            if score is not None:
                result.score = score
            if interview_summary is not None:
                result.interview_summary = interview_summary
            if candidate_response is not None:
                result.candidate_response = candidate_response
            if summary is not None:
                result.summary = summary
            if application_id is not None:
                result.application_id = application_id

            await session.commit()
            return result

    async def delete_result(self, result_id: int) -> PostInterviewResult | None:
        async with self._create_session() as session:
            result = await session.get(PostInterviewResult, result_id)
            if result is None:
                return None

            await session.delete(result)
            await session.commit()
            return result
