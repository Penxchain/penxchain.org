"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeaderboardHandler = getLeaderboardHandler;
const service_1 = require("./service");
async function getLeaderboardHandler(request, reply) {
    const limit = request.query.limit || 50;
    const leaderboard = await (0, service_1.getLeaderboard)(limit);
    return reply.send(leaderboard);
}
//# sourceMappingURL=controller.js.map