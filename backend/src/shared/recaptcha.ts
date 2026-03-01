/**
 * reCAPTCHA v3 Verification Utility.
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

type RecaptchaHostnamePolicy = {
  allowAll: boolean;
  exact: Set<string>;
  wildcardSuffixes: string[];
};

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

function normalizeHostnameCandidate(candidate: string) {
  const trimmed = candidate.trim().toLowerCase();
  if (!trimmed) return null;

  try {
    return new URL(trimmed).hostname.toLowerCase();
  } catch {
    // Allow raw hostname entries like penxchain.org or *.example.com
    return trimmed.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  }
}

function getRecaptchaHostnamePolicy(): RecaptchaHostnamePolicy {
  const candidates = [
    env.FRONTEND_URL,
    ...(env.FRONTEND_URLS ? env.FRONTEND_URLS.split(",") : []),
  ].map((s) => s.trim()).filter(Boolean);

  let allowAll = false;
  const exact = new Set<string>();
  const wildcardSuffixes: string[] = [];

  for (const candidate of candidates) {
    if (candidate === "*") {
      allowAll = true;
      continue;
    }

    const normalized = normalizeHostnameCandidate(candidate);
    if (!normalized) continue;

    if (normalized.startsWith("*.")) {
      const suffix = normalized.slice(2);
      if (suffix) wildcardSuffixes.push(suffix);
      continue;
    }

    exact.add(normalized);
  }

  return {
    allowAll,
    exact,
    wildcardSuffixes,
  };
}

function isHostnameAllowed(hostname: string, policy: RecaptchaHostnamePolicy) {
  if (policy.allowAll) return true;

  const tokenHostname = hostname.toLowerCase();
  if (policy.exact.has(tokenHostname)) return true;

  return policy.wildcardSuffixes.some(
    (suffix) =>
      tokenHostname === suffix || tokenHostname.endsWith(`.${suffix}`),
  );
}

export function getRecaptchaRuntimeHealth() {
  const policy = getRecaptchaHostnamePolicy();
  const allowedHostnames = [
    ...Array.from(policy.exact),
    ...policy.wildcardSuffixes.map((s) => `*.${s}`),
  ];
  return {
    secretConfigured: Boolean(env.RECAPTCHA_SECRET_KEY),
    minScore: RECAPTCHA_MIN_SCORE,
    allowedHostnames,
    allowAllHostnames: policy.allowAll,
    nodeEnv: env.NODE_ENV,
  };
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
    const policy = getRecaptchaHostnamePolicy();
    if (data.hostname && (policy.allowAll || policy.exact.size > 0 || policy.wildcardSuffixes.length > 0)) {
      const tokenHostname = data.hostname.toLowerCase();
      if (!isHostnameAllowed(tokenHostname, policy)) {
        const allowedPreview = [
          ...Array.from(policy.exact),
          ...policy.wildcardSuffixes.map((s) => `*.${s}`),
        ].join(",");
        console.warn(
          `[RECAPTCHA] Hostname mismatch: token=${tokenHostname}, allowed=${allowedPreview || "none"}, allowAll=${policy.allowAll}`,
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
