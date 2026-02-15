-- Migration 003: Critical Hardening Fixes
-- Description: Split referral flags, deviceId uniqueness, monotonic settlement guard
-- Run AFTER 001 and 002 migrations

BEGIN;

-- ================================================================
-- Fix #1: Split referralRewarded into two explicit economic flags
-- ================================================================

-- New user's signup bonus flag (replaces old referralRewarded for signup context)
ALTER TABLE "User"
ADD COLUMN IF NOT EXISTS "newUserBonusGranted" BOOLEAN NOT NULL DEFAULT FALSE;

-- Referrer's deferred bonus flag (idempotency guard for 3-task credit)
ALTER TABLE "User"
ADD COLUMN IF NOT EXISTS "referrerBonusGranted" BOOLEAN NOT NULL DEFAULT FALSE;

-- Backfill: users who already had referralRewarded = true get newUserBonusGranted = true
-- (referrerBonusGranted stays false — we can't know if the old code credited them)
UPDATE "User"
SET "newUserBonusGranted" = TRUE
WHERE "referralRewarded" = TRUE;

-- Note: We keep referralRewarded for backward compatibility, don't drop it yet


-- ================================================================
-- Fix #2: DB-level deviceId uniqueness (prevents race conditions)
-- ================================================================

-- Partial unique index: only enforced when deviceId is NOT NULL
CREATE UNIQUE INDEX IF NOT EXISTS "unique_device_id"
ON "User"("deviceId")
WHERE "deviceId" IS NOT NULL;


-- ================================================================
-- Fix #3: Monotonic settlement guard (appliedAt on penalty batch)
-- ================================================================

-- A batch can never modify balance more than once.
-- appliedAt IS NULL → balance hasn't been touched yet
ALTER TABLE "ReferralPenaltyBatch"
ADD COLUMN IF NOT EXISTS "appliedAt" TIMESTAMP;


COMMIT;
