import { createHash } from "crypto";
import { redisClient } from "../../shared/redis";

const MAX_FAILED_ATTEMPTS = 8;
const ATTEMPT_WINDOW_SECONDS = 10 * 60;
const BLOCK_DURATION_SECONDS = 15 * 60;

type MemoryState = {
  attempts: number;
  windowEndsAtMs: number;
  blockedUntilMs: number;
};

const memoryStore = new Map<string, MemoryState>();

function buildFingerprint(identifier: string, requestIp?: string) {
  const normalizedIdentifier = identifier.trim().toLowerCase();
  const normalizedIp = (requestIp || "unknown").trim().toLowerCase();
  return createHash("sha256")
    .update(`${normalizedIdentifier}|${normalizedIp}`)
    .digest("hex")
    .slice(0, 32);
}

function getRedisKeys(fingerprint: string) {
  return {
    attempts: `auth:login:attempts:${fingerprint}`,
    block: `auth:login:block:${fingerprint}`,
  };
}

function getMemoryBlockSeconds(fingerprint: string) {
  const now = Date.now();
  const state = memoryStore.get(fingerprint);
  if (!state) return 0;

  if (state.blockedUntilMs > now) {
    return Math.ceil((state.blockedUntilMs - now) / 1000);
  }

  if (state.windowEndsAtMs <= now) {
    memoryStore.delete(fingerprint);
    return 0;
  }

  return 0;
}

export async function getRemainingLoginBlockSeconds(
  identifier: string,
  requestIp?: string,
): Promise<number> {
  const fingerprint = buildFingerprint(identifier, requestIp);

  if (redisClient) {
    try {
      const { block } = getRedisKeys(fingerprint);
      const ttl = await redisClient.ttl(block);
      if (ttl > 0) return ttl;
    } catch {
      // Fallback to memory store below.
    }
  }

  return getMemoryBlockSeconds(fingerprint);
}

export async function recordFailedLoginAttempt(
  identifier: string,
  requestIp?: string,
): Promise<void> {
  const fingerprint = buildFingerprint(identifier, requestIp);

  if (redisClient) {
    try {
      const { attempts, block } = getRedisKeys(fingerprint);
      const count = await redisClient.incr(attempts);

      if (count === 1) {
        await redisClient.expire(attempts, ATTEMPT_WINDOW_SECONDS);
      }

      if (count >= MAX_FAILED_ATTEMPTS) {
        await redisClient.set(block, "1", { EX: BLOCK_DURATION_SECONDS });
        await redisClient.del(attempts);
      }
      return;
    } catch {
      // Fallback to memory store below.
    }
  }

  const now = Date.now();
  const current = memoryStore.get(fingerprint);

  if (!current || current.windowEndsAtMs <= now) {
    memoryStore.set(fingerprint, {
      attempts: 1,
      windowEndsAtMs: now + ATTEMPT_WINDOW_SECONDS * 1000,
      blockedUntilMs: 0,
    });
    return;
  }

  const attempts = current.attempts + 1;
  if (attempts >= MAX_FAILED_ATTEMPTS) {
    memoryStore.set(fingerprint, {
      attempts: 0,
      windowEndsAtMs: now + ATTEMPT_WINDOW_SECONDS * 1000,
      blockedUntilMs: now + BLOCK_DURATION_SECONDS * 1000,
    });
    return;
  }

  memoryStore.set(fingerprint, {
    ...current,
    attempts,
  });
}

export async function clearLoginAttemptState(
  identifier: string,
  requestIp?: string,
): Promise<void> {
  const fingerprint = buildFingerprint(identifier, requestIp);

  if (redisClient) {
    try {
      const { attempts, block } = getRedisKeys(fingerprint);
      await redisClient.del([attempts, block]);
      return;
    } catch {
      // Fallback to memory store below.
    }
  }

  memoryStore.delete(fingerprint);
}
