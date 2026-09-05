import React, { useState } from 'react';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  Search, 
  Filter, 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  Calendar, 
  Video, 
  Send,
  Layers,
  ChevronRight,
  TrendingUp,
  BrainCircuit
} from 'lucide-react';

export default function CandidatePortal({ 
  jobs, 
  applications, 
  onApplyJob,
  onOpenAIAnalysis
}) {
  const [activeTab, setActiveTab] = useState("explore"); // "explore", "my_applications"
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [selectedJob, setSelectedJob] = useState(jobs[0]);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.requiredSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDept = deptFilter === 'all' || job.department.toLowerCase().includes(deptFilter.toLowerCase());
    return matchesSearch && matchesDept;
  });

  const getStatusStep = (status) => {
    const steps = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected'];
    const currentIdx = steps.indexOf(status);
    return { steps, currentIdx: currentIdx !== -1 ? currentIdx : 0 };
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner & Tab Navigation */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border border-indigo-500/20 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              AI CV Pre-Screening Enabled
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Discover High-Impact Tech Vacancies
            </h1>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
              Upload your CV to let HireAI automatically extract your skills, calculate match scores, and highlight your strengths to top recruiters.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/70 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('explore')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'explore'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Browse Jobs ({jobs.length})
            </button>
            <button
              onClick={() => setActiveTab('my_applications')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'my_applications'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              My Applications ({applications.length})
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'explore' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Job Feed & Filters */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Search Bar */}
            <div className="p-3 rounded-2xl glass-panel border border-slate-800 flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400 ml-1" />
              <input 
                type="text" 
                placeholder="Search jobs, tech skills (React, Java, Python)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
              />
            </div>

            {/* Jobs List */}
            <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
              {filteredJobs.map(job => (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className={`p-4 rounded-2xl cursor-pointer transition border ${
                    selectedJob?.id === job.id
                      ? 'bg-indigo-950/40 border-indigo-500/80 shadow-lg shadow-indigo-950/40 ring-1 ring-indigo-500/50'
                      : 'glass-card hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      <img 
                        src={job.companyLogo} 
                        alt={job.companyName}
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-800"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-white group-hover:text-indigo-300 transition">
                          {job.title}
                        </h4>
                        <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3 text-indigo-400" />
                          <span>{job.companyName}</span>
                          <span className="text-slate-600">•</span>
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{job.location}</span>
                        </div>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {job.workplaceType}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {job.requiredSkills.slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">
                        {skill}
                      </span>
                    ))}
                    {job.requiredSkills.length > 3 && (
                      <span className="text-[10px] text-slate-400 self-center">
                        +{job.requiredSkills.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-400">
                    <span className="font-semibold text-emerald-400">
                      ${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax / 1000).toFixed(0)}k / yr
                    </span>
                    <span>{job.jobType}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Right Column: Selected Job Full Details & Apply CTA */}
          <div className="lg:col-span-7">
            {selectedJob ? (
              <div className="p-6 md:p-8 rounded-3xl glass-panel border border-slate-800 space-y-6">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                  <div className="flex items-center gap-4">
                    <img 
                      src={selectedJob.companyLogo} 
                      alt={selectedJob.companyName}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/30"
                    />
                    <div>
                      <h2 className="text-xl font-extrabold text-white">{selectedJob.title}</h2>
                      <p className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                        <span className="text-indigo-300 font-semibold">{selectedJob.companyName}</span>
                        <span>•</span>
                        <span>{selectedJob.department}</span>
                        <span>•</span>
                        <span>{selectedJob.location} ({selectedJob.workplaceType})</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onApplyJob(selectedJob)}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Apply with AI CV Analysis</span>
                  </button>
                </div>

                {/* Key Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="text-slate-400 text-[10px] uppercase font-bold">Salary Range</div>
                    <div className="font-bold text-emerald-400 mt-0.5">
                      ${(selectedJob.salaryMin / 1000).toFixed(0)}k - ${(selectedJob.salaryMax / 1000).toFixed(0)}k
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="text-slate-400 text-[10px] uppercase font-bold">Experience</div>
                    <div className="font-bold text-white mt-0.5">{selectedJob.minYearsExp}+ Years ({selectedJob.experienceLevel})</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="text-slate-400 text-[10px] uppercase font-bold">Workplace</div>
                    <div className="font-bold text-white mt-0.5">{selectedJob.workplaceType}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="text-slate-400 text-[10px] uppercase font-bold">Education</div>
                    <div className="font-bold text-white mt-0.5">{selectedJob.minEducation || "Bachelor Degree"}</div>
                  </div>
                </div>

                {/* Required Skills Cloud */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    Required Technical Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.requiredSkills.map((s, i) => (
                      <span key={i} className="px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
                        {s}
                      </span>
                    ))}
                    {selectedJob.preferredSkills.map((s, i) => (
                      <span key={i} className="px-3 py-1 rounded-lg bg-slate-800 text-slate-400 border border-slate-700 text-xs font-medium">
                        {s} (Preferred)
                      </span>
                    ))}
                  </div>
                </div>

                {/* Job Description */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Role Description
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-slate-800">
                    {selectedJob.description}
                  </p>
                </div>

                {/* Requirements */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Key Qualifications & Expectations
                  </h4>
                  <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line bg-slate-950/40 p-4 rounded-xl border border-slate-800">
                    {selectedJob.requirements}
                  </div>
                </div>

              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 rounded-3xl glass-panel border border-slate-800">
                Select a vacancy from the feed to review specifications.
              </div>
            )}
          </div>

        </div>
      ) : (
        /* My Applications Tab */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              My Active Applications & Status Tracker
            </h2>
            <span className="text-xs text-slate-400">Total: {applications.length} Submissions</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {applications.map(app => {
              const job = jobs.find(j => j.id === app.jobId) || { title: "Software Engineer", companyName: "TechNova Dynamics" };
              const { steps, currentIdx } = getStatusStep(app.status);

              return (
                <div key={app.id} className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white">{job.title}</h3>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {app.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Company: <strong className="text-slate-200">{job.companyName}</strong> • Submitted: {app.appliedDate} • CV: {app.cvFileName}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenAIAnalysis(app, job)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-semibold transition"
                      >
                        <BrainCircuit className="w-4 h-4" />
                        <span>View AI Match Breakdown ({app.aiAnalysis?.overallMatch || 0}%)</span>
                      </button>
                    </div>
                  </div>

                  {/* Application Funnel Progress Tracker */}
                  <div className="pt-2">
                    <div className="grid grid-cols-5 gap-2 text-center text-[10px]">
                      {steps.map((step, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs mb-1 transition ${
                            idx <= currentIdx 
                              ? 'bg-indigo-600 text-white ring-2 ring-indigo-500/40'
                              : 'bg-slate-800 text-slate-500'
                          }`}>
                            {idx < currentIdx ? '✓' : idx + 1}
                          </div>
                          <span className={`font-semibold ${idx <= currentIdx ? 'text-indigo-300' : 'text-slate-500'}`}>
                            {step}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Interview Alert Banner if scheduled */}
                  {app.interview && (
                    <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 text-emerald-300">
                        <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>
                          <strong>Interview Scheduled:</strong> {app.interview.scheduledAt} ({app.interview.duration}) with {app.interview.interviewer}
                        </span>
                      </div>
                      <a 
                        href={app.interview.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold text-[11px] hover:bg-emerald-500 transition"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Join Meeting</span>
                      </a>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
