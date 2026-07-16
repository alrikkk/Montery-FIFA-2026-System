import React, { useState } from "react";
import { Edit2 } from "lucide-react";
import { Fan } from "../types";

interface FanEditModalProps {
  editingFan: Fan;
  onClose: () => void;
  onSave: (updatedDetails: {
    name: string;
    phoneNumber: string;
    selectedStadium: string;
    seat: { section: string; row: string; seat: string } | null;
  }) => Promise<void>;
  isUpdating: boolean;
  registryError: string;
  setRegistryError: (err: string) => void;
}

export const FanEditModal: React.FC<FanEditModalProps> = ({
  editingFan,
  onClose,
  onSave,
  isUpdating,
  registryError,
  setRegistryError,
}) => {
  const [name, setName] = useState(editingFan.name || "");
  const [phone, setPhone] = useState(editingFan.phoneNumber || "");
  const [stadium, setStadium] = useState(editingFan.selectedStadium || "NEW_YORK_NEW_JERSEY");
  const [section, setSection] = useState(editingFan.seat?.section || "");
  const [row, setRow] = useState(editingFan.seat?.row || "");
  const [seatNumber, setSeatNumber] = useState(editingFan.seat?.seat || "");

  const handleSave = () => {
    if (!name.trim()) {
      setRegistryError("Full Name is required");
      return;
    }
    const hasSeatDetails = section.trim() || row.trim() || seatNumber.trim();
    const seatPayload = hasSeatDetails ? {
      section: section.trim() || "118",
      row: row.trim() || "K",
      seat: seatNumber.trim() || "1"
    } : null;

    onSave({
      name: name.trim(),
      phoneNumber: phone.trim(),
      selectedStadium: stadium,
      seat: seatPayload,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 font-mono">
      <div className="bg-[#0b0e12] border border-amber-500/50 rounded-xl max-w-md w-full p-6 shadow-[0_0_50px_rgba(245,158,11,0.15)] space-y-4">
        <div className="border-b border-slate-900 pb-3 flex justify-between items-center">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
            <Edit2 className="w-4 h-4" /> Edit Spectator Profile
          </span>
          <button
            aria-label="Action Button"
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs font-bold uppercase cursor-pointer"
          >
            [Cancel]
          </button>
        </div>

        {registryError && (
          <div className="p-2.5 bg-red-950/20 border border-red-900/40 text-red-400 text-[10px] rounded leading-relaxed">
            ⚠️ {registryError}
          </div>
        )}

        <div className="space-y-3.5 text-xs">
          {/* Full Name */}
          <div className="space-y-1">
            <label htmlFor="edit-fan-fullname-input" className="block text-[9px] text-slate-200 uppercase tracking-wider font-bold">
              Full Name:
            </label>
            <input
              id="edit-fan-fullname-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#07090c] border border-[#1b2531] rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Phone number */}
          <div className="space-y-1">
            <label htmlFor="edit-fan-phone-input" className="block text-[9px] text-slate-200 uppercase tracking-wider font-bold">
              Verified Phone Number:
            </label>
            <input
              id="edit-fan-phone-input"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[#07090c] border border-[#1b2531] rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Selected Stadium */}
          <div className="space-y-1">
            <label htmlFor="edit-fan-stadium-select" className="block text-[9px] text-slate-200 uppercase tracking-wider font-bold">
              Facility Hub Assignment:
            </label>
            <select
              id="edit-fan-stadium-select"
              value={stadium}
              onChange={(e) => setStadium(e.target.value)}
              aria-label="Facility Hub Assignment"
              className="w-full bg-[#07090c] border border-[#1b2531] rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="NEW_YORK_NEW_JERSEY">NEW YORK NEW JERSEY</option>
              <option value="LOS_ANGELES">LOS ANGELES</option>
              <option value="MEXICO_CITY">MEXICO CITY</option>
              <option value="MIAMI">MIAMI</option>
              <option value="TORONTO">TORONTO</option>
              <option value="DALLAS">DALLAS</option>
            </select>
          </div>

          {/* Seat Assignment details */}
          <div className="space-y-1.5 pt-1 border-t border-slate-900">
            <span className="block text-[9.5px] text-sky-400 uppercase tracking-widest font-bold mb-2">
              Stadium Seat Allocation:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[8px] text-slate-200 uppercase tracking-wider font-bold mb-1">
                  Section:
                </label>
                <input
                  type="text"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  placeholder="e.g. 118"
                  className="w-full bg-[#07090c] border border-[#1b2531] rounded-lg px-2.5 py-1.5 text-center text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-[8px] text-slate-200 uppercase tracking-wider font-bold mb-1">
                  Row:
                </label>
                <input
                  type="text"
                  value={row}
                  onChange={(e) => setRow(e.target.value)}
                  placeholder="e.g. K"
                  className="w-full bg-[#07090c] border border-[#1b2531] rounded-lg px-2.5 py-1.5 text-center text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-[8px] text-slate-200 uppercase tracking-wider font-bold mb-1">
                  Seat Number:
                </label>
                <input
                  type="text"
                  value={seatNumber}
                  onChange={(e) => setSeatNumber(e.target.value)}
                  placeholder="e.g. 14"
                  className="w-full bg-[#07090c] border border-[#1b2531] rounded-lg px-2.5 py-1.5 text-center text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-900 flex justify-end gap-2 text-xs">
          <button
            aria-label="Action Button"
            onClick={onClose}
            className="px-4 py-2 hover:bg-slate-950 border border-slate-900 hover:border-slate-800 text-slate-400 hover:text-slate-200 rounded font-bold cursor-pointer"
          >
            Cancel
          </button>
          <button
            aria-label="Action Button"
            onClick={handleSave}
            disabled={isUpdating}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded font-bold cursor-pointer transition-colors"
          >
            {isUpdating ? "Saving..." : "Save Modifications"}
          </button>
        </div>
      </div>
    </div>
  );
};
