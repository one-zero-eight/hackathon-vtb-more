import datetime

from pydantic import ConfigDict

from src.schemas.pydantic_base import BaseSchema
from src.schemas.skills import SkillCreateRequestNoId, SkillResponse


class VacancyCreateRequest(BaseSchema):
    name: str
    description: str
    salary: float | None = None
    city: str
    weekly_hours_occupancy: int
    required_experience: int

    open_time: datetime.datetime = datetime.datetime.now(tz=datetime.UTC)
    close_time: datetime.datetime | None = None

    is_active: bool = True


class VacancyWithSkillsCreateRequest(BaseSchema):
    vacancy: VacancyCreateRequest
    skills: list[SkillCreateRequestNoId]


class VacancyEditRequest(BaseSchema):
    name: str | None = None
    description: str | None = None
    salary: float | None = None
    city: str | None = None
    weekly_hours_occupancy: int | None = None
    required_experience: int | None = None

    open_time: datetime.datetime | None = None
    close_time: datetime.datetime | None = None

    is_active: bool | None = None
    user_id: int | None = None


class VacancyResponse(BaseSchema):
    id: int

    name: str
    description: str
    salary: float | None
    city: str
    weekly_hours_occupancy: int
    required_experience: int  # required experience in years

    open_time: datetime.datetime
    close_time: datetime.datetime | None

    is_active: bool
    user_id: int

    model_config = ConfigDict(from_attributes=True)


class VacancyFromFile(BaseSchema):
    name : str | None = None
    description: str | None = None
    salary: float | None = None
    city: str | None = None
    weekly_hours_occupancy: int | None = None
    required_experience: int | None = None

    model_config = ConfigDict(from_attributes=True)


class VacancyWithSkillsResponse(BaseSchema):
    vacancy: VacancyResponse
    skills: list[SkillResponse]
