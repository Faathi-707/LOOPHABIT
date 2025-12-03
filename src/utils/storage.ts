import * as SecureStore from 'expo-secure-store';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

const TABLE = 'kv_store';

async function supabaseGetItem<T>(key: string): Promise<T | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from(TABLE).select('value').eq('key', key).maybeSingle();
  if (error) return null;
  return (data?.value as T) ?? null;
}
async function supabaseSetItem(key: string, value: unknown): Promise<void> {
  if (!supabase) return;
  const payload = typeof value === 'string' ? value : value ?? null;
  const { error } = await supabase.from(TABLE).upsert({ key, value: payload }, { onConflict: 'key' });
  if (error) throw error;
}
async function supabaseRemoveItem(key: string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from(TABLE).delete().eq('key', key);
  if (error) throw error;
}

async function secureGetItem<T>(key: string): Promise<T | null> {
  const raw = await SecureStore.getItemAsync(key);
  if (raw == null) return null;
  try { return JSON.parse(raw) as T; } catch { return raw as unknown as T; }
}
async function secureSetItem(key: string, value: unknown): Promise<void> {
  const serialized = typeof value === 'string' ? value : JSON.stringify(value ?? null);
  await SecureStore.setItemAsync(key, serialized);
}
async function secureRemoveItem(key: string): Promise<void> {
  await SecureStore.deleteItemAsync(key);
}

export const storage = {
  async getItem<T = string>(key: string): Promise<T | null> {
    const remote = await supabaseGetItem<T>(key);
    if (remote !== null) return remote;
    return secureGetItem<T>(key);
  },
  async setItem(key: string, value: unknown): Promise<void> {
    if (supabase) {
      await supabaseSetItem(key, value);
      return;
    }
    await secureSetItem(key, value);
  },
  async removeItem(key: string): Promise<void> {
    if (supabase) {
      await supabaseRemoveItem(key);
    }
    await secureRemoveItem(key);
  },
};