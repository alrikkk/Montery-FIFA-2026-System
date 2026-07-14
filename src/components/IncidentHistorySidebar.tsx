import React, { useState, useEffect, useRef } from "react";
import {
  History,
  X,
  ShieldAlert,
  Radio,
  MapPin,
  ChevronDown,
  ChevronUp,
  Play,
  Check,
  CheckSquare,
  Square,
  Zap,
  Activity,
  Trash2,
  Search
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface IncidentLog {
  id: string;
  timestamp: string;
  classification: string;
  query: string;
  actionPlan: string[];
  verbalRadioBriefingScript: string | null;
  coordinates: { x: number; y: number; z: number } | null;
  cameraPos: { x: number; y: number; z: number } | null;
  lookAtPos: { x: number; y: number; z: number } | null;
  glowColor: string;
  activeAnchor: string | null;
  fullPayload: any;
  resolved?: boolean;
  status?: string;
}

interface IncidentHistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  history: IncidentLog[];
  onRestoreIncident: (incident: IncidentLog) => void;
  activeIncidentId: string | null;
  onClearIncident?: (id: string) => void;
  onResolveIncident?: (id: string) => void;
  isLoading?: boolean;
}

const getBadgeStyle = (classification: string) => {
  const upper = classification.toUpperCase();
  if (upper === "MEDICAL_EMERGENCY" || upper === "SECURITY_HAZARD") {
    return { bg: "bg-red-950/40 border-red-500/50 text-red-400", label: "HIGH THREAT" };
  }
  if (upper === "CROWD_DENSITY_ALERT") {
    return { bg: "bg-orange-950/40 border-orange-500/50 text-orange-400", label: "CAPACITY" };
  }
  if (upper === "TICKETING_CRISIS") {
    return { bg: "bg-yellow-950/40 border-yellow-500/50 text-yellow-400", label: "TICKETING" };
  }
  return { bg: "bg-amber-950/40 border-amber-500/50 text-amber-400", label: "COMPLIANCE" };
};

// Synthesize a retro, randomized "poof" or "digital hiss" sound effect on toggle using Web Audio API
const playRegistryToggleSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    // Randomize duration between 0.1s and 0.22s
    const duration = 0.1 + Math.random() * 0.12;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Fill with white noise for the digital hiss texture
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;

    // Filter to customize the noise - randomized between highpass hiss and bandpass puff
    const filter = ctx.createBiquadFilter();
    const isHiss = Math.random() > 0.5;
    filter.type = isHiss ? "highpass" : "bandpass";
    
    // Randomize cutoff frequencies slightly for distinct sounds each time
    const startFreq = isHiss ? (3500 + Math.random() * 1500) : (1000 + Math.random() * 600);
    const endFreq = isHiss ? (1200 + Math.random() * 800) : (300 + Math.random() * 200);
    
    filter.frequency.setValueAtTime(startFreq, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + duration);
    filter.Q.setValueAtTime(isHiss ? 1.5 : 3.5, ctx.currentTime);

    // Fast volume decay envelope
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.18, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    // Audio connections
    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Overlay a quick 8-bit chunky frequency drop oscillator for "poof" bass punch
    const osc = ctx.createOscillator();
    osc.type = Math.random() > 0.5 ? "square" : "triangle";
    osc.frequency.setValueAtTime(isHiss ? 750 : 250, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(isHiss ? 180 : 70, ctx.currentTime + 0.08);

    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0.1, ctx.currentTime);
    oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);

    // Start synthesizers simultaneously
    noiseSource.start();
    osc.start();
    
    noiseSource.stop(ctx.currentTime + duration);
    osc.stop(ctx.currentTime + 0.08);
  } catch (err) {
    console.warn("[Audio] Web Audio context initialization failed or blocked:", err);
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { y: 12, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 280,
      damping: 22,
    },
  },
};

