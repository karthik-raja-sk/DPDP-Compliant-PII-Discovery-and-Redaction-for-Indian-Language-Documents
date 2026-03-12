from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.core.database import get_db
from app.repositories.document_repository import doc_repo
from app.repositories.pii_repository import pii_repo
from app.services.redaction_service import redaction_service

router = APIRouter()

@router.post("/{document_id}")
def redact_document(
    document_id: int,
    mode: str = "FULL_MASK",
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    doc = doc_repo.get_by_id(db, document_id)
    entities = pii_repo.get_by_document(db, document_id)
    
    # Mock original text
    original_text = f"Sample document for {current_user.full_name}. My Aadhaar number is 1234 5678 9012 and PAN is ABCDE1234F. Contact me at rajesh@example.com."
    
    entity_dicts = [
        {
            "start": e.metadata_info['start'],
            "end": e.metadata_info['end'],
            "entity_type": e.entity_type,
            "original_value": e.original_value
        } for e in entities
    ]
    
    redacted_text = redaction_service.redact_text(original_text, entity_dicts, mode=mode)
    
    # Typically would save to a new file and return path
    doc_repo.update_status(db, document_id, "redacted")
    
    return {
        "id": doc.id,
        "redacted_content": redacted_text,
        "mode_applied": mode
    }
