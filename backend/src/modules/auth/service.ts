import { db } from '../../shared/database/db';
import { SignupInput, LoginInput } from './schema';
import bcrypt from 'bcrypt';
import { env } from '../../config/env';

// Helper to apply server-side pepper
const getPepperedPassword = (password: string) => password + env.PASSWORD_PEPPER;

export async function createUser(input: SignupInput) {
  const email = input.email.toLowerCase();
  
  // Check if user exists (Email or Wallet or Username)
  const where: any[] = [{ email }];
  if (input.walletAddress) where.push({ walletAddress: input.walletAddress });
  if (input.username) where.push({ username: input.username });

  // Some DB adapters (e.g. certain hosted providers) may not have all columns
  // present yet. Wrap the compound lookup in a try/catch and fall back to an
  // email-only lookup if the compound query fails due to a missing column.
  let existingUser: any = null;
  try {
    existingUser = await db.user.findFirst({ where: { OR: where } });
  } catch (err: any) {
    console.warn('[AUTH] compound findFirst failed, falling back to email-only lookup:', err?.message || err);
    existingUser = await db.user.findFirst({ where: { email } });
  }

  if (existingUser) {
    if (existingUser.email === email) throw new Error('Email already registered');
    if (input.username && existingUser.username === input.username) throw new Error('Username already taken');
    if (input.walletAddress && existingUser.walletAddress === input.walletAddress) throw new Error('Wallet already linked');
    if (!input.username && !input.walletAddress) throw new Error('User already exists');
  }

  // Handle referral
  let referredById = null;
  let bonusPoints = 0;
  if (input.referralCode) {
    const referrer = await db.user.findFirst({
      where: { referralCode: input.referralCode },
      select: { id: true },
    });
    if (referrer) {
      referredById = referrer.id;
      bonusPoints = 50;
      await db.user.update({
        where: { id: referrer.id },
        data: { pxpBalance: { increment: 200 } },
        select: { id: true }
      });
    }
  }

  // Hash password if provided - Using 12 rounds + Pepper
  let hashedPassword = null;
  if (input.password) {
    const peppered = getPepperedPassword(input.password);
    hashedPassword = await bcrypt.hash(peppered, 12);
  }

  return db.user.create({
    data: {
      walletAddress: input.walletAddress ?? undefined,
      email: email, // use normalized email
      username: input.username ?? null,
      password: hashedPassword,
      referredById,
      pxpBalance: bonusPoints,
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
    },
  });
}

export async function loginUser(input: LoginInput) {
  let user: any = null;

  // Prefer email + password login. Wallet login must be explicit (e.g. with signature).
  if (input.email && input.password) {
    const email = input.email.toLowerCase();
    console.debug(`[AUTH] email login attempt for ${email}`);

    // Lookup by normalized email. If your DB stores mixed-case emails, run a migration
    // to normalize to lowercase so this lookup is reliable.
    user = await db.user.findFirst({ where: { email }, select: { id: true, email: true, password: true, username: true, walletAddress: true, role: true } });

    if (!user) {
      console.debug(`[AUTH] no user found for email=${email}`);
      throw new Error('Invalid credentials');
    }

    // Check password with pepper
    if (user.password) {
      const peppered = getPepperedPassword(input.password);
      console.debug(`[AUTH] login attempt email=${email} id=${user.id} hasPassword=${!!user.password}`);
      let valid = await bcrypt.compare(peppered, user.password);

      // If peppered check fails, check legacy un-peppered password and upgrade
      if (!valid) {
        const legacyValid = await bcrypt.compare(input.password, user.password);
        if (legacyValid) {
          const newPepperedHash = await bcrypt.hash(peppered, 12);
          await db.user.update({ where: { id: user.id }, data: { password: newPepperedHash }, select: { id: true } });
          valid = true;
          console.log(`[AUTH] Seamlessly upgraded password for user: ${user.email}`);
        }
      }

      if (!valid) {
        console.debug(`[AUTH] password mismatch for email=${email} id=${user.id}`);
        throw new Error('Invalid credentials');
      }
    } else {
      console.debug(`[AUTH] no password set for email=${email}`);
      throw new Error('Invalid credentials');
    }

    return user;
  }

  // Wallet-based login (explicit): requires signature verification flow which
  // is intentionally separate from email/password login. If you need wallet
  // login support, implement signature verification here and only then lookup
  // by `walletAddress`. For now, reject ambiguous requests.
  throw new Error('Invalid login parameters');
}

export async function checkReferralCode(code: string) {
  const user = await db.user.findFirst({
    where: { referralCode: code },
    select: { id: true },
  });
  return !!user;
}
