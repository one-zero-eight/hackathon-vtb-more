from enum import StrEnum

from src.schemas.pydantic_base import BaseSchema
from src.services.pre_interview.github_eval import GithubStats


class Status(StrEnum):
    APPROVED = "approved"
    REJECTED = "rejected"
    APPROVED_FOR_INTERVIEW = "approved_for_interview"
    REJECTED_FOR_INTERVIEW = "rejected_for_interview"
    IN_INTERVIEW = "in_interview"
    PENDING = "pending"


class ApplicationResponse(BaseSchema):
    id: int
    cv: str
    profile_url: str | None
    status: str
    user_id: int
    vacancy_id: int
    github_stats: GithubStats | None = None

    model_config = dict(from_attributes=True)
