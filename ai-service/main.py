import time
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from config import settings
from modules.security import sanitize_input, check_prompt_injection
from modules.pdf_extractor import PDFExtractor
from modules.matcher import TenderMatcher
from modules.summarizer import TenderSummarizer
from modules.eligibility import EligibilityChecker
from modules.proposal_generator import ProposalGenerator
from modules.chatbot import ProcurementChatbot

app = FastAPI(
    title="GovStart AI - Intelligence Microservice",
    description="Python FastAPI service providing AI Tender Matching, PDF Summarization, Eligibility Checking, Proposal Generation, and Grounded Procurement Chat.",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Request Models ---

class MatchRequest(BaseModel):
    startup: Dict[str, Any]
    tender: Dict[str, Any]
    weights: Optional[Dict[str, float]] = None

class SummarizeTextRequest(BaseModel):
    tender_text: str
    tender_title: Optional[str] = "Uploaded Tender Document"

class ChatRequest(BaseModel):
    query: str
    tender: Dict[str, Any]
    startup: Optional[Dict[str, Any]] = None

class ProposalDraftRequest(BaseModel):
    startup: Dict[str, Any]
    tender: Dict[str, Any]

class EligibilityCheckRequest(BaseModel):
    startup: Dict[str, Any]
    tender: Dict[str, Any]

# --- Security Dependency ---
def verify_internal_auth(x_internal_token: Optional[str] = Header(None)):
    """Optional validation of internal service token between Spring Boot and FastAPI."""
    if x_internal_token and x_internal_token != settings.INTERNAL_API_KEY:
        raise HTTPException(status_code=401, detail="Invalid internal service token")
    return True

# --- Endpoints ---

@app.get("/health")
def health_check():
    """Service health and AI provider status."""
    return {
        "status": "UP",
        "service": "GovStart AI Microservice",
        "provider": settings.AI_PROVIDER,
        "mode": "Real Provider" if settings.AI_PROVIDER in ("openai", "gemini", "anthropic") else "Deterministic Rule-Based Fallback",
        "timestamp": time.time()
    }

@app.post("/api/match")
def match_tender(payload: MatchRequest, _=Depends(verify_internal_auth)):
    """
    Computes AI Tender Matching Score, matched skills, gaps, and transparent explanations.
    """
    try:
        result = TenderMatcher.match_tender_with_startup(
            startup=payload.startup,
            tender=payload.tender,
            weights=payload.weights
        )
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Matching calculation failed: {str(e)}")

@app.post("/api/summarize")
async def summarize_tender_pdf(
    file: Optional[UploadFile] = File(None),
    text_content: Optional[str] = Form(None),
    _=Depends(verify_internal_auth)
):
    """
    Smart PDF Summarizer: Accepts PDF upload or raw text.
    Extracts budget, deadlines, eligibility clauses, technical criteria, and document checklist.
    Guarantees: Missing fields marked as 'Not found'.
    """
    try:
        pages = []
        if file and file.filename:
            # Validate file extension
            if not file.filename.lower().endswith(".pdf"):
                raise HTTPException(status_code=400, detail="Only PDF files are supported for summarization.")
            
            contents = await file.read()
            if len(contents) > settings.MAX_PDF_SIZE_BYTES:
                raise HTTPException(status_code=400, detail="PDF file size exceeds 10MB limit.")
            
            pages = PDFExtractor.extract_text_by_pages(contents)
        elif text_content:
            pages = [{
                "page_number": 1,
                "text": sanitize_input(text_content),
                "char_count": len(text_content)
            }]
        else:
            raise HTTPException(status_code=400, detail="Either a PDF file or text_content must be provided.")

        if not pages:
            raise HTTPException(status_code=400, detail="No extractable text found in provided document.")

        summary_data = TenderSummarizer.summarize_document(pages)
        return {"success": True, "data": summary_data}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF extraction error: {str(e)}")

@app.post("/api/summarize-text")
def summarize_raw_text(payload: SummarizeTextRequest, _=Depends(verify_internal_auth)):
    """Summarizes tender from raw text directly."""
    pages = [{"page_number": 1, "text": sanitize_input(payload.tender_text), "char_count": len(payload.tender_text)}]
    summary_data = TenderSummarizer.summarize_document(pages)
    return {"success": True, "data": summary_data}

@app.post("/api/extract-requirements")
def extract_requirements(payload: Dict[str, Any], _=Depends(verify_internal_auth)):
    """Deep extraction and clause categorization."""
    text = payload.get("text", "")
    pages = [{"page_number": 1, "text": sanitize_input(text), "char_count": len(text)}]
    data = TenderSummarizer.summarize_document(pages)
    return {
        "success": True,
        "eligibility_clauses": data.get("eligibility_clauses", []),
        "technical_specifications": data.get("technical_specifications", []),
        "document_checklist": data.get("document_checklist", [])
    }

@app.post("/api/eligibility")
def check_eligibility(payload: EligibilityCheckRequest, _=Depends(verify_internal_auth)):
    """Compares startup profile against tender criteria."""
    result = EligibilityChecker.check_eligibility(payload.startup, payload.tender)
    return {"success": True, "data": result}

@app.post("/api/proposal-draft")
def generate_proposal_draft(payload: ProposalDraftRequest, _=Depends(verify_internal_auth)):
    """
    AI Bid Preparation Assistant: Generates editable proposal outline,
    compliance matrix, and document checklist grounded in verified startup profile.
    """
    result = ProposalGenerator.generate_draft(payload.startup, payload.tender)
    return {"success": True, "data": result}

@app.post("/api/chat")
def procurement_chat(payload: ChatRequest, _=Depends(verify_internal_auth)):
    """
    Procurement RAG Chatbot: Grounded responses in tender clauses with citations.
    """
    result = ProcurementChatbot.answer_query(
        query=payload.query,
        tender=payload.tender,
        startup=payload.startup
    )
    return {"success": True, "data": result}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=True)
