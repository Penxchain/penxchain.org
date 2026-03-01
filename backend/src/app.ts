import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import { logger } from './shared/logger';
import { errorHandler } from './shared/error-handler';
import { env } from './config/env';

export async function buildApp() {
  const app = Fastify({
    loggerInstance: logger,
    disableRequestLogging: true,
  }).withTypeProvider<ZodTypeProvider>(); // 👈 MOVE IT HERE

  // Zod compiler
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  // Security
  await app.register(helmet, { global: true });
  await app.register(import('@fastify/rate-limit'), {
    max: 100,
    timeWindow: '1 minute',
  });
  const allowedOrigins = new Set(
    [
      env.FRONTEND_URL,
      ...(env.FRONTEND_URLS ? env.FRONTEND_URLS.split(',') : []),
    ]
      .map((origin) => origin.trim())
      .filter(Boolean),
  );
  const allowAllOrigins = allowedOrigins.has('*');
  await app.register(cors, {
    origin: (origin, callback) => {
      if (allowAllOrigins) {
        callback(null, true);
        return;
      }
      if (!origin) {
        callback(null, true);
        return;
      }
      if (allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('Not allowed'), false);
    },
    credentials: true,
    // Ensure preflight allows the methods and headers used by the frontend
    methods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'X-Requested-With',
      'X-Device-Id',
      'X-Geo-Country',
      'X-Geo-Lat',
      'X-Geo-Lon',
    ],
    exposedHeaders: ['Content-Type', 'Authorization'],
  });
  await app.register(import('@fastify/jwt'), {
    secret: env.JWT_SECRET,
    sign: {
      expiresIn: env.ACCESS_TOKEN_TTL,
    },
  });

  // Error handler
  app.setErrorHandler(errorHandler);

  // Routes
  app.register(async (instance: FastifyInstance) => {
    const { authRoutes } = await import('./modules/auth/routes');
    await authRoutes(instance);
  }, { prefix: '/auth' });

  app.register(async (instance: FastifyInstance) => {
    const { waitlistRoutes } = await import('./modules/waitlist/routes');
    await waitlistRoutes(instance);
  }, { prefix: '/waitlist' });

  app.register(async (instance: FastifyInstance) => {
    const { leaderboardRoutes } = await import('./modules/leaderboard/routes');
    await leaderboardRoutes(instance);
  }, { prefix: '/leaderboard' });

  app.register(async (instance: FastifyInstance) => {
    const { adminRoutes } = await import('./modules/admin/routes');
    await adminRoutes(instance);
  }, { prefix: '/admin' });

  app.register(async (instance: FastifyInstance) => {
    const { privateSaleRoutes } = await import('./modules/privatesale/routes');
    await privateSaleRoutes(instance);
  }, { prefix: '/privatesale' });

  app.get('/', async () => ({
    status: 'operational',
    service: 'Penxchain API',
    version: '1.0.0',
    documentation: '/docs', // Placeholder for future docs
    timestamp: new Date().toISOString()
  }));

  app.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date(),
  }));

  return app;
}
