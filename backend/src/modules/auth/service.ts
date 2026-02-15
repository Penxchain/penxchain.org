import { db } from "../../shared/database/db";
import { SignupInput, LoginInput } from "./schema";
import bcrypt from "bcrypt";
import { env } from "../../config/env";
import {
  ConflictError,
  BadRequestError,
  InternalServerError,
  InvalidCredentialsError,
  AccountLockedError,
} from "../../shared/errors";
import { verifyRecaptcha, RECAPTCHA_MIN_SCORE } from "../../shared/recaptcha";
import { Prisma } from "@prisma/client";
import { lazySettleIfDue } from "../admin/penalty.service";

// Fix #6: Normalize deviceId server-side to prevent spoofing via whitespace/case variants
function normalizeDeviceId(raw: string | undefined | null): string | null {
  if (!raw) return null;
  const trimmed = raw.trim().toLowerCase();
  if (trimmed.length < 8 || trimmed.length > 128) return null;
  // Reject obviously fake patterns
  if (/^0+$/.test(trimmed) || /^test/.test(trimmed)) return null;
  return trimmed;
}

// Generate referral code in format PNX-XXXXXX (no confusing chars)
async function generateReferralCode(): Promise<string> {
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  for (let attempt = 0; attempt < 5; attempt++) {
    let randomPart = "";
    for (let i = 0; i < 6; i++) {
      randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const code = `PNX-${randomPart}`;

    const existing = await db.user.findFirst({
      where: { referralCode: code },
      select: { id: true },
    });
    if (!existing) return code;
  }

  // Fallback deterministic value (should be extremely rare)
  return `PNX-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}

// Helper to apply server-side pepper
const getPepperedPassword = (password: string) =>
  password + env.PASSWORD_PEPPER;

export async function createUser(input: SignupInput) {
  const email = input.email.toLowerCase();

  // Fix #6: Normalize and enforce deviceId (before DB checks so it's in scope for transaction)
  const normalizedDeviceId = normalizeDeviceId((input as any).deviceId);
  if (!normalizedDeviceId) {
    throw new BadRequestError(
      "A valid device identifier is required to create an account. Please ensure your browser supports this feature."
    );
  }

  // Check if user exists by email first (most common), then username/wallet if provided.
  try {
    const emailUser = await db.user.findUnique({ where: { email } });
    if (emailUser) throw new ConflictError("Email already registered");

    // Strict Device ID Check (using normalized value)
    const existingDeviceUser = await db.user.findFirst({
      where: { deviceId: normalizedDeviceId },
      select: { id: true },
    });

    if (existingDeviceUser) {
      throw new ConflictError(
        "You can no longer create another account on this device. Try logging in on your previous account."
      );
    }

    if (input.username) {
      try {
        const usernameUser = await db.user.findUnique({
          where: { username: input.username },
        });
        if (usernameUser) throw new ConflictError("Username already taken");
      } catch (e) {
        // If DB schema doesn't have username column, ignore and continue
        if ((e as any)?.code && (e as any).code === "P2022") {
          console.warn("[AUTH] username lookup not available in DB, skipping");
        } else throw e;
      }
    }

    if (input.walletAddress) {
      try {
        const walletUser = await db.user.findUnique({
          where: { walletAddress: input.walletAddress },
        });
        if (walletUser) throw new ConflictError("Wallet already linked");
      } catch (e) {
        if ((e as any)?.code && (e as any).code === "P2022") {
          console.warn(
            "[AUTH] walletAddress lookup not available in DB, skipping",
          );
        } else throw e;
      }
    }
  } catch (err: any) {
    if (err instanceof ConflictError) throw err;
    // Any other DB error here should be surfaced as an internal error
    console.error("[AUTH] user existence check failed:", err?.message || err);
    throw new InternalServerError();
  }

  // Prepare referral (validate code but don't reward yet)
  let referredById: string | null = null;
  if (input.referralCode) {
    const referrer = await db.user.findFirst({
      where: { referralCode: input.referralCode },
      select: { id: true },
    });
    if (referrer) {
      referredById = referrer.id;
    }
  }

  // Hash password if provided - Using 12 rounds + Pepper
  let hashedPassword = null;
  if (input.password) {
    const peppered = getPepperedPassword(input.password);
    hashedPassword = await bcrypt.hash(peppered, 12);
  }
  // Ensure user gets a PNX- referral code on creation
  const referralCode = await generateReferralCode();
  // Create user and (if referred) perform one-time reward atomically
  try {
    return await db.$transaction(async (tx) => {
      const createData: any = {
        walletAddress: input.walletAddress ?? undefined,
        email: email, // use normalized email
        username: input.username ?? null,
        password: hashedPassword,
        referredById,
        // do NOT pre-fill pxpBalance for referral; apply reward after creation
        referralCode,
      };
      // Use normalized deviceId
      createData.deviceId = normalizedDeviceId;

      const created = await tx.user.create({
        data: createData as any,
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
        },
      });

      // Deferred Referral Rewards — new user gets 75 PXP instantly, referrer deferred until 3 tasks
      let wasReferred = false;
      let rewardsApplied: { newUser: number; referrer: string } | null = null;

      if (referredById) {
        // Guard: only apply signup bonus once (newUserBonusGranted is the source of truth)
        const target = await (tx.user as any).findUnique({
          where: { id: created.id },
          select: { newUserBonusGranted: true },
        });
        if (target && !target.newUserBonusGranted) {
          const newUserBonus = 75;

          // New user gets instant reward — NO referrer credit here
          await (tx.user as any).update({
            where: { id: created.id },
            data: {
              pxpBalance: { increment: newUserBonus },
              newUserBonusGranted: true,
              referralRewarded: true, // backward compat
            },
          });

          // Referrer reward is DEFERRED — credited when this user completes 3 tasks
          // (handled in waitlist.service.ts completeTask via referrerBonusGranted flag)

          wasReferred = true;
          rewardsApplied = { newUser: newUserBonus, referrer: "deferred_until_3_tasks" };
        }
      }

      // Return fresh created user with selected fields plus referral metadata
      return {
        ...created,
        wasReferred,
        rewardsApplied,
      };
    });
  } catch (err: any) {
    // Prisma unique constraint error
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      const target = (err.meta as any)?.target;
      if (Array.isArray(target) && target.length) {
        const field = target[0];
        if (field === "email")
          throw new ConflictError("Email already registered");
        if (field === "username")
          throw new ConflictError("Username already taken");
        if (field === "walletAddress")
          throw new ConflictError("Wallet already linked");
      }
      throw new ConflictError("User already exists");
    }

    console.error("[AUTH] createUser transaction failed:", err?.message || err);
    throw new InternalServerError();
  }
}



// ... existing imports ...

export async function loginUser(input: LoginInput) {
  let user: any = null;

  // Support both `identifier` (new) and `email` (legacy) fields
  // Prefer email/password login. Wallet login must be explicit.
  const identifier = input.identifier || input.email;
  const password = input.password;

  if (identifier && password) {
    const isEmail = identifier.includes("@");
    const normalizedIdentifier = isEmail ? identifier.toLowerCase() : identifier;
    
    console.debug(`[AUTH] login attempt for ${normalizedIdentifier} (isEmail=${isEmail})`);

    // PARALLEL EXECUTION: Verify ReCaptcha and lookup user simultaneously
    const recaptchaPromise = input.recaptchaToken
      ? verifyRecaptcha(input.recaptchaToken, 'login')
      : Promise.resolve({ success: true, score: 1, error: undefined });

    // Lookup by normalized email or username
    const userPromise = db.user.findFirst({
      where: isEmail 
        ? { email: normalizedIdentifier }
        : { username: normalizedIdentifier },
      select: {
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
      },
    });

    const [recaptchaResult, user] = await Promise.all([recaptchaPromise, userPromise]);

    // 1. Check ReCaptcha Result
    if (!recaptchaResult.success || (recaptchaResult.score !== undefined && recaptchaResult.score < RECAPTCHA_MIN_SCORE)) {
      throw new BadRequestError(recaptchaResult.error || "Security verification failed. Please try again.");
    }

    // 2. Check User Existence
    if (!user) {
      console.debug(`[AUTH] no user found for identifier=${normalizedIdentifier}`);
      throw new InvalidCredentialsError(
        isEmail 
          ? "No account found with this email" 
          : "No account found with this username"
      );
    }
    
    // Check ban status immediately
    if (user.isBanned || user.accountStatus === "BANNED") {
      throw new InvalidCredentialsError(`Account suspended: ${user.banReason || "Violation of terms"}`);
    }

    // UNDER_REVIEW check — attempt lazy settlement if window expired (Fix #4)
    if (user.accountStatus === "UNDER_REVIEW") {
      if (user.reviewEndsAt && new Date() >= new Date(user.reviewEndsAt)) {
        // Window expired — attempt lazy settlement
        const settled = await lazySettleIfDue(user.id);
        if (!settled) {
          throw new AccountLockedError(user.reviewEndsAt);
        }
        // Fix #4: Re-read user after settlement — never trust stale data
        const freshUser = await db.user.findUnique({
          where: { id: user.id },
          select: {
            id: true, email: true, password: true, username: true,
            walletAddress: true, role: true, pxpBalance: true,
            referralCode: true, createdAt: true, lastBonusClaim: true,
            dailyStreak: true, lastActivityDate: true,
            isBanned: true, banReason: true, bannedAt: true,
            accountStatus: true, reviewEndsAt: true, tokenVersion: true,
          },
        });
        if (!freshUser || freshUser.isBanned || freshUser.accountStatus !== "ACTIVE") {
          throw new AccountLockedError(null);
        }
        // Use fresh data for the rest of the login flow
        Object.assign(user, freshUser);
      } else {
        // Still within review window — block login
        throw new AccountLockedError(user.reviewEndsAt);
      }
    }

    // Check password with pepper
    if (user.password) {
      const peppered = getPepperedPassword(password);
      
      let valid = await bcrypt.compare(peppered, user.password);

      // If peppered check fails, check legacy un-peppered password and upgrade
      if (!valid) {
        const legacyValid = await bcrypt.compare(password, user.password);
        if (legacyValid) {
          const newPepperedHash = await bcrypt.hash(peppered, 12);
          await db.user.update({
            where: { id: user.id },
            data: { password: newPepperedHash },
            select: { id: true },
          });
          valid = true;
          console.log(
            `[AUTH] Seamlessly upgraded password for user: ${user.email}`,
          );
        }
      }

      if (!valid) {
        console.debug(
          `[AUTH] password mismatch for identifier=${normalizedIdentifier} id=${user.id}`,
        );
        throw new InvalidCredentialsError("Incorrect password. Please try again.");
      }
    } else {
      console.debug(`[AUTH] no password set for identifier=${normalizedIdentifier}`);
      throw new InvalidCredentialsError("This account requires a different login method (e.g. Wallet/Social)");
    }

    return user;
  }

  // Wallet-based login (explicit): requires signature verification flow which
  // is intentionally separate from email/password login.
  throw new BadRequestError("Invalid login parameters. Email/Username and password required.");
}

export async function checkReferralCode(code: string) {
  const user = await db.user.findFirst({
    where: { referralCode: code },
    select: { id: true },
  });
  return !!user;
}
