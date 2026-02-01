"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeaderboardHandler = getLeaderboardHandler;
const service_1 = require("./service");
async function getLeaderboardHandler(request, reply) {
    try {
        const rawLimit = Number(request.query.limit);
        const limit = Number.isFinite(rawLimit)
            ? Math.min(Math.max(rawLimit, 1), 100)
            : 50;
        const leaderboard = await (0, service_1.getLeaderboard)(limit);
        return reply.code(200).send({
            success: true,
            data: leaderboard,
        });
    }
    catch (error) {
        request.log.error({ err: error }, "Failed to fetch leaderboard");
        return reply.code(500).send({
            success: false,
            message: "Unable to fetch leaderboard at the moment",
        });
    }
}
//# sourceMappingURL=controller.js.map