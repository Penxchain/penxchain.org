import axios, {
  InternalAxiosRequestConfig,
  AxiosError,
  AxiosResponse,
} from "axios";

/* TYPES */

export type ApiSuccess<T> = {
  ok: true;
  data: T;
};

export type ApiFailure = {
  ok: false;
  error: Error;
  status?: number;
  isNetworkError?: boolean;
};

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

/* USER-FRIENDLY ERROR MESSAGES */

const USER_FRIENDLY_MESSAGES: Record<string, string> = {
  // Network issues
  "Network Error":
    "Connection issue. Please check your internet and try again.",
  ECONNREFUSED: "Unable to connect to our servers. Please try again shortly.",
  ECONNRESET: "Connection was interrupted. Please try again.",
  ETIMEDOUT: "Request timed out. Please try again.",

  // Auth issues (keep vague for security)
  "Invalid credentials": "Invalid email or password. Please try again.",
  "Invalid email or password": "Invalid email or password. Please try again.",
  "Invalid email or password. Please try again.":
    "Invalid email or password. Please try again.",
  "Authentication required": "Please log in to continue.",
  "jwt expired": "Your session has expired. Please log in again.",
  "token expired": "Your session has expired. Please log in again.",
  "Session expired. Please log in again.":
    "Your session has expired. Please log in again.",
  "Session invalidated. Please log in again.":
    "Your session was refreshed elsewhere. Please log in again.",
  "No refresh session found.":
    "Your session has ended. Please log in again.",
  "Email/Username and password required.":
    "Email/username and password are required.",
  "Wallet login is not enabled on this endpoint. Use email/username login.":
    "Wallet login is not enabled yet. Use email/username login.",
  "Additional security verification is required.":
    "Additional security verification is required. Please try again.",
  "Security verification is required.":
    "Security verification is required. Please try again.",
  "Security verification failed. Please try again.":
    "Security verification failed. Please try again.",
  "Security policy blocked this request. Please try again later.":
    "We detected suspicious activity. Please try again later.",

  // Registration issues
  "Email already registered":
    "This email is already registered. Please try logging in instead.",
  "Username already taken":
    "This username is already taken. Please choose another one.",
  "Wallet already linked": "This wallet is already linked to another account.",
  "User already exists": "User already exists. Please try logging in.",
  "You can no longer create another account on this device":
    "You already have an account on this device. Please log in instead.",

  // Generic server errors
  "Internal Server Error":
    "We're having trouble right now. Please try again shortly.",
  "Service Unavailable":
    "Our service is temporarily unavailable. Please try again in a moment.",

  // Rate limiting
  "Too many requests": "Too many requests. Please slow down and try again.",
};

/**
 * Convert a technical error message to a user-friendly one
 */
function getUserFriendlyMessage(message: string, status?: number): string {
  // Check for exact match
  if (USER_FRIENDLY_MESSAGES[message]) {
    return USER_FRIENDLY_MESSAGES[message];
  }

  // Check for partial matches
  for (const [key, friendlyMessage] of Object.entries(USER_FRIENDLY_MESSAGES)) {
    if (message.toLowerCase().includes(key.toLowerCase())) {
      return friendlyMessage;
    }
  }

  // Status-based fallbacks
  if (status === 401) {
    // Allow specific auth errors to pass through
    const lowerMsg = message.toLowerCase();
    if (
      lowerMsg.includes("incorrect password") ||
      lowerMsg.includes("no account found") ||
      lowerMsg.includes("account suspended") ||
      lowerMsg.includes("invalid login parameters") ||
      lowerMsg.includes("email/username and password required") ||
      lowerMsg.includes("invalid email or password") ||
      lowerMsg.includes("session invalidated") ||
      lowerMsg.includes("session expired")
    ) {
      return message;
    }
    return "Please log in to continue.";
  }
  if (status === 403) {
    if (message.toLowerCase().includes("account banned")) return message;
    return "You don't have permission to do this.";
  }
  if (status === 400) {
    const lowerMsg = message.toLowerCase();
    if (
      lowerMsg.includes("required") ||
      lowerMsg.includes("verification") ||
      lowerMsg.includes("wallet login")
    ) {
      return message;
    }
    return "Please check your input and try again.";
  }
  if (status === 409) {
    if (message.includes("device")) return message;
    return "This resource already exists.";
  }
  if (status === 423) {
    // Account under review — pass through the backend's dynamic message
    return message;
  }
  if (status === 404) return "The requested resource was not found.";
  if (status === 429)
    return "Too many requests. Please wait a moment and try again.";
  if (status && status >= 500)
    return "We're having trouble right now. Please try again shortly.";

  // Final fallback - never show raw technical messages
  return "Something went wrong. Please try again.";
}

