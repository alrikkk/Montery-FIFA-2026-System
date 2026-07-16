/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { motion } from "motion/react";
import {
  Download,
  ChevronDown,
  History,
  ShieldAlert,
  Sliders,
  Lock,
  Wrench,
  AlertTriangle,
  Activity,
  Globe,
  Utensils,
  BellRing,
  Volume2,
  Zap,
  Check,
  Copy,
  Database,
  FileSpreadsheet,
  Video,
  Terminal
} from "lucide-react";
import DensityTrendChart from "./DensityTrendChart";

// Small spinning matrix-themed icon that dynamically changes shape based on matrixCoreText status
interface MatrixIconProps {
  status: string;
  isSpinning: boolean;
}

const MatrixIcon = ({ status, isSpinning }: MatrixIconProps) => {
  const isSecured = status === "SECURED";
  return (
    <motion.div
      className="relative w-4 h-4 flex items-center justify-center shrink-0"
      animate={{
        scale: isSecured ? 1 : [1, 1.25, 1],
        rotate: isSpinning ? 360 : 0,
      }}
      transition={{
        rotate: isSpinning 
          ? { repeat: Infinity, duration: 3, ease: "linear" } 
          : { duration: 0.5 },
        scale: isSecured
          ? {
              type: "spring",
              stiffness: 300,
              damping: 15,
            }
          : {
              type: "keyframes",
              ease: "easeInOut",
              duration: 1.5,
              repeat: Infinity,
            }
      }}
    >
      <motion.svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0"
      >
        <motion.g
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{
            color: isSecured ? "#34d399" : "#fbbf24", // emerald-400 vs amber-400
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Main morphing outer outline path between Hexagon and Orbital Circle/Square */}
          <motion.path
            d={
              isSecured
                ? "M 8 1.5 L 14 4.5 L 14 11.5 L 8 14.5 L 2 11.5 L 2 4.5 Z"
                : "M 8 1.5 C 11.585 1.5 14.5 4.415 14.5 8 C 14.5 11.585 11.585 14.5 8 14.5 C 4.415 14.5 1.5 11.585 1.5 8 C 1.5 4.415 4.415 1.5 8 1.5 Z"
            }
            animate={{
              strokeDasharray: isSecured ? "0" : "3 2",
            }}
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 18,
            }}
          />

          {/* Inner core matrix grids/lines that morph */}
          <motion.path
            d={
              isSecured
                ? "M 8 4.5 L 8 11.5 M 4.5 8 L 11.5 8"
                : "M 5.5 5.5 L 10.5 5.5 L 10.5 10.5 L 5.5 10.5 Z"
            }
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 18,
            }}
          />

          {/* Central security node point */}
          <motion.circle
            cx="8"
            cy="8"
            animate={{
              r: isSecured ? 1.5 : 1,
              fillOpacity: isSecured ? 1 : 0.6,
            }}
            fill="currentColor"
            transition={{ duration: 0.3 }}
          />
        </motion.g>
      </motion.svg>
    </motion.div>
  );
};

interface EngineOutputModuleProps {
  isAnalyzing: boolean;
  engineResult: any;
  incidentHistory: any[];
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  activeTab: "visuals" | "json";
  setActiveTab: (tab: "visuals" | "json") => void;
  atmosphericInterference: string;
  currentWeather: string;
  isBlockedResult: boolean;
  detectedPersona: string;
  densityHistory: any[];
  dispatchedAction: { action: string; timestamp: string } | null;
  setDispatchedAction: (action: { action: string; timestamp: string } | null) => void;
  playDispatchSuccessSound: () => void;
  handleCopyJSON: () => void;
  copied: boolean;
  isExportMenuOpen: boolean;
  setIsExportMenuOpen: (open: boolean) => void;
  exportTelemetryAsJSON: () => void;
  exportTelemetryAsCSV: () => void;
  setCurrentView: (view: "DASHBOARD" | "COMMAND" | "CORPUS" | "PAYLOAD" | "LOGS") => void;
  matrixCoreText: "SECURED" | "THROTTLED" | "ATTACK";
  analysisStep: string;
}

