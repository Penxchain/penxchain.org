import { db } from "../../shared/database/db";
import { TaskType } from "@prisma/client";
import { InternalServerError, NotFoundError, ForbiddenError } from "../../shared/errors";
import { redisClient } from "../../shared/redis";
import { getRecaptchaRuntimeHealth, verifyRecaptcha } from "../../shared/recaptcha";

export async function getSystemStats() {
  try {
    const totalUsers = await db.user.count({
      where: { 
        isBanned: false,
        accountStatus: { not: "BANNED" }
      }
    });

    const totalPoints = await db.user.aggregate({
      where: { 
        isBanned: false,
        accountStatus: { not: "BANNED" }
      },
      _sum: { pxpBalance: true },
    });
    const topReferrers = await db.user.findMany({
      where: { 
        isBanned: false,
        accountStatus: { not: "BANNED" }
      },
      take: 5,
      orderBy: { referrals: { _count: "desc" } },
      select: { username: true, _count: { select: { referrals: true } } },
    });

    // Calculate weekly growth
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const usersLastWeek = await db.user.count({
      where: { 
        createdAt: { lt: sevenDaysAgo },
        isBanned: false,
        accountStatus: { not: "BANNED" }
      }
    });
    
    let growthPercent = 0;
    if (usersLastWeek > 0) {
      growthPercent = ((totalUsers - usersLastWeek) / usersLastWeek) * 100;
    } else if (totalUsers > 0) {
      growthPercent = 100; // First week of users
    }

    return {
      totalUsers,
      totalPoints: totalPoints._sum.pxpBalance || 0,
      growthPercent: Math.round(growthPercent), // Add this new field
      topReferrers: topReferrers.map((u: any) => ({
        username: u.username,
        count: u._count.referrals,
      })),
    };
  } catch (err: any) {
    console.error("[ADMIN] Database error in getSystemStats:", err?.message);
    throw new InternalServerError();
  }
}

export async function getAuthSecurityOverview(hours: number = 24) {
  try {
    const clampedHours = Math.min(168, Math.max(1, hours));
    const now = new Date();
    const since = new Date(now.getTime() - clampedHours * 60 * 60 * 1000);
    const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const [
      activeRefreshSessions,
      expiringIn24h,
      revokedSinceWindow,
      riskEventsTotal,
      riskEventsBlocked,
      actionGroups,
      recentEvents,
    ] = await Promise.all([
      (db as any).refreshToken.count({
        where: {
          revokedAt: null,
          expiresAt: { gt: now },
        },
      }),
      (db as any).refreshToken.count({
        where: {
          revokedAt: null,
          expiresAt: { gt: now, lte: next24h },
        },
      }),
      (db as any).refreshToken.count({
        where: {
          revokedAt: { not: null, gte: since },
        },
      }),
      (db as any).authSecurityEvent.count({
        where: { createdAt: { gte: since } },
      }),
      (db as any).authSecurityEvent.count({
        where: {
          createdAt: { gte: since },
          blocked: true,
        },
      }),
      (db as any).authSecurityEvent.groupBy({
        by: ["action"],
        where: { createdAt: { gte: since } },
        _count: { _all: true },
      }),
      (db as any).authSecurityEvent.findMany({
        where: { createdAt: { gte: since } },
        orderBy: { createdAt: "desc" },
        take: 500,
        select: { reasons: true },
      }),
    ]);

    const reasonCounts: Record<string, number> = {};
    for (const evt of recentEvents) {
      const reasons = Array.isArray(evt?.reasons) ? evt.reasons : [];
      for (const reason of reasons) {
        const key = String(reason);
        reasonCounts[key] = (reasonCounts[key] || 0) + 1;
      }
    }

    const topReasons = Object.entries(reasonCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([reason, count]) => ({ reason, count }));

    const actionBreakdown = actionGroups.map((g: any) => ({
      action: g.action,
      count: g._count?._all || 0,
    }));

    return {
      windowHours: clampedHours,
      sessions: {
        active: activeRefreshSessions,
        expiringIn24h,
        revokedInWindow: revokedSinceWindow,
      },
      risk: {
        totalEvents: riskEventsTotal,
        blockedEvents: riskEventsBlocked,
        blockedRate:
          riskEventsTotal > 0
            ? Number(((riskEventsBlocked / riskEventsTotal) * 100).toFixed(2))
            : 0,
        topReasons,
      },
      actions: actionBreakdown,
    };
  } catch (err: any) {
    console.error("[ADMIN] Database error in getAuthSecurityOverview:", err?.message);
    throw new InternalServerError();
  }
}

