import { User, AuthResponse } from "../types/waitlist";
import { apiRequest } from "@/lib/api-client";

// Check referral code validity
export async function validateReferralCode(code: string): Promise<boolean> {
  if (!code || code.length < 3) return false;

  try {
    const result = await apiRequest<{ valid: boolean }>(
      `/auth/check-referral?code=${code}`,
    );
    return result.ok ? !!result.data?.valid : false;
  } catch (error) {
    console.error("[AUTH] Referral check failed:", error);
    return false;
  }
}

import FingerprintJS from "@fingerprintjs/fingerprintjs";

const STORAGE_KEY = "penxchain_waitlist_user";
const DEVICE_KEY = "penxchain_device_id";

// FingerprintJS agent (lazy singleton)
let fpPromise: Promise<import("@fingerprintjs/fingerprintjs").Agent> | null = null;

function getFpAgent() {
  if (!fpPromise && typeof window !== "undefined") {
    fpPromise = FingerprintJS.load();
  }
  return fpPromise;
}

/**
 * Get a hardware-based device fingerprint using FingerprintJS.
 * Falls back to a cached value if FingerprintJS fails.
 * Returns undefined only on SSR.
 */
async function getDeviceFingerprint(): Promise<string | undefined> {
  if (typeof window === "undefined") return undefined;

  try {
    const agent = await getFpAgent();
    if (agent) {
      const result = await agent.get();
      const visitorId = result.visitorId;

      // Cache in localStorage for fallback
      try {
        localStorage.setItem(DEVICE_KEY, visitorId);
      } catch {
        // Storage full — non-fatal
      }
      return visitorId;
    }
  } catch (err) {
    console.warn("[AUTH] FingerprintJS failed, using cached fallback:", err);
  }

  // Fallback: use cached value from a previous successful fingerprint
  try {
    const cached = localStorage.getItem(DEVICE_KEY);
    if (cached && cached.length > 5) return cached;
  } catch {
    // ignore
  }

  // Last resort: no fingerprint available
  return undefined;
}

// Helper to save session
function saveSession(user: User) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

// Broadcast an in-tab event when the user session changes so client components can react
function broadcastSessionUpdate(user: User) {
  if (typeof window === "undefined") return;
  try {
    const ev = new CustomEvent("penxchain:user-updated", { detail: user });
    window.dispatchEvent(ev);
  } catch (e) {
    // ignore
  }
}

// Helper to clear session
function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

