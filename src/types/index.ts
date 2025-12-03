export type HabitFrequency = 'daily' | 'weekly' | 'monthly';

export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  frequency: HabitFrequency;
  notes?: string;
  createdAt: number;
  isActive: boolean;
}

export interface Completion {
  id: string;
  habitId: string;
  date: string;
  completedAt: number;
}


export interface HabitStats {
  habitId: string;
  totalCompletions: number;
  currentStreak: number;
  completionPercentage: number;
}

export interface ProgressData {
  daily: {
    completed: number;
    total: number;
    percentage: number;
  };
  weekly: {
    completed: number;
    total: number;
    percentage: number;
  };
  monthly: {
    completed: number;
    total: number;
    percentage: number;
  };
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
}

export interface AppState {
  isLoggedIn: boolean;
  user: AppUser | null;
  isDarkMode: boolean;
  language: 'en' | 'dv';
  isLoading: boolean;
  error: string | null;
}