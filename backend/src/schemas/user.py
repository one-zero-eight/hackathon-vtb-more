from pydantic import ConfigDict

from src.schemas.pydantic_base import BaseSchema


class UserCreate(BaseSchema):
    name: str
    email: str
    password: str
    is_admin: bool = False


class UserResponse(BaseSchema):
    id: int
    name: str
    email: str
    is_admin: bool

    model_config = ConfigDict(from_attributes=True)