export async function getAuthSecurityEvents(params?: {
  page?: number;
  limit?: number;
  action?: "signup" | "login" | "refresh";
  blockedOnly?: boolean;
}) {
  try {
    const page = Math.max(1, Number(params?.page || 1));
    const limit = Math.min(100, Math.max(1, Number(params?.limit || 20)));
    const skip = (page - 1) * limit;
    const action = params?.action;
    const blockedOnly = Boolean(params?.blockedOnly);

    const where: any = {};
    if (action) where.action = action;
    if (blockedOnly) where.blocked = true;

    const [events, total] = await Promise.all([
      (db as any).authSecurityEvent.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          action: true,
          riskScore: true,
          blocked: true,
          reasons: true,
          countryCode: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              role: true,
            },
          },
        },
      }),
      (db as any).authSecurityEvent.count({ where }),
    ]);

    return {
      events,
      total,
      pages: Math.ceil(total / limit),
      page,
      limit,
    };
  } catch (err: any) {
    console.error("[ADMIN] Database error in getAuthSecurityEvents:", err?.message);
    throw new InternalServerError();
  }
}

export function getRecaptchaHealth() {
  return getRecaptchaRuntimeHealth();
}

export async function verifyRecaptchaToken(
  token: string,
  action: "signup" | "login",
  remoteIp?: string,
) {
  const result = await verifyRecaptcha(token, action, remoteIp);
  return {
    ...result,
    threshold: getRecaptchaRuntimeHealth().minScore,
    pass: result.success && result.score >= getRecaptchaRuntimeHealth().minScore,
  };
}

export async function getAllUsers(
  page: number = 1,
  limit: number = 20,
  search?: string,
  sortBy?: 'pxpBalance' | 'createdAt' | 'dailyStreak',
  sortDir: 'asc' | 'desc' = 'desc',
  status?: 'ACTIVE' | 'BANNED' | 'UNDER_REVIEW',
  inactiveDays?: number
) {
  try {
    const skip = (page - 1) * limit;
    
    const whereClause: any = {};
    if (search && search.trim().length > 0) {
      const term = search.trim();
      whereClause.OR = [
        { email: { contains: term, mode: "insensitive" } },
        { username: { contains: term, mode: "insensitive" } },
        { id: { contains: term, mode: "insensitive" } }, // Also search by ID for exact lookups
      ];
    }

    if (status) {
      whereClause.accountStatus = status;
    }

    // Filter: Inactive Users (Created > X days ago AND 0 tasks)
    if (inactiveDays && inactiveDays > 0) {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - inactiveDays); // subtract X days
      // Ensure UTC comparison if needed, but Date object usually handles it relative to system time
      // User asked for "Day calculations should be based on NOW() in DB or server"
      
      whereClause.createdAt = { lt: cutoff };
      whereClause.tasksCompletedCount = 0;
    }

    let orderBy: any[] = [];
    if (sortBy) {
      orderBy.push({ [sortBy]: sortDir });
    } else {
      // Default sort behavior
      orderBy = [
        { role: "asc" }, // superadmin/admin come first
        { createdAt: "desc" }
      ];
    }

    const users = await db.user.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy,
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        pxpBalance: true,
        createdAt: true,
        walletAddress: true,
        isBanned: true,
        banReason: true,
        bannedAt: true,
        dailyStreak: true,
      },
    });
    
    const total = await db.user.count({ where: whereClause });

    return { users, total, pages: Math.ceil(total / limit) };
  } catch (err: any) {
    console.error("[ADMIN] Database error in getAllUsers:", err?.message);
    throw new InternalServerError();
  }
}

