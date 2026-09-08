import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Briefcase, 
  UserCheck, 
  ShieldCheck, 
  Mail, 
  Lock, 
  User, 
  ArrowRight,
  CheckCircle2,
  Building2
} from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLogin }) {
  const [authMode, setAuthMode] = useState('demo'); // 'demo', 'login', 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState('recruiter');

  if (!isOpen) return null;

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
      icon: UserCheck
    },
    {
      id: 'admin-demo',
      name: 'Super Admin',
      role: 'admin',
      title: 'Platform System Administrator',
      company: 'HireAI Platform',
      email: 'admin@hireai.io',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
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
    onClose();
  };

  const handleSubmitCustom = (e) => {
    e.preventDefault();
    if (!email) return;

    const roleName = authMode === 'register' ? selectedRole : 'candidate';
    onLogin({
      name: name || email.split('@')[0],
      email: email,
      role: roleName,
      title: roleName === 'recruiter' ? 'Recruiter Manager' : roleName === 'admin' ? 'Administrator' : 'Software Candidate',
      company: roleName === 'recruiter' ? 'TechNova Dynamics' : 'HireAI',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800/80 bg-slate-950/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">HireAI Platform Access</h2>
              <p className="text-xs text-slate-400">Select demo role profile or sign in with account credentials</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-4 flex border-b border-slate-800/60 bg-slate-950/20">
          <button
            onClick={() => setAuthMode('demo')}
            className={`pb-3 px-4 text-xs font-bold transition border-b-2 ${
              authMode === 'demo'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            ⚡ Quick Demo Accounts
          </button>
          <button
            onClick={() => setAuthMode('login')}
            className={`pb-3 px-4 text-xs font-bold transition border-b-2 ${
              authMode === 'login'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setAuthMode('register')}
            className={`pb-3 px-4 text-xs font-bold transition border-b-2 ${
              authMode === 'register'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Register Account
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {authMode === 'demo' ? (
            <div className="space-y-3">
              <p className="text-xs text-slate-400 mb-2">
                Click any role preset below to instantly switch experience & permissions:
              </p>

              {demoAccounts.map(acc => {
                const IconComponent = acc.icon;
                return (
                  <div
                    key={acc.id}
                    onClick={() => handleSelectDemo(acc)}
                    className="group p-4 rounded-2xl border border-slate-800 bg-slate-950/60 hover:bg-indigo-950/40 hover:border-indigo-500/60 transition cursor-pointer flex items-center justify-between shadow-lg"
                  >
                    <div className="flex items-center gap-3.5">
                      <img 
                        src={acc.avatar} 
                        alt={acc.name} 
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-indigo-500/30"
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
                        <div className="text-xs text-slate-400">{acc.title} • <span className="text-slate-300">{acc.company}</span></div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{acc.email}</div>
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-900 group-hover:bg-indigo-600 text-slate-400 group-hover:text-white transition">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <form onSubmit={handleSubmitCustom} className="space-y-4">
              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Ali Kanjo" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input 
                    type="email" 
                    required
                    placeholder="user@hireai.io" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Select Account Role</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('candidate')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition ${
                        selectedRole === 'candidate'
                          ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Candidate</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole('recruiter')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition ${
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
                      className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition ${
                        selectedRole === 'admin'
                          ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
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
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition hover:scale-[1.01] active:scale-[0.99] mt-2"
              >
                {authMode === 'register' ? 'Create Account & Sign In' : 'Sign In to Dashboard'}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
