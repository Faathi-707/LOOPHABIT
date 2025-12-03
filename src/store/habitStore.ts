import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type { SupabaseClient } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { Habit, Completion, ProgressData } from '@/types'
import { calculateProgress, isHabitCompletedOnDate } from '@/utils/helpers'
import { useAuthStore } from './authStore'

type DbHabit = {
  id: string
  user_id: string | null
  name: string
  icon: string | null
  color: string | null
  frequency: Habit['frequency']
  notes: string | null
  is_active: boolean
  created_at: string
  updated_at: string | null
}

type DbCompletion = {
  id: string
  user_id: string | null
  habit_id: string
  completed_on: string
  created_at: string
  updated_at: string | null
}

export type NewHabit = {
  name: Habit['name']
  icon?: Habit['icon']
  color?: Habit['color']
  frequency: Habit['frequency']
  notes?: Habit['notes']
  isActive?: Habit['isActive']
}

interface HabitStoreState {
  habits: Habit[]
  completions: Completion[]
  isLoading: boolean
  error: string | null
  fetchHabits: () => Promise<void>
  fetchCompletions: () => Promise<void>
  syncAll: () => Promise<void>
  load: () => Promise<void>
  createHabit: (h: NewHabit) => Promise<void>
  addHabit: (h: NewHabit) => Promise<void>
  updateHabit: (id: string, patch: Partial<NewHabit>) => Promise<void>
  deleteHabit: (id: string) => Promise<void>
  getHabitById: (id: string) => Habit | undefined
  toggleCompletion: (habitId: string, date: string) => Promise<void>
  isCompletedOnDate: (habitId: string, date: string) => boolean
  getProgress: () => ProgressData
  clearAll: () => Promise<void>
  clearError: () => void
}

const getClient = (): SupabaseClient => {
  if (!supabase) throw new Error('Supabase client is not initialised')
  return supabase as SupabaseClient
}

const mapHabit = (row: DbHabit): Habit => ({
  id: row.id,
  name: row.name,
  icon: row.icon ?? '',
  color: row.color ?? '',
  frequency: row.frequency,
  notes: row.notes ?? undefined,
  isActive: row.is_active,
  createdAt: new Date(row.created_at).getTime(),
})

const mapCompletion = (row: DbCompletion): Completion => ({
  id: row.id,
  habitId: row.habit_id,
  date: row.completed_on,
  completedAt: new Date(row.created_at).getTime(), 
})

