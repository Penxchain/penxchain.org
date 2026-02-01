import { FastifyInstance } from 'fastify';
import z from 'zod';
import { signupHandler, loginHandler, checkReferralHandler } from './controller';
import { signupSchema, loginSchema, checkReferralSchema } from './schema';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

export async function authRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();

  server.post(
    '/signup',
    {
      schema: {
        body: signupSchema,
        tags: ['Auth'],
        summary: 'Register a new user',
        querystring: z.object({}).passthrough(),
      },
    },
    signupHandler
  );

  server.post(
    '/login',
    {
      schema: {
        body: loginSchema,
        tags: ['Auth'],
        summary: 'Login user',
        querystring: z.object({}).passthrough(),
      },
    },
    loginHandler
  );

  server.get(
    '/check-referral',
    {
      schema: {
        querystring: checkReferralSchema,
        tags: ['Auth'],
        summary: 'Check if referral code is valid',
      },
    },
    checkReferralHandler
  );
}
