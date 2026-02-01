import { db } from "../../shared/database/db";
import { redisClient } from "../../shared/redis";
import { InternalServerError } from "../../shared/errors";

// Helper to sync DB to Redis if empty
export async function syncLeaderboard() {
  if (!redisClient) return;
  const key = "waitlist:leaderboard";
  
  // Check if key exists
  const count = await redisClient.zCard(key);
  if (count > 0) return; // Already populated

  console.log("[LEADERBOARD] Redis key empty, syncing from DB...");
  
  // Batch sync
  const BATCH_SIZE = 1000;
  let cursor = "";
  
  // Actually, for a sync, just stream all users with > 0 pxp
  // Using simplified logic for now: Load top 10k users who have > 0 balance
  const users = await db.user.findMany({
    where: { pxpBalance: { gt: 0 }, isBanned: false },
    select: { id: true, pxpBalance: true },
    take: 10000 
  });

  if (users.length === 0) return;

  // Multi command for atomic-ish insert
  const multi = redisClient.multi();
  for (const user of users) {
    multi.zAdd(key, { score: user.pxpBalance, value: user.id });
  }
  await multi.exec();
  console.log(`[LEADERBOARD] Synced ${users.length} users to Redis`);
}

export async function getLeaderboard(limit: number = 50) {
  // Try Redis first
  if (redisClient) {
    try {
      const key = "waitlist:leaderboard";
      
      // Attempt sync if it might be empty (lazy check)
      // await syncLeaderboard(); // In prod, run this on startup or via cron, not on request

      const members = await redisClient.zRangeWithScores(key, 0, limit - 1, {
        REV: true,
      });

      if (members.length > 0) {
        const ids = members.map((m) => m.value);
        // Fetch user details from DB
        const users = await db.user.findMany({
          where: { id: { in: ids } },
          select: { id: true, username: true, walletAddress: true, pxpBalance: true }, // Select pxpBalance to double check or display DB value
        });

        const userMap = new Map(users.map((u) => [u.id, u]));

        // Filter out any missing users (e.g. deleted but still in Redis)
        return members
          .map((m) => {
             const user = userMap.get(m.value);
             if (!user) return null;
             return {
               id: m.value,
               username: user.username,
               walletAddress: user.walletAddress,
               pxpBalance: Math.round(Number(m.score)), // Trust Redis score
               points: Math.round(Number(m.score)),
             };
          })
          .filter((u): u is NonNullable<typeof u> => u !== null);
      }
    } catch (e) {
      console.warn("[LEADERBOARD] Redis read failed, falling back to DB:", e);
    }
  }

  // Fallback: query DB ordered by pxpBalance
  try {
    const users = await db.user.findMany({
      where: { isBanned: false }, // Enforce isBanned check
      select: {
        id: true,
        username: true,
        walletAddress: true,
        pxpBalance: true,
      },
      orderBy: {
        pxpBalance: "desc",
      },
      take: limit,
    });

    return users.map((u) => ({
      ...u,
      points: u.pxpBalance,
    }));
  } catch (err: any) {
    console.error("[LEADERBOARD] Database error in getLeaderboard:", err?.message);
    throw new InternalServerError();
  }
}

