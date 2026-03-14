from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.core.database import get_db
from app.repositories.document_repository import doc_repo
from app.repositories.pii_repository import pii_repo
from app.services.redaction_service import redaction_service
from app.core.config import settings
import os

router = APIRouter()

@router.post("/{document_id}")
def redact_document(
    document_id: int,
    mode: str = "FULL_MASK",
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    doc = doc_repo.get_by_id(db, document_id)
    if not doc or doc.user_id != current_user.id:
        return {"error": "Document not found"}

    entities = pii_repo.get_by_document(db, document_id)
    
    entity_dicts = [
        {
            "start": e.metadata_info.get('start', 0) if e.metadata_info else 0,
            "end": e.metadata_info.get('end', 0) if e.metadata_info else 0,
            "entity_type": e.entity_type,
            "original_value": e.original_value
        } for e in entities
    ]
    
    os.makedirs(settings.REDACTED_DIR, exist_ok=True)
    out_name = f"redacted_{doc.id}_{doc.filename}"
    out_path = os.path.join(settings.REDACTED_DIR, out_name)
    
    # Actually produce the rendered document file
    redaction_service.redact_document_file(doc.file_path, out_path, entity_dicts, mode=mode)
    
    # Typically would save to a new file and return path
    doc_repo.update_status(db, document_id, "redacted")
    
    return {
        "id": doc.id,
        "mode_applied": mode,
        "status": "redacted"
    }
