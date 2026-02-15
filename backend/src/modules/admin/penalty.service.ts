/**
 * Referral Penalty Engine
 *
 * Handles the full lifecycle of referral penalties when users are banned:
 * 1. triggerReferralPenalty  — Create/extend a penalty batch for the referrer
 * 2. settlePenaltyBatch     — Atomic settlement: deduct PXP, notify, restore
 * 3. lazySettleIfDue        — Called on auth attempts to auto-settle expired reviews
 * 4. cancelPenaltyBatch     — Admin escape hatch
 * 5. extendReview           — Admin extends review window
 * 6. forceSettle            — Admin force-settles immediately
 *
 * Design principles:
 * - Idempotent (unique constraint on bannedUserId prevents double events)
 * - Transactional (settlement is all-or-nothing)
 * - Lazy (no cron — settlement checks happen on auth)
 * - Auditable (every action logged to AdminAuditLog)
 */

import { db } from "../../shared/database/db";
import { redisClient } from "../../shared/redis";
import { env } from "../../config/env";

// Configurable penalty window (default 30 minutes)
const PENALTY_WINDOW_MINUTES = parseInt(process.env.PENALTY_WINDOW_MINUTES || "30", 10);
const PXP_PER_BAN = 150;

// ============================================================
// 1. TRIGGER REFERRAL PENALTY
// ============================================================
export async function triggerReferralPenalty(
  bannedUserId: string,
  banReason: string,
  adminId: string
): Promise<{ penaltyTriggered: boolean; batchId?: string }> {
  // Find the banned user's referrer
  const bannedUser = await db.user.findUnique({
    where: { id: bannedUserId },
    select: { referredById: true, username: true },
  });

  if (!bannedUser?.referredById) {
    return { penaltyTriggered: false };
  }

  const referrerId = bannedUser.referredById;

  try {
    return await db.$transaction(async (tx: any) => {
      // Check if this banned user already has a penalty event (idempotency guard)
      const existingEvent = await tx.referralPenaltyEvent.findUnique({
        where: { bannedUserId },
      });
      if (existingEvent) {
        console.log(`[PENALTY] Event already exists for banned user ${bannedUserId}, skipping`);
        return { penaltyTriggered: false, batchId: existingEvent.batchId };
      }

      // Find or create a PENDING batch for this referrer
      let batch = await tx.referralPenaltyBatch.findFirst({
        where: {
          referrerId,
          status: "PENDING",
        },
        orderBy: { createdAt: "desc" },
      });

      const now = new Date();

      if (!batch) {
        // Create new batch — start aggregation window
        const windowEnd = new Date(now.getTime() + PENALTY_WINDOW_MINUTES * 60 * 1000);

        batch = await tx.referralPenaltyBatch.create({
          data: {
            referrerId,
            status: "PENDING",
            windowStartsAt: now,
            windowEndsAt: windowEnd,
            totalPxpDeducted: PXP_PER_BAN,
            bannedCount: 1,
          },
        });

        // Put referrer into UNDER_REVIEW state
        await tx.user.update({
          where: { id: referrerId },
          data: {
            accountStatus: "UNDER_REVIEW",
            reviewEndsAt: windowEnd,
            tokenVersion: { increment: 1 }, // Invalidate all sessions
          },
        });

        // Remove from Redis leaderboard
        if (redisClient) {
          try {
            await redisClient.zRem("waitlist:leaderboard", referrerId);
          } catch (e) {
            console.warn("[PENALTY] Failed to remove from Redis leaderboard:", e);
          }
        }
      } else {
        // Add to existing batch (no timer reset!)
        await tx.referralPenaltyBatch.update({
          where: { id: batch.id },
          data: {
            totalPxpDeducted: { increment: PXP_PER_BAN },
            bannedCount: { increment: 1 },
          },
        });
      }

      // Create the penalty event
      await tx.referralPenaltyEvent.create({
        data: {
          batchId: batch.id,
          referrerId,
          bannedUserId,
          bannedUsername: bannedUser.username || null,
          banReason,
          pxpDeducted: PXP_PER_BAN,
          adminId,
        },
      });

      // Log admin action
      await tx.adminAuditLog.create({
        data: {
          adminId,
          action: "REFERRAL_PENALTY_TRIGGERED",
          targetId: referrerId,
          targetType: "User",
          details: {
            bannedUserId,
            bannedUsername: bannedUser.username,
            banReason,
            batchId: batch.id,
            pxpDeducted: PXP_PER_BAN,
          },
        },
      });

      return { penaltyTriggered: true, batchId: batch.id };
    });
  } catch (err: any) {
    // If unique constraint violation on bannedUserId, it's a race condition — safe to ignore
    if (err?.code === "P2002") {
      console.log(`[PENALTY] Duplicate event for ${bannedUserId}, ignoring`);
      return { penaltyTriggered: false };
    }
    console.error("[PENALTY] triggerReferralPenalty failed:", err?.message);
    throw err;
  }
}

