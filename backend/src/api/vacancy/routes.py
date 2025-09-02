import datetime

from fastapi import APIRouter, Depends
from fastapi import status as http_status

from src.api.auth.dependencies import require_admin, get_current_user
from src.api.repositories.dependencies import get_vacancy_repository
from src.db.models import User
from src.db.repositories import VacancyRepository
<<<<<<< HEAD
from src.schemas import VacancyResponse, VacancyCreateRequest, VacancyEditRequest
=======
from src.schemas import VacancyResponse

# create, get, delete, edit
>>>>>>> c7cbbd0774c22d899eead0d0ac1bd08548213ebb

router = APIRouter(prefix="/vacancy", tags=["Vacancy"])

@router.post(
    "/create",
    response_model=VacancyResponse,
    status_code=http_status.HTTP_201_CREATED,
)
async def create_vacancy(
    request: VacancyCreateRequest,
    user: User = Depends(require_admin),
    vacancy_repository: VacancyRepository = Depends(get_vacancy_repository)
):

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
      user.id
   )
   
   return VacancyResponse.model_validate(vacancy)

@router.get(
    "/{vacancy_id}",
    response_model=VacancyResponse,
)
async def get_vacancy(
    vacancy_id: int,
    user: User = Depends(get_current_user),
    vacancy_repository: VacancyRepository = Depends(get_vacancy_repository)
):
   vacancy = await vacancy_repository.get_vacancy(vacancy_id)
   if vacancy is None:
      raise HTTPException(404, "Vacancy not found")
   
   return VacancyResponse.model_validate(vacancy)


@router.patch(
   "/{vacancy_id}",
    response_model=VacancyResponse
)
async def edit_vacancy(
    vacancy_id: int,
    request: VacancyEditRequest,
    user: User = Depends(require_admin),
    vacancy_repository: VacancyRepository = Depends(get_vacancy_repository)
):
    vacancy = await vacancy_repository.edit_vacancy(
        vacancy_id,
        request.name,
        request.description,
        request.salary,
        request.city,
        request.required_experience,
        request.weekly_hours_occupancy,
        request.open_time, 
        request.close_time,
        request.is_active,
        user.id
        )
    if vacancy is None:
       raise HTTPException(404, "Vacancy not found")
    
    return VacancyResponse.model_validate(vacancy)

@router.delete(
   "/{vacancy_id}",
   response_model=VacancyResponse
)
async def delete_vacancy(
    vacancy_id: int,
    user: User = Depends(require_admin),
    vacancy_repository: VacancyRepository = Depends(get_vacancy_repository)
):
    vacancy = await vacancy_repository.delete_vacancy(vacancy_id)
    if vacancy is None:
       raise HTTPException(404, "Vacancy not found")
    
    return VacancyResponse.model_validate(vacancy)
