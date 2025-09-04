import asyncio

from openai.types.responses import EasyInputMessageParam

from src.config import open_ai_text_settings
from src.db.models import Application, PreInterviewResult, Vacancy
from src.db.repositories import PreInterviewResultRepository
from src.schemas import PreInterviewAIStructure
from src.services.ai.openai_client import OpenAIClient
from src.services.ai.vector_store import VectorStoreManager
from src.services.pre_interview.prompt_builder import build_vacancy_prompt


class PreInterviewAssessor:
    def __init__(self) -> None:
        self.ai = OpenAIClient()
        self.vectors = VectorStoreManager(self.ai)

    async def assess(
        self,
        *,
        application: Application,
        vacancy: Vacancy,
        repository: PreInterviewResultRepository,
        timeout_seconds: float = 30.0,
    ) -> PreInterviewResult:
        vector_store_id = await asyncio.to_thread(
            self.vectors.create_vector_store,
            application.cv,
        )

        vacancy_text = build_vacancy_prompt(vacancy)

        system_msg = EasyInputMessageParam(
            role="system",
            content=(
                "Act as a technical recruiter that evaluates a candidate strictly from the attached CV. "
                "Return a structured decision only."
            ),
        )
        user_msg = EasyInputMessageParam(
            role="user",
            content=(
                "Evaluate the candidate for the following role and only use the attached CV for evidence. "
                "Output the exact schema with is_recommended: bool and score: float between 0 and 1.\n\n" + vacancy_text
            ),
        )
        file_search_tool = self.ai.make_file_search_tool(vector_store_id)

        async with asyncio.timeout(timeout_seconds):
            response = await asyncio.to_thread(
                self.ai.structured_parse,
                model=open_ai_text_settings.model,
                messages=[system_msg, user_msg],
                text_format=PreInterviewAIStructure,
                tools=[file_search_tool],
            )

        pre_interview_result = await repository.create_result(
            is_recommended=bool(response.output_parsed.is_recommended),
            score=float(response.output_parsed.score),
            application_id=application.id,
        )
        await asyncio.to_thread(self.vectors.delete_vector_store, vector_store_id)
        return pre_interview_result