export default function IncidentHistorySidebar({
  isOpen,
  onClose,
  history,
  onRestoreIncident,
  activeIncidentId,
  onClearIncident,
  onResolveIncident,
  isLoading = false,
}: IncidentHistorySidebarProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [checkedSteps, setCheckedSteps] = useState<Record<string, Record<number, boolean>>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"ACTIVE" | "ARCHIVED">("ACTIVE");
  const [categoryFilter, setCategoryFilter] = useState<"ALL" | "MEDICAL" | "SECURITY" | "CONGESTION">("ALL");

  const isFirstRender = useRef(true);

  // Play "poof" / "digital hiss" synthesizer sound effect when panel state changes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    playRegistryToggleSound();
  }, [isOpen]);

  const tabFilteredHistory = history.filter((incident) => {
    const isResolved = incident.resolved || incident.status === "archived";
    if (activeTab === "ACTIVE") return !isResolved;
    return isResolved;
  });

  const categoryFilteredHistory = tabFilteredHistory.filter((incident) => {
    if (categoryFilter === "ALL") return true;
    const classification = incident.classification.toUpperCase();
    if (categoryFilter === "MEDICAL") {
      return classification.includes("MEDICAL");
    }
    if (categoryFilter === "SECURITY") {
      return classification.includes("SECURITY");
    }
    if (categoryFilter === "CONGESTION") {
      return classification.includes("CROWD") || classification.includes("DENSITY") || classification.includes("CONGESTION");
    }
    return true;
  });

  const filteredHistory = categoryFilteredHistory.filter((incident) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase().trim();
    const classification = incident.classification.toLowerCase();
    const classificationNormalized = classification.replace(/_/g, " ");
    const timestamp = incident.timestamp.toLowerCase();
    const queryText = incident.query.toLowerCase();
    const badge = getBadgeStyle(incident.classification);
    const badgeLabel = badge.label.toLowerCase();
    
    // Check if any of the action steps contain the keyword
    const matchesActionPlan = incident.actionPlan?.some(step => 
      step.toLowerCase().includes(q)
    ) || false;

    return (
      classification.includes(q) ||
      classificationNormalized.includes(q) ||
      timestamp.includes(q) ||
      queryText.includes(q) ||
      badgeLabel.includes(q) ||
      matchesActionPlan
    );
  });

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedId(prev => (prev === id ? null : id));
  };

  const toggleCheckStep = (incidentId: string, stepIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCheckedSteps(prev => {
      const currentIncidentSteps = prev[incidentId] || {};
      return {
        ...prev,
        [incidentId]: {
          ...currentIncidentSteps,
          [stepIndex]: !currentIncidentSteps[stepIndex],
        },
      };
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Semi-transparent backdrop overlay when open */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950 z-40 lg:hidden"
          />

          {/* Main sliding sidebar */}
          <motion.div
            id="incident-history-sidebar"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 220 }}
            className="fixed top-0 right-0 h-full w-[340px] md:w-[400px] bg-[#07090c]/98 border-l border-[#1b2531] shadow-2xl z-50 flex flex-col"
          >
        {/* Header */}
        <div className="p-4 border-b border-[#1b2531] flex items-center justify-between bg-[#0b0e12]">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold font-mono tracking-wider uppercase text-slate-200">
              TACTICAL INCIDENT ARCHIVE
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-900 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Warning Banner / Instructions */}
        <div className="px-4 py-2 bg-slate-950 border-b border-[#1b2531]/40 text-[9px] font-mono text-slate-500 uppercase tracking-tight flex items-center justify-between">
          <span>OPERATIONAL ARCHIVE FILTER</span>
          <span className="text-cyan-500 animate-pulse">● FEED ONLINE</span>
        </div>

        {/* Active vs Archived Tabs */}
        <div className="flex border-b border-[#1b2531] bg-[#090c10] text-[10px] font-mono">
          <button
            onClick={() => {
              setActiveTab("ACTIVE");
              playRegistryToggleSound();
            }}
            className={`flex-1 py-2 text-center border-b-2 transition-all cursor-pointer ${
              activeTab === "ACTIVE"
                ? "border-cyan-500 text-cyan-400 font-extrabold bg-cyan-950/20"
                : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            ACTIVE ({history.filter(i => !(i.resolved || i.status === "archived")).length})
          </button>
          <button
            onClick={() => {
              setActiveTab("ARCHIVED");
              playRegistryToggleSound();
            }}
            className={`flex-1 py-2 text-center border-b-2 transition-all cursor-pointer ${
              activeTab === "ARCHIVED"
                ? "border-amber-500 text-amber-400 font-extrabold bg-amber-950/20"
                : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            ARCHIVED ({history.filter(i => (i.resolved || i.status === "archived")).length})
          </button>
        </div>

        {/* Tactical Category Filter Buttons */}
        <div className="px-3 py-2 border-b border-[#1b2531]/60 bg-[#070a0e] flex items-center justify-between gap-1.5 overflow-x-auto scrollbar-none">
          <span className="text-[8px] font-mono text-slate-500 uppercase tracking-tight shrink-0">FILTER:</span>
          <div className="flex items-center gap-1">
            {[
              { id: "ALL", label: "ALL" },
              { id: "MEDICAL", label: "MEDICAL" },
              { id: "SECURITY", label: "SECURITY" },
              { id: "CONGESTION", label: "CONGESTION" }
            ].map((cat) => {
              const isActive = categoryFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setCategoryFilter(cat.id as any);
                    playRegistryToggleSound();
                  }}
                  className={`text-[9px] font-mono font-bold px-2.5 py-1 rounded transition border cursor-pointer select-none uppercase tracking-wide ${
                    isActive
                      ? "bg-cyan-950/70 text-cyan-400 border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.15)]"
                      : "bg-slate-950/80 text-slate-400 border-slate-900 hover:border-slate-800 hover:text-slate-200"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Search & Filter Controls */}
        <div className="p-3 border-b border-[#1b2531]/50 bg-[#090c10] space-y-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by classification, timestamp, query..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0d1218] border border-slate-800 rounded pl-8 pr-7 py-2 text-[10px] text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-2 text-slate-500 hover:text-slate-300 transition"
                title="Clear Search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-[8px] font-mono text-slate-500 uppercase mr-1">PRESETS:</span>
            {["Security", "Medical", "Crowd", "Ticketing", "Compliance"].map((tag) => {
              const isActive = searchQuery.toLowerCase() === tag.toLowerCase();
              return (
                <button
                  key={tag}
                  onClick={() => setSearchQuery(isActive ? "" : tag)}
                  className={`text-[8px] font-mono px-1.5 py-0.5 rounded transition border uppercase ${
                    isActive
                      ? "bg-cyan-950/60 text-cyan-400 border-cyan-800"
                      : "bg-slate-950 text-slate-400 border-slate-900 hover:border-slate-800 hover:text-slate-300"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Incident List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-slate-950"
        >
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={`skeleton-incident-${i}`}
                className="border border-[#1b2531]/60 bg-[#0b0e12]/30 rounded-lg p-3.5 space-y-3 animate-pulse relative overflow-hidden"
              >
                {/* Shimmer overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
                
                {/* Header line: Time and Category Badge */}
                <div className="flex items-center justify-between">
                  <div className="w-16 h-3 bg-slate-800/80 rounded" />
                  <div className="w-24 h-4.5 bg-slate-800/80 rounded border border-slate-900/40" />
                </div>
                
                {/* Title or short description block */}
                <div className="space-y-1.5 pt-1">
                  <div className="w-11/12 h-3 bg-slate-800/50 rounded" />
                  <div className="w-8/12 h-3 bg-slate-800/50 rounded" />
                </div>
                
                {/* Coordinates indicator footer */}
                <div className="flex items-center gap-1.5 pt-2 border-t border-[#1b2531]/30">
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-800/60" />
                  <div className="w-28 h-2.5 bg-slate-800/50 rounded" />
                </div>
              </div>
            ))
          ) : history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-2 py-12 text-slate-500 font-mono text-[10px]">
              <ShieldAlert className="w-6 h-6 text-slate-700 animate-pulse" />
              <span>NO INCIDENTS RECORDED IN CURRENT SESSION</span>
              <p className="text-[9px] text-slate-600 max-w-[200px]">
                Submit high-risk staff queries to automatically capture tactical events.
              </p>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-2 py-12 text-slate-500 font-mono text-[10px]">
              <ShieldAlert className="w-6 h-6 text-cyan-700 animate-pulse" />
              <span>NO INCIDENTS MATCHING SEARCH CRITERIA</span>
              <p className="text-[9px] text-slate-600 max-w-[200px]">
                Try filtering by keywords like "Security", "Medical", "Crowd", or adjust your search string.
              </p>
            </div>
          ) : (
            filteredHistory.map((incident) => {
              const isSelected = activeIncidentId === incident.id;
              const isExpanded = expandedId === incident.id;
              const badge = getBadgeStyle(incident.classification);
              const incidentSteps = checkedSteps[incident.id] || {};

              return (
                <motion.div
                  key={incident.id}
                  variants={itemVariants}
                  layout="position"
                  onClick={() => onRestoreIncident(incident)}
                  className={`border rounded-lg transition-all duration-200 cursor-pointer select-none group flex flex-col ${
                    isSelected
                      ? "bg-[#0f172a] border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                      : "bg-[#0b0e12]/80 border-[#1b2531] hover:border-slate-700 hover:bg-[#111821]"
                  }`}
                >
                  {/* Card Header Info */}
                  <div className="p-3 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-slate-500 font-bold">{incident.timestamp}</span>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[8px] px-1.5 py-0.5 rounded border font-bold uppercase tracking-wider ${badge.bg}`}>
                            {badge.label}
                          </span>
                          <span className="text-slate-400 font-bold text-[9px] uppercase tracking-tight">
                            {incident.classification}
                          </span>
                        </div>
                        {onResolveIncident && !(incident.resolved || incident.status === "archived") && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onResolveIncident(incident.id);
                            }}
                            className="text-slate-500 hover:text-emerald-400 p-1 rounded hover:bg-slate-900 transition shrink-0"
                            title="Mark incident as resolved"
                          >
                            <Check className="w-4 h-4 text-emerald-500 hover:text-emerald-400 font-bold" />
                          </button>
                        )}
                        {onClearIncident && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onClearIncident(incident.id);
                            }}
                            className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-slate-900 transition shrink-0"
                            title="Clear resolved incident"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-300 font-sans leading-relaxed line-clamp-2 italic">
                      "{incident.query}"
                    </div>

                    <div className="flex items-center justify-between text-[9px] font-mono pt-1">
                      {incident.coordinates ? (
                        <span className="text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-red-400" />
                          COORDS: ({incident.coordinates.x.toFixed(0)}, {incident.coordinates.z.toFixed(0)})
                        </span>
                      ) : (
                        <span className="text-slate-600 font-semibold">NO GPS BOUNDS</span>
                      )}

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => toggleExpand(incident.id, e)}
                          className="text-slate-400 hover:text-white p-0.5 rounded transition flex items-center gap-0.5 font-mono text-[9px] hover:underline"
                        >
                          {isExpanded ? "HIDE PLANS" : "VIEW DETAILS"}
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Detail Tray */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden border-t border-[#1b2531]/60 bg-slate-950/60 font-mono text-[10px]"
                      >
                        <div className="p-3 space-y-3 border-t border-[#1b2531]/40">
                          {/* Dispatch Checklist */}
                          {incident.actionPlan && incident.actionPlan.length > 0 && (
                            <div className="space-y-1.5">
                              <span className="text-slate-500 font-bold text-[9px] uppercase tracking-wider flex items-center gap-1">
                                <Zap className="w-3 h-3 text-cyan-400" /> DISPATCH PROTOCOL CHECKLIST
                              </span>
                              <div className="space-y-1 pl-1">
                                {incident.actionPlan.map((step, idx) => {
                                  const isChecked = !!incidentSteps[idx];
                                  return (
                                    <div
                                      key={idx}
                                      onClick={(e) => toggleCheckStep(incident.id, idx, e)}
                                      className="flex items-start gap-2 py-0.5 text-slate-300 hover:text-white transition cursor-pointer select-none group/step"
                                    >
                                      {isChecked ? (
                                        <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                      ) : (
                                        <Square className="w-3.5 h-3.5 text-slate-600 group-hover/step:text-slate-400 shrink-0 mt-0.5" />
                                      )}
                                      <span className={`text-[10px] font-sans leading-normal ${isChecked ? "line-through text-slate-500" : ""}`}>
                                        {step}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Verbal Radio Transmission */}
                          {incident.verbalRadioBriefingScript && (
                            <div className="space-y-1">
                              <span className="text-slate-500 font-bold text-[9px] uppercase tracking-wider flex items-center gap-1">
                                <Radio className="w-3 h-3 text-amber-500" /> ORIGINAL SECURED BROADCAST
                              </span>
                              <div className="bg-[#0b0e12] p-2 rounded text-amber-400 font-mono italic text-[10px] leading-relaxed border border-[#1b2531]/40">
                                "{incident.verbalRadioBriefingScript}"
                              </div>
                            </div>
                          )}

                          {/* Action Button inside card */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRestoreIncident(incident);
                            }}
                            className="w-full py-1.5 bg-cyan-950/40 border border-cyan-800/60 hover:bg-cyan-950/60 hover:border-cyan-500 text-cyan-400 rounded text-[9px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition select-none"
                          >
                            <Play className="w-3 h-3 shrink-0" />
                            REPLAY PAYLOAD & CAMERA FLY-TO
                          </button>

                          {onResolveIncident && !(incident.resolved || incident.status === "archived") && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onResolveIncident(incident.id);
                              }}
                              className="w-full py-1.5 mt-2 bg-emerald-950 border border-emerald-800 hover:bg-emerald-900 hover:border-emerald-500 text-emerald-400 hover:text-emerald-200 rounded text-[9px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition select-none"
                            >
                              <Check className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                              RESOLVE INCIDENT
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </motion.div>

        {/* Footer Statistics */}
        <div className="p-3 bg-[#0b0e12] border-t border-[#1b2531] text-[9px] font-mono text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1 uppercase">
            <Activity className="w-3 h-3 text-cyan-500" /> TOTAL LOGGED: {history.length}/5
          </span>
          <span className="text-slate-500">SYSTEM ARCHIVE V1</span>
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>
  );
}