export async function banUser(userId: string, actorRole: string, reason: string, adminId: string) {
  try {
    if (!reason || reason.trim().length < 5) {
      throw new ForbiddenError("Ban reason must be at least 5 characters");
    }

    const target = await db.user.findUnique({ where: { id: userId }, select: { role: true } });
    
    if (!target) throw new NotFoundError("User not found");

    // Strict RBAC Rules for Banning
    if (target.role === "SUPERADMIN") {
      throw new ForbiddenError("Cannot ban a Super Admin");
    }

    if (target.role === "ADMIN" && actorRole !== "SUPERADMIN") {
      throw new ForbiddenError("Admins cannot ban other Admins");
    }

    // Additional safety: Remove from Redis leaderboard
    if (redisClient) {
      const key = "waitlist:leaderboard";
      await redisClient.zRem(key, userId);
    }

    // Ban the user and set accountStatus
    const bannedUser = await db.user.update({
      where: { id: userId },
      data: { 
        isBanned: true, 
        pxpBalance: 0,
        banReason: reason.trim(),
        bannedAt: new Date(),
        accountStatus: "BANNED",
      } as any,
    });

    // Trigger referral penalty cascade (if user was referred)
    try {
      const { triggerReferralPenalty } = await import("./penalty.service");
      await triggerReferralPenalty(userId, reason.trim(), adminId);
    } catch (penaltyErr: any) {
      // Non-fatal — ban succeeded, penalty is best-effort
      console.error("[ADMIN] Penalty cascade failed (non-fatal):", penaltyErr?.message);
    }

    // Audit log
    try {
      await (db as any).adminAuditLog.create({
        data: {
          adminId,
          action: "USER_BANNED",
          targetId: userId,
          targetType: "User",
          details: { reason: reason.trim(), targetRole: target.role },
        },
      });
    } catch (auditErr: any) {
      console.warn("[ADMIN] Audit log failed (non-fatal):", auditErr?.message);
    }

    return bannedUser;
  } catch (err: any) {
    console.error("[ADMIN] Database error in banUser:", err?.message);
    if (err instanceof NotFoundError || err instanceof ForbiddenError) throw err;
    throw new InternalServerError();
  }
}

export async function unbanUser(userId: string) {
  try {
    return await db.user.update({
      where: { id: userId },
      data: { 
        isBanned: false,
        banReason: null,
        bannedAt: null,
        accountStatus: "ACTIVE",
      } as any,
    });
  } catch (err: any) {
    console.error("[ADMIN] Database error in unbanUser:", err?.message);
    if (err?.code === "P2025") {
      throw new NotFoundError("User not found");
    }
    throw new InternalServerError();
  }
}

export async function promoteToAdmin(userId: string, actorRole: string) {
  try {
    const target = await db.user.findUnique({ where: { id: userId }, select: { role: true } });
    if (!target) throw new NotFoundError("User not found");

    if (target.role !== "USER") {
      throw new ForbiddenError(`Only users with role 'USER' can be promoted to ADMIN. Target is currently ${target.role}`);
    }

    return await db.user.update({
      where: { id: userId },
      data: { role: "ADMIN" },
    });
  } catch (err: any) {
    console.error("[ADMIN] Database error in promoteToAdmin:", err?.message);
    if (err instanceof NotFoundError || err instanceof ForbiddenError) throw err;
    throw new InternalServerError();
  }
}

export async function demoteFromAdmin(userId: string, actorId: string, actorRole: string) {
  try {
    const target = await db.user.findUnique({ where: { id: userId }, select: { role: true } });
    if (!target) throw new NotFoundError("User not found");

    if (userId === actorId) {
      throw new ForbiddenError("You cannot demote yourself");
    }

    if (target.role === "SUPERADMIN") {
      throw new ForbiddenError("Superadmins cannot be demoted. They must be manually adjusted in the database for safety.");
    }

    if (target.role === "ADMIN" && actorRole !== "SUPERADMIN") {
      throw new ForbiddenError("Admins cannot demote other Admins");
    }

    if (target.role === "USER") {
      throw new ForbiddenError("User is already at the lowest role level");
    }

    return await db.user.update({
      where: { id: userId },
      data: { role: "USER" },
    });
  } catch (err: any) {
    console.error("[ADMIN] Database error in demoteFromAdmin:", err?.message);
    if (err instanceof NotFoundError || err instanceof ForbiddenError) throw err;
    throw new InternalServerError();
  }
}

export async function promoteToSuperAdmin(userId: string, actorRole: string) {
  try {
    const target = await db.user.findUnique({ where: { id: userId }, select: { role: true } });
    if (!target) throw new NotFoundError("User not found");

    if (target.role !== "ADMIN") {
      throw new ForbiddenError("Only users with role 'ADMIN' can be promoted to SUPERADMIN");
    }

    return await db.user.update({
      where: { id: userId },
      data: { role: "SUPERADMIN" },
    });
  } catch (err: any) {
    console.error("[ADMIN] Database error in promoteToSuperAdmin:", err?.message);
    if (err instanceof NotFoundError || err instanceof ForbiddenError) throw err;
    throw new InternalServerError();
  }
}

