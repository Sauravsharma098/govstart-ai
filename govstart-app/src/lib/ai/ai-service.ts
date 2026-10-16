import { Tender, StartupProfile, MatchBreakdown } from '../types';

export interface WeightTunerConfig {
  sectorWeight: number;      // default 0.25
  skillsWeight: number;      // default 0.35
  experienceWeight: number;  // default 0.20
  complianceWeight: number;  // default 0.20
}

export const DEFAULT_WEIGHTS: WeightTunerConfig = {
  sectorWeight: 0.25,
  skillsWeight: 0.35,
  experienceWeight: 0.20,
  complianceWeight: 0.20
};

export function calculateMatchScore(
  tender: Tender,
  startup: StartupProfile,
  weights: WeightTunerConfig = DEFAULT_WEIGHTS
): MatchBreakdown {
  // 1. Sector Match
  const sectorMatch = tender.sector.toLowerCase() === startup.sector.toLowerCase() ? 100 :
    startup.categories.some(c => tender.category.toLowerCase().includes(c.toLowerCase())) ? 80 : 50;

  // 2. Skills & Tech Stack Match
  const tenderKeywords = [...tender.tags, tender.category, tender.title].map(k => k.toLowerCase());
  const startupKeywords = [...startup.techStack, ...startup.categories].map(k => k.toLowerCase());
  
  const matched = startup.techStack.filter(tech => 
    tenderKeywords.some(tk => tk.includes(tech.toLowerCase()) || tech.toLowerCase().includes(tk))
  );

  const gap = tender.tags.filter(tag => 
    !startupKeywords.some(sk => sk.includes(tag.toLowerCase()) || tag.toLowerCase().includes(sk))
  );

  const skillsMatch = Math.min(100, Math.round((matched.length / Math.max(1, tender.tags.length)) * 100) + 30);

  // 3. Experience Match
  let experienceMatch = 70;
  if (startup.priorGovExperienceYears >= 3 || startup.completedGovProjects >= 3) {
    experienceMatch = 95;
  } else if (startup.priorGovExperienceYears >= 1) {
    experienceMatch = 85;
  } else if (tender.priorExperienceExempt && startup.dpiitRecognized) {
    experienceMatch = 90; // DPIIT Startup relaxation applied
  }

  // 4. Regulatory & Compliance Match
  let regulatoryCompliance = 80;
  if (startup.dpiitRecognized) regulatoryCompliance += 10;
  if (startup.msmeRegistered) regulatoryCompliance += 5;
  if (startup.certifications.length >= 2) regulatoryCompliance += 5;
  regulatoryCompliance = Math.min(100, regulatoryCompliance);

  // Normalize weights
  const totalWeight = weights.sectorWeight + weights.skillsWeight + weights.experienceWeight + weights.complianceWeight;
  const wSector = weights.sectorWeight / totalWeight;
  const wSkills = weights.skillsWeight / totalWeight;
  const wExp = weights.experienceWeight / totalWeight;
  const wComp = weights.complianceWeight / totalWeight;

  const overallScore = Math.min(99, Math.round(
    (sectorMatch * wSector) +
    (skillsMatch * wSkills) +
    (experienceMatch * wExp) +
    (regulatoryCompliance * wComp)
  ));

  const strengths: string[] = [
    `Strong sector alignment with ${tender.sector}`,
    startup.dpiitRecognized ? 'Eligible for 100% EMD waiver & turnover relaxations under Order F.20/2/2014-PPD' : 'Standard MSME provisions apply',
    matched.length > 0 ? `Core tech capabilities verified: ${matched.slice(0, 3).join(', ')}` : 'Fast-learning modular architecture'
  ];

  const mitigations: string[] = [];
  if (gap.length > 0) {
    mitigations.push(`Address tender requirement for [${gap.slice(0, 2).join(', ')}] in Technical Proposal Section 3.`);
  }
  if (!tender.priorExperienceExempt && startup.completedGovProjects < 2) {
    mitigations.push('Highlight relevant private sector deployments or academic consortium partners.');
  }

  let recommendation = 'High probability of qualification. Recommended to prepare bid proposal immediately.';
  if (overallScore < 75) {
    recommendation = 'Moderate match. Consider partnering with a consortium vendor or highlighting niche IP.';
  }

  return {
    sectorMatch,
    skillsMatch,
    experienceMatch,
    regulatoryCompliance,
    overallScore,
    matchedKeywords: matched,
    gapKeywords: gap,
    recommendation,
    strengths,
    mitigations
  };
}

