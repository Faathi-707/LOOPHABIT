import { z } from 'zod';
import { Ionicons } from '@expo/vector-icons'

type HabitIconLibrary = 'material' | 'ionicons'

type HabitIconKey = {
  library: HabitIconLibrary
  name: string
}

export const habitSchema = z.object({
  name: z
    .string()
    .min(1, 'Habit name is required')
    .max(50, 'Name must be 50 characters or less'),

  icon: z
    .string()
    .min(1, 'Please select an emoji icon'),

  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, 'Invalid color code'),

  frequency: z
    .enum(['daily', 'weekly', 'monthly'], {
      errorMap: () => ({ message: 'Please select a valid frequency' }),
    }),

  notes: z
    .string()
    .max(200, 'Notes must be 200 characters or less')
    .optional(),
});

export type HabitFormData = z.infer<typeof habitSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email'),

  password: z
    .string()
    .min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name must be 50 characters or less'),

  email: z
    .string()
    .email('Please enter a valid email'),

  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),

  confirmPassword: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type SignupFormData = z.infer<typeof signupSchema>;

export interface Habit {
  id: string
  name: string
  iconName: string      // e.g. "dumbbell"
  iconLibrary: 'material' | 'ionicons'
  color: string
  frequency: HabitFrequency
  notes?: string
  isActive: boolean
  createdAt: string | number
}
export type HabitFrequency = 'daily' | 'weekly' | 'monthly';

export const habitColors = [
  '#FFB3D9',
  '#B3D9FF',
  '#B3E5B9',
  '#FFE5B3',
  '#D4B3FF',
  '#B3E5F5',
];