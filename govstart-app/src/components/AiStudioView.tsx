'use client';

import React, { useState } from 'react';
import { useApp } from '../lib/context/app-context';
import { 
  Sparkles, 
  FileText, 
  ShieldCheck, 
  FileCheck2, 
  MessageSquare, 
  ChevronDown,
  Building2,
  Calendar,
  Layers,
  UploadCloud
} from 'lucide-react';
import AiMatchMatrix from './AiMatchMatrix';
import AiDocumentSummarizer from './AiDocumentSummarizer';
import AiEligibilityChecker from './AiEligibilityChecker';
import AiProposalStudio from './AiProposalStudio';
import AiChatbot from './AiChatbot';
import TenderPdfAnalyzer from './TenderPdfAnalyzer';
import AiCopilotWorkspace from './AiCopilotWorkspace';

export default function AiStudioView() {
  const { tenders, selectedTender, setSelectedTender, currentStartup } = useApp();

  const [activeTab, setActiveTab] = useState<'copilot' | 'pdf-analyzer' | 'match' | 'summarize' | 'eligibility' | 'proposal' | 'chat'>('copilot');

  const tender = selectedTender || tenders[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Studio Header & Tender Selector Dropdown */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-emerald-50 text-emerald-700">
              <Sparkles className="w-4 h-4" />
            </span>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">AI Procurement Intelligence Studio</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Extract text from tender PDFs, verify mandatory vs desirable criteria, detect clause contradictions, and prepare bids.
          </p>
        </div>

        {/* Selected Tender Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold uppercase hidden sm:inline">Active Tender:</span>
          <select
            value={tender.id}
            onChange={(e) => {
              const found = tenders.find(t => t.id === e.target.value);
              if (found) setSelectedTender(found);
            }}
            className="py-2 px-3 text-xs font-semibold border border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900 max-w-[280px] sm:max-w-[360px] truncate"
          >
            {tenders.map((t) => (
              <option key={t.id} value={t.id}>
                {t.referenceNumber} - {t.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs border-b border-slate-200">
        <button
          onClick={() => setActiveTab('copilot')}
          className={`px-4 py-2.5 font-bold rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
            activeTab === 'copilot'
              ? 'border-slate-900 text-slate-900 bg-white shadow-2xs'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>AI Growth Copilot</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-extrabold">CORE</span>
        </button>

        <button
          onClick={() => setActiveTab('pdf-analyzer')}
          className={`px-4 py-2.5 font-bold rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
            activeTab === 'pdf-analyzer'
              ? 'border-slate-900 text-slate-900 bg-white shadow-2xs'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <UploadCloud className="w-4 h-4 text-emerald-600" />
          <span>Upload & Analyze PDF</span>
        </button>

        <button
          onClick={() => setActiveTab('match')}
          className={`px-4 py-2.5 font-bold rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
            activeTab === 'match'
              ? 'border-slate-900 text-slate-900 bg-white shadow-2xs'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-600" />
          1. AI Match Matrix
        </button>

        <button
          onClick={() => setActiveTab('summarize')}
          className={`px-4 py-2.5 font-bold rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
            activeTab === 'summarize'
              ? 'border-slate-900 text-slate-900 bg-white shadow-2xs'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4 text-blue-600" />
          2. Document Summarizer
        </button>

        <button
          onClick={() => setActiveTab('eligibility')}
          className={`px-4 py-2.5 font-bold rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
            activeTab === 'eligibility'
              ? 'border-slate-900 text-slate-900 bg-white shadow-2xs'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          3. DPIIT Exemption Checker
        </button>

        <button
          onClick={() => setActiveTab('proposal')}
          className={`px-4 py-2.5 font-bold rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
            activeTab === 'proposal'
              ? 'border-slate-900 text-slate-900 bg-white shadow-2xs'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <FileCheck2 className="w-4 h-4 text-purple-600" />
          4. Bid Proposal Studio
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`px-4 py-2.5 font-bold rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
            activeTab === 'chat'
              ? 'border-slate-900 text-slate-900 bg-white shadow-2xs'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-amber-600" />
          5. Grounded RAG Chat
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'copilot' && <AiCopilotWorkspace />}
        {activeTab === 'pdf-analyzer' && <TenderPdfAnalyzer />}
        {activeTab === 'match' && <AiMatchMatrix tender={tender} />}
        {activeTab === 'summarize' && <AiDocumentSummarizer tender={tender} />}
        {activeTab === 'eligibility' && <AiEligibilityChecker tender={tender} />}
        {activeTab === 'proposal' && <AiProposalStudio tender={tender} />}
        {activeTab === 'chat' && <AiChatbot tender={tender} />}
      </div>

    </div>
  );
}
