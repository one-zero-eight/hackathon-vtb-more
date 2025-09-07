from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi import status as http_status
from fastapi_derive_responses import AutoDeriveResponsesAPIRoute

from src.api.auth.dependencies import require_admin
from src.api.repositories.dependencies import get_preinterview_repository
from src.db.models import User
from src.db.repositories import PreInterviewResultRepository
from src.schemas import PreInterviewResponse

router = APIRouter(prefix="/preinterview", tags=["Pre-interview results"], route_class=AutoDeriveResponsesAPIRoute)


@router.post("", status_code=http_status.HTTP_201_CREATED)
async def create_preinterview(
    is_recommended: bool,
    score: float,
    application_id: int,
    reason: str,
    preinterview_repository: PreInterviewResultRepository = Depends(get_preinterview_repository),
    _: User = Depends(require_admin),
) -> PreInterviewResponse:
    preinterview = await preinterview_repository.create_result(
        is_recommended=is_recommended,
        score=score,
        application_id=application_id,
        reason=reason,
    )

    return PreInterviewResponse.model_validate(preinterview)


@router.get("/{result_id}")
async def get_preinterview(
    result_id: int,
    preinterview_repository: PreInterviewResultRepository = Depends(get_preinterview_repository),
    _: User = Depends(require_admin),
) -> PreInterviewResponse:
    preinterview = await preinterview_repository.get_result(result_id)

    if preinterview is None:
        raise HTTPException(404, "Invalid result_id")

    return PreInterviewResponse.model_validate(preinterview)


@router.patch("/{result_id}")
async def edit_preinterview(
    result_id: int,
    is_recommended: bool | None = None,
    score: float | None = None,
    application_id: int | None = None,
    preinterview_repository: PreInterviewResultRepository = Depends(get_preinterview_repository),
    _: User = Depends(require_admin),
) -> PreInterviewResponse:
    preinterview = await preinterview_repository.edit_result(
        result_id=result_id, is_recommended=is_recommended, score=score, application_id=application_id
    )

    if preinterview is None:
        raise HTTPException(404, "Invalid result_id")

    return PreInterviewResponse.model_validate(preinterview)


@router.delete("/{result_id}", status_code=http_status.HTTP_204_NO_CONTENT)
async def delete_preinterview(
    result_id: int,
    preinterview_repository: PreInterviewResultRepository = Depends(get_preinterview_repository),
    _: User = Depends(require_admin),
):
    preinterview = await preinterview_repository.delete_result(result_id)

    if preinterview is None:
        raise HTTPException(404, "Invalid result_id")

    return Response(status_code=http_status.HTTP_204_NO_CONTENT)
