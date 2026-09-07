import React, { useState } from 'react';
import { 
  Briefcase, 
  Users, 
  UserCheck, 
  Calendar, 
  Award, 
  Sparkles, 
  Search, 
  Filter, 
  ArrowUpDown, 
  BrainCircuit, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  MoreVertical,
  ChevronRight,
  ExternalLink,
  Plus
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export default function RecruiterDashboard({ 
  jobs, 
  applications, 
  selectedJobId, 
  setSelectedJobId,
  onOpenAIAnalysis,
  onOpenAIInterview,
  onOpenScheduleInterview,
  onOpenCompare,
  onUpdateStatus,
  onOpenCreateJob
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("match_desc"); // match_desc, match_asc, name

  // Filter and sort candidates
  const currentJob = jobs.find(j => j.id === Number(selectedJobId)) || jobs[0];
  const jobApplications = applications.filter(a => a.jobId === currentJob?.id);

  const filteredApplications = jobApplications.filter(app => {
    const matchesSearch = app.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.cvSkills?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || app.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'match_desc') return (b.aiAnalysis?.overallMatch || 0) - (a.aiAnalysis?.overallMatch || 0);
    if (sortBy === 'match_asc') return (a.aiAnalysis?.overallMatch || 0) - (b.aiAnalysis?.overallMatch || 0);
    return a.candidateName.localeCompare(b.candidateName);
  });

  // Calculate Metrics
  const totalApps = applications.length;
  const shortlistedCount = applications.filter(a => a.status === 'Shortlisted').length;
  const interviewCount = applications.filter(a => a.status === 'Interview' || a.interview).length;
  const hiredCount = applications.filter(a => a.status === 'Selected').length;

  // Chart Data
  const funnelData = [
    { name: 'Applied', count: totalApps, fill: '#6366f1' },
    { name: 'Under Review', count: applications.filter(a => a.status === 'Under Review').length, fill: '#8b5cf6' },
    { name: 'Shortlisted', count: shortlistedCount, fill: '#3b82f6' },
    { name: 'Interview', count: interviewCount, fill: '#10b981' },
    { name: 'Selected', count: hiredCount, fill: '#14b8a6' },
  ];

  const matchDistributionData = [
    { name: '90-100% Match', count: applications.filter(a => (a.aiAnalysis?.overallMatch || 0) >= 90).length, color: '#10b981' },
    { name: '80-89% Match', count: applications.filter(a => (a.aiAnalysis?.overallMatch || 0) >= 80 && (a.aiAnalysis?.overallMatch || 0) < 90).length, color: '#6366f1' },
    { name: '70-79% Match', count: applications.filter(a => (a.aiAnalysis?.overallMatch || 0) >= 70 && (a.aiAnalysis?.overallMatch || 0) < 80).length, color: '#f59e0b' },
    { name: '< 70% Match', count: applications.filter(a => (a.aiAnalysis?.overallMatch || 0) < 70).length, color: '#ef4444' },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Shortlisted':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'Under Review':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      case 'Interview':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'Selected':
        return 'bg-teal-500/20 text-teal-300 border-teal-500/30 font-bold';
      case 'Rejected':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getMatchScoreBadge = (score = 0) => {
    if (score >= 85) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 font-bold';
    if (score >= 70) return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 font-semibold';
    return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* KPI Top Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="p-4 rounded-2xl glass-card border border-slate-800 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{jobs.length}</div>
            <div className="text-xs text-slate-400">Active Jobs</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-800 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{totalApps}</div>
            <div className="text-xs text-slate-400">Total Applications</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-800 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{shortlistedCount}</div>
            <div className="text-xs text-slate-400">AI Shortlisted</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-800 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{interviewCount}</div>
            <div className="text-xs text-slate-400">Interviews</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-800 flex items-center gap-3.5 col-span-2 lg:col-span-1">
          <div className="w-11 h-11 rounded-xl bg-teal-600/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{hiredCount}</div>
            <div className="text-xs text-slate-400">Hired Offers</div>
          </div>
        </div>

      </div>

      {/* AI Executive Recruitment Insights Panel */}
      <div className="p-5 rounded-2xl glass-panel border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-900 shadow-xl">
        <div className="flex items-center gap-2.5 text-indigo-300 font-extrabold text-sm mb-3">
          <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
          <h3 className="uppercase tracking-wider">AI Executive Recruitment Insights</h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold ml-auto">
            Phase 5 Intelligence Engine
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          {/* Executive Bullet Points */}
          <div className="space-y-2 text-slate-200">
            <div className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
              <span>Your <strong className="text-white font-bold">Senior Full-Stack Engineer</strong> position has the highest average candidate match score: <strong className="text-emerald-400">86%</strong>.</span>
            </div>
            <div className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
              <span><strong className="text-amber-300 font-bold">Docker & AWS</strong> are the most frequently missing required skills across backend applicants.</span>
            </div>
            <div className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0" />
              <span>The largest recruitment bottleneck occurs between <strong className="text-purple-300">Under Review</strong> and <strong className="text-indigo-300">Interview</strong>.</span>
            </div>
            <div className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
              <span>Candidates with <strong className="text-cyan-300 font-bold">3+ years of experience</strong> achieve a <strong className="text-emerald-400">+21% higher</strong> average AI match score.</span>
            </div>
          </div>

          {/* Skill Gap Analysis Widget */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
              <span>Skill Gap & Market Shortage Analysis</span>
              <span className="text-[10px] text-amber-400 font-semibold">Shortage Alert</span>
            </h4>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-300">Docker (Required by 67% jobs)</span>
                  <span className="text-amber-400 font-bold">Only 24% candidates</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-500 to-rose-400 h-full w-[24%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-300">AWS / Cloud Primitives</span>
                  <span className="text-amber-400 font-bold">31% candidates</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-500 to-indigo-400 h-full w-[31%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-300">Spring Boot / Microservices</span>
                  <span className="text-emerald-400 font-bold">78% candidates</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full w-[78%]" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Analytics Charts & Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recruitment Funnel Bar Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl glass-panel border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recruitment Pipeline Funnel</h3>
              <p className="text-xs text-slate-400">Volume distribution across recruitment pipeline stages</p>
            </div>
            <span className="text-xs text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
              Live Real-Time
            </span>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#818cf8' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Match Distribution Donut */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI Candidate Match Spread</h3>
            <p className="text-xs text-slate-400">Scoring breakdown of incoming CVs</p>
          </div>

          <div className="h-40 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={matchDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={60}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {matchDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            {matchDistributionData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name}: <strong className="text-white">{item.count}</strong></span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Active Job Selection Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-indigo-400" />
              AI Candidate Ranking & Evaluation
            </h2>
            <p className="text-xs text-slate-400">Select a job vacancy to inspect applicants ranked by AI Match %</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCompare}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-semibold border border-indigo-500/30 transition"
            >
              <ArrowUpDown className="w-4 h-4" />
              <span>Compare Candidates</span>
            </button>
            <button
              onClick={onOpenCreateJob}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              <Plus className="w-4 h-4 text-indigo-400" />
              <span>Post New Role</span>
            </button>
          </div>
        </div>

        {/* Job Switcher Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {jobs.map(job => (
            <button
              key={job.id}
              onClick={() => setSelectedJobId(job.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition border ${
                currentJob?.id === job.id
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <span className="font-semibold">{job.title}</span>
              <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] bg-black/30">
                {applications.filter(a => a.jobId === job.id).length} Applicants
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Semantic CV Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Natural Language Search Input */}
          <div className="relative w-full md:w-[480px]">
            <BrainCircuit className="w-4 h-4 text-indigo-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder='Semantic Search e.g. "Find Java backend developers with 2+ years experience"'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950/80 border border-indigo-500/30 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition shadow-inner"
            />
          </div>

          {/* Filter & Sort Controls */}
          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Filter className="w-3.5 h-3.5 text-indigo-400" />
              <span>Status:</span>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="Applied">Applied</option>
              <option value="Under Review">Under Review</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview">Interview</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>

            <div className="flex items-center gap-1.5 text-xs text-slate-400 ml-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-indigo-400" />
              <span>Sort:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="match_desc">Rank # (Highest AI Score)</option>
              <option value="match_asc">Lowest AI Score</option>
              <option value="name">Candidate Name</option>
            </select>
          </div>

        </div>

        {/* Quick Semantic Search Prompt Suggestions */}
        <div className="flex items-center gap-2 overflow-x-auto text-[11px] pt-1">
          <span className="text-slate-500 font-semibold shrink-0">Try AI Search:</span>
          {[
            "Find Java backend developers with 2+ years experience",
            "Find React frontend engineers with AWS & Docker",
            "Find Full-Stack engineers with 4+ years exp"
          ].map((prompt, pIdx) => (
            <button
              key={pIdx}
              onClick={() => setSearchQuery(prompt)}
              className="px-2.5 py-0.5 rounded-lg bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-500/30 text-indigo-300 whitespace-nowrap transition"
            >
              "{prompt}"
            </button>
          ))}
        </div>
      </div>

      {/* Candidate Ranking Table */}
      <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-4 w-12 text-center">Rank</th>
                <th className="py-3.5 px-4">Candidate & Profile</th>
                <th className="py-3.5 px-4 text-center">AI Match Score</th>
                <th className="py-3.5 px-4">Skills Breakdown</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">AI Actions & Pipeline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    No candidates found matching the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app, index) => {
                  const match = app.aiAnalysis?.overallMatch || 0;
                  const rank = index + 1;
                  const medalBadge = rank === 1 ? "🥇 #1" : rank === 2 ? "🥈 #2" : rank === 3 ? "🥉 #3" : `#${rank}`;
                  const rankReason = app.rankReason || (
                    rank === 1 
                      ? `Ranked #1 ahead of applicant pool (+${(match - (filteredApplications[1]?.aiAnalysis?.overallMatch || 0)).toFixed(1)}% match advantage).` 
                      : `Ranked #${rank} with ${match}% overall match score.`
                  );

                  return (
                    <tr key={app.id} className="hover:bg-slate-800/30 transition group">
                      
                      {/* Rank Index & Medal Badge */}
                      <td className="py-4 px-4 text-center">
                        <span className={`px-2.5 py-1 rounded-xl font-black text-xs inline-flex items-center justify-center border shadow-sm ${
                          rank === 1 ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-amber-500/10' :
                          rank === 2 ? 'bg-slate-400/20 text-slate-200 border-slate-400/50' :
                          rank === 3 ? 'bg-amber-700/20 text-amber-500 border-amber-700/50' :
                          'bg-slate-900 text-slate-400 border-slate-800'
                        }`}>
                          {medalBadge}
                        </span>
                      </td>

                      {/* Candidate Avatar & Details */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={app.candidateAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"} 
                            alt={app.candidateName}
                            className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-700"
                          />
                          <div>
                            <div className="font-bold text-white text-sm flex items-center gap-1.5">
                              {app.candidateName}
                              {match >= 90 && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                                  Top Pick
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400">{app.headline}</div>
                            
                            {/* Rank Reason Explanation */}
                            <div className="text-[10px] text-indigo-300 font-medium mt-1 flex items-center gap-1 bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-500/20 max-w-md">
                              <Sparkles className="w-3 h-3 text-indigo-400 shrink-0" />
                              <span className="truncate">{rankReason}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* AI Match Gauge */}
                      <td className="py-4 px-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getMatchScoreBadge(match)}`}>
                            {match}%
                          </span>
                          <span className="text-[10px] text-slate-400 mt-1">
                            Skills: {app.aiAnalysis?.skillsMatch || 0}% • Exp: {app.aiAnalysis?.experienceMatch || 0}%
                          </span>
                        </div>
                      </td>

                      {/* Extracted Skills List */}
                      <td className="py-4 px-4 max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {(app.cvSkills || []).slice(0, 4).map((s, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-medium">
                              {s}
                            </span>
                          ))}
                          {(app.cvSkills || []).length > 4 && (
                            <span className="text-[10px] text-slate-400 self-center">
                              +{(app.cvSkills || []).length - 4} more
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-4 px-4 text-center">
                        <select
                          value={app.status}
                          onChange={(e) => onUpdateStatus(app.id, e.target.value)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold border cursor-pointer focus:outline-none transition ${getStatusBadge(app.status)}`}
                        >
                          <option value="Applied">Applied</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Interview">Interview</option>
                          <option value="Selected">Selected</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {/* AI Match Details Modal */}
                          <button
                            onClick={() => onOpenAIAnalysis(app, currentJob)}
                            className="p-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 transition"
                            title="Inspect AI Match Analysis Breakdown"
                          >
                            <Sparkles className="w-4 h-4" />
                          </button>

                          {/* AI Interview Questions Modal */}
                          <button
                            onClick={() => onOpenAIInterview(app, currentJob)}
                            className="p-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 transition"
                            title="Generate AI Tailored Interview Questions"
                          >
                            <BrainCircuit className="w-4 h-4" />
                          </button>

                          {/* Schedule Interview Modal */}
                          <button
                            onClick={() => onOpenScheduleInterview(app, currentJob)}
                            className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 transition"
                            title="Schedule Interview"
                          >
                            <Calendar className="w-4 h-4" />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
