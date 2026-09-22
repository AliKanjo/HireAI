import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LoginPage from './components/LoginPage';
import RecruiterDashboard from './components/RecruiterDashboard';
import CandidatePortal from './components/CandidatePortal';
import AdminPortal from './components/AdminPortal';
import AIAnalysisModal from './components/AIAnalysisModal';
import AIInterviewModal from './components/AIInterviewModal';
import ScheduleInterviewModal from './components/ScheduleInterviewModal';
import CreateJobModal from './components/CreateJobModal';
import ApplyModal from './components/ApplyModal';
import CandidateCompareModal from './components/CandidateCompareModal';
import AIRecruitmentAssistant from './components/AIRecruitmentAssistant';
import { INITIAL_JOBS, INITIAL_APPLICATIONS } from './data/mockData';
import { CheckCircle2, Sparkles, Bot, Loader2 } from 'lucide-react';
import { authApi } from './services/api';

export default function App() {
  // Current Authenticated User State (Null by default -> forces Login Page first)
  const [currentUser, setCurrentUser] = useState(null);
  const [rehydrating, setRehydrating] = useState(true); // true while checking saved token

  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [applications, setApplications] = useState(INITIAL_APPLICATIONS);
  const [selectedJobId, setSelectedJobId] = useState(INITIAL_JOBS[0].id);

  // Modals state
  const [analysisModal, setAnalysisModal] = useState({ isOpen: false, application: null, job: null });
  const [interviewModal, setInterviewModal] = useState({ isOpen: false, application: null, job: null });
  const [scheduleModal, setScheduleModal] = useState({ isOpen: false, application: null, job: null });
  const [compareModal, setCompareModal] = useState(false);
  const [createJobModal, setCreateJobModal] = useState(false);
  const [applyModal, setApplyModal] = useState({ isOpen: false, job: null });
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ── Token rehydration on page refresh ──────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('hireai_token');
    if (!token) { setRehydrating(false); return; }

    authApi.me()
      .then((user) => {
        setCurrentUser({
          id:      user.id,
          name:    user.name,
          email:   user.email,
          role:    user.role,
          title:   user.role === 'recruiter' ? 'Talent Acquisition Manager' : 'Software Developer Candidate',
          company: user.role === 'recruiter' ? 'TechNova Dynamics' : 'HireAI Workspace',
          avatar:  user.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          isActive: user.is_active,
        });
      })
      .catch(() => {
        // Token is stale/invalid — clear it and show login
        localStorage.removeItem('hireai_token');
      })
      .finally(() => setRehydrating(false));
  }, []);

  // Login handler
  const handleLogin = (user) => {
    setCurrentUser(user);
    showToast(`Welcome back, ${user.name}! Logged into ${user.role.toUpperCase()} Workspace.`);
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      if (!currentUser?.isDemo) await authApi.logout(); // skip API call for demo accounts
    } catch (_) { /* ignore network errors on logout */ }
    setCurrentUser(null);
    showToast('Signed out of HireAI workspace.');
  };

  // Modal Handlers
  const handleOpenAIAnalysis = (app, job) => {
    setAnalysisModal({ isOpen: true, application: app, job: job || jobs.find(j => j.id === app.jobId) });
  };

  const handleOpenAIInterview = (app, job) => {
    setInterviewModal({ isOpen: true, application: app, job: job || jobs.find(j => j.id === app.jobId) });
  };

  const handleOpenScheduleInterview = (app, job) => {
    setScheduleModal({ isOpen: true, application: app, job: job || jobs.find(j => j.id === app.jobId) });
  };

  const handleUpdateStatus = (appId, newStatus) => {
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
    showToast(`Applicant status successfully updated to "${newStatus}"`);
  };

  const handleConfirmSchedule = (scheduleData) => {
    setApplications(prev => prev.map(a => {
      if (a.id === scheduleData.applicationId) {
        return {
          ...a,
          status: 'Interview',
          interview: {
            scheduledAt: scheduleData.scheduledAt,
            duration: scheduleData.duration,
            meetingLink: scheduleData.meetingLink,
            interviewer: scheduleData.interviewer
          }
        };
      }
      return a;
    }));
    showToast(`Interview scheduled with Google Meet invite sent!`);
  };

  const handleCreateJob = (newJobData) => {
    const createdJob = {
      id: Date.now(),
      companyId: 1,
      companyName: "TechNova Dynamics",
      companyLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80",
      postedDate: new Date().toISOString().split('T')[0],
      ...newJobData
    };
    setJobs([createdJob, ...jobs]);
    setSelectedJobId(createdJob.id);
    showToast(`New Job Vacancy "${createdJob.title}" published!`);
  };

  const handleApplySuccess = (newApplication) => {
    const createdApp = {
      id: Date.now(),
      ...newApplication
    };
    setApplications([createdApp, ...applications]);
    showToast(`Application submitted! AI Match score: ${newApplication.aiAnalysis.overallMatch}%`);
  };

  // 1a. While checking for a saved token, show a minimal loading screen
  if (rehydrating) {
    return (
      <div className="min-h-screen bg-[#05070d] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          <span className="text-[#9aa3b8] text-sm">Restoring session…</span>
        </div>
      </div>
    );
  }

  // 1b. If not authenticated, force full-screen Login Page
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // 2. Authenticated View: Strictly route to user's assigned role dashboard
  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar 
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenCreateJob={() => setCreateJobModal(true)}
      />

      {/* Main Content Area strictly guarded by RBAC Role */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentUser.role === 'recruiter' && (
          <RecruiterDashboard 
            jobs={jobs}
            applications={applications}
            selectedJobId={selectedJobId}
            setSelectedJobId={setSelectedJobId}
            onOpenAIAnalysis={handleOpenAIAnalysis}
            onOpenAIInterview={handleOpenAIInterview}
            onOpenScheduleInterview={handleOpenScheduleInterview}
            onOpenCompare={() => setCompareModal(true)}
            onUpdateStatus={handleUpdateStatus}
            onOpenCreateJob={() => setCreateJobModal(true)}
          />
        )}

        {currentUser.role === 'candidate' && (
          <CandidatePortal 
            currentUser={currentUser}
            jobs={jobs}
            applications={applications}
            onApplyJob={(job) => setApplyModal({ isOpen: true, job })}
            onOpenAIAnalysis={handleOpenAIAnalysis}
          />
        )}

        {currentUser.role === 'admin' && (
          <AdminPortal 
            jobs={jobs}
            applications={applications}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-semibold text-slate-400">HireAI</span> — AI-Powered Recruitment & CV Analysis Platform
          </div>
          <div>FastAPI AI Microservice • RBAC Guard Active • React 18 SPA</div>
        </div>
      </footer>

      {/* Floating AI Recruitment Assistant Toggle */}
      <button
        onClick={() => setIsAIAssistantOpen(!isAIAssistantOpen)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold shadow-2xl shadow-indigo-600/40 border border-white/20 transition-all hover:scale-105 active:scale-95 glow-indigo"
      >
        <Bot className="w-4 h-4 animate-bounce" />
        <span className="hidden sm:inline">HireAI Copilot</span>
      </button>

      {/* Interactive Modals */}
      <AIAnalysisModal 
        isOpen={analysisModal.isOpen}
        application={analysisModal.application}
        job={analysisModal.job}
        onClose={() => setAnalysisModal({ isOpen: false, application: null, job: null })}
        onOpenInterviewAssistant={(app) => handleOpenAIInterview(app, analysisModal.job)}
      />

      <AIInterviewModal 
        isOpen={interviewModal.isOpen}
        application={interviewModal.application}
        job={interviewModal.job}
        onClose={() => setInterviewModal({ isOpen: false, application: null, job: null })}
        onScheduleInterview={(app) => handleOpenScheduleInterview(app, interviewModal.job)}
      />

      <ScheduleInterviewModal 
        isOpen={scheduleModal.isOpen}
        application={scheduleModal.application}
        job={scheduleModal.job}
        onClose={() => setScheduleModal({ isOpen: false, application: null, job: null })}
        onConfirmSchedule={handleConfirmSchedule}
      />

      <CandidateCompareModal 
        isOpen={compareModal}
        applications={applications}
        job={jobs.find(j => j.id === selectedJobId)}
        onClose={() => setCompareModal(false)}
      />

      <CreateJobModal 
        isOpen={createJobModal}
        onClose={() => setCreateJobModal(false)}
        onCreateJob={handleCreateJob}
      />

      <ApplyModal 
        isOpen={applyModal.isOpen}
        job={applyModal.job}
        onClose={() => setApplyModal({ isOpen: false, job: null })}
        onApplySuccess={handleApplySuccess}
      />

      <AIRecruitmentAssistant 
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        jobs={jobs}
        applications={applications}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 border border-indigo-500/40 text-white text-xs font-semibold shadow-2xl shadow-indigo-950 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
