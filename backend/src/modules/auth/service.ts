import { db } from "../../shared/database/db";
import { SignupInput, LoginInput } from "./schema";
import bcrypt from "bcrypt";
import { env } from "../../config/env";
import {
  ConflictError,
  BadRequestError,
  InternalServerError,
} from "../../shared/errors";
import { Prisma } from "@prisma/client";

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

  // Check if user exists by email first (most common), then username/wallet if provided.
  try {
    const emailUser = await db.user.findUnique({ where: { email } });
    if (emailUser) throw new ConflictError("Email already registered");

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
      // Only add deviceId if provided (and cast to any so TS doesn't require regenerated client)
      if ((input as any).deviceId)
        createData.deviceId = (input as any).deviceId;

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

      // If user was referred and rewards not yet paid, credit both users and mark rewarded
      let wasReferred = false;
      let rewardsApplied: { newUser: number; referrer: number } | null = null;

      if (referredById) {
        // Ensure we only apply rewards once by checking new user's referralRewarded flag (default false)
        const target = await (tx.user as any).findUnique({
          where: { id: created.id },
          select: { referralRewarded: true },
        });
        if (target && !target.referralRewarded) {
          // Reward amounts
          const referrerBonus = 150;
          const newUserBonus = 75;

          await (tx.user as any).update({
            where: { id: referredById },
            data: { pxpBalance: { increment: referrerBonus } },
          });
          await (tx.user as any).update({
            where: { id: created.id },
            data: {
              pxpBalance: { increment: newUserBonus },
              referralRewarded: true,
            },
          });

          wasReferred = true;
          rewardsApplied = { newUser: newUserBonus, referrer: referrerBonus };
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

export async function loginUser(input: LoginInput) {
  let user: any = null;

  // Prefer email + password login. Wallet login must be explicit (e.g. with signature).
  if (input.email && input.password) {
    const email = input.email.toLowerCase();
    console.debug(`[AUTH] email login attempt for ${email}`);

    // Lookup by normalized email. If your DB stores mixed-case emails, run a migration
    // to normalize to lowercase so this lookup is reliable.
    user = await db.user.findFirst({
      where: { email },
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
        // Do NOT return referredBy on login responses (only used at signup)
      },
    });

    if (!user) {
      console.debug(`[AUTH] no user found for email=${email}`);
      throw new Error("Invalid credentials");
    }

    // Check password with pepper
    if (user.password) {
      const peppered = getPepperedPassword(input.password);
      console.debug(
        `[AUTH] login attempt email=${email} id=${user.id} hasPassword=${!!user.password}`,
      );
      let valid = await bcrypt.compare(peppered, user.password);

      // If peppered check fails, check legacy un-peppered password and upgrade
      if (!valid) {
        const legacyValid = await bcrypt.compare(input.password, user.password);
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
          `[AUTH] password mismatch for email=${email} id=${user.id}`,
        );
        throw new Error("Invalid credentials");
      }
    } else {
      console.debug(`[AUTH] no password set for email=${email}`);
      throw new Error("Invalid credentials");
    }

    return user;
  }

  // Wallet-based login (explicit): requires signature verification flow which
  // is intentionally separate from email/password login. If you need wallet
  // login support, implement signature verification here and only then lookup
  // by `walletAddress`. For now, reject ambiguous requests.
  throw new Error("Invalid login parameters");
}

export async function checkReferralCode(code: string) {
  const user = await db.user.findFirst({
    where: { referralCode: code },
    select: { id: true },
  });
  return !!user;
}
