import React from "react";
import { BookOpen, ShieldAlert, Accessibility, ShoppingBag, Landmark } from "lucide-react";

interface GroundingManualProps {
  onSelectQuery: (query: string) => void;
}

export default function GroundingManual({ onSelectQuery }: GroundingManualProps) {
  const manuals = [
    {
      title: "Bag Policy Rules (Sec 2.1)",
      icon: <ShoppingBag className="w-4 h-4 text-[#06b6d4]" />,
      desc: "Clear bags only. Maximum size permitted is A4. Strictly no backpacks of any size allowed.",
      presets: [
        { label: "Check bag policy", query: "Can I bring my standard black leather backpack into the match?" },
        { label: "A4 size query", query: "Does my clear purse fit within the A4 size limit for bag checks?" }
      ]
    },
    {
      title: "Ticketing Anomalies (Sec 4.3)",
      icon: <Landmark className="w-4 h-4 text-yellow-500" />,
      desc: "If any ticket scan fails at turnstiles or is flagged as invalid, direct visitor to the physical Trouble Resolution Booth at Gate A.",
      presets: [
        { label: "Ticket scan fails", query: "The scanner is saying 'Ticket Error 109' on my fan pass, where can I go?" },
        { label: "Booth coordinates", query: "My turnstile barcode failed. Where is the Trouble Resolution Booth located?" }
      ]
    },
    {
      title: "Gate C Capacity Checks (Sec 3.8)",
      icon: <ShieldAlert className="w-4 h-4 text-[#ef4444]" />,
      desc: "Gate C Max Throughput: 400 people per 5 minutes. Critical threshold: 500 people. Divert flow to Gate D immediately if breached.",
      presets: [
        { label: "Normal Gate C throughput", query: "Our current flow rate at Gate C is 380 entries every 5 minutes. Is this stable?" },
        { label: "Gate C overcrowding report", query: "ALERT: Crowd density at Gate C has reached 530 people in the last 5 minutes. Queue is jammed." }
      ]
    },
    {
      title: "Accessibility Washrooms (Sec 1.2)",
      icon: <Accessibility className="w-4 h-4 text-blue-400" />,
      desc: "Wheelchair-accessible restrooms are located exclusively near Sections 104, 118, and 220.",
      presets: [
        { label: "Accessible restroom query", query: "Where is the nearest disabled restroom for a guest in Section 104?" }
      ]
    }
  ];

  return (
    <div className="bg-[#0b0e12] border border-[#1b2531] rounded-lg p-4 font-sans select-none shadow-lg">
      <div className="flex items-center gap-2 mb-3 border-b border-[#1b2531] pb-2">
        <BookOpen className="w-4 h-4 text-emerald-400" />
        <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-widest font-mono">Stadium Core Corpus (Grounding Codes)</h3>
      </div>
      <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">
        Montery is strictly grounded in these official FIFA 2026 operations manuals. Input queries that reference these scenarios will trigger localized coordinate centering, precise protocol verification, and stream routing.
      </p>

      <div className="space-y-3">
        {manuals.map((m, idx) => (
          <div key={idx} className="bg-[#0e1319] border border-[#171f2a] rounded p-2.5 transition hover:border-[#22c55e]/30">
            <div className="flex items-center gap-2 mb-1.5">
              {m.icon}
              <span className="text-[11px] font-semibold text-slate-300 font-mono uppercase">{m.title}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed pl-6 border-l border-slate-800 mb-2">
              {m.desc}
            </p>
            <div className="pl-6 flex flex-wrap gap-1.5">
              <span className="text-[9px] text-slate-500 flex items-center font-mono uppercase mr-1">Preloaded Queries:</span>
              {m.presets.map((preset, pIdx) => (
                <button
                  key={pIdx}
                  onClick={() => onSelectQuery(preset.query)}
                  className="text-[10px] text-emerald-400 bg-emerald-950/30 border border-emerald-900/40 px-2 py-0.5 rounded transition hover:bg-emerald-900/40 hover:text-white"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
