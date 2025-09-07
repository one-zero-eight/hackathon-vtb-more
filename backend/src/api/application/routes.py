from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, File, Form, HTTPException, Response, UploadFile
from fastapi import status as http_status
from fastapi_derive_responses import AutoDeriveResponsesAPIRoute

from src.api.application.pre_interview_check import check_application
from src.api.application.util import save_upload_to_path
from src.api.auth.dependencies import get_current_user, require_admin
from src.api.repositories.dependencies import (
    get_application_repository,
    get_converting_repository,
    get_preinterview_repository,
    get_vacancy_repository,
), get_vacancy_repository, get_preinterview_repository
from src.config import api_settings
from src.db.models import User
from src.db.repositories import ApplicationRepository, PreInterviewResultRepository, VacancyRepository
from src.schemas import ApplicationResponse, Status
from src.services.converting import ConvertingRepository
from src.services.pre_interview import pre_interview_assessment

router = APIRouter(prefix="/applications", tags=["Applications"], route_class=AutoDeriveResponsesAPIRoute)


async def save_file_as_pdf(file: UploadFile, converting_repository: ConvertingRepository) -> Path:
    """Saves a file and returns its path."""
    ext = Path(file.filename).suffix.lower()
    allowed_extensions = {".pdf", ".doc", ".docx", ".rtf"}
    if ext not in allowed_extensions:
        raise HTTPException(status_code=400, detail="Unsupported file type")

    file_id = str(uuid4())
    original_safe_name = f"{file_id}{ext}"
    pdf_safe_name = f"{file_id}.pdf"

    original_path = (api_settings.files_dir / "cv" / original_safe_name).resolve()
    pdf_path = (api_settings.files_dir / "cv" / pdf_safe_name).resolve()

    base_dir = api_settings.files_dir.resolve()
    for path in [original_path, pdf_path]:
        if not str(path).startswith(str(base_dir)):
            raise HTTPException(status_code=400, detail="Invalid file destination")

    await save_upload_to_path(file, original_path)

    if ext == ".pdf":
        return original_path

    try:
        converting_repository.any2pdf(str(original_path), str(pdf_path))
        original_path.unlink(missing_ok=True)
        return pdf_path
    except Exception as e:
        original_path.unlink(missing_ok=True)
        pdf_path.unlink(missing_ok=True)
        raise HTTPException(status_code=500, detail=f"Failed to convert file to PDF: {str(e)}")


@router.post("", status_code=http_status.HTTP_201_CREATED)
async def create_application(
    file: UploadFile = File(...),
    vacancy_id: int = Form(...),
    application_repository: ApplicationRepository = Depends(get_application_repository),
    vacancy_repository: VacancyRepository = Depends(get_vacancy_repository),
    pre_interview_repository: PreInterviewResultRepository = Depends(get_preinterview_repository),
    converting_repository: ConvertingRepository = Depends(get_converting_repository),
    user: User = Depends(get_current_user),
) -> ApplicationResponse:
    dest_path = await save_file_as_pdf(file, converting_repository)

    application = await application_repository.create_application(
        cv=str(dest_path),
        status=check_application(),
        user_id=user.id,
        vacancy_id=vacancy_id,
    )

    await pre_interview_assessment(
        application=application,
        vacancy=await vacancy_repository.get_vacancy(vacancy_id),
        repository=pre_interview_repository,
    )

    return ApplicationResponse.model_validate(application)


@router.get("")
async def list_applications(
    application_repository: ApplicationRepository = Depends(get_application_repository),
    _: User = Depends(require_admin),
) -> list[ApplicationResponse]:
    applications = await application_repository.get_all_applications()
    return [ApplicationResponse.model_validate(app) for app in applications]


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
    user_id: int | None = Form(None),
    vacancy_id: int | None = Form(None),
    application_repository: ApplicationRepository = Depends(get_application_repository),
    converting_repository: ConvertingRepository = Depends(get_converting_repository),
    user: User = Depends(get_current_user),
) -> ApplicationResponse:
    application = await application_repository.get_application(application_id)
    if not application:
        raise HTTPException(status_code=404, detail="No such application")

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
