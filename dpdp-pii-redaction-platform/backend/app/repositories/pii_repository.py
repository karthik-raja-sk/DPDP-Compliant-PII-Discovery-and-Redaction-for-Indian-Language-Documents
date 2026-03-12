from sqlalchemy.orm import Session
from app.models.pii_entity import PIIEntity
from typing import List

class PIIRepository:
    def create_batch(self, db: Session, doc_id: int, entities: List[dict]):
        for e in entities:
            db_obj = PIIEntity(
                document_id=doc_id,
                entity_type=e['entity_type'],
                original_value=e['original_value'],
                confidence_score=e['confidence'],
                risk_level=e['risk_level'],
                metadata_info={"start": e['start'], "end": e['end']}
            )
            db.add(db_obj)
        db.commit()

    def get_by_document(self, db: Session, doc_id: int) -> List[PIIEntity]:
        return db.query(PIIEntity).filter(PIIEntity.document_id == doc_id).all()

pii_repo = PIIRepository()
