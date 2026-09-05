import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Video, 
  User, 
  Mail, 
  CheckCircle2 
} from 'lucide-react';

export default function ScheduleInterviewModal({ application, job, isOpen, onClose, onConfirmSchedule }) {
  const [scheduledAt, setScheduledAt] = useState("2026-09-10T14:30");
  const [duration, setDuration] = useState("45");
  const [interviewer, setInterviewer] = useState("David Miller (Lead Architect)");
  const [meetingLink, setMeetingLink] = useState("https://meet.google.com/hyr-inte-demo");
  const [interviewType, setInterviewType] = useState("technical");
  const [notes, setNotes] = useState("Review AI-generated technical questions and discuss system architecture experience.");

  if (!isOpen || !application) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirmSchedule({
      applicationId: application.id,
      scheduledAt,
      duration: `${duration} min`,
      interviewer,
      meetingLink,
      interviewType,
      notes
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl shadow-indigo-950/50 p-6 md:p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6 border-b border-slate-800 pb-4">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Schedule Candidate Interview</h3>
            <p className="text-xs text-slate-400">
              Candidate: <strong className="text-slate-200">{application.candidateName}</strong>
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                Date & Time
              </label>
              <input 
                type="datetime-local" 
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                Duration
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 focus:outline-none focus:border-indigo-500 transition"
              >
                <option value="30">30 Minutes</option>
                <option value="45">45 Minutes</option>
                <option value="60">60 Minutes</option>
                <option value="90">90 Minutes</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                Interviewer Name
              </label>
              <input 
                type="text" 
                value={interviewer}
                onChange={(e) => setInterviewer(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                Interview Stage
              </label>
              <select
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 focus:outline-none focus:border-indigo-500 transition capitalize"
              >
                <option value="technical">Technical Round</option>
                <option value="hr">HR & Cultural Fit</option>
                <option value="system_design">System Design Deep-Dive</option>
                <option value="final">Final Executive Round</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5 flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-indigo-400" />
              Video Meeting URL
            </label>
            <input 
              type="url" 
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              required
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 focus:outline-none focus:border-indigo-500 transition font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Interviewer Notes / Agendas
            </label>
            <textarea 
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-semibold shadow-lg shadow-emerald-600/30 transition hover:scale-[1.02]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Send Invite</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
