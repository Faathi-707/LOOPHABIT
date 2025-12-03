import { supabase } from '@/lib/supabase';

export type HabitRow = {
  id: string;
  user_id: string | null;
  name: string;
  icon: string;
  color: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  notes: string | null;
  is_active: boolean;
  created_at: string;
};

export const api = {
  signUp: async (email: string, password: string, name: string) => {
    if (!supabase) {
      console.warn('[api] Supabase not configured. Using fake signup.');
      return { user: { id: 'local-user', email }, session: null };
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) throw error;
    return data;
  },

  signIn: async (email: string, password: string) => {
    if (!supabase) {
      console.warn('[api] Supabase not configured. Using fake login.');
      return { user: { id: 'local-user', email }, session: null };
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  signOut: async () => {
    if (!supabase) {
      console.warn('[api] Supabase not configured. Skipping signOut.');
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  getSession: async () => {
    if (!supabase) {
      console.warn('[api] Supabase not configured. No session available.');
      return null;
    }
    const { data } = await supabase.auth.getSession();
    return data.session ?? null;
  },

  fetchHabits: async (): Promise<HabitRow[]> => {
    if (!supabase) {
      console.warn('[api] Supabase not configured. Returning empty habits.');
      return [];
    }
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;
    
    if (!userId) return []; // Not authenticated, return empty

    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  createHabit: async (values: Omit<HabitRow, 'id' | 'created_at' | 'user_id'>): Promise<HabitRow> => {
    if (!supabase) {
      console.warn('[api] Supabase not configured. Using fake habit creation.');
      return {
        id: `local-${Date.now()}`,
        user_id: 'local-user',
        ...values,
        created_at: new Date().toISOString(),
      };
    }
    const { data, error } = await supabase
      .from('habits')
      .insert(values)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  updateHabit: async (id: string, values: Partial<HabitRow>) => {
    if (!supabase) {
      console.warn('[api] Supabase not configured. Skipping habit update.');
      return { id, ...values } as HabitRow;
    }
    const { data, error } = await supabase
      .from('habits')
      .update(values)
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    return data;
  },

  deleteHabit: async (id: string) => {
    if (!supabase) {
      console.warn('[api] Supabase not configured. Skipping habit delete.');
      return;
    }
    const { error } = await supabase.from('habits').delete().eq('id', id);
    if (error) throw error;
  },
};