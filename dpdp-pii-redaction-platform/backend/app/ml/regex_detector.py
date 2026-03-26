import re

# Verhoeff Algorithm for Aadhaar Validation
VERHOEFF_TABLE_D = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
    [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
    [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
    [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
    [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
    [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
    [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
]

VERHOEFF_TABLE_P = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
    [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
    [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
    [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
    [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
]

VERHOEFF_TABLE_INV = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9]

def validate_verhoeff(number):
    """Validate number using Verhoeff algorithm."""
    c = 0
    for i, digit in enumerate(reversed(str(number))):
        c = VERHOEFF_TABLE_D[c][VERHOEFF_TABLE_P[i % 8][int(digit)]]
    return c == 0

class RegexDetector:
    def __init__(self):
        self.patterns = {
            "aadhaar": re.compile(r'\b\d{4}[ -]?\d{4}[ -]?\d{4}\b'),
            "pan": re.compile(r'\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b'),
            "passport": re.compile(r'\b[A-Z]{1}[0-9]{7}\b'),
            "email": re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'),
            "phone": re.compile(r'\b(?:\+91|91)?[6-9]\d{9}\b'),
            "ifsc": re.compile(r'\b[A-Z]{4}0[A-Z0-9]{6}\b'),
            "voter_id": re.compile(r'\b[A-Z]{3}[0-9]{7}\b'),
            "upi": re.compile(r'\b[\w\.-]+@[\w\.-]+\b'),
            "bank_account": re.compile(r'\b\d{9,18}\b'),
            "dob": re.compile(r'\b\d{2}[-/]\d{2}[-/]\d{4}\b')
        }

    def detect(self, text: str):
        results = []
        for entity_type, pattern in self.patterns.items():
            matches = pattern.finditer(text)
            for match in matches:
                value = match.group()
                confidence = 0.95
                
                # Validation Logic
                if entity_type == "aadhaar":
                    clean_val = value.replace(" ", "").replace("-", "")
                    if not validate_verhoeff(clean_val):
                        continue # Skip invalid Aadhaar
                    confidence = 0.99
                
                elif entity_type == "pan":
                    confidence = 0.98

                elif entity_type == "bank_account":
                    # Avoid catching years or random long numbers
                    if len(value) < 11:
                        confidence = 0.40
                    else:
                        confidence = 0.70

                results.append({
                    "entity_type": entity_type.upper(),
                    "original_value": value,
                    "start": match.start(),
                    "end": match.end(),
                    "confidence": confidence
                })
        return results
