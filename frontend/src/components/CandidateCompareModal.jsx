import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  ArrowRightLeft, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  GraduationCap, 
  Clock, 
  TrendingUp,
  BrainCircuit
} from 'lucide-react';

export default function CandidateCompareModal({ applications, job, isOpen, onClose }) {
  const [candAId, setCandAId] = useState(applications[0]?.id || 101);
  const [candBId, setCandBId] = useState(applications[1]?.id || 102);

  if (!isOpen || applications.length < 2) return null;

  const candA = applications.find(a => a.id === Number(candAId)) || applications[0];
  const candB = applications.find(a => a.id === Number(candBId)) || applications[1];

  const anaA = candA.aiAnalysis || {};
  const anaB = candB.aiAnalysis || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl shadow-indigo-950/60 p-6 md:p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6 border-b border-slate-800 pb-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white">Side-by-Side Candidate Comparison</h3>
            <p className="text-xs text-slate-400">Comparing candidates for role: <strong className="text-indigo-300">{job?.title || "Senior Full-Stack"}</strong></p>
          </div>
        </div>

        {/* Selectors */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-indigo-500/40">
            <label className="block text-[11px] text-indigo-400 font-bold uppercase mb-1">Candidate 1</label>
            <select
              value={candAId}
              onChange={(e) => setCandAId(e.target.value)}
              className="w-full bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-semibold text-white focus:outline-none"
            >
              {applications.map(app => (
                <option key={app.id} value={app.id}>
                  {app.candidateName} ({app.aiAnalysis?.overallMatch || 0}% Match)
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/80 border border-purple-500/40">
            <label className="block text-[11px] text-purple-400 font-bold uppercase mb-1">Candidate 2</label>
            <select
              value={candBId}
              onChange={(e) => setCandBId(e.target.value)}
              className="w-full bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-semibold text-white focus:outline-none"
            >
              {applications.map(app => (
                <option key={app.id} value={app.id}>
                  {app.candidateName} ({app.aiAnalysis?.overallMatch || 0}% Match)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="space-y-4 text-xs">
          
          {/* Top Score Comparison */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-slate-950 border border-indigo-500/30 text-center">
              <div className="text-xs text-slate-400 font-medium">{candA.candidateName}</div>
              <div className="text-3xl font-extrabold text-indigo-400 my-1">{anaA.overallMatch || 0}%</div>
              <div className="text-[10px] text-slate-400 font-semibold">{candA.headline}</div>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/40 to-slate-950 border border-purple-500/30 text-center">
              <div className="text-xs text-slate-400 font-medium">{candB.candidateName}</div>
              <div className="text-3xl font-extrabold text-purple-400 my-1">{anaB.overallMatch || 0}%</div>
              <div className="text-[10px] text-slate-400 font-semibold">{candB.headline}</div>
            </div>
          </div>

          {/* Metric Comparison Rows */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            
            {/* Skills */}
            <div>
              <div className="flex justify-between text-slate-400 text-[11px] mb-1">
                <span>{anaA.skillsMatch || 0}%</span>
                <span className="font-bold text-white flex items-center gap-1"><Layers className="w-3 h-3 text-indigo-400" /> Skills Match</span>
                <span>{anaB.skillsMatch || 0}%</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-indigo-500 h-full" style={{ width: `${anaA.skillsMatch || 0}%` }} />
                </div>
                <div className="bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-purple-500 h-full" style={{ width: `${anaB.skillsMatch || 0}%` }} />
                </div>
              </div>
            </div>

            {/* Experience */}
            <div>
              <div className="flex justify-between text-slate-400 text-[11px] mb-1">
                <span>{candA.cvExperienceYears} yrs ({anaA.experienceMatch || 0}%)</span>
                <span className="font-bold text-white flex items-center gap-1"><Clock className="w-3 h-3 text-indigo-400" /> Experience</span>
                <span>{candB.cvExperienceYears} yrs ({anaB.experienceMatch || 0}%)</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-indigo-500 h-full" style={{ width: `${anaA.experienceMatch || 0}%` }} />
                </div>
                <div className="bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-purple-500 h-full" style={{ width: `${anaB.experienceMatch || 0}%` }} />
                </div>
              </div>
            </div>

            {/* Education */}
            <div>
              <div className="flex justify-between text-slate-400 text-[11px] mb-1">
                <span>{anaA.educationMatch || 0}%</span>
                <span className="font-bold text-white flex items-center gap-1"><GraduationCap className="w-3 h-3 text-indigo-400" /> Education</span>
                <span>{anaB.educationMatch || 0}%</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-indigo-500 h-full" style={{ width: `${anaA.educationMatch || 0}%` }} />
                </div>
                <div className="bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-purple-500 h-full" style={{ width: `${anaB.educationMatch || 0}%` }} />
                </div>
              </div>
            </div>

          </div>

          {/* Strengths & Gaps Side-by-Side */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Candidate A Insights */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-indigo-500/20 space-y-2">
              <div className="font-bold text-indigo-300 text-xs">{candA.candidateName} Fit Summary</div>
              <p className="text-[11px] text-slate-300 italic">{anaA.summaryExplanation}</p>
              <div className="pt-2">
                <div className="text-[10px] font-bold uppercase text-emerald-400 mb-1">Key Strengths</div>
                {(anaA.strengths || []).map((s, i) => (
                  <div key={i} className="text-[10px] text-slate-300 flex items-start gap-1 mb-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Candidate B Insights */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-purple-500/20 space-y-2">
              <div className="font-bold text-purple-300 text-xs">{candB.candidateName} Fit Summary</div>
              <p className="text-[11px] text-slate-300 italic">{anaB.summaryExplanation}</p>
              <div className="pt-2">
                <div className="text-[10px] font-bold uppercase text-emerald-400 mb-1">Key Strengths</div>
                {(anaB.strengths || []).map((s, i) => (
                  <div key={i} className="text-[10px] text-slate-300 flex items-start gap-1 mb-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
