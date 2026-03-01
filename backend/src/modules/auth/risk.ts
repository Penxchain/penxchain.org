import { createHash } from "crypto";
import { db } from "../../shared/database/db";

export type AuthRiskAction = "signup" | "login" | "refresh";

export type AuthRiskContext = {
  action: AuthRiskAction;
  userId?: string;
  identifier?: string;
  ip?: string;
  userAgent?: string;
  deviceId?: string;
  headers?: Record<string, unknown>;
};

export type AuthRiskDecision = {
  score: number;
  blocked: boolean;
  requiresStepUp: boolean;
  reasons: string[];
  metadata?: {
    latitude?: number;
    longitude?: number;
    countryCode?: string;
  };
};

const BOT_UA_PATTERN =
  /(bot|crawler|spider|scraper|python|curl|wget|postman|insomnia|headless)/i;
const HIGH_RISK_SCORE = 80;
const STEP_UP_SCORE = 45;

function hashValue(value?: string | null) {
  if (!value) return null;
  return createHash("sha256").update(value).digest("hex");
}

function headerValue(headers: Record<string, unknown> | undefined, key: string) {
  if (!headers) return undefined;
  const direct = headers[key] ?? headers[key.toLowerCase()];
  if (Array.isArray(direct)) return String(direct[0] ?? "");
  if (typeof direct === "string") return direct;
  return undefined;
}

function parseGeo(headers: Record<string, unknown> | undefined) {
  const latRaw = headerValue(headers, "x-geo-lat");
  const lonRaw = headerValue(headers, "x-geo-lon");
  const countryCodeRaw = headerValue(headers, "x-geo-country");

  const latitude = latRaw ? Number(latRaw) : undefined;
  const longitude = lonRaw ? Number(lonRaw) : undefined;
  const countryCode = countryCodeRaw?.trim()?.toUpperCase() || undefined;

  const hasValidCoords =
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    Math.abs(latitude as number) <= 90 &&
    Math.abs(longitude as number) <= 180;

  return {
    latitude: hasValidCoords ? (latitude as number) : undefined,
    longitude: hasValidCoords ? (longitude as number) : undefined,
    countryCode,
  };
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const earthKm = 6371;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthKm * c;
}

export async function evaluateAuthRisk(
  context: AuthRiskContext,
): Promise<AuthRiskDecision> {
  let score = 0;
  const reasons: string[] = [];

  const ua = context.userAgent?.trim();
  const ip = context.ip?.trim();
  const deviceId = context.deviceId?.trim();
  const geo = parseGeo(context.headers);

  if (!ua) {
    score += 15;
    reasons.push("missing_user_agent");
  } else if (BOT_UA_PATTERN.test(ua)) {
    score += 55;
    reasons.push("bot_like_user_agent");
  }

  if (!ip) {
    score += 15;
    reasons.push("missing_ip");
  }

  if (context.action === "signup" && !deviceId) {
    score += 20;
    reasons.push("missing_device_id");
  }

  if (geo.countryCode === "ZZ") {
    score += 10;
    reasons.push("invalid_country_code");
  }

  // Impossible travel hook: only active when geo headers are available.
  if (geo.latitude !== undefined && geo.longitude !== undefined) {
    const identifierHash = hashValue(context.identifier?.toLowerCase());
    const where = context.userId
      ? { userId: context.userId }
      : identifierHash
        ? { identifierHash }
        : null;

    if (where) {
      const previous = await db.authSecurityEvent.findFirst({
        where: {
          ...where,
          blocked: false,
          latitude: { not: null },
          longitude: { not: null },
        },
        orderBy: { createdAt: "desc" },
        select: {
          latitude: true,
          longitude: true,
          createdAt: true,
        },
      });

      if (
        previous &&
        previous.latitude !== null &&
        previous.longitude !== null
      ) {
        const distanceKm = haversineKm(
          previous.latitude as number,
          previous.longitude as number,
          geo.latitude,
          geo.longitude,
        );
        const elapsedHours =
          (Date.now() - new Date(previous.createdAt).getTime()) / 3_600_000;

        if (elapsedHours > 0 && elapsedHours < 6) {
          const impliedSpeed = distanceKm / elapsedHours;
          if (impliedSpeed > 900) {
            score += 70;
            reasons.push("impossible_travel");
          }
        }
      }
    }
  }

  return {
    score,
    blocked: score >= HIGH_RISK_SCORE,
    requiresStepUp: score >= STEP_UP_SCORE,
    reasons,
    metadata: geo,
  };
}

export async function logAuthRiskEvent(
  context: AuthRiskContext,
  decision: AuthRiskDecision,
): Promise<void> {
  try {
    await db.authSecurityEvent.create({
      data: {
        userId: context.userId ?? null,
        identifierHash: hashValue(context.identifier?.toLowerCase()),
        action: context.action,
        ipHash: hashValue(context.ip),
        deviceHash: hashValue(context.deviceId),
        userAgentHash: hashValue(context.userAgent),
        riskScore: decision.score,
        blocked: decision.blocked,
        reasons: decision.reasons,
        latitude: decision.metadata?.latitude ?? null,
        longitude: decision.metadata?.longitude ?? null,
        countryCode: decision.metadata?.countryCode ?? null,
      },
    });
  } catch {
    // Non-fatal telemetry path.
  }
}
