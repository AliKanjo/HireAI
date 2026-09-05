import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  MessageSquare, 
  Send, 
  X, 
  Bot, 
  User, 
  BrainCircuit, 
  ChevronRight,
  HelpCircle,
  TrendingUp,
  UserCheck
} from 'lucide-react';

export default function AIRecruitmentAssistant({ isOpen, onClose, jobs, applications, onSelectCandidate }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hello! I am your HireAI Recruitment Assistant. You can ask me anything about your current candidate pool, match scores, skill distribution, or request candidate comparisons!",
      timestamp: "Just now"
    }
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickPrompts = [
    "Who is the highest-ranked applicant for the Senior Full-Stack role?",
    "Which candidates have strong Spring Boot and React skills?",
    "Summarize the overall match distribution across all vacancies.",
    "Which applicants are currently missing AWS experience?"
  ];

  const handleSendMessage = (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    // Add User message
    const newMessages = [...messages, { sender: 'user', text: query, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }];
    setMessages(newMessages);
    setInputQuery("");
    setIsTyping(true);

    // Simulate AI synthesis based on real dataset
    setTimeout(() => {
      let aiResponse = "";
      const lower = query.toLowerCase();

      if (lower.includes("highest") || lower.includes("top") || lower.includes("best")) {
        const topCandidate = [...applications].sort((a, b) => (b.aiAnalysis?.overallMatch || 0) - (a.aiAnalysis?.overallMatch || 0))[0];
        aiResponse = `The highest-ranked applicant across all vacancies is **${topCandidate.candidateName}** with an overall match score of **${topCandidate.aiAnalysis.overallMatch}%** for the *${jobs.find(j => j.id === topCandidate.jobId)?.title}* vacancy. She exceeds requirements with 5.5 years of experience and high proficiency in Java, Spring Boot, React, and MySQL.`;
      } else if (lower.includes("spring") || lower.includes("react")) {
        const springReactCandidates = applications.filter(a => 
          a.cvSkills?.some(s => /spring/i.test(s)) && a.cvSkills?.some(s => /react/i.test(s))
        );
        aiResponse = `Found **${springReactCandidates.length} candidates** with both Spring Boot and React in their CV:\n\n` +
          springReactCandidates.map(c => `• **${c.candidateName}** (${c.aiAnalysis.overallMatch}% Match) — ${c.headline}`).join('\n');
      } else if (lower.includes("aws") || lower.includes("missing")) {
        aiResponse = `Candidates currently missing explicit AWS cloud experience in their analyzed CVs:\n\n• **Sarah Chen** (94% Match) — Mastered Java/React/Docker, but lacks primary AWS mention.\n• **Devon Marcus** (67% Match) — Junior profile, focused on client-side JS.\n\n*Note:* **Alexandre Moreau** (89% Match) is the strongest applicant with verified AWS experience!`;
      } else if (lower.includes("distribution") || lower.includes("summary") || lower.includes("stats")) {
        const avgScore = (applications.reduce((acc, a) => acc + (a.aiAnalysis?.overallMatch || 0), 0) / applications.length).toFixed(1);
        aiResponse = `📊 **Recruitment Analytics Summary:**\n\n• **Active Vacancies:** ${jobs.length}\n• **Total Candidate Submissions:** ${applications.length}\n• **Average Candidate Match:** ${avgScore}%\n• **Top Shortlisted:** ${applications.filter(a => a.status === 'Shortlisted').length} candidates\n• **Interviews in Progress:** ${applications.filter(a => a.status === 'Interview' || a.interview).length}`;
      } else {
        aiResponse = `Based on your recruitment dataset of ${applications.length} candidates across ${jobs.length} roles, ${applications[0].candidateName} (94%) and ${applications[1]?.candidateName || 'Alexandre Moreau'} (89%) represent your top shortlisted candidates. Would you like me to generate interview questions or compare their skill breakdowns?`;
      }

      setMessages(prev => [...prev, {
        sender: 'ai',
        text: aiResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsTyping(false);
    }, 750);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-md bg-slate-900 border border-slate-700/90 rounded-3xl shadow-2xl shadow-indigo-950/80 overflow-hidden flex flex-col h-[560px] animate-fadeIn">
      
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-indigo-900/80 via-purple-900/60 to-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              HireAI Copilot
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-[10px] text-indigo-300">Recruitment Assistant (AI-13 - AI-15)</div>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
        {messages.map((m, idx) => (
          <div 
            key={idx}
            className={`flex items-start gap-2 ${m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
              m.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-indigo-400'
            }`}>
              {m.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
            </div>

            <div className={`max-w-[82%] p-3 rounded-2xl ${
              m.sender === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-600/20' 
                : 'bg-slate-950/80 text-slate-200 border border-slate-800 rounded-tl-none whitespace-pre-line leading-relaxed'
            }`}>
              {m.text}
              <div className={`text-[9px] mt-1 text-right ${m.sender === 'user' ? 'text-indigo-200' : 'text-slate-500'}`}>
                {m.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-slate-400 text-[11px] italic">
            <Sparkles className="w-3 h-3 text-indigo-400 animate-spin" />
            <span>Analyzing candidate database...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="px-3 py-2 bg-slate-950/60 border-t border-slate-800/80 overflow-x-auto flex gap-1.5 no-scrollbar">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] text-indigo-300 font-medium whitespace-nowrap transition"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
        <input 
          type="text"
          placeholder="Ask Copilot about candidates, skills, match scores..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
          className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
        <button
          onClick={() => handleSendMessage()}
          className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-md shadow-indigo-600/30"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