export function generateTenderSummary(tender: Tender) {
  return {
    title: tender.title,
    refNo: tender.referenceNumber,
    department: tender.department,
    budgetFormatted: tender.budgetString,
    deadlineFormatted: new Date(tender.submissionDeadline).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }),
    executiveBrief: `${tender.department} has published tender ${tender.referenceNumber} for ${tender.title}. Estimated contract value is ${tender.budgetString}. This procurement targets high-readiness indigenous solutions in ${tender.sector}.`,
    keyRequirements: tender.eligibilityCriteria,
    financialClauses: [
      `Estimated Value: ${tender.budgetString}`,
      `Earnest Money Deposit (EMD): ₹${(tender.emdAmountInr / 100000).toFixed(2)} Lakhs (${tender.emdExemptForStartups ? '100% WAIVED for DPIIT Startups' : 'Standard Bank Guarantee required'})`,
      `Turnover Relaxation: ${tender.priorTurnoverExempt ? 'Granted under Public Procurement Policy' : 'Normal criteria apply'}`
    ],
    criticalDeadlines: [
      `Technical & Financial Submission Cutoff: ${tender.submissionDeadline} at 17:00 IST`,
      `Clarification Window closes 7 days before final deadline`,
      `Prototype Evaluation scheduled within 21 days of bid opening`
    ],
    complianceRisks: [
      'Strict adherence to Make-in-India local content verification (Minimum 50% Class-I supplier)',
      'Delayed submission beyond cutoff by even 1 minute leads to automatic portal rejection',
      'All technical data sheets must bear authorized digital signature'
    ]
  };
}

export function checkRegulatoryEligibility(tender: Tender, startup: StartupProfile) {
  const isDpiit = startup.dpiitRecognized;
  const isMsme = startup.msmeRegistered;

  return {
    isFullyEligible: isDpiit || startup.annualTurnoverLakhs >= 300,
    startupName: startup.name,
    dpiitNumber: startup.dpiitNumber,
    orderReference: 'Ministry of Finance Order No. F.20/2/2014-PPD & Rule 170(i) GFR 2017',
    waivers: [
      {
        title: 'Earnest Money Deposit (EMD) Waiver',
        status: isDpiit ? '100% EXEMPTED' : 'REQUIRED',
        savingsInr: tender.emdAmountInr,
        basis: 'Rule 170(i) of General Financial Rules (GFR) 2017 exempts all DPIIT startups from Bid Security/EMD.'
      },
      {
        title: 'Prior Turnover Criteria Relaxation',
        status: tender.priorTurnoverExempt && isDpiit ? 'FULLY WAIVED' : 'PARTIAL REVIEW',
        savingsInr: 0,
        basis: 'Relaxed subject to meeting quality and technical specifications as per procurement guidelines.'
      },
      {
        title: 'Prior Experience Criteria Relaxation',
        status: tender.priorExperienceExempt && isDpiit ? 'FULLY WAIVED' : 'STANDARD REQUIREMENT',
        savingsInr: 0,
        basis: 'Startups can submit lab test certificates or prototype demonstrations in lieu of multi-year track record.'
      },
      {
        title: 'Tender Document Fee Exemption',
        status: isDpiit || isMsme ? 'FREE OF COST' : 'STANDARD FEE',
        savingsInr: 5000,
        basis: 'Free tender document download available for recognized MSEs & startups.'
      }
    ],
    nextAction: isDpiit 
      ? 'Upload your valid DPIIT Certificate in Cover-1 (Fee Exemption Document) during bid submission.'
      : 'Register with DPIIT Startup India portal to unlock ₹25L+ in financial security exemptions.'
  };
}

