-- Migration 001: Add account status, review timer, token version, and task counter
-- Run on Supabase (PostgreSQL). Backward compatible — all columns have defaults.

-- Account status: TEXT + CHECK (extensible, no ENUM rigidity)
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "accountStatus" TEXT NOT NULL DEFAULT 'ACTIVE';
ALTER TABLE "User" ADD CONSTRAINT "account_status_check"
  CHECK ("accountStatus" IN ('ACTIVE', 'UNDER_REVIEW', 'BANNED'));

-- Review window end time (for UNDER_REVIEW state)
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "reviewEndsAt" TIMESTAMPTZ;

-- Token version for session invalidation (increment to kill all sessions)
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "tokenVersion" INTEGER NOT NULL DEFAULT 0;

-- Task counter for deferred referral rewards (credit referrer after 3 tasks)
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "tasksCompletedCount" INTEGER NOT NULL DEFAULT 0;

-- Indexes for filtering
CREATE INDEX IF NOT EXISTS "User_accountStatus_idx" ON "User" ("accountStatus");
CREATE INDEX IF NOT EXISTS "User_reviewEndsAt_idx" ON "User" ("reviewEndsAt");
