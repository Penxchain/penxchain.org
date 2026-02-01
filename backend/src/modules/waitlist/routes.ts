import { FastifyInstance } from 'fastify';
import z from 'zod';
import { completeTaskHandler, getTasksHandler, getUserStatsHandler, getTimeHandler, claimBonusHandler } from './controller';
import { completeTaskSchema, claimBonusSchema } from './schema';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { requireActiveUser } from '../../shared/middleware';

export async function waitlistRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();

  // Global Auth Guard for Waitlist Routes
  server.addHook('onRequest', async (request, reply) => {
    try {
      await request.jwtVerify();
      // Also ensure active user
      await requireActiveUser(request, reply);
    } catch (err) {
      reply.send(err);
    }
  });
  
  server.get(
    '/time',
    {
       schema: {
         tags: ['Waitlist'],
         summary: 'Get server time and next daily reset',
         querystring: z.object({}).passthrough(),
       }
    },
    getTimeHandler
  );

  server.get(
    '/tasks',
    {
      schema: {
        tags: ['Waitlist'],
        summary: 'Get all tasks with user status',
        // headers: z.object({ authorization: z.string() }), // TODO: Add strict header validation
        querystring: z.object({}).passthrough(),
      },
    },
    getTasksHandler
  );

  server.post(
    '/tasks/complete',
    {
      schema: {
        body: completeTaskSchema,
        tags: ['Waitlist'],
        summary: 'Complete a task',
      },
    },
    completeTaskHandler
  );

  server.get(
    '/stats',
    {
        schema: {
            tags: ['Waitlist'],
            summary: 'Get user stats (points, rank)',
            querystring: z.object({}).passthrough(),
        }
    },
    getUserStatsHandler
  );

  server.post(
    '/bonus/claim',
    {
      schema: {
        body: claimBonusSchema,
        tags: ['Waitlist'],
        summary: 'Claim 24h PXP bonus',
      }
    },
    claimBonusHandler
  );
}
