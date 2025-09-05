from pydantic import ConfigDict, model_validator

from src.schemas.pydantic_base import BaseSchema


class PreInterviewResponse(BaseSchema):
    id: int
    is_recommended: bool
    score: float
    application_id: int

    model_config = ConfigDict(from_attributes=True)


class PreInterviewAIStructure(BaseSchema):
    is_recommended: bool
    score: float  # float between 0.0–1.0

    @model_validator(mode='after')
    def validate_score(self):
        if self.score < 0 or self.score > 1:
            raise ValueError("Score must be between 0 and 1")
