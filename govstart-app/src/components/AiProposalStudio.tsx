'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../lib/context/app-context';
import { Tender } from '../lib/types';
import { generateBidProposalDraft } from '@/lib/ai/ai-service';
import { 
  FileText, 
  Download, 
  Copy, 
  Check, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  CheckSquare, 
  Square,
  Eye,
  Edit3
} from 'lucide-react';

interface Props {
  tender: Tender;
}

export default function AiProposalStudio({ tender }: Props) {
  const { currentStartup, submitApplication, setActiveView } = useApp();

  const [proposalMarkdown, setProposalMarkdown] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [bidAmountLakhs, setBidAmountLakhs] = useState<number>(Math.round(tender.estimatedBudgetInr * 0.94 / 100000));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Document checklist toggles
  const [checklist, setChecklist] = useState<{ id: string; title: string; checked: boolean }[]>([
    { id: '1', title: 'DPIIT Startup India Certificate of Recognition', checked: true },
    { id: '2', title: 'Make-in-India Class-I Local Content Declaration (>= 50%)', checked: true },
    { id: '3', title: 'Cover-1 Fee Exemption Letter citing Order F.20/2/2014-PPD', checked: true },
    { id: '4', title: 'Clause-by-Clause Technical Compliance Spec Sheet', checked: true },
    { id: '5', title: 'Audited Balance Sheets (FY 23-25) & CA Net Worth Certificate', checked: false },
    { id: '6', title: 'Non-Blacklisting Undertaking on Stamp Paper', checked: false }
  ]);

  useEffect(() => {
    if (currentStartup && tender) {
      setProposalMarkdown(generateBidProposalDraft(tender, currentStartup));
    }
  }, [currentStartup, tender]);

  if (!currentStartup) return null;

  const toggleCheck = (id: string) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(proposalMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([proposalMarkdown], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `Proposal_${tender.referenceNumber.replace(/[\/\\]/g, '_')}_${currentStartup.name.replace(/\s+/g, '_')}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSubmitBid = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      submitApplication(tender.id, bidAmountLakhs * 100000, proposalMarkdown);
      setIsSubmitting(false);
      setSubmittedSuccess(true);
    }, 800);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Studio Controls */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-900 text-white">
              AI Bid Proposal Studio
            </span>
            <span className="text-[10px] text-slate-500">
              Auto-grounded with {currentStartup.name} credentials
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">{tender.title}</h2>
          <p className="text-xs text-slate-500">Target Budget: {tender.budgetString} • EMD Exempt</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Download .md
          </button>
        </div>
      </div>

      {/* Main Grid: Proposal Editor/Preview & Bid Submission Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Markdown Editor / Live Preview (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col">
          
          {/* Subheader tabs */}
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('editor')}
                className={`px-3 py-1 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors ${
                  activeTab === 'editor' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" /> Markdown Editor
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors ${
                  activeTab === 'preview' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" /> Formatted Preview
              </button>
            </div>
            <span className="text-[11px] text-slate-400">
              Live updates enabled
            </span>
          </div>

          {/* Tab Content */}
          <div className="p-4 flex-1 min-h-[460px] max-h-[580px] overflow-y-auto">
            {activeTab === 'editor' ? (
              <textarea
                value={proposalMarkdown}
                onChange={(e) => setProposalMarkdown(e.target.value)}
                className="w-full h-full min-h-[440px] font-mono text-xs text-slate-800 leading-relaxed border-0 focus:outline-hidden resize-none"
                placeholder="Writing proposal..."
              />
            ) : (
              <div className="prose prose-xs max-w-none text-xs text-slate-800 space-y-3 whitespace-pre-line leading-relaxed">
                {proposalMarkdown}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Submission Widget & Document Checklist (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Bid Submission Box */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Commercial Quote</h3>
            
            {submittedSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-2">
                <div className="font-bold flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Bid Proposal Recorded!
                </div>
                <p className="text-[11px] text-emerald-800">
                  Your bid of ₹{bidAmountLakhs} Lakhs has been lodged with DRDO procurement authorities for technical screening.
                </p>
                <button
                  onClick={() => setActiveView('applications')}
                  className="w-full mt-2 py-1.5 rounded-lg bg-emerald-700 text-white font-semibold text-xs hover:bg-emerald-800"
                >
                  View in My Bids
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitBid} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Commercial Bid (₹ Lakhs)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">₹</span>
                    <input
                      type="number"
                      value={bidAmountLakhs}
                      onChange={(e) => setBidAmountLakhs(Number(e.target.value))}
                      required
                      className="w-full pl-7 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 font-semibold"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Target ceiling: {tender.budgetString}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                  <span className="font-semibold text-slate-800">Statutory Compliance Note:</span> EMD waiver certificate will be automatically appended to Cover-1 submission.
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? 'Transmitting Proposal...' : 'Submit Proposal to Procurement Board'}
                  <Send className="w-3.5 h-3.5 text-emerald-400" />
                </button>
              </form>
            )}
          </div>

          {/* Interactive Document Checklist */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center justify-between">
              <span>Mandatory Tender Enclosures</span>
              <span className="text-[10px] text-emerald-700 font-bold">
                {checklist.filter(c => c.checked).length} of {checklist.length} Ready
              </span>
            </h3>

            <div className="space-y-2">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-start gap-2.5 transition-colors ${
                    item.checked ? 'bg-emerald-50/50 border-emerald-200 text-slate-800' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  {item.checked ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  )}
                  <span className="text-[11px] leading-tight select-none">{item.title}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
