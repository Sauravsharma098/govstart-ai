'use client';

import React from 'react';
import { useApp } from '../lib/context/app-context';
import { Tender } from '../lib/types';
import { calculateMatchScore, DEFAULT_WEIGHTS } from '@/lib/ai/ai-service';
import { 
  Sparkles, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw,
  ShieldCheck,
  TrendingUp,
  Cpu
} from 'lucide-react';

interface Props {
  tender: Tender;
}

export default function AiMatchMatrix({ tender }: Props) {
  const { currentStartup, weights, setWeights } = useApp();

  if (!currentStartup) return null;

  const match = calculateMatchScore(tender, currentStartup, weights);

  const resetWeights = () => {
    setWeights(DEFAULT_WEIGHTS);
  };

  // SVG Circular dial calculation
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (match.overallScore / 100) * circumference;

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Score Dial & High-Level Breakdown */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        {/* Animated Circular Score Dial */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r={radius}
                className="text-slate-100 stroke-current"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="60"
                cy="60"
                r={radius}
                className="text-emerald-500 stroke-current transition-all duration-700 ease-out"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-slate-900 tracking-tight">{match.overallScore}%</span>
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                {match.overallScore >= 80 ? 'High Match' : match.overallScore >= 60 ? 'Moderate' : 'Low Match'}
              </span>
            </div>
          </div>
          <div className="mt-2 text-xs font-semibold text-slate-700">Algorithmic Compatibility</div>
          <div className="text-[11px] text-slate-400">Calibrated for {currentStartup.name}</div>
        </div>

        {/* 4-Pillar Breakdown Bars */}
        <div className="md:col-span-8 space-y-3.5">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-700">Sector Mandate Alignment ({(weights.sectorWeight * 100).toFixed(0)}% weight)</span>
              <span className="text-slate-900 font-bold">{match.sectorMatch}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div 
                className="h-full bg-slate-900 rounded-full transition-all duration-500" 
                style={{ width: `${match.sectorMatch}%` }} 
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-700">Skills & Tech Stack Overlap ({(weights.skillsWeight * 100).toFixed(0)}% weight)</span>
              <span className="text-emerald-700 font-bold">{match.skillsMatch}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div 
                className="h-full bg-emerald-600 rounded-full transition-all duration-500" 
                style={{ width: `${match.skillsMatch}%` }} 
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-700">Past Experience Qualification ({(weights.experienceWeight * 100).toFixed(0)}% weight)</span>
              <span className="text-blue-700 font-bold">{match.experienceMatch}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-500" 
                style={{ width: `${match.experienceMatch}%` }} 
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-700">DPIIT Statutory Compliance ({(weights.complianceWeight * 100).toFixed(0)}% weight)</span>
              <span className="text-purple-700 font-bold">{match.regulatoryCompliance}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div 
                className="h-full bg-purple-600 rounded-full transition-all duration-500" 
                style={{ width: `${match.regulatoryCompliance}%` }} 
              />
            </div>
          </div>

          {/* Recommendation Banner */}
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
            <span className="font-bold">AI Strategic Assessment: </span>
            {match.recommendation}
          </div>
        </div>

      </div>

      {/* Interactive Evaluation Weight Fine-Tuner */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-700" />
            <h3 className="text-sm font-bold text-slate-900">Interactive Evaluation Weight Tuner</h3>
          </div>
          <button
            onClick={resetWeights}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Reset Defaults
          </button>
        </div>
        <p className="text-xs text-slate-500">
          Adjust the priority of evaluation factors to test how different procurement boards or technical committees evaluate your startup:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Sector Weight</span>
              <span className="font-bold text-slate-900">{(weights.sectorWeight * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.6"
              step="0.05"
              value={weights.sectorWeight}
              onChange={(e) => setWeights({ ...weights, sectorWeight: parseFloat(e.target.value) })}
              className="w-full accent-slate-900 cursor-pointer"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Skills Weight</span>
              <span className="font-bold text-emerald-700">{(weights.skillsWeight * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.6"
              step="0.05"
              value={weights.skillsWeight}
              onChange={(e) => setWeights({ ...weights, skillsWeight: parseFloat(e.target.value) })}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Experience Weight</span>
              <span className="font-bold text-blue-700">{(weights.experienceWeight * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.5"
              step="0.05"
              value={weights.experienceWeight}
              onChange={(e) => setWeights({ ...weights, experienceWeight: parseFloat(e.target.value) })}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Compliance Weight</span>
              <span className="font-bold text-purple-700">{(weights.complianceWeight * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.5"
              step="0.05"
              value={weights.complianceWeight}
              onChange={(e) => setWeights({ ...weights, complianceWeight: parseFloat(e.target.value) })}
              className="w-full accent-purple-600 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Matched Competencies vs Gaps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Matched Competencies */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>Verified Core Competencies ({match.matchedKeywords.length})</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {match.matchedKeywords.length > 0 ? (
              match.matchedKeywords.map((tech, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  ✓ {tech}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500">Cross-domain application</span>
            )}
          </div>
          <div className="pt-2 text-xs text-slate-600 space-y-1">
            {match.strengths.map((s, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gap Analysis & Actionable Mitigations */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>Documented Gaps & Mitigations</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {match.gapKeywords.length > 0 ? (
              match.gapKeywords.map((gap, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                  ! {gap}
                </span>
              ))
            ) : (
              <span className="text-xs text-emerald-700 font-semibold">Zero critical technical gaps detected</span>
            )}
          </div>
          <div className="pt-2 text-xs text-slate-600 space-y-1">
            {match.mitigations.length > 0 ? (
              match.mitigations.map((m, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">→</span>
                  <span>{m}</span>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-500">Your startup profile satisfies all critical technical prerequisites.</div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
