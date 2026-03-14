from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.core.database import Base

class DocumentStatus(str, enum.Enum):
    UPLOADED = "uploaded"
    QUEUED = "queued"
    PROCESSING = "processing"
    EXTRACTING_TEXT = "extracting text"
    DETECTING_PII = "detecting pii"
    SAVING_ENTITIES = "saving entities"
    SCANNED = "scanned"
    REDACTED = "redacted"
    FAILED = "failed"

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    file_path = Column(String)
    file_type = Column(String)
    file_size = Column(Integer)
    status = Column(SQLEnum(DocumentStatus), default=DocumentStatus.UPLOADED)
    language = Column(String, nullable=True)
    compliance_score = Column(Float, default=0.0)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    owner = relationship("User", backref="documents")
    pii_entities = relationship("PIIEntity", back_populates="document", cascade="all, delete-orphan")
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
