from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.core.database import get_db
from app.repositories.document_repository import doc_repo
from app.repositories.pii_repository import pii_repo
from app.services.pii_detection_service import pii_detection_service

router = APIRouter()

@router.post("/{document_id}")
async def scan_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    doc = doc_repo.get_by_id(db, document_id)
    if not doc or doc.user_id != current_user.id:
        return {"error": "Document not found"}
    
    # In a real app, this would be a Celery task.
    # For now, we simulate text extraction and scan.
    doc_repo.update_status(db, document_id, "processing")
    
    # Mock text extraction from file_path
    mock_text = f"Sample document for {current_user.full_name}. My Aadhaar number is 1234 5678 9012 and PAN is ABCDE1234F. Contact me at rajesh@example.com."
    
    entities = pii_detection_service.scan_text(mock_text)
    pii_repo.create_batch(db, document_id, entities)
    
    doc_repo.update_status(db, document_id, "scanned")
    
    return {"id": doc.id, "entities_found": len(entities)}

@router.get("/{document_id}/entities")
def get_entities(
    document_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return pii_repo.get_by_document(db, document_id)
