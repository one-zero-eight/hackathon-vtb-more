import base64

from openai.types.responses import EasyInputMessageParam, ResponseInputFileParam, ResponseInputTextParam

from src.config import open_ai_text_settings
from src.db.models import Application, InterviewMessage, PostInterviewResult, PreInterviewResult, Vacancy
from src.db.repositories import PostInterviewResultRepository, PreInterviewResultRepository
from src.schemas import PostInterviewAIStructure, PreInterviewAIStructure
from src.services.ai.openai_client import async_client
from src.services.ai.prompt_builder import (
    build_github_prompt,
    build_post_interview_assessment_prompt,
    build_vacancy_prompt,
)
from src.services.pre_interview.github_eval import GithubStats


async def pre_interview_assessment(
    *,
    application: Application,
    vacancy: Vacancy,
    repository: PreInterviewResultRepository,
    github: GithubStats | None,
) -> PreInterviewResult:
    vacancy_text = build_vacancy_prompt(vacancy)

    system_msg = EasyInputMessageParam(
        role="system",
        content=(
            "Act as a technical recruiter that evaluates a candidate strictly from the attached CV and github stats. "
            "Return a structured decision only."
        ),
    )
    with open(application.cv, "rb") as f:
        data = f.read()

    base64_string = base64.b64encode(data).decode("utf-8")
    file_input = ResponseInputFileParam(
        type="input_file",
        filename="CV.pdf",
        file_data=f"data:application/pdf;base64,{base64_string}",
    )
    _text = (
        "Evaluate the candidate for the following role and only use the attached CV and github stats for evidence. "
        "Output the exact schema with is_recommended: bool, score: float between 0 and 1, "
        "reason: justification of is_recommended and score values\n\n" + vacancy_text
    )
    _text += f"Candidate github stats:\n{build_github_prompt(github)}"

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


async def post_interview_assessment(
    *,
    application: Application,
    vacancy: Vacancy,
    transcript: list[InterviewMessage],
    pre_interview_result: PreInterviewResult,
    repository: PostInterviewResultRepository,
) -> PostInterviewResult:
    system_msg = EasyInputMessageParam(
        role="system",
        content=(
            "Act as a technical recruiter that evaluates a candidate strictly from the attached information. "
            "Return a structured decision only."
        ),
    )

    with open(application.cv, "rb") as f:
        data = f.read()

    base64_string = base64.b64encode(data).decode("utf-8")
    file_input = ResponseInputFileParam(
        type="input_file",
        filename="CV.pdf",
        file_data=f"data:application/pdf;base64,{base64_string}",
    )
    _text = (
        build_post_interview_assessment_prompt(
            vacancy=vacancy,
            transcript=transcript,
            pre_interview_result=pre_interview_result,
        )
    )
    text_input = ResponseInputTextParam(type="input_text", text=_text)
    user_msg = EasyInputMessageParam(role="user", content=[text_input, file_input])

    response = await async_client.responses.parse(
        text_format=PostInterviewAIStructure,
        input=[system_msg, user_msg],
        model=open_ai_text_settings.model,
    )

    parsed = response.output_parsed

    # Falls back to 0.0 if anything unexpected occurs.
    overall_score: float
    try:
        overall_score = float(
            sum(float(s.score) * float(s.weight) for s in (parsed.skill_scores or []))
        )
    except Exception:
        overall_score = 0.0

    post_interview_result = await repository.create_result(
        is_recommended=bool(parsed.is_recommended),
        score=overall_score,
        interview_summary=str(parsed.interview_summary),
        candidate_response=str(parsed.candidate_response),
        summary=str(parsed.summary),
        emotional_analysis=str(parsed.emotional_analysis),
        candidate_roadmap=str(parsed.candidate_response),
        application_id=application.id,
    )

    return post_interview_result
