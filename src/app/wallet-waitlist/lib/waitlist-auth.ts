import { User, AuthResponse } from "../types/waitlist";
import { apiRequest } from "@/lib/api-client";

// Check referral code validity
export async function validateReferralCode(code: string): Promise<boolean> {
  if (!code || code.length < 3) return false;
  
  try {
    const result = await apiRequest<{ valid: boolean }>(`/auth/check-referral?code=${code}`);
    return result.ok ? !!result.data?.valid : false;
  } catch (error) {
    console.error("[AUTH] Referral check failed:", error);
    return false;
  }
}

const STORAGE_KEY = "penxchain_waitlist_user";

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

// Login function (Supports both Email/Password and Wallet/Signature)
export async function login(
  emailOrWallet: string,
  passwordOrSignature?: string,
  recaptchaToken?: string, // Added for bot protection
): Promise<AuthResponse> {
  try {
    // If input contains '@', treat as email login, else treat as wallet login
    const isEmail = emailOrWallet.includes("@");
    const body = isEmail
      ? { email: emailOrWallet.toLowerCase(), password: passwordOrSignature, recaptchaToken }
      : { walletAddress: emailOrWallet, signature: passwordOrSignature, recaptchaToken };

    console.debug(`[AUTH] Attempting login via ${isEmail ? "email" : "wallet"}:`, {
      identifier: emailOrWallet,
      hasCredential: !!passwordOrSignature,
    });

    const result = await apiRequest<any>("/auth/login", {
      method: "POST",
      body,
    });

    if (!result.ok) {
      console.error("[AUTH] Login failed:", result.error.message);
      return { success: false, error: result.error.message };
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
    };

    saveSession(user);
    broadcastSessionUpdate(user);
    return { success: true, user };
  } catch (error: any) {
    console.error("[AUTH] Unexpected error during login:", error.message);
    return { success: false, error: error.message };
  }
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
  password?: string,
  referralCode?: string,
  recaptchaToken?: string, // Added for bot protection
): Promise<AuthResponse> {
  try {
    const result = await apiRequest<any>("/auth/signup", {
      method: "POST",
      body: { username, email: email.toLowerCase(), password, referralCode, recaptchaToken },
    });

    if (!result.ok) {
      console.error("[AUTH] Signup failed:", result.error.message);
      return { success: false, error: result.error.message };
    }

    // Normalize backend response to frontend User interface
    const backendUser = result.data;
    const user: User = {
      id: backendUser.id,
      username: backendUser.username || username,
      email: backendUser.email || email,
      password: "", // Never store password
      points: backendUser.pxpBalance ?? 0,
      level: calculateLevel(backendUser.pxpBalance ?? 0),
      rank: 0,
      referralCode: backendUser.referralCode || "",
      referredBy: backendUser.referredById ? { username: "Referrer" } : undefined,
      referralCount: 0,
      completedTasks: [],
      joinedAt: backendUser.createdAt || new Date().toISOString(),
      lastDailyReset: new Date().toISOString(),
      role: backendUser.role || "USER",
      token: backendUser.token,
    };

    saveSession(user);
    broadcastSessionUpdate(user);
    return { success: true, user };
  } catch (error: any) {
    console.error("[AUTH] Unexpected error during signup:", error.message);
    return { success: false, error: error.message };
  }
}

// Logout function
export function logout(): void {
  clearSession();
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

