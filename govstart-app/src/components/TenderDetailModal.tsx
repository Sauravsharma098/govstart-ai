'use client';

import React from 'react';
import { useApp } from '../lib/context/app-context';
import { Tender } from '../lib/types';
import { 
  X, 
  Building2, 
  Calendar, 
  DollarSign, 
  ShieldCheck, 
  FileText, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  Bookmark
} from 'lucide-react';
import { calculateMatchScore } from '@/lib/ai/ai-service';

interface Props {
  tender: Tender;
  onClose: () => void;
}

export default function TenderDetailModal({ tender, onClose }: Props) {
  const { currentStartup, savedTenderIds, toggleSaveTender, setActiveView, setSelectedTender, weights } = useApp();

  const match = currentStartup ? calculateMatchScore(tender, currentStartup, weights) : null;
  const isSaved = savedTenderIds.includes(tender.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Modal Header */}
        <div className="p-6 bg-slate-900 text-white shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
              {tender.referenceNumber}
            </span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800">
              EMD Exempt for Startups
            </span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-950 text-blue-400 border border-blue-800">
              {tender.sector}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black leading-snug">{tender.title}</h2>
          <p className="text-xs text-slate-400 mt-1">{tender.department} • {tender.ministry}</p>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800">
          
          {/* Summary Metric Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-semibold text-slate-500 uppercase">Estimated Budget</span>
              <div className="text-base font-extrabold text-slate-900">{tender.budgetString}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-semibold text-slate-500 uppercase">EMD Deposit</span>
              <div className="text-base font-extrabold text-emerald-700">₹0 (100% Waived)</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-semibold text-slate-500 uppercase">Cutoff Deadline</span>
              <div className="text-base font-extrabold text-slate-900">{tender.submissionDeadline}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-semibold text-slate-500 uppercase">Deployment Location</span>
              <div className="text-xs font-bold text-slate-900 truncate">{tender.location}</div>
            </div>
          </div>

          {/* AI Match Overview Banner */}
          {match && (
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs font-bold text-emerald-900">
                    AI Match Score for {currentStartup?.name}: {match.overallScore}%
                  </span>
                </div>
                <p className="text-xs text-emerald-800 mt-1">{match.recommendation}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedTender(tender);
                  onClose();
                  setActiveView('ai-studio');
                }}
                className="px-4 py-2 rounded-lg bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors shrink-0 shadow-xs"
              >
                Launch AI Proposal Studio
              </button>
            </div>
          )}

          {/* Detailed Scope of Work */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">Scope of Procurement & Operational Brief</h3>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
              {tender.description}
            </p>
          </div>

          {/* Minimum Eligibility Criteria */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">Mandatory Technical Eligibility Criteria</h3>
            <div className="space-y-2">
              {tender.eligibilityCriteria.map((c, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Clauses & Statutory Protections */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">Key RFP Clauses & Statutory Exemption Flags</h3>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {tender.clauses.map((clause, idx) => (
                <div key={idx} className="p-3.5 bg-white flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{clause.clauseNumber}: {clause.title}</span>
                      {clause.exemptionApplicable && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-emerald-100 text-emerald-800">
                          Startup Exemption Applicable
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{clause.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 shrink-0 flex items-center justify-between">
          <button
            onClick={() => toggleSaveTender(tender.id)}
            className={`px-3 py-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              isSaved ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Bookmark className="w-4 h-4 fill-current" />
            {isSaved ? 'Saved to Bookmarks' : 'Save Tender'}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedTender(tender);
                onClose();
                setActiveView('ai-studio');
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Analyze with AI Studio
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
