from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.core.database import get_db
from app.repositories.document_repository import doc_repo
from app.repositories.pii_repository import pii_repo
from app.services.redaction_service import redaction_service
from app.core.config import settings
from app.models.document import DocumentStatus
import os
from fastapi import HTTPException

router = APIRouter()

from typing import Optional, Dict
from pydantic import BaseModel
from app.api.deps import get_current_user, CheckerRole
from app.models.user import User, UserRole

class RedactionRequest(BaseModel):
    mode: str = "FULL_MASK"
    policies: Optional[Dict[str, str]] = None

from app.services.audit_service import audit_service

@router.post("/{document_id}")
def redact_document(
    document_id: int,
    req: RedactionRequest = RedactionRequest(),
    db: Session = Depends(get_db),
    current_user: User = Depends(CheckerRole([UserRole.ADMIN, UserRole.ANALYST]))
):
    doc = doc_repo.get_by_id(db, document_id)
    if not doc or doc.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Document not found")
    
    audit_service.log_action(db, user_id=current_user.id, action="REDACT", resource_type="DOCUMENT", resource_id=str(doc.id), details={"mode": req.mode})

    entities = pii_repo.get_by_document(db, document_id)
    
    entity_dicts = []
    for e in entities:
        # e.metadata_info might be a JSON string or a dict depending on the DB driver
        meta = e.metadata_info
        if isinstance(meta, str):
            import json
            try:
                meta = json.loads(meta)
            except:
                meta = {}
        
        entity_dicts.append({
            "start": meta.get('start', 0) if meta else 0,
            "end": meta.get('end', 0) if meta else 0,
            "entity_type": e.entity_type,
            "original_value": e.original_value
        })
    
    os.makedirs(settings.REDACTED_DIR, exist_ok=True)
    out_name = f"redacted_{doc.id}_{doc.filename}"
    out_path = os.path.join(settings.REDACTED_DIR, out_name)
    
    # Actually produce the rendered document file
    redaction_service.redact_document_file(
        doc.file_path, 
        out_path, 
        entity_dicts, 
        global_mode=req.mode, 
        policies=req.policies
    )
    
    doc_repo.update_status(db, document_id, DocumentStatus.REDACTED)
    
    return {
        "id": doc.id,
        "mode_applied": req.mode,
        "status": DocumentStatus.REDACTED.value,
        "redacted_file_name": out_name
    }
