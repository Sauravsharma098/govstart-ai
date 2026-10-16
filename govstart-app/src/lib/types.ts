export type UserRole = 'STARTUP' | 'MSME' | 'SUPPLIER' | 'CONSULTANT' | 'OFFICER' | 'ADMIN';

export type DataTrustLevel = 'VERIFIED_OFFICIAL' | 'IMPORTED_PENDING' | 'DEMO_RECORD';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization: string;
  avatar?: string;
  startupProfileId?: string;
  officerDepartmentId?: string;
  assignedClientIds?: string[];
  consultancyFirm?: string;
  phone?: string;
}

export interface StartupProfile {
  id: string;
  name: string;
  dpiitNumber: string;
  incorporationDate: string;
  sector: string;
  categories: string[];
  description: string;
  website: string;
  city?: string;
  state?: string;
  annualTurnoverLakhs: number;
  preferredContractMinLakhs?: number;
  preferredContractMaxLakhs?: number;
  dpiitRecognized: boolean;
  msmeRegistered: boolean;
  priorGovExperienceYears: number;
  completedGovProjects: number;
  certifications: string[];
  techStack: string[];
  patentsCount: number;
  readinessScore: number;
  availableDocuments?: string[];
  incompleteProfile?: boolean;
}

export interface TenderClause {
  clauseNumber: string;
  title: string;
  description: string;
  mandatory: boolean;
  exemptionApplicable: boolean;
}

export interface Tender {
  id: string;
  referenceNumber: string;
  title: string;
  department: string;
  ministry: string;
  category: string;
  sector: string;
  description: string;
  estimatedBudgetInr: number;
  budgetString: string;
  emdAmountInr: number;
  emdExemptForStartups: boolean;
  priorTurnoverExempt: boolean;
  priorExperienceExempt: boolean;
  publishDate: string;
  submissionDeadline: string;
  status: 'ACTIVE' | 'CLOSING_SOON' | 'EVALUATION' | 'AWARDED' | 'DRAFT' | 'EXPIRED' | 'CANCELLED';
  location: string;
  geographicalRestrictions?: string[];
  preparationTimeDays?: number;
  tags: string[];
  clauses: TenderClause[];
  eligibilityCriteria: string[];
  requiredDocuments?: string[];
  officialSourceUrl?: string;
  portalSource?: 'GeM' | 'CPPP' | 'Defence DPP' | 'State eProc';
  officialTenderId?: string;
  trustLevel?: DataTrustLevel;
  lastVerifiedAt?: string;
  dataConfidence?: 'HIGH' | 'MEDIUM' | 'LOW';
  missingEligibilityInfo?: boolean;
}

export type EligibilityStatus = 
  | 'ELIGIBLE_PROVISIONAL'     // "Eligible based on available information"
  | 'POTENTIALLY_ELIGIBLE'     // "Potentially Eligible"
  | 'LIKELY_INELIGIBLE';       // "Likely Ineligible"

export type DataConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface SmartScoringWeights {
  industryRelevanceWeight: number;      // 0.25 (25%)
  technicalCapabilityWeight: number;    // 0.25 (25%)
  eligibilityComplianceWeight: number;  // 0.20 (20%)
  experienceCertWeight: number;         // 0.10 (10%)
  budgetSuitabilityWeight: number;      // 0.10 (10%)
  deadlineReadinessWeight: number;      // 0.10 (10%)
}

export interface SmartMatchScoreBreakdown {
  industryRelevance: number;      // 0 - 25
  technicalCapability: number;    // 0 - 25
  eligibilityCompliance: number;  // 0 - 20
  experienceCerts: number;         // 0 - 10
  budgetSuitability: number;      // 0 - 10
  deadlineReadiness: number;      // 0 - 10
}

export interface TenderRecommendation {
  tenderId: string;
  tender: Tender;
  matchScore: number;
  eligibilityStatus: EligibilityStatus;
  dataConfidence: DataConfidenceLevel;
  scoreBreakdown: SmartMatchScoreBreakdown;
  matchReasons: string[];
  missingRequirements: string[];
  mandatoryEligibilityFailures: string[];
  requiredDocuments: string[];
  missingDocuments: string[];
  sourceVerificationStatus: string;
  officialSourceUrl: string;
  daysRemaining: number;
  dismissed?: boolean;
  shortlisted?: boolean;
}

