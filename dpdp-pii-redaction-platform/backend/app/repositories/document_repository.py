from sqlalchemy.orm import Session
from app.models.document import Document
from typing import List

class DocumentRepository:
    def create(self, db: Session, obj_in: dict) -> Document:
        db_obj = Document(**obj_in)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_by_id(self, db: Session, doc_id: int) -> Document:
        return db.query(Document).filter(Document.id == doc_id).first()

    def get_by_user(self, db: Session, user_id: int) -> List[Document]:
        return db.query(Document).filter(Document.user_id == user_id).all()

    def update_status(self, db: Session, doc_id: int, status: str):
        db_obj = self.get_by_id(db, doc_id)
        if db_obj:
            db_obj.status = status
            db.commit()
            db.refresh(db_obj)
        return db_obj

doc_repo = DocumentRepository()
