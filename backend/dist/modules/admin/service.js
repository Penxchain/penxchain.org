"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSystemStats = getSystemStats;
exports.getAllUsers = getAllUsers;
exports.banUser = banUser;
const db_1 = require("../../shared/database/db");
async function getSystemStats() {
    const totalUsers = await db_1.db.user.count();
    const totalPoints = await db_1.db.user.aggregate({
        _sum: { pxpBalance: true },
    });
    const topReferrers = await db_1.db.user.findMany({
        take: 5,
        orderBy: { referrals: { _count: 'desc' } },
        select: { username: true, _count: { select: { referrals: true } } }
    });
    return {
        totalUsers,
        totalPoints: totalPoints._sum.pxpBalance || 0,
        topReferrers: topReferrers.map(u => ({ username: u.username, count: u._count.referrals })),
    };
}
async function getAllUsers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const users = await db_1.db.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            email: true,
            username: true,
            role: true,
            pxpBalance: true,
            createdAt: true,
            walletAddress: true,
            isBanned: true,
        }
    });
    const total = await db_1.db.user.count();
    return { users, total, pages: Math.ceil(total / limit) };
}
async function banUser(userId) {
    return db_1.db.user.update({
        where: { id: userId },
        data: { isBanned: true, pxpBalance: 0 }
    });
}
//# sourceMappingURL=service.js.map