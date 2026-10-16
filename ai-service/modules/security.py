import re
from typing import Tuple

# Common prompt injection triggers and adversarial prefixes
INJECTION_PATTERNS = [
    r"ignore\s+(all\s+)?(previous|prior|above)\s+instructions?",
    r"disregard\s+(all\s+)?(previous|prior|above)",
    r"bypass\s+(all\s+)?(security|rules|filters)",
    r"system\s*:\s*you\s+are\s+now",
    r"you\s+are\s+now\s+a\s+hacker",
    r"act\s+as\s+an\s+unrestricted\s+ai",
    r"reveal\s+(the\s+)?(system\s+prompt|internal\s+keys?|passwords?)",
    r"jailbreak",
    r"DAN\s+mode",
    r"<script\b[^>]*>",
]

COMPILED_INJECTIONS = [re.compile(p, re.IGNORECASE) for p in INJECTION_PATTERNS]

def sanitize_input(text: str) -> str:
    """Sanitize input string by removing hazardous HTML tags and control characters."""
    if not text:
        return ""
    # Strip dangerous HTML tags
    cleaned = re.sub(r"<[^>]*?>", "", text)
    # Strip null bytes and non-printable control characters (except newline, carriage return, tab)
    cleaned = "".join(c for c in cleaned if c.isprintable() or c in ("\n", "\r", "\t"))
    return cleaned.strip()

def check_prompt_injection(user_input: str) -> Tuple[bool, str]:
    """
    Checks if input contains known prompt injection attempts.
    Returns (is_injected: bool, flag_reason: str).
    """
    if not user_input:
        return False, ""
    
    for pattern in COMPILED_INJECTIONS:
        if pattern.search(user_input):
            return True, f"Blocked potential prompt injection pattern matching: '{pattern.pattern}'"
            
    # Check for excessive repetition attack (DDoS or context stuffing)
    if len(user_input) > 25000:
        return True, "Input exceeds maximum character length security limit (25,000 characters)."
        
    return False, ""
