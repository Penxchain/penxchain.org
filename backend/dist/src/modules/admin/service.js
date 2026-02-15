"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSystemStats = getSystemStats;
exports.getAllUsers = getAllUsers;
exports.banUser = banUser;
exports.unbanUser = unbanUser;
exports.promoteToAdmin = promoteToAdmin;
exports.demoteFromAdmin = demoteFromAdmin;
exports.promoteToSuperAdmin = promoteToSuperAdmin;
exports.banUsersByDeviceId = banUsersByDeviceId;
exports.banUsersWithNoDevice = banUsersWithNoDevice;
exports.createTask = createTask;
exports.listTasks = listTasks;
exports.updateTask = updateTask;
exports.deleteTask = deleteTask;
exports.cleanupExpiredTasks = cleanupExpiredTasks;
exports.getUserPXPHistory = getUserPXPHistory;
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
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const usersLastWeek = await db_1.db.user.count({
            where: { createdAt: { lt: sevenDaysAgo } }
        });
        let growthPercent = 0;
        if (usersLastWeek > 0) {
            growthPercent = ((totalUsers - usersLastWeek) / usersLastWeek) * 100;
        }
        else if (totalUsers > 0) {
            growthPercent = 100;
        }
        return {
            totalUsers,
            totalPoints: totalPoints._sum.pxpBalance || 0,
            growthPercent: Math.round(growthPercent),
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
async function getAllUsers(page = 1, limit = 20, search, sortBy, sortDir = 'desc', status, inactiveDays) {
    try {
        const skip = (page - 1) * limit;
        const whereClause = {};
        if (search && search.trim().length > 0) {
            const term = search.trim();
            whereClause.OR = [
                { email: { contains: term, mode: "insensitive" } },
                { username: { contains: term, mode: "insensitive" } },
                { id: { contains: term, mode: "insensitive" } },
            ];
        }
        if (status) {
            whereClause.accountStatus = status;
        }
        if (inactiveDays && inactiveDays > 0) {
            const cutoff = new Date();
            cutoff.setDate(cutoff.getDate() - inactiveDays);
            whereClause.createdAt = { lt: cutoff };
            whereClause.tasksCompletedCount = 0;
        }
        let orderBy = [];
        if (sortBy) {
            orderBy.push({ [sortBy]: sortDir });
        }
        else {
            orderBy = [
                { role: "asc" },
                { createdAt: "desc" }
            ];
        }
        const users = await db_1.db.user.findMany({
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
        const total = await db_1.db.user.count({ where: whereClause });
        return { users, total, pages: Math.ceil(total / limit) };
    }
    catch (err) {
        console.error("[ADMIN] Database error in getAllUsers:", err?.message);
        throw new errors_1.InternalServerError();
    }
}
async function banUser(userId, actorRole, reason, adminId) {
    try {
        if (!reason || reason.trim().length < 5) {
            throw new errors_1.ForbiddenError("Ban reason must be at least 5 characters");
        }
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
        const bannedUser = await db_1.db.user.update({
            where: { id: userId },
            data: {
                isBanned: true,
                pxpBalance: 0,
                banReason: reason.trim(),
                bannedAt: new Date(),
                accountStatus: "BANNED",
            },
        });
        try {
            const { triggerReferralPenalty } = await Promise.resolve().then(() => __importStar(require("./penalty.service")));
            await triggerReferralPenalty(userId, reason.trim(), adminId);
        }
        catch (penaltyErr) {
            console.error("[ADMIN] Penalty cascade failed (non-fatal):", penaltyErr?.message);
        }
        try {
            await db_1.db.adminAuditLog.create({
                data: {
                    adminId,
                    action: "USER_BANNED",
                    targetId: userId,
                    targetType: "User",
                    details: { reason: reason.trim(), targetRole: target.role },
                },
            });
        }
        catch (auditErr) {
            console.warn("[ADMIN] Audit log failed (non-fatal):", auditErr?.message);
        }
        return bannedUser;
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
            data: {
                isBanned: false,
                banReason: null,
                bannedAt: null,
                accountStatus: "ACTIVE",
            },
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
async function promoteToAdmin(userId, actorRole) {
    try {
        const target = await db_1.db.user.findUnique({ where: { id: userId }, select: { role: true } });
        if (!target)
            throw new errors_1.NotFoundError("User not found");
        if (target.role !== "USER") {
            throw new errors_1.ForbiddenError(`Only users with role 'USER' can be promoted to ADMIN. Target is currently ${target.role}`);
        }
        return await db_1.db.user.update({
            where: { id: userId },
            data: { role: "ADMIN" },
        });
    }
    catch (err) {
        console.error("[ADMIN] Database error in promoteToAdmin:", err?.message);
        if (err instanceof errors_1.NotFoundError || err instanceof errors_1.ForbiddenError)
            throw err;
        throw new errors_1.InternalServerError();
    }
}
async function demoteFromAdmin(userId, actorId, actorRole) {
    try {
        const target = await db_1.db.user.findUnique({ where: { id: userId }, select: { role: true } });
        if (!target)
            throw new errors_1.NotFoundError("User not found");
        if (userId === actorId) {
            throw new errors_1.ForbiddenError("You cannot demote yourself");
        }
        if (target.role === "SUPERADMIN") {
            throw new errors_1.ForbiddenError("Superadmins cannot be demoted. They must be manually adjusted in the database for safety.");
        }
        if (target.role === "ADMIN" && actorRole !== "SUPERADMIN") {
            throw new errors_1.ForbiddenError("Admins cannot demote other Admins");
        }
        if (target.role === "USER") {
            throw new errors_1.ForbiddenError("User is already at the lowest role level");
        }
        return await db_1.db.user.update({
            where: { id: userId },
            data: { role: "USER" },
        });
    }
    catch (err) {
        console.error("[ADMIN] Database error in demoteFromAdmin:", err?.message);
        if (err instanceof errors_1.NotFoundError || err instanceof errors_1.ForbiddenError)
            throw err;
        throw new errors_1.InternalServerError();
    }
}
async function promoteToSuperAdmin(userId, actorRole) {
    try {
        const target = await db_1.db.user.findUnique({ where: { id: userId }, select: { role: true } });
        if (!target)
            throw new errors_1.NotFoundError("User not found");
        if (target.role !== "ADMIN") {
            throw new errors_1.ForbiddenError("Only users with role 'ADMIN' can be promoted to SUPERADMIN");
        }
        return await db_1.db.user.update({
            where: { id: userId },
            data: { role: "SUPERADMIN" },
        });
    }
    catch (err) {
        console.error("[ADMIN] Database error in promoteToSuperAdmin:", err?.message);
        if (err instanceof errors_1.NotFoundError || err instanceof errors_1.ForbiddenError)
            throw err;
        throw new errors_1.InternalServerError();
    }
}
async function banUsersByDeviceId(deviceId, reason, adminId) {
    try {
        const users = await db_1.db.user.findMany({
            where: { deviceId, isBanned: false },
            orderBy: { createdAt: 'asc' },
            select: { id: true, username: true, role: true }
        });
        if (users.length <= 1) {
            return { count: 0, message: "No duplicates to ban for this device. Only one (or zero) active user exists." };
        }
        const original = users[0];
        const duplicates = users.slice(1);
        let bannedCount = 0;
        const bannedUsernames = [];
        for (const target of duplicates) {
            try {
                await banUser(target.id, "SUPERADMIN", reason, adminId);
                bannedCount++;
                bannedUsernames.push(target.username || target.id);
            }
            catch (err) {
                console.warn(`[ADMIN] Failed to ban duplicate user ${target.id} on device ${deviceId}:`, err?.message);
            }
        }
        return {
            count: bannedCount,
            targets: bannedUsernames,
            message: `Banned ${bannedCount} duplicate(s). Sared original user: ${original.username || original.id}.`
        };
    }
    catch (err) {
        console.error("[ADMIN] Database error in banUsersByDeviceId:", err?.message);
        throw new errors_1.InternalServerError();
    }
}
async function banUsersWithNoDevice(reason, adminId) {
    try {
        const targets = await db_1.db.user.findMany({
            where: { deviceId: null, isBanned: false },
            select: { id: true, username: true, role: true }
        });
        if (targets.length === 0) {
            return { count: 0, message: "No active users found with missing device ID." };
        }
        let bannedCount = 0;
        const bannedUsernames = [];
        for (const target of targets) {
            if (target.role === "SUPERADMIN")
                continue;
            try {
                await banUser(target.id, "SUPERADMIN", reason, adminId);
                bannedCount++;
                bannedUsernames.push(target.username || target.id);
            }
            catch (err) {
                console.warn(`[ADMIN] Failed to ban no-device user ${target.id}:`, err?.message);
            }
        }
        return {
            count: bannedCount,
            targets: bannedUsernames,
            message: `Mass ban complete. ${bannedCount} accounts removed.`
        };
    }
    catch (err) {
        console.error("[ADMIN] Database error in banUsersWithNoDevice:", err?.message);
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
        const expiredIds = expiredTasks.map((t) => t.id);
        await db_1.db.$transaction(async (tx) => {
            await tx.userTask.deleteMany({
                where: { taskId: { in: expiredIds } },
            });
            await tx.task.deleteMany({
                where: { id: { in: expiredIds } },
            });
        });
        console.log(`[ADMIN] Cleaned up ${expiredTasks.length} expired tasks`);
        return { deleted: expiredTasks.length, tasks: expiredTasks };
    }
    catch (err) {
        console.error("[ADMIN] Error cleaning up expired tasks:", err?.message);
        throw new errors_1.InternalServerError();
    }
}
async function getUserPXPHistory(userId) {
    try {
        const history = [];
        const userTasks = await db_1.db.userTask.findMany({
            where: { userId },
            include: { task: true },
        });
        userTasks.forEach(ut => {
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
        const referrals = await db_1.db.user.findMany({
            where: { referredById: userId, referrerBonusGranted: true },
            select: { id: true, username: true, createdAt: true }
        });
        referrals.forEach(ref => {
            history.push({
                id: `ref-${ref.id}`,
                type: "REFERRAL",
                amount: 150,
                description: `Referral Bonus: ${ref.username}`,
                timestamp: ref.createdAt
            });
        });
        const user = await db_1.db.user.findUnique({
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
        const penalties = await db_1.db.referralPenaltyEvent.findMany({
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
    }
    catch (err) {
        console.error("[ADMIN] Database error in getUserPXPHistory:", err?.message);
        throw new errors_1.InternalServerError();
    }
}
//# sourceMappingURL=service.js.map