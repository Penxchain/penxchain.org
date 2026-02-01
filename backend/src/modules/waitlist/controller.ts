import { FastifyReply, FastifyRequest } from 'fastify';
import * as waitlistService from './service';
import { CompleteTaskInput } from './schema';
import { UnauthorizedError } from '../../shared/errors';

const { completeTask, getTasksWithUserStatus, getUserStats, getServerTime, claimDailyReward } = waitlistService;

console.debug('[WAITLIST] Service module loading...');

const getAuthUser = async (req: FastifyRequest) => {
  await req.jwtVerify();
  const user = req.user as { id: string; role: string };
  if (!user?.id) throw new UnauthorizedError();
  return user;
};

export async function getTasksHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id } = await getAuthUser(request);
  const tasks = await getTasksWithUserStatus(id);
  return reply.send({ success: true, tasks });
}

export async function completeTaskHandler(
  request: FastifyRequest<{ Body: CompleteTaskInput }>,
  reply: FastifyReply
) {
  const { id } = await getAuthUser(request);
  // Services now throw proper AppError types that the global handler catches
  const result = await completeTask(id, request.body.taskId);
  return reply.send({ success: true, ...result });
}

export async function getUserStatsHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id } = await getAuthUser(request);
  const stats = await getUserStats(id);
  return reply.send({ success: true, ...stats });
}

export async function claimBonusHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id } = await getAuthUser(request);
  // Services now throw proper AppError types
  const result = await claimDailyReward(id);
  return reply.send(result);
}

export async function getTimeHandler(request: FastifyRequest, reply: FastifyReply) {
  const time = getServerTime();
  return reply.send({ success: true, ...time });
}

