'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/app-context';
import { UserRole, OnboardingData } from '@/lib/types';
import { 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  ShieldCheck, 
  Rocket, 
  Factory, 
  Briefcase, 
  Users, 
  FileCheck2,
  DollarSign,
  Award,
  MapPin
} from 'lucide-react';

const SECTORS = [
  'Defence & Aerospace',
  'Healthcare & Life Sciences',
  'Cybersecurity & Quantum Tech',
  'Renewable Energy & CleanTech',
  'AgriTech & Remote Sensing',
  'Information Technology & AI',
  'Smart Infrastructure & IoT',
  'Education & EdTech'
];

const CERTIFICATION_OPTIONS = [
  'ISO 9001 (Quality Management)',
  'ISO 27001 (Information Security)',
  'STQC Common Criteria / CERT-In',
  'CEMILAC / TBRL Defence Approval',
  'CDSCO Medical Device / ISO 13485',
  'MNRE Tier-1 Solar Vendor',
  'DGCA Drone Type Certified',
  'BIS / ISI Mark Certified'
];

export default function OnboardingModal() {
  const { onboardingModalOpen, setOnboardingModalOpen, handleCompleteOnboarding } = useApp();
  const [step, setStep] = useState(1);

  // Form State
  const [role, setRole] = useState<UserRole>('STARTUP');
  const [organizationName, setOrganizationName] = useState('');
  const [sector, setSector] = useState(SECTORS[0]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Hardware & Robotics', 'AI & Software']);
  const [annualTurnoverLakhs, setAnnualTurnoverLakhs] = useState<number>(350);
  const [dpiitRecognized, setDpiitRecognized] = useState(true);
  const [msmeRegistered, setMsmeRegistered] = useState(true);
  const [priorGovExperienceYears, setPriorGovExperienceYears] = useState(2);
  const [city, setCity] = useState('Bengaluru');
  const [state, setState] = useState('Karnataka');
  const [selectedCerts, setSelectedCerts] = useState<string[]>(['ISO 9001 (Quality Management)']);
  const [preferredContractMinLakhs, setPreferredContractMinLakhs] = useState(25);
  const [preferredContractMaxLakhs, setPreferredContractMaxLakhs] = useState(1500);

  if (!onboardingModalOpen) return null;

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const toggleCert = (cert: string) => {
    setSelectedCerts(prev => 
      prev.includes(cert) ? prev.filter(c => c !== cert) : [...prev, cert]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: OnboardingData = {
      role,
      organizationName: organizationName.trim() || (role === 'MSME' ? 'Apex Industrial Components' : 'Bharat DeepTech Innovations'),
      sector,
      categories: selectedCategories.length > 0 ? selectedCategories : [sector],
      annualTurnoverLakhs,
      dpiitRecognized,
      msmeRegistered,
      priorGovExperienceYears,
      city,
      state,
      certifications: selectedCerts,
      preferredContractMinLakhs,
      preferredContractMaxLakhs
    };
    handleCompleteOnboarding(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Tailor Your Procurement Intelligence
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-900 text-emerald-300 border border-emerald-700">
                  Step {step} of 3
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Personalize AI tender matching to your business capabilities and statutory exemptions.
              </p>
            </div>
          </div>
          <button
            onClick={() => setOnboardingModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1">
          <div 
            className="bg-emerald-600 h-1 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* STEP 1: Persona & Role */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900">What best describes your organization?</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  GovStart AI customizes regulatory exemption algorithms (GFR Rule 170(i)) based on your profile.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                <div 
                  onClick={() => setRole('STARTUP')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    role === 'STARTUP' 
                      ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/20' 
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <Rocket className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">Startup Founder</div>
                      <div className="text-xs text-slate-500">DPIIT recognized (&lt; 10 yrs)</div>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-2">
                    Eligible for 100% EMD exemptions and relaxed past-turnover criteria under GFR 2017.
                  </p>
                </div>

                <div 
                  onClick={() => setRole('MSME')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    role === 'MSME' 
                      ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/20' 
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                      <Factory className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">MSME Owner</div>
                      <div className="text-xs text-slate-500">Udyam registered enterprise</div>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-2">
                    Avail 25% mandatory public procurement policy quotas and price preference in central bids.
                  </p>
                </div>

                <div 
                  onClick={() => setRole('SUPPLIER')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    role === 'SUPPLIER' 
                      ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/20' 
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">Established Supplier</div>
                      <div className="text-xs text-slate-500">Corporation or OEM</div>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-2">
                    Large-scale multi-consortium opportunities, high-value PSU contracts, and GeM BOQs.
                  </p>
                </div>

                <div 
                  onClick={() => setRole('CONSULTANT')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    role === 'CONSULTANT' 
                      ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/20' 
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">Procurement Advisor</div>
                      <div className="text-xs text-slate-500">Consultant managing clients</div>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-2">
                    Multi-client workspace to track bidding pipelines and draft proposals for advisory clients.
                  </p>
                </div>

              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company / Organization Legal Name</label>
                <input
                  type="text"
                  placeholder="e.g. AeroTech Defence Labs Pvt Ltd"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City / Base</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">State / UT</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Sector & Capabilities */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900">What is your primary industry sector?</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Our semantic matcher aligns this against government RFP scope of work and technical schedules.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SECTORS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSector(s)}
                    className={`p-3 text-left rounded-xl border text-xs font-semibold transition-all flex items-center justify-between ${
                      sector === s
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{s}</span>
                    {sector === s && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Technical Certifications & Empanelments</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {CERTIFICATION_OPTIONS.map((c) => (
                    <div
                      key={c}
                      onClick={() => toggleCert(c)}
                      className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-center gap-2 transition-all ${
                        selectedCerts.includes(c)
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedCerts.includes(c)}
                        readOnly
                        className="rounded-sm text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5"
                      />
                      <span className="truncate">{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Years of Relevant Government / Enterprise Experience
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="15"
                    step="1"
                    value={priorGovExperienceYears}
                    onChange={(e) => setPriorGovExperienceYears(parseInt(e.target.value))}
                    className="flex-1 accent-emerald-600"
                  />
                  <span className="text-sm font-bold text-slate-900 w-16 text-right">
                    {priorGovExperienceYears === 0 ? '0 yrs (Fresh)' : `${priorGovExperienceYears} years`}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Statutory Qualifications & Contract Range */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Statutory Recognition & Financial Scale</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Used by our deterministic rule engine to verify EMD, PBG, and turnover exemption applicability.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">DPIIT Startup India Recognition</div>
                      <div className="text-[11px] text-slate-500">Unlocks GFR Rule 170(i) 100% EMD exemption</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDpiitRecognized(!dpiitRecognized)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      dpiitRecognized ? 'bg-emerald-600' : 'bg-slate-300'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      dpiitRecognized ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">MSME Udyam Registration</div>
                      <div className="text-[11px] text-slate-500">Qualifies for 25% public procurement allocation</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMsmeRegistered(!msmeRegistered)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      msmeRegistered ? 'bg-emerald-600' : 'bg-slate-300'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      msmeRegistered ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Annual Turnover: <span className="text-emerald-700">₹{annualTurnoverLakhs} Lakhs</span> (~₹{(annualTurnoverLakhs / 100).toFixed(2)} Cr)
                </label>
                <input
                  type="range"
                  min="0"
                  max="2500"
                  step="25"
                  value={annualTurnoverLakhs}
                  onChange={(e) => setAnnualTurnoverLakhs(parseInt(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Contract Min (₹ Lakhs)</label>
                  <input
                    type="number"
                    value={preferredContractMinLakhs}
                    onChange={(e) => setPreferredContractMinLakhs(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Contract Max (₹ Lakhs)</label>
                  <input
                    type="number"
                    value={preferredContractMaxLakhs}
                    onChange={(e) => setPreferredContractMaxLakhs(parseInt(e.target.value) || 100)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900">
                <span className="font-bold">Transparent Matching Policy:</span> GovStart AI separates commercial suitability from statutory eligibility. High match scores never bypass mandatory tender requirements.
              </div>
            </div>
          )}

        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setOnboardingModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors"
            >
              Skip for now
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-slate-900/10 transition-all hover:scale-[1.02]"
            >
              Continue
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
              Calculate My AI Matches
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
