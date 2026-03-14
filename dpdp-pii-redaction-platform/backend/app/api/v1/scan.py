from fastapi import APIRouter, Depends, Request, BackgroundTasks
from sse_starlette.sse import EventSourceResponse
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.core.database import get_db
from app.repositories.document_repository import doc_repo
from app.repositories.pii_repository import pii_repo
from app.services.pii_detection_service import pii_detection_service
from app.worker import scan_document_task
import asyncio

router = APIRouter()

@router.post("/{document_id}")
async def scan_document(
    document_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    doc = doc_repo.get_by_id(db, document_id)
    if not doc or doc.user_id != current_user.id:
        return {"error": "Document not found"}
    
    # Enqueue real Celery Task
    doc_repo.update_status(db, document_id, "queued")
    try:
        scan_document_task.delay(document_id)
    except Exception as e:
        # Fallback if Redis/Celery is not running in local debug
        background_tasks.add_task(scan_document_task, document_id)

    return {"id": doc.id, "status": "queued"}

@router.get("/{document_id}/stream")
async def scan_stream(
    request: Request,
    document_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    SSE endpoint pushing live status updates of the document to the frontend.
    """
    async def event_generator():
        while True:
            # Check client disconnection
            if await request.is_disconnected():
                break

            db.expire_all() # Ensure we get fresh data from DB
            doc = doc_repo.get_by_id(db, document_id)
            if not doc:
                yield {"data": '{"error": "Document not found"}'}
                break

            yield {"data": f'{{"status": "{doc.status}"}}'}
            
            # End stream on terminal states
            if doc.status in ["scanned", "redacted", "failed"]:
                yield {"data": f'{{"status": "{doc.status}"}}'}
                break
                
            await asyncio.sleep(1)
            
    return EventSourceResponse(event_generator())

@router.get("/{document_id}/entities")
def get_entities(
    document_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    entities = pii_repo.get_by_document(db, document_id)
    return [
        {
            "id": e.id,
            "entity_type": e.entity_type,
            "original_value": e.original_value,
            "confidence_score": e.confidence_score,
            "risk_level": e.risk_level,
            "metadata_info": e.metadata_info
        } for e in entities
    ]
