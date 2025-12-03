import { create } from 'zustand';
import type { Language } from '@/i18n';
import type { AppUser } from '@/types';
import { storage } from '@/utils/storage';
import { api } from '@/api';
import { supabase } from '@/lib/supabase';

export type AuthUser = AppUser | null;

interface AuthStoreState {
  isLoggedIn: boolean;
  isGuest: boolean;
  user: AuthUser;
  isLoadingAuth: boolean;
  isDarkMode: boolean;
  language: 'en' | 'dv';
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: AuthUser) => void;
  clearUser: () => void;
  continueAsGuest: () => void;
  setDarkMode: (next: boolean) => void;
  toggleDarkMode: () => void;
  setLanguage: (lang: 'en' | 'dv') => void;
  hydrate: () => Promise<void>;
  loadFromStorage: () => Promise<void>;
}

export const useAuthStore = create<AuthStoreState>((set, get) => ({
  isLoggedIn: false,
  isGuest: false,
  user: null,
  isLoadingAuth: false,
  isDarkMode: false,
  language: 'en',

  login: async (email, password) => {
    set({ isLoadingAuth: true });
    try {
      const { user: authUser } = await api.signIn(email, password);
      if (!authUser?.id) throw new Error('Login failed');

      const userData: AppUser = {
        id: authUser.id,
        name: (authUser as any)?.user_metadata?.name || email.split('@')[0],
        email: authUser.email || '',
      };

      set({ isLoggedIn: true, user: userData, isLoadingAuth: false });
    } catch (err) {
      set({ isLoadingAuth: false });
      throw err;
    }
  },

  signup: async (name, email, password) => {
    set({ isLoadingAuth: true });
    try {
      const { user: authUser } = await api.signUp(email, password, name);
      if (!authUser?.id) throw new Error('Signup failed');

      const userData: AppUser = {
        id: authUser.id,
        name: name || '',
        email: authUser.email || '',
      };

      set({ isLoggedIn: true, user: userData, isLoadingAuth: false });
    } catch (err) {
      set({ isLoadingAuth: false });
      throw err;
    }
  },

  logout: async () => {
    set({ isLoadingAuth: true });
    try {
      await api.signOut();
      set({ isLoggedIn: false, user: null, isLoadingAuth: false });
    } catch (err) {
      set({ isLoadingAuth: false });
      throw err;
    }
  },

  setUser: (user) => {
    set({
      user,
      isLoggedIn: !!user,
    });
    // User data persistence is handled via getSession in hydrate
  },

  clearUser: () => {
    set({
      user: null,
      isLoggedIn: false,
    });
  },

  continueAsGuest: () => {
    set({ isGuest: true, isLoggedIn: false, user: null });
  },

  setDarkMode: (next) => {
    set({ isDarkMode: next });
    void storage.setItem('isDarkMode', next);
  },

  toggleDarkMode: () => {
    const next = !get().isDarkMode;
    set({ isDarkMode: next });
    void storage.setItem('isDarkMode', next);
  },

  setLanguage: (lang) => {
    const safe: Language = lang === 'dv' ? 'dv' : 'en';
    set({ language: safe });
    void storage.setItem('language', safe);
  },

  hydrate: async () => {
    try {
      // Check for active Supabase session
      const session = await api.getSession();

      if (session?.user?.id) {
        const userData: AppUser = {
          id: session.user.id,
          name: (session.user as any)?.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
        };
        set({ user: userData, isLoggedIn: true });
      } else {
        // No session = not logged in; keep guest mode off by default
        set({ user: null, isLoggedIn: false, isGuest: false });
      }
    } catch (err) {
      console.warn('[AuthStore] Session check failed:', err);
      set({ user: null, isLoggedIn: false });
    }

    // Load theme & language from storage
    const [storedDarkMode, storedLanguage] = await Promise.all([
      storage.getItem<boolean>('isDarkMode'),
      storage.getItem<Language>('language'),
    ]);

    if (typeof storedDarkMode === 'boolean') {
      set({ isDarkMode: storedDarkMode });
    }

    if (storedLanguage === 'en' || storedLanguage === 'dv') {
      set({ language: storedLanguage });
    }
  },

  loadFromStorage: async () => {
    // Alias for hydrate
    await get().hydrate();
  },
}));