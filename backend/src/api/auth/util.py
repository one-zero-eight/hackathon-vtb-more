from datetime import UTC, datetime, timedelta

from fastapi import HTTPException, status
from jose import JWTError, jwt

from src.config import api_settings
from src.schemas.auth import TokenPayload


def decode_token(token: str) -> TokenPayload:
    try:
        payload = jwt.decode(token, api_settings.secret_key.get_secret_value(), algorithms=[api_settings.encryption_algorithm])
        sub = payload.get("sub")
        if sub is None:
            raise ValueError("Missing 'sub' in token")
        return TokenPayload(sub=int(sub), exp=payload.get("exp"))
    except (JWTError, ValueError, TypeError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(UTC) + (expires_delta or timedelta(minutes=api_settings.token_expiration_in_minutes))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, api_settings.secret_key.get_secret_value(), algorithm=api_settings.encryption_algorithm)