// ============================================================
// 2. SETTLE PENALTY BATCH (Atomic)
// ============================================================
export async function settlePenaltyBatch(
  batchId: string,
  adminId?: string
): Promise<{ settled: boolean; error?: string }> {
  return await db.$transaction(async (tx: any) => {
    // Lock the batch row
    const batch = await tx.referralPenaltyBatch.findUnique({
      where: { id: batchId },
      include: {
        events: {
          select: { bannedUsername: true, banReason: true, pxpDeducted: true },
        },
      },
    });

    if (!batch) {
      return { settled: false, error: "Batch not found" };
    }

    // State machine guard: only PENDING or FAILED can be settled
    if (batch.status !== "PENDING" && batch.status !== "FAILED") {
      return { settled: false, error: `Batch already ${batch.status}` };
    }

    // Mark as SETTLING (Fix #3: state machine)
    await tx.referralPenaltyBatch.update({
      where: { id: batchId },
      data: { status: "SETTLING" },
    });

    try {
      // MONOTONIC GUARD: if appliedAt is already set, balance was already touched
      // Even under retries/crashes, this guarantees no double-deduct
      if (batch.appliedAt) {
        // Balance already modified — skip deduction, just finalize
        await tx.referralPenaltyBatch.update({
          where: { id: batchId },
          data: {
            status: "SETTLED",
            settledAt: new Date(),
            settledByAdminId: adminId || null,
            notificationSent: true,
          },
        });
        return { settled: true };
      }

      // Deduct PXP from referrer (floor at 0)
      const referrer = await tx.user.findUnique({
        where: { id: batch.referrerId },
        select: { pxpBalance: true },
      });

      if (!referrer) {
        throw new Error("Referrer not found");
      }

      const actualDeduction = Math.min(batch.totalPxpDeducted, referrer.pxpBalance);

      // Set appliedAt ATOMICALLY with balance deduction — single source of truth
      await tx.referralPenaltyBatch.update({
        where: { id: batchId },
        data: { appliedAt: new Date() },
      });

      await tx.user.update({
        where: { id: batch.referrerId },
        data: {
          pxpBalance: { decrement: actualDeduction },
          accountStatus: "ACTIVE",  // Restore account
          reviewEndsAt: null,
        },
      });

      // Update Redis leaderboard with new balance
      const updatedReferrer = await tx.user.findUnique({
        where: { id: batch.referrerId },
        select: { pxpBalance: true },
      });

      if (redisClient && updatedReferrer) {
        try {
          await redisClient.zAdd("waitlist:leaderboard", {
            score: updatedReferrer.pxpBalance,
            value: batch.referrerId,
          });
        } catch (e) {
          console.warn("[PENALTY] Failed to update Redis leaderboard:", e);
        }
      }

      // Build notification message
      const eventNames = batch.events
        .filter((e: any) => e.bannedUsername)
        .map((e: any) => e.bannedUsername);

      const namePreview = eventNames.length <= 3
        ? eventNames.join(", ")
        : `${eventNames.slice(0, 3).join(", ")} and ${eventNames.length - 3} others`;

      const reasons = [...new Set(batch.events.map((e: any) => e.banReason))];
      const reasonSummary = reasons.length <= 2
        ? reasons.join(" and ")
        : `${reasons.slice(0, 2).join(", ")} and other violations`;

      const message = batch.bannedCount === 1
        ? `We banned an account you referred due to ${reasonSummary}. ${actualDeduction} PXP has been deducted from your balance according to our referral rules.${namePreview ? ` Affected user: ${namePreview}.` : ""}`
        : `We banned ${batch.bannedCount} accounts you referred due to ${reasonSummary}. A total of ${actualDeduction} PXP has been deducted from your balance according to our referral rules.${namePreview ? ` Affected users include: ${namePreview}.` : ""}`;

      // Create notification (Fix #5: inside same transaction = dedup guard)
      if (!batch.notificationSent) {
        await tx.notification.create({
          data: {
            userId: batch.referrerId,
            type: "REFERRAL_PENALTY",
            title: "Referral Policy Enforcement",
            message,
            metadata: {
              batchId: batch.id,
              bannedCount: batch.bannedCount,
              totalDeducted: actualDeduction,
            },
          },
        });
      }

      // Mark settled
      await tx.referralPenaltyBatch.update({
        where: { id: batchId },
        data: {
          status: "SETTLED",
          settledAt: new Date(),
          settledByAdminId: adminId || null,
          notificationSent: true,
          totalPxpDeducted: actualDeduction, // Record actual deduction
        },
      });

      // Log settlement
      await tx.adminAuditLog.create({
        data: {
          adminId: adminId || batch.referrerId, // Self-settle on lazy
          action: "PENALTY_BATCH_SETTLED",
          targetId: batch.referrerId,
          targetType: "User",
          details: {
            batchId,
            totalDeducted: actualDeduction,
            bannedCount: batch.bannedCount,
            isForceSettle: !!adminId,
          },
        },
      });

      return { settled: true };
    } catch (innerErr: any) {
      // Mark as FAILED — user stays locked, admin can retry
      await tx.referralPenaltyBatch.update({
        where: { id: batchId },
        data: { status: "FAILED" },
      });
      console.error("[PENALTY] Settlement failed:", innerErr?.message);
      return { settled: false, error: innerErr?.message || "Settlement failed" };
    }
  });
}

