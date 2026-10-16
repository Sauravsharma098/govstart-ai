'use client';

import React, { useState } from 'react';
import { useApp } from '../lib/context/app-context';
import { 
  TenderAnalysisResult, 
  DocumentChatMessage,
  EligibilityCriterion 
} from '../lib/types/analysis';
import { 
  SAMPLE_TENDER_DOCUMENTS, 
  analyzeTenderText 
} from '../lib/ai/tender-pdf-analyzer';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Scale, 
  AlertCircle, 
  HelpCircle, 
  CheckSquare, 
  Square, 
  Send, 
  FileCheck2, 
  Bot, 
  User, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  Info,
  ChevronDown,
  RefreshCw,
  FileWarning
} from 'lucide-react';

export default function TenderPdfAnalyzer() {
  const { currentStartup } = useApp();

  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<TenderAnalysisResult | null>(() => {
    // Pre-initialize with DRDO sample for instant interactive testing
    if (currentStartup) {
      return analyzeTenderText(SAMPLE_TENDER_DOCUMENTS[0].rawText, SAMPLE_TENDER_DOCUMENTS[0].name, currentStartup);
    }
    return null;
  });

  const [activeAnalysisTab, setActiveAnalysisTab] = useState<'summary' | 'eligibility' | 'anomalies' | 'disqualifiers' | 'checklist' | 'chat'>('summary');
  const [eligibilityFilter, setEligibilityFilter] = useState<'ALL' | 'MANDATORY' | 'DESIRABLE'>('ALL');
  
  // Chat state
  const [chatHistory, setChatHistory] = useState<DocumentChatMessage[]>([
    {
      id: 'init-msg',
      sender: 'ai',
      text: "I am GovStart AI's document analysis assistant. I have digested the uploaded tender PDF. Ask me about specific clauses, mandatory requirements, delivery deadlines, or potential disqualifiers.",
      factsExtracted: [
        {
          fact: "Document uploaded and indexed for clause-level citation.",
          sourceExcerpt: "SECTION 1 & 2"
        }
      ],
      aiInterpretation: "I operate strictly on verified document text and resist prompt injections.",
      timestamp: 'Just now'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatSending, setIsChatSending] = useState(false);

  // File Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (currentStartup) {
        formData.append('startupId', currentStartup.id);
      }

      const res = await fetch('/api/ai/analyze-pdf', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to process tender PDF');
      }

      setAnalysisResult(data.analysis);
      setChatHistory([
        {
          id: `new-doc-${Date.now()}`,
          sender: 'ai',
          text: `Tender "${data.analysis.title}" has been successfully parsed. How can I assist you with this document?`,
          timestamp: 'Just now'
        }
      ]);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error uploading file');
    } finally {
      setIsUploading(false);
    }
  };

  // 1-Click Sample Document Loader
  const handleLoadSample = (sampleId: string) => {
    setErrorMsg(null);
    const sample = SAMPLE_TENDER_DOCUMENTS.find(s => s.id === sampleId);
    if (!sample || !currentStartup) return;

    const analysis = analyzeTenderText(sample.rawText, sample.name, currentStartup);
    setAnalysisResult(analysis);
    setChatHistory([
      {
        id: `sample-${Date.now()}`,
        sender: 'ai',
        text: `Loaded official sample document: "${sample.name}". You can now review mandatory criteria, anomalies, or ask grounded questions.`,
        timestamp: 'Just now'
      }
    ]);
  };

  // Chat message submit
  const handleSendChatMessage = async (qText: string) => {
    if (!qText.trim() || !analysisResult) return;

    const userMessage: DocumentChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: qText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, userMessage]);
    setChatInput('');
    setIsChatSending(true);

    try {
      const res = await fetch('/api/ai/document-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: qText,
          rawText: SAMPLE_TENDER_DOCUMENTS.find(s => s.name === analysisResult.documentMeta.fileName)?.rawText || '',
          analysis: analysisResult
        })
      });

      const data = await res.json();
      if (data.success && data.message) {
        setChatHistory(prev => [...prev, data.message]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsChatSending(false);
    }
  };

  // Toggle checklist item
  const toggleChecklistItem = (id: string) => {
    if (!analysisResult) return;
    setAnalysisResult({
      ...analysisResult,
      preparationChecklist: analysisResult.preparationChecklist.map(c => 
        c.id === id ? { ...c, completed: !c.completed } : c
      )
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Upload Zone & Sample Switcher */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded-md bg-emerald-50 text-emerald-700">
                <Sparkles className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-slate-900">AI-Assisted Tender Document Analyzer</h2>
            </div>
            <p className="text-xs text-slate-500">
              Upload official tender RFPs (PDF up to 15MB) to extract scope, check eligibility, detect clause contradictions, and prepare bids.
            </p>
          </div>

          {/* Quick 1-Click Sample Tender Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Test Samples:</span>
            <button
              onClick={() => handleLoadSample('sample-drdo-uav')}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
            >
              DRDO Swarm RFP
            </button>
            <button
              onClick={() => handleLoadSample('sample-nhm-teleicu')}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 transition-colors"
            >
              NHM Tele-ICU RFP
            </button>
            <button
              onClick={() => handleLoadSample('sample-scanned')}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 transition-colors"
              title="Test scanned PDF without text layer"
            >
              Scanned PDF Test
            </button>
          </div>
        </div>

        {/* Drag & Drop Upload Container */}
        <div className="relative border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-xl p-6 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
              {isUploading ? <RefreshCw className="w-5 h-5 animate-spin text-emerald-600" /> : <Upload className="w-5 h-5" />}
            </div>
            <div className="text-xs font-semibold text-slate-800">
              {isUploading ? 'Extracting text and verifying clauses...' : 'Drag and drop tender PDF here, or click to browse'}
            </div>
            <div className="text-[10px] text-slate-400">
              Maximum file size: 15MB • Enforces server-side validation & size checks
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Analysis Results Display */}
      {analysisResult && (
        <div className="space-y-6">
          
          {/* Document Header Ribbon */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-900 text-white">
                  {analysisResult.referenceNumber}
                </span>
                
                {analysisResult.documentMeta.extractionStatus === 'SUCCESS' ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Text Extracted ({analysisResult.documentMeta.characterCount} chars)
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                    <FileWarning className="w-3 h-3 text-amber-600" /> Scanned / Image-Only PDF Warning
                  </span>
                )}

                <span className="text-[10px] text-slate-400">
                  {analysisResult.documentMeta.totalPages} Pages • {analysisResult.documentMeta.fileName}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Budget: </span>
                <span className="text-sm font-extrabold text-slate-900">{analysisResult.estimatedBudget.formatted}</span>
              </div>
            </div>

            <h1 className="text-lg font-black text-slate-900 leading-snug">{analysisResult.title}</h1>
            <p className="text-xs text-slate-500">{analysisResult.procuringEntity}</p>

            {analysisResult.documentMeta.warningMessage && (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong>OCR Notice: </strong> {analysisResult.documentMeta.warningMessage}
                </div>
              </div>
            )}
          </div>

          {/* Sub-Tabs for Analysis Breakdown */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-b border-slate-200">
            <button
              onClick={() => setActiveAnalysisTab('summary')}
              className={`px-3.5 py-2 font-bold rounded-t-xl transition-all border-b-2 ${
                activeAnalysisTab === 'summary'
                  ? 'border-slate-900 text-slate-900 bg-white shadow-2xs'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              1. Scope & Facts
            </button>

            <button
              onClick={() => setActiveAnalysisTab('eligibility')}
              className={`px-3.5 py-2 font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 ${
                activeAnalysisTab === 'eligibility'
                  ? 'border-slate-900 text-slate-900 bg-white shadow-2xs'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              2. Mandatory vs Desirable
            </button>

            <button
              onClick={() => setActiveAnalysisTab('anomalies')}
              className={`px-3.5 py-2 font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 ${
                activeAnalysisTab === 'anomalies'
                  ? 'border-slate-900 text-slate-900 bg-white shadow-2xs'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              3. Contradictions & Missing Info
            </button>

            <button
              onClick={() => setActiveAnalysisTab('disqualifiers')}
              className={`px-3.5 py-2 font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 ${
                activeAnalysisTab === 'disqualifiers'
                  ? 'border-slate-900 text-slate-900 bg-white shadow-2xs'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
              4. Potential Disqualifiers
            </button>

            <button
              onClick={() => setActiveAnalysisTab('checklist')}
              className={`px-3.5 py-2 font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 ${
                activeAnalysisTab === 'checklist'
                  ? 'border-slate-900 text-slate-900 bg-white shadow-2xs'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5 text-purple-600" />
              5. Bid Checklist
            </button>

            <button
              onClick={() => setActiveAnalysisTab('chat')}
              className={`px-3.5 py-2 font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 ${
                activeAnalysisTab === 'chat'
                  ? 'border-slate-900 text-slate-900 bg-white shadow-2xs'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-emerald-600" />
              6. Document Q&A
            </button>
          </div>

          {/* TAB 1: Scope, Dates & Verified Facts vs AI Interpretation */}
          {activeAnalysisTab === 'summary' && (
            <div className="space-y-6">
              
              {/* Legend Explaining Visual Distinction */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white font-bold text-[10px]">
                    EXTRACTED FACT
                  </span>
                  <span className="text-slate-600">Verbatim document text with page citations</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 font-bold text-[10px]">
                    AI INTERPRETATION
                  </span>
                  <span className="text-slate-600">Algorithmic advisory & strategic guidance</span>
                </div>
              </div>

              {/* Scope Card */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Scope of Procurement</h3>
                {analysisResult.scopeOfWork.map((scope, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-1.5 py-0.2 rounded-sm bg-slate-900 text-white font-bold text-[10px]">
                          EXTRACTED FACT {scope.pageRef ? `• Page ${scope.pageRef}` : ''}
                        </span>
                        <span className="text-[10px] text-slate-400">{scope.sourceExcerpt}</span>
                      </div>
                      <p className="text-slate-800 font-medium leading-relaxed">&quot;{scope.fact}&quot;</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200 text-xs text-purple-900">
                      <div className="font-bold text-[10px] text-purple-800 mb-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> AI INTERPRETATION & STRATEGIC BID ADVISORY:
                      </div>
                      <p className="leading-relaxed">{scope.aiInterpretation}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Timeline with Explicit Cutoff Warnings */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Critical Timeline & Cutoffs</h3>
                <div className="divide-y divide-slate-100">
                  {analysisResult.importantDates.map((d, idx) => (
                    <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{d.event}</span>
                          {d.isMandatoryCutoff && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-red-100 text-red-800">
                              HARD CUTOFF
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 italic">&quot;{d.sourceExcerpt}&quot;</p>
                      </div>

                      <div className="text-left sm:text-right shrink-0">
                        <div className="font-black text-slate-900">{d.dateString}</div>
                        {d.aiNote && <div className="text-[10px] text-amber-700 font-medium">{d.aiNote}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: Mandatory vs Desirable Eligibility Criteria */}
          {activeAnalysisTab === 'eligibility' && (
            <div className="space-y-6">
              
              {/* Filter controls */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Eligibility & Qualification Breakdown</h3>
                  <p className="text-xs text-slate-500">Separates mandatory compliance gates from optional desirable scores.</p>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setEligibilityFilter('ALL')}
                    className={`px-2.5 py-1 text-xs rounded-lg font-semibold ${eligibilityFilter === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}
                  >
                    All Criteria
                  </button>
                  <button
                    onClick={() => setEligibilityFilter('MANDATORY')}
                    className={`px-2.5 py-1 text-xs rounded-lg font-semibold ${eligibilityFilter === 'MANDATORY' ? 'bg-red-900 text-white' : 'bg-slate-100 text-slate-700'}`}
                  >
                    Mandatory Only
                  </button>
                  <button
                    onClick={() => setEligibilityFilter('DESIRABLE')}
                    className={`px-2.5 py-1 text-xs rounded-lg font-semibold ${eligibilityFilter === 'DESIRABLE' ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-700'}`}
                  >
                    Desirable Only
                  </button>
                </div>
              </div>

              {/* Criteria List */}
              <div className="space-y-3">
                {[
                  ...(eligibilityFilter === 'DESIRABLE' ? [] : analysisResult.eligibility.mandatory),
                  ...(eligibilityFilter === 'MANDATORY' ? [] : analysisResult.eligibility.desirable)
                ].map((crit) => (
                  <div key={crit.id} className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2 text-xs">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                            crit.isMandatory ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-blue-50 text-blue-800 border border-blue-200'
                          }`}>
                            {crit.isMandatory ? 'MANDATORY CRITERION' : 'DESIRABLE SPECIFICATION'}
                          </span>
                          {crit.pageRef && (
                            <span className="text-[10px] text-slate-400">Page {crit.pageRef}</span>
                          )}
                        </div>
                        <h4 className="font-bold text-slate-900">{crit.criterion}</h4>
                      </div>

                      {/* Compliance Status Pill */}
                      <span className={`shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        crit.startupCompliance === 'COMPLIANT' ? 'bg-emerald-100 text-emerald-800' :
                        crit.startupCompliance === 'EXEMPTION_APPLICABLE' ? 'bg-purple-100 text-purple-800' :
                        crit.startupCompliance === 'PARTIAL' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {crit.startupCompliance === 'EXEMPTION_APPLICABLE' ? 'DPIIT EXEMPTION APPLIED' : crit.startupCompliance}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-600">
                      <span className="font-semibold text-slate-800">Verbatim Excerpt: </span>
                      &quot;{crit.sourceExcerpt}&quot;
                    </div>

                    <div className="text-[11px] text-slate-700">
                      <strong className="text-slate-900">Startup Profile Match: </strong>
                      {crit.complianceReason}
                      {crit.exemptionBasis && (
                        <span className="block text-emerald-700 font-medium mt-0.5">
                          Statutory Basis: {crit.exemptionBasis}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 3: Contradictions & Missing Info */}
          {activeAnalysisTab === 'anomalies' && (
            <div className="space-y-6">
              
              {/* Contradictory Clauses Box */}
              <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-4">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  <span>Contradictory Requirements Detected ({analysisResult.anomalies.contradictions.length})</span>
                </div>

                {analysisResult.anomalies.contradictions.map((c, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white border border-amber-200 text-xs space-y-3 shadow-2xs">
                    <p className="font-bold text-slate-900">{c.conflictDescription}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="font-bold text-slate-700">{c.clauseA.clauseNo} (Page {c.clauseA.pageRef}):</span>
                        <p className="text-slate-600 mt-1">&quot;{c.clauseA.text}&quot;</p>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="font-bold text-slate-700">{c.clauseB.clauseNo} (Page {c.clauseB.pageRef}):</span>
                        <p className="text-slate-600 mt-1">&quot;{c.clauseB.text}&quot;</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px]">
                      <span className="font-bold">Recommended Clarification Action: </span>
                      {c.suggestedClarification}
                    </div>
                  </div>
                ))}
              </div>

              {/* Missing Information Box */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Omitted Parameters & Missing SLA Clauses
                </h3>
                <div className="space-y-3">
                  {analysisResult.anomalies.missingInformation.map((m, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <div className="font-bold text-slate-900">{m.item}</div>
                      <p className="text-slate-600">{m.impact}</p>
                      <div className="text-[11px] text-blue-700 font-semibold pt-1">
                        Advice: {m.recommendation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: Potential Disqualifiers with Mandatory Legal Disclaimer */}
          {activeAnalysisTab === 'disqualifiers' && (
            <div className="space-y-6">
              
              {/* Mandatory Legal Disclaimer Box */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong>Mandatory Advisory Notice: </strong>
                  The disqualifiers and compliance flags shown below are generated via automated algorithmic risk detection and do not constitute a formal legal, statutory, or procurement determination. The procuring entity reserves sole authority to interpret RFP terms. Always consult the official tender corrigenda.
                </div>
              </div>

              {/* Disqualifiers list */}
              <div className="space-y-3">
                {analysisResult.disqualifiers.map((dis, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-100 text-red-800">
                          {dis.severity} SEVERITY
                        </span>
                        <span className="font-bold text-slate-900">{dis.riskFactor}</span>
                      </div>
                      {dis.pageRef && <span className="text-[10px] text-slate-400">Page {dis.pageRef}</span>}
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-600">
                      <span className="font-semibold text-slate-800">Verbatim Tender Clause: </span>
                      &quot;{dis.sourceExcerpt}&quot;
                    </div>

                    <div className="p-3 rounded-lg bg-red-50/60 border border-red-200 text-red-900 text-[11px]">
                      <span className="font-bold">Mitigation Advisory: </span>
                      {dis.aiAdvisory}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 5: Tender-Specific Preparation Checklist */}
          {activeAnalysisTab === 'checklist' && (
            <div className="space-y-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Tender-Specific Bid Enclosure Checklist</h3>
                  <p className="text-xs text-slate-500">Check off documents as you prepare your submission folder.</p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {analysisResult.preparationChecklist.filter(c => c.completed).length} of {analysisResult.preparationChecklist.length} Enclosures Ready
                </span>
              </div>

              <div className="space-y-2.5 pt-2">
                {analysisResult.preparationChecklist.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleChecklistItem(item.id)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer flex items-start gap-3 transition-colors ${
                      item.completed ? 'bg-emerald-50/50 border-emerald-200 text-slate-800' : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    {item.completed ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{item.item}</span>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">{item.category.replace(/_/g, ' ')}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 italic">Source: {item.sourceExcerpt}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: Document Grounded Q&A Chat */}
          {activeAnalysisTab === 'chat' && (
            <div className="space-y-4 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col h-[560px]">
              
              {/* Chat Subheader */}
              <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2 text-xs">
                  <Bot className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold">Grounded Document Assistant</span>
                  <span className="text-[10px] text-slate-400">• Preserved Context for {analysisResult.referenceNumber}</span>
                </div>
              </div>

              {/* Chat Messages Scroll */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {chatHistory.map((m) => (
                  <div key={m.id} className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                      m.sender === 'user' ? 'bg-slate-900 text-white' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {m.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                    </div>

                    <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed space-y-2 ${
                      m.sender === 'user' 
                        ? 'bg-slate-900 text-white rounded-tr-xs' 
                        : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-xs'
                    }`}>
                      <p>{m.text}</p>

                      {/* Display unverified warning if information was not found */}
                      {m.unverifiedWarning && (
                        <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-[11px] font-medium">
                          {m.unverifiedWarning}
                        </div>
                      )}

                      {/* Verbatim extracted facts with citations */}
                      {m.factsExtracted && m.factsExtracted.length > 0 && (
                        <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-[11px] space-y-1">
                          <span className="font-bold text-slate-700">Verbatim Document Excerpt:</span>
                          {m.factsExtracted.map((f, i) => (
                            <div key={i} className="text-slate-600">
                              &quot;{f.sourceExcerpt}&quot; {f.pageRef ? `(Page ${f.pageRef})` : ''}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* AI interpretation */}
                      {m.aiInterpretation && (
                        <div className="text-[11px] text-purple-800 font-medium">
                          <strong>Advisory: </strong>{m.aiInterpretation}
                        </div>
                      )}

                      <div className="text-[9px] text-slate-400">{m.timestamp}</div>
                    </div>
                  </div>
                ))}

                {isChatSending && (
                  <div className="flex items-center gap-2 text-xs text-slate-400 animate-pulse">
                    <Bot className="w-4 h-4 text-emerald-600" />
                    <span>Verifying query against document text streams...</span>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form
                onSubmit={(e) => { e.preventDefault(); handleSendChatMessage(chatInput); }}
                className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask any question about this uploaded tender..."
                  className="flex-1 py-2 px-3 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || isChatSending}
                  className="p-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors disabled:opacity-40"
                >
                  <Send className="w-4 h-4 text-emerald-400" />
                </button>
              </form>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
