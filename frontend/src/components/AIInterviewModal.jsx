import React, { useState } from 'react';
import { 
  X, 
  BrainCircuit, 
  Sparkles, 
  Copy, 
  Check, 
  HelpCircle, 
  Target, 
  Calendar,
  Layers,
  Lightbulb
} from 'lucide-react';

export default function AIInterviewModal({ application, job, isOpen, onClose, onScheduleInterview }) {
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [copiedAll, setCopiedAll] = useState(false);

  if (!isOpen || !application) return null;

  const questions = application.aiAnalysis?.generatedQuestions || [
    {
      category: "Technical Architecture",
      question: `Given your experience with ${application.cvSkills?.[0] || 'core technologies'}, how would you design a scalable microservice for this ${job?.title || 'engineering'} position?`,
      evalFocus: "Assesses component boundaries, state flow, and fault tolerance."
    },
    {
      category: "System Design & Optimization",
      question: "Describe your strategy for profiling database bottlenecks and caching high-frequency queries under heavy concurrency.",
      evalFocus: "Evaluates SQL indexing awareness, redis caching patterns, and query plans."
    },
    {
      category: "Behavioral & Problem Solving",
      question: "Share a recent technical dilemma where you had to compromise between engineering perfection and immediate business delivery speed.",
      evalFocus: "Evaluates pragmatic trade-offs, team communication, and ownership."
    }
  ];

  const handleCopySingle = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleCopyAll = () => {
    const fullText = questions.map((q, i) => `Q${i + 1} [${q.category}]:\n${q.question}\n(Evaluation Focus: ${q.evalFocus})\n`).join('\n');
    navigator.clipboard.writeText(fullText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
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
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">AI Interview Assistant</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
                  Tailored Prompt
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Candidate: <strong className="text-slate-200">{application.candidateName}</strong> • Vacancy: <strong className="text-slate-200">{job?.title || "Senior Engineer"}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyAll}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
            >
              {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedAll ? 'Copied All' : 'Copy All Questions'}</span>
            </button>

            <button
              onClick={() => {
                onClose();
                if (onScheduleInterview) onScheduleInterview(application);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/30 transition hover:scale-[1.02]"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Schedule Interview</span>
            </button>
          </div>
        </div>

        {/* AI Context Banner */}
        <div className="mt-5 p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/20 flex items-start gap-2.5 text-xs text-indigo-200">
          <Lightbulb className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <span>
            These questions were dynamically generated by cross-referencing candidate's CV experience ({application.cvFileName || "CV.pdf"}) against the required competencies for <strong>{job?.title}</strong>.
          </span>
        </div>

        {/* Questions List */}
        <div className="mt-6 space-y-4">
          {questions.map((item, idx) => (
            <div 
              key={idx} 
              className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/30 transition relative group"
            >
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-300 font-bold text-xs flex items-center justify-center border border-indigo-500/30">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                    {item.category}
                  </span>
                </div>

                <button
                  onClick={() => handleCopySingle(item.question, idx)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                  title="Copy Question"
                >
                  {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Question Text */}
              <p className="text-sm font-medium text-slate-100 leading-relaxed">
                "{item.question}"
              </p>

              {/* Evaluation Rubric / Target Focus */}
              {item.evalFocus && (
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-start gap-2 text-xs text-slate-400">
                  <Target className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                  <span><strong className="text-slate-300">Interviewer Evaluation Focus:</strong> {item.evalFocus}</span>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
