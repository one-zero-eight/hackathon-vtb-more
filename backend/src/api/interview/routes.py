from fastapi import APIRouter, BackgroundTasks, HTTPException
from fastapi.params import Depends
from fastapi_derive_responses import AutoDeriveResponsesAPIRoute
from openai.types.realtime import ClientSecretCreateResponse, RealtimeAudioConfigParam
from openai.types.realtime.client_secret_create_params import (
    ExpiresAfter,
    RealtimeSessionCreateRequestParam,
)
from openai.types.realtime.realtime_audio_config_param import Input, InputTranscription, InputTurnDetection

from src.api.auth.dependencies import get_current_user
from src.api.logging_ import logger
from src.api.repositories.dependencies import (
    get_application_repository,
    get_interview_message_repository,
    get_post_interview_repository,
    get_skill_result_repository,
)
from src.config import open_ai_realtime_settings
from src.db.models import InterviewMessage, User
from src.db.repositories import (
    ApplicationRepository,
    InterviewMessageRepository,
    PostInterviewResultRepository,
    SkillResultRepository,
)
from src.schemas import InterviewHistoryRequest, InterviewMessageResponse, Status
from src.services.ai.assessor import post_interview_assessment
from src.services.ai.openai_client import async_client
from src.services.ai.prompt_builder import build_realtime_prompt
from src.services.pre_interview.github_eval import parse_github_stats

router = APIRouter(prefix="/interview", tags=["Interview"], route_class=AutoDeriveResponsesAPIRoute)


async def _run_post_interview_and_update(
    application_id: int,
    transcript: list[InterviewMessage],
    pre_interview,
    post_interview_repository: PostInterviewResultRepository,
    application_repository: ApplicationRepository,
    skill_result_repository: SkillResultRepository,
):
    application = await application_repository.get_application(application_id)
    vacancy = await application_repository.get_applications_vacancy(application_id)
    res = await post_interview_assessment(
        application=application,
        vacancy=vacancy,
        transcript=transcript,
        pre_interview_result=pre_interview,
        post_interview_repository=post_interview_repository,
        skill_results_repository=skill_result_repository,
    )
    new_status = Status.APPROVED if res.is_recommended else Status.REJECTED
    await application_repository.edit_application(application_id, status=new_status)
    logger.info(f'Post-interview result for application {application_id} created')


@router.get("/session")
async def get_ephemeral_session(
    application_id: int,
    user: User = Depends(get_current_user),
    application_repository: ApplicationRepository = Depends(get_application_repository),
) -> ClientSecretCreateResponse:
    application = await application_repository.get_application(application_id)
    if not application:
        raise HTTPException(status_code=404, detail=f"Application {application_id} not found")

    if application.status != Status.APPROVED_FOR_INTERVIEW:
        raise HTTPException(
            status_code=403,
            detail=f"Application {application_id} has not been approved for interview. "
            f"Current status: {application.status}",
        )

    github_info = None
    if type(application.profile_url) is str and "github" in application.profile_url:
        username = application.profile_url.rstrip("/").split("/")[-1]
        github_info = await parse_github_stats(username)

    system_prompt = build_realtime_prompt(application, user, github_info)
    logger.info(system_prompt)
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
                    ),
                    turn_detection=InputTurnDetection(
                        type="server_vad",
                        silence_duration_ms=1500,
                    ),
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
    skill_result_repository: SkillResultRepository = Depends(get_skill_result_repository),
) -> list[InterviewMessageResponse]:
    created_messages = []
    application = await application_repository.get_application(data.application_id)
    if not application:
        raise HTTPException(status_code=404, detail=f"Application {data.application_id} not found")
    vacancy = await application_repository.get_applications_vacancy(application.id)
    if not vacancy:
        raise HTTPException(status_code=404, detail="Vacancy not found")
    pre_interview = await application_repository.get_applications_pre_interview(application.id)
    if not pre_interview:
        raise HTTPException(status_code=404, detail="Pre-interview not found")

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
        transcript=created_messages,
        pre_interview=pre_interview,
        post_interview_repository=post_interview_repository,
        application_repository=application_repository,
        skill_result_repository=skill_result_repository,
    )

    return created_messages
