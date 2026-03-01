import { FastifyInstance } from 'fastify';
import z from 'zod';
import {
  signupHandler,
  loginHandler,
  checkReferralHandler,
  refreshSessionHandler,
  logoutHandler,
  logoutAllHandler,
} from './controller';
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
      config: {
        rateLimit: {
          max: 6,
          timeWindow: '15 minutes',
        },
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
      config: {
        rateLimit: {
          max: 20,
          timeWindow: '5 minutes',
        },
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
      config: {
        rateLimit: {
          max: 60,
          timeWindow: '1 minute',
        },
      },
    },
    checkReferralHandler
  );

  server.post(
    '/refresh',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Rotate refresh token and issue a new access token',
        body: z.object({}).passthrough(),
        querystring: z.object({}).passthrough(),
      },
      config: {
        rateLimit: {
          max: 30,
          timeWindow: '5 minutes',
        },
      },
    },
    refreshSessionHandler
  );

  server.post(
    '/logout',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Revoke refresh token and clear session cookie',
        body: z.object({}).passthrough(),
        querystring: z.object({}).passthrough(),
      },
      config: {
        rateLimit: {
          max: 60,
          timeWindow: '5 minutes',
        },
      },
    },
    logoutHandler
  );

  server.post(
    '/logout-all',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Revoke all active sessions for the authenticated user',
        body: z.object({}).passthrough(),
        querystring: z.object({}).passthrough(),
      },
      config: {
        rateLimit: {
          max: 20,
          timeWindow: '5 minutes',
        },
      },
    },
    logoutAllHandler
  );
}
