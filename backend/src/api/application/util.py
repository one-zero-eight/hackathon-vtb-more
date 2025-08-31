import shutil
from pathlib import Path

from fastapi import UploadFile
from starlette.concurrency import run_in_threadpool


async def save_upload_to_path(upload: UploadFile, dest_path: Path) -> None:
    # Ensure destination directory exists
    dest_path.parent.mkdir(parents=True, exist_ok=True)

    # Copy file in a thread pool to avoid blocking the event loop
    def _write():
        with dest_path.open("wb") as f:
            shutil.copyfileobj(upload.file, f)

    await run_in_threadpool(_write)
    await upload.close()
