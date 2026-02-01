"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSystemStats = getSystemStats;
exports.getAllUsers = getAllUsers;
exports.banUser = banUser;
exports.unbanUser = unbanUser;
exports.promoteToAdmin = promoteToAdmin;
exports.demoteFromAdmin = demoteFromAdmin;
exports.promoteToSuperAdmin = promoteToSuperAdmin;
exports.createTask = createTask;
exports.listTasks = listTasks;
exports.updateTask = updateTask;
exports.deleteTask = deleteTask;
exports.cleanupExpiredTasks = cleanupExpiredTasks;
const db_1 = require("../../shared/database/db");
const errors_1 = require("../../shared/errors");
const redis_1 = require("../../shared/redis");
async function getSystemStats() {
    try {
        const totalUsers = await db_1.db.user.count();
        const totalPoints = await db_1.db.user.aggregate({
            _sum: { pxpBalance: true },
        });
        const topReferrers = await db_1.db.user.findMany({
            take: 5,
            orderBy: { referrals: { _count: "desc" } },
            select: { username: true, _count: { select: { referrals: true } } },
        });
        return {
            totalUsers,
            totalPoints: totalPoints._sum.pxpBalance || 0,
            topReferrers: topReferrers.map((u) => ({
                username: u.username,
                count: u._count.referrals,
            })),
        };
    }
    catch (err) {
        console.error("[ADMIN] Database error in getSystemStats:", err?.message);
        throw new errors_1.InternalServerError();
    }
}
async function getAllUsers(page = 1, limit = 20) {
    try {
        const skip = (page - 1) * limit;
        const users = await db_1.db.user.findMany({
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
        const total = await db_1.db.user.count();
        return { users, total, pages: Math.ceil(total / limit) };
    }
    catch (err) {
        console.error("[ADMIN] Database error in getAllUsers:", err?.message);
        throw new errors_1.InternalServerError();
    }
}
async function banUser(userId, actorRole) {
    try {
        const target = await db_1.db.user.findUnique({ where: { id: userId }, select: { role: true } });
        if (!target)
            throw new errors_1.NotFoundError("User not found");
        if (target.role === "SUPERADMIN") {
            throw new errors_1.ForbiddenError("Cannot ban a Super Admin");
        }
        if (target.role === "ADMIN" && actorRole !== "SUPERADMIN") {
            throw new errors_1.ForbiddenError("Admins cannot ban other Admins");
        }
        if (redis_1.redisClient) {
            const key = "waitlist:leaderboard";
            await redis_1.redisClient.zRem(key, userId);
        }
        return await db_1.db.user.update({
            where: { id: userId },
            data: { isBanned: true, pxpBalance: 0 },
        });
    }
    catch (err) {
        console.error("[ADMIN] Database error in banUser:", err?.message);
        if (err instanceof errors_1.NotFoundError || err instanceof errors_1.ForbiddenError)
            throw err;
        throw new errors_1.InternalServerError();
    }
}
async function unbanUser(userId) {
    try {
        return await db_1.db.user.update({
            where: { id: userId },
            data: { isBanned: false },
        });
    }
    catch (err) {
        console.error("[ADMIN] Database error in unbanUser:", err?.message);
        if (err?.code === "P2025") {
            throw new errors_1.NotFoundError("User not found");
        }
        throw new errors_1.InternalServerError();
    }
}
async function promoteToAdmin(userId) {
    try {
        return await db_1.db.user.update({
            where: { id: userId },
            data: { role: "ADMIN" },
        });
    }
    catch (err) {
        console.error("[ADMIN] Database error in promoteToAdmin:", err?.message);
        if (err?.code === "P2025") {
            throw new errors_1.NotFoundError("User not found");
        }
        throw new errors_1.InternalServerError();
    }
}
async function demoteFromAdmin(userId) {
    try {
        return await db_1.db.user.update({
            where: { id: userId },
            data: { role: "USER" },
        });
    }
    catch (err) {
        console.error("[ADMIN] Database error in demoteFromAdmin:", err?.message);
        if (err?.code === "P2025") {
            throw new errors_1.NotFoundError("User not found");
        }
        throw new errors_1.InternalServerError();
    }
}
async function promoteToSuperAdmin(userId) {
    try {
        return await db_1.db.user.update({
            where: { id: userId },
            data: { role: "SUPERADMIN" },
        });
    }
    catch (err) {
        console.error("[ADMIN] Database error in promoteToSuperAdmin:", err?.message);
        if (err?.code === "P2025") {
            throw new errors_1.NotFoundError("User not found");
        }
        throw new errors_1.InternalServerError();
    }
}
async function createTask(data) {
    try {
        let expiresAt;
        if (data.type === "SOCIAL" && data.durationDays && data.durationDays > 0) {
            expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + data.durationDays);
        }
        return await db_1.db.task.create({
            data: {
                ...data,
                expiresAt,
            },
        });
    }
    catch (err) {
        console.error("[ADMIN] Database error in createTask:", err?.message);
        throw new errors_1.InternalServerError();
    }
}
async function listTasks() {
    try {
        return await db_1.db.task.findMany({ orderBy: { createdAt: "desc" } });
    }
    catch (err) {
        console.error("[ADMIN] Database error in listTasks:", err?.message);
        throw new errors_1.InternalServerError();
    }
}
async function updateTask(taskId, data) {
    try {
        return await db_1.db.task.update({ where: { id: taskId }, data });
    }
    catch (err) {
        console.error("[ADMIN] Database error in updateTask:", err?.message);
        if (err?.code === "P2025") {
            throw new errors_1.NotFoundError("Task not found");
        }
        throw new errors_1.InternalServerError();
    }
}
async function deleteTask(taskId) {
    try {
        return await db_1.db.$transaction(async (tx) => {
            await tx.userTask.deleteMany({
                where: { taskId },
            });
            return await tx.task.delete({ where: { id: taskId } });
        });
    }
    catch (err) {
        console.error("[ADMIN] Database error in deleteTask:", err?.message);
        if (err?.code === "P2025") {
            throw new errors_1.NotFoundError("Task not found");
        }
        throw new errors_1.InternalServerError();
    }
}
async function cleanupExpiredTasks() {
    try {
        const now = new Date();
        const expiredTasks = await db_1.db.task.findMany({
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
        const expiredIds = expiredTasks.map(t => t.id);
        await db_1.db.$transaction(async (tx) => {
            await tx.userTask.deleteMany({
                where: { taskId: { in: expiredIds } },
            });
            await tx.task.deleteMany({
                where: { id: { in: expiredIds } },
            });
        });
        console.log(`[ADMIN] Cleaned up ${expiredTasks.length} expired tasks:`, expiredTasks.map(t => t.title));
        return { deleted: expiredTasks.length, tasks: expiredTasks };
    }
    catch (err) {
        console.error("[ADMIN] Error cleaning up expired tasks:", err?.message);
        throw new errors_1.InternalServerError();
    }
}
//# sourceMappingURL=service.js.map