from sqlalchemy.orm import Session
from sqlalchemy import or_, String, cast
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

    def get_by_user_paginated(self, db: Session, user_id: int, page: int = 1, limit: int = 50, search: str = None, status_filter: str = "All"):
        query = db.query(Document).filter(Document.user_id == user_id)
        
        if search:
            search_term = f"%{search.lower()}%"
            query = query.filter(
                or_(
                    Document.filename.ilike(search_term),
                    cast(Document.id, String).ilike(search_term)
                )
            )
            
        if status_filter != "All":
            if status_filter == "Completed":
                query = query.filter(Document.status.in_(["redacted", "scanned"]))
            elif status_filter == "Pending":
                query = query.filter(~Document.status.in_(["redacted", "scanned"]))

        total = query.count()
        query = query.order_by(Document.id.desc())
        
        offset = (page - 1) * limit
        items = query.offset(offset).limit(limit).all()
        
        total_pages = (total + limit - 1) // limit if limit > 0 else 1
        return {
            "items": items,
            "page": page,
            "limit": limit,
            "total": total,
            "total_pages": total_pages,
            "has_next": page < total_pages,
            "has_prev": page > 1
        }

    def update_status(self, db: Session, doc_id: int, status: str):
        db_obj = self.get_by_id(db, doc_id)
        if db_obj:
            db_obj.status = status
            db.commit()
            db.refresh(db_obj)
        return db_obj

    def delete(self, db: Session, doc_id: int):
        db_obj = self.get_by_id(db, doc_id)
        if db_obj:
            db.delete(db_obj)
            db.commit()
        return db_obj

    def delete_all_by_user(self, db: Session, user_id: int):
        query = db.query(Document).filter(Document.user_id == user_id)
        count = query.count()
        query.delete()
        db.commit()
        return count

doc_repo = DocumentRepository()
