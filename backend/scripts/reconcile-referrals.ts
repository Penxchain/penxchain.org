#!/usr/bin/env tsx
import { db } from "../src/shared/database/db";

const REFERRAL_TASK_THRESHOLD = 3;
const REFERRER_BONUS = 150;

function usage() {
  console.log("Usage: tsx scripts/reconcile-referrals.ts [--apply]");
  console.log("  --apply   Actually apply DB changes. Omit for a safe dry-run.");
}

async function main() {
  const apply = process.argv.includes("--apply");
  console.log(`Running referral reconciliation (apply=${apply})`);

  // Find referred users eligible for credit but not yet granted
  const eligible = await db.user.findMany({
    where: {
      referredById: { not: null },
      tasksCompletedCount: { gte: REFERRAL_TASK_THRESHOLD },
      referrerBonusGranted: false,
    },
    select: { id: true, referredById: true, tasksCompletedCount: true },
  });

  console.log(`Found ${eligible.length} eligible referrals missing credit`);

  const appliedCredits: Array<{ referredId: string; referrerId: string }> = [];

  for (const u of eligible) {
    try {
      if (!apply) {
        console.log(
          `[DRY] Would credit ${REFERRER_BONUS} to referrer ${u.referredById} for referred user ${u.id} (tasks=${u.tasksCompletedCount})`
        );
        continue;
      }

      // Only count/log as "Credited" if the transaction actually applied changes.
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
        if (fresh.tasksCompletedCount < REFERRAL_TASK_THRESHOLD) return false; // race
        if (fresh.referrerBonusGranted) return false; // another process already applied

        // Credit referrer
        await tx.user.update({
          where: { id: fresh.referredById },
          data: { pxpBalance: { increment: REFERRER_BONUS } } as any,
        });

        // Mark referred user's referrerBonusGranted = true (idempotent guard)
        await tx.user.update({
          where: { id: u.id },
          data: { referrerBonusGranted: true } as any,
        });

        // Create a notification (best-effort)
        try {
          await tx.notification.create({
            data: {
              userId: fresh.referredById,
              type: "REFERRAL_REWARD_CREDITED",
              title: "Referral Reward Unlocked!",
              message: `Your referral has completed ${REFERRAL_TASK_THRESHOLD} tasks. You've been awarded +${REFERRER_BONUS} PXP.`,
              metadata: { referredUserId: u.id, amount: REFERRER_BONUS },
            },
          });
        } catch (e) {
          console.warn(
            "Failed to create notification (non-fatal):",
            (e as any)?.message || e
          );
        }

        return true;
      });

      if (didApply) {
        appliedCredits.push({ referredId: u.id, referrerId: u.referredById! });
        console.log(
          `Credited ${REFERRER_BONUS} to ${u.referredById} for referred user ${u.id}`
        );
      } else {
        // This is the key fix: we don't claim credit happened when it didn't.
        console.log(
          `Skipped (no-op) for referred user ${u.id} — already applied or no longer eligible`
        );
      }
    } catch (err: any) {
      console.error(`Error processing eligible user ${u.id}:`, err?.message || err);
    }
  }

  // Find users incorrectly marked EARNED but not actually eligible (tasks < threshold)
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

  const manualReview: Array<{ id: string; referrerId: string; reason: string }> = [];

  for (const w of wronglyEarned) {
    try {
      // If referrerBonusGranted is true, we cannot safely un-credit the referrer automatically (funds may have been spent).
      if (w.referrerBonusGranted) {
        manualReview.push({
          id: w.id,
          referrerId: w.referredById!,
          reason:
            "referrerBonusGranted=true but tasks < threshold — manual review required",
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

      // Safe to clear legacy flag(s)
      await db.user.update({
        where: { id: w.id },
        data: { referralRewarded: false } as any,
      });
      console.log(`Cleared legacy referral flags for user ${w.id}`);
    } catch (err: any) {
      console.error(`Error processing wrongly-earned user ${w.id}:`, err?.message || err);
    }
  }

  // Summary
  console.log("--- Summary ---");
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
  console.log("Done");
}

main().catch((e) => {
  console.error("Fatal error:", (e as any)?.message || e);
  process.exit(1);
});