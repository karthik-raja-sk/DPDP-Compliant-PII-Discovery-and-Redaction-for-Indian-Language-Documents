from typing import Dict

class ConfidenceScorer:
    def calculate_risk(self, entity_type: str, confidence: float) -> str:
        # PII risk classification based on DPDP context
        high_risk = ["AADHAAR", "PAN", "PASSPORT", "HEALTH_ID", "BIOMETRIC"]
        medium_risk = ["PHONE", "EMAIL", "NAME", "DOB"]
        
        if entity_type in high_risk:
            return "HIGH"
        if entity_type in medium_risk:
            return "MEDIUM"
        return "LOW"

    def aggregate_score(self, entities: list) -> float:
        # Calculate overall document risk/compliance score
        if not entities:
            return 100.0
        
        high_risk_count = len([e for e in entities if self.calculate_risk(e['entity_type'], e['confidence']) == "HIGH"])
        score = 100 - (high_risk_count * 10) - (len(entities) * 2)
        return max(0, min(100, score))

scorer = ConfidenceScorer()
