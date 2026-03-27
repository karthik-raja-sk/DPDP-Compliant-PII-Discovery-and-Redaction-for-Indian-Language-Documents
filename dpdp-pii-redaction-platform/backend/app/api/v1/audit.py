from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.api.deps import get_current_user, CheckerRole
from app.core.database import get_db
from app.models.user import User, UserRole
from app.repositories.audit_repository import audit_repo
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class AuditLogSchema(BaseModel):
    id: int
    user_id: Optional[int]
    action: str
    resource_type: str
    resource_id: Optional[str]
    details: Optional[dict]
    ip_address: Optional[str]
    timestamp: datetime

    class Config:
        from_attributes = True

from typing import Optional

@router.get("/", response_model=List[AuditLogSchema])
def get_audit_logs(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(CheckerRole([UserRole.ADMIN, UserRole.AUDITOR]))
):
    """
    Get all audit logs. Restricted to ADMIN and AUDITOR.
    """
    return audit_repo.get_logs(db, skip=skip, limit=limit)

@router.get("/me", response_model=List[AuditLogSchema])
def get_my_audit_logs(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get audit logs for the current user.
    """
    return audit_repo.get_logs_by_user(db, user_id=current_user.id, skip=skip, limit=limit)
