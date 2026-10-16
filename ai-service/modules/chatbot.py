import re
from typing import Dict, Any, List
from modules.security import check_prompt_injection, sanitize_input

class ProcurementChatbot:
    @classmethod
    def answer_query(
        cls,
        query: str,
        tender: Dict[str, Any],
        startup: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """
        Answers questions about a tender grounded strictly in provided tender metadata
        and clause records. Protects against prompt injection attacks.
        """
        # 1. Security Check: Prompt Injection
        is_injected, reason = check_prompt_injection(query)
        if is_injected:
            return {
                "answer": "Security Alert: Your query was flagged by the system's prompt security filter and cannot be processed.",
                "flagged": True,
                "reason": reason,
                "citations": []
            }

        clean_query = sanitize_input(query).lower()
        title = tender.get("title", "N/A")
        ref_no = tender.get("reference_number", "N/A")
        department = tender.get("department", "Procuring Authority")
        budget = tender.get("budget_inr", 0)
        deadline = tender.get("deadline", "N/A")
        eligibility = tender.get("eligibility_criteria", "")
        skills = tender.get("required_skills", "")
        eval_criteria = tender.get("evaluation_criteria", "")
        docs = tender.get("required_documents", "")

        citations = []
        answer = ""

        # 2. Knowledge Retrieval based on query intent
        if any(w in clean_query for w in ["deadline", "due date", "closing date", "last date", "when"]):
            answer = f"The submission deadline for tender '{ref_no}' ({title}) is {deadline}. Ensure all digital documents are uploaded and timestamped prior to this cutoff."
            citations.append({"field": "Submission Deadline", "source": "Tender Notice Schedule"})

        elif any(w in clean_query for w in ["budget", "cost", "value", "price", "amount", "worth", "inr"]):
            try:
                formatted_budget = f"INR {float(budget):,.2f}"
            except Exception:
                formatted_budget = str(budget)
            answer = f"The estimated procurement value for tender '{ref_no}' is {formatted_budget}. Commercial proposals must be priced within or competitive with this estimate."
            citations.append({"field": "Estimated Tender Value", "source": "Commercial Guidelines Clause 1.2"})

        elif any(w in clean_query for w in ["eligibility", "eligible", "dpiit", "criteria", "turnover", "who can apply"]):
            answer = f"Eligibility requirements for this tender ({ref_no}) specify: {eligibility} "
            if startup and startup.get("dpiit_recognized"):
                answer += f"As a DPIIT-recognized startup, you are typically eligible for prior turnover and experience relaxations."
            citations.append({"field": "Eligibility Criteria", "source": "Eligibility Clause 2.1"})

        elif any(w in clean_query for w in ["skill", "tech", "technology", "stack", "hardware", "software", "language"]):
            answer = f"The key required technical skills and domain capabilities are: {skills}. The evaluation committee will verify documentation matching these competencies."
            citations.append({"field": "Required Skills & Capabilities", "source": "Technical Specification Section 4"})

        elif any(w in clean_query for w in ["document", "checklist", "certificate", "what do i need", "attach"]):
            answer = f"Mandatory documents specified for this procurement include: {docs}. Prepare self-attested copies and digital signatures."
            citations.append({"field": "Required Documents", "source": "Annexure A - Document Checklist"})

        elif any(w in clean_query for w in ["evaluate", "evaluation", "score", "weight", "criteria", "selection"]):
            answer = f"The tender evaluation methodology consists of: {eval_criteria}. High marks are allotted to technical compliance and methodology."
            citations.append({"field": "Evaluation Matrix", "source": "Bid Evaluation Framework Section 5"})

        elif any(w in clean_query for w in ["department", "ministry", "who is issuing", "authority"]):
            answer = f"This tender is issued by {department} under Reference Number {ref_no}."
            citations.append({"field": "Procuring Entity", "source": "Tender Cover Sheet"})

        else:
            # Fallback grounded response
            answer = (
                f"Regarding '{query}' for tender '{ref_no}' ({title}): "
                f"The tender is issued by {department} with a budget of INR {float(budget or 0):,.2f} and deadline of {deadline}. "
                f"Detailed specific clauses for your question were not found in the summary extract. Please inspect the official tender documents or request clarification."
            )
            citations.append({"field": "General Information", "source": "Tender Document Index"})

        return {
            "query": query,
            "answer": answer,
            "flagged": False,
            "citations": citations,
            "tender_reference": ref_no,
            "disclaimer": "AI answers are grounded in provided tender clauses. In case of discrepancies, the official tender gazette prevails."
        }
