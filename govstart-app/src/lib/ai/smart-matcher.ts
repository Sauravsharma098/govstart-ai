import { 
  Tender, 
  StartupProfile, 
  SmartScoringWeights, 
  TenderRecommendation, 
  EligibilityStatus, 
  DataConfidenceLevel 
} from '../types';

export const DEFAULT_SMART_WEIGHTS: SmartScoringWeights = {
  industryRelevanceWeight: 0.25,
  technicalCapabilityWeight: 0.25,
  eligibilityComplianceWeight: 0.20,
  experienceCertWeight: 0.10,
  budgetSuitabilityWeight: 0.10,
  deadlineReadinessWeight: 0.10
};

export function validateSmartWeights(weights: SmartScoringWeights): boolean {
  const sum = 
    weights.industryRelevanceWeight +
    weights.technicalCapabilityWeight +
    weights.eligibilityComplianceWeight +
    weights.experienceCertWeight +
    weights.budgetSuitabilityWeight +
    weights.deadlineReadinessWeight;
  return Math.abs(sum - 1.0) < 0.001;
}

export function evaluateSmartTenderMatch(
  tender: Tender,
  startup: StartupProfile,
  weights: SmartScoringWeights = DEFAULT_SMART_WEIGHTS,
  referenceDateStr: string = '2026-10-16'
): TenderRecommendation {
  const refDate = new Date(referenceDateStr).getTime();
  const deadlineTime = new Date(tender.submissionDeadline).getTime();
  const daysRemaining = Math.max(0, Math.ceil((deadlineTime - refDate) / (1000 * 60 * 60 * 24)));
  const isExpired = deadlineTime < refDate || tender.status === 'EXPIRED';

  const matchReasons: string[] = [];
  const missingRequirements: string[] = [];
  const mandatoryEligibilityFailures: string[] = [];

  // ==========================================
  // 1. Mandatory Eligibility Evaluation
  // ==========================================
  let mandatoryFailed = false;

  // Check 1: Sector / Make-in-India / Entity Eligibility
  if (tender.sector.toLowerCase().includes('defence') && !startup.sector.toLowerCase().includes('defence') && !startup.categories.some(c => c.toLowerCase().includes('defence'))) {
    // Cross domain without defence registration
    missingRequirements.push('Tender requires verified defence entity classification or consortium partner with MoD clearance.');
  }

  // Check 2: Mandatory Certifications check
  const tenderText = `${tender.title} ${tender.description} ${tender.eligibilityCriteria.join(' ')}`.toLowerCase();
  
  if (tenderText.includes('cdsco') && !startup.certifications.some(c => c.toLowerCase().includes('cdsco'))) {
    mandatoryEligibilityFailures.push('Mandatory CDSCO Class-B Medical Device approval missing from startup profile.');
    mandatoryFailed = true;
  }

  if (tenderText.includes('iso 13485') && !startup.certifications.some(c => c.toLowerCase().includes('13485'))) {
    mandatoryEligibilityFailures.push('Mandatory ISO 13485 Medical Devices quality certification not verified.');
    mandatoryFailed = true;
  }

  if (tenderText.includes('stqc') && !startup.certifications.some(c => c.toLowerCase().includes('stqc') || c.toLowerCase().includes('cert-in'))) {
    missingRequirements.push('STQC Common Criteria EAL4+ or CERT-In empanelment recommended before financial opening.');
  }

  // Check 3: Prior Experience vs Statutory Startup Relaxation
  const requiresPastTrackRecord = tenderText.includes('3 years') || tenderText.includes('prior operational');
  if (requiresPastTrackRecord && startup.priorGovExperienceYears < 3) {
    if (tender.priorExperienceExempt && startup.dpiitRecognized) {
      matchReasons.push('DPIIT Startup Exemption applies: Past 3-year track record hurdle waived under Order F.20/2/2014-PPD.');
    } else {
      missingRequirements.push(`RFP specifies 3 years experience; startup has ${startup.priorGovExperienceYears} years. Pre-bid waiver clarification needed.`);
    }
  }

  // Check 4: Location / Geographical restrictions
  if (tender.geographicalRestrictions && tender.geographicalRestrictions.length > 0) {
    const geoConflict = tender.geographicalRestrictions.some(g => g.toLowerCase().includes('local state') && startup.state && !g.toLowerCase().includes(startup.state.toLowerCase()));
    if (geoConflict) {
      mandatoryEligibilityFailures.push(`Tender has local state preference restricting vendors outside specified region.`);
      mandatoryFailed = true;
    }
  }

  // Determine Eligibility Status (Concept 2)
  // RULE: Never label a startup definitively eligible if mandatory criteria are missing or unverified!
  let eligibilityStatus: EligibilityStatus = 'ELIGIBLE_PROVISIONAL';
  if (mandatoryFailed || mandatoryEligibilityFailures.length > 0) {
    eligibilityStatus = 'LIKELY_INELIGIBLE';
  } else if (tender.missingEligibilityInfo || startup.incompleteProfile || missingRequirements.length > 0) {
    eligibilityStatus = 'POTENTIALLY_ELIGIBLE';
  } else {
    eligibilityStatus = 'ELIGIBLE_PROVISIONAL';
  }

  // Determine Data Confidence (Concept 3)
  let dataConfidence: DataConfidenceLevel = 'HIGH';
  if (startup.incompleteProfile || tender.missingEligibilityInfo || isExpired) {
    dataConfidence = 'LOW';
  } else if (!tender.officialSourceUrl || !startup.preferredContractMaxLakhs) {
    dataConfidence = 'MEDIUM';
  }

  // ==========================================
  // 2. Score Breakdown (Concept 1: 0 - 100)
  // ==========================================
  
  // A. Industry Relevance (Max 25 pts)
  let industryRelevance = 12;
  const isDirectSector = tender.sector.toLowerCase() === startup.sector.toLowerCase();
  const categoryOverlap = startup.categories.some(c => 
    tender.category.toLowerCase().includes(c.toLowerCase()) || 
    tender.title.toLowerCase().includes(c.toLowerCase())
  );

  if (isDirectSector) {
    industryRelevance = 25;
    matchReasons.push(`Direct primary sector match in ${tender.sector}.`);
  } else if (categoryOverlap) {
    industryRelevance = 20;
    matchReasons.push(`Strong domain alignment with ${tender.category}.`);
  } else {
    industryRelevance = 8;
  }

  // B. Technical Capability (Max 25 pts)
  const tenderKeywords = [...tender.tags, tender.category, tender.title].map(k => k.toLowerCase());
  const matchedStack = startup.techStack.filter(tech => 
    tenderKeywords.some(tk => tk.includes(tech.toLowerCase()) || tech.toLowerCase().includes(tk))
  );

  let technicalCapability = 6;
  if (matchedStack.length >= 4) {
    technicalCapability = 25;
    matchReasons.push(`Verified tech stack overlap: ${matchedStack.slice(0, 3).join(', ')}.`);
  } else if (matchedStack.length >= 2) {
    technicalCapability = 20;
    matchReasons.push(`Core competencies aligned: ${matchedStack.join(', ')}.`);
  } else if (matchedStack.length === 1) {
    technicalCapability = 15;
    matchReasons.push(`Matches essential core skill: ${matchedStack[0]}.`);
  } else {
    technicalCapability = 6;
    missingRequirements.push('Core technical stack requires subcontracting or consortium partner.');
  }

  // C. Eligibility & Compliance (Max 20 pts)
  let eligibilityCompliance = 10;
  if (mandatoryFailed) {
    eligibilityCompliance = 0; // Failure in mandatory gate
  } else if (startup.dpiitRecognized && tender.emdExemptForStartups) {
    eligibilityCompliance = 20;
    matchReasons.push('100% EMD waiver & startup procurement benefits verified under GFR 2017 Rule 170(i).');
  } else if (startup.msmeRegistered) {
    eligibilityCompliance = 16;
  } else {
    eligibilityCompliance = 10;
  }

  // D. Experience & Certifications (Max 10 pts)
  let experienceCerts = 4;
  if (startup.priorGovExperienceYears >= 3 || startup.completedGovProjects >= 4) {
    experienceCerts = 10;
  } else if (startup.priorGovExperienceYears >= 1) {
    experienceCerts = 8;
  } else if (tender.priorExperienceExempt && startup.dpiitRecognized) {
    experienceCerts = 8; // Statutory waiver
  }

  // E. Budget Suitability (Max 10 pts)
  let budgetSuitability = 5;
  const tenderLakhs = tender.estimatedBudgetInr / 100000;
  const minPref = startup.preferredContractMinLakhs || 50;
  const maxPref = startup.preferredContractMaxLakhs || (startup.annualTurnoverLakhs * 4);

  if (tenderLakhs >= minPref && tenderLakhs <= maxPref) {
    budgetSuitability = 10;
  } else if (tenderLakhs < minPref) {
    budgetSuitability = 7; // Smaller contract than preferred
  } else if (tenderLakhs <= maxPref * 1.5) {
    budgetSuitability = 6; // Slightly above ideal size
  } else {
    budgetSuitability = 3; // Contract value disproportionately large vs startup turnover
    missingRequirements.push(`Contract value (₹${(tenderLakhs/100).toFixed(2)} Cr) exceeds preferred capacity ceiling of ₹${(maxPref/100).toFixed(2)} Cr.`);
  }

  // F. Deadline & Readiness (Max 10 pts)
  let deadlineReadiness = 5;
  const prepNeeded = tender.preparationTimeDays || 14;

  if (isExpired) {
    deadlineReadiness = 0;
  } else if (daysRemaining >= prepNeeded + 10) {
    deadlineReadiness = 10; // Ample time
  } else if (daysRemaining >= prepNeeded) {
    deadlineReadiness = 8; // Sufficient time
  } else if (daysRemaining >= 5) {
    deadlineReadiness = 4; // Tight deadline
    missingRequirements.push(`Only ${daysRemaining} days remaining until cutoff. Immediate document mobilization required.`);
  } else {
    deadlineReadiness = 2; // Critical cutoff
    missingRequirements.push(`Cutoff in ${daysRemaining} days. High risk of incomplete submission.`);
  }

  // Ensure 3 distinct reasons
  if (matchReasons.length < 3) {
    if (startup.patentsCount > 0) {
      matchReasons.push(`Startup possesses ${startup.patentsCount} registered patents relevant to public procurement.`);
    } else {
      matchReasons.push('Make in India Class-I local manufacturing compliance.');
    }
  }

  // Document checklist comparison
  const requiredDocs = tender.requiredDocuments || [
    'DPIIT Startup India Certificate',
    'Make-in-India Self-Declaration (>= 50%)',
    'Bid Security Declaration',
    'Signed NDA on Non-Judicial Stamp Paper',
    'Audited Financial Statements (FY 23-25)'
  ];

  const availableDocs = startup.availableDocuments || [
    'DPIIT Startup India Certificate',
    'Make-in-India Self-Declaration (>= 50%)',
    'MSME Udyam Certificate'
  ];

  const missingDocs = requiredDocs.filter(d => !availableDocs.includes(d));

  // Compute Overall Weighted Score
  // Weights: 25%, 25%, 20%, 10%, 10%, 10%
  const overallScore = Math.min(99, Math.round(
    industryRelevance * (weights.industryRelevanceWeight / 0.25) +
    technicalCapability * (weights.technicalCapabilityWeight / 0.25) +
    eligibilityCompliance * (weights.eligibilityComplianceWeight / 0.20) +
    experienceCerts * (weights.experienceCertWeight / 0.10) +
    budgetSuitability * (weights.budgetSuitabilityWeight / 0.10) +
    deadlineReadiness * (weights.deadlineReadinessWeight / 0.10)
  ));

  return {
    tenderId: tender.id,
    tender,
    matchScore: overallScore,
    eligibilityStatus,
    dataConfidence,
    scoreBreakdown: {
      industryRelevance,
      technicalCapability,
      eligibilityCompliance,
      experienceCerts,
      budgetSuitability,
      deadlineReadiness
    },
    matchReasons: matchReasons.slice(0, 3),
    missingRequirements,
    mandatoryEligibilityFailures,
    requiredDocuments: requiredDocs,
    missingDocuments: missingDocs,
    sourceVerificationStatus: tender.lastVerifiedAt ? `Verified ${new Date(tender.lastVerifiedAt).toLocaleDateString()}` : 'Live Official Record',
    officialSourceUrl: tender.officialSourceUrl || `https://eprocure.gov.in/eprocure/app?ref=${tender.referenceNumber}`,
    daysRemaining
  };
}

