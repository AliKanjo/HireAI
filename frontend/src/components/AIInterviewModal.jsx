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
  Lightbulb,
  MessageSquare,
  Award,
  RefreshCw,
  Send,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { generateQuestionsAPI, evaluateAnswerAPI } from '../services/aiMatcher';

export default function AIInterviewModal({ application, job, isOpen, onClose, onScheduleInterview }) {
  const [activeTab, setActiveTab] = useState("questions"); // questions | evaluator
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState(
    application?.aiAnalysis?.generatedQuestions || [
      {
        id: 1,
        category: "Technical Architecture",
        question: `Given your experience with ${application?.cvSkills?.[0] || 'core technologies'}, how would you design a scalable microservice for this ${job?.title || 'engineering'} position?`,
        evalFocus: "Assesses component boundaries, state flow, and fault tolerance."
      },
      {
        id: 2,
        category: "System Design & Optimization",
        question: "Describe your strategy for profiling database bottlenecks and caching high-frequency queries under heavy concurrency.",
        evalFocus: "Evaluates SQL indexing awareness, redis caching patterns, and query plans."
      },
      {
        id: 3,
        category: "Behavioral & Problem Solving",
        question: "Share a recent technical dilemma where you had to compromise between engineering perfection and immediate business delivery speed.",
        evalFocus: "Evaluates pragmatic trade-offs, team communication, and ownership."
      }
    ]
  );

  // Evaluator State
  const [selectedQuestion, setSelectedQuestion] = useState(questions[0]?.question || "");
  const [candidateAnswer, setCandidateAnswer] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);

  if (!isOpen || !application) return null;

  const handleRegenerateQuestions = async () => {
    setIsGenerating(true);
    try {
      const qList = await generateQuestionsAPI(
        { skills: application.cvSkills, missing_skills: application.aiAnalysis?.missingSkills },
        { title: job?.title || "Engineering Role" }
      );
      if (qList && qList.length > 0) setQuestions(qList);
    } catch (err) {
      console.error("Regenerate questions failed:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEvaluateAnswer = async (e) => {
    e.preventDefault();
    if (!candidateAnswer.trim()) return;

    setIsEvaluating(true);
    try {
      const res = await evaluateAnswerAPI(selectedQuestion, candidateAnswer);
      setEvaluationResult(res);
    } catch (err) {
      console.error("Evaluation failed:", err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleCopySingle = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleCopyAll = () => {
    const fullText = questions.map((q, i) => `Q${i + 1} [${q.category}]:\n${q.question}\n(Evaluation Focus: ${q.eval_focus || q.evalFocus})\n`).join('\n');
    navigator.clipboard.writeText(fullText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">AI Interview & Evaluation Suite</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
                  Phase 4 Core
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Candidate: <strong className="text-slate-200">{application.candidateName}</strong> • Vacancy: <strong className="text-indigo-300">{job?.title || "Senior Engineer"}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
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

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 my-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("questions")}
            className={`px-4 py-2.5 flex items-center gap-2 border-b-2 transition ${
              activeTab === "questions"
                ? "border-indigo-500 text-indigo-400 font-bold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            Tailored Questions Generator ({questions.length})
          </button>
          <button
            onClick={() => setActiveTab("evaluator")}
            className={`px-4 py-2.5 flex items-center gap-2 border-b-2 transition ${
              activeTab === "evaluator"
                ? "border-purple-500 text-purple-400 font-bold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Award className="w-4 h-4" />
            AI Candidate Answer Evaluator (1-10 Score)
          </button>
        </div>

        {/* TAB 1: TAILORED QUESTIONS */}
        {activeTab === "questions" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Questions customized specifically to <strong className="text-slate-200">{application.candidateName}</strong>'s CV skills & gap areas:
              </span>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRegenerateQuestions}
                  disabled={isGenerating}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30 text-xs font-medium transition disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>{isGenerating ? 'Regenerating...' : 'Regenerate'}</span>
                </button>

                <button
                  onClick={handleCopyAll}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
                >
                  {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAll ? 'Copied All' : 'Copy All'}</span>
                </button>
              </div>
            </div>

            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
              {questions.map((q, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/40 transition flex flex-col justify-between gap-3 group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-bold text-[10px] border border-indigo-500/30">
                        {q.category}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopySingle(q.question, idx)}
                      className="p-1 rounded-lg bg-slate-800 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-white transition"
                      title="Copy Question"
                    >
                      {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <p className="text-xs font-semibold text-slate-100 leading-relaxed">
                    "{q.question}"
                  </p>

                  <div className="text-[10px] text-slate-400 flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-xl border border-slate-800">
                    <Target className="w-3 h-3 text-indigo-400 shrink-0" />
                    <span>Evaluation Focus: <strong className="text-slate-300 font-normal">{q.eval_focus || q.evalFocus}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: AI ANSWER EVALUATOR */}
        {activeTab === "evaluator" && (
          <div className="space-y-5">
            <form onSubmit={handleEvaluateAnswer} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Select Question to Evaluate:
                </label>
                <select
                  value={selectedQuestion}
                  onChange={(e) => setSelectedQuestion(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                >
                  {questions.map((q, idx) => (
                    <option key={idx} value={q.question}>
                      [{q.category}] {q.question.slice(0, 80)}...
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Enter Candidate's Verbal/Written Response:
                </label>
                <textarea
                  rows={4}
                  placeholder="Paste or type candidate's response during interview..."
                  value={candidateAnswer}
                  onChange={(e) => setCandidateAnswer(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="submit"
                  disabled={isEvaluating || !candidateAnswer.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 transition disabled:opacity-50"
                >
                  <BrainCircuit className={`w-4 h-4 ${isEvaluating ? 'animate-spin' : ''}`} />
                  <span>{isEvaluating ? 'Evaluating Response...' : 'Evaluate Answer'}</span>
                </button>
              </div>
            </form>

            {/* Evaluation Result Output */}
            {evaluationResult && (
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-purple-500/40 space-y-4 animate-fadeIn">
                
                {/* Score Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/40 flex flex-col items-center justify-center">
                      <span className="text-lg font-black text-purple-400">{evaluationResult.overallScore}</span>
                      <span className="text-[9px] text-purple-300 font-bold uppercase">/ 10</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">AI Response Evaluation</h4>
                      <p className="text-xs text-purple-300 font-medium">{evaluationResult.recruiterRecommendation}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-center text-xs">
                    <div>
                      <div className="font-bold text-white">{evaluationResult.technicalAccuracy}%</div>
                      <div className="text-[10px] text-slate-400">Accuracy</div>
                    </div>
                    <div>
                      <div className="font-bold text-white">{evaluationResult.relevance}%</div>
                      <div className="text-[10px] text-slate-400">Relevance</div>
                    </div>
                    <div>
                      <div className="font-bold text-white">{evaluationResult.completeness}%</div>
                      <div className="text-[10px] text-slate-400">Completeness</div>
                    </div>
                  </div>
                </div>

                {/* Strengths and Gaps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-emerald-500/30">
                    <div className="font-bold text-emerald-400 mb-1.5 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Answer Strengths
                    </div>
                    <ul className="space-y-1 text-slate-300 text-[11px]">
                      {evaluationResult.strengths?.map((s, i) => (
                        <li key={i}>• {s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-amber-500/30">
                    <div className="font-bold text-amber-400 mb-1.5 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" /> Areas for Improvement
                    </div>
                    <ul className="space-y-1 text-slate-300 text-[11px]">
                      {evaluationResult.areasForImprovement?.map((a, i) => (
                        <li key={i}>• {a}</li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
