"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatsHandler = getStatsHandler;
exports.getUsersHandler = getUsersHandler;
exports.banUserHandler = banUserHandler;
exports.unbanUserHandler = unbanUserHandler;
exports.promoteUserHandler = promoteUserHandler;
exports.demoteUserHandler = demoteUserHandler;
exports.promoteToSuperAdminHandler = promoteToSuperAdminHandler;
exports.createTaskHandler = createTaskHandler;
exports.listTasksHandler = listTasksHandler;
exports.updateTaskHandler = updateTaskHandler;
exports.deleteTaskHandler = deleteTaskHandler;
const service_1 = require("./service");
const zod_1 = __importDefault(require("zod"));
async function getStatsHandler(request, reply) {
    const stats = await (0, service_1.getSystemStats)();
    return reply.send(stats);
}
const querySchema = zod_1.default.object({
    page: zod_1.default.coerce.number().default(1),
    limit: zod_1.default.coerce.number().default(20),
});
async function getUsersHandler(request, reply) {
    const { page, limit } = request.query;
    const data = await (0, service_1.getAllUsers)(page, limit);
    return reply.send(data);
}
async function banUserHandler(request, reply) {
    const { id } = request.params;
    const user = request.user;
    const updated = await (0, service_1.banUser)(id, user.role);
    return reply.send({ success: true, user: updated });
}
async function unbanUserHandler(request, reply) {
    const { id } = request.params;
    const updated = await (0, service_1.unbanUser)(id);
    return reply.send({ success: true, user: updated });
}
async function promoteUserHandler(request, reply) {
    const { id } = request.params;
    const updated = await (0, service_1.promoteToAdmin)(id);
    return reply.send({ success: true, user: updated });
}
async function demoteUserHandler(request, reply) {
    const { id } = request.params;
    const updated = await (0, service_1.demoteFromAdmin)(id);
    return reply.send({ success: true, user: updated });
}
async function promoteToSuperAdminHandler(request, reply) {
    const { id } = request.params;
    const updated = await (0, service_1.promoteToSuperAdmin)(id);
    return reply.send({ success: true, user: updated });
}
const schema_1 = require("./schema");
async function createTaskHandler(request, reply) {
    const payload = schema_1.createTaskSchema.parse(request.body);
    const created = await (0, service_1.createTask)(payload);
    return reply.send({ success: true, task: created });
}
async function listTasksHandler(request, reply) {
    const tasks = await (0, service_1.listTasks)();
    return reply.send({ tasks });
}
async function updateTaskHandler(request, reply) {
    const { id } = request.params;
    const payload = schema_1.updateTaskSchema.parse(request.body);
    const updated = await (0, service_1.updateTask)(id, payload);
    return reply.send({ success: true, task: updated });
}
async function deleteTaskHandler(request, reply) {
    const { id } = request.params;
    await (0, service_1.deleteTask)(id);
    return reply.send({ success: true });
}
//# sourceMappingURL=controller.js.map