"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTasksWithUserStatus = getTasksWithUserStatus;
exports.completeTask = completeTask;
exports.markNotificationsAsRead = markNotificationsAsRead;
exports.getUserStats = getUserStats;
exports.getServerTime = getServerTime;
exports.claimDailyReward = claimDailyReward;
const db_1 = require("../../shared/database/db");
const redis_1 = require("../../shared/redis");
async function updateDailyStreak(userId, tx) {
    const prisma = tx || db_1.db;
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { dailyStreak: true, lastActivityDate: true },
    });
    if (!user)
        return;
    const now = new Date();
    const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    let newStreak = 1;
    if (user.lastActivityDate) {
        const lastDate = new Date(user.lastActivityDate);
        const lastDateUTC = new Date(Date.UTC(lastDate.getUTCFullYear(), lastDate.getUTCMonth(), lastDate.getUTCDate()));
        const diffMs = todayUTC.getTime() - lastDateUTC.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays === 0) {
            return;
        }
        else if (diffDays === 1) {
            newStreak = user.dailyStreak + 1;
        }
    }
    await prisma.user.update({
        where: { id: userId },
        data: {
            dailyStreak: newStreak,
            lastActivityDate: todayUTC,
        },
    });
}
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
    const now = new Date();
    const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    return tasks.map((task) => {
        const userTask = task.userTasks[0];
        if (!userTask) {
            return {
                ...task,
                status: "PENDING",
                completedAt: null,
                userTasks: undefined,
            };
        }
        if (task.type === "DAILY") {
            const completedAt = userTask.completedAt ? new Date(userTask.completedAt) : null;
            if (completedAt) {
                const completedDateUTC = new Date(Date.UTC(completedAt.getUTCFullYear(), completedAt.getUTCMonth(), completedAt.getUTCDate()));
                const isCompletedToday = completedDateUTC.getTime() === todayUTC.getTime();
                return {
                    ...task,
                    status: isCompletedToday ? "COMPLETED" : "PENDING",
                    completedAt: userTask.completedAt,
                    userTasks: undefined,
                };
            }
            return {
                ...task,
                status: "PENDING",
                completedAt: null,
                userTasks: undefined,
            };
        }
        return {
            ...task,
            status: userTask.status || "PENDING",
            completedAt: userTask.completedAt || null,
            userTasks: undefined,
        };
    });
}
async function completeTask(userId, taskId) {
    return db_1.db.$transaction(async (tx) => {
        const userCheck = await tx.user.findUnique({
            where: { id: userId },
            select: { isBanned: true },
        });
        if (userCheck?.isBanned) {
            throw new Error("Account is banned. Cannot complete tasks.");
        }
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
            select: { id: true, completedAt: true },
        });
        const now = new Date();
        if (existing) {
            if (task.type === "DAILY") {
                const last = existing.completedAt
                    ? new Date(existing.completedAt)
                    : null;
                if (last) {
                    const sameUTCDate = last.getUTCFullYear() === now.getUTCFullYear() &&
                        last.getUTCMonth() === now.getUTCMonth() &&
                        last.getUTCDate() === now.getUTCDate();
                    if (sameUTCDate) {
                        throw new Error("Task already completed for today");
                    }
                }
                await tx.userTask.update({
                    where: { id: existing.id },
                    data: { completedAt: now, status: "COMPLETED" },
                });
            }
            else {
                throw new Error("Task already completed");
            }
        }
        else {
            await tx.userTask.create({
                data: {
                    userId,
                    taskId,
                    status: "COMPLETED",
                },
            });
        }
        const updatedUser = await tx.user.update({
            where: { id: userId },
            data: {
                pxpBalance: { increment: task.points },
                tasksCompletedCount: { increment: 1 },
            },
            select: { id: true, pxpBalance: true, tasksCompletedCount: true, referredById: true, referralRewarded: true, newUserBonusGranted: true },
        });
        await updateDailyStreak(userId, tx);
        const REFERRAL_TASK_THRESHOLD = 3;
        const REFERRER_BONUS = 150;
        if (updatedUser.tasksCompletedCount >= REFERRAL_TASK_THRESHOLD &&
            updatedUser.referredById &&
            updatedUser.newUserBonusGranted) {
            const referralCheck = await tx.user.findUnique({
                where: { id: userId },
                select: { referrerBonusGranted: true, referralRewarded: true },
            });
            if (referralCheck && !referralCheck.referrerBonusGranted && !referralCheck.referralRewarded) {
                await tx.user.update({
                    where: { id: updatedUser.referredById },
                    data: { pxpBalance: { increment: REFERRER_BONUS } },
                });
                await tx.user.update({
                    where: { id: userId },
                    data: { referrerBonusGranted: true },
                });
                if (redis_1.redisClient) {
                    try {
                        const referrer = await tx.user.findUnique({
                            where: { id: updatedUser.referredById },
                            select: { pxpBalance: true },
                        });
                        if (referrer) {
                            await redis_1.redisClient.zAdd("waitlist:leaderboard", {
                                score: referrer.pxpBalance,
                                value: updatedUser.referredById,
                            });
                        }
                    }
                    catch (e) {
                        console.warn("[WAITLIST] Failed to update referrer Redis score:", e);
                    }
                }
                try {
                    await tx.notification.create({
                        data: {
                            userId: updatedUser.referredById,
                            type: "REFERRAL_REWARD_CREDITED",
                            title: "Referral Reward Unlocked!",
                            message: `Your referral has completed ${REFERRAL_TASK_THRESHOLD} tasks. You've earned +${REFERRER_BONUS} PXP!`,
                            metadata: { referredUserId: userId, amount: REFERRER_BONUS },
                        },
                    });
                }
                catch (notifErr) {
                    console.warn("[WAITLIST] Referral reward notification failed (non-fatal):", notifErr?.message);
                }
            }
        }
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
async function markNotificationsAsRead(userId) {
    try {
        return await db_1.db.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true },
        });
    }
    catch (err) {
        console.error("[WAITLIST] Database error in markNotificationsAsRead:", err?.message);
        throw new Error("Failed to update notifications");
    }
}
async function getUserStats(userId) {
    const user = await db_1.db.user.findFirst({
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
            notifications: {
                take: 5,
                orderBy: { createdAt: "desc" },
                select: { id: true, title: true, message: true, type: true, createdAt: true, isRead: true }
            },
            referrals: {
                select: { id: true, referrerBonusGranted: true, referralRewarded: true, isBanned: true }
            }
        },
    });
    if (!user)
        throw new Error("User not found");
    const userData = user;
    const totalReferralsCount = userData._count.referrals;
    const earnedReferralsCount = userData.referrals.filter((r) => r.referrerBonusGranted || r.referralRewarded).length;
    const pendingReferralsCount = userData.referrals.filter((r) => !r.referrerBonusGranted && !r.referralRewarded && !r.isBanned).length;
    const rank = await db_1.db.user.count({
        where: {
            pxpBalance: { gt: user.pxpBalance },
            isBanned: false,
            accountStatus: { not: "BANNED" }
        },
    });
    return {
        ...user,
        notifications: userData.notifications,
        referrals: undefined,
        referralCount: totalReferralsCount,
        earnedReferralsCount,
        pendingReferralsCount,
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
        select: { lastBonusClaim: true, pxpBalance: true, isBanned: true },
    });
    if (!user)
        throw new Error("User not found");
    if (user.isBanned) {
        throw new Error("Account is banned. Cannot claim rewards.");
    }
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
            lastBonusClaim: now,
        },
        select: { id: true, pxpBalance: true },
    });
    await updateDailyStreak(userId);
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
        console.warn("Failed to update Redis leaderboard after bonus claim:", e);
    }
    return {
        success: true,
        message: `Claimed ${bonusPoints} PXP!`,
        newBalance: updatedUser.pxpBalance,
    };
}
//# sourceMappingURL=service.js.map