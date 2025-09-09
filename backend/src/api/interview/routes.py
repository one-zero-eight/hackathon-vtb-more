from fastapi import APIRouter, BackgroundTasks
from fastapi.params import Depends
from fastapi_derive_responses import AutoDeriveResponsesAPIRoute
from openai.types.realtime import ClientSecretCreateResponse, RealtimeAudioConfigParam
from openai.types.realtime.client_secret_create_params import (
    ExpiresAfter,
    RealtimeSessionCreateRequestParam,
)
from openai.types.realtime.realtime_audio_config_param import Input, InputTranscription

from src.api.auth.dependencies import get_current_user
from src.api.logging_ import logger
from src.api.repositories.dependencies import (
    get_application_repository,
    get_interview_message_repository,
    get_post_interview_repository,
)
from src.config import open_ai_realtime_settings
from src.db.models import InterviewMessage, User
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


async def _run_post_interview_and_update(
    application_id: int,
    vacancy_id: int,
    transcript: list[InterviewMessage],
    pre_interview,
    post_interview_repository: PostInterviewResultRepository,
    application_repository: ApplicationRepository,
):
    application = await application_repository.get_application(application_id)
    vacancy = await application_repository.get_applications_vacancy(vacancy_id)
    res = await post_interview_assessment(
        application=application,
        vacancy=vacancy,
        transcript=transcript,
        pre_interview_result=pre_interview,
        repository=post_interview_repository,
    )
    new_status = Status.APPROVED if res.is_recommended else Status.REJECTED
    await application_repository.edit_application(application_id, status=new_status)
    logger.info(f'Post-interview result for application {application_id} created')


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
    background_tasks: BackgroundTasks,
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

    background_tasks.add_task(
        _run_post_interview_and_update,
        application_id=application.id,
        vacancy_id=vacancy.id,
        transcript=created_messages,
        pre_interview=pre_interview,
        post_interview_repository=post_interview_repository,
        application_repository=application_repository,
    )

    return created_messages