export interface ShortlistRecord {
  id: string;
  userId: string;
  startupId: string;
  tenderId: string;
  tender: Tender;
  addedAt: string;
  matchScore: number;
  eligibilityStatus: EligibilityStatus;
  dataConfidence: DataConfidenceLevel;
  notes?: string;
  tags?: string[];
}

export interface MatchBreakdown {
  sectorMatch: number;
  skillsMatch: number;
  experienceMatch: number;
  regulatoryCompliance: number;
  overallScore: number;
  matchedKeywords: string[];
  gapKeywords: string[];
  recommendation: string;
  strengths: string[];
  mitigations: string[];
}

export interface Application {
  id: string;
  tenderId: string;
  tenderTitle: string;
  department: string;
  startupId: string;
  startupName: string;
  bidAmountInr: number;
  submittedAt: string;
  status: 'SUBMITTED' | 'TECHNICAL_EVALUATION' | 'FINANCIAL_EVALUATION' | 'SHORTLISTED' | 'AWARDED' | 'REJECTED';
  matchScore: number;
  proposalDraftMarkdown?: string;
  clarifications: Clarification[];
}

export interface Clarification {
  id: string;
  askedBy: string;
  askedAt: string;
  question: string;
  response?: string;
  respondedAt?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'MATCH' | 'DEADLINE' | 'STATUS' | 'CLARIFICATION' | 'SYSTEM';
  link?: string;
}

export interface PreparationWorkspace {
  id: string;
  startupId: string;
  tenderId: string;
  tenderTitle: string;
  tenderRef: string;
  department: string;
  progressPercentage: number;
  lastEdited: string;
  completedChecklistCount: number;
  totalChecklistCount: number;
  targetDeadline: string;
  bidAmountLakhs: number;
}

export interface MissingDocAlert {
  id: string;
  startupId: string;
  severity: 'URGENT' | 'WARNING' | 'NOTICE';
  title: string;
  description: string;
  tenderId?: string;
  tenderTitle?: string;
  deadline?: string;
  actionLabel: string;
  actionView: 'ai-studio' | 'tenders' | 'applications';
}

export interface RecentlyViewedTender {
  startupId: string;
  tenderId: string;
  viewedAt: string;
}

export interface RecommendedAction {
  id: string;
  startupId: string;
  priority: 'HIGH' | 'MEDIUM' | 'SCHEDULED';
  actionTitle: string;
  description: string;
  deadlineNotice: string;
  tenderId?: string;
  category: 'CLARIFICATION' | 'LEGAL_DOC' | 'BOQ_QUOTE' | 'SUBMISSION';
}

export interface SystemTelemetry {
  activeTendersCount: number;
  totalStartupsCount: number;
  totalOfficersCount: number;
  totalApplicationsCount: number;
  totalBudgetManagedCr: number;
  aiTokensProcessedToday: number;
  aiAverageLatencyMs: number;
  mockModeActive: boolean;
}

export interface SavedSearch {
  id: string;
  userId: string;
  name: string;
  query: string;
  sector?: string;
  category?: string;
  minBudgetLakhs?: number;
  maxBudgetLakhs?: number;
  emdExemptOnly: boolean;
  alertFrequency: 'DAILY' | 'WEEKLY' | 'NONE';
  createdAt: string;
}

export interface LearningResource {
  id: string;
  title: string;
  titleHindi?: string;
  category: 'GUIDE' | 'GLOSSARY' | 'CHECKLIST' | 'TUTORIAL' | 'POLICY';
  readingTimeMin: number;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  summary: string;
  contentMarkdown: string;
  officialUrl?: string;
  tags: string[];
}

export interface PricingPlan {
  id: 'free' | 'pro' | 'team' | 'enterprise';
  name: string;
  badge?: string;
  priceInrPerMonth: number;
  billingCycle: 'MONTHLY' | 'ANNUAL';
  targetAudience: string;
  features: string[];
  limitations: string[];
  ctaText: string;
}

export interface OnboardingData {
  role: UserRole;
  organizationName: string;
  sector: string;
  categories: string[];
  annualTurnoverLakhs: number;
  dpiitRecognized: boolean;
  msmeRegistered: boolean;
  priorGovExperienceYears: number;
  city: string;
  state: string;
  certifications: string[];
  preferredContractMinLakhs: number;
  preferredContractMaxLakhs: number;
}
