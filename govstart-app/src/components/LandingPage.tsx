'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/app-context';
import { 
  ShieldCheck, 
  Sparkles, 
  Search, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  FileCheck2, 
  Layers, 
  Sliders, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  Award,
  Zap,
  Lock,
  Building2,
  Factory,
  Rocket,
  Briefcase,
  Users,
  Compass,
  Bookmark,
  Check,
  X as XIcon,
  BookOpen
} from 'lucide-react';

export default function LandingPage() {
  const { setActiveView, setOnboardingModalOpen, currentStartup } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activePreviewTab, setActivePreviewTab] = useState<'match' | 'pdf' | 'shortlist' | 'pipeline'>('match');

  const faqs = [
    {
      q: 'How does GovStart AI calculate tender match scores?',
      a: 'Our engine uses a multi-factor deterministic and semantic framework: Sector & Industry Alignment (25%), Technical Specifications & Keyword Overlap (25%), Mandatory Eligibility & Statutory Waivers (20%), Certifications & Past Experience (10%), Budget Scale Suitability (10%), and Lead Time Readiness (10%). Mandatory failures are never overridden by high keyword scores.'
    },
    {
      q: 'Are startups and MSMEs really exempt from Earnest Money Deposit (EMD)?',
      a: 'Yes! Under Rule 170(i) of General Financial Rules (GFR) 2017 and Ministry of Finance Order No. F.20/2/2014-PPD, all DPIIT recognized Startups and registered Micro & Small Enterprises (MSEs with Udyam) are 100% exempt from EMD and eligible for relaxed past turnover conditions, subject to meeting technical capability.'
    },
    {
      q: 'Can visitors explore public tenders without signing up?',
      a: 'Absolutely. Public tender gazettes and GeM/CPPP listings can be freely explored, searched, and filtered by any visitor. Personalized AI match scores, PDF deep-scans, and bid workspaces are unlocked upon setting up your business profile.'
    },
    {
      q: 'Does GovStart AI guarantee that our bid will win or be accepted?',
      a: 'No. GovStart AI provides intelligence, clause extraction, gap identification, and bid preparation support. Final eligibility decisions, commercial evaluations, and contract awards are strictly made by the respective government procuring entity.'
    },
    {
      q: 'How are client profiles separated for consultants?',
      a: 'Advisory firms and procurement consultants have access to a multi-client workspace where they can toggle between assigned client profiles, audit separate capability gaps, and manage individual bidding pipelines with strict data isolation.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      
      {/* Top Brand Promise Bar */}
      <div className="bg-slate-900 text-white text-xs py-2 px-4 text-center border-b border-slate-800 flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
        <span className="font-semibold tracking-wide">
          Core Brand Promise: &ldquo;Find the Right Opportunities. Prepare with AI. Grow Your Business.&rdquo;
        </span>
        <span className="hidden sm:inline text-slate-500">•</span>
        <button 
          onClick={() => setOnboardingModalOpen(true)}
          className="hidden sm:inline text-emerald-400 font-bold hover:underline"
        >
          Tailor Your Matches &rarr;
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200 bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Subtle GovTech Trust Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-300 text-slate-800 text-xs font-semibold mb-6 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>National Government Opportunity Network</span>
            <span className="text-slate-400">|</span>
            <span className="text-emerald-700 font-bold">GFR 2017 & DPIIT Compliant</span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight">
            Discover Government Opportunities.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-blue-900 to-emerald-700">
              Grow Your Startup.
            </span>
          </h1>

          {/* Supporting Copy */}
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Find relevant government tenders, understand complex requirements with AI, and prepare your business for procurement opportunities—all in one place.
          </p>

          {/* Dual CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setOnboardingModalOpen(true)}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              Find My Best Tenders
              <ArrowRight className="w-4 h-4 text-emerald-200" />
            </button>
            <button
              onClick={() => setActiveView('tenders')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-lg shadow-slate-900/15 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Search className="w-4 h-4 text-emerald-400" />
              Explore Opportunities (No Signup Needed)
            </button>
          </div>

          {/* Platform Performance Metrics (Clearly Labeled Demo vs Verified) */}
          <div className="mt-14 pt-8 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">₹90.35 Cr</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Live Pipeline Tracked <span className="text-[10px] text-emerald-700 font-bold">(Demo)</span></div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700">100%</div>
              <div className="text-xs text-slate-500 font-medium mt-1">EMD Exemption Verified <span className="text-[10px] text-slate-400">(GFR 170)</span></div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">6 Sectors</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Defence, Health, Cyber, Space</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-700">Deterministic</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Explainable AI Scoring</div>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive Product Preview Dashboard */}
      <section className="py-16 bg-slate-100 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Live Product Experience</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">An Enterprise Opportunity Intelligence Suite</h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Click through the interactive tabs below to preview the actual working tools built into GovStart AI.
            </p>
          </div>

          {/* Preview Navigation Tabs */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 text-xs">
            {[
              { id: 'match', label: '1. AI Smart Match Matrix', icon: Sparkles },
              { id: 'pdf', label: '2. PDF Clause Deep-Scan', icon: FileCheck2 },
              { id: 'shortlist', label: '3. Multi-Tender Compare', icon: Bookmark },
              { id: 'pipeline', label: '4. Bid Submission Tracker', icon: Layers }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActivePreviewTab(tab.id as any)}
                  className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shrink-0 ${
                    activePreviewTab === tab.id
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4 text-emerald-400" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Display Card */}
          <div className="bg-white rounded-3xl border border-slate-300 shadow-xl p-6 sm:p-8 space-y-6 max-w-5xl mx-auto">
            {activePreviewTab === 'match' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                      Sample Analysis • Demo Record
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      DRDO/ER/2026/UAV-048 — Autonomous Perimeter Surveillance UAV Swarms
                    </h3>
                  </div>
                  <span className="text-2xl font-black text-emerald-700">99% Match</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block">Sector Relevance</span>
                    <strong className="text-slate-900 text-sm">25 / 25 pts (100%)</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block">Technical Capability</span>
                    <strong className="text-slate-900 text-sm">25 / 25 pts (100%)</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block">Eligibility & EMD Waiver</span>
                    <strong className="text-emerald-700 text-sm">20 / 20 pts (Exempt)</strong>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                  <strong>Statutory Basis:</strong> DPIIT Certificate unlocks GFR Rule 170(i) 100% waiver of ₹25 Lakhs EMD deposit.
                </div>
              </div>
            )}

            {activePreviewTab === 'pdf' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900">
                    Clause-Grounded PDF Document Analyzer
                  </h3>
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                    48 Pages Scanned
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900">Scope of Work (Page 12, Cl 3.2): </strong>
                      <span className="text-slate-600">Supply of 12 micro-UAVs with high-altitude thermal sensors for sub-zero operation.</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-amber-900">Contradiction Detected: </strong>
                      <span className="text-amber-800">Cl 2.1 requires 3-year turnover, but Cl 14.1 explicitly exempts DPIIT recognized startups. Clarification recommended.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activePreviewTab === 'shortlist' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900">
                    Multi-Tender Comparison Matrix (Up to 3 Opportunities)
                  </h3>
                  <span className="text-xs font-bold text-slate-500">Side-by-Side</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                    <div className="font-bold text-slate-900">DRDO UAV Swarm (₹12.50 Cr)</div>
                    <div className="text-emerald-700 font-bold">99% Match • EMD Exempt</div>
                    <div className="text-[11px] text-slate-500">Lead time: 14 days • High altitude Leh trial</div>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                    <div className="font-bold text-slate-900">ISRO FPGA Units (₹14.20 Cr)</div>
                    <div className="text-blue-700 font-bold">89% Match • EMD Exempt</div>
                    <div className="text-[11px] text-slate-500">Lead time: 21 days • Radiation test cert needed</div>
                  </div>
                </div>
              </div>
            )}

            {activePreviewTab === 'pipeline' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900">
                    Bid Application Pipeline & Clarification Log
                  </h3>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Audit-Tracked
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">Bid #app-001 — DRDO Tactical Swarm</div>
                    <div className="text-slate-500 text-[11px]">Submitted on 14 Oct 2026 • Status: Technical Evaluation</div>
                  </div>
                  <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                    Clarification Responded
                  </span>
                </div>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between text-xs">
              <span className="text-slate-400">Previewing live interface</span>
              <button
                onClick={() => setActiveView('dashboard')}
                className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                Launch Full App Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works in 4 Steps */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Simple 4-Step Workflow</span>
            <h2 className="text-3xl font-black text-slate-900">How GovStart AI Works</h2>
            <p className="text-sm text-slate-600">
              Transforming complex 100-page government tender documents into actionable, compliant proposals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Discover Opportunities',
                desc: 'Explore open tenders from GeM, CPPP, and defence portals with zero forced signup barriers.'
              },
              {
                step: '02',
                title: 'Verify Eligibility & Waivers',
                desc: 'Our deterministic rule engine checks GFR 2017 Rule 170(i) for 100% EMD waivers and turnover relaxations.'
              },
              {
                step: '03',
                title: 'AI Copilot Bid Preparation',
                desc: 'Extract clauses, detect contradictions, and generate itemized compliance matrices in our AI Bid Studio.'
              },
              {
                step: '04',
                title: 'Track Pipeline & Grow',
                desc: 'Manage deadlines, respond to officer clarification queries, and track evaluations in one workspace.'
              }
            ].map((s) => (
              <div key={s.step} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative">
                <span className="text-3xl font-black text-emerald-600/30">{s.step}</span>
                <h3 className="text-base font-bold text-slate-900">{s.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tailored Benefits for 4 Key User Segments */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Tailored For Your Role</span>
            <h2 className="text-3xl font-black text-slate-900">Built for Every Procurement Stakeholder</h2>
            <p className="text-sm text-slate-600">
              Dedicated workflows tailored specifically for founders, MSME enterprises, suppliers, and consultants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Startups */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Rocket className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Startup Founders</h3>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" /> 100% EMD exemption verification</li>
                <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" /> Relaxed past-turnover analysis</li>
                <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" /> Fast AI clause matrix generation</li>
              </ul>
            </div>

            {/* MSMEs */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Factory className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">MSME Owners</h3>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" /> 25% public procurement quota tracking</li>
                <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" /> Udyam certificate statutory benefits</li>
                <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" /> GeM BOQ item matching</li>
              </ul>
            </div>

            {/* Suppliers */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Established Suppliers</h3>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" /> Multi-crore consortium RFP matching</li>
                <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" /> Strict technical compliance audit</li>
                <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" /> Pre-bid clarification assistance</li>
              </ul>
            </div>

            {/* Consultants */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Procurement Advisors</h3>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" /> Multi-client workspace with data separation</li>
                <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" /> Client-by-client pipeline monitoring</li>
                <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" /> Exportable client executive reports</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Comparison Section: Traditional vs GovStart AI */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Objective Comparison</span>
            <h2 className="text-3xl font-black text-slate-900">Why Teams Choose GovStart AI</h2>
            <p className="text-sm text-slate-600">
              Eliminate manual red tape and bid disqualifications with structured AI assistance.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse border border-slate-200 rounded-2xl overflow-hidden">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="p-3.5 font-bold">Feature / Capability</th>
                  <th className="p-3.5 font-bold text-slate-300">Traditional Procurement</th>
                  <th className="p-3.5 font-bold text-emerald-400">GovStart AI Platform</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-3.5 font-bold text-slate-900">Tender Discovery & Search</td>
                  <td className="p-3.5 text-slate-500">Manual search across 10+ fragmented portals</td>
                  <td className="p-3.5 text-emerald-900 font-bold bg-emerald-50/50">Unified search with GeM & CPPP indexing</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-slate-900">EMD & Turnover Exemption Check</td>
                  <td className="p-3.5 text-slate-500">Uncertain; startups often pay EMD unnecessarily</td>
                  <td className="p-3.5 text-emerald-900 font-bold bg-emerald-50/50">Automatic GFR 170(i) & DPIIT waiver verification</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-slate-900">RFP Document Analysis</td>
                  <td className="p-3.5 text-slate-500">Manual reading of 60-120 page PDF documents</td>
                  <td className="p-3.5 text-emerald-900 font-bold bg-emerald-50/50">Clause-grounded extraction in &lt; 45 seconds</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-slate-900">Bid Disqualification Prevention</td>
                  <td className="p-3.5 text-slate-500">Disqualifications common due to missing affidavits</td>
                  <td className="p-3.5 text-emerald-900 font-bold bg-emerald-50/50">Itemized 10-point Cover checklist & alerts</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-slate-900">Side-by-Side Tender Comparison</td>
                  <td className="p-3.5 text-slate-500">Manual spreadsheets</td>
                  <td className="p-3.5 text-emerald-900 font-bold bg-emerald-50/50">Interactive 3-tender comparative matrix</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Trust, Security & Data Governance Layer */}
      <section className="py-16 bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 text-xs font-bold border border-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Security & Data Governance</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">
              Enterprise Trust & Official Procurement Standards
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              GovStart AI processes procurement gazettes under open public procurement standards. Uploaded proprietary startup proposals and financial balance sheets remain confidential and are never used to train public LLM models.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-2">
              <Lock className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Private Document Sandbox</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Uploaded tender PDFs and capability matrices are analyzed in ephemeral private sessions without unauthorized data harvesting.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-2">
              <CheckCircle2 className="w-5 h-5 text-blue-400" />
              <h3 className="text-sm font-bold text-white">Rule 170(i) Legal Grounding</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Exemption logic maps directly to General Financial Rules 2017 and Ministry of Finance Department of Expenditure orders.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-2">
              <Award className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Transparent Demo Attribution</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                We clearly separate verified official public tenders from illustrative demonstration records for maximum integrity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Common Questions</span>
            <h2 className="text-3xl font-black text-slate-900">Frequently Asked Questions</h2>
            <p className="text-sm text-slate-600">Everything you need to know about AI tender discovery and statutory bidding exemptions.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-2xs transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between text-sm font-bold text-slate-900 hover:text-emerald-700 transition-colors"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Onboarding Conversion Card */}
          <div className="p-8 rounded-3xl bg-slate-900 text-white text-center space-y-4 shadow-xl border border-slate-800">
            <h3 className="text-xl sm:text-2xl font-black">Ready to Discover Your Best Tenders?</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
              Join Indian startups and MSMEs using GovStart AI to decode government tenders and bid with confidence.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setOnboardingModalOpen(true)}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-900/20"
              >
                Find My Best Tenders Now
              </button>
              <button
                onClick={() => setActiveView('learning-hub')}
                className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all border border-slate-700"
              >
                Explore Procurement Academy
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
