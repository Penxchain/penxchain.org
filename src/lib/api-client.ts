import axios, {
  InternalAxiosRequestConfig,
  AxiosError,
  AxiosResponse,
} from "axios";

/* ---------------- TYPES ---------------- */

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

/* ---------------- USER-FRIENDLY ERROR MESSAGES ---------------- */

/**
 * Map technical errors to calm, human-readable messages
 * Users don't care about technical details - they just want to know what to do
 */
const USER_FRIENDLY_MESSAGES: Record<string, string> = {
  // Network issues
  "Network Error": "Connection issue. Please check your internet and try again.",
  "ECONNREFUSED": "Unable to connect to our servers. Please try again shortly.",
  "ECONNRESET": "Connection was interrupted. Please try again.",
  "ETIMEDOUT": "Request timed out. Please try again.",
  
  // Auth issues (keep vague for security)
  "Invalid credentials": "Invalid email or password. Please try again.",
  "Invalid email or password": "Invalid email or password. Please try again.",
  "Authentication required": "Please log in to continue.",
  "jwt expired": "Your session has expired. Please log in again.",
  "token expired": "Your session has expired. Please log in again.",
  
  // Registration issues
  "Email already registered": "This email is already registered. Please try logging in instead.",
  "Username already taken": "This username is already taken. Please choose another one.",
  "Wallet already linked": "This wallet is already linked to another account.",
  "User already exists": "User already exists. Please try logging in.",

  // Generic server errors
  "Internal Server Error": "We're having trouble right now. Please try again shortly.",
  "Service Unavailable": "Our service is temporarily unavailable. Please try again in a moment.",
  
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
  if (status === 401) return "Please log in to continue.";
  if (status === 403) return "⚠️🚨You don't have permission to do this.🚨⚠️";
  if (status === 404) return "The requested resource was not found.";
  if (status === 429) return "Too many requests. Please wait a moment and try again.";
  if (status && status >= 500) return "We're having trouble right now. Please try again shortly.";
  
  // Final fallback - never show raw technical messages
  return "Something went wrong. Please try again.";
}

/* ---------------- AXIOS INSTANCE ---------------- */

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3002",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30_000,
});

/* ---------------- REQUEST INTERCEPTOR ---------------- */

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const session = localStorage.getItem("penxchain_waitlist_user");
      if (session) {
        try {
          const { token } = JSON.parse(session);
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch {
          // silent fail — auth is optional here
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

/* ---------------- RESPONSE INTERCEPTOR ---------------- */

api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: AxiosError<{ message?: string }>) => {
    return Promise.reject(error);
  },
);

/* ---------------- API REQUEST WRAPPER ---------------- */

export async function apiRequest<T>(
  url: string,
  options: { 
    method?: "GET" | "POST" | "PUT" | "DELETE"; 
    body?: any; 
    headers?: Record<string, string>;
    retries?: number;
  } = {},
): Promise<ApiResult<T>> {
  const maxRetries = options.retries ?? 2;
  let attempt = 0;

  while (attempt <= maxRetries) {
    try {
      let response: any;

      if (options.method === "POST") {
        response = await api.post(url, options.body ?? {}, { headers: options.headers });
      } else if (options.method === "PUT") {
        response = await api.put(url, options.body ?? {}, { headers: options.headers });
      } else if (options.method === "DELETE") {
        response = await api.delete(url, { headers: options.headers });
      } else {
        response = await api.get(url, { headers: options.headers });
      }

      return { ok: true, data: response as T };
    } catch (err: any) {
      const isLastAttempt = attempt === maxRetries;
      const isRetryable = axios.isAxiosError(err) && (err.code === 'ECONNABORTED' || !err.response || (err.response.status >= 500));

      if (isLastAttempt || !isRetryable) {
        // Axios error handling
        if (axios.isAxiosError(err)) {
          const rawMessage = err.response?.data?.message || err.message || "Request failed";
          const status = err.response?.status;
          const isNetworkError = !err.response;
          
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
      console.warn(`[API] Request failed, retrying in ${delay}ms... (Attempt ${attempt}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  return { ok: false, error: new Error("Unable to complete request. Please try again.") };
}

export default api;

