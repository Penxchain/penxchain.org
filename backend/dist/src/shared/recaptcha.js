"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RECAPTCHA_MIN_SCORE = void 0;
exports.verifyRecaptcha = verifyRecaptcha;
const env_1 = require("../config/env");
async function verifyRecaptcha(token, expectedAction) {
    if (!env_1.env.RECAPTCHA_SECRET_KEY) {
        if (env_1.env.NODE_ENV === 'production') {
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
                secret: env_1.env.RECAPTCHA_SECRET_KEY,
                response: token,
            }).toString(),
        });
        if (!response.ok) {
            console.error('[RECAPTCHA] API request failed:', response.status);
            return { success: false, score: 0, error: 'Verification service unavailable' };
        }
        const data = await response.json();
        if (!data.success) {
            console.warn('[RECAPTCHA] Token verification failed:', data['error-codes']);
            if (env_1.env.NODE_ENV === 'development') {
                console.warn('[RECAPTCHA] [DEV ONLY] Bypassing failed verification for development');
                return { success: true, score: 1.0 };
            }
            return { success: false, score: 0, error: 'Invalid verification token' };
        }
        if (data.action && data.action !== expectedAction) {
            console.warn(`[RECAPTCHA] Action mismatch: expected ${expectedAction}, got ${data.action}`);
            if (env_1.env.NODE_ENV === 'development') {
                console.warn('[RECAPTCHA] [DEV ONLY] Bypassing action mismatch for development');
                return { success: true, score: 1.0 };
            }
            return { success: false, score: 0, error: 'Action mismatch' };
        }
        const score = data.score ?? 0;
        if (env_1.env.NODE_ENV === 'development' && score === 0) {
            console.warn('[RECAPTCHA] [DEV ONLY] Low score in development, allowing anyway');
            return { success: true, score: 1.0 };
        }
        return { success: true, score };
    }
    catch (err) {
        console.error('[RECAPTCHA] Verification error:', err?.message);
        return { success: false, score: 0, error: 'Verification failed' };
    }
}
exports.RECAPTCHA_MIN_SCORE = 0.5;
//# sourceMappingURL=recaptcha.js.map