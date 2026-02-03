"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTasksWithUserStatus = getTasksWithUserStatus;
exports.completeTask = completeTask;
exports.getUserStats = getUserStats;
exports.getServerTime = getServerTime;
exports.claimDailyReward = claimDailyReward;
const db_1 = require("../../shared/database/db");
const redis_1 = require("../../shared/redis");
async function getTasksWithUserStatus(userId) {
    const tasks = await db_1.db.task.findMany({
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
        userTasks: undefined,
    }));
}
async function completeTask(userId, taskId) {
    return db_1.db.$transaction(async (tx) => {
        const task = await tx.task.findFirst({
            where: { id: taskId },
        });
        if (!task) {
            throw new Error("Task not found");
        }
        if (!task.isActive) {
            throw new Error("Task is not active");
        }
        const existing = await tx.userTask.findFirst({
            where: { userId, taskId },
        });
        if (existing) {
            throw new Error("Task already completed");
        }
        await tx.userTask.create({
            data: {
                userId,
                taskId,
                status: "COMPLETED",
            },
        });
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
            console.warn("Failed to update Redis leaderboard:", e);
        }
        return updatedUser;
    });
}
async function getUserStats(userId) {
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
    if (!user)
        throw new Error("User not found");
    const rank = await db_1.db.user.count({
        where: { pxpBalance: { gt: user.pxpBalance } },
    });
    return {
        ...user,
        rank: rank + 1,
    };
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
    const user = await db_1.db.user.findUnique({
        where: { id: userId },
        select: { lastBonusClaim: true, pxpBalance: true }
    });
    if (!user)
        throw new Error("User not found");
    const now = new Date();
    const lastClaim = user.lastBonusClaim;
    if (lastClaim) {
        const lastClaimDate = new Date(lastClaim);
        const isSameDay = lastClaimDate.getUTCFullYear() === now.getUTCFullYear() &&
            lastClaimDate.getUTCMonth() === now.getUTCMonth() &&
            lastClaimDate.getUTCDate() === now.getUTCDate();
        if (isSameDay) {
            throw new Error("Daily reward already claimed today");
        }
    }
    const bonusPoints = 100;
    const updatedUser = await db_1.db.user.update({
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
//# sourceMappingURL=service.js.map