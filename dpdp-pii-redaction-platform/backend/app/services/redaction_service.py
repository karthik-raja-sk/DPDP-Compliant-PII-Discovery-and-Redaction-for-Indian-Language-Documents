import os
try:
    import fitz  # PyMuPDF
except ImportError:
    fitz = None

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

    def redact_document_file(self, input_path: str, output_path: str, entities: list, mode: str = "FULL_MASK"):
        """
        Actually applies redaction to a physical file. For PDFs, searches text matches and applies masks.
        """
        ext = os.path.splitext(input_path)[1].lower()
        if ext == '.pdf' and fitz:
            doc = fitz.open(input_path)
            for page in doc:
                for entity in entities:
                    val = entity['original_value']
                    text_instances = page.search_for(val)
                    for inst in text_instances:
                        page.add_redact_annot(inst, fill=(0, 0, 0))
                page.apply_redactions(images=fitz.PDF_REDACT_IMAGE_NONE)
            doc.save(output_path)
            doc.close()
        else:
            try:
                with open(input_path, 'r', encoding='utf-8') as f:
                    text = f.read()
            except Exception:
                text = "Unprocessable file format for text-replacement."
            redacted = self.redact_text(text, entities, mode)
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(redacted)

redaction_service = RedactionService()
