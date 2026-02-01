"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaderboardRoutes = leaderboardRoutes;
const controller_1 = require("./controller");
const schema_1 = require("./schema");
async function leaderboardRoutes(app) {
    const server = app.withTypeProvider();
    server.get('/', {
        schema: {
            querystring: schema_1.leaderboardQuerySchema,
            tags: ['Leaderboard'],
            summary: 'Get top users',
        },
    }, controller_1.getLeaderboardHandler);
}
//# sourceMappingURL=routes.js.map