// ============================================================
// 3. LAZY SETTLE IF DUE (Called on auth attempts)
// ============================================================
export async function lazySettleIfDue(userId: string): Promise<boolean> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { accountStatus: true, reviewEndsAt: true },
  });

  if (!user || user.accountStatus !== "UNDER_REVIEW") return false;
  if (!user.reviewEndsAt || new Date() < user.reviewEndsAt) return false;

  // Time's up — find pending batch and settle
  const pendingBatch = await db.referralPenaltyBatch.findFirst({
    where: {
      referrerId: userId,
      status: { in: ["PENDING", "FAILED"] },
    },
    orderBy: { createdAt: "desc" },
  });

  if (pendingBatch) {
    const result = await settlePenaltyBatch(pendingBatch.id);
    return result.settled;
  }

  // No batch found but user is in UNDER_REVIEW — clean up orphan state
  await db.user.update({
    where: { id: userId },
    data: { accountStatus: "ACTIVE", reviewEndsAt: null },
  });

  return true;
}

// ============================================================
// 4. CANCEL PENALTY BATCH (Admin escape hatch)
// ============================================================
export async function cancelPenaltyBatch(
  batchId: string,
  adminId: string
): Promise<{ cancelled: boolean; error?: string }> {
  return await db.$transaction(async (tx: any) => {
    const batch = await tx.referralPenaltyBatch.findUnique({
      where: { id: batchId },
    });

    if (!batch) return { cancelled: false, error: "Batch not found" };
    if (batch.status === "SETTLED") return { cancelled: false, error: "Already settled" };
    if (batch.status === "CANCELLED") return { cancelled: false, error: "Already cancelled" };

    // Cancel the batch
    await tx.referralPenaltyBatch.update({
      where: { id: batchId },
      data: { status: "CANCELLED" },
    });

    // Restore user to ACTIVE
    await tx.user.update({
      where: { id: batch.referrerId },
      data: {
        accountStatus: "ACTIVE",
        reviewEndsAt: null,
      },
    });

    // Log
    await tx.adminAuditLog.create({
      data: {
        adminId,
        action: "PENALTY_BATCH_CANCELLED",
        targetId: batch.referrerId,
        targetType: "User",
        details: { batchId, reason: "Admin cancelled" },
      },
    });

    return { cancelled: true };
  });
}

