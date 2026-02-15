-- Migration 002: Referral Penalty Batches, Events, Admin Audit Log, Notifications
-- Run on Supabase (PostgreSQL). All tables are new — no existing data affected.

-- ============================================================
-- ReferralPenaltyBatch: one per referrer per aggregation window
-- Status state machine: PENDING → SETTLING → SETTLED|FAILED|CANCELLED
-- ============================================================
CREATE TABLE IF NOT EXISTS "ReferralPenaltyBatch" (
  "id"               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "referrerId"       UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "status"           TEXT NOT NULL DEFAULT 'PENDING'
    CHECK ("status" IN ('PENDING','SETTLING','SETTLED','FAILED','CANCELLED')),
  "totalPxpDeducted" INTEGER NOT NULL DEFAULT 0,
  "bannedCount"      INTEGER NOT NULL DEFAULT 0,
  "windowStartsAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "windowEndsAt"     TIMESTAMPTZ NOT NULL,
  "settledAt"        TIMESTAMPTZ,
  "settledByAdminId" UUID REFERENCES "User"("id"),
  "notificationSent" BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt"        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "RPB_referrerId_idx" ON "ReferralPenaltyBatch" ("referrerId");
CREATE INDEX IF NOT EXISTS "RPB_status_idx" ON "ReferralPenaltyBatch" ("status");
CREATE INDEX IF NOT EXISTS "RPB_windowEndsAt_idx" ON "ReferralPenaltyBatch" ("windowEndsAt");

-- ============================================================
-- ReferralPenaltyEvent: individual ban events within a batch
-- UNIQUE on bannedUserId prevents double-deduction on retries
-- ============================================================
CREATE TABLE IF NOT EXISTS "ReferralPenaltyEvent" (
  "id"             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "batchId"        UUID NOT NULL REFERENCES "ReferralPenaltyBatch"("id") ON DELETE CASCADE,
  "referrerId"     UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "bannedUserId"   UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "bannedUsername"  TEXT,
  "banReason"      TEXT NOT NULL,
  "pxpDeducted"    INTEGER NOT NULL DEFAULT 150,
  "adminId"        UUID NOT NULL REFERENCES "User"("id"),
  "createdAt"      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS "RPE_bannedUserId_unique" ON "ReferralPenaltyEvent" ("bannedUserId");
CREATE INDEX IF NOT EXISTS "RPE_batchId_idx" ON "ReferralPenaltyEvent" ("batchId");

-- ============================================================
-- AdminAuditLog: immutable log of all admin actions
-- ============================================================
CREATE TABLE IF NOT EXISTS "AdminAuditLog" (
  "id"         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "adminId"    UUID NOT NULL REFERENCES "User"("id"),
  "action"     TEXT NOT NULL,
  "targetId"   UUID,
  "targetType" TEXT,
  "details"    JSONB,
  "createdAt"  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "AAL_adminId_idx" ON "AdminAuditLog" ("adminId");
CREATE INDEX IF NOT EXISTS "AAL_action_idx" ON "AdminAuditLog" ("action");
CREATE INDEX IF NOT EXISTS "AAL_createdAt_idx" ON "AdminAuditLog" ("createdAt");

-- ============================================================
-- Notification: in-app notifications for users
-- ============================================================
CREATE TABLE IF NOT EXISTS "Notification" (
  "id"        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId"    UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "type"      TEXT NOT NULL,
  "title"     TEXT NOT NULL,
  "message"   TEXT NOT NULL,
  "isRead"    BOOLEAN NOT NULL DEFAULT FALSE,
  "metadata"  JSONB,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "Notif_userId_isRead_idx" ON "Notification" ("userId", "isRead");
