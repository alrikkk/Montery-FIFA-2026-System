import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldAlert,
  Cpu,
  Layers,
  Video,
  Terminal,
  Check,
  ArrowRight,
  Activity,
  Upload,
  RefreshCw,
  BookOpen,
  Sliders,
  HelpCircle,
  Clock,
  Compass,
  Globe,
  Database,
  Lock,
  Eye,
  Copy,
  Volume2,
  VolumeX,
  Zap,
  BellRing,
  History,
  Sun,
  CloudRain,
  CloudFog,
  CloudSnow,
  Battery,
  BatteryCharging,
  Download,
  ChevronDown,
  FileSpreadsheet,
  Utensils,
  AlertTriangle,
  Flame,
  Wrench,
  UserCheck,
  Accessibility,
  Home,
  Maximize2,
  Minimize2,
  ShoppingBag,
  Calendar,
  Search,
  Trash2,
  Users,
  ArrowLeft,
  Edit2,
  MessageSquare
} from "lucide-react";
import { LOCATIONS } from "./utils/stadiumLocations";
const StadiumTwin = lazy(() => import("./components/StadiumTwin"));
import GroundingManual from "./components/GroundingManual";
import SidebarNavigation from "./components/SidebarNavigation";
import StadiumAIComplianceChat from "./components/StadiumAIComplianceChat";
import TerminalLogs, { LogEntry } from "./components/TerminalLogs";
import PixelDuckLogo from "./components/PixelDuckLogo";
import DensityTrendChart from "./components/DensityTrendChart";
import IncidentHistorySidebar, { IncidentLog } from "./components/IncidentHistorySidebar";
import VolunteerPixelArt from "./components/VolunteerPixelArt";
import FanPixelArt from "./components/FanPixelArt";
import StaffPixelArt from "./components/StaffPixelArt";
import OrganizerPixelArt from "./components/OrganizerPixelArt";
import { MonteryLanguageDropdown } from "./components/MonteryLanguageDropdown";
import { getTranslation, LOCALIZED_DICTIONARIES } from "./utils/localization";
import { fetchGeminiApi, apiGlobalErrorStore } from "./utils/api";

// Base64 mini image presets to avoid large files, while supporting visual capabilities testing
const PRESET_IMAGES = [
  {
    name: "Gate C CCTV Stream (Lane 4 Queue)",
    desc: "CCTV feed capturing spectator queue overcrowding at Gate C.",
    query: "Staff report: Gate C is experiencing massive congestion. Traffic estimates around 520 entries in the last 5 minutes. Queue is overflowing onto outer concourse.",
    // Cyan circle SVG base64
    data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAMklEQVR42u3PMQEAAADIoPh37S0GD0hAQUEhISEhISEhISEhISEhISEhISEhISEhISEhkIsBbeIBApMyKlcAAAAASUVORK5CYII=",
    mimeType: "image/png"
  },
  {
    name: "Gate A Trouble Ticket Audit",
    desc: "CCTV snapshot of a turnstile screen showing Error 404 (fake ticket/barcode fail).",
    query: "Auditing ticket scanning error at Turnstile 14, barcode scanned failed repeatedly. Spectator claims purchase was from reseller.",
    // Yellow circle SVG base64
    data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAMklEQVR42u3PMRUAAADIoPh37S0GD0hAQUEhISEhISEhISEhISEhISEhISEhISEhISEhkIsBbeIBApMyKlcAAAAASUVORK5CYII=",
    mimeType: "image/png"
  },
  {
    name: "Bag Policy Check (Prohibited Item)",
    desc: "X-Ray scanner checkpoint log indicating heavy opaque backpack being carried.",
    query: "Checkpoint 3 security: Bag inspection flagged a spectator with a heavy black hiking backpack at Gate C entry. Spectator refuses to leave the bag.",
    // Orange circle SVG base64
    data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAMklEQVR42u3PMRUAAADIoPh37S0GD0hAQUEhISEhISEhISEhISEhISEhISEhISEhISEhkIsBbeIBApMyKlcAAAAASUVORK5CYII=",
    mimeType: "image/png"
  }
];

