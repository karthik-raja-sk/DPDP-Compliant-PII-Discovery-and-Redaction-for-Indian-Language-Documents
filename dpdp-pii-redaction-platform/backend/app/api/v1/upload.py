from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.repositories.document_repository import doc_repo
from app.core.config import settings
import shutil
import os
from sqlalchemy import func
from app.models.pii_entity import PIIEntity
from datetime import datetime, timedelta
import pytz

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

@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from app.models.document import Document
    
    total_files = db.query(Document).filter(Document.user_id == current_user.id).count()
    total_entities = db.query(PIIEntity).join(Document).filter(Document.user_id == current_user.id).count()
    
    # High risk ('high' or 'HIGH')
    risk_alerts = db.query(PIIEntity).join(Document).filter(
        Document.user_id == current_user.id,
        func.lower(PIIEntity.risk_level) == 'high'
    ).count()

    score = 100.0
    if total_entities > 0:
        score = max(0.0, 100.0 - ((risk_alerts / total_entities) * 100.0))
        score = round(score, 1)

    # Pie data
    # group by entity_type
    entity_counts = db.query(PIIEntity.entity_type, func.count(PIIEntity.id).label('count')).join(Document).filter(
        Document.user_id == current_user.id
    ).group_by(PIIEntity.entity_type).all()
    
    # Map to colors
    colors = ['#0ea5e9', '#6366f1', '#f59e0b', '#10b981', '#ec4899', '#8b5cf6']
    pie_data = [{"name": row.entity_type, "value": row.count, "color": colors[i % len(colors)]} for i, row in enumerate(entity_counts)]

    # Trend data (Last 7 days files uploaded)
    now = datetime.now()
    seven_days_ago = now - timedelta(days=7)
    recent_docs = db.query(Document).filter(
        Document.user_id == current_user.id,
        Document.created_at >= seven_days_ago
    ).all()
    
    trend_dict = { (now - timedelta(days=i)).strftime('%b %d') : 0 for i in range(7) }
    for doc in recent_docs:
        if doc.created_at:
            day_str = doc.created_at.strftime('%b %d')
            if day_str in trend_dict:
                trend_dict[day_str] += 1
                
    trend_data = [{"name": k, "count": v} for k, v in reversed(list(trend_dict.items()))]

    return {
        "total_files": total_files,
        "total_entities": total_entities,
        "risk_alerts": risk_alerts,
        "privacy_score": score,
        "pie_data": pie_data,
        "trend_data": trend_data
    }

@router.get("/")
def get_documents_paginated(
    page: int = 1,
    limit: int = 50,
    search: str = None,
    status_filter: str = "All",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = doc_repo.get_by_user_paginated(
        db=db,
        user_id=current_user.id,
        page=page,
        limit=limit,
        search=search,
        status_filter=status_filter
    )
    
    return {
        "items": [
            {
                "id": d.id,
                "filename": d.filename,
                "status": d.status,
                "created_at": d.created_at.isoformat() if hasattr(d, 'created_at') and d.created_at else None
            } for d in result["items"]
        ],
        "page": result["page"],
        "limit": result["limit"],
        "total": result["total"],
        "total_pages": result["total_pages"],
        "has_next": result["has_next"],
        "has_prev": result["has_prev"]
    }

@router.get("/{document_id}/original")
def get_original_file(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    doc = doc_repo.get_by_id(db, document_id)
    if not doc or doc.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Document not found")
    
    if not os.path.exists(doc.file_path):
        raise HTTPException(status_code=404, detail="File not found on server")
        
    return FileResponse(doc.file_path, media_type=doc.file_type, filename=doc.filename)

@router.get("/{document_id}/redacted")
def get_redacted_file(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    doc = doc_repo.get_by_id(db, document_id)
    if not doc or doc.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Document not found")
        
    redacted_path = os.path.join(settings.REDACTED_DIR, f"redacted_{doc.id}_{doc.filename}")
    if not os.path.exists(redacted_path):
        # Fallback to original if redacted not generated yet, 
        # or raise error
        if doc.status == "redacted":
            raise HTTPException(status_code=404, detail="Redacted file missing")
        return FileResponse(doc.file_path, media_type=doc.file_type, filename=doc.filename)
        
    return FileResponse(redacted_path, media_type=doc.file_type, filename=f"redacted_{doc.filename}")

@router.delete("/")
def purge_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    count = doc_repo.delete_all_by_user(db, current_user.id)
    return {"message": f"Successfully purged {count} documents and related entities"}

@router.delete("/{document_id}")
def delete_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    doc = doc_repo.get_by_id(db, document_id)
    if not doc or doc.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Optional: Delete physical files
    if os.path.exists(doc.file_path):
        try:
            os.remove(doc.file_path)
        except:
            pass
            
    doc_repo.delete(db, document_id)
    return {"message": "Document deleted successfully"}
