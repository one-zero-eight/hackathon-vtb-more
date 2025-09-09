from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi import status as http_status
from fastapi_derive_responses import AutoDeriveResponsesAPIRoute

from src.api.auth.dependencies import require_admin
from src.api.repositories.dependencies import (
    get_application_repository,
    get_post_interview_repository,
)
from src.db.models import User
from src.db.repositories import ApplicationRepository, PostInterviewResultRepository
from src.schemas import PreInterviewResponse
from src.schemas.post_interview import PostInterviewResultResponse

router = APIRouter(prefix="/postinterview", tags=["Post-interview results"], route_class=AutoDeriveResponsesAPIRoute)


@router.post("", status_code=http_status.HTTP_201_CREATED)
async def create_post_interview(
    is_recommended: bool,
    score: float,
    interview_summary: str,
    candidate_response: str,
    summary: str,
    application_id: int,
    post_interview_repository: PostInterviewResultRepository = Depends(get_post_interview_repository),
    _: User = Depends(require_admin),
) -> PostInterviewResultResponse:
    post_interview = await post_interview_repository.create_result(
        is_recommended=is_recommended,
        score=score,
        interview_summary=interview_summary,
        candidate_response=candidate_response,
        summary=summary,
        application_id=application_id,
    )

    return PostInterviewResultResponse.model_validate(post_interview)


@router.get("/for_application/{application_id}")
async def get_post_interview_for_application(
    application_id: int,
    application_repository: ApplicationRepository = Depends(get_application_repository),
    _: User = Depends(require_admin),
) -> PostInterviewResultResponse:
    application = await application_repository.get_application(application_id)
    if application is None:
        raise HTTPException(
            status_code=404, detail=f"Application {application_id} not found"
        )
    result = application.post_interview_result
    if result is None:
        raise HTTPException(404, f"Post interview assessment for application {application_id} not found")
    return PostInterviewResultResponse.model_validate(result)


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
    _: User = Depends(require_admin),
) -> PreInterviewResponse:
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
        raise HTTPException(404, "Invalid result_id")

    return PreInterviewResponse.model_validate(post_interview)


@router.get("/{result_id}")
async def get_post_interview(
    result_id: int,
    post_interview_repository: PostInterviewResultRepository = Depends(get_post_interview_repository),
    _: User = Depends(require_admin),
) -> PostInterviewResultResponse:
    post_interview = await post_interview_repository.get_result(result_id)

    if post_interview is None:
        raise HTTPException(404, "Invalid result_id")

    return PostInterviewResultResponse.model_validate(post_interview)


@router.delete("/{result_id}", status_code=http_status.HTTP_204_NO_CONTENT)
async def delete_post_interview(
    result_id: int,
    post_interview_repository: PostInterviewResultRepository = Depends(get_post_interview_repository),
    _: User = Depends(require_admin),
):
    post_interview = await post_interview_repository.delete_result(result_id)

    if post_interview is None:
        raise HTTPException(404, "Invalid result_id")

    return Response(status_code=http_status.HTTP_204_NO_CONTENT)
