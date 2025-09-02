from fastapi import APIRouter, Depends, HTTPException
from fastapi import status as http_status

from src.api.auth.dependencies import require_admin
from src.api.repositories.dependencies import get_vacancy_repository
from src.db.models import User
from src.db.repositories import VacancyRepository
from src.schemas import VacancyResponse
import datetime
import time

# create, get, delete, edit

router = APIRouter(prefix="/vacancy", tags=["Vacancy"])

@router.post(
    "/create",
    response_model=VacancyResponse,
    status_code=http_status.HTTP_201_CREATED,
)
async def create_vacancy(
    name: str, 
    description: str, 
    salary: float | None, 
    city: str, 
    required_experience: int,
    
    open_time: datetime.datetime = datetime.datetime.now(),
    close_time: datetime.datetime = (datetime.datetime.now() + datetime.timedelta(days=14)), # change to the predicted time later
    is_active: bool = True, 
    user: User = Depends(require_admin),
    vacancy_repository: VacancyRepository = Depends(get_vacancy_repository)
):
   vacancy = await vacancy_repository.create_vacancy(
      name,
      description,
      salary,
      city,
      required_experience,
      open_time,
      close_time,
      is_active,
      user.id
   )
   
   return VacancyResponse.model_validate(vacancy)