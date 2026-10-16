'use client';

import React, { useState } from 'react';
import { Tender } from '../lib/types';
import { generateTenderSummary } from '@/lib/ai/ai-service';
import { 
  FileText, 
  Calendar, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Download,
  Copy,
  Check
} from 'lucide-react';

interface Props {
  tender: Tender;
}

export default function AiDocumentSummarizer({ tender }: Props) {
  const [copied, setCopied] = useState(false);
  const [customText, setCustomText] = useState('');
  const [useCustom, setUseCustom] = useState(false);

  const summary = generateTenderSummary(tender);

  const handleCopy = () => {
    const textToCopy = `TENDER EXECUTIVE SUMMARY\nTitle: ${summary.title}\nRef: ${summary.refNo}\nBudget: ${summary.budgetFormatted}\nCutoff: ${summary.deadlineFormatted}\n\n${summary.executiveBrief}\n\nFinancial Clauses:\n${summary.financialClauses.join('\n')}\n\nKey Requirements:\n${summary.keyRequirements.join('\n')}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header with quick actions */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
              {summary.refNo}
            </span>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              AI Synthesized
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">{summary.title}</h2>
          <p className="text-xs text-slate-500">{summary.department}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy Brief'}
          </button>
        </div>
      </div>

      {/* 3 Metric Badges: Budget, Cutoff, Exemption */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-slate-400">Estimated Total Value</div>
          <div className="text-xl font-black text-slate-900 mt-0.5">{summary.budgetFormatted}</div>
          <div className="text-[11px] text-slate-500 mt-1">Inclusive of GST & on-site trial</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-slate-400">Submission Cutoff</div>
          <div className="text-xl font-black text-slate-900 mt-0.5">{summary.deadlineFormatted}</div>
          <div className="text-[11px] text-amber-600 font-semibold mt-1">17:00 IST Portal Lock</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-slate-400">Startup Exemption</div>
          <div className="text-xl font-black text-emerald-700 mt-0.5">100% EMD Waiver</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">Order No. F.20/2/2014-PPD</div>
        </div>
      </div>

      {/* Executive Brief Box */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Executive Summary</h3>
        <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
          {summary.executiveBrief}
        </p>
      </div>

      {/* 2-Column: Key Requirements & Financial Obligations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Key Technical Requirements */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Mandatory Eligibility & Specifications
          </h3>
          <ul className="space-y-2">
            {summary.keyRequirements.map((req, idx) => (
              <li key={idx} className="text-xs text-slate-700 flex items-start gap-2 bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Financial & Statutory Conditions */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-blue-600" />
            Financial & Exemption Terms
          </h3>
          <ul className="space-y-2">
            {summary.financialClauses.map((clause, idx) => (
              <li key={idx} className="text-xs text-slate-700 flex items-start gap-2 bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
                <span className="text-blue-600 font-bold">•</span>
                <span>{clause}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Critical Timeline & Potential Traps */}
      <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-amber-700" />
          Critical Compliance Traps & Red Lines
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {summary.complianceRisks.map((risk, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-white border border-amber-200 text-xs text-slate-700 shadow-2xs">
              <span className="font-bold text-amber-800">Trap #{idx + 1}: </span>
              {risk}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
