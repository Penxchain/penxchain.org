import type { User } from '../types/waitlist';

const BONUS_AMOUNT = 100;
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
  
  const isSameDay = 
    lastClaim.getUTCFullYear() === now.getUTCFullYear() &&
    lastClaim.getUTCMonth() === now.getUTCMonth() &&
    lastClaim.getUTCDate() === now.getUTCDate();

  return !isSameDay;
}

/**
 * Get the next time the user can claim the bonus
 */
export function getNextBonusTime(user: User): Date | null {
  if (!user.lastBonusClaim) {
    return null; // Can claim now
  }

  const nextReset = new Date();
  nextReset.setUTCHours(24, 0, 0, 0); // Next midnight UTC
  
  return nextReset;
}

/**
 * Get hours remaining until next bonus
 */
export function getHoursUntilNextBonus(user: User): number {
  if (canClaimBonus(user)) return 0;
  
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