export const COUNTRY_CODES = [
  { code: "+1", name: "United States / Canada", flag: "🇺🇸" },
  { code: "+52", name: "Mexico", flag: "🇲🇽" },
  { code: "+44", name: "United Kingdom", flag: "🇬🇧" },
  { code: "+91", name: "India", flag: "🇮🇳" },
  { code: "+81", name: "Japan", flag: "🇯🇵" },
  { code: "+61", name: "Australia", flag: "🇦🇺" },
  { code: "+55", name: "Brazil", flag: "🇧🇷" },
  { code: "+49", name: "Germany", flag: "🇩🇪" },
  { code: "+33", name: "France", flag: "🇫🇷" },
  { code: "+54", name: "Argentina", flag: "🇦🇷" },
  { code: "+86", name: "China", flag: "🇨🇳" },
  { code: "+82", name: "South Korea", flag: "🇰🇷" },
  { code: "+34", name: "Spain", flag: "🇪🇸" },
  { code: "+39", name: "Italy", flag: "🇮🇹" },
  { code: "+27", name: "South Africa", flag: "🇿🇦" },
  { code: "+234", name: "Nigeria", flag: "🇳🇬" },
  { code: "+254", name: "Kenya", flag: "🇰🇪" },
  { code: "+20", name: "Egypt", flag: "🇪🇬" },
  { code: "+971", name: "UAE", flag: "🇦🇪" },
  { code: "+966", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+974", name: "Qatar", flag: "🇶🇦" },
  { code: "+57", name: "Colombia", flag: "🇨🇴" },
  { code: "+51", name: "Peru", flag: "🇵🇪" },
  { code: "+31", name: "Netherlands", flag: "🇳🇱" },
  { code: "+41", name: "Switzerland", flag: "🇨🇭" },
  { code: "+46", name: "Sweden", flag: "🇸🇪" },
  { code: "+47", name: "Norway", flag: "🇳🇴" },
  { code: "+45", name: "Denmark", flag: "🇩🇰" },
  { code: "+64", name: "New Zealand", flag: "🇳🇿" },
  { code: "+65", name: "Singapore", flag: "🇸🇬" },
  { code: "+60", name: "Malaysia", flag: "🇲🇾" },
  { code: "+62", name: "Indonesia", flag: "🇮🇩" },
  { code: "+63", name: "Philippines", flag: "🇵🇭" },
  { code: "+66", name: "Thailand", flag: "🇹🇭" },
  { code: "+84", name: "Vietnam", flag: "🇻🇳" },
  { code: "+90", name: "Turkey", flag: "🇹🇷" },
  { code: "+7", name: "Russia", flag: "🇷🇺" },
  { code: "+48", name: "Poland", flag: "🇵🇱" },
  { code: "+351", name: "Portugal", flag: "🇵🇹" },
  { code: "+30", name: "Greece", flag: "🇬🇷" },
  { code: "+380", name: "Ukraine", flag: "🇺🇦" },
  { code: "+56", name: "Chile", flag: "🇨🇱" },
  { code: "+593", name: "Ecuador", flag: "🇪🇨" },
  { code: "+212", name: "Morocco", flag: "🇲🇦" },
  { code: "+233", name: "Ghana", flag: "🇬🇭" },
  { code: "+213", name: "Algeria", flag: "🇩🇿" },
  { code: "+221", name: "Senegal", flag: "🇸🇳" },
  { code: "+237", name: "Cameroon", flag: "🇨🇲" },
  { code: "+225", name: "Ivory Coast", flag: "🇨🇮" },
  { code: "+598", name: "Uruguay", flag: "🇺🇾" },
  { code: "+506", name: "Costa Rica", flag: "🇨🇷" },
  { code: "+507", name: "Panama", flag: "🇵🇦" },
  { code: "+1-876", name: "Jamaica", flag: "🇯🇲" }
];

const PRELOADED_INCIDENTS: IncidentLog[] = [
  {
    id: "pre-1",
    timestamp: "14:02:11",
    classification: "CROWD_DENSITY_ALERT",
    query: "Staff report: Gate C is experiencing massive congestion. Traffic estimates around 520 entries in the last 5 minutes. Queue is overflowing onto outer concourse.",
    actionPlan: [
      "Deploy dynamic digital wayfinding sign updates",
      "Activate auxiliary entrance Gate D",
      "Manually redirect queue tail to Gate D",
      "Instruct security staff to pace scanning gates"
    ],
    verbalRadioBriefingScript: "Montery Priority to Gate C and D staff: Gate C critical threshold breached at 520 entries. Redirecting queue tail to Gate D immediately. Enable signage divert. Over.",
    coordinates: { x: 55, y: 12, z: 55 },
    cameraPos: { x: 75, y: 15, z: 75 },
    lookAtPos: { x: 55, y: 5, z: 55 },
    glowColor: "#f97316",
    activeAnchor: "GATE_C",
    fullPayload: {
      security_firewall_status: {
        firewall_action_taken: "ALLOW_PASS",
        rate_limit_breached: false,
        malicious_injection_detected: false,
        out_of_scope_query: false
      },
      routing_metadata: {
        detected_persona: "STAFF_STREAM",
        perceived_urgency_tier: "HIGH",
        input_language: "en"
      },
      staff_operations_payload: {
        incident_classification: "CROWD_DENSITY_ALERT",
        estimated_density_band: "CRUSH_RISK",
        hazards_or_anomalies_detected: ["Gate C critical queue threshold breached."],
        manual_protocol_breached: true,
        exact_manual_clause_reference: "Gate Operations Section 3.8",
        immediate_operational_action_plan: [
          "Deploy dynamic digital wayfinding sign updates",
          "Activate auxiliary entrance Gate D",
          "Manually redirect queue tail to Gate D",
          "Instruct security staff to pace scanning gates"
        ],
        verbal_radio_briefing_script: "Montery Priority to Gate C and D staff: Gate C critical threshold breached at 520 entries. Redirecting queue tail to Gate D immediately. Enable signage divert. Over.",
        incident_coordinates: { x: 55, y: 12, z: 55 }
      },
      system_diagnostics: {
        grounded_in_context: true,
        confidence_score: 0.96
      },
      threejs_camera_matrix: {
        camera_position_vector: { x: 75, y: 15, z: 75 },
        look_at_vector: { x: 55, y: 5, z: 55 },
        ui_glow_color_hex: "#f97316",
        target_view_zone: "GATE_C"
      }
    }
  },
  {
    id: "pre-2",
    timestamp: "13:48:45",
    classification: "MEDICAL_EMERGENCY",
    query: "Spectator collapse reported near Section 143 concessions. Paramedic dispatcher requested.",
    actionPlan: [
      "Dispatch local stadium paramedic unit Medic-4",
      "Clear emergency vehicle ingress lane near Sector D/concessions",
      "Notify stadium operations center"
    ],
    verbalRadioBriefingScript: "OpsCortex to Medic-4: Spectator collapse near Section 143 concessions. Please respond immediately. Priority One. Over.",
    coordinates: { x: 35, y: 12, z: -40 },
    cameraPos: { x: 55, y: 20, z: -60 },
    lookAtPos: { x: 35, y: 10, z: -40 },
    glowColor: "#ef4444",
    activeAnchor: "SECTION_143",
    fullPayload: {
      security_firewall_status: {
        firewall_action_taken: "ALLOW_PASS",
        rate_limit_breached: false,
        malicious_injection_detected: false,
        out_of_scope_query: false
      },
      routing_metadata: {
        detected_persona: "STAFF_STREAM",
        perceived_urgency_tier: "HIGH",
        input_language: "en"
      },
      staff_operations_payload: {
        incident_classification: "MEDICAL_EMERGENCY",
        estimated_density_band: "PACKED",
        hazards_or_anomalies_detected: ["Medical emergency / spectator collapsed near Section 143 concessions."],
        manual_protocol_breached: true,
        exact_manual_clause_reference: "Medical Dispatch Protocol Section 5.2",
        immediate_operational_action_plan: [
          "Dispatch local stadium paramedic unit Medic-4",
          "Clear emergency vehicle ingress lane near Sector D/concessions",
          "Notify stadium operations center"
        ],
        verbal_radio_briefing_script: "OpsCortex to Medic-4: Spectator collapse near Section 143 concessions. Please respond immediately. Priority One. Over.",
        incident_coordinates: { x: 35, y: 12, z: -40 }
      },
      system_diagnostics: {
        grounded_in_context: true,
        confidence_score: 0.99
      },
      threejs_camera_matrix: {
        camera_position_vector: { x: 55, y: 20, z: -60 },
        look_at_vector: { x: 35, y: 10, z: -40 },
        ui_glow_color_hex: "#ef4444",
        target_view_zone: "SECTION_143"
      }
    }
  },
  {
    id: "pre-3",
    timestamp: "13:12:08",
    classification: "TICKETING_CRISIS",
    query: "Spectator ticket scanning failed repeatedly at turnstile 12. Security escorting individual to booth.",
    actionPlan: [
      "Flag ticket barcode in registration server",
      "Escort visitor to the Fan Troubleshooting Booth near Gate A",
      "Notify ticketing supervisor"
    ],
    verbalRadioBriefingScript: "OpsCortex to Troubleshooting Booth: We have a ticket scanning anomaly at turnstile 12. Escorting spectator to your booth now. Barcode flagged. Over.",
    coordinates: { x: -60, y: 12, z: -45 },
    cameraPos: { x: -80, y: 15, z: -65 },
    lookAtPos: { x: -60, y: 5, z: -45 },
    glowColor: "#eab308",
    activeAnchor: "TROUBLESHOOTING_BOOTH",
    fullPayload: {
      security_firewall_status: {
        firewall_action_taken: "ALLOW_PASS",
        rate_limit_breached: false,
        malicious_injection_detected: false,
        out_of_scope_query: false
      },
      routing_metadata: {
        detected_persona: "STAFF_STREAM",
        perceived_urgency_tier: "MEDIUM",
        input_language: "en"
      },
      staff_operations_payload: {
        incident_classification: "TICKETING_CRISIS",
        estimated_density_band: "COMFORTABLE",
        hazards_or_anomalies_detected: ["Ticket barcode scanning failure / escort required."],
        manual_protocol_breached: true,
        exact_manual_clause_reference: "Ticketing Anomaly Section 4.3",
        immediate_operational_action_plan: [
          "Flag ticket barcode in registration server",
          "Escort visitor to the Fan Troubleshooting Booth near Gate A",
          "Notify ticketing supervisor"
        ],
        verbal_radio_briefing_script: "OpsCortex to Troubleshooting Booth: We have a ticket scanning anomaly at turnstile 12. Escorting spectator to your booth now. Barcode flagged. Over.",
        incident_coordinates: { x: -60, y: 12, z: -45 }
      },
      system_diagnostics: {
        grounded_in_context: true,
        confidence_score: 0.95
      },
      threejs_camera_matrix: {
        camera_position_vector: { x: -80, y: 15, z: -65 },
        look_at_vector: { x: -60, y: 5, z: -45 },
        ui_glow_color_hex: "#eab308",
        target_view_zone: "TROUBLESHOOTING_BOOTH"
      }
    }
  }
];

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
                // Hexagon shape
                ? "M 8 1.5 L 14 4.5 L 14 11.5 L 8 14.5 L 2 11.5 L 2 4.5 Z"
                // Orbital Square/Circle shape
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
                // Security cross lines
                ? "M 8 4.5 L 8 11.5 M 4.5 8 L 11.5 8"
                // Matrix processing core block: 5x5 rect
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

export default function App() {
  const [query, setQuery] = useState("");
  const [requestsInLast60s, setRequestsInLast60s] = useState(1);
  const [selectedImagePreset, setSelectedImagePreset] = useState<number | null>(null);
  const [customImage, setCustomImage] = useState<{ name: string; data: string; mimeType: string } | null>(null);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState("");
  const [activeTab, setActiveTab] = useState<"visuals" | "json">("visuals");
  const [isFullScreenViewport, setIsFullScreenViewport] = useState(false);
  const [currentView, setCurrentView] = useState<"DASHBOARD" | "COMMAND" | "CORPUS" | "PAYLOAD" | "LOGS" | "REGISTRY" | "CHAT">("DASHBOARD");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [copied, setCopied] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  // Spectator Registry states
  const [fanSearchQuery, setFanSearchQuery] = useState("");
  const [editingFan, setEditingFan] = useState<any>(null);
  const [deletingFan, setDeletingFan] = useState<any>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [editFanName, setEditFanName] = useState("");
  const [editFanPhone, setEditFanPhone] = useState("");
  const [editFanStadium, setEditFanStadium] = useState("");
  const [editFanSeatSection, setEditFanSeatSection] = useState("");
  const [editFanSeatRow, setEditFanSeatRow] = useState("");
  const [editFanSeatNumber, setEditFanSeatNumber] = useState("");
  const [isUpdatingFan, setIsUpdatingFan] = useState(false);

  // Wrapper to toggle viewport size and smoothly animate camera zoom closer
  const toggleViewportExpansion = () => {
    setIsFullScreenViewport(prev => {
      const next = !prev;
      if (activeAnchor === null) {
        if (next) {
          setCameraPos({ x: 0, y: 32, z: 65 });
        } else {
          setCameraPos({ x: 0, y: 50, z: 100 });
        }
        setLookAtPos({ x: 0, y: 0, z: 0 });
      }
      return next;
    });
  };

  // Collapsible incident logs history state
  const [incidentHistory, setIncidentHistory] = useState<IncidentLog[]>(PRELOADED_INCIDENTS);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeIncidentId, setActiveIncidentId] = useState<string | null>(null);

  // Time stamp state
  const [timeStr, setTimeStr] = useState("2026-07-08 14:40:00 UTC");
  
  // Battery simulation state representing stadium sensor network status
  const [devicePower, setDevicePower] = useState(98.4);

  // Matrix core status text (flashes between SECURED and SYNCHRONIZING when engine is busy)
  const [matrixCoreText, setMatrixCoreText] = useState("SECURED");

  // Weather telemetry state synchronized with 3D viewport
  const [currentWeather, setCurrentWeather] = useState<"SUNSHINE" | "RAIN" | "FOG" | "SNOW">("SUNSHINE");
  const [currentLocationName, setCurrentLocationName] = useState("East Rutherford, NJ");
  const [currentStadiumName, setCurrentStadiumName] = useState("MetLife Stadium");
  const [currentTemperature, setCurrentTemperature] = useState<number | undefined>(22);
  const [atmosphericInterference, setAtmosphericInterference] = useState("LOW (0.05)");

  // Stadium coordinate maps
  const [cameraPos, setCameraPos] = useState({ x: 0, y: 50, z: 100 });
  const [lookAtPos, setLookAtPos] = useState({ x: 0, y: 0, z: 0 });
  const [glowColor, setGlowColor] = useState("#22c55e");
  const [activeAnchor, setActiveAnchor] = useState<string | null>(null);

  // Core Intelligence Engine Output state
  const [engineResult, setEngineResult] = useState<any>(null);
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const [dispatchedAction, setDispatchedAction] = useState<{ action: string; timestamp: string } | null>(null);

  // Secure Multiplex Role-Based Access Control (RBAC) and accessibility preferences
  const [currentSessionRole, setCurrentSessionRole] = useState<"UNASSIGNED" | "FAN" | "ORGANIZER" | "VENUE_STAFF" | "VOLUNTEER">("UNASSIGNED");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [stepFreePreference, setStepFreePreference] = useState(false);
  const [fanSelectedStadiumId, setFanSelectedStadiumId] = useState("LOS_ANGELES");
  const [isFanViewportExpanded, setIsFanViewportExpanded] = useState(false);

  const [fanCameraPos, setFanCameraPos] = useState({ x: 0, y: 48, z: 75 });
  const [fanLookAtPos, setFanLookAtPos] = useState({ x: 0, y: 0, z: 0 });
  const [fanActiveAnchor, setFanActiveAnchor] = useState<string | null>(null);

  useEffect(() => {
    setFanCameraPos({ x: 0, y: 48, z: 75 });
    setFanLookAtPos({ x: 0, y: 0, z: 0 });
    setFanActiveAnchor(null);
  }, [fanSelectedStadiumId]);

  // Keep engineResult.ui_localized_dictionary up-to-date with selectedLanguage for all components
  useEffect(() => {
    if (engineResult) {
      const dict = LOCALIZED_DICTIONARIES[selectedLanguage] || LOCALIZED_DICTIONARIES['en'];
      if (engineResult.ui_localized_dictionary && engineResult.ui_localized_dictionary.dashboard_title !== dict.dashboard_title) {
        setEngineResult((prev: any) => {
          if (!prev) return prev;
          return {
            ...prev,
            ui_localized_dictionary: {
              ...prev.ui_localized_dictionary,
              ...dict
            }
          };
        });
      }
    }
  }, [selectedLanguage, engineResult]);

  // Secure Identity Login and Persistence States
  const [selectedLoginRole, setSelectedLoginRole] = useState<"FAN" | "VOLUNTEER" | "VENUE_STAFF" | "ORGANIZER" | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<{ name: string; role: string; details?: any } | null>(null);
  const [fanAccountsList, setFanAccountsList] = useState<any[]>([]);

  // Fan Login Form states
  const [fanInputName, setFanInputName] = useState("");
  const [fanInputStadium, setFanInputStadium] = useState("LOS_ANGELES");
  const [fanCountryCode, setFanCountryCode] = useState("+1");
  const [fanInputPhone, setFanInputPhone] = useState("");

  // Volunteer Login Form states
  const [volunteerInputName, setVolunteerInputName] = useState("");
  const [volunteerInputStadium, setVolunteerInputStadium] = useState("Arrowhead Stadium");
  const [volunteerInputNum, setVolunteerInputNum] = useState("");

  // Staff Login Form states
  const [staffInputName, setStaffInputName] = useState("");
  const [staffInputId, setStaffInputId] = useState("");

  // Organizer Login Form states
  const [organizerInputName, setOrganizerInputName] = useState("");
  const [organizerInputPass, setOrganizerInputPass] = useState("");
  const [organizerInputCode, setOrganizerInputCode] = useState("");

  // Login UI states
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [apiGlobalError, setApiGlobalError] = useState<string | null>(null);

  // SECURITY AUDIT DISCLAIMER:
  // All spectator data is stored locally in 'fan-accounts.json' for the sandbox/dev environment.
  // There is NO transmission, collection, or retention of real Personally Identifiable Information (PII).
  // All accounts and details entered here are for demonstration, testing, and simulation purposes only.
  const fetchFanAccounts = () => {
    fetch("/api/fans")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch fan accounts");
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Response is not JSON");
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setFanAccountsList(data);
        }
      })
      .catch((err) => {
        console.warn("Error loading fan accounts (expected during transient states):", err.message);
      });
  };

  useEffect(() => {
    fetchFanAccounts();
  }, []);

  useEffect(() => {
    const unsubscribe = apiGlobalErrorStore.subscribe((err) => {
      setApiGlobalError(err);
    });
    return unsubscribe;
  }, []);

  // Spectator Registry operations
  const [registryError, setRegistryError] = useState("");

  const handleStartEditFan = (fan: any) => {
    setEditingFan(fan);
    setRegistryError("");
    setEditFanName(fan.name || "");
    setEditFanPhone(fan.phoneNumber || "");
    setEditFanStadium(fan.selectedStadium || "NEW_YORK_NEW_JERSEY");
    if (fan.seat) {
      setEditFanSeatSection(fan.seat.section || "118");
      setEditFanSeatRow(fan.seat.row || "K");
      setEditFanSeatNumber(fan.seat.seat || "");
    } else {
      setEditFanSeatSection("");
      setEditFanSeatRow("");
      setEditFanSeatNumber("");
    }
  };

  const handleSaveEditFan = async () => {
    if (!editingFan) return;
    if (!editFanName.trim()) {
      setRegistryError("Full Name is required");
      return;
    }
    setIsUpdatingFan(true);
    setRegistryError("");
    try {
      const hasSeatDetails = editFanSeatSection.trim() || editFanSeatRow.trim() || editFanSeatNumber.trim();
      const seatPayload = hasSeatDetails ? {
        section: editFanSeatSection.trim() || "118",
        row: editFanSeatRow.trim() || "K",
        seat: editFanSeatNumber.trim() || "1"
      } : null;

      const res = await fetch(`/api/fans/${editingFan.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editFanName,
          phoneNumber: editFanPhone,
          selectedStadium: editFanStadium,
          seat: seatPayload
        })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update fan account");
      }
      setEditingFan(null);
      fetchFanAccounts();
    } catch (err: any) {
      setRegistryError(err.message || "Failed to save edits");
    } finally {
      setIsUpdatingFan(false);
    }
  };

  const handleConfirmDeleteFan = async () => {
    if (!deletingFan) return;
    setIsUpdatingFan(true);
    setRegistryError("");
    try {
      const res = await fetch(`/api/fans/${deletingFan.id}`, {
        method: "DELETE"
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to delete fan account");
      }
      setDeletingFan(null);
      fetchFanAccounts();
    } catch (err: any) {
      setRegistryError(err.message || "Failed to delete account");
    } finally {
      setIsUpdatingFan(false);
    }
  };

  const handleClearAllFans = async () => {
    setIsUpdatingFan(true);
    setRegistryError("");
    try {
      const res = await fetch("/api/fans/clear", {
        method: "POST"
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to clear database");
      }
      setShowClearConfirm(false);
      fetchFanAccounts();
    } catch (err: any) {
      setRegistryError(err.message || "Failed to clear database");
    } finally {
      setIsUpdatingFan(false);
    }
  };

  const [isFloorHeatmapEnabled, setIsFloorHeatmapEnabled] = useState(true);
  const [gateCongestions, setGateCongestions] = useState({
    "Gate A [Verizon]": 30,
    "Gate B [HCLTech]": 85,
    "Gate C [MetLife]": 55,
    "Gate D [Welch's]": 20,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setGateCongestions((_prev) => {
        const time = Date.now() / 1000;
        return {
          "Gate A [Verizon]": Math.max(10, Math.min(100, Math.round(30 + Math.sin(time * 1.5 + 0) * 12))),
          "Gate B [HCLTech]": Math.max(10, Math.min(100, Math.round(85 + Math.sin(time * 1.5 + 2.5) * 10))),
          "Gate C [MetLife]": Math.max(10, Math.min(100, Math.round(55 + Math.sin(time * 1.5 + 5.0) * 15))),
          "Gate D [Welch's]": Math.max(10, Math.min(100, Math.round(20 + Math.sin(time * 1.5 + 7.5) * 8))),
        };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fan portal navigation states
  const [fanActiveTab, setFanActiveTab] = useState<"food" | "navigation" | "help" | "seat" | "matches" | "rules" | "chat">("navigation");

  // AI Chatbot States
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "model"; text: string }>>([
    { role: "model", text: "👋 Hello! I am the FIFA World Cup 2026™ Venue Compliance Assistant, powered by Gemini. I can assist you with clear bag policies, ticketing scans, ADA bathroom locations, and other stadium regulations. How can I help you today?" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);

  const sendChatMessage = async (msgText: string) => {
    const textToSend = msgText.trim();
    if (!textToSend || isChatLoading) return;

    // Local heuristic language detection for instant UI response context
    const detectMessageLanguageLocal = (message: string): string => {
      const norm = message.toLowerCase();
      if (["hola", "buenos dias", "buenas tardes", "bolsa", "mochila", "boleto", "entrada", "estadio", "baño", "ascensor", "partido", "juego", "por favor", "ayuda", "regla", "seguridad"].some(term => norm.includes(term))) {
        return "es";
      }
      if (["bonjour", "salut", "sac", "sac à dos", "billet", "stade", "toilettes", "ascenseur", "match", "s'il vous plaît", "aide", "règle", "sécurité"].some(term => norm.includes(term))) {
        return "fr";
      }
      if (["hallo", "guten tag", "tasche", "rucksack", "ticket", "stadion", "toilette", "aufzug", "spiel", "bitte", "hilfe", "regel", "sicherheit"].some(term => norm.includes(term))) {
        return "de";
      }
      if (["こんにちは", "バッグ", "リュック", "チケット", "スタジアム", "トイレ", "エレベーター", "試合", "おねがい", "助け", "ルール", "セキュリティ"].some(term => norm.includes(term))) {
        return "ja";
      }
      if (["مرحبا", "سلام", "حقيبة", "تذكرة", "استاد", "مرحاض", "مصعد", "مباراة", "من فضلك", "مساعدة", "قاعدة", "أمان"].some(term => norm.includes(term))) {
        return "ar";
      }
      if (["olá", "bom dia", "bolsa", "mochila", "ingresso", "estádio", "banheiro", "elevador", "jogo", "por favor", "ajuda", "regra", "segurança"].some(term => norm.includes(term))) {
        return "pt";
      }
      if (["ciao", "buongiorno", "borsa", "zaino", "biglietto", "stadio", "bagno", "ascensore", "partita", "per favore", "aiuto", "regola", "sicurezza"].some(term => norm.includes(term))) {
        return "it";
      }
      if (["안녕하세요", "가방", "배낭", "티켓", "경기장", "화장실", "엘리베이터", "경기", "부탁", "도움", "규칙", "보안"].some(term => norm.includes(term))) {
        return "ko";
      }
      if (["你好", "早上好", "包", "背包", "票", "体育场", "厕所", "洗手间", "电梯", "比赛", "请", "帮助", "规则", "安全"].some(term => norm.includes(term))) {
        return "zh";
      }
      if (["hallo", "tas", "rugzak", "ticket", "stadion", "toilet", "lift", "wedstrijd", "alsjeblieft", "hulp", "regel", "veiligheid"].some(term => norm.includes(term))) {
        return "nl";
      }
      if (["नमस्ते", "बैग", "टिकट", "स्टेडियम", "शौचालय", "लिफ्ट", "मैच", "कृपया", "मदद", "नियम", "सुरक्षा"].some(term => norm.includes(term))) {
        return "hi";
      }
      return "en";
    };

    const localLang = detectMessageLanguageLocal(textToSend);
    if (localLang !== "en") {
      setSelectedLanguage(localLang);
    }

    // Append user message immediately
    const updatedMessages = [...chatMessages, { role: "user" as const, text: textToSend }];
    setChatMessages(updatedMessages);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const data = await fetchGeminiApi<{ detectedLanguage?: string; text: string }>("/api/chat", {
        message: textToSend,
        history: chatMessages,
        identity: currentSessionRole
      });

      if (data.detectedLanguage) {
        setSelectedLanguage(data.detectedLanguage);
      }
      setChatMessages([...updatedMessages, { role: "model" as const, text: data.text || "No response received." }]);
    } catch (err: any) {
      console.error("Chat error:", err);
      setChatMessages([...updatedMessages, { role: "model" as const, text: `⚠️ Connection error: ${err.message || "Failed to connect to the Monterrey Security Firewall."}` }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Food and concessions state
  const [foodCart, setFoodCart] = useState<{ id: string; name: string; price: number; qty: number; options?: string }[]>([]);
  const [activeOrder, setActiveOrder] = useState<{ orderNo: string; items: any[]; total: number; secondsLeft: number; status: "PREPARING" | "READY" } | null>(null);

  // Staff help state
  const [helpCategory, setHelpCategory] = useState("FACILITY_ISSUE");
  const [helpLocation, setHelpLocation] = useState("Section 118, Row G, Seat 14");
  const [helpDescription, setHelpDescription] = useState("");
  const [helpAdaRequired, setHelpAdaRequired] = useState(false);
  const [helpTicketSubmitted, setHelpTicketSubmitted] = useState(false);

  // Staff help status updates tracking
  const [helpIconPulseActive, setHelpIconPulseActive] = useState(false);
  const [prevIncidentCount, setPrevIncidentCount] = useState<number | null>(null);

  // Edit My Seat state
  const [currentSeat, setCurrentSeat] = useState<{ section: string; row: string; seat: string } | null>(null);
  const [selectedNewSeat, setSelectedNewSeat] = useState<{ section: string; row: string; seat: string } | null>(null);
  const [isChangingSeat, setIsChangingSeat] = useState(false);
  const [seatChangeSuccess, setSeatChangeSuccess] = useState(false);
  const [seatSelectionError, setSeatSelectionError] = useState<string | null>(null);
  const seatMatrixRef = useRef<HTMLDivElement>(null);
  const [trailPath, setTrailPath] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);

  // Match details search & filter
  const TOURNAMENT_MATCHES = [
    { id: "m-1", matchNumber: "MATCH 104", stage: "GRAND FINAL", status: "UPCOMING", dateTime: "JULY 19, 2026 • 15:00 EST", date: "2026-07-19", team1: "ARGENTINA", team1Flag: "🇦🇷", team2: "FRANCE", team2Flag: "🇫🇷", score: "VS", venue: "MetLife Stadium", city: "New York/New Jersey", capacity: "82,500", crowdDensity: "EXPECTED: 100%" },
    { id: "m-2", matchNumber: "MATCH 101", stage: "SEMIFINAL 1", status: "UPCOMING", dateTime: "JULY 14, 2026 • 20:00 PST", date: "2026-07-14", team1: "USA", team1Flag: "🇺🇸", team2: "BRAZIL", team2Flag: "🇧🇷", score: "VS", venue: "AT&T Stadium", city: "Dallas", capacity: "92,967", crowdDensity: "EXPECTED: 100%" },
    { id: "m-3", matchNumber: "MATCH 102", stage: "SEMIFINAL 2", status: "UPCOMING", dateTime: "JULY 15, 2026 • 20:00 EST", date: "2026-07-15", team1: "ARGENTINA", team1Flag: "🇦🇷", team2: "ENGLAND", team2Flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", score: "VS", venue: "Mercedes-Benz Stadium", city: "Atlanta", capacity: "71,000", crowdDensity: "TICKETS SOLD: 98.2%" },
    { id: "m-4", matchNumber: "MATCH 98", stage: "QUARTERFINAL", status: "LIVE", dateTime: "JULY 10, 2026 • 18:00 PST", date: "2026-07-10", team1: "USA", team1Flag: "🇺🇸", team2: "GERMANY", team2Flag: "🇩🇪", score: "2 - 1", timeRemaining: "72' LIVE", venue: "SoFi Stadium", city: "Los Angeles", capacity: "70,240", crowdDensity: "CURRENT OCCUPANCY: 98.4%" },
    { id: "m-5", matchNumber: "MATCH 99", stage: "QUARTERFINAL", status: "UPCOMING", dateTime: "JULY 11, 2026 • 15:00 CST", date: "2026-07-11", team1: "ENGLAND", team1Flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", team2: "SPAIN", team2Flag: "🇪🇸", score: "VS", venue: "Arrowhead Stadium", city: "Kansas City", capacity: "76,416", crowdDensity: "TICKETS SOLD: 100%" },
    { id: "m-6", matchNumber: "MATCH 100", stage: "QUARTERFINAL", status: "UPCOMING", dateTime: "JULY 12, 2026 • 18:00 EST", date: "2026-07-12", team1: "FRANCE", team1Flag: "🇫🇷", team2: "URUGUAY", team2Flag: "🇺🇾", score: "VS", venue: "Hard Rock Stadium", city: "Miami", capacity: "65,326", crowdDensity: "TICKETS SOLD: 99.5%" },
    { id: "m-7", matchNumber: "MATCH 92", stage: "ROUND OF 16", status: "COMPLETED", dateTime: "JULY 5, 2026", date: "2026-07-05", team1: "MEXICO", team1Flag: "🇲🇽", team2: "COLOMBIA", team2Flag: "🇨🇴", score: "2 - 0", venue: "Estadio Azteca", city: "Mexico City", capacity: "87,523", crowdDensity: "FINAL ATTENDANCE: 87,523" },
    { id: "m-8", matchNumber: "MATCH 96", stage: "ROUND OF 16", status: "COMPLETED", dateTime: "JULY 7, 2026", date: "2026-07-07", team1: "CANADA", team1Flag: "🇨🇦", team2: "PORTUGAL", team2Flag: "🇵🇹", score: "2 - 3", venue: "BC Place", city: "Vancouver", capacity: "54,500", crowdDensity: "FINAL ATTENDANCE: 54,102" },
    { id: "m-9", matchNumber: "MATCH 76", stage: "ROUND OF 32", status: "COMPLETED", dateTime: "JULY 2, 2026", date: "2026-07-02", team1: "CANADA", team1Flag: "🇨🇦", team2: "ITALY", team2Flag: "🇮🇹", score: "1 - 0", venue: "BMO Field", city: "Toronto", capacity: "45,000", crowdDensity: "FINAL ATTENDANCE: 44,891" },
    { id: "m-10", matchNumber: "MATCH 48", stage: "GROUP STAGE", status: "COMPLETED", dateTime: "JUNE 26, 2026", date: "2026-06-26", team1: "MEXICO", team1Flag: "🇲🇽", team2: "BELGIUM", team2Flag: "🇧🇪", score: "1 - 1", venue: "Estadio Akron", city: "Guadalajara", capacity: "48,071", crowdDensity: "FINAL ATTENDANCE: 47,902" },
    { id: "m-11", matchNumber: "MATCH 84", stage: "ROUND OF 32", status: "COMPLETED", dateTime: "JULY 3, 2026", date: "2026-07-03", team1: "NETHERLANDS", team1Flag: "🇳🇱", team2: "URUGUAY", team2Flag: "🇺🇾", score: "1 - 2", venue: "Estadio BBVA", city: "Monterrey", capacity: "53,500", crowdDensity: "FINAL ATTENDANCE: 52,810" },
    { id: "m-12", matchNumber: "MATCH 89", stage: "ROUND OF 16", status: "COMPLETED", dateTime: "JULY 4, 2026", date: "2026-07-04", team1: "FRANCE", team1Flag: "🇫🇷", team2: "MOROCCO", team2Flag: "🇲🇦", score: "2 - 0", venue: "Lincoln Financial Field", city: "Philadelphia", capacity: "69,796", crowdDensity: "FINAL ATTENDANCE: 69,112" }
  ];

  const [matchSearch, setMatchSearch] = useState("");
  const [matchFilterStatus, setMatchFilterStatus] = useState<"ALL" | "LIVE" | "UPCOMING" | "COMPLETED">("ALL");
  const [matchFilterDateMode, setMatchFilterDateMode] = useState<"ALL" | "SINGLE" | "RANGE">("ALL");
  const [matchSelectedDate, setMatchSelectedDate] = useState<string>("");
  const [matchStartDate, setMatchStartDate] = useState<string>("");
  const [matchEndDate, setMatchEndDate] = useState<string>("");

  // Stadium rules page states
  const [rulesSearch, setRulesSearch] = useState("");
  const [rulesActiveFilter, setRulesActiveFilter] = useState<string>("ALL");
  const [rulesExpandedId, setRulesExpandedId] = useState<string | null>(null);
  const [selectedSimulatorIdx, setSelectedSimulatorIdx] = useState<number | null>(null);

  // Export menu toggle state and downloading actions
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  const fetchIncidents = () => {
    fetch("/api/incidents")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch incidents");
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Response is not JSON");
        }
        return res.json();
      })
      .then((data) => {
        setIncidentHistory(data);
      })
      .catch((err) => {
        console.warn("Could not sync incidents (expected during transient states):", err.message);
      });
  };

  useEffect(() => {
    let active = true;
    const fetchTimer = setTimeout(() => {
      if (active) {
        setIsInitialLoading(false);
      }
    }, 1800); // 1.8 seconds of premium high-fidelity calibration aesthetic

    fetchIncidents();
    const interval = setInterval(fetchIncidents, 5000);
    return () => {
      active = false;
      clearTimeout(fetchTimer);
      clearInterval(interval);
    };
  }, []);

  // Trigger pulse animation on Staff Help icon when a new incident/ticket is pushed to the system
  useEffect(() => {
    if (incidentHistory && incidentHistory.length > 0) {
      if (prevIncidentCount !== null && incidentHistory.length > prevIncidentCount) {
        setHelpIconPulseActive(true);
      }
      setPrevIncidentCount(incidentHistory.length);
    }
  }, [incidentHistory, prevIncidentCount]);

  // Dynamically calculate center-to-center coordinates between original/current seat and selected new seat
  useEffect(() => {
    if (fanActiveTab !== "seat" || !seatMatrixRef.current) return;
    
    // Use a small timeout to let the DOM settle/render if the tab was just opened
    const timer = setTimeout(() => {
      if (!seatMatrixRef.current) return;
      
      if (!currentSeat) {
        setTrailPath(null);
        return;
      }
      
      const currentBtn = seatMatrixRef.current.querySelector(
        `[data-seat-id="seat-${currentSeat.row}-${currentSeat.seat}"]`
      );
      
      const targetSeatObj = selectedNewSeat || currentSeat;
      if (!targetSeatObj) {
        setTrailPath(null);
        return;
      }
      const targetBtn = seatMatrixRef.current.querySelector(
        `[data-seat-id="seat-${targetSeatObj.row}-${targetSeatObj.seat}"]`
      );
      
      if (currentBtn && targetBtn) {
        const containerRect = seatMatrixRef.current.getBoundingClientRect();
        const currentRect = currentBtn.getBoundingClientRect();
        const targetRect = targetBtn.getBoundingClientRect();
        
        const x1 = currentRect.left - containerRect.left + currentRect.width / 2;
        const y1 = currentRect.top - containerRect.top + currentRect.height / 2;
        const x2 = targetRect.left - containerRect.left + targetRect.width / 2;
        const y2 = targetRect.top - containerRect.top + targetRect.height / 2;
        
        setTrailPath({ x1, y1, x2, y2 });
      } else {
        setTrailPath(null);
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [currentSeat, selectedNewSeat, fanActiveTab]);

  // Food Order Preparation Countdown timer
  useEffect(() => {
    if (!activeOrder || activeOrder.status === "READY") return;
    const orderInterval = setInterval(() => {
      setActiveOrder((prev) => {
        if (!prev) return null;
        if (prev.secondsLeft <= 1) {
          return { ...prev, secondsLeft: 0, status: "READY" };
        }
        return { ...prev, secondsLeft: prev.secondsLeft - 1 };
      });
    }, 1000);
    return () => clearInterval(orderInterval);
  }, [activeOrder]);

  const exportTelemetryAsJSON = () => {
    if (!engineResult) return;
    const jsonString = JSON.stringify(engineResult, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `incident_telemetry_report_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportTelemetryAsCSV = () => {
    if (!engineResult) return;
    const headers = [
      "Timestamp",
      "Query",
      "Urgency Tier",
      "Confidence Score",
      "Input Language",
      "Firewall Action",
      "Malicious Injection Detected",
      "Rate Limit Breached",
      "Detected Persona",
      "Incident Classification",
      "Incident Coordinates",
      "Estimated Density Band",
      "Active Stadium ID",
      "Grounded In Context"
    ];

    const fields = [
      new Date().toISOString(),
      `"${(engineResult.query || "").replace(/"/g, '""')}"`,
      `"${engineResult.routing_metadata?.perceived_urgency_tier || "LOW"}"`,
      engineResult.system_diagnostics?.confidence_score || 1.0,
      `"${engineResult.routing_metadata?.input_language || "en"}"`,
      `"${engineResult.security_firewall_status?.firewall_action_taken || "PASS"}"`,
      engineResult.security_firewall_status?.malicious_injection_detected ? "TRUE" : "FALSE",
      engineResult.security_firewall_status?.rate_limit_breached ? "TRUE" : "FALSE",
      `"${engineResult.routing_metadata?.detected_persona || "UNKNOWN"}"`,
      `"${engineResult.staff_operations_payload?.incident_classification || "NONE"}"`,
      `"${engineResult.staff_operations_payload?.incident_coordinates || "N/A"}"`,
      `"${engineResult.staff_operations_payload?.estimated_density_band || "COMFORTABLE"}"`,
      `"${engineResult.venue_structural_profile?.active_stadium_id || "N/A"}"`,
      engineResult.system_diagnostics?.grounded_in_context ? "TRUE" : "FALSE"
    ];

    const csvContent = [headers.join(","), fields.join(",")].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `incident_telemetry_report_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Density history timeline state for Recharts visualization
  const [densityHistory, setDensityHistory] = useState<Array<{ time: string; value: number; bandName: string }>>([
    { time: "14:15", value: 1, bandName: "SPARSE" },
    { time: "14:20", value: 2, bandName: "COMFORTABLE" },
    { time: "14:25", value: 2, bandName: "COMFORTABLE" },
    { time: "14:30", value: 3, bandName: "PACKED" },
    { time: "14:35", value: 2, bandName: "COMFORTABLE" },
  ]);

  // Synthesize a high-tech chime for successful quick dispatch actions
  const playDispatchSuccessSound = () => {
    if (isSoundMuted) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc1.type = "sine";
      osc2.type = "sine";
      
      osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc2.frequency.setValueAtTime(880, ctx.currentTime); // A5 (sweet fifth interval chime)
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      
      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.35);
      osc2.stop(ctx.currentTime + 0.35);
    } catch (e) {
      console.warn("Chime failed", e);
    }
  };

  // Synthesize a blaring tactical alarm signal that rings for 5 seconds
  const playLowFrequencyAlertSound = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      
      const ctx = new AudioContextClass();
      
      // Dual oscillators for a rich, industrial-grade detuned alarm siren
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gainNode = ctx.createGain();
      
      osc1.type = "sawtooth";
      osc2.type = "sine";
      
      // Detuned siren frequencies around 600Hz-800Hz for high urgency
      osc1.frequency.setValueAtTime(650, ctx.currentTime);
      osc2.frequency.setValueAtTime(654, ctx.currentTime);
      
      // Modulate the siren whoop/warble continuously over 5.0 seconds
      const alarmDuration = 5.0;
      const pulseInterval = 0.4; // rapid warble/siren sweep
      for (let timeOffset = 0; timeOffset < alarmDuration; timeOffset += pulseInterval) {
        osc1.frequency.exponentialRampToValueAtTime(850, ctx.currentTime + timeOffset + pulseInterval / 2);
        osc1.frequency.exponentialRampToValueAtTime(550, ctx.currentTime + timeOffset + pulseInterval);
        
        osc2.frequency.exponentialRampToValueAtTime(854, ctx.currentTime + timeOffset + pulseInterval / 2);
        osc2.frequency.exponentialRampToValueAtTime(554, ctx.currentTime + timeOffset + pulseInterval);
      }
      
      // Peaking filter to enhance the piercing mid-high frequencies of the alarm
      filter.type = "peaking";
      filter.frequency.setValueAtTime(750, ctx.currentTime);
      filter.Q.setValueAtTime(1.5, ctx.currentTime);
      
      // Pulsing amplitude envelope for a blaring repetition effect
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      const volumePulseDuration = 1.0; // 1 second pulse cycle (on/off)
      for (let t = 0; t < alarmDuration; t += volumePulseDuration) {
        // Fast attack
        gainNode.gain.linearRampToValueAtTime(0.25, ctx.currentTime + t + 0.15);
        // High volume hold
        gainNode.gain.setValueAtTime(0.25, ctx.currentTime + t + 0.65);
        // Fast decay
        gainNode.gain.linearRampToValueAtTime(0.005, ctx.currentTime + t + 0.95);
      }
      // Force absolute silence right before termination
      gainNode.gain.setValueAtTime(0, ctx.currentTime + alarmDuration);
      
      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc1.start();
      osc2.start();
      
      osc1.stop(ctx.currentTime + alarmDuration);
      osc2.stop(ctx.currentTime + alarmDuration);
    } catch (err) {
      console.warn("Operational audio alarm generation failed", err);
    }
  };

  useEffect(() => {
    // Ticking UTC clock simulation
    const interval = setInterval(() => {
      const now = new Date();
      setTimeStr(now.toUTCString().replace("GMT", "UTC"));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrollDir = () => {
      const scrollY = window.scrollY;

      // Avoid trigger on very small scrolls or bounce effects
      if (Math.abs(scrollY - lastScrollY) < 10) {
        ticking = false;
        return;
      }

      if (scrollY > lastScrollY && scrollY > 80) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }

      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDir);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    // Battery micro simulation loop
    const batteryInterval = setInterval(() => {
      setDevicePower((prev) => {
        if (currentWeather === "SUNSHINE") {
          // Solar energy charging the battery
          if (prev >= 100) return 100;
          return parseFloat((prev + 0.08).toFixed(2));
        } else {
          // Weather causes some drainage
          const drain = currentWeather === "SNOW" ? 0.05 : currentWeather === "RAIN" ? 0.03 : 0.02;
          if (prev <= 12) return 12; // safety backup reserves
          return parseFloat((prev - drain).toFixed(2));
        }
      });
    }, 4000);
    return () => clearInterval(batteryInterval);
  }, [currentWeather]);

  // Handle matrix core status text flashing when the Engine is busy processing a query
  useEffect(() => {
    if (!isAnalyzing) {
      setMatrixCoreText("SECURED");
      return;
    }
    const interval = setInterval(() => {
      setMatrixCoreText((prev) => (prev === "SECURED" ? "SYNCHRONIZING" : "SECURED"));
    }, 800);
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  // Sync selected stadium changes with query analysis to reload live data
  useEffect(() => {
    if (currentSessionRole !== "UNASSIGNED") {
      let activeQuery = query;
      if (!activeQuery.trim()) {
        if (currentSessionRole === "FAN") {
          activeQuery = "Where is Section 118 elevator? I need accessible directions.";
        } else if (currentSessionRole === "ORGANIZER") {
          activeQuery = "Review current stadium concourse occupancy and high crowd density alarms";
        } else if (currentSessionRole === "VENUE_STAFF") {
          activeQuery = "Monitor and report active operations for current stadium concourse zones";
        } else if (currentSessionRole === "VOLUNTEER") {
          activeQuery = "Report current volunteer task dispatch status and queue wait times";
        }
      }
      triggerQueryAnalysis(activeQuery, currentSessionRole, stepFreePreference);
    }
  }, [fanSelectedStadiumId]);

  // Global keyboard shortcuts for staff dispatch quick actions
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if an incident classification is active
      const hasActiveIncident = engineResult?.staff_operations_payload?.incident_classification &&
        engineResult.staff_operations_payload.incident_classification !== "NONE";
      
      if (!hasActiveIncident) return;

      const isModKey = e.ctrlKey || e.metaKey; // Windows/Linux Ctrl or macOS Cmd

      if (isModKey) {
        const key = e.key.toLowerCase();
        if (key === "s") {
          e.preventDefault();
          setDispatchedAction({
            action: "Dispatch Security Detail",
            timestamp: new Date().toLocaleTimeString()
          });
          playDispatchSuccessSound();
        } else if (key === "m") {
          e.preventDefault();
          setDispatchedAction({
            action: "Medical Alert Broadcast",
            timestamp: new Date().toLocaleTimeString()
          });
          playDispatchSuccessSound();
        } else if (key === "q" || key === "r") {
          e.preventDefault();
          setDispatchedAction({
            action: "Queue Re-Route Command",
            timestamp: new Date().toLocaleTimeString()
          });
          playDispatchSuccessSound();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [engineResult, isSoundMuted]);

  const handleSelectPresetQuery = (presetQuery: string) => {
    setQuery(presetQuery);
    setSelectedImagePreset(null);
  };

  const handleRestoreIncident = (incident: IncidentLog) => {
    setActiveIncidentId(incident.id);
    setQuery(incident.query);
    setEngineResult(incident.fullPayload);
    setActiveTab("visuals");
    setDispatchedAction(null);

    if (incident.cameraPos) {
      setCameraPos({ ...incident.cameraPos });
    }
    if (incident.lookAtPos) {
      setLookAtPos({ ...incident.lookAtPos });
    }
    if (incident.glowColor) {
      setGlowColor(incident.glowColor);
    }
    setActiveAnchor(incident.activeAnchor);
    
    // Play a sweet tactical alert success chime
    playDispatchSuccessSound();
  };

  const handleResolveIncident = (id: string) => {
    // Optimistic UI update
    setIncidentHistory(prev =>
      prev.map(incident =>
        incident.id === id ? { ...incident, resolved: true, status: "archived" } : incident
      )
    );
    
    // Server-side persistent update
    fetch(`/api/incidents/${id}/resolve`, {
      method: "PUT",
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to resolve incident on server");
        return res.json();
      })
      .then(updatedIncident => {
        // Sync with exact server response
        setIncidentHistory(prev =>
          prev.map(incident => (incident.id === id ? { ...incident, ...updatedIncident } : incident))
        );
        playDispatchSuccessSound();
      })
      .catch(err => {
        console.error("Failed to resolve incident:", err);
      });
  };

  const handleClearIncident = (id: string) => {
    // Optimistic UI update
    setIncidentHistory(prev => prev.filter(incident => incident.id !== id));
    if (activeIncidentId === id) {
      setActiveIncidentId(null);
    }

    // Server-side deletion
    fetch(`/api/incidents/${id}`, {
      method: "DELETE",
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to delete incident on server");
      })
      .catch(err => {
        console.error("Failed to clear incident:", err);
      });
  };

  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCustomImage({
          name: file.name,
          data: event.target.result as string,
          mimeType: file.type
        });
        setSelectedImagePreset(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setCustomImage(null);
    setSelectedImagePreset(null);
  };

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    if (currentSessionRole !== "UNASSIGNED") {
      triggerQueryAnalysis(undefined, undefined, undefined, lang);
    }
  };

  const handleSelectRole = (role: "FAN" | "ORGANIZER" | "VENUE_STAFF" | "VOLUNTEER") => {
    setCurrentSessionRole(role);
    let initialQuery = "";
    if (role === "FAN") {
      initialQuery = "Where is Section 118 elevator? I need accessible directions.";
      setFanSelectedStadiumId("LOS_ANGELES");
    }
    else if (role === "VOLUNTEER") initialQuery = "Gate B queue congestion update and field report";
    else if (role === "VENUE_STAFF") initialQuery = "Audit ticket scan failed error codes at turnstiles";
    else if (role === "ORGANIZER") initialQuery = "Review current stadium concourse occupancy and high crowd density alarms";
    
    setQuery(initialQuery);
    triggerQueryAnalysis(initialQuery, role, undefined, selectedLanguage);
  };

  const triggerQueryAnalysis = async (overrideQuery?: string, overrideRole?: string, overrideStepFree?: boolean, overrideLanguage?: string) => {
    const activeQuery = overrideQuery !== undefined ? overrideQuery : query;
    const activeRole = overrideRole !== undefined ? overrideRole : currentSessionRole;
    const activeStepFree = overrideStepFree !== undefined ? overrideStepFree : stepFreePreference;
    const activeLanguage = overrideLanguage !== undefined ? overrideLanguage : selectedLanguage;

    if (!activeQuery.trim()) return;

    setIsAnalyzing(true);
    setEngineResult(null);
    setDispatchedAction(null);

    // Dynamic visualization step sequence for high-fidelity tactical effect
    const steps = [
      "ESTABLISHING SECURE CONNECTION TO CORE...",
      "AUDITING SECURITY FIREWALL KERNEL...",
      "EVALUATING PERSONALIZATION FILTER...",
      "INSPECTING PROMPT-INJECTION PATTERNS...",
      "CALCULATING TELEMETRY RATE LIMIT RATE...",
      "GROUNDING DATA AGAINST CORPUS RULES...",
      "DECODING 3D TWIN COORDINATE TRANSLATION..."
    ];

    for (let i = 0; i < steps.length; i++) {
      setAnalysisStep(steps[i]);
      await new Promise((res) => setTimeout(res, 350));
    }

    try {
      // Assemble request payload
      let finalImage = null;
      if (selectedImagePreset !== null) {
        finalImage = {
          data: PRESET_IMAGES[selectedImagePreset].data,
          mimeType: PRESET_IMAGES[selectedImagePreset].mimeType
        };
      } else if (customImage) {
        finalImage = {
          data: customImage.data,
          mimeType: customImage.mimeType
        };
      }

      const rawData = await fetchGeminiApi<any>("/api/query", {
        query: activeQuery,
        Requests_In_Last_60s: requestsInLast60s,
        image: finalImage,
        "Atmospheric Interference": atmosphericInterference,
        current_session_role: activeRole,
        step_free_preference: activeStepFree,
        active_stadium_id: fanSelectedStadiumId,
        target_translation_language: activeLanguage
      });
      
      // Adapt / Normalize response to maintain both 100% legacy UI compatibility AND full 16-venue transition integration
      const isStaffStream = rawData.staff_and_volunteer_payload?.is_field_incident_report || 
                            rawData.operational_intelligence_payload?.detected_persona === "STAFF_STREAM" || 
                            rawData.routing_metadata?.detected_persona === "STAFF_STREAM";
      
      const resolvedIncidentType = rawData.staff_and_volunteer_payload?.reported_incident_category || 
                                   (rawData.operational_intelligence_payload?.resolved_action_directives?.some((d: string) => d.toLowerCase().includes("medic") || d.toLowerCase().includes("injury")) ? "MEDICAL_EMERGENCY" :
                                   rawData.operational_intelligence_payload?.resolved_action_directives?.some((d: string) => d.toLowerCase().includes("ticket") || d.toLowerCase().includes("anomaly")) ? "TICKETING_CRISIS" :
                                   rawData.operational_intelligence_payload?.resolved_action_directives?.some((d: string) => d.toLowerCase().includes("bag") || d.toLowerCase().includes("backpack")) ? "COMPLIANCE_VIOLATION" :
                                   rawData.operational_intelligence_payload?.resolved_action_directives?.some((d: string) => d.toLowerCase().includes("crowd") || d.toLowerCase().includes("full") || d.toLowerCase().includes("density")) ? "CROWD_DENSITY_ALERT" : "NONE");
                                   
      const defaultIncidentCoords = rawData.threejs_camera_matrix?.camera_position_vector 
        ? {
            x: rawData.threejs_camera_matrix.camera_position_vector.x / 5,
            y: 12,
            z: rawData.threejs_camera_matrix.camera_position_vector.z / 1.5
          } 
        : { x: 55, y: 12, z: 55 };

       const data = {
        ...rawData,
        stadium_quadrant_occupancy: rawData.stadium_quadrant_occupancy || rawData.administrative_ops_payload?.stadium_quadrant_occupancy || null,
        gate_analytics_table: rawData.gate_analytics_table || rawData.administrative_ops_payload?.gate_analytics_table || [],
        routing_metadata: {
          detected_persona: isStaffStream ? "STAFF_STREAM" : "FAN_STREAM",
          input_language: rawData.routing_metadata?.input_language || "en",
          perceived_urgency_tier: rawData.staff_and_volunteer_payload?.perceived_urgency_tier || rawData.routing_metadata?.perceived_urgency_tier || (isStaffStream ? "HIGH" : "LOW")
        },
        system_diagnostics: {
          grounded_in_context: rawData.system_diagnostics?.grounded_in_context ?? true,
          confidence_score: rawData.system_diagnostics?.efficiency_score_estimate || rawData.system_diagnostics?.confidence_score || 0.98
        },
        fan_experience_payload: rawData.fan_experience_payload || {
          user_intent_type: null,
          navigation_directions_native_language: rawData.operational_intelligence_payload?.radio_or_tts_broadcast_script || "Operational scan nominal.",
          navigation_directions_english_fallback: rawData.operational_intelligence_payload?.radio_or_tts_broadcast_script || "Operational scan nominal.",
          concession_readout: {
            selected_stand_name: null,
            estimated_pickup_wait_minutes: null,
            available_menu_items: []
          }
        },
        staff_operations_payload: rawData.staff_operations_payload || {
          incident_classification: resolvedIncidentType,
          estimated_density_band: (resolvedIncidentType === "CROWD_DENSITY_ALERT" ? "PACKED" : "COMFORTABLE"),
          hazards_or_anomalies_detected: rawData.operational_intelligence_payload?.resolved_action_directives || [],
          manual_protocol_breached: !!rawData.operational_intelligence_payload?.resolved_action_directives?.length,
          exact_manual_clause_reference: "Sec 3.1 World Cup Venue Rule",
          immediate_operational_action_plan: rawData.staff_and_volunteer_payload?.supervisor_dispatch_plan || rawData.operational_intelligence_payload?.resolved_action_directives || [],
          verbal_radio_briefing_script: rawData.staff_and_volunteer_payload?.verbal_radio_briefing_script || rawData.operational_intelligence_payload?.radio_or_tts_broadcast_script || null,
          incident_coordinates: defaultIncidentCoords
        }
      };

      setEngineResult(data);

      // Save to density history if available in staff payload
      const densityBand = data.staff_operations_payload?.estimated_density_band;
      if (isStaffStream && densityBand) {
        let numericVal = 1;
        if (densityBand === "CRUSH_RISK") numericVal = 4;
        else if (densityBand === "PACKED") numericVal = 3;
        else if (densityBand === "COMFORTABLE") numericVal = 2;
        else if (densityBand === "SPARSE") numericVal = 1;

        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        setDensityHistory(prev => {
          // If the last entry has the same time and value, let's avoid redundant duplicates
          if (prev.length > 0 && prev[prev.length - 1].time === timeString) {
            const updated = [...prev];
            updated[updated.length - 1] = { time: timeString, value: numericVal, bandName: densityBand };
            return updated;
          }
          const updated = [...prev, { time: timeString, value: numericVal, bandName: densityBand }];
          if (updated.length > 8) {
            return updated.slice(updated.length - 8);
          }
          return updated;
        });
      }

      // Play subtle, low-frequency UI alert sound if an incident_classification is detected in STAFF_STREAM
      const incidentClass = data.staff_operations_payload?.incident_classification;
      if (isStaffStream && incidentClass && !isSoundMuted) {
        playLowFrequencyAlertSound();
      }

      // Handle twin coordinate matrix mapping immediately
      if (data.threejs_camera_matrix) {
        const coords = data.threejs_camera_matrix.camera_position_vector;
        const lookAt = data.threejs_camera_matrix.look_at_vector;
        const color = data.threejs_camera_matrix.ui_glow_color_hex;
        const anchor = data.fan_experience_payload?.ui_action_routing?.location_anchor || 
                       data.threejs_camera_matrix.target_view_zone;

        setCameraPos({ x: coords.x, y: coords.y, z: coords.z });
        setLookAtPos({ x: lookAt.x, y: lookAt.y, z: lookAt.z });
        setGlowColor(color || "#22c55e");
        
        // Clean up visual anchor text for component mapping
        let mappedAnchor: string | null = null;
        if (anchor) {
          const uAnchor = anchor.toUpperCase();
          if (uAnchor.includes("GATE_A") || uAnchor.includes("GATE A")) mappedAnchor = "GATE_A";
          else if (uAnchor.includes("GATE_B") || uAnchor.includes("GATE B")) mappedAnchor = "GATE_B";
          else if (uAnchor.includes("GATE_C") || uAnchor.includes("GATE C")) mappedAnchor = "GATE_C";
          else if (uAnchor.includes("GATE_D") || uAnchor.includes("GATE D")) mappedAnchor = "GATE_D";
          else if (uAnchor.includes("TROUBLE") || uAnchor.includes("BOOTH")) mappedAnchor = "TROUBLESHOOTING_BOOTH";
          else if (uAnchor.includes("118") || uAnchor.includes("104")) mappedAnchor = "SECTION_118";
          else if (uAnchor.includes("143") || uAnchor.includes("112")) mappedAnchor = "SECTION_143";
        }
        setActiveAnchor(mappedAnchor);
      }

      // Add to tactical security audit log state
      const isBlocked = data.security_firewall_status?.firewall_action_taken === "TERMINATE_AND_BLOCK";

      // Save to tactical incident history if available in staff payload and incident is classified
      if (isStaffStream && incidentClass && incidentClass !== "NONE" && !isBlocked) {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
        
        let mappedAnchorLocal = null;
        if (data.threejs_camera_matrix) {
          const anchor = data.fan_experience_payload?.ui_action_routing?.location_anchor || 
                         data.threejs_camera_matrix.target_view_zone;
          if (anchor) {
            const uAnchor = anchor.toUpperCase();
            if (uAnchor.includes("GATE_A") || uAnchor.includes("GATE A")) mappedAnchorLocal = "GATE_A";
            else if (uAnchor.includes("GATE_B") || uAnchor.includes("GATE B")) mappedAnchorLocal = "GATE_B";
            else if (uAnchor.includes("GATE_C") || uAnchor.includes("GATE C")) mappedAnchorLocal = "GATE_C";
            else if (uAnchor.includes("GATE_D") || uAnchor.includes("GATE D")) mappedAnchorLocal = "GATE_D";
            else if (uAnchor.includes("TROUBLE") || uAnchor.includes("BOOTH")) mappedAnchorLocal = "TROUBLESHOOTING_BOOTH";
            else if (uAnchor.includes("118") || uAnchor.includes("104")) mappedAnchorLocal = "SECTION_118";
            else if (uAnchor.includes("143") || uAnchor.includes("112")) mappedAnchorLocal = "SECTION_143";
          }
        }

        const newIncident: IncidentLog = {
          id: Math.random().toString(),
          timestamp: timeString,
          classification: incidentClass,
          query: activeQuery,
          actionPlan: data.staff_operations_payload.immediate_operational_action_plan || [],
          verbalRadioBriefingScript: data.staff_operations_payload.verbal_radio_briefing_script || null,
          coordinates: data.staff_operations_payload.incident_coordinates || null,
          cameraPos: data.threejs_camera_matrix ? { ...data.threejs_camera_matrix.camera_position_vector } : null,
          lookAtPos: data.threejs_camera_matrix ? { ...data.threejs_camera_matrix.look_at_vector } : null,
          glowColor: data.threejs_camera_matrix?.ui_glow_color_hex || "#ef4444",
          activeAnchor: mappedAnchorLocal,
          fullPayload: data
        };

        // Save to our server-side database
        fetch("/api/incidents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            classification: newIncident.classification,
            query: newIncident.query,
            activeAnchor: newIncident.activeAnchor,
            coordinates: newIncident.coordinates,
            glowColor: newIncident.glowColor,
            actionPlan: newIncident.actionPlan,
            verbalRadioBriefingScript: newIncident.verbalRadioBriefingScript,
            cameraPos: newIncident.cameraPos,
            lookAtPos: newIncident.lookAtPos
          })
        })
        .then(() => fetchIncidents())
        .catch((err) => console.error("Error posting AI incident:", err));

        setIncidentHistory(prev => {
          if (prev.length > 0 && prev[0].query === activeQuery) {
            return prev;
          }
          const updated = [newIncident, ...prev];
          return updated;
        });

        setIsSidebarOpen(true);
        setActiveIncidentId(newIncident.id);
      }
      let reason = null;
      if (isBlocked) {
        if (data.security_firewall_status.rate_limit_breached) reason = "RATE LIMIT BREACHED (>10 req/m)";
        else if (data.security_firewall_status.malicious_injection_detected) reason = "PROMPT OVERRIDE ATTEMPT";
        else if (data.security_firewall_status.out_of_scope_query) reason = "OUT-OF-SCOPE OPERATION";
      }

      const newLog: LogEntry = {
        id: Math.random().toString(),
        timestamp: new Date().toLocaleTimeString(),
        query: activeQuery,
        blocked: isBlocked,
        blockReason: reason,
        persona: data.routing_metadata?.detected_persona || "UNKNOWN",
        language: data.routing_metadata?.input_language || "en",
        urgency: data.routing_metadata?.perceived_urgency_tier || "LOW",
        cameraZone: data.threejs_camera_matrix?.target_view_zone || "Overview"
      };

      setLogs(prev => [newLog, ...prev]);
      setCurrentView("PAYLOAD");

    } catch (err: any) {
      console.error(err);
      setAnalysisStep("SYS_ERR: ENGINE CONNECTION LOST. REBOOTING MATRIX...");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePresetSelect = (idx: number) => {
    setSelectedImagePreset(idx);
    setQuery(PRESET_IMAGES[idx].query);
    setCustomImage(null);
  };

  const handleCopyJSON = () => {
    if (!engineResult) return;
    navigator.clipboard.writeText(JSON.stringify(engineResult, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Pre-configured manual camera controls
  const handleFlyTo = (zone: string) => {
    setActiveAnchor(zone);
    if (zone === "GATE_A") {
      setCameraPos({ x: -75, y: 15, z: -75 });
      setLookAtPos({ x: -55, y: 5, z: -55 });
      setGlowColor("#3b82f6");
    } else if (zone === "GATE_B") {
      setCameraPos({ x: -75, y: 15, z: 75 });
      setLookAtPos({ x: -55, y: 5, z: 55 });
      setGlowColor("#3b82f6");
    } else if (zone === "GATE_C") {
      setCameraPos({ x: 75, y: 15, z: 75 });
      setLookAtPos({ x: 55, y: 5, z: 55 });
      setGlowColor("#ef4444");
    } else if (zone === "GATE_D") {
      setCameraPos({ x: 75, y: 15, z: -75 });
      setLookAtPos({ x: 55, y: 5, z: -55 });
      setGlowColor("#3b82f6");
    } else if (zone === "TROUBLESHOOTING_BOOTH") {
      setCameraPos({ x: -80, y: 15, z: -65 });
      setLookAtPos({ x: -60, y: 5, z: -45 });
      setGlowColor("#eab308");
    } else if (zone === "SECTION_118") {
      setCameraPos({ x: -55, y: 20, z: 60 });
      setLookAtPos({ x: -35, y: 10, z: 40 });
      setGlowColor("#3b82f6");
    } else if (zone === "SECTION_143") {
      setCameraPos({ x: 55, y: 20, z: -60 });
      setLookAtPos({ x: 35, y: 10, z: -40 });
      setGlowColor("#10b981");
    } else {
      setActiveAnchor(null);
      setCameraPos({ x: 0, y: 50, z: 100 });
      setLookAtPos({ x: 0, y: 0, z: 0 });
      setGlowColor("#22c55e");
    }
  };

  const getScreenReaderSummary = () => {
    const stadiumName = fanSelectedStadiumId?.replace(/_/g, " ") || "New York New Jersey";
    
    const weatherStr = currentWeather?.toLowerCase() || "clear sky";
    const anchorStr = currentSessionRole === "FAN"
      ? (fanActiveAnchor ? `focused on ${fanActiveAnchor.replace(/_/g, " ")}` : "showing a birds-eye overview")
      : (activeAnchor ? `focused on ${activeAnchor.replace(/_/g, " ")}` : "showing a general operational view");

    const incidentStr = currentSessionRole !== "FAN" && engineResult?.staff_operations_payload?.incident_classification
      ? `with an active ${engineResult.staff_operations_payload.incident_classification.replace(/_/g, " ")} warning at the coordinates`
      : "";

    // Access metrics for screen readers
    const densityLevel = engineResult?.staff_operations_payload?.estimated_density_band || 
                         engineResult?.fan_experience_payload?.estimated_density_band || 
                         "COMFORTABLE";
    
    const adaStatus = stepFreePreference ? "ENABLED (Routing highlights bypass stairs, utilizing ADA elevator column and ramp paths)" : "DISABLED (Standard stair-climbing routes active)";

    // Gate & Turnstile status summary
    const gateStatusMsg = currentSessionRole !== "FAN" 
      ? "Turnstile telemetry: Gate A status OK (45 queue count), Gate B status WARNING (85 queue count, 18/min throughput)."
      : "Turnstile telemetry: All standard gates are operating. Refer to staff-assisted pathways if needed.";

    return `Stadium Viewport Accessibility Summary: The 3D Digital Twin is active for ${stadiumName} under ${weatherStr} weather conditions. Camera perspective is ${anchorStr} ${incidentStr}. Real-time Crowd Density Level is classified as ${densityLevel}. Accessibility Route Highlights (Step-Free ADA preference) is currently ${adaStatus}. ${gateStatusMsg} Use the keyboard, main controls, or the compliance query input to request real-time adjustments and navigation directions.`;
  };

  const isBlockedResult = engineResult?.security_firewall_status?.firewall_action_taken === "TERMINATE_AND_BLOCK";
  const detectedPersona = engineResult?.routing_metadata?.detected_persona;

  return (
    <div className="min-h-screen bg-[#07090c] text-slate-100 flex flex-col font-sans select-none antialiased">
      <div className="sr-only" aria-live="polite">
        {getScreenReaderSummary()}
      </div>
      <MonteryLanguageDropdown selectedLanguage={selectedLanguage} onLanguageChange={handleLanguageChange} />

      {/* Global API Exception Banner */}
      <AnimatePresence>
        {apiGlobalError && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-red-950 border-b border-red-500/40 text-red-100 px-4 py-2 text-xs flex items-center justify-between gap-3 relative z-[60] font-mono shadow-[0_2px_15px_rgba(239,68,68,0.15)] shrink-0"
          >
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 animate-pulse" />
              <span>{apiGlobalError}</span>
            </div>
            <button
              onClick={() => apiGlobalErrorStore.setError(null)}
              className="text-red-400 hover:text-red-100 font-bold px-2 py-0.5 rounded border border-red-500/20 hover:border-red-500/60 bg-red-900/30 transition-all cursor-pointer"
            >
              DISMISS
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      {/* 1. Tactical HUD Header Banner */}
      {currentSessionRole !== "UNASSIGNED" && (
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: showHeader ? 0 : -100, opacity: showHeader ? 1 : 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="bg-[#0b0e12]/95 border-b border-[#1b2531]/80 px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-0 z-50 backdrop-blur-md"
        >
          <div className="flex flex-row items-center gap-x-4 shrink-0">
            <div className="w-8 h-8 shrink-0 flex items-center justify-center object-contain overflow-visible">
              <PixelDuckLogo />
            </div>
            <div className="flex-1 min-w-0">
              <h1 id="header-montery-title" className="text-[11px] font-pixel flex flex-row items-center gap-x-4 text-slate-100">
                {getTranslation("dashboard_title", selectedLanguage, engineResult)}
                <span className="text-[8px] bg-emerald-950 text-emerald-400 border border-emerald-900 px-1.5 py-0.5 rounded font-bold tracking-normal uppercase font-mono shrink-0">
                  FIFA World Cup 2026
                </span>
              </h1>
              <p className="text-[10px] text-slate-400 font-mono tracking-tight uppercase">
                Isolated Self-Auditing Operational Intelligence Engine • Virtual Twin Control
              </p>
            </div>
          </div>

          {/* Real-time telemetries */}
          <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono text-slate-400">
            {/* SECURE ACCESS ROLE MULTIPLEX */}
            {currentSessionRole !== "FAN" && (
              <div className="bg-slate-950/80 border border-indigo-950/80 hover:border-indigo-500/50 transition-colors rounded px-2 py-0.5 flex items-center gap-2 shadow-[0_0_15px_rgba(99,102,241,0.05)]">
                <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-slate-400">SECURE ACCESS ROLE:</span>
                <select
                  value={currentSessionRole}
                  aria-label="Secure Access Role Selector"
                  onChange={(e) => {
                    const selectedRole = e.target.value as any;
                    setCurrentSessionRole(selectedRole);
                    if (selectedRole !== "UNASSIGNED") {
                      let initialQuery = "";
                      if (selectedRole === "FAN") {
                        initialQuery = "Where is Section 118 elevator? I need accessible directions.";
                        setFanSelectedStadiumId("LOS_ANGELES");
                      }
                      else if (selectedRole === "VOLUNTEER") initialQuery = "Gate B queue congestion update and field report";
                      else if (selectedRole === "VENUE_STAFF") initialQuery = "Audit ticket scan failed error codes at turnstiles";
                      else if (selectedRole === "ORGANIZER") initialQuery = "Review current stadium concourse occupancy and high crowd density alarms";
                      setQuery(initialQuery);
                      triggerQueryAnalysis(initialQuery, selectedRole);
                    } else {
                      setEngineResult(null);
                    }
                  }}
                  className="bg-transparent text-white font-bold text-[10px] uppercase tracking-wide focus:outline-none border-none cursor-pointer py-1"
                >
                  <option value="UNASSIGNED" className="bg-slate-950 text-slate-500">UNASSIGNED</option>
                  <option value="FAN" className="bg-slate-950 text-sky-400">FAN (Spectator Mode)</option>
                  <option value="VOLUNTEER" className="bg-slate-950 text-emerald-400">VOLUNTEER (Field Intelligence)</option>
                  <option value="VENUE_STAFF" className="bg-slate-950 text-amber-500">VENUE STAFF (Terminal Operations)</option>
                  <option value="ORGANIZER" className="bg-slate-950 text-rose-500">ORGANIZER (Coordinator Core)</option>
                </select>
              </div>
            )}

            {/* STADIUM METRIC SELECTION HUB FOR ADMIN/STAFF */}
            {currentSessionRole !== "FAN" && currentSessionRole !== "UNASSIGNED" && (
              <div className="bg-slate-950/80 border border-emerald-950/85 hover:border-emerald-500/50 transition-colors rounded px-2 py-0.5 flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-400">OPERATIONAL HUB:</span>
                <select
                  value={fanSelectedStadiumId}
                  aria-label="Operational Hub Selector"
                  onChange={(e) => {
                    const newStadium = e.target.value;
                    setFanSelectedStadiumId(newStadium);
                  }}
                  className="bg-transparent text-white font-bold text-[10px] uppercase tracking-wide focus:outline-none border-none cursor-pointer py-1"
                >
                  <option value="NEW_YORK_NEW_JERSEY" className="bg-slate-950 text-slate-100">NEW YORK NEW JERSEY (MetLife)</option>
                  <option value="LOS_ANGELES" className="bg-slate-950 text-slate-100">LOS ANGELES (SoFi)</option>
                  <option value="MEXICO_CITY" className="bg-slate-950 text-slate-100">MEXICO CITY (Azteca)</option>
                  <option value="MIAMI" className="bg-slate-950 text-slate-100">MIAMI (Hard Rock)</option>
                  <option value="TORONTO" className="bg-slate-950 text-slate-100">TORONTO (BMO Field)</option>
                  <option value="DALLAS" className="bg-slate-950 text-slate-100">DALLAS (AT&T Stadium)</option>
                  <option value="ATLANTA" className="bg-slate-950 text-slate-100">ATLANTA (Mercedes-Benz)</option>
                  <option value="VANCOUVER" className="bg-slate-950 text-slate-100">VANCOUVER (BC Place)</option>
                  <option value="GUADALAJARA" className="bg-slate-950 text-slate-100">GUADALAJARA (Akron)</option>
                  <option value="MONTERREY" className="bg-slate-950 text-slate-100">MONTERREY (BBVA)</option>
                  <option value="SEATTLE" className="bg-slate-950 text-slate-100">SEATTLE (Lumen Field)</option>
                  <option value="SAN_FRANCISCO" className="bg-slate-950 text-slate-100">SAN FRANCISCO (Levi's)</option>
                  <option value="KANSAS_CITY" className="bg-slate-950 text-slate-100">KANSAS CITY (Arrowhead)</option>
                  <option value="HOUSTON" className="bg-slate-950 text-slate-100">HOUSTON (NRG Stadium)</option>
                  <option value="BOSTON" className="bg-slate-950 text-slate-100">BOSTON (Gillette Stadium)</option>
                  <option value="PHILADELPHIA" className="bg-slate-950 text-slate-100">PHILADELPHIA (Lincoln Financial)</option>
                </select>
              </div>
            )}

            {/* LOGGED IN USER BADGE */}
            {loggedInUser && (
              <div className="bg-slate-950/80 border border-emerald-950/80 rounded px-2.5 py-1 flex items-center gap-2 shadow-[0_0_10px_rgba(16,185,129,0.05)]">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>ACTIVE: <span className="text-white font-bold uppercase">{loggedInUser.name}</span> <span className="text-[9px] text-emerald-500 bg-emerald-950/40 px-1.5 py-0.5 rounded font-mono font-bold ml-1">{loggedInUser.role}</span></span>
              </div>
            )}

            {/* STEP-FREE ACCESSIBILITY PREFERENCE */}
            <div className={`bg-slate-950/80 border rounded px-2.5 py-1 flex items-center gap-2 transition-all duration-300 ${
              stepFreePreference 
                ? "border-sky-500/50 shadow-[0_0_10px_rgba(14,165,233,0.15)] text-sky-300" 
                : "border-slate-900 text-slate-400"
            }`}>
              <button
                onClick={() => {
                  const nextVal = !stepFreePreference;
                  setStepFreePreference(nextVal);
                  if (currentSessionRole !== "UNASSIGNED") {
                    triggerQueryAnalysis(undefined, undefined, nextVal);
                  }
                }}
                className="flex items-center gap-1.5 focus:outline-none"
                title="Toggle step-free wheelchair & stroller routing priority"
              >
                <Accessibility className={`w-3.5 h-3.5 ${stepFreePreference ? "text-sky-400 animate-pulse" : "text-slate-500"}`} />
                <span>STEP-FREE (ADA): <span className={`font-bold uppercase ${stepFreePreference ? "text-sky-400" : "text-slate-500"}`}>
                  {stepFreePreference ? "ACTIVE" : "DISABLED"}
                </span></span>
              </button>
            </div>

            <div className="bg-slate-950/80 border border-slate-900 rounded px-2.5 py-1 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>TIME: <span className="text-white font-semibold">{timeStr}</span></span>
            </div>

            {currentSessionRole !== "FAN" && (
              <div className={`rounded px-2.5 py-1 flex items-center gap-2 transition-all duration-300 ${
                devicePower < 15
                  ? "bg-red-950/30 border border-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.45)]"
                  : "bg-slate-950/80 border border-slate-900"
              }`}>
                {currentWeather === "SUNSHINE" ? (
                  <BatteryCharging className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                ) : (
                  <Battery className={`w-3.5 h-3.5 ${devicePower < 15 ? "text-red-500 animate-bounce" : devicePower < 20 ? "text-amber-500" : "text-emerald-400"}`} />
                )}
                <span>
                  BATTERY:{" "}
                  <span className={`font-semibold ${devicePower < 15 ? "text-red-400 animate-pulse" : "text-white"}`}>
                    {devicePower.toFixed(1)}%
                  </span>
                  {currentWeather === "SUNSHINE" && (
                    <span className="text-[8px] text-emerald-500 ml-1 font-bold tracking-tight uppercase">
                      (SOLAR CHARGING)
                    </span>
                  )}
                  {currentWeather !== "SUNSHINE" && devicePower < 15 && (
                    <span className="text-[8px] text-red-500 ml-1 font-bold tracking-tight uppercase animate-pulse">
                      (BACKUP POWER ACTIVE)
                    </span>
                  )}
                </span>
              </div>
            )}

            <motion.div
              key={`weather-${currentWeather}-${currentTemperature}-${currentStadiumName}`}
              initial={{ scale: 0.95, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 15, stiffness: 150 }}
              className="bg-slate-950/80 border border-slate-900 rounded px-2.5 py-1 flex items-center gap-2 shadow-[0_0_12px_rgba(34,211,238,0.05)]"
            >
              {currentWeather === "SUNSHINE" && <Sun className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: "16s" }} />}
              {currentWeather === "RAIN" && <CloudRain className="w-3.5 h-3.5 text-blue-400 animate-pulse" />}
              {currentWeather === "FOG" && <CloudFog className="w-3.5 h-3.5 text-slate-400 animate-pulse" />}
              {currentWeather === "SNOW" && <CloudSnow className="w-3.5 h-3.5 text-sky-300 animate-bounce" style={{ animationDuration: "4s" }} />}
              <span className="flex items-center gap-1">
                <span>ENV:</span>
                <span className="text-white font-semibold uppercase">{currentWeather === "SUNSHINE" ? "SUNNY" : currentWeather}</span>
                {currentTemperature !== undefined && (
                  <span className="text-cyan-400 font-semibold font-mono ml-0.5">({currentTemperature}°C)</span>
                )}
                {currentStadiumName && (
                  <span className="text-slate-500 font-normal ml-1.5 border-l border-slate-800 pl-1.5 hidden md:inline">
                    {currentStadiumName} • {currentLocationName}
                  </span>
                )}
                <span className="text-slate-500 font-normal ml-1.5 border-l border-slate-800 pl-1.5 hidden sm:inline">
                  INTERFERENCE: <span className="text-cyan-400 font-semibold">{atmosphericInterference}</span>
                </span>
              </span>
            </motion.div>

            {currentSessionRole !== "FAN" && (
              <div className="bg-slate-950/80 border border-slate-900 rounded px-2.5 py-1 flex items-center gap-2">
                {isAnalyzing && matrixCoreText === "SYNCHRONIZING" ? (
                  <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                )}
                <span>
                  MATRIX CORE:{" "}
                  <span
                    className={`font-semibold uppercase ${
                      isAnalyzing
                        ? matrixCoreText === "SYNCHRONIZING"
                        ? "text-amber-400 animate-pulse"
                        : "text-emerald-400"
                        : "text-emerald-400 animate-pulse"
                    }`}
                  >
                    {matrixCoreText}
                  </span>
                </span>
              </div>
            )}

            {currentSessionRole !== "FAN" && (
              <div className="bg-slate-950/80 border border-slate-900 rounded px-2.5 py-1 flex items-center gap-2">
                <button
                  onClick={toggleViewportExpansion}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-white transition focus:outline-none"
                  title={isFullScreenViewport ? "Switch to 2-Column tactical layout" : "Switch to Full-Screen Viewport"}
                >
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>DASHBOARD MODE: <span className={isFullScreenViewport ? "text-cyan-400 font-bold" : "text-slate-400 font-bold"}>
                    {isFullScreenViewport ? "FULL VIEWPORT" : "2-COLUMN"}
                  </span></span>
                </button>
              </div>
            )}

            <div className="bg-slate-950/80 border border-slate-900 rounded px-2.5 py-1 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>FIREWALL LEVEL: <span className="text-cyan-400 font-semibold uppercase">MAXIMUM</span></span>
            </div>



            {currentSessionRole !== "FAN" && (
              <div className="bg-slate-950/80 border border-slate-900 rounded px-2.5 py-1 flex items-center gap-2">
                <button
                  onClick={() => setIsSoundMuted(prev => !prev)}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-white transition focus:outline-none"
                  title={isSoundMuted ? "Unmute tactical audio alert cues" : "Mute tactical audio alert cues"}
                >
                  {isSoundMuted ? (
                    <VolumeX className="w-3.5 h-3.5 text-red-500" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                  <span>AUDIO CUES: <span className={isSoundMuted ? "text-red-400 font-semibold" : "text-emerald-400 font-semibold"}>
                    {isSoundMuted ? "MUTED" : "ACTIVE"}
                  </span></span>
                </button>
                <span className="text-slate-800">|</span>
                <button
                  onClick={playLowFrequencyAlertSound}
                  className="text-cyan-400 hover:text-cyan-300 font-bold transition text-[9px] uppercase tracking-wide hover:underline"
                  title="Test 5-second tactical blaring alarm"
                >
                  TEST
                </button>
              </div>
            )}

            <button
              id="quit-to-start-button"
              onClick={() => {
                setCurrentSessionRole("UNASSIGNED");
                setLoggedInUser(null);
                setSelectedLoginRole(null);
                setEngineResult(null);
                setCurrentView("DASHBOARD");
                setCurrentSeat(null);
                setSelectedNewSeat(null);
              }}
              className="bg-red-950/50 hover:bg-red-900/60 border border-red-500/50 hover:border-red-500 transition-all duration-300 rounded px-3 py-1 flex items-center gap-1.5 text-red-400 hover:text-red-200 font-bold focus:outline-none shadow-[0_0_15px_rgba(239,68,68,0.1)] cursor-pointer"
              title="Quit to starting page and select role"
            >
              <Home className="w-3.5 h-3.5 text-red-400" />
              <span>QUIT TO START</span>
            </button>
          </div>
        </motion.header>
      )}

      {/* 2. Main tactical viewport grid or starting screen */}
      {currentSessionRole === "UNASSIGNED" ? (
        <main className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden bg-[#07090c]">
          {/* FIFA 2026 World Cup themed stadium background image */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1920&q=80"
              alt="FIFA 2026 Stadium Background"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-[0.18] scale-105 select-none pointer-events-none filter brightness-50 contrast-125 saturate-120 transition-opacity duration-700"
            />
            {/* Dark vignette gradients to blend with edge boundaries and ensure perfect card readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#07090c] via-transparent to-[#07090c]/80 opacity-95" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#07090c] via-transparent to-[#07090c]/80 opacity-95" />
            <div className="absolute inset-0 bg-[#07090c]/40 mix-blend-multiply" />
          </div>

          {/* Decorative elements for tactical / world cup vibe */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.04)_0%,transparent_65%)] pointer-events-none" />
          <div className="absolute top-10 left-10 w-48 h-48 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none animate-pulse" style={{ animationDuration: "12s" }} />
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none animate-pulse" style={{ animationDuration: "8s" }} />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(27,37,49,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(27,37,49,0.15)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="w-full max-w-4xl bg-[#0b0e12]/95 border border-[#1b2531]/80 rounded-2xl p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-md relative z-10 flex flex-col gap-8"
          >
            {/* Header / Branding matching top-left exactly */}
            <div className="flex flex-col md:flex-row items-center gap-6 pb-6 border-b border-[#1b2531]/80">
              <div className="w-16 h-16 shrink-0 flex items-center justify-center bg-[#0e1319] rounded-xl border border-[#1b2531]/80 shadow-inner p-2 overflow-visible">
                <PixelDuckLogo />
              </div>
              <div className="flex-1 text-center md:text-left space-y-1">
                <h1 className="text-2xl font-pixel flex flex-col sm:flex-row items-center gap-3 text-slate-100 justify-center md:justify-start">
                  {getTranslation("dashboard_title", selectedLanguage, engineResult)}
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-900 px-2 py-0.5 rounded font-bold tracking-normal uppercase font-mono shrink-0">
                    FIFA World Cup 2026
                  </span>
                </h1>
                <p className="text-xs text-slate-400 font-mono tracking-tight uppercase">
                  Isolated Self-Auditing Operational Intelligence Engine • Virtual Twin Control
                </p>
              </div>
              <div className="flex items-center gap-3">

                <span className="text-[10px] font-mono bg-indigo-950/80 text-indigo-300 border border-indigo-900/60 rounded px-2.5 py-1 hidden lg:inline-block">
                  RBAC ACCESS CONTROL
                </span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {selectedLoginRole === null ? (
                <motion.div
                  key="role-selection"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="flex flex-col gap-6"
                >
                  {/* Subtext and intro with Inline Language Dropdown */}
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-[#1b2531]/40 pb-5">
                    <div className="space-y-2 text-center md:text-left flex-1">
                      <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider font-mono">
                        {getTranslation("btn_select_role", selectedLanguage, engineResult)}
                      </h2>
                      <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                        {getTranslation("welcome_desc", selectedLanguage, engineResult)}
                      </p>
                    </div>
                  </div>

                  {/* Options Deck (2x2 Grid) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* FAN ROLE CARD */}
                    <button
                      onClick={() => { setSelectedLoginRole("FAN"); setLoginError(""); }}
                      className="relative overflow-hidden p-4 rounded-xl border border-sky-900/30 bg-sky-950/10 hover:bg-sky-950/20 hover:border-sky-500/50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] text-left flex flex-col gap-2 group cursor-pointer shadow-md hover:shadow-sky-500/5"
                    >
                      <div className="-z-10 absolute inset-0 rounded-xl transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] bg-gradient-to-tr from-emerald-500/20 via-teal-500/10 to-transparent backdrop-blur-xl border border-emerald-500/30">
                        <div className="w-full h-full opacity-45 flex items-center justify-center p-1">
                          <FanPixelArt />
                        </div>
                      </div>
                      <div className="flex items-center justify-between w-full">
                        <span className="text-sm font-bold text-sky-400 group-hover:text-sky-300 transition-colors uppercase tracking-wide font-mono">
                          {getTranslation("role_fan_title", selectedLanguage, engineResult)}
                        </span>
                        <span className="text-[9px] font-mono text-sky-500 bg-sky-950 px-2 py-0.5 rounded border border-sky-900/40 font-bold">LEVEL 1</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-normal">
                        {getTranslation("role_fan_desc", selectedLanguage, engineResult)}
                      </p>
                      <span className="text-[10px] font-semibold text-rose-400 mt-1 block">
                        ⚠️ {getTranslation("label_restricted_warning", selectedLanguage, engineResult)}
                      </span>
                    </button>

                    {/* VOLUNTEER ROLE CARD */}
                    <button
                      onClick={() => { setSelectedLoginRole("VOLUNTEER"); setLoginError(""); }}
                      className="relative overflow-hidden p-4 rounded-xl border border-emerald-900/30 bg-emerald-950/10 hover:bg-emerald-950/20 hover:border-emerald-500/50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] text-left flex flex-col gap-2 group cursor-pointer shadow-md hover:shadow-emerald-500/5"
                    >
                      <div className="-z-10 absolute inset-0 rounded-xl transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] bg-gradient-to-tr from-emerald-500/20 via-teal-500/10 to-transparent backdrop-blur-xl border border-emerald-500/30">
                        <div className="w-full h-full opacity-45 flex items-center justify-center p-1">
                          <VolunteerPixelArt />
                        </div>
                      </div>
                      <div className="flex items-center justify-between w-full">
                        <span className="text-sm font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors uppercase tracking-wide font-mono">
                          {getTranslation("role_volunteer_title", selectedLanguage, engineResult)}
                        </span>
                        <span className="text-[9px] font-mono text-emerald-500 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-900/40 font-bold">LEVEL 2</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-normal">
                        {getTranslation("role_volunteer_desc", selectedLanguage, engineResult)}
                      </p>
                      <span className="text-[10px] font-semibold text-emerald-500 mt-1 block">
                        ✓ {getTranslation("section_volunteer_header", selectedLanguage, engineResult)}
                      </span>
                    </button>

                    {/* VENUE_STAFF CARD */}
                    <button
                      onClick={() => { setSelectedLoginRole("VENUE_STAFF"); setLoginError(""); }}
                      className="relative overflow-hidden p-4 rounded-xl border border-amber-900/30 bg-amber-950/10 hover:bg-amber-950/20 hover:border-amber-500/50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] text-left flex flex-col gap-2 group cursor-pointer shadow-md hover:shadow-amber-500/5"
                    >
                      <div className="-z-10 absolute inset-0 rounded-xl transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] bg-gradient-to-tr from-emerald-500/20 via-teal-500/10 to-transparent backdrop-blur-xl border border-emerald-500/30">
                        <div className="w-full h-full opacity-45 flex items-center justify-center p-1">
                          <StaffPixelArt />
                        </div>
                      </div>
                      <div className="flex items-center justify-between w-full">
                        <span className="text-sm font-bold text-amber-400 group-hover:text-amber-300 transition-colors uppercase tracking-wide font-mono">
                          {getTranslation("role_staff_title", selectedLanguage, engineResult)}
                        </span>
                        <span className="text-[9px] font-mono text-amber-500 bg-amber-950 px-2 py-0.5 rounded border border-amber-900/40 font-bold">LEVEL 3</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-normal">
                        {getTranslation("role_staff_desc", selectedLanguage, engineResult)}
                      </p>
                      <span className="text-[10px] font-semibold text-amber-500 mt-1 block">
                        ✓ {getTranslation("section_ops_header", selectedLanguage, engineResult)}
                      </span>
                    </button>

                    {/* ORGANIZER CARD */}
                    <button
                      onClick={() => { setSelectedLoginRole("ORGANIZER"); setLoginError(""); }}
                      className="relative overflow-hidden p-4 rounded-xl border border-rose-900/30 bg-rose-950/10 hover:bg-rose-950/20 hover:border-rose-500/50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] text-left flex flex-col gap-2 group cursor-pointer shadow-md hover:shadow-rose-500/5"
                    >
                      <div className="-z-10 absolute inset-0 rounded-xl transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] bg-gradient-to-tr from-emerald-500/20 via-teal-500/10 to-transparent backdrop-blur-xl border border-emerald-500/30">
                        <div className="w-full h-full opacity-45 flex items-center justify-center p-1">
                          <OrganizerPixelArt />
                        </div>
                      </div>
                      <div className="flex items-center justify-between w-full">
                        <span className="text-sm font-bold text-rose-400 group-hover:text-rose-300 transition-colors uppercase tracking-wide font-mono">
                          {getTranslation("role_organizer_title", selectedLanguage, engineResult)}
                        </span>
                        <span className="text-[9px] font-mono text-rose-500 bg-rose-950 px-2 py-0.5 rounded border border-rose-900/40 font-bold">LEVEL 4</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-normal">
                        {getTranslation("role_organizer_desc", selectedLanguage, engineResult)}
                      </p>
                      <span className="text-[10px] font-semibold text-rose-500 mt-1 block">
                        ✓ {getTranslation("dashboard_title", selectedLanguage, engineResult)}
                      </span>
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="login-screen"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="flex flex-col gap-5 text-left"
                >
                  {/* Top back button */}
                  <div className="flex items-center justify-between border-b border-[#1b2531]/80 pb-4">
                    <button
                      onClick={() => { setSelectedLoginRole(null); setLoginError(""); }}
                      className="text-slate-400 hover:text-white transition flex items-center gap-1.5 text-xs font-mono font-bold focus:outline-none cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4 text-emerald-400" /> {getTranslation("back_to_identities", selectedLanguage, engineResult)}
                    </button>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">
                      {getTranslation("secure_portal_entry", selectedLanguage, engineResult)}
                    </span>
                  </div>

                  {/* Dynamic Form according to role */}
                  {selectedLoginRole === "FAN" && (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#1b2531]/40 pb-3">
                        <div className="flex-1">
                          <h3 className="text-base font-bold text-sky-400 font-mono uppercase tracking-wide">
                            {getTranslation("spectator_deck_login", selectedLanguage, engineResult)}
                          </h3>
                          <p className="text-xs text-slate-400">
                            {getTranslation("fan_desc", selectedLanguage, engineResult)}
                          </p>
                        </div>
                        <MonteryLanguageDropdown selectedLanguage={selectedLanguage} onLanguageChange={handleLanguageChange} inline={true} className="border border-[#1b2531]/60 bg-[#0e1319] hover:border-slate-700 shrink-0 self-start sm:self-center" />
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label htmlFor="fan-login-name" className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                            {getTranslation("full_name", selectedLanguage, engineResult)}
                          </label>
                          <input
                            id="fan-login-name"
                            type="text"
                            value={fanInputName}
                            onChange={(e) => setFanInputName(e.target.value)}
                            placeholder="e.g. John Doe"
                            className="w-full bg-[#07090c] border border-[#1b2531] rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500 transition-colors"
                          />
                        </div>

                        {/* Country Phone Code Dropdown and Phone Number Field */}
                        <div className="grid grid-cols-4 gap-2">
                          <div className="col-span-1">
                            <label htmlFor="fan-country-code-select" className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                              {getTranslation("code", selectedLanguage, engineResult) || "Code"}
                            </label>
                            <select
                              value={fanCountryCode}
                              onChange={(e) => setFanCountryCode(e.target.value)}
                              className="w-full bg-[#07090c] border border-[#1b2531] rounded-lg px-2 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500 transition-colors cursor-pointer max-h-36"
                              id="fan-country-code-select"
                            >
                              {COUNTRY_CODES.map((c) => (
                                <option key={c.code + "-" + c.name} value={c.code}>
                                  {c.flag} {c.code} ({c.name})
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="col-span-3">
                            <label htmlFor="fan-login-phone" className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                              {getTranslation("phone_number", selectedLanguage, engineResult)}
                            </label>
                            <input
                              id="fan-login-phone"
                              type="tel"
                              value={fanInputPhone}
                              onChange={(e) => setFanInputPhone(e.target.value)}
                              placeholder="e.g. 555-0199"
                              className="w-full bg-[#07090c] border border-[#1b2531] rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500 transition-colors"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="fan-primary-destination-select" className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                            Primary Stadium Destination
                          </label>
                          <select
                            id="fan-primary-destination-select"
                            value={fanInputStadium}
                            onChange={(e) => setFanInputStadium(e.target.value)}
                            aria-label="Primary Stadium Destination"
                            className="w-full bg-[#07090c] border border-[#1b2531] rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500 transition-colors"
                          >
                            <option value="NEW_YORK_NEW_JERSEY">MetLife Stadium (New York/New Jersey)</option>
                            <option value="LOS_ANGELES">SoFi Stadium (Los Angeles)</option>
                            <option value="DALLAS">AT&T Stadium (Dallas)</option>
                            <option value="ATLANTA">Mercedes-Benz Stadium (Atlanta)</option>
                            <option value="KANSAS_CITY">Arrowhead Stadium (Kansas City)</option>
                            <option value="MIAMI">Hard Rock Stadium (Miami)</option>
                          </select>
                        </div>
                      </div>

                      <button
                        onClick={async () => {
                          if (!fanInputName.trim()) {
                            setLoginError("Please enter your Full Name.");
                            return;
                          }
                          if (!fanInputPhone.trim()) {
                            setLoginError("Please enter your phone number.");
                            return;
                          }
                          setLoginError("");
                          setIsLoggingIn(true);
                          try {
                            const fullPhone = `${fanCountryCode} ${fanInputPhone.trim()}`;
                            const res = await fetch("/api/fans", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ 
                                name: fanInputName, 
                                phoneNumber: fullPhone,
                                selectedStadium: fanInputStadium 
                              })
                            });
                            const data = await res.json();
                            if (!res.ok) throw new Error(data.error || "Failed to register account");
                            
                            setLoggedInUser({ name: data.name, role: "FAN", details: data });
                            if (data.seat) {
                              setCurrentSeat(data.seat);
                            } else {
                              setCurrentSeat(null);
                            }
                            setSelectedNewSeat(null);
                            setFanSelectedStadiumId(fanInputStadium);
                            
                            // Load accounts list again
                            fetchFanAccounts();

                            // Log in
                            handleSelectRole("FAN");
                          } catch (err: any) {
                            setLoginError(err.message || "Failed to connect to server database");
                          } finally {
                            setIsLoggingIn(false);
                          }
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-500 border border-blue-500 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all duration-200 hover:scale-105 shadow-md flex items-center justify-center gap-2 cursor-pointer"
                        disabled={isLoggingIn}
                      >
                        {isLoggingIn ? "SYNCHRONIZING..." : getTranslation("sync_companion_deck", selectedLanguage, engineResult)}
                      </button>
                    </div>
                  )}

                  {selectedLoginRole === "VOLUNTEER" && (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#1b2531]/40 pb-3">
                        <div className="flex-1">
                          <h3 className="text-base font-bold text-emerald-400 font-mono uppercase tracking-wide">
                            {getTranslation("section_volunteer_header", selectedLanguage, engineResult)}
                          </h3>
                          <p className="text-xs text-slate-400">
                            {getTranslation("volunteer_desc", selectedLanguage, engineResult)}
                          </p>
                        </div>
                        <MonteryLanguageDropdown selectedLanguage={selectedLanguage} onLanguageChange={handleLanguageChange} inline={true} className="border border-[#1b2531]/60 bg-[#0e1319] hover:border-slate-700 shrink-0 self-start sm:self-center" />
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label htmlFor="volunteer-registration-name" className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                            {getTranslation("volunteer_name", selectedLanguage, engineResult)}
                          </label>
                          <input
                            id="volunteer-registration-name"
                            type="text"
                            value={volunteerInputName}
                            onChange={(e) => setVolunteerInputName(e.target.value)}
                            placeholder="e.g. Kevin"
                            className="w-full bg-[#07090c] border border-[#1b2531] rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
                          />
                        </div>

                        <div>
                          <label htmlFor="volunteer-assigned-stadium-select" className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                            {getTranslation("assigned_stadium", selectedLanguage, engineResult)}
                          </label>
                          <select
                            id="volunteer-assigned-stadium-select"
                            value={volunteerInputStadium}
                            onChange={(e) => setVolunteerInputStadium(e.target.value)}
                            aria-label="Assigned Stadium"
                            className="w-full bg-[#07090c] border border-[#1b2531] rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
                          >
                            <option value="Arrowhead Stadium">Arrowhead Stadium (Kansas City) [Active Match]</option>
                            <option value="MetLife Stadium">MetLife Stadium (New York/New Jersey)</option>
                            <option value="SoFi Stadium">SoFi Stadium (Los Angeles)</option>
                            <option value="AT&T Stadium">AT&T Stadium (Dallas)</option>
                            <option value="Mercedes-Benz Stadium">Mercedes-Benz Stadium (Atlanta)</option>
                            <option value="Hard Rock Stadium">Hard Rock Stadium (Miami)</option>
                            <option value="Estadio Azteca">Estadio Azteca (Mexico City)</option>
                            <option value="BC Place">BC Place (Vancouver)</option>
                            <option value="BMO Field">BMO Field (Toronto)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                            {getTranslation("volunteer_number_3_digits", selectedLanguage, engineResult)}
                          </label>
                          <input
                            type="text"
                            maxLength={3}
                            value={volunteerInputNum}
                            onChange={(e) => setVolunteerInputNum(e.target.value.replace(/\D/g, ""))}
                            placeholder="e.g. 092"
                            className="w-full bg-[#07090c] border border-[#1b2531] rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                          />
                        </div>
                      </div>

                      {/* Test Credentials Box */}
                      <div className="bg-[#0e1c15] border border-emerald-900/60 rounded-lg p-3 text-xs text-slate-300">
                        <span className="font-bold text-emerald-400 block mb-1">{getTranslation("test_account_details", selectedLanguage, engineResult)}</span>
                        Name: <code className="text-emerald-300">Kevin</code> • No: <code className="text-emerald-300">092</code> • Stadium: <code className="text-emerald-300">Arrowhead Stadium</code>
                      </div>

                      <button
                        onClick={() => {
                          const num = parseInt(volunteerInputNum, 10);
                          // 1. Volunteer number must be between 0 and 100
                          if (isNaN(num) || num < 0 || num > 100 || volunteerInputNum.length !== 3) {
                            setLoginError("You Are Not A Volunteer");
                            return;
                          }
                          
                          // 2. Exact check for Kevin, 092, and correct stadium
                          const matchedStadiums = [
                            "Arrowhead Stadium", "MetLife Stadium", "SoFi Stadium", "AT&T Stadium", 
                            "Mercedes-Benz Stadium", "Hard Rock Stadium", "Estadio Azteca", "BC Place", 
                            "BMO Field", "Estadio Akron", "Estadio BBVA", "Lincoln Financial Field"
                          ];
                          const isMatchStadium = matchedStadiums.includes(volunteerInputStadium);

                          if (
                            volunteerInputName.trim().toLowerCase() !== "kevin" ||
                            volunteerInputNum !== "092" ||
                            !isMatchStadium
                          ) {
                            setLoginError("You Are Not A Volunteer");
                            return;
                          }

                          setLoginError("");
                          setLoggedInUser({ name: "Kevin", role: "VOLUNTEER" });
                          handleSelectRole("VOLUNTEER");
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-500 border border-blue-500 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all duration-200 hover:scale-105 shadow-md cursor-pointer"
                      >
                        VERIFY & ENTER TERMINAL
                      </button>
                    </div>
                  )}

                  {selectedLoginRole === "VENUE_STAFF" && (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#1b2531]/40 pb-3">
                        <div className="flex-1">
                          <h3 className="text-base font-bold text-amber-500 font-mono uppercase tracking-wide">
                            {getTranslation("role_staff_title", selectedLanguage, engineResult)}
                          </h3>
                          <p className="text-xs text-slate-400">
                            {getTranslation("staff_desc", selectedLanguage, engineResult)}
                          </p>
                        </div>
                        <MonteryLanguageDropdown selectedLanguage={selectedLanguage} onLanguageChange={handleLanguageChange} inline={true} className="border border-[#1b2531]/60 bg-[#0e1319] hover:border-slate-700 shrink-0 self-start sm:self-center" />
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                            {getTranslation("full_name", selectedLanguage, engineResult)}
                          </label>
                          <input
                            type="text"
                            value={staffInputName}
                            onChange={(e) => setStaffInputName(e.target.value)}
                            placeholder="e.g. Jordan Rivera"
                            className="w-full bg-[#07090c] border border-[#1b2531] rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                            Staff ID
                          </label>
                          <input
                            type="text"
                            value={staffInputId}
                            onChange={(e) => setStaffInputId(e.target.value)}
                            placeholder="e.g. FIFA26087"
                            className="w-full bg-[#07090c] border border-[#1b2531] rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500 transition-colors font-mono"
                          />
                          <p className="text-[10px] text-amber-500/80 font-mono mt-1">
                            💡 Suggestion: Your ID Contains FIFA26XXX - where xxx are your last 3 digits (000 - 500).
                          </p>
                        </div>
                      </div>

                      {/* Test Credentials Box */}
                      <div className="bg-[#1c180e] border border-amber-900/60 rounded-lg p-3 text-xs text-slate-300 space-y-1">
                        <span className="font-bold text-amber-400 block">{getTranslation("test_account_details", selectedLanguage, engineResult)}</span>
                        <div>1. Name: <code className="text-amber-300">Jordan Rivera</code> • ID: <code className="text-amber-300">FIFA26087</code></div>
                        <div>2. Name: <code className="text-amber-300">Allen Irving</code> • ID: <code className="text-amber-300">FIFA26223</code></div>
                      </div>

                      <button
                        onClick={() => {
                          const normalizedInputName = staffInputName.trim().toLowerCase();
                          const normalizedInputId = staffInputId.trim().toUpperCase();

                          const isJordan = normalizedInputName === "jordan rivera" && normalizedInputId === "FIFA26087";
                          const isAllen = normalizedInputName === "allen irving" && normalizedInputId === "FIFA26223";

                          if (!isJordan && !isAllen) {
                            setLoginError("Unauthorized Staff Access. Only authorized test examples Jordan Rivera and Allen Irving are permitted.");
                            return;
                          }

                          setLoginError("");
                          const finalName = isJordan ? "Jordan Rivera" : "Allen Irving";
                          setLoggedInUser({ name: finalName, role: "VENUE_STAFF" });
                          handleSelectRole("VENUE_STAFF");
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-500 border border-blue-500 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all duration-200 hover:scale-105 shadow-md cursor-pointer"
                      >
                        AUTHENTICATE TERMINAL
                      </button>
                    </div>
                  )}

                  {selectedLoginRole === "ORGANIZER" && (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#1b2531]/40 pb-3">
                        <div className="flex-1">
                          <h3 className="text-base font-bold text-rose-500 font-mono uppercase tracking-wide">
                            {getTranslation("role_organizer_title", selectedLanguage, engineResult)}
                          </h3>
                          <p className="text-xs text-slate-400">
                            {getTranslation("organizer_desc", selectedLanguage, engineResult)}
                          </p>
                        </div>
                        <MonteryLanguageDropdown selectedLanguage={selectedLanguage} onLanguageChange={handleLanguageChange} inline={true} className="border border-[#1b2531]/60 bg-[#0e1319] hover:border-slate-700 shrink-0 self-start sm:self-center" />
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                            {getTranslation("coordinator_name", selectedLanguage, engineResult) || "Coordinator Name"}
                          </label>
                          <input
                            type="text"
                            value={organizerInputName}
                            onChange={(e) => setOrganizerInputName(e.target.value)}
                            placeholder="e.g. admin"
                            className="w-full bg-[#07090c] border border-[#1b2531] rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-rose-500 transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                            {getTranslation("security_password", selectedLanguage, engineResult) || "Security Password"}
                          </label>
                          <input
                            type="password"
                            value={organizerInputPass}
                            onChange={(e) => setOrganizerInputPass(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-[#07090c] border border-[#1b2531] rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-rose-500 transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                            Secure OGCODE
                          </label>
                          <input
                            type="text"
                            value={organizerInputCode}
                            onChange={(e) => setOrganizerInputCode(e.target.value)}
                            placeholder="e.g. 0001"
                            className="w-full bg-[#07090c] border border-[#1b2531] rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-rose-500 transition-colors font-mono"
                          />
                        </div>
                      </div>

                      {/* Test Credentials Box */}
                      <div className="bg-[#1c0e11] border border-rose-900/60 rounded-lg p-3 text-xs text-slate-300 space-y-1">
                        <span className="font-bold text-rose-400 block">{getTranslation("test_account_details", selectedLanguage, engineResult)}</span>
                        <div>1. Name: <code className="text-rose-300">admin</code> • Pass: <code className="text-rose-300">admin</code> • OGCODE: <code className="text-rose-300">0001</code></div>
                        <div>2. Name: <code className="text-rose-300">TripleT</code> • Pass: <code className="text-rose-300">tungtungtungsahur</code> • OGCODE: <code className="text-rose-300">0067</code></div>
                      </div>

                      <button
                        onClick={() => {
                          const normalName = organizerInputName.trim();
                          const normalPass = organizerInputPass;
                          const normalCode = organizerInputCode.trim();

                          const isAdmin = normalName === "admin" && normalPass === "admin" && normalCode === "0001";
                          const isTripleT = normalName === "TripleT" && normalPass === "tungtungtungsahur" && normalCode === "0067";

                          if (!isAdmin && !isTripleT) {
                            setLoginError("Access Denied: Invalid coordinator parameters.");
                            return;
                          }

                          setLoginError("");
                          setLoggedInUser({ name: normalName, role: "ORGANIZER" });
                          handleSelectRole("ORGANIZER");
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-500 border border-blue-500 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all duration-200 hover:scale-105 shadow-md cursor-pointer"
                      >
                        AUTHORIZE CORES
                      </button>
                    </div>
                  )}

                  {/* Common Error message banner */}
                  {loginError && (
                    <div className="bg-red-950/40 border border-red-500/50 text-red-400 rounded-lg p-3 text-xs flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
                      <span>{loginError}</span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom: ADA accessibility preferences in onboarding */}
            <div className="bg-[#07090c] border border-slate-900 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-sky-950/60 border border-sky-900/40 flex items-center justify-center shrink-0">
                  <Accessibility className="w-5 h-5 text-sky-400" />
                </div>
                <div className="text-[11px] font-mono text-left">
                  <span className="text-slate-300 block uppercase font-bold">Step-Free Accessibility Routing Priority</span>
                  <span className="text-slate-500 leading-normal">Ensures all wayfinding directions and guides optimize for lifts, elevators, and ramps (strollers & wheelchairs).</span>
                </div>
              </div>
              <button
                onClick={() => setStepFreePreference(!stepFreePreference)}
                className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all shrink-0 ${
                  stepFreePreference 
                    ? "bg-sky-900/80 text-sky-300 border border-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.15)]" 
                    : "bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700"
                }`}
              >
                STEP-FREE: {stepFreePreference ? "ENABLED (ADA ACTIVE)" : "DISABLED"}
              </button>
            </div>
          </motion.div>
        </main>
      ) : currentSessionRole === "FAN" ? (
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 flex flex-col gap-6" id="fan-portal-root">
          {/* Header Portal Info */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0b0e12] border border-[#1b2531] rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl"
          >
            <div className="space-y-1 text-center md:text-left">
              <span className="text-[10px] bg-sky-950 text-sky-400 border border-sky-800 px-2 py-0.5 rounded-full font-bold tracking-wider uppercase font-mono">
                FIFA SPECTATOR INTERACTIVE WORKSPACE
              </span>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center justify-center md:justify-start gap-2 mt-1 font-sans">
                {getTranslation("section_fan_header", selectedLanguage, engineResult)}
              </h2>
              <p className="text-xs text-slate-400 font-sans max-w-2xl">
                Access immersive 3D waypoint routing, secure digital food ordering, live venue support assistance, interactive seat adjustments, and real-time World Cup match analytics.
              </p>
            </div>

            {/* Accessibility routing toggle for fans */}
            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
              <MonteryLanguageDropdown selectedLanguage={selectedLanguage} onLanguageChange={handleLanguageChange} inline={true} className="border border-slate-900 bg-[#07090c] hover:border-slate-800 px-3 py-2.5 h-[50px] text-xs" />
              <div className="bg-[#07090c] border border-slate-900 rounded-lg p-3 flex items-center gap-3">
                <Accessibility className={`w-6 h-6 ${stepFreePreference ? "text-sky-400 animate-pulse" : "text-slate-500"}`} />
                <div className="text-left">
                  <span className="text-[9px] text-slate-500 block font-mono uppercase">Step-Free Routing</span>
                  <span className="text-[11px] font-bold text-slate-300">ADA ASSISTED NAVIGATION</span>
                </div>
              </div>
              <button
                onClick={() => {
                  const nextVal = !stepFreePreference;
                  setStepFreePreference(nextVal);
                  const activeQuery = query || "Where is Section 118 elevator? I need accessible directions.";
                  setQuery(activeQuery);
                  triggerQueryAnalysis(activeQuery, "FAN", nextVal);
                }}
                className={`px-4 py-2.5 rounded-lg text-xs font-mono font-bold transition-all border cursor-pointer ${
                  stepFreePreference 
                    ? "bg-sky-950/80 text-sky-300 border-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.15)] animate-pulse" 
                    : "bg-[#111827] text-slate-400 border-slate-800 hover:border-slate-700"
                }`}
              >
                {stepFreePreference ? `STEP-FREE: ENABLED (ADA)` : getTranslation("btn_step_free", selectedLanguage, engineResult)}
              </button>
            </div>
          </motion.div>

          {/* Side Navigation and Screen Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            
            {/* Left Column - Fan Side Navigation Menu */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="col-span-1 flex flex-col gap-4"
            >
              <div className="bg-[#0b0e12]/95 border border-[#1b2531] rounded-xl p-4 shadow-2xl flex flex-col gap-4 font-mono select-none">
                <div className="border-b border-[#1b2531] pb-3">
                  <div className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span>SPECTATOR DECK</span>
                  </div>
                  <p className="text-[10px] text-cyan-400 mt-1 uppercase tracking-wide font-bold">
                    {currentSeat && currentSeat.section ? `SEAT ${currentSeat.section}-${currentSeat.row}-${currentSeat.seat}` : "NO SEAT ALLOCATED"}
                  </p>
                </div>

                <nav className="flex flex-col gap-2">
                  {[
                    {
                      id: "navigation" as const,
                      label: "3D WAYFINDING",
                      icon: Compass,
                      status: "ONLINE",
                      color: "text-cyan-400",
                      glowColor: "rgba(34, 211, 238, 0.15)",
                      borderColor: "border-cyan-500/20"
                    },
                    {
                      id: "food" as const,
                      label: "ORDER FOOD",
                      icon: Utensils,
                      status: activeOrder ? (activeOrder.status === "READY" ? "READY" : "PREPARING") : "OPEN",
                      color: "text-amber-400",
                      glowColor: "rgba(245, 158, 11, 0.15)",
                      borderColor: "border-amber-500/20"
                    },
                    {
                      id: "help" as const,
                      label: "STAFF HELP",
                      icon: HelpCircle,
                      status: helpTicketSubmitted ? "ACTIVE" : "STANDBY",
                      color: "text-red-400",
                      glowColor: "rgba(239, 68, 68, 0.15)",
                      borderColor: "border-red-500/20"
                    },
                    {
                      id: "seat" as const,
                      label: "EDIT MY SEAT",
                      icon: Home,
                      status: "ASSIGNED",
                      color: "text-emerald-400",
                      glowColor: "rgba(16, 185, 129, 0.15)",
                      borderColor: "border-emerald-500/20"
                    },
                    {
                      id: "matches" as const,
                      label: "MATCH DETAILS",
                      icon: Calendar,
                      status: "FIFA 2026",
                      color: "text-purple-400",
                      glowColor: "rgba(168, 85, 247, 0.15)",
                      borderColor: "border-purple-500/20"
                    },
                    {
                      id: "rules" as const,
                      label: "STADIUM RULES",
                      icon: BookOpen,
                      status: "OFFICIAL",
                      color: "text-rose-400",
                      glowColor: "rgba(244, 63, 94, 0.15)",
                      borderColor: "border-rose-500/20"
                    },
                    {
                      id: "chat" as const,
                      label: "COMPLIANCE CHAT",
                      icon: MessageSquare,
                      status: "SECURE AI",
                      color: "text-cyan-400",
                      glowColor: "rgba(34, 211, 238, 0.15)",
                      borderColor: "border-cyan-500/20"
                    }
                  ].map((item) => {
                    const isActive = fanActiveTab === item.id;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setFanActiveTab(item.id);
                          if (item.id === "help") {
                            setHelpIconPulseActive(false);
                          }
                        }}
                        className={`group relative flex flex-col p-2 rounded border text-left transition-all duration-300 cursor-pointer ${
                          isActive
                            ? `bg-[#0e1319] border-cyan-500/60 shadow-[0_0_15px_${item.glowColor}]`
                            : `bg-slate-950/40 border-[#1b2531]/60 hover:bg-slate-900/40 hover:border-slate-800`
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`p-1 rounded bg-slate-950 border border-[#1b2531] ${
                              isActive ? item.color : "text-slate-500 group-hover:text-slate-300"
                            } transition-colors duration-200`}
                          >
                            {item.id === "help" && helpIconPulseActive ? (
                              <motion.div
                                animate={{
                                  scale: [1, 1.22, 1],
                                  opacity: [1, 0.6, 1],
                                }}
                                transition={{
                                  duration: 1.5,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                }}
                              >
                                <Icon className="w-4 h-4 text-red-500" />
                              </motion.div>
                            ) : (
                              <Icon className="w-4 h-4" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div
                              className={`text-[10px] font-bold tracking-wider ${
                                isActive ? "text-slate-100" : "text-slate-400 group-hover:text-slate-200"
                              } transition-colors duration-200`}
                            >
                              {item.label}
                            </div>
                            <div className="flex items-center justify-between mt-0.5">
                              <span className="text-[8px] text-slate-400 font-semibold tracking-wide">
                                STATUS:
                              </span>
                              <span
                                className={`text-[8px] font-extrabold tracking-widest ${
                                  isActive ? item.color : "text-slate-400"
                                } uppercase`}
                              >
                                {item.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        {isActive && (
                          <div className="absolute left-0 top-1/4 bottom-1/4 w-[2px] bg-cyan-400" />
                        )}
                      </button>
                    );
                  })}
                </nav>

                <div className="bg-[#07090c] border border-[#1b2530] p-2.5 rounded text-[8px] text-slate-400 space-y-1 select-none leading-relaxed">
                  <div className="flex justify-between">
                    <span>SECTOR LATENCY:</span>
                    <span className="text-emerald-400 font-bold">12ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SECURITY FIREWALL:</span>
                    <span className="text-cyan-400 font-bold">PASSING</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Active Content Screen */}
            <div className="col-span-1 lg:col-span-3 flex flex-col gap-6 w-full">
              
              {/* TAB 1: NAVIGATION & 3D DIGITAL TWIN */}
              {fanActiveTab === "navigation" && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  {/* 3D Model View */}
                  <div className={`${isFanViewportExpanded ? "xl:col-span-3 h-[520px]" : "xl:col-span-2 h-[480px]"} flex flex-col gap-3 transition-all duration-300 ease-in-out w-full`}>
                    <div className="bg-[#0e1319] border border-[#1b2531] rounded-xl overflow-hidden flex flex-col flex-1 relative shadow-lg">
                      <div className="bg-[#0b0e12]/90 border-b border-[#1b2531] px-4 py-3 flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                          <span className="text-cyan-400 font-bold uppercase tracking-wider">3D VENUE SIMULATOR</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-slate-500 text-[9px] hidden sm:block uppercase">
                            DRAG TO ROTATE • SCROLL TO ZOOM • RIGHT-CLICK TO PAN
                          </div>
                          <button
                            onClick={() => setIsFanViewportExpanded(!isFanViewportExpanded)}
                            className="flex items-center gap-1.5 px-2.5 py-1 bg-cyan-950/40 hover:bg-cyan-950/80 text-cyan-400 border border-cyan-900/60 hover:border-cyan-500/50 rounded text-[10px] font-mono transition-all duration-150 uppercase tracking-wider font-bold cursor-pointer shadow-[0_0_10px_rgba(34,211,238,0.05)]"
                          >
                            {isFanViewportExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                            <span>{isFanViewportExpanded ? "Shrink" : "Expand"}</span>
                          </button>
                        </div>
                      </div>

                      <div className="flex-1 relative bg-[#07090c]">
                        <Suspense fallback={
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#07090c] text-cyan-400 font-mono text-xs z-50">
                            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-3"></div>
                            <span>LOADING 3D DIGITAL TWIN ENGINE...</span>
                          </div>
                        }>
                          <StadiumTwin
                            cameraPos={fanCameraPos}
                            lookAtPos={fanLookAtPos}
                            glowColor="#22d3ee"
                            activeAnchor={fanActiveAnchor}
                            currentWeather={currentWeather}
                            incident={null}
                            incidents={null}
                            isFanMode={true}
                            isFloorHeatmapEnabled={isFloorHeatmapEnabled}
                            isLoading={isInitialLoading}
                            venueStructuralProfile={{
                              active_stadium_id: fanSelectedStadiumId,
                              official_tournament_capacity: fanSelectedStadiumId === "NEW_YORK_NEW_JERSEY" ? 82500 : fanSelectedStadiumId === "MEXICO_CITY" ? 87523 : 70240,
                              architectural_style_tag: "MODERN",
                              programmatic_texture_directives: {
                                wall_color_hex: fanSelectedStadiumId === "MEXICO_CITY" ? "#10b981" : fanSelectedStadiumId === "LOS_ANGELES" ? "#f59e0b" : fanSelectedStadiumId === "VANCOUVER" ? "#22d3ee" : "#3b82f6",
                                material_roughness: 0.18, material_transparency_alpha: 0.35, stadium_geometry_extrusion_multiplier: 1.05
                              }
                            }}
                            onWeatherChange={(weather, locName, stadiumName, temp) => {
                              setCurrentWeather(weather);
                              setCurrentLocationName(locName);
                              setCurrentStadiumName(stadiumName);
                              setCurrentTemperature(temp);
                              
                              const interferenceMap = {
                                SUNSHINE: "LOW (0.05)",
                                RAIN: "MODERATE (0.45)",
                                FOG: "HIGH (0.75)",
                                SNOW: "SEVERE (0.90)"
                              };
                              setAtmosphericInterference(interferenceMap[weather] || "LOW (0.05)");
                            }}
                          />
                        </Suspense>
                      </div>
                    </div>
                  </div>

                  {/* Sidebar controls */}
                  <div className={`${isFanViewportExpanded ? "xl:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6" : "xl:col-span-1 flex flex-col gap-6"} transition-all duration-300 ease-in-out`}>
                    
                    {/* Stadium Selector */}
                    <div className="bg-[#0b0e12] border border-[#1b2531] rounded-xl p-5 shadow-xl space-y-4">
                      <div className="border-b border-[#1b2531] pb-3">
                        <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                          <Globe className="w-4 h-4 text-cyan-400" />
                          SELECT HOST STADIUM
                        </h3>
                        <p className="text-[11px] text-slate-500 font-sans mt-1">
                          Select a host city stadium to load the 3D digital twin:
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: "NEW_YORK_NEW_JERSEY", shortName: "MetLife Stadium", flag: "🇺🇸", city: "NY/NJ" },
                          { id: "LOS_ANGELES", shortName: "SoFi Stadium", flag: "🇺🇸", city: "Los Angeles" },
                          { id: "MEXICO_CITY", shortName: "Estadio Azteca", flag: "🇲🇽", city: "Mexico City" },
                          { id: "VANCOUVER", shortName: "BC Place", flag: "🇨🇦", city: "Vancouver" },
                        ].map((btn) => (
                          <button
                            key={btn.id}
                            onClick={() => setFanSelectedStadiumId(btn.id)}
                            className={`p-2.5 rounded-lg border text-left transition-all duration-300 flex flex-col justify-between h-[65px] cursor-pointer ${
                              fanSelectedStadiumId === btn.id
                                ? "bg-cyan-950/60 border-cyan-500 shadow-[0_0_12px_rgba(34,211,238,0.2)] text-white"
                                : "bg-[#111827]/60 border-slate-800 hover:border-slate-700 text-slate-300"
                            }`}
                          >
                            <span className="text-[9px] font-mono text-slate-400 flex items-center justify-between w-full">
                              <span>{btn.city}</span>
                              <span>{btn.flag}</span>
                            </span>
                            <span className="text-[10px] font-extrabold truncate w-full mt-1">
                              {btn.shortName}
                            </span>
                          </button>
                        ))}
                      </div>

                      <div className="space-y-1.5 pt-1">
                        <label htmlFor="fan-all-tournament-venues-select" className="text-[9px] text-slate-400 uppercase font-mono font-bold">ALL 16 TOURNAMENT VENUES:</label>
                        <select
                          id="fan-all-tournament-venues-select"
                          value={fanSelectedStadiumId}
                          onChange={(e) => setFanSelectedStadiumId(e.target.value)}
                          aria-label="All 16 Tournament Venues"
                          className="w-full bg-[#111827] border border-slate-800 text-white rounded px-2.5 py-2 text-xs focus:outline-none focus:border-cyan-500 cursor-pointer font-sans"
                        >
                          {LOCATIONS.map((loc) => (
                            <option key={loc.id} value={loc.id}>
                              {loc.stadium} • {loc.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Climate Data */}
                    <div className="bg-[#0b0e12] border border-[#1b2531] rounded-xl p-5 shadow-xl space-y-4">
                      <div className="border-b border-[#1b2531] pb-3 flex items-center justify-between">
                        <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                          <Sun className="w-4 h-4 text-cyan-400" />
                          CLIMATE TELEMETRY
                        </h3>
                        <span className="text-[8px] bg-emerald-950 text-emerald-400 border border-emerald-900 px-1.5 py-0.5 rounded font-mono font-bold uppercase">
                          SATELLITE_API
                        </span>
                      </div>

                      <div className="bg-[#07090c] border border-[#1b2531]/40 rounded-lg p-3.5 space-y-3 font-mono text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 font-semibold uppercase">ACTIVE LOCATION:</span>
                          <span className="text-white font-extrabold text-right truncate max-w-[150px]">
                            {currentLocationName}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 font-semibold uppercase">TEMPERATURE:</span>
                          <span className="text-cyan-400 font-extrabold">
                            {currentTemperature !== undefined ? `${currentTemperature}°C` : "--"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 font-semibold uppercase">ATMOSPHERIC STATE:</span>
                          <span className="text-white font-bold uppercase">
                            {currentWeather === "SUNSHINE" ? "SUNNY" : currentWeather}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 font-semibold uppercase">INTERFERENCE:</span>
                          <span className="text-amber-400 font-bold">
                            {atmosphericInterference}
                          </span>
                        </div>
                      </div>

                      <p className="text-[9px] text-slate-500 leading-normal font-sans">
                        * Atmospheric simulation and environmental effects are updated dynamically on weather pattern state changes.
                      </p>
                    </div>

                    {/* Real-time Congestion Monitor */}
                    <div className="bg-[#0b0e12] border border-[#1b2531] rounded-xl p-5 shadow-xl space-y-4">
                      <div className="border-b border-[#1b2531] pb-3 flex items-center justify-between">
                        <h3 className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider flex items-center gap-2 animate-pulse">
                          <Flame className="w-4 h-4 text-red-500" />
                          REAL-TIME CONGESTION MONITOR
                        </h3>
                        <button
                          onClick={() => setIsFloorHeatmapEnabled(!isFloorHeatmapEnabled)}
                          className={`text-[8px] border px-2 py-0.5 rounded font-mono font-bold transition-all cursor-pointer ${
                            isFloorHeatmapEnabled
                              ? "bg-red-950 text-red-400 border-red-800 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.25)]"
                              : "bg-slate-950 text-slate-500 border-slate-900"
                          }`}
                        >
                          {isFloorHeatmapEnabled ? "FLOOR OVERLAY: ON" : "FLOOR OVERLAY: OFF"}
                        </button>
                      </div>

                      <div className="space-y-3 font-mono text-[11px]">
                        <div className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Active Gate Loads:</div>
                        <div className="bg-[#07090c] border border-[#1b2531]/40 rounded-lg p-3 space-y-2.5">
                          {(() => {
                            const gateEntries = Object.entries(gateCongestions) as [string, number][];
                            const clearestGateName = gateEntries.reduce((min, current) => current[1] < min[1] ? current : min, gateEntries[0])[0];
                            const activeSeatObj = selectedNewSeat || currentSeat || { section: "118", row: "K", seat: "14" };
                            
                            // Map row H, J, K, L to offsets
                            const rowOffsets: Record<string, number> = { H: -6, J: -2, K: 2, L: 6 };
                            const seatNo = parseInt(activeSeatObj.seat, 10) || 1;
                            const seatOffsetX = (seatNo - 5) * 1.5;
                            const seatOffsetZ = rowOffsets[activeSeatObj.row] || 0;
                            const seatX = -35 + seatOffsetX;
                            const seatZ = 40 + seatOffsetZ;

                            return gateEntries.map(([gateName, val]) => {
                              const isHigh = val >= 75;
                              const isMod = val >= 45 && val < 75;
                              const colorClass = isHigh ? "text-red-400" : isMod ? "text-amber-400" : "text-emerald-400";
                              const barBg = isHigh ? "bg-red-500" : isMod ? "bg-amber-500" : "bg-emerald-500";
                              const isClearest = gateName === clearestGateName;
                              const isActiveAnchor = (gateName.includes("Gate A") && fanActiveAnchor === "GATE_A") ||
                                                     (gateName.includes("Gate B") && fanActiveAnchor === "GATE_B") ||
                                                     (gateName.includes("Gate C") && fanActiveAnchor === "GATE_C") ||
                                                     (gateName.includes("Gate D") && fanActiveAnchor === "GATE_D");
                              const activeBorderClass = isActiveAnchor 
                                ? "border border-cyan-500 bg-cyan-950/20 shadow-[0_0_12px_rgba(34,211,238,0.25)]" 
                                : "border border-[#1b2531]/20";

                              // Dynamic walking distance estimation
                              let gateX = 0;
                              let gateZ = 0;
                              if (gateName.includes("Gate A")) { gateX = -55; gateZ = -55; }
                              else if (gateName.includes("Gate B")) { gateX = -55; gateZ = 55; }
                              else if (gateName.includes("Gate C")) { gateX = 55; gateZ = 55; }
                              else if (gateName.includes("Gate D")) { gateX = 55; gateZ = -55; }

                              const dx = gateX - seatX;
                              const dz = gateZ - seatZ;
                              const distance = Math.sqrt(dx * dx + dz * dz);
                              const congestionMultiplier = 1 + (val / 100) * 0.25;
                              const baseMinutes = distance * 0.08 * congestionMultiplier;
                              const minutes = Math.max(1, parseFloat(baseMinutes.toFixed(1)));
                              const meters = Math.round(distance * 5);

                              return (
                                <div
                                  key={gateName}
                                  onClick={() => {
                                    if (isActiveAnchor) {
                                      setFanCameraPos({ x: 0, y: 48, z: 75 });
                                      setFanLookAtPos({ x: 0, y: 0, z: 0 });
                                      setFanActiveAnchor(null);
                                    } else {
                                      if (gateName.includes("Gate A")) {
                                        setFanCameraPos({ x: -80, y: 20, z: -80 });
                                        setFanLookAtPos({ x: -55, y: 2.5, z: -55 });
                                        setFanActiveAnchor("GATE_A");
                                      } else if (gateName.includes("Gate B")) {
                                        setFanCameraPos({ x: -80, y: 20, z: 80 });
                                        setFanLookAtPos({ x: -55, y: 2.5, z: 55 });
                                        setFanActiveAnchor("GATE_B");
                                      } else if (gateName.includes("Gate C")) {
                                        setFanCameraPos({ x: 80, y: 20, z: 80 });
                                        setFanLookAtPos({ x: 55, y: 2.5, z: 55 });
                                        setFanActiveAnchor("GATE_C");
                                      } else if (gateName.includes("Gate D")) {
                                        setFanCameraPos({ x: 80, y: 20, z: -80 });
                                        setFanLookAtPos({ x: 55, y: 2.5, z: -55 });
                                        setFanActiveAnchor("GATE_D");
                                      }
                                    }
                                  }}
                                  className={`space-y-1.5 relative group cursor-pointer hover:bg-[#0e1319]/50 p-1.5 rounded transition-all duration-150 ${activeBorderClass}`}
                                >
                                  {/* Animated high-contrast border overlay */}
                                  {isActiveAnchor && (
                                    <motion.div
                                      className="absolute inset-0 rounded border-2 border-cyan-400 pointer-events-none z-10"
                                      animate={{
                                        boxShadow: [
                                          "0 0 2px rgba(34, 211, 238, 0.4)",
                                          "0 0 10px rgba(34, 211, 238, 0.85)",
                                          "0 0 2px rgba(34, 211, 238, 0.4)"
                                        ],
                                        borderColor: [
                                          "rgba(34, 211, 238, 0.4)",
                                          "rgba(34, 211, 238, 1)",
                                          "rgba(34, 211, 238, 0.4)"
                                        ]
                                      }}
                                      transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                      }}
                                    />
                                  )}
                                  <div className="flex justify-between items-center text-[10px]">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                      <span className="text-slate-300 font-bold uppercase truncate">{gateName}</span>
                                      {isClearest && (
                                        <span className="text-[7.5px] bg-emerald-950/90 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-black uppercase tracking-wider shrink-0 animate-pulse flex items-center gap-1 shadow-[0_0_6px_rgba(52,211,153,0.15)]">
                                          <span className="w-1 h-1 rounded-full bg-emerald-400 shrink-0" />
                                          FASTEST ENTRANCE
                                        </span>
                                      )}
                                    </div>
                                    <span className={`${colorClass} font-black shrink-0`}>{val}%</span>
                                  </div>
                                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-white/5">
                                    <motion.div
                                      initial={{ width: "0%" }}
                                      animate={{ width: `${val}%` }}
                                      transition={{ duration: 0.5 }}
                                      className={`h-full ${barBg} rounded-full`}
                                    />
                                  </div>

                                  {/* Dynamic Walking Estimates display */}
                                  <div className="flex justify-between items-center text-[9px] text-slate-400 font-mono">
                                    <div className="flex items-center gap-1">
                                      <span className="text-[7.5px] text-slate-500 uppercase font-semibold">Distance:</span>
                                      <span className="text-cyan-400 font-bold">{meters}m</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <span className="text-[7.5px] text-slate-500 uppercase font-semibold">Est. Walk:</span>
                                      <span className="text-amber-400 font-black animate-pulse">{minutes} min</span>
                                    </div>
                                  </div>

                                  {/* Rich Stadium Quadrant Gate Tooltip */}
                                  {(() => {
                                    const glowRgbaStart = isHigh ? "rgba(239, 68, 68, 0.4)" : isMod ? "rgba(245, 158, 11, 0.4)" : "rgba(16, 185, 129, 0.4)";
                                    const glowRgbaEnd = isHigh ? "rgba(239, 68, 68, 1)" : isMod ? "rgba(245, 158, 11, 1)" : "rgba(16, 185, 129, 1)";
                                    const shadowStart = isHigh ? "rgba(239, 68, 68, 0.15)" : isMod ? "rgba(245, 158, 11, 0.15)" : "rgba(16, 185, 129, 0.15)";
                                    const shadowEnd = isHigh ? "rgba(239, 68, 68, 0.35)" : isMod ? "rgba(245, 158, 11, 0.35)" : "rgba(16, 185, 129, 0.35)";

                                    return (
                                      <motion.div
                                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 w-60 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 flex flex-col bg-[#05070a]/90 backdrop-blur-md border rounded-lg p-3 z-50 text-[10px] space-y-1.5 font-mono"
                                        animate={{
                                          borderColor: [glowRgbaStart, glowRgbaEnd, glowRgbaStart],
                                          boxShadow: [
                                            `0 8px 32px 0 rgba(0,0,0,0.8), 0 0 4px ${shadowStart}`,
                                            `0 8px 32px 0 rgba(0,0,0,0.8), 0 0 14px ${shadowEnd}`,
                                            `0 8px 32px 0 rgba(0,0,0,0.8), 0 0 4px ${shadowStart}`
                                          ]
                                        }}
                                        transition={{
                                          duration: 2.5,
                                          repeat: Infinity,
                                          ease: "easeInOut"
                                        }}
                                      >
                                        {/* Header */}
                                        <div className="flex justify-between items-center border-b border-[#1b2531]/60 pb-1.5">
                                          <span className="text-cyan-400 font-bold text-[9.5px] uppercase tracking-wide truncate max-w-[140px]">
                                            {gateName}
                                          </span>
                                          <span className={`text-[7.5px] px-1.5 py-0.5 ${val >= 75 ? 'bg-red-950/80 text-red-400 border-red-900/60' : val >= 45 ? 'bg-amber-950/80 text-amber-400 border-amber-900/60' : 'bg-emerald-950/80 text-emerald-400 border-emerald-900/60'} border rounded font-semibold uppercase tracking-wider`}>
                                            {val >= 75 ? 'Critical' : val >= 45 ? 'Warning' : 'Optimal'}
                                          </span>
                                        </div>
                                        {/* Quadrant info */}
                                        <div className="space-y-0.5 text-left">
                                          <span className="text-slate-500 text-[8px] uppercase font-bold tracking-wider block">Stadium Quadrant:</span>
                                          <span className="text-slate-200 font-bold text-[9.5px] block">
                                            {gateName.includes("Gate A") ? "NORTH-WEST QUADRANT" :
                                             gateName.includes("Gate B") ? "SOUTH-WEST QUADRANT" :
                                             gateName.includes("Gate C") ? "SOUTH-EAST QUADRANT" :
                                             "NORTH-EAST QUADRANT"}
                                          </span>
                                        </div>
                                        {/* Occupancy */}
                                        <div className="space-y-0.5 text-left">
                                          <span className="text-slate-500 text-[8px] uppercase font-bold tracking-wider block">Current Occupancy Load:</span>
                                          <span className={`${colorClass} font-black text-xs block flex items-center gap-1.5`}>
                                            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                                            {val}% CAPACITY
                                          </span>
                                        </div>
                                        {/* Dynamic Walking Estimates inside Tooltip */}
                                        <div className="space-y-0.5 text-left pt-1 border-t border-[#1b2531]/40">
                                          <span className="text-slate-500 text-[8px] uppercase font-bold tracking-wider block">Route from Seat {activeSeatObj.section}-{activeSeatObj.row}-{activeSeatObj.seat}:</span>
                                          <span className="text-slate-200 font-black text-[10px] block flex justify-between items-center">
                                            <span>🚶 {minutes} MINS</span>
                                            <span className="text-cyan-400 font-bold">{meters} meters</span>
                                          </span>
                                        </div>
                                        {/* Description / Details */}
                                        <div className="text-[8.5px] text-slate-400 leading-normal pt-1.5 border-t border-[#1b2531]/40 text-left">
                                          {gateName.includes("Gate A") ? "Provides direct access to Concourse Sectors 101-112, 201-212 and main ADA wheelchair access ramp." :
                                           gateName.includes("Gate B") ? "Serves Concourse Sectors 113-124, 213-224. Positioned near primary south elevator bays." :
                                           gateName.includes("Gate C") ? "Main gate plaza for Sectors 125-136, 225-236. High-volume transit hub with ticketing." :
                                           "Access gate for Sectors 137-148, 237-248. Near express parking tramways & North concourse bridge."}
                                        </div>
                                        {/* Tooltip triangle arrow */}
                                        <motion.div
                                          className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent"
                                          style={{ borderTopStyle: "solid" }}
                                          animate={{
                                            borderTopColor: [glowRgbaStart, glowRgbaEnd, glowRgbaStart]
                                          }}
                                          transition={{
                                            duration: 2.5,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                          }}
                                        />
                                      </motion.div>
                                    );
                                  })()}
                                </div>
                              );
                            });
                          })()}
                        </div>

                        {/* Smart travel recommendation */}
                        {(() => {
                          const sortedGates = (Object.entries(gateCongestions) as [string, number][]).sort((a, b) => b[1] - a[1]);
                          const mostCongested = sortedGates[0][0];
                          const clearestGate = sortedGates[sortedGates.length - 1][0];
                          return (
                            <div className="bg-slate-950/80 p-3 border border-[#1b2531]/60 rounded text-[9.5px] text-slate-300 space-y-1.5 leading-relaxed">
                              <div className="flex items-center gap-1.5 font-bold text-amber-400 uppercase">
                                <ShieldAlert className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                                <span>SMART TRAFFIC ADVISORY</span>
                              </div>
                              <p>
                                <span className="text-red-400 font-bold">{mostCongested}</span> is currently experiencing peak spectator queues.
                              </p>
                              <p>
                                We recommend taking walkways toward <span className="text-emerald-400 font-bold">{clearestGate}</span> ({(gateCongestions as Record<string, number>)[clearestGate]}% queue load), which is currently operating under clear, optimal traffic conditions. This bypass saves you up to <strong className="text-white">6-10 minutes</strong>.
                              </p>
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    {/* ADA Wayfinding & Question Module */}
                    <div className="bg-[#0b0e12] border border-[#1b2531] rounded-xl p-5 shadow-xl space-y-4">
                      <div className="border-b border-[#1b2531] pb-3 flex items-center justify-between">
                        <h3 className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
                          <Accessibility className="w-4 h-4 text-sky-400" />
                          ADA SPECTATOR NAVIGATION
                        </h3>
                        <span className={`text-[8px] border px-1.5 py-0.5 rounded font-mono font-bold ${
                          stepFreePreference 
                            ? "bg-sky-950 text-sky-400 border-sky-800 animate-pulse" 
                            : "bg-slate-950 text-slate-500 border-slate-900"
                        }`}>
                          {stepFreePreference ? "STEP_FREE: ACTIVE" : "STANDARD PATH"}
                        </span>
                      </div>

                      {isAnalyzing ? (
                        <div className="py-8 flex flex-col items-center justify-center space-y-3 font-mono text-center">
                          <div className="w-8 h-8 rounded-full border-2 border-sky-950 border-t-sky-400 animate-spin" />
                          <div className="space-y-1">
                            <p className="text-[10px] text-sky-400 font-semibold tracking-wider uppercase animate-pulse">
                              {analysisStep || "DECODING FEEDS..."}
                            </p>
                          </div>
                        </div>
                      ) : !engineResult ? (
                        <div className="py-4 text-center space-y-2 text-slate-500 font-mono text-[10px]">
                          <ShieldAlert className="w-5 h-5 mx-auto text-slate-600 animate-bounce" />
                          <span>AWAITING ROUTE SELECTION OR INPUT</span>
                          <button
                            onClick={() => {
                              const activeQuery = "Where is Section 118 elevator? I need accessible directions.";
                              setQuery(activeQuery);
                              triggerQueryAnalysis(activeQuery, "FAN", stepFreePreference);
                            }}
                            className="mt-2 block mx-auto px-2.5 py-1 bg-sky-950/50 hover:bg-sky-900/60 border border-sky-800 hover:border-sky-700 text-sky-300 rounded text-[9px] cursor-pointer"
                          >
                            INITIALIZE ADA ELEVATOR ROUTE
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="bg-slate-950/60 p-2 border border-slate-900 rounded text-[10px] font-mono">
                            <span className="text-slate-500 block text-[8px] uppercase">QUERY:</span>
                            <span className="text-slate-300">"{engineResult.query || query}"</span>
                          </div>

                          {stepFreePreference && (
                            <div className="p-2 bg-sky-950/40 border border-sky-500/30 rounded flex items-start gap-1.5 text-[9px] font-mono text-sky-300">
                              <Accessibility className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5 animate-pulse" />
                              <div>
                                <span className="font-bold text-sky-200">✓ STEP-FREE WHEELCHAIR PATH ENABLED</span>
                              </div>
                            </div>
                          )}

                          {engineResult.fan_experience_payload && (
                            <div className="bg-[#07090c] border border-[#1b2531]/40 rounded p-2.5 space-y-1.5">
                              <div className="text-[8px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                                <Compass className="w-3 h-3 text-sky-400 animate-pulse" />
                                MONTERY ENGINE ADA RESOLUTION:
                              </div>
                              <div className="text-[10.5px] text-slate-200 leading-relaxed font-sans">
                                {engineResult.fan_experience_payload.navigation_directions_native_language || 
                                 engineResult.fan_experience_payload.navigation_directions_english_fallback}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Presets and custom question */}
                      <div className="pt-2 border-t border-[#1b2531]/50 space-y-2">
                        <div className="text-[8.5px] font-mono text-slate-500 uppercase tracking-wider font-bold">
                          PRESET ROUTE SCENARIOS:
                        </div>
                        <div className="flex flex-col gap-1">
                          {[
                            { title: "📍 Elevator 118 Path Request", query: "Where is Section 118 elevator? I need accessible directions." },
                            { title: "🍔 Route to Closest ADA Concessions", query: "Show me how to reach Gate C concessions from wheelchair seating." }
                          ].map((scen, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setQuery(scen.query);
                                triggerQueryAnalysis(scen.query, "FAN", stepFreePreference);
                              }}
                              className={`text-left px-2 py-1 rounded border text-[9.5px] font-sans transition-all cursor-pointer ${
                                (engineResult?.query === scen.query || query === scen.query)
                                  ? "bg-sky-950/60 border-sky-500/50 text-white font-medium"
                                  : "bg-[#111827]/40 border-slate-900 hover:border-slate-800 text-slate-400 hover:text-slate-300"
                              }`}
                            >
                              {scen.title}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#1b2531]/50 space-y-1.5">
                        <input
                          type="text"
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder="Ask where elevators, restrooms, gates are..."
                          className="w-full bg-[#111827] border border-slate-800 rounded px-2 py-1 text-[10.5px] text-white focus:outline-none focus:border-sky-500 placeholder:text-slate-600 font-sans"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && query.trim() && !isAnalyzing) {
                              triggerQueryAnalysis(query, "FAN", stepFreePreference);
                            }
                          }}
                        />
                        <button
                          onClick={() => triggerQueryAnalysis(query, "FAN", stepFreePreference)}
                          disabled={!query.trim() || isAnalyzing}
                          className="w-full py-1.5 bg-blue-950/80 hover:bg-blue-900 border border-blue-800 hover:border-blue-700 text-white text-[10px] font-bold rounded cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed font-mono uppercase tracking-wider"
                        >
                          SEND ACCESSIBILITY QUESTION
                        </button>
                      </div>

                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: ORDER FOOD & CONCESSIONS */}
              {fanActiveTab === "food" && (
                <div className="bg-[#0b0e12] border border-[#1b2531] rounded-xl p-6 shadow-xl flex flex-col gap-6 w-full">
                  <div className="border-b border-[#1b2531] pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                        <Utensils className="w-5 h-5 text-amber-400" />
                        Smart Stadium Concessions
                      </h3>
                      <p className="text-xs text-slate-400 font-sans mt-0.5">
                        Pre-order food & drinks directly to your seat zone. Instant express pickup lanes at Gate C.
                      </p>
                    </div>
                    <span className="text-[10px] bg-amber-950/40 text-amber-400 border border-amber-900 px-2.5 py-1 rounded font-mono font-bold tracking-wider">
                      CONCESSIONS ACTIVE
                    </span>
                  </div>

                  {/* Two columns: Menu list and Cart panel */}
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
                    
                    {/* Menu items Column */}
                    <div className="xl:col-span-2 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { id: "f-1", name: "Azteca Vegan Taco Duo", price: 12.50, desc: "Soft corn tortillas, seasoned plant-protein, fresh cilantro, lime juice, spicy salsa verde.", tags: ["VEGAN", "GLUTEN_FREE"] },
                          { id: "f-2", name: "MetLife Premium Burger", price: 15.00, desc: "Double Angus beef patty, melted cheddar, lettuce, organic tomato, special operational sauce.", tags: ["POPULAR", "SIGNATURE"] },
                          { id: "f-3", name: "Classic Stadium Footlong", price: 8.50, desc: "Classic all-beef stadium hot dog, mustard, sweet relish, toasted split-top bun.", tags: ["CLASSIC"] },
                          { id: "f-4", name: "Loaded Cheese Nachos", price: 11.00, desc: "Crispy tortilla chips, creamy warm cheddar blend, black beans, sour cream, pickled peppers.", tags: ["VEGETARIAN"] },
                          { id: "f-5", name: "Golden Churros Basket", price: 8.00, desc: "Fresh hot fried dough, cinnamon sugar dusting, side of warm rich Belgian chocolate dip.", tags: ["SWEET"] },
                          { id: "f-6", name: "Tournament Soda Elixir", price: 5.00, desc: "Refreshing carbonated wild berry drink served in a collectible FIFA 2026 souvenir cup.", tags: ["COLLECTIBLE"] }
                        ].map((food) => (
                          <div key={food.id} className="bg-slate-950/40 border border-slate-900 rounded-lg p-4 flex flex-col justify-between hover:border-slate-800 transition-all">
                            <div className="space-y-1.5">
                              <div className="flex justify-between items-start">
                                <span className="font-bold text-xs text-white uppercase font-sans leading-snug">{food.name}</span>
                                <span className="text-xs text-amber-400 font-mono font-bold font-semibold">${food.price.toFixed(2)}</span>
                              </div>
                              <p className="text-[10.5px] text-slate-400 font-sans leading-relaxed">{food.desc}</p>
                              <div className="flex gap-1 flex-wrap pt-1">
                                {food.tags.map(t => (
                                  <span key={t} className="text-[8px] bg-slate-900 text-slate-500 px-1.5 py-0.5 rounded font-mono font-bold">{t}</span>
                                ))}
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setFoodCart((prev) => {
                                  const existing = prev.find(item => item.id === food.id);
                                  if (existing) {
                                    return prev.map(item => item.id === food.id ? { ...item, qty: item.qty + 1 } : item);
                                  }
                                  return [...prev, { id: food.id, name: food.name, price: food.price, qty: 1 }];
                                });
                                playDispatchSuccessSound();
                              }}
                              className="mt-3 py-1 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-900/60 hover:border-amber-500/50 text-amber-400 text-[10px] font-mono font-bold rounded transition-all uppercase tracking-wider cursor-pointer"
                            >
                              Add to Concessions Order
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Cart / Order Status Column */}
                    <div className="col-span-1 space-y-4">
                      
                      {/* Cart Panel */}
                      <div className="bg-[#07090c] border border-slate-900 rounded-lg p-4 flex flex-col gap-3 font-mono">
                        <div className="border-b border-slate-900 pb-2 flex justify-between items-center">
                          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold flex items-center gap-2">
                            <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                            CONCESSIONS BASKET
                          </span>
                          {foodCart.length > 0 && (
                            <button
                              onClick={() => setFoodCart([])}
                              className="text-[9px] text-red-500 hover:text-red-400 uppercase tracking-wider"
                            >
                              Clear Basket
                            </button>
                          )}
                        </div>

                        {foodCart.length === 0 ? (
                          <div className="py-8 text-center text-slate-500 text-[10px] font-mono space-y-1">
                            <ShoppingBag className="w-6 h-6 mx-auto text-slate-700 animate-pulse" />
                            <p>BASKET IS CURRENTLY EMPTY</p>
                            <p className="text-[8.5px] text-slate-600">Select food items from the menu to build your concessions order.</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                              {foodCart.map((item) => (
                                <div key={item.id} className="flex justify-between items-center text-[11px] bg-slate-950/50 border border-slate-950 p-1.5 rounded">
                                  <div className="flex-1 min-w-0 pr-2">
                                    <span className="text-white block truncate text-[10px]">{item.name}</span>
                                    <span className="text-slate-500 text-[9px]">${item.price.toFixed(2)} each</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      onClick={() => {
                                        setFoodCart(prev => prev.map(i => i.id === item.id ? { ...i, qty: Math.max(1, i.qty - 1) } : i));
                                      }}
                                      className="w-4 h-4 bg-slate-900 border border-slate-800 text-slate-400 flex items-center justify-center rounded text-xs hover:border-slate-700"
                                    >
                                      -
                                    </button>
                                    <span className="text-slate-300 font-bold text-[10px] w-3 text-center">{item.qty}</span>
                                    <button
                                      onClick={() => {
                                        setFoodCart(prev => prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
                                      }}
                                      className="w-4 h-4 bg-slate-900 border border-slate-800 text-slate-400 flex items-center justify-center rounded text-xs hover:border-slate-700"
                                    >
                                      +
                                    </button>
                                    <button
                                      onClick={() => {
                                        setFoodCart(prev => prev.filter(i => i.id !== item.id));
                                      }}
                                      className="text-red-500 hover:text-red-400 text-[9px] ml-1 uppercase"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Math Summary */}
                            <div className="border-t border-slate-900 pt-3 space-y-1.5 text-[10px] text-slate-400">
                              <div className="flex justify-between">
                                <span>SUBTOTAL:</span>
                                <span className="text-white font-bold">${foodCart.reduce((acc, i) => acc + (i.price * i.qty), 0).toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>STADIUM SURCHARGE (8.5%):</span>
                                <span className="text-white font-bold">${(foodCart.reduce((acc, i) => acc + (i.price * i.qty), 0) * 0.085).toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-amber-400 font-bold border-t border-dashed border-slate-900 pt-1.5 text-[11px]">
                                <span>TOTAL AMOUNT:</span>
                                <span>${(foodCart.reduce((acc, i) => acc + (i.price * i.qty), 0) * 1.085).toFixed(2)}</span>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                const totalVal = parseFloat((foodCart.reduce((acc, i) => acc + (i.price * i.qty), 0) * 1.085).toFixed(2));
                                setActiveOrder({
                                  orderNo: "FIFA-WC-2026-" + Math.floor(1000 + Math.random() * 9000),
                                  items: [...foodCart],
                                  total: totalVal,
                                  secondsLeft: 30,
                                  status: "PREPARING"
                                });
                                setFoodCart([]);
                                playDispatchSuccessSound();
                              }}
                              className="w-full py-2 bg-blue-600 hover:bg-blue-500 border border-blue-500 text-white font-bold text-xs rounded transition-all duration-200 hover:scale-105 uppercase tracking-wider font-mono cursor-pointer shadow-lg shadow-blue-950/30"
                            >
                              🚀 Submit Express Concessions Order
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Active Order Tracker */}
                      {activeOrder && (
                        <div className="bg-[#0b0e12] border border-amber-900/40 rounded-lg p-4 font-mono text-[10.5px] space-y-3 shadow-xl">
                          <div className="border-b border-[#1b2531]/40 pb-2 flex justify-between items-center">
                            <span className="text-slate-400 font-bold uppercase flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                              LIVE ORDER STATUS
                            </span>
                            <span className="text-slate-400 text-[9px]">{activeOrder.orderNo}</span>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400">PREPARATION STATUS:</span>
                              <span className={`font-extrabold px-2 py-0.5 rounded text-[10px] ${
                                activeOrder.status === "READY" 
                                  ? "bg-emerald-950 border border-emerald-800 text-emerald-400 animate-pulse" 
                                  : "bg-amber-950 border border-amber-800 text-amber-400 animate-pulse"
                              }`}>
                                {activeOrder.status === "READY" ? "READY FOR PICKUP" : "PREPARING IN CONCESSIONS"}
                              </span>
                            </div>

                            {activeOrder.status === "PREPARING" ? (
                              <div className="space-y-1">
                                <div className="flex justify-between">
                                  <span className="text-slate-400">ESTIMATED TIMER:</span>
                                  <span className="text-white font-bold">{activeOrder.secondsLeft} SECONDS REMAINING</span>
                                </div>
                                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-900">
                                  <div 
                                    className="bg-amber-500 h-full transition-all duration-1000"
                                    style={{ width: `${(30 - activeOrder.secondsLeft) / 30 * 100}%` }}
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded text-emerald-400 leading-normal text-[10px]">
                                <span className="font-extrabold block text-emerald-300">✓ CHUTE PICKUP READY AT GATE C</span>
                                <p className="text-[9.5px] text-emerald-400/80 mt-1">Please head to Concourse Chute #4 near Gate C. Display ticket barcode {activeOrder.orderNo} to scanner.</p>
                              </div>
                            )}

                            <div className="pt-2 border-t border-[#1b2531]/30 text-[9px] text-slate-400">
                              <span>
                                {currentSeat && currentSeat.section 
                                  ? `Express order mapped to spectator zone: seat ${currentSeat.section}-${currentSeat.row}-${currentSeat.seat}.` 
                                  : "Express order mapped to spectator zone: Unassigned Seat."}
                              </span>
                            </div>
                          </div>

                          {activeOrder.status === "READY" && (
                            <button
                              onClick={() => setActiveOrder(null)}
                              className="w-full py-1 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 rounded text-[9.5px] uppercase cursor-pointer"
                            >
                              Acknowledge and Dismiss Order
                            </button>
                          )}
                        </div>
                      )}

                    </div>

                  </div>
                </div>
              )}

              {/* TAB 3: STAFF HELP */}
              {fanActiveTab === "help" && (
                <div className="bg-[#0b0e12] border border-[#1b2531] rounded-xl p-6 shadow-xl flex flex-col gap-6 w-full">
                  <div className="border-b border-[#1b2531] pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-red-400" />
                        Spectator Staff Assistance Helpdesk
                      </h3>
                      <p className="text-xs text-slate-400 font-sans mt-0.5">
                        Submit maintenance, security, or ticketing requests. Incidents synchronize directly into the administrative command centers.
                      </p>
                    </div>
                    <span className="text-[10px] bg-red-950/40 text-red-400 border border-red-900 px-2.5 py-1 rounded font-mono font-bold tracking-wider uppercase">
                      PERSISTENT DB CONNECTION
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    
                    {/* Help Form */}
                    <div className="lg:col-span-2 space-y-4">
                      {helpTicketSubmitted ? (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-red-950/10 border border-red-500/20 rounded-xl p-6 space-y-4"
                        >
                          <div className="w-12 h-12 rounded-full bg-red-950/40 border border-red-500/50 flex items-center justify-center text-red-400 text-xl animate-pulse">
                            ✓
                          </div>
                          <div className="space-y-1.5">
                            <h4 className="text-sm font-bold text-slate-200 tracking-tight font-mono uppercase">TICKET SUBMITTED SUCCESSFULLY & ACTIVE IN DATABASE</h4>
                            <p className="text-xs text-slate-400 leading-relaxed font-sans">
                              Your incident request has been committed to the server-side digital twin telemetry board. Tactical operations room specialists have been dispatched. Standard triage protocol has initialized.
                            </p>
                          </div>

                          <div className="p-4 bg-slate-950/80 border border-slate-900 rounded-lg space-y-2.5 font-mono text-[10.5px]">
                            <div className="flex justify-between">
                              <span className="text-slate-400">TICKET CATEGORY:</span>
                              <span className="text-red-400 font-extrabold uppercase">{helpCategory.replace("_", " ")}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">REPORTED LOCATION:</span>
                              <span className="text-white font-bold uppercase">{helpLocation}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">INCIDENT ID:</span>
                              <span className="text-cyan-400 font-bold uppercase font-mono">INC-{Math.floor(1000 + Math.random() * 9000)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">CURRENT STATUS:</span>
                              <span className="text-amber-400 font-extrabold uppercase tracking-widest animate-pulse">TRIAGING - AGENT DISPATCHED</span>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setHelpTicketSubmitted(false);
                              setHelpDescription("");
                            }}
                            className="py-1.5 px-4 bg-red-950/40 hover:bg-red-900/40 border border-red-800/60 text-red-400 text-xs font-mono font-bold rounded transition-all uppercase cursor-pointer"
                          >
                            Submit Another Support Ticket
                          </button>
                        </motion.div>
                      ) : (
                        <div className="space-y-4 font-mono text-xs bg-slate-950/40 border border-[#1b2531]/40 rounded-xl p-5">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label htmlFor="volunteer-incident-classification-select" className="text-slate-400 block font-bold text-[10px] uppercase">INCIDENT CLASSIFICATION:</label>
                              <select
                                id="volunteer-incident-classification-select"
                                value={helpCategory}
                                onChange={(e) => setHelpCategory(e.target.value)}
                                aria-label="Incident Classification"
                                className="w-full bg-[#111827] border border-slate-800 text-white rounded px-3 py-2 focus:outline-none focus:border-red-500 cursor-pointer font-sans"
                              >
                                <option value="FACILITY_ISSUE">FACILITY / INFRASTRUCTURE DAMAGE</option>
                                <option value="MEDICAL_EMERGENCY">SPECTATOR MEDICAL INCIDENT</option>
                                <option value="SECURITY_HAZARD">UNAUTHORIZED AREA BREACH / ROWDINESS</option>
                                <option value="TICKETING_CRISIS">TURNSTILE SCAN ERROR</option>
                                <option value="COMPLIANCE_VIOLATION">BAG POLICY COMPLIANCE BREACH</option>
                              </select>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-slate-400 block font-bold text-[10px] uppercase">SEAT / REPORTED ZONE:</label>
                              <input
                                type="text"
                                value={helpLocation}
                                onChange={(e) => setHelpLocation(e.target.value)}
                                placeholder="Section, Row, Seat..."
                                className="w-full bg-[#111827] border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-red-500 font-sans"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-slate-400 block font-bold text-[10px] uppercase">EXPLAIN ISSUE DETAILS:</label>
                            <textarea
                              value={helpDescription}
                              onChange={(e) => setHelpDescription(e.target.value)}
                              placeholder="Please explain the facility issue, medical need, or security concern clearly..."
                              rows={4}
                              className="w-full bg-[#111827] border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-red-500 font-sans resize-none"
                            />
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="ada-help"
                              checked={helpAdaRequired}
                              onChange={(e) => setHelpAdaRequired(e.target.checked)}
                              className="w-4 h-4 bg-slate-900 border-slate-800 rounded text-red-500 focus:ring-red-500 cursor-pointer"
                            />
                            <label htmlFor="ada-help" className="text-slate-400 font-sans font-medium text-[11px] cursor-pointer">
                              This request requires step-free ADA supervisor mobility routing assistance.
                            </label>
                          </div>

                          <button
                            onClick={() => {
                              if (!helpDescription.trim()) return;
                              
                              // Post to incidents endpoint
                              fetch("/api/incidents", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  classification: helpCategory,
                                  query: `Fan Incident Ticket: ${helpDescription} (Reported by seat: ${helpLocation})`,
                                  activeAnchor: helpLocation.includes("118") ? "SECTION_118" : "GLOBAL",
                                  coordinates: helpLocation.includes("118") ? { x: -35, y: 10, z: 40 } : { x: 0, y: 10, z: 0 },
                                  glowColor: helpCategory === "MEDICAL_EMERGENCY" ? "#ef4444" : helpCategory === "SECURITY_HAZARD" ? "#f43f5e" : "#eab308",
                                  actionPlan: [
                                    "Triage incident in Operations Command Room",
                                    `Acknowledge Fan report at seat location ${helpLocation}`,
                                    `Dispatch nearest Venue Staff supervisor to resolve ${helpCategory}`
                                  ],
                                  verbalRadioBriefingScript: `OpsCortex to floor supervisors: New spectator ticket submitted from ${helpLocation}. Category is ${helpCategory}. Proceed to investigate. Over.`,
                                  cameraPos: { x: -35, y: 35, z: 45 },
                                  lookAtPos: { x: -35, y: 10, z: 40 }
                                })
                              })
                              .then(() => fetchIncidents())
                              .catch(err => console.error("Database POST failed", err));

                              setHelpTicketSubmitted(true);
                              setHelpIconPulseActive(true);
                              playDispatchSuccessSound();
                            }}
                            disabled={!helpDescription.trim()}
                            className="w-full py-2.5 bg-red-600 hover:bg-red-500 border border-red-700 text-white font-bold text-xs rounded transition-all uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                          >
                            ⚠️ Broadcast Urgent Support Request
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Safety Guidelines sidebar */}
                    <div className="bg-slate-950/40 border border-slate-900 rounded-xl p-5 space-y-4 text-slate-400 text-xs">
                      <h4 className="font-bold text-white font-mono text-[10px] uppercase tracking-wider border-b border-slate-900 pb-2">SPECTATOR SAFETY MATRICES</h4>
                      <p className="font-sans leading-relaxed text-[11px]">
                        The Montery Unified smart monitoring suite uses distributed high-fidelity telemetry feeds across all concourses. Any ticket submitted here is dynamically logged in the system database.
                      </p>
                      <div className="space-y-3 font-mono text-[9px] pt-1 leading-normal">
                        <div className="flex gap-2">
                          <span className="text-red-400">🚨</span>
                          <div>
                            <span className="text-white font-bold block uppercase">HIGH THREAT CHANNELS:</span>
                            <span>First aid and rowdiness reports trigger priority supervisor dispatches and CCTV lock-on streams.</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-cyan-400">♿</span>
                          <div>
                            <span className="text-white font-bold block uppercase">ADA ASSIST ROUTE:</span>
                            <span>Marking ADA triggers step-free routing algorithms on target field crew tablets automatically.</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* TAB 4: EDIT MY SEAT */}
              {fanActiveTab === "seat" && (
                <div className="bg-[#0b0e12] border border-[#1b2531] rounded-xl p-6 shadow-xl flex flex-col gap-6 w-full font-mono text-xs">
                  <div className="border-b border-[#1b2531] pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                        <Home className="w-5 h-5 text-emerald-400" />
                        Spectator Seat Assignment & Migration
                      </h3>
                      <p className="text-xs text-slate-400 font-sans mt-0.5 font-sans">
                        Update your tournament ticket seating block. View and select vacant seats on the visual stadium grid dynamically.
                      </p>
                    </div>
                    <span className="text-[10px] bg-emerald-950/40 text-emerald-400 border border-emerald-900 px-2.5 py-1 rounded font-mono font-bold tracking-wider">
                      LEDGER CONNECTED
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
                    
                    {/* Visual Seat Map Grid */}
                    <div className="lg:col-span-3 space-y-4">
                      <div className="bg-slate-950/60 border border-slate-900 rounded-xl p-5 space-y-4">
                        <div className="text-center font-bold text-[9px] text-slate-500 uppercase tracking-widest border-b border-slate-900 pb-2">
                          🏟️ SECTION 118 SEATING MATRIX GRID
                        </div>

                        {/* Real-time Seat Occupancy / Availability Notification Banner */}
                        {seatSelectionError && (
                          <div className="bg-red-950/40 border border-red-500/50 rounded-lg p-3 flex items-start gap-2.5 text-red-200 text-[10.5px] animate-pulse">
                            <span className="text-sm">⚠️</span>
                            <div className="flex-1 font-mono">
                              <span className="font-extrabold block uppercase tracking-wide text-red-400">SEAT UNAVAILABLE</span>
                              <span className="text-slate-300 font-sans">{seatSelectionError}</span>
                            </div>
                            <button 
                              onClick={() => setSeatSelectionError(null)}
                              className="text-slate-400 hover:text-white font-bold px-1.5 focus:outline-none cursor-pointer text-[10px]"
                            >
                              ✕
                            </button>
                          </div>
                        )}

                        {/* Interactive Seat map */}
                        <div ref={seatMatrixRef} className="flex flex-col gap-2.5 items-center py-4 relative overflow-visible">
                          {/* Animated seat movement connector */}
                          {trailPath && selectedNewSeat && (selectedNewSeat.row !== currentSeat?.row || selectedNewSeat.seat !== currentSeat?.seat) && (
                            <>
                              {/* SVG path connecting the two seats */}
                              <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-10">
                                <defs>
                                  <linearGradient id="seat-trail-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.85" />
                                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.85" />
                                  </linearGradient>
                                  <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="3" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                  </filter>
                                </defs>
                                
                                {/* Background glow path */}
                                <motion.path
                                  d={`M ${trailPath.x1} ${trailPath.y1} Q ${(trailPath.x1 + trailPath.x2)/2} ${Math.min(trailPath.y1, trailPath.y2) - 30}, ${trailPath.x2} ${trailPath.y2}`}
                                  fill="none"
                                  stroke="#22d3ee"
                                  strokeWidth="3.5"
                                  filter="url(#glow-filter)"
                                  opacity="0.18"
                                />
                                
                                {/* Dashed trajectory path */}
                                <motion.path
                                  d={`M ${trailPath.x1} ${trailPath.y1} Q ${(trailPath.x1 + trailPath.x2)/2} ${Math.min(trailPath.y1, trailPath.y2) - 30}, ${trailPath.x2} ${trailPath.y2}`}
                                  fill="none"
                                  stroke="url(#seat-trail-grad)"
                                  strokeWidth="1.5"
                                  strokeDasharray="4 4"
                                  initial={{ strokeDashoffset: 0 }}
                                  animate={{ strokeDashoffset: -20 }}
                                  transition={{
                                    repeat: Infinity,
                                    duration: 1.2,
                                    ease: "linear"
                                  }}
                                />
                              </svg>

                              {/* Traveling physical avatar dot */}
                              <motion.div
                                className="absolute pointer-events-none z-20 flex items-center justify-center bg-gradient-to-r from-cyan-400 to-amber-400 text-[10px] rounded-full border border-white/40 shadow-[0_0_12px_rgba(34,211,238,0.75)]"
                                style={{
                                  width: "18px",
                                  height: "18px",
                                  left: 0,
                                  top: 0,
                                }}
                                animate={{
                                  x: [trailPath.x1 - 9, (trailPath.x1 + trailPath.x2)/2 - 9, trailPath.x2 - 9],
                                  y: [trailPath.y1 - 9, Math.min(trailPath.y1, trailPath.y2) - 39, trailPath.y2 - 9],
                                  scale: isChangingSeat ? [1, 1.45, 1.1] : [1, 1.2, 1],
                                }}
                                transition={{
                                  duration: isChangingSeat ? 1.2 : 2.2,
                                  ease: "easeInOut",
                                  repeat: isChangingSeat ? 0 : Infinity,
                                  repeatType: "loop",
                                }}
                              >
                                {isChangingSeat ? (
                                  <motion.span
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                                    className="text-[9px]"
                                  >
                                    🔄
                                  </motion.span>
                                ) : (
                                  "👤"
                                )}
                              </motion.div>
                            </>
                          )}

                          {["Row H", "Row J", "Row K", "Row L"].map((rowName) => {
                            // Extract row letter
                            const rLetter = rowName.split(" ")[1];
                            return (
                              <div key={rowName} className="flex items-center gap-2">
                                <span className="w-12 text-right text-[10px] font-mono text-slate-500 font-bold pr-2">{rowName}</span>
                                <div className="flex gap-1.5">
                                  {Array.from({ length: 10 }).map((_, i) => {
                                    const seatNo = String(i + 1);
                                    
                                    // Check if occupied by another fan in the database
                                    const isDbOccupied = fanAccountsList.some((fan) => {
                                      const sameStadium = fan.selectedStadium === fanSelectedStadiumId;
                                      const sameSeat = fan.seat && 
                                                       fan.seat.section === "118" && 
                                                       fan.seat.row === rLetter && 
                                                       fan.seat.seat === seatNo;
                                      const differentFan = fan.id !== loggedInUser?.details?.id;
                                      return sameStadium && sameSeat && differentFan;
                                    });

                                    // Determine occupancy logic (static + database-backed)
                                    const isPreOccupied = isDbOccupied || 
                                                          ((rLetter === "H" && [2, 4, 5, 9].includes(i)) || 
                                                          (rLetter === "J" && [1, 3, 6, 7].includes(i)) || 
                                                          (rLetter === "K" && [13, 14, 15, 16].includes(i) ? false : [1, 2, 5, 10].includes(i)) || 
                                                          (rLetter === "L" && [3, 4, 8, 9].includes(i)));
                                    
                                    const isCurrent = currentSeat?.row === rLetter && currentSeat?.seat === seatNo;
                                    const isSelected = selectedNewSeat?.row === rLetter && selectedNewSeat?.seat === seatNo;
                                    
                                    return (
                                      <button
                                        key={seatNo}
                                        data-seat-id={`seat-${rLetter}-${seatNo}`}
                                        onClick={async () => {
                                          setSeatSelectionError(null);
                                          setSeatChangeSuccess(false);

                                          // Real-time Database Occupancy verification check
                                          try {
                                            const response = await fetch("/api/fans");
                                            const latestFans = await response.json();
                                            if (Array.isArray(latestFans)) {
                                              // Refresh visual grid data with latest database state
                                              setFanAccountsList(latestFans);

                                              const isDbOccupiedRealtime = latestFans.some((fan: any) => {
                                                const sameStadium = fan.selectedStadium === fanSelectedStadiumId;
                                                const sameSeat = fan.seat && 
                                                                 fan.seat.section === "118" && 
                                                                 fan.seat.row === rLetter && 
                                                                 fan.seat.seat === seatNo;
                                                const differentFan = fan.id !== loggedInUser?.details?.id;
                                                return sameStadium && sameSeat && differentFan;
                                              });

                                              // If occupied in database or statically, prevent selection
                                              if (isDbOccupiedRealtime || ((rLetter === "H" && [2, 4, 5, 9].includes(i)) || 
                                                                          (rLetter === "J" && [1, 3, 6, 7].includes(i)) || 
                                                                          (rLetter === "K" && [13, 14, 15, 16].includes(i) ? false : [1, 2, 5, 10].includes(i)) || 
                                                                          (rLetter === "L" && [3, 4, 8, 9].includes(i)))) {
                                                setSeatSelectionError(`Seat ${rLetter}-${seatNo} is Unavailable. It is already booked by another spectator.`);
                                                playLowFrequencyAlertSound();
                                                return;
                                              }
                                            }
                                          } catch (err) {
                                            console.error("Real-time occupancy check failed:", err);
                                          }

                                          // If vacant, permit selection
                                          setSelectedNewSeat({ section: "118", row: rLetter, seat: seatNo });
                                        }}
                                        className={`w-6 h-6 rounded text-[8px] font-bold flex items-center justify-center transition-all cursor-pointer ${
                                          isCurrent 
                                            ? "bg-cyan-500 text-slate-950 ring-2 ring-cyan-400 font-extrabold" 
                                            : isSelected 
                                            ? "bg-amber-500 text-slate-950 font-extrabold ring-2 ring-amber-400" 
                                            : isPreOccupied 
                                            ? "bg-slate-900 text-slate-700 border border-slate-950 hover:border-red-500/50" 
                                            : "bg-emerald-950 text-emerald-400 border border-emerald-900/40 hover:bg-emerald-900/60 hover:text-white"
                                        }`}
                                        title={`${rowName} Seat ${seatNo}`}
                                      >
                                        {seatNo}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Legends */}
                        <div className="flex justify-center gap-6 text-[9.5px] text-slate-500 pt-2 border-t border-slate-900/60">
                          <div className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded bg-cyan-500" />
                            <span>Your Seat</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded bg-amber-500" />
                            <span>New Selected</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded bg-emerald-950 border border-emerald-900/40" />
                            <span>Vacant / Available</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded bg-slate-900" />
                            <span>Occupied</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Seat Receipt & World Cup Ticket Mockup column */}
                    <div className="lg:col-span-2 space-y-4">
                      
                      {selectedNewSeat && !seatChangeSuccess && (
                        <div className="bg-slate-950/60 border border-slate-900 rounded-xl p-4 space-y-3.5">
                          <h4 className="font-bold text-white text-[10px] uppercase tracking-wider">MIGRATION LEDGER DISPATCH</h4>
                          <div className="space-y-1.5 text-[11px] leading-relaxed">
                            <p className="text-slate-400 font-sans">You have requested seat migration within Section 118:</p>
                            <div className="bg-slate-950 p-3 rounded border border-slate-900 space-y-1 font-mono text-[10.5px]">
                              <div className="flex justify-between">
                                <span className="text-slate-500">ORIGINAL SEAT:</span>
                                <span className="text-white font-bold">
                                  {currentSeat && currentSeat.row 
                                    ? `SEC 118, ROW ${currentSeat.row}, SEAT ${currentSeat.seat}` 
                                    : "NONE (NEW REGISTER)"}
                                </span>
                              </div>
                              <div className="flex justify-between text-amber-400">
                                <span>NEW PROPOSED SEAT:</span>
                                <span className="font-bold">SEC 118, ROW {selectedNewSeat.row}, SEAT {selectedNewSeat.seat}</span>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setIsChangingSeat(true);
                              setSeatSelectionError(null);
                              if (loggedInUser?.details?.id) {
                                fetch("/api/fans/seat", {
                                  method: "PUT",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({
                                    fanId: loggedInUser.details.id,
                                    seat: selectedNewSeat
                                  })
                                }).then(res => {
                                  if (!res.ok) {
                                    return res.json().then(errData => {
                                      throw new Error(errData.error || "Failed to update seat");
                                    });
                                  }
                                  return res.json();
                                })
                                .then(updatedFan => {
                                  setLoggedInUser(prev => prev ? { ...prev, details: updatedFan } : null);
                                  setCurrentSeat(selectedNewSeat);
                                  setSeatChangeSuccess(true);
                                  playDispatchSuccessSound();
                                  fetchFanAccounts();
                                  setIsChangingSeat(false);
                                }).catch(err => {
                                  console.error("Failed to persist seat selection:", err);
                                  setSeatSelectionError(err.message || "Failed to confirm seat. The seat might have been booked.");
                                  setIsChangingSeat(false);
                                  playLowFrequencyAlertSound();
                                  // Reset selected seat since it is unavailable
                                  setSelectedNewSeat(null);
                                });
                              } else {
                                setTimeout(() => {
                                  setCurrentSeat(selectedNewSeat);
                                  setIsChangingSeat(false);
                                  setSeatChangeSuccess(true);
                                  playDispatchSuccessSound();
                                }, 1200);
                              }
                            }}
                            disabled={isChangingSeat}
                            className="w-full py-2 bg-blue-600 hover:bg-blue-500 border border-blue-500 text-white font-bold rounded transition-all duration-200 hover:scale-105 uppercase tracking-wider font-mono cursor-pointer shadow-lg shadow-blue-950/30"
                          >
                            {isChangingSeat ? "🔄 Writing To Ticketing Ledger..." : "✓ Confirm Seat Assignment Migration"}
                          </button>
                        </div>
                      )}

                      {/* Ticketing Board Visual Mockup */}
                      <div className="bg-gradient-to-br from-[#0c1015] to-[#040608] border border-cyan-500/20 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.05)] relative font-sans">
                        
                        {/* Header ticket strip */}
                        <div className="bg-[#0b0e12] border-b border-cyan-950 p-4 text-center space-y-1">
                          <span className="text-[8px] bg-cyan-950/60 text-cyan-400 border border-cyan-900 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-widest">FIFA WORLD CUP 2026™</span>
                          <h4 className="text-white font-bold font-mono tracking-tight text-xs uppercase pt-1">OFFICIAL DIGITAL MATCH PASS</h4>
                        </div>

                        {/* Core info */}
                        <div className="p-4 space-y-3.5">
                          <div className="flex justify-between border-b border-slate-900/40 pb-2 text-[10px]">
                            <div>
                              <span className="text-slate-400 block uppercase font-mono text-[8.5px]">HOST STADIUM:</span>
                              <span className="text-slate-200 font-bold font-mono text-[10.5px] uppercase">{currentStadiumName}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-slate-400 block uppercase font-mono text-[8.5px]">DATE & TIME:</span>
                              <span className="text-slate-200 font-bold font-mono text-[10.5px]">JULY 19, 2026 • 15:00</span>
                            </div>
                          </div>

                          <div className="bg-slate-950/40 border border-slate-900 p-3 rounded-lg text-center space-y-1">
                            <span className="text-[8px] text-slate-400 block uppercase font-mono">ASSIGNED SPECTATOR CORRIDOR</span>
                            <div className="flex justify-around items-center pt-1.5 font-mono">
                              <div className="text-center font-mono">
                                <span className="text-[8px] text-slate-400 block uppercase">SECTION</span>
                                <span className="text-cyan-400 text-sm font-extrabold">{currentSeat ? currentSeat.section : "N/A"}</span>
                              </div>
                              <div className="w-[1px] bg-[#1b2531]/40 h-8" />
                              <div className="text-center font-mono">
                                <span className="text-[8px] text-slate-400 block uppercase">ROW</span>
                                <span className="text-white text-sm font-extrabold">{currentSeat ? currentSeat.row : "N/A"}</span>
                              </div>
                              <div className="w-[1px] bg-[#1b2531]/40 h-8" />
                              <div className="text-center font-mono">
                                <span className="text-[8px] text-slate-400 block uppercase">SEAT</span>
                                <span className="text-white text-sm font-extrabold">{currentSeat ? currentSeat.seat : "N/A"}</span>
                              </div>
                            </div>
                          </div>

                          {/* Digital scannable block representation */}
                          <div className="pt-3 border-t border-slate-900/60 flex flex-col items-center gap-1.5 select-none font-sans">
                            <div className="text-[5.5px] font-mono text-cyan-500/70 leading-none select-none tracking-widest text-center uppercase font-bold">
                              ||||| | | |||| |||||||| ||||||||| ||| | ||| || ||| |||| | | |||| |||||||| |||
                              ||||| | | |||| |||||||| ||||||||| ||| | ||| || ||| |||| | | |||| |||||||| |||
                            </div>
                            <span className="text-[7.5px] text-slate-600 font-mono tracking-widest uppercase">WC2026-TICKET-LEDGER-{currentSeat ? `${currentSeat.section}${currentSeat.row}${currentSeat.seat}` : "UNASSIGNED"}-VERIFIED</span>
                          </div>
                        </div>

                        {/* Corner decorative notch overlays */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-6 bg-[#07090c] rounded-r-full border-r border-cyan-500/10" />
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-6 bg-[#07090c] rounded-l-full border-l border-cyan-500/10" />
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* TAB 5: MATCH DETAILS */}
              {fanActiveTab === "matches" && (
                <div className="bg-[#0b0e12] border border-[#1b2531] rounded-xl p-6 shadow-xl flex flex-col gap-6 w-full font-mono text-xs">
                  <div className="border-b border-[#1b2531] pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-purple-400" />
                        FIFA World Cup 2026™ Match Tracker
                      </h3>
                      <p className="text-xs text-slate-400 font-sans mt-0.5 font-sans">
                        Browse scheduled tournament brackets, available host venues, and past match results played since June 2026.
                      </p>
                    </div>
                    <span className="text-[10px] bg-purple-950/40 text-purple-400 border border-purple-900 px-2.5 py-1 rounded font-mono font-bold tracking-wider">
                      FIFA LIVE DATABASE
                    </span>
                  </div>

                  {/* Search and Filters */}
                  <div className="flex flex-col gap-4 border-b border-[#1b2531]/40 pb-5 font-sans">
                    <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between w-full">
                      {/* Search Bar */}
                      <div className="flex items-center gap-2 bg-[#07090c] border border-slate-800 rounded px-3 py-1.5 flex-1 max-w-md">
                        <Search className="w-4 h-4 text-slate-500" />
                        <input
                          type="text"
                          value={matchSearch}
                          onChange={(e) => setMatchSearch(e.target.value)}
                          placeholder="Search teams, city or venue..."
                          className="bg-transparent border-none outline-none text-xs text-white focus:ring-0 placeholder:text-slate-600 w-full font-sans"
                        />
                      </div>

                      {/* Filter Controls Row */}
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Status Filter Tabs */}
                        <div className="flex gap-0.5 bg-slate-950/80 border border-slate-900 p-0.5 rounded font-mono text-[9px] overflow-x-auto">
                          {(["ALL", "LIVE", "UPCOMING", "COMPLETED"] as const).map((st) => (
                            <button
                              key={st}
                              onClick={() => setMatchFilterStatus(st)}
                              className={`px-2 py-1 rounded transition-all cursor-pointer font-bold ${
                                matchFilterStatus === st 
                                  ? "bg-purple-900/60 text-purple-200 border border-purple-500/40" 
                                  : "text-slate-500 hover:text-slate-300"
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>

                        {/* Date Filter Mode Selection */}
                        <div className="flex gap-0.5 bg-slate-950/80 border border-slate-900 p-0.5 rounded font-mono text-[9px] overflow-x-auto">
                          {(["ALL", "SINGLE", "RANGE"] as const).map((mode) => (
                            <button
                              key={mode}
                              onClick={() => setMatchFilterDateMode(mode)}
                              className={`px-2 py-1 rounded transition-all cursor-pointer font-bold uppercase ${
                                matchFilterDateMode === mode
                                  ? "bg-cyan-900/60 text-cyan-200 border border-cyan-500/40"
                                  : "text-slate-500 hover:text-slate-300"
                              }`}
                            >
                              {mode === "ALL" ? "All Dates" : mode === "SINGLE" ? "📅 Calendar" : "↔ Range"}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Conditional Date Filter Sub-Panels */}
                    {matchFilterDateMode === "RANGE" && (
                      <div className="bg-[#0e1319]/80 border border-[#1b2531]/60 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 text-xs">
                        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500 uppercase font-mono text-[9px] tracking-wider">Start Date:</span>
                            <input
                              type="date"
                              value={matchStartDate}
                              min="2026-06-01"
                              max="2026-07-31"
                              onChange={(e) => setMatchStartDate(e.target.value)}
                              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white focus:outline-none focus:border-cyan-500 font-mono text-xs cursor-pointer"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500 uppercase font-mono text-[9px] tracking-wider">End Date:</span>
                            <input
                              type="date"
                              value={matchEndDate}
                              min="2026-06-01"
                              max="2026-07-31"
                              onChange={(e) => setMatchEndDate(e.target.value)}
                              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white focus:outline-none focus:border-cyan-500 font-mono text-xs cursor-pointer"
                            />
                          </div>
                        </div>

                        {/* Presets and Actions */}
                        <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto sm:ml-auto border-t sm:border-t-0 border-slate-900 pt-3 sm:pt-0">
                          <span className="text-slate-500 font-mono text-[8px] uppercase mr-1 tracking-wider">PRESETS:</span>
                          <button
                            onClick={() => {
                              setMatchStartDate("2026-06-11");
                              setMatchEndDate("2026-07-19");
                            }}
                            className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[10px] font-mono transition cursor-pointer"
                          >
                            Tournament
                          </button>
                          <button
                            onClick={() => {
                              setMatchStartDate("2026-06-11");
                              setMatchEndDate("2026-06-27");
                            }}
                            className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[10px] font-mono transition cursor-pointer"
                          >
                            Group Stage
                          </button>
                          <button
                            onClick={() => {
                              setMatchStartDate("2026-06-28");
                              setMatchEndDate("2026-07-19");
                            }}
                            className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[10px] font-mono transition cursor-pointer"
                          >
                            Knockouts
                          </button>
                          {(matchStartDate || matchEndDate) && (
                            <button
                              onClick={() => {
                                setMatchStartDate("");
                                setMatchEndDate("");
                              }}
                              className="px-2 py-0.5 rounded bg-red-950/40 hover:bg-red-950/80 border border-red-900/60 text-red-400 text-[10px] font-mono transition cursor-pointer"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {matchFilterDateMode === "SINGLE" && (
                      <div className="bg-[#0e1319]/80 border border-[#1b2531]/60 rounded-xl p-4 flex flex-col md:flex-row gap-5">
                        {/* Custom visual mini calendars for June & July 2026 */}
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* June Calendar */}
                          <div className="bg-slate-950/60 border border-slate-900 rounded-lg p-3">
                            <div className="text-center font-bold text-[10px] text-slate-400 uppercase font-mono tracking-wider mb-2 border-b border-slate-900 pb-1.5">
                              June 2026
                            </div>
                            <div className="grid grid-cols-7 gap-1 text-[9px] font-mono text-center text-slate-500">
                              {/* Mon, Tue, Wed, Thu, Fri, Sat, Sun headings */}
                              {["M", "T", "W", "T", "F", "S", "S"].map((d, idx) => (
                                <span key={idx} className="font-extrabold pb-1">{d}</span>
                              ))}
                              {/* June 2026 starts on a Monday, so no offset is needed */}
                              {Array.from({ length: 30 }).map((_, idx) => {
                                const day = idx + 1;
                                const dateStr = `2026-06-${day.toString().padStart(2, "0")}`;
                                const hasMatch = TOURNAMENT_MATCHES.some((m) => m.date === dateStr);
                                const isSelected = matchSelectedDate === dateStr;
                                return (
                                  <button
                                    key={idx}
                                    onClick={() => {
                                      setMatchSelectedDate(isSelected ? "" : dateStr);
                                    }}
                                    className={`p-1 rounded text-center transition-all cursor-pointer font-bold relative ${
                                      isSelected
                                        ? "bg-cyan-500 text-slate-950 font-black shadow-[0_0_8px_rgba(34,211,238,0.5)] scale-105"
                                        : hasMatch
                                        ? "bg-purple-950/40 text-purple-300 border border-purple-900/60 hover:bg-purple-900/40 hover:text-white"
                                        : "text-slate-600 hover:bg-slate-900/30"
                                    }`}
                                    title={hasMatch ? "Matches scheduled" : ""}
                                  >
                                    {day}
                                    {hasMatch && !isSelected && (
                                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-0.5 h-0.5 rounded-full bg-purple-400" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* July Calendar */}
                          <div className="bg-slate-950/60 border border-slate-900 rounded-lg p-3">
                            <div className="text-center font-bold text-[10px] text-slate-400 uppercase font-mono tracking-wider mb-2 border-b border-slate-900 pb-1.5">
                              July 2026
                            </div>
                            <div className="grid grid-cols-7 gap-1 text-[9px] font-mono text-center text-slate-500">
                              {["M", "T", "W", "T", "F", "S", "S"].map((d, idx) => (
                                <span key={idx} className="font-extrabold pb-1">{d}</span>
                              ))}
                              {/* July 1st, 2026 is a Wednesday, so offset is 2 days */}
                              <span className="p-1"></span>
                              <span className="p-1"></span>
                              {Array.from({ length: 31 }).map((_, idx) => {
                                const day = idx + 1;
                                const dateStr = `2026-07-${day.toString().padStart(2, "0")}`;
                                const hasMatch = TOURNAMENT_MATCHES.some((m) => m.date === dateStr);
                                const isSelected = matchSelectedDate === dateStr;
                                return (
                                  <button
                                    key={idx}
                                    onClick={() => {
                                      setMatchSelectedDate(isSelected ? "" : dateStr);
                                    }}
                                    className={`p-1 rounded text-center transition-all cursor-pointer font-bold relative ${
                                      isSelected
                                        ? "bg-cyan-500 text-slate-950 font-black shadow-[0_0_8px_rgba(34,211,238,0.5)] scale-105"
                                        : hasMatch
                                        ? "bg-purple-950/40 text-purple-300 border border-purple-900/60 hover:bg-purple-900/40 hover:text-white"
                                        : "text-slate-600 hover:bg-slate-900/30"
                                    }`}
                                    title={hasMatch ? "Matches scheduled" : ""}
                                  >
                                    {day}
                                    {hasMatch && !isSelected && (
                                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-0.5 h-0.5 rounded-full bg-purple-400" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Calendar Details Column */}
                        <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-[#1b2531]/40 pt-4 md:pt-0 md:pl-4 flex flex-col justify-center text-xs">
                          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold">SELECTED DATE</span>
                          <div className="text-xs font-bold text-slate-200 font-mono mt-1 flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${matchSelectedDate ? "bg-cyan-400 animate-pulse" : "bg-slate-700"}`} />
                            {matchSelectedDate ? (
                              new Date(matchSelectedDate).toLocaleDateString("en-US", {
                                weekday: "short",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                timeZone: "UTC",
                              }).toUpperCase()
                            ) : (
                              "ALL TOURNAMENT DATES"
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 font-sans mt-2 leading-relaxed">
                            {matchSelectedDate ? (
                              `Showing World Cup fixtures scheduled on this day. Highlighted calendar days contain scheduled matches.`
                            ) : (
                              "Select any date highlighted in purple on the calendar picker to view fixtures scheduled for that specific tournament day."
                            )}
                          </p>
                          {matchSelectedDate && (
                            <button
                              onClick={() => setMatchSelectedDate("")}
                              className="mt-3 px-2 py-1 self-start bg-red-950/30 hover:bg-red-950/60 text-red-400 hover:text-red-300 border border-red-900/40 hover:border-red-500/30 rounded font-mono text-[9px] uppercase tracking-wider transition cursor-pointer"
                            >
                              Clear Selection
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Match grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
                    {TOURNAMENT_MATCHES.filter((m) => {
                      // Filter by text search
                      const sWord = matchSearch.toLowerCase();
                      const matchesText = !matchSearch.trim() || 
                        m.team1.toLowerCase().includes(sWord) || 
                        m.team2.toLowerCase().includes(sWord) || 
                        m.venue.toLowerCase().includes(sWord) || 
                        m.city.toLowerCase().includes(sWord) || 
                        m.stage.toLowerCase().includes(sWord) || 
                        m.matchNumber.toLowerCase().includes(sWord);

                      // Filter by status
                      const matchesStatus = matchFilterStatus === "ALL" || m.status === matchFilterStatus;

                      // Filter by Date Mode
                      let matchesDate = true;
                      if (matchFilterDateMode === "SINGLE") {
                        matchesDate = !matchSelectedDate || m.date === matchSelectedDate;
                      } else if (matchFilterDateMode === "RANGE") {
                        const mTime = new Date(m.date).getTime();
                        const sTime = matchStartDate ? new Date(matchStartDate).getTime() : -Infinity;
                        const eTime = matchEndDate ? new Date(matchEndDate).getTime() : Infinity;
                        matchesDate = mTime >= sTime && mTime <= eTime;
                      }

                      return matchesText && matchesStatus && matchesDate;
                    }).map((match) => (
                      <div 
                        key={match.id} 
                        className="bg-slate-950/40 border border-[#1b2531]/40 hover:border-purple-500/20 rounded-xl p-4 flex flex-col justify-between space-y-3 transition-all relative overflow-hidden font-sans"
                      >
                        {/* Stage flag / header */}
                        <div className="flex justify-between items-center text-[9px] font-mono">
                          <span className="text-slate-500 font-bold tracking-wider uppercase">{match.matchNumber} • {match.stage}</span>
                          <span className={`px-2 py-0.5 rounded font-bold flex items-center gap-1.5 ${
                            match.status === "LIVE" 
                              ? "bg-red-950/80 text-red-400 border border-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.25)] animate-pulse" 
                              : match.status === "COMPLETED"
                              ? "bg-slate-900 text-slate-500 border border-slate-800"
                              : "bg-purple-950 text-purple-400 border border-purple-900"
                          }`}>
                            {match.status === "LIVE" && (
                              <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                              </span>
                            )}
                            {match.status === "LIVE" ? "LIVE NOW" : match.status}
                          </span>
                        </div>

                        {/* Match team cards with custom layout */}
                        <div className="py-2 space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{match.team1Flag}</span>
                              <span className="text-slate-100 font-bold tracking-wide">{match.team1}</span>
                            </div>
                            {match.status === "COMPLETED" || match.status === "LIVE" ? (
                              <span className="font-mono font-black text-slate-200 text-sm">{match.score.split(" - ")[0]}</span>
                            ) : null}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{match.team2Flag}</span>
                              <span className="text-slate-100 font-bold tracking-wide">{match.team2}</span>
                            </div>
                            {match.status === "COMPLETED" || match.status === "LIVE" ? (
                              <span className="font-mono font-black text-slate-200 text-sm">{match.score.split(" - ")[1]}</span>
                            ) : null}
                          </div>
                          
                          {match.status === "UPCOMING" && (
                            <div className="text-center py-1 text-slate-500 text-[10px] font-mono tracking-widest border border-dashed border-slate-900/60 rounded bg-slate-950/20">
                              VS (UPCOMING)
                            </div>
                          )}
                        </div>

                        {/* Venue details */}
                        <div className="border-t border-[#1b2531]/30 pt-3 space-y-1 font-mono text-[9px] text-slate-500 leading-relaxed">
                          <div className="flex justify-between">
                            <span>DATE & TIME:</span>
                            <span className="text-purple-400 font-bold">{match.dateTime}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>STADIUM:</span>
                            <span className="text-slate-300 font-semibold truncate max-w-[140px] text-right">{match.venue}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>CITY LOCATION:</span>
                            <span className="text-slate-300 font-semibold">{match.city}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>ATTENDANCE:</span>
                            <span className="text-cyan-400 font-bold">{match.crowdDensity}</span>
                          </div>
                          
                          {match.status === "LIVE" && (
                            <div className="bg-red-950/30 border border-red-900/30 rounded px-1.5 py-1 text-center text-red-400 font-extrabold tracking-wider text-[8px] animate-pulse uppercase mt-1">
                              ⚽ CURRENT SCORE: {match.score} ({match.timeRemaining || "72' LIVE"})
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: STADIUM RULES & OTHER ROLES INSTRUCTIONS */}
              {fanActiveTab === "rules" && (() => {
                const STADIUM_RULES_DATA = [
                  {
                    id: "bag-policy",
                    category: "SPECTATORS",
                    code: "FIFA-REG-2.1",
                    title: "Bag & Backpack Security Compliance",
                    summary: "Strict clear-bag policy for expedited safety screening.",
                    details: "Only clear plastic, vinyl, or PVC bags are allowed. The maximum dimensions permitted are 12\" x 6\" x 12\" (approximately A4 size). Small clutch bags or purses (no larger than 4.5\" x 6.5\") do not need to be clear. All backpacks, multi-pocket bags, luggage, and large briefcases of any material are strictly prohibited.",
                    status: "STRICT COMPLIANCE",
                    statusColor: "text-red-400 border-red-950 bg-red-950/20",
                    icon: "🎒"
                  },
                  {
                    id: "ticketing-anomalies",
                    category: "SPECTATORS",
                    code: "FIFA-REG-4.3",
                    title: "Turnstile Ticketing & Failures",
                    summary: "In case of invalid scans, reroute to the Trouble Resolution Booth.",
                    details: "If a barcode fails to scan or returns 'Error 109', 'Error 404', or 'Ticket Invalid' at the turnstiles, spectators must be directed immediately to the physical Trouble Resolution Booth located at Gate A. Security staff and volunteers are not authorized to override failed turnstile scans.",
                    status: "RESOLUTION FLOW",
                    statusColor: "text-amber-400 border-amber-950 bg-amber-950/20",
                    icon: "🎟️"
                  },
                  {
                    id: "accessibility-restrooms",
                    category: "SPECTATORS",
                    code: "FIFA-REG-1.2",
                    title: "ADA Access & Accessibility Washrooms",
                    summary: "Wheelchair-accessible restrooms near Sections 104, 118, and 220.",
                    details: "Fully equipped, single-occupancy wheelchair-accessible restrooms are located near Sections 104, 118, and 220. Step-free elevators and ramps are available for companion deck routing. Spectators requiring assistance can toggle 'Step-Free' mode on the Companion Deck or call volunteer staff.",
                    status: "ADA COMPLIANT",
                    statusColor: "text-sky-400 border-sky-950 bg-sky-950/20",
                    icon: "♿"
                  },
                  {
                    id: "gate-c-capacity",
                    category: "STAFF",
                    code: "FIFA-OPS-3.8",
                    title: "Gate C Throughput & Flow Diversion",
                    summary: "Gate C maximum flow rate limit of 400 people per 5 minutes.",
                    details: "Operations staff must monitor the throughput of Gate C closely. The target flow is 300-400 entries every 5 minutes. If flow reaches the critical threshold of 500 entries per 5 minutes, volunteers and staff must immediately divert arriving spectator queues to the adjacent Gate D.",
                    status: "MONITORED THRESHOLD",
                    statusColor: "text-yellow-400 border-yellow-950 bg-yellow-950/20",
                    icon: "🚪"
                  },
                  {
                    id: "volunteer-queue-reporting",
                    category: "VOLUNTEERS",
                    code: "FIFA-VOL-5.1",
                    title: "Field Support Queue Intelligence",
                    summary: "Volunteers are responsible for active queue reporting and reporting congestion.",
                    details: "Volunteers stationed at concourse hubs and gates must perform regular queue counts. Any backlog exceeding 50 yards must be immediately logged via the Command Input Console as 'Gate Queue Congestion Update' so other entry hubs can coordinate and balance arriving crowds.",
                    status: "ACTIVE PROTOCOL",
                    statusColor: "text-emerald-400 border-emerald-950 bg-emerald-950/20",
                    icon: "📢"
                  },
                  {
                    id: "medical-response",
                    category: "VOLUNTEERS",
                    code: "FIFA-VOL-1.4",
                    title: "First Aid & Emergency Coordination",
                    summary: "Immediate medical response coordination guidelines.",
                    details: "In the event of an injury, illness, or medical crisis, immediately signal the nearest venue staff member or coordinate directly with the central Medical Dispatch. Ensure the spectator is kept stable. First-aid hubs are located on concourse levels near Gate B and Gate E.",
                    status: "CRITICAL SECURITY",
                    statusColor: "text-purple-400 border-purple-950 bg-purple-950/20",
                    icon: "❤️"
                  },
                  {
                    id: "organizer-density-alarms",
                    category: "ORGANIZERS",
                    code: "FIFA-COORD-8.2",
                    title: "Regional Coordinator Density Alarms",
                    summary: "Automated AI occupancy alarms for concourse safety.",
                    details: "Regional Coordinators and Organizers must oversee the 3D Digital Twin occupancy heatmap. If any quadrant exceeds the warning occupancy limits (e.g. 85%+ density), alarms will trigger. Dispatch on-foot staff to clear crossways and manage the flow to prevent bottlenecks.",
                    status: "COORDINATOR PRIVILEGE",
                    statusColor: "text-rose-400 border-rose-950 bg-rose-950/20",
                    icon: "⚙️"
                  },
                  {
                    id: "spectator-registry-rules",
                    category: "ORGANIZERS",
                    code: "FIFA-COORD-2.9",
                    title: "Spectator Registry Modification Governance",
                    summary: "Strict governance rules on fan database editing and deletion.",
                    details: "Only authorized Coordinators (ORGANIZER role) and designated VIP Staff have permissions to modify, update, or delete spectator entries in the Spectator Registry Database. Unauthorized changes violate match licensing agreements. All modifications are logged in the Firewall Logs.",
                    status: "STRICT PERMISSION",
                    statusColor: "text-pink-400 border-pink-950 bg-pink-950/20",
                    icon: "🔒"
                  }
                ];

                const filteredRules = STADIUM_RULES_DATA.filter((rule) => {
                  const matchesSearch = !rulesSearch.trim() || 
                    rule.title.toLowerCase().includes(rulesSearch.toLowerCase()) ||
                    rule.code.toLowerCase().includes(rulesSearch.toLowerCase()) ||
                    rule.details.toLowerCase().includes(rulesSearch.toLowerCase()) ||
                    rule.summary.toLowerCase().includes(rulesSearch.toLowerCase());
                  
                  const matchesFilter = rulesActiveFilter === "ALL" || rule.category === rulesActiveFilter;
                  return matchesSearch && matchesFilter;
                });

                return (
                  <div className="bg-[#0b0e12] border border-[#1b2531] rounded-xl p-6 shadow-xl flex flex-col gap-6 w-full font-mono text-xs animate-fadeIn">
                    <div className="border-b border-[#1b2531] pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-rose-400" />
                          FIFA World Cup 2026™ Venue Regulations
                        </h3>
                        <p className="text-xs text-slate-400 font-sans mt-0.5">
                          A unified directory of stadium rules, spectator compliance, and operational instructions synchronized across organizer, staff, and volunteer identity scopes.
                        </p>
                      </div>
                      <span className="text-[10px] bg-rose-950/40 text-rose-400 border border-rose-900 px-2.5 py-1 rounded font-mono font-bold tracking-wider uppercase">
                        SECURED CORPUS
                      </span>
                    </div>

                    {/* Search and Filters */}
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center border-b border-[#1b2531]/40 pb-5 font-sans text-xs">
                      <div className="flex items-center gap-2 bg-[#07090c] border border-slate-800 rounded px-3 py-1.5 flex-1 max-w-md">
                        <Search className="w-4 h-4 text-slate-500" />
                        <input
                          type="text"
                          value={rulesSearch}
                          onChange={(e) => setRulesSearch(e.target.value)}
                          placeholder="Search rules, codes, titles..."
                          className="bg-transparent border-none outline-none text-xs text-white focus:ring-0 placeholder:text-slate-600 w-full font-sans"
                        />
                        {rulesSearch && (
                          <button onClick={() => setRulesSearch("")} className="text-slate-500 hover:text-slate-300">
                            ✕
                          </button>
                        )}
                      </div>

                      <div className="flex gap-0.5 bg-slate-950/80 border border-slate-900 p-0.5 rounded font-mono text-[9px] overflow-x-auto self-start md:self-auto">
                        {["ALL", "SPECTATORS", "VOLUNTEERS", "STAFF", "ORGANIZERS"].map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setRulesActiveFilter(cat)}
                            className={`px-2.5 py-1 rounded transition-all cursor-pointer font-bold uppercase ${
                              rulesActiveFilter === cat
                                ? "bg-rose-900/60 text-rose-200 border border-rose-500/40"
                                : "text-slate-500 hover:text-slate-300"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Two Column Layout for Rules and Compliance Simulator */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 font-sans text-xs">
                      
                      {/* Left 2 Columns: Rules List */}
                      <div className="xl:col-span-2 flex flex-col gap-4">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold mb-1">
                          MATCHDAY REGULATIONS & CODES
                        </span>
                        
                        {filteredRules.length === 0 ? (
                          <div className="bg-[#07090c] border border-slate-900 rounded-lg p-8 text-center">
                            <AlertTriangle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                            <p className="text-slate-400 font-medium">No regulations found matching your query</p>
                            <button
                              onClick={() => { setRulesSearch(""); setRulesActiveFilter("ALL"); }}
                              className="mt-3 px-3 py-1.5 bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:bg-slate-800 rounded font-mono uppercase"
                            >
                              Reset Filters
                            </button>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 gap-4">
                            {filteredRules.map((rule) => {
                              const isExpanded = rulesExpandedId === rule.id;
                              return (
                                <div
                                  key={rule.id}
                                  className={`bg-[#0e1319] border rounded-xl overflow-hidden transition-all duration-300 ${
                                    isExpanded 
                                      ? "border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.06)]" 
                                      : "border-[#171f2a] hover:border-slate-800"
                                  }`}
                                >
                                  {/* Header Summary clickable */}
                                  <div
                                    onClick={() => setRulesExpandedId(isExpanded ? null : rule.id)}
                                    className="p-4 flex items-start gap-3.5 cursor-pointer select-none"
                                  >
                                    <div className="text-xl p-2 bg-[#07090c] border border-slate-900 rounded-lg shadow-inner">
                                      {rule.icon}
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                      <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-[9px] font-mono text-slate-500 bg-[#07090c] px-1.5 py-0.5 rounded border border-slate-900 font-bold uppercase tracking-wide">
                                          {rule.code}
                                        </span>
                                        <span className={`text-[8.5px] font-mono font-extrabold px-1.5 py-0.5 rounded border ${rule.statusColor} uppercase tracking-wider`}>
                                          {rule.category}
                                        </span>
                                      </div>
                                      
                                      <h4 className="text-xs font-bold text-slate-100 mt-1.5 tracking-tight group-hover:text-white">
                                        {rule.title}
                                      </h4>
                                      
                                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed line-clamp-1">
                                        {rule.summary}
                                      </p>
                                    </div>

                                    <div className="text-slate-500 hover:text-slate-300 self-center">
                                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                                    </div>
                                  </div>

                                  {/* Expanded body details */}
                                  {isExpanded && (
                                    <div className="px-4 pb-4 pt-1 border-t border-[#171f2a]/40 bg-[#090d12]/60 text-xs">
                                      <div className="pl-3 border-l-2 border-rose-500/30 py-1 mt-1 space-y-3">
                                        <div className="text-[11.5px] text-slate-300 leading-relaxed font-sans font-normal">
                                          {rule.details}
                                        </div>
                                        
                                        {/* Role Instruction mapping detail */}
                                        <div className="bg-[#07090c] border border-slate-900/80 rounded p-2.5 flex items-start gap-2.5 font-mono text-[10px]">
                                          <div className="text-amber-500 font-bold mt-0.5 shrink-0">💡 OPERATIONAL SYNC:</div>
                                          <div className="text-slate-400 leading-relaxed">
                                            This is active in the <strong className="text-slate-200 font-semibold">{rule.category === "SPECTATORS" ? "General Corpus" : rule.category + " view"}</strong>. 
                                            {rule.category === "VOLUNTEERS" && " Registered volunteer Kevin (ID 092) cross-references this during matchday queues."}
                                            {rule.category === "STAFF" && " Jordan Rivera (ID FIFA26087) monitors alerts for this in live diagnostics."}
                                            {rule.category === "ORGANIZERS" && " Regional coordinators enforce compliance and manage exceptions."}
                                            {rule.category === "SPECTATORS" && " Companion decks leverage this data to automate AI route descriptions."}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Right 1 Column: Interactive Compliance Simulator */}
                      <div className="flex flex-col gap-4 font-sans text-xs">
                        <div className="bg-[#0e1319] border border-[#171f2a] rounded-xl p-4 shadow-md">
                          <div className="flex items-center gap-2 mb-2 border-b border-[#1b2531]/60 pb-2">
                            <Activity className="w-4 h-4 text-rose-400" />
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-200">
                              COMPLIANCE SANDBOX
                            </span>
                          </div>
                          
                          <p className="text-[10.5px] text-slate-400 leading-relaxed mb-4">
                            Select a common scenario or issue below to simulate the exact protocol followed by volunteers, staff, and organizers on their respective dashboards.
                          </p>

                          {/* Interactive presets buttons */}
                          <div className="flex flex-col gap-2">
                            {[
                              {
                                label: "Can I bring a camera backpack?",
                                query: "I have a solid black canvas backpack for my high-end zoom lenses.",
                                status: "PROHIBITED",
                                color: "text-red-400 bg-red-950/25 border-red-900/40",
                                action: "Solid backpacks of any size are strictly banned. Clear bags only (max A4 size)."
                              },
                              {
                                label: "Digital ticket scanner error 109",
                                query: "My phone barcode is throwing code 109 and will not open the gate turnstile.",
                                status: "REROUTE MANDATE",
                                color: "text-amber-400 bg-amber-950/25 border-amber-900/40",
                                action: "Direct visitor immediately to physical Trouble Resolution Booth at Gate A."
                              },
                              {
                                label: "Accessible restroom location?",
                                query: "I am escorting a guest in Section 118 who needs a wheelchair restroom.",
                                status: "ACCESSIBLE PATHWAY",
                                color: "text-sky-400 bg-sky-950/25 border-sky-900/40",
                                action: "Restrooms are located nearby Sections 104, 118, and 220. Toggle step-free mode."
                              },
                              {
                                label: "Gate C crowd backlog check",
                                query: "Gate C flow count has hit 520 people in the last five-minute window.",
                                status: "DIVERT TRAFFIC",
                                color: "text-yellow-400 bg-yellow-950/25 border-yellow-900/40",
                                action: "Volunteers and Staff must immediately divert arriving spectator queues to Gate D."
                              },
                              {
                                label: "Spectator records update requested",
                                query: "A spectator requests to purge their registered companion deck parameters.",
                                status: "RESTRICTED ACCESS",
                                color: "text-pink-400 bg-pink-950/25 border-pink-900/40",
                                action: "Permitted only for authorized Regional Coordinators via secure Spectator Registry."
                              }
                            ].map((scenario, index) => {
                              const isSelected = selectedSimulatorIdx === index;
                              return (
                                <div key={index} className="flex flex-col">
                                  <button
                                    onClick={() => setSelectedSimulatorIdx(isSelected ? null : index)}
                                    className={`w-full text-left p-2.5 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer flex justify-between items-center ${
                                      isSelected
                                        ? "bg-rose-950/40 border-rose-500/40 text-rose-300"
                                        : "bg-slate-950/40 border-slate-900 hover:bg-[#111823] hover:border-slate-800 text-slate-300"
                                    }`}
                                  >
                                    <span>{scenario.label}</span>
                                    <span className="text-[9px] font-mono text-slate-400 uppercase">
                                      {isSelected ? "COLLAPSE" : "SIMULATE"}
                                    </span>
                                  </button>
                                  
                                  {isSelected && (
                                    <div className="mt-1 bg-[#07090c] border border-slate-900 rounded-lg p-3 space-y-2 animate-fadeIn text-[10.5px]">
                                      <div className="flex justify-between items-center font-mono">
                                        <span className="text-slate-400 text-[8.5px] uppercase">ANALYSIS STATUS</span>
                                        <span className={`px-1.5 py-0.5 rounded border text-[8.5px] font-extrabold uppercase ${scenario.color}`}>
                                          {scenario.status}
                                        </span>
                                      </div>
                                      <p className="text-slate-400 italic">"{scenario.query}"</p>
                                      <div className="bg-[#0e1319] border border-slate-900 p-2 rounded flex items-start gap-2 text-xs">
                                        <div className="text-rose-400 font-bold shrink-0">→ ACTION:</div>
                                        <div className="text-slate-300 leading-relaxed font-sans">{scenario.action}</div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="bg-[#0b0f16] border border-slate-900 rounded-xl p-4 flex items-start gap-3">
                          <UserCheck className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[10px] font-mono text-slate-200 font-bold uppercase block">
                              ROLE BOUNDARIES
                            </span>
                            <p className="text-[11px] text-slate-400 leading-relaxed mt-1 font-sans">
                              These unified operational codes represent synchronized stadium data. To toggle high-level action queues, please use the <strong>Secure Access Role</strong> selector in the tactical header to access official Volunteer, Venue Staff, or Organizer modules.
                            </p>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })()}

              {/* TAB 7: AI COMPLIANCE CHATBOT */}
              {fanActiveTab === "chat" && (
                <div className="w-full animate-fadeIn">
                  <StadiumAIComplianceChat
                    chatMessages={chatMessages}
                    chatInput={chatInput}
                    setChatInput={setChatInput}
                    isChatLoading={isChatLoading}
                    sendChatMessage={sendChatMessage}
                    currentSessionRole={currentSessionRole}
                    selectedLanguage={selectedLanguage}
                  />
                </div>
              )}

            </div>
          </div>
        </main>
      ) : (
        <div className="flex-1 max-w-7xl w-full mx-auto p-4 flex flex-col lg:flex-row gap-6">
          {/* Desktop Left Sidebar with smooth slide out */}
          <AnimatePresence initial={false}>
            {!(currentView === "DASHBOARD" && isFullScreenViewport) && (
              <motion.div
                initial={{ opacity: 0, width: 0, marginRight: 0 }}
                animate={{ opacity: 1, width: 256, marginRight: 24 }}
                exit={{ opacity: 0, width: 0, marginRight: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="hidden lg:block shrink-0 overflow-hidden"
              >
                <div className="w-64">
                  <SidebarNavigation
                    currentView={currentView}
                    setCurrentView={setCurrentView}
                    logsCount={logs.length}
                    hasEngineResult={!!engineResult}
                    fanAccountsList={fanAccountsList}
                    onRefreshFans={fetchFanAccounts}
                    selectedLanguage={selectedLanguage}
                    onLanguageChange={handleLanguageChange}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile Left Sidebar with smooth slide out */}
          <AnimatePresence initial={false}>
            {!(currentView === "DASHBOARD" && isFullScreenViewport) && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="block lg:hidden w-full shrink-0 overflow-hidden"
              >
                <SidebarNavigation
                  currentView={currentView}
                  setCurrentView={setCurrentView}
                  logsCount={logs.length}
                  hasEngineResult={!!engineResult}
                  fanAccountsList={fanAccountsList}
                  onRefreshFans={fetchFanAccounts}
                  selectedLanguage={selectedLanguage}
                  onLanguageChange={handleLanguageChange}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <main className="flex-1 min-w-0 flex flex-col gap-4">
            {currentView === "DASHBOARD" && (
              <section className="flex flex-col gap-4 w-full">
                {/* Card: 3D digital Twin Container with layout transition */}
                <motion.div
                  layout
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="bg-[#0b0e12] border border-[#1b2531] rounded-lg overflow-hidden shadow-xl flex flex-col"
                >
            <div className="bg-[#0e1319] border-b border-[#1b2531] px-4 py-2.5 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-cyan-400" />
                <h2 className="text-xs font-semibold text-slate-200 uppercase tracking-widest font-mono">
                  {getTranslation("digital_twin_workspace", selectedLanguage, engineResult)}
                </h2>
              </div>
              
              <div className="flex items-center gap-3.5 flex-wrap">
                {/* Home View Reset Trigger Button */}
                <button
                  id="btn-home-view"
                  onClick={() => handleFlyTo("OVERVIEW")}
                  className="flex items-center gap-1.5 px-3 py-1 bg-cyan-950/40 hover:bg-cyan-950/80 text-cyan-400 border border-cyan-900/60 hover:border-cyan-500/50 rounded text-[10px] font-mono transition-all duration-150 uppercase tracking-wider font-bold cursor-pointer shadow-[0_0_10px_rgba(34,211,238,0.05)]"
                  title="Reset StadiumTwin camera to default wide overview position"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>{getTranslation("home_view", selectedLanguage, engineResult)}</span>
                </button>

                {/* Viewport Resize Toggle Button */}
                <button
                  id="btn-toggle-viewport-size"
                  onClick={toggleViewportExpansion}
                  className="flex items-center gap-1.5 px-3 py-1 bg-cyan-950/40 hover:bg-cyan-950/80 text-cyan-400 border border-cyan-900/60 hover:border-cyan-500/50 rounded text-[10px] font-mono transition-all duration-150 uppercase tracking-wider font-bold cursor-pointer shadow-[0_0_10px_rgba(34,211,238,0.05)]"
                  title={isFullScreenViewport ? "Shrink 3D model viewport" : "Make 3D model viewport bigger"}
                >
                  {isFullScreenViewport ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                  <span>{isFullScreenViewport ? getTranslation("shrink_view", selectedLanguage, engineResult) : getTranslation("expand_view", selectedLanguage, engineResult)}</span>
                </button>

                <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  <span>INTERACTIVE SCANNER ACTIVE</span>
                </div>
              </div>
            </div>

            <motion.div
              animate={{ height: isFullScreenViewport ? 820 : 680 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="relative bg-[#080a0c] overflow-hidden"
            >
              <Suspense fallback={
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#080a0c] text-cyan-400 font-mono text-xs z-50">
                  <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-3"></div>
                  <span>LOADING 3D DIGITAL TWIN ENGINE...</span>
                </div>
              }>
                <StadiumTwin
                  cameraPos={cameraPos}
                  lookAtPos={lookAtPos}
                  glowColor={glowColor}
                  activeAnchor={activeAnchor}
                  currentWeather={currentWeather}
                  isLoading={isInitialLoading}
                  incident={
                    engineResult?.staff_operations_payload
                      ? {
                          type: engineResult.staff_operations_payload.incident_classification,
                          coordinates: engineResult.staff_operations_payload.incident_coordinates,
                        }
                      : null
                  }
                  incidents={incidentHistory}
                  venueStructuralProfile={engineResult?.venue_structural_profile}
                  onWeatherChange={(weather, locName, stadiumName, temp) => {
                    setCurrentWeather(weather);
                    setCurrentLocationName(locName);
                    setCurrentStadiumName(stadiumName);
                    setCurrentTemperature(temp);
                    
                    const interferenceMap = {
                      SUNSHINE: "LOW (0.05)",
                      RAIN: "MODERATE (0.45)",
                      FOG: "HIGH (0.75)",
                      SNOW: "SEVERE (0.90)"
                    };
                    setAtmosphericInterference(interferenceMap[weather] || "LOW (0.05)");
                  }}
                />
              </Suspense>

              {/* Tactical Digital Twin Simulation Legend Overlay */}
              <div className="absolute bottom-3 left-3 bg-[#07090c]/90 border border-[#1b2531] rounded p-2.5 font-mono text-[9px] text-slate-300 pointer-events-none select-none max-w-[190px] shadow-[0_4px_20px_rgba(0,0,0,0.8)] backdrop-blur-sm z-10 space-y-1.5">
                <div className="text-[8px] font-bold text-slate-400 uppercase tracking-wider border-b border-[#1b2531]/60 pb-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  SIMULATION INCIDENT ALERTS
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#ef4444] ring-2 ring-red-950 shrink-0" />
                    <span className="text-slate-300 uppercase font-medium text-[8px]">HIGH THREAT / MEDICAL</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#f97316] ring-2 ring-orange-950 shrink-0" />
                    <span className="text-slate-300 uppercase font-medium text-[8px]">CROWD CONGESTION</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#eab308] ring-2 ring-yellow-950 shrink-0" />
                    <span className="text-slate-300 uppercase font-medium text-[8px]">TICKETING CRISIS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#f59e0b] ring-2 ring-amber-950 shrink-0" />
                    <span className="text-slate-300 uppercase font-medium text-[8px]">COMPLIANCE / POLICY</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#ec4899] ring-2 ring-pink-950 shrink-0" />
                    <span className="text-slate-300 uppercase font-medium text-[8px]">CLUSTERED EVENTS</span>
                  </div>
                </div>

                <div className="text-[8px] font-bold text-slate-400 uppercase tracking-wider border-b border-[#1b2531]/60 pb-1 pt-1.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  STADIUM FACILITIES KEY
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#3b82f6] ring-2 ring-blue-950 shrink-0" />
                    <span className="text-slate-300 uppercase font-medium text-[8px]">OPERATIONAL GATE / ACCESS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#10b981] ring-2 ring-emerald-950 shrink-0" />
                    <span className="text-slate-300 uppercase font-medium text-[8px]">CONCESSIONS / AMENITIES</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Manual Camera Fly-To controller buttons */}
            <div className="bg-[#0e1319]/90 border-t border-[#1b2531] p-3 flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono">
              <span className="text-slate-400 font-semibold uppercase flex items-center gap-1">
                <Sliders className="w-3 h-3 text-slate-400" /> Manual Camera Transit:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => handleFlyTo("Overview")}
                  className={`px-2.5 py-1 rounded transition border ${
                    activeAnchor === null
                      ? "bg-slate-800 text-white border-slate-700 font-bold"
                      : "bg-slate-950 text-slate-400 border-slate-900 hover:text-white"
                  }`}
                >
                  OVERVIEW
                </button>
                <button
                  onClick={() => handleFlyTo("GATE_A")}
                  className={`px-2.5 py-1 rounded transition border ${
                    activeAnchor === "GATE_A"
                      ? "bg-blue-950 text-blue-400 border-blue-800 font-bold"
                      : "bg-slate-950 text-slate-400 border-slate-900 hover:text-white"
                  }`}
                >
                  GATE A (VERIZON)
                </button>
                <button
                  onClick={() => handleFlyTo("GATE_B")}
                  className={`px-2.5 py-1 rounded transition border ${
                    activeAnchor === "GATE_B"
                      ? "bg-blue-950 text-blue-400 border-blue-800 font-bold"
                      : "bg-slate-950 text-slate-400 border-slate-900 hover:text-white"
                  }`}
                >
                  GATE B (HCLTECH)
                </button>
                <button
                  onClick={() => handleFlyTo("GATE_C")}
                  className={`px-2.5 py-1 rounded transition border ${
                    activeAnchor === "GATE_C"
                      ? "bg-red-950 text-red-400 border-red-800 font-bold"
                      : "bg-slate-950 text-slate-400 border-slate-900 hover:text-white"
                  }`}
                >
                  GATE C (METLIFE)
                </button>
                <button
                  onClick={() => handleFlyTo("GATE_D")}
                  className={`px-2.5 py-1 rounded transition border ${
                    activeAnchor === "GATE_D"
                      ? "bg-blue-950 text-blue-400 border-blue-800 font-bold"
                      : "bg-slate-950 text-slate-400 border-slate-900 hover:text-white"
                  }`}
                >
                  GATE D (WELCH'S)
                </button>
                <button
                  onClick={() => handleFlyTo("TROUBLESHOOTING_BOOTH")}
                  className={`px-2.5 py-1 rounded transition border ${
                    activeAnchor === "TROUBLESHOOTING_BOOTH"
                      ? "bg-yellow-950 text-yellow-400 border-yellow-800 font-bold"
                      : "bg-slate-950 text-slate-400 border-slate-900 hover:text-white"
                  }`}
                >
                  TROUBLE BOOTH
                </button>
                <button
                  onClick={() => handleFlyTo("SECTION_118")}
                  className={`px-2.5 py-1 rounded transition border ${
                    activeAnchor === "SECTION_118"
                      ? "bg-blue-950 text-blue-400 border-blue-800 font-bold"
                      : "bg-slate-950 text-slate-400 border-slate-900 hover:text-white"
                  }`}
                >
                  SEC 118 (ACCESS RESTROOMS)
                </button>
                <button
                  onClick={() => handleFlyTo("SECTION_143")}
                  className={`px-2.5 py-1 rounded transition border ${
                    activeAnchor === "SECTION_143"
                      ? "bg-emerald-950 text-emerald-400 border-emerald-800 font-bold"
                      : "bg-slate-950 text-slate-400 border-slate-900 hover:text-white"
                  }`}
                >
                  SEC 143 (CONCESSIONS)
                </button>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {currentView === "CHAT" && (
        <section className="flex flex-col gap-4 w-full animate-fadeIn">
          <StadiumAIComplianceChat
            chatMessages={chatMessages}
            chatInput={chatInput}
            setChatInput={setChatInput}
            isChatLoading={isChatLoading}
            sendChatMessage={sendChatMessage}
            currentSessionRole={currentSessionRole}
            selectedLanguage={selectedLanguage}
          />
        </section>
      )}

      {currentView === "LOGS" && (
        <TerminalLogs logs={logs} onClearLogs={() => setLogs([])} selectedLanguage={selectedLanguage} />
      )}

      {currentView === "CORPUS" && (
        <section className="flex flex-col gap-4 w-full animate-fadeIn">
          <div className="bg-[#0b0e12] border border-[#1b2531] rounded-lg p-6 shadow-xl font-mono">
            <div className="border-b border-[#1b2531] pb-4 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="text-amber-400 w-5 h-5" />
                <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-widest">
                  {getTranslation("stadium_corpus_grounding_manual", selectedLanguage, engineResult)}
                </h2>
              </div>
              <span className="text-xs bg-amber-950/40 text-amber-400 border border-amber-900/60 px-2 py-0.5 rounded font-bold uppercase">
                SECURED HANDBOOK
              </span>
            </div>
            <GroundingManual onSelectQuery={handleSelectPresetQuery} />
          </div>
        </section>
      )}

      {currentView === "COMMAND" && (
        <section className="flex flex-col gap-4 w-full animate-fadeIn">
          {/* Card: Input Controller Panel */}
          <div className="bg-[#0b0e12] border border-[#1b2531] rounded-lg p-4 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#1b2531] pb-2">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <h2 className="text-xs font-semibold text-slate-200 uppercase tracking-widest font-mono">
                  {getTranslation("matrix_command_input_console", selectedLanguage, engineResult)}
                </h2>
              </div>
              <span className="text-[9px] font-mono text-slate-400">NODE: KERNEL_PORT_3000</span>
            </div>

            {/* Simulated Rate slider - critical for the third rule! */}
            <div className="bg-[#0d131a] border border-[#1b2530] p-3 rounded space-y-2">
              <div className="flex justify-between items-center text-[11px] font-mono">
                <span className="text-slate-400 uppercase flex items-center gap-1 font-semibold">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" /> Traffic telemetry (Last 60s)
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  requestsInLast60s > 10 ? "bg-red-950 text-red-400 border border-red-900" : "bg-emerald-950 text-emerald-400 border border-emerald-900"
                }`}>
                  {requestsInLast60s} REQ/M
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                value={requestsInLast60s}
                onChange={(e) => setRequestsInLast60s(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <p className="text-[10px] text-slate-400 leading-relaxed font-mono">
                Slide above <strong className="text-red-400">10 requests</strong> to trigger the automated, AI-enforced contextual rate-limit throttle breach!
              </p>
            </div>

            {/* Visual Stream Preset selectors */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                CCTV Visual Feed Injection Preset:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {PRESET_IMAGES.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePresetSelect(idx)}
                    className={`p-2 rounded border text-left flex flex-col gap-1 transition ${
                      selectedImagePreset === idx
                        ? "bg-[#161d24] border-cyan-500/80 text-cyan-400"
                        : "bg-[#0d131a] border-[#1b2530] text-slate-400 hover:border-slate-800 hover:bg-[#111821]"
                    }`}
                  >
                    <div className="flex items-center gap-1 text-[10px] font-semibold tracking-tight font-mono">
                      <Eye className="w-3 h-3 text-cyan-500" /> Preset #{idx + 1}
                    </div>
                    <span className="text-[9px] line-clamp-1 leading-snug font-sans text-slate-300">{img.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Image Upload Option */}
            <div className="flex items-center justify-between gap-2 text-[10px] font-mono bg-[#0d131a] border border-[#1b2530] px-3 py-2 rounded">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Upload className="w-3.5 h-3.5 text-cyan-400" />
                <span>Inject custom CCTV file:</span>
              </div>
              {customImage ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-400 font-bold truncate max-w-[120px]">{customImage.name}</span>
                  <button onClick={clearImage} className="text-red-400 underline font-bold">CLEAR</button>
                </div>
              ) : (
                <label className="text-cyan-400 font-bold hover:underline cursor-pointer">
                  UPLOAD FILE
                  <input type="file" accept="image/*" onChange={handleCustomImageUpload} className="hidden" />
                </label>
              )}
            </div>

            {/* Query Input text area */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-slate-400 uppercase font-semibold flex items-center justify-between">
                <span>Operation Intelligence Query Payload:</span>
                <span className="text-slate-500 text-[9px]">RAW TEXT ONLY</span>
              </label>
              <textarea
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedImagePreset(null);
                }}
                placeholder="Ex: I have a big black leather backpack, can I enter Gate C? (or try one of the preloaded manual queries below)"
                rows={4}
                className="w-full bg-[#0d131a] border border-[#1b2530] text-slate-200 text-xs rounded p-2.5 font-sans focus:outline-none focus:border-cyan-500/60 placeholder:text-slate-600 resize-none leading-relaxed"
              />
            </div>

            {/* Submission button */}
            <button
              onClick={triggerQueryAnalysis}
              disabled={isAnalyzing || !query.trim()}
              className={`w-full py-2 px-4 rounded font-mono text-xs font-semibold tracking-wider flex items-center justify-center gap-2 transition-all duration-200 select-none ${
                isAnalyzing
                  ? "bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700"
                  : !query.trim()
                  ? "bg-slate-900 text-slate-500 cursor-not-allowed border border-slate-950"
                  : "bg-blue-600 text-white hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-950/40 border border-blue-500 hover:scale-105"
              }`}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>EXECUTING CORE INTEGRITY RUN...</span>
                </>
              ) : (
                <>
                  <Cpu className="w-4 h-4 text-blue-300" />
                  <span>TRANSMIT PAYLOAD TO MONTERY CORE</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Collapsible preloaded Manuals / Preset triggers */}
            <GroundingManual onSelectQuery={handleSelectPresetQuery} />
          </div>
        </section>
      )}

      {currentView === "PAYLOAD" && (
        <section className="flex flex-col gap-4 w-full animate-fadeIn">
          {/* Card: Engine Output Module */}
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
            <div className="bg-[#0e1319] border-b border-[#1b2531] px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MatrixIcon status={isAnalyzing ? matrixCoreText : "SECURED"} isSpinning={isAnalyzing} />
                <h2 className="text-xs font-semibold text-slate-200 uppercase tracking-widest font-mono">
                  {getTranslation("engine_output_decoded_payload", selectedLanguage, engineResult)}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {/* Export Telemetry Dropdown / Button */}
                <div className="relative">
                  <button
                    onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                    disabled={!engineResult}
                    className={`border text-[9px] font-mono font-bold px-2.5 py-0.5 rounded flex items-center gap-1.5 transition select-none cursor-pointer ${
                      engineResult
                        ? "bg-slate-950 hover:bg-slate-900 border-[#2b3a4a] hover:border-slate-700 text-amber-400 hover:text-amber-300"
                        : "bg-slate-950/40 border-slate-950 text-slate-600 cursor-not-allowed opacity-50"
                    }`}
                    title={engineResult ? "Export Current Telemetry as CSV or JSON" : "No telemetry data available to export"}
                  >
                    <Download className={`w-3 h-3 text-amber-500 shrink-0 ${engineResult ? "animate-pulse" : ""}`} />
                    <span>EXPORT TELEMETRY</span>
                    <ChevronDown className={`w-2.5 h-2.5 transition-transform duration-200 text-slate-500 ${isExportMenuOpen ? "rotate-180" : ""}`} />
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
                  className="bg-slate-950 hover:bg-slate-900 border border-slate-900 hover:border-slate-850 text-[9px] font-mono text-cyan-400 hover:text-cyan-300 font-bold px-2 py-0.5 rounded flex items-center gap-1.5 transition select-none cursor-pointer"
                  title="Open Tactical Incident History Logs"
                >
                  <History className="w-3 h-3 text-cyan-500 shrink-0" />
                  <span>HISTORY LOGS ({incidentHistory.length})</span>
                </button>
                <div className="flex bg-slate-950/80 p-0.5 rounded border border-slate-900 text-[9px] font-mono">
                  <button
                    onClick={() => setActiveTab("visuals")}
                    className={`px-2 py-0.5 rounded ${activeTab === "visuals" ? "bg-slate-800 text-cyan-400 font-bold" : "text-slate-400"}`}
                  >
                    DECODED
                  </button>
                  <button
                    onClick={() => setActiveTab("json")}
                    className={`px-2 py-0.5 rounded ${activeTab === "json" ? "bg-slate-800 text-cyan-400 font-bold" : "text-slate-400"}`}
                  >
                    RAW JSON
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between overflow-y-auto max-h-[460px] scrollbar-thin scrollbar-thumb-slate-800">
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
                    <p className="text-[10px] text-slate-500">
                      SECURED ENVELOPE ENCRYPTED WITH MULTI-STAGE AES-256
                    </p>
                  </div>
                </div>
              ) : !engineResult ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-2 py-12 text-slate-500 font-mono text-[11px]">
                  <ShieldAlert className="w-6 h-6 text-slate-600 animate-bounce" />
                  <span>AWAITING MISSION DATA SUBMISSION</span>
                  <span>SUBMIT A STADIUM QUERY ABOVE TO POWER CORE ENGINE</span>
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
                                <Sliders className="w-3.5 h-3.5 text-cyan-400" /> {getTranslation("label_queue_volume", selectedLanguage, engineResult).toUpperCase()}
                              </h4>
                              <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-[9px]">
                                  <thead>
                                    <tr className="border-b border-slate-900 text-slate-500 font-bold">
                                      <th className="py-1">GATE</th>
                                      <th className="py-1 text-center">QUEUE</th>
                                      <th className="py-1 text-center">{getTranslation("label_gate_throughput", selectedLanguage, engineResult).split(" ").pop()?.toUpperCase() || "FLOW/MIN"}</th>
                                      <th className="py-1 text-center">{getTranslation("label_wait_time", selectedLanguage, engineResult).split(" ").pop()?.toUpperCase() || "WAIT"}</th>
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
                                  <span className="text-slate-500 font-semibold">HAZARDS DETECTED:</span>
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
                                  <span className="text-slate-400 font-bold text-[10px] uppercase">{getTranslation("label_handover_summary", selectedLanguage, engineResult).toUpperCase()}:</span>
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
                                  <span className="text-slate-500 uppercase text-[8px]">Venue ID:</span>
                                  <div className="text-white font-bold text-[11px] tracking-wide">
                                    {engineResult.venue_structural_profile.active_stadium_id}
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-slate-500 uppercase text-[8px]">Capacity:</span>
                                  <div className="text-cyan-400 font-extrabold text-[11px]">
                                    {engineResult.venue_structural_profile.official_tournament_capacity?.toLocaleString()} Seats
                                  </div>
                                </div>
                                <div className="space-y-1 col-span-2">
                                  <span className="text-slate-500 uppercase text-[8px]">Architectural & Design Tag:</span>
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
                  <div className="border-t border-[#1b2531]/60 pt-2.5 mt-3 flex items-center justify-between text-[9px] font-mono text-slate-500">
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
      </section>
    )}

    {currentView === "REGISTRY" && (
      <section className="flex flex-col gap-4 w-full animate-fadeIn font-mono">
        {/* Main Database Card Container */}
        <div className="bg-[#0b0e12] border border-[#1b2531] rounded-lg p-5 shadow-xl flex flex-col gap-5">
          
          {/* Header */}
          <div className="border-b border-[#1b2531] pb-4 flex items-center justify-between flex-wrap gap-2.5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-sky-950/80 border border-sky-800/40 rounded text-sky-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xs font-semibold text-slate-200 uppercase tracking-widest">
                  {getTranslation("spectator_registry_database", selectedLanguage, engineResult)}
                </h2>
                <p className="text-[9px] text-slate-500 uppercase tracking-wide mt-0.5">
                  Real-time verification matrix and tournament seat allocations
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] bg-sky-950/50 text-sky-400 border border-sky-900/40 px-2 py-1 rounded font-extrabold">
                {fanAccountsList.length} TOTAL ENTRIES
              </span>
            </div>
          </div>

          {/* Controls: Search Bar & Reload */}
          <div className="flex gap-2.5 items-center flex-wrap sm:flex-nowrap">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-sky-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={fanSearchQuery}
                onChange={(e) => setFanSearchQuery(e.target.value)}
                placeholder="Search registry by Full Name, Phone, Stadium, or Seat..."
                className="w-full bg-[#07090c] border border-[#1b2531] rounded-lg pl-9 pr-8 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500 transition-colors placeholder:text-slate-600"
              />
              {fanSearchQuery && (
                <button 
                  onClick={() => setFanSearchQuery("")}
                  className="absolute right-3 top-2.5 text-[9px] text-slate-500 hover:text-white font-bold cursor-pointer"
                >
                  CLEAR
                </button>
              )}
            </div>
            
            <button
              onClick={() => {
                fetchFanAccounts();
                playDispatchSuccessSound();
              }}
              className="p-2 border border-[#1b2531] bg-[#07090c] hover:bg-[#151c24] rounded-lg text-slate-300 hover:text-sky-400 cursor-pointer flex items-center gap-1.5 transition-colors text-xs font-bold"
              title="Refresh database entries"
            >
              <RefreshCw className="w-3.5 h-3.5 shrink-0" />
              <span>RELOAD</span>
            </button>

            {["ORGANIZER", "VENUE_STAFF"].includes(currentSessionRole) && (
              <button
                onClick={() => {
                  setShowClearConfirm(true);
                  playLowFrequencyAlertSound();
                }}
                className="p-2 border border-red-500/30 hover:border-red-400 bg-[#07090c] hover:bg-red-500/10 rounded-lg text-red-400 hover:text-red-300 cursor-pointer flex items-center gap-1.5 transition-colors text-xs font-bold"
                title="Purge all fan accounts from database"
              >
                <Trash2 className="w-3.5 h-3.5 shrink-0" />
                <span>PURGE DATABASE</span>
              </button>
            )}
          </div>

          {/* List of Entries */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
            {(() => {
              const q = fanSearchQuery.trim().toLowerCase();
              const filtered = fanAccountsList.filter((fan) => {
                if (!q) return true;
                const nameMatch = (fan.name || "").toLowerCase().includes(q);
                const phoneMatch = (fan.phoneNumber || "").toLowerCase().includes(q);
                const stadiumMatch = (fan.selectedStadium || "").replace(/_/g, " ").toLowerCase().includes(q);
                const seatStr = fan.seat 
                  ? `sec ${fan.seat.section} row ${fan.seat.row} seat ${fan.seat.seat}`.toLowerCase()
                  : "na";
                const seatMatch = seatStr.includes(q);
                return nameMatch || phoneMatch || stadiumMatch || seatMatch;
              });

              if (filtered.length === 0) {
                return (
                  <div className="text-center py-12 border border-dashed border-[#1b2531] rounded-lg bg-[#07090c]/50 text-slate-500 text-xs">
                    <Users className="w-8 h-8 text-slate-600 mx-auto mb-2 animate-pulse" />
                    <p className="uppercase font-bold tracking-wider text-slate-400">No Spectators Matched</p>
                    <p className="text-[10px] text-slate-600 mt-1 uppercase">Adjust search keywords or add a new entry</p>
                  </div>
                );
              }

              return filtered.map((fan) => (
                <div 
                  key={fan.id}
                  className="bg-[#07090c] border border-[#1b2531]/70 hover:border-sky-500/40 rounded-lg p-4 flex flex-col gap-3 transition-colors shadow-md relative"
                >
                  {/* Card Header */}
                  <div className="flex justify-between items-start flex-wrap gap-2 border-b border-[#1b2531]/40 pb-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-white text-xs uppercase tracking-wide">{fan.name}</span>
                        <span className="text-[7px] px-1.5 py-0.2 bg-sky-950/90 text-sky-400 border border-sky-800/40 rounded font-black tracking-widest">
                          VERIFIED FAN
                        </span>
                      </div>
                      <div className="text-[7.5px] text-slate-500 uppercase tracking-widest">
                        UUID: <span className="text-slate-400">{fan.id}</span>
                      </div>
                    </div>
                    <span className="text-[8px] text-slate-600 font-mono text-right shrink-0">
                      REG: {fan.registeredAt ? new Date(fan.registeredAt).toLocaleString() : "UNKNOWN"}
                    </span>
                  </div>

                  {/* Card Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-[10.5px]">
                    {/* Contact detail */}
                    <div className="bg-[#0b0e12]/80 border border-[#1b2531]/40 p-2 rounded flex flex-col gap-0.5">
                      <span className="text-[7.5px] text-slate-500 uppercase tracking-wider">Verified Mobile Contact:</span>
                      <span className="text-slate-200 font-bold flex items-center gap-1.5">
                        <span className="text-xs">📞</span> {fan.phoneNumber || "UNSPECIFIED"}
                      </span>
                    </div>

                    {/* Facility routing */}
                    <div className="bg-[#0b0e12]/80 border border-[#1b2531]/40 p-2 rounded flex flex-col gap-0.5">
                      <span className="text-[7.5px] text-slate-500 uppercase tracking-wider">Facility Hub Assignment:</span>
                      <span className="text-slate-200 font-bold uppercase truncate">
                        📍 {(fan.selectedStadium || "NEW_YORK_NEW_JERSEY").replace(/_/g, " ")}
                      </span>
                    </div>

                    {/* Seat allocation */}
                    <div className="bg-[#0b0e12]/80 border border-[#1b2531]/40 p-2 rounded flex flex-col gap-0.5">
                      <span className="text-[7.5px] text-slate-500 uppercase tracking-wider">Stadium Seat Allocation:</span>
                      {fan.seat ? (
                        <span className="text-emerald-400 font-extrabold uppercase tracking-wide">
                          🎟️ SEC {fan.seat.section} • ROW {fan.seat.row} • SEAT {fan.seat.seat}
                        </span>
                      ) : (
                        <span className="text-slate-500 font-semibold italic">
                          🎟️ NA (Not Selected)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="flex justify-between items-center pt-2 border-t border-[#1b2531]/30 flex-wrap gap-2.5">
                    <div className="text-[7.5px] text-slate-600 uppercase tracking-wide">
                      LAST TOUCH: {fan.lastLogin ? new Date(fan.lastLogin).toLocaleTimeString() : "N/A"}
                    </div>
                    
                    {/* Permission check */}
                    {["ORGANIZER", "VENUE_STAFF"].includes(currentSessionRole) ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleStartEditFan(fan)}
                          className="px-2.5 py-1 text-[9px] font-bold border border-amber-500/30 hover:border-amber-400 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded uppercase transition cursor-pointer flex items-center gap-1"
                        >
                          <Edit2 className="w-2.5 h-2.5" />
                          <span>Edit Details</span>
                        </button>
                        <button
                          onClick={() => setDeletingFan(fan)}
                          className="px-2.5 py-1 text-[9px] font-bold border border-red-500/30 hover:border-red-400 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded uppercase transition cursor-pointer flex items-center gap-1"
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-[8px] bg-slate-900/60 border border-slate-950 px-2 py-0.5 rounded text-slate-500 italic uppercase">
                        🔒 Operations Read-Only View
                      </span>
                    )}
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>

        {/* MODAL: Edit Fan */}
        {editingFan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 font-mono">
            <div className="bg-[#0b0e12] border border-amber-500/50 rounded-xl max-w-md w-full p-6 shadow-[0_0_50px_rgba(245,158,11,0.15)] space-y-4">
              <div className="border-b border-slate-900 pb-3 flex justify-between items-center">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Edit2 className="w-4 h-4" /> Edit Spectator Profile
                </span>
                <button 
                  onClick={() => setEditingFan(null)}
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
                  <label htmlFor="edit-fan-fullname-input" className="block text-[9px] text-slate-500 uppercase tracking-wider font-bold">Full Name:</label>
                  <input
                    id="edit-fan-fullname-input"
                    type="text"
                    value={editFanName}
                    onChange={(e) => setEditFanName(e.target.value)}
                    className="w-full bg-[#07090c] border border-[#1b2531] rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Phone number */}
                <div className="space-y-1">
                  <label htmlFor="edit-fan-phone-input" className="block text-[9px] text-slate-500 uppercase tracking-wider font-bold">Verified Phone Number:</label>
                  <input
                    id="edit-fan-phone-input"
                    type="text"
                    value={editFanPhone}
                    onChange={(e) => setEditFanPhone(e.target.value)}
                    className="w-full bg-[#07090c] border border-[#1b2531] rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Selected Stadium */}
                <div className="space-y-1">
                  <label htmlFor="edit-fan-stadium-select" className="block text-[9px] text-slate-500 uppercase tracking-wider font-bold">Facility Hub Assignment:</label>
                  <select
                    id="edit-fan-stadium-select"
                    value={editFanStadium}
                    onChange={(e) => setEditFanStadium(e.target.value)}
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
                  <span className="block text-[9.5px] text-sky-400 uppercase tracking-widest font-bold mb-2">Stadium Seat Allocation:</span>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[8px] text-slate-500 uppercase tracking-wider font-bold mb-1">Section:</label>
                      <input
                        type="text"
                        value={editFanSeatSection}
                        onChange={(e) => setEditFanSeatSection(e.target.value)}
                        placeholder="e.g. 118"
                        className="w-full bg-[#07090c] border border-[#1b2531] rounded-lg px-2.5 py-1.5 text-center text-slate-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] text-slate-500 uppercase tracking-wider font-bold mb-1">Row:</label>
                      <input
                        type="text"
                        value={editFanSeatRow}
                        onChange={(e) => setEditFanSeatRow(e.target.value)}
                        placeholder="e.g. K"
                        className="w-full bg-[#07090c] border border-[#1b2531] rounded-lg px-2.5 py-1.5 text-center text-slate-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] text-slate-500 uppercase tracking-wider font-bold mb-1">Seat Number:</label>
                      <input
                        type="text"
                        value={editFanSeatNumber}
                        onChange={(e) => setEditFanSeatNumber(e.target.value)}
                        placeholder="e.g. 14"
                        className="w-full bg-[#07090c] border border-[#1b2531] rounded-lg px-2.5 py-1.5 text-center text-slate-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-900 flex justify-end gap-2 text-xs">
                <button
                  onClick={() => setEditingFan(null)}
                  className="px-4 py-2 hover:bg-slate-950 border border-slate-900 hover:border-slate-800 text-slate-400 hover:text-slate-200 rounded font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEditFan}
                  disabled={isUpdatingFan}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded font-bold cursor-pointer transition-colors"
                >
                  {isUpdatingFan ? "Saving..." : "Save Modifications"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: Delete Fan Confirmation */}
        {deletingFan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 font-mono">
            <div className="bg-[#0b0e12] border border-red-500/50 rounded-xl max-w-md w-full p-6 shadow-[0_0_50px_rgba(239,68,68,0.15)] space-y-4 animate-fadeIn">
              <div className="border-b border-slate-900 pb-3 flex items-center gap-2 text-red-400 font-bold">
                <Trash2 className="w-4 h-4" />
                <span className="text-xs uppercase tracking-widest">Confirm Spectator Deletion</span>
              </div>

              {registryError && (
                <div className="p-2.5 bg-red-950/20 border border-red-900/40 text-red-400 text-[10px] rounded leading-relaxed">
                  ⚠️ {registryError}
                </div>
              )}

              <p className="text-xs text-slate-300 leading-relaxed">
                You are about to permanently delete the spectator entry for <span className="text-white font-extrabold">"{deletingFan.name}"</span> with phone <span className="text-white font-semibold">{deletingFan.phoneNumber || "NA"}</span>. This will revoke companion deck synchronization and clear all allocated seat resources.
              </p>

              <div className="pt-3 border-t border-slate-900 flex justify-end gap-2 text-xs">
                <button
                  onClick={() => setDeletingFan(null)}
                  className="px-4 py-2 hover:bg-slate-950 border border-slate-900 hover:border-slate-850 text-slate-400 hover:text-slate-200 rounded font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDeleteFan}
                  disabled={isUpdatingFan}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded font-bold cursor-pointer transition-colors"
                >
                  {isUpdatingFan ? "Deleting..." : "Permanently Delete Entry"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: Clear All Spectators Confirmation */}
        {showClearConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 font-mono">
            <div className="bg-[#0b0e12] border border-red-500/50 rounded-xl max-w-md w-full p-6 shadow-[0_0_50px_rgba(239,68,68,0.15)] space-y-4 animate-fadeIn">
              <div className="border-b border-slate-900 pb-3 flex items-center gap-2 text-red-400 font-bold">
                <Trash2 className="w-4 h-4" />
                <span className="text-xs uppercase tracking-widest">Confirm Database Purge</span>
              </div>

              {registryError && (
                <div className="p-2.5 bg-red-950/20 border border-red-900/40 text-red-400 text-[10px] rounded leading-relaxed">
                  ⚠️ {registryError}
                </div>
              )}

              <p className="text-xs text-slate-300 leading-relaxed">
                🚨 <strong className="text-red-400 font-black">CRITICAL ACTION:</strong> You are about to permanently purge and delete <strong className="text-white">ALL</strong> spectator entries from the database. This action is irreversible and will log out all spectators currently in active sessions.
              </p>

              <div className="pt-3 border-t border-slate-900 flex justify-end gap-2 text-xs">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-4 py-2 hover:bg-slate-950 border border-slate-900 hover:border-slate-850 text-slate-400 hover:text-slate-200 rounded font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearAllFans}
                  disabled={isUpdatingFan}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded font-bold cursor-pointer transition-colors"
                >
                  {isUpdatingFan ? "Purging..." : "Purge All Spectators"}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    )}
  </main>
</div>
)}

      {/* FOOTER credit and guidelines reference */}
      <footer className="bg-[#0b0e12]/80 border-t border-[#1b2531]/40 px-6 py-4 text-center text-[11px] text-slate-500 font-mono mt-8">
        <p className="uppercase tracking-widest text-[9px] mb-1">Montery Matrix Terminal Security System 4.0.0</p>
        <p className="leading-relaxed text-slate-600 font-sans max-w-2xl mx-auto">
          This system enforces severe firewalls protecting tournament facilities. Designed solely for official FIFA World Cup 2026 operations staff. Unauthorized access is recorded in system logs and blocked automatically.
        </p>
      </footer>

      {/* Floating Tactical Incident Registry Tab on the right screen edge */}
      {currentSessionRole !== "UNASSIGNED" && currentSessionRole !== "FAN" && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed right-0 top-1/3 z-40 bg-[#0e1319]/95 hover:bg-[#161d24] border border-r-0 border-[#1b2531] hover:border-cyan-500/50 text-cyan-400 py-3.5 px-2 rounded-l-md font-mono text-[9px] tracking-widest uppercase [writing-mode:vertical-lr] flex items-center gap-2 shadow-[0_0_20px_rgba(0,0,0,0.6)] transition group cursor-pointer"
          title="Open Collapsible Incident Registry"
        >
          <History className="w-3.5 h-3.5 group-hover:rotate-[-45deg] transition-transform text-cyan-400" />
          <span className="font-bold">INCIDENT REGISTRY [{incidentHistory.length}]</span>
        </button>
      )}

      {/* Tactical Incident Registry Sidebar Panel */}
      <IncidentHistorySidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        history={incidentHistory}
        onRestoreIncident={handleRestoreIncident}
        activeIncidentId={activeIncidentId}
        onClearIncident={handleClearIncident}
        onResolveIncident={handleResolveIncident}
        isLoading={isInitialLoading}
      />
    </div>
  );
}