export const useHabitStore = create<HabitStoreState>()(
  persist(
    (set, get) => ({
      habits: [],
      completions: [],
      isLoading: false,
      error: null,

      async fetchHabits() {
        const { isLoggedIn, user } = useAuthStore.getState()
        if (!isLoggedIn || !user) return

        const client = getClient()
        set({ isLoading: true, error: null })
        const { data, error } = await client
          .from('habits')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) {
          set({ error: error.message, isLoading: false })
          return
        }

        set({
          habits: (data ?? []).map(mapHabit),
          isLoading: false,
        })
      },

      async fetchCompletions() {
        const { isLoggedIn, user } = useAuthStore.getState()
        if (!isLoggedIn || !user) return

        const client = getClient()
        set({ isLoading: true, error: null })
        const { data, error } = await client
          .from('completions')
          .select('*')
          .eq('user_id', user.id)
          .order('completed_on', { ascending: false })

        if (error) {
          set({ error: error.message, isLoading: false })
          return
        }

        set({
          completions: (data ?? []).map(mapCompletion),
          isLoading: false,
        })
      },

      async syncAll() {
        await Promise.all([get().fetchHabits(), get().fetchCompletions()])
      },

      async load() {
        await get().syncAll()
      },

      async createHabit(h) {
        const { isLoggedIn, user } = useAuthStore.getState()
        const now = Date.now()

        if (!isLoggedIn || !user) {
          const localHabit: Habit = {
            id: `guest-${now}`,
            name: h.name,
            icon: h.icon ?? '',
            color: h.color ?? '',
            frequency: h.frequency,
            notes: h.notes,
            isActive: h.isActive ?? true,
            createdAt: now,
          }
          set((state) => ({ habits: [localHabit, ...state.habits] }))
          return
        }

        const client = getClient()
        const { data, error } = await client
          .from('habits')
          .insert([
            {
              user_id: user.id,
              name: h.name,
              icon: h.icon ?? '',
              color: h.color ?? '',
              frequency: h.frequency,
              notes: h.notes ?? null,
              is_active: h.isActive ?? true,
            },
          ])
          .select()
          .single()

        if (error) {
          set({ error: error.message })
          throw error
        }

        set((state) => ({
          habits: [mapHabit(data as DbHabit), ...state.habits],
        }))
      },

      async addHabit(h) {
        await get().createHabit(h)
      },

      async updateHabit(id, patch) {
        const { isLoggedIn, user } = useAuthStore.getState()

        if (!isLoggedIn || !user) {
          set((state) => ({
            habits: state.habits.map((hab) =>
              hab.id === id
                ? {
                    ...hab,
                    ...patch,
                    icon: patch.icon ?? hab.icon,
                    color: patch.color ?? hab.color,
                    notes:
                      patch.notes === undefined ? hab.notes : patch.notes,
                    isActive:
                      patch.isActive === undefined
                        ? hab.isActive
                        : patch.isActive,
                  }
                : hab,
            ),
          }))
          return
        }

        const client = getClient()
        const { data, error } = await client
          .from('habits')
          .update({
            name: patch.name,
            icon: patch.icon,
            color: patch.color,
            frequency: patch.frequency,
            notes:
              patch.notes === undefined ? undefined : patch.notes ?? null,
            is_active: patch.isActive,
          })
          .eq('id', id)
          .eq('user_id', user.id)
          .select()
          .single()

        if (error) {
          set({ error: error.message })
          throw error
        }

        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id ? mapHabit(data as DbHabit) : h,
          ),
        }))
      },

      async deleteHabit(id) {
        const { isLoggedIn, user } = useAuthStore.getState()

        if (!isLoggedIn || !user) {
          set((state) => ({
            habits: state.habits.filter((h) => h.id !== id),
            completions: state.completions.filter(
              (c) => c.habitId !== id,
            ),
          }))
          return
        }

        const client = getClient()
        await client.from('completions').delete().eq('habit_id', id)
        const { error } = await client
          .from('habits')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id)

        if (error) {
          set({ error: error.message })
          throw error
        }

        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id),
          completions: state.completions.filter(
            (c) => c.habitId !== id,
          ),
        }))
      },

      getHabitById(id) {
        return get().habits.find((h) => h.id === id)
      },

      async toggleCompletion(habitId, date) {
        const { isLoggedIn, user } = useAuthStore.getState()
        const already = get().isCompletedOnDate(habitId, date)
        const nowIso = new Date().toISOString()

        if (!isLoggedIn || !user) {
          if (already) {
            set((state) => ({
              completions: state.completions.filter(
                (c) => !(c.habitId === habitId && c.date === date),
              ),
            }))
          } else {
            const localCompletion: Completion = {
            id: `guest-${Date.now()}`,
            habitId,
            date,
            completedAt: new Date(nowIso).getTime(),
          }
            set((state) => ({
              completions: [...state.completions, localCompletion],
            }))
          }
          return
        }

        const client = getClient()

        if (already) {
          const existing = get().completions.find(
            (c) => c.habitId === habitId && c.date === date,
          )
          if (!existing) return

          const { error } = await client
            .from('completions')
            .delete()
            .eq('id', existing.id)
            .eq('user_id', user.id)

          if (error) {
            set({ error: error.message })
            throw error
          }

          set((state) => ({
            completions: state.completions.filter(
              (c) => c.id !== existing.id,
            ),
          }))
        } else {
          const { data, error } = await client
            .from('completions')
            .insert([
              {
                user_id: user.id,
                habit_id: habitId,
                completed_on: date,
              },
            ])
            .select()
            .single()

          if (error) {
            set({ error: error.message })
            throw error
          }

          set((state) => ({
            completions: [
              ...state.completions,
              mapCompletion(data as DbCompletion),
            ],
          }))
        }
      },

      isCompletedOnDate(habitId, date) {
        return isHabitCompletedOnDate(get().completions, habitId, date)
      },

      getProgress() {
        return calculateProgress(get().habits, get().completions)
      },

      async clearAll() {
        const { isLoggedIn, user } = useAuthStore.getState()

        if (!isLoggedIn || !user) {
          set({ habits: [], completions: [] })
          return
        }

        const client = getClient()
        await client.from('completions').delete().eq('user_id', user.id)
        await client.from('habits').delete().eq('user_id', user.id)
        set({ habits: [], completions: [] })
      },

      clearError() {
        set({ error: null })
      },
    }),
    {
      name: 'habit-store',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist data, not methods/flags
      partialize: (state) => ({
        habits: state.habits,
        completions: state.completions,
      }),
    },
  ),
)