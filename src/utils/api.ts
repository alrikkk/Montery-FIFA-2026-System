/**
 * Shared API Client for Monterrey Smart Stadiums
 * Handles communications with backend endpoints (/api/query, /api/chat)
 * and implements global error handling.
 */

// Global error store for subscription
type ErrorListener = (error: string | null) => void;
let globalError: string | null = null;
const listeners = new Set<ErrorListener>();

export const apiGlobalErrorStore = {
  getError: () => globalError,
  setError: (error: string | null) => {
    globalError = error;
    listeners.forEach((l) => l(error));
  },
  subscribe: (listener: ErrorListener) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }
};

/**
 * Standardized API call wrapper with global error handling & mapping
 */
export async function fetchStadiumApi<T = unknown>(
  endpoint: string,
  payload: unknown
): Promise<T> {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("RATE_LIMIT_EXCEEDED");
      }
      throw new Error(`HTTP_ERROR_${response.status}`);
    }

    const data = await response.json();
    return data as T;
  } catch (error: unknown) {
    const errObj = error instanceof Error ? error : new Error(String(error));
    // Map internal error signatures to clear, human-understandable, high-fidelity messages
    let userFriendlyMessage = "An unexpected systems connection error occurred inside the Monterrey Security Core.";
    
    if (errObj.message === "RATE_LIMIT_EXCEEDED") {
      userFriendlyMessage = "Monterrey Security Firewall: Rate limit exceeded. Please wait a moment before trying again.";
    } else if (errObj.message?.includes("HTTP_ERROR_401") || errObj.message?.includes("HTTP_ERROR_403")) {
      userFriendlyMessage = "Monterrey Security Matrix: Unauthorized action request blocked by access policies.";
    } else if (errObj.message?.includes("HTTP_ERROR_50")) {
      userFriendlyMessage = "Monterrey Core Server: The AI engine is undergoing momentary diagnostics. Please retry.";
    } else if (errObj.message === "Failed to fetch") {
      userFriendlyMessage = "Monterrey Network Interruption: Unable to contact the stadium compliance firewall. Check your connections.";
    } else if (errObj.message) {
      userFriendlyMessage = `Monterrey Core Exception: ${errObj.message}`;
    }

    // Enhance standard console log with structured debug metadata
    console.error(`[Stadium API Global Error Handler] Failure on ${endpoint}:`, {
      originalError: error,
      mappedMessage: userFriendlyMessage,
      timestamp: new Date().toISOString()
    });

    // Re-throw with mapped user friendly message so the caller UI can capture and display it
    const enhancedError = Object.assign(new Error(userFriendlyMessage), {
      originalError: error,
      endpoint: endpoint
    });
    throw enhancedError;
  }
}

/**
 * Unified helper function for Gemini API interaction logic (via backend proxy /api/chat and /api/query).
 * Wraps calls in a try/catch block, manages the global error state,
 * and triggers user-facing notifications on failure.
 */
export async function fetchGeminiApi<T = unknown>(
  endpoint: "/api/chat" | "/api/query",
  payload: unknown
): Promise<T> {
  try {
    // Clear any previous global error upon initiating a new request
    apiGlobalErrorStore.setError(null);

    const data = await fetchStadiumApi<T>(endpoint, payload);
    return data;
  } catch (error: unknown) {
    const errObj = error instanceof Error ? error : new Error(String(error));
    const errorMessage = errObj.message || "An unexpected systems connection error occurred inside the Monterrey Security Core.";
    // Set the global error state which will automatically trigger the user-facing notification banner
    apiGlobalErrorStore.setError(errorMessage);
    throw errObj;
  }
}

