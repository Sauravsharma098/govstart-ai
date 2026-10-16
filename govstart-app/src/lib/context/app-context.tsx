'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { 
  User, 
  StartupProfile, 
  Tender, 
  Application, 
  NotificationItem, 
  UserRole,
  PreparationWorkspace,
  MissingDocAlert,
  RecentlyViewedTender,
  RecommendedAction,
  TenderRecommendation,
  ShortlistRecord,
  SmartScoringWeights,
  SavedSearch,
  LearningResource,
  PricingPlan,
  OnboardingData
} from '../types';
import { 
  MOCK_STARTUPS, 
  MOCK_USERS, 
  MOCK_TENDERS, 
  MOCK_APPLICATIONS, 
  MOCK_NOTIFICATIONS,
  MOCK_WORKSPACES,
  MOCK_MISSING_DOCS,
  MOCK_RECENTLY_VIEWED,
  MOCK_RECOMMENDED_ACTIONS,
  MOCK_SHORTLISTS,
  MOCK_SAVED_SEARCHES,
  MOCK_LEARNING_RESOURCES,
  MOCK_PRICING_PLANS
} from '../data/mock-data';
import { WeightTunerConfig, DEFAULT_WEIGHTS } from '../ai/ai-service';
import { DEFAULT_SMART_WEIGHTS, rankTendersForStartup, evaluateSmartTenderMatch } from '../ai/smart-matcher';

export type AppView = 
  | 'landing' 
  | 'dashboard' 
  | 'tenders' 
  | 'shortlist'
  | 'applications' 
  | 'officer' 
  | 'admin' 
  | 'ai-studio'
  | 'learning-hub'
  | 'pricing';

interface AppContextType {
  currentUser: User | null;
  currentStartup: StartupProfile | null;
  allStartups: StartupProfile[];
  allUsers: User[];
  tenders: Tender[];
  applications: Application[];
  savedTenderIds: string[];
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  activeView: AppView;
  selectedTender: Tender | null;
  weights: WeightTunerConfig;
  authModalOpen: boolean;
  authMode: 'login' | 'signup' | 'forgot';
  
  // Workspace & Alert State
  workspaces: PreparationWorkspace[];
  missingDocAlerts: MissingDocAlert[];
  recentlyViewed: RecentlyViewedTender[];
  recommendedActions: RecommendedAction[];

  // Smart Tender Match & Shortlist State
  smartWeights: SmartScoringWeights;
  recommendations: TenderRecommendation[];
  shortlistRecords: ShortlistRecord[];
  dismissedTenderIds: string[];
  lastRecommendationsRefresh: string;
  isRefreshingRecommendations: boolean;

  // Actions
  setActiveView: (view: AppView) => void;
  setSelectedTender: (tender: Tender | null) => void;
  toggleSaveTender: (tenderId: string) => void;
  markNotificationAsRead: (id: string) => void;
  switchUserPersona: (userId: string) => void;
  setWeights: (weights: WeightTunerConfig) => void;
  setSmartWeights: (weights: SmartScoringWeights) => void;
  submitApplication: (tenderId: string, bidAmount: number, proposalMarkdown?: string) => void;
  addTender: (tender: Partial<Tender>) => void;
  updateApplicationStatus: (appId: string, status: Application['status']) => void;
  respondToClarification: (appId: string, clarId: string, responseText: string) => void;
  openAuth: (mode?: 'login' | 'signup' | 'forgot') => void;
  closeAuth: () => void;
  login: (email: string, role: UserRole) => void;
  logout: () => void;
  
  // Workspace & Intelligence Actions
  recordTenderView: (tenderId: string) => void;
  dismissAlert: (alertId: string) => void;
  createOrOpenWorkspace: (tenderId: string) => void;

  // Shortlisting & Recommendation Actions
  addToShortlist: (tenderId: string, notes?: string) => Promise<void>;
  removeFromShortlist: (tenderId: string) => Promise<void>;
  dismissRecommendation: (tenderId: string) => void;
  refreshRecommendations: () => void;
  updateStartupProfile: (updatedProfile: Partial<StartupProfile>) => void;

