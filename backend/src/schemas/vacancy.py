import datetime

from pydantic import ConfigDict

from src.schemas.pydantic_base import BaseSchema


class VacancyResponse(BaseSchema):
    id: int

    name: str
    description: str
    salary: float | None
    city: str
    weekly_hours_occupancy: int
    required_experience: int  # required experience in years

    open_time: datetime.datetime
    close_time: datetime.datetime

    is_active: bool

    user_id: int
    
    model_config = ConfigDict(from_attributes=True)