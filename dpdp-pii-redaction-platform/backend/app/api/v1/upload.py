from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.repositories.document_repository import doc_repo
from app.core.config import settings
import shutil
import os

router = APIRouter()

@router.post("/")
async def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Ensure upload directory exists
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    
    file_path = os.path.join(settings.UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    doc_data = {
        "filename": file.filename,
        "file_path": file_path,
        "file_type": file.content_type,
        "file_size": os.path.getsize(file_path),
        "user_id": current_user.id
    }
    
    doc = doc_repo.create(db, doc_data)
    return {"id": doc.id, "filename": doc.filename, "status": doc.status}

@router.get("/")
def get_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return doc_repo.get_by_user(db, current_user.id)
