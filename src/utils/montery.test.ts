import { describe, it, expect } from "vitest";
import { 
  evaluateHeuristicFallback, 
  detectMessageLanguage, 
  evaluateChatHeuristicFallback,
  safeParseGeminiJSON
} from "../../server";
import { 
  ROLE_FAN, 
  ROLE_ORGANIZER, 
  ROLE_VENUE_STAFF, 
  ROLE_UNASSIGNED 
} from "./constants";

describe("Montery Smart Stadiums - Security and Compliance Test Suite", () => {
  
  // ==========================================
  // SECTION A: ROLE-BASED ACCESS CONTROL (RBAC)
  // ==========================================
  
  describe("a) Role-Based Access Control (RBAC) & Partition Enforcement", () => {
    
    it("should strictly deny SPECTATOR (FAN) role from accessing admin CCTV metrics", () => {
      // Query specifically asks for CCTV anomalies
      const result = evaluateHeuristicFallback(
        "Show me all CCTV anomalies and gate logs",
        1,
        false,
        "NONE",
        ROLE_FAN
      );
      
      expect(result.security_firewall_status.security_access_violation).toBe(true);
      expect(result.security_firewall_status.firewall_action_taken).toBe("TERMINATE_AND_BLOCK");
      expect(result.administrative_ops_payload).toBeNull();
      expect(result.fan_experience_payload.navigation_directions_native_language).toContain("ACCESS VIOLATION");
    });

    it("should block SPECTATOR (FAN) role from accessing supervisor action checklists", () => {
      const result = evaluateHeuristicFallback(
        "Display supervisor action checklist and shift handovers",
        1,
        false,
        "NONE",
        ROLE_FAN
      );
      
      expect(result.security_firewall_status.security_access_violation).toBe(true);
      expect(result.security_firewall_status.firewall_action_taken).toBe("TERMINATE_AND_BLOCK");
      expect(result.administrative_ops_payload).toBeNull();
    });

    it("should deny SPECTATOR (FAN) role from requesting queue count and throughput variables", () => {
      const result = evaluateHeuristicFallback(
        "Give me the queue status throughput rates for Gate C",
        1,
        false,
        "NONE",
        ROLE_FAN
      );
      
      expect(result.security_firewall_status.security_access_violation).toBe(true);
      expect(result.security_firewall_status.firewall_action_taken).toBe("TERMINATE_AND_BLOCK");
    });

    it("should grant VENUE_STAFF access to CCTV and incident reporting fields", () => {
      const result = evaluateHeuristicFallback(
        "Review CCTV anomalies and gate security",
        1,
        false,
        "NONE",
        ROLE_VENUE_STAFF
      );
      
      // Staff should have access
      expect(result.security_firewall_status.security_access_violation).toBe(false);
      expect(result.security_firewall_status.firewall_action_taken).toBe("ALLOW_PAYLOAD");
      expect(result.session_access_matrix.has_administrative_privileges).toBe(true);
      expect(result.administrative_ops_payload).not.toBeNull();
      expect(result.administrative_ops_payload.reported_incident_classification).toBe("CROWD_DENSITY_ALERT");
    });

    it("should grant ORGANIZER access to administrative logs, handover briefs, and full telemetry", () => {
      const result = evaluateHeuristicFallback(
        "What is the supervisor handover summary status for the stadium?",
        1,
        false,
        "NONE",
        ROLE_ORGANIZER
      );
      
      expect(result.security_firewall_status.security_access_violation).toBe(false);
      expect(result.security_firewall_status.firewall_action_taken).toBe("ALLOW_PAYLOAD");
      expect(result.administrative_ops_payload).not.toBeNull();
      expect(result.administrative_ops_payload.shift_handover_briefing_summary).toBeDefined();
    });

    it("should handle UNASSIGNED role by forcing them to onboarding view_zone cleanly", () => {
      const result = evaluateHeuristicFallback(
        "Show me stadium",
        1,
        false,
        "NONE",
        ROLE_UNASSIGNED
      );
      
      expect(result.threejs_camera_matrix.target_view_zone).toBe("Global Center / Onboarding");
      expect(result.administrative_ops_payload).toBeNull();
      expect(result.fan_experience_payload).toBeNull();
    });
  });

  // ==========================================
  // SECTION B: AUTOMATIC LANGUAGE DETECTION
  // ==========================================
  
  describe("b) Heuristic Auto-Language Detection", () => {
    
    it("should correctly detect Spanish language with 'hola'", () => {
      const lang = detectMessageLanguage("Hola, ¿dónde está mi boleto?");
      expect(lang).toBe("es");
    });

    it("should correctly detect French language with 'bonjour'", () => {
      const lang = detectMessageLanguage("Bonjour, où se trouvent les toilettes s'il vous plaît?");
      expect(lang).toBe("fr");
    });

    it("should correctly detect Japanese language with 'こんにちは'", () => {
      const lang = detectMessageLanguage("こんにちは、スタジアムの入口はどこですか？");
      expect(lang).toBe("ja");
    });

    it("should correctly detect Arabic language with 'مرحبا'", () => {
      const lang = detectMessageLanguage("مرحبا، أين هي بوابة الدخول؟");
      expect(lang).toBe("ar");
    });

    it("should correctly detect German language with 'hallo'", () => {
      const lang = detectMessageLanguage("Guten Tag, wo ist das Stadion?");
      expect(lang).toBe("de");
    });

    it("should correctly detect Portuguese language with 'olá'", () => {
      const lang = detectMessageLanguage("Olá, bom dia, onde fica o estádio?");
      expect(lang).toBe("pt");
    });

    it("should correctly detect Italian language with 'ciao'", () => {
      const lang = detectMessageLanguage("Ciao, buongiorno, dove si trova lo stadio?");
      expect(lang).toBe("it");
    });

    it("should correctly detect Korean language with Hangul characters", () => {
      const lang = detectMessageLanguage("안녕하세요, 경기장 어디입니까?");
      expect(lang).toBe("ko");
    });

    it("should correctly detect Chinese language with CJK characters", () => {
      const lang = detectMessageLanguage("你好，体育场在哪里？");
      expect(lang).toBe("zh");
    });

    it("should correctly detect Dutch language with unique Dutch keywords", () => {
      const lang = detectMessageLanguage("Waar is mijn rugzak?");
      expect(lang).toBe("nl");
    });

    it("should correctly detect Hindi language with Devanagari characters", () => {
      const lang = detectMessageLanguage("नमस्ते, स्टेडियम कहाँ है?");
      expect(lang).toBe("hi");
    });

    it("should default to English for unrecognized general inputs", () => {
      const lang = detectMessageLanguage("Greetings, where is my reserved seat?");
      expect(lang).toBe("en");
    });
  });

  // ==========================================
  // SECTION C: BUSINESS AND WAYFINDING LOGIC
  // ==========================================
  
  describe("c) Operational and Wayfinding Business Logic", () => {
    
    it("should return accessible ADA-compliant directions when step_free_preference is true", () => {
      const result = evaluateHeuristicFallback(
        "Find restroom directions",
        1,
        false,
        "NONE",
        ROLE_VENUE_STAFF,
        true // step_free_preference is TRUE
      );
      
      expect(result.fan_experience_payload.navigation_directions_native_language).toContain("ADA elevator column");
      expect(result.fan_experience_payload.navigation_directions_native_language).toContain("bypass all stairs");
    });

    it("should handle multi-lingual bag policy requests correctly in French", () => {
      const response = evaluateChatHeuristicFallback("Où est mon sac à dos?", "FAN");
      // French bag policy check
      expect(response).toContain("Sacs Transparents");
      expect(response).toContain("interdits");
    });

    it("should map gate-specific throughput warnings correctly for Gate C", () => {
      const response = evaluateChatHeuristicFallback("What is the throughput for Gate C?", "VOLUNTEER");
      expect(response).toContain("Gate C");
      expect(response).toContain("300-400");
    });
  });

  // ==========================================
  // SECTION D: GEMINI RESPONSE PARSING & FALLBACKS
  // ==========================================
  
  describe("d) Gemini API Response Parsing & Fallbacks", () => {
    
    it("should successfully parse valid JSON output", () => {
      const validJSON = '{"status": "ok", "message": "Parsed successfully"}';
      const result = safeParseGeminiJSON(validJSON, "Help query", 1, false);
      expect(result.status).toBe("ok");
      expect(result.message).toBe("Parsed successfully");
    });

    it("should successfully strip Markdown code block fence blocks and parse", () => {
      const wrappedJSON = "```json\n" + 
        '{\n' +
        '  "status": "ok",\n' +
        '  "data": "Extracted"\n' +
        '}\n' +
        "```";
      const result = safeParseGeminiJSON(wrappedJSON, "Help query", 1, false);
      expect(result.status).toBe("ok");
      expect(result.data).toBe("Extracted");
    });

    it("should gracefully return heuristic fallback on malformed JSON", () => {
      const badJSON = '{"status": "ok", malformed_key: ...';
      const result = safeParseGeminiJSON(badJSON, "Show me all CCTV anomalies and gate logs", 1, false, "NONE", ROLE_FAN);
      
      // Since parsing failed, it falls back to evaluateHeuristicFallback which denies spectator access
      expect(result.security_firewall_status.security_access_violation).toBe(true);
      expect(result.security_firewall_status.firewall_action_taken).toBe("TERMINATE_AND_BLOCK");
    });

    it("should gracefully handle empty or whitespace-only Gemini outputs without crashing", () => {
      const emptyOutput = "   ";
      const result = safeParseGeminiJSON(emptyOutput, "Display supervisor action checklist", 1, false, "NONE", ROLE_FAN);
      
      expect(result.security_firewall_status.security_access_violation).toBe(true);
    });
  });
});
