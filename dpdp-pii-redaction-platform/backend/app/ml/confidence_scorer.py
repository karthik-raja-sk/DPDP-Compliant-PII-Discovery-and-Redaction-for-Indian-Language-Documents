from typing import Dict, List

class ConfidenceScorer:
    def calculate_risk(self, entity_type: str, confidence: float) -> str:
        # PII risk classification based on DPDP context
        high_risk = ["AADHAAR", "PAN", "PASSPORT", "BANK_ACCOUNT", "BIOMETRIC", "VOTER_ID"]
        medium_risk = ["PHONE", "EMAIL", "IFSC", "UPI", "DOB"]
        
        if entity_type in high_risk:
            return "HIGH" if confidence > 0.6 else "MEDIUM"
        if entity_type in medium_risk:
            return "MEDIUM" if confidence > 0.5 else "LOW"
        return "LOW"

    def aggregate_score(self, entities: list) -> float:
        """
        Calculate overall document risk/compliance score (0-100).
        100 = Perfect (No PII), 0 = Critical Risk.
        """
        if not entities:
            return 100.0
        
        weights = {
            "HIGH": 15,    # Penalty per high risk item
            "MEDIUM": 5,   # Penalty per medium risk item
            "LOW": 2       # Penalty per low risk item
        }
        
        total_penalty = 0
        unique_types = set()
        
        for e in entities:
            risk = self.calculate_risk(e['entity_type'], e['confidence'])
            total_penalty += weights[risk]
            unique_types.add(e['entity_type'])
            
        # Combination Risk: If Name + (Aadhaar or PAN) exists, add extra weight
        if "NAME" in unique_types and ("AADHAAR" in unique_types or "PAN" in unique_types):
            total_penalty += 20
            
        score = 100 - total_penalty
        return max(0, min(100, score))

    def get_impact_analysis(self, entities: list) -> List[str]:
        unique_types = {e['entity_type'] for e in entities}
        impacts = []
        
        if "AADHAAR" in unique_types or "PAN" in unique_types:
            impacts.append("High risk of identity theft and financial fraud.")
        if "BANK_ACCOUNT" in unique_types or "UPI" in unique_types:
            impacts.append("Potential for unauthorized financial transactions.")
        if "PHONE" in unique_types or "EMAIL" in unique_types:
            impacts.append("Increased vulnerability to phishing and social engineering.")
        if len(unique_types) > 5:
            impacts.append("Comprehensive profile leak possibility; extreme privacy violation.")
            
        if not impacts:
            impacts.append("Minimal privacy impact detected.")
            
        return impacts

scorer = ConfidenceScorer()
