import { createClient, RedisClientType } from "redis";
import { env } from "../config/env";

let redisClient: RedisClientType | null = null;

if (env.REDIS_URL) {
  try {
    redisClient = createClient({ url: env.REDIS_URL });
    redisClient.on("error", (err) => console.error("Redis error", err));
    // connect asynchronously but don't block startup
    (async () => {
      try {
        await redisClient?.connect();
        console.log("Redis connected");
      } catch (e) {
        console.warn("Redis connection failed, continuing without Redis", e);
        redisClient = null;
      }
    })();
  } catch (e) {
    console.warn("Failed to create Redis client", e);
    redisClient = null;
  }
}

export { redisClient };
