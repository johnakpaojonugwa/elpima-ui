import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import type { Pagination } from "@/types/api";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _isRetryRequest?: boolean;
}

export interface ExtendedAxiosResponse<T = any, D = any>
  extends AxiosResponse<T, D> {
  meta?: {
    pagination?: Pagination;
    [key: string]: unknown;
  };
  message?: string;
}

export default function createApiClient(
  configuredBaseUrl?: string,
  initialAccessToken?: string,
) {
  // Normalize base URL: strip trailing slashes and any trailing /api/v1 or /v1
  // so services calling `/api/v1/...` or `/health` always resolve cleanly.
  const normalizedBaseUrl = (
    configuredBaseUrl || "http://localhost:5000"
  )
    .trim()
    .replace(/\/+$/, "")
    .replace(/\/(api\/)?v1$/i, "");

  const apiClient = axios.create({
    baseURL: normalizedBaseUrl,
    timeout: 120000, // 2 minutes for cold starts on cloud hosting
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor - dynamically attach active auth token & idempotency key
  apiClient.interceptors.request.use(
    (requestConfig) => {
      let activeBearerToken = initialAccessToken || null;

      if (typeof window !== "undefined") {
        try {
          const directToken =
            localStorage.getItem("access_token") ||
            localStorage.getItem("accessToken") ||
            localStorage.getItem("token") ||
            localStorage.getItem("jwt");

          if (directToken) {
            activeBearerToken = directToken;
          } else {
            const authStorageItem = localStorage.getItem("auth-storage");
            if (authStorageItem) {
              const parsedStorage = JSON.parse(authStorageItem);
              activeBearerToken =
                parsedStorage?.state?.accessToken ||
                parsedStorage?.state?.access_token ||
                parsedStorage?.accessToken ||
                parsedStorage?.access_token ||
                activeBearerToken;
            }
          }
        } catch {
          // ignore localStorage parsing errors
        }
      }

      requestConfig.headers["ngrok-skip-browser-warning"] = "true";

      if (!requestConfig.headers.Authorization && activeBearerToken) {
        requestConfig.headers.Authorization = `Bearer ${activeBearerToken}`;
      }

      // Idempotency guard for Quote RFQ submissions to prevent duplicate quotes
      if (
        requestConfig.method?.toLowerCase() === "post" &&
        requestConfig.url?.includes("/quotes") &&
        !requestConfig.headers["Idempotency-Key"]
      ) {
        if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
          requestConfig.headers["Idempotency-Key"] = crypto.randomUUID();
        }
      }

      return requestConfig;
    },
    (requestError) => Promise.reject(requestError),
  );

  // Response interceptor - unwrap { success, message, data, meta } envelope & handle token rotation / 401
  apiClient.interceptors.response.use(
    (apiResponse: ExtendedAxiosResponse) => {
      const responseBody = apiResponse.data;
      if (!responseBody || typeof responseBody !== "object") {
        return apiResponse;
      }

      // Check for Elpima / GetTreat envelope { success, message/msg, data, meta }
      const hasEnvelopeShape =
        ("success" in responseBody || "status" in responseBody) &&
        "data" in responseBody;

      if (!hasEnvelopeShape) {
        return apiResponse;
      }

      const isOperationSuccessful =
        responseBody.success === true || responseBody.status === true;

      if (!isOperationSuccessful) {
        return apiResponse;
      }

      // Preserve pagination/metadata on the Axios response object for fetchList<T>
      if (responseBody.meta) {
        apiResponse.meta = responseBody.meta;
      }
      if (responseBody.message || responseBody.msg) {
        apiResponse.message = responseBody.message || responseBody.msg;
      }

      // Unwrap directly to body.data when present; otherwise retain success message object
      if (responseBody.data !== null && responseBody.data !== undefined) {
        apiResponse.data = responseBody.data;
      } else {
        apiResponse.data = {
          success: true,
          message: responseBody.message || responseBody.msg || "Success",
          data: null,
        };
      }

      return apiResponse;
    },
    async (responseError) => {
      const originalRequest = responseError?.config as
        | CustomAxiosRequestConfig
        | undefined;
      const responseStatus = responseError?.response?.status;

      // Extract standardized error message from backend envelope
      // Elpima error shape: { success: false, message?, error: { code, message, details: [{ field, message }] } }
      if (responseError?.response?.data) {
        const errorData = responseError.response.data;
        const nestedError = errorData?.error;

        let extractedMessage =
          nestedError?.message ||
          errorData?.message ||
          errorData?.msg ||
          responseError.message;

        const detailsList = Array.isArray(nestedError?.details)
          ? nestedError.details
          : Array.isArray(errorData?.data)
            ? errorData.data
            : [];

        if (detailsList.length > 0) {
          const detailMessages = detailsList
            .map((item: any) =>
              item?.field && item?.message
                ? `${item.field}: ${item.message}`
                : item?.message || item?.msg || String(item),
            )
            .filter(Boolean);
          if (detailMessages.length > 0) {
            extractedMessage = detailMessages.join(". ");
          }
        }

        responseError.normalizedMessage = extractedMessage;
        responseError.errorCode = nestedError?.code || errorData?.code;
      }

      // Handle 401 Unauthorized with token refresh rotation
      if (
        responseStatus === 401 &&
        originalRequest &&
        !originalRequest._isRetryRequest
      ) {
        const requestUrl = originalRequest.url || "";
        const isAuthRoute =
          requestUrl.includes("/auth/login") ||
          requestUrl.includes("/auth/2fa/verify") ||
          requestUrl.includes("/auth/refresh-token") ||
          requestUrl.includes("/auth/forgot-password") ||
          requestUrl.includes("/auth/reset-password");

        if (!isAuthRoute) {
          originalRequest._isRetryRequest = true;

          let storedRefreshToken: string | null = null;
          if (typeof window !== "undefined") {
            storedRefreshToken =
              localStorage.getItem("refresh_token") ||
              localStorage.getItem("refreshToken");

            if (!storedRefreshToken) {
              try {
                const authStorageItem = localStorage.getItem("auth-storage");
                if (authStorageItem) {
                  const parsed = JSON.parse(authStorageItem);
                  storedRefreshToken =
                    parsed?.state?.refreshToken ||
                    parsed?.state?.refresh_token ||
                    null;
                }
              } catch {
                // ignore
              }
            }
          }

          if (storedRefreshToken) {
            try {
              // Direct refresh call using a clean axios instance to avoid interceptor recursion
              const refreshResponse = await axios.post(
                `${normalizedBaseUrl}/api/v1/auth/refresh-token`,
                { refreshToken: storedRefreshToken },
                {
                  headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
                  },
                },
              );

              const refreshedData =
                refreshResponse.data?.data || refreshResponse.data;
              const newAccessToken =
                refreshedData?.accessToken ||
                refreshedData?.access_token ||
                refreshedData?.token;
              const newRefreshToken =
                refreshedData?.refreshToken || refreshedData?.refresh_token;

              if (newAccessToken) {
                if (typeof window !== "undefined") {
                  localStorage.setItem("access_token", newAccessToken);
                  localStorage.setItem("accessToken", newAccessToken);
                  if (newRefreshToken) {
                    localStorage.setItem("refresh_token", newRefreshToken);
                    localStorage.setItem("refreshToken", newRefreshToken);
                  }

                  // Keep Zustand persisted auth-storage in sync
                  try {
                    const authStorageRaw = localStorage.getItem("auth-storage");
                    if (authStorageRaw) {
                      const parsed = JSON.parse(authStorageRaw);
                      if (parsed?.state) {
                        parsed.state.accessToken = newAccessToken;
                        parsed.state.access_token = newAccessToken;
                        if (newRefreshToken) {
                          parsed.state.refreshToken = newRefreshToken;
                          parsed.state.refresh_token = newRefreshToken;
                        }
                        localStorage.setItem(
                          "auth-storage",
                          JSON.stringify(parsed),
                        );
                      }
                    }
                  } catch {
                    // ignore
                  }
                }

                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                }

                return apiClient(originalRequest);
              }
            } catch (refreshFailedError) {
              console.warn("Token refresh attempt failed:", refreshFailedError);
            }
          }

          // If refresh failed or no refresh token, perform clean teardown
          if (typeof window !== "undefined") {
            try {
              localStorage.removeItem("auth-storage");
              localStorage.removeItem("access_token");
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refresh_token");
              localStorage.removeItem("refreshToken");
              localStorage.removeItem("token");
              localStorage.removeItem("jwt");
            } catch {
              // ignore
            }

            if (
              (window.location.pathname.startsWith("/admin") ||
                window.location.pathname.startsWith("/super-admin")) &&
              !window.location.pathname.startsWith("/auth")
            ) {
              window.location.href = "/auth";
            }
          }
        }
      }

      return Promise.reject(responseError);
    },
  );

  return apiClient;
}
