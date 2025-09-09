from typing import Self

from pydantic import ConfigDict, Field, model_validator

from src.schemas.pydantic_base import BaseSchema


class SkillResponse(BaseSchema):
    id: int
    weight: float
    details: str
    skill_type_id: int
    vacancy_id: int

    model_config = ConfigDict(from_attributes=True)


class SkillCreateRequest(BaseSchema):
    weight: float
    details: str
    skill_type_id: int
    vacancy_id: int


class SkillCreateRequestNoId(BaseSchema):
    weight: float
    details: str
    skill_type_id: int


class SkillResultAIStructure(BaseSchema):
    skill_id: int = Field(description="exactly the ID of the skill being evaluated; do not invent new IDs.")
    weight: float = Field(description="exactly the same as weight of the skill being evaluated.")
    score: float = Field(description="float between 0.0–1.0")

    @model_validator(mode="after")
    def validate_score(self) -> Self:
        if self.score < 0 or self.score > 1:
            raise ValueError("Score must be between 0 and 1")
        return self


class SkillResultResponse(BaseSchema):
    id: int
    score: float
    weight: float # mirrors skill weight
    skill_id: int

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
