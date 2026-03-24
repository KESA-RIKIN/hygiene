import shutil
import uuid
import os
from pathlib import Path
from fastapi import APIRouter, File, UploadFile, HTTPException

router = APIRouter()
UPLOAD_DIR = Path("temp_uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

@router.post("/analyze/video")
async def analyze_video(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")

    # Generate unique filename
    file_ext = file.filename.split('.')[-1]
    temp_file_path = UPLOAD_DIR / f"{uuid.uuid4()}.{file_ext}"
    
    # Save efficiently in chunks
    try:
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Process the video using the new service bridge
        from app.services.hygiene_service import process_video
        results = process_video(str(temp_file_path))
        
        return {"status": "success", "message": "Video processed", "data": results}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # In a real scenario, you delete the file after processing
        # if temp_file_path.exists():
        #     temp_file_path.unlink()
        pass

@router.post("/analyze/image")
async def analyze_image(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")
        
    file_ext = file.filename.split('.')[-1]
    temp_file_path = UPLOAD_DIR / f"{uuid.uuid4()}.{file_ext}"
    
    try:
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # TODO: Process the image using hygiene_engine
        # results = process_image(str(temp_file_path))
        
        return {"status": "success", "message": "Image uploaded successfully (Processing not yet connected)", "violations": []}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
