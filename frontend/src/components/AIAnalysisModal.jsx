import React from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  GraduationCap, 
  Clock, 
  FileText,
  TrendingUp,
  BrainCircuit
} from 'lucide-react';

export default function AIAnalysisModal({ application, job, isOpen, onClose, onOpenInterviewAssistant }) {
  if (!isOpen || !application) return null;

  const analysis = application.aiAnalysis || {};
  const overall = analysis.overallMatch || 0;

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (score >= 70) return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30';
    return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  };

  const getProgressColor = (score) => {
    if (score >= 85) return 'from-emerald-500 to-teal-400';
    if (score >= 70) return 'from-indigo-500 to-cyan-400';
    return 'from-amber-500 to-orange-400';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl shadow-indigo-950/50 p-6 md:p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-4">
            <img 
              src={application.candidateAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"} 
              alt={application.candidateName} 
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/40"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">{application.candidateName}</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getScoreColor(overall)}`}>
                  {overall}% Match
                </span>
              </div>
              <p className="text-sm text-slate-400">{application.headline}</p>
              <p className="text-xs text-indigo-400 mt-0.5 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                {application.cvFileName || "Candidate_CV.pdf"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                if (onOpenInterviewAssistant) onOpenInterviewAssistant(application);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition hover:scale-[1.02]"
            >
              <BrainCircuit className="w-4 h-4" />
              <span>AI Interview Questions</span>
            </button>
          </div>
        </div>

        {/* Multidimensional Match Breakdown */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              AI Match Dimension Scores
            </h4>
            <span className="text-xs text-slate-400">Target Role: <strong className="text-slate-200">{job?.title || "Senior Full-Stack"}</strong></span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Skills Match */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-indigo-400" /> Skills</span>
                <span className="font-bold text-white">{analysis.skillsMatch || 0}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${getProgressColor(analysis.skillsMatch || 0)}`}
                  style={{ width: `${analysis.skillsMatch || 0}%` }}
                />
              </div>
            </div>

            {/* Experience Match */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-indigo-400" /> Experience</span>
                <span className="font-bold text-white">{analysis.experienceMatch || 0}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${getProgressColor(analysis.experienceMatch || 0)}`}
                  style={{ width: `${analysis.experienceMatch || 0}%` }}
                />
              </div>
            </div>

            {/* Education Match */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5 text-indigo-400" /> Education</span>
                <span className="font-bold text-white">{analysis.educationMatch || 0}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${getProgressColor(analysis.educationMatch || 0)}`}
                  style={{ width: `${analysis.educationMatch || 0}%` }}
                />
              </div>
            </div>

            {/* Requirements Match */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-indigo-400" /> Requirements</span>
                <span className="font-bold text-white">{analysis.requirementsMatch || 0}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${getProgressColor(analysis.requirementsMatch || 0)}`}
                  style={{ width: `${analysis.requirementsMatch || 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* AI Synthesis & Natural Language Explanation */}
        <div className="mt-6 p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20">
          <div className="flex items-center gap-2 text-indigo-300 font-semibold text-sm mb-1.5">
            <BrainCircuit className="w-4 h-4 text-indigo-400" />
            <span>AI Executive Evaluation</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            {analysis.summaryExplanation || "The candidate has demonstrated hands-on background with the requested core technologies and meets the profile standards."}
          </p>
        </div>

        {/* Strengths & Missing Gaps Breakdown */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Key Strengths */}
          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
            <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-3">
              <CheckCircle2 className="w-4 h-4" />
              Identified Key Strengths
            </h5>
            <ul className="space-y-2">
              {(analysis.strengths && analysis.strengths.length > 0 ? analysis.strengths : [
                "Demonstrates relevant engineering background.",
                "Meets target seniority criteria."
              ]).map((strength, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Missing Gaps */}
          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
            <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-3">
              <AlertTriangle className="w-4 h-4" />
              Potential Gaps & Growth Areas
            </h5>
            <ul className="space-y-2">
              {(analysis.gaps && analysis.gaps.length > 0 ? analysis.gaps : [
                "No critical blocking gaps identified in primary criteria."
              ]).map((gap, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span>{gap}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* CV Skills Cloud */}
        <div className="mt-6 pt-4 border-t border-slate-800">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
            Extracted Candidate Skills from CV
          </h5>
          <div className="flex flex-wrap gap-1.5">
            {(application.cvSkills || []).map((skill, idx) => (
              <span 
                key={idx} 
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                  (job?.requiredSkills || []).map(s => s.toLowerCase()).includes(skill.toLowerCase())
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 font-semibold'
                    : 'bg-slate-800/80 text-slate-400 border-slate-700/60'
                }`}
              >
                {skill}
                {(job?.requiredSkills || []).map(s => s.toLowerCase()).includes(skill.toLowerCase()) && (
                  <span className="ml-1 text-[10px] text-indigo-400">✓</span>
                )}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
