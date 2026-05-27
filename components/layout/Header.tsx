'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Menu, Sun, Moon, Search, Merge, X } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useStore } from '@/store/useStore';
import { allTools } from '@/lib/constants/tools';
import Link from 'next/link';

export function Header({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const { theme, toggleTheme } = useTheme();
  const { searchQuery, setSearchQuery } = useStore();
  const [showSearch, setShowSearch] = useState(false);
  const [results, setResults] = useState<typeof allTools>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      setResults(allTools.filter(t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)).slice(0, 6));
    } else {
      setResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSearch(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button onClick={onMenuToggle} className="lg:hidden p-2 rounded-lg hover:bg-surface-secondary transition-colors" aria-label="Toggle navigation menu">
            <Menu className="w-5 h-5 text-text-primary" />
          </button>
          <Link href="/" className="flex items-center gap-2.5">
            <svg viewBox="0 0 32 32" className="w-8 h-8" aria-label="ConverterHub logo">
              <rect width="32" height="32" rx="7" fill="#0B7B83"/>
              <g fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="16" cy="16" r="9.5" strokeWidth="1.3"/>
                <path d="M16 10.5v4l-2.5-2M16 21.5v-4l2.5 2"/>
                <path d="M10.5 16h4l-2-2.5M21.5 16h-4l2 2.5"/>
              </g>
            </svg>
            <span className="hidden sm:block text-base font-bold text-text-primary">ConverterHub</span>
          </Link>
        </div>

        <div ref={searchRef} className="relative flex-1 max-w-md mx-4 hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
          <input
            type="text"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setShowSearch(true); }}
            onFocus={() => setShowSearch(true)}
            className="input-field pl-9 h-9 text-sm"
          />
          {showSearch && results.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 rounded-xl border border-border bg-surface shadow-lg z-50 overflow-hidden">
              {results.map((tool) => (
                <Link key={tool.id} href={tool.path} onClick={() => { setShowSearch(false); setSearchQuery(''); }} className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-secondary transition-colors">
                  <span className="text-sm font-medium text-text-primary">{tool.name}</span>
                  <span className="text-xs text-text-secondary truncate">{tool.description}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-surface-secondary transition-colors" aria-label="Toggle theme">
            {theme === 'dark' ? <Sun className="w-4 h-4 text-text-primary" /> : <Moon className="w-4 h-4 text-text-primary" />}
          </button>
        </div>
      </div>
    </header>
  );
}
