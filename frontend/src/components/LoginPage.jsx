import React, { useState } from 'react';
import { 
  Sparkles, 
  Briefcase, 
  UserCheck, 
  ShieldCheck, 
  Mail, 
  Lock, 
  User, 
  ArrowRight,
  CheckCircle2,
  Building2,
  Zap,
  ShieldAlert
} from 'lucide-react';

export default function LoginPage({ onLogin }) {
  const [authMode, setAuthMode] = useState('demo'); // 'demo', 'login', 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState('recruiter');

  const demoAccounts = [
    {
      id: 'recruiter-demo',
      name: 'David Miller',
      role: 'recruiter',
      title: 'Senior Talent Acquisition Manager',
      company: 'TechNova Dynamics',
      email: 'david.m@technovadynamics.io',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      description: 'Access Candidate Ranking, Semantic Search, Skill Gap Analysis, RAG Copilot & Interview AI',
      icon: Briefcase
    },
    {
      id: 'candidate-demo',
      name: 'Ali Kanjo',
      role: 'candidate',
      title: 'Senior Full-Stack & AI Engineer',
      company: 'Applicant Candidate',
      email: 'ali.kanjo@devmail.io',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      description: 'Access Recommended Jobs, AI Match Breakdown, Application Tracker & Interview Invites',
      icon: UserCheck
    },
    {
      id: 'admin-demo',
      name: 'Super Admin',
      role: 'admin',
      title: 'Platform System Administrator',
      company: 'HireAI Platform Governance',
      email: 'admin@hireai.io',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      description: 'Access System Governance, User Management, AI Microservice Logs & Platform Telemetry',
      icon: ShieldCheck
    }
  ];

  const handleSelectDemo = (account) => {
    onLogin({
      name: account.name,
      email: account.email,
      role: account.role,
      title: account.title,
      company: account.company,
      avatar: account.avatar
    });
  };

  const handleSubmitCustom = (e) => {
    e.preventDefault();
    if (!email) return;

    const roleName = authMode === 'register' ? selectedRole : 'recruiter';
    onLogin({
      name: name || email.split('@')[0],
      email: email,
      role: roleName,
      title: roleName === 'recruiter' ? 'Recruiter Manager' : roleName === 'admin' ? 'Administrator' : 'Software Candidate',
      company: roleName === 'recruiter' ? 'TechNova Dynamics' : 'HireAI',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    });
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      
      {/* Dynamic Background Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Box */}
      <div className="w-full max-w-2xl rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl z-10 animate-fadeIn">
        
        {/* Top Header */}
        <div className="p-8 border-b border-slate-800/80 bg-slate-950/60 text-center relative">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 shadow-xl shadow-indigo-500/30 mb-4">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            HireAI Login Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto">
            AI-Powered Recruitment, Semantic Search & Pre-Screening Engine
          </p>

          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
            <span>Role-Based Access Control (RBAC) Enforced</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-8 pt-4 flex border-b border-slate-800/60 bg-slate-950/30">
          <button
            onClick={() => setAuthMode('demo')}
            className={`pb-3 px-5 text-xs font-bold transition border-b-2 ${
              authMode === 'demo'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            ⚡ Select Account Demo (Recommended)
          </button>
          <button
            onClick={() => setAuthMode('login')}
            className={`pb-3 px-5 text-xs font-bold transition border-b-2 ${
              authMode === 'login'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In with Email
          </button>
          <button
            onClick={() => setAuthMode('register')}
            className={`pb-3 px-5 text-xs font-bold transition border-b-2 ${
              authMode === 'register'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Register New User
          </button>
        </div>

        {/* Login Body */}
        <div className="p-8">
          {authMode === 'demo' ? (
            <div className="space-y-4">
              <p className="text-xs text-slate-400 mb-2 font-semibold">
                Select an account below to log in directly into your role-restricted space:
              </p>

              {demoAccounts.map(acc => {
                const IconComponent = acc.icon;
                return (
                  <div
                    key={acc.id}
                    onClick={() => handleSelectDemo(acc)}
                    className="group p-4 rounded-2xl border border-slate-800 bg-slate-950/60 hover:bg-indigo-950/40 hover:border-indigo-500/60 transition cursor-pointer flex items-center justify-between shadow-lg"
                  >
                    <div className="flex items-center gap-4">
                      <img 
                        src={acc.avatar} 
                        alt={acc.name} 
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/30"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-base group-hover:text-indigo-300 transition">
                            {acc.name}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${acc.badgeColor}`}>
                            {acc.role}
                          </span>
                        </div>
                        <div className="text-xs text-slate-300 font-medium">{acc.title}</div>
                        <div className="text-[11px] text-slate-400 mt-1 max-w-md">{acc.description}</div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 group-hover:bg-indigo-600 text-slate-400 group-hover:text-white transition shrink-0">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <form onSubmit={handleSubmitCustom} className="space-y-4 max-w-md mx-auto">
              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. David Miller" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                  <input 
                    type="email" 
                    required
                    placeholder="user@technovadynamics.io" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Assign Account Privilege Role</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('candidate')}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition ${
                        selectedRole === 'candidate'
                          ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Candidate</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole('recruiter')}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition ${
                        selectedRole === 'recruiter'
                          ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Briefcase className="w-4 h-4" />
                      <span>Recruiter</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole('admin')}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition ${
                        selectedRole === 'admin'
                          ? 'bg-purple-600/30 border-purple-500 text-purple-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Admin</span>
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition hover:scale-[1.01] active:scale-[0.99] mt-2 flex items-center justify-center gap-2"
              >
                <span>{authMode === 'register' ? 'Register & Enter Dashboard' : 'Sign In to Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800/80 text-center text-xs text-slate-500">
          HireAI v2.0 • FastAPI AI Microservice Engine • Protected RBAC Workspace
        </div>

      </div>
    </div>
  );
}
