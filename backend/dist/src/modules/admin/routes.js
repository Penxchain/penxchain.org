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
    server.addHook("preHandler", middleware_1.requireAdmin);
    server.get("/stats", {
        schema: {
            tags: ["Admin"],
            summary: "Get system stats",
            querystring: zod_1.default.object({}).passthrough(),
        },
    }, controller_1.getStatsHandler);
    server.get("/users/banned", {
        schema: {
            querystring: zod_1.default.object({
                page: zod_1.default.coerce.number().default(1),
                limit: zod_1.default.coerce.number().default(20),
            }),
            tags: ["Admin"],
            summary: "List banned users",
        },
    }, controller_1.getBannedUsersHandler);
    server.get("/users", {
        schema: {
            querystring: zod_1.default.object({
                page: zod_1.default.coerce.number().default(1),
                limit: zod_1.default.coerce.number().default(20),
                search: zod_1.default.string().optional(),
                sortBy: zod_1.default.enum(['pxpBalance', 'createdAt', 'dailyStreak']).optional(),
                sortDir: zod_1.default.enum(['asc', 'desc']).default('desc'),
                status: zod_1.default.enum(['ACTIVE', 'BANNED', 'UNDER_REVIEW']).optional(),
                inactiveDays: zod_1.default.coerce.number().optional(),
            }),
            tags: ["Admin"],
            summary: "List users",
        },
    }, controller_1.getUsersHandler);
    server.get("/users/:id/history", {
        schema: {
            tags: ["Admin"],
            summary: "Get user PXP history",
            params: zod_1.default.object({
                id: zod_1.default.string().uuid(),
            }),
        },
    }, controller_1.getUserPXPHistoryHandler);
    server.get("/waitlist/tasks", {
        schema: {
            tags: ["Admin"],
            summary: "List waitlist tasks",
            querystring: zod_1.default.object({}).passthrough(),
        },
    }, controller_1.listTasksHandler);
    server.post("/waitlist/tasks", {
        schema: {
            tags: ["Admin"],
            summary: "Create waitlist task",
            querystring: zod_1.default.object({}).passthrough(),
        },
    }, controller_1.createTaskHandler);
    server.put("/waitlist/tasks/:id", {
        schema: {
            tags: ["Admin"],
            summary: "Update waitlist task",
            querystring: zod_1.default.object({}).passthrough(),
        },
        preHandler: [],
    }, controller_1.updateTaskHandler);
    server.delete("/waitlist/tasks/:id", {
        schema: {
            tags: ["Admin"],
            summary: "Delete waitlist task",
            querystring: zod_1.default.object({}).passthrough(),
        },
    }, controller_1.deleteTaskHandler);
    server.post("/users/:id/ban", {
        schema: {
            params: zod_1.default.object({ id: zod_1.default.string() }),
            body: zod_1.default.object({
                reason: zod_1.default.string().min(5, "Ban reason must be at least 5 characters")
            }),
            tags: ["Admin"],
            summary: "Ban a user (requires reason)",
            querystring: zod_1.default.object({}).passthrough(),
        },
    }, controller_1.banUserHandler);
    server.post("/users/:id/unban", {
        schema: {
            params: zod_1.default.object({ id: zod_1.default.string() }),
            tags: ["Admin"],
            summary: "Unban a user",
            querystring: zod_1.default.object({}).passthrough(),
        },
    }, controller_1.unbanUserHandler);
    server.post("/users/:id/promote", {
        schema: {
            params: zod_1.default.object({ id: zod_1.default.string() }),
            tags: ["Admin"],
            summary: "Promote a user to Admin (Super Admin Only)",
            querystring: zod_1.default.object({}).passthrough(),
        },
        preHandler: [middleware_1.requireSuperAdmin],
    }, controller_1.promoteUserHandler);
    server.post("/users/:id/promote-super", {
        schema: {
            params: zod_1.default.object({ id: zod_1.default.string() }),
            tags: ["Admin"],
            summary: "Promote a user to Super Admin (Universal Bypass Only)",
            querystring: zod_1.default.object({}).passthrough(),
        },
        preHandler: [middleware_1.requireSuperAdmin],
    }, controller_1.promoteToSuperAdminHandler);
    server.post("/users/:id/demote", {
        schema: {
            params: zod_1.default.object({ id: zod_1.default.string() }),
            tags: ["Admin"],
            summary: "Demote an Admin to User (Super Admin Only)",
            querystring: zod_1.default.object({}).passthrough(),
        },
        preHandler: [middleware_1.requireSuperAdmin],
    }, controller_1.demoteUserHandler);
    server.get("/penalty/under-review", {
        schema: {
            tags: ["Admin"],
            summary: "Get all users under review",
            querystring: zod_1.default.object({}).passthrough(),
        },
        preHandler: [middleware_1.requireAdmin],
    }, controller_1.getUnderReviewUsersHandler);
    server.get("/penalty/batch/:id", {
        schema: {
            params: zod_1.default.object({ id: zod_1.default.string() }),
            tags: ["Admin"],
            summary: "Get penalty batch details",
            querystring: zod_1.default.object({}).passthrough(),
        },
        preHandler: [middleware_1.requireAdmin],
    }, controller_1.getPenaltyBatchHandler);
    server.post("/penalty/batch/:id/settle", {
        schema: {
            params: zod_1.default.object({ id: zod_1.default.string() }),
            tags: ["Admin"],
            summary: "Force settle a penalty batch",
            querystring: zod_1.default.object({}).passthrough(),
        },
        preHandler: [middleware_1.requireSuperAdmin],
    }, controller_1.forceSettleHandler);
    server.post("/penalty/batch/:id/cancel", {
        schema: {
            params: zod_1.default.object({ id: zod_1.default.string() }),
            tags: ["Admin"],
            summary: "Cancel a penalty batch",
            querystring: zod_1.default.object({}).passthrough(),
        },
        preHandler: [middleware_1.requireSuperAdmin],
    }, controller_1.cancelPenaltyHandler);
    server.post("/penalty/batch/:id/extend", {
        schema: {
            params: zod_1.default.object({ id: zod_1.default.string() }),
            body: zod_1.default.object({ minutes: zod_1.default.number().min(1).max(1440) }),
            tags: ["Admin"],
            summary: "Extend a penalty review window",
            querystring: zod_1.default.object({}).passthrough(),
        },
        preHandler: [middleware_1.requireSuperAdmin],
    }, controller_1.extendReviewHandler);
    server.get("/devices/duplicates", {
        schema: {
            tags: ["Admin"],
            summary: "Find users sharing the same deviceId",
            querystring: zod_1.default.object({}).passthrough(),
        },
        preHandler: [middleware_1.requireAdmin],
    }, controller_1.getDeviceDuplicatesHandler);
    server.get("/devices/missing", {
        schema: {
            tags: ["Admin"],
            summary: "Find users without a deviceId",
            querystring: zod_1.default.object({}).passthrough(),
        },
        preHandler: [middleware_1.requireAdmin],
    }, controller_1.getNoDeviceUsersHandler);
    server.post("/devices/:deviceId/ban", {
        schema: {
            tags: ["Admin"],
            summary: "Mass ban users by Device ID",
            params: zod_1.default.object({
                deviceId: zod_1.default.string(),
            }),
            body: zod_1.default.object({
                reason: zod_1.default.string().optional(),
            }),
        },
        preHandler: [middleware_1.requireAdmin],
    }, controller_1.banDeviceUsersHandler);
    server.post("/devices/no-device/ban", {
        schema: {
            tags: ["Admin"],
            summary: "Mass ban users without Device ID",
            body: zod_1.default.object({
                reason: zod_1.default.string().optional(),
            }),
        },
        preHandler: [middleware_1.requireAdmin],
    }, controller_1.banNoDeviceUsersHandler);
}
//# sourceMappingURL=routes.js.map