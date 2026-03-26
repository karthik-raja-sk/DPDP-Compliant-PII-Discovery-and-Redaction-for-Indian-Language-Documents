from typing import List, Dict
import os
import logging

try:
    from presidio_analyzer import AnalyzerEngine
except ImportError:
    AnalyzerEngine = None

class NERInference:
    def __init__(self):
        self.analyzer = None
        self.is_loaded = False
        
    def load_model(self):
        if AnalyzerEngine:
            try:
                # English model acts as base for Name, Org, Location zero-shot
                self.analyzer = AnalyzerEngine()
                self.is_loaded = True
                logging.info("Presidio Analyzer loaded successfully.")
            except Exception as e:
                logging.error(f"Failed to load Presidio Analyzer: {e}")
        else:
            logging.warning("presidio_analyzer not installed. Fallback to dummy analysis.")

    def detect(self, text: str, language: str = "en") -> List[Dict]:
        """
        Uses Presidio Analyzer to detect Person, Organization, Location, etc.
        Returns a unified list of detected entity dictionaries.
        """
        if not self.is_loaded:
            self.load_model()
            
        if not self.analyzer or not text.strip():
            return []

        # Target entities from Presidio to complement our regex
        # Standard supported: PERSON, LOCATION, ORGANIZATION
        entities = ["PERSON", "LOCATION", "ORGANIZATION"]
        
        try:
            results = self.analyzer.analyze(text=text, entities=entities, language=language)
            
            detected = []
            for res in results:
                detected.append({
                    "entity_type": res.entity_type,
                    "original_value": text[res.start:res.end],
                    "start": res.start,
                    "end": res.end,
                    "confidence": res.score
                })
            return detected
        except Exception as e:
            logging.error(f"Error during NER detection: {e}")
            return []

ner_inference = NERInference()
