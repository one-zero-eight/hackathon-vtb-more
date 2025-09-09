from fastapi import APIRouter
from fastapi.params import Depends
from fastapi_derive_responses import AutoDeriveResponsesAPIRoute
from openai.types.realtime import ClientSecretCreateResponse, RealtimeAudioConfigParam
from openai.types.realtime.client_secret_create_params import (
    ExpiresAfter,
    RealtimeSessionCreateRequestParam,
)
from openai.types.realtime.realtime_audio_config_param import Input, InputTranscription

from src.api.auth.dependencies import get_current_user
from src.api.repositories.dependencies import (
    get_application_repository,
    get_interview_message_repository,
    get_post_interview_repository,
)
from src.config import open_ai_realtime_settings
from src.db.models import User
from src.db.repositories import (
    ApplicationRepository,
    InterviewMessageRepository,
    PostInterviewResultRepository,
)
from src.schemas import InterviewHistoryRequest, InterviewMessageResponse, Status
from src.services.ai.assessor import post_interview_assessment
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
            model=open_ai_realtime_settings.model,
            instructions=system_prompt,
            audio=RealtimeAudioConfigParam(
                input=Input(
                    transcription=InputTranscription(
                        language=open_ai_realtime_settings.language,
                        model=open_ai_realtime_settings.transcription_model,
                    )
                )
            ),
        ),
    )

    return session


@router.post("/message_history")
async def upload_message_history(
    data: InterviewHistoryRequest,
    _: User = Depends(get_current_user),
    message_repository: InterviewMessageRepository = Depends(get_interview_message_repository),
    post_interview_repository: PostInterviewResultRepository = Depends(get_post_interview_repository),
    application_repository: ApplicationRepository = Depends(get_application_repository),
) -> list[InterviewMessageResponse]:
    created_messages = []
    application = await application_repository.get_application(data.application_id)
    vacancy = await application_repository.get_applications_vacancy(application.vacancy_id)
    pre_interview = await application_repository.get_applications_pre_interview(application.id)

    for msg in data.messages:
        created_message = await message_repository.create_message(
            role=msg.role,
            message=msg.message,
            application_id=data.application_id,
        )
        created_messages.append(created_message)

    post_interview_res = await post_interview_assessment(
        application=application,
        vacancy=vacancy,
        transcript=created_messages,
        pre_interview_result=pre_interview,
        repository=post_interview_repository,
    )
    if post_interview_res.is_recommended:
        await application_repository.edit_application(application.id, status=Status.APPROVED)
    else:
        await application_repository.edit_application(application.id, status=Status.REJECTED)

    return created_messages
