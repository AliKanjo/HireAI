import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Zap, 
  AlertTriangle,
  Briefcase,
  UserCheck
} from 'lucide-react';

export default function LoginPage({ onLogin }) {
  const [view, setView] = useState('signin'); // 'signin', 'signup', 'demo'
  const [showPassword, setShowPassword] = useState(false);
  
  // Form states
  const [siEmail, setSiEmail] = useState('');
  const [siPass, setSiPass] = useState('');
  
  const [suName, setSuName] = useState('');
  const [suEmail, setSuEmail] = useState('');
  const [suPass, setSuPass] = useState('');
  const [selectedRole, setSelectedRole] = useState('candidate'); // 'candidate', 'recruiter'

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
      description: 'Access Candidate Ranking, Semantic Search, Skill Gap Analysis & AI Insights',
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
      description: 'Access Recommended Jobs, AI Match Score, Applications Tracker & Interview Invites',
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
      description: 'Access System Governance, User Privileges, AI Microservice Audit & Telemetry',
      icon: ShieldCheck
    }
  ];

  const handleSignInSubmit = (e) => {
    e.preventDefault();
    if (!siEmail) return;
    
    // Default sign in role detection or preset fallback
    const isRecruiter = siEmail.includes('recruiter') || siEmail.includes('technova');
    const isAdmin = siEmail.includes('admin');
    const role = isAdmin ? 'admin' : isRecruiter ? 'recruiter' : 'candidate';
    
    onLogin({
      name: siEmail.split('@')[0].replace('.', ' '),
      email: siEmail,
      role: role,
      title: role === 'admin' ? 'Platform Administrator' : role === 'recruiter' ? 'Talent Manager' : 'Software Candidate',
      company: role === 'recruiter' ? 'TechNova Dynamics' : 'HireAI Workspace',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    });
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    if (!suEmail) return;

    onLogin({
      name: suName || suEmail.split('@')[0],
      email: suEmail,
      role: selectedRole,
      title: selectedRole === 'recruiter' ? 'Recruiter Manager' : 'Software Developer Candidate',
      company: selectedRole === 'recruiter' ? 'TechNova Dynamics' : 'Applicant Candidate',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    });
  };

  const handleDemoSelect = (account) => {
    onLogin({
      name: account.name,
      email: account.email,
      role: account.role,
      title: account.title,
      company: account.company,
      avatar: account.avatar
    });
  };

  return (
    <div className="min-h-screen bg-[#05070d] text-[#f4f6fb] flex items-center justify-center p-4 font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      
      {/* Background Radial Glow */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(1200px 600px at 50% -10%, rgba(109,91,246,0.16), transparent 60%)'
        }}
      />

      {/* Main Login Card */}
      <div className="w-[440px] max-w-full bg-gradient-to-b from-[#0b0e17] to-[#10131f] border border-[#1e2333] rounded-[14px] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)] overflow-hidden z-10 animate-fadeIn">
        
        {/* Head */}
        <div className="p-9 sm:p-10 pb-7 text-center border-b border-[#171b28]">
          <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-[#6d5bf6] to-[#22b8e6] flex items-center justify-center shadow-[0_10px_30px_-8px_rgba(109,91,246,0.6)]">
            <Sparkles className="w-6.5 h-6.5 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold m-0 mb-1.5 tracking-tight text-[#f4f6fb]">
            HireAI Login Portal
          </h1>
          <p className="text-[13.5px] text-[#9aa3b8] m-0 mb-4 leading-relaxed">
            AI-Powered Recruitment, Semantic Search &amp; Pre-Screening Engine
          </p>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[rgba(109,91,246,0.12)] border border-[rgba(109,91,246,0.3)] text-[#b8adfa] text-[12.5px] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            Role-Based Access Control (RBAC) Enforced
          </span>
        </div>

        {/* Body */}
        <div className="p-7 sm:p-9 pt-7 pb-8">

          {/* DEMO PICKER VIEW */}
          {view === 'demo' && (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#b8adfa] uppercase tracking-wider">Select Demo Account</span>
                <button 
                  onClick={() => setView('signin')}
                  className="text-xs font-bold text-[#22b8e6] hover:underline"
                >
                  Back to Sign In
                </button>
              </div>

              {demoAccounts.map(acc => (
                <div
                  key={acc.id}
                  onClick={() => handleDemoSelect(acc)}
                  className="group p-3.5 rounded-xl border border-[#1e2333] bg-[#060810] hover:bg-indigo-950/40 hover:border-[#6d5bf6] transition cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={acc.avatar} 
                      alt={acc.name} 
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-[#6d5bf6]/30"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm group-hover:text-indigo-300 transition">
                          {acc.name}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${acc.badgeColor}`}>
                          {acc.role}
                        </span>
                      </div>
                      <div className="text-[11.5px] text-[#9aa3b8] mt-0.5">{acc.title}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#666e83] group-hover:text-white transition" />
                </div>
              ))}
            </div>
          )}

          {/* SIGN IN VIEW */}
          {view === 'signin' && (
            <form onSubmit={handleSignInSubmit}>
              <div className="mb-4">
                <label className="block text-[13px] font-semibold text-[#f4f6fb] mb-2" htmlFor="si-email">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#666e83] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input 
                    id="si-email" 
                    type="email" 
                    required
                    placeholder="you@company.com" 
                    value={siEmail}
                    onChange={(e) => setSiEmail(e.target.value)}
                    className="w-full bg-[#060810] border border-[#1e2333] rounded-lg py-3 pl-10 pr-3 text-[#f4f6fb] text-sm outline-none focus:border-[#6d5bf6] focus:ring-2 focus:ring-[#6d5bf6]/20 transition"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-[13px] font-semibold text-[#f4f6fb] mb-2" htmlFor="si-pass">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#666e83] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input 
                    id="si-pass" 
                    type={showPassword ? "text" : "password"} 
                    required
                    placeholder="••••••••••" 
                    value={siPass}
                    onChange={(e) => setSiPass(e.target.value)}
                    className="w-full bg-[#060810] border border-[#1e2333] rounded-lg py-3 pl-10 pr-10 text-[#f4f6fb] text-sm outline-none focus:border-[#6d5bf6] focus:ring-2 focus:ring-[#6d5bf6]/20 transition"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666e83] hover:text-[#9aa3b8] transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center mb-4.5 -mt-2">
                <span></span>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Use Demo Login below to test any role instantly."); }} className="text-[12.5px] text-[#22b8e6] hover:underline">
                  Forgot password?
                </a>
              </div>

              <button 
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-gradient-to-r from-[#6d5bf6] to-[#22b8e6] text-white text-[14.5px] font-bold cursor-pointer transition hover:brightness-110 active:translate-y-0.5 shadow-md shadow-indigo-600/20"
              >
                <span>Sign In to Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-center mt-4 text.sm text-[#9aa3b8] text-[13.5px]">
                Don't have an account?{' '}
                <button 
                  type="button" 
                  onClick={() => setView('signup')}
                  className="text-[#22b8e6] font-bold hover:underline bg-transparent border-0 cursor-pointer p-0"
                >
                  Sign up
                </button>
              </p>

              <div className="flex items-center gap-3 my-5 text-[#666e83] text-xs">
                <div className="flex-1 h-[1px] bg-[#171b28]" />
                <span>or</span>
                <div className="flex-1 h-[1px] bg-[#171b28]" />
              </div>

              <button
                type="button"
                onClick={() => setView('demo')}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-lg border border-dashed border-[#1e2333] hover:border-[#6d5bf6] text-[#9aa3b8] hover:text-white text-xs font-semibold bg-transparent transition"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Try a demo account (1-Click Login)</span>
              </button>
            </form>
          )}

          {/* SIGN UP VIEW */}
          {view === 'signup' && (
            <form onSubmit={handleSignUpSubmit}>
              <div className="mb-4">
                <label className="block text-[13px] font-semibold text-[#f4f6fb] mb-2" htmlFor="su-name">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#666e83] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input 
                    id="su-name" 
                    type="text" 
                    required
                    placeholder="e.g. David Miller" 
                    value={suName}
                    onChange={(e) => setSuName(e.target.value)}
                    className="w-full bg-[#060810] border border-[#1e2333] rounded-lg py-3 pl-10 pr-3 text-[#f4f6fb] text-sm outline-none focus:border-[#6d5bf6] focus:ring-2 focus:ring-[#6d5bf6]/20 transition"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-[13px] font-semibold text-[#f4f6fb] mb-2" htmlFor="su-email">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#666e83] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input 
                    id="su-email" 
                    type="email" 
                    required
                    placeholder="you@company.com" 
                    value={suEmail}
                    onChange={(e) => setSuEmail(e.target.value)}
                    className="w-full bg-[#060810] border border-[#1e2333] rounded-lg py-3 pl-10 pr-3 text-[#f4f6fb] text-sm outline-none focus:border-[#6d5bf6] focus:ring-2 focus:ring-[#6d5bf6]/20 transition"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-[13px] font-semibold text-[#f4f6fb] mb-2" htmlFor="su-pass">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#666e83] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input 
                    id="su-pass" 
                    type={showPassword ? "text" : "password"} 
                    required
                    placeholder="At least 10 characters" 
                    value={suPass}
                    onChange={(e) => setSuPass(e.target.value)}
                    className="w-full bg-[#060810] border border-[#1e2333] rounded-lg py-3 pl-10 pr-10 text-[#f4f6fb] text-sm outline-none focus:border-[#6d5bf6] focus:ring-2 focus:ring-[#6d5bf6]/20 transition"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666e83] hover:text-[#9aa3b8] transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Role Selection */}
              <div className="mb-5">
                <label className="block text-[13px] font-semibold text-[#f4f6fb] mb-2.5">
                  I am signing up as a
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <div 
                    onClick={() => setSelectedRole('candidate')}
                    className={`border rounded-lg p-3.5 text-center cursor-pointer transition ${
                      selectedRole === 'candidate'
                        ? 'border-[#34d19a] bg-[rgba(52,209,154,0.08)]'
                        : 'border-[#1e2333] bg-[#060810] hover:border-slate-700'
                    }`}
                  >
                    <User className={`w-5 h-5 mx-auto mb-2 ${selectedRole === 'candidate' ? 'text-[#34d19a]' : 'text-[#9aa3b8]'}`} />
                    <span className="text-[13.5px] font-bold text-white block">Candidate</span>
                    <span className="text-[11.5px] text-[#666e83] block mt-0.5">Find &amp; apply to jobs</span>
                  </div>

                  <div 
                    onClick={() => setSelectedRole('recruiter')}
                    className={`border rounded-lg p-3.5 text-center cursor-pointer transition ${
                      selectedRole === 'recruiter'
                        ? 'border-[#8b7bf7] bg-[rgba(139,123,247,0.1)]'
                        : 'border-[#1e2333] bg-[#060810] hover:border-slate-700'
                    }`}
                  >
                    <Briefcase className={`w-5 h-5 mx-auto mb-2 ${selectedRole === 'recruiter' ? 'text-[#8b7bf7]' : 'text-[#9aa3b8]'}`} />
                    <span className="text-[13.5px] font-bold text-white block">Recruiter</span>
                    <span className="text-[11.5px] text-[#666e83] block mt-0.5">Hire &amp; screen talent</span>
                  </div>
                </div>
              </div>

              {/* Admin Note */}
              <div className="flex gap-2.5 bg-[rgba(245,163,92,0.08)] border border-[rgba(245,163,92,0.25)] rounded-lg p-3 mb-5 text-[12px] text-[#d8b28c] leading-relaxed">
                <AlertTriangle className="w-4 h-4 text-[#f5a35c] shrink-0 mt-0.5" />
                <span>
                  Admin access isn't self-service. Existing admins can promote your account from the dashboard once you're signed up.
                </span>
              </div>

              <button 
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-gradient-to-r from-[#6d5bf6] to-[#22b8e6] text-white text-[14.5px] font-bold cursor-pointer transition hover:brightness-110 active:translate-y-0.5 shadow-md shadow-indigo-600/20"
              >
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-center mt-4 text-[#9aa3b8] text-[13.5px]">
                Already have an account?{' '}
                <button 
                  type="button" 
                  onClick={() => setView('signin')}
                  className="text-[#22b8e6] font-bold hover:underline bg-transparent border-0 cursor-pointer p-0"
                >
                  Sign in
                </button>
              </p>
            </form>
          )}

        </div>

        {/* Footer */}
        <div className="text-center p-4 border-t border-[#171b28] text-[#666e83] text-[11.5px] bg-[#060810]">
          HireAI v2.0 · FastAPI AI Microservice Engine · Protected RBAC Workspace
        </div>

      </div>
    </div>
  );
}
