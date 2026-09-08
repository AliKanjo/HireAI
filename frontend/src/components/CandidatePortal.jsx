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
  BrainCircuit,
  User,
  Star,
  Award,
  BookOpen
} from 'lucide-react';

export default function CandidatePortal({ 
  currentUser,
  jobs = [], 
  applications = [], 
  onApplyJob,
  onOpenAIAnalysis
}) {
  const [activeTab, setActiveTab] = useState("explore"); // "explore", "my_applications", "profile"
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [selectedJob, setSelectedJob] = useState(jobs[0] || null);

  const candidateName = currentUser?.name || "Ali Kanjo";

  // Calculate Candidate metrics
  const myApplications = applications;
  const scheduledInterviewsCount = myApplications.filter(a => a.interview || a.status === 'Interview').length;
  const shortlistedCount = myApplications.filter(a => a.status === 'Shortlisted' || a.status === 'Selected').length;

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
      
      {/* Top Welcome Banner & Candidate Role Context */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/80 border border-emerald-500/20 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-2">
              <User className="w-3.5 h-3.5" />
              Candidate Hub • {currentUser?.email || "ali.kanjo@devmail.io"}
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {candidateName} 👋
            </h1>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
              Track your job applications, view AI pre-screening match reports, manage interviews, and discover tailored tech roles.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 self-start lg:self-auto">
            <button
              onClick={() => setActiveTab('explore')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'explore'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Browse & Recommended Jobs ({jobs.length})
            </button>
            <button
              onClick={() => setActiveTab('my_applications')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'my_applications'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              My Applications ({myApplications.length})
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'profile'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              My CV & Profile
            </button>
          </div>
        </div>
      </div>

      {/* Candidate KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl glass-panel border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Submitted Applications</div>
            <div className="text-2xl font-extrabold text-white mt-1">{myApplications.length}</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">Active Job Submissions</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Interviews Scheduled</div>
            <div className="text-2xl font-extrabold text-white mt-1">{scheduledInterviewsCount}</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">Google Meet Invites Ready</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <Video className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Shortlisted Status</div>
            <div className="text-2xl font-extrabold text-white mt-1">{shortlistedCount}</div>
            <div className="text-[10px] text-amber-400 mt-0.5">Top-Tier Candidate Ranking</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <Star className="w-5 h-5" />
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
                placeholder="Search vacancies, technologies (React, Python, Node)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
              />
            </div>

            {/* Recommended Jobs Header */}
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold px-1">
              <span>RECOMMENDED VACANCIES</span>
              <span className="text-emerald-400">AI Matched</span>
            </div>

            {/* Jobs List */}
            <div className="space-y-3 max-h-[720px] overflow-y-auto pr-1">
              {filteredJobs.map((job, index) => {
                // Generate demo match score for candidate feed
                const matchScore = [94, 89, 84, 81][index % 4];

                return (
                  <div
                    key={job.id}
                    onClick={() => setSelectedJob(job)}
                    className={`p-4 rounded-2xl cursor-pointer transition border ${
                      selectedJob?.id === job.id
                        ? 'bg-emerald-950/30 border-emerald-500/80 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500/50'
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
                          <h4 className="font-bold text-sm text-white group-hover:text-emerald-300 transition">
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

                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {matchScore}% Match
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
                      <span>{job.workplaceType}</span>
                    </div>
                  </div>
                );
              })}
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
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/30"
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
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 hover:from-emerald-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Apply with 1-Click AI CV Analysis</span>
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
                    <div className="text-slate-400 text-[10px] uppercase font-bold">Experience Needed</div>
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
                    <Layers className="w-4 h-4 text-emerald-400" />
                    Required Technical Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.requiredSkills.map((s, i) => (
                      <span key={i} className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                        {s}
                      </span>
                    ))}
                    {selectedJob.preferredSkills.map((s, i) => (
                      <span key={i} className="px-3 py-1 rounded-lg bg-slate-800 text-slate-400 border border-slate-700 text-xs font-medium">
                        {s} (Bonus)
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
                    Qualifications & Expectations
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
      ) : activeTab === 'my_applications' ? (
        /* My Applications Tab */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              My Active Applications & Status Tracker
            </h2>
            <span className="text-xs text-slate-400">Total: {myApplications.length} Submissions</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {myApplications.map(app => {
              const job = jobs.find(j => j.id === app.jobId) || { title: "Senior Software Engineer", companyName: "TechNova Dynamics" };
              const { steps, currentIdx } = getStatusStep(app.status);

              return (
                <div key={app.id} className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white">{job.title}</h3>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {app.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Company: <strong className="text-slate-200">{job.companyName}</strong> • Submitted: {app.appliedDate} • Attached CV: {app.cvFileName}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenAIAnalysis(app, job)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 text-xs font-semibold transition"
                      >
                        <BrainCircuit className="w-4 h-4" />
                        <span>View My AI Match Breakdown ({app.aiAnalysis?.overallMatch || 94}%)</span>
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
                              ? 'bg-emerald-600 text-white ring-2 ring-emerald-500/40'
                              : 'bg-slate-800 text-slate-500'
                          }`}>
                            {idx < currentIdx ? '✓' : idx + 1}
                          </div>
                          <span className={`font-semibold ${idx <= currentIdx ? 'text-emerald-300' : 'text-slate-500'}`}>
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
      ) : (
        /* Profile & CV Tab */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
            <div className="text-center">
              <img 
                src={currentUser?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"} 
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover mx-auto ring-4 ring-emerald-500/30 mb-3"
              />
              <h3 className="text-lg font-bold text-white">{candidateName}</h3>
              <p className="text-xs text-emerald-400 font-semibold">Senior Full-Stack & AI Engineer</p>
              <p className="text-xs text-slate-400 mt-1">{currentUser?.email || "ali.kanjo@devmail.io"}</p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Location</span>
                <span className="text-slate-200 font-semibold">San Francisco, CA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Experience</span>
                <span className="text-slate-200 font-semibold">5.5 Years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Highest Education</span>
                <span className="text-slate-200 font-semibold">M.S. Computer Science</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 p-6 rounded-3xl glass-panel border border-slate-800 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-emerald-400" />
                Parsed Technical Skills & Proficiency
              </h3>
              <div className="flex flex-wrap gap-2">
                {["React", "Node.js", "Python", "FastAPI", "PostgreSQL", "Docker", "AWS", "TypeScript", "TailwindCSS", "Vector DB (FAISS)"].map((s, i) => (
                  <span key={i} className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-emerald-300">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                Primary Resume / CV Document
              </h3>
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-xs">
                    PDF
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Ali_Kanjo_Senior_FullStack_AI_Resume.pdf</div>
                    <div className="text-[11px] text-slate-400">Parsed 2 hours ago • 8 Core Skills Extracted</div>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                  Active CV
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
