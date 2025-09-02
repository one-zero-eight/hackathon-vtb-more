<<<<<<< HEAD
from src.schemas.pydantic_base import BaseSchema
from pydantic import ConfigDict, BaseModel
=======
>>>>>>> c7cbbd0774c22d899eead0d0ac1bd08548213ebb
import datetime
from typing import Optional

class VacancyCreateRequest(BaseModel):
    name: str
    description: str
    salary: Optional[float] = None
    city: str
    weekly_hours_occupancy: int
    required_experience: int
    open_time: datetime.datetime = datetime.datetime.now()
    close_time: datetime.datetime = datetime.datetime.now() + datetime.timedelta(days=7)
    is_active: bool = True

from pydantic import BaseModel
from typing import Optional

class VacancyEditRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    salary: Optional[float] = None
    city: Optional[str] = None
    weekly_hours_occupancy: Optional[int] = None
    required_experience: Optional[int] = None
    open_time: Optional[datetime.datetime] = None
    close_time: Optional[datetime.datetime] = None
    is_active: Optional[bool] = None

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