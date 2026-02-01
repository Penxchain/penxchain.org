"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncLeaderboard = syncLeaderboard;
exports.getLeaderboard = getLeaderboard;
const db_1 = require("../../shared/database/db");
const redis_1 = require("../../shared/redis");
const errors_1 = require("../../shared/errors");
async function syncLeaderboard() {
    if (!redis_1.redisClient)
        return;
    const key = "waitlist:leaderboard";
    const count = await redis_1.redisClient.zCard(key);
    if (count > 0)
        return;
    console.log("[LEADERBOARD] Redis key empty, syncing from DB...");
    const BATCH_SIZE = 1000;
    let cursor = "";
    const users = await db_1.db.user.findMany({
        where: { pxpBalance: { gt: 0 }, isBanned: false },
        select: { id: true, pxpBalance: true },
        take: 10000
    });
    if (users.length === 0)
        return;
    const multi = redis_1.redisClient.multi();
    for (const user of users) {
        multi.zAdd(key, { score: user.pxpBalance, value: user.id });
    }
    await multi.exec();
    console.log(`[LEADERBOARD] Synced ${users.length} users to Redis`);
}
async function getLeaderboard(limit = 50) {
    if (redis_1.redisClient) {
        try {
            const key = "waitlist:leaderboard";
            const members = await redis_1.redisClient.zRangeWithScores(key, 0, limit - 1, {
                REV: true,
            });
            if (members.length > 0) {
                const ids = members.map((m) => m.value);
                const users = await db_1.db.user.findMany({
                    where: { id: { in: ids } },
                    select: { id: true, username: true, walletAddress: true, pxpBalance: true },
                });
                const userMap = new Map(users.map((u) => [u.id, u]));
                return members
                    .map((m) => {
                    const user = userMap.get(m.value);
                    if (!user)
                        return null;
                    return {
                        id: m.value,
                        username: user.username,
                        walletAddress: user.walletAddress,
                        pxpBalance: Math.round(Number(m.score)),
                        points: Math.round(Number(m.score)),
                    };
                })
                    .filter((u) => u !== null);
            }
        }
        catch (e) {
            console.warn("[LEADERBOARD] Redis read failed, falling back to DB:", e);
        }
    }
    try {
        const users = await db_1.db.user.findMany({
            where: { isBanned: false },
            select: {
                id: true,
                username: true,
                walletAddress: true,
                pxpBalance: true,
            },
            orderBy: {
                pxpBalance: "desc",
            },
            take: limit,
        });
        return users.map((u) => ({
            ...u,
            points: u.pxpBalance,
        }));
    }
    catch (err) {
        console.error("[LEADERBOARD] Database error in getLeaderboard:", err?.message);
        throw new errors_1.InternalServerError();
    }
}
//# sourceMappingURL=service.js.map