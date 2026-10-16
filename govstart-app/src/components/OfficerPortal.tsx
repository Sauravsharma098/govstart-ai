'use client';

import React, { useState } from 'react';
import { useApp } from '../lib/context/app-context';
import { Application, Tender } from '../lib/types';
import { 
  Building2, 
  PlusCircle, 
  FileText, 
  CheckCircle2, 
  MessageSquare, 
  Award, 
  Clock, 
  User, 
  Sparkles,
  Send,
  X
} from 'lucide-react';

export default function OfficerPortal() {
  const { 
    currentUser, 
    tenders, 
    addTender, 
    applications, 
    updateApplicationStatus 
  } = useApp();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDept, setNewDept] = useState(currentUser?.organization || 'DRDO Directorate of Electronics');
  const [newSector, setNewSector] = useState('Defence & Aerospace');
  const [newBudgetCr, setNewBudgetCr] = useState('15.0');
  const [newDeadline, setNewDeadline] = useState('2026-12-30');
  const [newDesc, setNewDesc] = useState('');

  // Clarification dialog state
  const [clarifyingAppId, setClarifyingAppId] = useState<string | null>(null);
  const [clarQuestion, setClarQuestion] = useState('');

  const handleCreateTender = (e: React.FormEvent) => {
    e.preventDefault();
    const budgetVal = parseFloat(newBudgetCr) * 10000000;
    addTender({
      title: newTitle,
      department: newDept,
      sector: newSector,
      estimatedBudgetInr: budgetVal,
      budgetString: `₹${parseFloat(newBudgetCr).toFixed(2)} Cr`,
      submissionDeadline: newDeadline,
      description: newDesc || 'Procurement initiated by officer.'
    });
    setCreateModalOpen(false);
    setNewTitle('');
    setNewDesc('');
  };

  const handleSendClarification = (appId: string) => {
    if (!clarQuestion.trim()) return;
    const app = applications.find(a => a.id === appId);
    if (app) {
      app.clarifications.push({
        id: `clar-${Date.now()}`,
        askedBy: currentUser?.name || 'Procurement Committee',
        askedAt: new Date().toISOString(),
        question: clarQuestion
      });
    }
    setClarifyingAppId(null);
    setClarQuestion('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Officer Header */}
      <div className="p-6 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Procurement Officer Workspace
            </span>
          </div>
          <h1 className="text-2xl font-black">{currentUser?.organization}</h1>
          <p className="text-xs text-slate-300 mt-1">
            Logged in as: <strong className="text-white">{currentUser?.name}</strong> • Authorized Tender Inviting Authority (TIA)
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-emerald-900/20 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Publish New Central Tender
        </button>
      </div>

      {/* Review Incoming Bids Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Incoming Startup Submissions & Technical Evaluations</h2>
          <p className="text-xs text-slate-500">Review technical proposals, issue clarification queries, and award tenders.</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs divide-y divide-slate-100 overflow-hidden">
          {applications.map((app) => (
            <div key={app.id} className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {app.id}
                  </span>
                  <span className="text-xs font-extrabold text-slate-900">
                    {app.startupName}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm">
                    {app.matchScore}% AI Compliance
                  </span>
                </div>

                <h3 className="font-bold text-xs text-slate-800">{app.tenderTitle}</h3>
                <div className="text-[11px] text-slate-500 flex items-center gap-3">
                  <span>Submitted Quote: <strong className="text-slate-900">₹{(app.bidAmountInr / 100000).toFixed(2)} Lakhs</strong></span>
                  <span>•</span>
                  <span>Date: {new Date(app.submittedAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span className="font-bold text-blue-700">{app.status}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setClarifyingAppId(app.id)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                  Ask Clarification
                </button>

                {app.status !== 'SHORTLISTED' && app.status !== 'AWARDED' && (
                  <button
                    onClick={() => updateApplicationStatus(app.id, 'SHORTLISTED')}
                    className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-semibold transition-colors"
                  >
                    Shortlist
                  </button>
                )}

                {app.status !== 'AWARDED' ? (
                  <button
                    onClick={() => updateApplicationStatus(app.id, 'AWARDED')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 shadow-2xs transition-colors"
                  >
                    <Award className="w-3.5 h-3.5" />
                    Award Contract
                  </button>
                ) : (
                  <span className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Awarded
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clarification Dialog Modal */}
      {clarifyingAppId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Request Technical Clarification from Bidder</h3>
              <button onClick={() => setClarifyingAppId(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500">
              The startup will be immediately notified on their dashboard to furnish formal technical substantiation.
            </p>
            <textarea
              value={clarQuestion}
              onChange={(e) => setClarQuestion(e.target.value)}
              placeholder="e.g. Please clarify indigenous bill-of-materials and attach calibration certificate from NABL lab..."
              rows={4}
              className="w-full p-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setClarifyingAppId(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSendClarification(clarifyingAppId)}
                className="px-4 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5 text-emerald-400" />
                Dispatch Query
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Publish Tender Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Publish Central Government Tender</h3>
              <button onClick={() => setCreateModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTender} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Procurement Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  placeholder="e.g. Indigenous High-Altitude Tactical Micro-UAVs"
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Procuring Department</label>
                  <input
                    type="text"
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    required
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Sector</label>
                  <select
                    value={newSector}
                    onChange={(e) => setNewSector(e.target.value)}
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 bg-white"
                  >
                    <option value="Defence & Aerospace">Defence & Aerospace</option>
                    <option value="Healthcare & Life Sciences">Healthcare & Life Sciences</option>
                    <option value="CleanTech & Renewable Energy">CleanTech & Renewable Energy</option>
                    <option value="AgriTech & Remote Sensing">AgriTech & Remote Sensing</option>
                    <option value="Cybersecurity & Quantum Tech">Cybersecurity & Quantum Tech</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Value (₹ Crores)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newBudgetCr}
                    onChange={(e) => setNewBudgetCr(e.target.value)}
                    required
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Submission Deadline</label>
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    required
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Operational Brief</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={3}
                  placeholder="Specify key operational parameters, flight ceilings, or medical telemetry requirements..."
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800">
                ✓ Startup exemptions (100% EMD waiver & past turnover relaxation) will be automatically flagged as active.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
                >
                  Publish Tender Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
