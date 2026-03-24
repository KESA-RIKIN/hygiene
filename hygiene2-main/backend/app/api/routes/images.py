"""
Serves violation snapshot images stored in VIOLATIONS_DIR.
"""
import os
from pathlib import Path

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from hygiene_engine.config import VIOLATIONS_DIR

router = APIRouter()


@router.get("/images/{filename}")
async def get_violation_image(filename: str):
    """
    Serve a stored violation snapshot image by filename.
    Example: GET /api/v1/images/20240101_120000_000000_missing_gloves.jpg
    """
    # Prevent path traversal
    safe_name = Path(filename).name
    file_path = VIOLATIONS_DIR / safe_name

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Image not found")

    return FileResponse(str(file_path), media_type="image/jpeg")
