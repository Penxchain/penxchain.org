import { createHash, randomBytes, randomUUID } from "crypto";
import { FastifyReply, FastifyRequest } from "fastify";
import { db } from "../../shared/database/db";
import { env } from "../../config/env";
import {
  ForbiddenError,
  UnauthorizedError,
  InternalServerError,
} from "../../shared/errors";
import { evaluateAuthRisk, logAuthRiskEvent } from "./risk";

type SessionContext = {
  ip?: string;
  userAgent?: string;
  headers?: Record<string, unknown>;
};

const REFRESH_COOKIE_NAME = env.REFRESH_COOKIE_NAME;
const REFRESH_TTL_MS = env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000;
const REVOKED_RETENTION_MS =
  env.REFRESH_REVOKED_RETENTION_DAYS * 24 * 60 * 60 * 1000;

function getCookieDomain() {
  const domain = env.REFRESH_COOKIE_DOMAIN?.trim();
  return domain ? domain : undefined;
}

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function hashWithSecret(value?: string) {
  if (!value) return null;
  const salt = env.REFRESH_TOKEN_SECRET || env.JWT_SECRET;
  return sha256(`${salt}:${value}`);
}

function parseCookies(cookieHeader?: string) {
  const parsed: Record<string, string> = {};
  if (!cookieHeader) return parsed;

  for (const pair of cookieHeader.split(";")) {
    const [rawName, ...rawValue] = pair.split("=");
    const name = rawName?.trim();
    if (!name) continue;
    try {
      parsed[name] = decodeURIComponent(rawValue.join("=").trim());
    } catch {
      parsed[name] = rawValue.join("=").trim();
    }
  }
  return parsed;
}

