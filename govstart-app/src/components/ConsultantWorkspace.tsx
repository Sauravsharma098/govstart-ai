'use client';

import React from 'react';
import { useApp } from '@/lib/context/app-context';
import { 
  Briefcase, 
  Building2, 
  Users, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  Layers,
  FileText
} from 'lucide-react';

export default function ConsultantWorkspace() {
  const { 
    allStartups, 
    consultantClientId, 
    setConsultantClientId, 
    currentUser, 
    setActiveView,
    tenders,
    applications 
  } = useApp();

  // If user is consultant, they manage assigned clients
  const clientIds = currentUser?.assignedClientIds || ['startup-1', 'startup-2', 'startup-3'];
  const clientProfiles = allStartups.filter(s => clientIds.includes(s.id));

  const activeClient = clientProfiles.find(s => s.id === (consultantClientId || clientProfiles[0]?.id)) || clientProfiles[0];

  const handleSelectClient = (startupId: string) => {
    setConsultantClientId(startupId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Procurement Advisory Multi-Client Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Client Portfolio Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Managing public procurement pipelines for {clientProfiles.length} active enterprise & startup advisory clients.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('dashboard')}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-900/20 flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open Client Dashboard</span>
          </button>
        </div>
      </div>

      {/* Client Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {clientProfiles.map((client) => {
          const isSelected = activeClient.id === client.id;
          const clientApps = applications.filter(a => a.startupId === client.id);

          return (
            <div
              key={client.id}
              onClick={() => handleSelectClient(client.id)}
              className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                isSelected
                  ? 'border-emerald-600 bg-white ring-2 ring-emerald-600/20 shadow-md'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-sm">
                    {client.name.substring(0, 2).toUpperCase()}
                  </div>
                  {isSelected && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Active Context
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">{client.name}</h3>
                  <p className="text-xs text-slate-500">{client.sector}</p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Turnover:</span>
                    <strong className="text-slate-900">₹{client.annualTurnoverLakhs} Lakhs</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>DPIIT Recognition:</span>
                    <strong className={client.dpiitRecognized ? 'text-emerald-700' : 'text-slate-400'}>
                      {client.dpiitRecognized ? 'Recognized' : 'None'}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Readiness Score:</span>
                    <strong className="text-slate-900">{client.readinessScore}/100</strong>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900">
                <span className="text-slate-500 font-medium">Bids in Pipeline: {clientApps.length}</span>
                <span className="text-emerald-700 flex items-center gap-1">
                  Manage Client <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Client Opportunity Preview */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Client Context</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 mt-1">
              Top Opportunities for {activeClient.name}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Target contract range: ₹{activeClient.preferredContractMinLakhs || 10}L - ₹{activeClient.preferredContractMaxLakhs || 1000}L
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveView('ai-studio')}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Open AI Copilot
            </button>
            <button
              onClick={() => setActiveView('tenders')}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
            >
              Discover More
            </button>
          </div>
        </div>

        {/* Opportunity List for Selected Client */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tenders.slice(0, 4).map((tender) => (
            <div key={tender.id} className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 font-bold">
                  {tender.referenceNumber}
                </span>
                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {tender.budgetString}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{tender.title}</h4>
              <p className="text-[11px] text-slate-500 line-clamp-2">{tender.description}</p>
              
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-500">
                  {tender.emdExemptForStartups ? '100% EMD Waiver' : 'EMD Applicable'}
                </span>
                <button
                  onClick={() => setActiveView('ai-studio')}
                  className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  Prepare Proposal <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
