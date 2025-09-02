from pydantic import ConfigDict

from src.schemas.pydantic_base import BaseSchema

class PreInterviewResponse(BaseSchema):
    id: int
    is_recommended: bool
    score: float
    application_id: int

    model_config = ConfigDict(from_attributes=True)