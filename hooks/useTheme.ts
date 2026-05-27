'use client';
import { useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';

export function useTheme() {
  const { theme, setTheme, toggleTheme } = useStore();
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      const isDark = document.documentElement.classList.contains('dark');
      if ((theme === 'dark') !== isDark) {
        setTheme(isDark ? 'dark' : 'light');
      }
      return;
    }
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme, setTheme]);

  return { theme, setTheme, toggleTheme };
}
