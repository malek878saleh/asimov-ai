from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
import os
import aiofiles
from pathlib import Path

router = APIRouter()

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """Upload and embed file"""
    file_path = UPLOAD_DIR / file.filename
    
    # Save file
    async with aiofiles.open(file_path, 'wb') as out_file:
        content = await file.read()
        await out_file.write(content)
    
    # TODO: Add file processing for embeddings
    # - Extract text from PDF/Word/Text
    # - Generate embeddings
    # - Store in vector DB
    
    return {
        "filename": file.filename,
        "path": str(file_path),
        "message": "File uploaded successfully"
    }

@router.get("/files")
async def list_files():
    """List all uploaded files"""
    files = [f.name for f in UPLOAD_DIR.iterdir() if f.is_file()]
    return {"files": files}

@router.get("/file/{filename}")
async def get_file(filename: str):
    """Download a file"""
    file_path = UPLOAD_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path)