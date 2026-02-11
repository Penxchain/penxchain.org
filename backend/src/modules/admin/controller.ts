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
  const { page, limit, search } = request.query;
  const data = await getAllUsers(page, limit, search);
  return reply.send(data);
}

export async function banUserHandler(
  request: any,
  reply: any,
) {
  const { id } = request.params;
  const { reason } = request.body || {};
  const user = request.user as { role: string };
  const updated = await banUser(id, user.role, reason);
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
  const updated = await promoteToAdmin(id);
  return reply.send({ success: true, user: updated });
}

export async function demoteUserHandler(
  request: any,
  reply: any,
) {
  const { id } = request.params;
  const updated = await demoteFromAdmin(id);
  return reply.send({ success: true, user: updated });
}

export async function promoteToSuperAdminHandler(
  request: any,
  reply: any,
) {
  const { id } = request.params;
  const updated = await promoteToSuperAdmin(id);
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
