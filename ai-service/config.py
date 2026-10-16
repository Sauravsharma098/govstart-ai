import os
from pydantic import BaseModel

class AIServiceSettings(BaseModel):
    # Service host & port
    HOST: str = os.getenv("AI_SERVICE_HOST", "0.0.0.0")
    PORT: int = int(os.getenv("AI_SERVICE_PORT", "8000"))
    
    # AI Provider configuration
    # Options: "none" (deterministic rule-based fallback), "openai", "gemini", "anthropic"
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "none").lower()
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    
    # Shared secret for internal Spring Boot -> FastAPI communication
    INTERNAL_API_KEY: str = os.getenv("INTERNAL_AI_KEY", "govstart-internal-ai-secret-2026")
    
    # AI Matching Weights (must sum to 100)
    DEFAULT_SECTOR_WEIGHT: float = 25.0
    DEFAULT_SKILLS_WEIGHT: float = 35.0
    DEFAULT_EXPERIENCE_WEIGHT: float = 20.0
    DEFAULT_ELIGIBILITY_WEIGHT: float = 20.0

    # Max allowed upload size in bytes (10MB)
    MAX_PDF_SIZE_BYTES: int = 10 * 1024 * 1024

settings = AIServiceSettings()