// Login function (Supports Email/Username/Password and Wallet/Signature)
export async function login(
  identifierOrWallet: string,
  passwordOrSignature?: string,
  recaptchaToken?: string, // Added for bot protection
): Promise<AuthResponse> {
  try {
    // If input contains '@', treat as email. If strictly alphanumeric < 42 chars, could be username.
    // However, backend `identifier` field handles both email and username.
    // Wallet login is distinct by having a signature usually, or being a long hex string.
    
    // Simple heuristic: if it looks like a wallet address (starts with 0x, long), verify signature.
    // Otherwise treat as identifier (email or username).
    const isWallet = identifierOrWallet.startsWith("0x") && identifierOrWallet.length > 30;
    const deviceId = await getDeviceFingerprint();
    
    const body = !isWallet
      ? {
          identifier: identifierOrWallet.trim(), // Send as 'identifier' to match new backend schema
          password: passwordOrSignature,
          recaptchaToken,
        }
      : {
          walletAddress: identifierOrWallet,
          signature: passwordOrSignature,
          recaptchaToken,
        };

    console.debug(
      `[AUTH] Attempting login via ${!isWallet ? "identifier" : "wallet"}:`,
      {
        identifier: identifierOrWallet,
        hasCredential: !!passwordOrSignature,
      },
    );

    const result = await apiRequest<any>("/auth/login", {
      method: "POST",
      body,
      headers: deviceId ? { "X-Device-Id": deviceId } : undefined,
    });

    if (!result.ok) {
      console.error("[AUTH] Login failed:", result.error.message);
      const isUnderReview = result.status === 423;
      return { success: false, error: result.error.message, isUnderReview };
    }

    // Normalize backend response to frontend User interface
    const backendUser = result.data;
    const user: User = {
      id: backendUser.id,
      username: backendUser.username || "",
      email: backendUser.email || "",
      password: "", // Never store password
      points: backendUser.pxpBalance ?? 0, // Map pxpBalance → points
      level: calculateLevel(backendUser.pxpBalance ?? 0),
      rank: 0, // Will be fetched separately
      referralCode: backendUser.referralCode || "",
      referralCount: 0,
      completedTasks: [],
      joinedAt: backendUser.createdAt || new Date().toISOString(),
      lastDailyReset: new Date().toISOString(),
      lastBonusClaim: backendUser.lastBonusClaim,
      role: backendUser.role || "USER",
      token: backendUser.token,
      // Streak tracking
      dailyStreak: backendUser.dailyStreak ?? 0,
      lastActivityDate: backendUser.lastActivityDate,
      // Ban info
      isBanned: backendUser.isBanned ?? false,
      banReason: backendUser.banReason,
      bannedAt: backendUser.bannedAt,
    };

    // login should not surface referral flags

    saveSession(user);
    broadcastSessionUpdate(user);
    refreshUserStats(); // Background refresh
    return { success: true, user };
  } catch (error: any) {
    console.error("[AUTH] Unexpected error during login:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Force refresh the current user's stats from the server.
 * Useful after completing tasks, claiming bonuses, or updating notifications.
 */
export async function refreshUserStats(): Promise<User | null> {
  const currentUser = getCurrentUser();
  if (!currentUser) return null;

  try {
    const statsRes = await apiRequest<any>("/waitlist/stats");
    if (statsRes.ok && statsRes.data) {
      const stats = statsRes.data;
      const updated = {
        ...currentUser,
        points: stats.pxpBalance ?? currentUser.points,
        rank: stats.rank ?? currentUser.rank,
        referralCount: stats.referralCount ?? currentUser.referralCount,
        earnedReferralsCount: stats.earnedReferralsCount ?? currentUser.earnedReferralsCount,
        pendingReferralsCount: stats.pendingReferralsCount ?? currentUser.pendingReferralsCount,
        completedTasks: stats.tasks ? stats.tasks.map((t: any) => t.taskId) : currentUser.completedTasks,
        dailyStreak: stats.dailyStreak ?? currentUser.dailyStreak,
        lastActivityDate: stats.lastActivityDate ?? currentUser.lastActivityDate,
        notifications: stats.notifications ?? currentUser.notifications,
        isBanned: stats.isBanned ?? currentUser.isBanned,
        banReason: stats.banReason ?? currentUser.banReason,
        bannedAt: stats.bannedAt ?? currentUser.bannedAt,
      } as User;
      saveSession(updated);
      broadcastSessionUpdate(updated);
      return updated;
    }
  } catch (err) {
    console.error("[AUTH] Stats refresh failed:", err);
  }
  return currentUser;
}

// Calculate user level based on points
function calculateLevel(points: number): number {
  if (points >= 10000) return 10;
  if (points >= 5000) return 9;
  if (points >= 2500) return 8;
  if (points >= 1500) return 7;
  if (points >= 1000) return 6;
  if (points >= 600) return 5;
  if (points >= 350) return 4;
  if (points >= 150) return 3;
  if (points >= 50) return 2;
  return 1;
}

// Signup function
export async function signup(
  username: string,
  email: string,
  password: string,
  referralCode?: string,
  recaptchaToken?: string, // Added for bot protection
): Promise<AuthResponse> {
  try {
    const deviceId = await getDeviceFingerprint();
    const result = await apiRequest<any>("/auth/signup", {
      method: "POST",
      body: {
        username,
        email: email.toLowerCase(),
        password,
        referralCode,
        recaptchaToken,
        deviceId,
      },
    });

    if (!result.ok) {
      console.error("[AUTH] Signup failed:", result.error.message);
      const isUnderReview = result.status === 423;
      return { success: false, error: result.error.message, isUnderReview };
    }

    // Normalize backend response to frontend User interface
    const backendUser = result.data;
    const wasReferred = backendUser?.wasReferred ?? false;
    const rewardsApplied = backendUser?.rewardsApplied ?? null;
    const user: User = {
      id: backendUser.id,
      username: backendUser.username || username,
      email: backendUser.email || email,
      password: "", // Never store password
      points: backendUser.pxpBalance ?? 0,
      level: calculateLevel(backendUser.pxpBalance ?? 0),
      rank: 0,
      referralCode: backendUser.referralCode || "",
      referralCount: 0,
      completedTasks: [],
      joinedAt: backendUser.createdAt || new Date().toISOString(),
      lastDailyReset: new Date().toISOString(),
      role: backendUser.role || "USER",
      token: backendUser.token,
      referredBy: backendUser.referredBy || null,
    };

    saveSession(user);
    broadcastSessionUpdate(user);
    // Fire-and-forget: fetch server-side stats in background (don't block signup return)
    apiRequest<any>("/waitlist/stats").then((statsRes) => {
      if (statsRes.ok && statsRes.data) {
        const stats = statsRes.data;
        const updated = {
          ...user,
          points: stats.pxpBalance ?? user.points,
          rank: stats.rank ?? user.rank,
          referralCount: stats._count?.referrals ?? user.referralCount,
        } as User;
        saveSession(updated);
        broadcastSessionUpdate(updated);
      }
    }).catch(() => { /* non-fatal background fetch */ });

    return { success: true, user, wasReferred, rewardsApplied };
  } catch (error: any) {
    console.error("[AUTH] Unexpected error during signup:", error.message);
    return { success: false, error: error.message };
  }
}

// Logout function
export function logout(): void {
  apiRequest<any>("/auth/logout", {
    method: "POST",
    body: {},
  }).catch(() => {
    // best-effort logout on backend
  });
  clearSession();
}

export async function logoutAllDevices(): Promise<{ success: boolean; error?: string }> {
  const result = await apiRequest<any>("/auth/logout-all", {
    method: "POST",
    body: {},
  });

  if (!result.ok) {
    return { success: false, error: result.error.message };
  }

  clearSession();
  return { success: true };
}

// Get current user
export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
}

// Check if authenticated
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

// Get user ID from storage
export function getUserIdFromStorage(): string {
  if (typeof window === "undefined") return "";
  const user = getCurrentUser();
  return user?.id || "";
}

// Update current user (Local cache update only for now, ideally API call)
export function updateCurrentUser(updates: Partial<User>): User | null {
  if (typeof window === "undefined") return null;

  const currentUser = getCurrentUser();
  if (!currentUser) return null;

  const updatedUser = { ...currentUser, ...updates };
  saveSession(updatedUser);
  broadcastSessionUpdate(updatedUser);
  return updatedUser;
}
