from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.api.deps import get_current_user, CheckerRole
from app.models.user import User, UserRole
from app.repositories.document_repository import doc_repo
from app.core.config import settings
import shutil
import os
from sqlalchemy import func
from app.models.pii_entity import PIIEntity
from datetime import datetime, timedelta
from uuid import uuid4

from app.services.audit_service import audit_service
from app.core.database import get_db

router = APIRouter()

@router.post("/")
async def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(CheckerRole([UserRole.ADMIN, UserRole.ANALYST]))
):
    # Ensure upload directory exists
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    
    original_name = os.path.basename(file.filename) or "upload"
    stored_name = f"{uuid4().hex}_{original_name}"
    file_path = os.path.join(settings.UPLOAD_DIR, stored_name)
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
    audit_service.log_action(db, user_id=current_user.id, action="UPLOAD", resource_type="DOCUMENT", resource_id=str(doc.id), details={"filename": doc.filename})
    status_value = getattr(doc.status, "value", doc.status)
    return {"id": doc.id, "filename": doc.filename, "status": status_value}

@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(CheckerRole([UserRole.ADMIN, UserRole.ANALYST]))
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
    current_user: User = Depends(CheckerRole([UserRole.ADMIN, UserRole.ANALYST]))
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
                "status": getattr(d.status, "value", d.status),
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

@router.get("/{document_id}")
def get_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(CheckerRole([UserRole.ADMIN, UserRole.ANALYST, UserRole.AUDITOR]))
):
    doc = doc_repo.get_by_id(db, document_id)
    if not doc or doc.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Document not found")
    return {
        "id": doc.id,
        "filename": doc.filename,
        "status": getattr(doc.status, "value", doc.status),
        "created_at": doc.created_at.isoformat() if doc.created_at else None,
        "file_type": doc.file_type,
        "file_size": doc.file_size
    }

@router.get("/{document_id}/original")
def get_original_file(
    document_id: int,
    download: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(CheckerRole([UserRole.ADMIN, UserRole.ANALYST]))
):
    doc = doc_repo.get_by_id(db, document_id)
    if not doc or doc.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Document not found")
    
    if not os.path.exists(doc.file_path):
        raise HTTPException(status_code=404, detail="File not found on server")
        
    audit_service.log_action(db, user_id=current_user.id, action="DOWNLOAD_ORIGINAL", resource_type="DOCUMENT", resource_id=str(doc.id))
    return FileResponse(
        doc.file_path, 
        media_type=doc.file_type, 
        filename=doc.filename if download else None
    )

@router.get("/{document_id}/redacted")
def get_redacted_file(
    document_id: int,
    download: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(CheckerRole([UserRole.ADMIN, UserRole.ANALYST]))
):
    doc = doc_repo.get_by_id(db, document_id)
    if not doc or doc.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Document not found")
        
    redacted_path = os.path.join(settings.REDACTED_DIR, f"redacted_{doc.id}_{doc.filename}")
    if not os.path.exists(redacted_path):
        if doc.status == "redacted":
            raise HTTPException(status_code=404, detail="Redacted file missing")
        return FileResponse(
            doc.file_path, 
            media_type=doc.file_type, 
            filename=doc.filename if download else None
        )
    
    audit_service.log_action(db, user_id=current_user.id, action="DOWNLOAD_REDACTED", resource_type="DOCUMENT", resource_id=str(doc.id))
    return FileResponse(
        redacted_path, 
        media_type=doc.file_type, 
        filename=f"redacted_{doc.filename}" if download else None
    )

@router.delete("/")
def purge_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(CheckerRole([UserRole.ADMIN, UserRole.ANALYST]))
):
    count = doc_repo.delete_all_by_user(db, current_user.id)
    audit_service.log_action(db, user_id=current_user.id, action="PURGE_ALL", resource_type="DOCUMENT", details={"count": count})
    return {"message": f"Successfully purged {count} documents and related entities"}

@router.delete("/{document_id}")
def delete_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(CheckerRole([UserRole.ADMIN, UserRole.ANALYST]))
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
    audit_service.log_action(db, user_id=current_user.id, action="DELETE", resource_type="DOCUMENT", resource_id=str(document_id))
    return {"message": "Document deleted successfully"}
