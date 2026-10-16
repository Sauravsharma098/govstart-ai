'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/app-context';
import { LearningResource } from '@/lib/types';
import { 
  BookOpen, 
  GraduationCap, 
  Languages, 
  CheckSquare, 
  ExternalLink, 
  Search, 
  ShieldCheck, 
  Sparkles, 
  FileText, 
  Award, 
  Users, 
  Layers, 
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

export default function LearningHub() {
  const { learningResources, setActiveView } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeResource, setActiveResource] = useState<LearningResource | null>(learningResources[0] || null);
  const [readinessChecklistState, setReadinessChecklistState] = useState<Record<number, boolean>>({
    0: true,
    1: true,
    2: true,
    3: false,
    4: false
  });

  const readinessPoints = [
    { title: 'Class 3 Digital Signature Certificate (DSC)', desc: 'Obtained from authorized Certifying Authority (e-Mudhra / Capricorn) with signing & encryption keys.' },
    { title: 'DPIIT Startup India Recognition Certificate', desc: 'Valid certificate with verifiable QR code to claim 100% EMD and turnover exemptions under GFR 170(i).' },
    { title: 'MSME Udyam Registration Certificate', desc: 'Active Udyam registration for 25% public procurement policy preference in central bids.' },
    { title: 'Active GSTIN & 6-Month GSTR-3B Filings', desc: 'Required to demonstrate statutory compliance and active commercial trading status.' },
    { title: 'Verified Primary Seller Account on GeM Portal', desc: 'Completed GeM onboarding with bank account validation and PAN linkage.' },
    { title: 'Audited Financials / CA Net Worth with UDIN', desc: 'Audited balance sheets for the last 2 financial years with Institute of Chartered Accountants UDIN.' },
    { title: 'Make in India (MII) Local Content Declaration', desc: 'Percentage calculation of domestic value-addition for Class-I (>=50%) or Class-II supplier preference.' },
    { title: 'Statutory Non-Blacklisting & Debarment Affidavit', desc: 'Standard non-judicial stamp declaration verifying zero debarment across central/state portals.' },
    { title: 'Technical ISO / Quality Approvals', desc: 'Relevant ISO 9001, ISO 27001, BIS or industry-specific certifications (CEMILAC, CDSCO, etc.).' },
    { title: 'Bank Solvency Certificate & Credit Facility Letter', desc: 'Banker certificate verifying financial liquidity for project working capital requirements.' }
  ];

  const filteredResources = learningResources.filter(r => {
    const matchesCat = selectedCategory === 'ALL' || r.category === selectedCategory;
    const matchesSearch = !searchQuery.trim() || 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.titleHindi && r.titleHindi.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const toggleChecklist = (idx: number) => {
    setReadinessChecklistState(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const completedChecklistCount = Object.values(readinessChecklistState).filter(Boolean).length;
  const readinessPercent = Math.round((completedChecklistCount / readinessPoints.length) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-6 sm:p-10 border border-slate-800 shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
        <div className="relative max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs font-semibold">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>GovStart Procurement Academy & Bilingual Hub</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Learn Government Bidding. Master Public Procurement.
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Practical tutorials, bilingual Hindi-English terminology guides, GFR 2017 regulatory handbooks, and official links to help Indian startups win public contracts.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setSelectedCategory('GUIDE')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-900/20"
            >
              Start Procurement Playbook
            </button>
            <button
              onClick={() => setSelectedCategory('GLOSSARY')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <Languages className="w-3.5 h-3.5 text-emerald-400" />
              Bilingual Glossary (हिन्दी / English)
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Learning Resources on Left, Readiness Audit & Links on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 Cols): Search, Filter & Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search guides, terms, GFR clauses (e.g. EMD, L1, reverse auction)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>
            
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 text-xs">
              {['ALL', 'GUIDE', 'GLOSSARY', 'CHECKLIST', 'TUTORIAL'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'ALL' ? 'All Guides' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Active Article Viewer (if selected) or Cards Grid */}
          {activeResource ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6">
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                      {activeResource.category}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {activeResource.readingTimeMin} min read
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      Level: {activeResource.level}
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900 leading-snug">
                    {activeResource.title}
                  </h2>
                  {activeResource.titleHindi && (
                    <p className="text-sm font-semibold text-emerald-800 mt-1">
                      {activeResource.titleHindi}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setActiveResource(null)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors shrink-0"
                >
                  View All Guides
                </button>
              </div>

              {/* Summary Callout */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                <span className="font-bold text-slate-900">Summary: </span>
                {activeResource.summary}
              </div>

              {/* Markdown Content */}
              <div className="prose prose-slate prose-sm max-w-none text-slate-700 space-y-4 text-xs leading-relaxed">
                <div className="whitespace-pre-line font-sans">
                  {activeResource.contentMarkdown}
                </div>
              </div>

              {/* Tags & Official Link */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  {activeResource.tags.map(t => (
                    <span key={t} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      #{t}
                    </span>
                  ))}
                </div>
                {activeResource.officialUrl && (
                  <a
                    href={activeResource.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
                  >
                    <span>Official Gazette / Portal Manual</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredResources.map((res) => (
                <div
                  key={res.id}
                  onClick={() => setActiveResource(res)}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 shadow-2xs hover:shadow-md cursor-pointer transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
                        {res.category}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {res.readingTimeMin}m
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                      {res.title}
                    </h3>
                    {res.titleHindi && (
                      <p className="text-xs text-slate-500 font-medium truncate">
                        {res.titleHindi}
                      </p>
                    )}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {res.summary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-slate-900 pt-2 border-t border-slate-100 group-hover:text-emerald-700">
                    <span>Read Guide</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Right Column: Readiness Checklist & Official Resources */}
        <div className="space-y-6">
          
          {/* 10-Point Readiness Audit Card */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Startup Readiness Audit</h3>
              </div>
              <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {readinessPercent}% Ready
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Verify these 10 administrative credentials before placing bids on GeM or Central Public Portals.
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${readinessPercent}%` }}
              />
            </div>

            {/* Checklist Items */}
            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              {readinessPoints.map((pt, idx) => (
                <div
                  key={idx}
                  onClick={() => toggleChecklist(idx)}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
                    readinessChecklistState[idx]
                      ? 'border-emerald-300 bg-emerald-50/50 text-slate-900'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={!!readinessChecklistState[idx]}
                    readOnly
                    className="mt-0.5 rounded-sm text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5 shrink-0"
                  />
                  <div>
                    <div className="font-bold text-[11px] text-slate-900">{pt.title}</div>
                    <div className="text-[10px] text-slate-500 leading-tight mt-0.5">{pt.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => setActiveView('ai-studio')}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Audit Tender with AI Studio
              </button>
            </div>
          </div>

          {/* Official Procurement Links Directory */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Official Government Portals</h3>
            </div>
            <p className="text-xs text-slate-500">
              Direct access to authorized national procurement gazettes and registration engines.
            </p>

            <div className="space-y-2">
              {[
                { name: 'GeM (Government e-Marketplace)', desc: 'Official primary national procurement portal', url: 'https://gem.gov.in' },
                { name: 'CPPP (Central Public Procurement Portal)', desc: 'e-Procurement portal of Government of India', url: 'https://eprocure.gov.in' },
                { name: 'Startup India Portal (DPIIT)', desc: 'Obtain startup recognition for GFR 170(i) waivers', url: 'https://www.startupindia.gov.in' },
                { name: 'Udyam Registration Portal', desc: 'Free online registration for Micro, Small & Medium Enterprises', url: 'https://udyamregistration.gov.in' },
                { name: 'MSME Samadhaan', desc: 'Delayed payment monitoring system for micro & small enterprises', url: 'https://samadhaan.msme.gov.in' }
              ].map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 flex items-center justify-between text-xs transition-all group"
                >
                  <div>
                    <div className="font-bold text-slate-900 group-hover:text-blue-700">{link.name}</div>
                    <div className="text-[10px] text-slate-500">{link.desc}</div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0 ml-2" />
                </a>
              ))}
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-[10px] text-slate-500 border border-slate-200 leading-relaxed">
              <span className="font-bold text-slate-700">Official Source Note:</span> GovStart AI indexes tenders published under open public procurement standards. Always verify final RFP submissions directly on the respective official authority portal.
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
