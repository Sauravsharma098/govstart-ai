'use client';

import React, { useState } from 'react';
import { useApp } from '../lib/context/app-context';
import { 
  ShieldCheck, 
  Users, 
  Cpu, 
  Activity, 
  Database, 
  Lock, 
  CheckCircle2, 
  AlertTriangle,
  Layers,
  Sparkles,
  Server
} from 'lucide-react';

export default function AdminConsole() {
  const { allUsers, allStartups, tenders, applications } = useApp();

  const [liveAiApiEnabled, setLiveAiApiEnabled] = useState(false);

  const auditLogs = [
    { id: '1', action: 'DPIIT Exemption Verified', target: 'AeroTech Defence Labs (DIPP89234)', time: '10 mins ago', status: 'SUCCESS' },
    { id: '2', action: 'Technical Bid Lodged', target: 'Tender DRDO/ER/2026/UAV-048', time: '1 hour ago', status: 'SUCCESS' },
    { id: '3', action: 'Clarification Dispatched', target: 'Col. Rajesh Sharma -> AeroTech', time: '3 hours ago', status: 'INFO' },
    { id: '4', action: 'AI Match Vector Computed', target: 'NHM Tele-ICU RFP', time: '4 hours ago', status: 'SUCCESS' },
    { id: '5', action: 'New Tender Created', target: 'SECI High-Altitude Solar-Hybrid', time: '1 day ago', status: 'SUCCESS' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Header */}
      <div className="p-6 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-400 border border-purple-500/30">
              National Mission Administration
            </span>
          </div>
          <h1 className="text-2xl font-black">GovStart AI Mission Control</h1>
          <p className="text-xs text-slate-300 mt-1">
            Central monitoring, security audit logs, user governance, and sovereign AI engine telemetry.
          </p>
        </div>

        {/* Live vs Local Demo Mode Switch */}
        <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center gap-3 shrink-0">
          <div>
            <div className="text-[11px] font-bold text-white">AI Inference Mode</div>
            <div className="text-[10px] text-slate-400">
              {liveAiApiEnabled ? 'Cloud OpenAI API' : 'Zero-Config Local Heuristics'}
            </div>
          </div>
          <button
            onClick={() => setLiveAiApiEnabled(!liveAiApiEnabled)}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              liveAiApiEnabled ? 'bg-emerald-600' : 'bg-slate-700'
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                liveAiApiEnabled ? 'transform translate-x-5' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Registered Startups</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{allStartups.length}</div>
          <p className="text-[11px] text-emerald-700 mt-1">100% DPIIT & MSME verified</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Central Tenders Tracked</span>
            <Database className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{tenders.length}</div>
          <p className="text-[11px] text-slate-500 mt-1">₹90.35 Cr total value</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>AI Match Engine Latency</span>
            <Activity className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">38 ms</div>
          <p className="text-[11px] text-purple-700 mt-1">Sub-second vector ranking</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Tokens Evaluated Today</span>
            <Cpu className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">184,200</div>
          <p className="text-[11px] text-slate-500 mt-1">Zero prompt injection breaches</p>
        </div>

      </div>

      {/* Startup Registry & User Table */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Registered Deep-Tech Startup Directory</h2>
          <p className="text-xs text-slate-500">Entities authorized for GFR 2017 Rule 170(i) statutory startup exemptions</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3.5 pl-5">Startup Name</th>
                  <th className="p-3.5">DPIIT Number</th>
                  <th className="p-3.5">Sector</th>
                  <th className="p-3.5">Turnover</th>
                  <th className="p-3.5">Readiness Score</th>
                  <th className="p-3.5 pr-5">Exemption Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {allStartups.map((startup) => (
                  <tr key={startup.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3.5 pl-5 font-bold text-slate-900">{startup.name}</td>
                    <td className="p-3.5 text-slate-600 font-mono text-[11px]">{startup.dpiitNumber}</td>
                    <td className="p-3.5 text-slate-600">{startup.sector}</td>
                    <td className="p-3.5 font-semibold text-slate-900">₹{(startup.annualTurnoverLakhs / 100).toFixed(2)} Cr</td>
                    <td className="p-3.5 font-bold text-emerald-700">{startup.readinessScore}%</td>
                    <td className="p-3.5 pr-5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        100% EMD Waived
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Security Audit Log */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Security & Operational Audit Trail</h2>
          <p className="text-xs text-slate-500">Immutable ledger of platform actions and statutory verifications</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs divide-y divide-slate-100 overflow-hidden">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-3.5 px-5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-bold text-slate-900">{log.action}:</span>
                <span className="text-slate-600">{log.target}</span>
              </div>
              <div className="text-slate-400 text-[11px]">{log.time}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
