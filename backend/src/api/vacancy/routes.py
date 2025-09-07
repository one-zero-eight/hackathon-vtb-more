from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, Response, UploadFile
from fastapi import status as http_status
from fastapi_derive_responses import AutoDeriveResponsesAPIRoute

from src.api.auth.dependencies import get_current_user, require_admin
from src.api.repositories.dependencies import get_converting_repository, get_skill_repository, get_vacancy_repository
from src.api.utils import save_file_as_pdf
from src.db.models import User
from src.db.repositories import SkillRepository, VacancyRepository
from src.schemas import (
    SkillResponse,
    VacancyCreateRequest,
    VacancyEditRequest,
    VacancyFromFile,
    VacancyResponse,
    VacancyWithSkillsCreateRequest,
    VacancyWithSkillsResponse,
)
from src.services.ai.vacancy_filler import fill_vacancy_from_file
from src.services.converting import ConvertingRepository

router = APIRouter(prefix="/vacancy", tags=["Vacancy"], route_class=AutoDeriveResponsesAPIRoute)


@router.post("", status_code=http_status.HTTP_201_CREATED)
async def create_vacancy(
    request: VacancyCreateRequest,
    user: User = Depends(require_admin),
    vacancy_repository: VacancyRepository = Depends(get_vacancy_repository),
) -> VacancyResponse:
    if request.open_time is not None:
        request.open_time = request.open_time.replace(tzinfo=None)
    if request.close_time is not None:
        request.close_time = request.close_time.replace(tzinfo=None)

    vacancy = await vacancy_repository.create_vacancy(
        name=request.name,
        description=request.description,
        salary=request.salary,
        city=request.city,
        weekly_hours_occupancy=request.weekly_hours_occupancy,
        required_experience=request.required_experience,
        open_time=request.open_time,
        close_time=request.close_time,
        is_active=request.is_active,
        user_id=user.id,
    )

    return VacancyResponse.model_validate(vacancy)


@router.post("/with_skills")
async def create_vacancy_with_skills(
    request: VacancyWithSkillsCreateRequest,
    user: User = Depends(require_admin),
    vacancy_repository: VacancyRepository = Depends(get_vacancy_repository),
    skill_repository: SkillRepository = Depends(get_skill_repository),
) -> VacancyWithSkillsResponse:
    vacancy = await vacancy_repository.create_vacancy(
        name=request.vacancy.name,
        description=request.vacancy.description,
        salary=request.vacancy.salary,
        city=request.vacancy.city,
        weekly_hours_occupancy=request.vacancy.weekly_hours_occupancy,
        required_experience=request.vacancy.required_experience,
        open_time=request.vacancy.open_time,
        close_time=request.vacancy.close_time,
        is_active=request.vacancy.is_active,
        user_id=user.id,
    )

    skills = []
    for skill_request in request.skills:
        skill = await skill_repository.create_skill(
            weight=skill_request.weight,
            details=skill_request.details,
            skill_type_id=skill_request.skill_type_id,
            vacancy_id=vacancy.id,
        )
        skills.append(skill)

    return VacancyWithSkillsResponse(
        vacancy=VacancyResponse.model_validate(vacancy),
        skills=[SkillResponse.model_validate(skill) for skill in skills],
    )


@router.get("/with_skills")
async def get_all_vacancies_with_skills(
    _: User = Depends(get_current_user),
    vacancy_repository: VacancyRepository = Depends(get_vacancy_repository),
) -> list[VacancyWithSkillsResponse]:
    vacancies = await vacancy_repository.get_all_vacancies()

    results: list[VacancyWithSkillsResponse] = []
    for vacancy in vacancies:
        results.append(
            VacancyWithSkillsResponse(
                vacancy=VacancyResponse.model_validate(vacancy),
                skills=[SkillResponse.model_validate(skill) for skill in vacancy.skills],
            )
        )

    return results


@router.get("/{vacancy_id}")
async def get_vacancy(
    vacancy_id: int,
    _: User = Depends(get_current_user),
    vacancy_repository: VacancyRepository = Depends(get_vacancy_repository),
) -> VacancyResponse:
    vacancy = await vacancy_repository.get_vacancy(vacancy_id)
    if vacancy is None:
        raise HTTPException(404, "Vacancy not found")

    return VacancyResponse.model_validate(vacancy)


@router.get("/{vacancy_id}/with_skills")
async def get_vacancy_with_skills(
    vacancy_id: int,
    _: User = Depends(get_current_user),
    vacancy_repository: VacancyRepository = Depends(get_vacancy_repository),
) -> VacancyWithSkillsResponse:
    vacancy = await vacancy_repository.get_vacancy(vacancy_id)
    if vacancy is None:
        raise HTTPException(status_code=404, detail="Vacancy not found")

    return VacancyWithSkillsResponse(
        vacancy=VacancyResponse.model_validate(vacancy),
        skills=[SkillResponse.model_validate(skill) for skill in vacancy.skills],
    )


@router.get("")
async def get_all_vacancies(
    _: User = Depends(get_current_user),
    vacancy_repository: VacancyRepository = Depends(get_vacancy_repository),
) -> list[VacancyResponse]:
    vacancies = await vacancy_repository.get_all_vacancies()
    return [VacancyResponse.model_validate(vac) for vac in vacancies]


@router.post("/from_file")
async def get_vacancy_from_file(
    file: UploadFile = File(...),
    _: User = Depends(require_admin),
    converting_repository: ConvertingRepository = Depends(get_converting_repository),
) -> VacancyFromFile:
    dest_path: Path = await save_file_as_pdf(file, converting_repository)

    try:
        result = await fill_vacancy_from_file(filepath=dest_path)
        return result
    except Exception as e:
        # Bubble up as a 502 to signify upstream model/service failure
        raise HTTPException(status_code=502, detail=f"Vacancy extraction failed: {e}")
    finally:
        try:
            dest_path.unlink(missing_ok=True)
        except Exception:
            pass


@router.patch("/{vacancy_id}")
async def edit_vacancy(
    vacancy_id: int,
    request: VacancyEditRequest,
    _: User = Depends(require_admin),
    vacancy_repository: VacancyRepository = Depends(get_vacancy_repository),
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
    vacancy_repository: VacancyRepository = Depends(get_vacancy_repository),
):
    vacancy = await vacancy_repository.delete_vacancy(vacancy_id)
    if vacancy is None:
        raise HTTPException(404, "Vacancy not found")

    return Response(status_code=http_status.HTTP_204_NO_CONTENT)
