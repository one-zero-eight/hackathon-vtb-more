from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from fastapi import status as http_status
from fastapi import Request

from src.api.application.pre_interview_check import check_application
from src.api.application.util import save_upload_to_path
from src.api.auth.dependencies import get_current_user, require_admin
from src.api.repositories.dependencies import get_skill_repository, get_skill_type_repository
from src.config import api_settings
from src.db.models import SkillType, Skill, User
from src.db.repositories import SkillRepository, SkillTypeRepository
from src.schemas import SkillsResponse, SkillTypeResponse

router = APIRouter(prefix="/skills", tags=["Skills"])


# Skills
@router.post(
    "/create-skill",
    response_model=SkillsResponse,
    status_code=http_status.HTTP_201_CREATED,
)
async def create_skill(
    weight: float,
    details: str,
    skill_type_id: int,
    vacancy_id: int,
    skills_repository: SkillRepository = Depends(get_skill_repository),
    # user: User = Depends(require_admin)
):
    skill = await skills_repository.create_skill(
        weight, 
        details,
        skill_type_id,
        vacancy_id,
    )

    return SkillsResponse.model_validate(skill)

@router.patch("/edit-skill", response_model=SkillsResponse)
async def edit_skill(
    skill_id: int,
    weight: float | None = None,
    details: str | None = None,
    skill_type_id: int | None = None,
    vacancy_id: int | None = None,
    skills_repository: SkillRepository = Depends(get_skill_repository),
    # user: User = Depends(require_admin)
):
    skill = await skills_repository.edit_skill(skill_id, weight, details, skill_type_id, vacancy_id)
    if skill is None:
        raise HTTPException(404, "Invalid skill_id")

    return SkillsResponse.model_validate(skill)

@router.delete("/delete-skill", response_model=SkillsResponse)
async def delete_skill(
    skill_id: int,
    skills_repository: SkillRepository = Depends(get_skill_repository),
    # user: User = Depends(require_admin)
):
    skill = await skills_repository.delete_skill(skill_id)
    if skill is None:
        raise HTTPException(404, "Invalid skill_id")
        
    return SkillsResponse.model_validate(skill)



# Skill Types

@router.post(
    "/create-type",
    response_model=SkillTypeResponse,
    status_code=http_status.HTTP_201_CREATED
)
async def create_skilltype(
    name: str, 
    skillType_repository: SkillTypeRepository = Depends(get_skill_type_repository),
    #user: User = Depends(require_admin)
):
    skillType = await skillType_repository.create_skill_type(name)

    return SkillTypeResponse.model_validate(skillType)


@router.patch("/edit-type", response_model=SkillTypeResponse)
async def edit_skilltype(
    skill_type_id: int,
    name: str, 
    skillType_repository: SkillTypeRepository = Depends(get_skill_type_repository),
    # user: User = Depends(require_admin)
):
    skillType = await skillType_repository.edit_skill_type(skill_type_id, name)
    if skillType is None:
        raise HTTPException(404, "Invalid skill_type_id")

    return SkillTypeResponse.model_validate(skillType)

@router.delete("/delete-type", response_model=SkillTypeResponse)
async def delete_skilltype(
    skill_type_id: int,
    skillType_repository: SkillTypeRepository = Depends(get_skill_type_repository),
    # user: User = Depends(require_admin)
):
    skillType = await skillType_repository.delete_skill_type(skill_type_id)
    if skillType is None:
        raise HTTPException(404, "Invalid skill_type_id")

    return SkillTypeResponse.model_validate(skillType)
