"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitlistRoutes = waitlistRoutes;
const controller_1 = require("./controller");
const schema_1 = require("./schema");
async function waitlistRoutes(app) {
    const server = app.withTypeProvider();
    server.get('/tasks', {
        schema: {
            tags: ['Waitlist'],
            summary: 'Get all tasks with user status',
            headers: {}
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
        }
    }, controller_1.getUserStatsHandler);
}
//# sourceMappingURL=routes.js.map