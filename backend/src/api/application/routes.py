from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, File, Form, HTTPException, Response, UploadFile
from fastapi import status as http_status

from src.api.application.pre_interview_check import check_application
from src.api.application.util import save_upload_to_path
from src.api.auth.dependencies import get_current_user, require_admin
from src.api.repositories.dependencies import get_application_repository
from src.config import api_settings
from src.db.models import User
from src.db.repositories import ApplicationRepository
from src.schemas import ApplicationResponse, Status

router = APIRouter(prefix="/applications", tags=["Applications"])


async def save_file(file: UploadFile) -> Path:
    """Saves a file and returns its path."""
    ext = Path(file.filename).suffix.lower()
    allowed_extensions = {".pdf", ".doc", ".docx"}
    if ext not in allowed_extensions:
        raise HTTPException(status_code=400, detail="Unsupported file type")

    safe_name = f"{uuid4()}{ext}"
    dest_path = (api_settings.files_dir / "cv" / safe_name).resolve()

    base_dir = api_settings.files_dir.resolve()
    if not str(dest_path).startswith(str(base_dir)):
        raise HTTPException(status_code=400, detail="Invalid file destination")

    await save_upload_to_path(file, dest_path)
    return dest_path


@router.post(
    "",
    response_model=ApplicationResponse,
    status_code=http_status.HTTP_201_CREATED,
)
async def create_application(
    file: UploadFile = File(...),
    vacancy_id: int = Form(...),
    application_repository: ApplicationRepository = Depends(get_application_repository),
    user: User = Depends(get_current_user),
) -> ApplicationResponse:
    dest_path = await save_file(file)

    application = await application_repository.create_application(
        cv=str(dest_path),
        status=check_application(),
        user_id=user.id,
        vacancy_id=vacancy_id,
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


@router.patch(
    "/{application_id}",
    response_model=ApplicationResponse,
    status_code=http_status.HTTP_200_OK,
)
async def edit_application_endpoint(
    application_id: int,
    file: UploadFile | None = File(None),
    status: Status | None = Form(None),
    user_id: int | None = Form(None),
    vacancy_id: int | None = Form(None),
    application_repository: ApplicationRepository = Depends(get_application_repository),
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
        dest_path = await save_file(file)
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
