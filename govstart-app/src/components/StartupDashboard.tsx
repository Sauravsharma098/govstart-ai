'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '../lib/context/app-context';
import { Tender } from '../lib/types';
import { calculateMatchScore } from '@/lib/ai/ai-service';
import { 
  Building2, 
  FileCheck2, 
  Clock, 
  Bookmark, 
  TrendingUp, 
  Sparkles, 
  ArrowUpRight, 
  ShieldCheck, 
  Award, 
  ChevronRight,
  Calendar,
  AlertTriangle,
  Zap,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  FileText,
  ExternalLink,
  Filter,
  CheckSquare,
  ArrowRight,
  Eye,
  Trash2,
  PlusCircle,
  Compass,
  X
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export default function StartupDashboard() {
  const { 
    currentStartup, 
    tenders, 
    applications, 
    savedTenderIds, 
    toggleSaveTender,
    setSelectedTender, 
    setActiveView, 
    weights,
    workspaces,
    missingDocAlerts,
    recentlyViewed,
    recommendedActions,
    dismissAlert,
    createOrOpenWorkspace,
    recordTenderView,
    recommendations,
    shortlistRecords,
    addToShortlist,
    dismissRecommendation,
    refreshRecommendations,
    lastRecommendationsRefresh,
    isRefreshingRecommendations
  } = useApp();

  // Functional Date Filter for Upcoming Deadlines & Closing Soon
  const [deadlineFilter, setDeadlineFilter] = useState<'ALL' | '14_DAYS' | '30_DAYS' | '60_DAYS'>('30_DAYS');

  if (!currentStartup) return null;

  // 1. Dynamic Match Calculation for Current Authenticated Startup
  const scoredTenders = useMemo(() => {
    return tenders.map(tender => ({
      tender,
      match: calculateMatchScore(tender, currentStartup, weights)
    })).sort((a, b) => b.match.overallScore - a.match.overallScore);
  }, [tenders, currentStartup, weights]);

  // Smart AI recommendations (top 5 for dashboard display)
  const smartRecs = useMemo(() => recommendations.slice(0, 5), [recommendations]);

  // High match tenders (>= 75%) using old engine for dashboard stat
  const highMatchOpportunities = scoredTenders.filter(s => s.match.overallScore >= 75);
  const topRecommendations = scoredTenders.slice(0, 3);

  // 2. Saved Tenders Record Derivation
  const savedTendersList = useMemo(() => {
    return tenders.filter(t => savedTenderIds.includes(t.id));
  }, [tenders, savedTenderIds]);

  // 3. User Workspaces Record Derivation
  const userWorkspaces = useMemo(() => {
    return workspaces.filter(w => w.startupId === currentStartup.id);
  }, [workspaces, currentStartup.id]);

  // 4. Missing Document Alerts Derivation
  const userAlerts = useMemo(() => {
    return missingDocAlerts.filter(a => a.startupId === currentStartup.id);
  }, [missingDocAlerts, currentStartup.id]);

  // 5. Recommended Actions Derivation
  const userActions = useMemo(() => {
    return recommendedActions.filter(a => a.startupId === currentStartup.id);
  }, [recommendedActions, currentStartup.id]);

  // 6. Recently Viewed Tenders Derivation
  const userRecentlyViewed = useMemo(() => {
    const records = recentlyViewed.filter(r => r.startupId === currentStartup.id);
    return records
      .map(r => ({ record: r, tender: tenders.find(t => t.id === r.tenderId) }))
      .filter((item): item is { record: (typeof records)[0]; tender: Tender } => item.tender !== undefined);
  }, [recentlyViewed, tenders, currentStartup.id]);

  // 7. Deadlines & Closing Soon with Functional Date Filters
  const now = new Date('2026-10-16').getTime(); // Reference system date

  const deadlinesFiltered = useMemo(() => {
    return tenders.map(t => {
      const deadlineTime = new Date(t.submissionDeadline).getTime();
      const diffDays = Math.ceil((deadlineTime - now) / (1000 * 60 * 60 * 24));
      return { tender: t, diffDays };
    }).filter(({ diffDays }) => {
      if (deadlineFilter === '14_DAYS') return diffDays >= 0 && diffDays <= 14;
      if (deadlineFilter === '30_DAYS') return diffDays >= 0 && diffDays <= 30;
      if (deadlineFilter === '60_DAYS') return diffDays >= 0 && diffDays <= 60;
      return diffDays >= 0; // ALL
    }).sort((a, b) => a.diffDays - b.diffDays);
  }, [tenders, deadlineFilter, now]);

  const closingSoonCount = tenders.filter(t => {
    const diff = Math.ceil((new Date(t.submissionDeadline).getTime() - now) / (1000 * 60 * 60 * 24));
    return diff >= 0 && diff <= 30;
  }).length;

  // 8. Recharts Data: Real-time Tender Category Distribution
  const categoryData = useMemo(() => {
    const counts: { [key: string]: number } = {};
    tenders.forEach(t => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });

    const palette = ['#0f2b48', '#059669', '#0284c7', '#d97706', '#7c3aed', '#db2777'];
    return Object.keys(counts).map((cat, idx) => ({
      name: cat,
      count: counts[cat],
      color: palette[idx % palette.length]
    }));
  }, [tenders]);

  // 9. Application Pipeline Progression
  const userApplications = useMemo(() => {
    return applications.filter(a => a.startupId === currentStartup.id);
  }, [applications, currentStartup.id]);

  const pipelineStages = [
    { name: 'Active Drafts', count: userWorkspaces.filter(w => w.progressPercentage < 100).length, color: 'text-slate-800' },
    { name: 'Submitted', count: userApplications.filter(a => a.status === 'SUBMITTED').length, color: 'text-blue-700' },
    { name: 'Technical Review', count: userApplications.filter(a => a.status === 'TECHNICAL_EVALUATION').length, color: 'text-purple-700' },
    { name: 'Shortlisted', count: userApplications.filter(a => a.status === 'SHORTLISTED').length, color: 'text-amber-700' },
    { name: 'Awarded', count: userApplications.filter(a => a.status === 'AWARDED').length, color: 'text-emerald-700' }
  ];

  const totalPipelineValueCr = useMemo(() => {
    const workspaceVal = userWorkspaces.reduce((acc, w) => acc + (w.bidAmountLakhs || 0), 0);
    const appVal = userApplications.reduce((acc, a) => acc + (a.bidAmountInr / 100000), 0);
    return ((workspaceVal + appVal) / 100).toFixed(2);
  }, [userWorkspaces, userApplications]);

  // Handlers for record actions
  const handleOpenTender = (tender: Tender) => {
    setSelectedTender(tender);
    recordTenderView(tender.id);
    setActiveView('ai-studio');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Personalized Header Ribbon */}
      <div className="p-6 rounded-2xl bg-slate-900 text-white relative overflow-hidden shadow-xl border border-slate-800">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> DPIIT Verified: {currentStartup.dpiitNumber}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300">
                Persona: {currentStartup.name}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Sector: {currentStartup.sector}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Procurement Intelligence Dashboard
            </h1>

            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Evaluating <strong className="text-white">{tenders.length} active central tenders</strong>. You have <strong className="text-emerald-400">{highMatchOpportunities.length} high-match opportunities</strong> eligible for 100% EMD waiver and relaxed prior turnover.
            </p>
          </div>

          {/* Quick Readiness Meter */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/80 border border-slate-700 shrink-0">
            <div className="w-14 h-14 rounded-full border-4 border-emerald-400 border-t-emerald-600 flex flex-col items-center justify-center font-black text-sm">
              <span>{currentStartup.readinessScore}%</span>
            </div>
            <div>
              <div className="text-xs font-bold text-white">Startup Qualification Score</div>
              <div className="text-[11px] text-emerald-400 font-medium">Order F.20/2/2014-PPD Qualified</div>
              <div className="text-[10px] text-slate-400 mt-1">
                {currentStartup.certifications.slice(0, 2).join(' • ')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top-Row Operational Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        
        <div 
          onClick={() => setActiveView('tenders')}
          className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:shadow-md cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold">
            <span>Matching Tenders</span>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-1.5 text-2xl font-black text-slate-900">{highMatchOpportunities.length}</div>
          <p className="text-[10px] text-emerald-700 font-medium mt-0.5 flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" /> &ge; 75% compatibility
          </p>
        </div>

        <div 
          onClick={() => { setDeadlineFilter('30_DAYS'); }}
          className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:shadow-md cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold">
            <span>Closing Soon (&le;30d)</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-1.5 text-2xl font-black text-amber-700">{closingSoonCount}</div>
          <p className="text-[10px] text-slate-500 font-medium mt-0.5">Action required before cutoff</p>
        </div>

        <div 
          onClick={() => { const el = document.getElementById('saved-tenders-section'); el?.scrollIntoView({ behavior: 'smooth' }); }}
          className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:shadow-md cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold">
            <span>Saved Tenders</span>
            <Bookmark className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-1.5 text-2xl font-black text-slate-900">{savedTendersList.length}</div>
          <p className="text-[10px] text-slate-500 font-medium mt-0.5">Bookmarked for proposal</p>
        </div>

        <div 
          onClick={() => { const el = document.getElementById('workspaces-section'); el?.scrollIntoView({ behavior: 'smooth' }); }}
          className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:shadow-md cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold">
            <span>Active Workspaces</span>
            <FileCheck2 className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-1.5 text-2xl font-black text-purple-700">{userWorkspaces.length}</div>
          <p className="text-[10px] text-purple-700 font-medium mt-0.5">Draft proposals in progress</p>
        </div>

        <div 
          onClick={() => { const el = document.getElementById('missing-docs-section'); el?.scrollIntoView({ behavior: 'smooth' }); }}
          className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:shadow-md cursor-pointer transition-all col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold">
            <span>Compliance Alerts</span>
            <AlertCircle className="w-4 h-4 text-red-600" />
          </div>
          <div className="mt-1.5 text-2xl font-black text-red-700">{userAlerts.length}</div>
          <p className="text-[10px] text-red-700 font-medium mt-0.5">Missing document notices</p>
        </div>

      </div>

      {/* 3. Missing-Document & Compliance Alerts Banner */}
      {userAlerts.length > 0 && (
        <div id="missing-docs-section" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-red-800 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-red-600" />
              Critical Compliance & Missing-Document Alerts ({userAlerts.length})
            </h2>
            <span className="text-[11px] text-slate-500">Action needed to avoid technical disqualification</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {userAlerts.map((alert) => (
              <div 
                key={alert.id}
                className={`p-4 rounded-xl border flex flex-col justify-between gap-3 shadow-2xs transition-all ${
                  alert.severity === 'URGENT' 
                    ? 'bg-red-50/70 border-red-200 text-red-950' 
                    : 'bg-amber-50/70 border-amber-200 text-amber-950'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm ${
                      alert.severity === 'URGENT' ? 'bg-red-200 text-red-900' : 'bg-amber-200 text-amber-900'
                    }`}>
                      {alert.severity} NOTICE
                    </span>
                    <button
                      onClick={() => dismissAlert(alert.id)}
                      className="text-slate-400 hover:text-slate-700 p-0.5 rounded-sm"
                      title="Dismiss alert"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h4 className="font-bold text-xs pt-1">{alert.title}</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{alert.description}</p>
                  {alert.tenderTitle && (
                    <div className="text-[10px] text-slate-500 pt-1">
                      Related Tender: <strong>{alert.tenderTitle}</strong> • Due: {alert.deadline}
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 italic">DoE Order No. F.20/2/2014-PPD</span>
                  <button
                    onClick={() => {
                      if (alert.tenderId) {
                        const t = tenders.find(item => item.id === alert.tenderId);
                        if (t) setSelectedTender(t);
                      }
                      setActiveView(alert.actionView);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    {alert.actionLabel} <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Recommended Next Actions (Decision Engine) */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-emerald-600" />
              Recommended Next Actions for {currentStartup.name}
            </h2>
            <p className="text-xs text-slate-500">Prioritized tactical next steps to improve win probability</p>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            {userActions.length} Pending Actions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {userActions.map((act) => (
            <div 
              key={act.id}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3 hover:border-slate-300 transition-colors"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    act.priority === 'HIGH' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {act.priority} PRIORITY
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">{act.category}</span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 leading-snug">{act.actionTitle}</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">{act.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-[10px] text-amber-700 font-semibold">{act.deadlineNotice}</span>
                <button
                  onClick={() => {
                    if (act.tenderId) {
                      const t = tenders.find(item => item.id === act.tenderId);
                      if (t) setSelectedTender(t);
                    }
                    setActiveView('ai-studio');
                  }}
                  className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5"
                >
                  Action Now <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Active Preparation Workspaces (In-Progress Bids) */}
      <div id="workspaces-section" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-purple-600" />
              Active Bid Preparation Workspaces
            </h2>
            <p className="text-xs text-slate-500">In-progress proposals with clause compliance matrices and milestone drafts</p>
          </div>
          <button
            onClick={() => setActiveView('tenders')}
            className="text-xs font-semibold text-purple-700 hover:text-purple-800 flex items-center gap-1"
          >
            <PlusCircle className="w-3.5 h-3.5" /> Start New Workspace
          </button>
        </div>

        {userWorkspaces.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white border border-slate-200 space-y-2">
            <FileText className="w-7 h-7 text-slate-400 mx-auto" />
            <h3 className="text-xs font-bold text-slate-800">No active preparation workspaces</h3>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
              Select a matching opportunity to begin drafting your clause compliance matrix and BOQ quote.
            </p>
            <button
              onClick={() => setActiveView('tenders')}
              className="mt-2 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold"
            >
              Browse Tenders
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userWorkspaces.map((ws) => (
              <div 
                key={ws.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {ws.tenderRef}
                    </span>
                    <span className="text-[10px] text-slate-400">Edited {ws.lastEdited}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm leading-snug">{ws.tenderTitle}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{ws.department}</p>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-600">Proposal Readiness</span>
                      <span className="text-purple-700 font-bold">{ws.progressPercentage}% Complete</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div 
                        className="h-full bg-purple-600 rounded-full transition-all duration-500" 
                        style={{ width: `${ws.progressPercentage}%` }} 
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">
                      Checklist: <strong className="text-slate-900">{ws.completedChecklistCount}/{ws.totalChecklistCount}</strong> enclosures
                    </span>
                    <span className="text-slate-600">
                      Target Bid: <strong className="text-slate-900">₹{ws.bidAmountLakhs} L</strong>
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Cutoff: {ws.targetDeadline}
                    </span>
                    <button
                      onClick={() => createOrOpenWorkspace(ws.tenderId)}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      Resume Drafting <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Smart Tender Recommendations Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              AI Smart Tender Match
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Top {smartRecs.length} Matches
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranked by 6-factor deterministic engine. Last updated: <strong className="text-slate-700">{lastRecommendationsRefresh}</strong>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveView('shortlist')}
              className="text-xs font-semibold text-indigo-700 hover:text-indigo-800 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors"
            >
              <Bookmark className="w-3.5 h-3.5" /> My Shortlist ({shortlistRecords.length})
            </button>
            <button
              onClick={refreshRecommendations}
              disabled={isRefreshingRecommendations}
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
            >
              <ArrowRight className={`w-3.5 h-3.5 ${isRefreshingRecommendations ? 'animate-spin' : ''}`} />
              {isRefreshingRecommendations ? 'Refreshing…' : 'Find Best Tenders'}
            </button>
          </div>
        </div>

        {smartRecs.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white border border-slate-200">
            <Compass className="w-7 h-7 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500">No recommendations available yet. Click <strong>Find Best Tenders</strong> above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {smartRecs.map((rec) => {
              const isShortlisted = shortlistRecords.some(s => s.tenderId === rec.tenderId);

              const eligibilityColors = {
                ELIGIBLE_PROVISIONAL: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                POTENTIALLY_ELIGIBLE: 'bg-amber-50 text-amber-700 border-amber-200',
                LIKELY_INELIGIBLE: 'bg-rose-50 text-rose-700 border-rose-200'
              };
              const eligibilityLabel = {
                ELIGIBLE_PROVISIONAL: '✅ Eligible (Provisional)',
                POTENTIALLY_ELIGIBLE: '⚠️ Potentially Eligible',
                LIKELY_INELIGIBLE: '🚫 Likely Ineligible'
              };
              const confidenceLabel = {
                HIGH: 'High Confidence',
                MEDIUM: 'Med Confidence',
                LOW: 'Low Confidence'
              };

              return (
                <div
                  key={rec.tenderId}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">

                    {/* Left: Details */}
                    <div className="flex-1 space-y-2.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {rec.tender.referenceNumber}
                        </span>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          eligibilityColors[rec.eligibilityStatus]
                        }`}>
                          {eligibilityLabel[rec.eligibilityStatus]}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                          {confidenceLabel[rec.dataConfidence]}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500">
                          {rec.sourceVerificationStatus}
                        </span>
                      </div>

                      <h3
                        onClick={() => handleOpenTender(rec.tender)}
                        className="font-bold text-slate-900 text-sm hover:text-emerald-700 cursor-pointer transition-colors leading-snug"
                      >
                        {rec.tender.title}
                      </h3>
                      <p className="text-xs text-slate-500">{rec.tender.department} · {rec.daysRemaining} days remaining</p>

                      {/* Match Reasons */}
                      <ul className="text-xs text-slate-600 space-y-0.5 pl-4 list-disc">
                        {rec.matchReasons.map((r, i) => <li key={i}>{r}</li>)}
                      </ul>

                      {/* Missing Requirements */}
                      {rec.missingRequirements.length > 0 && (
                        <div className="p-2 rounded-lg bg-amber-50/70 border border-amber-200 text-[11px] text-amber-800">
                          <strong>Gaps:</strong> {rec.missingRequirements.slice(0, 2).join(' · ')}
                        </div>
                      )}

                      {/* Mandatory Failures */}
                      {rec.mandatoryEligibilityFailures.length > 0 && (
                        <div className="p-2 rounded-lg bg-rose-50/70 border border-rose-200 text-[11px] text-rose-800">
                          <strong>Mandatory Failure:</strong> {rec.mandatoryEligibilityFailures[0]}
                        </div>
                      )}
                    </div>

                    {/* Right: Score + Actions */}
                    <div className="lg:w-52 shrink-0 flex flex-col gap-3 border-t lg:border-t-0 lg:border-l border-slate-100 pt-3 lg:pt-0 lg:pl-4">
                      <div className="text-center p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="text-[10px] text-slate-500 font-bold uppercase">AI Match Score</div>
                        <div className="text-3xl font-black text-slate-900 flex items-center justify-center gap-1">
                          <Sparkles className="w-4 h-4 text-emerald-500" />
                          {rec.matchScore}
                          <span className="text-sm font-normal text-slate-400">/100</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1">
                          Budget: <strong>{rec.tender.budgetString}</strong>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <button
                          onClick={() => handleOpenTender(rec.tender)}
                          className="w-full py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" /> View Tender
                        </button>
                        <div className="grid grid-cols-3 gap-1">
                          <button
                            onClick={() => {
                              setSelectedTender(rec.tender);
                              setActiveView('ai-studio');
                            }}
                            className="py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-semibold border border-emerald-200 flex items-center justify-center gap-0.5"
                            title="Analyze with AI Studio"
                          >
                            <Zap className="w-3 h-3" /> Analyze
                          </button>
                          <button
                            onClick={() => addToShortlist(rec.tenderId)}
                            disabled={isShortlisted}
                            className={`py-1.5 rounded-lg text-[10px] font-semibold border flex items-center justify-center gap-0.5 ${
                              isShortlisted
                                ? 'bg-indigo-50 text-indigo-700 border-indigo-200 cursor-default'
                                : 'bg-white hover:bg-indigo-50 text-slate-700 border-slate-200'
                            }`}
                            title={isShortlisted ? 'Already shortlisted' : 'Add to My Shortlist'}
                          >
                            <Bookmark className="w-3 h-3" /> {isShortlisted ? 'Listed' : 'List'}
                          </button>
                          <button
                            onClick={() => dismissRecommendation(rec.tenderId)}
                            className="py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-500 text-[10px] font-semibold border border-slate-200 flex items-center justify-center"
                            title="Dismiss this recommendation"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>

                        {rec.officialSourceUrl && (
                          <a
                            href={rec.officialSourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-1.5 px-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 text-[10px] font-medium border border-slate-200 flex items-center justify-center gap-1 transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" /> Official Portal
                          </a>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. Main Grid: Matching Opportunities & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Top Matching Opportunities (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Top Matching Opportunities</h2>
              <p className="text-xs text-slate-500">Ranked by algorithmic alignment with {currentStartup.name} credentials</p>
            </div>
            <button
              onClick={() => setActiveView('tenders')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              Browse All ({tenders.length}) <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {topRecommendations.map(({ tender, match }) => {
              const isSaved = savedTenderIds.includes(tender.id);

              return (
                <div
                  key={tender.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {tender.referenceNumber}
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-sm">
                          EMD Waived
                        </span>
                      </div>

                      <div className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <Sparkles className="w-3 h-3" /> {match.overallScore}% AI Match
                      </div>
                    </div>

                    <h3
                      onClick={() => handleOpenTender(tender)}
                      className="font-bold text-slate-900 text-sm hover:text-emerald-700 cursor-pointer transition-colors"
                    >
                      {tender.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{tender.department}</p>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {tender.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-100 font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Budget: </span>
                      <span className="text-xs font-bold text-slate-900">{tender.budgetString}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleSaveTender(tender.id)}
                        className={`p-1.5 rounded-lg border text-xs transition-colors ${
                          isSaved ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                        }`}
                        title={isSaved ? 'Bookmarked' : 'Bookmark'}
                      >
                        <Bookmark className="w-3.5 h-3.5 fill-current" />
                      </button>
                      <button
                        onClick={() => createOrOpenWorkspace(tender.id)}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1"
                      >
                        Open Workspace <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Upcoming Deadlines & Date Filter (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900">Upcoming Deadlines</h2>
              <p className="text-xs text-slate-500">Submission cutoffs with countdowns</p>
            </div>
          </div>

          {/* Functional Date Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
            <button
              onClick={() => setDeadlineFilter('14_DAYS')}
              className={`flex-1 py-1 px-2 rounded-lg font-semibold text-center transition-colors ${
                deadlineFilter === '14_DAYS' ? 'bg-white shadow-2xs text-red-700 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              &le; 14 Days
            </button>
            <button
              onClick={() => setDeadlineFilter('30_DAYS')}
              className={`flex-1 py-1 px-2 rounded-lg font-semibold text-center transition-colors ${
                deadlineFilter === '30_DAYS' ? 'bg-white shadow-2xs text-amber-700 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              &le; 30 Days
            </button>
            <button
              onClick={() => setDeadlineFilter('60_DAYS')}
              className={`flex-1 py-1 px-2 rounded-lg font-semibold text-center transition-colors ${
                deadlineFilter === '60_DAYS' ? 'bg-white shadow-2xs text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              &le; 60 Days
            </button>
            <button
              onClick={() => setDeadlineFilter('ALL')}
              className={`flex-1 py-1 px-2 rounded-lg font-semibold text-center transition-colors ${
                deadlineFilter === 'ALL' ? 'bg-white shadow-2xs text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
          </div>

          {/* Deadlines List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs divide-y divide-slate-100 overflow-hidden">
            {deadlinesFiltered.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No tender deadlines found matching the selected time filter.
              </div>
            ) : (
              deadlinesFiltered.slice(0, 5).map(({ tender, diffDays }) => (
                <div 
                  key={tender.id} 
                  className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <h4 
                      onClick={() => handleOpenTender(tender)}
                      className="text-xs font-bold text-slate-900 truncate hover:text-emerald-700 cursor-pointer"
                    >
                      {tender.title}
                    </h4>
                    <div className="text-[10px] text-slate-500 truncate">{tender.department}</div>
                    <div className="text-[10px] text-slate-400">Date: {tender.submissionDeadline}</div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      diffDays <= 14 ? 'bg-red-100 text-red-800 animate-pulse' :
                      diffDays <= 30 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {diffDays === 0 ? 'Due Today' : `${diffDays} days left`}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* 7. Saved Tenders & Recently Viewed Tenders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Saved Tenders */}
        <div id="saved-tenders-section" className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Bookmark className="w-4 h-4 text-blue-600" />
              Saved Tenders ({savedTendersList.length})
            </h2>
            <button
              onClick={() => setActiveView('tenders')}
              className="text-xs text-blue-700 font-semibold hover:underline"
            >
              Add more
            </button>
          </div>

          {savedTendersList.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-100">
              No saved tenders yet. Bookmark tenders from the Discovery engine to access them quickly here.
            </div>
          ) : (
            <div className="space-y-2">
              {savedTendersList.map((t) => (
                <div key={t.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0 flex-1">
                    <h4 
                      onClick={() => handleOpenTender(t)}
                      className="font-bold text-slate-900 truncate hover:text-emerald-700 cursor-pointer"
                    >
                      {t.title}
                    </h4>
                    <span className="text-[10px] text-slate-500">{t.budgetString} • Due: {t.submissionDeadline}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => createOrOpenWorkspace(t.id)}
                      className="px-2.5 py-1 rounded-md bg-slate-900 text-white font-semibold text-[11px] hover:bg-slate-800"
                    >
                      Workspace
                    </button>
                    <button
                      onClick={() => toggleSaveTender(t.id)}
                      className="text-slate-400 hover:text-red-600 p-1 rounded-sm"
                      title="Remove bookmark"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recently Viewed Tenders */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-emerald-600" />
              Recently Viewed Tenders
            </h2>
            <span className="text-[10px] text-slate-400">Live navigation history</span>
          </div>

          {userRecentlyViewed.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-100">
              Your recently viewed RFPs will appear here as you explore tenders.
            </div>
          ) : (
            <div className="space-y-2">
              {userRecentlyViewed.slice(0, 4).map(({ record, tender }) => (
                <div 
                  key={tender.id}
                  onClick={() => handleOpenTender(tender)}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 cursor-pointer flex items-center justify-between gap-3 text-xs transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-slate-900 truncate hover:text-emerald-700">
                      {tender.title}
                    </h4>
                    <span className="text-[10px] text-slate-500">{tender.department}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                    {record.viewedAt}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* 8. Visual Analytics: Sector Distribution & Application Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Tender Category Distribution Pie Chart (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Procurement Landscape</h3>
            <p className="text-sm font-bold text-slate-900">Tender Category Distribution</p>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={3}
                  dataKey="count"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val, name) => [`${val} Tenders`, name]}
                  contentStyle={{ fontSize: '11px', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-600 pt-2 border-t border-slate-100">
            {categoryData.map((c, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                <span className="truncate">{c.name} ({c.count})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Application Pipeline Stages (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Lifecycle Tracking</h3>
              <p className="text-sm font-bold text-slate-900">Your Bid Application Pipeline</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Tracked Value: </span>
              <span className="text-sm font-black text-slate-900">₹{totalPipelineValueCr} Cr</span>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2 text-center text-xs pt-1">
            {pipelineStages.map((st, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-1">
                <span className="text-xl font-black text-slate-900">{st.count}</span>
                <span className={`text-[10px] font-bold ${st.color}`}>{st.name}</span>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>All submissions monitored for officer technical clarification requests.</span>
            </div>
            <button
              onClick={() => setActiveView('applications')}
              className="text-xs font-bold text-emerald-800 hover:underline shrink-0"
            >
              View Bids &rarr;
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
