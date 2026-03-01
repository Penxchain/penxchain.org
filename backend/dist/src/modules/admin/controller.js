"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatsHandler = getStatsHandler;
exports.getAuthSecurityOverviewHandler = getAuthSecurityOverviewHandler;
exports.getAuthSecurityEventsHandler = getAuthSecurityEventsHandler;
exports.runAuthCleanupHandler = runAuthCleanupHandler;
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
exports.getUnderReviewUsersHandler = getUnderReviewUsersHandler;
exports.getPenaltyBatchHandler = getPenaltyBatchHandler;
exports.forceSettleHandler = forceSettleHandler;
exports.cancelPenaltyHandler = cancelPenaltyHandler;
exports.extendReviewHandler = extendReviewHandler;
exports.getDeviceDuplicatesHandler = getDeviceDuplicatesHandler;
exports.getNoDeviceUsersHandler = getNoDeviceUsersHandler;
exports.getBannedUsersHandler = getBannedUsersHandler;
exports.banDeviceUsersHandler = banDeviceUsersHandler;
exports.banNoDeviceUsersHandler = banNoDeviceUsersHandler;
exports.getUserPXPHistoryHandler = getUserPXPHistoryHandler;
const service_1 = require("./service");
const zod_1 = __importDefault(require("zod"));
const cleanup_1 = require("../auth/cleanup");
async function getStatsHandler(request, reply) {
    const stats = await (0, service_1.getSystemStats)();
    return reply.send(stats);
}
async function getAuthSecurityOverviewHandler(request, reply) {
    const hours = Number(request.query?.hours) || 24;
    const data = await (0, service_1.getAuthSecurityOverview)(hours);
    return reply.send({ success: true, ...data });
}
async function getAuthSecurityEventsHandler(request, reply) {
    const page = Number(request.query?.page) || 1;
    const limit = Number(request.query?.limit) || 20;
    const action = request.query?.action;
    const blockedOnly = request.query?.blockedOnly === true || request.query?.blockedOnly === "true";
    const data = await (0, service_1.getAuthSecurityEvents)({
        page,
        limit,
        action,
        blockedOnly,
    });
    return reply.send({ success: true, ...data });
}
async function runAuthCleanupHandler(request, reply) {
    const result = await (0, cleanup_1.runRefreshTokenCleanupNow)();
    return reply.send({ success: true, ...result });
}
const querySchema = zod_1.default.object({
    page: zod_1.default.coerce.number().default(1),
    limit: zod_1.default.coerce.number().default(20),
    search: zod_1.default.string().optional(),
});
async function getUsersHandler(request, reply) {
    const { page, limit, search, sortBy, sortDir, status, inactiveDays } = request.query;
    const data = await (0, service_1.getAllUsers)(page, limit, search, sortBy, sortDir, status, inactiveDays);
    return reply.send(data);
}
async function banUserHandler(request, reply) {
    const { id } = request.params;
    const { reason } = request.body || {};
    const user = request.user;
    const updated = await (0, service_1.banUser)(id, user.role, reason, user.id);
    return reply.send({ success: true, user: updated });
}
async function unbanUserHandler(request, reply) {
    const { id } = request.params;
    const updated = await (0, service_1.unbanUser)(id);
    return reply.send({ success: true, user: updated });
}
async function promoteUserHandler(request, reply) {
    const { id } = request.params;
    const actor = request.user;
    const updated = await (0, service_1.promoteToAdmin)(id, actor.role);
    return reply.send({ success: true, user: updated });
}
async function demoteUserHandler(request, reply) {
    const { id } = request.params;
    const actor = request.user;
    const updated = await (0, service_1.demoteFromAdmin)(id, actor.id, actor.role);
    return reply.send({ success: true, user: updated });
}
async function promoteToSuperAdminHandler(request, reply) {
    const { id } = request.params;
    const actor = request.user;
    const updated = await (0, service_1.promoteToSuperAdmin)(id, actor.role);
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
const penalty_service_1 = require("./penalty.service");
async function getUnderReviewUsersHandler(request, reply) {
    const page = Number(request.query?.page) || 1;
    const limit = Number(request.query?.limit) || 20;
    const data = await (0, penalty_service_1.getUnderReviewUsers)(page, limit);
    return reply.send({ success: true, ...data });
}
async function getPenaltyBatchHandler(request, reply) {
    const { id } = request.params;
    const batch = await (0, penalty_service_1.getPenaltyBatchDetails)(id);
    if (!batch)
        return reply.status(404).send({ success: false, error: "Batch not found" });
    return reply.send({ success: true, batch });
}
async function forceSettleHandler(request, reply) {
    const { id } = request.params;
    const adminUser = request.user;
    const result = await (0, penalty_service_1.forceSettle)(id, adminUser.id);
    return reply.send({ success: result.settled, error: result.error });
}
async function cancelPenaltyHandler(request, reply) {
    const { id } = request.params;
    const adminUser = request.user;
    const result = await (0, penalty_service_1.cancelPenaltyBatch)(id, adminUser.id);
    return reply.send({ success: result.cancelled, error: result.error });
}
async function extendReviewHandler(request, reply) {
    const { id } = request.params;
    const { minutes } = request.body || {};
    const adminUser = request.user;
    if (!minutes || minutes < 1 || minutes > 1440) {
        return reply.status(400).send({ success: false, error: "Minutes must be 1-1440" });
    }
    const result = await (0, penalty_service_1.extendReview)(id, minutes, adminUser.id);
    return reply.send({ success: result.extended, newEndsAt: result.newEndsAt, error: result.error });
}
const db_1 = require("../../shared/database/db");
async function getDeviceDuplicatesHandler(request, reply) {
    const page = Number(request.query?.page) || 1;
    const limit = Number(request.query?.limit) || 20;
    const skip = (page - 1) * limit;
    const totalCountResult = await db_1.db.$queryRaw `
    SELECT COUNT(*)::int as total
    FROM (
      SELECT "deviceId"
      FROM "User"
      WHERE "deviceId" IS NOT NULL
      GROUP BY "deviceId"
      HAVING COUNT(*) > 1
    ) as subquery
  `;
    const total = totalCountResult[0]?.total || 0;
    const results = await db_1.db.$queryRaw `
    SELECT "deviceId", COUNT(*)::int as count, 
           ARRAY_AGG("id" ORDER BY "createdAt" ASC) as user_ids,
           ARRAY_AGG("username" ORDER BY "createdAt" ASC) as usernames,
           ARRAY_AGG("email" ORDER BY "createdAt" ASC) as emails,
           ARRAY_AGG("createdAt" ORDER BY "createdAt" ASC) as created_ats
    FROM "User" 
    WHERE "deviceId" IS NOT NULL
    GROUP BY "deviceId" 
    HAVING COUNT(*) > 1
    ORDER BY COUNT(*) DESC
    LIMIT ${limit} OFFSET ${skip}
  `;
    return reply.send({ success: true, duplicates: results, total });
}
async function getNoDeviceUsersHandler(request, reply) {
    const page = Number(request.query?.page) || 1;
    const limit = Number(request.query?.limit) || 20;
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
        db_1.db.user.findMany({
            where: { deviceId: null },
            select: {
                id: true,
                username: true,
                email: true,
                pxpBalance: true,
                createdAt: true,
                isBanned: true,
                accountStatus: true,
            },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        }),
        db_1.db.user.count({ where: { deviceId: null } })
    ]);
    return reply.send({ success: true, users, total });
}
async function getBannedUsersHandler(request, reply) {
    const { page = 1, limit = 20 } = request.query || {};
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
        db_1.db.user.findMany({
            where: { isBanned: true },
            select: {
                id: true,
                username: true,
                email: true,
                pxpBalance: true,
                isBanned: true,
                banReason: true,
                bannedAt: true,
                createdAt: true,
                accountStatus: true,
            },
            orderBy: { bannedAt: "desc" },
            skip,
            take: limit,
        }),
        db_1.db.user.count({ where: { isBanned: true } })
    ]);
    return reply.send({ success: true, users, total });
}
async function banDeviceUsersHandler(request, reply) {
    const { deviceId } = request.params;
    const { reason = "Mass ban via Device ID" } = request.body || {};
    const adminUser = request.user;
    const result = await (0, service_1.banUsersByDeviceId)(deviceId, reason, adminUser.id);
    return reply.send({ success: true, count: result.count, targets: result.targets, message: result.message });
}
async function banNoDeviceUsersHandler(request, reply) {
    const { reason = "Mass ban: Missing device fingerprint" } = request.body || {};
    const adminUser = request.user;
    const result = await (0, service_1.banUsersWithNoDevice)(reason, adminUser.id);
    return reply.send({ success: true, count: result.count, targets: result.targets, message: result.message });
}
async function getUserPXPHistoryHandler(request, reply) {
    const { id } = request.params;
    const history = await (0, service_1.getUserPXPHistory)(id);
    return reply.send({ success: true, history });
}
//# sourceMappingURL=controller.js.map