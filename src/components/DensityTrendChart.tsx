import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

export interface DensityPoint {
  time: string;
  value: number; // 1 to 4
  bandName: string; // SPARSE, COMFORTABLE, PACKED, CRUSH_RISK
}

interface DensityTrendChartProps {
  data: DensityPoint[];
}

// Map numerical density value back to color and status name
const getBandColor = (val: number) => {
  switch (val) {
    case 4: return "#f43f5e"; // Rose-500 (Crush Risk)
    case 3: return "#f97316"; // Orange-500 (Packed)
    case 2: return "#eab308"; // Yellow-500 (Comfortable)
    default: return "#06b6d4"; // Cyan-500 (Sparse)
  }
};

const getBandName = (val: number) => {
  switch (val) {
    case 4: return "CRUSH RISK";
    case 3: return "PACKED";
    case 2: return "COMFORTABLE";
    default: return "SPARSE";
  }
};

export default function DensityTrendChart({ data }: DensityTrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-28 border border-slate-900/60 bg-slate-950/40 rounded p-2 text-center text-[10px] text-slate-400 font-mono">
        NO DENSITY TELEMETRY RECORDED
      </div>
    );
  }

  return (
    <div className="border border-[#1e293b]/60 bg-slate-950/80 rounded-lg p-2.5 space-y-1.5 shadow-[0_0_15px_rgba(0,0,0,0.3)]">
      <div className="flex items-center justify-between text-[9px] font-mono font-bold tracking-wider text-slate-400">
        <span className="uppercase flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
          DENSITY LEVEL TREND OVER TIME
        </span>
        <span className="text-[8px] text-slate-400">SIMULATED REALTIME</span>
      </div>

      <div className="h-28 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
            <XAxis 
              dataKey="time" 
              stroke="#64748b" 
              fontSize={8} 
              tickLine={false} 
              axisLine={{ stroke: "#334155" }}
            />
            <YAxis 
              domain={[0, 4]} 
              tickCount={5} 
              stroke="#64748b" 
              fontSize={8} 
              tickLine={false} 
              axisLine={{ stroke: "#334155" }}
              tickFormatter={(val) => {
                if (val === 4) return "CRUSH";
                if (val === 3) return "PACK";
                if (val === 2) return "COMF";
                if (val === 1) return "SPARSE";
                return "";
              }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const dataPoint = payload[0].payload as DensityPoint;
                  const color = getBandColor(dataPoint.value);
                  return (
                    <div className="border border-slate-800 bg-[#0d131a] px-2.5 py-1.5 rounded shadow-lg text-[9px] font-mono space-y-0.5">
                      <div className="text-slate-400">Time: <span className="text-white font-bold">{dataPoint.time}</span></div>
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                        <span className="text-slate-400">Band: </span>
                        <span className="font-bold" style={{ color: color }}>
                          {getBandName(dataPoint.value)}
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
              cursor={{ fill: "rgba(30, 41, 59, 0.2)" }}
            />
            <Bar dataKey="value" radius={[2, 2, 0, 0]}>
              {data.map((entry, index) => {
                const color = getBandColor(entry.value);
                return (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={color} 
                    style={{ filter: `drop-shadow(0 0 4px ${color}33)` }}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-[8px] font-mono text-slate-400 pt-0.5 border-t border-slate-900/40">
        <span className="flex items-center gap-1">
          <span className="w-1 h-1 bg-[#06b6d4] rounded-full" /> SPARSE
        </span>
        <span className="flex items-center gap-1">
          <span className="w-1 h-1 bg-[#eab308] rounded-full" /> COMFORTABLE
        </span>
        <span className="flex items-center gap-1">
          <span className="w-1 h-1 bg-[#f97316] rounded-full" /> PACKED
        </span>
        <span className="flex items-center gap-1">
          <span className="w-1 h-1 bg-[#f43f5e] rounded-full" /> CRUSH RISK
        </span>
      </div>
    </div>
  );
}
