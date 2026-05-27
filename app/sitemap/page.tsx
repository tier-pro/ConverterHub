'use client';
import React from 'react';
import { Card } from '@/components/ui/Card';
import { toolCategories } from '@/lib/constants/tools';
import Link from 'next/link';
import {
  ArrowLeftRight, Type, Palette, Image, File,
  Code, Calendar, Wallet, Hash, Grid,
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  ArrowLeftRight: <ArrowLeftRight className="w-5 h-5" />,
  Type: <Type className="w-5 h-5" />,
  Palette: <Palette className="w-5 h-5" />,
  Image: <Image className="w-5 h-5" />,
  File: <File className="w-5 h-5" />,
  Code: <Code className="w-5 h-5" />,
  Calendar: <Calendar className="w-5 h-5" />,
  Wallet: <Wallet className="w-5 h-5" />,
  Hash: <Hash className="w-5 h-5" />,
  Grid: <Grid className="w-5 h-5" />,
};

export default function SitemapPage() {
  return (
    <div className="space-y-8 animate-fade-in max-w-3xl">
      <h1 className="text-3xl font-bold text-text-primary">Sitemap</h1>
      <p className="text-text-secondary">Browse all available tools organized by category.</p>

      <div className="space-y-6">
        {toolCategories.map((cat) => (
          <Card key={cat.id} className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {iconMap[cat.icon] || <Grid className="w-5 h-5" />}
              </div>
              <h2 className="text-xl font-semibold text-text-primary">{cat.name}</h2>
            </div>
            <ul className="space-y-2">
              {cat.tools.map((tool) => (
                <li key={tool.id}>
                  <Link
                    href={tool.path}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-text-secondary hover:bg-surface-secondary hover:text-primary transition-colors"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />
                    <span className="font-medium">{tool.name}</span>
                    <span className="text-sm text-text-muted hidden sm:inline truncate">
                      — {tool.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