export default function EngineOutputModule({
  isAnalyzing,
  engineResult,
  incidentHistory,
  isSidebarOpen: _,
  setIsSidebarOpen,
  activeTab,
  setActiveTab,
  atmosphericInterference,
  currentWeather,
  isBlockedResult,
  detectedPersona,
  densityHistory,
  dispatchedAction,
  setDispatchedAction,
  playDispatchSuccessSound,
  handleCopyJSON,
  copied,
  isExportMenuOpen,
  setIsExportMenuOpen,
  exportTelemetryAsJSON,
  exportTelemetryAsCSV,
  setCurrentView,
  matrixCoreText,
  analysisStep
}: EngineOutputModuleProps) {
  return (
    <div className="flex-1 flex flex-col min-h-[300px] relative">
      {isAnalyzing && (
        <>
          {/* Dynamic pixelated outer glow behind the card */}
          <motion.div
            animate={{
              opacity: [0.4, 0.85, 0.4],
              scale: [0.99, 1.015, 0.99]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -inset-[4px] rounded-xl pointer-events-none -z-10"
            style={{
              boxShadow: matrixCoreText === "SECURED"
                ? `
                  0 -4px 0 0 rgba(16, 185, 129, 0.7),
                  0 4px 0 0 rgba(16, 185, 129, 0.7),
                  -4px 0 0 0 rgba(16, 185, 129, 0.7),
                  4px 0 0 0 rgba(16, 185, 129, 0.7),
                  0 -8px 0 0 rgba(16, 185, 129, 0.4),
                  0 8px 0 0 rgba(16, 185, 129, 0.4),
                  -8px 0 0 0 rgba(16, 185, 129, 0.4),
                  8px 0 0 0 rgba(16, 185, 129, 0.4),
                  4px 4px 0 0 rgba(16, 185, 129, 0.4),
                  -4px 4px 0 0 rgba(16, 185, 129, 0.4),
                  4px -4px 0 0 rgba(16, 185, 129, 0.4),
                  -4px -4px 0 0 rgba(16, 185, 129, 0.4)
                `
                : `
                  0 -4px 0 0 rgba(245, 158, 11, 0.7),
                  0 4px 0 0 rgba(245, 158, 11, 0.7),
                  -4px 0 0 0 rgba(245, 158, 11, 0.7),
                  4px 0 0 0 rgba(245, 158, 11, 0.7),
                  0 -8px 0 0 rgba(245, 158, 11, 0.4),
                  0 8px 0 0 rgba(245, 158, 11, 0.4),
                  -8px 0 0 0 rgba(245, 158, 11, 0.4),
                  8px 0 0 0 rgba(245, 158, 11, 0.4),
                  4px 4px 0 0 rgba(245, 158, 11, 0.4),
                  -4px 4px 0 0 rgba(245, 158, 11, 0.4),
                  4px -4px 0 0 rgba(245, 158, 11, 0.4),
                  -4px -4px 0 0 rgba(245, 158, 11, 0.4)
                `
            }}
          />
          {/* Pixel corner structural nodes */}
          <div className="absolute -top-[5px] -left-[5px] w-2.5 h-2.5 bg-[#0b0e12] border border-slate-700 -z-10 flex items-center justify-center">
            <div className={`w-1 h-1 ${matrixCoreText === "SECURED" ? "bg-emerald-400" : "bg-amber-400"} animate-pulse`} />
          </div>
          <div className="absolute -top-[5px] -right-[5px] w-2.5 h-2.5 bg-[#0b0e12] border border-slate-700 -z-10 flex items-center justify-center">
            <div className={`w-1 h-1 ${matrixCoreText === "SECURED" ? "bg-emerald-400" : "bg-amber-400"} animate-pulse`} />
          </div>
          <div className="absolute -bottom-[5px] -left-[5px] w-2.5 h-2.5 bg-[#0b0e12] border border-slate-700 -z-10 flex items-center justify-center">
            <div className={`w-1 h-1 ${matrixCoreText === "SECURED" ? "bg-emerald-400" : "bg-amber-400"} animate-pulse`} />
          </div>
          <div className="absolute -bottom-[5px] -right-[5px] w-2.5 h-2.5 bg-[#0b0e12] border border-slate-700 -z-10 flex items-center justify-center">
            <div className={`w-1 h-1 ${matrixCoreText === "SECURED" ? "bg-emerald-400" : "bg-amber-400"} animate-pulse`} />
          </div>
        </>
      )}

      <motion.div
        key={isAnalyzing ? "analyzing" : engineResult ? `decoded-${engineResult.query || "result"}-${engineResult.system_diagnostics?.confidence_score || 0}` : "idle"}
        initial={{ x: 28, opacity: 0.9 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 22, stiffness: 140 }}
        className={`bg-[#0b0e12] border rounded-lg shadow-xl overflow-hidden flex-1 flex flex-col min-h-[300px] relative transition-colors duration-300 ${
          isAnalyzing 
            ? matrixCoreText === "SECURED" 
              ? "border-emerald-500/50" 
              : "border-amber-500/50"
            : "border-[#1b2531]"
        }`}
      >
        {isAnalyzing && (
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.06] mix-blend-overlay z-20" 
            style={{
              backgroundImage: `radial-gradient(${matrixCoreText === "SECURED" ? "#10b981" : "#f59e0b"} 25%, transparent 25%)`,
              backgroundSize: "4px 4px",
            }}
          />
        )}
        <div className="bg-[#0e1319] border-b border-[#1b2531] px-4 py-2 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <MatrixIcon status={isAnalyzing ? matrixCoreText : "SECURED"} isSpinning={isAnalyzing} />
            <h2 className="text-xs font-semibold text-slate-200 uppercase tracking-widest font-mono">
              Engine Output Decoded Payload
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {/* Export Telemetry Dropdown / Button */}
            <div className="relative">
              <button
                onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                disabled={!engineResult}
                aria-label="Export Current Telemetry as CSV or JSON"
                className={`border text-[9px] font-mono font-bold px-2.5 py-0.5 rounded flex items-center gap-1.5 transition select-none cursor-pointer ${
                  engineResult
                    ? "bg-slate-950 hover:bg-slate-900 border-[#2b3a4a] hover:border-slate-700 text-amber-400 hover:text-amber-300"
                    : "bg-slate-950/40 border-slate-950 text-slate-400 cursor-not-allowed opacity-50"
                }`}
                title={engineResult ? "Export Current Telemetry as CSV or JSON" : "No telemetry data available to export"}
              >
                <Download className={`w-3 h-3 text-amber-500 shrink-0 ${engineResult ? "animate-pulse" : ""}`} />
                <span>EXPORT TELEMETRY</span>
                <ChevronDown className={`w-2.5 h-2.5 transition-transform duration-200 text-slate-400 ${isExportMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {isExportMenuOpen && engineResult && (
                <>
                  {/* Click-away backdrop */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsExportMenuOpen(false)} 
                  />
                  {/* Menu */}
                  <div className="absolute right-0 mt-1.5 w-40 bg-[#0e1319] border border-[#1b2531] rounded-md shadow-2xl z-50 py-1 font-mono text-[10px] text-slate-300 divide-y divide-[#1b2531]/50 overflow-hidden">
                    <button
                      onClick={() => {
                        exportTelemetryAsJSON();
                        setIsExportMenuOpen(false);
                      }}
                      aria-label="Export telemetry as JSON file"
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-900 hover:text-cyan-400 flex items-center gap-2 transition"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      <span>Export as JSON</span>
                    </button>
                    <button
                      onClick={() => {
                        exportTelemetryAsCSV();
                        setIsExportMenuOpen(false);
                      }}
                      aria-label="Export telemetry as CSV spreadsheet"
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-900 hover:text-amber-400 flex items-center gap-2 transition"
                    >
                      <FileSpreadsheet className="w-3 h-3 text-amber-500" />
                      <span>Export as CSV</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open Tactical Incident History Logs"
              className="bg-slate-950 hover:bg-slate-900 border border-slate-900 hover:border-slate-850 text-[9px] font-mono text-cyan-400 hover:text-cyan-300 font-bold px-2 py-0.5 rounded flex items-center gap-1.5 transition select-none cursor-pointer"
              title="Open Tactical Incident History Logs"
            >
              <History className="w-3 h-3 text-cyan-500 shrink-0" />
              <span>HISTORY LOGS ({incidentHistory.length})</span>
            </button>
            <div className="flex bg-slate-950/80 p-0.5 rounded border border-slate-900 text-[9px] font-mono">
              <button
                onClick={() => setActiveTab("visuals")}
                aria-label="View decoded visuals tab"
                className={`px-2 py-0.5 rounded ${activeTab === "visuals" ? "bg-slate-800 text-cyan-400 font-bold" : "text-slate-400"}`}
              >
                DECODED
              </button>
              <button
                onClick={() => setActiveTab("json")}
                aria-label="View raw JSON data tab"
                className={`px-2 py-0.5 rounded ${activeTab === "json" ? "bg-slate-800 text-cyan-400 font-bold" : "text-slate-400"}`}
              >
                RAW JSON
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col justify-between overflow-y-auto max-h-[580px] scrollbar-thin scrollbar-thumb-slate-800">
          {isAnalyzing ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4 py-12 font-mono">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-4 border-emerald-950 border-t-cyan-500 animate-spin" />
                <Lock className="w-4 h-4 text-emerald-400 absolute inset-0 m-auto animate-pulse" />
              </div>
              <div className="text-center space-y-1.5">
                <p className="text-xs text-cyan-400 tracking-widest uppercase font-semibold animate-pulse">
                  {analysisStep}
                </p>
                <p className="text-[10px] text-slate-400">
                  SECURED ENVELOPE ENCRYPTED WITH MULTI-STAGE AES-256
                </p>
              </div>
            </div>
          ) : !engineResult ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-12 text-slate-400 font-mono text-[11px]">
              <ShieldAlert className="w-8 h-8 text-slate-400 animate-bounce" />
              <div className="space-y-1">
                <span className="block font-bold">AWAITING SYSTEM INJECTION RUN</span>
                <span className="block text-slate-400 text-[10px]">PLEASE GO TO THE 'COMMAND CONSOLE' PAGE TO SUBMIT A QUERY</span>
              </div>
              <button
                onClick={() => setCurrentView("COMMAND")}
                aria-label="Open Command Console to run query"
                className="px-4 py-2 bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-800/80 rounded text-xs font-bold transition flex items-center gap-1.5 cursor-pointer uppercase"
              >
                <Terminal className="w-3.5 h-3.5 animate-pulse" />
                <span>Open Command Console</span>
              </button>
            </div>
          ) : (
            <>
              {/* TAB 1: Visual high-fidelity decodings */}
              {activeTab === "visuals" ? (
                <div className="space-y-4">
                  {/* Atmospheric Interference High-Level Facade Advisory Banner */}
                  {(() => {
                    const match = atmosphericInterference.match(/\(([^)]+)\)/);
                    const val = match ? parseFloat(match[1]) : 0.05;
                    if (val > 0.70) {
                      const isFog = currentWeather === "FOG";
                      return (
                        <motion.div 
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-lg space-y-2.5 font-mono shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                        >
                          <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
                              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                                FACADE ATMOSPHERIC INTERFERENCE ADVISORY
                              </span>
                            </div>
                            <span className="bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[8px] px-1.5 py-0.2 rounded font-bold animate-pulse">
                              LEVEL: {val.toFixed(2)} / {atmosphericInterference.split(" ")[0]}
                            </span>
                          </div>
                          
                          <p className="text-[10px] text-slate-300 leading-relaxed">
                            The atmospheric interference coefficient is currently <span className="text-amber-300 font-bold">{val.toFixed(2)}</span>, exceeding the safety threshold of <span className="text-slate-400 font-semibold">0.70</span>. The stadium facade structural-environmental system requires immediate maintenance routing:
                          </p>

                          <div className="bg-slate-950/90 border border-amber-950/80 p-2.5 rounded space-y-2 text-[10px]">
                            <div className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                              <Wrench className="w-3 h-3 text-amber-400" /> RECOMMENDED FACADE MAINTENANCE TASKS:
                            </div>
                            <div className="space-y-1.5 pl-1">
                              {isFog ? (
                                <>
                                  <div className="flex items-start gap-2 text-slate-300">
                                    <span className="text-amber-400 shrink-0 select-none mt-0.5">•</span>
                                    <div>
                                      <span className="text-white font-semibold">Moisture & Condensation Runoff Audit:</span> Inspect and verify drainage clearance in the secondary ETFE joint-seal channels to prevent internal pooling.
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-2 text-slate-300">
                                    <span className="text-amber-400 shrink-0 select-none mt-0.5">•</span>
                                    <div>
                                      <span className="text-white font-semibold">Calibrate Optoelectronic Sensors:</span> Trigger a lens purge and clean cycle on the facade-mounted LiDAR/spectroscopic telemetry scanners to offset fog scattering.
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-2 text-slate-300">
                                    <span className="text-amber-400 shrink-0 select-none mt-0.5">•</span>
                                    <div>
                                      <span className="text-white font-semibold">Activate Fog-Penetrating Beacons:</span> Initiate secondary high-visibility facade illumination nodes on the steel ribbon structure for wayfinding safety.
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="flex items-start gap-2 text-slate-300">
                                    <span className="text-amber-400 shrink-0 select-none mt-0.5">•</span>
                                    <div>
                                      <span className="text-white font-semibold">Engage Facade De-Icing Subgrid:</span> Energize the heat-conduction element channels on the outermost facade panels to eliminate structural ice-dam weight load.
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-2 text-slate-300">
                                    <span className="text-amber-400 shrink-0 select-none mt-0.5">•</span>
                                    <div>
                                      <span className="text-white font-semibold">Structural Strain Telemetry Calibration:</span> Cross-reference mechanical stress and strain gauges on the facade cantilever truss assemblies under sub-zero loading.
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-2 text-slate-300">
                                    <span className="text-amber-400 shrink-0 select-none mt-0.5">•</span>
                                    <div>
                                      <span className="text-white font-semibold">Inspect Expansion Joint Seals:</span> Execute an automated pressure-flex audit on structural seals to verify performance under thermal contraction.
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    }
                    return null;
                  })()}

                  {/* Firewall Status Alert Banner */}
                  <div className={`p-3 rounded border font-mono ${
                    isBlockedResult 
                      ? "bg-red-950/20 border-red-500/30 text-red-400" 
                      : "bg-emerald-950/10 border-emerald-500/30 text-emerald-400"
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Lock className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        FIREWALL CLASSIFICATION: {engineResult.security_firewall_status?.firewall_action_taken}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-300 space-y-1 leading-relaxed pl-6">
                      <div>• Out-of-Scope Stadium Filter: <span className={engineResult.security_firewall_status?.out_of_scope_query ? "text-red-400 font-bold" : "text-emerald-400"}>
                        {engineResult.security_firewall_status?.out_of_scope_query ? "BLOCKED_VIOLATION" : "PASS"}
                      </span></div>
                      <div>• Prompt-Injection Override Guard: <span className={engineResult.security_firewall_status?.malicious_injection_detected ? "text-red-400 font-bold" : "text-emerald-400"}>
                        {engineResult.security_firewall_status?.malicious_injection_detected ? "MALICIOUS_INJECTION_DETECTED" : "PASS"}
                      </span></div>
                      <div>• Contextual Telemetry Rate Limit: <span className={engineResult.security_firewall_status?.rate_limit_breached ? "text-red-400 font-bold" : "text-emerald-400"}>
                        {engineResult.security_firewall_status?.rate_limit_breached ? "LIMIT_BREACHED_THROTTLE" : "PASS"}
                      </span></div>
                    </div>
                  </div>

                  {/* If Blocked, show threat banner */}
                  {isBlockedResult ? (
                    <div className="p-3 bg-red-950/10 border border-red-900/40 rounded space-y-1.5">
                      <h4 className="text-xs font-bold text-red-500 uppercase tracking-widest font-mono flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4" /> SECURITY TERMINATION PROTOCOL 99
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Matrix intelligence has successfully self-audited and terminated this session payload. No operational coordinates have been exposed to the requester. Terminal has entered restricted fallback status.
                      </p>
                    </div>
                  ) : (
                    /* If Allowed, show full payload analytics */
                    <div className="space-y-4 font-mono text-[11px]">
                      {/* Stream Routing metadata */}
                      <div className="grid grid-cols-2 gap-2 bg-[#0d131a] p-2.5 rounded border border-[#1b2530]">
                        <div>
                          <span className="text-slate-400 uppercase">Routing Stream:</span>
                          <div className={`font-bold mt-0.5 text-xs ${detectedPersona === "STAFF_STREAM" ? "text-amber-400" : "text-cyan-400"}`}>
                            {detectedPersona || "UNKNOWN"}
                          </div>
                        </div>
                        <div>
                          <span className="text-slate-400 uppercase">Urgency Assessment:</span>
                          <div className={`font-bold mt-0.5 text-xs ${
                            engineResult.routing_metadata?.perceived_urgency_tier === "HIGH" || 
                            engineResult.routing_metadata?.perceived_urgency_tier === "CRITICAL"
                              ? "text-red-400 animate-pulse" : "text-emerald-400"
                          }`}>
                            {engineResult.routing_metadata?.perceived_urgency_tier || "LOW"}
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className="text-slate-400 uppercase font-sans">Input Language:</span>
                          <div className="text-slate-200 mt-0.5 text-[10px] font-semibold uppercase">
                            {engineResult.routing_metadata?.input_language || "en"}
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className="text-slate-400 uppercase">Confidence Score:</span>
                          <div className="text-slate-200 mt-0.5 text-[10px] font-semibold">
                            {engineResult.system_diagnostics?.confidence_score?.toFixed(2) || "1.00"}
                          </div>
                        </div>
                      </div>

                      {/* CONCOURSE QUADRANT OCCUPANCY */}
                      {engineResult.stadium_quadrant_occupancy && (
                        <div className="bg-[#090d12]/95 border border-cyan-500/20 rounded p-3 space-y-3 font-mono">
                          <h4 className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest flex items-center justify-between border-b border-cyan-950/80 pb-2">
                            <span className="flex items-center gap-1.5">
                              <Activity className="w-3.5 h-3.5 text-cyan-400" /> CONCOURSE QUADRANT OCCUPANCY
                            </span>
                            <span className="text-cyan-400 font-bold text-xs">
                              GLOBAL: {engineResult.stadium_quadrant_occupancy.global_venue_occupancy_pct}%
                            </span>
                          </h4>
                          <div className="grid grid-cols-2 gap-3 text-[10px]">
                            <div className="space-y-1">
                              <div className="flex justify-between text-slate-400">
                                <span>NORTH:</span>
                                <span className="font-bold text-white">{engineResult.stadium_quadrant_occupancy.north_concourse_pct}%</span>
                              </div>
                              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-900">
                                <div className="bg-cyan-500 h-full rounded-full transition-all duration-500" style={{ width: `${engineResult.stadium_quadrant_occupancy.north_concourse_pct}%` }} />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-slate-400">
                                <span>SOUTH:</span>
                                <span className="font-bold text-white">{engineResult.stadium_quadrant_occupancy.south_concourse_pct}%</span>
                              </div>
                              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-900">
                                <div className="bg-cyan-500 h-full rounded-full transition-all duration-500" style={{ width: `${engineResult.stadium_quadrant_occupancy.south_concourse_pct}%` }} />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-slate-400">
                                <span>EAST:</span>
                                <span className="font-bold text-white">{engineResult.stadium_quadrant_occupancy.east_concourse_pct}%</span>
                              </div>
                              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-900">
                                <div className="bg-cyan-500 h-full rounded-full transition-all duration-500" style={{ width: `${engineResult.stadium_quadrant_occupancy.east_concourse_pct}%` }} />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-slate-400">
                                <span>WEST:</span>
                                <span className="font-bold text-white">{engineResult.stadium_quadrant_occupancy.west_concourse_pct}%</span>
                              </div>
                              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-900">
                                <div className="bg-cyan-500 h-full rounded-full transition-all duration-500" style={{ width: `${engineResult.stadium_quadrant_occupancy.west_concourse_pct}%` }} />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* GATE FLOW TELEMETRY MATRIX */}
                      {engineResult.gate_analytics_table && engineResult.gate_analytics_table.length > 0 && (
                        <div className="bg-[#090d12]/95 border border-cyan-500/20 rounded p-3 space-y-2.5 font-mono">
                          <h4 className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-cyan-950/80 pb-2">
                            <Sliders className="w-3.5 h-3.5 text-cyan-400" /> GATE FLOW TELEMETRY MATRIX
                          </h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-[9px]">
                              <thead>
                                <tr className="border-b border-slate-900 text-slate-400 font-bold">
                                  <th className="py-1">GATE</th>
                                  <th className="py-1 text-center">QUEUE</th>
                                  <th className="py-1 text-center">FLOW/MIN</th>
                                  <th className="py-1 text-center">WAIT</th>
                                  <th className="py-1 text-right">STATUS</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-900/30">
                                {engineResult.gate_analytics_table.map((gate: any, i: number) => (
                                  <tr key={i} className="hover:bg-slate-950/40 text-slate-300">
                                    <td className="py-1.5 font-bold text-white">{gate.gate_id}</td>
                                    <td className="py-1.5 text-center">{gate.queue_count}</td>
                                    <td className="py-1.5 text-center">{gate.throughput_per_min}/m</td>
                                    <td className="py-1.5 text-center font-semibold text-cyan-400">{gate.predicted_wait_minutes?.toFixed(1)}m</td>
                                    <td className="py-1.5 text-right">
                                      <span className={`px-1.5 py-0.2 rounded text-[7.5px] font-bold ${
                                        gate.status === "CRITICAL" ? "bg-red-950/30 text-red-400 border border-red-900/40" :
                                        gate.status === "WARNING" ? "bg-amber-950/30 text-amber-400 border border-amber-900/40" :
                                        "bg-emerald-950/30 text-emerald-400 border border-emerald-900/40"
                                      }`}>
                                        {gate.status}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* FAN STREAM PAYLOAD RESOLUTION */}
                      {detectedPersona === "FAN_STREAM" && engineResult.fan_experience_payload && (
                        <div className="space-y-3">
                          <div className="bg-cyan-950/10 border border-cyan-900/40 rounded p-3 space-y-2">
                            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                              <Globe className="w-3.5 h-3.5 text-cyan-400" /> Fan Guidance System Resolution
                            </h4>
                            {engineResult.fan_experience_payload.user_intent_extracted && (
                              <div className="text-[10px] text-slate-400">
                                INTENT: <span className="text-slate-200 font-semibold">{engineResult.fan_experience_payload.user_intent_extracted}</span>
                              </div>
                            )}
                            <div className="bg-[#080a0c] border border-cyan-950 p-2.5 rounded text-xs text-slate-200 leading-relaxed font-sans">
                              {engineResult.fan_experience_payload.resolved_answer_native_language || 
                               engineResult.fan_experience_payload.resolved_answer_english_fallback}
                            </div>
                            {engineResult.fan_experience_payload.ui_action_routing && (
                              <div className="text-[9px] text-cyan-400 flex items-center gap-1.5 mt-1 font-mono uppercase bg-cyan-950/20 px-2 py-0.5 rounded w-fit">
                                <span>Action: {engineResult.fan_experience_payload.ui_action_routing.type}</span>
                                {engineResult.fan_experience_payload.ui_action_routing.location_anchor && (
                                  <span>• Focus: {engineResult.fan_experience_payload.ui_action_routing.location_anchor}</span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Dynamic Concession Ordering Readout */}
                          {engineResult.fan_experience_payload.concession_readout?.selected_stand_name && (
                            <div className="bg-emerald-950/10 border border-emerald-900/40 rounded p-3 space-y-3">
                              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                                <Utensils className="w-3.5 h-3.5 text-emerald-400" /> CONCESSION INTEL MATRIX
                              </h4>
                              <div className="text-[10px] text-slate-300 space-y-1 font-mono">
                                <div>STAND: <span className="text-white font-bold">{engineResult.fan_experience_payload.concession_readout.selected_stand_name}</span></div>
                                <div>EST. PICKUP WAIT: <span className="text-cyan-400 font-bold">{engineResult.fan_experience_payload.concession_readout.estimated_pickup_wait_minutes} Minutes</span></div>
                              </div>
                              <div className="bg-[#080a0c] border border-emerald-950 p-2.5 rounded space-y-2">
                                <div className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider font-mono">AVAILABLE MENU ITEMS:</div>
                                <div className="space-y-1.5">
                                  {engineResult.fan_experience_payload.concession_readout.available_menu_items?.map((item: any, i: number) => (
                                    <div key={i} className="flex justify-between items-start text-[10px] leading-tight text-slate-300 border-b border-slate-900/50 pb-1.5 last:border-0 last:pb-0">
                                      <div className="space-y-0.5">
                                        <div className="font-semibold text-slate-200 font-sans">{item.item_name}</div>
                                        <div className="flex flex-wrap gap-1">
                                          {item.dietary_tags?.map((tag: string, tIdx: number) => (
                                            <span key={tIdx} className="bg-emerald-950/40 text-emerald-400 border border-emerald-900/30 text-[7px] px-1 rounded uppercase font-mono">
                                              {tag}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                      <div className="font-mono text-emerald-400 font-bold">${item.price_usd?.toFixed(2)}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* STAFF STREAM PAYLOAD RESOLUTION */}
                      {detectedPersona === "STAFF_STREAM" && engineResult.staff_operations_payload && (
                        <div className="bg-amber-950/10 border border-amber-900/40 rounded p-3 space-y-2">
                          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5 text-amber-400" /> Staff Tactical Briefing & Protocols
                          </h4>

                          {/* Amber Flash Warning Indicator for high-density danger states */}
                          {(engineResult.staff_operations_payload.estimated_density_band === "CRUSH_RISK" ||
                            engineResult.staff_operations_payload.estimated_density_band === "PACKED") && (
                            <div className="p-2.5 bg-amber-950/40 border border-amber-500/70 text-amber-300 rounded flex items-start gap-2.5 animate-pulse">
                              <div className="bg-amber-500/20 p-1 rounded-full text-amber-400 shrink-0 mt-0.5">
                                <BellRing className="w-3.5 h-3.5 text-amber-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-200">
                                  CRITICAL DENSITY POTENTIAL HAZARD
                                </div>
                                <div className="text-[9px] text-amber-400/90 font-sans mt-0.5 leading-normal">
                                  Estimated flow band is currently <span className="font-bold underline text-amber-300">{engineResult.staff_operations_payload.estimated_density_band}</span>. Crowd congestion requires dynamic dispatch checkups at the target location coordinates.
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                            <div>
                              CLASSIFICATION:{" "}
                              <span className="text-red-400 font-bold flex items-center gap-1 mt-0.5">
                                {engineResult.staff_operations_payload.incident_classification || "NONE"}
                                {engineResult.staff_operations_payload.incident_classification && (
                                  <Volume2 className="w-3.5 h-3.5 text-red-400 animate-pulse" title="Subtle audio alert triggered" />
                                )}
                              </span>
                            </div>
                            <div>
                              DENSITY: <span className="text-amber-400 font-bold mt-0.5 block">{engineResult.staff_operations_payload.estimated_density_band || "COMFORTABLE"}</span>
                            </div>
                          </div>

                          {/* Density Trend Chart Visualization */}
                          <DensityTrendChart data={densityHistory} />

                          {engineResult.staff_operations_payload.hazards_or_anomalies_detected?.length > 0 && (
                            <div className="text-[10px] space-y-0.5">
                              <span className="text-slate-400 font-semibold">HAZARDS DETECTED:</span>
                              {engineResult.staff_operations_payload.hazards_or_anomalies_detected.map((hz: string, i: number) => (
                                <div key={i} className="text-red-400 pl-2 border-l border-red-900">• {hz}</div>
                              ))}
                            </div>
                          )}

                          {engineResult.staff_operations_payload.manual_protocol_breached && (
                            <div className="text-[10px] text-red-400 font-semibold bg-red-950/20 px-2 py-1 rounded border border-red-900/30 flex items-center gap-1.5">
                              <ShieldAlert className="w-3.5 h-3.5" />
                              PROTOCOLS BREACHED: {engineResult.staff_operations_payload.exact_manual_clause_reference || "Core Ops Code"}
                            </div>
                          )}

                          {engineResult.staff_operations_payload.immediate_operational_action_plan?.length > 0 && (
                            <div className="space-y-1 mt-2">
                              <span className="text-slate-400 font-bold text-[10px] uppercase">IMMEDIATE STEPS PLAN:</span>
                              <div className="bg-[#080a0c] p-2 rounded border border-slate-900 space-y-1 font-sans text-[11px] leading-relaxed text-slate-300">
                                {engineResult.staff_operations_payload.immediate_operational_action_plan.map((step: string, i: number) => (
                                  <div key={i} className="flex gap-1.5">
                                    <span className="text-emerald-400 font-mono font-bold">[{i + 1}]</span>
                                    <span>{step}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {engineResult.staff_operations_payload.verbal_radio_briefing_script && (
                            <div className="space-y-1">
                              <span className="text-slate-400 font-bold text-[10px] uppercase">VERBAL SECURITY TRANSMISSION:</span>
                              <div className="bg-amber-950/20 border border-amber-900/20 p-2 rounded text-amber-300 font-mono italic text-[11px] leading-relaxed">
                                "{engineResult.staff_operations_payload.verbal_radio_briefing_script}"
                              </div>
                            </div>
                          )}

                          {engineResult.staff_and_volunteer_payload?.reported_zone_anchor && (
                            <div className="text-[10px] text-slate-400">
                              REPORTED ANCHOR ZONE: <span className="text-white font-bold">{engineResult.staff_and_volunteer_payload.reported_zone_anchor}</span>
                            </div>
                          )}

                          {engineResult.staff_and_volunteer_payload?.immediate_volunteer_action_directive && (
                            <div className="space-y-1">
                              <span className="text-amber-400 font-bold text-[10px] uppercase">VOLUNTEER ACTION DIRECTIVE:</span>
                              <div className="bg-[#080a0c] border border-amber-950/35 p-2 rounded text-slate-300 font-sans text-[11px] leading-relaxed">
                                {engineResult.staff_and_volunteer_payload.immediate_volunteer_action_directive}
                              </div>
                            </div>
                          )}

                          {engineResult.staff_and_volunteer_payload?.shift_handover_briefing_summary && (
                            <div className="space-y-1">
                              <span className="text-slate-400 font-bold text-[10px] uppercase">SHIFT HANDOVER SUMMARY:</span>
                              <div className="bg-[#080a0c] border border-slate-900 p-2 rounded text-slate-300 font-sans text-[11px] leading-relaxed">
                                {engineResult.staff_and_volunteer_payload.shift_handover_briefing_summary}
                              </div>
                            </div>
                          )}

                          {/* Suggestion Quick Action Bar for classified incidents */}
                          {engineResult.staff_operations_payload.incident_classification && 
                           engineResult.staff_operations_payload.incident_classification !== "NONE" && (
                            <div className="mt-3.5 pt-3 border-t border-amber-900/40 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-slate-400 font-bold text-[10px] uppercase flex items-center gap-1.5 font-mono">
                                  <Zap className="w-3 h-3 text-amber-400 animate-pulse" /> SUGGESTED DISPATCH ACTIONS:
                                </span>
                                {dispatchedAction && (
                                  <span className="text-[9px] text-emerald-400 font-mono flex items-center gap-1 bg-emerald-950/40 border border-emerald-900/40 px-1.5 py-0.5 rounded">
                                    <Check className="w-2.5 h-2.5 text-emerald-400" /> TRANSMITTED OK ({dispatchedAction.timestamp})
                                  </span>
                                )}
                              </div>
                              
                              <div className="grid grid-cols-3 gap-2">
                                <button
                                  onClick={() => {
                                    setDispatchedAction({
                                      action: "Dispatch Security Detail",
                                      timestamp: new Date().toLocaleTimeString()
                                    });
                                    playDispatchSuccessSound();
                                  }}
                                  aria-label="Dispatch Security Detail"
                                  className={`px-2 py-1 rounded font-mono text-[9px] font-bold uppercase tracking-wider transition border text-center cursor-pointer select-none flex flex-col items-center justify-center min-h-[42px] ${
                                    dispatchedAction?.action === "Dispatch Security Detail"
                                      ? "bg-emerald-950/30 border-emerald-500 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                                      : "bg-slate-950/60 border-slate-900 hover:border-amber-500/50 hover:bg-[#0d131a] text-slate-300"
                                  }`}
                                  title="Trigger Security dispatch. Shortcut: Ctrl+S or ⌘S"
                                >
                                  <span>Dispatch Security</span>
                                  <span className="text-[7px] opacity-60 font-normal mt-0.5 lowercase">ctrl+s / ⌘s</span>
                                </button>
                                
                                <button
                                  onClick={() => {
                                    setDispatchedAction({
                                      action: "Medical Alert Broadcast",
                                      timestamp: new Date().toLocaleTimeString()
                                    });
                                    playDispatchSuccessSound();
                                  }}
                                  aria-label="Dispatch Medical Emergency Alert"
                                  className={`px-2 py-1 rounded font-mono text-[9px] font-bold uppercase tracking-wider transition border text-center cursor-pointer select-none flex flex-col items-center justify-center min-h-[42px] ${
                                    dispatchedAction?.action === "Medical Alert Broadcast"
                                      ? "bg-emerald-950/30 border-emerald-500 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                                      : "bg-slate-950/60 border-slate-900 hover:border-amber-500/50 hover:bg-[#0d131a] text-slate-300"
                                  }`}
                                  title="Trigger Medical Alert broadcast. Shortcut: Ctrl+M or ⌘M"
                                >
                                  <span>Medical Alert</span>
                                  <span className="text-[7px] opacity-60 font-normal mt-0.5 lowercase">ctrl+m / ⌘m</span>
                                </button>
                                
                                <button
                                  onClick={() => {
                                    setDispatchedAction({
                                      action: "Queue Re-Route Command",
                                      timestamp: new Date().toLocaleTimeString()
                                    });
                                    playDispatchSuccessSound();
                                  }}
                                  aria-label="Dispatch Queue Re-Route Command"
                                  className={`px-2 py-1 rounded font-mono text-[9px] font-bold uppercase tracking-wider transition border text-center cursor-pointer select-none flex flex-col items-center justify-center min-h-[42px] ${
                                    dispatchedAction?.action === "Queue Re-Route Command"
                                      ? "bg-emerald-950/30 border-emerald-500 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                                      : "bg-slate-950/60 border-slate-900 hover:border-amber-500/50 hover:bg-[#0d131a] text-slate-300"
                                  }`}
                                  title="Trigger Queue Re-Route command. Shortcut: Ctrl+Q or ⌘Q"
                                >
                                  <span>Queue Re-Route</span>
                                  <span className="text-[7px] opacity-60 font-normal mt-0.5 lowercase">ctrl+q / ⌘q</span>
                                </button>
                              </div>

                              {dispatchedAction && (
                                <motion.div 
                                  initial={{ opacity: 0, y: 4 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="p-2 rounded bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] flex items-start gap-1.5 leading-normal"
                                >
                                  <BellRing className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
                                  <div>
                                    <div className="font-bold uppercase tracking-wide text-white">Signal Broadcast Confirmed:</div>
                                    <div>Tactical alert <span className="text-emerald-400 font-semibold">"{dispatchedAction.action}"</span> sent to local field teams over encrypted RF band.</div>
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                      {/* 16-VENUE ARCHITECTURAL REGISTER & TEXTURES PANEL */}
                      {engineResult.venue_structural_profile && (
                        <div className="bg-[#090d12]/95 border border-cyan-500/30 rounded p-3.5 space-y-3 font-mono">
                          <h4 className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest flex items-center justify-between border-b border-cyan-950/80 pb-2">
                            <span className="flex items-center gap-1.5">
                              <Video className="w-3.5 h-3.5 text-cyan-400" /> 16-VENUE ARCHITECTURAL REGISTER
                            </span>
                            <span className="bg-cyan-950/80 text-cyan-400 border border-cyan-800 text-[8px] px-1.5 py-0.2 rounded font-mono font-bold animate-pulse">
                              ACTIVE MATRIX
                            </span>
                          </h4>

                          <div className="grid grid-cols-2 gap-3.5 text-[10px]">
                            <div className="space-y-1">
                              <span className="text-slate-400 uppercase text-[8px]">Venue ID:</span>
                              <div className="text-white font-bold text-[11px] tracking-wide">
                                {engineResult.venue_structural_profile.active_stadium_id}
                              </div>
                            </div>
                            <div className="space-y-1">
                              <span className="text-slate-400 uppercase text-[8px]">Capacity:</span>
                              <div className="text-cyan-400 font-extrabold text-[11px]">
                                {engineResult.venue_structural_profile.official_tournament_capacity?.toLocaleString()} Seats
                              </div>
                            </div>
                            <div className="space-y-1 col-span-2">
                              <span className="text-slate-400 uppercase text-[8px]">Architectural & Design Tag:</span>
                              <div className="text-slate-300 font-semibold italic bg-[#05070a]/90 px-2 py-1 border border-slate-900 rounded">
                                "{engineResult.venue_structural_profile.architectural_style_tag}"
                              </div>
                            </div>
                          </div>

                          {/* Live programmatic webgl textures readings */}
                          <div className="border-t border-slate-900/60 pt-2.5 mt-2 space-y-1.5">
                            <div className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider">
                              ACTIVE WEBGL TEXTURE DIRECTIVES:
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-[9px] bg-[#05070a] p-2.5 rounded border border-slate-900 font-mono text-slate-400">
                              <div className="flex items-center justify-between">
                                <span>WALL_COLOR:</span>
                                <span className="font-bold flex items-center gap-1">
                                  <span 
                                    className="w-2.5 h-2.5 rounded border border-white/10" 
                                    style={{ backgroundColor: engineResult.venue_structural_profile.programmatic_texture_directives?.wall_color_hex }}
                                  />
                                  {engineResult.venue_structural_profile.programmatic_texture_directives?.wall_color_hex}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span>ROUGHNESS:</span>
                                <span className="font-bold text-white">
                                  {engineResult.venue_structural_profile.programmatic_texture_directives?.material_roughness?.toFixed(2)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span>OPACITY ALPHA:</span>
                                <span className="font-bold text-white">
                                  {engineResult.venue_structural_profile.programmatic_texture_directives?.material_transparency_alpha?.toFixed(2)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span>GEOM_EXTRUSION:</span>
                                <span className="font-bold text-cyan-400 animate-pulse">
                                  {engineResult.venue_structural_profile.programmatic_texture_directives?.stadium_geometry_extrusion_multiplier?.toFixed(2)}x
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                /* TAB 2: Raw JSON Response inspector */
                <div className="relative flex-1 flex flex-col justify-between">
                  <div className="absolute top-2 right-2 flex gap-1 z-10">
                    <button
                      onClick={handleCopyJSON}
                      aria-label="Copy Raw JSON text to clipboard"
                      className="bg-slate-900 border border-slate-800 text-[10px] text-slate-400 hover:text-white px-2.5 py-1 rounded flex items-center gap-1.5"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>COPIED</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>COPY JSON</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="bg-[#07090c] border border-[#1b2530] p-3 rounded text-[10px] font-mono text-cyan-400 overflow-x-auto max-h-[360px] whitespace-pre-wrap select-all leading-relaxed">
                    {JSON.stringify(engineResult, null, 2)}
                  </pre>
                </div>
              )}
              
              {/* Footer status diagnostics bar */}
              <div className="border-t border-[#1b2531]/60 pt-2.5 mt-3 flex items-center justify-between text-[9px] font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <Database className="w-3 h-3 text-emerald-500" />
                  CONTEXT_INTEGRATED: <span className="text-slate-300">{engineResult.system_diagnostics?.grounded_in_context ? "TRUE" : "FALSE"}</span>
                </span>
                <span>
                  SYSTEM_CONFIDENCE: <span className="text-slate-300">{engineResult.system_diagnostics?.confidence_score?.toFixed(2) || "1.00"}</span>
                </span>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
