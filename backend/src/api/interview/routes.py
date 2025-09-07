from fastapi import APIRouter
from fastapi_derive_responses import AutoDeriveResponsesAPIRoute
from openai.types.realtime import ClientSecretCreateResponse
from openai.types.realtime.client_secret_create_params import (
    ExpiresAfter,
    RealtimeSessionCreateRequestParam,
)

from src.services.ai.openai_client import async_client

router = APIRouter(prefix="/interview", tags=["Interview"], route_class=AutoDeriveResponsesAPIRoute)


@router.get("/session")
async def get_ephemeral_session() -> ClientSecretCreateResponse:

    session = await async_client.realtime.client_secrets.create(
        expires_after=ExpiresAfter(
            anchor="created_at",
            seconds=7200,
        ),
        session=RealtimeSessionCreateRequestParam(
            type="realtime",
            model="gpt-realtime",
        ),
    )

    return session
