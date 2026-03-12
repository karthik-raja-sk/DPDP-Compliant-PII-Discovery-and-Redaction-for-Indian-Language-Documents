from app.ml.regex_detector import RegexDetector
from app.ml.ner_inference import ner_inference
from app.ml.entity_postprocessor import postprocessor
from app.ml.confidence_scorer import scorer
from app.repositories.pii_repository import pii_repo
from sqlalchemy.orm import Session

class PIIDetectionService:
    def __init__(self):
        self.regex_detector = RegexDetector()

    def scan_text(self, text: str, language: str = "en") -> list:
        # Hybrid detection
        regex_entities = self.regex_detector.detect(text)
        ner_entities = ner_inference.detect(text, language=language)
        
        all_entities = regex_entities + ner_entities
        refined_entities = postprocessor.process(all_entities)
        
        for entity in refined_entities:
            entity['risk_level'] = scorer.calculate_risk(entity['entity_type'], entity['confidence'])
            
        return refined_entities

    async def process_document(self, db: Session, doc_id: int, text: str):
        entities = self.scan_text(text)
        # Store in DB
        # This will be called by Celery worker
        pass

pii_detection_service = PIIDetectionService()