function buildRefreshCookie(value: string, maxAgeSeconds: number) {
  const parts = [
    `${REFRESH_COOKIE_NAME}=${encodeURIComponent(value)}`,
    "Path=/auth",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${Math.max(0, Math.floor(maxAgeSeconds))}`,
  ];

  if (env.NODE_ENV === "production") {
    parts.push("Secure");
  }

  const domain = getCookieDomain();
  if (domain) {
    parts.push(`Domain=${domain}`);
  }

  return parts.join("; ");
}

function appendSetCookie(reply: FastifyReply, value: string) {
  const existing = reply.getHeader("Set-Cookie");
  if (!existing) {
    reply.header("Set-Cookie", value);
    return;
  }
  if (Array.isArray(existing)) {
    reply.header("Set-Cookie", [...existing, value]);
    return;
  }
  reply.header("Set-Cookie", [String(existing), value]);
}

function buildRefreshToken() {
  const id = randomUUID();
  const secret = randomBytes(48).toString("base64url");
  const raw = `${id}.${secret}`;
  return {
    id,
    raw,
    tokenHash: sha256(raw),
  };
}

export function setRefreshCookie(reply: FastifyReply, refreshToken: string) {
  appendSetCookie(reply, buildRefreshCookie(refreshToken, REFRESH_TTL_MS / 1000));
}

export function clearRefreshCookie(reply: FastifyReply) {
  appendSetCookie(reply, buildRefreshCookie("", 0));
}

export function readRefreshCookie(request: FastifyRequest) {
  const cookies = parseCookies(request.headers.cookie);
  return cookies[REFRESH_COOKIE_NAME] || null;
}

export async function issueRefreshToken(
  userId: string,
  tokenVersion: number,
  context: SessionContext,
  familyId?: string,
) {
  const token = buildRefreshToken();
  const expiresAt = new Date(Date.now() + REFRESH_TTL_MS);
  const resolvedFamilyId = familyId || token.id;

  await db.refreshToken.create({
    data: {
      id: token.id,
      userId,
      tokenHash: token.tokenHash,
      familyId: resolvedFamilyId,
      tokenVersion,
      expiresAt,
      createdByIpHash: hashWithSecret(context.ip),
      userAgentHash: hashWithSecret(context.userAgent),
    },
  });

  return {
    rawToken: token.raw,
    expiresAt,
    familyId: resolvedFamilyId,
    tokenId: token.id,
  };
}

async function revokeFamilyAndInvalidateSessions(
  userId: string,
  familyId: string,
  reason: string,
) {
  await db.$transaction(async (tx: any) => {
    await tx.refreshToken.updateMany({
      where: { familyId, revokedAt: null },
      data: {
        revokedAt: new Date(),
        revokedReason: reason,
      },
    });

    await tx.user.update({
      where: { id: userId },
      data: { tokenVersion: { increment: 1 } },
      select: { id: true },
    });
  });
}

export async function rotateRefreshToken(
  rawRefreshToken: string,
  context: SessionContext,
) {
  const tokenHash = sha256(rawRefreshToken);
  const existing = await db.refreshToken.findUnique({
    where: { tokenHash },
    include: {
      user: {
        select: {
          id: true,
          role: true,
          tokenVersion: true,
          isBanned: true,
          banReason: true,
          accountStatus: true,
        },
      },
    },
  });

  if (!existing) {
    throw new UnauthorizedError("Session invalidated. Please log in again.");
  }

  if (existing.revokedAt) {
    await revokeFamilyAndInvalidateSessions(
      existing.userId,
      existing.familyId,
      "REFRESH_TOKEN_REUSE_DETECTED",
    );
    throw new UnauthorizedError("Session invalidated. Please log in again.");
  }

  if (existing.expiresAt.getTime() <= Date.now()) {
    await db.refreshToken.update({
      where: { id: existing.id },
      data: {
        revokedAt: new Date(),
        revokedReason: "EXPIRED",
      },
    });
    throw new UnauthorizedError("Session expired. Please log in again.");
  }

  if (existing.user.isBanned || existing.user.accountStatus === "BANNED") {
    throw new ForbiddenError(
      `Account suspended: ${existing.user.banReason || "Violation of terms"}`,
    );
  }

  if (existing.user.tokenVersion !== existing.tokenVersion) {
    await db.refreshToken.update({
      where: { id: existing.id },
      data: {
        revokedAt: new Date(),
        revokedReason: "TOKEN_VERSION_MISMATCH",
      },
    });
    throw new UnauthorizedError("Session invalidated. Please log in again.");
  }

  const risk = await evaluateAuthRisk({
    action: "refresh",
    userId: existing.user.id,
    ip: context.ip,
    userAgent: context.userAgent,
    headers: context.headers,
  }).catch(() => ({
    score: 0,
    blocked: false,
    requiresStepUp: false,
    reasons: ["risk_eval_unavailable"],
    metadata: {},
  }));
  await logAuthRiskEvent(
    {
      action: "refresh",
      userId: existing.user.id,
      ip: context.ip,
      userAgent: context.userAgent,
      headers: context.headers,
    },
    risk,
  );

  if (risk.blocked) {
    throw new UnauthorizedError("Session invalidated. Please log in again.");
  }

  try {
    return await db.$transaction(async (tx: any) => {
      const next = buildRefreshToken();
      const nextExpiresAt = new Date(Date.now() + REFRESH_TTL_MS);

      await tx.refreshToken.update({
        where: { id: existing.id },
        data: {
          revokedAt: new Date(),
          revokedReason: "ROTATED",
          replacedByTokenId: next.id,
          lastUsedAt: new Date(),
        },
      });

      await tx.refreshToken.create({
        data: {
          id: next.id,
          userId: existing.userId,
          tokenHash: next.tokenHash,
          familyId: existing.familyId,
          tokenVersion: existing.user.tokenVersion,
          expiresAt: nextExpiresAt,
          createdByIpHash: hashWithSecret(context.ip),
          userAgentHash: hashWithSecret(context.userAgent),
        },
      });

      return {
        userId: existing.user.id,
        role: existing.user.role,
        tokenVersion: existing.user.tokenVersion,
        rawRefreshToken: next.raw,
        expiresAt: nextExpiresAt,
      };
    });
  } catch (error) {
    throw new InternalServerError();
  }
}

export async function revokeRefreshToken(rawRefreshToken: string | null) {
  if (!rawRefreshToken) return;
  const tokenHash = sha256(rawRefreshToken);
  try {
    await db.refreshToken.update({
      where: { tokenHash },
      data: {
        revokedAt: new Date(),
        revokedReason: "LOGOUT",
      },
    });
  } catch {
    // non-fatal
  }
}

export async function revokeAllUserSessions(
  userId: string,
  reason = "LOGOUT_ALL",
) {
  await db.$transaction(async (tx: any) => {
    await tx.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
        revokedReason: reason,
      },
    });

    await tx.user.update({
      where: { id: userId },
      data: {
        tokenVersion: { increment: 1 },
      },
      select: { id: true, tokenVersion: true },
    });
  });
}

export async function cleanupRefreshTokens() {
  const now = new Date();
  const revokedCutoff = new Date(Date.now() - REVOKED_RETENTION_MS);

  const [expiredDeleted, revokedDeleted] = await Promise.all([
    db.refreshToken.deleteMany({
      where: {
        expiresAt: { lt: now },
      },
    }),
    db.refreshToken.deleteMany({
      where: {
        revokedAt: {
          not: null,
          lt: revokedCutoff,
        },
      },
    }),
  ]);

  return {
    expiredDeleted: expiredDeleted.count,
    revokedDeleted: revokedDeleted.count,
    totalDeleted: expiredDeleted.count + revokedDeleted.count,
  };
}
