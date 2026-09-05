import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  BrainCircuit, 
  ArrowRight,
  Send
} from 'lucide-react';
import { SAMPLE_CV_TEMPLATES } from '../data/mockData';
import { parseCVText, computeAIMatch } from '../services/aiMatcher';

export default function ApplyModal({ job, isOpen, onClose, onApplySuccess }) {
  const [selectedTemplate, setSelectedTemplate] = useState(SAMPLE_CV_TEMPLATES[0]);
  const [customCVText, setCustomCVText] = useState(SAMPLE_CV_TEMPLATES[0].text);
  const [customFileName, setCustomFileName] = useState(SAMPLE_CV_TEMPLATES[0].filename);
  const [candidateName, setCandidateName] = useState("Sarah Chen");
  const [candidateEmail, setCandidateEmail] = useState("sarah.chen@devmail.io");
  const [coverLetter, setCoverLetter] = useState("I am excited to apply for this role. My experience aligns closely with your tech stack.");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [instantAnalysis, setInstantAnalysis] = useState(null);

  if (!isOpen || !job) return null;

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setCustomCVText(template.text);
    setCustomFileName(template.filename);

    const parsed = parseCVText(template.text);
    setCandidateName(parsed.name || "Candidate");
    setCandidateEmail(parsed.email || "candidate@devmail.io");
    setInstantAnalysis(null);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCustomFileName(file.name);
      // Read file text
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result || "";
        setCustomCVText(text);
        const parsed = parseCVText(text);
        if (parsed.name) setCandidateName(parsed.name);
        if (parsed.email) setCandidateEmail(parsed.email);
        setInstantAnalysis(null);
      };
      reader.readAsText(file);
    }
  };

  const handleRunInstantAIAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const parsed = parseCVText(customCVText);
      const match = computeAIMatch(parsed, job);
      setInstantAnalysis({ parsed, match });
      setIsAnalyzing(false);
    }, 600);
  };

  const handleSubmitApplication = (e) => {
    e.preventDefault();
    const parsed = parseCVText(customCVText);
    const match = instantAnalysis?.match || computeAIMatch(parsed, job);

    onApplySuccess({
      jobId: job.id,
      candidateName,
      candidateEmail,
      candidateAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
      headline: `${parsed.yearsOfExperience || 3} Yrs Exp • ${parsed.skills?.slice(0, 3).join(', ') || 'Software Engineer'}`,
      location: "San Francisco, CA (Candidate)",
      appliedDate: new Date().toISOString().split('T')[0],
      status: match.overallMatch >= 80 ? "Under Review" : "Applied",
      cvFileName: customFileName,
      cvSkills: parsed.skills || [],
      cvExperienceYears: parsed.yearsOfExperience || 3,
      cvEducation: parsed.education || "Bachelor Degree",
      coverLetter,
      aiAnalysis: match
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl shadow-indigo-950/50 p-6 md:p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6 border-b border-slate-800 pb-4">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Apply with AI CV Analysis</h3>
            <p className="text-xs text-slate-400">
              Applying for: <strong className="text-indigo-300">{job.title}</strong> at {job.companyName}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmitApplication} className="space-y-5 text-xs">
          
          {/* Quick Select Preset Resumes */}
          <div>
            <label className="block text-slate-300 font-semibold mb-2">
              Select a Preset Sample CV or Upload Your Own:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
              {SAMPLE_CV_TEMPLATES.map((tpl, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleSelectTemplate(tpl)}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    selectedTemplate?.filename === tpl.filename
                      ? 'bg-indigo-600/20 border-indigo-500 text-white font-semibold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="text-[11px] font-bold text-indigo-300 truncate">{tpl.name}</div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">{tpl.filename}</div>
                </button>
              ))}
            </div>

            {/* Custom Upload Box */}
            <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-4 text-center bg-slate-950/40 transition">
              <input 
                type="file" 
                id="cv-upload-input"
                accept=".pdf,.txt,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label htmlFor="cv-upload-input" className="cursor-pointer flex flex-col items-center justify-center gap-1.5">
                <UploadCloud className="w-6 h-6 text-indigo-400" />
                <span className="text-xs font-semibold text-slate-200">
                  {customFileName ? `Selected: ${customFileName}` : "Click to upload CV (PDF / TXT)"}
                </span>
                <span className="text-[10px] text-slate-400">Automatic AI text extraction will run instantly</span>
              </label>
            </div>
          </div>

          {/* Candidate Info */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
              <input 
                type="text" 
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
              <input 
                type="email" 
                value={candidateEmail}
                onChange={(e) => setCandidateEmail(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Live AI Analysis Preview Box */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/40 via-slate-950 to-slate-900 border border-indigo-500/30">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">
                  Live AI Pre-Screening Engine
                </span>
              </div>

              <button
                type="button"
                onClick={handleRunInstantAIAnalysis}
                disabled={isAnalyzing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAnalyzing ? "Analyzing CV..." : "Test AI Match Score"}</span>
              </button>
            </div>

            {instantAnalysis ? (
              <div className="space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  <div>
                    <div className="text-xs text-slate-400">Estimated Match with Vacancy:</div>
                    <div className="text-lg font-extrabold text-indigo-300">
                      {instantAnalysis.match.overallMatch}% Overall Compatibility
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 font-bold text-xs border border-indigo-500/30">
                      Skills: {instantAnalysis.match.skillsMatch}%
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30">
                      Exp: {instantAnalysis.match.experienceMatch}%
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 italic bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60">
                  "{instantAnalysis.match.summaryExplanation}"
                </p>

                <div className="flex flex-wrap gap-1">
                  {(instantAnalysis.parsed.skills || []).map((s, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-slate-400">
                Click <strong>"Test AI Match Score"</strong> to see how this CV evaluates against the requirements of <strong>{job.title}</strong> before applying.
              </p>
            )}
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Cover Note (Optional)</label>
            <textarea 
              rows={2}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold shadow-lg shadow-indigo-600/30 transition hover:scale-[1.02]"
            >
              <Send className="w-4 h-4" />
              <span>Submit Job Application</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
