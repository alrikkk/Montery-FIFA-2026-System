import React from "react";
import {
  LayoutDashboard,
  Terminal,
  BookOpen,
  Cpu,
  ShieldAlert,
  Users,
  MessageSquare
} from "lucide-react";
import { MonteryLanguageDropdown } from "./MonteryLanguageDropdown";
import { getTranslation } from "../utils/localization";

interface SidebarNavigationProps {
  currentView: "DASHBOARD" | "COMMAND" | "CORPUS" | "PAYLOAD" | "LOGS" | "REGISTRY" | "CHAT";
  setCurrentView: (view: "DASHBOARD" | "COMMAND" | "CORPUS" | "PAYLOAD" | "LOGS" | "REGISTRY" | "CHAT") => void;
  logsCount: number;
  hasEngineResult: boolean;
  fanAccountsList?: unknown[];
  onRefreshFans?: () => void;
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
}

export default function SidebarNavigation({
  currentView,
  setCurrentView,
  logsCount,
  hasEngineResult,
  fanAccountsList = [],
  onRefreshFans: _,
  selectedLanguage,
  onLanguageChange
}: SidebarNavigationProps) {
  const menuItems = [
    {
      id: "DASHBOARD" as const,
      label: "3D DIGITAL TWIN",
      translationKey: "nav_digital_twin",
      icon: LayoutDashboard,
      status: "ONLINE",
      color: "text-cyan-400",
      glowColor: "rgba(34, 211, 238, 0.15)",
      borderColor: "border-cyan-500/20"
    },
    {
      id: "COMMAND" as const,
      label: "COMMAND CONSOLE",
      translationKey: "nav_command_console",
      icon: Terminal,
      status: "READY",
      color: "text-emerald-400",
      glowColor: "rgba(16, 185, 129, 0.15)",
      borderColor: "border-emerald-500/20"
    },
    {
      id: "CORPUS" as const,
      label: "STADIUM CORPUS",
      translationKey: "nav_stadium_corpus",
      icon: BookOpen,
      status: "INDEXED",
      color: "text-amber-400",
      glowColor: "rgba(245, 158, 11, 0.15)",
      borderColor: "border-amber-500/20"
    },
    {
      id: "REGISTRY" as const,
      label: "SPECTATOR REGISTRY",
      translationKey: "nav_spectator_registry",
      icon: Users,
      status: fanAccountsList.length > 0 ? `${fanAccountsList.length} REG` : "EMPTY",
      color: "text-sky-400",
      glowColor: "rgba(14, 165, 233, 0.15)",
      borderColor: "border-sky-500/20"
    },
    {
      id: "PAYLOAD" as const,
      label: "ENGINE DECODER",
      translationKey: "nav_engine_decoder",
      icon: Cpu,
      status: hasEngineResult ? "DECODED" : "STANDBY",
      color: "text-purple-400",
      glowColor: "rgba(168, 85, 247, 0.15)",
      borderColor: "border-purple-500/20"
    },
    {
      id: "LOGS" as const,
      label: "FIREWALL LOGS",
      translationKey: "nav_firewall_logs",
      icon: ShieldAlert,
      status: logsCount > 0 ? `${logsCount} BUFS` : "CLEAR",
      color: "text-red-400",
      glowColor: "rgba(239, 68, 68, 0.15)",
      borderColor: "border-red-500/20"
    },
    {
      id: "CHAT" as const,
      label: "GEMINI STADIUM CHAT",
      translationKey: "nav_stadium_chat",
      icon: MessageSquare,
      status: "SECURE AI",
      color: "text-cyan-400",
      glowColor: "rgba(34, 211, 238, 0.15)",
      borderColor: "border-cyan-500/20"
    }
  ];

  return (
    <div className="w-full lg:w-64 bg-[#0b0e12]/95 border border-[#1b2531] rounded-lg p-3 shadow-2xl flex flex-col gap-4 font-mono select-none h-fit">
      <div className="border-b border-[#1b2531] pb-3 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>{getTranslation("mux_control_panel", selectedLanguage)}</span>
          </div>
        </div>
        <p className="text-[9px] text-slate-400 uppercase tracking-wide">
          {getTranslation("fifa_tactical_deck", selectedLanguage)}
        </p>
        <MonteryLanguageDropdown selectedLanguage={selectedLanguage} onLanguageChange={onLanguageChange} inline={true} className="border border-[#1b2531]/60 bg-slate-950/50 hover:border-slate-700 w-full justify-between" />
      </div>

      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              aria-label={getTranslation(item.translationKey, selectedLanguage) || item.label}
              className={`group relative flex flex-col p-3 rounded border text-left transition-all duration-300 cursor-pointer ${
                isActive
                  ? `bg-[#0e1319] border-cyan-500/60 shadow-[0_0_15px_${item.glowColor}]`
                  : `bg-slate-950/40 border-[#1b2531]/60 hover:bg-slate-900/40 hover:border-slate-800`
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-1.5 rounded bg-slate-950 border border-[#1b2531] ${
                    isActive ? item.color : "text-slate-400 group-hover:text-slate-300"
                  } transition-colors duration-200`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-[10.5px] font-bold tracking-wider ${
                      isActive ? "text-slate-100" : "text-slate-400 group-hover:text-slate-200"
                    } transition-colors duration-200`}
                  >
                    {getTranslation(item.translationKey, selectedLanguage)}
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-[8px] text-slate-200 font-semibold tracking-wide">
                      {getTranslation("nav_status", selectedLanguage)}:
                    </span>
                    <span
                      className={`text-[8.5px] font-extrabold tracking-widest ${
                        isActive ? item.color : "text-slate-200"
                      } uppercase`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Decorative side accent lines matching our tactical theme */}
              {isActive && (
                <div className="absolute left-0 top-1/4 bottom-1/4 w-[2px] bg-cyan-400" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Mini Diagnostic readout */}
      <div className="bg-[#07090c] border border-[#1b2530] p-2.5 rounded text-[8.5px] select-none leading-relaxed text-slate-200">
        <div className="flex justify-between">
          <span>PORT INGRESS:</span>
          <span className="text-emerald-400 font-bold">3000/TCP</span>
        </div>
        <div className="flex justify-between">
          <span>DECK MATRIX:</span>
          <span className="text-cyan-400 font-bold">SECURED</span>
        </div>
        <div className="flex justify-between">
          <span>ACTIVE CORES:</span>
          <span className="text-slate-300 font-bold">8 / 8 THREADS</span>
        </div>
      </div>
    </div>
  );
}
