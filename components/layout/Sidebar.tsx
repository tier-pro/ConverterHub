'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { toolCategories } from '@/lib/constants/tools';
import { ArrowLeftRight, Type, Palette, Image, File, Code, Calendar, Wallet, Hash, Grid } from 'lucide-react';
import { useStore } from '@/store/useStore';

const iconMap: Record<string, React.ReactNode> = {
  ArrowLeftRight: <ArrowLeftRight className="w-4 h-4" />,
  Type: <Type className="w-4 h-4" />,
  Palette: <Palette className="w-4 h-4" />,
  Image: <Image className="w-4 h-4" />,
  File: <File className="w-4 h-4" />,
  Code: <Code className="w-4 h-4" />,
  Calendar: <Calendar className="w-4 h-4" />,
  Wallet: <Wallet className="w-4 h-4" />,
  Hash: <Hash className="w-4 h-4" />,
  Grid: <Grid className="w-4 h-4" />,
};

export function Sidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = React.useState<string | null>(null);
  const { recentTools } = useStore();

  React.useEffect(() => {
    for (const cat of toolCategories) {
      if (cat.tools.some(t => t.path === pathname)) {
        setExpanded(cat.id);
        break;
      }
    }
  }, [pathname]);

  return (
    <aside className="w-60 shrink-0 border-r border-border bg-surface h-[calc(100vh-4rem)] overflow-y-auto sticky top-16">
      <nav className="p-3 space-y-1">
        {toolCategories.map((cat) => (
          <div key={cat.id}>
            <button
              onClick={() => setExpanded(expanded === cat.id ? null : cat.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${expanded === cat.id ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-text-primary'}`}
            >
              {iconMap[cat.icon]}
              <span className="flex-1 text-left">{cat.name}</span>
              <svg className={`w-3.5 h-3.5 transition-transform ${expanded === cat.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {expanded === cat.id && (
              <div className="ml-3 mt-1 space-y-0.5">
                {cat.tools.map((tool) => (
                  <Link key={tool.id} href={tool.path} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${pathname === tool.path ? 'bg-primary/10 text-primary font-medium' : 'text-text-secondary hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-text-primary'}`}>
                    {tool.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
      {recentTools.length > 0 && (
        <div className="border-t border-border p-3">
          <p className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">Recent</p>
          <div className="space-y-0.5">
            {recentTools.slice(0, 5).map((path) => {
              const tool = toolCategories.flatMap(c => c.tools).find(t => t.path === path);
              if (!tool) return null;
              return (
                <Link key={path} href={path} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-secondary hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-text-primary transition-colors">
                  {tool.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
}
