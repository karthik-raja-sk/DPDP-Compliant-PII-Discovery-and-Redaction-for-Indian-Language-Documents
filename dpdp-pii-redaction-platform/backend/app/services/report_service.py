import os
import json
from datetime import datetime
try:
    import fitz
except ImportError:
    fitz = None

class ReportService:
    def generate_json_report(self, doc_id: int, filename: str, entities: list, compliance_score: float, impact_analysis: list) -> str:
        report = {
            "document_id": doc_id,
            "filename": filename,
            "scan_timestamp": datetime.now().isoformat(),
            "compliance_score": compliance_score,
            "risk_level": self._get_risk_label(compliance_score),
            "summary": {
                "total_entities": len(entities),
                "entity_types": self._get_entity_counts(entities)
            },
            "impact_analysis": impact_analysis,
            "entities_found": [
                {
                    "type": e.entity_type,
                    "risk": e.risk_level,
                    "confidence": e.confidence_score
                } for e in entities
            ]
        }
        return json.dumps(report, indent=4)

    def generate_pdf_report(self, doc_id: int, filename: str, entities: list, compliance_score: float, impact_analysis: list, output_path: str):
        if not fitz:
             return None
             
        doc = fitz.open()
        page = doc.new_page()
        
        # Title
        page.insert_text((50, 50), "Privacy Risk Assessment Report", fontsize=20, color=(0.1, 0.3, 0.6))
        
        # Metadata
        page.insert_text((50, 80), f"Document: {filename}", fontsize=12)
        page.insert_text((50, 95), f"Scan Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", fontsize=10)
        
        # Score
        score_color = (0.8, 0.2, 0.2) if compliance_score < 50 else (0.2, 0.6, 0.2)
        page.insert_text((50, 130), f"Compliance Score: {compliance_score}/100", fontsize=16, color=score_color)
        page.insert_text((50, 150), f"Risk Level: {self._get_risk_label(compliance_score)}", fontsize=12)
        
        # Impact Analysis
        page.insert_text((50, 180), "Impact Analysis:", fontsize=14, color=(0, 0, 0))
        y = 200
        for impact in impact_analysis:
            page.insert_text((60, y), f"- {impact}", fontsize=10)
            y += 15
            
        # Entity Summary
        page.insert_text((50, y + 20), "Entity Distribution:", fontsize=14)
        y += 40
        counts = self._get_entity_counts(entities)
        for e_type, count in counts.items():
            page.insert_text((60, y), f"{e_type}: {count}", fontsize=10)
            y += 15
            
        doc.save(output_path)
        doc.close()
        return output_path

    def _get_risk_label(self, score: float) -> str:
        if score > 90: return "LOW"
        if score > 70: return "MEDIUM"
        if score > 40: return "HIGH"
        return "CRITICAL"

    def _get_entity_counts(self, entities: list) -> dict:
        counts = {}
        for e in entities:
            counts[e.entity_type] = counts.get(e.entity_type, 0) + 1
        return counts

report_service = ReportService()
