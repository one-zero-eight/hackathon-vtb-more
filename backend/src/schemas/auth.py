from pydantic import ConfigDict, EmailStr

from src.schemas.pydantic_base import BaseSchema


class TokenResponse(BaseSchema):
    access_token: str
    token_type: str = "bearer"

    model_config = ConfigDict(from_attributes=True)


class TokenPayload(BaseSchema):
    sub: int  # user id
    exp: int | None = None  # optional expiration


class RegisterRequest(BaseSchema):
    name: str
    email: EmailStr
    password: str
    is_admin: bool = True


class LoginRequest(BaseSchema):
    email: EmailStr
    password: str
