from typing import Literal, Self

from pydantic import ConfigDict, Field, model_validator

from src.schemas.pydantic_base import BaseSchema


class PreInterviewResponse(BaseSchema):
    id: int
    is_recommended: bool
    score: float
    reason: str | None
    application_id: int

    model_config = ConfigDict(from_attributes=True)


class PreInterviewAIStructure(BaseSchema):
    is_recommended: bool
    score: float = Field(description="float between 0.0–1.0")
    reason: str = Field(description="Justification of assigned is_recommended and score values")

    @model_validator(mode="after")
    def validate_score(self) -> Self:
        if self.score < 0 or self.score > 1:
            raise ValueError("Score must be between 0 and 1")
        return self


class InterviewMessage(BaseSchema):
    role: Literal['user', 'assistant']
    message: str


class InterviewHistoryRequest(BaseSchema):
    application_id: int
    messages: list[InterviewMessage]