  // Saved Searches, Academy & Pricing
  savedSearches: SavedSearch[];
  addSavedSearch: (search: Omit<SavedSearch, 'id' | 'createdAt'>) => void;
  deleteSavedSearch: (id: string) => void;
  learningResources: LearningResource[];
  pricingPlans: PricingPlan[];

  // Onboarding Modal
  onboardingModalOpen: boolean;
  setOnboardingModalOpen: (open: boolean) => void;
  handleCompleteOnboarding: (data: OnboardingData) => void;

  // Consultant Multi-Client Workspace
  consultantClientId: string | null;
  setConsultantClientId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(MOCK_USERS[0]);
  const [activeView, setActiveView] = useState<AppView>('landing');
  const [startupsList, setStartupsList] = useState<StartupProfile[]>(MOCK_STARTUPS);
  const [tenders, setTenders] = useState<Tender[]>(MOCK_TENDERS);
  const [applications, setApplications] = useState<Application[]>(MOCK_APPLICATIONS);
  const [savedTenderIds, setSavedTenderIds] = useState<string[]>(['tender-1', 'tender-3', 'tender-6']);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [selectedTender, setSelectedTender] = useState<Tender | null>(MOCK_TENDERS[0]);
  const [weights, setWeights] = useState<WeightTunerConfig>(DEFAULT_WEIGHTS);
  const [smartWeights, setSmartWeights] = useState<SmartScoringWeights>(DEFAULT_SMART_WEIGHTS);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');

  // Workspaces & Alerts
  const [workspaces, setWorkspaces] = useState<PreparationWorkspace[]>(MOCK_WORKSPACES);
  const [missingDocAlerts, setMissingDocAlerts] = useState<MissingDocAlert[]>(MOCK_MISSING_DOCS);
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedTender[]>(MOCK_RECENTLY_VIEWED);
  const [recommendedActions, setRecommendedActions] = useState<RecommendedAction[]>(MOCK_RECOMMENDED_ACTIONS);

  // Shortlist & Recommendations State
  const [shortlistRecords, setShortlistRecords] = useState<ShortlistRecord[]>(MOCK_SHORTLISTS);
  const [dismissedTenderIds, setDismissedTenderIds] = useState<string[]>([]);
  const [lastRecommendationsRefresh, setLastRecommendationsRefresh] = useState<string>('Just now');
  const [isRefreshingRecommendations, setIsRefreshingRecommendations] = useState(false);

  // New Network & Platform Features State
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(MOCK_SAVED_SEARCHES);
  const [learningResources] = useState<LearningResource[]>(MOCK_LEARNING_RESOURCES);
  const [pricingPlans] = useState<PricingPlan[]>(MOCK_PRICING_PLANS);
  const [onboardingModalOpen, setOnboardingModalOpen] = useState(false);
  const [consultantClientId, setConsultantClientId] = useState<string | null>(null);

  // Derive current active startup profile (supporting consultant switching)
  const effectiveStartupId = (currentUser?.role === 'CONSULTANT' && consultantClientId)
    ? consultantClientId
    : (currentUser?.startupProfileId || 'startup-1');

  const currentStartup = startupsList.find(s => s.id === effectiveStartupId) || startupsList[0];

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  // Compute recommendations reactively whenever currentStartup, tenders, smartWeights, or dismissedTenderIds change
  const recommendations = useMemo(() => {
    if (!currentStartup) return [];
    const allRanked = rankTendersForStartup(tenders, currentStartup, smartWeights, false);
    return allRanked.filter(r => !dismissedTenderIds.includes(r.tenderId));
  }, [tenders, currentStartup, smartWeights, dismissedTenderIds]);

