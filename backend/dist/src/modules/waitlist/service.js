"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTasksWithUserStatus = getTasksWithUserStatus;
exports.completeTask = completeTask;
exports.getUserStats = getUserStats;
exports.getServerTime = getServerTime;
exports.claimDailyReward = claimDailyReward;
const db_1 = require("../../shared/database/db");
const redis_1 = require("../../shared/redis");
const errors_1 = require("../../shared/errors");
async function getTasksWithUserStatus(userId) {
    try {
        const now = new Date();
        const [tasks, userTasks] = await Promise.all([
            db_1.db.task.findMany({
                where: {
                    isActive: true,
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
            db_1.db.userTask.findMany({
                where: { userId },
                select: { taskId: true, status: true, completedAt: true }
            })
        ]);
        const taskStatusMap = new Map(userTasks.map(ut => [ut.taskId, ut]));
        const todayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        return tasks.map((task) => {
            const userTask = taskStatusMap.get(task.id);
            let status = userTask?.status || "PENDING";
            let completedAt = userTask?.completedAt || null;
            if (task.type === "DAILY" && userTask?.completedAt) {
                const lastCompleted = new Date(userTask.completedAt);
                if (lastCompleted < todayStart) {
                    status = "PENDING";
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
    }
    catch (err) {
        console.error("[WAITLIST] Database error in getTasksWithUserStatus:", err?.message);
        throw new errors_1.InternalServerError();
    }
}
async function completeTask(userId, taskId) {
    try {
        return await db_1.db.$transaction(async (tx) => {
            const task = await tx.task.findFirst({
                where: { id: taskId },
                select: { id: true, type: true, points: true, isActive: true, title: true },
            });
            if (!task) {
                throw new errors_1.NotFoundError("Task not found");
            }
            if (!task.isActive) {
                throw new errors_1.BadRequestError("This task is not currently available");
            }
            const existing = await tx.userTask.findFirst({
                where: { userId, taskId },
                select: { id: true, completedAt: true },
            });
            const now = new Date();
            const todayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
            if (existing) {
                if (task.type === "DAILY") {
                    const lastCompletedAt = new Date(existing.completedAt);
                    if (lastCompletedAt >= todayStart) {
                        throw new errors_1.BadRequestError("You've already completed this daily task today. Come back tomorrow!");
                    }
                    await tx.userTask.update({
                        where: { id: existing.id },
                        data: { completedAt: now, status: "COMPLETED" },
                    });
                }
                else {
                    throw new errors_1.BadRequestError("You've already completed this task");
                }
            }
            else {
                await tx.userTask.create({
                    data: {
                        userId,
                        taskId,
                        status: "COMPLETED",
                        completedAt: now,
                    },
                });
            }
            const updatedUser = await tx.user.update({
                where: { id: userId },
                data: {
                    pxpBalance: { increment: task.points },
                },
                select: { id: true, pxpBalance: true },
            });
            try {
                if (redis_1.redisClient) {
                    const key = "waitlist:leaderboard";
                    await redis_1.redisClient.zAdd(key, {
                        score: updatedUser.pxpBalance,
                        value: updatedUser.id,
                    });
                }
            }
            catch (e) {
                console.warn("[WAITLIST] Failed to update Redis leaderboard:", e);
            }
            return {
                ...updatedUser,
                pointsEarned: task.points,
            };
        });
    }
    catch (err) {
        if (err instanceof errors_1.NotFoundError || err instanceof errors_1.BadRequestError) {
            throw err;
        }
        console.error("[WAITLIST] Database error in completeTask:", err?.message);
        throw new errors_1.InternalServerError();
    }
}
async function getUserStats(userId) {
    try {
        const user = await db_1.db.user.findFirst({
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
            throw new errors_1.NotFoundError("User not found");
        }
        let rank = 0;
        if (redis_1.redisClient) {
            try {
                const key = "waitlist:leaderboard";
                const redisRank = await redis_1.redisClient.zRevRank(key, userId);
                if (redisRank !== null) {
                    rank = redisRank + 1;
                }
                else {
                    console.warn(`[WAITLIST] User ${userId} not found in Redis leaderboard, falling back to DB`);
                    const dbCount = await db_1.db.user.count({
                        where: { pxpBalance: { gt: user.pxpBalance } },
                    });
                    rank = dbCount + 1;
                    redis_1.redisClient.zAdd(key, { score: user.pxpBalance, value: userId }).catch(console.error);
                }
            }
            catch (e) {
                console.warn("[WAITLIST] Redis rank check failed:", e);
                const dbCount = await db_1.db.user.count({
                    where: { pxpBalance: { gt: user.pxpBalance } },
                });
                rank = dbCount + 1;
            }
        }
        else {
            const dbCount = await db_1.db.user.count({
                where: { pxpBalance: { gt: user.pxpBalance } },
            });
            rank = dbCount + 1;
        }
        return {
            ...user,
            rank,
            tasksCompleted: user._count?.tasks ?? 0,
            referralCount: user._count?.referrals ?? 0,
        };
    }
    catch (err) {
        if (err instanceof errors_1.NotFoundError) {
            throw err;
        }
        console.error("[WAITLIST] Database error in getUserStats:", err?.message);
        throw new errors_1.InternalServerError();
    }
}
function getServerTime() {
    const now = new Date();
    const nextReset = new Date(now);
    nextReset.setUTCHours(24, 0, 0, 0);
    return {
        serverTime: now.toISOString(),
        nextReset: nextReset.toISOString(),
        timeUntilReset: nextReset.getTime() - now.getTime(),
    };
}
async function claimDailyReward(userId) {
    try {
        const user = await db_1.db.user.findFirst({
            where: { id: userId },
            select: { id: true, lastBonusClaim: true, pxpBalance: true },
        });
        if (!user) {
            throw new errors_1.NotFoundError("User not found");
        }
        const now = new Date();
        const lastClaim = user.lastBonusClaim;
        if (lastClaim) {
            const hoursSinceLastClaim = (now.getTime() - new Date(lastClaim).getTime()) / (1000 * 60 * 60);
            if (hoursSinceLastClaim < 24) {
                const hoursRemaining = Math.ceil(24 - hoursSinceLastClaim);
                throw new errors_1.BadRequestError(`Please wait ${hoursRemaining} more hours before claiming again`);
            }
        }
        const bonusAmount = 75;
        const updatedUser = await db_1.db.user.update({
            where: { id: userId },
            data: {
                pxpBalance: { increment: bonusAmount },
                lastBonusClaim: now,
            },
            select: { id: true, pxpBalance: true },
        });
        try {
            if (redis_1.redisClient) {
                const key = "waitlist:leaderboard";
                await redis_1.redisClient.zAdd(key, {
                    score: updatedUser.pxpBalance,
                    value: updatedUser.id,
                });
            }
        }
        catch (e) {
            console.warn("[WAITLIST] Failed to update Redis leaderboard:", e);
        }
        return {
            success: true,
            bonusEarned: bonusAmount,
            points: updatedUser.pxpBalance,
        };
    }
    catch (err) {
        if (err instanceof errors_1.NotFoundError || err instanceof errors_1.BadRequestError) {
            throw err;
        }
        console.error("[WAITLIST] Database error in claimDailyReward:", err?.message);
        throw new errors_1.InternalServerError();
    }
}
//# sourceMappingURL=service.js.map