/* AXIOS INSTANCE */

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3002",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30_000,
  withCredentials: true,
});

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3002";
const SESSION_STORAGE_KEY = "penxchain_waitlist_user";
let refreshInFlight: Promise<string | null> | null = null;

function readStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.token || null;
  } catch {
    return null;
  }
}

function writeStoredToken(nextToken: string): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    localStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({ ...parsed, token: nextToken }),
    );
    const ev = new CustomEvent("penxchain:user-updated", {
      detail: { ...parsed, token: nextToken },
    });
    window.dispatchEvent(ev);
  } catch {
    // non-fatal
  }
}

function shouldTryRefresh(status?: number, message?: string) {
  if (status !== 401) return false;
  const normalized = (message || "").toLowerCase();
  return (
    normalized.includes("token") ||
    normalized.includes("jwt") ||
    normalized.includes("authorization") ||
    normalized.includes("session")
  );
}

async function refreshAccessToken(): Promise<string | null> {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/refresh`,
        {},
        {
          withCredentials: true,
          timeout: 15_000,
        },
      );
      const token = response?.data?.token;
      if (!token || typeof token !== "string") return null;
      writeStoredToken(token);
      return token;
    } catch {
      return null;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

/* REQUEST INTERCEPTOR */

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = readStoredToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

/* RESPONSE INTERCEPTOR */

api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  async (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (
      originalRequest &&
      !originalRequest._retry &&
      !String(originalRequest.url || "").includes("/auth/login") &&
      !String(originalRequest.url || "").includes("/auth/refresh") &&
      shouldTryRefresh(status, message)
    ) {
      originalRequest._retry = true;
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        (originalRequest.headers as any) =
          originalRequest.headers || ({} as any);
        (originalRequest.headers as any).Authorization = `Bearer ${refreshed}`;
        return api.request(originalRequest);
      }
    }

    return Promise.reject(error);
  },
);

/* API REQUEST WRAPPER */

export async function apiRequest<T>(
  url: string,
  options: {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: any;
    headers?: Record<string, string>;
    retries?: number;
  } = {},
): Promise<ApiResult<T>> {
  const clearInvalidSession = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("penxchain_waitlist_user");
    try {
      const ev = new CustomEvent("penxchain:user-updated", { detail: null });
      window.dispatchEvent(ev);
    } catch {}
  };

  const maxRetries = options.retries ?? 2;
  let attempt = 0;

  while (attempt <= maxRetries) {
    try {
      let response: any;

      if (options.method === "POST") {
        response = await api.post(url, options.body ?? {}, {
          headers: options.headers,
        });
      } else if (options.method === "PUT") {
        response = await api.put(url, options.body ?? {}, {
          headers: options.headers,
        });
      } else if (options.method === "DELETE") {
        response = await api.delete(url, { headers: options.headers });
      } else {
        response = await api.get(url, { headers: options.headers });
      }

      return { ok: true, data: response as T };
    } catch (err: any) {
      const isLastAttempt = attempt === maxRetries;
      const isRetryable =
        axios.isAxiosError(err) &&
        (err.code === "ECONNABORTED" ||
          !err.response ||
          err.response.status >= 500);

      if (isLastAttempt || !isRetryable) {
        // Axios error handling
        if (axios.isAxiosError(err)) {
          const rawMessage =
            err.response?.data?.message || err.message || "Request failed";
          const status = err.response?.status;
          const isNetworkError = !err.response;
          const lowerMessage = rawMessage.toLowerCase();
          if (
            status === 401 &&
            (lowerMessage.includes("token") ||
              lowerMessage.includes("jwt") ||
              lowerMessage.includes("authorization"))
          ) {
            clearInvalidSession();
          }

          // Log detailed axios error to console for debugging (do not expose raw to users)
          console.error("[API][ERROR]", {
            url,
            method: options.method || "GET",
            status,
            isNetworkError,
            responseData: err.response?.data,
            message: err.message,
            stack: err.stack,
          });

          // Convert to user-friendly message
          const userMessage = getUserFriendlyMessage(rawMessage, status);

          return {
            ok: false,
            error: new Error(userMessage),
            status,
            isNetworkError,
          };
        }

        // Generic error handling
        const rawMessage = err?.message || String(err) || "Unexpected error";
        return {
          ok: false,
          error: new Error(getUserFriendlyMessage(rawMessage)),
          isNetworkError: false,
        };
      }

      // Wait before next attempt (exponential backoff)
      attempt++;
      const delay = Math.pow(2, attempt) * 250;
      console.warn(
        `[API] Request failed, retrying in ${delay}ms... (Attempt ${attempt}/${maxRetries})`,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  return {
    ok: false,
    error: new Error("Unable to complete request. Please try again."),
  };
}

export default api;
