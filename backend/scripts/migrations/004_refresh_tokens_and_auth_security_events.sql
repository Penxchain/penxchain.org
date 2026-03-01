-- Migration 004: Refresh token rotation + auth security telemetry
-- Run after 003_critical_hardening_fixes.sql

BEGIN;

CREATE TABLE IF NOT EXISTS "RefreshToken" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "tokenHash" TEXT NOT NULL UNIQUE,
  "familyId" TEXT NOT NULL,
  "tokenVersion" INTEGER NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "lastUsedAt" TIMESTAMP,
  "expiresAt" TIMESTAMP NOT NULL,
  "revokedAt" TIMESTAMP,
  "revokedReason" TEXT,
  "replacedByTokenId" TEXT,
  "createdByIpHash" TEXT,
  "userAgentHash" TEXT,
  CONSTRAINT "RefreshToken_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id")
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "RefreshToken_userId_idx" ON "RefreshToken" ("userId");
CREATE INDEX IF NOT EXISTS "RefreshToken_familyId_idx" ON "RefreshToken" ("familyId");
CREATE INDEX IF NOT EXISTS "RefreshToken_expiresAt_idx" ON "RefreshToken" ("expiresAt");
CREATE INDEX IF NOT EXISTS "RefreshToken_revokedAt_idx" ON "RefreshToken" ("revokedAt");

CREATE TABLE IF NOT EXISTS "AuthSecurityEvent" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT,
  "identifierHash" TEXT,
  "action" TEXT NOT NULL,
  "ipHash" TEXT,
  "deviceHash" TEXT,
  "userAgentHash" TEXT,
  "riskScore" INTEGER NOT NULL DEFAULT 0,
  "blocked" BOOLEAN NOT NULL DEFAULT FALSE,
  "reasons" JSONB,
  "latitude" DOUBLE PRECISION,
  "longitude" DOUBLE PRECISION,
  "countryCode" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT "AuthSecurityEvent_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id")
    ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "AuthSecurityEvent_userId_createdAt_idx" ON "AuthSecurityEvent" ("userId", "createdAt");
CREATE INDEX IF NOT EXISTS "AuthSecurityEvent_identifierHash_createdAt_idx" ON "AuthSecurityEvent" ("identifierHash", "createdAt");
CREATE INDEX IF NOT EXISTS "AuthSecurityEvent_ipHash_createdAt_idx" ON "AuthSecurityEvent" ("ipHash", "createdAt");
CREATE INDEX IF NOT EXISTS "AuthSecurityEvent_action_createdAt_idx" ON "AuthSecurityEvent" ("action", "createdAt");

COMMIT;
