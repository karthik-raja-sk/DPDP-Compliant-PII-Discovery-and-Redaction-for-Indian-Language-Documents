from app.core.config import settings
import re

# Regex patterns for Indian PII
AADHAAR_PATTERN = r'\b\d{4}\s?\d{4}\s?\d{4}\b'
PAN_PATTERN = r'\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b'
PASSPORT_PATTERN = r'\b[A-Z]{1}[0-9]{7}\b'
EMAIL_PATTERN = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
PHONE_PATTERN = r'\b(?:\+91|91)?[6-9]\d{9}\b'

class RegexDetector:
    def __init__(self):
        self.patterns = {
            "aadhaar": AADHAAR_PATTERN,
            "pan": PAN_PATTERN,
            "passport": PASSPORT_PATTERN,
            "email": EMAIL_PATTERN,
            "phone": PHONE_PATTERN
        }

    def detect(self, text: str):
        results = []
        for entity_type, pattern in self.patterns.items():
            matches = re.finditer(pattern, text)
            for match in matches:
                results.append({
                    "entity_type": entity_type.upper(),
                    "original_value": match.group(),
                    "start": match.start(),
                    "end": match.end(),
                    "confidence": 0.95 # Regex matches are highly confident
                })
        return results
