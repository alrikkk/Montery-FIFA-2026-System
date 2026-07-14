# Montery — FIFA 2026 Smart Stadiums System

Montery is an advanced, high-fidelity 3D Digital Twin and operations compliance platform tailored for the **FIFA World Cup 2026™**. Built on top of **React**, **TypeScript**, **Vite**, **Three.js**, and powered by the server-side **Gemini API**, Montery provides real-time situational awareness, multi-role compliance enforcement, dynamic routing, and intelligent multi-lingual safety assistance.

---

## 🚀 How Montery Addresses Challenge 4: Smart Stadiums & Tournament Operations

Montery has been engineered to solve critical matchday friction points and streamline complex stadium operations under heavy crowd conditions. Each module directly aligns with the operational requirements of FIFA Challenge 4:

### 1. Ops Command Center (Friction Point: Delayed Real-Time Decision-Making)
* **The Problem:** Operations directors and security dispatchers face fragmented communication and lack real-time visual telemetry, delaying emergency dispatches and flow adjustments.
* **The Solution:** A centralized 3D digital twin of the venue displaying active incident alerts (such as medical collapses or queue blockages), paired with real-time camera coordinates, radio briefing text, and automated dispatcher checklists.

### 2. Volunteer Triage Portal (Friction Point: Crowd Control & Queue Congestion)
* **The Problem:** On-the-ground volunteers are unable to accurately gauge queue thresholds, leading to massive overcrowding and safety risks at major access gates.
* **The Solution:** Provides active monitoring of entrance throughput and queue count limits (e.g., Gate C warning thresholds). The AI assistant provides real-time queue redirection directives, instructing volunteers when and how to balance crowds between adjacent gates (e.g., Gate C to Gate D redirect).

### 3. Concession Intelligence (Friction Point: Supply Chains & Special Requests)
* **The Problem:** Spectators struggle to find nearby concessions matching dietary requirements, while operators lack wait-time projections.
* **The Solution:** Real-time food stall listings featuring dynamic dietary tagging (e.g., Gluten-Free, Halal, Vegan), live queue wait-time projections, and automated inventory order status tracking.

### 4. Inclusivity Matrix (Friction Point: Accessibility & Multilingual Ingress)
* **The Problem:** Spectators with mobility impairments struggle with standard stadium routing, and non-native fans face language barriers with safety signage and rules.
* **The Solution:** An active **Step-Free / ADA-Compliant Routing Option** that dynamically bypasses stairs in favor of elevators. Montery also features a secure compliance engine with **Automatic Language Detection**, offering instant safety, ticketing, and emergency translations across multiple world languages.

---

## 🛠️ Core Technology Stack

Montery leverages a modern, robust full-stack architecture:

* **Frontend:** React 18, Vite (built-in production asset pipelines), Tailwind CSS (fluid and high-contrast layouts), Framer Motion (animated UI transitions).
* **3D Viewport Rendering:** Three.js with full container resizing observers and interactive point-of-interest indicators.
* **AI Engine & Cognitive Processing:** Google Gemini API integrated server-side via the official **`@google/genai` TypeScript SDK**.
  * **Primary Model:** `gemini-3.5-flash` (high-performance cognitive reasoning, structured JSON outputs, and fast latency).
  * **Fallback Model:** `gemini-3.1-flash-lite` (highly available, utilized within our resilient retry loop with exponential backoff for transient 503 or 429 errors).

---

## 🔒 Security, Compliance & PII Disclaimers

### Data Handling and Storage Compliance
Montery stores localized fan data, tickets, and simulated credentials inside `fan-accounts.json` and active incident logs inside `stadium-incidents.json`.
* **PII Notice:** These files exist **strictly for mock testing, onboarding, and local development in the sandbox environment**. They do NOT contain any real Personally Identifiable Information (PII) or confidential spectator data.
* **Production Deployment:** In a production-grade deployment, this local filesystem database is replaced by central cloud-managed databases (such as **Google Cloud Firestore** or **Cloud SQL**) incorporating robust server-side encryption at rest (using AES-256) and strict identity authentication controls.
* **Server-Side API Proxying:** All Gemini API keys and sensitive processing parameters remain strictly server-side. No API keys or internal developer credentials are ever exposed to client-side browser network calls.

---

## 🧪 Testing Infrastructure

Montery features robust test coverage verifying role security partitions, language detection heuristics, and operational calculations.

* **Test Framework:** **Vitest** (configured for rapid Node execution).
* **Test Command:**
  * To run the test suite in watch mode: `npm run test`
  * To run a single coverage check (suitable for CI/CD): `npm run test:ci`
* **Coverage Scope:** Covers Role-Based Access Control (RBAC) spectator lockout logic, automatic language detection helpers, French and Spanish localization tags, and ADA step-free routing preferences.
