from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi import status as http_status
from fastapi_derive_responses import AutoDeriveResponsesAPIRoute

from src.api.auth.dependencies import require_admin
from src.api.repositories.dependencies import (
    get_application_repository,
    get_interview_message_repository,
    get_post_interview_repository,
    get_skill_result_repository,
)
from src.db.models import User
from src.db.repositories import (
    ApplicationRepository,
    InterviewMessageRepository,
    PostInterviewResultRepository,
    SkillResultRepository,
)
from src.schemas import (
    InterviewMessageResponse,
    PostInterviewResponse,
    PostInterviewResultResponse,
    SkillResultResponse,
)

router = APIRouter(prefix="/postinterview", tags=["Post-interview results"], route_class=AutoDeriveResponsesAPIRoute)


@router.post("", status_code=http_status.HTTP_201_CREATED)
async def create_post_interview(
    is_recommended: bool,
    score: float,
    interview_summary: str,
    candidate_response: str,
    summary: str,
    emotional_analysis: str,
    candidate_roadmap: str,
    application_id: int,
    post_interview_repository: PostInterviewResultRepository = Depends(get_post_interview_repository),
    application_repository: ApplicationRepository = Depends(get_application_repository),
    _: User = Depends(require_admin),
) -> PostInterviewResponse:
    application = await application_repository.get_application(application_id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    post_interview = await post_interview_repository.create_result(
        is_recommended=is_recommended,
        score=score,
        interview_summary=interview_summary,
        candidate_response=candidate_response,
        summary=summary,
        emotional_analysis=emotional_analysis,
        candidate_roadmap=candidate_roadmap,
        application_id=application_id,
    )

    return PostInterviewResponse.model_validate(post_interview)


@router.get("/for_application/{application_id}")
async def get_post_interview_for_application(
    application_id: int,
    application_repository: ApplicationRepository = Depends(get_application_repository),
    skill_result_repository: SkillResultRepository = Depends(get_skill_result_repository),
    message_repository: InterviewMessageRepository = Depends(get_interview_message_repository),
    _: User = Depends(require_admin),
) -> PostInterviewResultResponse:
    application = await application_repository.get_application(application_id)
    if application is None:
        raise HTTPException(
            status_code=404, detail=f"Application {application_id} not found"
        )

    post_interview = application.post_interview_result
    if post_interview is None:
        raise HTTPException(404, f"Post interview assessment for application {application_id} not found")

    skill_results = await skill_result_repository.get_application_results(application_id)
    messages = await message_repository.get_interview_messages(application_id)

    response = PostInterviewResultResponse(
        id=post_interview.id,
        is_recommended=post_interview.is_recommended,
        score=post_interview.score,
        skill_scores=[SkillResultResponse(id=res.id, score=res.score, skill_id=res.skill_id) for res in skill_results],
        summary=post_interview.summary,
        interview_transcript=[InterviewMessageResponse(id=msg.id, role=msg.role, message=msg.message) for msg in messages],
        interview_summary=post_interview.interview_summary,
        candidate_response=post_interview.candidate_response,
        emotional_analysis=post_interview.emotional_analysis,
        candidate_roadmap=post_interview.candidate_roadmap,
    )
    return PostInterviewResultResponse.model_validate(response)


@router.patch("/{result_id}")
async def edit_post_interview(
    result_id: int,
    is_recommended: bool | None = None,
    score: float | None = None,
    interview_summary: str | None = None,
    candidate_response: str | None = None,
    summary: str | None = None,
    application_id: int | None = None,
    pre_interview_repository: PostInterviewResultRepository = Depends(get_post_interview_repository),
    application_repository: ApplicationRepository = Depends(get_application_repository),
    _: User = Depends(require_admin),
) -> PostInterviewResponse:
    application = await application_repository.get_application(application_id)
    if not application:
        raise HTTPException(status_code=404, detail=f"Application {application_id} not found")

    post_interview = await pre_interview_repository.edit_result(
        result_id=result_id,
        is_recommended=is_recommended,
        score=score,
        interview_summary=interview_summary,
        candidate_response=candidate_response,
        summary=summary,
        application_id=application_id,
    )

    if post_interview is None:
        raise HTTPException(404, f"Post-interview {result_id} not found")

    return PostInterviewResponse.model_validate(post_interview)


@router.get("/{result_id}")
async def get_post_interview(
    result_id: int,
    post_interview_repository: PostInterviewResultRepository = Depends(get_post_interview_repository),
    _: User = Depends(require_admin),
) -> PostInterviewResponse:
    post_interview = await post_interview_repository.get_result(result_id)

    if post_interview is None:
        raise HTTPException(404, f"Post-interview {result_id} not found")

    return PostInterviewResponse.model_validate(post_interview)


@router.delete("/{result_id}", status_code=http_status.HTTP_204_NO_CONTENT)
async def delete_post_interview(
    result_id: int,
    post_interview_repository: PostInterviewResultRepository = Depends(get_post_interview_repository),
    _: User = Depends(require_admin),
):
    post_interview = await post_interview_repository.delete_result(result_id)

    if post_interview is None:
        raise HTTPException(404, f"Post-interview {result_id} not found")

    return Response(status_code=http_status.HTTP_204_NO_CONTENT)
