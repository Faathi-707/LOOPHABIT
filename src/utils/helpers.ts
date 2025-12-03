import { Habit, Completion, ProgressData, HabitStats } from '@/types';

export const getTodayString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getDateNDaysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getWeekStartString = (): string => {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(today.setDate(diff));
  const year = monday.getFullYear();
  const month = String(monday.getMonth() + 1).padStart(2, '0');
  const dateStr = String(monday.getDate()).padStart(2, '0');
  return `${year}-${month}-${dateStr}`;
};

export const getMonthStartString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}-01`;
};

export const getCompletionsInRange = (
  completions: Completion[],
  habitId: string,
  startDate: string,
  endDate: string,
): Completion[] => {
  return completions.filter(
    (c) => c.habitId === habitId && c.date >= startDate && c.date <= endDate,
  );
};

export const calculateDailyProgress = (
  habits: Habit[],
  completions: Completion[],
): ProgressData['daily'] => {
  const today = getTodayString();
  const dailyHabits = habits.filter((h) => h.frequency === 'daily' && h.isActive);
  const completedToday = dailyHabits.filter((h) =>
    completions.some((c) => c.habitId === h.id && c.date === today),
  ).length;

  return {
    completed: completedToday,
    total: dailyHabits.length,
    percentage: dailyHabits.length > 0 ? (completedToday / dailyHabits.length) * 100 : 0,
  };
};

export const calculateWeeklyProgress = (
  habits: Habit[],
  completions: Completion[],
): ProgressData['weekly'] => {
  const weekStart = getWeekStartString();
  const today = getTodayString();
  const weeklyHabits = habits.filter((h) => h.frequency === 'weekly' && h.isActive);

  const completedThisWeek = weeklyHabits.filter((h) =>
    completions.some((c) => c.habitId === h.id && c.date >= weekStart && c.date <= today),
  ).length;

  return {
    completed: completedThisWeek,
    total: weeklyHabits.length,
    percentage: weeklyHabits.length > 0 ? (completedThisWeek / weeklyHabits.length) * 100 : 0,
  };
};

export const calculateMonthlyProgress = (
  habits: Habit[],
  completions: Completion[],
): ProgressData['monthly'] => {
  const monthStart = getMonthStartString();
  const today = getTodayString();
  const monthlyHabits = habits.filter((h) => h.frequency === 'monthly' && h.isActive);

  const completedThisMonth = monthlyHabits.filter((h) =>
    completions.some((c) => c.habitId === h.id && c.date >= monthStart && c.date <= today),
  ).length;

  return {
    completed: completedThisMonth,
    total: monthlyHabits.length,
    percentage: monthlyHabits.length > 0 ? (completedThisMonth / monthlyHabits.length) * 100 : 0,
  };
};

export const calculateProgress = (
  habits: Habit[],
  completions: Completion[],
): ProgressData => {
  return {
    daily: calculateDailyProgress(habits, completions),
    weekly: calculateWeeklyProgress(habits, completions),
    monthly: calculateMonthlyProgress(habits, completions),
  };
};

export const isHabitCompletedOnDate = (
  completions: Completion[],
  habitId: string,
  date: string,
): boolean => {
  return completions.some((c) => c.habitId === habitId && c.date === date);
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const formatDateForDisplay = (dateString: string): string => {
  const today = getTodayString();
  const yesterday = getDateNDaysAgo(1);

  if (dateString === today) return 'Today';
  if (dateString === yesterday) return 'Yesterday';

  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};