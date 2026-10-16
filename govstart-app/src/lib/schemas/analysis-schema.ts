import { z } from 'zod';

export const ScopeFactSchema = z.object({
  fact: z.string().min(1),
  sourceExcerpt: z.string(),
  pageRef: z.number().optional(),
  aiInterpretation: z.string()
});

export const ImportantDateSchema = z.object({
  event: z.string().min(1),
  dateString: z.string(),
  isMandatoryCutoff: z.boolean(),
  sourceExcerpt: z.string(),
  pageRef: z.number().optional(),
  aiNote: z.string().optional()
});

export const EligibilityCriterionSchema = z.object({
  id: z.string(),
  criterion: z.string().min(1),
  isMandatory: z.boolean(),
  sourceExcerpt: z.string(),
  pageRef: z.number().optional(),
  startupCompliance: z.enum(['COMPLIANT', 'NON_COMPLIANT', 'PARTIAL', 'EXEMPTION_APPLICABLE', 'UNVERIFIABLE']),
  complianceReason: z.string(),
  exemptionBasis: z.string().optional()
});

export const DisqualifierRiskSchema = z.object({
  riskFactor: z.string().min(1),
  severity: z.enum(['CRITICAL', 'HIGH', 'MEDIUM']),
  sourceExcerpt: z.string(),
  pageRef: z.number().optional(),
  aiAdvisory: z.string(),
  disclaimer: z.string()
});

export const ContradictionItemSchema = z.object({
  clauseA: z.object({
    text: z.string(),
    pageRef: z.number().optional(),
    clauseNo: z.string().optional()
  }),
  clauseB: z.object({
    text: z.string(),
    pageRef: z.number().optional(),
    clauseNo: z.string().optional()
  }),
  conflictDescription: z.string(),
  suggestedClarification: z.string()
});

export const MissingInfoItemSchema = z.object({
  item: z.string(),
  impact: z.string(),
  recommendation: z.string()
});

export const PreparationChecklistItemSchema = z.object({
  id: z.string(),
  category: z.enum(['STATUTORY_FEE_EXEMPTION', 'TECHNICAL_ENCLOSURE', 'FINANCIAL_UNDERTAKING', 'CERTIFICATION']),
  item: z.string(),
  mandatory: z.boolean(),
  sourceExcerpt: z.string(),
  pageRef: z.number().optional(),
  completed: z.boolean()
});

export const TenderAnalysisResultSchema = z.object({
  documentMeta: z.object({
    fileName: z.string(),
    fileSizeBytes: z.number(),
    totalPages: z.number(),
    characterCount: z.number(),
    extractionStatus: z.enum(['SUCCESS', 'SCANNED_IMAGE_WARNING', 'PARTIAL', 'ERROR', 'OVERSIZED_ERROR']),
    warningMessage: z.string().optional(),
    uploadedAt: z.string()
  }),
  title: z.string(),
  referenceNumber: z.string(),
  procuringEntity: z.string(),
  estimatedBudget: z.object({
    amountInr: z.number(),
    formatted: z.string(),
    sourceExcerpt: z.string().optional(),
    pageRef: z.number().optional()
  }),
  scopeOfWork: z.array(ScopeFactSchema),
  importantDates: z.array(ImportantDateSchema),
  eligibility: z.object({
    mandatory: z.array(EligibilityCriterionSchema),
    desirable: z.array(EligibilityCriterionSchema)
  }),
  disqualifiers: z.array(DisqualifierRiskSchema),
  anomalies: z.object({
    missingInformation: z.array(MissingInfoItemSchema),
    contradictions: z.array(ContradictionItemSchema)
  }),
  deterministicMatch: z.object({
    overallScore: z.number(),
    sectorScore: z.number(),
    skillsScore: z.number(),
    experienceScore: z.number(),
    regulatoryScore: z.number(),
    scoreBreakdownExplanation: z.array(z.string()),
    unverifiableFactors: z.array(z.string())
  }),
  preparationChecklist: z.array(PreparationChecklistItemSchema),
  submissionInstructions: z.object({
    portalName: z.string(),
    modeOfSubmission: z.string(),
    coverBreakdown: z.array(z.object({
      coverNumber: z.number(),
      title: z.string(),
      contents: z.array(z.string())
    })),
    deadlinesWarning: z.string()
  })
});
