from sqlalchemy import Column, Integer, String, Float, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class PIIEntity(Base):
    __tablename__ = "pii_entities"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"))
    entity_type = Column(String, index=True) # Aadhaar, PAN, Name, etc.
    original_value = Column(String)
    redacted_value = Column(String)
    confidence_score = Column(Float)
    risk_level = Column(String) # low, medium, high
    
    # Position in text (start, end) or coordinates for images
    metadata_info = Column(JSON, nullable=True) 

    document = relationship("Document", back_populates="pii_entities")
