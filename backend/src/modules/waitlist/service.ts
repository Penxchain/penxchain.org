import { db } from "../../shared/database/db";
import { redisClient } from "../../shared/redis";
import { InternalServerError, NotFoundError, BadRequestError } from "../../shared/errors";
import { syncLeaderboard } from "../leaderboard/service";

export async function getTasksWithUserStatus(userId: string) {
  try {
    const now = new Date();
    
    // Optimization: Fetch active, non-expired tasks and user completion status in parallel
    // Only select needed fields for speed
    const [tasks, userTasks] = await Promise.all([
      db.task.findMany({
        where: { 
          isActive: true,
          // Exclude expired SOCIAL tasks: expiresAt is null OR expiresAt > now
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: now } },
          ],
        },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          description: true,
          type: true,
          points: true,
          link: true,
          icon: true,
          category: true,
          isActive: true,
          expiresAt: true,
        }
      }),
      db.userTask.findMany({
        where: { userId },
        select: { taskId: true, status: true, completedAt: true }
      })
    ]);

    // Create a map for O(1) lookup
    const taskStatusMap = new Map(userTasks.map((ut: any) => [ut.taskId, ut]));

    // Calculate today's start in UTC for daily task reset check
    const todayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

    return tasks.map((task: any) => {
      const userTask: any = taskStatusMap.get(task.id);
      let status = userTask?.status || "PENDING";
      let completedAt = userTask?.completedAt || null;

      // For DAILY tasks: if completed before today, show as available again
      if (task.type === "DAILY" && userTask?.completedAt) {
        const lastCompleted = new Date(userTask.completedAt);
        if (lastCompleted < todayStart) {
          status = "PENDING"; // Available for re-completion today
          completedAt = null;
        }
      }

      return {
        ...task,
        status,
        completedAt,
        completed: status === "COMPLETED",
      };
    });
  } catch (err: any) {
    console.error("[WAITLIST] Database error in getTasksWithUserStatus:", err?.message);
    throw new InternalServerError();
  }
}

