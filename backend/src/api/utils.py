import shutil
from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException, UploadFile
from starlette.concurrency import run_in_threadpool

from src.config import api_settings
from src.services.converting import ConvertingRepository


async def save_upload_to_path(upload: UploadFile, dest_path: Path) -> None:
    # Ensure destination directory exists
    dest_path.parent.mkdir(parents=True, exist_ok=True)

    # Copy file in a thread pool to avoid blocking the event loop
    def _write():
        with dest_path.open("wb") as f:
            shutil.copyfileobj(upload.file, f)

    await run_in_threadpool(_write)
    await upload.close()


async def save_file_as_pdf(file: UploadFile, converting_repository: ConvertingRepository) -> Path:
    """Saves a file as PDF and returns its path. Only pdf, doc, docx and rtf files are supported."""
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
