// TypeScript interfaces for the waitlist system

export interface User {
  id: string;
  username: string;
  email: string;
  password: string; // In production, this would never be stored client-side
  points: number;
  level: number;
  rank: number;
  referralCode: string;
  referredBy?: { username: string };
  referralCount: number;
  completedTasks: string[];
  joinedAt: string;
  lastDailyReset: string;
  avatarId?: string; // Avatar selection
  lastBonusClaim?: string; // ISO date string for bonus PXP claim tracking
  role?: "USER" | "ADMIN" | "SUPERADMIN";
  token?: string; // JWT Token
  // Streak tracking
  dailyStreak?: number;
  lastActivityDate?: string;
  // Ban info
  isBanned?: boolean;
  banReason?: string;
  bannedAt?: string;
}

export interface Task {
  id: string;
  type: "social" | "daily" | "one_time";
  title: string;
  description: string;
  points: number;
  icon: string;
  link?: string;
  repeatable: boolean;
  category: string;
}

export interface LeaderboardEntry {
  rank: number;
  user: User;
  pointsThisPeriod?: number;
}

export interface Activity {
  id: string;
  userId: string;
  type: "task_completed" | "referral" | "level_up";
  description: string;
  points: number;
  timestamp: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  // Present only on signup when a referral was processed
  wasReferred?: boolean;
  rewardsApplied?: { newUser: number; referrer: number } | null;
  error?: string;
}

export type TimePeriod = "all" | "week" | "month";
