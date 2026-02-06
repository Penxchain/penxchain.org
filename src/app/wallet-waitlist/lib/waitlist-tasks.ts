import { apiRequest } from "@/lib/api-client";
import { User, Task } from "../types/waitlist";
import {
  getCurrentUser,
  getUserIdFromStorage,
  updateCurrentUser,
} from "./waitlist-auth";

// Fetch all tasks with status
export async function getTasks(): Promise<(Task & { completed: boolean })[]> {
  try {
    // Backend returns { success: true, tasks: [...] }
    const result = await apiRequest<{ success: boolean; tasks: any[] } | any[]>(
      "/waitlist/tasks",
    );

    if (!result.ok) {
      console.error("getTasks failed:", result.error);
      return [];
    }

    // Handle both wrapped { tasks: [...] } and raw array responses
    const data = result.data;
    const tasks = Array.isArray(data) ? data : (data?.tasks ?? []);

    if (!Array.isArray(tasks)) {
      console.warn("getTasks: unexpected response shape", data);
      return [];
    }

    // Map backend Enums to Frontend types with defensive checks
    return tasks.map((t) => {
      const rawType = (t?.type ?? "").toString();
      const type = rawType ? rawType.toLowerCase() : "unknown";
      const status = (t?.status ?? "").toString().toUpperCase();

      return {
        ...t,
        type: type, // already lowercased above
        category: t?.category || "twitter",
        repeatable: status === "DAILY" || type === "daily",
        completed: status === "COMPLETED" || String(t?.completed) === "true",
      };
    });
  } catch (error) {
    // If it's a transient network error, return empty tasks silently
    if ((error as any)?.isNetworkError) {
      return [];
    }
    console.error("Failed to fetch tasks", error);
    return [];
  }
}

export async function getTimeUntilDailyReset(): Promise<{
  hours: number;
  minutes: number;
  seconds: number;
}> {
  try {
    const result = await apiRequest<{ timeUntilReset: number }>(
      "/waitlist/time",
    );
    if (!result.ok) throw result.error;
    const data = result.data;
    const ms = data.timeUntilReset;

    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / 1000 / 60) % 60);
    const hours = Math.floor((ms / 1000 / 60 / 60) % 24);

    return { hours, minutes, seconds };
  } catch (e) {
    if ((e as any)?.isNetworkError) {
      console.debug(
        "Server time fetch skipped (network):",
        (e as any).message || e,
      );
    } else {
      console.error("Failed to fetch server time", e);
    }
    // Fallback to local calculation only if server fails to prevent UI crash
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setUTCHours(24, 0, 0, 0);
    const diff = tomorrow.getTime() - now.getTime();

    return {
      hours: Math.floor((diff / 1000 / 60 / 60) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }
}

// Complete a task
export async function completeTask(
  taskId: string,
): Promise<{
  success: boolean;
  points?: number;
  newBalance?: number;
  error?: string;
}> {
  try {
    const result = await apiRequest<{
      success?: boolean;
      pxpBalance: number;
      pointsEarned?: number;
      id?: string;
    }>("/waitlist/tasks/complete", {
      method: "POST",
      body: { taskId },
    });

    if (!result.ok) throw result.error;

    const data = result.data;
    const newBalance = data.pxpBalance ?? 0;
    // Use backend's pointsEarned if available, otherwise calculate from difference
    const currentUser = getCurrentUser();
    const oldPxp = currentUser?.points || 0;
    const pointsEarned = data.pointsEarned ?? newBalance - oldPxp;

    // Update local storage with new balance
    const updatedUser = updateCurrentUser({
      points: newBalance,
    });

    // Dispatch event so dashboard updates in real-time without refresh
    if (typeof window !== "undefined" && updatedUser) {
      window.dispatchEvent(
        new CustomEvent("penxchain:user-updated", { detail: updatedUser }),
      );
    }
    // Refresh authoritative stats from server to keep rank/referral counts in sync
    try {
      const statsRes = await apiRequest<any>("/waitlist/stats");
      if (statsRes.ok && statsRes.data) {
        const s = statsRes.data;
        const synced = updateCurrentUser({
          points: s.pxpBalance ?? newBalance,
          rank: s.rank ?? updatedUser?.rank,
          referralCount: s._count?.referrals ?? updatedUser?.referralCount,
        });
        if (synced)
          window.dispatchEvent(
            new CustomEvent("penxchain:user-updated", { detail: synced }),
          );
      }
    } catch (e) {
      // best-effort
      console.warn("Failed to refresh stats after task completion", e);
    }

    return {
      success: true,
      points: pointsEarned > 0 ? pointsEarned : 1,
      newBalance,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export function getSocialTasks(tasks: (Task & { completed: boolean })[]) {
  return tasks.filter((t) => t.type.toLowerCase() === "social");
}

export function getDailyTasks(tasks: (Task & { completed: boolean })[]) {
  return tasks.filter((t) => t.type.toLowerCase() === "daily");
}

export function getOneTimeTasks(tasks: (Task & { completed: boolean })[]) {
  return tasks.filter(
    (t) =>
      t.type.toLowerCase() === "one_time" || (t as any).type === "ONE_TIME",
  );
}
