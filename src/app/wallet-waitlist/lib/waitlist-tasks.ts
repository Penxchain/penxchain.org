import { Task, User } from '../types/waitlist';
import { allTasks, socialTasks, dailyTasks } from './waitlist-data';
import { getCurrentUser, updateCurrentUser } from './waitlist-auth';

// Check if daily tasks should reset
function shouldResetDailyTasks(user: User): boolean {
  const lastReset = new Date(user.lastDailyReset);
  const now = new Date();
  
  // Reset if it's a new day (UTC)
  return lastReset.getUTCDate() !== now.getUTCDate() ||
         lastReset.getUTCMonth() !== now.getUTCMonth() ||
         lastReset.getUTCFullYear() !== now.getUTCFullYear();
}

// Reset daily tasks
function resetDailyTasks(user: User): User {
  const dailyTaskIds = dailyTasks.map((t) => t.id);
  const updatedCompletedTasks = user.completedTasks.filter(
    (taskId) => !dailyTaskIds.includes(taskId)
  );

  return {
    ...user,
    completedTasks: updatedCompletedTasks,
    lastDailyReset: new Date().toISOString(),
  };
}

// Get all tasks with completion status
export function getTasksWithStatus(): (Task & { completed: boolean })[] {
  const user = getCurrentUser();
  if (!user) return allTasks.map((task) => ({ ...task, completed: false }));

  // Check if daily reset needed
  let currentUser = user;
  if (shouldResetDailyTasks(user)) {
    const resetUser = resetDailyTasks(user);
    updateCurrentUser(resetUser);
    currentUser = resetUser;
  }

  return allTasks.map((task) => ({
    ...task,
    completed: currentUser.completedTasks.includes(task.id),
  }));
}

// Get social tasks with status
export function getSocialTasks(): (Task & { completed: boolean })[] {
  const user = getCurrentUser();
  if (!user) return socialTasks.map((task) => ({ ...task, completed: false }));

  return socialTasks.map((task) => ({
    ...task,
    completed: user.completedTasks.includes(task.id),
  }));
}

// Get daily tasks with status
export function getDailyTasks(): (Task & { completed: boolean })[] {
  const user = getCurrentUser();
  if (!user) return dailyTasks.map((task) => ({ ...task, completed: false }));

  // Check if daily reset needed
  let currentUser = user;
  if (shouldResetDailyTasks(user)) {
    const resetUser = resetDailyTasks(user);
    updateCurrentUser(resetUser);
    currentUser = resetUser;
  }

  return dailyTasks.map((task) => ({
    ...task,
    completed: currentUser.completedTasks.includes(task.id),
  }));
}

// Check if task can be completed
export function checkTaskEligibility(taskId: string): { eligible: boolean; reason?: string } {
  const user = getCurrentUser();
  if (!user) {
    return { eligible: false, reason: 'User not logged in' };
  }

  const task = allTasks.find((t) => t.id === taskId);
  if (!task) {
    return { eligible: false, reason: 'Task not found' };
  }

  // Check if already completed and not repeatable
  if (!task.repeatable && user.completedTasks.includes(taskId)) {
    return { eligible: false, reason: 'Task already completed' };
  }

  // For daily tasks, check if already completed today
  if (task.repeatable && task.type === 'daily') {
    if (shouldResetDailyTasks(user)) {
      return { eligible: true };
    }
    if (user.completedTasks.includes(taskId)) {
      return { eligible: false, reason: 'Come back tomorrow for this task' };
    }
  }

  return { eligible: true };
}

// Complete a task
export function completeTask(taskId: string): { success: boolean; points?: number; error?: string } {
  const user = getCurrentUser();
  if (!user) {
    return { success: false, error: 'User not logged in' };
  }

  const eligibility = checkTaskEligibility(taskId);
  if (!eligibility.eligible) {
    return { success: false, error: eligibility.reason };
  }

  const task = allTasks.find((t) => t.id === taskId);
  if (!task) {
    return { success: false, error: 'Task not found' };
  }

  // Update user's completed tasks and points
  const updatedUser = updateCurrentUser({
    completedTasks: [...user.completedTasks, taskId],
    points: user.points + task.points,
  });

  if (!updatedUser) {
    return { success: false, error: 'Failed to update user' };
  }

  return { success: true, points: task.points };
}

// Get time until daily reset
export function getTimeUntilDailyReset(): { hours: number; minutes: number; seconds: number } {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setUTCHours(24, 0, 0, 0);

  const diff = tomorrow.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { hours, minutes, seconds };
}

// Get user's task completion stats
export function getTaskStats() {
  const user = getCurrentUser();
  if (!user) {
    return {
      totalCompleted: 0,
      socialCompleted: 0,
      dailyCompleted: 0,
      totalPoints: 0,
    };
  }

  const socialCompleted = socialTasks.filter((task) =>
    user.completedTasks.includes(task.id)
  ).length;

  const dailyCompleted = dailyTasks.filter((task) =>
    user.completedTasks.includes(task.id)
  ).length;

  return {
    totalCompleted: user.completedTasks.length,
    socialCompleted,
    dailyCompleted,
    totalPoints: user.points,
  };
}
