"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const redis_1 = require("redis");
const env_1 = require("../config/env");
let redisClient = null;
exports.redisClient = redisClient;
if (env_1.env.REDIS_URL) {
    try {
        exports.redisClient = redisClient = (0, redis_1.createClient)({ url: env_1.env.REDIS_URL });
        redisClient.on("error", (err) => console.error("Redis error", err));
        (async () => {
            try {
                await redisClient?.connect();
                console.log("Redis connected");
            }
            catch (e) {
                console.warn("Redis connection failed, continuing without Redis", e);
                exports.redisClient = redisClient = null;
            }
        })();
    }
    catch (e) {
        console.warn("Failed to create Redis client", e);
        exports.redisClient = redisClient = null;
    }
}
//# sourceMappingURL=redis.js.map