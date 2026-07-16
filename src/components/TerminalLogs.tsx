import React from "react";
import { Terminal, Shield, CheckCircle, AlertTriangle, Cpu } from "lucide-react";
import { getTranslation } from "../utils/localization";

export interface LogEntry {
  id: string;
  timestamp: string;
  query: string;
  blocked: boolean;
  blockReason: string | null;
  persona: string;
  language: string;
  urgency: string;
  cameraZone: string;
}

interface TerminalLogsProps {
  logs: LogEntry[];
  onClearLogs: () => void;
  selectedLanguage?: string;
}

export default function TerminalLogs({ logs, onClearLogs, selectedLanguage = "en" }: TerminalLogsProps) {
  return (
    <div className="bg-[#0b0e12] border border-[#1b2531] rounded-lg p-4 font-mono select-none shadow-lg h-[260px] flex flex-col">
      <div className="flex items-center justify-between mb-2 border-b border-[#1b2531] pb-2">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-widest">
            {getTranslation("firewall_security_logs", selectedLanguage)}
          </h3>
        </div>
        <button
          onClick={onClearLogs}
          aria-label="Purge security logs archive"
          className="text-[10px] text-slate-400 hover:text-red-400 font-mono transition border border-slate-800 hover:border-red-900 px-2 py-0.5 rounded bg-slate-900/40"
        >
          SYS_PURGE_LOGS
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-slate-800">
        {logs.length === 0 ? (
          <div className="text-[11px] text-slate-400 h-full flex flex-col items-center justify-center space-y-1">
            <Cpu className="w-5 h-5 text-slate-400 animate-pulse" />
            <span>STANDBY // CORE SECURITY FIRMWARE ONLINE</span>
            <span>NO ACTIVE PENETRATIONS OR TRAFFIC DETECTED</span>
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className={`text-[10px] p-2 rounded border transition leading-relaxed ${
                log.blocked
                  ? "bg-red-950/20 border-red-900/50 text-red-400"
                  : "bg-slate-950/40 border-slate-900/60 text-slate-300"
              }`}
            >
              <div className="flex items-center justify-between mb-1 text-[9px] text-slate-400">
                <span className="flex items-center gap-1 font-semibold text-slate-400">
                  {log.blocked ? (
                    <Shield className="w-3 h-3 text-red-500 animate-pulse" />
                  ) : (
                    <CheckCircle className="w-3 h-3 text-emerald-500" />
                  )}
                  {log.blocked ? "TERMINATE_AND_BLOCK" : "ALLOW_PAYLOAD"}
                </span>
                <span>{log.timestamp}</span>
              </div>

              <div className="mb-1 text-xs">
                <span className="text-slate-400 font-bold font-sans">Query:</span> "{log.query}"
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[9px] text-slate-400 border-t border-slate-900/40 pt-1 mt-1">
                <div>
                  STREAM: <span className="text-slate-200 font-semibold">{log.persona}</span>
                </div>
                <div>
                  LANG: <span className="text-slate-200 font-semibold uppercase">{log.language}</span>
                </div>
                <div>
                  URGENCY: <span className="text-slate-200 font-semibold">{log.urgency}</span>
                </div>
                <div>
                  ZONE_TRANSIT: <span className="text-cyan-400 font-semibold">{log.cameraZone}</span>
                </div>
              </div>

              {log.blocked && (
                <div className="mt-1 pt-1 border-t border-red-950 text-red-500 font-semibold uppercase text-[9px] flex items-center gap-1">
                  <AlertTriangle className="w-2.5 h-2.5 text-red-500" />
                  VIOLATION: {log.blockReason || "KERNEL FIREWALL RULE BREACH"}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
