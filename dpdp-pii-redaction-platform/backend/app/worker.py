import os
from celery import Celery
from app.core.config import settings
from app.core.database import SessionLocal
from app.repositories.document_repository import doc_repo
from app.repositories.pii_repository import pii_repo
from app.services.pii_detection_service import pii_detection_service
from app.models.document import DocumentStatus
import time
from loguru import logger

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
    return scan_document_job(document_id)


def scan_document_job(document_id: int):
    """
    Scan a document and persist results.

    This is intentionally a plain function so it can run:
    - as a Celery task (via `scan_document_task`)
    - as a FastAPI BackgroundTask fallback when Celery/Redis isn't running
    """
    db = SessionLocal()
    try:
        doc = doc_repo.get_by_id(db, document_id)
        if not doc:
            return "Document not found"

        # Phase 1: Queued -> Processing
        doc_repo.update_status(db, document_id, DocumentStatus.PROCESSING)
        time.sleep(0.2)

        # Phase 2: Extracting Text
        doc_repo.update_status(db, document_id, DocumentStatus.EXTRACTING_TEXT)

        text = ""
        try:
            if doc.file_path.lower().endswith(".pdf"):
                import fitz

                doc_pdf = fitz.open(doc.file_path)
                text_list = []
                for page in doc_pdf:
                    text_list.append(page.get_text())
                text = " ".join(text_list)
                doc_pdf.close()
            else:
                with open(doc.file_path, "r", encoding="utf-8") as f:
                    text = f.read()
        except Exception as e:
            # Fallback to pypdf if fitz fails for some reason
            try:
                import pypdf

                with open(doc.file_path, "rb") as f:
                    reader = pypdf.PdfReader(f)
                    text = " ".join([page.extract_text() for page in reader.pages if page.extract_text()])
            except Exception:
                doc_repo.update_status(db, document_id, DocumentStatus.FAILED)
                return f"Extraction failed: {str(e)}"

        # Phase 3: Detecting
        doc_repo.update_status(db, document_id, DocumentStatus.DETECTING_PII)
        result = pii_detection_service.scan_text(text)
        entities = result["entities"]
        compliance_score = result["compliance_score"]

        # Phase 4: Saving
        doc_repo.update_status(db, document_id, DocumentStatus.SAVING_ENTITIES)
        pii_repo.create_batch(db, document_id, entities)
        doc_repo.update_compliance_score(db, document_id, compliance_score)

        # Phase 5: Complete
        doc_repo.update_status(db, document_id, DocumentStatus.SCANNED)

        return {"id": doc.id, "entities_found": len(entities), "compliance_score": compliance_score}
    except Exception as e:
        logger.error(f"Critical error during document scan for ID {document_id}: {str(e)}")
        doc_repo.update_status(db, document_id, DocumentStatus.FAILED)
        raise e
    finally:
        db.close()
