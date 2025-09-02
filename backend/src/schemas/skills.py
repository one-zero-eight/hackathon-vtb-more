from pydantic import ConfigDict

from src.schemas.pydantic_base import BaseSchema


class SkillsResponse(BaseSchema):
    id: int
    weight: float
    details: str
    skill_type_id: int
    vacancy_id: int

    model_config = ConfigDict(from_attributes=True)


class SkillTypeCreateRequest(BaseSchema):
    name: str


class SkillTypeUpdateRequest(BaseSchema):
    id: int | None = None
    name: str | None = None


class SkillTypeResponse(BaseSchema):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)