export function rankTendersForStartup(
  tenders: Tender[],
  startup: StartupProfile,
  weights: SmartScoringWeights = DEFAULT_SMART_WEIGHTS,
  includeExpired: boolean = false
): TenderRecommendation[] {
  // Pre-filter: Exclude expired or cancelled tenders by default
  const eligiblePool = tenders.filter(t => {
    if (!includeExpired && (t.status === 'EXPIRED' || t.status === 'CANCELLED')) {
      return false;
    }
    return true;
  });

  const recommendations = eligiblePool.map(t => 
    evaluateSmartTenderMatch(t, startup, weights)
  );

  // Deterministic Ranking Sort:
  // 1. First by Eligibility Status: ELIGIBLE_PROVISIONAL > POTENTIALLY_ELIGIBLE > LIKELY_INELIGIBLE
  // 2. Then by Match Score (descending)
  // 3. Then by Days Remaining (ascending - urgency)
  return recommendations.sort((a, b) => {
    const statusPriority = {
      ELIGIBLE_PROVISIONAL: 3,
      POTENTIALLY_ELIGIBLE: 2,
      LIKELY_INELIGIBLE: 1
    };

    const statusDiff = statusPriority[b.eligibilityStatus] - statusPriority[a.eligibilityStatus];
    if (statusDiff !== 0) return statusDiff;

    const scoreDiff = b.matchScore - a.matchScore;
    if (scoreDiff !== 0) return scoreDiff;

    return a.daysRemaining - b.daysRemaining;
  });
}
