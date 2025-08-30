from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from src.api.auth.util import decode_token
from src.db.models import User
from src.db.repositories import user_repository

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]) -> User:
    """Get current user from JWT token."""
    token_data = decode_token(token)
    user = await user_repository.get_user(token_data.sub)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


async def require_admin(current_user: Annotated[User, Depends(get_current_user)]) -> User:
    """Require admin privileges."""
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin only")
    return current_user