  const toggleSaveTender = (tenderId: string) => {
    setSavedTenderIds(prev => 
      prev.includes(tenderId) ? prev.filter(id => id !== tenderId) : [...prev, tenderId]
    );
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const recordTenderView = (tenderId: string) => {
    if (!currentStartup) return;
    setRecentlyViewed(prev => {
      const filtered = prev.filter(r => !(r.startupId === currentStartup.id && r.tenderId === tenderId));
      return [{ startupId: currentStartup.id, tenderId, viewedAt: 'Just now' }, ...filtered];
    });
  };

  const dismissAlert = (alertId: string) => {
    setMissingDocAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  const dismissRecommendation = (tenderId: string) => {
    setDismissedTenderIds(prev => [...prev, tenderId]);
  };

  const refreshRecommendations = useCallback(() => {
    setIsRefreshingRecommendations(true);
    setTimeout(() => {
      setLastRecommendationsRefresh(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setIsRefreshingRecommendations(false);
    }, 400);
  }, []);

  const addToShortlist = async (tenderId: string, notes?: string) => {
    if (!currentStartup) return;

    // Check if already in shortlist to prevent duplicates
    const exists = shortlistRecords.some(s => s.startupId === currentStartup.id && s.tenderId === tenderId);
    if (exists) return;

    const tender = tenders.find(t => t.id === tenderId);
    if (!tender) return;

    const evalResult = evaluateSmartTenderMatch(tender, currentStartup, smartWeights);

    const newShortlistRecord: ShortlistRecord = {
      id: `sl-${Date.now()}`,
      userId: currentUser?.id || `user-${currentStartup.id}`,
      startupId: currentStartup.id,
      tenderId,
      tender,
      addedAt: new Date().toISOString(),
      matchScore: evalResult.matchScore,
      eligibilityStatus: evalResult.eligibilityStatus,
      dataConfidence: evalResult.dataConfidence,
      notes: notes || 'Shortlisted via AI Smart Tender Match',
      tags: [tender.category, tender.sector]
    };

    setShortlistRecords(prev => [newShortlistRecord, ...prev]);

    // Also persist via server API
    try {
      await fetch('/api/shortlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startupId: currentStartup.id,
          tenderId,
          notes,
          tags: newShortlistRecord.tags
        })
      });
    } catch (e) {
      console.warn('Shortlist API sync:', e);
    }
  };

  const removeFromShortlist = async (tenderId: string) => {
    if (!currentStartup) return;
    setShortlistRecords(prev => prev.filter(s => !(s.startupId === currentStartup.id && s.tenderId === tenderId)));

    try {
      await fetch(`/api/shortlist?startupId=${currentStartup.id}&tenderId=${tenderId}`, {
        method: 'DELETE'
      });
    } catch (e) {
      console.warn('Shortlist API delete sync:', e);
    }
  };

  const updateStartupProfile = (updatedProfile: Partial<StartupProfile>) => {
    if (!currentStartup) return;
    setStartupsList(prev => prev.map(s => 
      s.id === currentStartup.id ? { ...s, ...updatedProfile } : s
    ));
    refreshRecommendations();
  };

  const createOrOpenWorkspace = (tenderId: string) => {
    const tender = tenders.find(t => t.id === tenderId);
    if (!tender || !currentStartup) return;

    setSelectedTender(tender);
    recordTenderView(tenderId);

    const existing = workspaces.find(w => w.tenderId === tenderId && w.startupId === currentStartup.id);
    if (!existing) {
      const newWs: PreparationWorkspace = {
        id: `ws-${Date.now()}`,
        startupId: currentStartup.id,
        tenderId: tender.id,
        tenderTitle: tender.title,
        tenderRef: tender.referenceNumber,
        department: tender.department,
        progressPercentage: 20,
        lastEdited: 'Just now',
        completedChecklistCount: 2,
        totalChecklistCount: 6,
        targetDeadline: tender.submissionDeadline,
        bidAmountLakhs: Math.round(tender.estimatedBudgetInr * 0.95 / 100000)
      };
      setWorkspaces(prev => [newWs, ...prev]);
    }

    setActiveView('ai-studio');
  };

