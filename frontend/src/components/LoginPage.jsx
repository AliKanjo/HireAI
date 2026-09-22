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
  UserCheck,
  Loader2,
  WifiOff,
  CheckCircle2,
} from 'lucide-react';
import { authApi } from '../services/api';

// ─── Demo accounts bypass the API so the portfolio still works offline ────────
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
    icon: Briefcase,
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
    icon: UserCheck,
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
    icon: ShieldCheck,
  },
];

// ─── Feature highlights shown under the hero image ───────────────────────────
const features = [
  { icon: CheckCircle2, text: 'AI-powered CV parsing & scoring' },
  { icon: CheckCircle2, text: 'Semantic candidate search' },
  { icon: CheckCircle2, text: 'Role-based access control (RBAC)' },
];

// ─── Tiny reusable error banner ───────────────────────────────────────────────
function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4 text-[12.5px] text-red-300 leading-relaxed">
      <WifiOff className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
      <span>{message}</span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LoginPage({ onLogin }) {
  const [view, setView] = useState('signin'); // 'signin' | 'signup' | 'demo'
  const [showPassword, setShowPassword] = useState(false);

  // Sign-in form
  const [siEmail, setSiEmail] = useState('');
  const [siPass, setSiPass]   = useState('');
  const [siLoading, setSiLoading] = useState(false);
  const [siError, setSiError]     = useState('');

  // Sign-up form
  const [suName,  setSuName]  = useState('');
  const [suEmail, setSuEmail] = useState('');
  const [suPass,  setSuPass]  = useState('');
  const [selectedRole, setSelectedRole] = useState('candidate');
  const [suLoading, setSuLoading] = useState(false);
  const [suError,   setSuError]   = useState('');

  // ── Persist token and pass user object up to App ──────────────────────────
  const handleAuthSuccess = ({ user, token }) => {
    localStorage.setItem('hireai_token', token);
    onLogin({
      id:      user.id,
      name:    user.name,
      email:   user.email,
      role:    user.role,
      title:   user.role === 'recruiter' ? 'Talent Acquisition Manager' : 'Software Developer Candidate',
      company: user.role === 'recruiter' ? 'TechNova Dynamics' : 'HireAI Workspace',
      avatar:  user.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      isActive: user.is_active,
    });
  };

  // ── Sign In ───────────────────────────────────────────────────────────────
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setSiError('');
    setSiLoading(true);
    try {
      const data = await authApi.login({ email: siEmail, password: siPass });
      handleAuthSuccess(data);
    } catch (err) {
      setSiError(err.uiMessage || 'Sign-in failed. Please try again.');
    } finally {
      setSiLoading(false);
    }
  };

  // ── Sign Up ───────────────────────────────────────────────────────────────
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setSuError('');
    setSuLoading(true);
    try {
      const data = await authApi.register({
        name:     suName,
        email:    suEmail,
        password: suPass,
        role:     selectedRole,
      });
      handleAuthSuccess(data);
    } catch (err) {
      setSuError(err.uiMessage || 'Registration failed. Please try again.');
    } finally {
      setSuLoading(false);
    }
  };

  // ── Demo (offline — no API call) ──────────────────────────────────────────
  const handleDemoSelect = (account) => {
    onLogin({
      name:    account.name,
      email:   account.email,
      role:    account.role,
      title:   account.title,
      company: account.company,
      avatar:  account.avatar,
      isDemo:  true,
    });
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[#03050c] text-[#f4f6fb] font-sans selection:bg-indigo-500 selection:text-white">

      {/* ══════════════════════════════════════════════════════════════════
          LEFT PANEL — Hero Image
      ══════════════════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-[55%] xl:w-[60%] relative flex-col overflow-hidden">
        {/* Image fills the entire left panel */}
        <img
          src="/hireai_hero.jpg"
          alt="HireAI — AI-Powered Recruitment Platform"
          className="absolute inset-0 w-full h-full object-cover object-center"
          draggable={false}
        />

        {/* Subtle gradient overlay so text is readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#03050c]/60 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#03050c]/80 via-transparent to-transparent" />

        {/* Feature chips at the bottom */}
        <div className="absolute bottom-8 left-8 right-8 flex flex-wrap gap-2.5">
          {features.map((f) => (
            <div
              key={f.text}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/8 border border-white/15 backdrop-blur-sm text-[12.5px] text-white/80 font-medium"
            >
              <f.icon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              {f.text}
            </div>
          ))}
        </div>

        {/* RBAC badge top-left */}
        <div className="absolute top-7 left-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[rgba(109,91,246,0.18)] border border-[rgba(109,91,246,0.35)] text-[#c4bcff] text-[11.5px] font-semibold backdrop-blur-sm">
            <ShieldCheck className="w-3.5 h-3.5" />
            RBAC Enforced
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          RIGHT PANEL — Auth Forms
      ══════════════════════════════════════════════════════════════════ */}
      <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col h-full overflow-y-auto bg-gradient-to-b from-[#07090f] to-[#0d1120]">

        {/* Soft purple glow behind the form */}
        <div
          className="absolute right-0 top-0 w-[45%] xl:w-[40%] h-full pointer-events-none"
          style={{ background: 'radial-gradient(800px 500px at 80% 10%, rgba(109,91,246,0.12), transparent 65%)' }}
        />

        <div className="relative flex flex-col flex-1 justify-center px-8 sm:px-12 py-10 max-w-[480px] mx-auto w-full">

          {/* Logo & Title */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6d5bf6] to-[#22b8e6] flex items-center justify-center shadow-[0_8px_24px_-6px_rgba(109,91,246,0.55)]">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-white leading-none">HireAI</h1>
                <p className="text-[11.5px] text-[#666e83] font-medium mt-0.5">AI-Powered Recruitment Platform</p>
              </div>
            </div>

            {view === 'signin' && (
              <>
                <h2 className="text-2xl font-extrabold text-white mb-1">Welcome back</h2>
                <p className="text-[13.5px] text-[#9aa3b8]">Sign in to your workspace to continue</p>
              </>
            )}
            {view === 'signup' && (
              <>
                <h2 className="text-2xl font-extrabold text-white mb-1">Create an account</h2>
                <p className="text-[13.5px] text-[#9aa3b8]">Join HireAI and start hiring smarter</p>
              </>
            )}
            {view === 'demo' && (
              <>
                <h2 className="text-2xl font-extrabold text-white mb-1">Demo accounts</h2>
                <p className="text-[13.5px] text-[#9aa3b8]">1-click login — no credentials required</p>
              </>
            )}
          </div>

          {/* ── DEMO PICKER VIEW ─────────────────────────────────────────── */}
          {view === 'demo' && (
            <div className="space-y-3">
              {demoAccounts.map(acc => {
                const Icon = acc.icon;
                return (
                  <div
                    key={acc.id}
                    onClick={() => handleDemoSelect(acc)}
                    className="group p-4 rounded-xl border border-[#1e2333] bg-[#060810]/60 hover:bg-indigo-950/40 hover:border-[#6d5bf6]/60 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={acc.avatar}
                        alt={acc.name}
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-[#6d5bf6]/30"
                      />
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-bold text-white text-sm group-hover:text-indigo-300 transition">{acc.name}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${acc.badgeColor}`}>
                            {acc.role}
                          </span>
                        </div>
                        <div className="text-[11.5px] text-[#9aa3b8]">{acc.title}</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#444d63] group-hover:text-white transition" />
                  </div>
                );
              })}

              <button
                onClick={() => setView('signin')}
                className="w-full mt-2 text-[13px] text-[#22b8e6] hover:underline font-semibold text-center py-2"
              >
                ← Back to Sign In
              </button>
            </div>
          )}

          {/* ── SIGN IN VIEW ──────────────────────────────────────────────── */}
          {view === 'signin' && (
            <form onSubmit={handleSignInSubmit} className="space-y-0">
              <ErrorBanner message={siError} />

              {/* Email */}
              <div className="mb-4">
                <label className="block text-[13px] font-semibold text-[#d1d7e8] mb-2" htmlFor="si-email">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#555e74] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="si-email"
                    type="email"
                    required
                    placeholder="you@company.com"
                    value={siEmail}
                    onChange={(e) => setSiEmail(e.target.value)}
                    disabled={siLoading}
                    className="w-full bg-[#0a0d17] border border-[#1a2035] rounded-lg py-3 pl-10 pr-3.5 text-[#f4f6fb] text-sm outline-none focus:border-[#6d5bf6] focus:ring-2 focus:ring-[#6d5bf6]/20 transition placeholder:text-[#3a4257] disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[13px] font-semibold text-[#d1d7e8]" htmlFor="si-pass">Password</label>
                  <a
                    href="#forgot"
                    onClick={(e) => { e.preventDefault(); alert('Use the demo login to test any role instantly.'); }}
                    className="text-[12px] text-[#22b8e6] hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#555e74] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="si-pass"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••"
                    value={siPass}
                    onChange={(e) => setSiPass(e.target.value)}
                    disabled={siLoading}
                    className="w-full bg-[#0a0d17] border border-[#1a2035] rounded-lg py-3 pl-10 pr-11 text-[#f4f6fb] text-sm outline-none focus:border-[#6d5bf6] focus:ring-2 focus:ring-[#6d5bf6]/20 transition placeholder:text-[#3a4257] disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555e74] hover:text-[#9aa3b8] transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={siLoading}
                className="w-full mt-5 flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-gradient-to-r from-[#6d5bf6] to-[#22b8e6] text-white text-[14.5px] font-bold cursor-pointer transition hover:brightness-110 active:translate-y-px shadow-lg shadow-indigo-600/25 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {siLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /><span>Signing in…</span></>
                ) : (
                  <><span>Sign In to Account</span><ArrowRight className="w-4 h-4" /></>
                )}
              </button>

              <p className="text-center mt-4 text-[#9aa3b8] text-[13.5px]">
                Don't have an account?{' '}
                <button type="button" onClick={() => { setView('signup'); setSiError(''); }}
                  className="text-[#22b8e6] font-bold hover:underline bg-transparent border-0 cursor-pointer p-0">
                  Sign up
                </button>
              </p>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5 text-[#3a4257] text-xs">
                <div className="flex-1 h-px bg-[#151a28]" />
                <span>or</span>
                <div className="flex-1 h-px bg-[#151a28]" />
              </div>

              {/* Demo */}
              <button
                type="button"
                onClick={() => { setView('demo'); setSiError(''); }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-lg border border-dashed border-[#1a2035] hover:border-[#6d5bf6]/60 text-[#9aa3b8] hover:text-white text-xs font-semibold bg-transparent transition"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Try a demo account (1-Click Login)</span>
              </button>
            </form>
          )}

          {/* ── SIGN UP VIEW ──────────────────────────────────────────────── */}
          {view === 'signup' && (
            <form onSubmit={handleSignUpSubmit}>
              <ErrorBanner message={suError} />

              {/* Full Name */}
              <div className="mb-4">
                <label className="block text-[13px] font-semibold text-[#d1d7e8] mb-2" htmlFor="su-name">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#555e74] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input id="su-name" type="text" required placeholder="e.g. David Miller"
                    value={suName} onChange={(e) => setSuName(e.target.value)} disabled={suLoading}
                    className="w-full bg-[#0a0d17] border border-[#1a2035] rounded-lg py-3 pl-10 pr-3.5 text-[#f4f6fb] text-sm outline-none focus:border-[#6d5bf6] focus:ring-2 focus:ring-[#6d5bf6]/20 transition placeholder:text-[#3a4257] disabled:opacity-50" />
                </div>
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="block text-[13px] font-semibold text-[#d1d7e8] mb-2" htmlFor="su-email">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#555e74] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input id="su-email" type="email" required placeholder="you@company.com"
                    value={suEmail} onChange={(e) => setSuEmail(e.target.value)} disabled={suLoading}
                    className="w-full bg-[#0a0d17] border border-[#1a2035] rounded-lg py-3 pl-10 pr-3.5 text-[#f4f6fb] text-sm outline-none focus:border-[#6d5bf6] focus:ring-2 focus:ring-[#6d5bf6]/20 transition placeholder:text-[#3a4257] disabled:opacity-50" />
                </div>
              </div>

              {/* Password */}
              <div className="mb-4">
                <label className="block text-[13px] font-semibold text-[#d1d7e8] mb-2" htmlFor="su-pass">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#555e74] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input id="su-pass" type={showPassword ? 'text' : 'password'} required minLength={8}
                    placeholder="At least 8 characters"
                    value={suPass} onChange={(e) => setSuPass(e.target.value)} disabled={suLoading}
                    className="w-full bg-[#0a0d17] border border-[#1a2035] rounded-lg py-3 pl-10 pr-11 text-[#f4f6fb] text-sm outline-none focus:border-[#6d5bf6] focus:ring-2 focus:ring-[#6d5bf6]/20 transition placeholder:text-[#3a4257] disabled:opacity-50" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555e74] hover:text-[#9aa3b8] transition">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Role Picker */}
              <div className="mb-4">
                <label className="block text-[13px] font-semibold text-[#d1d7e8] mb-2.5">I am signing up as a</label>
                <div className="grid grid-cols-2 gap-2.5">
                  <div onClick={() => !suLoading && setSelectedRole('candidate')}
                    className={`border rounded-xl p-3.5 text-center cursor-pointer transition ${selectedRole === 'candidate' ? 'border-[#34d19a] bg-[rgba(52,209,154,0.07)]' : 'border-[#1a2035] bg-[#060810] hover:border-slate-700'} ${suLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <User className={`w-5 h-5 mx-auto mb-1.5 ${selectedRole === 'candidate' ? 'text-[#34d19a]' : 'text-[#9aa3b8]'}`} />
                    <span className="text-[13px] font-bold text-white block">Candidate</span>
                    <span className="text-[11px] text-[#555e74] block mt-0.5">Find &amp; apply to jobs</span>
                  </div>
                  <div onClick={() => !suLoading && setSelectedRole('recruiter')}
                    className={`border rounded-xl p-3.5 text-center cursor-pointer transition ${selectedRole === 'recruiter' ? 'border-[#8b7bf7] bg-[rgba(139,123,247,0.09)]' : 'border-[#1a2035] bg-[#060810] hover:border-slate-700'} ${suLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <Briefcase className={`w-5 h-5 mx-auto mb-1.5 ${selectedRole === 'recruiter' ? 'text-[#8b7bf7]' : 'text-[#9aa3b8]'}`} />
                    <span className="text-[13px] font-bold text-white block">Recruiter</span>
                    <span className="text-[11px] text-[#555e74] block mt-0.5">Hire &amp; screen talent</span>
                  </div>
                </div>
              </div>

              {/* Admin note */}
              <div className="flex gap-2.5 bg-[rgba(245,163,92,0.07)] border border-[rgba(245,163,92,0.22)] rounded-lg p-3 mb-4 text-[12px] text-[#d8b28c] leading-relaxed">
                <AlertTriangle className="w-3.5 h-3.5 text-[#f5a35c] shrink-0 mt-0.5" />
                <span>Admin access is provisioned via CLI only — not available through public registration.</span>
              </div>

              <button type="submit" disabled={suLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-gradient-to-r from-[#6d5bf6] to-[#22b8e6] text-white text-[14.5px] font-bold cursor-pointer transition hover:brightness-110 active:translate-y-px shadow-lg shadow-indigo-600/25 disabled:opacity-60 disabled:cursor-not-allowed">
                {suLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /><span>Creating account…</span></>
                ) : (
                  <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>
                )}
              </button>

              <p className="text-center mt-4 text-[#9aa3b8] text-[13.5px]">
                Already have an account?{' '}
                <button type="button" onClick={() => { setView('signin'); setSuError(''); }}
                  className="text-[#22b8e6] font-bold hover:underline bg-transparent border-0 cursor-pointer p-0">
                  Sign in
                </button>
              </p>
            </form>
          )}

          {/* Footer */}
          <p className="mt-8 text-center text-[11px] text-[#3a4257]">
            HireAI v2.0 · FastAPI AI Engine · Protected RBAC Workspace
          </p>

        </div>
      </div>
    </div>
  );
}
