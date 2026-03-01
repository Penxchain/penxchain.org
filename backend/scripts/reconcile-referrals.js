#!/usr/bin/env node
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

async function initPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL not set');
  }

  // Try with SSL first (matches app behavior). If the server doesn't support SSL,
  // fall back to a non-SSL connection. This makes the script safe to run against
  // local and remote DB setups.
  const tryPool = (sslOption) => new Pool({ connectionString, ssl: sslOption });

  let pool = tryPool({ rejectUnauthorized: false });
  try {
    // quick health check
    await pool.query('SELECT 1');
  } catch (err) {
    const msg = String(err && err.message || err);
    if (msg.includes('server does not support SSL') || msg.includes('sslmode')) {
      console.warn('DB rejected TLS; retrying with ssl=false');
      try {
        pool.end().catch(() => {});
      } catch (e) {}
      pool = tryPool(false);
      // verify again
      await pool.query('SELECT 1');
    } else {
      throw err;
    }
  }

  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter, log: ['warn', 'error'] });
}

// We'll initialize Prisma inside main so flow is linear and errors are surfaced
// in a single place.

const REFERRAL_TASK_THRESHOLD = 3;
const REFERRER_BONUS = 150;

async function main() {
  const apply = process.argv.includes('--apply');
  console.log(`Running referral reconciliation (apply=${apply})`);

  const db = await initPrismaClient();

  const eligible = await db.user.findMany({
    where: {
      referredById: { not: null },
      tasksCompletedCount: { gte: REFERRAL_TASK_THRESHOLD },
      referrerBonusGranted: false,
    },
    select: { id: true, referredById: true, tasksCompletedCount: true },
  });

  console.log(`Found ${eligible.length} eligible referrals missing credit`);

  const appliedCredits = [];

  for (const u of eligible) {
    try {
      if (!apply) {
        console.log(
          `[DRY] Would credit ${REFERRER_BONUS} to referrer ${u.referredById} for referred user ${u.id} (tasks=${u.tasksCompletedCount})`
        );
        continue;
      }

      // ✅ Key fix: only count/log as credited if the transaction really applied updates
      const didApply = await db.$transaction(async (tx) => {
        const fresh = await tx.user.findUnique({
          where: { id: u.id },
          select: {
            tasksCompletedCount: true,
            referredById: true,
            referrerBonusGranted: true,
          },
        });

        if (!fresh || !fresh.referredById) return false;
        if (fresh.tasksCompletedCount < REFERRAL_TASK_THRESHOLD) return false;
        if (fresh.referrerBonusGranted) return false;

        await tx.user.update({
          where: { id: fresh.referredById },
          data: { pxpBalance: { increment: REFERRER_BONUS } },
        });

        await tx.user.update({
          where: { id: u.id },
          data: { referrerBonusGranted: true },
        });

        try {
          await tx.notification.create({
            data: {
              userId: fresh.referredById,
              type: 'REFERRAL_REWARD_CREDITED',
              title: 'Referral Reward Unlocked!',
              message: `Your referral has completed ${REFERRAL_TASK_THRESHOLD} tasks. You've been awarded +${REFERRER_BONUS} PXP.`,
              metadata: { referredUserId: u.id, amount: REFERRER_BONUS },
            },
          });
        } catch (e) {
          console.warn(
            'Failed to create notification (non-fatal):',
            e && e.message ? e.message : e
          );
        }

        return true;
      });

      if (didApply) {
        appliedCredits.push({ referredId: u.id, referrerId: u.referredById });
        console.log(
          `Credited ${REFERRER_BONUS} to ${u.referredById} for referred user ${u.id}`
        );
      } else {
        console.log(
          `Skipped (no-op) for referred user ${u.id} — already applied or no longer eligible`
        );
      }
    } catch (err) {
      console.error(
        `Error processing eligible user ${u.id}:`,
        err && err.message ? err.message : err
      );
    }
  }

  const wronglyEarned = await db.user.findMany({
    where: {
      referredById: { not: null },
      tasksCompletedCount: { lt: REFERRAL_TASK_THRESHOLD },
      OR: [{ referralRewarded: true }, { referrerBonusGranted: true }],
    },
    select: {
      id: true,
      referredById: true,
      referralRewarded: true,
      referrerBonusGranted: true,
      tasksCompletedCount: true,
    },
  });

  console.log(
    `Found ${wronglyEarned.length} referrals flagged as earned but below threshold`
  );

  const manualReview = [];

  for (const w of wronglyEarned) {
    try {
      if (w.referrerBonusGranted) {
        manualReview.push({
          id: w.id,
          referrerId: w.referredById,
          reason:
            'referrerBonusGranted=true but tasks < threshold — manual review required',
        });
        console.log(
          `[ALERT] referred user ${w.id} has referrerBonusGranted=true but only ${w.tasksCompletedCount} tasks — manual review required`
        );
        continue;
      }

      if (!apply) {
        console.log(
          `[DRY] Would clear legacy referral flags for user ${w.id} (referralRewarded=${w.referralRewarded})`
        );
        continue;
      }

      await db.user.update({
        where: { id: w.id },
        data: { referralRewarded: false },
      });
      console.log(`Cleared legacy referral flags for user ${w.id}`);
    } catch (err) {
      console.error(
        `Error processing wrongly-earned user ${w.id}:`,
        err && err.message ? err.message : err
      );
    }
  }

  console.log('--- Summary ---');
  console.log(`Credits applied: ${appliedCredits.length}`);
  if (manualReview.length) {
    console.log(`Manual review required for ${manualReview.length} records:`);
    manualReview.forEach((r) =>
      console.log(
        ` - referredId=${r.id} referrerId=${r.referrerId} reason=${r.reason}`
      )
    );
  }

  await db.$disconnect();
  console.log('Done');
}

main().catch((e) => {
  console.error('Fatal error:', e && e.message ? e.message : e);
  process.exit(1);
});