  const switchUserPersona = (userId: string) => {
    const user = MOCK_USERS.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      if (user.role === 'OFFICER') {
        setActiveView('officer');
      } else if (user.role === 'ADMIN') {
        setActiveView('admin');
      } else {
        setActiveView('dashboard');
      }
    }
  };

  const addSavedSearch = (searchData: Omit<SavedSearch, 'id' | 'createdAt'>) => {
    const newSearch: SavedSearch = {
      ...searchData,
      id: `ss-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setSavedSearches(prev => [newSearch, ...prev]);
  };

  const deleteSavedSearch = (id: string) => {
    setSavedSearches(prev => prev.filter(s => s.id !== id));
  };

  const handleCompleteOnboarding = (data: OnboardingData) => {
    const profileId = `startup-${Date.now()}`;
    const newProfile: StartupProfile = {
      id: profileId,
      name: data.organizationName,
      dpiitNumber: data.dpiitRecognized ? `DIPP${Math.floor(10000 + Math.random() * 90000)}` : '',
      incorporationDate: new Date().toISOString().split('T')[0],
      sector: data.sector,
      categories: data.categories,
      description: `${data.organizationName} - Indigenous supplier and solutions provider specialized in ${data.sector}.`,
      website: `https://${data.organizationName.toLowerCase().replace(/[^a-z0-9]/g, '')}.in`,
      city: data.city,
      state: data.state,
      annualTurnoverLakhs: data.annualTurnoverLakhs,
      preferredContractMinLakhs: data.preferredContractMinLakhs,
      preferredContractMaxLakhs: data.preferredContractMaxLakhs,
      dpiitRecognized: data.dpiitRecognized,
      msmeRegistered: data.msmeRegistered,
      priorGovExperienceYears: data.priorGovExperienceYears,
      completedGovProjects: Math.max(0, data.priorGovExperienceYears),
      certifications: data.certifications,
      techStack: data.categories,
      patentsCount: 1,
      readinessScore: 85,
      availableDocuments: [
        ...(data.dpiitRecognized ? ['DPIIT Startup India Certificate'] : []),
        ...(data.msmeRegistered ? ['MSME Udyam Certificate'] : []),
        'GST Registration Certificate',
        'Audited Financial Statements'
      ]
    };

    setStartupsList(prev => [newProfile, ...prev]);

    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        organization: data.organizationName,
        role: data.role,
        startupProfileId: profileId
      });
    }

    setOnboardingModalOpen(false);
    setActiveView('dashboard');
    refreshRecommendations();
  };

  const openAuth = (mode: 'login' | 'signup' | 'forgot' = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuth = () => {
    setAuthModalOpen(false);
  };

  const login = (email: string, role: UserRole) => {
    let matchedUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!matchedUser) {
      matchedUser = {
        id: `user-${Date.now()}`,
        name: email.split('@')[0],
        email: email,
        role: role,
        organization: role === 'STARTUP' ? 'New Wave Robotics' : 'Procurement Cell',
        startupProfileId: role === 'STARTUP' ? 'startup-1' : undefined,
        avatar: email.substring(0, 2).toUpperCase()
      };
    }
    setCurrentUser(matchedUser);
    setAuthModalOpen(false);
    if (matchedUser.role === 'OFFICER') {
      setActiveView('officer');
    } else if (matchedUser.role === 'ADMIN') {
      setActiveView('admin');
    } else {
      setActiveView('dashboard');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveView('landing');
  };

  const submitApplication = (tenderId: string, bidAmount: number, proposalMarkdown?: string) => {
    const tender = tenders.find(t => t.id === tenderId);
    if (!tender || !currentUser) return;

    const newApp: Application = {
      id: `app-${Date.now()}`,
      tenderId: tender.id,
      tenderTitle: tender.title,
      department: tender.department,
      startupId: currentStartup.id,
      startupName: currentStartup.name,
      bidAmountInr: bidAmount,
      submittedAt: new Date().toISOString(),
      status: 'SUBMITTED',
      matchScore: 95,
      proposalDraftMarkdown: proposalMarkdown,
      clarifications: []
    };

    setApplications(prev => [newApp, ...prev]);

    setWorkspaces(prev => prev.map(w => 
      w.tenderId === tenderId && w.startupId === currentStartup.id 
        ? { ...w, progressPercentage: 100, lastEdited: 'Submitted just now' } 
        : w
    ));

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Proposal Successfully Submitted',
      message: `Your technical & commercial bid for "${tender.title.substring(0, 40)}..." has been recorded.`,
      timestamp: 'Just now',
      read: false,
      type: 'STATUS',
      link: newApp.id
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const addTender = (newTenderData: Partial<Tender>) => {
    const newTender: Tender = {
      id: `tender-${Date.now()}`,
      referenceNumber: newTenderData.referenceNumber || `GOV/2026/${Math.floor(100 + Math.random() * 900)}`,
      title: newTenderData.title || 'Untitled Procurement',
      department: newTenderData.department || 'Ministry Directorate',
      ministry: newTenderData.ministry || 'Government of India',
      category: newTenderData.category || 'General Technology',
      sector: newTenderData.sector || 'Information Technology',
      description: newTenderData.description || 'Procurement description',
      estimatedBudgetInr: newTenderData.estimatedBudgetInr || 50000000,
      budgetString: newTenderData.budgetString || '₹5.00 Cr',
      emdAmountInr: newTenderData.emdAmountInr || 1000000,
      emdExemptForStartups: true,
      priorTurnoverExempt: true,
      priorExperienceExempt: true,
      publishDate: new Date().toISOString().split('T')[0],
      submissionDeadline: newTenderData.submissionDeadline || '2026-12-31',
      status: 'ACTIVE',
      location: newTenderData.location || 'New Delhi, India',
      tags: newTenderData.tags || ['DeepTech', 'Indigenous', 'MakeInIndia'],
      eligibilityCriteria: newTenderData.eligibilityCriteria || ['DPIIT recognized entity'],
      clauses: newTenderData.clauses || [
        {
          clauseNumber: 'Cl 1.1',
          title: 'Startup Exemption Clause',
          description: 'Full EMD exemption and turnover relaxation applicable under national startup policy.',
          mandatory: true,
          exemptionApplicable: true
        }
      ]
    };

    setTenders(prev => [newTender, ...prev]);
  };

  const updateApplicationStatus = (appId: string, status: Application['status']) => {
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status } : a));
  };

  const respondToClarification = (appId: string, clarId: string, responseText: string) => {
    setApplications(prev => prev.map(app => {
      if (app.id !== appId) return app;
      return {
        ...app,
        clarifications: app.clarifications.map(c => 
          c.id === clarId ? { ...c, response: responseText, respondedAt: new Date().toISOString() } : c
        )
      };
    }));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentStartup,
        allStartups: startupsList,
        allUsers: MOCK_USERS,
        tenders,
        applications,
        savedTenderIds,
        notifications,
        unreadNotificationCount,
        activeView,
        selectedTender,
        weights,
        smartWeights,
        authModalOpen,
        authMode,
        workspaces,
        missingDocAlerts,
        recentlyViewed,
        recommendedActions,
        recommendations,
        shortlistRecords,
        dismissedTenderIds,
        lastRecommendationsRefresh,
        isRefreshingRecommendations,
        setActiveView,
        setSelectedTender,
        toggleSaveTender,
        markNotificationAsRead,
        switchUserPersona,
        setWeights,
        setSmartWeights,
        submitApplication,
        addTender,
        updateApplicationStatus,
        respondToClarification,
        openAuth,
        closeAuth,
        login,
        logout,
        recordTenderView,
        dismissAlert,
        createOrOpenWorkspace,
        addToShortlist,
        removeFromShortlist,
        dismissRecommendation,
        refreshRecommendations,
        updateStartupProfile,
        savedSearches,
        addSavedSearch,
        deleteSavedSearch,
        learningResources,
        pricingPlans,
        onboardingModalOpen,
        setOnboardingModalOpen,
        handleCompleteOnboarding,
        consultantClientId,
        setConsultantClientId
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
