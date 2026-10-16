'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '../lib/context/app-context';
import { Tender } from '../lib/types';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Calendar, 
  Building2, 
  Sparkles, 
  Bookmark, 
  ArrowUpRight, 
  Grid, 
  List, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { calculateMatchScore } from '@/lib/ai/ai-service';
import TenderDetailModal from './TenderDetailModal';

export default function TenderDiscovery() {
  const { 
    tenders, 
    currentStartup, 
    savedTenderIds, 
    toggleSaveTender, 
    setSelectedTender, 
    setActiveView,
    weights,
    addToShortlist,
    shortlistRecords,
    addSavedSearch
  } = useApp();

  const [savedSearchSuccess, setSavedSearchSuccess] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'match' | 'deadline' | 'budget'>('match');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [modalTender, setModalTender] = useState<Tender | null>(null);

  const sectors = ['ALL', 'Defence & Aerospace', 'Healthcare & Life Sciences', 'CleanTech & Renewable Energy', 'AgriTech & Remote Sensing', 'Cybersecurity & Quantum Tech'];
  const departments = ['ALL', 'DRDO', 'NHM', 'MeitY', 'SECI', 'ICAR', 'ISRO'];

  // Filter & Rank tenders
  const filteredTenders = useMemo(() => {
    return tenders.map(tender => {
      const match = currentStartup ? calculateMatchScore(tender, currentStartup, weights) : null;
      return { tender, match };
    }).filter(({ tender }) => {
      const matchesSearch = 
        tender.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tender.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tender.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tender.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesSector = selectedSector === 'ALL' || tender.sector === selectedSector;
      const matchesDept = selectedDept === 'ALL' || tender.department.includes(selectedDept);

      return matchesSearch && matchesSector && matchesDept;
    }).sort((a, b) => {
      if (sortBy === 'match') {
        return (b.match?.overallScore || 0) - (a.match?.overallScore || 0);
      }
      if (sortBy === 'budget') {
        return b.tender.estimatedBudgetInr - a.tender.estimatedBudgetInr;
      }
      return new Date(a.tender.submissionDeadline).getTime() - new Date(b.tender.submissionDeadline).getTime();
    });
  }, [tenders, currentStartup, weights, searchQuery, selectedSector, selectedDept, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Government Tender Discovery Engine
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse verified Central & State procurement opportunities with automatic DPIIT startup exemption verification.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-lg border border-slate-200 flex items-center">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md text-xs transition-colors ${viewMode === 'grid' ? 'bg-white shadow-2xs text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-900'}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md text-xs transition-colors ${viewMode === 'list' ? 'bg-white shadow-2xs text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-900'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-4">
        
        {/* Top Row: Search input + dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keywords (e.g. UAV, Tele-ICU, Microgrid, eBPF, Drone)..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full py-2 px-3 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900 bg-white"
            >
              <option value="ALL">All Procuring Agencies</option>
              {departments.filter(d => d !== 'ALL').map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full py-2 px-3 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900 bg-white"
            >
              <option value="match">Sort by AI Match Score</option>
              <option value="deadline">Sort by Closing Deadline</option>
              <option value="budget">Sort by Total Budget (High to Low)</option>
            </select>
          </div>

        </div>

        {/* Sector Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs">
          <span className="text-slate-400 text-[11px] font-semibold uppercase shrink-0 mr-1">Sector:</span>
          {sectors.map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSector(sec)}
              className={`px-2.5 py-1 rounded-lg shrink-0 transition-colors ${
                selectedSector === sec
                  ? 'bg-slate-900 text-white font-semibold shadow-2xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {sec === 'ALL' ? 'All Sectors' : sec.split('&')[0]}
            </button>
          ))}
        </div>

      </div>

      {/* Results Header & Save Search Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 font-medium px-1">
        <div className="flex items-center gap-2">
          <span>Showing {filteredTenders.length} active opportunities</span>
          {searchQuery && (
            <button
              onClick={() => {
                addSavedSearch({
                  userId: currentStartup?.id || 'startup-1',
                  name: `Search: "${searchQuery}"`,
                  query: searchQuery,
                  sector: selectedSector !== 'ALL' ? selectedSector : undefined,
                  emdExemptOnly: true,
                  alertFrequency: 'DAILY'
                });
                setSavedSearchSuccess(true);
                setTimeout(() => setSavedSearchSuccess(false), 2500);
              }}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1 transition-all"
            >
              <Bookmark className="w-3 h-3 text-emerald-600" />
              {savedSearchSuccess ? 'Alert Saved!' : 'Save Search Alert'}
            </button>
          )}
        </div>
        <span>Evaluation calibrated for: <strong className="text-slate-800">{currentStartup?.name}</strong></span>
      </div>

      {/* Tenders Grid / List */}
      {filteredTenders.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 space-y-3">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-800 text-sm">No matching government tenders found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try broadening your search query or reset the sector filter.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedSector('ALL'); setSelectedDept('ALL'); }}
            className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTenders.map(({ tender, match }) => {
            const isSaved = savedTenderIds.includes(tender.id);

            return (
              <div
                key={tender.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                        {tender.referenceNumber}
                      </span>
                      {tender.trustLevel === 'DEMO_RECORD' ? (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                          Demo
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-0.5">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          {tender.portalSource || 'GeM Verified'}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => toggleSaveTender(tender.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isSaved ? 'text-blue-700 bg-blue-50' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                      }`}
                      title={isSaved ? 'Bookmarked' : 'Bookmark'}
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  <h3
                    onClick={() => setModalTender(tender)}
                    className="font-bold text-slate-900 text-sm leading-snug group-hover:text-emerald-700 cursor-pointer transition-colors"
                  >
                    {tender.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                    {tender.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {tender.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-100 font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Budget Value</span>
                      <div className="text-sm font-extrabold text-slate-900">{tender.budgetString}</div>
                    </div>
                    {match && (
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">AI Match</span>
                        <div className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <Sparkles className="w-3 h-3" /> {match.overallScore}%
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> Closes: {tender.submissionDeadline}
                    </span>
                    <span className="text-emerald-700 font-semibold text-[10px]">
                      EMD Waived
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 pt-1">
                    <button
                      onClick={() => setModalTender(tender)}
                      className="py-1.5 px-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold text-center transition-colors"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => addToShortlist(tender.id)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1 ${
                        shortlistRecords.some(s => s.tenderId === tender.id)
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold'
                          : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <Bookmark className="w-3 h-3 text-indigo-600" />
                      <span>{shortlistRecords.some(s => s.tenderId === tender.id) ? 'Shortlisted' : 'Shortlist'}</span>
                    </button>
                    <button
                      onClick={() => { setSelectedTender(tender); setActiveView('ai-studio'); }}
                      className="py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1"
                    >
                      Copilot <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-2xs overflow-hidden">
          {filteredTenders.map(({ tender, match }) => {
            const isSaved = savedTenderIds.includes(tender.id);

            return (
              <div key={tender.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                      {tender.referenceNumber}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm">
                      DPIIT Exempt
                    </span>
                    <span className="text-[10px] text-slate-400">Deadline: {tender.submissionDeadline}</span>
                  </div>
                  <h3
                    onClick={() => setModalTender(tender)}
                    className="font-bold text-slate-900 text-sm hover:text-emerald-700 cursor-pointer"
                  >
                    {tender.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-1">{tender.department} • {tender.sector}</p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <div className="text-sm font-extrabold text-slate-900">{tender.budgetString}</div>
                    {match && (
                      <div className="text-xs font-bold text-emerald-700">{match.overallScore}% Match</div>
                    )}
                  </div>
                  <button
                    onClick={() => setModalTender(tender)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Review
                  </button>
                  <button
                    onClick={() => { setSelectedTender(tender); setActiveView('ai-studio'); }}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 flex items-center gap-1"
                  >
                    AI Studio <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Render Tender Detail Modal if opened */}
      {modalTender && (
        <TenderDetailModal
          tender={modalTender}
          onClose={() => setModalTender(null)}
        />
      )}

    </div>
  );
}
