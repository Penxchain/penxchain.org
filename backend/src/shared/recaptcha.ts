/**
 * reCAPTCHA v3 Verification Utility
 * 
 * Verifies tokens with Google's siteverify API and returns the score.
 * Tokens should be verified on each protected action (signup, login).
 */

import { env } from '../config/env';

interface RecaptchaResponse {
  success: boolean;
  score?: number;
  action?: string;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
}

function mapRecaptchaErrorCodes(errorCodes: string[] | undefined) {
  if (!errorCodes || errorCodes.length === 0) {
    return "Invalid verification token";
  }

  if (errorCodes.includes("invalid-input-secret")) {
    return "Security verification secret is invalid";
  }
  if (errorCodes.includes("missing-input-secret")) {
    return "Security verification secret is missing";
  }
  if (errorCodes.includes("invalid-input-response")) {
    return "Invalid verification token";
  }
  if (errorCodes.includes("missing-input-response")) {
    return "Verification token is missing";
  }
  if (errorCodes.includes("timeout-or-duplicate")) {
    return "Verification token expired. Please try again.";
  }
  if (errorCodes.includes("bad-request")) {
    return "Security verification request was malformed";
  }

  return "Invalid verification token";
}

function getAllowedRecaptchaHostnames() {
  const candidates = [
    env.FRONTEND_URL,
    ...(env.FRONTEND_URLS ? env.FRONTEND_URLS.split(",") : []),
  ]
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((s) => s !== "*");

  const hostnames = new Set<string>();
  for (const candidate of candidates) {
    try {
      hostnames.add(new URL(candidate).hostname.toLowerCase());
    } catch {
      // ignore invalid entries
    }
  }
  return hostnames;
}

/**
 * Verify a reCAPTCHA v3 token with Google
 * @param token - The reCAPTCHA token from the frontend
 * @param expectedAction - The expected action name (e.g., 'signup', 'login')
 * @returns Object with success status and score
 */
export async function verifyRecaptcha(
  token: string,
  expectedAction: string,
  remoteIp?: string,
): Promise<{ success: boolean; score: number; error?: string }> {
  if (!env.RECAPTCHA_SECRET_KEY) {
    if (env.NODE_ENV === 'production') {
      console.error('[RECAPTCHA] CRITICAL: Secret key missing in production!');
      return { success: false, score: 0, error: 'Verification system error' };
    }
    console.warn('[RECAPTCHA] Secret key not configured, skipping verification');
    return { success: true, score: 1.0 };
  }

  try {
    const form = new URLSearchParams({
      secret: env.RECAPTCHA_SECRET_KEY,
      response: token,
    });

    if (remoteIp) {
      form.set("remoteip", remoteIp);
    }

    const controller = new AbortController();
    const timeoutMs = 5000;
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    let response: Awaited<ReturnType<typeof fetch>>;
    try {
      response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: form.toString(),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      console.error('[RECAPTCHA] API request failed:', response.status);
      return { success: false, score: 0, error: 'Verification service unavailable' };
    }

    const data: RecaptchaResponse = await response.json();

    if (!data.success) {
      console.warn('[RECAPTCHA] Token verification failed:', data['error-codes']);
      
      // Bypass in development if it's a browser-error or keys mismatch
      if (env.NODE_ENV === 'development') {
        console.warn('[RECAPTCHA] [DEV ONLY] Bypassing failed verification for development');
        return { success: true, score: 1.0 };
      }
      
      return {
        success: false,
        score: 0,
        error: mapRecaptchaErrorCodes(data["error-codes"]),
      };
    }

    // Verify the action matches what we expect
    if (data.action && data.action !== expectedAction) {
      console.warn(`[RECAPTCHA] Action mismatch: expected ${expectedAction}, got ${data.action}`);
      if (env.NODE_ENV === 'development') {
        console.warn('[RECAPTCHA] [DEV ONLY] Bypassing action mismatch for development');
        return { success: true, score: 1.0 };
      }
      return { success: false, score: 0, error: 'Action mismatch' };
    }

    // Verify token hostname belongs to configured frontend(s)
    const allowedHostnames = getAllowedRecaptchaHostnames();
    if (data.hostname && allowedHostnames.size > 0) {
      const tokenHostname = data.hostname.toLowerCase();
      if (!allowedHostnames.has(tokenHostname)) {
        console.warn(
          `[RECAPTCHA] Hostname mismatch: token=${tokenHostname}, allowed=${Array.from(allowedHostnames).join(",")}`,
        );
        return { success: false, score: 0, error: "Verification domain mismatch" };
      }
    }

    const score = data.score ?? 0;
    
    // In dev, we can be more lenient if the score is 0 but data.success was true
    if (env.NODE_ENV === 'development' && score === 0) {
      console.warn('[RECAPTCHA] [DEV ONLY] Low score in development, allowing anyway');
      return { success: true, score: 1.0 };
    }

    return { success: true, score };
  } catch (err: any) {
    if (err?.name === "AbortError") {
      console.error('[RECAPTCHA] Verification timed out');
      return { success: false, score: 0, error: 'Verification timed out' };
    }
    console.error('[RECAPTCHA] Verification error:', err?.message);
    return { success: false, score: 0, error: 'Verification failed' };
  }
}

/**
 * Minimum score threshold for allowing the action
 * 0.5 is Google's recommended default
 * Higher = stricter (may block legitimate users)
 * Lower = more lenient (may allow more bots)
 */
export const RECAPTCHA_MIN_SCORE = 0.6;
