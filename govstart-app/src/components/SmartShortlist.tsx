'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '../lib/context/app-context';
import { Tender, ShortlistRecord, TenderRecommendation, EligibilityStatus, DataConfidenceLevel } from '../lib/types';
import {
  Bookmark,
  Sparkles,
  AlertTriangle,
  Trash2,
  ExternalLink,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Eye,
  Zap,
  Building2,
  X,
  RefreshCw,
  Search,
  Scale,
  FileText
} from 'lucide-react';

export default function SmartShortlist() {
  const {
    currentStartup,
    tenders,
    shortlistRecords,
    removeFromShortlist,
    recommendations,
    setSelectedTender,
    setActiveView,
    createOrOpenWorkspace
  } = useApp();

  // Filters & Sorting state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [eligibilityFilter, setEligibilityFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'MATCH' | 'DEADLINE' | 'VALUE' | 'CONFIDENCE'>('MATCH');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Selected tenders for side-by-side comparison (max 3)
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [compareData, setCompareData] = useState<any[] | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  // Map TenderRecommendations by tenderId for quick lookup
  const recMap = useMemo(() => {
    const map = new Map<string, TenderRecommendation>();
    recommendations.forEach(r => map.set(r.tender.id, r));
    return map;
  }, [recommendations]);

  // Combined shortlisted items with full tender info + AI recommendation details
  const shortlistedItems = useMemo(() => {
    return shortlistRecords
      .map(record => {
        const tender = tenders.find(t => t.id === record.tenderId);
        const rec = recMap.get(record.tenderId);
        return { record, tender, rec };
      })
      .filter(
        (item): item is { record: ShortlistRecord; tender: Tender; rec: TenderRecommendation | undefined } =>
          item.tender !== undefined
      );
  }, [shortlistRecords, tenders, recMap]);

  // Unique categories for dropdown filter
  const categories = useMemo(() => {
    return Array.from(new Set(shortlistedItems.map(i => i.tender.category)));
  }, [shortlistedItems]);

  // Filter + sort
  const filteredItems = useMemo(() => {
    return shortlistedItems
      .filter(({ tender, rec }) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          if (
            !tender.title.toLowerCase().includes(q) &&
            !tender.referenceNumber.toLowerCase().includes(q) &&
            !tender.department.toLowerCase().includes(q)
          ) return false;
        }
        if (categoryFilter !== 'ALL' && tender.category !== categoryFilter) return false;
        if (eligibilityFilter !== 'ALL' && rec?.eligibilityStatus !== eligibilityFilter) return false;
        return true;
      })
      .sort((a, b) => {
        let comparison = 0;
        if (sortBy === 'MATCH') {
          comparison = (a.rec?.matchScore ?? a.record.matchScore) - (b.rec?.matchScore ?? b.record.matchScore);
        } else if (sortBy === 'DEADLINE') {
          comparison =
            new Date(a.tender.submissionDeadline).getTime() -
            new Date(b.tender.submissionDeadline).getTime();
        } else if (sortBy === 'VALUE') {
          comparison = a.tender.estimatedBudgetInr - b.tender.estimatedBudgetInr;
        } else if (sortBy === 'CONFIDENCE') {
          const rank = { HIGH: 3, MEDIUM: 2, LOW: 1 } as const;
          comparison = (rank[a.rec?.dataConfidence || 'LOW']) - (rank[b.rec?.dataConfidence || 'LOW']);
        }
        return sortDirection === 'desc' ? -comparison : comparison;
      });
  }, [shortlistedItems, searchQuery, categoryFilter, eligibilityFilter, sortBy, sortDirection]);

  // Toggle select for comparison (max 3)
  const handleToggleCompare = (tenderId: string) => {
    if (selectedForComparison.includes(tenderId)) {
      setSelectedForComparison(prev => prev.filter(id => id !== tenderId));
    } else {
      if (selectedForComparison.length >= 3) return;
      setSelectedForComparison(prev => [...prev, tenderId]);
    }
  };

  // Open comparison modal
  const handleOpenComparison = async () => {
    if (selectedForComparison.length < 2) return;
    setIsComparing(true);
    setIsCompareModalOpen(true);
    try {
      const res = await fetch('/api/tenders/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenderIds: selectedForComparison, startupId: currentStartup?.id })
      });
      const data = await res.json();
      if (data.comparison) setCompareData(data.comparison);
    } catch (err) {
      console.error('Compare fetch failed', err);
    } finally {
      setIsComparing(false);
    }
  };

  // Helpers
  const renderEligibilityBadge = (status?: EligibilityStatus) => {
    switch (status) {
      case 'ELIGIBLE_PROVISIONAL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Eligible (Provisional)
          </span>
        );
      case 'POTENTIALLY_ELIGIBLE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <HelpCircle className="w-3 h-3" /> Potentially Eligible
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3" /> Likely Ineligible
          </span>
        );
    }
  };

  const renderConfidenceBadge = (conf?: DataConfidenceLevel) => {
    if (conf === 'HIGH')
      return <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">High Confidence</span>;
    if (conf === 'MEDIUM')
      return <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Medium Confidence</span>;
    return <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">Low Confidence</span>;
  };

  const REF_DATE = '2026-10-16';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 text-white p-6 sm:p-8 shadow-xl border border-indigo-900/40">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Bookmark className="w-3.5 h-3.5" /> Pipeline Shortlist
              </span>
              <span className="text-xs text-slate-400">
                Startup: <strong className="text-white">{currentStartup?.name}</strong>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">My AI Shortlist</h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Curated pipeline with explainable match scores, mandatory compliance audits, and multi-tender comparison.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveView('tenders')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-xs text-white font-semibold text-xs border border-white/20 transition-colors flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Discover More Tenders
            </button>
            <button
              onClick={handleOpenComparison}
              disabled={selectedForComparison.length < 2}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                selectedForComparison.length >= 2
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-md'
                  : 'bg-white/10 text-white/40 border border-white/20 cursor-not-allowed'
              }`}
            >
              <Scale className="w-4 h-4" /> Compare Selected ({selectedForComparison.length}/3)
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Controls Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, reference ID or department…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50/50"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-2 rounded-lg border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="ALL">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <select
              value={eligibilityFilter}
              onChange={(e) => setEligibilityFilter(e.target.value)}
              className="px-2.5 py-2 rounded-lg border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="ALL">All Eligibility</option>
              <option value="ELIGIBLE_PROVISIONAL">Eligible (Provisional)</option>
              <option value="POTENTIALLY_ELIGIBLE">Potentially Eligible</option>
              <option value="LIKELY_INELIGIBLE">Likely Ineligible</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="MATCH">Sort: Match Score</option>
              <option value="DEADLINE">Sort: Deadline</option>
              <option value="VALUE">Sort: Contract Value</option>
              <option value="CONFIDENCE">Sort: Data Confidence</option>
            </select>

            <button
              onClick={() => setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
              title={sortDirection === 'desc' ? 'Currently: Descending' : 'Currently: Ascending'}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span>Showing <strong>{filteredItems.length}</strong> of <strong>{shortlistedItems.length}</strong> tenders</span>
          {selectedForComparison.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-indigo-700 font-semibold">{selectedForComparison.length} selected</span>
              <button onClick={() => setSelectedForComparison([])} className="text-slate-400 hover:text-slate-700 underline text-[11px]">
                Clear selection
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">
            {shortlistedItems.length === 0 ? 'Your shortlist is empty' : 'No results match your filters'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {shortlistedItems.length === 0
              ? 'Add tenders from the AI Recommendations section on your dashboard or browse all opportunities.'
              : 'Try resetting your filters or searching with different keywords.'}
          </p>
          <button
            onClick={() => setActiveView('dashboard')}
            className="mt-3 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Go to AI Recommendations
          </button>
        </div>
      )}

      {/* Shortlist Cards */}
      <div className="space-y-4">
        {filteredItems.map(({ record, tender, rec }) => {
          const isSelected = selectedForComparison.includes(tender.id);
          const score = rec?.matchScore ?? record.matchScore;
          const daysRemaining = Math.max(
            0,
            Math.ceil((new Date(tender.submissionDeadline).getTime() - new Date(REF_DATE).getTime()) / 86_400_000)
          );

          return (
            <div
              key={record.id}
              className={`bg-white rounded-2xl border transition-all p-5 shadow-2xs hover:shadow-md ${
                isSelected ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-5">

                {/* Left — Tender Details */}
                <div className="flex-1 space-y-3">

                  {/* Tag Row */}
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="checkbox"
                      id={`cmp-${tender.id}`}
                      checked={isSelected}
                      onChange={() => handleToggleCompare(tender.id)}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      title="Select for side-by-side comparison"
                    />
                    <label htmlFor={`cmp-${tender.id}`} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 cursor-pointer">
                      {tender.referenceNumber}
                    </label>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                      {tender.category}
                    </span>
                    {renderEligibilityBadge(rec?.eligibilityStatus ?? record.eligibilityStatus)}
                    {renderConfidenceBadge(rec?.dataConfidence ?? record.dataConfidence)}
                  </div>

                  {/* Title */}
                  <div>
                    <h3
                      onClick={() => { setSelectedTender(tender); setActiveView('ai-studio'); }}
                      className="text-base font-bold text-slate-900 hover:text-emerald-700 cursor-pointer transition-colors leading-snug"
                    >
                      {tender.title}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" /> {tender.department}
                    </p>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Contract Value</span>
                      <span className="font-bold text-slate-900">{tender.budgetString}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Deadline</span>
                      <span className="font-bold text-slate-900">{tender.submissionDeadline}</span>
                      <span className={`text-[10px] font-semibold block ${daysRemaining <= 14 ? 'text-red-600' : 'text-amber-700'}`}>
                        {daysRemaining} days left
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">EMD Policy</span>
                      <span className={`font-bold text-xs ${tender.emdExemptForStartups ? 'text-emerald-700' : 'text-slate-900'}`}>
                        {tender.emdExemptForStartups ? 'DPIIT Waived' : `₹${tender.emdAmountInr.toLocaleString()}`}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Shortlisted On</span>
                      <span className="font-medium text-slate-700 text-[11px]">
                        {new Date(record.addedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {/* AI Reasons */}
                  {rec && rec.matchReasons.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-600" /> Why this matches {currentStartup?.name}:
                      </span>
                      <ul className="text-xs text-slate-600 space-y-0.5 pl-4 list-disc">
                        {rec.matchReasons.map((r, i) => <li key={i} className="leading-relaxed">{r}</li>)}
                      </ul>
                    </div>
                  )}

                  {/* Missing Requirements */}
                  {rec && rec.missingRequirements.length > 0 && (
                    <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/80 space-y-1">
                      <span className="text-[10px] font-bold text-amber-900 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-600" /> Missing Requirements / Gaps:
                      </span>
                      <ul className="text-[11px] text-amber-800 space-y-0.5 pl-4 list-disc">
                        {rec.missingRequirements.map((m, i) => <li key={i}>{m}</li>)}
                      </ul>
                    </div>
                  )}

                  {/* Mandatory Failures */}
                  {rec && rec.mandatoryEligibilityFailures.length > 0 && (
                    <div className="p-2.5 rounded-lg bg-rose-50/70 border border-rose-200/80 space-y-1">
                      <span className="text-[10px] font-bold text-rose-900 flex items-center gap-1">
                        <XCircle className="w-3 h-3 text-rose-600" /> Mandatory Eligibility Failures:
                      </span>
                      <ul className="text-[11px] text-rose-800 space-y-0.5 pl-4 list-disc">
                        {rec.mandatoryEligibilityFailures.map((f, i) => <li key={i}>{f}</li>)}
                      </ul>
                    </div>
                  )}

                  {/* Required Docs */}
                  {rec && rec.requiredDocuments.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase self-center">Required Docs:</span>
                      {rec.requiredDocuments.slice(0, 5).map((d, i) => (
                        <span key={i} className={`text-[10px] px-2 py-0.5 rounded border font-medium ${
                          rec.missingDocuments.includes(d)
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}>
                          {d}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Notes */}
                  {record.notes && (
                    <div className="p-2.5 rounded-lg bg-indigo-50/50 border border-indigo-100 text-xs text-indigo-900">
                      <strong className="font-semibold">Note:</strong> {record.notes}
                    </div>
                  )}
                </div>

                {/* Right — Score Card + Actions */}
                <div className="lg:w-56 flex flex-col gap-4 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-4">

                  {/* Score Card */}
                  <div className="text-center p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">AI Match Score</div>
                    <div className="text-4xl font-black text-slate-900">{score}</div>
                    <div className="text-[10px] text-slate-400">/100 — {rec?.eligibilityStatus === 'ELIGIBLE_PROVISIONAL' ? '✅' : rec?.eligibilityStatus === 'POTENTIALLY_ELIGIBLE' ? '⚠️' : '🚫'}</div>
                    {rec?.scoreBreakdown && (
                      <div className="space-y-1 pt-1.5 border-t border-slate-200 text-[10px] text-slate-600 text-left">
                        <div className="flex justify-between"><span>Industry:</span><span className="font-semibold">{rec.scoreBreakdown.industryRelevance}/25</span></div>
                        <div className="flex justify-between"><span>Technical:</span><span className="font-semibold">{rec.scoreBreakdown.technicalCapability}/25</span></div>
                        <div className="flex justify-between"><span>Compliance:</span><span className="font-semibold">{rec.scoreBreakdown.eligibilityCompliance}/20</span></div>
                        <div className="flex justify-between"><span>Experience:</span><span className="font-semibold">{rec.scoreBreakdown.experienceCerts}/10</span></div>
                        <div className="flex justify-between"><span>Budget Fit:</span><span className="font-semibold">{rec.scoreBreakdown.budgetSuitability}/10</span></div>
                        <div className="flex justify-between"><span>Deadline:</span><span className="font-semibold">{rec.scoreBreakdown.deadlineReadiness}/10</span></div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <button
                      onClick={() => createOrOpenWorkspace(tender.id)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-400" /> Open Bid Workspace
                    </button>
                    <button
                      onClick={() => { setSelectedTender(tender); setActiveView('ai-studio'); }}
                      className="w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs border border-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" /> Analyze with AI
                    </button>
                    <div className="flex items-center gap-2">
                      {tender.officialSourceUrl && (
                        <a
                          href={tender.officialSourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium flex items-center justify-center gap-1 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" /> Official Portal
                        </a>
                      )}
                      <button
                        onClick={() => removeFromShortlist(tender.id)}
                        className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Remove from shortlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Side-by-Side Comparison Modal */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden">

            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-indigo-600" />
                <h2 className="text-base font-bold text-slate-900">
                  Side-by-Side Comparison — {selectedForComparison.length} Tenders
                </h2>
              </div>
              <button
                onClick={() => { setIsCompareModalOpen(false); setCompareData(null); }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1">
              {isComparing ? (
                <div className="text-center py-16 space-y-3">
                  <RefreshCw className="w-7 h-7 animate-spin text-indigo-600 mx-auto" />
                  <p className="text-sm text-slate-500">Evaluating multi-tender compliance matrix…</p>
                </div>
              ) : compareData ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100/60 border-b border-slate-200">
                        <th className="p-3 font-bold text-slate-600 w-44 text-[11px] uppercase tracking-wider">Dimension</th>
                        {compareData.map((item: any) => (
                          <th key={item.tender.id} className="p-3 font-bold text-slate-900 min-w-[220px]">
                            <div className="text-[10px] text-slate-500 font-semibold">{item.tender.referenceNumber}</div>
                            <div className="line-clamp-2 text-xs font-black leading-snug">{item.tender.title}</div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        {
                          label: 'AI Match Score',
                          render: (item: any) => <span className="text-xl font-black text-emerald-700">{item.recommendation?.matchScore ?? 'N/A'}/100</span>
                        },
                        {
                          label: 'Eligibility Status',
                          render: (item: any) => renderEligibilityBadge(item.recommendation?.eligibilityStatus)
                        },
                        {
                          label: 'Data Confidence',
                          render: (item: any) => renderConfidenceBadge(item.recommendation?.dataConfidence)
                        },
                        {
                          label: 'Contract Value',
                          render: (item: any) => <span className="font-bold text-slate-900">{item.tender.budgetString}</span>
                        },
                        {
                          label: 'EMD Policy',
                          render: (item: any) => (
                            <span className={`font-semibold ${item.tender.emdExemptForStartups ? 'text-emerald-700' : 'text-slate-700'}`}>
                              {item.tender.emdExemptForStartups ? '100% DPIIT Exemption' : `₹${item.tender.emdAmountInr?.toLocaleString()}`}
                            </span>
                          )
                        },
                        {
                          label: 'Submission Deadline',
                          render: (item: any) => (
                            <div>
                              <span className="font-semibold text-slate-800 block">{item.tender.submissionDeadline}</span>
                              <span className="text-[10px] text-amber-700">{item.recommendation?.daysRemaining} days left</span>
                            </div>
                          )
                        },
                        {
                          label: 'Key Strengths',
                          render: (item: any) => (
                            <ul className="list-disc pl-3 space-y-1 text-[11px] text-slate-600">
                              {item.recommendation?.matchReasons?.slice(0, 3).map((r: string, i: number) => <li key={i}>{r}</li>)}
                            </ul>
                          )
                        },
                        {
                          label: 'Gaps / Missing',
                          render: (item: any) =>
                            item.recommendation?.missingRequirements?.length > 0 ? (
                              <ul className="list-disc pl-3 space-y-1 text-[11px] text-amber-800">
                                {item.recommendation.missingRequirements.map((m: string, i: number) => <li key={i}>{m}</li>)}
                              </ul>
                            ) : (
                              <span className="text-emerald-700 font-medium text-[11px]">None detected</span>
                            )
                        },
                        {
                          label: 'Mandatory Failures',
                          render: (item: any) =>
                            item.recommendation?.mandatoryEligibilityFailures?.length > 0 ? (
                              <ul className="list-disc pl-3 space-y-1 text-[11px] text-rose-800">
                                {item.recommendation.mandatoryEligibilityFailures.map((f: string, i: number) => <li key={i}>{f}</li>)}
                              </ul>
                            ) : (
                              <span className="text-emerald-700 font-medium text-[11px]">None</span>
                            )
                        }
                      ].map(({ label, render }) => (
                        <tr key={label} className="hover:bg-slate-50">
                          <td className="p-3 font-semibold text-slate-600 text-[11px] uppercase tracking-wide">{label}</td>
                          {compareData.map((item: any) => (
                            <td key={item.tender.id} className="p-3">{render(item)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10 space-y-2">
                  <FileText className="w-6 h-6 text-slate-300 mx-auto" />
                  <p className="text-sm text-slate-500">No comparison data available. Try again.</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-500">
                Evaluation uses DoE Order F.20/2/2014-PPD startup exemption criteria (not a legal determination).
              </span>
              <button
                onClick={() => { setIsCompareModalOpen(false); setCompareData(null); }}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
