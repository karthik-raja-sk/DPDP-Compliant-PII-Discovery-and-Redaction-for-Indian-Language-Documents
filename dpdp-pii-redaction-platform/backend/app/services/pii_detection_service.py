from app.ml.regex_detector import RegexDetector
from app.ml.ner_inference import ner_inference
from app.ml.entity_postprocessor import postprocessor
from app.ml.confidence_scorer import scorer
from app.repositories.pii_repository import pii_repo
from sqlalchemy.orm import Session

class PIIDetectionService:
    def __init__(self):
        self.regex_detector = RegexDetector()

    def scan_text(self, text: str, language: str = "en") -> dict:
        # Hybrid detection
        regex_entities = self.regex_detector.detect(text)
        ner_entities = ner_inference.detect(text, language=language)
        
        all_entities = regex_entities + ner_entities
        refined_entities = postprocessor.process(all_entities)
        
        for entity in refined_entities:
            entity['risk_level'] = scorer.calculate_risk(entity['entity_type'], entity['confidence'])
            
        compliance_score = scorer.aggregate_score(refined_entities)
        impact_analysis = scorer.get_impact_analysis(refined_entities)
        
        return {
            "entities": refined_entities,
            "compliance_score": compliance_score,
            "impact_analysis": impact_analysis
        }

    async def process_document(self, db: Session, doc_id: int, text: str):
        result = self.scan_text(text)
        entities = result["entities"]
        
        # Store in DB using the repository
        pii_repo.create_batch(db, doc_id, entities)
        
        # Update document compliance score
        from app.repositories.document_repository import doc_repo
        doc_repo.update_compliance_score(db, doc_id, result["compliance_score"])
        
        return result

pii_detection_service = PIIDetectionService()