export async function banUsersByDeviceId(deviceId: string, reason: string, adminId: string) {
  try {
    // 1. Find all active users with this deviceId, sorted by oldest first
    const users = await db.user.findMany({
      where: { deviceId, isBanned: false },
      orderBy: { createdAt: 'asc' },
      select: { id: true, username: true, role: true }
    });

    if (users.length <= 1) {
      return { count: 0, message: "No duplicates to ban for this device. Only one (or zero) active user exists." };
    }

    // 2. The first user is the "Original" — keep them. The rest are duplicates.
    const original = users[0];
    const duplicates = users.slice(1);

    // 3. Ban each duplicate individually using the existing banUser logic
    // This ensures: a) RBAC checks (admins cant ban admins), b) Referral Penalties trigger
    let bannedCount = 0;
    const bannedUsernames: string[] = [];

    // Use loop to await each ban to ensure audit logs and penalties are ordered/handled
    for (const target of duplicates) {
      try {
        await banUser(target.id, "SUPERADMIN", reason, adminId);
        bannedCount++;
        bannedUsernames.push(target.username || target.id);
      } catch (err: any) {
        console.warn(`[ADMIN] Failed to ban duplicate user ${target.id} on device ${deviceId}:`, err?.message);
      }
    }

    return { 
      count: bannedCount, 
      targets: bannedUsernames, 
      message: `Banned ${bannedCount} duplicate(s). Sared original user: ${original.username || original.id}.` 
    };
  } catch (err: any) {
    console.error("[ADMIN] Database error in banUsersByDeviceId:", err?.message);
    throw new InternalServerError();
  }
}

export async function banUsersWithNoDevice(reason: string, adminId: string) {
  try {
    // 1. Find all active users with no deviceId
    const targets = await db.user.findMany({
      where: { deviceId: null, isBanned: false },
      select: { id: true, username: true, role: true }
    });

    if (targets.length === 0) {
      return { count: 0, message: "No active users found with missing device ID." };
    }

    let bannedCount = 0;
    const bannedUsernames: string[] = [];

    // 2. Loop through and ban each individually
    // We skip SUPERADMINS for safety (though they should have device IDs)
    for (const target of targets) {
      if (target.role === "SUPERADMIN") continue;
      
      try {
        await banUser(target.id, "SUPERADMIN", reason, adminId);
        bannedCount++;
        bannedUsernames.push(target.username || target.id);
      } catch (err: any) {
        console.warn(`[ADMIN] Failed to ban no-device user ${target.id}:`, err?.message);
      }
    }

    return { 
      count: bannedCount, 
      targets: bannedUsernames, 
      message: `Mass ban complete. ${bannedCount} accounts removed.` 
    };
  } catch (err: any) {
    console.error("[ADMIN] Database error in banUsersWithNoDevice:", err?.message);
    throw new InternalServerError();
  }
}

// ----- Task management for waitlist (Admin) -----
export async function createTask(data: {
  title: string;
  description: string;
  type: TaskType;
  points: number;
  link?: string;
  icon?: string;
  category?: string;
  validationKey?: string;
  isActive?: boolean;
  durationDays?: number; // For SOCIAL tasks: 1-30 days
}) {
  try {
    // Calculate expiresAt for SOCIAL tasks with a duration
    let expiresAt: Date | undefined;
    if (data.type === "SOCIAL" && data.durationDays && data.durationDays > 0) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + data.durationDays);
    }

    return await db.task.create({
      data: {
        ...data,
        expiresAt,
      },
    });
  } catch (err: any) {
    console.error("[ADMIN] Database error in createTask:", err?.message);
    throw new InternalServerError();
  }
}

export async function listTasks() {
  try {
    return await db.task.findMany({ orderBy: { createdAt: "desc" } });
  } catch (err: any) {
    console.error("[ADMIN] Database error in listTasks:", err?.message);
    throw new InternalServerError();
  }
}

