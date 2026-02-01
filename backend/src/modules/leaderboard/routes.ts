import { FastifyInstance } from 'fastify';
import { getLeaderboardHandler } from './controller';
import { leaderboardQuerySchema } from './schema';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

export async function leaderboardRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();

  server.get(
    '/',
    {
      schema: {
        querystring: leaderboardQuerySchema,
        tags: ['Leaderboard'],
        summary: 'Get top users',
      },
    },
    getLeaderboardHandler
  );
}
