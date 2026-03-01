import { env } from "../../config/env";
import { logger } from "../../shared/logger";
import { cleanupRefreshTokens } from "./session";

const INTERVAL_MS = env.REFRESH_CLEANUP_INTERVAL_MINUTES * 60 * 1000;

export async function runRefreshTokenCleanupNow() {
  try {
    const result = await cleanupRefreshTokens();
    if (result.totalDeleted > 0) {
      logger.info(
        {
          expiredDeleted: result.expiredDeleted,
          revokedDeleted: result.revokedDeleted,
          totalDeleted: result.totalDeleted,
        },
        "[AUTH CLEANUP] Removed stale refresh tokens",
      );
    }
    return result;
  } catch (error) {
    logger.warn({ err: error }, "[AUTH CLEANUP] Refresh token cleanup failed");
    return { expiredDeleted: 0, revokedDeleted: 0, totalDeleted: 0 };
  }
}

export function startRefreshTokenCleanupWorker() {
  const timer = setInterval(() => {
    void runRefreshTokenCleanupNow();
  }, INTERVAL_MS);

  if (typeof (timer as any).unref === "function") {
    (timer as any).unref();
  }

  return () => clearInterval(timer);
}
