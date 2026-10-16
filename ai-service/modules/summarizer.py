import re
from typing import Dict, Any, List

class TenderSummarizer:
    @classmethod
    def summarize_document(cls, pages: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Extracts key procurement fields from document pages with page references.
        Guarantees: Missing info is explicitly labelled 'Not found' (no fabrication).
        """
        combined_text = "\n".join(f"[P{p['page_number']}] {p['text']}" for p in pages)
        
        def find_with_page(pattern: str, text: str) -> Dict[str, Any]:
            matches = list(re.finditer(pattern, text, re.IGNORECASE))
            if not matches:
                return {"value": "Not found", "page": None}
            
            # Find the closest preceding page marker
            match = matches[0]
            start_pos = match.start()
            preceding = text[:start_pos]
            page_matches = list(re.finditer(r"\[P(\d+)\]", preceding))
            page_num = int(page_matches[-1].group(1)) if page_matches else 1
            return {"value": match.group(1).strip(), "page": page_num}

        # 1. Tender Reference Number
        ref_match = find_with_page(r"(?:Tender\s*(?:Ref|No|Reference|Notice\s*No)[\s\:\-]+)([A-Z0-9\/\-_]{5,35})", combined_text)
        
        # 2. Budget / Estimated Value
        budget_match = find_with_page(r"(?:Estimated\s*Cost|Estimated\s*Value|Budget|Tender\s*Value)[\s\:\-]+(?:INR|Rs\.?|₹)?\s*([0-9\,]+(?:\.[0-9]{2})?(?:\s*(?:Crore|Cr|Lakh|Lakhs))?)", combined_text)
        
        # 3. Deadline / Submission End Date
        deadline_match = find_with_page(r"(?:Submission\s*Deadline|Bid\s*Submission\s*End|Closing\s*Date|Due\s*Date)[\s\:\-]+([0-9]{1,2}[\/\-\.][0-9]{1,2}[\/\-\.][0-9]{2,4}(?:\s+[0-9]{1,2}\:[0-9]{2}(?:\s*(?:AM|PM))?)?)", combined_text)
        
        # 4. Department / Ministry
        dept_match = find_with_page(r"(?:Department|Ministry|Procuring\s*Entity|Organisation)[\s\:\-]+([A-Za-z\s\(\)\,\.]{5,80})(?:\n|\r|$)", combined_text)

        # 5. Extract Eligibility Clauses
        eligibility_items = []
        for p in pages:
            text = p["text"]
            for line in text.split("\n"):
                if any(k in line.lower() for k in ["dpiit", "turnover", "incorporation", "experience", "eligibility", "prior work"]):
                    cleaned = line.strip()
                    if len(cleaned) > 20 and len(cleaned) < 250:
                        eligibility_items.append({"clause": cleaned, "page": p["page_number"]})
        
        # 6. Extract Technical Requirements
        tech_requirements = []
        for p in pages:
            text = p["text"]
            for line in text.split("\n"):
                if any(k in line.lower() for k in ["architecture", "specifications", "hardware", "software", "accuracy", "compliance", "standard", "iso", "mil-"]):
                    cleaned = line.strip()
                    if len(cleaned) > 20 and len(cleaned) < 250:
                        tech_requirements.append({"requirement": cleaned, "page": p["page_number"]})

        # 7. Extract Required Documents Checklist
        required_docs = []
        doc_keywords = ["certificate", "license", "affidavit", "pan card", "gst", "balance sheet", "authorization", "undertaking", "test report"]
        for p in pages:
            text = p["text"]
            for line in text.split("\n"):
                if any(k in line.lower() for k in doc_keywords):
                    cleaned = line.strip()
                    if len(cleaned) > 15 and len(cleaned) < 200 and cleaned not in [d["name"] for d in required_docs]:
                        required_docs.append({"name": cleaned, "page": p["page_number"]})

        # Summary Synthesis
        summary_text = (
            f"Tender analysis completed across {len(pages)} page(s). "
            f"Department: {dept_match['value']} (Source: Page {dept_match['page'] or 'N/A'}). "
            f"Estimated Budget: {budget_match['value']} (Source: Page {budget_match['page'] or 'N/A'}). "
            f"Submission Deadline: {deadline_match['value']} (Source: Page {deadline_match['page'] or 'N/A'}). "
            f"Found {len(eligibility_items)} eligibility statements and {len(required_docs)} documented submission mandates."
        )

        return {
            "reference_number": ref_match,
            "department": dept_match,
            "budget": budget_match,
            "deadline": deadline_match,
            "summary": summary_text,
            "eligibility_clauses": eligibility_items[:6],
            "technical_specifications": tech_requirements[:6],
            "document_checklist": required_docs[:8],
            "total_pages_scanned": len(pages),
            "disclaimer": "AI-generated extraction. Official portal tender documents remain legally authoritative."
        }
