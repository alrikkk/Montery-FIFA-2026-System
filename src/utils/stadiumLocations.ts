export interface LocationConfig {
  id: string;
  name: string;
  stadium: string;
  lat: number;
  lon: number;
  defaultWeather: "SUNSHINE" | "RAIN" | "FOG" | "SNOW";
}

export const LOCATIONS: LocationConfig[] = [
  { id: "NEW_YORK_NEW_JERSEY", name: "East Rutherford, NJ", stadium: "MetLife Stadium", lat: 40.8135, lon: -74.0744, defaultWeather: "SUNSHINE" },
  { id: "LOS_ANGELES", name: "Los Angeles, CA", stadium: "SoFi Stadium", lat: 33.9534, lon: -118.3390, defaultWeather: "SUNSHINE" },
  { id: "MEXICO_CITY", name: "Mexico City, Mexico", stadium: "Estadio Azteca", lat: 19.3029, lon: -99.1505, defaultWeather: "SUNSHINE" },
  { id: "DALLAS", name: "Dallas, TX", stadium: "AT&T Stadium", lat: 32.7473, lon: -97.0945, defaultWeather: "SUNSHINE" },
  { id: "ATLANTA", name: "Atlanta, GA", stadium: "Mercedes-Benz Stadium", lat: 33.7573, lon: -84.4010, defaultWeather: "SUNSHINE" },
  { id: "VANCOUVER", name: "Vancouver, Canada", stadium: "BC Place", lat: 49.2767, lon: -123.1120, defaultWeather: "RAIN" },
  { id: "TORONTO", name: "Toronto, Canada", stadium: "BMO Field", lat: 43.6328, lon: -79.4186, defaultWeather: "RAIN" },
  { id: "GUADALAJARA", name: "Guadalajara, Mexico", stadium: "Estadio Akron", lat: 20.6811, lon: -103.4628, defaultWeather: "SUNSHINE" },
  { id: "MONTERREY", name: "Monterrey, Mexico", stadium: "Estadio BBVA", lat: 25.6691, lon: -100.2443, defaultWeather: "SUNSHINE" },
  { id: "MIAMI", name: "Miami, FL", stadium: "Hard Rock Stadium", lat: 25.9581, lon: -80.2389, defaultWeather: "SUNSHINE" },
  { id: "SEATTLE", name: "Seattle, WA", stadium: "Lumen Field", lat: 47.5952, lon: -122.3316, defaultWeather: "RAIN" },
  { id: "SAN_FRANCISCO", name: "San Francisco, CA", stadium: "Levi's Stadium", lat: 37.4033, lon: -121.9694, defaultWeather: "SUNSHINE" },
  { id: "KANSAS_CITY", name: "Kansas City, MO", stadium: "Arrowhead Stadium", lat: 39.0489, lon: -94.4839, defaultWeather: "SUNSHINE" },
  { id: "HOUSTON", name: "Houston, TX", stadium: "NRG Stadium", lat: 29.6847, lon: -95.4078, defaultWeather: "SUNSHINE" },
  { id: "BOSTON", name: "Boston, MA", stadium: "Gillette Stadium", lat: 42.0909, lon: -71.2643, defaultWeather: "SUNSHINE" },
  { id: "PHILADELPHIA", name: "Philadelphia, PA", stadium: "Lincoln Financial Field", lat: 39.9008, lon: -75.1675, defaultWeather: "SUNSHINE" },
];

/**
 * Maps a visual description or raw anchor string to a normalized physical location anchor ID
 * used to trigger camera movements, highlight sections on the 3D digital twin,
 * and display localized contextual instructions.
 * 
 * @param {string | null} anchor - The raw, potentially user-entered or model-generated visual anchor string (e.g., "Gate A" or "Section 118")
 * @returns {string | null} The mapped uppercase physical anchor identifier, or null if unmapped
 */
export function mapLocationAnchor(anchor: string | null): string | null {
  if (!anchor) return null;
  const uAnchor = anchor.toUpperCase();
  if (uAnchor.includes("GATE_A") || uAnchor.includes("GATE A")) return "GATE_A";
  if (uAnchor.includes("GATE_B") || uAnchor.includes("GATE B")) return "GATE_B";
  if (uAnchor.includes("GATE_C") || uAnchor.includes("GATE C")) return "GATE_C";
  if (uAnchor.includes("GATE_D") || uAnchor.includes("GATE D")) return "GATE_D";
  if (uAnchor.includes("TROUBLE") || uAnchor.includes("BOOTH")) return "TROUBLESHOOTING_BOOTH";
  if (uAnchor.includes("118") || uAnchor.includes("104")) return "SECTION_118";
  if (uAnchor.includes("143") || uAnchor.includes("112")) return "SECTION_143";
  return null;
}
