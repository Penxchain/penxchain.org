// Avatar utilities using DiceBear
// We use a consistent style (avataaars) that generates "real" looking characters

export const AVATAR_STYLE = 'avataaars'; // or 'notionists', 'micah', 'bottts' etc.

export function generateRandomAvatarSeed(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function getAvatarUrl(seed?: string) {
  const finalSeed = seed || 'default';
  // Using DiceBear API
  // We can customize it further if needed, e.g. backgroundType, etc.
  return `https://api.dicebear.com/9.x/${AVATAR_STYLE}/svg?seed=${finalSeed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
}

// Deprecated or adapted for compatibility
export function getAvatarStyle(avatarId?: string) {
  const url = getAvatarUrl(avatarId);
  return {
    backgroundImage: `url('${url}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundColor: '#2547D0', // Fallback
  };
}
