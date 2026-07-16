import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchStadiumApi, apiGlobalErrorStore } from "./api";

describe("Stadium API Client & Global Error Store", () => {
  beforeEach(() => {
    apiGlobalErrorStore.setError(null);
    vi.restoreAllMocks();
  });

  describe("fetchStadiumApi", () => {
    it("should successfully parse and return JSON payload on 200 OK", async () => {
      const mockResponse = { data: "success-data" };
      
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      });
      
      vi.stubGlobal("fetch", fetchMock);

      const result = await fetchStadiumApi("/api/query", { query: "hello" });
      
      expect(fetchMock).toHaveBeenCalledWith("/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: "hello" }),
      });
      expect(result).toEqual(mockResponse);
    });

    it("should handle 429 rate-limit response and map to the rate-limit user message", async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
      });
      
      vi.stubGlobal("fetch", fetchMock);

      await expect(fetchStadiumApi("/api/query", {})).rejects.toThrow(
        "Monterrey Security Firewall: Rate limit exceeded. Please wait a moment before trying again."
      );
    });

    it("should handle 401/403 unauthorized response and map to the unauthorized message", async () => {
      const fetchMock401 = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
      });
      
      vi.stubGlobal("fetch", fetchMock401);

      await expect(fetchStadiumApi("/api/query", {})).rejects.toThrow(
        "Monterrey Security Matrix: Unauthorized action request blocked by access policies."
      );

      const fetchMock403 = vi.fn().mockResolvedValue({
        ok: false,
        status: 403,
      });
      
      vi.stubGlobal("fetch", fetchMock403);

      await expect(fetchStadiumApi("/api/query", {})).rejects.toThrow(
        "Monterrey Security Matrix: Unauthorized action request blocked by access policies."
      );
    });

    it("should handle network failure ('Failed to fetch') and map to connection message", async () => {
      const fetchMock = vi.fn().mockRejectedValue(new Error("Failed to fetch"));
      
      vi.stubGlobal("fetch", fetchMock);

      await expect(fetchStadiumApi("/api/query", {})).rejects.toThrow(
        "Monterrey Network Interruption: Unable to contact the stadium compliance firewall. Check your connections."
      );
    });
  });

  describe("apiGlobalErrorStore", () => {
    it("should allow subscribing a listener and notify it when setError is called", () => {
      const listener = vi.fn();
      
      // Subscribe to error store
      const unsubscribe = apiGlobalErrorStore.subscribe(listener);
      
      // Initially, error should be null
      expect(apiGlobalErrorStore.getError()).toBeNull();
      
      // Trigger error
      const errorMessage = "Test error message";
      apiGlobalErrorStore.setError(errorMessage);
      
      expect(apiGlobalErrorStore.getError()).toBe(errorMessage);
      expect(listener).toHaveBeenCalledWith(errorMessage);
      expect(listener).toHaveBeenCalledTimes(1);

      // Reset
      apiGlobalErrorStore.setError(null);
      expect(listener).toHaveBeenLastCalledWith(null);
      expect(listener).toHaveBeenCalledTimes(2);

      // Unsubscribe
      unsubscribe();
    });

    it("should remove the listener upon calling unsubscribe", () => {
      const listener = vi.fn();
      
      // Subscribe and unsubscribe immediately
      const unsubscribe = apiGlobalErrorStore.subscribe(listener);
      unsubscribe();
      
      // Set error
      apiGlobalErrorStore.setError("Another error");
      
      // The listener should not be called anymore
      expect(listener).not.toHaveBeenCalled();
    });
  });
});
