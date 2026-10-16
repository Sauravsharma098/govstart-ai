from typing import Dict, Any, List

class EligibilityChecker:
    @classmethod
    def check_eligibility(cls, startup: Dict[str, Any], tender: Dict[str, Any]) -> Dict[str, Any]:
        """
        Evaluates startup against tender criteria.
        Returns MET, NOT MET, or UNKNOWN with required evidence and verification status.
        """
        criteria_results = []
        is_dpiit = bool(startup.get("dpiit_recognized", False))
        startup_turnover = float(startup.get("annual_turnover", 0.0) or 0.0)
        tender_budget = float(tender.get("budget_inr", 0.0) or 0.0)
        founded_year = int(startup.get("founded_year", 2024) or 2024)
        operating_years = max(1, 2026 - founded_year)
        past_exp = str(startup.get("past_experience", "")).strip()

        # 1. DPIIT Startup Recognition Criterion
        criteria_results.append({
            "criterion": "DPIIT Startup Recognition & Prior Turnover Exemption",
            "status": "MET" if is_dpiit else "NOT_MET",
            "reason": (
                f"Startup holds registered DPIIT recognition ({startup.get('dpiit_number', 'Active')}). Eligible for Public Procurement Policy exemptions."
                if is_dpiit else
                "No DPIIT recognition certificate provided. Standard commercial turnover requirements apply."
            ),
            "required_evidence": "DPIIT Certificate of Recognition issued by Ministry of Commerce & Industry",
            "is_verified": is_dpiit
        })

        # 2. Financial Turnover / Solvency Criterion
        required_min_turnover = tender_budget * 0.20
        if is_dpiit:
            criteria_results.append({
                "criterion": "Annual Financial Turnover Compliance",
                "status": "MET",
                "reason": "Exemption granted for DPIIT-recognized startups under Department of Expenditure OM No. F.20/2/2014-PPD(Pt.).",
                "required_evidence": "Startup Exemption Undertaking & DPIIT Certificate",
                "is_verified": True
            })
        elif startup_turnover >= required_min_turnover:
            criteria_results.append({
                "criterion": "Annual Financial Turnover Compliance",
                "status": "MET",
                "reason": f"Annual turnover (INR {startup_turnover:,.2f}) meets or exceeds the 20% tender threshold (INR {required_min_turnover:,.2f}).",
                "required_evidence": "CA Audited Balance Sheets for last 3 financial years",
                "is_verified": startup.get("verified_status") == "VERIFIED"
            })
        else:
            criteria_results.append({
                "criterion": "Annual Financial Turnover Compliance",
                "status": "NOT_MET",
                "reason": f"Annual turnover (INR {startup_turnover:,.2f}) is below the required minimum threshold (INR {required_min_turnover:,.2f}).",
                "required_evidence": "Audited Financial Statements or Joint Venture Consortium Agreement",
                "is_verified": False
            })

        # 3. Minimum Operational Track Record
        if operating_years >= 1:
            criteria_results.append({
                "criterion": "Minimum Operational Track Record (Incorporation)",
                "status": "MET",
                "reason": f"Entity founded in {founded_year} ({operating_years} year(s) active). Satisfies legal existence requirement.",
                "required_evidence": "MCA Certificate of Incorporation & MOA/AOA",
                "is_verified": True
            })
        else:
            criteria_results.append({
                "criterion": "Minimum Operational Track Record (Incorporation)",
                "status": "UNKNOWN",
                "reason": "Incorporated less than 12 months ago; confirm tender specific track record relaxation rules.",
                "required_evidence": "Certificate of Incorporation",
                "is_verified": False
            })

        # 4. Domain Experience & Past Prototype Evidence
        if len(past_exp) > 30:
            criteria_results.append({
                "criterion": "Prior Domain Experience & Deployment Proof",
                "status": "MET",
                "reason": "Verified or declared past delivery documented in company profile.",
                "required_evidence": "Client Satisfactory Completion Certificate / Work Orders",
                "is_verified": startup.get("verified_status") == "VERIFIED"
            })
        else:
            criteria_results.append({
                "criterion": "Prior Domain Experience & Deployment Proof",
                "status": "UNKNOWN",
                "reason": "Profile has not documented prior reference deployments. May require clarification submission.",
                "required_evidence": "Prototype Demonstration Report or Client Work Orders",
                "is_verified": False
            })

        # 5. Technical Specifications & Certifications
        certifications = str(startup.get("certifications", ""))
        has_iso = "iso" in certifications.lower() or "cemilac" in certifications.lower() or "cdsco" in certifications.lower() or "bis" in certifications.lower()
        criteria_results.append({
            "criterion": "Quality & Regulatory Certifications (ISO / Industry Standard)",
            "status": "MET" if has_iso else "UNKNOWN",
            "reason": (
                f"Documented quality certificates: {certifications}."
                if has_iso else
                "Specific standard certifications not yet verified in company vault."
            ),
            "required_evidence": "Accredited Laboratory Test Certificates & Quality Certifications",
            "is_verified": has_iso and startup.get("verified_status") == "VERIFIED"
        })

        # Calculate Overall Status
        statuses = [item["status"] for item in criteria_results]
        if "NOT_MET" in statuses:
            overall = "NOT_MET"
        elif all(s == "MET" for s in statuses):
            overall = "MET"
        else:
            overall = "UNKNOWN"

        met_count = sum(1 for s in statuses if s == "MET")
        total_count = len(statuses)

        return {
            "overall_status": overall,
            "met_criteria_count": met_count,
            "total_criteria_count": total_count,
            "items": criteria_results,
            "disclaimer": "Preliminary automated assessment only. Final legal qualification is subject to competent procurement authority evaluation."
        }
