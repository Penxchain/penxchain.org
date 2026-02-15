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

/**
 * Verify a reCAPTCHA v3 token with Google
 * @param token - The reCAPTCHA token from the frontend
 * @param expectedAction - The expected action name (e.g., 'signup', 'login')
 * @returns Object with success status and score
 */
export async function verifyRecaptcha(
  token: string,
  expectedAction: string
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
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: env.RECAPTCHA_SECRET_KEY,
        response: token,
      }).toString(),
    });

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
      
      return { success: false, score: 0, error: 'Invalid verification token' };
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

    const score = data.score ?? 0;
    
    // In dev, we can be more lenient if the score is 0 but data.success was true
    if (env.NODE_ENV === 'development' && score === 0) {
      console.warn('[RECAPTCHA] [DEV ONLY] Low score in development, allowing anyway');
      return { success: true, score: 1.0 };
    }

    return { success: true, score };
  } catch (err: any) {
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