export async function updateTask(
  taskId: string,
  data: Partial<{
    title: string;
    description: string;
    type: TaskType;
    points: number;
    link?: string;
    icon?: string;
    category?: string;
    validationKey?: string;
    isActive?: boolean;
  }>,
) {
  try {
    return await db.task.update({ where: { id: taskId }, data });
  } catch (err: any) {
    console.error("[ADMIN] Database error in updateTask:", err?.message);
    if (err?.code === "P2025") {
      throw new NotFoundError("Task not found");
    }
    throw new InternalServerError();
  }
}

export async function deleteTask(taskId: string) {
  try {
    // Use transaction to ensure atomic deletion
    return await db.$transaction(async (tx: any) => {
      // First, delete all UserTask records for this task
      // Users keep their earned PXP - we don't decrement balances
      await tx.userTask.deleteMany({
        where: { taskId },
      });

      // Then delete the task itself
      return await tx.task.delete({ where: { id: taskId } });
    });
  } catch (err: any) {
    console.error("[ADMIN] Database error in deleteTask:", err?.message);
    if (err?.code === "P2025") {
      throw new NotFoundError("Task not found");
    }
    throw new InternalServerError();
  }
}

/**
 * Cleanup expired SOCIAL tasks
 * Should be called on server startup and periodically
 * Users keep their earned PXP - we only remove the task and UserTask records
 */
export async function cleanupExpiredTasks() {
  try {
    const now = new Date();
    
    // Find all expired tasks
    const expiredTasks = await db.task.findMany({
      where: {
        expiresAt: {
          lt: now,
        },
      },
      select: { id: true, title: true },
    });

    if (expiredTasks.length === 0) {
      console.log("[ADMIN] No expired tasks to cleanup");
      return { deleted: 0 };
    }

    const expiredIds = expiredTasks.map((t: any) => t.id);

    // Use transaction for atomic cleanup
    await db.$transaction(async (tx: any) => {
      // First delete all UserTask records for expired tasks
      await tx.userTask.deleteMany({
        where: { taskId: { in: expiredIds } },
      });

      // Then delete the tasks themselves
      await tx.task.deleteMany({
        where: { id: { in: expiredIds } },
      });
    });

    console.log(`[ADMIN] Cleaned up ${expiredTasks.length} expired tasks`);
    return { deleted: expiredTasks.length, tasks: expiredTasks };
  } catch (err: any) {
    console.error("[ADMIN] Error cleaning up expired tasks:", err?.message);
    throw new InternalServerError();
  }
}

export async function getUserPXPHistory(userId: string) {
  try {
    const history: any[] = [];

    // 1. Tasks (Note: Daily tasks only show latest completion due to schema design)
    const userTasks = await db.userTask.findMany({
      where: { userId },
      include: { task: true },
    });
    userTasks.forEach(ut => {
      // Only include completed tasks (though default is COMPLETED)
      if (ut.status !== 'PENDING') {
         history.push({
          id: ut.id,
          type: "TASK",
          amount: ut.task.points,
          description: `Task: ${ut.task.title}`,
          timestamp: ut.completedAt,
        });
      }
    });

    // 2. Referrals (Bonus granted to ME for referring SOMEONE)
    const referrals = await db.user.findMany({
      where: { referredById: userId, referrerBonusGranted: true },
      select: { id: true, username: true, createdAt: true }
    });
    referrals.forEach(ref => {
      history.push({
        id: `ref-${ref.id}`,
        type: "REFERRAL",
        amount: 150,
        description: `Referral Bonus: ${ref.username}`,
        timestamp: ref.createdAt // Approximation
      });
    });

    // 3. Signup Bonus
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { newUserBonusGranted: true, createdAt: true }
    });
    if (user?.newUserBonusGranted) {
      history.push({
        id: `bonus-signup-${userId}`,
        type: "BONUS",
        amount: 75,
        description: "Welcome Bonus",
        timestamp: user.createdAt
      });
    }

    // 4. Penalties
    const penalties = await db.referralPenaltyEvent.findMany({
      where: { referrerId: userId },
      include: { banned: { select: { username: true } } }
    });
    penalties.forEach(p => {
      history.push({
        id: p.id,
        type: "PENALTY",
        amount: -p.pxpDeducted,
        description: `Penalty: Referred user ${p.banned.username || 'Unknown'} banned (${p.banReason})`,
        timestamp: p.createdAt
      });
    });

    return history.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  } catch (err: any) {
     console.error("[ADMIN] Database error in getUserPXPHistory:", err?.message);
     throw new InternalServerError();
  }
}



