import { db } from '../../shared/database/db';
import { SignupInput, LoginInput } from './schema';
import bcrypt from 'bcrypt';
import { env } from '../../config/env';
import { 
  ConflictError, 
  UnauthorizedError, 
  ForbiddenError,
  InternalServerError,
  wrapDatabaseOperation 
} from '../../shared/errors';

// Helper to apply server-side pepper
const getPepperedPassword = (password: string) => password + env.PASSWORD_PEPPER;

/**
 * Generate a unique referral code in PNX-XXXXXX format
 * Uses uppercase alphanumeric chars excluding confusing ones (0, O, 1, I, L)
 */
async function generateReferralCode(): Promise<string> {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  
  for (let attempt = 0; attempt < 5; attempt++) {
    let randomPart = '';
    for (let i = 0; i < 6; i++) {
      randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const code = `PNX-${randomPart}`;
    
    // Check uniqueness
    const existing = await db.user.findUnique({
      where: { referralCode: code },
      select: { id: true }
    });
    
    if (!existing) return code;
  }
  
  // Fallback: timestamp-based (extremely unlikely to reach here)
  return `PNX-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}

export async function createUser(input: SignupInput) {
  const email = input.email.toLowerCase();
  
  // Check if user exists (Email or Wallet or Username)
  const where: any[] = [{ email }];
  if (input.walletAddress) where.push({ walletAddress: input.walletAddress });
  if (input.username) where.push({ username: input.username });

  // Wrap database lookup with error handling
  let existingUser: any = null;
  try {
    try {
      existingUser = await db.user.findFirst({ where: { OR: where } });
    } catch (err: any) {
      console.warn('[AUTH] compound findFirst failed, falling back to email-only lookup:', err?.message || err);
      existingUser = await db.user.findFirst({ where: { email } });
    }
  } catch (err: any) {
    // Log the full error internally
    console.error('[AUTH] Database error in createUser lookup:', {
      message: err?.message,
      code: err?.code,
    });
    throw new InternalServerError();
  }

  if (existingUser) {
    if (existingUser.email === email) {
      throw new ConflictError('Email already registered');
    }
    if (input.username && existingUser.username === input.username) {
      throw new ConflictError('Username already taken');
    }
    if (input.walletAddress && existingUser.walletAddress === input.walletAddress) {
      throw new ConflictError('Wallet already linked');
    }
    throw new ConflictError('User already exists');
  }

  // Handle referral
  let referredById = null;
  let bonusPoints = 0;
  
  if (input.referralCode) {
    try {
      const referrer = await db.user.findFirst({
        where: { referralCode: input.referralCode },
        select: { id: true },
      });
      
      if (referrer) {
        referredById = referrer.id;
        bonusPoints = 75; // Referred user bonus (corrected from 50)
        await db.user.update({
          where: { id: referrer.id },
          data: { pxpBalance: { increment: 150 } }, // Referrer bonus (corrected from 200)
          select: { id: true }
        });
      }
    } catch (err: any) {
      // Referral lookup failed - log but don't fail the signup
      console.error('[AUTH] Referral lookup error (non-fatal):', err?.message);
      // Continue without referral bonus
    }
  }

  // Hash password if provided - Using 12 rounds + Pepper
  let hashedPassword = null;
  if (input.password) {
    const peppered = getPepperedPassword(input.password);
    hashedPassword = await bcrypt.hash(peppered, 12);
  }

  // Generate custom PNX-format referral code
  const referralCode = await generateReferralCode();

  // Create the user - wrap with error handling
  try {
    return await db.user.create({
      data: {
        walletAddress: input.walletAddress ?? undefined,
        email: email,
        username: input.username ?? null,
        password: hashedPassword,
        referredById,
        pxpBalance: bonusPoints,
        referralCode, // Use custom PNX-XXXXXX code
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
  } catch (err: any) {
    console.error('[AUTH] Database error in createUser:', {
      message: err?.message,
      code: err?.code,
    });
    throw new InternalServerError();
  }
}

export async function loginUser(input: LoginInput) {
  // Prefer email + password login
  if (input.email && input.password) {
    const email = input.email.toLowerCase();
    console.debug(`[AUTH] email login attempt for ${email}`);

    // Lookup user - wrap with error handling
    let user: any = null;
    try {
      user = await db.user.findFirst({ 
        where: { email }, 
        select: { 
          id: true, 
          email: true, 
          password: true, 
          username: true, 
          walletAddress: true, 
          role: true,
          referralCode: true,
          pxpBalance: true,
          isBanned: true
        } 
      });
    } catch (err: any) {
      console.error('[AUTH] Database error in loginUser lookup:', {
        message: err?.message,
        code: err?.code,
      });
      throw new InternalServerError('Unable to log in at the moment. Please try again.');
    }

    if (!user) {
      console.debug(`[AUTH] no user found for email=${email}`);
      throw new UnauthorizedError('Invalid email or password');
    }

    if (user.isBanned) {
      console.warn(`[AUTH] Banned user attempted login: ${email}`);
      // Use ForbiddenError (403) or generic UnauthorizedError (401) depending on desire to reveal ban status
      // Standard practice: generic message or specific? User requested strictness.
      // "Account suspended" is clear.
      throw new ForbiddenError('Account suspended');
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
          try {
            const newPepperedHash = await bcrypt.hash(peppered, 12);
            await db.user.update({ where: { id: user.id }, data: { password: newPepperedHash }, select: { id: true } });
            valid = true;
            console.log(`[AUTH] Seamlessly upgraded password for user: ${user.email}`);
          } catch (err: any) {
            // Password upgrade failed - log but allow login to continue
            console.error('[AUTH] Password upgrade error (non-fatal):', err?.message);
            valid = true; // Still allow login since legacy password was valid
          }
        }
      }

      if (!valid) {
        console.debug(`[AUTH] password mismatch for email=${email} id=${user.id}`);
        throw new UnauthorizedError('Invalid email or password');
      }
    } else {
      console.debug(`[AUTH] no password set for email=${email}`);
      throw new UnauthorizedError('Invalid email or password');
    }

    return user;
  }

  // Wallet-based login not yet implemented
  throw new UnauthorizedError('Invalid login credentials');
}

export async function checkReferralCode(code: string): Promise<boolean> {
  try {
    const referrer = await db.user.findFirst({
      where: { referralCode: code },
      select: { id: true },
    });
    return !!referrer;
  } catch (err: any) {
    console.error('[AUTH] Database error in checkReferralCode:', err?.message);
    // Return false on error - don't expose internal errors
    return false;
  }
}

