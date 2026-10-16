'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/app-context';
import { Tender } from '@/lib/types';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  ShieldCheck, 
  HelpCircle, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Bookmark, 
  Layers, 
  Compass, 
  GraduationCap,
  Copy,
  Check
} from 'lucide-react';

interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  category?: 'MATCH' | 'EXEMPTION' | 'GAP_ANALYSIS' | 'CHECKLIST' | 'GENERAL';
  citations?: string[];
  suggestedActions?: Array<{ label: string; action: () => void }>;
  timestamp: string;
}

export default function AiCopilotWorkspace() {
  const { 
    tenders, 
    selectedTender, 
    setSelectedTender, 
    currentStartup, 
    setActiveView, 
    addToShortlist 
  } = useApp();

  const activeTender = selectedTender || tenders[0];
  const startupName = currentStartup?.name || 'AeroTech Defence Labs';
  const startupSector = currentStartup?.sector || 'Defence & Aerospace';
  const startupDpiit = currentStartup?.dpiitNumber || 'DIPP89234';
  const startupCerts = currentStartup?.certifications || [];

  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      text: `Namaste! I am your **GovStart AI Procurement Growth Copilot**.\n\nI am currently analyzing tenders against **${startupName}** (${startupSector}).\n\nHow can I accelerate your government business pipeline today?`,
      category: 'GENERAL',
      citations: ['GFR 2017 Rule 170(i)', 'DPIIT Order F.20/2/2014-PPD', activeTender.referenceNumber],
      suggestedActions: [
        { label: 'Check 100% EMD Exemption Status', action: () => handleSendPrompt('Is our startup exempt from EMD on active tenders?') },
        { label: 'Analyze Capability Gaps', action: () => handleSendPrompt(`What are our capability gaps for ${activeTender.title}?`) },
        { label: 'Generate Bid Submission Checklist', action: () => handleSendPrompt(`Generate preparation checklist for ${activeTender.referenceNumber}`) }
      ],
      timestamp: 'Just now'
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendPrompt = (text: string) => {
    if (!text.trim()) return;

    const userMsg: CopilotMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let replyText = '';
      let category: CopilotMessage['category'] = 'GENERAL';
      let citations: string[] = [activeTender.referenceNumber];
      let suggestedActions: CopilotMessage['suggestedActions'] = [];

      const lower = text.toLowerCase();

      if (lower.includes('emd') || lower.includes('exemption') || lower.includes('deposit') || lower.includes('waiver')) {
        category = 'EXEMPTION';
        citations = ['GFR 2017 Rule 170(i)', 'MoF Circular No. F.20/2/2014-PPD', 'GeM GTC Cl 4.1'];
        replyText = `### Statutory Exemption Analysis for ${startupName}\n\n` +
          `1. **Earnest Money Deposit (EMD) Waiver**: **100% APPLICABLE**.\n` +
          `   - Under Rule 170(i) of General Financial Rules (GFR) 2017, ${startupName} is **fully exempt** from paying EMD (saving ₹${(activeTender.emdAmountInr / 100000).toFixed(2)} Lakhs on tender ${activeTender.referenceNumber}).\n` +
          `   - **Required Action**: Upload your valid DPIIT Certificate (${startupDpiit || 'DPIIT Recognised'}) alongside the Bid Security Declaration in Cover-1.\n\n` +
          `2. **Prior Turnover & Experience Relaxation**: **APPLICABLE**.\n` +
          `   - Department of Expenditure Order No. F.20/2/2014-PPD directs procuring entities to relax prior experience and turnover criteria for startups, provided quality and technical capability standards are met.`;
        
        suggestedActions = [
          { label: 'View Statutory Playbook in Academy', action: () => setActiveView('learning-hub') },
          { label: 'Add to My AI Shortlist', action: () => addToShortlist(activeTender.id) }
        ];

      } else if (lower.includes('gap') || lower.includes('capability') || lower.includes('missing') || lower.includes('disqualif')) {
        category = 'GAP_ANALYSIS';
        citations = [activeTender.referenceNumber, 'Technical Schedule B'];
        const missingCerts = ['ISO 27001', 'CEMILAC / STQC'].filter(c => !startupCerts.includes(c));
        
        replyText = `### Capability & Compliance Gap Audit\n\n` +
          `Target Tender: **${activeTender.title}** (${activeTender.referenceNumber})\n\n` +
          `* **Technical Strengths**:\n` +
          `  - Sector match: ${startupSector} aligns directly with scope.\n` +
          `  - Tech stack match: Verified expertise in autonomous hardware, telemetry, and edge compute.\n\n` +
          `* **Potential Disqualifiers & Actionable Gaps**:\n` +
          `  1. **Certification Gap**: ${missingCerts.length > 0 ? `Tender recommends ${missingCerts.join(', ')}. Submit proof of equivalent testing or trial willingness.` : 'All core certifications verified.'}\n` +
          `  2. **Cover-1 Legal Affidavit**: Must execute non-blacklisting undertaking on ₹100 state stamp paper.\n` +
          `  3. **Local Content (MII)**: Verify Class-I Make in India certificate (>= 50% domestic bill-of-materials).\n\n` +
          `> **Compliance Notice**: A high AI match score does not waive mandatory technical milestones.`;

        suggestedActions = [
          { label: 'Upload PDF in AI Studio for Deep Scan', action: () => setActiveView('ai-studio') },
          { label: 'Shortlist Tender', action: () => addToShortlist(activeTender.id) }
        ];

      } else if (lower.includes('checklist') || lower.includes('preparation') || lower.includes('steps')) {
        category = 'CHECKLIST';
        citations = [activeTender.referenceNumber, 'RFP Section IV: Submission Checklist'];
        replyText = `### Step-by-Step Bid Submission Checklist for ${activeTender.referenceNumber}\n\n` +
          `**Cover 1: Fee & Statutory Eligibility (Technical Prequalification)**\n` +
          `- [x] DPIIT Startup Certificate (Verifiable QR Code)\n` +
          `- [ ] Bid Security Declaration Form in lieu of EMD\n` +
          `- [ ] Class-I Local Content (Make in India) Self-Declaration\n` +
          `- [ ] Notarized Non-Debarment Affidavit\n\n` +
          `**Cover 2: Technical Proposal**\n` +
          `- [ ] Clause-by-Clause Compliance Matrix (Draftable in AI Bid Studio)\n` +
          `- [ ] System Architecture & Bill of Materials (BOM)\n` +
          `- [ ] Prototype Test Reports / Benchmark Certifications\n\n` +
          `**Cover 3: Financial Bid (BOQ)**\n` +
          `- [ ] Itemized Commercial Price Schedule with GST Breakdown`;

        suggestedActions = [
          { label: 'Open AI Bid Studio', action: () => setActiveView('ai-studio') },
          { label: 'Go to My Bids Tracker', action: () => setActiveView('applications') }
        ];

      } else {
        replyText = `Based on your profile at **${startupName}** and current active tender **${activeTender.referenceNumber}**:\n\n` +
          `You have strong alignment in **${startupSector}**. Under GFR 2017, you are eligible for **full EMD exemption**.\n\n` +
          `Would you like me to:\n` +
          `1. Audit your mandatory compliance criteria?\n` +
          `2. Check statutory turnover relaxations?\n` +
          `3. Draft an executive proposal in the AI Studio?`;
        
        suggestedActions = [
          { label: 'Audit Eligibility', action: () => handleSendPrompt('Analyze our eligibility and gaps') },
          { label: 'Check EMD Rules', action: () => handleSendPrompt('What is our EMD waiver rule?') },
          { label: 'Explore More Tenders', action: () => setActiveView('tenders') }
        ];
      }

      const aiMsg: CopilotMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        category,
        citations,
        suggestedActions,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Copilot Header */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shadow-inner">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black">AI Business Growth Copilot</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                Grounded in GFR 2017
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Assisting <strong className="text-white">{startupName}</strong> • Active Focus: <span className="text-emerald-400 font-semibold">{activeTender.referenceNumber}</span>
            </p>
          </div>
        </div>

        {/* Tender Context Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold hidden sm:inline">Tender Context:</span>
          <select
            value={activeTender.id}
            onChange={(e) => {
              const found = tenders.find(t => t.id === e.target.value);
              if (found) setSelectedTender(found);
            }}
            className="py-2 px-3 text-xs font-semibold border border-slate-700 rounded-xl bg-slate-800 text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 max-w-[280px] truncate"
          >
            {tenders.map((t) => (
              <option key={t.id} value={t.id}>
                {t.referenceNumber} - {t.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Conversation Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col h-[650px]">
        
        {/* Messages Feed */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center shrink-0 mt-1 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-2xl space-y-3 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                
                {/* Message Bubble */}
                <div
                  className={`p-4 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-slate-900 text-white rounded-br-xs shadow-md'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-xs shadow-2xs'
                  }`}
                >
                  <div className="whitespace-pre-line prose prose-slate prose-xs">
                    {msg.text}
                  </div>

                  {/* Citations Footer */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-slate-200/80 flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500">
                      <span className="font-bold text-slate-700">Source Grounding:</span>
                      {msg.citations.map((c, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-mono">
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Suggested Action Chips */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {msg.suggestedActions.map((act, idx) => (
                      <button
                        key={idx}
                        onClick={act.action}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs hover:scale-[1.02]"
                      >
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        <span>{act.label}</span>
                      </button>
                    ))}
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}

                <div className={`text-[10px] text-slate-400 px-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-1 font-bold text-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-500 italic pl-12">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
              <span>Analyzing procurement gazettes and verifying GFR 2017 clauses...</span>
            </div>
          )}
        </div>

        {/* Input & Prompt Launcher */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
          
          {/* Quick Prompt Suggestions */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Quick Queries:</span>
            {[
              'Are we exempt from EMD?',
              'Show capability gaps',
              'Generate bid checklist',
              'Explain GFR Rule 170(i)'
            ].map((q) => (
              <button
                key={q}
                onClick={() => handleSendPrompt(q)}
                className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-800 text-[11px] font-medium transition-colors shrink-0 shadow-2xs"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Text Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendPrompt(inputText);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={`Ask anything about ${activeTender.referenceNumber}, statutory exemptions, or proposal prep...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-3 text-xs bg-white border border-slate-300 rounded-2xl focus:ring-2 focus:ring-slate-900 focus:outline-hidden shadow-2xs"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-5 py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-slate-900/10"
            >
              <Send className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Send Query</span>
            </button>
          </form>

          <p className="text-[10px] text-slate-400 text-center">
            GovStart AI Copilot synthesizes public procurement documentation. It does not replace independent legal verification.
          </p>
        </div>

      </div>

    </div>
  );
}
