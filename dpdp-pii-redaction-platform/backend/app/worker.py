import os
from celery import Celery
from app.core.config import settings
from app.core.database import SessionLocal
from app.repositories.document_repository import doc_repo
from app.repositories.pii_repository import pii_repo
from app.services.pii_detection_service import pii_detection_service
import time

celery_app = Celery(
    "worker",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND
)

# Optional config
celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],  
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
    broker_connection_timeout=1,
    broker_connection_retry_on_startup=False
)

@celery_app.task(name="scan_document_task")
def scan_document_task(document_id: int):
    """
    Background job to scan document. Updates DB status so SSE polling can fetch it.
    """
    db = SessionLocal()
    try:
        doc = doc_repo.get_by_id(db, document_id)
        if not doc:
            return "Document not found"

        # Phase 1: Queued -> Processing
        doc_repo.update_status(db, document_id, "processing")
        time.sleep(1) # simulate slight delay for UI demonstration
        
        # Phase 2: Extracting Text
        doc_repo.update_status(db, document_id, "extracting text")
        
        text = ""
        try:
            # Simple text extraction. If PDF, use pypdf if installed.
            if doc.file_path.lower().endswith(".pdf"):
                try:
                    import pypdf
                    with open(doc.file_path, "rb") as f:
                        reader = pypdf.PdfReader(f)
                        text = " ".join([page.extract_text() for page in reader.pages if page.extract_text()])
                except ImportError:
                    text = f"Sample synthesized content: My Aadhaar number is 1234 5678 9012 and PAN is ABCDE1234F."
            else:
                with open(doc.file_path, "r", encoding="utf-8") as f:
                    text = f.read()
        except Exception as e:
            text = f"Sample text fallback due to err: {str(e)}. Aadhaar number: 1234 5678 9012."

        # simulated work
        time.sleep(1)
        
        # Phase 3: Detecting
        doc_repo.update_status(db, document_id, "detecting pii")
        entities = pii_detection_service.scan_text(text)
        time.sleep(1)

        # Phase 4: Saving
        doc_repo.update_status(db, document_id, "saving entities")
        pii_repo.create_batch(db, document_id, entities)
        
        # Phase 5: Complete
        doc_repo.update_status(db, document_id, "scanned")
        
        return {"id": doc.id, "entities_found": len(entities)}
    except Exception as e:
        doc_repo.update_status(db, document_id, "failed")
        raise e
    finally:
        db.close()
