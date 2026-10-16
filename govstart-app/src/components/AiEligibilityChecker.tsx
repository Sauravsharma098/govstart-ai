'use client';

import React from 'react';
import { useApp } from '../lib/context/app-context';
import { Tender } from '../lib/types';
import { checkRegulatoryEligibility } from '@/lib/ai/ai-service';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  FileCheck, 
  ArrowRight,
  ExternalLink,
  Award,
  DollarSign
} from 'lucide-react';

interface Props {
  tender: Tender;
}

export default function AiEligibilityChecker({ tender }: Props) {
  const { currentStartup } = useApp();

  if (!currentStartup) return null;

  const eligibility = checkRegulatoryEligibility(tender, currentStartup);

  return (
    <div className="space-y-6">
      
      {/* Top Exemption Status Banner */}
      <div className="p-6 rounded-2xl bg-emerald-900 text-white relative overflow-hidden shadow-xl border border-emerald-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-800 text-emerald-200 border border-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              Statutory Exemption Verified
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              {currentStartup.name} Qualifies for 100% EMD Waiver
            </h2>
            <p className="text-xs text-emerald-200 max-w-2xl leading-relaxed">
              Governed by <strong className="text-white">{eligibility.orderReference}</strong>. As an entity with DPIIT registration ({currentStartup.dpiitNumber}), you are legally protected from upfront capital lock-in.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-800/80 border border-emerald-700 text-right shrink-0">
            <div className="text-[10px] text-emerald-300 uppercase font-semibold">Immediate Capital Saved</div>
            <div className="text-2xl font-black text-white">₹{(tender.emdAmountInr / 100000).toFixed(2)} Lakhs</div>
            <div className="text-[10px] text-emerald-300 mt-0.5">Zero Bank Guarantee required</div>
          </div>
        </div>
      </div>

      {/* Statutory Relief Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {eligibility.waivers.map((waiver, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">{waiver.title}</span>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                waiver.status.includes('EXEMPT') || waiver.status.includes('WAIVED') || waiver.status.includes('FREE')
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}>
                {waiver.status}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
              {waiver.basis}
            </p>
          </div>
        ))}
      </div>

      {/* Actionable Next Steps to Claim Exemption */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
          <FileCheck className="w-4 h-4 text-emerald-600" />
          Mandatory Steps to Claim Startup Relief in the Tender Portal
        </h3>
        
        <div className="space-y-2 text-xs text-slate-700">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
              1
            </span>
            <div>
              <strong className="text-slate-900">Upload DPIIT Certificate in Fee Exemption Slot:</strong>
              <p className="text-slate-500 mt-0.5">When prompted for EMD / Bid Security on the portal (eProcure / GeM), select &apos;Exemption Claimed: Yes&apos; and attach your valid certificate.</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
              2
            </span>
            <div>
              <strong className="text-slate-900">Submit Bid Security Declaration:</strong>
              <p className="text-slate-500 mt-0.5">In lieu of a cash guarantee, provide an undertaking on your company letterhead affirming compliance with bid validity.</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
              3
            </span>
            <div>
              <strong className="text-slate-900">Reference Order No. F.20/2/2014-PPD:</strong>
              <p className="text-slate-500 mt-0.5">Cite the Department of Expenditure order in your Cover-1 covering letter to avoid any arbitrary technical disqualification by the evaluation committee.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
