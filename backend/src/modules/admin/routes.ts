import { FastifyInstance } from "fastify";
import {
  getStatsHandler,
  getUsersHandler,
  banUserHandler,
  unbanUserHandler,
  promoteUserHandler,
  demoteUserHandler,
  promoteToSuperAdminHandler,
  createTaskHandler,
  listTasksHandler,
  updateTaskHandler,
  deleteTaskHandler,
  getUnderReviewUsersHandler,
  getPenaltyBatchHandler,
  forceSettleHandler,
  cancelPenaltyHandler,
  extendReviewHandler,
  getDeviceDuplicatesHandler,
  getNoDeviceUsersHandler,
  banDeviceUsersHandler,
  banNoDeviceUsersHandler,
  getBannedUsersHandler,
  getUserPXPHistoryHandler,
  getAuthSecurityOverviewHandler,
  getAuthSecurityEventsHandler,
  runAuthCleanupHandler,
} from "./controller";
import { requireAdmin, requireSuperAdmin } from "./middleware";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

export async function adminRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();

  // Protect all routes with requireAdmin
  server.addHook("preHandler", requireAdmin);

  server.get(
    "/stats",
    {
      schema: {
        tags: ["Admin"],
        summary: "Get system stats",
        querystring: z.object({}).passthrough(),
      },
    },
    getStatsHandler,
  );

  server.get(
    "/auth/overview",
    {
      schema: {
        querystring: z.object({
          hours: z.coerce.number().min(1).max(168).default(24),
        }),
        tags: ["Admin"],
        summary: "Get auth security/session observability metrics",
      },
    },
    getAuthSecurityOverviewHandler,
  );

  server.get(
    "/auth/events",
    {
      schema: {
        querystring: z.object({
          page: z.coerce.number().default(1),
          limit: z.coerce.number().default(20),
          action: z.enum(["signup", "login", "refresh"]).optional(),
          blockedOnly: z.coerce.boolean().optional(),
        }),
        tags: ["Admin"],
        summary: "Get auth risk/security events (paginated)",
      },
    },
    getAuthSecurityEventsHandler,
  );

  server.post(
    "/auth/cleanup",
    {
      schema: {
        tags: ["Admin"],
        summary: "Run refresh-token cleanup immediately",
        querystring: z.object({}).passthrough(),
      },
      preHandler: [requireSuperAdmin],
    },
    runAuthCleanupHandler,
  );

  server.get(
    "/users/banned",
    {
      schema: {
        querystring: z.object({
          page: z.coerce.number().default(1),
          limit: z.coerce.number().default(20),
        }),
        tags: ["Admin"],
        summary: "List banned users",
      },
    },
    getBannedUsersHandler,
  );

  server.get(
    "/users",
    {
      schema: {
        querystring: z.object({
          page: z.coerce.number().default(1),
          limit: z.coerce.number().default(20),
          search: z.string().optional(),
          sortBy: z.enum(['pxpBalance', 'createdAt', 'dailyStreak']).optional(),
          sortDir: z.enum(['asc', 'desc']).default('desc'),
          status: z.enum(['ACTIVE', 'BANNED', 'UNDER_REVIEW']).optional(),
          inactiveDays: z.coerce.number().optional(),
        }),
        tags: ["Admin"],
        summary: "List users",
      },
    },
    getUsersHandler,
  );

  server.get(
    "/users/:id/history",
    {
      schema: {
        tags: ["Admin"],
        summary: "Get user PXP history",
        params: z.object({
          id: z.string().uuid(),
        }),
      },
    },
    getUserPXPHistoryHandler,
  );

  // Task management for waitlist
  server.get(
    "/waitlist/tasks",
    {
      schema: {
        tags: ["Admin"],
        summary: "List waitlist tasks",
        querystring: z.object({}).passthrough(),
      },
    },
    listTasksHandler,
  );

  server.post(
    "/waitlist/tasks",
    {
      schema: {
        tags: ["Admin"],
        summary: "Create waitlist task",
        querystring: z.object({}).passthrough(),
      },
    },
    createTaskHandler,
  );

  server.put(
    "/waitlist/tasks/:id",
    {
      schema: {
        tags: ["Admin"],
        summary: "Update waitlist task",
        querystring: z.object({}).passthrough(),
      },
      preHandler: [],
    },
    updateTaskHandler,
  );

  server.delete(
    "/waitlist/tasks/:id",
    {
      schema: {
        tags: ["Admin"],
        summary: "Delete waitlist task",
        querystring: z.object({}).passthrough(),
      },
    },
    deleteTaskHandler,
  );

  server.post(
    "/users/:id/ban",
    {
      schema: {
        params: z.object({ id: z.string() }),
        body: z.object({ 
          reason: z.string().min(5, "Ban reason must be at least 5 characters") 
        }),
        tags: ["Admin"],
        summary: "Ban a user (requires reason)",
        querystring: z.object({}).passthrough(),
      },
    },
    banUserHandler,
  );

  server.post(
    "/users/:id/unban",
    {
      schema: {
        params: z.object({ id: z.string() }),
        tags: ["Admin"],
        summary: "Unban a user",
        querystring: z.object({}).passthrough(),
      },
    },
    unbanUserHandler,
  );

  server.post(
    "/users/:id/promote",
    {
      schema: {
        params: z.object({ id: z.string() }),
        tags: ["Admin"],
        summary: "Promote a user to Admin (Super Admin Only)",
        querystring: z.object({}).passthrough(),
      },
      preHandler: [requireSuperAdmin],
    },
    promoteUserHandler,
  );

  server.post(
    "/users/:id/promote-super",
    {
      schema: {
        params: z.object({ id: z.string() }),
        tags: ["Admin"],
        summary: "Promote a user to Super Admin (Universal Bypass Only)",
        querystring: z.object({}).passthrough(),
      },
      preHandler: [requireSuperAdmin],
    },
    promoteToSuperAdminHandler,
  );

  server.post(
    "/users/:id/demote",
    {
      schema: {
        params: z.object({ id: z.string() }),
        tags: ["Admin"],
        summary: "Demote an Admin to User (Super Admin Only)",
        querystring: z.object({}).passthrough(),
      },
      preHandler: [requireSuperAdmin],
    },
    demoteUserHandler,
  );

  // ===== PENALTY MANAGEMENT ROUTES =====

  server.get(
    "/penalty/under-review",
    {
      schema: {
        tags: ["Admin"],
        summary: "Get all users under review",
        querystring: z.object({
          page: z.coerce.number().default(1),
          limit: z.coerce.number().default(20),
        }),
      },
      preHandler: [requireAdmin],
    },
    getUnderReviewUsersHandler,
  );

  server.get(
    "/penalty/batch/:id",
    {
      schema: {
        params: z.object({ id: z.string() }),
        tags: ["Admin"],
        summary: "Get penalty batch details",
        querystring: z.object({}).passthrough(),
      },
      preHandler: [requireAdmin],
    },
    getPenaltyBatchHandler,
  );

  server.post(
    "/penalty/batch/:id/settle",
    {
      schema: {
        params: z.object({ id: z.string() }),
        tags: ["Admin"],
        summary: "Force settle a penalty batch",
        querystring: z.object({}).passthrough(),
      },
      preHandler: [requireSuperAdmin],
    },
    forceSettleHandler,
  );

  server.post(
    "/penalty/batch/:id/cancel",
    {
      schema: {
        params: z.object({ id: z.string() }),
        tags: ["Admin"],
        summary: "Cancel a penalty batch",
        querystring: z.object({}).passthrough(),
      },
      preHandler: [requireSuperAdmin],
    },
    cancelPenaltyHandler,
  );

  server.post(
    "/penalty/batch/:id/extend",
    {
      schema: {
        params: z.object({ id: z.string() }),
        body: z.object({ minutes: z.number().min(1).max(1440) }),
        tags: ["Admin"],
        summary: "Extend a penalty review window",
        querystring: z.object({}).passthrough(),
      },
      preHandler: [requireSuperAdmin],
    },
    extendReviewHandler,
  );

  // ===== DEVICE FILTER ROUTES =====

  server.get(
    "/devices/duplicates",
    {
      schema: {
        tags: ["Admin"],
        summary: "Find users sharing the same deviceId",
        querystring: z.object({
          page: z.coerce.number().default(1),
          limit: z.coerce.number().default(20),
        }),
      },
      preHandler: [requireAdmin],
    },
    getDeviceDuplicatesHandler,
  );

  server.get(
    "/devices/missing",
    {
      schema: {
        tags: ["Admin"],
        summary: "Find users without a deviceId",
        querystring: z.object({
          page: z.coerce.number().default(1),
          limit: z.coerce.number().default(20),
        }),
      },
      preHandler: [requireAdmin],
    },
    getNoDeviceUsersHandler,
  );

  server.post(
    "/devices/:deviceId/ban",
    {
      schema: {
        tags: ["Admin"],
        summary: "Mass ban users by Device ID",
        params: z.object({
          deviceId: z.string(),
        }),
        body: z.object({
          reason: z.string().optional(),
        }),
      },
      preHandler: [requireAdmin],
    },
    banDeviceUsersHandler,
  );

  server.post(
    "/devices/no-device/ban",
    {
      schema: {
        tags: ["Admin"],
        summary: "Mass ban users without Device ID",
        body: z.object({
          reason: z.string().optional(),
        }),
      },
      preHandler: [requireAdmin],
    },
    banNoDeviceUsersHandler,
  );
}
