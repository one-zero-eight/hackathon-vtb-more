from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi import status as http_status
from fastapi_derive_responses import AutoDeriveResponsesAPIRoute

from src.api.auth.dependencies import require_admin
from src.api.repositories.dependencies import get_application_repository, get_pre_interview_repository
from src.db.models import User
from src.db.repositories import ApplicationRepository, PreInterviewResultRepository
from src.schemas import PreInterviewResponse

router = APIRouter(prefix="/preinterview", tags=["Pre-interview results"], route_class=AutoDeriveResponsesAPIRoute)


@router.post("", status_code=http_status.HTTP_201_CREATED)
async def create_pre_interview(
    is_recommended: bool,
    score: float,
    application_id: int,
    reason: str,
    pre_interview_repository: PreInterviewResultRepository = Depends(get_pre_interview_repository),
    application_repository: ApplicationRepository = Depends(get_application_repository),
    _: User = Depends(require_admin),
) -> PreInterviewResponse:
    application = await application_repository.get_application(application_id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    pre_interview = await pre_interview_repository.create_result(
        is_recommended=is_recommended,
        score=score,
        application_id=application_id,
        reason=reason,
    )

    return PreInterviewResponse.model_validate(pre_interview)


@router.get("/for_application/{application_id}")
async def get_pre_interview_for_application(
    application_id: int,
    application_repository: ApplicationRepository = Depends(get_application_repository),
    _: User = Depends(require_admin),
) -> PreInterviewResponse:
    application = await application_repository.get_application(application_id)
    if application is None:
        raise HTTPException(
            status_code=404, detail=f"Application {application_id} not found"
        )
    result = application.pre_interview_result
    if result is None:
        raise HTTPException(404, f"Pre interview assessment for application {application_id} not found")
    return PreInterviewResponse.model_validate(result)


@router.patch("/{result_id}")
async def edit_pre_interview(
    result_id: int,
    is_recommended: bool | None = None,
    score: float | None = None,
    application_id: int | None = None,
    pre_interview_repository: PreInterviewResultRepository = Depends(get_pre_interview_repository),
    application_repository: ApplicationRepository = Depends(get_application_repository),
    _: User = Depends(require_admin),
) -> PreInterviewResponse:
    pre_interview = await pre_interview_repository.edit_result(
        result_id=result_id, is_recommended=is_recommended, score=score, application_id=application_id,
    )
    if pre_interview is None:
        raise HTTPException(404, "Invalid result_id")

    application = await application_repository.get_application(application_id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    return PreInterviewResponse.model_validate(pre_interview)


@router.get("/{result_id}")
async def get_pre_interview(
    result_id: int,
    pre_interview_repository: PreInterviewResultRepository = Depends(get_pre_interview_repository),
    _: User = Depends(require_admin),
) -> PreInterviewResponse:
    pre_interview = await pre_interview_repository.get_result(result_id)

    if pre_interview is None:
        raise HTTPException(404, "Invalid result_id")

    return PreInterviewResponse.model_validate(pre_interview)


@router.delete("/{result_id}", status_code=http_status.HTTP_204_NO_CONTENT)
async def delete_pre_interview(
    result_id: int,
    pre_interview_repository: PreInterviewResultRepository = Depends(get_pre_interview_repository),
    _: User = Depends(require_admin),
):
    pre_interview = await pre_interview_repository.delete_result(result_id)

    if pre_interview is None:
        raise HTTPException(404, "Invalid result_id")

    return Response(status_code=http_status.HTTP_204_NO_CONTENT)
