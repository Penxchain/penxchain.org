import { db } from "../../shared/database/db";
import { TaskType } from "@prisma/client";
import { InternalServerError, NotFoundError, ForbiddenError } from "../../shared/errors";
import { redisClient } from "../../shared/redis";

export async function getSystemStats() {
  try {
    const totalUsers = await db.user.count();
    const totalPoints = await db.user.aggregate({
      _sum: { pxpBalance: true },
    });
    const topReferrers = await db.user.findMany({
      take: 5,
      orderBy: { referrals: { _count: "desc" } },
      select: { username: true, _count: { select: { referrals: true } } },
    });

    return {
      totalUsers,
      totalPoints: totalPoints._sum.pxpBalance || 0,
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

export async function getAllUsers(page: number = 1, limit: number = 20) {
  try {
    const skip = (page - 1) * limit;
    const users = await db.user.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        pxpBalance: true,
        createdAt: true,
        walletAddress: true,
        isBanned: true,
      },
    });
    const total = await db.user.count();

    return { users, total, pages: Math.ceil(total / limit) };
  } catch (err: any) {
    console.error("[ADMIN] Database error in getAllUsers:", err?.message);
    throw new InternalServerError();
  }
}

export async function banUser(userId: string, actorRole: string) {
  try {
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

    return await db.user.update({
      where: { id: userId },
      data: { isBanned: true, pxpBalance: 0 },
    });
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
      data: { isBanned: false },
    });
  } catch (err: any) {
    console.error("[ADMIN] Database error in unbanUser:", err?.message);
    if (err?.code === "P2025") {
      throw new NotFoundError("User not found");
    }
    throw new InternalServerError();
  }
}

export async function promoteToAdmin(userId: string) {
  try {
    return await db.user.update({
      where: { id: userId },
      data: { role: "ADMIN" },
    });
  } catch (err: any) {
    console.error("[ADMIN] Database error in promoteToAdmin:", err?.message);
    if (err?.code === "P2025") {
      throw new NotFoundError("User not found");
    }
    throw new InternalServerError();
  }
}

export async function demoteFromAdmin(userId: string) {
  try {
    return await db.user.update({
      where: { id: userId },
      data: { role: "USER" },
    });
  } catch (err: any) {
    console.error("[ADMIN] Database error in demoteFromAdmin:", err?.message);
    if (err?.code === "P2025") {
      throw new NotFoundError("User not found");
    }
    throw new InternalServerError();
  }
}

export async function promoteToSuperAdmin(userId: string) {
  try {
    return await db.user.update({
      where: { id: userId },
      data: { role: "SUPERADMIN" },
    });
  } catch (err: any) {
    console.error("[ADMIN] Database error in promoteToSuperAdmin:", err?.message);
    if (err?.code === "P2025") {
      throw new NotFoundError("User not found");
    }
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

    console.log(`[ADMIN] Cleaned up ${expiredTasks.length} expired tasks:`, expiredTasks.map((t: any) => t.title));
    return { deleted: expiredTasks.length, tasks: expiredTasks };
  } catch (err: any) {
    console.error("[ADMIN] Error cleaning up expired tasks:", err?.message);
    throw new InternalServerError();
  }
}



