export type ExtractionStatus = 'SUCCESS' | 'SCANNED_IMAGE_WARNING' | 'PARTIAL' | 'ERROR' | 'OVERSIZED_ERROR';

export type StartupComplianceStatus = 
  | 'COMPLIANT' 
  | 'NON_COMPLIANT' 
  | 'PARTIAL' 
  | 'EXEMPTION_APPLICABLE' 
  | 'UNVERIFIABLE';

export interface DocumentMeta {
  fileName: string;
  fileSizeBytes: number;
  totalPages: number;
  characterCount: number;
  extractionStatus: ExtractionStatus;
  warningMessage?: string;
  uploadedAt: string;
}

export interface ScopeFact {
  fact: string;
  sourceExcerpt: string;
  pageRef?: number;
  aiInterpretation: string;
}

export interface ImportantDate {
  event: string;
  dateString: string;
  isMandatoryCutoff: boolean;
  sourceExcerpt: string;
  pageRef?: number;
  aiNote?: string;
}

export interface EligibilityCriterion {
  id: string;
  criterion: string;
  isMandatory: boolean;
  sourceExcerpt: string;
  pageRef?: number;
  startupCompliance: StartupComplianceStatus;
  complianceReason: string;
  exemptionBasis?: string;
}

export interface DisqualifierRisk {
  riskFactor: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  sourceExcerpt: string;
  pageRef?: number;
  aiAdvisory: string;
  disclaimer: string;
}

export interface ContradictionItem {
  clauseA: { text: string; pageRef?: number; clauseNo?: string };
  clauseB: { text: string; pageRef?: number; clauseNo?: string };
  conflictDescription: string;
  suggestedClarification: string;
}

export interface MissingInfoItem {
  item: string;
  impact: string;
  recommendation: string;
}

export interface PreparationChecklistItem {
  id: string;
  category: 'STATUTORY_FEE_EXEMPTION' | 'TECHNICAL_ENCLOSURE' | 'FINANCIAL_UNDERTAKING' | 'CERTIFICATION';
  item: string;
  mandatory: boolean;
  sourceExcerpt: string;
  pageRef?: number;
  completed: boolean;
}

export interface SubmissionInstructions {
  portalName: string;
  modeOfSubmission: string;
  coverBreakdown: Array<{ coverNumber: number; title: string; contents: string[] }>;
  deadlinesWarning: string;
}

export interface DeterministicMatch {
  overallScore: number;
  sectorScore: number;
  skillsScore: number;
  experienceScore: number;
  regulatoryScore: number;
  scoreBreakdownExplanation: string[];
  unverifiableFactors: string[];
}

export interface TenderAnalysisResult {
  documentMeta: DocumentMeta;
  title: string;
  referenceNumber: string;
  procuringEntity: string;
  estimatedBudget: {
    amountInr: number;
    formatted: string;
    sourceExcerpt?: string;
    pageRef?: number;
  };
  scopeOfWork: ScopeFact[];
  importantDates: ImportantDate[];
  eligibility: {
    mandatory: EligibilityCriterion[];
    desirable: EligibilityCriterion[];
  };
  disqualifiers: DisqualifierRisk[];
  anomalies: {
    missingInformation: MissingInfoItem[];
    contradictions: ContradictionItem[];
  };
  deterministicMatch: DeterministicMatch;
  preparationChecklist: PreparationChecklistItem[];
  submissionInstructions: SubmissionInstructions;
}

export interface DocumentChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  factsExtracted?: Array<{ fact: string; pageRef?: number; sourceExcerpt: string }>;
  aiInterpretation?: string;
  unverifiedWarning?: string;
  timestamp: string;
}
