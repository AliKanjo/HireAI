import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Building2, 
  Briefcase, 
  Activity, 
  CheckCircle2, 
  XCircle, 
  Sparkles,
  Server,
  Zap,
  Lock
} from 'lucide-react';

export default function AdminPortal({ users = [], companies = [], jobs = [], applications = [] }) {
  const [activeTab, setActiveTab] = useState("users");

  const mockUsers = [
    { id: 1, name: "David Miller", email: "david.m@technovadynamics.io", role: "recruiter", company: "TechNova Dynamics", status: "Active" },
    { id: 2, name: "Sarah Chen", email: "sarah.chen@devmail.io", role: "candidate", company: "-", status: "Active" },
    { id: 3, name: "Alexandre Moreau", email: "alex.moreau@codelab.org", role: "candidate", company: "-", status: "Active" },
    { id: 4, name: "Elena Rostova", email: "elena.rostova@techmail.com", role: "candidate", company: "-", status: "Active" },
    { id: 5, name: "Amanda Hayes", email: "amanda@finpulse.global", role: "recruiter", company: "FinPulse Global", status: "Active" },
    { id: 6, name: "Super Admin", email: "admin@hireai.io", role: "admin", company: "Platform", status: "Active" },
  ];

  const auditLogs = [
    { id: 1, action: "AI CV Analysis Pipeline Executed", user: "sarah.chen@devmail.io", target: "Job #1 - Senior Full-Stack", timestamp: "2 mins ago", status: "Success (94% Match)" },
    { id: 2, action: "Interview Questions Generated via LLM", user: "david.m@technovadynamics.io", target: "Candidate #101 (Sarah Chen)", timestamp: "15 mins ago", status: "Success (3 Questions)" },
    { id: 3, action: "Job Vacancy Published", user: "amanda@finpulse.global", target: "Job #3 - Senior Frontend Developer", timestamp: "1 hour ago", status: "Published" },
    { id: 4, action: "CV Text Extraction (PDF Parser)", user: "liam.oconnor@ai-eng.io", target: "Liam_OConnor_CV.pdf", timestamp: "2 hours ago", status: "Parsed (8 Skills)" }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Admin Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Super Administrator Control Plane
          </div>
          <h1 className="text-2xl font-extrabold text-white">Platform Governance & Health</h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage platform accounts, company tenants, and audit AI engine telemetry.</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3.5 py-1.5 rounded-xl transition ${
              activeTab === 'users' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Users ({mockUsers.length})
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3.5 py-1.5 rounded-xl transition ${
              activeTab === 'audit' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            AI Audit Telemetry
          </button>
        </div>
      </div>

      {/* Admin KPI Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-panel border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-white">{mockUsers.length}</div>
            <div className="text-xs text-slate-400">Registered Users</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-white">14</div>
            <div className="text-xs text-slate-400">Companies & Tenants</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-white">99.98%</div>
            <div className="text-xs text-slate-400">AI Service Uptime</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-white">45ms</div>
            <div className="text-xs text-slate-400">Avg Parsing Latency</div>
          </div>
        </div>
      </div>

      {activeTab === 'users' ? (
        /* Users Management Table */
        <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">User Directory & Role Assignments</h3>
            <span className="text-xs text-indigo-400">RBAC Active</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">User Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Organization</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {mockUsers.map(user => (
                  <tr key={user.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3.5 px-4 font-bold text-white">{user.name}</td>
                    <td className="py-3.5 px-4 text-slate-400">{user.email}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        user.role === 'admin' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                        user.role === 'recruiter' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' :
                        'bg-slate-800 text-slate-300 border-slate-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{user.company}</td>
                    <td className="py-3.5 px-4">
                      <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition">
                        Edit Privileges
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Audit Telemetry */
        <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Live AI Microservice Telemetry & Inferences
            </h3>
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Real-Time Ingestion
            </span>
          </div>

          <div className="divide-y divide-slate-800/60 text-xs">
            {auditLogs.map(log => (
              <div key={log.id} className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs">{log.action}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Initiator: <strong className="text-slate-300">{log.user}</strong> • Target: {log.target}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-semibold text-emerald-300">
                    {log.status}
                  </span>
                  <div className="text-[10px] text-slate-500 mt-1">{log.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
