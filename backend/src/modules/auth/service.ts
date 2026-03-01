import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";
import { randomInt } from "crypto";
import { db } from "../../shared/database/db";
import { SignupInput, LoginInput } from "./schema";
import { env } from "../../config/env";
import {
  ConflictError,
  BadRequestError,
  InternalServerError,
  InvalidCredentialsError,
  AccountLockedError,
  TooManyRequestsError,
} from "../../shared/errors";
import { verifyRecaptcha, RECAPTCHA_MIN_SCORE } from "../../shared/recaptcha";
import { lazySettleIfDue } from "../admin/penalty.service";
import {
  clearLoginAttemptState,
  getRemainingLoginBlockSeconds,
  recordFailedLoginAttempt,
} from "./throttle";
import { evaluateAuthRisk, logAuthRiskEvent } from "./risk";

type AuthRequestContext = {
  ip?: string;
  userAgent?: string;
  headers?: Record<string, unknown>;
  deviceId?: string;
};

const BCRYPT_SALT_ROUNDS = 10;
const DUMMY_BCRYPT_HASH =
  "$2b$10$7EqJtq98hPqEX7fNZaFWoOHiD8WfY9qsK0kGugHgdGXN53BJ38qJm";
const GENERIC_LOGIN_ERROR = "Invalid email or password. Please try again.";

async function safeEvaluateRisk(
  action: "signup" | "login",
  context: {
    identifier?: string;
    userId?: string;
    ip?: string;
    userAgent?: string;
    deviceId?: string;
    headers?: Record<string, unknown>;
  },
) {
  try {
    return await evaluateAuthRisk({
      action,
      identifier: context.identifier,
      userId: context.userId,
      ip: context.ip,
      userAgent: context.userAgent,
      deviceId: context.deviceId,
      headers: context.headers,
    });
  } catch {
    return {
      score: 0,
      blocked: false,
      requiresStepUp: false,
      reasons: ["risk_eval_unavailable"],
      metadata: {},
    };
  }
}

