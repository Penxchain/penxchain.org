import { User, AuthResponse } from '../types/waitlist';
import { initialUser, sampleUsers, calculateLevel } from './waitlist-data';

const STORAGE_KEY = 'penxchain_waitlist_user';
const USERS_KEY = 'penxchain_waitlist_users';

// Initialize sample users in localStorage
function initializeSampleUsers() {
  if (typeof window === 'undefined') return;
  
  const existing = localStorage.getItem(USERS_KEY);
  if (!existing) {
    localStorage.setItem(USERS_KEY, JSON.stringify(sampleUsers));
  }
}

// Get all users from storage
function getAllUsers(): User[] {
  if (typeof window === 'undefined') return [];
  
  initializeSampleUsers();
  const stored = localStorage.getItem(USERS_KEY);
  return stored ? JSON.parse(stored) : [];
}

// Update user in users list
function updateUserInList(user: User) {
  if (typeof window === 'undefined') return;
  
  const users = getAllUsers();
  const index = users.findIndex((u) => u.id === user.id);
  
  if (index !== -1) {
    users[index] = user;
  } else {
    users.push(user);
  }
  
  // Recalculate ranks based on points
  const sortedUsers = users.sort((a, b) => b.points - a.points);
  sortedUsers.forEach((u, idx) => {
    u.rank = idx + 1;
  });
  
  localStorage.setItem(USERS_KEY, JSON.stringify(sortedUsers));
}

// Login function
export function login(email: string, password: string): AuthResponse {
  if (typeof window === 'undefined') {
    return { success: false, error: 'Window not available' };
  }

  // Check if it's the main user
  if (email === initialUser.email && password === initialUser.password) {
    // Check if user already exists in storage
    const existingUser = localStorage.getItem(STORAGE_KEY);
    const user = existingUser ? JSON.parse(existingUser) : initialUser;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    updateUserInList(user);
    
    return { success: true, user };
  }

  // Check sample users
  const users = getAllUsers();
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return { success: true, user };
  }

  return { success: false, error: 'Invalid email or password' };
}

// Signup function
export function signup(
  username: string,
  email: string,
  password: string,
  referralCode?: string
): AuthResponse {
  if (typeof window === 'undefined') {
    return { success: false, error: 'Window not available' };
  }

  // Check if email already exists
  const users = getAllUsers();
  const existingUser = users.find((u) => u.email === email);

  if (existingUser) {
    return { success: false, error: 'Email already registered' };
  }

  // Check if username already taken
  const existingUsername = users.find((u) => u.username === username);
  if (existingUsername) {
    return { success: false, error: 'Username already taken' };
  }

  // Find referrer if code provided
  let referredBy: string | undefined;
  let bonusPoints = 0;

  if (referralCode) {
    const referrer = users.find((u) => u.referralCode === referralCode);
    if (referrer) {
      referredBy = referrer.id;
      bonusPoints = 50; // Bonus for using referral code
      
      // Update referrer's count and points
      referrer.referralCount += 1;
      referrer.points += 200; // Referrer gets 200 points
      referrer.level = calculateLevel(referrer.points);
      updateUserInList(referrer);
    }
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    username,
    email,
    password,
    points: bonusPoints,
    level: 1,
    rank: users.length + 1,
    referralCode: `${username.substring(0, 3).toUpperCase()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    referredBy,
    referralCount: 0,
    completedTasks: [],
    joinedAt: new Date().toISOString(),
    lastDailyReset: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
  updateUserInList(newUser);

  return { success: true, user: newUser };
}

// Logout function
export function logout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

// Get current user
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
}

// Check if authenticated
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

// Update current user
export function updateCurrentUser(updates: Partial<User>): User | null {
  if (typeof window === 'undefined') return null;
  
  const currentUser = getCurrentUser();
  if (!currentUser) return null;

  const updatedUser = { ...currentUser, ...updates };
  
  // Recalculate level if points changed
  if (updates.points !== undefined) {
    updatedUser.level = calculateLevel(updatedUser.points);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
  updateUserInList(updatedUser);

  return updatedUser;
}
