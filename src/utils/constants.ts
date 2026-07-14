/**
 * Montery Smart Stadiums System Constants
 * Core configuration values, models, security keys, and RBAC roles.
 */

// 1. Core Gemini Model Version Configuration
export const GEMINI_MODEL_PRIMARY = "gemini-3.5-flash";
export const GEMINI_MODEL_FALLBACK = "gemini-3.1-flash-lite";

// 2. Role-Based Access Control (RBAC) Roles
export const ROLE_UNASSIGNED = "UNASSIGNED";
export const ROLE_FAN = "FAN";
export const ROLE_ORGANIZER = "ORGANIZER";
export const ROLE_VENUE_STAFF = "VENUE_STAFF";
export const ROLE_VOLUNTEER = "VOLUNTEER";

// List of all valid RBAC roles for iterations/validations
export const VALID_ROLES = [
  ROLE_UNASSIGNED,
  ROLE_FAN,
  ROLE_ORGANIZER,
  ROLE_VENUE_STAFF,
  ROLE_VOLUNTEER
] as const;

// 3. Schema Keys used in JSON validation and payload routing
export const SCHEMA_KEY_FIREWALL_STATUS = "security_firewall_status";
export const SCHEMA_KEY_ERROR_HANDLER = "runtime_error_handler";
export const SCHEMA_KEY_SESSION_MATRIX = "session_access_matrix";
export const SCHEMA_KEY_STRUCTURAL_PROFILE = "venue_structural_profile";
export const SCHEMA_KEY_CAMERA_MATRIX = "threejs_camera_matrix";
export const SCHEMA_KEY_LOCALIZED_DICT = "ui_localized_dictionary";
export const SCHEMA_KEY_FAN_PAYLOAD = "fan_experience_payload";
export const SCHEMA_KEY_ADMIN_PAYLOAD = "administrative_ops_payload";
export const SCHEMA_KEY_SYSTEM_DIAGNOSTICS = "system_diagnostics";

// 4. Multi-port Venue Limits and thresholds
export const GATE_C_THRESHOLD_WARNING = 500;
export const GATE_QUEUE_CONGESTION_METRIC_YARDS = 50;
