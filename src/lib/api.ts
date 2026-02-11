const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

type FetchOptions = RequestInit & {
  headers?: Record<string, string>;
};

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

export async function apiRequest<T>(
  endpoint: string,
  options: any = {},
): Promise<ApiResult<T>> {
  const url = `${API_URL}${endpoint}`;

  try {
    const { body, ...otherOptions } = options;
    
    // Check if body is standard object (not FormData/Blob)
    const isObjectBody = body && typeof body === "object" && !(body instanceof FormData) && !(body instanceof Blob);
    
    // Prepare Headers safely
    const headers = new Headers(options.headers || {});
    
    // Only set JSON header if we are actually sending a JSON object
    if (isObjectBody && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    const response = await fetch(url, {
      ...otherOptions,
      // If it's an object, stringify it. If it's FormData, pass as is (browser handles headers)
      body: isObjectBody ? JSON.stringify(body) : body,
      headers,
    });

    // ❌ HTTP error (4xx / 5xx)
    if (!response.ok) {
      let errorData: any = null;

      try {
        errorData = await response.json();
      } catch {
        // ignore JSON parse failure
      }

      // Create a more descriptive error message including status
      const errorMessage = errorData?.message || `Request failed with status ${response.status}`;
      
      // Log it to console so you can see the status code immediately in dev tools
      console.error(`API Error (${response.status}) at ${endpoint}:`, errorMessage);

      return {
        ok: false,
        error: new Error(errorMessage),
        status: response.status,
      };
    }

    // ✅ Success
    const text = await response.text();

    if (!text) {
      return { ok: true, data: {} as T };
    }

    try {
      return { ok: true, data: JSON.parse(text) as T };
    } catch {
      return { ok: true, data: text as unknown as T };
    }
  } catch (err: any) {
    // 🌐 Network error (offline, CORS, timeout, backend down)
    console.error(`Network Error at ${endpoint}:`, err);
    return {
      ok: false,
      error: new Error(err?.message || "Network Error"),
      isNetworkError: true,
    };
  }
}