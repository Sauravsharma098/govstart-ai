'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/app-context';
import { ShieldCheck, ExternalLink, HelpCircle, Mail, FileText, Lock } from 'lucide-react';

export default function Footer() {
  const { setActiveView } = useApp();
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Mission */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveView('landing')}>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-bold text-base text-white tracking-tight">GovStart AI</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Find the Right Opportunities. Prepare with AI. Grow Your Business. An intelligent procurement network built for Indian startups, MSMEs, and suppliers.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Verified GFR 2017 & DPIIT Exemption Rules
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">Platform Navigation</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActiveView('tenders')} className="hover:text-white transition-colors">
                  Public Tender Discovery
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('learning-hub')} className="hover:text-white transition-colors">
                  Procurement Academy & Guides
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('ai-studio')} className="hover:text-white transition-colors">
                  AI Intelligence & Bid Studio
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('shortlist')} className="hover:text-white transition-colors">
                  My AI Shortlist & Comparison
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('pricing')} className="hover:text-white transition-colors">
                  Transparent Freemium Pricing
                </button>
              </li>
            </ul>
          </div>

          {/* Official Policies & Data Sources */}
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">Statutory Framework</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-1">
                <a href="https://doe.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                  DoE Order F.20/2/2014-PPD <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://gem.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                  Rule 170(i) GFR 2017 (EMD Waiver) <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://www.startupindia.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                  DPIIT Startup India Recognition <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://udyamregistration.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                  MSME Public Procurement Policy <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact, Privacy & Trust Disclaimers */}
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">Trust & Security</h4>
            <p className="text-slate-400 text-xs leading-relaxed mb-3">
              Zero unauthorized contact harvesting or proprietary data leakages. User-uploaded financial metrics and proposal drafts remain private and confidential.
            </p>
            <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-[11px] space-y-1">
              <div className="text-slate-300 font-bold flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-400" />
                Private Session Sandbox
              </div>
              <div className="text-slate-400 text-[10px]">
                Support: <a href="mailto:support@govstart.example.in" className="text-emerald-400 hover:underline">support@govstart.example.in</a>
              </div>
            </div>
          </div>

        </div>

        {/* Disclaimer Notice */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 space-y-3 text-[11px] text-slate-500">
          <p className="leading-relaxed">
            <strong>Important Legal Disclaimer:</strong> GovStart AI is an independent software analytics platform and is not affiliated with, endorsed by, or an official agency of the Government of India, GeM SPV, or any Central/State Ministry. Match scores and statutory exemption analyses represent automated preliminary guidance and do not guarantee eligibility, pre-qualification, or contract award.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2">
            <div>
              &copy; 2026 GovStart AI Network. Designed for deep-tech innovation and open government procurement.
            </div>
            <div className="flex gap-4">
              <span onClick={() => setActiveView('learning-hub')} className="hover:text-slate-300 cursor-pointer">
                Academy & Help
              </span>
              <span onClick={() => setPrivacyModalOpen(true)} className="hover:text-slate-300 cursor-pointer">
                Privacy Policy
              </span>
              <span onClick={() => setTermsModalOpen(true)} className="hover:text-slate-300 cursor-pointer">
                Terms of Service
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      {privacyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white text-slate-900 rounded-2xl p-6 max-w-lg w-full space-y-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900">Privacy & Data Governance Policy</h3>
            <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <p>1. <strong>Private Analysis</strong>: We do not share, sell, or commercialize your uploaded proposal documents, bid prices, or capability metrics.</p>
              <p>2. <strong>No LLM Training on Private Data</strong>: Proprietary startup data is never used to train public foundation models.</p>
              <p>3. <strong>Open Data Attribution</strong>: Tender opportunities are retrieved from official public sources (GeM, CPPP) under open government data guidelines.</p>
            </div>
            <button
              onClick={() => setPrivacyModalOpen(false)}
              className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Terms of Service Modal */}
      {termsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white text-slate-900 rounded-2xl p-6 max-w-lg w-full space-y-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900">Terms of Service</h3>
            <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <p>1. <strong>Information Use Only</strong>: GovStart AI provides preliminary RFP summarization and deterministic compatibility estimations. It does not replace independent legal advice.</p>
              <p>2. <strong>No External Bid Submission Guarantee</strong>: Preparing bids within the platform workspace does not constitute formal submission on external portals (GeM / CPPP).</p>
              <p>3. <strong>Fair Use</strong>: Automated scraping or abusive querying of the platform discovery services is strictly prohibited.</p>
            </div>
            <button
              onClick={() => setTermsModalOpen(false)}
              className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </footer>
  );
}
