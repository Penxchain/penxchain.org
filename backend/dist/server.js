"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const logger_1 = require("./shared/logger");
const env_1 = require("./config/env");
const db_1 = require("./shared/database/db");
async function start() {
    try {
        const app = await (0, app_1.buildApp)();
        await app.listen({ port: env_1.env.PORT, host: '0.0.0.0' });
        logger_1.logger.info(`Server listening on http://0.0.0.0:${env_1.env.PORT}`);
        const closeGracefully = async (signal) => {
            logger_1.logger.info(`Received ${signal}. Closing server...`);
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