// src/constants/habitIcons.ts
import { Ionicons } from '@expo/vector-icons'

export type HabitIconName = keyof typeof Ionicons.glyphMap

export type HabitIconConfig = {
  key: string
  icon: HabitIconName
  label: string
}

export const HABIT_ICONS: HabitIconConfig[] = [
  { key: 'drink-water', icon: 'water', label: 'Drink water' },
  { key: 'steps', icon: 'walk', label: 'Steps' },
  { key: 'gym', icon: 'barbell', label: 'Gym' },
  { key: 'sleep', icon: 'moon', label: 'Sleep' },
  { key: 'medication', icon: 'medkit', label: 'Medication' },
  { key: 'reading', icon: 'book', label: 'Reading' },
  { key: 'journal', icon: 'create', label: 'Journal' },
  { key: 'study', icon: 'school', label: 'Study' },
  { key: 'meditation', icon: 'leaf', label: 'Meditation' },
  { key: 'focus-work', icon: 'briefcase', label: 'Focus work' },
  { key: 'emails', icon: 'mail', label: 'Emails' },
  { key: 'planning', icon: 'today', label: 'Planning' },
  { key: 'laundry', icon: 'shirt', label: 'Laundry' },
  { key: 'cooking', icon: 'restaurant', label: 'Cooking' },
  { key: 'call-family', icon: 'call', label: 'Call family' },
  { key: 'message-friend', icon: 'chatbubble', label: 'Message friend' },
  { key: 'gratitude', icon: 'sparkles', label: 'Gratitude' },
  { key: 'custom', icon: 'star', label: 'Custom' },
  { key: 'default', icon: 'checkmark-circle', label: 'Habit' },
]

export const DEFAULT_HABIT_ICON_KEY = 'default'

export const getHabitIconConfig = (key?: string): HabitIconConfig => {
  if (!key) {
    return (
      HABIT_ICONS.find((i) => i.key === DEFAULT_HABIT_ICON_KEY) ??
      HABIT_ICONS[0]
    )
  }
  return HABIT_ICONS.find((i) => i.key === key) ?? HABIT_ICONS[0]
}
