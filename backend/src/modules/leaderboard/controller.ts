import { FastifyReply, FastifyRequest } from "fastify";
import { getLeaderboard } from "./service";
import { leaderboardQuerySchema } from "./schema";
import z from "zod";

export async function getLeaderboardHandler(
  request: FastifyRequest<{
    Querystring: z.infer<typeof leaderboardQuerySchema>;
  }>,
  reply: FastifyReply,
) {
  try {
    // Defensive defaults
    const rawLimit = Number(request.query.limit);
    const limit = Number.isFinite(rawLimit)
      ? Math.min(Math.max(rawLimit, 1), 100)
      : 50;

    const leaderboard = await getLeaderboard(limit);

    return reply.code(200).send({
      success: true,
      data: leaderboard,
    });
  } catch (error: any) {
    request.log.error(
      { err: error },
      "Failed to fetch leaderboard",
    );

    return reply.code(500).send({
      success: false,
      message: "Unable to fetch leaderboard at the moment",
    });
  }
}