const loginUserSelect = {
  id: true,
  email: true,
  password: true,
  username: true,
  walletAddress: true,
  role: true,
  pxpBalance: true,
  referralCode: true,
  createdAt: true,
  lastBonusClaim: true,
  dailyStreak: true,
  lastActivityDate: true,
  isBanned: true,
  banReason: true,
  bannedAt: true,
  accountStatus: true,
  reviewEndsAt: true,
  tokenVersion: true,
} as const;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizeOptionalString(value: string | null | undefined) {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function normalizeDeviceId(raw: string | undefined | null): string | null {
  if (!raw) return null;
  const trimmed = raw.trim().toLowerCase();
  if (trimmed.length < 8 || trimmed.length > 128) return null;
  if (/^0+$/.test(trimmed) || /^test/.test(trimmed)) return null;
  return trimmed;
}

function normalizeReferralCode(raw: string | undefined) {
  const value = raw?.trim().toUpperCase();
  return value || null;
}

function getPepperedPassword(password: string) {
  return password + env.PASSWORD_PEPPER;
}

async function assertHumanVerification(
  token: string | undefined,
  action: "signup" | "login",
  requestIp?: string,
) {
  const tokenRequired = env.NODE_ENV === "production";

  if (!token) {
    if (tokenRequired) {
      throw new BadRequestError("Security verification is required.");
    }
    return;
  }

  const { success, score, error } = await verifyRecaptcha(token, action, requestIp);
  if (!success || score < RECAPTCHA_MIN_SCORE) {
    throw new BadRequestError(
      error || "Security verification failed. Please try again.",
    );
  }
}

function mapUniqueConstraintToConflict(
  error: Prisma.PrismaClientKnownRequestError,
) {
  const target = (error.meta as { target?: string[] | string } | undefined)
    ?.target;
  const targetString = Array.isArray(target)
    ? target.join(",")
    : String(target || "");
  const normalized = targetString.toLowerCase();

  if (normalized.includes("email")) {
    return new ConflictError("Email already registered");
  }
  if (normalized.includes("username")) {
    return new ConflictError("Username already taken");
  }
  if (normalized.includes("walletaddress")) {
    return new ConflictError("Wallet already linked");
  }
  if (normalized.includes("deviceid") || normalized.includes("unique_device_id")) {
    return new ConflictError(
      "You can no longer create another account on this device. Try logging in on your previous account.",
    );
  }

  return new ConflictError("User already exists");
}

async function generateReferralCode() {
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

  for (let attempt = 0; attempt < 5; attempt++) {
    let randomPart = "";
    for (let i = 0; i < 6; i++) {
      randomPart += chars.charAt(randomInt(chars.length));
    }

    const code = `PNX-${randomPart}`;
    const existing = await db.user.findUnique({
      where: { referralCode: code },
      select: { id: true },
    });

    if (!existing) return code;
  }

  return `PNX-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}

export async function createUser(
  input: SignupInput,
  requestContext?: AuthRequestContext,
) {
  const signupRiskContext: AuthRequestContext = {
    ip: requestContext?.ip,
    userAgent: requestContext?.userAgent,
    headers: requestContext?.headers,
    deviceId: input.deviceId,
  };
  const signupRisk = await safeEvaluateRisk("signup", {
    identifier: input.email,
    ip: signupRiskContext.ip,
    userAgent: signupRiskContext.userAgent,
    deviceId: signupRiskContext.deviceId,
    headers: signupRiskContext.headers,
  });

  if (signupRisk.blocked) {
    await logAuthRiskEvent(
      {
        action: "signup",
        identifier: input.email,
        ip: signupRiskContext.ip,
        userAgent: signupRiskContext.userAgent,
        deviceId: signupRiskContext.deviceId,
        headers: signupRiskContext.headers,
      },
      signupRisk,
    );
    throw new TooManyRequestsError(
      "Security policy blocked this request. Please try again later.",
    );
  }

  if (signupRisk.requiresStepUp && !input.recaptchaToken) {
    await logAuthRiskEvent(
      {
        action: "signup",
        identifier: input.email,
        ip: signupRiskContext.ip,
        userAgent: signupRiskContext.userAgent,
        deviceId: signupRiskContext.deviceId,
        headers: signupRiskContext.headers,
      },
      signupRisk,
    );
    throw new BadRequestError("Additional security verification is required.");
  }

  await assertHumanVerification(input.recaptchaToken, "signup", requestContext?.ip);

  const email = normalizeEmail(input.email);
  const username = normalizeOptionalString(input.username);
  const walletAddress = normalizeOptionalString(input.walletAddress);
  const normalizedDeviceId = normalizeDeviceId(input.deviceId);
  const normalizedReferralCode = normalizeReferralCode(input.referralCode);

  if (normalizedDeviceId) {
    const deviceOwner = await db.user.findFirst({
      where: { deviceId: normalizedDeviceId },
      select: { id: true },
    });

    if (deviceOwner) {
      throw new ConflictError(
        "You can no longer create another account on this device. Try logging in on your previous account.",
      );
    }
  }

  try {
    const [referrer, hashedPassword, referralCode] = await Promise.all([
      normalizedReferralCode
        ? db.user.findUnique({
            where: { referralCode: normalizedReferralCode },
            select: { id: true },
          })
        : Promise.resolve(null),
      bcrypt.hash(getPepperedPassword(input.password), BCRYPT_SALT_ROUNDS),
      generateReferralCode(),
    ]);

    return await db.$transaction(async (tx: any) => {
      const created = await tx.user.create({
        data: {
          email,
          username,
          walletAddress,
          password: hashedPassword,
          referredById: referrer?.id ?? null,
          referralCode,
          ...(normalizedDeviceId ? { deviceId: normalizedDeviceId } : {}),
        },
        select: {
          id: true,
          email: true,
          username: true,
          walletAddress: true,
          role: true,
          pxpBalance: true,
          referralCode: true,
          referredById: true,
          referredBy: { select: { id: true, username: true } },
          createdAt: true,
          lastBonusClaim: true,
          dailyStreak: true,
          lastActivityDate: true,
          isBanned: true,
          banReason: true,
          bannedAt: true,
          tokenVersion: true,
          newUserBonusGranted: true,
        },
      });

      let updatedBalance = created.pxpBalance;
      let wasReferred = false;
      let rewardsApplied: { newUser: number; referrer: string } | null = null;

      if (created.referredById && !created.newUserBonusGranted) {
        const bonusPoints = 75;
        const updated = await tx.user.update({
          where: { id: created.id },
          data: {
            pxpBalance: { increment: bonusPoints },
            newUserBonusGranted: true,
          },
          select: { pxpBalance: true },
        });

        updatedBalance = updated.pxpBalance;
        wasReferred = true;
        rewardsApplied = {
          newUser: bonusPoints,
          referrer: "deferred_until_3_tasks",
        };
      }

      const { newUserBonusGranted: _newUserBonusGranted, ...safeCreated } = created;

      return {
        ...safeCreated,
        pxpBalance: updatedBalance,
        wasReferred,
        rewardsApplied,
      };
    });
  } catch (error: any) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw mapUniqueConstraintToConflict(error);
    }

    if (error instanceof ConflictError || error instanceof BadRequestError) {
      throw error;
    }

    console.error("[AUTH] createUser failed:", error?.message || error);
    throw new InternalServerError();
  } finally {
    await logAuthRiskEvent(
      {
        action: "signup",
        identifier: input.email,
        ip: requestContext?.ip,
        userAgent: requestContext?.userAgent,
        deviceId: input.deviceId,
        headers: requestContext?.headers,
      },
      signupRisk,
    );
  }
}

async function recordFailure(identifier: string, requestIp?: string) {
  try {
    await recordFailedLoginAttempt(identifier, requestIp);
  } catch {
    // Non-fatal: do not leak internals or block auth flow.
  }
}

async function clearFailures(identifier: string, requestIp?: string) {
  try {
    await clearLoginAttemptState(identifier, requestIp);
  } catch {
    // Non-fatal.
  }
}

export async function loginUser(
  input: LoginInput,
  requestContext?: AuthRequestContext,
) {
  // Wallet flow intentionally unsupported on this endpoint until signature
  // verification is implemented server-side.
  if (input.walletAddress || input.signature) {
    throw new BadRequestError(
      "Wallet login is not enabled on this endpoint. Use email/username login.",
    );
  }

  const identifierRaw = (input.identifier || input.email || "").trim();
  const password = input.password || "";

  if (!identifierRaw || !password) {
    throw new BadRequestError("Email/Username and password required.");
  }

  const isEmailLogin = identifierRaw.includes("@");
  const normalizedIdentifier = isEmailLogin
    ? identifierRaw.toLowerCase()
    : identifierRaw;

  const blockSeconds = await getRemainingLoginBlockSeconds(
    normalizedIdentifier,
    requestContext?.ip,
  );
  if (blockSeconds > 0) {
    const minutes = Math.max(1, Math.ceil(blockSeconds / 60));
    throw new TooManyRequestsError(
      `Too many failed login attempts. Please try again in ${minutes} minute(s).`,
    );
  }

  const loginRisk = await safeEvaluateRisk("login", {
    identifier: normalizedIdentifier,
    ip: requestContext?.ip,
    userAgent: requestContext?.userAgent,
    headers: requestContext?.headers,
    deviceId: requestContext?.deviceId,
  });

  if (loginRisk.blocked) {
    await logAuthRiskEvent(
      {
        action: "login",
        identifier: normalizedIdentifier,
        ip: requestContext?.ip,
        userAgent: requestContext?.userAgent,
        headers: requestContext?.headers,
        deviceId: requestContext?.deviceId,
      },
      loginRisk,
    );
    throw new TooManyRequestsError(
      "Security policy blocked this request. Please try again later.",
    );
  }

  if (loginRisk.requiresStepUp && !input.recaptchaToken) {
    await logAuthRiskEvent(
      {
        action: "login",
        identifier: normalizedIdentifier,
        ip: requestContext?.ip,
        userAgent: requestContext?.userAgent,
        headers: requestContext?.headers,
        deviceId: requestContext?.deviceId,
      },
      loginRisk,
    );
    throw new BadRequestError("Additional security verification is required.");
  }

  let user = await Promise.all([
    assertHumanVerification(input.recaptchaToken, "login", requestContext?.ip),
    db.user.findFirst({
      where: isEmailLogin
        ? { email: normalizedIdentifier }
        : { username: normalizedIdentifier },
      select: loginUserSelect,
    }),
  ]).then(([, foundUser]) => foundUser);

  if (!user) {
    await bcrypt.compare(getPepperedPassword(password), DUMMY_BCRYPT_HASH);
    await recordFailure(normalizedIdentifier, requestContext?.ip);
    await logAuthRiskEvent(
      {
        action: "login",
        identifier: normalizedIdentifier,
        ip: requestContext?.ip,
        userAgent: requestContext?.userAgent,
        headers: requestContext?.headers,
        deviceId: requestContext?.deviceId,
      },
      loginRisk,
    );
    throw new InvalidCredentialsError(GENERIC_LOGIN_ERROR);
  }

  if (user.isBanned || user.accountStatus === "BANNED") {
    throw new InvalidCredentialsError(
      `Account suspended: ${user.banReason || "Violation of terms"}`,
    );
  }

  if (user.accountStatus === "UNDER_REVIEW") {
    if (user.reviewEndsAt && new Date() >= new Date(user.reviewEndsAt)) {
      const settled = await lazySettleIfDue(user.id);
      if (!settled) {
        throw new AccountLockedError(user.reviewEndsAt);
      }

      const refreshed = await db.user.findUnique({
        where: { id: user.id },
        select: loginUserSelect,
      });

      if (
        !refreshed ||
        refreshed.isBanned ||
        refreshed.accountStatus !== "ACTIVE"
      ) {
        throw new AccountLockedError(null);
      }

      user = refreshed;
    } else {
      throw new AccountLockedError(user.reviewEndsAt);
    }
  }

  if (!user.password) {
    await recordFailure(normalizedIdentifier, requestContext?.ip);
    await logAuthRiskEvent(
      {
        action: "login",
        userId: user.id,
        identifier: normalizedIdentifier,
        ip: requestContext?.ip,
        userAgent: requestContext?.userAgent,
        headers: requestContext?.headers,
        deviceId: requestContext?.deviceId,
      },
      loginRisk,
    );
    throw new InvalidCredentialsError(GENERIC_LOGIN_ERROR);
  }

  const peppered = getPepperedPassword(password);
  let validPassword = await bcrypt.compare(peppered, user.password);
  const userId = user.id;

  if (!validPassword) {
    const legacyValid = await bcrypt.compare(password, user.password);
    if (legacyValid) {
      validPassword = true;
      bcrypt
        .hash(peppered, BCRYPT_SALT_ROUNDS)
        .then((hash) =>
          db.user.update({
            where: { id: userId },
            data: { password: hash },
            select: { id: true },
          }),
        )
        .catch(() => {
          // Non-fatal background upgrade.
        });
    }
  }

  if (!validPassword) {
    await recordFailure(normalizedIdentifier, requestContext?.ip);
    await logAuthRiskEvent(
      {
        action: "login",
        userId: user.id,
        identifier: normalizedIdentifier,
        ip: requestContext?.ip,
        userAgent: requestContext?.userAgent,
        headers: requestContext?.headers,
        deviceId: requestContext?.deviceId,
      },
      loginRisk,
    );
    throw new InvalidCredentialsError(GENERIC_LOGIN_ERROR);
  }

  await clearFailures(normalizedIdentifier, requestContext?.ip);
  await logAuthRiskEvent(
    {
      action: "login",
      userId: user.id,
      identifier: normalizedIdentifier,
      ip: requestContext?.ip,
      userAgent: requestContext?.userAgent,
      headers: requestContext?.headers,
      deviceId: requestContext?.deviceId,
    },
    loginRisk,
  );
  return user;
}

export async function checkReferralCode(code: string) {
  const normalizedCode = normalizeReferralCode(code);
  if (!normalizedCode) return false;

  const user = await db.user.findUnique({
    where: { referralCode: normalizedCode },
    select: { id: true },
  });
  return !!user;
}
