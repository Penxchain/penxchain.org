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
    "/users",
    {
      schema: {
        querystring: z.object({
          page: z.coerce.number().default(1),
          limit: z.coerce.number().default(20),
          search: z.string().optional(),
        }),
        tags: ["Admin"],
        summary: "List users",
      },
    },
    getUsersHandler,
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
}
