/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { IncidentLog } from "./IncidentHistorySidebar";
import { CloudRain, CloudSnow, CloudFog, Sun, Wind, Droplets, Thermometer, RefreshCw, AlertCircle, AlertTriangle, Moon, Lightbulb, Flame, Trophy, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import PixelLinkIcon from "./PixelLinkIcon";
import { LocationConfig, LOCATIONS } from "../utils/stadiumLocations";

// Helper function to synthesize a retro 8-bit cartoony "POOFF" puff sound using the Web Audio API
const playPoofSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Create random white noise buffer for the soft puff/smoke texture
    const bufferSize = ctx.sampleRate * 0.25; // 250ms duration
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    
    // Retro bandpass filter to give a specific cartoony pitch and muffle
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.setValueAtTime(450, ctx.currentTime);
    noiseFilter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);
    noiseFilter.Q.setValueAtTime(3.0, ctx.currentTime);
    
    // Triangle wave oscillator to add a chunky, heavy, 8-bit "whu-boop" bass punch underneath
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(160, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.2);
    
    // Separate gains for a balanced mix
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.35, ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    
    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0.45, ctx.currentTime);
    oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
    
    // Connect nodes
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    
    // Start playback simultaneously
    noiseSource.start();
    osc.start();
    noiseSource.stop(ctx.currentTime + 0.25);
    osc.stop(ctx.currentTime + 0.25);
  } catch (err) {
    console.warn("[Audio] Blocked or unsupported Web Audio API context:", err);
  }
};

// Helper function to synthesize a celebratory, poppy, high-fidelity 8-bit piñata burst sound
const _playPinataSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Quick celebration tone burst
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
    
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(293.66, ctx.currentTime); // D4
    osc2.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.15); // A4
    
    gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
    
    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.22);
    osc2.stop(ctx.currentTime + 0.22);
  } catch {
    // Audio context was blocked or not supported
  }
};

// Helper function to synthesize a high-tech 8-bit digital sweep/chirp sound when heatmap layer changes state
const playHeatmapSound = (on: boolean) => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = "sine";
    if (on) {
      // Ascending high-tech synth sweep for activation
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(960, ctx.currentTime + 0.3);
    } else {
      // Descending sweep for deactivation
      osc.frequency.setValueAtTime(640, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.3);
    }
    
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (err) {
    console.warn("[Audio] Blocked or unsupported Web Audio API context:", err);
  }
};

const ROSTERS: Record<string, { name: string; jersey: number }[]> = {
  ARGENTINA: [
    { name: "Lionel Messi", jersey: 10 },
    { name: "Rodrigo De Paul", jersey: 7 },
    { name: "Julian Alvarez", jersey: 9 },
    { name: "Enzo Fernandez", jersey: 24 },
    { name: "Alexis Mac Allister", jersey: 20 },
    { name: "Lautaro Martinez", jersey: 22 },
    { name: "Cristian Romero", jersey: 13 },
    { name: "Nicolas Otamendi", jersey: 19 },
    { name: "Nahuel Molina", jersey: 26 },
    { name: "Nicolas Tagliafico", jersey: 3 },
  ],
  FRANCE: [
    { name: "Kylian Mbappe", jersey: 10 },
    { name: "Antoine Griezmann", jersey: 7 },
    { name: "Ousmane Dembele", jersey: 11 },
    { name: "Aurelien Tchouameni", jersey: 8 },
    { name: "Eduardo Camavinga", jersey: 6 },
    { name: "Olivier Giroud", jersey: 9 },
    { name: "Dayot Upamecano", jersey: 4 },
    { name: "William Saliba", jersey: 17 },
    { name: "Theo Hernandez", jersey: 22 },
    { name: "Jules Kounde", jersey: 5 },
  ],
  USA: [
    { name: "Christian Pulisic", jersey: 10 },
    { name: "Weston McKennie", jersey: 8 },
    { name: "Timothy Weah", jersey: 21 },
    { name: "Tyler Adams", jersey: 4 },
    { name: "Antonee Robinson", jersey: 5 },
    { name: "Folarin Balogun", jersey: 20 },
    { name: "Sergino Dest", jersey: 2 },
    { name: "Chris Richards", jersey: 3 },
    { name: "Yunus Musah", jersey: 6 },
    { name: "Gio Reyna", jersey: 7 },
  ],
  GERMANY: [
    { name: "Jamal Musiala", jersey: 10 },
    { name: "Florian Wirtz", jersey: 17 },
    { name: "Kai Havertz", jersey: 7 },
    { name: "Thomas Muller", jersey: 13 },
    { name: "Joshua Kimmich", jersey: 6 },
    { name: "Ilkay Gundogan", jersey: 21 },
    { name: "Antonio Rudiger", jersey: 2 },
    { name: "Jonathan Tah", jersey: 4 },
    { name: "David Raum", jersey: 3 },
    { name: "Leroy Sane", jersey: 19 },
  ],
  MEXICO: [
    { name: "Santiago Gimenez", jersey: 11 },
    { name: "Hirving Lozano", jersey: 22 },
    { name: "Edson Alvarez", jersey: 4 },
    { name: "Luis Chavez", jersey: 18 },
    { name: "Orbelin Pineda", jersey: 17 },
    { name: "Uriel Antuna", jersey: 15 },
    { name: "Cesar Montes", jersey: 3 },
    { name: "Johan Vasquez", jersey: 5 },
    { name: "Jorge Sanchez", jersey: 19 },
    { name: "Gerardo Arteaga", jersey: 6 },
  ],
  COLOMBIA: [
    { name: "James Rodriguez", jersey: 10 },
    { name: "Luis Diaz", jersey: 7 },
    { name: "Jhon Arias", jersey: 11 },
    { name: "Jefferson Lerma", jersey: 16 },
    { name: "Daniel Munoz", jersey: 21 },
    { name: "Davinson Sanchez", jersey: 23 },
    { name: "Mateus Uribe", jersey: 15 },
    { name: "Rafael Santos Borre", jersey: 19 },
    { name: "Richard Rios", jersey: 6 },
    { name: "Johan Mojica", jersey: 17 },
  ],
  SPAIN: [
    { name: "Lamine Yamal", jersey: 19 },
    { name: "Nico Williams", jersey: 17 },
    { name: "Dani Olmo", jersey: 10 },
    { name: "Rodri", jersey: 16 },
    { name: "Alvaro Morata", jersey: 7 },
    { name: "Pedri", jersey: 20 },
    { name: "Gavi", jersey: 9 },
    { name: "Robin Le Normand", jersey: 3 },
    { name: "Dani Carvajal", jersey: 2 },
    { name: "Marc Cucurella", jersey: 24 },
  ],
  BRAZIL: [
    { name: "Vinicius Junior", jersey: 7 },
    { name: "Rodrygo", jersey: 10 },
    { name: "Raphinha", jersey: 11 },
    { name: "Bruno Guimaraes", jersey: 5 },
    { name: "Lucas Paqueta", jersey: 8 },
    { name: "Endrick", jersey: 9 },
    { name: "Eder Militao", jersey: 3 },
    { name: "Marquinhos", jersey: 4 },
    { name: "Danilo", jersey: 2 },
    { name: "Douglas Luiz", jersey: 18 },
  ],
  ENGLAND: [
    { name: "Jude Bellingham", jersey: 10 },
    { name: "Harry Kane", jersey: 9 },
    { name: "Bukayo Saka", jersey: 7 },
    { name: "Phil Foden", jersey: 11 },
    { name: "Declan Rice", jersey: 4 },
    { name: "Cole Palmer", jersey: 24 },
    { name: "John Stones", jersey: 5 },
    { name: "Kyle Walker", jersey: 2 },
    { name: "Kieran Trippier", jersey: 12 },
    { name: "Trent Alexander-Arnold", jersey: 8 },
  ],
  CANADA: [
    { name: "Alphonso Davies", jersey: 19 },
    { name: "Jonathan David", jersey: 10 },
    { name: "Cyle Larin", jersey: 9 },
    { name: "Tajon Buchanan", jersey: 11 },
    { name: "Stephen Eustaquio", jersey: 7 },
    { name: "Ismael Kone", jersey: 8 },
    { name: "Alistair Johnston", jersey: 2 },
    { name: "Kamal Miller", jersey: 4 },
    { name: "Moise Bombito", jersey: 15 },
    { name: "Richie Laryea", jersey: 22 },
  ],
  PORTUGAL: [
    { name: "Cristiano Ronaldo", jersey: 7 },
    { name: "Bruno Fernandes", jersey: 8 },
    { name: "Bernardo Silva", jersey: 10 },
    { name: "Rafael Leao", jersey: 17 },
    { name: "Joao Palhinha", jersey: 6 },
    { name: "Vitinha", jersey: 23 },
    { name: "Ruben Dias", jersey: 4 },
    { name: "Pepe", jersey: 3 },
    { name: "Joao Cancelo", jersey: 20 },
    { name: "Diogo Dalot", jersey: 5 },
  ],
  ITALY: [
    { name: "Federico Chiesa", jersey: 14 },
    { name: "Mateo Retegui", jersey: 19 },
    { name: "Nicolo Barella", jersey: 18 },
    { name: "Lorenzo Pellegrini", jersey: 10 },
    { name: "Davide Frattesi", jersey: 8 },
    { name: "Jorginho", jersey: 5 },
    { name: "Alessandro Bastoni", jersey: 23 },
    { name: "Gianluca Mancini", jersey: 17 },
    { name: "Giovanni Di Lorenzo", jersey: 2 },
    { name: "Federico Dimarco", jersey: 3 },
  ],
  BELGIUM: [
    { name: "Kevin De Bruyne", jersey: 7 },
    { name: "Romelu Lukaku", jersey: 10 },
    { name: "Jeremy Doku", jersey: 11 },
    { name: "Leandro Trossard", jersey: 9 },
    { name: "Amadou Onana", jersey: 18 },
    { name: "Youri Tielemans", jersey: 8 },
    { name: "Wout Faes", jersey: 4 },
    { name: "Jan Vertonghen", jersey: 5 },
    { name: "Timothy Castagne", jersey: 21 },
    { name: "Arthur Theate", jersey: 3 },
  ],
};

const getRosterForTeam = (teamName: string): { name: string; jersey: number }[] => {
  const normalized = teamName.trim().toUpperCase();
  if (ROSTERS[normalized]) {
    return ROSTERS[normalized];
  }
  return [
    { name: `Player A (${teamName})`, jersey: 2 },
    { name: `Player B (${teamName})`, jersey: 4 },
    { name: `Player C (${teamName})`, jersey: 7 },
    { name: `Player D (${teamName})`, jersey: 9 },
    { name: `Player E (${teamName})`, jersey: 10 },
    { name: `Player F (${teamName})`, jersey: 11 },
    { name: `Player G (${teamName})`, jersey: 14 },
    { name: `Player H (${teamName})`, jersey: 18 },
    { name: `Player I (${teamName})`, jersey: 21 },
    { name: `Player J (${teamName})`, jersey: 23 },
  ];
};

export interface FifaMatchInfo {
  matchNumber: string;
  stage: string;
  dateTime: string;
  status: "UPCOMING" | "LIVE" | "COMPLETED";
  team1: string;
  team1Flag: string;
  team2: string;
  team2Flag: string;
  score: string;
  timeRemainingOrElapsed?: string;
  stadiumDetails: string;
  crowdDensity: string;
}

export const FIFA_2026_MATCHES: Record<string, FifaMatchInfo> = {
  NEW_YORK_NEW_JERSEY: {
    matchNumber: "MATCH 104",
    stage: "GRAND FINAL",
    dateTime: "JULY 19, 2026 • 15:00 EST",
    status: "UPCOMING",
    team1: "ARGENTINA",
    team1Flag: "🇦🇷",
    team2: "FRANCE",
    team2Flag: "🇫🇷",
    score: "VS",
    stadiumDetails: "MetLife Stadium (82,500 capacity)",
    crowdDensity: "EXPECTED: 100%"
  },
  LOS_ANGELES: {
    matchNumber: "MATCH 98",
    stage: "QUARTERFINAL",
    dateTime: "JULY 10, 2026 • 18:00 PST",
    status: "LIVE",
    team1: "USA",
    team1Flag: "🇺🇸",
    team2: "GERMANY",
    team2Flag: "🇩🇪",
    score: "2 - 1",
    timeRemainingOrElapsed: "72' LIVE",
    stadiumDetails: "SoFi Stadium (70,240 capacity)",
    crowdDensity: "CURRENT OCCUPANCY: 98.4%"
  },
  MEXICO_CITY: {
    matchNumber: "MATCH 92",
    stage: "ROUND OF 16",
    dateTime: "JULY 5, 2026",
    status: "COMPLETED",
    team1: "MEXICO",
    team1Flag: "🇲🇽",
    team2: "COLOMBIA",
    team2Flag: "🇨🇴",
    score: "2 - 1 (AET)",
    stadiumDetails: "Estadio Azteca (87,523 capacity)",
    crowdDensity: "FINAL ATTENDANCE: 87,411"
  },
  DALLAS: {
    matchNumber: "MATCH 101",
    stage: "SEMIFINAL 1",
    dateTime: "JULY 14, 2026 • 20:00 CST",
    status: "UPCOMING",
    team1: "SPAIN",
    team1Flag: "🇪🇸",
    team2: "BRAZIL",
    team2Flag: "🇧🇷",
    score: "VS",
    stadiumDetails: "AT&T Stadium (80,000 capacity)",
    crowdDensity: "TICKETS SOLD: 100%"
  },
  ATLANTA: {
    matchNumber: "MATCH 102",
    stage: "SEMIFINAL 2",
    dateTime: "JULY 15, 2026 • 20:00 EST",
    status: "UPCOMING",
    team1: "ARGENTINA",
    team1Flag: "🇦🇷",
    team2: "ENGLAND",
    team2Flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    score: "VS",
    stadiumDetails: "Mercedes-Benz Stadium (71,000 capacity)",
    crowdDensity: "TICKETS SOLD: 98.2%"
  },
  VANCOUVER: {
    matchNumber: "MATCH 96",
    stage: "ROUND OF 16",
    dateTime: "JULY 7, 2026",
    status: "COMPLETED",
    team1: "CANADA",
    team1Flag: "🇨🇦",
    team2: "PORTUGAL",
    team2Flag: "🇵🇹",
    score: "2 - 3",
    stadiumDetails: "BC Place (54,500 capacity)",
    crowdDensity: "FINAL ATTENDANCE: 54,102"
  },
  TORONTO: {
    matchNumber: "MATCH 76",
    stage: "ROUND OF 32",
    dateTime: "JULY 2, 2026",
    status: "COMPLETED",
    team1: "CANADA",
    team1Flag: "🇨🇦",
    team2: "ITALY",
    team2Flag: "🇮🇹",
    score: "1 - 0",
    stadiumDetails: "BMO Field (45,000 capacity)",
    crowdDensity: "FINAL ATTENDANCE: 44,891"
  },
  GUADALAJARA: {
    matchNumber: "MATCH 48",
    stage: "GROUP STAGE",
    dateTime: "JUNE 26, 2026",
    status: "COMPLETED",
    team1: "MEXICO",
    team1Flag: "🇲🇽",
    team2: "BELGIUM",
    team2Flag: "🇧🇪",
    score: "1 - 1",
    stadiumDetails: "Estadio Akron (48,071 capacity)",
    crowdDensity: "FINAL ATTENDANCE: 47,902"
  },
  MONTERREY: {
    matchNumber: "MATCH 84",
    stage: "ROUND OF 32",
    dateTime: "JULY 3, 2026",
    status: "COMPLETED",
    team1: "NETHERLANDS",
    team1Flag: "🇳🇱",
    team2: "URUGUAY",
    team2Flag: "🇺🇾",
    score: "1 - 2",
    stadiumDetails: "Estadio BBVA (53,500 capacity)",
    crowdDensity: "FINAL ATTENDANCE: 52,810"
  },
  MIAMI: {
    matchNumber: "MATCH 100",
    stage: "QUARTERFINAL",
    dateTime: "JULY 12, 2026 • 18:00 EST",
    status: "UPCOMING",
    team1: "FRANCE",
    team1Flag: "🇫🇷",
    team2: "URUGUAY",
    team2Flag: "🇺🇾",
    score: "VS",
    stadiumDetails: "Hard Rock Stadium (65,326 capacity)",
    crowdDensity: "TICKETS SOLD: 99.5%"
  },
  SEATTLE: {
    matchNumber: "MATCH 82",
    stage: "ROUND OF 32",
    dateTime: "JULY 3, 2026",
    status: "COMPLETED",
    team1: "USA",
    team1Flag: "🇺🇸",
    team2: "JAPAN",
    team2Flag: "🇯🇵",
    score: "3 - 1",
    stadiumDetails: "Lumen Field (69,000 capacity)",
    crowdDensity: "FINAL ATTENDANCE: 68,211"
  },
  SAN_FRANCISCO: {
    matchNumber: "MATCH 94",
    stage: "ROUND OF 16",
    dateTime: "JULY 6, 2026",
    status: "COMPLETED",
    team1: "USA",
    team1Flag: "🇺🇸",
    team2: "ITALY",
    team2Flag: "🇮🇹",
    score: "2 - 1 (PEN)",
    stadiumDetails: "Levi's Stadium (68,500 capacity)",
    crowdDensity: "FINAL ATTENDANCE: 68,109"
  },
  KANSAS_CITY: {
    matchNumber: "MATCH 99",
    stage: "QUARTERFINAL",
    dateTime: "JULY 11, 2026 • 15:00 CST",
    status: "UPCOMING",
    team1: "ENGLAND",
    team1Flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    team2: "SPAIN",
    team2Flag: "🇪🇸",
    score: "VS",
    stadiumDetails: "Arrowhead Stadium (76,416 capacity)",
    crowdDensity: "TICKETS SOLD: 100%"
  },
  HOUSTON: {
    matchNumber: "MATCH 90",
    stage: "ROUND OF 16",
    dateTime: "JULY 4, 2026",
    status: "COMPLETED",
    team1: "BRAZIL",
    team1Flag: "🇧🇷",
    team2: "NETHERLANDS",
    team2Flag: "🇳🇱",
    score: "3 - 1",
    stadiumDetails: "NRG Stadium (72,220 capacity)",
    crowdDensity: "FINAL ATTENDANCE: 71,802"
  },
  BOSTON: {
    matchNumber: "MATCH 97",
    stage: "QUARTERFINAL",
    dateTime: "JULY 9, 2026",
    status: "COMPLETED",
    team1: "BRAZIL",
    team1Flag: "🇧🇷",
    team2: "PORTUGAL",
    team2Flag: "🇵🇹",
    score: "4 - 2",
    stadiumDetails: "Gillette Stadium (65,878 capacity)",
    crowdDensity: "FINAL ATTENDANCE: 65,102"
  },
  PHILADELPHIA: {
    matchNumber: "MATCH 89",
    stage: "ROUND OF 16",
    dateTime: "JULY 4, 2026",
    status: "COMPLETED",
    team1: "FRANCE",
    team1Flag: "🇫🇷",
    team2: "MOROCCO",
    team2Flag: "🇲🇦",
    score: "2 - 0",
    stadiumDetails: "Lincoln Financial Field (69,796 capacity)",
    crowdDensity: "FINAL ATTENDANCE: 69,112"
  }
};

interface Vector3D {
  x: number;
  y: number;
  z: number;
}

interface StadiumTwinProps {
  cameraPos: Vector3D;
  lookAtPos: Vector3D;
  glowColor: string;
  activeAnchor: string | null;
  currentWeather?: "SUNSHINE" | "RAIN" | "FOG" | "SNOW";
  incident?: {
    type: string | null;
    coordinates?: { x: number; y: number; z: number } | null;
  } | null;
  incidents?: IncidentLog[] | null;
  onWeatherChange?: (weather: "SUNSHINE" | "RAIN" | "FOG" | "SNOW", locationName: string, stadiumName: string, temp?: number) => void;
  venueStructuralProfile?: {
    active_stadium_id: string;
    official_tournament_capacity: number;
    architectural_style_tag: string;
    programmatic_texture_directives: {
      wall_color_hex: string;
      material_roughness: number;
      material_transparency_alpha: number;
      stadium_geometry_extrusion_multiplier: number;
    };
  } | null;
  isFanMode?: boolean;
  isFloorHeatmapEnabled?: boolean;
  isLoading?: boolean;
}

// Unified texture cache to prevent recreating/reloading canvas-based programmatic textures
const globalTextureCache = new Map<string, THREE.Texture>();

