import base64

from openai.types.responses import EasyInputMessageParam, ResponseInputFileParam, ResponseInputTextParam

from src.config import open_ai_text_settings
from src.db.models import Application, PreInterviewResult, Vacancy
from src.db.repositories import PreInterviewResultRepository
from src.schemas import PreInterviewAIStructure
from src.services.ai.openai_client import async_client
from src.services.pre_interview.prompt_builder import build_vacancy_prompt


async def pre_interview_assessment(
    *,
    application: Application,
    vacancy: Vacancy,
    repository: PreInterviewResultRepository,
) -> PreInterviewResult:
    vacancy_text = build_vacancy_prompt(vacancy)

    system_msg = EasyInputMessageParam(
        role="system",
        content=(
            "Act as a technical recruiter that evaluates a candidate strictly from the attached CV. "
            "Return a structured decision only."
        ),
    )
    with open(application.cv, "rb") as f:
        data = f.read()

    base64_string = base64.b64encode(data).decode("utf-8")
    file_input = ResponseInputFileParam(
        type="input_file", filename="CV.pdf", file_data=f"data:application/pdf;base64,{base64_string}"
    )
    _text = (
        "Evaluate the candidate for the following role and only use the attached CV for evidence. "
        "Output the exact schema with is_recommended: bool, score: float between 0 and 1, "
        "reason: justification of is_recommended and score values\n\n" + vacancy_text
    )
    text_input = ResponseInputTextParam(type="input_text", text=_text)

    user_msg = EasyInputMessageParam(role="user", content=[text_input, file_input])

    response = await async_client.responses.parse(
        text_format=PreInterviewAIStructure,
        input=[system_msg, user_msg],
        model=open_ai_text_settings.model,
    )

    pre_interview_result = await repository.create_result(
        is_recommended=bool(response.output_parsed.is_recommended),
        score=float(response.output_parsed.score),
        reason=str(response.output_parsed.reason),
        application_id=application.id,
    )
    return pre_interview_result
