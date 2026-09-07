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
  UserCheck,
  FileText
} from 'lucide-react';
import { queryRAGAssistantAPI } from '../services/aiMatcher';

export default function AIRecruitmentAssistant({ isOpen, onClose, jobs, applications, onSelectCandidate }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hello! I am your HireAI RAG Recruitment Copilot. You can ask me anything about your candidate pool, job criteria, or company HR policies!",
      timestamp: "Just now",
      sources: ["HireAI_System_Index.db"]
    }
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickPrompts = [
    "Who are the best candidates for the Senior Java Developer position?",
    "Which candidates have strong Spring Boot and React skills?",
    "Summarize the overall match distribution across all vacancies.",
    "What is the HireAI remote work & compensation policy?"
  ];

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessages = [...messages, { sender: 'user', text: query, timestamp: userTime }];
    setMessages(newMessages);
    setInputQuery("");
    setIsTyping(true);

    try {
      const res = await queryRAGAssistantAPI(query, jobs, applications);
      const aiTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setMessages(prev => [...prev, {
        sender: 'ai',
        text: res.answer || "Grounding synthesis completed.",
        timestamp: aiTime,
        sources: res.sources || []
      }]);
    } catch (err) {
      console.error("RAG Error:", err);
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: "Error retrieving vector context. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-lg bg-slate-900 border border-slate-700/90 rounded-3xl shadow-2xl shadow-indigo-950/80 overflow-hidden flex flex-col h-[580px] animate-fadeIn">
      
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-indigo-900/80 via-purple-900/60 to-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              HireAI RAG Copilot
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-[10px] text-indigo-300">Vector Embeddings + Document Retriever</div>
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
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
        {messages.map((m, idx) => (
          <div 
            key={idx}
            className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
              m.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-indigo-400 border border-indigo-500/30'
            }`}>
              {m.sender === 'user' ? <User className="w-4 h-4" /> : <BrainCircuit className="w-4 h-4" />}
            </div>

            <div className={`max-w-[85%] p-3.5 rounded-2xl ${
              m.sender === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-600/20' 
                : 'bg-slate-950/90 text-slate-200 border border-slate-800 rounded-tl-none whitespace-pre-line leading-relaxed'
            }`}>
              {m.text}
              
              {/* Source Citations Badges */}
              {m.sources && m.sources.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-1 text-[10px]">
                  <span className="text-slate-500 font-bold flex items-center gap-1">
                    <FileText className="w-3 h-3 text-indigo-400" />
                    Sources:
                  </span>
                  {m.sources.map((src, sIdx) => (
                    <span 
                      key={sIdx}
                      className="px-2 py-0.5 rounded-md bg-indigo-950/60 text-indigo-300 border border-indigo-500/30 font-medium"
                    >
                      {src}
                    </span>
                  ))}
                </div>
              )}

              <div className={`text-[9px] mt-1.5 text-right ${m.sender === 'user' ? 'text-indigo-200' : 'text-slate-500'}`}>
                {m.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-slate-400 text-[11px] italic pl-9">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
            <span>Retrieving vector embeddings & generating grounded context...</span>
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
          placeholder="Ask RAG Copilot about candidates, jobs, or HR docs..."
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
