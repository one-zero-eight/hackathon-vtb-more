from fastapi import APIRouter, BackgroundTasks, Depends, File, Form, HTTPException, Response, UploadFile
from fastapi import status as http_status
from fastapi_derive_responses import AutoDeriveResponsesAPIRoute

from src.api.auth.dependencies import get_current_user, require_admin
from src.api.logging_ import logger
from src.api.repositories.dependencies import (
    get_application_repository,
    get_converting_repository,
    get_pre_interview_repository,
    get_vacancy_repository,
)
from src.api.utils import save_file_as_pdf
from src.db.models import User
from src.db.repositories import ApplicationRepository, PreInterviewResultRepository, VacancyRepository
from src.schemas import ApplicationResponse, ApplicationWithVacancyResponse, Status, VacancyResponse
from src.services.ai.assessor import pre_interview_assessment
from src.services.converting import ConvertingRepository
from src.services.pre_interview.github_eval import GithubStats, parse_github_stats

router = APIRouter(prefix="/applications", tags=["Applications"], route_class=AutoDeriveResponsesAPIRoute)


async def _run_pre_interview_and_update(
    application_id: int,
    vacancy_id: int,
    github_info: GithubStats | None,
    application_repository: ApplicationRepository,
    vacancy_repository: VacancyRepository,
    pre_interview_repository: PreInterviewResultRepository,
):
    vacancy = await vacancy_repository.get_vacancy(vacancy_id)
    application = await application_repository.get_application(application_id)
    res = await pre_interview_assessment(
        application=application,
        vacancy=vacancy,
        repository=pre_interview_repository,
        github=github_info,
    )
    new_status = Status.APPROVED_FOR_INTERVIEW if res.is_recommended else Status.REJECTED_FOR_INTERVIEW
    await application_repository.edit_application(application_id, status=new_status)
    logger.info(f'Pre-interview result for application {application_id} created')


@router.post("", status_code=http_status.HTTP_201_CREATED)
async def create_application(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    vacancy_id: int = Form(...),
    github: str | None = Form(None),
    application_repository: ApplicationRepository = Depends(get_application_repository),
    vacancy_repository: VacancyRepository = Depends(get_vacancy_repository),
    pre_interview_repository: PreInterviewResultRepository = Depends(get_pre_interview_repository),
    converting_repository: ConvertingRepository = Depends(get_converting_repository),
    user: User = Depends(get_current_user),
) -> ApplicationResponse:
    dest_path = await save_file_as_pdf(file, converting_repository)
    vacancy = await vacancy_repository.get_vacancy(vacancy_id)
    if vacancy is None:
        raise HTTPException(
            status_code=404, detail=f"Vacancy {vacancy_id} not found"
        )

    application = await application_repository.create_application(
        cv=str(dest_path),
        status=Status.PENDING,
        git=github,
        user_id=user.id,
        vacancy_id=vacancy_id,
    )

    github_info = None
    if type(github) is str and 'github' in github:
        username = github.rstrip("/").split("/")[-1]
        github_info = await parse_github_stats(username)

    background_tasks.add_task(
        _run_pre_interview_and_update,
        application_id=application.id,
        vacancy_id=vacancy_id,
        github_info=github_info,
        application_repository=application_repository,
        vacancy_repository=vacancy_repository,
        pre_interview_repository=pre_interview_repository,
    )

    application.github_stats = github_info

    return ApplicationResponse.model_validate(application)


@router.get("")
async def list_applications(
    application_repository: ApplicationRepository = Depends(get_application_repository),
    _: User = Depends(require_admin),
) -> list[ApplicationResponse]:
    applications = await application_repository.get_all_applications()
    return [ApplicationResponse.model_validate(app) for app in applications]


@router.get("/my")
async def get_user_applications(
    application_repository: ApplicationRepository = Depends(get_application_repository),
    user: User = Depends(get_current_user),
) -> list[ApplicationResponse]:
    applications = await application_repository.get_user_applications(user.id)
    return [ApplicationResponse.model_validate(app) for app in applications]


@router.get("/my/with_vacancies")
async def get_user_applications_with_vacancies(
    application_repository: ApplicationRepository = Depends(get_application_repository),
    user: User = Depends(get_current_user),
) -> list[ApplicationWithVacancyResponse]:
    applications = await application_repository.get_user_applications(user.id)
    result = []
    for app in applications:
        app_with_vacancy = ApplicationWithVacancyResponse(
            application=ApplicationResponse.model_validate(app),
            vacancy=VacancyResponse.model_validate(app.vacancy),
        )
        result.append(ApplicationWithVacancyResponse.model_validate(app_with_vacancy))
    return result


@router.get("/{application_id}")
async def get_application(
    application_id: int,
    application_repository: ApplicationRepository = Depends(get_application_repository),
    user: User = Depends(get_current_user),
) -> ApplicationResponse:
    application = await application_repository.get_application(application_id)
    if not application:
        raise HTTPException(status_code=404, detail="No such application")

    if application.user_id != user.id:
        raise HTTPException(status_code=403, detail="You are not authorized to view this application")

    return ApplicationResponse.model_validate(application)


@router.patch("/{application_id}", status_code=http_status.HTTP_200_OK)
async def edit_application_endpoint(
    application_id: int,
    file: UploadFile | None = File(None),
    status: Status | None = Form(None),
    github: str | None = Form(None),
    user_id: int | None = Form(None),
    vacancy_id: int | None = Form(None),
    application_repository: ApplicationRepository = Depends(get_application_repository),
    vacancy_repository: VacancyRepository = Depends(get_vacancy_repository),
    converting_repository: ConvertingRepository = Depends(get_converting_repository),
    user: User = Depends(get_current_user),
) -> ApplicationResponse:
    application = await application_repository.get_application(application_id)
    if not application:
        raise HTTPException(status_code=404, detail="No such application")
    vacancy = vacancy_repository.get_vacancy(vacancy_id)
    if not vacancy:
        raise HTTPException(status_code=404, detail="No such vacancy")

    if application.user_id != user_id and not user.is_admin:
        raise HTTPException(status_code=403, detail="You are not authorized to change this application")
    if status is not None and not user.is_admin:
        raise HTTPException(status_code=403, detail="You are not authorized to change status of application")
    if user_id is not None and not user.is_admin:
        raise HTTPException(status_code=403, detail="You are not authorized to transfer this application")

    update_kwargs: dict = {}

    # Handle optional CV file upload
    if file is not None:
        dest_path = await save_file_as_pdf(file, converting_repository)
        update_kwargs["cv"] = str(dest_path)

    # Collect optional fields for partial update
    if status is not None:
        update_kwargs["status"] = status
    if github is not None:
        update_kwargs["git"] = github
    if user_id is not None:
        update_kwargs["user_id"] = user_id
    if vacancy_id is not None:
        update_kwargs["vacancy_id"] = vacancy_id

    if not update_kwargs:
        raise HTTPException(status_code=400, detail="No changes provided")

    edited_application = await application_repository.edit_application(application_id, **update_kwargs)
    return ApplicationResponse.model_validate(edited_application)


@router.delete("/{application_id}", status_code=http_status.HTTP_204_NO_CONTENT)
async def delete_application(
    application_id: int,
    application_repository: ApplicationRepository = Depends(get_application_repository),
    _: User = Depends(require_admin),
):
    application = await application_repository.delete_application(application_id)
    if application is None:
        raise HTTPException(status_code=404, detail="No such application")

    return Response(status_code=http_status.HTTP_204_NO_CONTENT)
