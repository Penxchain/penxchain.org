import { db } from "../../shared/database/db";
import { redisClient } from "../../shared/redis";

export async function getTasksWithUserStatus(userId: string) {
  const tasks = await db.task.findMany({
    where: { isActive: true },
    include: {
      userTasks: {
        where: { userId },
        select: { status: true, completedAt: true },
      },
    },
  });

  return tasks.map((task) => ({
    ...task,
    status: task.userTasks[0]?.status || "PENDING",
    completedAt: task.userTasks[0]?.completedAt || null,
    // Remove userTasks array from response
    userTasks: undefined,
  }));
}

export async function completeTask(userId: string, taskId: string) {
  return db.$transaction(async (tx: any) => {
    // 1. Get Task
    const task = await tx.task.findFirst({
      where: { id: taskId },
    });

    if (!task) {
      throw new Error("Task not found");
    }

    if (!task.isActive) {
      throw new Error("Task is not active");
    }

    // 2. Check if already completed
    const existing = await tx.userTask.findFirst({
      where: { userId, taskId },
    });

    if (existing) {
      throw new Error("Task already completed");
    }

    // 3. Create UserTask
    await tx.userTask.create({
      data: {
        userId,
        taskId,
        status: "COMPLETED",
      },
    });

    // 4. Update User Points
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: {
        pxpBalance: { increment: task.points },
      },
      select: { id: true, pxpBalance: true },
    });

    // 5. Update Redis leaderboard if available (best-effort)
    try {
      if (redisClient) {
        const key = "waitlist:leaderboard";
        // Use user's id as member and updated pxpBalance as score
        await redisClient.zAdd(key, {
          score: updatedUser.pxpBalance,
          value: updatedUser.id,
        });
      }
    } catch (e) {
      // Do not fail the transaction if Redis update fails; log and continue
      // Fastify logger isn't available here; use console.warn
      console.warn("Failed to update Redis leaderboard:", e);
    }

    return updatedUser;
  });
}

export async function getUserStats(userId: string) {
  const user = await db.user.findFirst({
    where: { id: userId },
    select: {
      pxpBalance: true,
      username: true,
      role: true,
      referralCode: true,
      _count: {
        select: { tasks: true, referrals: true },
      },
    },
  });

  if (!user) throw new Error("User not found");

  // Basic rank calculation (can be optimized with dedicated leaderboard query)
  // For now, simple count of users with more points
  const rank = await db.user.count({
    where: { pxpBalance: { gt: user.pxpBalance } },
  });

  return {
    ...user,
    rank: rank + 1,
  };
}

export function getServerTime() {
  const now = new Date();
  const nextReset = new Date(now);
  nextReset.setUTCHours(24, 0, 0, 0); // Next midnight UTC

  return {
    serverTime: now.toISOString(),
    nextReset: nextReset.toISOString(),
    // Optional: Return diff in ms for convenience
    timeUntilReset: nextReset.getTime() - now.getTime(),
  };
}

export async function claimDailyReward(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { lastBonusClaim: true, pxpBalance: true }
  });

  if (!user) throw new Error("User not found");

  const now = new Date();
  const lastClaim = user.lastBonusClaim;

  if (lastClaim) {
    const lastClaimDate = new Date(lastClaim);
    const isSameDay = 
      lastClaimDate.getUTCFullYear() === now.getUTCFullYear() &&
      lastClaimDate.getUTCMonth() === now.getUTCMonth() &&
      lastClaimDate.getUTCDate() === now.getUTCDate();

    if (isSameDay) {
      throw new Error("Daily reward already claimed today");
    }
  }

  const bonusPoints = 100; // Standard daily bonus

  const updatedUser = await db.user.update({
    where: { id: userId },
    data: {
      pxpBalance: { increment: bonusPoints },
      lastBonusClaim: now
    },
    select: { id: true, pxpBalance: true }
  });

  return {
    success: true,
    message: `Claimed ${bonusPoints} PXP!`,
    newBalance: updatedUser.pxpBalance
  };
}
