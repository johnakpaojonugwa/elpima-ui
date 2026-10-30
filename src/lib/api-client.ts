import createApiClient from "./axios";

/**
 * Resolves the active API base URL.
 * Checks for explicit overrides first, then falls back to mode-specific configurations.
 * Defaults safely to the production Render URL in production environments.
 */
function resolveApiBaseUrl(): string {
  // 1. Explicit API URL override takes top priority
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // 2. Identify the active mode (support VITE_MODE, standard Vite MODE, or PROD flag)
  const isProd = import.meta.env.PROD || import.meta.env.MODE === "production";
  const explicitMode = (
    import.meta.env.VITE_MODE ||
    import.meta.env.MODE ||
    (isProd ? "production" : "dev")
  ).toLowerCase();

  switch (explicitMode) {
    case "prod":
    case "production":
      return (
        import.meta.env.VITE_PROD_URL ||
        "https://elpima-api.onrender.com"
      );
    case "stage":
    case "staging":
      return (
        import.meta.env.VITE_STAGE_URL ||
        "https://elpima-api.onrender.com"
      );
    case "dev":
    case "development":
    default:
      // If deployed/built in production mode (e.g., on Vercel) without env variables,
      // never default to localhost. Use the live hosted API.
      if (isProd) {
        return (
          import.meta.env.VITE_PROD_URL ||
          import.meta.env.VITE_DEV_URL ||
          "https://elpima-api.onrender.com"
        );
      }
      return import.meta.env.VITE_DEV_URL || "http://localhost:5000";
  }
}

export const API_BASE_URL = resolveApiBaseUrl();

export const apiClient = createApiClient(API_BASE_URL);

// Backwards-compatible alias for code importing `api`
export const api = apiClient;
