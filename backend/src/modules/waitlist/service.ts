import { db } from "../../shared/database/db";
import { redisClient } from "../../shared/redis";

/**
 * Updates the user's daily streak based on their last activity date.
 * - Same day: No change
 * - Yesterday: Increment streak
 * - Older/null: Reset streak to 1
 */
async function updateDailyStreak(userId: string, tx?: any) {
  const prisma = tx || db;
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { dailyStreak: true, lastActivityDate: true },
  });

  if (!user) return;

  const now = new Date();
  const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  
  let newStreak = 1;
  
  if (user.lastActivityDate) {
    const lastDate = new Date(user.lastActivityDate);
    const lastDateUTC = new Date(Date.UTC(lastDate.getUTCFullYear(), lastDate.getUTCMonth(), lastDate.getUTCDate()));
    
    const diffMs = todayUTC.getTime() - lastDateUTC.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Same day - don't update, already counted
      return;
    } else if (diffDays === 1) {
      // Yesterday - increment streak
      newStreak = user.dailyStreak + 1;
    }
    // else: More than 1 day gap - reset to 1 (default)
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      dailyStreak: newStreak,
      lastActivityDate: todayUTC,
    },
  });
}

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

  // Calculate today's UTC date boundary for DAILY task comparison
  const now = new Date();
  const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

  return tasks.map((task) => {
    const userTask = task.userTasks[0];
    
    // No completion record exists - task is pending
    if (!userTask) {
      return {
        ...task,
        status: "PENDING",
        completedAt: null,
        userTasks: undefined,
      };
    }

    // For DAILY tasks: derive completion state from completedAt date
    // Task is only "COMPLETED" if completed TODAY (UTC), otherwise it resets to "PENDING"
    if (task.type === "DAILY") {
      const completedAt = userTask.completedAt ? new Date(userTask.completedAt) : null;
      
      if (completedAt) {
        const completedDateUTC = new Date(Date.UTC(
          completedAt.getUTCFullYear(),
          completedAt.getUTCMonth(),
          completedAt.getUTCDate()
        ));
        
        const isCompletedToday = completedDateUTC.getTime() === todayUTC.getTime();
        
        return {
          ...task,
          status: isCompletedToday ? "COMPLETED" : "PENDING",
          completedAt: userTask.completedAt,
          userTasks: undefined,
        };
      }
      
      // Has record but no completedAt (defensive handling)
      return {
        ...task,
        status: "PENDING",
        completedAt: null,
        userTasks: undefined,
      };
    }

    // For ONE_TIME and SOCIAL tasks: completed permanently once done
    return {
      ...task,
      status: userTask.status || "PENDING",
      completedAt: userTask.completedAt || null,
      userTasks: undefined,
    };
  });
}

export async function completeTask(userId: string, taskId: string) {
  return db.$transaction(async (tx: any) => {
    // 0. Check if user is banned
    const userCheck = await tx.user.findUnique({
      where: { id: userId },
      select: { isBanned: true },
    });
    
    if (userCheck?.isBanned) {
      throw new Error("Account is banned. Cannot complete tasks.");
    }

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

    // 2. Check if user has a UserTask record
    const existing = await tx.userTask.findFirst({
      where: { userId, taskId },
      select: { id: true, completedAt: true },
    });

    const now = new Date();

    if (existing) {
      // If the task is DAILY, allow re-completion once per UTC day by updating the record
      if (task.type === "DAILY") {
        const last = existing.completedAt
          ? new Date(existing.completedAt)
          : null;
        if (last) {
          const sameUTCDate =
            last.getUTCFullYear() === now.getUTCFullYear() &&
            last.getUTCMonth() === now.getUTCMonth() &&
            last.getUTCDate() === now.getUTCDate();

          if (sameUTCDate) {
            throw new Error("Task already completed for today");
          }
        }

        // Update existing record's completedAt/status so it can be completed again today
        await tx.userTask.update({
          where: { id: existing.id },
          data: { completedAt: now, status: "COMPLETED" },
        });
      } else {
        // Non-repeatable tasks cannot be completed again
        throw new Error("Task already completed");
      }
    } else {
      // 3. Create UserTask
      await tx.userTask.create({
        data: {
          userId,
          taskId,
          status: "COMPLETED",
        },
      });
    }

    // 4. Update User Points
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: {
        pxpBalance: { increment: task.points },
      },
      select: { id: true, pxpBalance: true },
    });

    // 5. Update daily streak
    await updateDailyStreak(userId, tx);

    // 6. Update Redis leaderboard if available (best-effort)
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
      dailyStreak: true,
      lastActivityDate: true,
      isBanned: true,
      banReason: true,
      bannedAt: true,
      _count: {
        select: { referrals: true },
      },
      tasks: {
        select: { taskId: true },
        where: { status: "COMPLETED" },
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
    select: { lastBonusClaim: true, pxpBalance: true, isBanned: true },
  });

  if (!user) throw new Error("User not found");
  
  // Check if user is banned
  if (user.isBanned) {
    throw new Error("Account is banned. Cannot claim rewards.");
  }

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
      lastBonusClaim: now,
    },
    select: { id: true, pxpBalance: true },
  });

  // Update daily streak
  await updateDailyStreak(userId);

  // Update Redis leaderboard
  try {
    if (redisClient) {
      const key = "waitlist:leaderboard";
      await redisClient.zAdd(key, {
        score: updatedUser.pxpBalance,
        value: updatedUser.id,
      });
    }
  } catch (e) {
    console.warn("Failed to update Redis leaderboard after bonus claim:", e);
  }

  return {
    success: true,
    message: `Claimed ${bonusPoints} PXP!`,
    newBalance: updatedUser.pxpBalance,
  };
}

