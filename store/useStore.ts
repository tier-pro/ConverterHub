'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Theme } from '@/types';

interface StoreState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  favorites: string[];
  toggleFavorite: (path: string) => void;
  recentTools: string[];
  addRecentTool: (path: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
      favorites: [],
      toggleFavorite: (path) =>
        set((s) => ({
          favorites: s.favorites.includes(path)
            ? s.favorites.filter((f) => f !== path)
            : [...s.favorites, path],
        })),
      recentTools: [],
      addRecentTool: (path) =>
        set((s) => ({
          recentTools: [path, ...s.recentTools.filter((t) => t !== path)].slice(0, 10),
        })),
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
    }),
    { name: 'converterhub-storage', partialize: (state) => ({ theme: state.theme, favorites: state.favorites, recentTools: state.recentTools }) }
  )
);
