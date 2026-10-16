import io
from typing import List, Dict, Any
from pypdf import PdfReader
from modules.security import sanitize_input

class PDFExtractor:
    @staticmethod
    def extract_text_by_pages(pdf_bytes: bytes) -> List[Dict[str, Any]]:
        """
        Extracts text from PDF bytes page by page.
        Returns a list of dicts with page number and extracted text.
        """
        results = []
        try:
            reader = PdfReader(io.BytesIO(pdf_bytes))
            for page_idx, page in enumerate(reader.pages):
                raw_text = page.extract_text() or ""
                clean_text = sanitize_input(raw_text)
                results.append({
                    "page_number": page_idx + 1,
                    "text": clean_text,
                    "char_count": len(clean_text)
                })
        except Exception as e:
            raise ValueError(f"Failed to parse PDF document: {str(e)}")
            
        return results

    @staticmethod
    def get_full_document_text(pages: List[Dict[str, Any]]) -> str:
        """Combines all pages into a single annotated string with page markers."""
        full_doc = []
        for p in pages:
            full_doc.append(f"--- [PAGE {p['page_number']}] ---\n{p['text']}")
        return "\n\n".join(full_doc)
