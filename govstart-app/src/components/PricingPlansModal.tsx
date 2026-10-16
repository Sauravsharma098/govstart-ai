'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/app-context';
import { 
  CheckCircle2, 
  X, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Zap, 
  Building2, 
  Briefcase, 
  Rocket,
  Lock,
  Info
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function PricingPlansModal({ isOpen, onClose }: Props) {
  const { pricingPlans, setActiveView } = useApp();
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'ANNUAL'>('MONTHLY');
  const [selectedPlanId, setSelectedPlanId] = useState<string>('pro');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-xs font-bold border border-emerald-800">
              <Zap className="w-3.5 h-3.5" />
              <span>Transparent SaaS Pricing</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Accelerate Your Public Procurement Pipeline
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Choose the right tier for your startup, MSME enterprise, or advisory consulting firm.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Mode Notice */}
        <div className="px-6 py-2.5 bg-amber-50 border-b border-amber-200 text-amber-900 text-xs flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>Demo Architecture Notice:</strong> Commercial payment gateways are currently disabled in this demo environment. All users enjoy unlimited access to Pro and Consultant AI features for evaluation.
          </span>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Billing Cycle Switcher */}
          <div className="flex items-center justify-center gap-3">
            <span className={`text-xs font-bold ${billingCycle === 'MONTHLY' ? 'text-slate-900' : 'text-slate-400'}`}>
              Monthly Billing
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'MONTHLY' ? 'ANNUAL' : 'MONTHLY')}
              className="relative inline-flex h-6 w-12 items-center rounded-full bg-slate-900 transition-colors"
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-emerald-400 transition-transform ${
                billingCycle === 'ANNUAL' ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
            <span className={`text-xs font-bold flex items-center gap-1.5 ${billingCycle === 'ANNUAL' ? 'text-slate-900' : 'text-slate-400'}`}>
              Annual Billing
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                SAVE 20%
              </span>
            </span>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {pricingPlans.map((plan) => {
              const isSelected = selectedPlanId === plan.id;
              const displayPrice = billingCycle === 'ANNUAL' && plan.priceInrPerMonth > 0
                ? Math.round(plan.priceInrPerMonth * 0.8)
                : plan.priceInrPerMonth;

              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`relative p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                    plan.badge === 'MOST POPULAR'
                      ? 'border-emerald-600 bg-white ring-2 ring-emerald-600/30 shadow-lg'
                      : isSelected
                        ? 'border-slate-900 bg-white ring-2 ring-slate-900/10 shadow-md'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold tracking-wider uppercase shadow-xs">
                      {plan.badge}
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{plan.name}</h3>
                      <p className="text-[11px] text-slate-500 mt-1 min-h-[32px]">
                        {plan.targetAudience}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl sm:text-3xl font-black text-slate-900">
                          {displayPrice === 0 ? 'Free' : `₹${displayPrice.toLocaleString()}`}
                        </span>
                        {displayPrice > 0 && (
                          <span className="text-xs text-slate-500 font-semibold">/month</span>
                        )}
                      </div>
                      {billingCycle === 'ANNUAL' && displayPrice > 0 && (
                        <span className="text-[10px] text-emerald-700 font-bold">
                          Billed annually (₹{(displayPrice * 12).toLocaleString()}/yr)
                        </span>
                      )}
                    </div>

                    {/* Features List */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Included:</span>
                      {plan.features.map((f, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="text-[11px] leading-tight">{f}</span>
                        </div>
                      ))}
                    </div>

                    {/* Limitations (if any) */}
                    {plan.limitations.length > 0 && (
                      <div className="space-y-1.5 pt-2 border-t border-slate-100">
                        {plan.limitations.map((l, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-[10px] text-slate-400">
                            <span className="text-slate-300">•</span>
                            <span>{l}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose();
                      setActiveView('dashboard');
                    }}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      plan.badge === 'MOST POPULAR'
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Security & Data Guarantee Callout */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold text-slate-900">Zero-Risk Free Tier Policy:</span>
                <span className="text-slate-600 ml-1">
                  Public tender discovery, GFR Rule 170(i) exemption guidelines, and learning resources remain 100% free forever for all Indian registered startups and MSMEs.
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                setActiveView('tenders');
              }}
              className="text-xs font-bold text-slate-900 hover:text-emerald-700 shrink-0 underline"
            >
              Browse Public Tenders
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
