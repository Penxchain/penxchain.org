"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatsHandler = getStatsHandler;
exports.getUsersHandler = getUsersHandler;
exports.banUserHandler = banUserHandler;
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
    const updated = await (0, service_1.banUser)(id);
    return reply.send({ success: true, user: updated });
}
//# sourceMappingURL=controller.js.map