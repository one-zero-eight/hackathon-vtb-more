from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from fastapi import status as http_status

from src.api.application.pre_interview_check import check_application
from src.api.application.util import save_upload_to_path
from src.api.auth.dependencies import get_current_user
from src.api.repositories.dependencies import get_application_repository
from src.config import api_settings
from src.db.models import User
from src.db.repositories import ApplicationRepository
from src.schemas import ApplicationResponse

router = APIRouter(prefix="/applications", tags=["Applications"])


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
):
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

    application = await application_repository.create_application(
        cv=str(dest_path),
        status=check_application(),
        user_id=user.id,
        vacancy_id=vacancy_id,
    )

    return ApplicationResponse.model_validate(application)
