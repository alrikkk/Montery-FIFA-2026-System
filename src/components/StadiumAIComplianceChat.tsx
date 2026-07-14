import React, { useEffect, useRef } from "react";
import { 
  MessageSquare, 
  Send, 
  RefreshCw, 
  Sparkles, 
  ShieldAlert, 
  User, 
  Zap
} from "lucide-react";
import { getTranslation } from "../utils/localization";

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

interface StadiumAIComplianceChatProps {
  chatMessages: ChatMessage[];
  chatInput: string;
  setChatInput: (val: string) => void;
  isChatLoading: boolean;
  sendChatMessage: (msgText: string) => Promise<void>;
  currentSessionRole: string; // "FAN" | "VOLUNTEER" | "VENUE_STAFF" | "ORGANIZER" | "UNASSIGNED"
  selectedLanguage?: string;
}

export default function StadiumAIComplianceChat({
  chatMessages,
  chatInput,
  setChatInput,
  isChatLoading,
  sendChatMessage,
  currentSessionRole,
  selectedLanguage = "en"
}: StadiumAIComplianceChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isChatLoading]);

  // Handle preset clicks
  const handlePresetClick = (query: string) => {
    if (isChatLoading) return;
    sendChatMessage(query);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const text = chatInput.trim();
    if (!text || isChatLoading) return;
    sendChatMessage(text);
  };

  // Preset prompts tailored dynamically to the active identity
  const getPresetsForRole = () => {
    switch (currentSessionRole.toUpperCase()) {
      case "FAN":
        return [
          { label: "Clear Bag Regulations", query: "What is the official clear bag policy for spectators?" },
          { label: "Turnstile Scan Error", query: "My ticket returned Error 109 at the turnstile. Where do I go?" },
          { label: "ADA Accessible Toilets", query: "Are there wheelchair accessible bathrooms near Section 118?" },
          { label: "Match Schedules", query: "Can you list the FIFA World Cup 2026 matches scheduled at this hub?" }
        ];
      case "VOLUNTEER":
        return [
          { label: "Queue Length Guidelines", query: "How long can spectator queues get before we trigger a congestion warning?" },
          { label: "Trouble Booth Reroutes", query: "A ticket scan failed completely. What are my volunteer rerouting procedures?" },
          { label: "Medical Aid Station", query: "Where are the first aid concourse hubs for rapid assistance?" },
          { label: "Spectator Directions", query: "How should I guide a spectator looking for Sections 104 and 220?" }
        ];
      case "VENUE_STAFF":
        return [
          { label: "Gate C Flow Divert", query: "Gate C entry rate is approaching 520 entries in 5 minutes. What is the staff action protocol?" },
          { label: "Emergency Dispatch Code", query: "What are the rules for requesting central medical dispatch coordination?" },
          { label: "Security Bag Confiscation", query: "A spectator brought an oversized canvas backpack. What are my rules for bag confiscation?" },
          { label: "Stadium Capacity Limits", query: "What are the safe seating limits and concourse flow requirements?" }
        ];
      case "ORGANIZER":
        return [
          { label: "Operational Compliance Override", query: "What are the regional coordinator guidelines for stadium rule overrides?" },
          { label: "Vendor Compliance Auditing", query: "How do we audit third-party food vendor safety and ingredient lists?" },
          { label: "Firewall & Security Protocols", query: "What logs are recorded when spectators trigger automated firewall alerts?" },
          { label: "Incident Escalation Matrix", query: "What is the official path for escalating high-priority safety incidents?" }
        ];
      default:
        return [
          { label: "General Rules", query: "What are the core stadium safety rules for FIFA World Cup 2026?" },
          { label: "Clear Bag Policy", query: "Can you explain the clear bag restrictions?" }
        ];
    }
  };

  const presets = getPresetsForRole();

  return (
    <div className="bg-[#0b0e12] border border-[#1b2531] rounded-lg p-5 shadow-2xl flex flex-col gap-4 font-mono select-none h-[650px] overflow-hidden">
      
      {/* Tactical Cyber-Deck Header */}
      <div className="border-b border-[#1b2531] pb-3.5 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-950/80 border border-blue-800/40 rounded text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.1)]">
            <MessageSquare className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold text-slate-100 uppercase tracking-widest">
                {getTranslation("gemini_compliance_chatbot", selectedLanguage)}
              </h2>
              <span className="text-[8px] bg-blue-950 text-blue-400 border border-blue-800/40 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider animate-pulse">
                SECURED
              </span>
            </div>
            <p className="text-[9px] text-slate-500 uppercase tracking-wide mt-0.5 flex items-center gap-1">
              <span>FIFA WC 2026 AI AGENT</span>
              <span>•</span>
              <span className="text-slate-400">ROLE: {currentSessionRole || "SPECTATOR"}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[8.5px] text-slate-400 bg-slate-950/60 border border-[#1b2531] px-2.5 py-1.5 rounded-md leading-relaxed">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-emerald-400 font-extrabold">FIREWALL: ON</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="w-3 h-3 text-blue-400" />
            <span>WC-2026-REG</span>
          </div>
        </div>
      </div>

      {/* Safety Warning Banner */}
      <div className="bg-blue-950/20 border border-blue-900/40 p-2.5 rounded-lg flex items-start gap-2.5 text-[10px] text-blue-300 leading-relaxed">
        <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <div>
          <strong>STRICT TOURNAMENT BOUNDARIES IN EFFECT:</strong> This AI assistant is strictly engineered to ONLY resolve inquiries related directly to official <strong>FIFA World Cup 2026™</strong> stadium rules, match schedules, concessions, and venue safety. Any attempt to bypass safety guidelines, request off-topic code, or inject illegal overrides will trigger a secure system lockout warning.
        </div>
      </div>

      {/* Message Feed Canvas */}
      <div className="flex-1 overflow-y-auto min-h-0 bg-[#07090c]/80 border border-[#1b2531]/40 rounded-lg p-4 space-y-4 font-sans text-xs scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {chatMessages.map((msg, idx) => {
          const isUser = msg.role === "user";
          return (
            <div 
              key={idx} 
              className={`flex gap-3 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
            >
              {/* Avatar Icon */}
              <div className={`w-7 h-7 rounded-lg shrink-0 border flex items-center justify-center text-xs shadow-md ${
                isUser 
                  ? "bg-slate-900 border-slate-700 text-slate-300" 
                  : "bg-blue-950/80 border-blue-800/40 text-blue-400"
              }`}>
                {isUser ? <User className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
              </div>

              {/* Text Bubble */}
              <div className={`p-3 rounded-xl border text-[11.5px] leading-relaxed shadow-sm ${
                isUser
                  ? "bg-slate-950/80 border-[#1b2531] text-slate-100 rounded-tr-none"
                  : msg.text.startsWith("🚨") || msg.text.startsWith("⚠️") || msg.text.startsWith("❌")
                    ? "bg-red-950/20 border-red-900/40 text-red-300 rounded-tl-none shadow-[0_0_15px_rgba(239,68,68,0.05)]"
                    : "bg-[#0b1016] border-[#151d27] text-slate-200 rounded-tl-none"
              }`}>
                {/* Simple Markdown & Link/Alert Formatting */}
                <div className="space-y-1.5 whitespace-pre-wrap">
                  {msg.text.split("\n").map((line, lIdx) => {
                    // Check bold markdown formatting

                    const boldRegex = /\*\*(.*?)\*\*/g;
                    const parts = [];
                    let lastIdx = 0;
                    let match;
                    
                    while ((match = boldRegex.exec(line)) !== null) {
                      if (match.index > lastIdx) {
                        parts.push(line.substring(lastIdx, match.index));
                      }
                      parts.push(
                        <strong key={match.index} className="text-white font-extrabold font-mono text-[10px] tracking-wide px-1 py-0.5 bg-slate-950 border border-slate-900 rounded mx-0.5">
                          {match[1]}
                        </strong>
                      );
                      lastIdx = boldRegex.lastIndex;
                    }
                    if (lastIdx < line.length) {
                      parts.push(line.substring(lastIdx));
                    }

                    return (
                      <p key={lIdx}>
                        {parts.length > 0 ? parts : line}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {isChatLoading && (
          <div className="flex gap-3 max-w-[85%] mr-auto items-center">
            <div className="w-7 h-7 rounded-lg bg-cyan-950/80 border border-cyan-800/40 flex items-center justify-center text-cyan-400 shadow-md">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className="bg-[#0b1016]/60 border border-[#151d27]/40 p-3 rounded-xl rounded-tl-none text-[11px] text-slate-400 italic animate-pulse">
              Gemini Security Kernel analyzing compliance regulations...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Dynamic Role Presets / Suggestions */}
      <div className="space-y-1.5">
        <span className="text-[8px] text-slate-500 uppercase font-bold tracking-wider block">
          SUGGESTED COMPLIANCE PRESETS ({currentSessionRole}):
        </span>
        <div className="flex flex-wrap gap-1.5">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handlePresetClick(p.query)}
              disabled={isChatLoading}
              className="px-2.5 py-1.5 bg-slate-950/60 hover:bg-slate-900 border border-[#1b2531] hover:border-blue-500/30 text-slate-300 hover:text-blue-400 rounded text-[9.5px] cursor-pointer transition-all truncate max-w-full"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input controls block */}
      <div className="flex items-center gap-2 pt-2 border-t border-[#1b2531]/40">
        <div className="relative flex-1">
          <label htmlFor="stadium-chat-input" className="sr-only">
            Ask about World Cup policies, bag regulation, restroom locations, and schedules
          </label>
          <input
            id="stadium-chat-input"
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value.slice(0, 300))}
            onKeyDown={handleKeyPress}
            placeholder={
              isChatLoading 
                ? "Analyzing compliance context..." 
                : "Ask about World Cup clear bags, tickets, gates, schedules..."
            }
            disabled={isChatLoading}
            className="w-full bg-[#07090c] border border-[#1b2531] focus:border-blue-500/50 rounded-lg pl-3 pr-14 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none transition-colors"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] text-slate-600 font-bold">
            {chatInput.length}/300
          </span>
        </div>

        <button
          id="stadium-chat-submit-btn"
          onClick={handleSubmit}
          disabled={!chatInput.trim() || isChatLoading}
          aria-label="Submit secure compliance query"
          className={`p-2.5 rounded-lg border flex items-center justify-center transition-all duration-200 cursor-pointer ${
            chatInput.trim() && !isChatLoading
              ? "bg-blue-950 border-blue-500/40 hover:border-blue-400 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)] hover:scale-105"
              : "bg-slate-950 border-[#1b2531] text-slate-600"
          }`}
          title="Submit secure compliance query"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
