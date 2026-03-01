import { buildApp } from './app';
import { logger } from './shared/logger';
import { env } from './config/env';
import { db } from './shared/database/db';
import { cleanupExpiredTasks } from './modules/admin/service';
import {
  runRefreshTokenCleanupNow,
  startRefreshTokenCleanupWorker,
} from './modules/auth/cleanup';

async function start() {
  try {
    console.log("Starting server...");
    console.log("Environment PORT:", env.PORT);
    const app = await buildApp();
    console.log("App built successfully");
    
    // Cleanup expired SOCIAL tasks on startup
    try {
      const result = await cleanupExpiredTasks();
      if (result.deleted > 0) {
        logger.info(`[STARTUP] Cleaned up ${result.deleted} expired tasks`);
      }
    } catch (e) {
      logger.warn({ err: e }, "[STARTUP] Failed to cleanup expired tasks");
    }

    // Cleanup stale refresh tokens on startup and schedule recurring cleanup.
    await runRefreshTokenCleanupNow();
    const stopRefreshCleanupWorker = startRefreshTokenCleanupWorker();
    
    await app.listen({ port: env.PORT, host: '0.0.0.0' });
    logger.info(`Server listening on http://0.0.0.0:${env.PORT}`);

    // Graceful Shutdown
    const closeGracefully = async (signal: string) => {
      logger.info(`Received ${signal}. Closing server...`);
      stopRefreshCleanupWorker();
      await app.close();
      await db.$disconnect();
      logger.info('Server and Database closed. Exiting.');
      process.exit(0);
    };

    process.on('SIGINT', () => closeGracefully('SIGINT'));
    process.on('SIGTERM', () => closeGracefully('SIGTERM'));

  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
}

start();
