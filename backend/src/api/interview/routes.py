from fastapi import APIRouter
from fastapi.params import Depends
from fastapi_derive_responses import AutoDeriveResponsesAPIRoute
from openai.types.realtime import ClientSecretCreateResponse
from openai.types.realtime.client_secret_create_params import (
    ExpiresAfter,
    RealtimeSessionCreateRequestParam,
)

from src.api.auth.dependencies import get_current_user
from src.api.repositories.dependencies import get_application_repository
from src.db.models import User
from src.db.repositories import ApplicationRepository
from src.services.ai.openai_client import async_client
from src.services.ai.prompt_builder import build_realtime_prompt

router = APIRouter(prefix="/interview", tags=["Interview"], route_class=AutoDeriveResponsesAPIRoute)


@router.get("/session")
async def get_ephemeral_session(
    application_id: int,
    _: User = Depends(get_current_user),
    application_repository: ApplicationRepository = Depends(get_application_repository),
) -> ClientSecretCreateResponse:
    application = await application_repository.get_application(application_id)
    system_prompt = build_realtime_prompt(application)

    session = await async_client.realtime.client_secrets.create(
        expires_after=ExpiresAfter(
            anchor="created_at",
            seconds=7200,
        ),
        session=RealtimeSessionCreateRequestParam(
            type="realtime",
            model="gpt-realtime",
            instructions=system_prompt,
        ),
    )

    return session
