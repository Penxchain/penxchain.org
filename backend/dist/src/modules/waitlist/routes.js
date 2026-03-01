"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitlistRoutes = waitlistRoutes;
const zod_1 = __importDefault(require("zod"));
const controller_1 = require("./controller");
const schema_1 = require("./schema");
const middleware_1 = require("../../shared/middleware");
async function waitlistRoutes(app) {
    const server = app.withTypeProvider();
    server.addHook('onRequest', async (request, reply) => {
        try {
            await request.jwtVerify();
            await (0, middleware_1.requireActiveUser)(request, reply);
        }
        catch (err) {
            return reply.send(err);
        }
    });
    server.get('/time', {
        schema: {
            tags: ['Waitlist'],
            summary: 'Get server time and next daily reset',
            querystring: zod_1.default.object({}).passthrough(),
        }
    }, controller_1.getTimeHandler);
    server.get('/tasks', {
        schema: {
            tags: ['Waitlist'],
            summary: 'Get all tasks with user status',
            querystring: zod_1.default.object({}).passthrough(),
        },
    }, controller_1.getTasksHandler);
    server.post('/tasks/complete', {
        schema: {
            body: schema_1.completeTaskSchema,
            tags: ['Waitlist'],
            summary: 'Complete a task',
        },
    }, controller_1.completeTaskHandler);
    server.get('/stats', {
        schema: {
            tags: ['Waitlist'],
            summary: 'Get user stats (points, rank)',
            querystring: zod_1.default.object({}).passthrough(),
        }
    }, controller_1.getUserStatsHandler);
    server.post('/notifications/read', {
        schema: {
            tags: ['Waitlist'],
            summary: 'Mark all notifications as read',
            querystring: zod_1.default.object({}).passthrough(),
        }
    }, controller_1.markNotificationsAsReadHandler);
    server.post('/bonus/claim', {
        schema: {
            body: schema_1.claimBonusSchema,
            tags: ['Waitlist'],
            summary: 'Claim 24h PXP bonus',
        }
    }, controller_1.claimBonusHandler);
}
//# sourceMappingURL=routes.js.map