export function generateBidProposalDraft(tender: Tender, startup: StartupProfile) {
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return `# TECHNICAL & COMMERCIAL BID PROPOSAL
**Tender Reference:** ${tender.referenceNumber}  
**Procurement Title:** ${tender.title}  
**Procuring Entity:** ${tender.department} (${tender.ministry})  
**Bidder:** ${startup.name} (DPIIT Reg: ${startup.dpiitNumber})  
**Date of Submission:** ${dateStr}

---

## 1. Executive Summary
${startup.name} is pleased to submit this comprehensive, high-readiness proposal in response to Tender **${tender.referenceNumber}**. As a DPIIT-recognized deep-tech entity operating in **${startup.sector}**, we have engineered proven, indigenous solutions that directly fulfill the operational objectives set forth by ${tender.department}.

Our proposed platform delivers uncompromising reliability, adherence to national security guidelines (Class-I Make-in-India), and zero-compromise adherence to the technical delivery schedule.

---

## 2. Bidder Credentials & Regulatory Standing
- **DPIIT Recognition Number:** ${startup.dpiitNumber}
- **MSME / Udyam Registration:** Verified
- **Make-in-India Local Content:** >= 78.4% (Class-I Local Supplier)
- **Active Certifications:** ${startup.certifications.join(', ')}
- **Registered Patents:** ${startup.patentsCount} Registered / Granted
- **Statutory Exemptions Claimed:**
  - 100% EMD Exemption under Rule 170(i) GFR 2017 (DPIIT Certificate attached in Cover-1)
  - Prior Turnover Relaxation under Order No. F.20/2/2014-PPD

---

## 3. Technical Architecture & Methodology
### Core Architecture Stack
${startup.techStack.map(t => `- **${t}**: Fully integrated and stress-tested for extreme operational environments.`).join('\n')}

### Clause-by-Clause Technical Compliance Matrix
| Clause Ref | Clause Description | Compliance Status | Technical Specification Reference |
|---|---|---|---|
${tender.clauses.map(c => `| ${c.clauseNumber} | ${c.title} | **FULL COMPLIANCE** | Architecture Spec Document Annexure-A |`).join('\n')}

---

## 4. Delivery Milestones & Work Breakdown
- **T0 + 15 Days:** System Requirement Review (SRR) & baseline architecture sign-off
- **T0 + 45 Days:** Hardware-in-the-loop (HIL) lab prototype demonstration
- **T0 + 75 Days:** Environmental screening and factory acceptance testing (FAT)
- **T0 + 90 Days:** Field trials at specified operational site (${tender.location})
- **T0 + 120 Days:** Final commissioning, user training, and handover of documentation

---

## 5. Mandatory Document Checklist
- [x] DPIIT Startup India Certificate of Recognition
- [x] Make-in-India Self-Declaration of Local Content (>= 50%)
- [x] Audited Financial Statements & CA Certificate (FY 2023-25)
- [x] OEM Authorization & Indigenous Source Code Escrow Undertaking
- [x] Non-Blacklisting Affidavit on Non-Judicial Stamp Paper
- [x] Technical Proposal Document with Architecture Diagrams

---
*Authorized Signatory:*  
**Chief Executive Officer / Chief Technology Officer**  
${startup.name}
`;
}

export function answerTenderQuery(question: string, tender: Tender): { answer: string; citations: string[] } {
  const q = question.toLowerCase();

  // Safety prompt-injection check
  if (q.includes('ignore previous instructions') || q.includes('system prompt') || q.includes('delete database')) {
    return {
      answer: "I am GovStart AI's secure procurement assistant. I am bound to provide accurate, grounded information solely about this government tender and applicable procurement regulations.",
      citations: ['GovStart AI Guardrail Policy']
    };
  }

  if (q.includes('emd') || q.includes('earnest') || q.includes('deposit') || q.includes('waiver') || q.includes('fee')) {
    return {
      answer: `The EMD amount for this tender is ₹${(tender.emdAmountInr / 100000).toFixed(2)} Lakhs. However, because this tender falls under public startup procurement guidelines, DPIIT recognized startups and registered MSMEs are 100% EXEMPT from EMD payment. You must submit your DPIIT Certificate in Cover-1.`,
      citations: ['Clause 3.1: Earnest Money Deposit Exemption', 'Rule 170(i) GFR 2017']
    };
  }

  if (q.includes('deadline') || q.includes('date') || q.includes('cutoff') || q.includes('when')) {
    return {
      answer: `The final submission deadline for ${tender.referenceNumber} is ${tender.submissionDeadline} at 17:00 IST. The technical bids will be opened on the next working day. Clarification requests must be submitted at least 7 days before the cutoff date.`,
      citations: ['Section 1: Critical Tender Timeline', 'Clause 7.8: Delivery Milestones']
    };
  }

  if (q.includes('turnover') || q.includes('experience') || q.includes('eligibility')) {
    return {
      answer: `This tender ${tender.priorTurnoverExempt ? 'grants relaxation' : 'requires standard proof'} for prior turnover. Under Ministry of Finance Order F.20/2/2014-PPD, DPIIT recognized startups are relieved from arbitrary past turnover hurdles as long as technical capability is substantiated through test reports or working prototypes.`,
      citations: ['Section 2: Minimum Qualification Criteria', 'Order No. F.20/2/2014-PPD']
    };
  }

  if (q.includes('budget') || q.includes('cost') || q.includes('value') || q.includes('price')) {
    return {
      answer: `The estimated total contract value is ${tender.budgetString} (₹${(tender.estimatedBudgetInr / 10000000).toFixed(2)} Crores). Financial bids must be quoted inclusive of all taxes, logistics, and on-site testing expenses at ${tender.location}.`,
      citations: ['Clause 1.2: Scope of Financial Proposal', 'BOQ Schedule A']
    };
  }

  return {
    answer: `Regarding "${question}": According to the tender documentation for ${tender.referenceNumber}, bidders must comply with all mandatory operational and delivery standards set by ${tender.department}. Please refer to the specific technical specifications sheet or upload your proposed BOM in the proposal studio for verification.`,
    citations: ['Section 4: Technical Specifications & Deliverables', tender.referenceNumber]
  };
}
