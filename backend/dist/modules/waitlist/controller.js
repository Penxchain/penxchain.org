"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTasksHandler = getTasksHandler;
exports.completeTaskHandler = completeTaskHandler;
exports.getUserStatsHandler = getUserStatsHandler;
const service_1 = require("./service");
const getUserId = (req) => {
    const userId = req.headers['x-user-id'];
    if (!userId)
        throw new Error('Unauthorized');
    return userId;
};
async function getTasksHandler(request, reply) {
    const userId = getUserId(request);
    const tasks = await (0, service_1.getTasksWithUserStatus)(userId);
    return reply.send(tasks);
}
async function completeTaskHandler(request, reply) {
    const userId = getUserId(request);
    try {
        const result = await (0, service_1.completeTask)(userId, request.body.taskId);
        return reply.send(result);
    }
    catch (error) {
        if (error.message === 'Task already completed') {
            return reply.status(409).send({ message: error.message });
        }
        if (error.message === 'Task not found') {
            return reply.status(404).send({ message: error.message });
        }
        throw error;
    }
}
async function getUserStatsHandler(request, reply) {
    const userId = getUserId(request);
    const stats = await (0, service_1.getUserStats)(userId);
    return reply.send(stats);
}
//# sourceMappingURL=controller.js.map