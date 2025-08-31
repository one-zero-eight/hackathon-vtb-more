from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from passlib.context import CryptContext

from src.api.auth.dependecies import get_current_user
from src.api.auth.util import create_access_token
from src.db.models import User
from src.db.repositories import user_repository
from src.schemas import LoginRequest, RegisterRequest, TokenResponse, UserResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(payload: RegisterRequest) -> UserResponse:
    existing = await user_repository.get_user_by_email(str(payload.email))
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already in use")

    hashed = pwd_context.hash(payload.password)
    user = await user_repository.create_user(
        name=payload.name,
        email=str(payload.email),
        hashed_password=hashed,
        is_admin=payload.is_admin,
    )
    return UserResponse.model_validate(user)


@router.post("/token", response_model=TokenResponse)
async def login(credentials: LoginRequest) -> TokenResponse:
    user = await user_repository.get_user_by_email(credentials.email)
    if not user or not pwd_context.verify(credentials.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    token = create_access_token({"sub": str(user.id)})
    return TokenResponse(access_token=token)


@router.get("/me", response_model=UserResponse)
async def read_me(current_user: Annotated[User, Depends(get_current_user)]) -> UserResponse:
    return UserResponse.model_validate(current_user)
