from sqlalchemy.orm import Session
from app.models.audit_log import AuditLog
from typing import List, Optional

class AuditRepository:
    def create(self, db: Session, user_id: Optional[int], action: str, resource_type: str, resource_id: str = None, details: dict = None, ip_address: str = None) -> AuditLog:
        db_obj = AuditLog(
            user_id=user_id,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            details=details,
            ip_address=ip_address
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_logs(self, db: Session, skip: int = 0, limit: int = 100) -> List[AuditLog]:
        return db.query(AuditLog).order_by(AuditLog.timestamp.desc()).offset(skip).limit(limit).all()

    def get_logs_by_user(self, db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[AuditLog]:
        return db.query(AuditLog).filter(AuditLog.user_id == user_id).order_by(AuditLog.timestamp.desc()).offset(skip).limit(limit).all()

audit_repo = AuditRepository()
