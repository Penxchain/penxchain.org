-- ============================================================================
-- PENXCHAIN WAITLIST HARDENING — COMPLETE MIGRATION (SAFE & IDEMPOTENT)
-- ============================================================================

-- Ensure UUID generation works
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- MIGRATION 1: User Account State (idempotent + safe)
-- ============================================================================

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "accountStatus" TEXT NOT NULL DEFAULT 'ACTIVE';
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "reviewEndsAt" TIMESTAMPTZ;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "tokenVersion" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "tasksCompletedCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "newUserBonusGranted" BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "referrerBonusGranted" BOOLEAN NOT NULL DEFAULT FALSE;

-- Data Sync: Initialize new flags from legacy referralRewarded flag
-- This ensures existing referred users who already got their signup bonus aren't re-rewarded,
-- and allows their referrers to eventually get the deferred bonus if eligible.
UPDATE "User" 
SET "newUserBonusGranted" = TRUE 
WHERE "referralRewarded" = TRUE 
  AND "referredById" IS NOT NULL
  AND "newUserBonusGranted" = FALSE;


-- accountStatus CHECK constraint (guarded)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'account_status_check'
  ) THEN
    ALTER TABLE "User" ADD CONSTRAINT "account_status_check"
      CHECK ("accountStatus" IN ('ACTIVE', 'UNDER_REVIEW', 'BANNED'));
  END IF;
END $$;

-- Indexes (guarded)
CREATE INDEX IF NOT EXISTS "User_accountStatus_idx" ON "User" ("accountStatus");
CREATE INDEX IF NOT EXISTS "User_reviewEndsAt_idx" ON "User" ("reviewEndsAt");
-- Device ID unique index (Partial)
-- WARNING: This index creation helps enforcement but WILL FAIL if duplicates exist.
-- We are commenting it out temporarily to allow the migration to run. 
-- Once you have used the Admin Panel (Duplicates Tab) to ban/resolve duplicates, 
-- you should UNCOMMENT this and run it manually or in a future migration.
-- CREATE UNIQUE INDEX IF NOT EXISTS "unique_device_id" ON "User"("deviceId") WHERE "deviceId" IS NOT NULL;

-- ============================================================================
-- MIGRATION 2: Penalty + Audit + Notification Tables (idempotent + safe)
-- ============================================================================

CREATE TABLE IF NOT EXISTS "ReferralPenaltyBatch" (
  "id"               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "referrerId"       TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "status"           TEXT NOT NULL DEFAULT 'PENDING',
  "totalPxpDeducted" INTEGER NOT NULL DEFAULT 0,
  "bannedCount"      INTEGER NOT NULL DEFAULT 0,
  "windowStartsAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "windowEndsAt"     TIMESTAMPTZ NOT NULL,
  "settledAt"        TIMESTAMPTZ,
  "settledByAdminId" TEXT REFERENCES "User"("id"),
  "notificationSent" BOOLEAN NOT NULL DEFAULT FALSE,
  "appliedAt"        TIMESTAMPTZ, -- Monotonic settlement guard
  "createdAt"        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- status CHECK constraint for batch (guarded)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'rpb_status_check'
  ) THEN
    ALTER TABLE "ReferralPenaltyBatch" ADD CONSTRAINT "rpb_status_check"
      CHECK ("status" IN ('PENDING','SETTLING','SETTLED','FAILED','CANCELLED'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "RPB_referrerId_idx" ON "ReferralPenaltyBatch" ("referrerId");
CREATE INDEX IF NOT EXISTS "RPB_status_idx" ON "ReferralPenaltyBatch" ("status");
CREATE INDEX IF NOT EXISTS "RPB_windowEndsAt_idx" ON "ReferralPenaltyBatch" ("windowEndsAt");

CREATE TABLE IF NOT EXISTS "ReferralPenaltyEvent" (
  "id"             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "batchId"        UUID NOT NULL REFERENCES "ReferralPenaltyBatch"("id") ON DELETE CASCADE,
  "referrerId"     TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "bannedUserId"   TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "bannedUsername" TEXT,
  "banReason"      TEXT NOT NULL,
  "pxpDeducted"    INTEGER NOT NULL DEFAULT 150,
  "adminId"        TEXT NOT NULL REFERENCES "User"("id"),
  "createdAt"      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS "RPE_bannedUserId_unique" ON "ReferralPenaltyEvent" ("bannedUserId");
CREATE INDEX IF NOT EXISTS "RPE_batchId_idx" ON "ReferralPenaltyEvent" ("batchId");

CREATE TABLE IF NOT EXISTS "AdminAuditLog" (
  "id"         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "adminId"    TEXT NOT NULL REFERENCES "User"("id"),
  "action"     TEXT NOT NULL,
  "targetId"   TEXT,
  "targetType" TEXT,
  "details"    JSONB,
  "createdAt"  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "AAL_adminId_idx" ON "AdminAuditLog" ("adminId");
CREATE INDEX IF NOT EXISTS "AAL_createdAt_idx" ON "AdminAuditLog" ("createdAt");

CREATE TABLE IF NOT EXISTS "Notification" (
  "id"        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId"    TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "type"      TEXT NOT NULL,
  "title"     TEXT NOT NULL,
  "message"   TEXT NOT NULL,
  "isRead"    BOOLEAN NOT NULL DEFAULT FALSE,
  "metadata"  JSONB,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "Notif_userId_isRead_idx" ON "Notification" ("userId", "isRead");
CREATE INDEX IF NOT EXISTS "Notif_userId_createdAt_idx" ON "Notification" ("userId", "createdAt" DESC);

-- ============================================================================
-- STRICT DEVICE ID ENFORCEMENT
-- ============================================================================

CREATE OR REPLACE FUNCTION enforce_device_id_on_user_insert()
RETURNS trigger AS $$
BEGIN
  IF NEW."deviceId" IS NULL OR length(trim(NEW."deviceId")) = 0 THEN
    RAISE EXCEPTION 'deviceId is required';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS user_device_id_required ON "User";

CREATE TRIGGER user_device_id_required
BEFORE INSERT ON "User"
FOR EACH ROW
EXECUTE FUNCTION enforce_device_id_on_user_insert();


COMMIT;
