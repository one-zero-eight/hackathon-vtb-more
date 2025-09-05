from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi import status as http_status
from fastapi_derive_responses import AutoDeriveResponsesAPIRoute
from passlib.context import CryptContext

from src.api.auth.dependencies import get_current_user, require_admin
from src.api.repositories.dependencies import get_user_repository
from src.db.models import User
from src.db.repositories import UserRepository
from src.schemas import RegisterRequest, UserCreate, UserResponse

router = APIRouter(prefix="/users", tags=["Users"], route_class=AutoDeriveResponsesAPIRoute)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.post("", status_code=http_status.HTTP_201_CREATED)
async def create_user(
    payload: UserCreate,
    _: User = Depends(require_admin),
    user_repository: UserRepository = Depends(get_user_repository),
) -> UserResponse:
    existing = await user_repository.get_user_by_email(str(payload.email))
    if existing:
        raise HTTPException(status_code=409, detail="Email already in use")

    hashed = pwd_context.hash(payload.password)
    user = await user_repository.create_user(
        name=payload.name,
        email=str(payload.email),
        hashed_password=hashed,
        is_admin=payload.is_admin,
    )
    return UserResponse.model_validate(user)


@router.get("")
async def list_users(
    _: User = Depends(require_admin),
    user_repository: UserRepository = Depends(get_user_repository),
) -> list[UserResponse]:
    users = await user_repository.list_users()
    return [UserResponse.model_validate(user) for user in users]


@router.post("", status_code=http_status.HTTP_201_CREATED)
async def register(
    payload: RegisterRequest, user_repository: UserRepository = Depends(get_user_repository)
) -> UserResponse:
    existing = await user_repository.get_user_by_email(str(payload.email))
    if existing:
        raise HTTPException(status_code=409, detail="Email already in use")

    hashed = pwd_context.hash(payload.password)
    user = await user_repository.create_user(
        name=payload.name,
        email=str(payload.email),
        hashed_password=hashed,
        is_admin=payload.is_admin,
    )
    return UserResponse.model_validate(user)


@router.get("/{user_id}")
async def get_user_endpoint(
    user_id: int,
    current_user: User = Depends(get_current_user),
    user_repository: UserRepository = Depends(get_user_repository),
) -> UserResponse:
    user = await user_repository.get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="No such user")
    if current_user.id != user_id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Forbidden")
    return UserResponse.model_validate(user)


@router.patch("/{user_id}")
async def edit_user_endpoint(
    user_id: int,
    name: str | None = None,
    email: str | None = None,
    password: str | None = None,
    is_admin: bool | None = None,
    current_user: User = Depends(get_current_user),
    user_repository: UserRepository = Depends(get_user_repository),
) -> UserResponse:
    if current_user.id != user_id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Forbidden")

    update_kwargs: dict = {}
    if name is not None:
        update_kwargs["name"] = name
    if email is not None:
        update_kwargs["email"] = email
    if password is not None:
        update_kwargs["hashed_password"] = pwd_context.hash(password)
    if is_admin is not None:
        if not current_user.is_admin:
            raise HTTPException(status_code=403, detail="Only admins can change admin flag")
        update_kwargs["is_admin"] = is_admin

    if not update_kwargs:
        raise HTTPException(status_code=400, detail="No changes provided")

    edited = await user_repository.edit_user(user_id, **update_kwargs)
    if edited is None:
        raise HTTPException(status_code=404, detail="No such user")
    return UserResponse.model_validate(edited)


@router.delete("/{user_id}", status_code=http_status.HTTP_204_NO_CONTENT)
async def delete_user_endpoint(
    user_id: int,
    _: User = Depends(require_admin),
    user_repository: UserRepository = Depends(get_user_repository),
):
    deleted = await user_repository.delete_user(user_id)
    if deleted is None:
        raise HTTPException(status_code=404, detail="No such user")

    return Response(status_code=http_status.HTTP_204_NO_CONTENT)
