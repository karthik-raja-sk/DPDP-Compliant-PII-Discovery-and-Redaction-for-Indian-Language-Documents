from sqlalchemy.orm import Session
from app.repositories.audit_repository import audit_repo
from typing import Optional

class AuditService:
    def log_action(
        self, 
        db: Session, 
        user_id: Optional[int], 
        action: str, 
        resource_type: str, 
        resource_id: str = None, 
        details: dict = None, 
        ip_address: str = None
    ):
        return audit_repo.create(
            db, 
            user_id=user_id, 
            action=action, 
            resource_type=resource_type, 
            resource_id=resource_id, 
            details=details, 
            ip_address=ip_address
        )

audit_service = AuditService()
