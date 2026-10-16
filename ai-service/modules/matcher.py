import json
import re
from typing import List, Dict, Any, Optional
from config import settings

class TenderMatcher:
    @staticmethod
    def _normalize_skill(skill: str) -> str:
        s = skill.lower().strip()
        s = re.sub(r"[^a-z0-9+#\.\s]", "", s)
        return s

    @classmethod
    def match_tender_with_startup(
        cls,
        startup: Dict[str, Any],
        tender: Dict[str, Any],
        weights: Optional[Dict[str, float]] = None
    ) -> Dict[str, Any]:
        """
        Deterministic, rule-backed AI matching engine with configurable weights.
        """
        if weights is None:
            weights = {
                "sector": settings.DEFAULT_SECTOR_WEIGHT,
                "skills": settings.DEFAULT_SKILLS_WEIGHT,
                "experience": settings.DEFAULT_EXPERIENCE_WEIGHT,
                "eligibility": settings.DEFAULT_ELIGIBILITY_WEIGHT,
            }

        # 1. Sector Alignment (Weight: 25%)
        startup_sector = str(startup.get("sector", "")).lower()
        tender_desc = str(tender.get("description", "")).lower()
        tender_title = str(tender.get("title", "")).lower()
        tender_category = str(tender.get("category", "")).lower()

        sector_score = 0.0
        # Direct or partial sector match
        if startup_sector and (startup_sector in tender_desc or startup_sector in tender_title or startup_sector in tender_category):
            sector_score = 100.0
        elif any(token in tender_desc or token in tender_title for token in startup_sector.split() if len(token) > 3):
            sector_score = 75.0
        else:
            # Check domain keyword overlaps
            domain_synonyms = {
                "defence": ["military", "tactical", "security", "surveillance", "threat", "drdo", "uav", "aerospace"],
                "health": ["medical", "clinic", "hospital", "patient", "diagnostic", "nhm", "phc", "telemedicine", "dialysis"],
                "energy": ["solar", "cleantech", "renewable", "microgrid", "battery", "storage", "seci", "power"],
                "agri": ["crop", "farm", "soil", "harvest", "icar", "drone", "agriculture"],
                "cyber": ["security", "zero-trust", "network", "firewall", "ebpf", "encryption", "cert-in", "endpoint"],
                "city": ["traffic", "municipal", "waste", "iot", "urban", "smart city"]
            }
            matched_synonym = False
            for key, syns in domain_synonyms.items():
                if key in startup_sector:
                    if any(s in tender_desc or s in tender_title for s in syns):
                        sector_score = 85.0
                        matched_synonym = True
                        break
            if not matched_synonym:
                sector_score = 30.0

        # 2. Skills & Capabilities Overlap (Weight: 35%)
        raw_startup_skills = startup.get("primary_skills", [])
        if isinstance(raw_startup_skills, str):
            try:
                raw_startup_skills = json.loads(raw_startup_skills)
            except Exception:
                raw_startup_skills = [s.strip() for s in raw_startup_skills.split(",") if s.strip()]

        raw_tender_skills = tender.get("required_skills", "")
        if isinstance(raw_tender_skills, str):
            tender_skills_list = [s.strip() for s in raw_tender_skills.split(",") if s.strip()]
        else:
            tender_skills_list = list(raw_tender_skills or [])

        norm_startup_skills = {cls._normalize_skill(s): s for s in raw_startup_skills}
        norm_tender_skills = {cls._normalize_skill(s): s for s in tender_skills_list}

        matched_skills = []
        missing_requirements = []

        for norm_t_skill, orig_t_skill in norm_tender_skills.items():
            matched = False
            for norm_s_skill, orig_s_skill in norm_startup_skills.items():
                if norm_t_skill in norm_s_skill or norm_s_skill in norm_t_skill:
                    matched = True
                    matched_skills.append(orig_t_skill)
                    break
            if not matched:
                missing_requirements.append(orig_t_skill)

        if tender_skills_list:
            skills_ratio = len(matched_skills) / len(tender_skills_list)
            skills_score = min(100.0, skills_ratio * 100.0)
        else:
            skills_score = 70.0

        # 3. Experience & Scale Match (Weight: 20%)
        experience_score = 50.0
        founded_year = startup.get("founded_year", 2024)
        operating_years = max(1, 2026 - int(founded_year or 2024))
        if operating_years >= 3:
            experience_score += 25.0
        elif operating_years >= 1:
            experience_score += 15.0

        past_exp = str(startup.get("past_experience", "")).strip()
        if len(past_exp) > 50:
            experience_score += 25.0
        experience_score = min(100.0, experience_score)

        # 4. Regulatory & Eligibility Match (Weight: 20%)
        eligibility_score = 40.0
        is_dpiit = bool(startup.get("dpiit_recognized", False))
        if is_dpiit:
            eligibility_score += 40.0  # Public Procurement Policy for Startups gives relaxation

        turnover = float(startup.get("annual_turnover", 0.0) or 0.0)
        tender_budget = float(tender.get("budget_inr", 0.0) or 0.0)
        
        # If DPIIT recognized, turnover exemption applies; else check turnover ratio
        if is_dpiit or turnover >= (tender_budget * 0.25):
            eligibility_score += 20.0
        eligibility_score = min(100.0, eligibility_score)

        # Composite Relevance Score calculation
        total_weight = weights["sector"] + weights["skills"] + weights["experience"] + weights["eligibility"]
        weighted_sum = (
            (sector_score * weights["sector"]) +
            (skills_score * weights["skills"]) +
            (experience_score * weights["experience"]) +
            (eligibility_score * weights["eligibility"])
        )
        final_score = round(weighted_sum / total_weight, 1)

        # Status categorization
        if final_score >= 80.0:
            status = "HIGHLY_RELEVANT"
        elif final_score >= 55.0:
            status = "MODERATE"
        else:
            status = "LOW_MATCH"

        # Generate transparent explanation
        explanation_parts = [
            f"Overall AI Match Score: {final_score}%.",
            f"Sector Alignment: {round(sector_score)}% based on startup specialization in '{startup.get('sector', 'General')}' vs tender domain.",
            f"Technical Skills: {len(matched_skills)} of {len(tender_skills_list)} mandatory competencies matched.",
        ]
        if matched_skills:
            explanation_parts.append(f"Strongly aligned areas: {', '.join(matched_skills[:4])}.")
        if missing_requirements:
            explanation_parts.append(f"Gaps identified to bridge or partner for: {', '.join(missing_requirements[:3])}.")
        if is_dpiit:
            explanation_parts.append("DPIIT recognition verified: eligible for prior turnover and EMD exemptions under Government Startup Policy.")

        return {
            "relevance_score": final_score,
            "preliminary_status": status,
            "matched_skills": matched_skills,
            "missing_requirements": missing_requirements,
            "component_scores": {
                "sector": sector_score,
                "skills": skills_score,
                "experience": experience_score,
                "eligibility": eligibility_score,
            },
            "explanation": " ".join(explanation_parts)
        }
