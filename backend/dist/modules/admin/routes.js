"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoutes = adminRoutes;
const controller_1 = require("./controller");
const middleware_1 = require("./middleware");
const zod_1 = __importDefault(require("zod"));
async function adminRoutes(app) {
    const server = app.withTypeProvider();
    server.addHook('preHandler', middleware_1.requireAdmin);
    server.get('/stats', {
        schema: {
            tags: ['Admin'],
            summary: 'Get system stats',
        },
    }, controller_1.getStatsHandler);
    server.get('/users', {
        schema: {
            querystring: zod_1.default.object({
                page: zod_1.default.coerce.number().default(1),
                limit: zod_1.default.coerce.number().default(20),
            }),
            tags: ['Admin'],
            summary: 'List users',
        },
    }, controller_1.getUsersHandler);
    server.post('/users/:id/ban', {
        schema: {
            params: zod_1.default.object({ id: zod_1.default.string() }),
            tags: ['Admin'],
            summary: 'Ban a user',
        },
    }, controller_1.banUserHandler);
}
//# sourceMappingURL=routes.js.map