import { User, Task } from "../types/waitlist";


// Fetch Leaderboard from Backend
import { apiRequest } from "@/lib/api-client";

export async function fetchLeaderboard(): Promise<User[]> {
  try {
    // Backend returns { success: true, data: [...] }
    const result = await apiRequest<{ success: boolean; data: any[] }>("/leaderboard?limit=20");
    
    if (!result.ok) {
      console.warn("fetchLeaderboard: request failed", result.error);
      return [];
    }
    
    // Extract data array from wrapped response
    const data = result.data?.data;
    if (!Array.isArray(data)) {
      console.warn("fetchLeaderboard: unexpected response shape", result.data);
      return [];
    }
    
    // Map backend response to User interface (fill missing fields with defaults)
    return data.map((u: any, index: number) => ({
      id: u.id,
      username: u.username || "Anonymous",
      email: "", // Privacy
      password: "",
      points: u.pxpBalance ?? u.points ?? 0,
      level: calculateLevel(u.pxpBalance ?? u.points ?? 0),
      rank: index + 1,
      referralCode: "",
      referralCount: 0,
      completedTasks: [],
      joinedAt: new Date().toISOString(),
      lastDailyReset: new Date().toISOString(),
    }));
  } catch (error) {
    // Don't spam console on network blips; surface only unexpected errors
    if ((error as any)?.isNetworkError) {
      // upstream temporarily unreachable
      return [];
    }
    console.error("Failed to fetch leaderboard:", error);
    return [];
  }
}



// Level thresholds - PENXCHAIN Privacy & Zero-Knowledge Themed
export const levelThresholds = [
  { level: 1, minPoints: 0, maxPoints: 500, title: "Initiate" },
  
  { level: 2, minPoints: 501, maxPoints: 1500, title: "Cipher" },

  { level: 3, minPoints: 1501, maxPoints: 3000, title: "Validator" },

  { level: 4, minPoints: 3001, maxPoints: 5500, title: "Encryptor" },

  { level: 5, minPoints: 5501, maxPoints: 9000, title: "Sentinel" },

  { level: 6, minPoints: 9001, maxPoints: 14000, title: "Guardian" },

  { level: 7, minPoints: 14001, maxPoints: 20000, title: "Architect" },

  { level: 8, minPoints: 20001, maxPoints: 30000, title: "Overseer" },

  { level: 9, minPoints: 30001, maxPoints: 45000, title: "Sovereign" },

  { level: 10, minPoints: 45001, maxPoints: 65000, title: "Oracle" },

  { level: 11, minPoints: 65001, maxPoints: 90000, title: "Cryptkeeper" },

  { level: 12, minPoints: 90001, maxPoints: 120000, title: "Shadow" },

  { level: 13, minPoints: 120001, maxPoints: 155000, title: "Phantom" },

  { level: 14, minPoints: 155001, maxPoints: 200000, title: "Ghost" },

  { level: 15, minPoints: 200001, maxPoints: 350000, title: "Apex" },

  { level: 16, minPoints: 350001, maxPoints: 600000, title: "Overlord" },

  { level: 17, minPoints: 600001, maxPoints: 1_000_000, title: "Chainmaster" },

  { level: 18, minPoints: 1_000_001, maxPoints: 1_800_000, title: "Oracle Prime" },

  { level: 19, minPoints: 1_800_001, maxPoints: 3_000_000, title: "Crypt Sovereign" },

  { level: 20, minPoints: 3_000_001, maxPoints: 4_500_000, title: "Void Walker" },

  { level: 21, minPoints: 4_500_001, maxPoints: 6_500_000, title: "Shadow Governor" },

  { level: 22, minPoints: 6_500_001, maxPoints: 8_500_000, title: "Chainlord" },

  { level: 23, minPoints: 8_500_001, maxPoints: 9_999_999, title: "Eternal Nexus" },

  { level: 24, minPoints: 10_000_000, maxPoints: Infinity, title: "PENX Prime" },
];

export function calculateLevel(points: number): number {
  const level = levelThresholds.find(
    (threshold) =>
      points >= threshold.minPoints && points <= threshold.maxPoints,
  );
  return level?.level || 1;
}

export function getLevelInfo(points: number) {
  const currentLevel = calculateLevel(points);
  const currentThreshold = levelThresholds.find(
    (t) => t.level === currentLevel,
  );
  const nextThreshold = levelThresholds.find(
    (t) => t.level === currentLevel + 1,
  );

  return {
    level: currentLevel,
    title: currentThreshold?.title || "Newcomer",
    currentPoints: points,
    minPoints: currentThreshold?.minPoints || 0,
    maxPoints: currentThreshold?.maxPoints || 500,
    nextLevelPoints: nextThreshold?.minPoints || null,
    progress: currentThreshold
      ? ((points - currentThreshold.minPoints) /
          (currentThreshold.maxPoints - currentThreshold.minPoints)) *
        100
      : 0,
  };
}
