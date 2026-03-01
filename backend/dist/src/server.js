"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const logger_1 = require("./shared/logger");
const env_1 = require("./config/env");
const db_1 = require("./shared/database/db");
const service_1 = require("./modules/admin/service");
const cleanup_1 = require("./modules/auth/cleanup");
async function start() {
    try {
        console.log("Starting server...");
        console.log("Environment PORT:", env_1.env.PORT);
        const app = await (0, app_1.buildApp)();
        console.log("App built successfully");
        try {
            const result = await (0, service_1.cleanupExpiredTasks)();
            if (result.deleted > 0) {
                logger_1.logger.info(`[STARTUP] Cleaned up ${result.deleted} expired tasks`);
            }
        }
        catch (e) {
            logger_1.logger.warn({ err: e }, "[STARTUP] Failed to cleanup expired tasks");
        }
        await (0, cleanup_1.runRefreshTokenCleanupNow)();
        const stopRefreshCleanupWorker = (0, cleanup_1.startRefreshTokenCleanupWorker)();
        await app.listen({ port: env_1.env.PORT, host: '0.0.0.0' });
        logger_1.logger.info(`Server listening on http://0.0.0.0:${env_1.env.PORT}`);
        const closeGracefully = async (signal) => {
            logger_1.logger.info(`Received ${signal}. Closing server...`);
            stopRefreshCleanupWorker();
            await app.close();
            await db_1.db.$disconnect();
            logger_1.logger.info('Server and Database closed. Exiting.');
            process.exit(0);
        };
        process.on('SIGINT', () => closeGracefully('SIGINT'));
        process.on('SIGTERM', () => closeGracefully('SIGTERM'));
    }
    catch (err) {
        logger_1.logger.error(err);
        process.exit(1);
    }
}
start();
//# sourceMappingURL=server.js.map