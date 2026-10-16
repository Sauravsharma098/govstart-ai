'use client';

import React, { useState } from 'react';
import { useApp } from '../lib/context/app-context';
import { Application } from '../lib/types';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  Send, 
  AlertCircle, 
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Download
} from 'lucide-react';

export default function ApplicationsTracker() {
  const { applications, respondToClarification, currentStartup } = useApp();

  const [selectedAppId, setSelectedAppId] = useState<string>(applications[0]?.id || '');
  const [replyText, setReplyText] = useState('');
  const [activeClarId, setActiveClarId] = useState<string | null>(null);

  const selectedApp = applications.find(a => a.id === selectedAppId) || applications[0];

  const handleSendReply = (clarId: string) => {
    if (!replyText.trim() || !selectedApp) return;
    respondToClarification(selectedApp.id, clarId, replyText);
    setReplyText('');
    setActiveClarId(null);
  };

  const getStatusBadge = (status: Application['status']) => {
    switch (status) {
      case 'AWARDED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Contract Awarded</span>;
      case 'SHORTLISTED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">Shortlisted for L1</span>;
      case 'TECHNICAL_EVALUATION':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">Under Technical Evaluation</span>;
      case 'FINANCIAL_EVALUATION':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">Financial Bid Opened</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">Proposal Lodged</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Bid Applications & Clarifications
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Track technical evaluation milestones, official committee feedback, and formal responses.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-slate-200">
          <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800">No proposals submitted yet</h3>
          <p className="text-xs text-slate-500 mt-1">
            Head to the Tender Discovery engine or AI Proposal Studio to lodge your first bid.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Applications List (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            {applications.map((app) => (
              <div
                key={app.id}
                onClick={() => setSelectedAppId(app.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedApp?.id === app.id
                    ? 'bg-white border-slate-900 shadow-md ring-1 ring-slate-900'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-slate-500">{app.id}</span>
                  {getStatusBadge(app.status)}
                </div>

                <h3 className="font-bold text-xs text-slate-900 line-clamp-2">
                  {app.tenderTitle}
                </h3>

                <p className="text-[11px] text-slate-500 mt-1">{app.department}</p>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-900">
                    Quote: ₹{(app.bidAmountInr / 100000).toFixed(2)} Lakhs
                  </span>
                  {app.clarifications.length > 0 && (
                    <span className="text-amber-600 font-bold flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" /> {app.clarifications.length} Clarification
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Selected Bid Details & Clarification Thread (7 cols) */}
          {selectedApp && (
            <div className="lg:col-span-7 space-y-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
              
              {/* Bid Meta Header */}
              <div className="pb-4 border-b border-slate-100 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-400">Bid ID: {selectedApp.id}</span>
                    {getStatusBadge(selectedApp.status)}
                  </div>
                  <h2 className="text-base font-extrabold text-slate-900">{selectedApp.tenderTitle}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedApp.department}</p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs text-slate-400 font-semibold uppercase">Submitted Quote</div>
                  <div className="text-lg font-black text-slate-900">₹{(selectedApp.bidAmountInr / 100000).toFixed(2)} L</div>
                </div>
              </div>

              {/* Evaluation Milestone Progression */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Evaluation Lifecycle</h4>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
                    1. Submitted
                  </div>
                  <div className={`p-2 rounded-lg border font-bold ${
                    selectedApp.status === 'TECHNICAL_EVALUATION' || selectedApp.status === 'SHORTLISTED' || selectedApp.status === 'AWARDED'
                      ? 'bg-blue-50 border-blue-200 text-blue-800'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}>
                    2. Technical
                  </div>
                  <div className={`p-2 rounded-lg border font-bold ${
                    selectedApp.status === 'SHORTLISTED' || selectedApp.status === 'AWARDED'
                      ? 'bg-purple-50 border-purple-200 text-purple-800'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}>
                    3. Shortlisted
                  </div>
                  <div className={`p-2 rounded-lg border font-bold ${
                    selectedApp.status === 'AWARDED'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}>
                    4. Contract
                  </div>
                </div>
              </div>

              {/* Official Clarification Queries & Response Flow */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  Procurement Committee Clarifications
                </h4>

                {selectedApp.clarifications.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 text-center">
                    No technical clarifications have been raised by the evaluation board.
                  </div>
                ) : (
                  selectedApp.clarifications.map((clar) => (
                    <div key={clar.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                      <div className="flex items-center justify-between text-slate-500">
                        <span className="font-bold text-slate-800">{clar.askedBy}</span>
                        <span className="text-[10px]">{clar.askedAt ? new Date(clar.askedAt).toLocaleDateString() : ''}</span>
                      </div>

                      <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200 text-amber-900 font-medium leading-relaxed">
                        &quot;{clar.question}&quot;
                      </div>

                      {clar.response ? (
                        <div className="p-3 rounded-lg bg-white border border-emerald-200 text-emerald-900 space-y-1">
                          <div className="font-bold text-[11px] text-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Formal Startup Response Dispatched:
                          </div>
                          <p className="text-slate-700 leading-relaxed">{clar.response}</p>
                        </div>
                      ) : (
                        <div className="space-y-2 pt-1">
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Draft your formal technical response citing test certificates..."
                            rows={3}
                            className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 bg-white"
                          />
                          <button
                            onClick={() => handleSendReply(clar.id)}
                            className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                          >
                            <Send className="w-3 h-3 text-emerald-400" />
                            Dispatch Formal Response
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
