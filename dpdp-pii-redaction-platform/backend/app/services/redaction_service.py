import os
try:
    import fitz  # PyMuPDF
except ImportError:
    fitz = None

class RedactionService:
    def redact_text(self, text: str, entities: list, global_mode: str = "FULL_MASK", policies: dict = None) -> str:
        # Sort entities in reverse to not break indices during replacement
        sorted_entities = sorted(entities, key=lambda x: x['start'], reverse=True)
        redacted_text = text
        
        for entity in sorted_entities:
            start, end = entity['start'], entity['end']
            original = entity['original_value']
            entity_type = entity['entity_type']
            
            # Decide mode based on policy or global default
            mode = (policies or {}).get(entity_type, global_mode)
            
            replacement = ""
            if mode == "FULL_MASK":
                replacement = "X" * len(original) if len(original) > 0 else "[REDACTED]"
            elif mode == "PARTIAL_MASK":
                if len(original) > 6:
                    replacement = f"{original[:2]}{'x' * (len(original)-4)}{original[-2:]}"
                elif len(original) > 3:
                     replacement = f"{original[0]}{'x' * (len(original)-1)}"
                else:
                    replacement = "xxx"
            elif mode == "ENTITY_LABEL":
                replacement = f"<{entity_type}>"
            else:
                replacement = "[REDACTED]"
                
            redacted_text = redacted_text[:start] + replacement + redacted_text[end:]
            
        return redacted_text

    def redact_document_file(self, input_path: str, output_path: str, entities: list, global_mode: str = "FULL_MASK", policies: dict = None):
        """
        Actually applies redaction to a physical file. For PDFs, searches text matches and applies masks.
        """
        ext = os.path.splitext(input_path)[1].lower()
        if ext == '.pdf' and fitz:
            doc = fitz.open(input_path)
            for page in doc:
                for entity in entities:
                    val = entity['original_value']
                    entity_type = entity['entity_type']
                    mode = (policies or {}).get(entity_type, global_mode)
                    
                    text_instances = page.search_for(val)
                    for inst in text_instances:
                        if mode == "ENTITY_LABEL":
                            # Draw a black box and write the label in white
                            page.add_redact_annot(inst, fill=(0, 0, 0))
                            # We'll apply redactions first, then overlay text if needed, 
                            # but PyMuPDF's add_redact_annot text param is simpler
                            page.add_redact_annot(inst, text=f"[{entity_type}]", text_color=(1, 1, 1), fill=(0, 0, 0))
                        elif mode == "PARTIAL_MASK":
                            # Partial mask in PDF is tricky, we'll just do a lighter gray box or full black for now
                            # for security, full black is safer in PDF
                            page.add_redact_annot(inst, fill=(0.2, 0.2, 0.2))
                        else:
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
            redacted = self.redact_text(text, entities, global_mode, policies)
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(redacted)

redaction_service = RedactionService()
