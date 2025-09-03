from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi import status as http_status
from fastapi_derive_responses import AutoDeriveResponsesAPIRoute

from src.api.auth.dependencies import require_admin
from src.api.repositories.dependencies import get_skill_repository, get_skill_type_repository
from src.db.models import User
from src.db.repositories import SkillRepository, SkillTypeRepository
from src.schemas import SkillsResponse, SkillTypeCreateRequest, SkillTypeResponse, SkillTypeUpdateRequest

skills_router = APIRouter(prefix="/skills", tags=["Skills"], route_class=AutoDeriveResponsesAPIRoute)


@skills_router.post("", status_code=http_status.HTTP_201_CREATED)
async def create_skill(
    weight: float,
    details: str,
    skill_type_id: int,
    vacancy_id: int,
    skills_repository: SkillRepository = Depends(get_skill_repository),
    _: User = Depends(require_admin),
) -> SkillsResponse:
    skill = await skills_repository.create_skill(
        weight=weight,
        details=details,
        skill_type_id=skill_type_id,
        vacancy_id=vacancy_id,
    )

    return SkillsResponse.model_validate(skill)


@skills_router.get("/{skill_id}")
async def get_skill(
    skill_id: int,
    skills_repository: SkillRepository = Depends(get_skill_repository),
    _: User = Depends(require_admin),
) -> SkillsResponse:
    skill = await skills_repository.get_skill(skill_id)
    if not skill:
        raise HTTPException(404, "No such skill")
        
    return SkillsResponse.model_validate(skill)


@skills_router.patch("/{skill_id}")
async def edit_skill(
    skill_id: int,
    weight: float | None = None,
    details: str | None = None,
    skill_type_id: int | None = None,
    vacancy_id: int | None = None,
    skills_repository: SkillRepository = Depends(get_skill_repository),
    _: User = Depends(require_admin),
) -> SkillsResponse:
    skill = await skills_repository.edit_skill(
        skill_id=skill_id,
        weight=weight,
        details=details,
        skill_type_id=skill_type_id,
        vacancy_id=vacancy_id,
    )
    if skill is None:
        raise HTTPException(404, "Invalid skill_id")

    return SkillsResponse.model_validate(skill)


@skills_router.delete("/{skill_id}", status_code=http_status.HTTP_204_NO_CONTENT)
async def delete_skill(
    skill_id: int,
    skills_repository: SkillRepository = Depends(get_skill_repository),
    _: User = Depends(require_admin),
):
    skill = await skills_repository.delete_skill(skill_id)
    if skill is None:
        raise HTTPException(404, "Invalid skill_id")
        
    return Response(status_code=http_status.HTTP_204_NO_CONTENT)


skills_type_router = APIRouter(prefix="/skills_type", tags=["Skills Type"], route_class=AutoDeriveResponsesAPIRoute)


@skills_type_router.post("", status_code=http_status.HTTP_201_CREATED)
async def create_skill_type(
    data: SkillTypeCreateRequest,
    skill_type_repository: SkillTypeRepository = Depends(get_skill_type_repository),
    _: User = Depends(require_admin),
) -> SkillTypeResponse:
    skill_type = await skill_type_repository.create_skill_type(data.name)

    return SkillTypeResponse.model_validate(skill_type)


@skills_type_router.get("/{skill_id}")
async def get_skill_type(
    skill_id: int,
    skills_repository: SkillTypeRepository = Depends(get_skill_type_repository),
    _: User = Depends(require_admin),
) -> SkillsResponse:
    skill_type = await skills_repository.get_skill_type(skill_id)
    if not skill_type:
        raise HTTPException(404, "No such skill type")
        
    return SkillsResponse.model_validate(skill_type)


@skills_type_router.patch("")
async def edit_skill_type(
    data: SkillTypeUpdateRequest,
    skill_type_repository: SkillTypeRepository = Depends(get_skill_type_repository),
    _: User = Depends(require_admin),
) -> SkillTypeResponse:
    skill_type = await skill_type_repository.edit_skill_type(data.id, data.name)
    if skill_type is None:
        raise HTTPException(404, "Invalid skill_type_id")

    return SkillTypeResponse.model_validate(skill_type)


@skills_type_router.delete("/{skill_type_id}", status_code=http_status.HTTP_204_NO_CONTENT)
async def delete_skill_type(
    skill_type_id: int,
    skill_type_repository: SkillTypeRepository = Depends(get_skill_type_repository),
    _: User = Depends(require_admin),
):
    skill_type = await skill_type_repository.delete_skill_type(skill_type_id)
    if skill_type is None:
        raise HTTPException(404, "Invalid skill_type_id")

    return Response(status_code=http_status.HTTP_204_NO_CONTENT)
