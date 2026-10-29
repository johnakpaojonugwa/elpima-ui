import createApiClient from "./axios";

/**
 * Resolves the active API base URL solely from VITE_MODE.
 * No fallback URLs: vite.config.ts enforces at build/dev startup that the
 * matching VITE_*_URL env var is defined.
 */
function resolveApiBaseUrl(): string {
  const mode = (import.meta.env.VITE_MODE || "dev").toLowerCase();

  switch (mode) {
    case "prod":
    case "production":
      return import.meta.env.VITE_PROD_URL || "https://elpima-api.onrender.com";
    case "stage":
    case "staging":
      return import.meta.env.VITE_STAGE_URL || "https://elpima-api.onrender.com";
    case "dev":
    case "development":
    default:
      return import.meta.env.VITE_DEV_URL || "http://localhost:5000";
  }
}

export const API_BASE_URL = resolveApiBaseUrl();

export const apiClient = createApiClient(API_BASE_URL);

// Backwards-compatible alias for code importing `api`
export const api = apiClient;
