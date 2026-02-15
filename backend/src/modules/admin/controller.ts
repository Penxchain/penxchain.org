import { FastifyReply, FastifyRequest } from "fastify";
import {
  getSystemStats,
  getAllUsers,
  banUser,
  unbanUser,
  promoteToAdmin,
  demoteFromAdmin,
  promoteToSuperAdmin,
  createTask,
  listTasks,
  updateTask,
  deleteTask,
  banUsersByDeviceId,
  banUsersWithNoDevice,
  getUserPXPHistory,
} from "./service";
import z from "zod";

export async function getStatsHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const stats = await getSystemStats();
  return reply.send(stats);
}

const querySchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(20),
  search: z.string().optional(),
});

export async function getUsersHandler(
  request: any,
  reply: any,
) {
  const { page, limit, search, sortBy, sortDir, status, inactiveDays } = request.query;
  const data = await getAllUsers(page, limit, search, sortBy, sortDir, status, inactiveDays);
  return reply.send(data);
}

export async function banUserHandler(
  request: any,
  reply: any,
) {
  const { id } = request.params;
  const { reason } = request.body || {};
  const user = request.user as { id: string; role: string };
  const updated = await banUser(id, user.role, reason, user.id);
  return reply.send({ success: true, user: updated });
}

export async function unbanUserHandler(
  request: any,
  reply: any,
) {
  const { id } = request.params;
  const updated = await unbanUser(id);
  return reply.send({ success: true, user: updated });
}

export async function promoteUserHandler(
  request: any,
  reply: any,
) {
  const { id } = request.params;
  const actor = request.user as { id: string; role: string };
  const updated = await promoteToAdmin(id, actor.role);
  return reply.send({ success: true, user: updated });
}

export async function demoteUserHandler(
  request: any,
  reply: any,
) {
  const { id } = request.params;
  const actor = request.user as { id: string; role: string };
  const updated = await demoteFromAdmin(id, actor.id, actor.role);
  return reply.send({ success: true, user: updated });
}

export async function promoteToSuperAdminHandler(
  request: any,
  reply: any,
) {
  const { id } = request.params;
  const actor = request.user as { id: string; role: string };
  const updated = await promoteToSuperAdmin(id, actor.role);
  return reply.send({ success: true, user: updated });
}

import { TaskType } from "@prisma/client";
import { createTaskSchema, updateTaskSchema } from "./schema";

// ----- Task handlers -----

export async function createTaskHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const payload = createTaskSchema.parse(request.body);
  const created = await createTask(payload);
  return reply.send({ success: true, task: created });
}

export async function listTasksHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const tasks = await listTasks();
  return reply.send({ tasks });
}

export async function updateTaskHandler(
  request: any,
  reply: any,
) {
  const { id } = request.params;
  const payload = updateTaskSchema.parse(request.body);
  const updated = await updateTask(id, payload);
  return reply.send({ success: true, task: updated });
}

export async function deleteTaskHandler(
  request: any,
  reply: any,
) {
  const { id } = request.params;
  await deleteTask(id);
  return reply.send({ success: true });
}

// ----- Penalty Management Handlers -----

import {
  getUnderReviewUsers,
  getPenaltyBatchDetails,
  forceSettle,
  cancelPenaltyBatch,
  extendReview,
} from "./penalty.service";

export async function getUnderReviewUsersHandler(
  request: any,
  reply: any,
) {
  const { page = 1, limit = 20 } = request.query || {};
  const data = await getUnderReviewUsers(page, limit);
  return reply.send({ success: true, ...data });
}

export async function getPenaltyBatchHandler(
  request: any,
  reply: any,
) {
  const { id } = request.params;
  const batch = await getPenaltyBatchDetails(id);
  if (!batch) return reply.status(404).send({ success: false, error: "Batch not found" });
  return reply.send({ success: true, batch });
}

export async function forceSettleHandler(
  request: any,
  reply: any,
) {
  const { id } = request.params;
  const adminUser = request.user as { id: string };
  const result = await forceSettle(id, adminUser.id);
  return reply.send({ success: result.settled, error: result.error });
}

export async function cancelPenaltyHandler(
  request: any,
  reply: any,
) {
  const { id } = request.params;
  const adminUser = request.user as { id: string };
  const result = await cancelPenaltyBatch(id, adminUser.id);
  return reply.send({ success: result.cancelled, error: result.error });
}

export async function extendReviewHandler(
  request: any,
  reply: any,
) {
  const { id } = request.params;
  const { minutes } = request.body || {};
  const adminUser = request.user as { id: string };
  if (!minutes || minutes < 1 || minutes > 1440) {
    return reply.status(400).send({ success: false, error: "Minutes must be 1-1440" });
  }
  const result = await extendReview(id, minutes, adminUser.id);
  return reply.send({ success: result.extended, newEndsAt: result.newEndsAt, error: result.error });
}

// ----- Device Filter Handlers -----
import { db } from "../../shared/database/db";

export async function getDeviceDuplicatesHandler(
  request: any,
  reply: any,
) {
  const { page = 1, limit = 20 } = request.query || {};
  const skip = (page - 1) * limit;

  // 1. Get total groups count
  const totalCountResult = await db.$queryRaw<any[]>`
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

  // 2. Get paginated results
  // Note: We use LIMIT and OFFSET in raw SQL for pagination
  const results = await db.$queryRaw<any[]>`
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

export async function getNoDeviceUsersHandler(
  request: any,
  reply: any,
) {
  const { page = 1, limit = 20 } = request.query || {};
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    db.user.findMany({
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
    db.user.count({ where: { deviceId: null } })
  ]);

  return reply.send({ success: true, users, total });
}

export async function getBannedUsersHandler(
  request: any,
  reply: any,
) {
  const { page = 1, limit = 20 } = request.query || {};
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    db.user.findMany({
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
    db.user.count({ where: { isBanned: true } })
  ]);

  return reply.send({ success: true, users, total });
}

export async function banDeviceUsersHandler(
  request: any,
  reply: any,
) {
  const { deviceId } = request.params;
  const { reason = "Mass ban via Device ID" } = request.body || {};
  const adminUser = request.user as { id: string };

  const result = await banUsersByDeviceId(deviceId, reason, adminUser.id);
  return reply.send({ success: true, count: result.count, targets: result.targets, message: result.message });
}

export async function banNoDeviceUsersHandler(
  request: any,
  reply: any,
) {
  const { reason = "Mass ban: Missing device fingerprint" } = request.body || {};
  const adminUser = request.user as { id: string };

  const result = await banUsersWithNoDevice(reason, adminUser.id);
  return reply.send({ success: true, count: result.count, targets: result.targets, message: result.message });
}

export async function getUserPXPHistoryHandler(
  request: any,
  reply: any,
) {
  const { id } = request.params;
  const history = await getUserPXPHistory(id);
  return reply.send({ success: true, history });
}
