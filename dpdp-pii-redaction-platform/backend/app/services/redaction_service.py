class RedactionService:
    def redact_text(self, text: str, entities: list, mode: str = "FULL_MASK") -> str:
        # Sort entities in reverse to not break indices during replacement
        sorted_entities = sorted(entities, key=lambda x: x['start'], reverse=True)
        redacted_text = text
        
        for entity in sorted_entities:
            start, end = entity['start'], entity['end']
            original = entity['original_value']
            
            replacement = ""
            if mode == "FULL_MASK":
                replacement = "[REDACTED]"
            elif mode == "PARTIAL_MASK":
                if len(original) > 4:
                    replacement = f"{original[:2]}***{original[-2:]}"
                else:
                    replacement = "***"
            elif mode == "ENTITY_LABEL":
                replacement = f"[{entity['entity_type']}]"
                
            redacted_text = redacted_text[:start] + replacement + redacted_text[end:]
            
        return redacted_text

redaction_service = RedactionService()