// Programmatic High-Fidelity SVG canvas texture generator for incident billboards
function createIncidentTexture(type: string, color: string): THREE.Texture {
  const cacheKey = `incident_${type}_${color}`;
  if (globalTextureCache.has(cacheKey)) {
    return globalTextureCache.get(cacheKey)!;
  }

  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.Texture();

  ctx.clearRect(0, 0, 128, 128);

  // Holographic glowing circular background
  const grad = ctx.createRadialGradient(64, 64, 10, 64, 64, 60);
  grad.addColorStop(0, "rgba(13, 19, 26, 0.9)");
  grad.addColorStop(0.8, "rgba(15, 23, 42, 0.95)");
  grad.addColorStop(1, color);

  ctx.fillStyle = grad;
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(64, 64, 56, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Fine outer scanning radar ring
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.arc(64, 64, 61, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]); // Reset dash

  // Draw tactical symbol
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 5;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  const upperType = (type || "").toUpperCase();

  if (upperType === "SECURITY_HAZARD" || upperType === "COMPLIANCE_VIOLATION") {
    // Holographic Shield Icon
    ctx.beginPath();
    ctx.moveTo(64, 30);
    ctx.quadraticCurveTo(86, 30, 92, 34);
    ctx.quadraticCurveTo(92, 64, 64, 98);
    ctx.quadraticCurveTo(36, 64, 36, 34);
    ctx.quadraticCurveTo(42, 30, 64, 30);
    ctx.closePath();
    ctx.fillStyle = "rgba(6, 182, 212, 0.25)";
    ctx.fill();
    ctx.stroke();

    // Shield inner details
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(64, 55, 6, 0, Math.PI * 2);
    ctx.fill();
  } else if (upperType === "MEDICAL_EMERGENCY") {
    // Medical Cross Icon
    ctx.beginPath();
    // vertical
    ctx.rect(53, 30, 22, 68);
    // horizontal
    ctx.rect(30, 53, 68, 22);
    ctx.fillStyle = color;
    ctx.fill();
    
    // Inner border highlights
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  } else if (upperType === "CROWD_DENSITY_ALERT" || upperType === "TICKETING_CRISIS" || upperType.includes("DENSITY")) {
    // Warning Triangle
    ctx.beginPath();
    ctx.moveTo(64, 26);
    ctx.lineTo(98, 92);
    ctx.lineTo(30, 92);
    ctx.closePath();
    ctx.fillStyle = "rgba(234, 179, 8, 0.2)";
    ctx.fill();
    ctx.stroke();

    // Bold Exclamation mark
    ctx.fillStyle = color;
    ctx.fillRect(61, 46, 6, 26);
    ctx.beginPath();
    ctx.arc(64, 82, 4.5, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Default dynamic tactical pulse/target symbol
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(64, 64, 18, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(64, 64, 7, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  globalTextureCache.set(cacheKey, texture);
  return texture;
}

// Programmatic High-Fidelity SVG canvas texture generator for clustered billboards
function createClusterTexture(count: number, color: string): THREE.Texture {
  const cacheKey = `cluster_${count}_${color}`;
  if (globalTextureCache.has(cacheKey)) {
    return globalTextureCache.get(cacheKey)!;
  }

  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.Texture();

  ctx.clearRect(0, 0, 128, 128);

  // Holographic glowing circular background
  const grad = ctx.createRadialGradient(64, 64, 10, 64, 64, 60);
  grad.addColorStop(0, "rgba(24, 10, 30, 0.9)");
  grad.addColorStop(0.8, "rgba(20, 15, 35, 0.96)");
  grad.addColorStop(1, color);

  ctx.fillStyle = grad;
  ctx.strokeStyle = color;
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.arc(64, 64, 55, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Outer dashed target lines
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 4]);
  ctx.beginPath();
  ctx.arc(64, 64, 61, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Central circle badge for number
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(64, 46, 17, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 18px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(count.toString(), 64, 46);

  // Labels
  ctx.fillStyle = color;
  ctx.font = "bold 11px sans-serif";
  ctx.fillText("CLUSTER", 64, 78);
  ctx.font = "bold 9px monospace";
  ctx.fillText(`${count} EVENTS`, 64, 94);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  globalTextureCache.set(cacheKey, texture);
  return texture;
}

// Programmatic High-Fidelity warning label texture generator for structural warning overlays
function createWarningLabelTexture(text: string, subtext: string, color: string): THREE.Texture {
  const cacheKey = `warn_lbl_${text}_${subtext}_${color}`;
  if (globalTextureCache.has(cacheKey)) {
    return globalTextureCache.get(cacheKey)!;
  }

  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.Texture();

  ctx.clearRect(0, 0, 256, 64);

  // Background frame with Notch design
  ctx.fillStyle = "rgba(13, 19, 26, 0.95)";
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(10, 5);
  ctx.lineTo(246, 5);
  ctx.lineTo(246, 45);
  ctx.lineTo(236, 59);
  ctx.lineTo(10, 59);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Left hazard stripes (yellow/black or red/black style)
  ctx.fillStyle = color;
  ctx.fillRect(15, 12, 6, 40);

  // Warning text content
  ctx.fillStyle = color;
  ctx.font = "bold 10px monospace";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 28, 23);

  ctx.fillStyle = "#ffffff";
  ctx.font = "9px sans-serif";
  ctx.fillText(subtext, 28, 41);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  globalTextureCache.set(cacheKey, texture);
  return texture;
}

export default function StadiumTwin({
  cameraPos,
  lookAtPos,
  glowColor,
  activeAnchor,
  currentWeather,
  incident,
  incidents,
  onWeatherChange,
  venueStructuralProfile,
  isFanMode = false,
  isFloorHeatmapEnabled,
  isLoading = false,
}: StadiumTwinProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const matchOverlayRef = useRef<HTMLDivElement>(null);
  const matchOverlayInnerRef = useRef<HTMLDivElement>(null);
  const overlayTransitionRef = useRef<number>(0);

  // Weather & environmental telemetry states
  const [selectedLocation, setSelectedLocation] = useState<LocationConfig>(LOCATIONS[0]);
  const [localWeatherState, setLocalWeatherState] = useState<"SUNSHINE" | "RAIN" | "FOG" | "SNOW">("SUNSHINE");
  const [deferredReady, setDeferredReady] = useState(false);

  useEffect(() => {
    // Advanced asynchronous loading strategy to defer heavy Three.js / WebGL calculations
    // until after the initial HTML/CSS shell has rendered and painted.
    // This dramatically improves mobile First Contentful Paint (FCP) and Largest Contentful Paint (LCP)
    // by yielding the main thread during the critical initial paint window.
    let isMounted = true;
    let timerId: any = null;
    let rafId1: number | null = null;
    let rafId2: number | null = null;
    let idleId: any = null;

    const triggerInitialization = () => {
      // Execute double requestAnimationFrame to guarantee that the browser has painted
      // the initial skeleton and UI elements of the HTML/CSS shell.
      rafId1 = window.requestAnimationFrame(() => {
        rafId2 = window.requestAnimationFrame(() => {
          if (!isMounted) return;

          // Once painted, leverage requestIdleCallback to begin Three.js construction
          // during low-priority main-thread idle periods, preventing frame drops.
          if (typeof window.requestIdleCallback === "function") {
            idleId = window.requestIdleCallback(() => {
              if (isMounted) setDeferredReady(true);
            }, { timeout: 1000 });
          } else {
            // Fallback for browsers without requestIdleCallback (e.g. some Safari versions)
            timerId = setTimeout(() => {
              if (isMounted) setDeferredReady(true);
            }, 150);
          }
        });
      });
    };

    if (document.readyState === "complete") {
      triggerInitialization();
    } else {
      const handleLoad = () => {
        triggerInitialization();
      };
      window.addEventListener("load", handleLoad);
      return () => {
        isMounted = false;
        window.removeEventListener("load", handleLoad);
        if (timerId) clearTimeout(timerId);
        if (rafId1) cancelAnimationFrame(rafId1);
        if (rafId2) cancelAnimationFrame(rafId2);
        if (idleId && typeof window.cancelIdleCallback === "function") {
          window.cancelIdleCallback(idleId);
        }
      };
    }

    return () => {
      isMounted = false;
      if (timerId) clearTimeout(timerId);
      if (rafId1) cancelAnimationFrame(rafId1);
      if (rafId2) cancelAnimationFrame(rafId2);
      if (idleId && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
    };
  }, []);
  const activeWeather = currentWeather || localWeatherState;
  const activeMatch = FIFA_2026_MATCHES[selectedLocation.id] || FIFA_2026_MATCHES.NEW_YORK_NEW_JERSEY;

  const activeMatchRef = useRef(activeMatch);
  useEffect(() => {
    activeMatchRef.current = activeMatch;
  }, [activeMatch]);

  const [liveSeconds, setLiveSeconds] = useState(4320);

  useEffect(() => {
    if (activeMatch.status !== "LIVE") return;
    
    let initialSeconds = 72 * 60;
    if (activeMatch.timeRemainingOrElapsed) {
      const parsed = activeMatch.timeRemainingOrElapsed.match(/^(\d+)/);
      if (parsed) {
        initialSeconds = parseInt(parsed[1], 10) * 60;
      }
    }
    setLiveSeconds(initialSeconds);

    const interval = setInterval(() => {
      setLiveSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [activeMatch.matchNumber, activeMatch.status]);

  const formatGameTime = () => {
    const mins = Math.floor(liveSeconds / 60);
    const secs = liveSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")} LIVE`;
  };

  const [weatherData, setWeatherData] = useState<{
    temperature?: number;
    windspeed?: number;
    humidity?: number;
    description?: string;
  } | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [isEnvPanelOpen, setIsEnvPanelOpen] = useState(true);
  const [showSmoke, setShowSmoke] = useState(false);
  const [isScoreboardCollapsed, setIsScoreboardCollapsed] = useState(false);
  const isScoreboardCollapsedRef = useRef<boolean>(false);
  useEffect(() => {
    isScoreboardCollapsedRef.current = isScoreboardCollapsed;
  }, [isScoreboardCollapsed]);

  // Real-time live match simulation states
  const [isSimulatingLive, setIsSimulatingLive] = useState<boolean>(false);
  const [foulsCount, setFoulsCount] = useState<number>(0);
  const [foulsLog, setFoulsLog] = useState<{ id: string; time: string; player: string; jersey: number; flag: string; card: "none" | "yellow" | "red"; team: string }[]>([]);
  const [possession, setPossession] = useState<{ team1: number; team2: number }>({ team1: 50, team2: 50 });
  const [passes, setPasses] = useState<{ team1: { completed: number; total: number }; team2: { completed: number; total: number } }>({
    team1: { completed: 0, total: 0 },
    team2: { completed: 0, total: 0 },
  });
  const [passEventsLog, setPassEventsLog] = useState<{ id: string; time: string; fromPlayer: string; toPlayer: string; flag: string; success: boolean; type: string; speed: string }[]>([]);

  useEffect(() => {
    const isLive = activeMatch.status === "LIVE";
    setIsSimulatingLive(isLive);

    const team1Players = getRosterForTeam(activeMatch.team1);
    const team2Players = getRosterForTeam(activeMatch.team2);

    if (activeMatch.status === "UPCOMING") {
      setFoulsCount(0);
      setFoulsLog([]);
      setPossession({ team1: 50, team2: 50 });
      setPasses({
        team1: { completed: 0, total: 0 },
        team2: { completed: 0, total: 0 },
      });
      setPassEventsLog([]);
    } else if (activeMatch.status === "COMPLETED") {
      setFoulsCount(14);
      setPossession({ team1: 47, team2: 53 });
      setPasses({
        team1: { completed: 412, total: 498 },
        team2: { completed: 489, total: 565 },
      });

      const finalFouls = [
        {
          id: "f1",
          time: "18'",
          player: team1Players[2 % team1Players.length].name,
          jersey: team1Players[2 % team1Players.length].jersey,
          flag: activeMatch.team1Flag,
          card: "none" as const,
          team: activeMatch.team1,
        },
        {
          id: "f2",
          time: "34'",
          player: team2Players[4 % team2Players.length].name,
          jersey: team2Players[4 % team2Players.length].jersey,
          flag: activeMatch.team2Flag,
          card: "yellow" as const,
          team: activeMatch.team2,
        },
        {
          id: "f3",
          time: "56'",
          player: team1Players[6 % team1Players.length].name,
          jersey: team1Players[6 % team1Players.length].jersey,
          flag: activeMatch.team1Flag,
          card: "yellow" as const,
          team: activeMatch.team1,
        },
        {
          id: "f4",
          time: "81'",
          player: team2Players[1 % team2Players.length].name,
          jersey: team2Players[1 % team2Players.length].jersey,
          flag: activeMatch.team2Flag,
          card: "none" as const,
          team: activeMatch.team2,
        },
      ];
      setFoulsLog(finalFouls);

      const finalPasses = [
        {
          id: "p1",
          time: "89'",
          fromPlayer: team2Players[0 % team2Players.length].name,
          toPlayer: team2Players[1 % team2Players.length].name,
          flag: activeMatch.team2Flag,
          success: true,
          type: "Short Pass",
          speed: "54 km/h",
        },
        {
          id: "p2",
          time: "88'",
          fromPlayer: team1Players[1 % team1Players.length].name,
          toPlayer: team1Players[0 % team1Players.length].name,
          flag: activeMatch.team1Flag,
          success: false,
          type: "Cross",
          speed: "78 km/h",
        },
        {
          id: "p3",
          time: "87'",
          fromPlayer: team2Players[3 % team2Players.length].name,
          toPlayer: team2Players[0 % team2Players.length].name,
          flag: activeMatch.team2Flag,
          success: true,
          type: "Through Ball",
          speed: "68 km/h",
        },
      ];
      setPassEventsLog(finalPasses);
    } else {
      setFoulsCount(9);
      setPossession({ team1: 52, team2: 48 });
      setPasses({
        team1: { completed: 324, total: 376 },
        team2: { completed: 288, total: 335 },
      });

      const initialFouls = [
        {
          id: "f1",
          time: "14'",
          player: team1Players[3 % team1Players.length].name,
          jersey: team1Players[3 % team1Players.length].jersey,
          flag: activeMatch.team1Flag,
          card: "none" as const,
          team: activeMatch.team1,
        },
        {
          id: "f2",
          time: "39'",
          player: team2Players[5 % team2Players.length].name,
          jersey: team2Players[5 % team2Players.length].jersey,
          flag: activeMatch.team2Flag,
          card: "yellow" as const,
          team: activeMatch.team2,
        },
        {
          id: "f3",
          time: "61'",
          player: team1Players[4 % team1Players.length].name,
          jersey: team1Players[4 % team1Players.length].jersey,
          flag: activeMatch.team1Flag,
          card: "none" as const,
          team: activeMatch.team1,
        },
      ];
      setFoulsLog(initialFouls);

      const initialPasses = [
        {
          id: "p1",
          time: "71'",
          fromPlayer: team1Players[1 % team1Players.length].name,
          toPlayer: team1Players[0 % team1Players.length].name,
          flag: activeMatch.team1Flag,
          success: true,
          type: "Short Pass",
          speed: "48 km/h",
        },
        {
          id: "p2",
          time: "70'",
          fromPlayer: team2Players[2 % team2Players.length].name,
          toPlayer: team2Players[4 % team2Players.length].name,
          flag: activeMatch.team2Flag,
          success: true,
          type: "Long Ball",
          speed: "82 km/h",
        },
      ];
      setPassEventsLog(initialPasses);
    }
  }, [activeMatch.matchNumber, activeMatch.status, activeMatch.team1, activeMatch.team2]);

  useEffect(() => {
    if (!isSimulatingLive) return;

    const interval = setInterval(() => {
      const currentMin = Math.floor(liveSeconds / 60);
      const timeStr = `${currentMin}'`;

      const team1Players = getRosterForTeam(activeMatch.team1);
      const team2Players = getRosterForTeam(activeMatch.team2);

      const isTeam1Attacking = Math.random() < (possession.team1 / 100);
      const attackingFlag = isTeam1Attacking ? activeMatch.team1Flag : activeMatch.team2Flag;
      const attackingPlayers = isTeam1Attacking ? team1Players : team2Players;

      const fromIdx = Math.floor(Math.random() * attackingPlayers.length);
      let toIdx = Math.floor(Math.random() * attackingPlayers.length);
      while (toIdx === fromIdx) {
        toIdx = Math.floor(Math.random() * attackingPlayers.length);
      }
      const fromPlayer = attackingPlayers[fromIdx].name;
      const toPlayer = attackingPlayers[toIdx].name;

      const isPassSuccess = Math.random() < 0.82;
      const passTypes = ["Short Pass", "Long Pass", "Through Ball", "Cross", "Heel Pass"];
      const passType = passTypes[Math.floor(Math.random() * passTypes.length)];
      const passSpeed = `${Math.floor(Math.random() * 40) + 45} km/h`;

      const newPass = {
        id: Math.random().toString(36).substring(2, 9),
        time: timeStr,
        fromPlayer,
        toPlayer,
        flag: attackingFlag,
        success: isPassSuccess,
        type: passType,
        speed: passSpeed,
      };

      setPassEventsLog((prev) => [newPass, ...prev.slice(0, 4)]);

      // Calculate 3D pass coordinates
      const prevPass = currentPass3DRef.current;
      // Start from previous destination if valid, otherwise random in the middle third
      const ox = (prevPass && prevPass.id) ? prevPass.dx : (Math.random() * 60 - 30);
      const oz = (prevPass && prevPass.id) ? prevPass.dz : (Math.random() * 40 - 20);
      const dx = Math.random() * 92 - 46;
      const dz = Math.random() * 60 - 30;
      const speedVal = Math.floor(Math.random() * 40) + 45;

      const newPass3D = {
        id: newPass.id,
        ox,
        oz,
        dx,
        dz,
        success: isPassSuccess,
        type: passType,
        progress: 0.0, // Reset progress for the 3D animation loop
        speed: speedVal
      };

      currentPass3DRef.current = newPass3D;
      setCurrentPass3DState(newPass3D);

      setPasses((prev) => {
        if (isTeam1Attacking) {
          return {
            ...prev,
            team1: {
              completed: prev.team1.completed + (isPassSuccess ? 1 : 0),
              total: prev.team1.total + 1,
            },
          };
        } else {
          return {
            ...prev,
            team2: {
              completed: prev.team2.completed + (isPassSuccess ? 1 : 0),
              total: prev.team2.total + 1,
            },
          };
        }
      });

      setPossession((prev) => {
        const delta = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 2) + 1);
        const nextTeam1 = Math.min(65, Math.max(35, prev.team1 + delta));
        return {
          team1: nextTeam1,
          team2: 100 - nextTeam1,
        };
      });

      if (Math.random() < 0.12) {
        const foulCommittedByTeam1 = Math.random() < 0.5;
        const foulTeam = foulCommittedByTeam1 ? activeMatch.team1 : activeMatch.team2;
        const foulFlag = foulCommittedByTeam1 ? activeMatch.team1Flag : activeMatch.team2Flag;
        const foulPlayers = foulCommittedByTeam1 ? team1Players : team2Players;

        const foulPlayerIdx = Math.floor(Math.random() * foulPlayers.length);
        const foulPlayer = foulPlayers[foulPlayerIdx].name;
        const foulJersey = foulPlayers[foulPlayerIdx].jersey;

        const cardRand = Math.random();
        const cardType = cardRand < 0.25 ? ("yellow" as const) : cardRand < 0.28 ? ("red" as const) : ("none" as const);

        const newFoul = {
          id: Math.random().toString(36).substring(2, 9),
          time: timeStr,
          player: foulPlayer,
          jersey: foulJersey,
          flag: foulFlag,
          card: cardType,
          team: foulTeam,
        };

        setFoulsCount((prev) => prev + 1);
        setFoulsLog((prev) => [newFoul, ...prev.slice(0, 4)]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isSimulatingLive, liveSeconds, possession, activeMatch]);

  const [isHeatmapOverlayEnabled, setIsHeatmapOverlayEnabled] = useState(false);
  const [isStructuralWarningEnabled, setIsStructuralWarningEnabled] = useState(true);
  const isStructuralWarningEnabledRef = useRef<boolean>(true);
  useEffect(() => {
    isStructuralWarningEnabledRef.current = isStructuralWarningEnabled;
  }, [isStructuralWarningEnabled]);
  const isFirstRender = useRef(true);

  // Trigger smoke puff animation whenever the panel state is toggled
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setShowSmoke(true);
    playPoofSound();
    const timer = setTimeout(() => setShowSmoke(false), 800);
    return () => clearTimeout(timer);
  }, [isEnvPanelOpen]);

  const weatherStateRef = useRef<"SUNSHINE" | "RAIN" | "FOG" | "SNOW">("SUNSHINE");

  const [isMoreDetailsExpanded, setIsMoreDetailsExpanded] = useState<boolean>(true);
  const isMoreDetailsExpandedRef = useRef<boolean>(true);
  useEffect(() => {
    isMoreDetailsExpandedRef.current = isMoreDetailsExpanded;
  }, [isMoreDetailsExpanded]);

  const [currentPass3DState, setCurrentPass3DState] = useState<{
    id: string;
    ox: number;
    oz: number;
    dx: number;
    dz: number;
    success: boolean;
    type: string;
    progress: number;
    speed: number;
  }>({
    id: "",
    ox: 0,
    oz: 0,
    dx: 0,
    dz: 0,
    success: true,
    type: "Short Pass",
    progress: 1.0,
    speed: 52,
  });

  const currentPass3DRef = useRef<{
    id: string;
    ox: number;
    oz: number;
    dx: number;
    dz: number;
    success: boolean;
    type: string;
    progress: number;
    speed: number;
  }>({
    id: "",
    ox: 0,
    oz: 0,
    dx: 0,
    dz: 0,
    success: true,
    type: "Short Pass",
    progress: 1.0,
    speed: 52,
  });

  const [floodlightsOn, setFloodlightsOn] = useState<boolean>(true);
  const floodlightsOnRef = useRef<boolean>(true);

  const onWeatherChangeRef = useRef(onWeatherChange);
  useEffect(() => {
    onWeatherChangeRef.current = onWeatherChange;
  }, [onWeatherChange]);

  const handleWeatherChange = (newWeather: "SUNSHINE" | "RAIN" | "FOG" | "SNOW", temp?: number) => {
    setLocalWeatherState(newWeather);
    if (onWeatherChangeRef.current) {
      onWeatherChangeRef.current(newWeather, selectedLocation.name, selectedLocation.stadium, temp !== undefined ? temp : weatherData?.temperature);
    }
  };

  useEffect(() => {
    floodlightsOnRef.current = floodlightsOn;
  }, [floodlightsOn]);

  useEffect(() => {
    weatherStateRef.current = activeWeather;
  }, [activeWeather]);

  // Live real-time Weather API (Open-Meteo) integration
  useEffect(() => {
    let active = true;
    const fetchWeather = async () => {
      setIsLoadingWeather(true);
      setWeatherError(null);
      try {
        // Open-Meteo is free, needs no API key, and returns real-time conditions
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${selectedLocation.lat}&longitude=${selectedLocation.lon}&current_weather=true`
        );
        if (!res.ok) throw new Error("Meteo Service Unreachable");
        const data = await res.json();
        
        if (!active) return;
        
        const current = data.current_weather;
        // WMO Weather interpretation codes
        const code = current.weathercode;
        let mappedState: "SUNSHINE" | "RAIN" | "FOG" | "SNOW" = "SUNSHINE";
        let desc = "Clear Skies / Sunny";
        
        if (code === 0) {
          mappedState = "SUNSHINE";
          desc = "Clear Sunny Skies";
        } else if (code === 1 || code === 2 || code === 3) {
          mappedState = "SUNSHINE";
          desc = "Partly Cloudy";
        } else if (code === 45 || code === 48) {
          mappedState = "FOG";
          desc = "Heavy Mist / Fog";
        } else if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82) || code >= 95) {
          mappedState = "RAIN";
          desc = code >= 95 ? "Severe Thunderstorm" : "Active Rainfall";
        } else if ((code >= 71 && code <= 77) || code === 85 || code === 86) {
          mappedState = "SNOW";
          desc = "Active Snow Flurries";
        }

        setWeatherData({
          temperature: current.temperature,
          windspeed: current.windspeed,
          humidity: 62, // Standard fallback
          description: desc
        });
        handleWeatherChange(mappedState, current.temperature);
      } catch (err) {
        console.warn("Weather sync failed, falling back to default scenario conditions", err);
        if (!active) return;
        setWeatherError("Using offline simulator mode");
        const fallbackTemp = selectedLocation.id === "maracana" ? 28 : selectedLocation.id === "allianz" ? 9 : 17;
        setWeatherData({
          temperature: fallbackTemp,
          windspeed: 12.5,
          humidity: 62,
          description: selectedLocation.defaultWeather === "SUNSHINE" ? "Optimal Clear" : selectedLocation.defaultWeather === "RAIN" ? "Overcast Rain" : "Tactical Fog"
        });
        handleWeatherChange(selectedLocation.defaultWeather, fallbackTemp);
      } finally {
        if (active) setIsLoadingWeather(false);
      }
    };

    fetchWeather();
    return () => {
      active = false;
    };
  }, [selectedLocation.id]);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const userTakingManualControlRef = useRef<boolean>(false);

  // Keep references to target values for smooth lerp interpolation
  const targetCam = useRef<THREE.Vector3>(new THREE.Vector3(0, 50, 100));
  const currentCam = useRef<THREE.Vector3>(new THREE.Vector3(0, 50, 100));
  const targetLook = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const currentLook = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  // High-fidelity time-based camera transit transition state
  const transitionProgress = useRef<number>(1.0); // 1.0 means transition is complete
  const transitionDuration = 1200; // Easing animation duration in milliseconds
  const transitStartCam = useRef<THREE.Vector3>(new THREE.Vector3(0, 50, 100));
  const transitEndCam = useRef<THREE.Vector3>(new THREE.Vector3(0, 50, 100));
  const transitStartLook = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const transitEndLook = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const transitStartTime = useRef<number>(0);

  const incidentGroupRef = useRef<THREE.Group | null>(null);
  const skinMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const stadiumGroupRef = useRef<THREE.Group | null>(null);
  const heatmapGroupRef = useRef<THREE.Group | null>(null);
  const floorHeatmapGroupRef = useRef<THREE.Group | null>(null);
  const seatedFansPointsRef = useRef<THREE.Points | null>(null);
  const seatedFansDataRef = useRef<{
    basePos: THREE.Vector3;
    angle: number;
    rowIdx: number;
    color: THREE.Color;
    cheerOffset: number;
    cheerSpeed: number;
  }[]>([]);

  const pinataBurstPointsRef = useRef<THREE.Points | null>(null);
  const pinataBurstDataRef = useRef<{
    active: boolean;
    centerX: number;
    centerY: number;
    centerZ: number;
    birthTime: number;
    duration: number;
    velocities: THREE.Vector3[];
    colors: THREE.Color[];
  }[]>([]);
  const lastPinataBurstTimeRef = useRef<number>(0);

  const cameraPosX = cameraPos.x;
  const cameraPosY = cameraPos.y;
  const cameraPosZ = cameraPos.z;
  const lookAtPosX = lookAtPos.x;
  const lookAtPosY = lookAtPos.y;
  const lookAtPosZ = lookAtPos.z;

  // Update target coordinates when props change with a smooth time-based transition
  useEffect(() => {
    // Record starting positions to ease from (e.g. current positions from OrbitControls)
    transitStartCam.current.copy(currentCam.current);
    transitStartLook.current.copy(currentLook.current);

    // Record target positions
    transitEndCam.current.set(cameraPosX, cameraPosY, cameraPosZ);
    transitEndLook.current.set(lookAtPosX, lookAtPosY, lookAtPosZ);

    targetCam.current.copy(transitEndCam.current);
    targetLook.current.copy(transitEndLook.current);

    // Initialize easing parameters
    transitionProgress.current = 0.0;
    transitStartTime.current = performance.now();
    userTakingManualControlRef.current = false;
  }, [cameraPosX, cameraPosY, cameraPosZ, lookAtPosX, lookAtPosY, lookAtPosZ]);

  const incidentType = incident?.type || null;
  const incidentX = incident?.coordinates?.x || 0;
  const incidentY = incident?.coordinates?.y || 0;
  const incidentZ = incident?.coordinates?.z || 0;
  const incidentsStr = JSON.stringify(incidents);
  const sceneReady = !!sceneRef.current;

  // Dynamic Incident Billboard Placement & Visual Pillar Overlay with Clustering
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // 1. Remove previous incident group if any
    if (incidentGroupRef.current) {
      scene.remove(incidentGroupRef.current);
      incidentGroupRef.current = null;
    }

    if (isFanMode) return;

    // 2. Gather all plot-capable incidents
    const allPlotItems: any[] = [];
    if (incidents && incidents.length > 0) {
      incidents.forEach((inc) => {
        if (inc.coordinates) {
          allPlotItems.push({
            id: inc.id,
            type: inc.classification,
            coordinates: inc.coordinates,
          });
        }
      });
    }

    // Include the active search incident if available and not redundant
    if (incidentType && incident?.coordinates) {
      const exists = allPlotItems.some(
        (item) =>
          Math.abs(item.coordinates.x - incident.coordinates!.x) < 0.1 &&
          Math.abs(item.coordinates.z - incident.coordinates!.z) < 0.1
      );
      if (!exists) {
        allPlotItems.push({
          id: "active-current",
          type: incidentType,
          coordinates: incident.coordinates,
        });
      }
    }

    if (allPlotItems.length === 0) return;

    // 3. Cluster indicators that are nearby (e.g. < 30 units apart)
    const CLUSTER_DISTANCE = 30.0;
    interface Cluster {
      id: string;
      centroid: { x: number; y: number; z: number };
      items: any[];
    }
    const clusters: Cluster[] = [];

    allPlotItems.forEach((item) => {
      let merged = false;
      for (const cluster of clusters) {
        const dx = cluster.centroid.x - item.coordinates.x;
        const dy = cluster.centroid.y - item.coordinates.y;
        const dz = cluster.centroid.z - item.coordinates.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < CLUSTER_DISTANCE) {
          cluster.items.push(item);
          // Recompute centroid
          let sumX = 0, sumY = 0, sumZ = 0;
          cluster.items.forEach((cItem) => {
            sumX += cItem.coordinates.x;
            sumY += cItem.coordinates.y;
            sumZ += cItem.coordinates.z;
          });
          cluster.centroid = {
            x: sumX / cluster.items.length,
            y: sumY / cluster.items.length,
            z: sumZ / cluster.items.length,
          };
          merged = true;
          break;
        }
      }
      if (!merged) {
        clusters.push({
          id: `cluster-${item.id}`,
          centroid: { ...item.coordinates },
          items: [item],
        });
      }
    });

    // Create container group
    const group = new THREE.Group();

    // 4. Render each cluster group
    clusters.forEach((cluster, idx) => {
      const { x, y, z } = cluster.centroid;
      const size = cluster.items.length;

      // Color scheme based on size or category
      let color = "#ef4444"; // high-alert red
      if (size === 1) {
        const upperType = cluster.items[0].type.toUpperCase();
        if (upperType === "COMPLIANCE_VIOLATION") {
          color = "#f59e0b";
        } else if (upperType === "TICKETING_CRISIS") {
          color = "#eab308";
        } else if (upperType === "CROWD_DENSITY_ALERT") {
          color = "#f97316";
        }
      } else {
        color = "#ec4899"; // high-tech magenta for clusters
      }

      // A. Main tactical vertical glowing wireframe light-shaft / pillar
      const points = [];
      points.push(new THREE.Vector3(x, 0, z));
      points.push(new THREE.Vector3(x, y, z));
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.8,
        depthTest: false,
      });
      const beaconLine = new THREE.Line(lineGeo, lineMat);
      group.add(beaconLine);

      // Translucent volumetric light shaft (wider diameter for clusters)
      const radius = size > 1 ? 2.5 : 1.2;
      const cylinderGeo = new THREE.CylinderGeometry(radius, radius, y, 8, 1, true);
      const cylinderMat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: size > 1 ? 0.16 : 0.12,
        wireframe: true,
        depthTest: false,
      });
      const beaconVolumetric = new THREE.Mesh(cylinderGeo, cylinderMat);
      beaconVolumetric.position.set(x, y / 2, z);
      group.add(beaconVolumetric);

      // B. Ground pulsing targeting rings
      const ringRadius = size > 1 ? 9.0 : 6.0;
      const ringsPoints = [];
      const steps = 32;
      for (let i = 0; i <= steps; i++) {
        const theta = (i / steps) * Math.PI * 2;
        ringsPoints.push(new THREE.Vector3(Math.cos(theta) * ringRadius, 0.1, Math.sin(theta) * ringRadius));
      }
      const ringGeo = new THREE.BufferGeometry().setFromPoints(ringsPoints);
      const ringMat = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.8,
        depthTest: false,
      });
      const groundPulseRing = new THREE.Line(ringGeo, ringMat);
      groundPulseRing.position.set(x, 0.1, z);
      groundPulseRing.name = "groundPulseRing";
      group.add(groundPulseRing);

      // C. Dynamic Billboard Sprite (Cluster vs Single)
      const texture = size > 1 ? createClusterTexture(size, color) : createIncidentTexture(cluster.items[0].type, color);
      const spriteMat = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: false,
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.position.set(x, y, z);
      sprite.scale.set(size > 1 ? 14 : 12, size > 1 ? 14 : 12, 1);
      sprite.name = "incidentSprite";
      sprite.userData = {
        baseHeight: y,
        offset: idx * 1.5,
      };
      group.add(sprite);

      // D. Draw spider-web lines to actual coordinates for cluster members to prevent overlap but keep spatial precision
      if (size > 1) {
        cluster.items.forEach((item) => {
          const itemCoords = item.coordinates;
          const linkPoints = [
            new THREE.Vector3(x, y, z), // cluster center
            new THREE.Vector3(itemCoords.x, itemCoords.y, itemCoords.z), // physical source coords
          ];
          const linkGeo = new THREE.BufferGeometry().setFromPoints(linkPoints);
          const linkMat = new THREE.LineBasicMaterial({
            color: "#ffffff",
            transparent: true,
            opacity: 0.5,
          });
          const linkLine = new THREE.Line(linkGeo, linkMat);
          group.add(linkLine);
        });
      }
    });

    scene.add(group);
    incidentGroupRef.current = group;

    // Cleanup
    return () => {
      if (incidentGroupRef.current && sceneRef.current) {
        sceneRef.current.remove(incidentGroupRef.current);
      }
    };
  }, [incidentType, incidentX, incidentY, incidentZ, incidentsStr, sceneReady, isFanMode]);

  // Dynamic Visitor Heatmap Overlay Layer
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // 1. Clear previous heatmap elements if any
    if (heatmapGroupRef.current) {
      scene.remove(heatmapGroupRef.current);
      heatmapGroupRef.current = null;
    }

    if (isFanMode || !isHeatmapOverlayEnabled) return;

    // 2. Setup heatmap group
    const group = new THREE.Group();
    group.name = "heatmapGroup";

    // 3. Define standard seating tiers (Radii & elevations matching the MetLife model)
    const tiers = [
      { radius: 64, y: 4.5, baseDensity: 0.68, sizeMultiplier: 1.0 },
      { radius: 72, y: 10.5, baseDensity: 0.60, sizeMultiplier: 1.1 },
      { radius: 81, y: 18.5, baseDensity: 0.52, sizeMultiplier: 1.2 }
    ];

    const numSectors = 16; // 16 sectors around the stadium ring

    // 4. Gather active telemetry incident coordinates
    const activeIncidents: { x: number; y: number; z: number }[] = [];
    if (incidents && incidents.length > 0) {
      incidents.forEach((inc) => {
        if (inc.coordinates) {
          activeIncidents.push(inc.coordinates);
        }
      });
    }
    if (incidentType && incident?.coordinates) {
      activeIncidents.push(incident.coordinates);
    }

    // 5. Generate density spheres for all seating sectors
    for (let tierIdx = 0; tierIdx < tiers.length; tierIdx++) {
      const tier = tiers[tierIdx];
      for (let s = 0; s < numSectors; s++) {
        const angle = (s / numSectors) * Math.PI * 2;
        const x = Math.cos(angle) * tier.radius;
        const z = Math.sin(angle) * tier.radius;
        const y = tier.y;

        // Calculate proximity to any active incident to spike density levels (creating peak hotspots)
        let minDistance = 9999;
        activeIncidents.forEach((coords) => {
          const dx = coords.x - x;
          const dy = coords.y - y;
          const dz = coords.z - z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (dist < minDistance) {
            minDistance = dist;
          }
        });

        // Add standard high-fidelity sector density fluctuation based on angle to look organic
        const fluctuation = Math.sin(angle * 3 + tierIdx) * 0.12;
        let density = Math.max(0.1, Math.min(0.95, tier.baseDensity + fluctuation));

        // Apply proximity-based spike from incident telemetry (heatmap reacts directly to alerts)
        if (minDistance < 35.0) {
          const spikeFactor = 1.0 - (minDistance / 35.0); // 1.0 at zero distance, 0.0 at 35 units
          const spikeAmount = spikeFactor * 0.45; // Maximum 45% occupancy surge around problems
          density = Math.min(1.0, density + spikeAmount);
        }

        // Color mapping for seating density heat map:
        // Critical Peak (Red): >= 0.82
        // High (Orange): 0.65 - 0.82
        // Moderate (Green): 0.40 - 0.65
        // Comfortable (Blue/Cyan): < 0.40
        let colorHex = 0x06b6d4; // cyan
        let scale = 1.0;

        if (density >= 0.82) {
          colorHex = 0xef4444; // Crimson Red
          scale = 1.35;
        } else if (density >= 0.65) {
          colorHex = 0xf97316; // Amber Orange
          scale = 1.15;
        } else if (density >= 0.40) {
          colorHex = 0x10b981; // Emerald Green
          scale = 1.0;
        } else {
          colorHex = 0x3b82f6; // comfortable Indigo Blue
          scale = 0.85;
        }

        // Outer volumetric wireframe heat bubble representing occupancy zone
        const sphereRadius = 3.6 * scale * tier.sizeMultiplier;
        const sphereGeo = new THREE.SphereGeometry(sphereRadius, 8, 8);
        const sphereMat = new THREE.MeshBasicMaterial({
          color: colorHex,
          transparent: true,
          opacity: 0.32,
          wireframe: true,
          depthWrite: false,
        });

        const heatNode = new THREE.Mesh(sphereGeo, sphereMat);
        heatNode.position.set(x, y, z);
        heatNode.name = "heatmapNode";
        heatNode.userData = {
          density: density,
          baseOpacity: 0.32,
          angleOffset: angle + tierIdx,
          scale: scale * tier.sizeMultiplier,
        };
        group.add(heatNode);

        // Solid core particle inside the wireframe bubble
        const coreGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
        const coreMat = new THREE.MeshStandardMaterial({
          color: colorHex,
          emissive: colorHex,
          emissiveIntensity: 1.2,
          transparent: true,
          opacity: 0.75,
        });
        const coreNode = new THREE.Mesh(coreGeo, coreMat);
        coreNode.position.set(x, y, z);
        coreNode.name = "heatmapCore";
        group.add(coreNode);
      }
    }

    scene.add(group);
    heatmapGroupRef.current = group;

    // Cleanup
    return () => {
      if (heatmapGroupRef.current && sceneRef.current) {
        sceneRef.current.remove(heatmapGroupRef.current);
      }
    };
  }, [isHeatmapOverlayEnabled, incidentsStr, incidentType, incidentX, incidentY, incidentZ, sceneReady, isFanMode]);

  // Dynamic Floor Concourse/Pathway Heatmap Overlay Layer for Fan/Spectator Wayfinding
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // 1. Clear previous floor heatmap group if any
    if (floorHeatmapGroupRef.current) {
      scene.remove(floorHeatmapGroupRef.current);
      floorHeatmapGroupRef.current = null;
    }

    const isEnabled = isFloorHeatmapEnabled !== undefined ? isFloorHeatmapEnabled : (isFanMode ? true : isHeatmapOverlayEnabled);
    if (!isEnabled) return;

    // 2. Setup floor heatmap group
    const group = new THREE.Group();
    group.name = "floorHeatmapGroup";

    // Define the hubs (Gates, concourse checkpoints, paths)
    const hubs = [
      { id: "gate_a", name: "Gate A [Verizon]", x: -55, z: -55, baseCongestion: 0.3 },
      { id: "gate_b", name: "Gate B [HCLTech]", x: -55, z: 55, baseCongestion: 0.85 },
      { id: "gate_c", name: "Gate C [MetLife]", x: 55, z: 55, baseCongestion: 0.55 },
      { id: "gate_d", name: "Gate D [Welch's]", x: 55, z: -55, baseCongestion: 0.2 },
      
      { id: "concourse_nw", name: "Concourse NW", x: -38, z: -38, baseCongestion: 0.4 },
      { id: "concourse_sw", name: "Concourse SW", x: -38, z: 38, baseCongestion: 0.75 },
      { id: "concourse_se", name: "Concourse SE", x: 38, z: 38, baseCongestion: 0.6 },
      { id: "concourse_ne", name: "Concourse NE", x: 38, z: -38, baseCongestion: 0.25 },
    ];

    // Create the physical floor hotspot rings and circles
    hubs.forEach((hub) => {
      const x = hub.x;
      const z = hub.z;
      const y = 0.25; // Slightly above ground (y=0.1) to avoid z-fighting with pitch

      // Hotspot circle geometry
      const circleGeo = new THREE.CircleGeometry(6.5, 16);
      const circleMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(hub.baseCongestion >= 0.75 ? 0xef4444 : hub.baseCongestion >= 0.45 ? 0xf97316 : 0x10b981),
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide,
        depthWrite: false,
      });

      const hotspot = new THREE.Mesh(circleGeo, circleMat);
      hotspot.rotation.x = -Math.PI / 2;
      hotspot.position.set(x, y, z);
      hotspot.name = "floorHotspotCircle";
      hotspot.userData = {
        id: hub.id,
        baseCongestion: hub.baseCongestion,
        offset: Math.random() * 10,
        currentCongestion: hub.baseCongestion,
      };
      group.add(hotspot);

      // Outer targeting/pulse ring
      const ringsPoints = [];
      const steps = 32;
      const ringRadius = 7.5;
      for (let i = 0; i <= steps; i++) {
        const theta = (i / steps) * Math.PI * 2;
        ringsPoints.push(new THREE.Vector3(Math.cos(theta) * ringRadius, 0.0, Math.sin(theta) * ringRadius));
      }
      const ringGeo = new THREE.BufferGeometry().setFromPoints(ringsPoints);
      const ringMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(hub.baseCongestion >= 0.75 ? 0xef4444 : hub.baseCongestion >= 0.45 ? 0xf97316 : 0x10b981),
        transparent: true,
        opacity: 0.7,
        depthTest: true,
      });
      const outerRing = new THREE.Line(ringGeo, ringMat);
      outerRing.position.set(x, y + 0.01, z);
      outerRing.name = "floorHotspotOuterRing";
      group.add(outerRing);

      // Indicator pillar
      const cylinderGeo = new THREE.CylinderGeometry(0.15, 0.15, 2.5, 6, 1, true);
      const cylinderMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(hub.baseCongestion >= 0.75 ? 0xef4444 : hub.baseCongestion >= 0.45 ? 0xf97316 : 0x10b981),
        transparent: true,
        opacity: 0.2,
        wireframe: true,
      });
      const indicatorPillar = new THREE.Mesh(cylinderGeo, cylinderMat);
      indicatorPillar.position.set(x, y + 1.25, z);
      indicatorPillar.name = "floorHotspotPillar";
      group.add(indicatorPillar);
    });

    // Create paths connecting these hubs (walkways)
    const paths = [
      { from: "gate_a", to: "concourse_nw" },
      { from: "gate_b", to: "concourse_sw" },
      { from: "gate_c", to: "concourse_se" },
      { from: "gate_d", to: "concourse_ne" },
      { from: "concourse_nw", to: "concourse_sw" },
      { from: "concourse_sw", to: "concourse_se" },
      { from: "concourse_se", to: "concourse_ne" },
      { from: "concourse_ne", to: "concourse_nw" },
    ];

    paths.forEach((p, idx) => {
      const hub1 = hubs.find(h => h.id === p.from)!;
      const hub2 = hubs.find(h => h.id === p.to)!;

      const p1 = new THREE.Vector3(hub1.x, 0.23, hub1.z);
      const p2 = new THREE.Vector3(hub2.x, 0.23, hub2.z);

      const dx = p2.x - p1.x;
      const dz = p2.z - p1.z;
      const distance = Math.sqrt(dx * dx + dz * dz);
      const angle = Math.atan2(dz, dx);

      // Path ribbon geometry
      const pathGeo = new THREE.PlaneGeometry(distance, 2.8);
      const pathMat = new THREE.MeshBasicMaterial({
        color: 0x10b981,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide,
        depthWrite: false,
      });

      const pathMesh = new THREE.Mesh(pathGeo, pathMat);
      pathMesh.rotation.x = -Math.PI / 2;
      pathMesh.rotation.z = -angle;
      pathMesh.position.set((p1.x + p2.x) / 2, 0.23, (p1.z + p2.z) / 2);

      pathMesh.name = "floorPathwayRibbon";
      pathMesh.userData = {
        from: p.from,
        to: p.to,
        distance: distance,
        angle: angle,
        p1: p1,
        p2: p2,
        offset: idx * 2.5,
      };
      group.add(pathMesh);

      // Traveling flow particles
      for (let dotIdx = 0; dotIdx < 3; dotIdx++) {
        const flowDotGeo = new THREE.SphereGeometry(0.5, 8, 8);
        const flowDotMat = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.8,
        });
        const flowDot = new THREE.Mesh(flowDotGeo, flowDotMat);
        flowDot.position.copy(p1);
        flowDot.position.y = 0.35;
        flowDot.name = "floorFlowDot";
        flowDot.userData = {
          p1: p1,
          p2: p2,
          progress: (dotIdx / 3.0) + Math.random() * 0.1,
          speed: 0.008 + Math.random() * 0.005,
        };
        group.add(flowDot);
      }
    });

    scene.add(group);
    floorHeatmapGroupRef.current = group;

    return () => {
      if (floorHeatmapGroupRef.current && sceneRef.current) {
        sceneRef.current.remove(floorHeatmapGroupRef.current);
      }
    };
  }, [isFloorHeatmapEnabled, isHeatmapOverlayEnabled, isFanMode, sceneReady]);

  useEffect(() => {
    if (!deferredReady) return;
    if (!mountRef.current) return;

    // Clear any leftover canvases or elements to prevent duplicates or static overlapping images
    mountRef.current.innerHTML = "";

    // 1. Scene setup with grid overlay background
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#080a0c");
    scene.fog = new THREE.FogExp2("#080a0c", 0.005);
    sceneRef.current = scene;

    // 2. Camera setup
    const width = mountRef.current.clientWidth || 400;
    const height = mountRef.current.clientHeight || 300;
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.position.set(currentCam.current.x, currentCam.current.y, currentCam.current.z);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Style canvas element explicitly to prevent layout/overflow issues
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.left = "0";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.maxWidth = "100%";
    renderer.domElement.style.maxHeight = "100%";
    renderer.domElement.style.display = "block";
    renderer.domElement.style.pointerEvents = "auto";
    renderer.domElement.id = "threejs-canvas";
    
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3.5 OrbitControls Setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 22; // Stop zooming in at a reasonable point
    controls.maxDistance = 140; // Stop zooming out too far
    controls.target.copy(currentLook.current);
    controls.addEventListener("start", () => {
      userTakingManualControlRef.current = true;
    });
    controlsRef.current = controls;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight("#1e293b", 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight("#3b82f6", 1.5);
    dirLight1.position.set(50, 100, 50);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight("#ef4444", 0.5);
    dirLight2.position.set(-50, -50, -50);
    scene.add(dirLight2);

    // Advanced Arena Lighting Rig (Symmetrical four-quadrant spotlights & interior ground uplight)
    const quadLights: THREE.SpotLight[] = [];
    const lightLocations = [
      [100, 80, 100],   // North-East Quad
      [-100, 80, 100],  // North-West Quad
      [-100, 80, -100], // South-West Quad
      [100, 80, -100]   // South-East Quad
    ];

    lightLocations.forEach(([x, y, z]) => {
      const quadLight = new THREE.SpotLight(0xffffff, 1.8);
      quadLight.position.set(x, y, z);
      quadLight.angle = Math.PI / 3;
      quadLight.penumbra = 0.6;
      quadLight.decay = 1;
      quadLight.distance = 300;
      scene.add(quadLight);
      quadLights.push(quadLight);
    });

    const groundLight = new THREE.HemisphereLight(0x3b82f6, 0x0f172a, 1.0);
    scene.add(groundLight);

    // 4.5 Stadium Floodlights & Fixtures Setup
    const floodlightColor = 0xffffff;
    const floodlights: THREE.SpotLight[] = [];
    const floodlightFixtures: THREE.Mesh[] = [];

    const floodlightPositions = [
      new THREE.Vector3(-62, 38, -62),
      new THREE.Vector3(-62, 38, 62),
      new THREE.Vector3(62, 38, 62),
      new THREE.Vector3(62, 38, -62),
    ];

    const fixtureGeo = new THREE.CylinderGeometry(1.2, 1.2, 2.5, 8);
    const baseFixtureMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      emissive: 0xffffff,
      emissiveIntensity: 3.0,
      roughness: 0.2,
      metalness: 0.8
    });

    floodlightPositions.forEach((pos) => {
      // Create high-intensity spot light pointing at pitch center
      const sLight = new THREE.SpotLight(floodlightColor, 6.0, 150, Math.PI / 4, 0.6, 1);
      sLight.position.copy(pos);
      sLight.target.position.set(0, 0, 0);
      scene.add(sLight);
      scene.add(sLight.target);
      floodlights.push(sLight);

      // Create physical cylindrical fixture mesh
      const fixtureMesh = new THREE.Mesh(fixtureGeo, baseFixtureMat.clone());
      fixtureMesh.position.copy(pos);
      fixtureMesh.lookAt(0, 0, 0);
      fixtureMesh.rotateX(Math.PI / 2);
      scene.add(fixtureMesh);
      floodlightFixtures.push(fixtureMesh);
    });

    // 5. Tactical Ground Grid
    const gridHelper = new THREE.GridHelper(200, 40, "#1e293b", "#0f172a");
    gridHelper.position.y = -0.1;
    scene.add(gridHelper);

    // Night-time Match Field Lights Setup (four corner spotlights pointing at different quarters of the field)
    const nightFieldLights: THREE.SpotLight[] = [];
    const cornerPositions = [
      [55, 30, 35],
      [-55, 30, 35],
      [-55, 30, -35],
      [55, 30, -35]
    ];
    cornerPositions.forEach(([cx, cy, cz]) => {
      const pLight = new THREE.SpotLight(0xffffff, 0.0, 150, Math.PI / 3, 0.5, 1);
      pLight.position.set(cx, cy, cz);
      pLight.target.position.set(cx * 0.4, 0, cz * 0.4);
      scene.add(pLight);
      scene.add(pLight.target);
      nightFieldLights.push(pLight);
    });

    // Real-time Ball Tracker 3D Objects Setup
    const ballTrackerGroup = new THREE.Group();
    scene.add(ballTrackerGroup);

    // Ball Mesh (Glowing neon-green/cyan sphere)
    const ballGeo = new THREE.SphereGeometry(0.6, 16, 16);
    const ballMat = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      emissive: 0x10b981,
      emissiveIntensity: 4.0,
      roughness: 0.1,
      metalness: 0.9
    });
    const ballMesh = new THREE.Mesh(ballGeo, ballMat);
    ballMesh.position.set(0, -10, 0); // Start below pitch
    ballTrackerGroup.add(ballMesh);

    // Dynamic light inside ball to cast soft green glow on turf
    const ballLight = new THREE.PointLight(0x10b981, 4.0, 15);
    ballMesh.add(ballLight);

    // Origin Ring (Cyan ground marker)
    const nodeRingGeo = new THREE.RingGeometry(1.2, 1.5, 32);
    const originRingMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee, // Cyan
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.0,
      depthWrite: false
    });
    const originRing = new THREE.Mesh(nodeRingGeo, originRingMat);
    originRing.rotation.x = -Math.PI / 2;
    originRing.position.y = 0.15;
    ballTrackerGroup.add(originRing);

    // Destination Ring (Amber ground marker)
    const destRingMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b, // Amber
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.0,
      depthWrite: false
    });
    const destRing = new THREE.Mesh(nodeRingGeo, destRingMat);
    destRing.rotation.x = -Math.PI / 2;
    destRing.position.y = 0.15;
    ballTrackerGroup.add(destRing);

    // Shadow Indicator Ring directly underneath the ball
    const ballShadowRingGeo = new THREE.RingGeometry(0.3, 0.5, 16);
    const ballShadowRingMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.0,
      depthWrite: false
    });
    const ballShadowRing = new THREE.Mesh(ballShadowRingGeo, ballShadowRingMat);
    ballShadowRing.rotation.x = -Math.PI / 2;
    ballShadowRing.position.y = 0.12;
    ballTrackerGroup.add(ballShadowRing);

    // Trajectory Path Arc Line
    const trajectoryPointsCount = 50;
    const trajectoryPositions = new Float32Array(trajectoryPointsCount * 3);
    const trajectoryGeo = new THREE.BufferGeometry();
    trajectoryGeo.setAttribute("position", new THREE.BufferAttribute(trajectoryPositions, 3));
    const trajectoryMat = new THREE.LineBasicMaterial({
      color: 0x06b6d4, // Cyan line
      transparent: true,
      opacity: 0.0,
    });
    const trajectoryLine = new THREE.Line(trajectoryGeo, trajectoryMat);
    ballTrackerGroup.add(trajectoryLine);

    // 5.5 Dynamic Sky System Shader & Searchlights Setup
    interface SkyUniforms {
      uTime: { value: number };
      uColorTop: { value: THREE.Color };
      uColorBottom: { value: THREE.Color };
      uWeather: { value: number };
    }

    const skyUniforms: SkyUniforms = {
      uTime: { value: 0 },
      uColorTop: { value: new THREE.Color("#050510") },
      uColorBottom: { value: new THREE.Color("#101525") },
      uWeather: { value: 0.0 }
    };

    const skyMat = new THREE.ShaderMaterial({
      uniforms: skyUniforms as any,
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vWorldPosition;
        uniform float uTime;
        uniform vec3 uColorTop;
        uniform vec3 uColorBottom;
        uniform float uWeather;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
                     mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
        }

        float fbm(vec2 p) {
          float v = 0.0;
          float a = 0.5;
          vec2 shift = vec2(100.0);
          mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
          for (int i = 0; i < 4; ++i) {
            v += a * noise(p);
            p = rot * p * 2.0 + shift;
            a *= 0.5;
          }
          return v;
        }

        void main() {
          vec3 dir = normalize(vWorldPosition);
          float h = dir.y * 0.5 + 0.5;
          vec3 skyColor = mix(uColorBottom, vWorldPosition.y < 0.0 ? uColorBottom : uColorTop, clamp(h, 0.0, 1.0));
          
          if (uWeather < 0.5) {
            // SUNSHINE
            float sunGlow = max(0.0, dot(dir, normalize(vec3(-0.5, 0.8, -0.5))));
            skyColor += vec3(0.95, 0.6, 0.1) * pow(sunGlow, 8.0) * 0.4;
            skyColor += vec3(1.0, 1.0, 0.9) * pow(sunGlow, 120.0) * 0.8;
            
            vec2 cloudUV = dir.xz / (dir.y + 0.01) * 0.2 + vec2(uTime * 0.005, uTime * 0.002);
            if (dir.y > 0.0) {
              float cl = fbm(cloudUV);
              skyColor = mix(skyColor, vec3(1.0), smoothstep(0.4, 0.8, cl) * 0.2 * dir.y);
            }
          } else if (uWeather < 1.5) {
            // RAIN
            vec2 cloudUV = dir.xz / (dir.y + 0.01) * 0.35 + vec2(uTime * 0.015, uTime * 0.01);
            if (dir.y > 0.0) {
              float cl = fbm(cloudUV);
              vec3 stormCloud = vec3(0.12, 0.15, 0.2) + vec3(cl * 0.1);
              skyColor = mix(skyColor, stormCloud, smoothstep(0.2, 0.7, cl) * 0.65 * dir.y);
            }
          } else if (uWeather < 2.5) {
            // FOG
            vec2 cloudUV = dir.xz / (dir.y + 0.01) * 0.1 + vec2(uTime * 0.003, uTime * 0.001);
            if (dir.y > 0.0) {
              float cl = fbm(cloudUV);
              skyColor = mix(skyColor, vec3(0.15, 0.18, 0.22), (0.5 + 0.5 * cl) * 0.8 * dir.y);
            }
          } else {
            // SNOW
            vec2 cloudUV = dir.xz / (dir.y + 0.01) * 0.25 + vec2(uTime * 0.008, -uTime * 0.005);
            if (dir.y > 0.0) {
              float cl = fbm(cloudUV);
              skyColor = mix(skyColor, vec3(0.85, 0.9, 0.95), smoothstep(0.3, 0.75, cl) * 0.4 * dir.y);
            }
          }
          
          gl_FragColor = vec4(skyColor, 1.0);
        }
      `,
      side: THREE.BackSide,
      fog: false
    });

    const skyDome = new THREE.Mesh(new THREE.SphereGeometry(400, 32, 15), skyMat);
    scene.add(skyDome);

    // Dynamic Searchlights
    const spotlights: THREE.Mesh[] = [];
    const spotlightGeo = new THREE.CylinderGeometry(0.1, 10, 150, 16, 1, true);
    const spotlightMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      fog: false
    });
    
    const spotlightPositions = [
      new THREE.Vector3(-65, 75, -65),
      new THREE.Vector3(-65, 75, 65),
      new THREE.Vector3(65, 75, 65),
      new THREE.Vector3(65, 75, -65)
    ];

    spotlightPositions.forEach((pos) => {
      const lightMesh = new THREE.Mesh(spotlightGeo, spotlightMat.clone());
      lightMesh.position.copy(pos);
      lightMesh.rotation.x = 0.1;
      lightMesh.rotation.z = -0.1;
      scene.add(lightMesh);
      spotlights.push(lightMesh);
    });

    // 6. Stadium Wireframe Geometries
    const stadiumGroup = new THREE.Group();

    // Pitch Green Grid Rectangle with Programmatic Canvas Texture (World Cup Pitch Accuracy)
    let fieldTexture: THREE.Texture;
    if (globalTextureCache.has("pitch")) {
      fieldTexture = globalTextureCache.get("pitch")!;
    } else {
      const pitchCanvas = document.createElement('canvas');
      pitchCanvas.width = 512; 
      pitchCanvas.height = 340; // ~1.5 ratio corresponding to 105 x 68
      const pitchCtx = pitchCanvas.getContext('2d');
      if (pitchCtx) {
        // Base green turf grass
        pitchCtx.fillStyle = '#14532d'; // Dark sports green
        pitchCtx.fillRect(0, 0, 512, 340);
        
        // Alternating pitch grass stripes
        pitchCtx.fillStyle = '#166534'; // Lighter sports green
        for (let i = 0; i < 512; i += 40) {
          pitchCtx.fillRect(i, 0, 20, 340);
        }
        
        // High-fidelity line markings
        pitchCtx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        pitchCtx.lineWidth = 3;
        
        // Outer touchlines
        const margin = 12;
        pitchCtx.strokeRect(margin, margin, 512 - margin * 2, 340 - margin * 2);
        
        // Midfield Line
        pitchCtx.beginPath();
        pitchCtx.moveTo(256, margin);
        pitchCtx.lineTo(256, 340 - margin);
        pitchCtx.stroke();
        
        // Center circle
        pitchCtx.beginPath();
        pitchCtx.arc(256, 170, 45, 0, Math.PI * 2);
        pitchCtx.stroke();
        
        // Center spot
        pitchCtx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        pitchCtx.beginPath();
        pitchCtx.arc(256, 170, 4, 0, Math.PI * 2);
        pitchCtx.fill();
        
        // Penalty Area Left
        pitchCtx.strokeRect(margin, 170 - 75, 55, 150);
        pitchCtx.strokeRect(margin, 170 - 32, 18, 64);
        pitchCtx.beginPath();
        pitchCtx.arc(margin + 50, 170, 32, -Math.PI / 3, Math.PI / 3);
        pitchCtx.stroke();
        
        // Penalty Area Right
        pitchCtx.strokeRect(512 - margin - 55, 170 - 75, 55, 150);
        pitchCtx.strokeRect(512 - margin - 18, 170 - 32, 18, 64);
        pitchCtx.beginPath();
        pitchCtx.arc(512 - margin - 50, 170, 32, Math.PI - Math.PI / 3, Math.PI + Math.PI / 3);
        pitchCtx.stroke();
      }
      
      fieldTexture = new THREE.CanvasTexture(pitchCanvas);
      fieldTexture.needsUpdate = true;
      globalTextureCache.set("pitch", fieldTexture);
    }
    const pitchGeo = new THREE.PlaneGeometry(105, 68);
    const pitchMat = new THREE.MeshStandardMaterial({
      map: fieldTexture,
      side: THREE.DoubleSide,
      roughness: 0.85,
      metalness: 0.15,
    });
    const pitch = new THREE.Mesh(pitchGeo, pitchMat);
    pitch.rotation.x = -Math.PI / 2;
    pitch.position.y = 0.1; // Slightly above ground to prevent z-fighting with helper
    stadiumGroup.add(pitch);

    // Stadium Dimensions & Seating Tier Structures (MetLife Architecture)
    const bowlRadiusInner = 60;
    const bowlRadiusOuter = 85;
    const bowlHeight = 25;

    // Premium materials for a realistic stadium structure
    const structuralMat = new THREE.MeshStandardMaterial({ 
      color: 0x64748b, // Slate metallic gray
      metalness: 0.8, 
      roughness: 0.25,
      side: THREE.DoubleSide
    });

    const metlifeSkinMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,        // Exact Slate-Silver Aluminum coating color
      metalness: 0.95,        // High metallic feedback to catch the spotlights
      roughness: 0.15,       // High gloss reflections
      transparent: true,      // Activates alpha pipeline blending
      opacity: 0.40,          // 40% density allows internal marker tracking through walls
      side: THREE.DoubleSide  // Renders illumination on both inside and outside faces
    });

    // 1. Lower Bowl Seating Tier (Louver structure)
    const lowerBowlGeo = new THREE.CylinderGeometry(bowlRadiusInner + 8, bowlRadiusInner, bowlHeight * 0.5, 32, 1, true);
    const lowerBowl = new THREE.Mesh(lowerBowlGeo, metlifeSkinMat);
    lowerBowl.position.y = (bowlHeight * 0.5) / 2;
    stadiumGroup.add(lowerBowl);

    // 2. Middle Bowl Seating Tier (Louver structure)
    const middleBowlGeo = new THREE.CylinderGeometry(bowlRadiusInner + 16, bowlRadiusInner + 8, bowlHeight * 0.5, 32, 1, true);
    const middleBowl = new THREE.Mesh(middleBowlGeo, metlifeSkinMat);
    middleBowl.position.y = (bowlHeight * 0.5) + (bowlHeight * 0.5) / 2;
    stadiumGroup.add(middleBowl);

    // 3. Upper Bowl Seating Tier (Louver structure)
    const upperBowlGeo = new THREE.CylinderGeometry(bowlRadiusOuter, bowlRadiusInner + 16, bowlHeight, 32, 1, true);
    const upperBowl = new THREE.Mesh(upperBowlGeo, metlifeSkinMat);
    upperBowl.position.y = bowlHeight + bowlHeight / 2;
    stadiumGroup.add(upperBowl);

    // 4. MetLife Outer Aluminum Louver Skin Wall
    const outerWallGeo = new THREE.CylinderGeometry(bowlRadiusOuter + 1, bowlRadiusInner + 10, bowlHeight * 2, 48, 1, true);
    const outerWall = new THREE.Mesh(outerWallGeo, metlifeSkinMat);
    outerWall.position.y = bowlHeight;
    stadiumGroup.add(outerWall);

    // 5. Vertical Structural Columns/Pillars around the MetLife perimeter
    const numPillars = 48;
    const pillarGeo = new THREE.BoxGeometry(1.5, bowlHeight * 2, 3);
    for (let i = 0; i < numPillars; i++) {
      const angle = (i / numPillars) * Math.PI * 2;
      const x = Math.cos(angle) * (bowlRadiusOuter + 1.5);
      const z = Math.sin(angle) * (bowlRadiusOuter + 1.5);
      const pillarMesh = new THREE.Mesh(pillarGeo, structuralMat);
      pillarMesh.position.set(x, bowlHeight, z);
      pillarMesh.rotation.y = -angle; // Face towards center
      stadiumGroup.add(pillarMesh);
    }

    // 6. MetLife Cognitive LED Ribbon Boards
    const ledMatLower = new THREE.MeshStandardMaterial({
      color: 0x06b6d4, // Cyan
      emissive: 0x06b6d4,
      emissiveIntensity: 1.5,
      side: THREE.DoubleSide
    });
    const ledRibbonLowerGeo = new THREE.CylinderGeometry(bowlRadiusInner + 8.1, bowlRadiusInner + 8.1, 1.0, 32, 1, true);
    const ledRibbonLower = new THREE.Mesh(ledRibbonLowerGeo, ledMatLower);
    ledRibbonLower.position.y = bowlHeight * 0.5;
    stadiumGroup.add(ledRibbonLower);

    const ledMatUpper = new THREE.MeshStandardMaterial({
      color: 0x3b82f6, // Blue
      emissive: 0x3b82f6,
      emissiveIntensity: 1.5,
      side: THREE.DoubleSide
    });
    const ledRibbonUpperGeo = new THREE.CylinderGeometry(bowlRadiusInner + 16.1, bowlRadiusInner + 16.1, 1.2, 32, 1, true);
    const ledRibbonUpper = new THREE.Mesh(ledRibbonUpperGeo, ledMatUpper);
    ledRibbonUpper.position.y = bowlHeight;
    stadiumGroup.add(ledRibbonUpper);

    // Floating roof ring (glowing cyberpunk element)
    const roofRingPoints = [];
    for (let i = 0; i <= 64; i++) {
      const theta = (i / 64) * Math.PI * 2;
      roofRingPoints.push(new THREE.Vector3(Math.cos(theta) * (bowlRadiusOuter + 2), bowlHeight * 2, Math.sin(theta) * (bowlRadiusOuter + 2)));
    }
    const roofRingGeo = new THREE.BufferGeometry().setFromPoints(roofRingPoints);
    const roofRingMat = new THREE.LineBasicMaterial({ color: "#06b6d4" });
    const roofRing = new THREE.Line(roofRingGeo, roofRingMat);
    stadiumGroup.add(roofRing);

    // 3D Center-field FIFA 2026 Holographic Anchor Point
    const centerAnchorGroup = new THREE.Group();
    centerAnchorGroup.position.set(0, 0.1, 0);

    // Rotating outer tech ring on the pitch
    const centerRingGeo = new THREE.RingGeometry(3, 3.5, 32);
    const centerRingMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8
    });
    const centerRing = new THREE.Mesh(centerRingGeo, centerRingMat);
    centerRing.rotation.x = Math.PI / 2;
    centerAnchorGroup.add(centerRing);

    // Pulsing inner core sphere
    const centerDotGeo = new THREE.SphereGeometry(0.8, 16, 16);
    const centerDotMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xef4444,
      emissiveIntensity: 2.0,
      transparent: true,
      opacity: 0.9
    });
    const centerDot = new THREE.Mesh(centerDotGeo, centerDotMat);
    centerDot.position.y = 0.5;
    centerAnchorGroup.add(centerDot);

    // Holographic vertical beacon shaft
    const beaconGeo = new THREE.CylinderGeometry(0.01, 1.2, 8, 16, 1, true);
    const beaconMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.y = 4;
    centerAnchorGroup.add(beacon);

    stadiumGroup.add(centerAnchorGroup);

    scene.add(stadiumGroup);
    skinMatRef.current = metlifeSkinMat;
    stadiumGroupRef.current = stadiumGroup;

    // Apply any initial structural styles on mount immediately
    const wallColor = venueStructuralProfile?.programmatic_texture_directives?.wall_color_hex || "#94a3b8";
    const roughness = venueStructuralProfile?.programmatic_texture_directives?.material_roughness !== undefined
      ? venueStructuralProfile.programmatic_texture_directives.material_roughness
      : 0.15;
    const transparency = venueStructuralProfile?.programmatic_texture_directives?.material_transparency_alpha !== undefined
      ? venueStructuralProfile.programmatic_texture_directives.material_transparency_alpha
      : 0.40;

    metlifeSkinMat.color.set(wallColor);
    metlifeSkinMat.roughness = roughness;
    metlifeSkinMat.opacity = transparency;
    metlifeSkinMat.needsUpdate = true;

    const multiplier = venueStructuralProfile?.programmatic_texture_directives?.stadium_geometry_extrusion_multiplier !== undefined
      ? venueStructuralProfile.programmatic_texture_directives.stadium_geometry_extrusion_multiplier
      : 1.0;
    stadiumGroup.scale.set(1.0, multiplier, 1.0);

    // 7. Core Interactive Nodes & Pillars
    const nodes: { [key: string]: { pos: THREE.Vector3; color: string; label: string } } = {
      "GATE_A": { pos: new THREE.Vector3(-55, 2.5, -55), color: "#3b82f6", label: "Gate A [Verizon]" },
      "GATE_B": { pos: new THREE.Vector3(-55, 2.5, 55), color: "#3b82f6", label: "Gate B [HCLTech]" },
      "GATE_C": { pos: new THREE.Vector3(55, 2.5, 55), color: "#3b82f6", label: "Gate C [MetLife]" },
      "GATE_D": { pos: new THREE.Vector3(55, 2.5, -55), color: "#3b82f6", label: "Gate D [Welch's]" },
      "TROUBLESHOOTING_BOOTH": { pos: new THREE.Vector3(-60, 2.5, -45), color: "#eab308", label: "Troubleshooting Booth" },
      "SECTION_118": { pos: new THREE.Vector3(-35, 5, 40), color: "#3b82f6", label: "Sec 118 [Accessible]" },
      "SECTION_143": { pos: new THREE.Vector3(35, 5, -40), color: "#10b981", label: "Sec 143 [Concessions]" },
    };

    const nodeMeshes: { [key: string]: THREE.Mesh } = {};
    const glowRingMeshes: { [key: string]: THREE.Line } = {};

    Object.entries(nodes).forEach(([name, data]) => {
      // In fan mode, only display gates to keep view clean and focus on gate navigation
      if (isFanMode && !name.startsWith("GATE_")) return;

      // Cylindrical visual beacon pillar
        const cylinderGeo = new THREE.CylinderGeometry(0.5, 0.5, data.pos.y * 2, 8, 1, false);
        const cylinderMat = new THREE.MeshBasicMaterial({
          color: data.color,
          transparent: true,
          opacity: 0.15,
          wireframe: true,
          depthTest: false,
        });
        const pillar = new THREE.Mesh(cylinderGeo, cylinderMat);
        pillar.position.copy(data.pos);
        pillar.position.y = data.pos.y;
        scene.add(pillar);

        // Node marker (sphere) - dynamic safety beacons & ADA Section 118 indicators
        const sphereGeo = new THREE.SphereGeometry(1.8, 16, 16);
        const sphereMat = new THREE.MeshPhongMaterial({
          color: data.color,
          emissive: data.color,
          emissiveIntensity: 3.0,
          shininess: 30,
          depthTest: false,
        });
        const sphere = new THREE.Mesh(sphereGeo, sphereMat);
        sphere.position.copy(data.pos);
        sphere.position.y = data.pos.y * 2;
        scene.add(sphere);
        nodeMeshes[name] = sphere;

        // Glow rings
        const ringsPoints = [];
        const steps = 32;
        for (let i = 0; i <= steps; i++) {
          const theta = (i / steps) * Math.PI * 2;
          ringsPoints.push(new THREE.Vector3(Math.cos(theta) * 4.5, 0.5, Math.sin(theta) * 4.5));
        }
        const ringGeo = new THREE.BufferGeometry().setFromPoints(ringsPoints);
        const ringMat = new THREE.LineBasicMaterial({ 
          color: data.color, 
          transparent: true, 
          opacity: 0.7,
          depthTest: false,
        });
        const glowRing = new THREE.Line(ringGeo, ringMat);
        glowRing.position.copy(data.pos);
        glowRing.position.y = 0.5;
        scene.add(glowRing);
        glowRingMeshes[name] = glowRing;
      });

    // 8. Dynamic Glowing Scanning Line Laser
    const scannerPoints = [
      new THREE.Vector3(-100, 0.5, 0),
      new THREE.Vector3(100, 0.5, 0)
    ];
    const scannerGeo = new THREE.BufferGeometry().setFromPoints(scannerPoints);
    const scannerMat = new THREE.LineBasicMaterial({ color: "#ef4444", transparent: true, opacity: 0.8 });
    const scannerLaser = new THREE.Line(scannerGeo, scannerMat);
    if (!isFanMode) {
      scene.add(scannerLaser);
    }

    // 9. Particle Cloud - Representing crowds
    const crowdCount = 180;
    const crowdGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(crowdCount * 3);
    const particleColors = new Float32Array(crowdCount * 3);

    const greenColor = new THREE.Color("#22c55e");
    const redColor = new THREE.Color("#ef4444");

    for (let i = 0; i < crowdCount; i++) {
      // Distribute in a stadium ring
      const angle = Math.random() * Math.PI * 2;
      const radius = bowlRadiusInner + Math.random() * (bowlRadiusOuter - bowlRadiusInner);
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = Math.random() * bowlHeight;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Color based on location crowd density alerts
      let color = greenColor;
      if (angle > -Math.PI / 4 && angle < Math.PI / 4 && radius < bowlRadiusInner + 15) {
        // Gate C crowd clustering
        color = redColor;
      }
      particleColors[i * 3] = color.r;
      particleColors[i * 3 + 1] = color.g;
      particleColors[i * 3 + 2] = color.b;
    }

    crowdGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    crowdGeo.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

    let pTexture: THREE.Texture;
    if (globalTextureCache.has("crowd")) {
      pTexture = globalTextureCache.get("crowd")!;
    } else {
      const pCanvas = document.createElement("canvas");
      pCanvas.width = 16;
      pCanvas.height = 16;
      const pCtx = pCanvas.getContext("2d");
      if (pCtx) {
        pCtx.fillStyle = "#ffffff";
        pCtx.beginPath();
        pCtx.arc(8, 8, 6, 0, Math.PI * 2);
        pCtx.fill();
      }
      pTexture = new THREE.CanvasTexture(pCanvas);
      pTexture.needsUpdate = true;
      globalTextureCache.set("crowd", pTexture);
    }

    const pMat = new THREE.PointsMaterial({
      size: 2.2,
      map: pTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
    });
    const crowdParticles = new THREE.Points(crowdGeo, pMat);
    if (!isFanMode) {
      scene.add(crowdParticles);
    }

    // --- SEATED FANS (DYNAMIC & HIGH FIDELITY FOR FAN MODE) ---
    let seatedFansPoints: THREE.Points | null = null;
    const seatedFansData: {
      basePos: THREE.Vector3;
      angle: number;
      rowIdx: number;
      color: THREE.Color;
      cheerOffset: number;
      cheerSpeed: number;
    }[] = [];

    if (isFanMode) {
      const seatedGeo = new THREE.BufferGeometry();
      const seatedPositionsList: THREE.Vector3[] = [];
      const seatedColorsList: THREE.Color[] = [];

      // We have 12 structured rows mapped perfectly to the stadium bowl geometry
      const rows = [
        // Lower Bowl seating tiers
        { y: 1.5, radius: 61.0 },
        { y: 4.5, radius: 63.0 },
        { y: 7.5, radius: 65.0 },
        { y: 10.5, radius: 67.0 },
        // Middle Bowl seating tiers
        { y: 13.5, radius: 69.5 },
        { y: 16.5, radius: 71.5 },
        { y: 19.5, radius: 73.5 },
        { y: 22.5, radius: 75.5 },
        // Upper Bowl seating tiers
        { y: 26.5, radius: 77.5 },
        { y: 31.5, radius: 79.5 },
        { y: 36.5, radius: 81.5 },
        { y: 41.5, radius: 83.5 },
      ];

      const colorsList = [
        new THREE.Color("#ef4444"), // Red
        new THREE.Color("#3b82f6"), // Blue
        new THREE.Color("#22c55e"), // Green
        new THREE.Color("#eab308"), // Gold/Yellow
        new THREE.Color("#a855f7"), // Purple
        new THREE.Color("#ec4899"), // Pink
        new THREE.Color("#38bdf8"), // Sky Blue
        new THREE.Color("#ffffff"), // White
      ];

      rows.forEach((row, rowIdx) => {
        // Circumference of this row
        const circumference = 2 * Math.PI * row.radius;
        // Space them nicely along the circumference
        const numSeats = Math.floor(circumference / 2.6);

        for (let i = 0; i < numSeats; i++) {
          // Keep a high but organic density (84% occupancy)
          if (Math.random() > 0.84) continue;

          const angle = (i / numSeats) * Math.PI * 2;
          const x = Math.cos(angle) * row.radius;
          const z = Math.sin(angle) * row.radius;
          const y = row.y;

          const basePos = new THREE.Vector3(x, y, z);
          const color = colorsList[Math.floor(Math.random() * colorsList.length)];
          const cheerOffset = Math.random() * Math.PI * 2;
          const cheerSpeed = 1.8 + Math.random() * 2.5;

          seatedFansData.push({
            basePos,
            angle,
            rowIdx,
            color,
            cheerOffset,
            cheerSpeed,
          });

          seatedPositionsList.push(basePos.clone());
          seatedColorsList.push(color.clone());
        }
      });

      const seatedPositions = new Float32Array(seatedPositionsList.length * 3);
      const seatedColors = new Float32Array(seatedColorsList.length * 3);

      for (let i = 0; i < seatedPositionsList.length; i++) {
        seatedPositions[i * 3] = seatedPositionsList[i].x;
        seatedPositions[i * 3 + 1] = seatedPositionsList[i].y;
        seatedPositions[i * 3 + 2] = seatedPositionsList[i].z;

        seatedColors[i * 3] = seatedColorsList[i].r;
        seatedColors[i * 3 + 1] = seatedColorsList[i].g;
        seatedColors[i * 3 + 2] = seatedColorsList[i].b;
      }

      seatedGeo.setAttribute("position", new THREE.BufferAttribute(seatedPositions, 3));
      seatedGeo.setAttribute("color", new THREE.BufferAttribute(seatedColors, 3));

      // Textured sprite for seated fans
      let fanTexture: THREE.Texture;
      if (globalTextureCache.has("seatedFan")) {
        fanTexture = globalTextureCache.get("seatedFan")!;
      } else {
        const fanCanvas = document.createElement("canvas");
        fanCanvas.width = 32;
        fanCanvas.height = 32;
        const fanCtx = fanCanvas.getContext("2d");
        if (fanCtx) {
          const grad = fanCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
          grad.addColorStop(0, "rgba(255, 255, 255, 1)");
          grad.addColorStop(0.3, "rgba(245, 245, 245, 0.9)");
          grad.addColorStop(0.75, "rgba(120, 120, 120, 0.45)");
          grad.addColorStop(1, "rgba(0, 0, 0, 0)");
          fanCtx.fillStyle = grad;
          fanCtx.beginPath();
          fanCtx.arc(16, 16, 14, 0, Math.PI * 2);
          fanCtx.fill();
        }
        fanTexture = new THREE.CanvasTexture(fanCanvas);
        fanTexture.needsUpdate = true;
        globalTextureCache.set("seatedFan", fanTexture);
      }

      const isInitialMatchLive = activeMatchRef.current?.status === "LIVE";
      const seatedMat = new THREE.PointsMaterial({
        size: isInitialMatchLive ? 2.0 : 1.4, // Compact size for highly optimized rendering of massive crowds
        map: fanTexture,
        vertexColors: true,
        transparent: true,
        opacity: isInitialMatchLive ? 1.0 : 0.0,
        depthWrite: false, // Ensures zero z-fighting with stadium transparent walls
        blending: isInitialMatchLive ? THREE.AdditiveBlending : THREE.NormalBlending
      });

      seatedFansPoints = new THREE.Points(seatedGeo, seatedMat);
      seatedFansPoints.visible = isInitialMatchLive;
      scene.add(seatedFansPoints);
      seatedFansPointsRef.current = seatedFansPoints;
      seatedFansDataRef.current = seatedFansData;
    }

    // --- CELEBRATION PIÑATA BURST PARTICLE SYSTEM ---
    let pinataBurstPoints: THREE.Points | null = null;
    const numBursts = 6;
    const particlesPerBurst = 80;
    const totalBurstParticles = numBursts * particlesPerBurst;
    
    const pinataBurstGeo = new THREE.BufferGeometry();
    const pinataBurstPositions = new Float32Array(totalBurstParticles * 3);
    const pinataBurstColors = new Float32Array(totalBurstParticles * 3);
    
    // Hide all burst particles initially deep below ground level
    for (let i = 0; i < totalBurstParticles; i++) {
      pinataBurstPositions[i * 3] = 0;
      pinataBurstPositions[i * 3 + 1] = -9999;
      pinataBurstPositions[i * 3 + 2] = 0;
      
      pinataBurstColors[i * 3] = 1.0;
      pinataBurstColors[i * 3 + 1] = 1.0;
      pinataBurstColors[i * 3 + 2] = 1.0;
    }
    
    pinataBurstGeo.setAttribute("position", new THREE.BufferAttribute(pinataBurstPositions, 3));
    pinataBurstGeo.setAttribute("color", new THREE.BufferAttribute(pinataBurstColors, 3));
    
    let burstTexture: THREE.Texture;
    if (globalTextureCache.has("burstConfetti")) {
      burstTexture = globalTextureCache.get("burstConfetti")!;
    } else {
      const bCanvas = document.createElement("canvas");
      bCanvas.width = 16;
      bCanvas.height = 16;
      const bCtx = bCanvas.getContext("2d");
      if (bCtx) {
        // Starburst styled square confetti
        bCtx.fillStyle = "#ffffff";
        bCtx.fillRect(4, 4, 8, 8);
      }
      burstTexture = new THREE.CanvasTexture(bCanvas);
      burstTexture.needsUpdate = true;
      globalTextureCache.set("burstConfetti", burstTexture);
    }
    
    const burstMat = new THREE.PointsMaterial({
      size: 1.6,
      map: burstTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
    });
    
    pinataBurstPoints = new THREE.Points(pinataBurstGeo, burstMat);
    scene.add(pinataBurstPoints);
    pinataBurstPointsRef.current = pinataBurstPoints;
    
    // Setup burst controller states
    const pinataBursts: {
      active: boolean;
      centerX: number;
      centerY: number;
      centerZ: number;
      birthTime: number;
      duration: number;
      velocities: THREE.Vector3[];
      colors: THREE.Color[];
    }[] = [];
    
    for (let b = 0; b < numBursts; b++) {
      const velocities: THREE.Vector3[] = [];
      const colors: THREE.Color[] = [];
      for (let p = 0; p < particlesPerBurst; p++) {
        velocities.push(new THREE.Vector3());
        colors.push(new THREE.Color());
      }
      pinataBursts.push({
        active: false,
        centerX: 0,
        centerY: -999,
        centerZ: 0,
        birthTime: 0,
        duration: 1.8, // 1.8 seconds lifetime
        velocities,
        colors
      });
    }
    pinataBurstDataRef.current = pinataBursts;

    // Dynamic Weather Particle Systems (Zero Footprint high-fidelity texturing)
    const weatherParticleCount = 1500;
    
    // Rain Particles
    const rainGeo = new THREE.BufferGeometry();
    const rainPositions = new Float32Array(weatherParticleCount * 3);
    const rainVelocities = new Float32Array(weatherParticleCount);
    
    for (let i = 0; i < weatherParticleCount; i++) {
      rainPositions[i * 3] = (Math.random() - 0.5) * 220;
      rainPositions[i * 3 + 1] = Math.random() * 80 + 10;
      rainPositions[i * 3 + 2] = (Math.random() - 0.5) * 220;
      rainVelocities[i] = 1.8 + Math.random() * 1.8;
    }
    
    rainGeo.setAttribute("position", new THREE.BufferAttribute(rainPositions, 3));
    
    let rainTexture: THREE.Texture;
    if (globalTextureCache.has("rain")) {
      rainTexture = globalTextureCache.get("rain")!;
    } else {
      const rainCanvas = document.createElement("canvas");
      rainCanvas.width = 8;
      rainCanvas.height = 32;
      const rainCtx = rainCanvas.getContext("2d");
      if (rainCtx) {
        const grad = rainCtx.createLinearGradient(4, 0, 4, 32);
        grad.addColorStop(0, "rgba(56, 189, 248, 0.1)");
        grad.addColorStop(0.5, "rgba(56, 189, 248, 0.7)");
        grad.addColorStop(1, "rgba(255, 255, 255, 0.9)");
        rainCtx.fillStyle = grad;
        rainCtx.fillRect(2, 0, 4, 32);
      }
      rainTexture = new THREE.CanvasTexture(rainCanvas);
      rainTexture.needsUpdate = true;
      globalTextureCache.set("rain", rainTexture);
    }
    
    const rainMat = new THREE.PointsMaterial({
      size: 1.6,
      map: rainTexture,
      transparent: true,
      opacity: 0.0,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const rainPoints = new THREE.Points(rainGeo, rainMat);
    scene.add(rainPoints);

    // Snow Particles
    const snowGeo = new THREE.BufferGeometry();
    const snowPositions = new Float32Array(weatherParticleCount * 3);
    const snowOffsets = new Float32Array(weatherParticleCount);
    
    for (let i = 0; i < weatherParticleCount; i++) {
      snowPositions[i * 3] = (Math.random() - 0.5) * 220;
      snowPositions[i * 3 + 1] = Math.random() * 80 + 10;
      snowPositions[i * 3 + 2] = (Math.random() - 0.5) * 220;
      snowOffsets[i] = Math.random() * Math.PI * 2;
    }
    
    snowGeo.setAttribute("position", new THREE.BufferAttribute(snowPositions, 3));
    
    let snowTexture: THREE.Texture;
    if (globalTextureCache.has("snow")) {
      snowTexture = globalTextureCache.get("snow")!;
    } else {
      const snowCanvas = document.createElement("canvas");
      snowCanvas.width = 16;
      snowCanvas.height = 16;
      const snowCtx = snowCanvas.getContext("2d");
      if (snowCtx) {
        const grad = snowCtx.createRadialGradient(8, 8, 0, 8, 8, 8);
        grad.addColorStop(0, "rgba(255, 255, 255, 1)");
        grad.addColorStop(0.4, "rgba(224, 242, 254, 0.7)");
        grad.addColorStop(1, "rgba(255, 255, 255, 0)");
        snowCtx.fillStyle = grad;
        snowCtx.beginPath();
        snowCtx.arc(8, 8, 8, 0, Math.PI * 2);
        snowCtx.fill();
      }
      snowTexture = new THREE.CanvasTexture(snowCanvas);
      snowTexture.needsUpdate = true;
      globalTextureCache.set("snow", snowTexture);
    }
    
    const snowMat = new THREE.PointsMaterial({
      size: 1.5,
      map: snowTexture,
      transparent: true,
      opacity: 0.0,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const snowPoints = new THREE.Points(snowGeo, snowMat);
    scene.add(snowPoints);

    // Solar Crown (Sunshine ring indicator)
    const sunGeo = new THREE.RingGeometry(18, 20, 32);
    const sunMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending
    });
    const sunCrown = new THREE.Mesh(sunGeo, sunMat);
    sunCrown.position.set(-80, 130, -80);
    sunCrown.lookAt(0, 0, 0);
    scene.add(sunCrown);

    // Weather Structural Warning Overlays
    const pitchWarningGeo = new THREE.PlaneGeometry(105, 68);
    const pitchWarningMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b, // Amber for high-saturation
      transparent: true,
      opacity: 0.0,
      wireframe: true,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const pitchWarningMesh = new THREE.Mesh(pitchWarningGeo, pitchWarningMat);
    pitchWarningMesh.rotation.x = -Math.PI / 2;
    pitchWarningMesh.position.y = 0.5; // Hovering slightly above turf
    if (!isFanMode) scene.add(pitchWarningMesh);

    const roofWarningGeo = new THREE.CylinderGeometry(bowlRadiusOuter + 2.5, bowlRadiusOuter + 2.5, 4.0, 32, 1, true);
    const roofWarningMat = new THREE.MeshBasicMaterial({
      color: 0xef4444, // Red for high structural shear/uplift
      transparent: true,
      opacity: 0.0,
      wireframe: true,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const roofWarningMesh = new THREE.Mesh(roofWarningGeo, roofWarningMat);
    roofWarningMesh.position.y = bowlHeight * 2;
    if (!isFanMode) scene.add(roofWarningMesh);

    const upperWarningGeo = new THREE.CylinderGeometry(bowlRadiusOuter + 0.5, bowlRadiusInner + 16.5, bowlHeight, 32, 1, true);
    const upperWarningMat = new THREE.MeshBasicMaterial({
      color: 0xf97316, // Orange for aerodynamic drag on upper tiers
      transparent: true,
      opacity: 0.0,
      wireframe: true,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const upperWarningMesh = new THREE.Mesh(upperWarningGeo, upperWarningMat);
    upperWarningMesh.position.y = bowlHeight + bowlHeight / 2;
    if (!isFanMode) scene.add(upperWarningMesh);

    const lowerWarningGeo = new THREE.CylinderGeometry(bowlRadiusInner + 8.5, bowlRadiusInner + 0.5, bowlHeight * 0.5, 32, 1, true);
    const lowerWarningMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b, // Amber for lower bowl exposure
      transparent: true,
      opacity: 0.0,
      wireframe: true,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const lowerWarningMesh = new THREE.Mesh(lowerWarningGeo, lowerWarningMat);
    lowerWarningMesh.position.y = (bowlHeight * 0.5) / 2;
    if (!isFanMode) scene.add(lowerWarningMesh);

    // Floating Caution Sprite overlays
    const pitchLabelTexture = createWarningLabelTexture("FIELD SATURATION RISK", "RAIN WATER SATURATION: CRITICAL", "#f59e0b");
    const pitchLabelMat = new THREE.SpriteMaterial({
      map: pitchLabelTexture,
      transparent: true,
      depthTest: false,
      opacity: 0.0
    });
    const pitchWarningSprite = new THREE.Sprite(pitchLabelMat);
    pitchWarningSprite.position.set(0, 10, 0);
    pitchWarningSprite.scale.set(32, 8, 1);
    if (!isFanMode) scene.add(pitchWarningSprite);

    const roofLabelTexture = createWarningLabelTexture("WIND SHEAR WARNING", "ROOF COMPACTION: UPLIFT SHEAR", "#ef4444");
    const roofLabelMat = new THREE.SpriteMaterial({
      map: roofLabelTexture,
      transparent: true,
      depthTest: false,
      opacity: 0.0
    });
    const roofWarningSprite = new THREE.Sprite(roofLabelMat);
    roofWarningSprite.position.set(0, bowlHeight * 2 + 10, 0);
    roofWarningSprite.scale.set(32, 8, 1);
    if (!isFanMode) scene.add(roofWarningSprite);

    const upperLabelTexture = createWarningLabelTexture("UPPER DECK DRAG ALERT", "AERODYNAMIC DRAG LOADS", "#f97316");
    const upperLabelMat = new THREE.SpriteMaterial({
      map: upperLabelTexture,
      transparent: true,
      depthTest: false,
      opacity: 0.0
    });
    const upperWarningSprite = new THREE.Sprite(upperLabelMat);
    upperWarningSprite.position.set(0, bowlHeight + 15, bowlRadiusOuter - 15);
    upperWarningSprite.scale.set(32, 8, 1);
    if (!isFanMode) scene.add(upperWarningSprite);

    // 10. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Atmospheric Weather Transitions & Lerping
      const currentWeather = weatherStateRef.current;
      let targetRainOpacity = 0.0;
      let targetSnowOpacity = 0.0;
      let targetSunOpacity = 0.0;
      let targetFogDensity = 0.005;
      let targetFogColor = "#080a0c";
      
      let targetAmbientIntensity = 0.8;
      let targetDir1Intensity = 1.5;
      let targetDir2Intensity = 0.5;

      const skyTopTarget = new THREE.Color("#020617");
      const skyBottomTarget = new THREE.Color("#0f172a");
      let weatherFloatVal = 0.0;

      if (currentWeather === "RAIN") {
        targetRainOpacity = 0.85;
        targetFogDensity = 0.012;
        targetFogColor = "#0f172a";
        targetAmbientIntensity = 0.45;
        targetDir1Intensity = 0.8;
        targetDir2Intensity = 0.3;

        skyTopTarget.set("#1e293b"); // Stormy dark grey top
        skyBottomTarget.set("#475569"); // Stormy mid grey horizon
        weatherFloatVal = 1.0;
      } else if (currentWeather === "SNOW") {
        targetSnowOpacity = 0.9;
        targetFogDensity = 0.009;
        targetFogColor = "#111827";
        targetAmbientIntensity = 0.6;
        targetDir1Intensity = 1.0;
        targetDir2Intensity = 0.4;

        skyTopTarget.set("#030712"); // Cold dark sky
        skyBottomTarget.set("#1f2937"); // Cold pale grey horizon
        weatherFloatVal = 3.0;
      } else if (currentWeather === "FOG") {
        targetFogDensity = 0.026;
        targetFogColor = "#0d131a";
        targetAmbientIntensity = 0.35;
        targetDir1Intensity = 0.4;
        targetDir2Intensity = 0.2;

        skyTopTarget.set("#0a0f1d"); // Foggy dense blue-black top
        skyBottomTarget.set("#2e3d52"); // Thick grey-blue fog horizon
        weatherFloatVal = 2.0;
      } else if (currentWeather === "SUNSHINE") {
        targetSunOpacity = 0.65;
        targetFogDensity = 0.0015;
        targetFogColor = "#080a0c";
        targetAmbientIntensity = 0.95;
        targetDir1Intensity = 1.8;
        targetDir2Intensity = 0.6;

        skyTopTarget.set("#0284c7"); // Vibrant blue sky
        skyBottomTarget.set("#bae6fd"); // Golden-blue sunset/sunrise horizon
        weatherFloatVal = 0.0;
      }

      // Random high-fidelity lightning flash in stormy rain
      if (currentWeather === "RAIN" && Math.random() < 0.004) {
        const flash = 2.5 + Math.random() * 2.0;
        targetAmbientIntensity = flash;
        targetDir1Intensity = flash * 1.5;
        skyTopTarget.set("#ffffff");
        skyBottomTarget.set("#cbd5e1");
      }

      // Check if current active match is during nighttime
      const currentMatchTime = activeMatchRef.current?.dateTime || "";
      const isNightMatch = currentMatchTime.includes("18:00") || currentMatchTime.includes("19:00") || currentMatchTime.includes("20:00") || currentMatchTime.includes("21:00") || currentMatchTime.includes("22:00") || currentMatchTime.includes("23:00") || currentMatchTime.includes("00:00");

      // If there is a match during nighttime, we ensure that floodlights and field lights are always on so every area can be seen
      const isLightsOn = floodlightsOnRef.current || isNightMatch;
      if (!isLightsOn) {
        targetAmbientIntensity = 0.08;
        targetDir1Intensity = 0.02;
        targetDir2Intensity = 0.02;
        targetFogColor = "#020306";
        skyTopTarget.set("#010204");
        skyBottomTarget.set("#05070a");
      } else {
        // If lights are ON during a night match, let's boost them so it looks stunning and incredibly clear
        if (isNightMatch) {
          targetAmbientIntensity = 1.1;
          targetDir1Intensity = 2.0;
          targetDir2Intensity = 0.8;
          targetFogColor = "#090d1e";
          skyTopTarget.set("#020512");
          skyBottomTarget.set("#0d122b");
        }
      }

      // Smoothly update night match corner spotlights
      const targetNightFieldIntensity = isNightMatch ? 12.0 : 0.0;
      nightFieldLights.forEach((nLight) => {
        nLight.intensity = THREE.MathUtils.lerp(nLight.intensity, targetNightFieldIntensity, 0.05);
      });

      // Real-time Ball Tracker 3D Objects Animation
      const passInfo = currentPass3DRef.current;
      if (passInfo && passInfo.id) {
        // Increment pass progress smoothly (duration is around 1.3 seconds)
        if (passInfo.progress < 1.0) {
          passInfo.progress += 0.025;
          if (passInfo.progress > 1.0) {
            passInfo.progress = 1.0;
          }
        }

        const p = passInfo.progress;
        const ox = passInfo.ox;
        const oz = passInfo.oz;
        const dx = passInfo.dx;
        const dz = passInfo.dz;

        // Calculate actual final destination point (intercepted ball stops at 65% of path)
        let finalDx = dx;
        let finalDz = dz;
        if (!passInfo.success) {
          finalDx = ox + (dx - ox) * 0.65;
          finalDz = oz + (dz - oz) * 0.65;
        }

        // Quadratic Bezier arc calculations
        let maxArcHeight = 1.0;
        if (passInfo.type.includes("Long") || passInfo.type.includes("Cross")) {
          maxArcHeight = 8.0;
        } else if (passInfo.type.includes("Through") || passInfo.type.includes("Short")) {
          maxArcHeight = 1.8;
        } else {
          maxArcHeight = 0.4;
        }

        const cx = (ox + finalDx) / 2;
        const cz = (oz + finalDz) / 2;
        
        // Quadratic Bezier interpolation formula
        const bx = (1 - p) * (1 - p) * ox + 2 * (1 - p) * p * cx + p * p * finalDx;
        const bz = (1 - p) * (1 - p) * oz + 2 * (1 - p) * p * cz + p * p * finalDz;
        // parabolic height rises and falls
        const by = 0.5 + 4 * p * (1 - p) * maxArcHeight;

        // Position Ball
        ballMesh.position.set(bx, by, bz);
        ballShadowRing.position.set(bx, 0.12, bz);

        // Position indicators
        originRing.position.set(ox, 0.15, oz);
        destRing.position.set(finalDx, 0.15, finalDz);

        // Animate indicators (pulsating scale and fading opacity)
        const scalePulse = 1.0 + Math.sin(time * 6) * 0.15;
        originRing.scale.set(scalePulse, scalePulse, 1.0);
        destRing.scale.set(scalePulse, scalePulse, 1.0);

        originRingMat.opacity = Math.max(0.0, 0.8 * (1.0 - p));
        destRingMat.opacity = 0.8;
        ballShadowRingMat.opacity = Math.max(0.1, 0.6 * (1.2 - by / maxArcHeight));

        // Draw trajectory line
        const posAttr = trajectoryLine.geometry.attributes.position;
        const posArray = posAttr.array as Float32Array;
        for (let j = 0; j < trajectoryPointsCount; j++) {
          const t = j / (trajectoryPointsCount - 1);
          // Interpolate point
          const px = (1 - t) * (1 - t) * ox + 2 * (1 - t) * t * cx + t * t * finalDx;
          const pz = (1 - t) * (1 - t) * oz + 2 * (1 - t) * t * cz + t * t * finalDz;
          const py = 0.3 + 4 * t * (1 - t) * maxArcHeight;

          posArray[j * 3] = px;
          posArray[j * 3 + 1] = py;
          posArray[j * 3 + 2] = pz;
        }
        posAttr.needsUpdate = true;
        trajectoryMat.opacity = 0.7;
      }

      // Smoothly interpolate sky dome shader values
      skyUniforms.uTime.value = time;
      skyUniforms.uWeather.value = THREE.MathUtils.lerp(skyUniforms.uWeather.value, weatherFloatVal, 0.05);
      skyUniforms.uColorTop.value.lerp(skyTopTarget, 0.05);
      skyUniforms.uColorBottom.value.lerp(skyBottomTarget, 0.05);

      // Smoothly update searchlights rotation & opacity
      spotlights.forEach((light, sIdx) => {
        const offset = sIdx * Math.PI / 2;
        // Searchlight sweeping patterns
        light.rotation.z = Math.sin(time * 0.4 + offset) * 0.12;
        light.rotation.x = Math.cos(time * 0.4 + offset) * 0.12;
        
        let targetSpotlightOpacity = 0.06;
        if (currentWeather === "FOG") {
          targetSpotlightOpacity = 0.48; // Highly visible in fog
        } else if (currentWeather === "RAIN") {
          targetSpotlightOpacity = 0.32; // Visible in heavy rain
        } else if (currentWeather === "SNOW") {
          targetSpotlightOpacity = 0.26; // Noticeable in snow
        }
        
        if (light.material instanceof THREE.MeshBasicMaterial) {
          light.material.opacity = THREE.MathUtils.lerp(light.material.opacity, targetSpotlightOpacity, 0.05);
        }
      });

      // Smoothly interpolate opacity and environments
      rainMat.opacity = THREE.MathUtils.lerp(rainMat.opacity, targetRainOpacity, 0.05);
      snowMat.opacity = THREE.MathUtils.lerp(snowMat.opacity, targetSnowOpacity, 0.05);
      sunMat.opacity = THREE.MathUtils.lerp(sunMat.opacity, targetSunOpacity, 0.05);

      if (scene.fog && scene.fog instanceof THREE.FogExp2) {
        scene.fog.density = THREE.MathUtils.lerp(scene.fog.density, targetFogDensity, 0.05);
        scene.fog.color.lerp(new THREE.Color(targetFogColor), 0.05);
        scene.background = scene.fog.color;
      }

      ambientLight.intensity = THREE.MathUtils.lerp(ambientLight.intensity, targetAmbientIntensity, 0.05);
      dirLight1.intensity = THREE.MathUtils.lerp(dirLight1.intensity, targetDir1Intensity, 0.05);
      dirLight2.intensity = THREE.MathUtils.lerp(dirLight2.intensity, targetDir2Intensity, 0.05);

      // Symmetrical quad lights and hemisphere light smooth transition
      const targetQuadIntensity = isLightsOn ? 1.8 : 0.02;
      quadLights.forEach((qLight) => {
        qLight.intensity = THREE.MathUtils.lerp(qLight.intensity, targetQuadIntensity, 0.05);
      });
      const targetGroundIntensity = isLightsOn ? 1.0 : 0.08;
      groundLight.intensity = THREE.MathUtils.lerp(groundLight.intensity, targetGroundIntensity, 0.05);

      // Smoothly update floodlight intensities and physical filament emissive values
      const targetFloodIntensity = isLightsOn ? 6.0 : 0.0;
      const targetEmissiveIntensity = isLightsOn ? 4.0 : 0.02;
      const targetFixtureColor = isLightsOn ? new THREE.Color("#ffffff") : new THREE.Color("#1e293b");

      floodlights.forEach((sLight) => {
        sLight.intensity = THREE.MathUtils.lerp(sLight.intensity, targetFloodIntensity, 0.05);
      });

      floodlightFixtures.forEach((fixture) => {
        if (fixture.material instanceof THREE.MeshStandardMaterial) {
          fixture.material.emissiveIntensity = THREE.MathUtils.lerp(fixture.material.emissiveIntensity, targetEmissiveIntensity, 0.05);
          fixture.material.color.lerp(targetFixtureColor, 0.05);
          fixture.material.emissive.lerp(isLightsOn ? new THREE.Color("#ffffff") : new THREE.Color("#000000"), 0.05);
        }
      });

      if (sunCrown) {
        sunCrown.rotation.z = time * 0.08;
        const sunScale = 1.0 + Math.sin(time * 2) * 0.04;
        sunCrown.scale.set(sunScale, sunScale, sunScale);
      }

      // Animate Rain
      if (rainMat.opacity > 0.01) {
        const positions = rainGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < weatherParticleCount; i++) {
          positions[i * 3 + 1] -= rainVelocities[i];
          positions[i * 3] += Math.sin(time * 0.15 + i) * 0.04;
          if (positions[i * 3 + 1] < 0.1) {
            positions[i * 3 + 1] = Math.random() * 80 + 10;
            positions[i * 3] = (Math.random() - 0.5) * 220;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 220;
          }
        }
        rainGeo.attributes.position.needsUpdate = true;
      }

      // Animate Snow
      if (snowMat.opacity > 0.01) {
        const positions = snowGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < weatherParticleCount; i++) {
          positions[i * 3 + 1] -= 0.18 + Math.sin(time + snowOffsets[i]) * 0.03;
          positions[i * 3] += Math.sin(time * 0.4 + snowOffsets[i]) * 0.08;
          positions[i * 3 + 2] += Math.cos(time * 0.4 + snowOffsets[i]) * 0.08;
          if (positions[i * 3 + 1] < 0.1) {
            positions[i * 3 + 1] = Math.random() * 80 + 10;
            positions[i * 3] = (Math.random() - 0.5) * 220;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 220;
          }
        }
        snowGeo.attributes.position.needsUpdate = true;
      }

      // Laser scanner sweeping back and forth
      scannerLaser.position.z = Math.sin(time * 0.8) * 80;
      // Change color based on dashboard glow state
      if (scannerLaser.material instanceof THREE.LineBasicMaterial) {
        scannerLaser.material.color.set(glowColor);
      }

      // Animate weather warning overlays based on current state and toggle
      const isWarnEnabled = isStructuralWarningEnabledRef.current;
      
      let targetPitchWarnOpacity = 0.0;
      let targetRoofWarnOpacity = 0.0;
      let targetUpperWarnOpacity = 0.0;
      let targetLowerWarnOpacity = 0.0;

      if (isWarnEnabled) {
        if (currentWeather === "RAIN") {
          // Pitch gets high saturation warning
          targetPitchWarnOpacity = 0.65 + Math.sin(time * 6) * 0.15; // pulsating warning
          targetLowerWarnOpacity = 0.45 + Math.sin(time * 4) * 0.10;
          // Rain also has winds that affect the upper bowl and roof
          targetRoofWarnOpacity = 0.35;
          targetUpperWarnOpacity = 0.25;
        } else if (currentWeather === "SNOW") {
          // Roof snow loads, pitch freeze saturation
          targetRoofWarnOpacity = 0.70 + Math.sin(time * 5) * 0.15;
          targetPitchWarnOpacity = 0.45 + Math.sin(time * 3) * 0.10;
          targetUpperWarnOpacity = 0.35;
        } else if (currentWeather === "FOG") {
          // Lower visibility warnings on upper bowl & roof
          targetRoofWarnOpacity = 0.20;
          targetUpperWarnOpacity = 0.25 + Math.sin(time * 3) * 0.08;
        } else if (weatherData?.windspeed && weatherData.windspeed > 15) {
          // High winds without rain
          targetRoofWarnOpacity = 0.60 + Math.sin(time * 6) * 0.15;
          targetUpperWarnOpacity = 0.50 + Math.sin(time * 4) * 0.10;
        }
      }

      // Smoothly lerp opacities of warning meshes
      pitchWarningMat.opacity = THREE.MathUtils.lerp(pitchWarningMat.opacity, targetPitchWarnOpacity, 0.08);
      roofWarningMat.opacity = THREE.MathUtils.lerp(roofWarningMat.opacity, targetRoofWarnOpacity, 0.08);
      upperWarningMat.opacity = THREE.MathUtils.lerp(upperWarningMat.opacity, targetUpperWarnOpacity, 0.08);
      lowerWarningMat.opacity = THREE.MathUtils.lerp(lowerWarningMat.opacity, targetLowerWarnOpacity, 0.08);

      // Smoothly update warning labels/sprites opacities
      pitchLabelMat.opacity = THREE.MathUtils.lerp(pitchLabelMat.opacity, targetPitchWarnOpacity > 0.1 ? 0.95 : 0.0, 0.08);
      roofLabelMat.opacity = THREE.MathUtils.lerp(roofLabelMat.opacity, targetRoofWarnOpacity > 0.1 ? 0.95 : 0.0, 0.08);
      upperLabelMat.opacity = THREE.MathUtils.lerp(upperLabelMat.opacity, targetUpperWarnOpacity > 0.1 ? 0.95 : 0.0, 0.08);

      // Floating pulsation for sprites
      if (pitchWarningSprite && pitchLabelMat.opacity > 0.01) {
        pitchWarningSprite.position.y = 10 + Math.sin(time * 3) * 0.5;
      }
      if (roofWarningSprite && roofLabelMat.opacity > 0.01) {
        roofWarningSprite.position.y = bowlHeight * 2 + 10 + Math.sin(time * 3.5) * 0.5;
      }
      if (upperWarningSprite && upperLabelMat.opacity > 0.01) {
        upperWarningSprite.position.y = bowlHeight + 15 + Math.sin(time * 2.8) * 0.5;
        // Float in a circle around the upper bowl
        const orbitAngle = time * 0.1;
        upperWarningSprite.position.x = Math.cos(orbitAngle) * (bowlRadiusOuter - 15);
        upperWarningSprite.position.z = Math.sin(orbitAngle) * (bowlRadiusOuter - 15);
      }

      // Rotate stadium slightly
      stadiumGroup.rotation.y = time * 0.015;
      crowdParticles.rotation.y = time * 0.015;

      // Scale glowing rings at active node
      Object.entries(glowRingMeshes).forEach(([name, ring]) => {
        const scale = 1 + Math.sin(time * 3 + (name === activeAnchor ? 2 : 0)) * 0.3;
        ring.scale.set(scale, 1, scale);
        
        if (name === activeAnchor) {
          if (ring.material instanceof THREE.LineBasicMaterial) {
            ring.material.opacity = 0.9;
            ring.material.linewidth = 3;
          }
        } else {
          if (ring.material instanceof THREE.LineBasicMaterial) {
            ring.material.opacity = 0.4;
            ring.material.linewidth = 1;
          }
        }
      });

      // Orbit active anchor mesh
      Object.entries(nodeMeshes).forEach(([name, mesh]) => {
        if (name === activeAnchor) {
          mesh.rotation.y += 0.04;
          mesh.scale.setScalar(1.2 + Math.sin(time * 5) * 0.15);
        } else {
          mesh.rotation.y += 0.01;
          mesh.scale.setScalar(1.0);
        }
      });

      // Smoothly interpolate camera position and look at targets with cubic easing
      if (!userTakingManualControlRef.current) {
        if (transitionProgress.current < 1.0) {
          const now = performance.now();
          const elapsed = now - transitStartTime.current;
          let t = elapsed / transitionDuration;
          if (t > 1.0) t = 1.0;

          // easeInOutCubic curve
          const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

          currentCam.current.lerpVectors(transitStartCam.current, transitEndCam.current, ease);
          currentLook.current.lerpVectors(transitStartLook.current, transitEndLook.current, ease);
          transitionProgress.current = t;
        } else {
          // Standard incremental adjustment as fallback
          currentCam.current.copy(targetCam.current);
          currentLook.current.copy(targetLook.current);
        }

        camera.position.copy(currentCam.current);
        if (controlsRef.current) {
          controlsRef.current.target.copy(currentLook.current);
          controlsRef.current.update();
        }
      } else {
        // When taking manual controls, capture the updated position in refs so it transitions smoothly later
        currentCam.current.copy(camera.position);
        if (controlsRef.current) {
          currentLook.current.copy(controlsRef.current.target);
          controlsRef.current.update();
        }
      }

      // Floating billboard animation and ground pulsing ring
      if (incidentGroupRef.current) {
        incidentGroupRef.current.traverse((child) => {
          if (child.name === "groundPulseRing") {
            const pulseScale = 1 + ((time * 2.5) % 1.0) * 0.8;
            child.scale.set(pulseScale, 1, pulseScale);
            if (child instanceof THREE.Line && child.material instanceof THREE.LineBasicMaterial) {
              child.material.opacity = 1 - ((time * 2.5) % 1.0);
            }
          } else if (child.name === "incidentSprite" && child instanceof THREE.Sprite) {
            const baseHeight = child.userData.baseHeight || 12;
            child.position.y = baseHeight + Math.sin(time * 4 + (child.userData.offset || 0)) * 0.8;
          }
        });
      }

      // Floating, pulsating, and spinning visitor heatmap nodes
      if (heatmapGroupRef.current) {
        heatmapGroupRef.current.traverse((child) => {
          if (child.name === "heatmapNode" && child instanceof THREE.Mesh) {
            const offset = child.userData.angleOffset || 0;
            const density = child.userData.density || 0.5;
            // Hotter areas pulse/gasp faster
            const pulseSpeed = density > 0.8 ? 6.0 : 3.0;
            const pulse = Math.sin(time * pulseSpeed + offset) * 0.12;
            if (child.material && child.material instanceof THREE.MeshBasicMaterial) {
              child.material.opacity = (child.userData.baseOpacity || 0.32) + pulse;
            }
            // Dynamic scaling pulse
            const scalePulse = 1.0 + Math.sin(time * pulseSpeed + offset) * 0.08;
            const baseScale = child.userData.scale || 1.0;
            child.scale.set(baseScale * scalePulse, baseScale * scalePulse, baseScale * scalePulse);
          } else if (child.name === "heatmapCore" && child instanceof THREE.Mesh) {
            child.rotation.x += 0.015;
            child.rotation.y += 0.02;
          }
        });
      }

      // Real-time updating Stadium Floor Heatmap Overlay for Spectator Wayfinding
      if (floorHeatmapGroupRef.current) {
        floorHeatmapGroupRef.current.traverse((child) => {
          if (child.name === "floorHotspotCircle" && child instanceof THREE.Mesh) {
            const baseCongestion = child.userData.baseCongestion || 0.5;
            const offset = child.userData.offset || 0;
            const dynamicCongestion = Math.max(0.05, Math.min(1.0, baseCongestion + Math.sin(time * 1.5 + offset) * 0.12));
            
            const color = new THREE.Color(0x10b981);
            if (dynamicCongestion >= 0.75) {
              color.setHex(0xef4444);
            } else if (dynamicCongestion >= 0.45) {
              color.setHex(0xf97316);
            }
            
            if (child.material && child.material instanceof THREE.MeshBasicMaterial) {
              child.material.color.copy(color);
              child.material.opacity = 0.28 + Math.sin(time * 3.0 + offset) * 0.08;
            }
            
            const scaleFactor = 1.0 + Math.sin(time * 2.0 + offset) * 0.06;
            child.scale.set(scaleFactor, scaleFactor, scaleFactor);
            child.userData.currentCongestion = dynamicCongestion;

          } else if (child.name === "floorHotspotOuterRing" && child instanceof THREE.Line) {
            child.rotation.z = time * 0.5;
            const parentGroup = floorHeatmapGroupRef.current;
            if (parentGroup) {
              const correspondingCircle = parentGroup.children.find(
                (c) => c.name === "floorHotspotCircle" && Math.abs(c.position.x - child.position.x) < 1.0 && Math.abs(c.position.z - child.position.z) < 1.0
              );
              if (correspondingCircle && correspondingCircle instanceof THREE.Mesh && correspondingCircle.material instanceof THREE.MeshBasicMaterial) {
                if (child.material && child.material instanceof THREE.LineBasicMaterial) {
                  child.material.color.copy(correspondingCircle.material.color);
                  child.material.opacity = 0.5 + Math.sin(time * 4.0) * 0.2;
                }
              }
            }
          } else if (child.name === "floorPathwayRibbon" && child instanceof THREE.Mesh) {
            const parentGroup = floorHeatmapGroupRef.current;
            if (parentGroup) {
              const c1 = parentGroup.children.find(
                (c) => c.name === "floorHotspotCircle" && c.userData.id === child.userData.from
              );
              const c2 = parentGroup.children.find(
                (c) => c.name === "floorHotspotCircle" && c.userData.id === child.userData.to
              );
              if (c1 && c2 && c1 instanceof THREE.Mesh && c2 instanceof THREE.Mesh) {
                const cong1 = c1.userData.currentCongestion || c1.userData.baseCongestion || 0.5;
                const cong2 = c2.userData.currentCongestion || c2.userData.baseCongestion || 0.5;
                const avgCongestion = (cong1 + cong2) / 2;

                const color = new THREE.Color(0x10b981);
                if (avgCongestion >= 0.70) {
                  color.setHex(0xef4444);
                } else if (avgCongestion >= 0.40) {
                  color.setHex(0xf97316);
                }

                if (child.material && child.material instanceof THREE.MeshBasicMaterial) {
                  child.material.color.copy(color);
                  child.material.opacity = 0.18 + Math.sin(time * 1.5 + (child.userData.offset || 0)) * 0.04;
                }
              }
            }
          } else if (child.name === "floorFlowDot" && child instanceof THREE.Mesh) {
            let progress = child.userData.progress || 0;
            progress += child.userData.speed || 0.01;
            if (progress > 1.0) {
              progress = 0.0;
            }
            child.userData.progress = progress;

            const p1 = child.userData.p1 as THREE.Vector3;
            const p2 = child.userData.p2 as THREE.Vector3;
            if (p1 && p2) {
              child.position.lerpVectors(p1, p2, progress);
              child.position.y = 0.35 + Math.sin(time * 5.0 + progress * 10) * 0.1;
              
              const parentGroup = floorHeatmapGroupRef.current;
              if (parentGroup) {
                const ribbon = parentGroup.children.find(
                  (c) => c.name === "floorPathwayRibbon" && c.userData.p1 === p1 && c.userData.p2 === p2
                );
                if (ribbon && ribbon instanceof THREE.Mesh && ribbon.material instanceof THREE.MeshBasicMaterial) {
                  if (child.material && child.material instanceof THREE.MeshBasicMaterial) {
                    child.material.color.copy(ribbon.material.color);
                  }
                }
              }
            }
          }
        });
      }

      if (!userTakingManualControlRef.current) {
        camera.lookAt(currentLook.current);
      }

      // Animate center field FIFA hologram points
      if (centerRing && centerDot) {
        centerRing.rotation.z = time * 1.2;
        centerDot.position.y = 0.5 + Math.sin(time * 3) * 0.12;
      }

      // --- ANIMATE SEATED FANS (LA OLA STADIUM WAVE & CHEERING) ---
      if (isFanMode && seatedFansPoints && seatedFansData.length > 0) {
        const isMatchLive = activeMatchRef.current?.status === "LIVE";
        
        // Dynamically toggle visibility - empty stadium with no fans if no current match
        seatedFansPoints.visible = isMatchLive;

        const mat = seatedFansPoints.material as THREE.PointsMaterial;
        if (isMatchLive) {
          // Dynamic pulsing glow effect for fans during a live match
          if (mat) {
            mat.size = 2.0 + Math.sin(time * 3.5) * 0.45; // Pulse the size dynamically to simulate organic crowd excitement/glow
            mat.opacity = 0.85 + Math.sin(time * 3.5) * 0.15; // Pulse the opacity
            mat.blending = THREE.AdditiveBlending; // Use additive blending for a brilliant glowing crowd look
            mat.needsUpdate = true;
          }

          const positionsAttr = seatedFansPoints.geometry.attributes.position;
          const positions = positionsAttr.array as Float32Array;
          
          for (let i = 0; i < seatedFansData.length; i++) {
            const fan = seatedFansData[i];
            
            // La Ola (stadium wave) traveling clockwise around the arena:
            const waveTime = time * 2.5;
            const waveAngle = waveTime % (Math.PI * 2);
            const angleDiff = Math.abs(fan.angle - waveAngle);
            const diff = Math.min(angleDiff, Math.PI * 2 - angleDiff);
            
            let waveIntensity = 0.0;
            if (diff < 0.45) {
              waveIntensity = Math.cos((diff / 0.45) * Math.PI * 0.5);
            }
            
            // Micro-cheering vertical jump
            const cheerJitter = Math.max(0, Math.sin(time * fan.cheerSpeed + fan.cheerOffset)) * 0.28;
            
            // Wave raises fan and pushes them to stand, cheerJitter adds random stadium energy
            const yOffset = waveIntensity * 1.8 + cheerJitter;
            
            // Slightly project fan outwards when standing up (natural body lean)
            positions[i * 3] = fan.basePos.x + Math.cos(fan.angle) * (yOffset * 0.12);
            positions[i * 3 + 1] = fan.basePos.y + yOffset;
            positions[i * 3 + 2] = fan.basePos.z + Math.sin(fan.angle) * (yOffset * 0.12);
          }
          positionsAttr.needsUpdate = true;
        } else {
          // Empty stadium configuration when there is no active match
          if (mat) {
            mat.size = 1.4;
            mat.opacity = 0.0;
            mat.blending = THREE.NormalBlending;
            mat.needsUpdate = true;
          }
        }
      }

      // --- PHYSICS & ANIMATION FOR CELEBRATION PIÑATA CONFETTI BURSTS ---
      if (pinataBurstPoints && pinataBursts.length > 0) {
        // Automatically trigger an inactive burst periodically
        const lastTrigger = lastPinataBurstTimeRef.current;
        const isMatchLive = activeMatchRef.current?.status === "LIVE";
        if (isMatchLive && time - lastTrigger > 1.4) {
          const inactiveBurst = pinataBursts.find((b) => !b.active);
          if (inactiveBurst) {
            let cx = 0;
            let cy = 0.5;
            let cz = 0;
            
            // 85% of bursts occur directly in the seating tiers between active fans, 15% on the pitch
            if (isFanMode && seatedFansData.length > 0 && Math.random() < 0.85) {
              const sourceFan = seatedFansData[Math.floor(Math.random() * seatedFansData.length)];
              cx = sourceFan.basePos.x;
              cy = sourceFan.basePos.y + 0.5;
              cz = sourceFan.basePos.z;
            } else {
              // Burst on random locations of the FIFA pitch
              const angle = Math.random() * Math.PI * 2;
              const r = Math.random() * 38;
              cx = Math.cos(angle) * r;
              cy = 0.5;
              cz = Math.sin(angle) * r;
            }
            
            inactiveBurst.centerX = cx;
            inactiveBurst.centerY = cy;
            inactiveBurst.centerZ = cz;
            inactiveBurst.birthTime = time;
            inactiveBurst.active = true;
            
            // Ultra-vibrant festive pinata confetti color palettes
            const pinataConfettiColors = [
              new THREE.Color("#ec4899"), // Hot Pink / Magenta
              new THREE.Color("#06b6d4"), // Cyan Glow
              new THREE.Color("#10b981"), // Emerald / Lime
              new THREE.Color("#f97316"), // Neon Orange
              new THREE.Color("#eab308"), // Gold / Yellow
              new THREE.Color("#8b5cf6"), // Royal Violet
            ];
            
            for (let p = 0; p < particlesPerBurst; p++) {
              const velocity = inactiveBurst.velocities[p];
              const color = inactiveBurst.colors[p];
              
              // Spherical explosion vector oriented upwards
              const phi = Math.random() * Math.PI * 0.45; // upwards focus
              const theta = Math.random() * Math.PI * 2;
              const speed = 7.0 + Math.random() * 11.0;
              
              velocity.x = Math.sin(phi) * Math.cos(theta) * speed;
              velocity.y = Math.cos(phi) * speed + 5.5; // Upwards explosive force
              velocity.z = Math.sin(phi) * Math.sin(theta) * speed;
              
              color.copy(pinataConfettiColors[Math.floor(Math.random() * pinataConfettiColors.length)]);
            }
            
            // Synthesize the poppy celebration audio pop
            lastPinataBurstTimeRef.current = time;
          }
        }
        
        const burstPositionsAttr = pinataBurstPoints.geometry.attributes.position;
        const burstColorsAttr = pinataBurstPoints.geometry.attributes.color;
        
        const bPositions = burstPositionsAttr.array as Float32Array;
        const bColors = burstColorsAttr.array as Float32Array;
        
        for (let b = 0; b < numBursts; b++) {
          const burst = pinataBursts[b];
          if (!burst.active) continue;
          
          const age = time - burst.birthTime;
          if (age > burst.duration) {
            burst.active = false;
            // Clear position (re-hide deep below ground)
            for (let p = 0; p < particlesPerBurst; p++) {
              const idx = (b * particlesPerBurst + p) * 3;
              bPositions[idx] = 0;
              bPositions[idx + 1] = -9999;
              bPositions[idx + 2] = 0;
            }
            continue;
          }
          
          const t = age;
          // Apply gravity pulling down the lightweight paper confetti
          const gravity = -11.0;
          
          for (let p = 0; p < particlesPerBurst; p++) {
            const idx = (b * particlesPerBurst + p) * 3;
            const vel = burst.velocities[p];
            const col = burst.colors[p];
            
            const px = burst.centerX + vel.x * t;
            const py = burst.centerY + vel.y * t + 0.5 * gravity * t * t;
            const pz = burst.centerZ + vel.z * t;
            
            bPositions[idx] = px;
            bPositions[idx + 1] = Math.max(0.1, py); // ground barrier
            bPositions[idx + 2] = pz;
            
            bColors[idx] = col.r;
            bColors[idx + 1] = col.g;
            bColors[idx + 2] = col.b;
          }
        }
        
        burstPositionsAttr.needsUpdate = true;
        burstColorsAttr.needsUpdate = true;
      }

      renderer.render(scene, camera);

      // Project center-field coordinate to update the floating match preview screen position
      if (matchOverlayRef.current && camera && renderer) {
        // Calculate stable camera distance to center pitch of field (on ground level)
        const distanceToPitchCenter = camera.position.distanceTo(new THREE.Vector3(0, 0.1, 0));
        
        // Dynamically descend target height as the camera zooms in close
        const targetHeightY = distanceToPitchCenter < 30 
          ? Math.max(0.2, 0.2 + 5.3 * (distanceToPitchCenter / 30)) 
          : 5.5;

        const targetWorldPos = new THREE.Vector3(0, targetHeightY, 0);
        
        // Project to screen
        targetWorldPos.project(camera);

        const containerWidth = mountRef.current?.clientWidth || 1;
        const containerHeight = mountRef.current?.clientHeight || 1;

        let screenX = (targetWorldPos.x * 0.5 + 0.5) * containerWidth;
        let screenY = (targetWorldPos.y * -0.5 + 0.5) * containerHeight;

        // Relax behind-plane check if zoomed in close to avoid hiding the overlay
        const isBehindPlane = targetWorldPos.z > 1;
        const distanceToCam = camera.position.distanceTo(new THREE.Vector3(0, targetHeightY, 0));
        const maxDistance = 110; // Only appear when moderately close

        const isZoomedInClose = distanceToPitchCenter < 30;
        const targetVisibility = ((isBehindPlane && !isZoomedInClose) || distanceToCam > maxDistance) ? 0 : 1;

        // If zoomed in close and the 3D point is off-screen or behind the camera, lock the card stably at the lower-middle center of the screen
        if (isZoomedInClose && (isBehindPlane || screenX < 0 || screenX > containerWidth || screenY < 0 || screenY > containerHeight)) {
          screenX = containerWidth / 2;
          screenY = containerHeight * 0.7;
        }

        // Smoothly interpolate the transition factor
        overlayTransitionRef.current += (targetVisibility - overlayTransitionRef.current) * 0.08;

        const isVisible = overlayTransitionRef.current > 0.01;

        if (!isVisible) {
          if (matchOverlayRef.current) {
            matchOverlayRef.current.style.display = "none";
          }
        } else {
          if (matchOverlayRef.current) {
            matchOverlayRef.current.style.display = "block";
            matchOverlayRef.current.style.pointerEvents = targetVisibility === 1 ? "auto" : "none";

            // Perspective dynamic scale
            let baseScale = 0.74; // A little smaller default scale so the user can easily see the entire window
            if (distanceToCam > 85) {
              baseScale = Math.max(0.58, (85 / distanceToCam) * 0.74);
            } else if (distanceToCam < 45) {
              // Scale down gracefully as the camera gets close, but stop shrinking at a clear minimum of 0.60
              // so it remains perfectly legible and doesn't get too small.
              baseScale = Math.max(0.60, (distanceToCam / 45) * 0.74);
            } else {
              baseScale = 0.74;
            }

            const currentScale = baseScale * (0.8 + 0.2 * overlayTransitionRef.current);
            const isCollapsed = isScoreboardCollapsedRef.current;
            const isMoreDetailsExpanded = isMoreDetailsExpandedRef.current;
            
            // Adjust cardHeight calculation dynamically based on whether "More Details" is expanded
            // We set max-h-[300px] on the card body, so the total card height is at most ~340px when expanded.
            let baseCardHeight = 245;
            if (isCollapsed) {
              baseCardHeight = 55;
            } else if (isMoreDetailsExpanded) {
              baseCardHeight = 340;
            }

            const cardWidth = 270 * currentScale;
            const cardHeight = baseCardHeight * currentScale;

            let clampedScreenX = screenX;
            let clampedScreenY = screenY;

            if (containerWidth > 200 && containerHeight > 200) {
              const minX = Math.min(containerWidth / 2, cardWidth / 2 + 10);
              const maxX = Math.max(containerWidth / 2, containerWidth - cardWidth / 2 - 10);
              const minY = Math.min(containerHeight / 2, cardHeight + 10);
              const maxY = Math.max(containerHeight / 2, containerHeight - 10);

              clampedScreenX = Math.max(minX, Math.min(maxX, screenX));
              clampedScreenY = Math.max(minY, Math.min(maxY, screenY));
            }

            const translateYOffset = (1 - overlayTransitionRef.current) * 45;

            matchOverlayRef.current.style.transform = `translate3d(${clampedScreenX}px, ${clampedScreenY}px, 0)`;

            if (matchOverlayInnerRef.current) {
              matchOverlayInnerRef.current.style.opacity = `${overlayTransitionRef.current}`;
              matchOverlayInnerRef.current.style.transform = `translate(-50%, -100%) translateY(${translateYOffset}px) scale(${currentScale})`;
            }
          }
        }
      }
    };

    animate();

    // Expose updateViewportEngine to window for embedded telemetry script support
    (window as any).updateViewportEngine = (targetCoords: number[], uiHexColor: string) => {
      userTakingManualControlRef.current = false;
      
      // Elevate target marker nodes to clear the field plane
      if (incidentGroupRef.current) {
        incidentGroupRef.current.position.set(targetCoords[0], 1.2, targetCoords[2]);
        incidentGroupRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material) {
            const mat = child.material as any;
            if (mat.color) {
              mat.color.setHex(parseInt(uiHexColor.replace("#", "0x")));
            }
          } else if (child instanceof THREE.Line && child.material) {
            const mat = child.material as any;
            if (mat.color) {
              mat.color.setHex(parseInt(uiHexColor.replace("#", "0x")));
            }
          }
        });
      }
      
      // Recalculate camera paths to focus cleanly on lower bowl layers without cutting off sections
      targetCam.current.set(targetCoords[0], targetCoords[1] + 45, targetCoords[2] + 55);
      targetLook.current.set(targetCoords[0], targetCoords[1], targetCoords[2]);
    };

    // 11. Window Resize Handling
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const newWidth = mountRef.current.clientWidth;
      const newHeight = mountRef.current.clientHeight;

      // Strictly guard against zero or NaN dimensions to prevent rendering black screens or camera corruption
      if (newWidth <= 0 || newHeight <= 0) return;

      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();

      rendererRef.current.setSize(newWidth, newHeight, false);

      if (controlsRef.current) {
        controlsRef.current.target.copy(currentLook.current);
        controlsRef.current.update();
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(mountRef.current);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isFanMode, deferredReady]);

  // Update scanner laser colors immediately if glowColor changes dynamically
  useEffect(() => {
    // Already handled reactively in the animate loop via props
  }, [glowColor]);

  const venueStructuralProfileStr = JSON.stringify(venueStructuralProfile);

  // Update stadium structural style, textures, capacities and selections on-the-fly
  useEffect(() => {
    if (venueStructuralProfile?.active_stadium_id) {
      // Sync environmental monitors
      const matched = LOCATIONS.find(l => l.id === venueStructuralProfile.active_stadium_id);
      if (matched) {
        setSelectedLocation(matched);
      }
    }

    if (!skinMatRef.current || !stadiumGroupRef.current) return;

    // 1. Textures & material properties live update
    const wallColor = venueStructuralProfile?.programmatic_texture_directives?.wall_color_hex || "#94a3b8";
    const roughness = venueStructuralProfile?.programmatic_texture_directives?.material_roughness !== undefined
      ? venueStructuralProfile.programmatic_texture_directives.material_roughness
      : 0.15;
    const transparency = venueStructuralProfile?.programmatic_texture_directives?.material_transparency_alpha !== undefined
      ? venueStructuralProfile.programmatic_texture_directives.material_transparency_alpha
      : 0.40;

    skinMatRef.current.color.set(wallColor);
    skinMatRef.current.roughness = roughness;
    skinMatRef.current.opacity = transparency;
    skinMatRef.current.needsUpdate = true;

    // 2. Extrusion multiplier (scales stadium height morphing shapes)
    const multiplier = venueStructuralProfile?.programmatic_texture_directives?.stadium_geometry_extrusion_multiplier !== undefined
      ? venueStructuralProfile.programmatic_texture_directives.stadium_geometry_extrusion_multiplier
      : 1.0;
    stadiumGroupRef.current.scale.set(1.0, multiplier, 1.0);

  }, [venueStructuralProfileStr]);

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      {/* 3D Container viewport */}
      <div
        ref={mountRef}
        id="webgl-viewport"
        className="relative w-full h-full flex-1 min-h-0 border border-white/5 bg-black/60 shadow-inner rounded-b-lg overflow-hidden"
      />

      {/* High-fidelity digital twin skeleton loader overlay */}
      {(isLoading || !deferredReady) && (
        <div className="absolute inset-0 z-50 bg-[#06080c] flex flex-col items-center justify-center p-6 border border-white/5 shadow-inner rounded-b-lg overflow-hidden select-none">
          {/* Cyber scanner twin grid lines */}
          <div className="absolute inset-0 ops-grid-overlay opacity-35" />
          
          {/* Outer glowing pulsing circle representing the stadium footprint */}
          <div className="relative w-48 h-48 sm:w-60 sm:h-60 rounded-full border border-cyan-500/10 flex items-center justify-center animate-[pulse_3s_infinite] shadow-[0_0_50px_rgba(34,211,238,0.03)] mb-6">
            <div className="absolute inset-4 rounded-full border border-cyan-500/20 flex items-center justify-center animate-[pulse_2s_infinite]">
              <div className="absolute inset-8 rounded-full border border-cyan-500/30 flex items-center justify-center animate-[pulse_1.5s_infinite]">
                {/* 3D Wireframe globe or radar scanner indicator */}
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-cyan-950/20 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.15)] animate-spin" style={{ animationDuration: '6s' }}>
                  <RefreshCw className="w-5 h-5 text-cyan-400 animate-spin" style={{ animationDuration: '3s' }} />
                </div>
              </div>
            </div>
            
            {/* Horizontal scanning light bar sweeping across */}
            <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent top-1/2 -translate-y-1/2 animate-[bounce_2.5s_infinite]" />
          </div>

          {/* Shimmering loading message */}
          <div className="flex flex-col items-center text-center space-y-3.5 z-10">
            <span className="text-[9px] bg-cyan-950/80 text-cyan-400 border border-cyan-800/40 px-2.5 py-1 rounded font-bold uppercase tracking-widest font-mono animate-pulse">
              INITIALIZING DIGITAL TWIN CORES
            </span>
            <div className="space-y-1">
              <h3 className="text-slate-200 text-[11px] font-bold font-mono tracking-wider uppercase">
                CALIBRATING TELEMETRY SENSORS...
              </h3>
              <p className="text-[8.5px] text-slate-400 font-mono tracking-wide">
                LOADING 3D GEOMETRY • SYNCHRONIZING REAL-TIME WEATHER FEEDS
              </p>
            </div>
            
            {/* High-fidelity custom progress bar */}
            <div className="w-44 h-1.5 bg-slate-950 border border-[#1b2531] rounded-full overflow-hidden p-[1px]">
              <div className="h-full bg-cyan-500/80 rounded-full animate-pulse shimmer-bg w-3/4" />
            </div>
          </div>

          {/* Skeleton placeholders in the bottom margin */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-1.5">
              <div className="w-14 h-4 bg-slate-900 border border-slate-950 rounded animate-pulse" />
              <div className="w-20 h-4 bg-slate-900 border border-slate-950 rounded animate-pulse" />
            </div>
            <div className="w-20 h-4 bg-slate-900 border border-slate-950 rounded animate-pulse" />
          </div>
        </div>
      )}

      {/* FIFA 2026 Floating Tactical Screen (Tracks pitch center coordinates dynamically in 3D Space) */}
      <div
        ref={matchOverlayRef}
        className="absolute top-0 left-0 pointer-events-none z-20 select-none"
        style={{ display: "none" }}
      >
        <div ref={matchOverlayInnerRef} className="origin-bottom flex flex-col items-center">
          {/* Main Cyber Tactical Card */}
          <div className="w-[270px] bg-slate-950/95 border-2 border-cyan-500/80 rounded-lg shadow-[0_0_25px_rgba(34,211,238,0.35)] overflow-hidden font-mono text-[10px] pointer-events-auto">
            {/* Holographic scanning header bar */}
            <div className="bg-cyan-950/90 px-2.5 py-1.5 border-b border-cyan-800/60 flex items-center justify-between text-[9px] text-cyan-400 font-bold tracking-tight">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
                FIFA World Cup 2026™
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-[8.5px] bg-cyan-900/40 border border-cyan-500/50 px-1 rounded text-cyan-300">
                  {activeMatch.matchNumber}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsScoreboardCollapsed(!isScoreboardCollapsed);
                  }}
                  className="p-1 hover:bg-cyan-900/40 border border-cyan-800/60 rounded text-cyan-300 hover:text-cyan-100 transition cursor-pointer flex items-center justify-center"
                  title={isScoreboardCollapsed ? "Expand match info window" : "Collapse match info window"}
                  aria-label={isScoreboardCollapsed ? "Expand match info window" : "Collapse match info window"}
                >
                  {isScoreboardCollapsed ? (
                    <ChevronDown className="w-3 h-3" />
                  ) : (
                    <ChevronUp className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>

            {/* Core match metrics & statuses */}
            {!isScoreboardCollapsed && (
              <div className="p-3 space-y-2.5 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent pr-1.5">
                {/* Stage description & pulsing badge */}
                <div className="flex items-center justify-between">
                  <span className="text-cyan-400/80 text-[8.5px] font-extrabold uppercase tracking-widest flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-cyan-400" />
                    {activeMatch.stage}
                  </span>
                  {activeMatch.status === "LIVE" && (
                    <span className="bg-emerald-950/90 text-emerald-400 border border-emerald-500/60 px-2 py-0.5 rounded text-[8px] font-extrabold animate-pulse flex items-center gap-1">
                      <span className="w-1 h-1 bg-emerald-400 rounded-full animate-ping" />
                      {formatGameTime()}
                    </span>
                  )}
                  {activeMatch.status === "UPCOMING" && (
                    <span className="bg-blue-950/90 text-blue-400 border border-blue-500/60 px-2 py-0.5 rounded text-[8px] font-extrabold flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5" />
                      UPCOMING
                    </span>
                  )}
                  {activeMatch.status === "COMPLETED" && (
                    <span className="bg-slate-900 text-slate-400 border border-slate-700/60 px-2 py-0.5 rounded text-[8px] font-extrabold">
                      COMPLETED
                    </span>
                  )}
                </div>

                {/* Holographic versus scoreboard */}
                <div className="bg-slate-900/70 border border-slate-800 p-2.5 rounded-md flex items-center justify-between text-center relative overflow-hidden">
                  {/* Horizontal high-tech scanline element */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0)_95%,rgba(34,211,238,0.1)_98%)] bg-[size:100%_12px] animate-[pulse_3s_infinite]" />

                  {/* Left Team */}
                  <div className="flex-1 flex flex-col items-center z-10">
                    <span className="text-2.5xl filter drop-shadow-[0_0_6px_rgba(255,255,255,0.25)] select-none" role="img" aria-label={activeMatch.team1}>
                      {activeMatch.team1Flag}
                    </span>
                    <span className="text-slate-200 font-extrabold tracking-wide text-[9px] mt-1 max-w-[75px] truncate uppercase">
                      {activeMatch.team1}
                    </span>
                  </div>

                  {/* Live Scores or VS middle marker */}
                  <div className="px-2.5 flex flex-col items-center justify-center min-w-[70px] z-10">
                    <span className={`font-mono font-black text-base tracking-widest filter drop-shadow-[0_0_8px_currentColor] ${activeMatch.status === 'LIVE' ? 'text-emerald-400' : 'text-cyan-400'}`}>
                      {activeMatch.score}
                    </span>
                    {activeMatch.status === 'LIVE' ? (
                      <span className="text-[8px] bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-bold tracking-wider animate-pulse uppercase mt-1 font-mono">
                        {formatGameTime()}
                      </span>
                    ) : activeMatch.status === 'COMPLETED' ? (
                      <span className="text-[8px] bg-slate-900 text-slate-400 border border-slate-700/50 px-1.5 py-0.5 rounded font-bold tracking-wider uppercase mt-1 font-mono">
                        90:00 FT
                      </span>
                    ) : (
                      <span className="text-[8px] bg-blue-950/60 text-blue-400 border border-blue-800/30 px-1.5 py-0.5 rounded font-bold tracking-wider uppercase mt-1 font-mono text-center block">
                        00:00 PRE
                      </span>
                    )}
                  </div>

                  {/* Right Team */}
                  <div className="flex-1 flex flex-col items-center z-10">
                    <span className="text-2.5xl filter drop-shadow-[0_0_6px_rgba(255,255,255,0.25)] select-none" role="img" aria-label={activeMatch.team2}>
                      {activeMatch.team2Flag}
                    </span>
                    <span className="text-slate-200 font-extrabold tracking-wide text-[9px] mt-1 max-w-[75px] truncate uppercase">
                      {activeMatch.team2}
                    </span>
                  </div>
                </div>

                {/* Dynamic location metrics & sensor telemetry */}
                <div className="bg-cyan-950/15 border border-cyan-900/40 p-2 rounded-md space-y-1 text-[8.5px] text-slate-400 relative">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-semibold">VENUE:</span>
                    <span className="text-cyan-200 font-bold truncate max-w-[170px] uppercase">
                      {selectedLocation.stadium}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-semibold">KICKOFF:</span>
                    <span className="text-white font-semibold">
                      {activeMatch.dateTime}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t border-cyan-900/20 pt-1 mt-1">
                    <span className="text-slate-400 font-semibold">STADIUM STATE:</span>
                    <span className={`font-black tracking-wider ${activeMatch.status === 'LIVE' ? 'text-emerald-400' : 'text-cyan-400'}`}>
                      {activeMatch.crowdDensity}
                    </span>
                  </div>
                </div>

                {/* Real-time Match Telemetry & Ball Pass Tracker */}
                <div className="border-t border-cyan-900/30 pt-2 space-y-2">
                  <div className="flex items-center justify-between text-cyan-400 font-bold tracking-wide text-[9px] border-b border-cyan-900/20 pb-1">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      LIVE MATCH TELEMETRY
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsSimulatingLive(!isSimulatingLive);
                      }}
                      className={`px-1.5 py-0.5 rounded text-[7px] font-bold border cursor-pointer transition-all ${
                        isSimulatingLive
                          ? "bg-red-950/50 text-red-400 border-red-500/30 hover:bg-red-900/30 animate-pulse"
                          : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-300"
                      }`}
                      title="Toggle Live Simulation Stream"
                      aria-label="Toggle Live Simulation Stream"
                    >
                      {isSimulatingLive ? "🔴 SIMULATING" : "⏸ PAUSED"}
                    </button>
                  </div>

                  {/* Possession & Pass Accuracies */}
                  <div className="space-y-1.5 bg-slate-900/40 border border-slate-900 p-1.5 rounded">
                    {/* Possession Dual Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[8px] text-slate-400 font-bold">
                        <span>POSSESSION: {possession.team1}%</span>
                        <span>{possession.team2}%</span>
                      </div>
                      <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden flex">
                        <div
                          className="bg-cyan-500 transition-all duration-500"
                          style={{ width: `${possession.team1}%` }}
                        />
                        <div
                          className="bg-amber-500 transition-all duration-500"
                          style={{ width: `${possession.team2}%` }}
                        />
                      </div>
                    </div>

                    {/* Passes Summary */}
                    <div className="grid grid-cols-2 gap-2 text-[8px] border-t border-slate-800/40 pt-1 mt-1">
                      <div>
                        <span className="text-slate-400 font-semibold">{activeMatch.team1}:</span>
                        <div className="text-cyan-400 font-bold mt-0.5">
                          {passes.team1.completed}/{passes.team1.total} passes
                          <span className="text-slate-400 font-normal ml-1">
                            ({passes.team1.total > 0 ? Math.round((passes.team1.completed / passes.team1.total) * 100) : 0}%)
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 font-semibold">{activeMatch.team2}:</span>
                        <div className="text-amber-400 font-bold mt-0.5">
                          {passes.team2.completed}/{passes.team2.total} passes
                          <span className="text-slate-400 font-normal ml-1">
                            ({passes.team2.total > 0 ? Math.round((passes.team2.completed / passes.team2.total) * 100) : 0}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ball Pass Tracker Event Feed */}
                  <div className="space-y-1">
                    <span className="text-slate-400 font-extrabold text-[8px] tracking-wider uppercase block">
                      BALL PASS TRACKER (RECENT PASSES)
                    </span>
                    <div className="max-h-[60px] overflow-y-auto space-y-1 pr-1 scrollbar-thin scrollbar-thumb-cyan-900/40">
                      {passEventsLog.length === 0 ? (
                        <div className="text-slate-400 italic text-[8px] text-center py-1">
                          Waiting for kickoff pass...
                        </div>
                      ) : (
                        passEventsLog.map((evt) => (
                          <div
                            key={evt.id}
                            className="bg-slate-900/30 border border-slate-800/40 p-1 rounded-sm flex items-center justify-between text-[8px]"
                          >
                            <div className="flex items-center gap-1.5 truncate max-w-[170px]">
                              <span>{evt.flag}</span>
                              <span className="text-slate-300 font-medium truncate">
                                {evt.fromPlayer} ➔ {evt.toPlayer}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="text-slate-400 text-[7px]">{evt.speed}</span>
                              <span
                                className={`font-extrabold px-1 rounded-sm text-[7px] ${
                                  evt.success
                                    ? "bg-emerald-950/80 text-emerald-400 border border-emerald-900/30"
                                    : "bg-red-950/80 text-red-400 border border-red-900/30"
                                }`}
                              >
                                {evt.success ? "SUCCESS" : "INTERCEPT"}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Fouls & Violations Section */}
                <div className="border-t border-cyan-900/30 pt-2 space-y-1.5">
                  <div className="flex justify-between items-center text-rose-400 font-bold tracking-wide text-[9px]">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                      FOULS & VIOLATIONS
                    </span>
                    <span className="bg-rose-950/50 text-rose-400 border border-rose-900/40 px-1.5 rounded text-[8px] font-black">
                      TOTAL: {foulsCount}
                    </span>
                  </div>

                  <div className="max-h-[60px] overflow-y-auto space-y-1 pr-1 scrollbar-thin scrollbar-thumb-rose-900/40">
                    {foulsLog.length === 0 ? (
                      <div className="text-slate-400 italic text-[8px] text-center py-1 bg-slate-900/20 border border-slate-900/40 rounded-sm">
                        No fouls or yellow/red cards logged.
                      </div>
                    ) : (
                      foulsLog.map((foul) => (
                        <div
                          key={foul.id}
                          className="bg-slate-900/30 border border-slate-800/40 p-1 rounded-sm flex items-center justify-between text-[8px]"
                        >
                          <div className="flex items-center gap-1.5 truncate max-w-[190px]">
                            <span className="text-slate-400 font-bold shrink-0">{foul.time}</span>
                            <span>{foul.flag}</span>
                            <span className="text-slate-200 font-medium truncate">
                              {foul.player} <span className="text-slate-400 text-[7px.5] font-bold">#{foul.jersey}</span>
                            </span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            {foul.card === "yellow" && (
                              <span className="w-2 h-3 bg-amber-400 rounded-sm shadow-[0_0_6px_rgba(245,158,11,0.6)]" title="Yellow Card" />
                            )}
                            {foul.card === "red" && (
                              <span className="w-2 h-3 bg-red-500 rounded-sm shadow-[0_0_6px_rgba(239,68,68,0.6)] animate-pulse" title="Red Card" />
                            )}
                            <span className="text-slate-400 text-[7px] uppercase font-bold px-1">{foul.team.substring(0, 3)}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Collapsible More Details / Real-time Ball Tracker HUD */}
                <div className="border-t border-cyan-900/30 pt-2 space-y-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMoreDetailsExpanded(!isMoreDetailsExpanded);
                    }}
                    className="w-full flex items-center justify-between text-cyan-400 font-bold tracking-wide text-[9px] hover:text-cyan-300 transition cursor-pointer"
                    aria-label={isMoreDetailsExpanded ? "Collapse ball tracker details" : "Expand ball tracker details"}
                    aria-expanded={isMoreDetailsExpanded}
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      MORE DETAILS (BALL TRACKER HUD)
                    </span>
                    <span className="text-[8px]">{isMoreDetailsExpanded ? "▼" : "▲"}</span>
                  </button>

                  {isMoreDetailsExpanded && (
                    <div className="bg-slate-950/80 border border-cyan-900/30 p-2 rounded space-y-2 text-[8px] text-slate-300 font-mono">
                      {/* Active Pass Telemetry */}
                      <div className="grid grid-cols-2 gap-1.5 border-b border-cyan-900/20 pb-1.5">
                        <div>
                          <span className="text-slate-400 font-semibold uppercase text-[7.5px]">BALL STATUS:</span>
                          <div className="text-emerald-400 font-bold flex items-center gap-1 mt-0.5 animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            IN PLAY
                          </div>
                        </div>
                        <div>
                          <span className="text-slate-400 font-semibold uppercase text-[7.5px]">PASS TYPE:</span>
                          <div className="text-cyan-300 font-bold mt-0.5 uppercase">
                            {currentPass3DState?.type || "Short Pass"}
                          </div>
                        </div>
                      </div>

                      {/* Origin & Destination Nodes */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[7.5px]">
                          <span className="text-cyan-500 font-semibold flex items-center gap-1">
                            <span className="w-1 h-1 bg-cyan-400 rounded-full" />
                            ORIGIN NODE:
                          </span>
                          <span className="text-slate-400 font-bold">
                            X: {currentPass3DState ? Math.round(currentPass3DState.ox) : 0}m, Z: {currentPass3DState ? Math.round(currentPass3DState.oz) : 0}m
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[7.5px]">
                          <span className="text-amber-500 font-semibold flex items-center gap-1">
                            <span className="w-1 h-1 bg-amber-400 rounded-full" />
                            DESTINATION NODE:
                          </span>
                          <span className="text-slate-400 font-bold">
                            X: {currentPass3DState ? Math.round(currentPass3DState.dx) : 0}m, Z: {currentPass3DState ? Math.round(currentPass3DState.dz) : 0}m
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[7.5px] border-t border-slate-900 pt-1 mt-1 font-sans">
                          <span className="text-slate-400 font-semibold">VELOCITY:</span>
                          <span className="text-white font-bold">
                            {currentPass3DState?.speed || 52} KM/H
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[7.5px]">
                          <span className="text-slate-400 font-semibold">TRAJECTORY ARC:</span>
                          <span className="text-cyan-300 font-extrabold uppercase text-[7px] bg-cyan-950/40 px-1 rounded border border-cyan-900/30">
                            QUADRATIC BEZIER
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Futuristic lightline pointer pointing down to the physical pitch center */}
          <div className="w-0.5 h-7 bg-gradient-to-b from-cyan-500 via-cyan-400/60 to-transparent" />
          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee] animate-pulse -mt-1" />
        </div>
      </div>

      {/* Cyber overlay elements */}
      {!isFanMode && (
        <div className="absolute top-3 left-3 bg-[#0d131a]/95 border border-[#1b2530] text-[10px] text-emerald-400 p-2 font-mono rounded space-y-1 select-none backdrop-blur shadow-lg z-10">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>TWIN STATE: ONLINE</span>
          </div>
          <div>CAM X: <span className="text-white font-semibold">{cameraPos.x.toFixed(1)}</span></div>
          <div>CAM Y: <span className="text-white font-semibold">{cameraPos.y.toFixed(1)}</span></div>
          <div>CAM Z: <span className="text-white font-semibold">{cameraPos.z.toFixed(1)}</span></div>
          <div className="text-[9px] text-cyan-400 mt-1 uppercase">FOCUS: {activeAnchor || "GLOBAL OVERVIEW"}</div>
        </div>
      )}

      {/* Floating Heatmap HUD Toggle Card */}
      {!isFanMode && (
        <div className="absolute top-[115px] left-3 bg-[#0d131a]/95 border border-[#1b2530] p-1.5 font-mono rounded backdrop-blur shadow-lg z-10 flex flex-col gap-1 w-[140px] select-none">
          <span className="text-[7.5px] text-slate-400 uppercase font-semibold tracking-wider">Tactical Layers:</span>
          <button
            onClick={() => {
              const newState = !isHeatmapOverlayEnabled;
              setIsHeatmapOverlayEnabled(newState);
              playHeatmapSound(newState);
            }}
            className={`flex items-center gap-1.5 px-2 py-1 rounded text-[8px] font-bold border transition-all cursor-pointer ${
              isHeatmapOverlayEnabled
                ? "bg-red-950/50 text-red-400 border-red-800 shadow-[0_0_10px_rgba(239,68,68,0.25)] animate-pulse"
                : "bg-[#111827] text-slate-400 border-slate-900 hover:text-slate-300 hover:border-slate-800"
            }`}
            title="Toggle 3D Visitor Heatmap Overlay"
            aria-label="Toggle 3D Visitor Heatmap Overlay"
          >
            <Flame className={`w-2.5 h-2.5 shrink-0 ${isHeatmapOverlayEnabled ? "text-red-500 animate-pulse" : "text-slate-400"}`} />
            <span>VISITOR HEATMAP</span>
          </button>

          <button
            onClick={() => {
              const newState = !isStructuralWarningEnabled;
              setIsStructuralWarningEnabled(newState);
              playHeatmapSound(newState);
            }}
            className={`flex items-center gap-1.5 px-2 py-1 rounded text-[8px] font-bold border transition-all cursor-pointer ${
              isStructuralWarningEnabled
                ? "bg-amber-950/50 text-amber-400 border-amber-800 shadow-[0_0_10px_rgba(245,158,11,0.25)] animate-pulse"
                : "bg-[#111827] text-slate-400 border-slate-900 hover:text-slate-300 hover:border-slate-800"
            }`}
            title="Toggle 3D Weather Structural Warning Overlay"
            aria-label="Toggle 3D Weather Structural Warning Overlay"
          >
            <AlertTriangle className={`w-2.5 h-2.5 shrink-0 ${isStructuralWarningEnabled ? "text-amber-500 animate-pulse" : "text-slate-400"}`} />
            <span>STRUCTURAL WARN</span>
          </button>
        </div>
      )}

      {/* Real-time Environmental Monitor Overlay */}
      {!isFanMode && (
        <AnimatePresence>
        {isEnvPanelOpen ? (
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 150 }}
            className="absolute top-3 right-3 bg-[#0d131a]/95 border border-[#1b2530] text-[10px] p-3 font-mono rounded space-y-2 select-none backdrop-blur shadow-lg z-10 w-[240px] text-slate-300"
          >
            <div className="flex items-center justify-between border-b border-[#1b2530] pb-1.5">
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold tracking-wide">
                {activeWeather === "SUNSHINE" && <Sun className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: "8s" }} />}
                {activeWeather === "RAIN" && <CloudRain className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />}
                {activeWeather === "FOG" && <CloudFog className="w-3.5 h-3.5 text-slate-400 animate-pulse" />}
                {activeWeather === "SNOW" && <CloudSnow className="w-3.5 h-3.5 text-blue-200 animate-pulse" />}
                <span>ENV_SENSORS v1.4</span>
              </div>
              <div className="flex items-center gap-1.5 relative">
                {isLoadingWeather ? (
                  <RefreshCw className="w-3 h-3 text-cyan-400 animate-spin" />
                ) : (
                  <span className="text-[8px] bg-emerald-950/80 text-emerald-400 px-1 border border-emerald-800 rounded">LIVE_FEED</span>
                )}
                
                {/* 8-bit cartoony Click to Close speech bubble */}
                <motion.button
                  type="button"
                  aria-label="Close environmental monitor panel"
                  initial={{ opacity: 0, scale: 0.5, x: -10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.5, x: -10 }}
                  transition={{ type: "spring", damping: 12, stiffness: 150 }}
                  onClick={() => setIsEnvPanelOpen(false)}
                  className="absolute right-[28px] top-1/2 -translate-y-1/2 bg-yellow-400 text-black border-2 border-black font-mono text-[8px] px-1.5 py-0.5 font-bold rounded-none shadow-[2px_2px_0px_0px_#000000] z-20 cursor-pointer select-none whitespace-nowrap animate-bounce"
                  style={{ animationDuration: "1.8s" }}
                >
                  CLICK TO CLOSE
                  {/* Small cartoony tail pointing right to the close button */}
                  <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 pointer-events-none border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-black" />
                  <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-0 h-0 pointer-events-none border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent border-l-[5px] border-l-yellow-400" />
                </motion.button>

                {/* Open and Close Link Button */}
                <button
                  onClick={() => setIsEnvPanelOpen(false)}
                  className="p-1 hover:bg-[#161f2b] border border-slate-800/60 hover:border-cyan-500/50 rounded transition cursor-pointer select-none shrink-0"
                  title="Close Environmental Panel"
                  aria-label="Close Environmental Panel"
                >
                  <PixelLinkIcon width={14} height={13} />
                </button>
              </div>
            </div>

            {/* Location Dropdown Selector */}
            <div className="space-y-1">
              <label htmlFor="active-venue-selector" className="text-[8px] text-slate-400 uppercase font-semibold">Active Venue Target:</label>
              <select
                id="active-venue-selector"
                value={selectedLocation.id}
                onChange={(e) => {
                  const loc = LOCATIONS.find(l => l.id === e.target.value);
                  if (loc) setSelectedLocation(loc);
                }}
                aria-label="Active Venue Target"
                className="w-full bg-[#111827] border border-slate-800 text-white rounded px-1.5 py-1 text-[10px] focus:outline-none focus:border-cyan-500 cursor-pointer font-sans"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.stadium} ({loc.name})
                  </option>
                ))}
              </select>
            </div>

            {/* Real-time Environmental Readings */}
            <div className="bg-[#080c10]/90 p-2 border border-[#1b2530] rounded space-y-1.5 text-[9px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <Thermometer className="w-2.5 h-2.5 shrink-0 text-amber-500" /> TEMP:
                </span>
                <span className="text-white font-bold">{weatherData?.temperature !== undefined ? `${weatherData.temperature.toFixed(1)}°C` : "--"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <Wind className="w-2.5 h-2.5 shrink-0 text-cyan-400" /> WIND_SPD:
                </span>
                <span className="text-white font-bold">{weatherData?.windspeed !== undefined ? `${weatherData.windspeed.toFixed(1)} km/h` : "--"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <Droplets className="w-2.5 h-2.5 shrink-0 text-blue-400" /> HUMIDITY:
                </span>
                <span className="text-white font-bold">{weatherData?.humidity}%</span>
              </div>
              <div className="border-t border-[#1b2530] pt-1 mt-1 text-[8px] flex items-center justify-between text-slate-400">
                <span>STATUS:</span>
                <span className="text-cyan-400 font-bold uppercase truncate max-w-[120px]">{weatherData?.description}</span>
              </div>
            </div>

            {/* Structural Stress Telemetry Details */}
            {isStructuralWarningEnabled && (
              <div className="bg-[#120b08]/90 p-2 border border-amber-950/60 rounded space-y-1 text-[9px] text-slate-300 select-none">
                <div className="text-[8px] text-amber-400 font-bold tracking-wider flex items-center gap-1 uppercase font-mono">
                  <AlertTriangle className="w-2.5 h-2.5 text-amber-500 animate-pulse" />
                  <span>STRUCTURAL RISK ANALYSIS</span>
                </div>
                {/* Roof Shear Stress */}
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[8px] font-mono">
                    <span className="text-slate-400">ROOF WIND SHEAR:</span>
                    <span className={`font-bold ${activeWeather === "RAIN" || activeWeather === "SNOW" || (weatherData?.windspeed && weatherData.windspeed > 15) ? "text-red-400 font-bold animate-pulse" : "text-emerald-400"}`}>
                      {activeWeather === "RAIN" ? "38%" : activeWeather === "SNOW" ? "54%" : (weatherData?.windspeed && weatherData.windspeed > 15) ? "42%" : "8%"}
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 h-1 rounded overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${activeWeather === "RAIN" || activeWeather === "SNOW" || (weatherData?.windspeed && weatherData.windspeed > 15) ? "bg-red-500 animate-pulse" : "bg-emerald-500"}`} 
                      style={{ width: activeWeather === "RAIN" ? "38%" : activeWeather === "SNOW" ? "54%" : (weatherData?.windspeed && weatherData.windspeed > 15) ? "42%" : "8%" }}
                    />
                  </div>
                </div>
                {/* Pitch Saturation */}
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[8px] font-mono">
                    <span className="text-slate-400">FIELD SATURATION:</span>
                    <span className={`font-bold ${activeWeather === "RAIN" ? "text-red-400 font-bold animate-pulse" : activeWeather === "SNOW" ? "text-amber-400" : "text-emerald-400"}`}>
                      {activeWeather === "RAIN" ? "79%" : activeWeather === "SNOW" ? "32%" : "12%"}
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 h-1 rounded overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${activeWeather === "RAIN" ? "bg-red-500 animate-pulse" : activeWeather === "SNOW" ? "bg-amber-500" : "bg-emerald-500"}`} 
                      style={{ width: activeWeather === "RAIN" ? "79%" : activeWeather === "SNOW" ? "32%" : "12%" }}
                    />
                  </div>
                </div>
                {/* Upper Deck Drag */}
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[8px] font-mono">
                    <span className="text-slate-400">UPPER TIER WIND LOADS:</span>
                    <span className={`font-bold ${activeWeather === "RAIN" || activeWeather === "SNOW" ? "text-amber-400" : "text-emerald-400"}`}>
                      {activeWeather === "RAIN" ? "45%" : activeWeather === "SNOW" ? "60%" : "15%"}
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 h-1 rounded overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${activeWeather === "RAIN" || activeWeather === "SNOW" ? "bg-amber-500" : "bg-emerald-500"}`} 
                      style={{ width: activeWeather === "RAIN" ? "45%" : activeWeather === "SNOW" ? "60%" : "15%" }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Dynamic Warning and Tactical Overlay Indicators */}
            <div className="text-[8px] bg-slate-950/90 p-1.5 border border-[#1b2530]/40 rounded text-slate-400">
              {activeWeather === "SUNSHINE" && (
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <span>OPTIMAL SPECTATOR QUEUE FLOW</span>
                </div>
              )}
              {activeWeather === "RAIN" && (
                <div className="flex items-center gap-1.5 text-cyan-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  <span>SHELTER FLOW DELAYS ANTICIPATED</span>
                </div>
              )}
              {activeWeather === "FOG" && (
                <div className="flex items-center gap-1.5 text-pink-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-ping" />
                  <span>SCANNER RANGE BOOST IN OPERATION</span>
                </div>
              )}
              {activeWeather === "SNOW" && (
                <div className="flex items-center gap-1.5 text-blue-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                  <span>PITCH COATING HEATING ACTIVE</span>
                </div>
              )}
            </div>

            {/* Stadium Floodlights / Night Mode Toggle */}
            <div className="space-y-1.5 pt-2 border-t border-[#1b2530]">
              <div className="flex items-center justify-between">
                <span className="text-[8px] text-slate-400 uppercase font-semibold">Stadium Floodlights:</span>
                <span className={`text-[8px] font-mono px-1.5 py-0.2 rounded font-bold transition-all ${floodlightsOn ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800" : "bg-red-950/80 text-red-400 border border-red-800"}`}>
                  {floodlightsOn ? "ON (DAY/MATCH)" : "OFF (NIGHT MODE)"}
                </span>
              </div>
              <button
                onClick={() => setFloodlightsOn(!floodlightsOn)}
                className={`w-full flex items-center justify-center gap-1.5 py-1 px-2 rounded text-[9px] border font-bold transition-all cursor-pointer ${
                  floodlightsOn
                    ? "bg-amber-950/40 text-amber-400 border-amber-900 hover:bg-amber-950/60 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                    : "bg-cyan-950/40 text-cyan-400 border-cyan-800 hover:bg-cyan-950/60 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                }`}
                aria-label="Toggle Stadium Floodlights / Night Mode"
              >
                {floodlightsOn ? (
                  <>
                    <Moon className="w-3 h-3 shrink-0" />
                    <span>Switch to Night Mode (Lights Off)</span>
                  </>
                ) : (
                  <>
                    <Lightbulb className="w-3 h-3 shrink-0" />
                    <span>Switch to Day Mode (Lights On)</span>
                  </>
                )}
              </button>
            </div>

            {/* Visitor Heatmap Toggle */}
            <div className="space-y-1.5 pt-2 border-t border-[#1b2531]">
              <div className="flex items-center justify-between">
                <span className="text-[8px] text-slate-400 uppercase font-semibold">Visitor Heatmap:</span>
                <span className={`text-[8px] font-mono px-1.5 py-0.2 rounded font-bold transition-all ${isHeatmapOverlayEnabled ? "bg-red-950/80 text-red-400 border border-red-800 animate-pulse" : "bg-slate-900/80 text-slate-400 border border-slate-800"}`}>
                  {isHeatmapOverlayEnabled ? "ACTIVE OVERLAY" : "DISABLED"}
                </span>
              </div>
              <button
                onClick={() => {
                  const newState = !isHeatmapOverlayEnabled;
                  setIsHeatmapOverlayEnabled(newState);
                  playHeatmapSound(newState);
                }}
                className={`w-full flex items-center justify-center gap-1.5 py-1 px-2 rounded text-[9px] border font-bold transition-all cursor-pointer ${
                  isHeatmapOverlayEnabled
                    ? "bg-red-950/40 text-red-400 border-red-900 hover:bg-red-950/60 shadow-[0_0_12px_rgba(239,68,68,0.3)] animate-pulse"
                    : "bg-[#111827] text-slate-400 border-slate-900 hover:text-slate-300 hover:border-slate-800"
                }`}
                title="Toggle Visitor Heatmap Seating Density Overlay"
                aria-label="Toggle Visitor Heatmap Seating Density Overlay"
              >
                <Flame className={`w-3.5 h-3.5 shrink-0 ${isHeatmapOverlayEnabled ? "text-red-500 animate-bounce" : "text-slate-400"}`} style={{ animationDuration: "1.2s" }} />
                <span>{isHeatmapOverlayEnabled ? "Deactivate Heatmap Overlay" : "Activate Visitor Heatmap"}</span>
              </button>
            </div>

            {/* Structural Warnings Toggle */}
            <div className="space-y-1.5 pt-2 border-t border-[#1b2531]">
              <div className="flex items-center justify-between">
                <span className="text-[8px] text-slate-400 uppercase font-semibold">Structural Warnings:</span>
                <span className={`text-[8px] font-mono px-1.5 py-0.2 rounded font-bold transition-all ${isStructuralWarningEnabled ? "bg-amber-950/80 text-amber-400 border border-amber-800 animate-pulse" : "bg-slate-900/80 text-slate-400 border border-slate-800"}`}>
                  {isStructuralWarningEnabled ? "ACTIVE OVERLAY" : "DISABLED"}
                </span>
              </div>
              <button
                onClick={() => {
                  const newState = !isStructuralWarningEnabled;
                  setIsStructuralWarningEnabled(newState);
                  playHeatmapSound(newState);
                }}
                className={`w-full flex items-center justify-center gap-1.5 py-1 px-2 rounded text-[9px] border font-bold transition-all cursor-pointer ${
                  isStructuralWarningEnabled
                    ? "bg-amber-950/40 text-amber-400 border-amber-900 hover:bg-amber-950/60 shadow-[0_0_12px_rgba(245,158,11,0.3)] animate-pulse"
                    : "bg-[#111827] text-slate-400 border-slate-900 hover:text-slate-300 hover:border-slate-800"
                }`}
                title="Toggle Weather Structural Warning Overlay"
                aria-label="Toggle Weather Structural Warning Overlay"
              >
                <AlertTriangle className={`w-3.5 h-3.5 shrink-0 ${isStructuralWarningEnabled ? "text-amber-500 animate-bounce" : "text-slate-400"}`} style={{ animationDuration: "1.2s" }} />
                <span>{isStructuralWarningEnabled ? "Deactivate Warning Overlay" : "Activate Warning Overlay"}</span>
              </button>
            </div>

            {/* Manual Weather State Overrides */}
            <div className="space-y-1">
              <div className="text-[7.5px] text-slate-400 uppercase font-semibold">Dry-Run Weather Overrides:</div>
              <div className="grid grid-cols-4 gap-1">
                {(["SUNSHINE", "RAIN", "FOG", "SNOW"] as const).map((ws) => (
                  <button
                    key={ws}
                    onClick={() => {
                      setWeatherData(prev => ({
                        ...prev,
                        description: ws === "SUNSHINE" ? "Override: Sunshine" : ws === "RAIN" ? "Override: Heavy Rain" : ws === "FOG" ? "Override: Thick Fog" : "Override: Heavy Snow"
                      }));
                      handleWeatherChange(ws);
                    }}
                    className={`py-0.5 px-1 rounded text-[8px] border font-bold transition-all truncate text-center ${
                      activeWeather === ws
                        ? "bg-cyan-950 text-cyan-400 border-cyan-700 shadow-[0_0_8px_rgba(34,211,238,0.3)]"
                        : "bg-[#111827] text-slate-400 border-slate-900 hover:text-slate-300 hover:border-slate-800"
                    }`}
                    aria-label={`Simulate ${ws} Weather`}
                  >
                    {ws}
                  </button>
                ))}
              </div>
            </div>

            {weatherError && (
              <div className="text-[7.5px] text-amber-500 flex items-center gap-1">
                <AlertCircle className="w-2.5 h-2.5 shrink-0" />
                <span className="truncate max-w-[210px]">{weatherError}</span>
              </div>
            )}
          </motion.div>
        ) : (
          <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
            {/* 8-bit speech bubble pointing to the open button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.5, x: 20 }}
              transition={{ type: "spring", damping: 12, stiffness: 150 }}
              onClick={() => setIsEnvPanelOpen(true)}
              className="bg-yellow-400 text-black border-2 border-black font-mono text-[9px] px-2 py-1 font-bold rounded-none shadow-[3px_3px_0px_0px_#000000] relative cursor-pointer select-none whitespace-nowrap animate-bounce flex items-center justify-center shrink-0"
              style={{ animationDuration: "2s" }}
            >
              EDIT HERE! CLICK ME
              {/* Cartoony pixel speech bubble pointer */}
              <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-black" />
              <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent border-l-[5px] border-l-yellow-400" />
            </motion.div>

            <motion.button
              initial={{ opacity: 0, scale: 0.8, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 30 }}
              transition={{ type: "spring", damping: 15, stiffness: 160 }}
              onClick={() => setIsEnvPanelOpen(true)}
              className="bg-[#0d131a]/95 border border-[#1b2530] hover:border-cyan-500/50 p-2 rounded flex items-center gap-2 shadow-lg text-[9px] font-mono text-cyan-400 cursor-pointer hover:bg-[#161f2b] transition duration-200 shrink-0"
              title="Open Environmental Monitor"
            >
              <PixelLinkIcon width={18} height={17} className="animate-bounce" style={{ animationDuration: "2.5s" }} />
              <span className="font-bold tracking-wider">ENV MONITOR</span>
            </motion.button>
          </div>
        )}
      </AnimatePresence>
      )}

      {/* Cartoony smoke puff animation container */}
      {showSmoke && (
        <div className="absolute top-12 right-12 pointer-events-none z-30 w-12 h-12 flex items-center justify-center">
          {/* Pixel Cloud 1 */}
          <motion.div
            initial={{ scale: 0, opacity: 0.9, x: -10, y: -5 }}
            animate={{ scale: [1, 1.8, 2.2], opacity: [0.9, 0.6, 0], x: -40, y: -20, rotate: 45 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute w-7 h-7 bg-slate-200 border-2 border-black rounded-none shadow-[2px_2px_0px_0px_#000000]"
          />
          {/* Pixel Cloud 2 */}
          <motion.div
            initial={{ scale: 0, opacity: 0.95, x: 8, y: -10 }}
            animate={{ scale: [1, 2, 2.4], opacity: [0.95, 0.5, 0], x: 35, y: -30, rotate: -30 }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.03 }}
            className="absolute w-9 h-9 bg-white border-2 border-black rounded-none shadow-[2px_2px_0px_0px_#000000]"
          />
          {/* Pixel Cloud 3 */}
          <motion.div
            initial={{ scale: 0, opacity: 0.8, x: -8, y: 10 }}
            animate={{ scale: [1, 1.6, 2], opacity: [0.8, 0.4, 0], x: -30, y: 25, rotate: 15 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.06 }}
            className="absolute w-6 h-6 bg-slate-300 border-2 border-black rounded-none shadow-[2px_2px_0px_0px_#000000]"
          />
          {/* Pixel Cloud 4 */}
          <motion.div
            initial={{ scale: 0, opacity: 0.85, x: 12, y: 8 }}
            animate={{ scale: [1, 1.8, 2.2], opacity: [0.85, 0.4, 0], x: 38, y: 20, rotate: -15 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
            className="absolute w-8 h-8 bg-slate-100 border-2 border-black rounded-none shadow-[2px_2px_0px_0px_#000000]"
          />
          {/* Tiny sparks/pixels */}
          <motion.div
            initial={{ scale: 0, opacity: 1, x: -5, y: -5 }}
            animate={{ scale: [1, 1.5, 0], opacity: [1, 1, 0], x: -50, y: -10 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute w-2 h-2 bg-yellow-400 border border-black rounded-none"
          />
          <motion.div
            initial={{ scale: 0, opacity: 1, x: 5, y: 5 }}
            animate={{ scale: [1, 1.5, 0], opacity: [1, 1, 0], x: 50, y: 10 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.04 }}
            className="absolute w-2 h-2 bg-cyan-400 border border-black rounded-none"
          />
        </div>
      )}

      <div className="absolute bottom-3 right-3 flex gap-2 font-mono text-[9px] z-10">
        <span className="px-2 py-0.5 bg-slate-900/90 text-slate-400 border border-slate-800 rounded">GRID_SCALE: 200m</span>
        <span className="px-2 py-0.5 bg-slate-900/90 text-slate-400 border border-slate-800 rounded">MESH_MODE: HOLOGRAPHIC</span>
      </div>
    </div>
  );
}