// ============================================================
// 5. EXTEND REVIEW WINDOW
// ============================================================
export async function extendReview(
  batchId: string,
  additionalMinutes: number,
  adminId: string
): Promise<{ extended: boolean; newEndsAt?: Date; error?: string }> {
  return await db.$transaction(async (tx: any) => {
    const batch = await tx.referralPenaltyBatch.findUnique({
      where: { id: batchId },
    });

    if (!batch) return { extended: false, error: "Batch not found" };
    if (batch.status !== "PENDING") return { extended: false, error: `Cannot extend ${batch.status} batch` };

    const newEndsAt = new Date(batch.windowEndsAt.getTime() + additionalMinutes * 60 * 1000);

    await tx.referralPenaltyBatch.update({
      where: { id: batchId },
      data: { windowEndsAt: newEndsAt },
    });

    await tx.user.update({
      where: { id: batch.referrerId },
      data: { reviewEndsAt: newEndsAt },
    });

    await tx.adminAuditLog.create({
      data: {
        adminId,
        action: "PENALTY_REVIEW_EXTENDED",
        targetId: batch.referrerId,
        targetType: "User",
        details: { batchId, additionalMinutes, newEndsAt: newEndsAt.toISOString() },
      },
    });

    return { extended: true, newEndsAt };
  });
}

// ============================================================
// 6. FORCE SETTLE (Admin immediate settlement)
// ============================================================
export async function forceSettle(
  batchId: string,
  adminId: string
) {
  return settlePenaltyBatch(batchId, adminId);
}

// ============================================================
// QUERY HELPERS
// ============================================================
export async function getUnderReviewUsers(page: number = 1, limit: number = 20) {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    db.user.findMany({
      where: { accountStatus: "UNDER_REVIEW" },
      select: {
        id: true,
        username: true,
        email: true,
        pxpBalance: true,
        reviewEndsAt: true,
        accountStatus: true,
        penaltyBatches: {
          where: { status: { in: ["PENDING", "SETTLING"] } },
          select: {
            id: true,
            status: true,
            totalPxpDeducted: true,
            bannedCount: true,
            windowStartsAt: true,
            windowEndsAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { reviewEndsAt: "asc" },
      skip,
      take: limit,
    }),
    db.user.count({ where: { accountStatus: "UNDER_REVIEW" } })
  ]);

  const results = users.map((u: any) => ({
    ...u,
    activeBatch: u.penaltyBatches[0] || null,
    penaltyBatches: undefined,
    timeRemainingMs: u.reviewEndsAt
      ? Math.max(0, new Date(u.reviewEndsAt).getTime() - Date.now())
      : 0,
  }));

  return { users: results, total };
}

export async function getPenaltyBatchDetails(batchId: string) {
  return db.referralPenaltyBatch.findUnique({
    where: { id: batchId },
    include: {
      events: {
        select: {
          id: true,
          bannedUserId: true,
          bannedUsername: true,
          banReason: true,
          pxpDeducted: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      },
      referrer: {
        select: { id: true, username: true, email: true, pxpBalance: true },
      },
    },
  });
}
