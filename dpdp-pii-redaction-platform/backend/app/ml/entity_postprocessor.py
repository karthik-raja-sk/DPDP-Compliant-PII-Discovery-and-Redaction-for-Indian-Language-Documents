from typing import List, Dict

class EntityPostprocessor:
    def process(self, entities: List[Dict]) -> List[Dict]:
        # deduplicate, resolve overlaps, and refine entity labels
        # Example: if a regex matches an Aadhaar and NER matches a PERSON in the same span
        # Regex usually wins for structured data.
        
        seen_spans = []
        refined = []
        
        # Sort by confidence and length
        sorted_entities = sorted(entities, key=lambda x: (x['confidence'], x['end'] - x['start']), reverse=True)
        
        for entity in sorted_entities:
            overlap = False
            for span in seen_spans:
                if not (entity['end'] <= span[0] or entity['start'] >= span[1]):
                    overlap = True
                    break
            
            if not overlap:
                refined.append(entity)
                seen_spans.append((entity['start'], entity['end']))
                
        return refined

postprocessor = EntityPostprocessor()
