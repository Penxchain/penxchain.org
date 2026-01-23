import type { User } from '../types/waitlist';

const BONUS_AMOUNT = 35;
const COOLDOWN_HOURS = 24;

/**
 * Check if user can claim the daily bonus PXP
 */
export function canClaimBonus(user: User): boolean {
  if (!user.lastBonusClaim) {
    return true; // Never claimed before
  }

  const lastClaim = new Date(user.lastBonusClaim);
  const now = new Date();
  const hoursSinceLastClaim = (now.getTime() - lastClaim.getTime()) / (1000 * 60 * 60);

  return hoursSinceLastClaim >= COOLDOWN_HOURS;
}

/**
 * Get the next time the user can claim the bonus
 */
export function getNextBonusTime(user: User): Date | null {
  if (!user.lastBonusClaim) {
    return null; // Can claim now
  }

  const lastClaim = new Date(user.lastBonusClaim);
  const nextClaim = new Date(lastClaim.getTime() + COOLDOWN_HOURS * 60 * 60 * 1000);
  
  return nextClaim;
}

/**
 * Get hours remaining until next bonus
 */
export function getHoursUntilNextBonus(user: User): number {
  const nextTime = getNextBonusTime(user);
  if (!nextTime) return 0;

  const now = new Date();
  const hoursRemaining = (nextTime.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  return Math.max(0, Math.ceil(hoursRemaining));
}

/**
 * Get the bonus amount (constant for now, but could be dynamic)
 */
export function getBonusAmount(): number {
  return BONUS_AMOUNT;
}
