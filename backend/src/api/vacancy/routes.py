from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi import status as http_status
from fastapi_derive_responses import AutoDeriveResponsesAPIRoute

from src.api.auth.dependencies import get_current_user, require_admin
from src.api.repositories.dependencies import get_vacancy_repository
from src.db.models import User
from src.db.repositories import VacancyRepository
from src.schemas import VacancyCreateRequest, VacancyEditRequest, VacancyResponse

router = APIRouter(prefix="/vacancy", tags=["Vacancy"], route_class=AutoDeriveResponsesAPIRoute)


@router.post("", status_code=http_status.HTTP_201_CREATED)
async def create_vacancy(
    request: VacancyCreateRequest,
    user: User = Depends(require_admin),
    vacancy_repository: VacancyRepository = Depends(get_vacancy_repository)
) -> VacancyResponse:
    vacancy = await vacancy_repository.create_vacancy(
        request.name,
        request.description,
        request.salary,
        request.city,
        request.weekly_hours_occupancy,
        request.required_experience,
        request.open_time,
        request.close_time,
        request.is_active,
        user.id,
    )

    return VacancyResponse.model_validate(vacancy)


@router.get("/{vacancy_id}")
async def get_vacancy(
    vacancy_id: int,
    _: User = Depends(get_current_user),
    vacancy_repository: VacancyRepository = Depends(get_vacancy_repository)
) -> VacancyResponse:
    vacancy = await vacancy_repository.get_vacancy(vacancy_id)
    if vacancy is None:
      raise HTTPException(404, "Vacancy not found")

    return VacancyResponse.model_validate(vacancy)


@router.patch("/{vacancy_id}")
async def edit_vacancy(
    vacancy_id: int,
    request: VacancyEditRequest,
    _: User = Depends(require_admin),
    vacancy_repository: VacancyRepository = Depends(get_vacancy_repository)
) -> VacancyResponse:
    vacancy = await vacancy_repository.edit_vacancy(
        vacancy_id=vacancy_id,
        name=request.name,
        description=request.description,
        salary=request.salary,
        city=request.city,
        required_experience=request.required_experience,
        weekly_hours_occupancy=request.weekly_hours_occupancy,
        open_time=request.open_time,
        close_time=request.close_time,
        is_active=request.is_active,
        user_id=request.user_id,
    )

    if vacancy is None:
       raise HTTPException(404, "Vacancy not found")
    
    return VacancyResponse.model_validate(vacancy)


@router.delete("/{vacancy_id}", status_code=http_status.HTTP_204_NO_CONTENT)
async def delete_vacancy(
    vacancy_id: int,
    _: User = Depends(require_admin),
    vacancy_repository: VacancyRepository = Depends(get_vacancy_repository)
):
    vacancy = await vacancy_repository.delete_vacancy(vacancy_id)
    if vacancy is None:
       raise HTTPException(404, "Vacancy not found")
    
    return Response(status_code=http_status.HTTP_204_NO_CONTENT)
