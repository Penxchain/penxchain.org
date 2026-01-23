import { User, Task } from '../types/waitlist';

// Generate referral code
function generateReferralCode(username: string): string {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${username.substring(0, 3).toUpperCase()}${random}`;
}

// Initial user data (the logged-in user)
export const initialUser: User = {
  id: 'user-001',
  username: 'DrSponsor',
  email: 'marvelee57@gmail.com',
  password: 'test123',
  points: 0,
  level: 1,
  rank: 1,
  referralCode: generateReferralCode('DrSponsor'),
  referralCount: 0,
  completedTasks: [],
  joinedAt: new Date().toISOString(),
  lastDailyReset: new Date().toISOString(),
};

// Sample leaderboard users (for demo purposes)
export const sampleUsers: User[] = [
  {
    id: 'user-002',
    username: 'CryptoNinja',
    email: 'ninja@example.com',
    password: 'demo123',
    points: 2450,
    level: 4,
    rank: 2,
    referralCode: generateReferralCode('CryptoNinja'),
    referralCount: 8,
    completedTasks: ['follow-x', 'join-telegram', 'join-discord', 'follow-linkedin', 'star-github'],
    joinedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    lastDailyReset: new Date().toISOString(),
  },
  {
    id: 'user-003',
    username: 'BlockchainBoss',
    email: 'boss@example.com',
    password: 'demo123',
    points: 2100,
    level: 4,
    rank: 3,
    referralCode: generateReferralCode('BlockchainBoss'),
    referralCount: 6,
    completedTasks: ['follow-x', 'join-telegram', 'join-discord'],
    joinedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    lastDailyReset: new Date().toISOString(),
  },
  {
    id: 'user-004',
    username: 'Web3Warrior',
    email: 'warrior@example.com',
    password: 'demo123',
    points: 1850,
    level: 3,
    rank: 4,
    referralCode: generateReferralCode('Web3Warrior'),
    referralCount: 5,
    completedTasks: ['follow-x', 'join-telegram'],
    joinedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    lastDailyReset: new Date().toISOString(),
  },
  {
    id: 'user-005',
    username: 'DeFiDegen',
    email: 'defi@example.com',
    password: 'demo123',
    points: 1620,
    level: 3,
    rank: 5,
    referralCode: generateReferralCode('DeFiDegen'),
    referralCount: 4,
    completedTasks: ['follow-x', 'join-telegram', 'join-discord', 'follow-linkedin'],
    joinedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    lastDailyReset: new Date().toISOString(),
  },
  {
    id: 'user-006',
    username: 'AleoAddict',
    email: 'aleo@example.com',
    password: 'demo123',
    points: 1400,
    level: 3,
    rank: 6,
    referralCode: generateReferralCode('AleoAddict'),
    referralCount: 3,
    completedTasks: ['follow-x', 'join-telegram', 'follow-linkedin'],
    joinedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    lastDailyReset: new Date().toISOString(),
  },
  {
    id: 'user-007',
    username: 'PrivacyPro',
    email: 'privacy@example.com',
    password: 'demo123',
    points: 1180,
    level: 3,
    rank: 7,
    referralCode: generateReferralCode('PrivacyPro'),
    referralCount: 2,
    completedTasks: ['follow-x', 'join-telegram', 'join-discord'],
    joinedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    lastDailyReset: new Date().toISOString(),
  },
  {
    id: 'user-008',
    username: 'TokenTrader',
    email: 'trader@example.com',
    password: 'demo123',
    points: 950,
    level: 2,
    rank: 8,
    referralCode: generateReferralCode('TokenTrader'),
    referralCount: 2,
    completedTasks: ['follow-x', 'join-telegram'],
    joinedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    lastDailyReset: new Date().toISOString(),
  },
  {
    id: 'user-009',
    username: 'HodlHero',
    email: 'hodl@example.com',
    password: 'demo123',
    points: 720,
    level: 2,
    rank: 9,
    referralCode: generateReferralCode('HodlHero'),
    referralCount: 1,
    completedTasks: ['follow-x', 'join-discord'],
    joinedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    lastDailyReset: new Date().toISOString(),
  },
  {
    id: 'user-010',
    username: 'GasOptimizer',
    email: 'gas@example.com',
    password: 'demo123',
    points: 580,
    level: 2,
    rank: 10,
    referralCode: generateReferralCode('GasOptimizer'),
    referralCount: 1,
    completedTasks: ['follow-x'],
    joinedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    lastDailyReset: new Date().toISOString(),
  },
];

// Task definitions
export const socialTasks: Task[] = [
  {
    id: 'follow-x',
    type: 'social',
    title: 'Follow us on X',
    description: 'Follow @penxchain_ on X (Twitter)',
    points: 100,
    icon: 'FaXTwitter',
    link: 'https://x.com/penxchain_?s=21',
    repeatable: false,
    category: 'twitter',
  },
  {
    id: 'join-telegram',
    type: 'social',
    title: 'Join Telegram',
    description: 'Join our official Telegram community',
    points: 100,
    icon: 'FaTelegram',
    link: 'https://t.me/Officialpenxchain',
    repeatable: false,
    category: 'telegram',
  },
  {
    id: 'join-discord',
    type: 'social',
    title: 'Join Discord',
    description: 'Join our Discord server',
    points: 100,
    icon: 'FaDiscord',
    link: '#',
    repeatable: false,
    category: 'discord',
  },
  {
    id: 'follow-linkedin',
    type: 'social',
    title: 'Follow on LinkedIn',
    description: 'Follow PENXCHAIN on LinkedIn',
    points: 50,
    icon: 'FaLinkedin',
    link: 'https://www.linkedin.com/company/penxchain/',
    repeatable: false,
    category: 'linkedin',
  },
  {
    id: 'star-github',
    type: 'social',
    title: 'Star on GitHub',
    description: 'Star the PENXCHAIN repository',
    points: 50,
    icon: 'FaGithub',
    link: 'https://github.com/Penxchain',
    repeatable: false,
    category: 'github',
  },
];

export const dailyTasks: Task[] = [
  {
    id: 'daily-like',
    type: 'daily',
    title: 'Like Daily Post',
    description: 'Like our daily post on X',
    points: 20,
    icon: 'Heart',
    link: 'https://x.com/penxchain_?s=21',
    repeatable: true,
    category: 'engagement',
  },
  {
    id: 'daily-comment',
    type: 'daily',
    title: 'Comment on Post',
    description: 'Leave a comment on our daily post',
    points: 30,
    icon: 'MessageCircle',
    link: 'https://x.com/penxchain_?s=21',
    repeatable: true,
    category: 'engagement',
  },
  {
    id: 'daily-share',
    type: 'daily',
    title: 'Share on X',
    description: 'Share PENXCHAIN with your followers',
    points: 50,
    icon: 'Share2',
    link: 'https://x.com/penxchain_?s=21',
    repeatable: true,
    category: 'engagement',
  },
  {
    id: 'daily-visit',
    type: 'daily',
    title: 'Visit Marketplace',
    description: 'Check out the PENXCHAIN marketplace',
    points: 10,
    icon: 'ShoppingBag',
    link: '/marketplace/coming-soon',
    repeatable: true,
    category: 'engagement',
  },
  {
    id: 'daily-blog',
    type: 'daily',
    title: 'Read Latest Blog',
    description: 'Stay informed with PENXCHAIN updates',
    points: 40,
    icon: 'BookOpen',
    link: '/blog/what-is-penxchain',
    repeatable: true,
    category: 'engagement',
  },
  {
    id: 'daily-hint',
    type: 'daily',
    title: 'Hidden PXP Bonus',
    description: 'Double tap a certain place in the website to earn extra PXP',
    points: 0,
    icon: 'Search',
    repeatable: false,
    category: 'engagement',
  },
];

export const allTasks = [...socialTasks, ...dailyTasks];

// Level thresholds
export const levelThresholds = [
  { level: 1, minPoints: 0, maxPoints: 500, title: 'Newcomer' },
  { level: 2, minPoints: 501, maxPoints: 1000, title: 'Explorer' },
  { level: 3, minPoints: 1001, maxPoints: 2500, title: 'Pioneer' },
  { level: 4, minPoints: 2501, maxPoints: 5000, title: 'Champion' },
  { level: 5, minPoints: 5001, maxPoints: Infinity, title: 'Legend' },
];

export function calculateLevel(points: number): number {
  const level = levelThresholds.find(
    (threshold) => points >= threshold.minPoints && points <= threshold.maxPoints
  );
  return level?.level || 1;
}

export function getLevelInfo(points: number) {
  const currentLevel = calculateLevel(points);
  const currentThreshold = levelThresholds.find((t) => t.level === currentLevel);
  const nextThreshold = levelThresholds.find((t) => t.level === currentLevel + 1);

  return {
    level: currentLevel,
    title: currentThreshold?.title || 'Newcomer',
    currentPoints: points,
    minPoints: currentThreshold?.minPoints || 0,
    maxPoints: currentThreshold?.maxPoints || 500,
    nextLevelPoints: nextThreshold?.minPoints || null,
    progress: currentThreshold
      ? ((points - currentThreshold.minPoints) / (currentThreshold.maxPoints - currentThreshold.minPoints)) * 100
      : 0,
  };
}
