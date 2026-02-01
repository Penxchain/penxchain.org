"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeaderboard = getLeaderboard;
const db_1 = require("../../shared/database/db");
async function getLeaderboard(limit = 50) {
    return db_1.db.user.findMany({
        select: {
            id: true,
            username: true,
            walletAddress: true,
            pxpBalance: true,
        },
        orderBy: {
            pxpBalance: 'desc',
        },
        take: limit,
    });
}
//# sourceMappingURL=service.js.map