export async function completeTask(userId: string, taskId: string) {
  try {
    return await db.$transaction(async (tx: any) => {
      // 1. Get Task
      const task = await tx.task.findFirst({
        where: { id: taskId },
        select: { id: true, type: true, points: true, isActive: true, title: true },
      });

      if (!task) {
        throw new NotFoundError("Task not found");
      }

      if (!task.isActive) {
        throw new BadRequestError("This task is not currently available");
      }

      // 2. Check if already completed
      const existing = await tx.userTask.findFirst({
        where: { userId, taskId },
        select: { id: true, completedAt: true },
      });

      const now = new Date();
      const todayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

      if (existing) {
        // For DAILY tasks: allow re-completion if last completion was before today (UTC)
        if (task.type === "DAILY") {
          const lastCompletedAt = new Date(existing.completedAt);
          if (lastCompletedAt >= todayStart) {
            throw new BadRequestError("You've already completed this daily task today. Come back tomorrow!");
          }
          // Allow re-completion: update the existing record
          await tx.userTask.update({
            where: { id: existing.id },
            data: { completedAt: now, status: "COMPLETED" },
          });
        } else {
          // ONE_TIME or SOCIAL tasks can only be completed once
          throw new BadRequestError("You've already completed this task");
        }
      } else {
        // 3. Create UserTask for first-time completion
        await tx.userTask.create({
          data: {
            userId,
            taskId,
            status: "COMPLETED",
            completedAt: now,
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

      // 5. Update Redis leaderboard if available (best-effort)
      try {
        if (redisClient) {
          const key = "waitlist:leaderboard";
          await redisClient.zAdd(key, {
            score: updatedUser.pxpBalance,
            value: updatedUser.id,
          });
        }
      } catch (e) {
        // Don't fail the transaction if Redis update fails
        console.warn("[WAITLIST] Failed to update Redis leaderboard:", e);
      }

      return {
        ...updatedUser,
        pointsEarned: task.points, // Include points earned for frontend animation
      };
    });
  } catch (err: any) {
    // Re-throw our custom errors
    if (err instanceof NotFoundError || err instanceof BadRequestError) {
      throw err;
    }
    console.error("[WAITLIST] Database error in completeTask:", err?.message);
    throw new InternalServerError();
  }
}

export async function getUserStats(userId: string) {
  try {
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

    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Basic rank calculation
    // Optimized Rank Calculation
    let rank = 0;
    
    if (redisClient) {
      try {
        const key = "waitlist:leaderboard";
        const redisRank = await redisClient.zRevRank(key, userId);
        
        if (redisRank !== null) {
          rank = redisRank + 1;
        } else {
          // User not in Redis? Try syncing specific user or full sync
          // For now, fall back to DB count
          console.warn(`[WAITLIST] User ${userId} not found in Redis leaderboard, falling back to DB`);
          const dbCount = await db.user.count({
            where: { pxpBalance: { gt: user.pxpBalance } },
          });
          rank = dbCount + 1;
          
          // Heal: Add them to Redis
          redisClient.zAdd(key, { score: user.pxpBalance, value: userId }).catch(console.error);
        }
      } catch (e) {
        console.warn("[WAITLIST] Redis rank check failed:", e);
        // Fallback
        const dbCount = await db.user.count({
          where: { pxpBalance: { gt: user.pxpBalance } },
        });
        rank = dbCount + 1;
      }
    } else {
      // No Redis configured
      const dbCount = await db.user.count({
        where: { pxpBalance: { gt: user.pxpBalance } },
      });
      rank = dbCount + 1;
    }

    return {
      ...user,
      rank,
      // Explicit metrics for dashboard (Issue 8: Real Metrics)
      tasksCompleted: user._count?.tasks ?? 0,
      referralCount: user._count?.referrals ?? 0,
    };
  } catch (err: any) {
    if (err instanceof NotFoundError) {
      throw err;
    }
    console.error("[WAITLIST] Database error in getUserStats:", err?.message);
    throw new InternalServerError();
  }
}

export function getServerTime() {
  const now = new Date();
  const nextReset = new Date(now);
  nextReset.setUTCHours(24, 0, 0, 0);

  return {
    serverTime: now.toISOString(),
    nextReset: nextReset.toISOString(),
    timeUntilReset: nextReset.getTime() - now.getTime(),
  };
}

export async function claimDailyReward(userId: string) {
  try {
    // Check last claim time
    const user = await db.user.findFirst({
      where: { id: userId },
      select: { id: true, lastBonusClaim: true, pxpBalance: true },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const now = new Date();
    const lastClaim = user.lastBonusClaim;
    
    // Check if 24 hours have passed since last claim
    if (lastClaim) {
      const hoursSinceLastClaim = (now.getTime() - new Date(lastClaim).getTime()) / (1000 * 60 * 60);
      if (hoursSinceLastClaim < 24) {
        const hoursRemaining = Math.ceil(24 - hoursSinceLastClaim);
        throw new BadRequestError(`Please wait ${hoursRemaining} more hours before claiming again`);
      }
    }

    // Award bonus points - double-tap reward
    const bonusAmount = 75;
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        pxpBalance: { increment: bonusAmount },
        lastBonusClaim: now,
      },
      select: { id: true, pxpBalance: true },
    });

    // Update Redis leaderboard if available
    try {
      if (redisClient) {
        const key = "waitlist:leaderboard";
        await redisClient.zAdd(key, {
          score: updatedUser.pxpBalance,
          value: updatedUser.id,
        });
      }
    } catch (e) {
      console.warn("[WAITLIST] Failed to update Redis leaderboard:", e);
    }

    return {
      success: true,
      bonusEarned: bonusAmount,
      points: updatedUser.pxpBalance,
    };
  } catch (err: any) {
    if (err instanceof NotFoundError || err instanceof BadRequestError) {
      throw err;
    }
    console.error("[WAITLIST] Database error in claimDailyReward:", err?.message);
    throw new InternalServerError();
  }
}


