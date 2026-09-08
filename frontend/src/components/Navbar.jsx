import React, { useState } from 'react';
import { 
  Sparkles, 
  Briefcase, 
  UserCheck, 
  ShieldCheck, 
  Bell, 
  PlusCircle,
  LogOut,
  ChevronDown,
  User,
  Zap,
  Lock
} from 'lucide-react';

export default function Navbar({ currentUser, onLogout, onOpenCreateJob, unreadCount = 3 }) {
  const [profileDropdown, setProfileDropdown] = useState(false);

  const getRoleBadge = (role) => {
    switch(role) {
      case 'recruiter':
        return { label: 'Recruiter Dashboard', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30', icon: Briefcase };
      case 'candidate':
        return { label: 'Candidate Portal', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', icon: UserCheck };
      case 'admin':
        return { label: 'Admin Control Plane', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30', icon: ShieldCheck };
      default:
        return { label: 'Guest', color: 'bg-slate-800 text-slate-300 border-slate-700', icon: User };
    }
  };

  const badgeInfo = getRoleBadge(currentUser?.role || 'recruiter');
  const BadgeIcon = badgeInfo.icon;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 glass-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Active Workspace Badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
                HireAI
              </span>
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${badgeInfo.color}`}>
                {badgeInfo.label}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Authenticated Workspace • <span className="text-slate-300 font-semibold">{currentUser?.company || 'HireAI'}</span>
            </p>
          </div>
        </div>

        {/* Center: Strict Route Protection Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-semibold text-slate-400">
          <Lock className="w-3.5 h-3.5 text-indigo-400" />
          <span>Protected Workspace Mode</span>
        </div>

        {/* Right Actions & User Profile */}
        <div className="flex items-center gap-3">
          {currentUser?.role === 'recruiter' && (
            <button
              onClick={onOpenCreateJob}
              className="hidden lg:flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-semibold rounded-lg shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Vacancy</span>
            </button>
          )}

          {/* Profile Pill & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdown(!profileDropdown)}
              className="flex items-center gap-2.5 pl-2 py-1 pr-2 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/50 transition"
            >
              {currentUser?.avatar ? (
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/30"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-400 text-white text-xs font-bold flex items-center justify-center">
                  {currentUser?.name ? currentUser.name.charAt(0) : 'U'}
                </div>
              )}

              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-100 leading-tight">
                  {currentUser?.name || 'User Profile'}
                </div>
                <div className="text-[10px] text-indigo-400 font-medium capitalize">
                  {currentUser?.role} Account
                </div>
              </div>

              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Profile Dropdown Menu */}
            {profileDropdown && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-fadeIn">
                <div className="p-3 border-b border-slate-800/80 mb-1">
                  <p className="text-xs font-bold text-white">{currentUser?.name}</p>
                  <p className="text-[11px] text-slate-400">{currentUser?.email}</p>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border border-indigo-500/30 bg-indigo-500/20 text-indigo-300">
                    <BadgeIcon className="w-3 h-3" />
                    <span>{currentUser?.role} Role</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setProfileDropdown(false);
                    onLogout();
                  }}
                  className="w-full text-left px-3 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-500/10 rounded-xl transition flex items-center gap-2 mt-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out of Account</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick Sign Out Header Button */}
          <button
            onClick={onLogout}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 transition"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
}
