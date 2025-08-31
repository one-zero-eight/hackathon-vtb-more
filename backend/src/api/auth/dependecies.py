from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from src.api.auth.util import decode_token
from src.db.models import User
from src.db.repositories import user_repository

bearer_scheme = HTTPBearer(scheme_name="Bearer", auto_error=True)


async def get_current_user(creds: Annotated[HTTPAuthorizationCredentials, Depends(bearer_scheme)]) -> User:
    """Get current user from JWT token."""
    if creds.scheme.lower() != "bearer":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid auth scheme")

    token = creds.credentials
    user = await user_repository.get_user(decode_token(token).sub)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    return user


async def require_admin(current_user: Annotated[User, Depends(get_current_user)]) -> User:
    """Require admin privileges."""
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin only")
    return current_user
