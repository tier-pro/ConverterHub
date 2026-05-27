'use client';
import React from 'react';
import Link from 'next/link';
import { Search, ArrowRight, Shield, Zap, Smartphone, Eye, Github } from 'lucide-react';
import { toolCategories, popularTools, allTools } from '@/lib/constants/tools';
import { Card } from '@/components/ui/Card';
import { useStore } from '@/store/useStore';
import { ArrowLeftRight, Type, Palette, Image, File, Code, Calendar, Wallet, Hash, Grid } from 'lucide-react';

const catIconMap: Record<string, React.ReactNode> = {
  ArrowLeftRight: <ArrowLeftRight className="w-6 h-6" />,
  Type: <Type className="w-6 h-6" />,
  Palette: <Palette className="w-6 h-6" />,
  Image: <Image className="w-6 h-6" />,
  File: <File className="w-6 h-6" />,
  Code: <Code className="w-6 h-6" />,
  Calendar: <Calendar className="w-6 h-6" />,
  Wallet: <Wallet className="w-6 h-6" />,
  Hash: <Hash className="w-6 h-6" />,
  Grid: <Grid className="w-6 h-6" />,
};

export default function HomePage() {
  const { searchQuery, setSearchQuery, recentTools } = useStore();
  const [filteredTools, setFilteredTools] = React.useState(allTools.slice(0, 12));

  React.useEffect(() => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      setFilteredTools(allTools.filter(t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)).slice(0, 12));
    } else {
      setFilteredTools(allTools.filter(t => popularTools.includes(t.id)));
    }
  }, [searchQuery]);

  return (
    <div className="space-y-12 animate-fade-in">
      <section className="text-center space-y-6 py-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-text-primary">
          Your All-in-One{' '}
          <span className="text-primary">
            Toolkit
          </span>
        </h1>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
          Free online tools for everyday conversions, calculations, and utilities. Fast, accurate, and privacy-focused.
        </p>
        <div className="relative max-w-lg mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input
            type="text"
            placeholder="Search any tool..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-12 h-14 text-lg rounded-2xl border-2 focus:border-primary"
          />
        </div>
      </section>

      {searchQuery && filteredTools.length > 0 && (
        <section>
          <h2 className="text-h3 font-bold text-text-primary mb-6">Search Results</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTools.map((tool) => (
              <Link key={tool.id} href={tool.path}>
                <Card className="h-full flex flex-col p-5">
                  <h3 className="font-semibold text-text-primary mb-1">{tool.name}</h3>
                  <p className="text-sm text-text-secondary flex-1">{tool.description}</p>
                  <div className="mt-3 flex items-center text-sm text-primary font-medium">
                    Use Tool <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {!searchQuery && (
        <>
          <section>
            <h2 className="text-h3 font-bold text-text-primary mb-6">Popular Tools</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {allTools.filter(t => popularTools.includes(t.id)).map((tool) => (
                <Link key={tool.id} href={tool.path}>
                  <Card className="h-full flex flex-col p-5">
                    <h3 className="font-semibold text-text-primary mb-1">{tool.name}</h3>
                    <p className="text-sm text-text-secondary flex-1">{tool.description}</p>
                    <div className="mt-3 flex items-center text-sm text-primary font-medium">
                      Use Tool <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-h3 font-bold text-text-primary mb-6">All Categories</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {toolCategories.map((cat) => (
                <Link key={cat.id} href={cat.tools[0]?.path || '/'}>
                  <Card className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        {catIconMap[cat.icon]}
                      </div>
                      <h3 className="font-semibold text-text-primary">{cat.name}</h3>
                    </div>
                    <p className="text-sm text-text-secondary">{cat.tools.length} tools</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {cat.tools.slice(0, 3).map((t) => (
                        <span key={t.id} className="text-xs px-2 py-0.5 rounded-full bg-surface-secondary text-text-secondary">{t.name}</span>
                      ))}
                      {cat.tools.length > 3 && <span className="text-xs px-2 py-0.5 rounded-full bg-surface-secondary text-text-secondary">+{cat.tools.length - 3} more</span>}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          {recentTools.length > 0 && (
            <section>
              <h2 className="text-h3 font-bold text-text-primary mb-6">Recently Used</h2>
              <div className="flex flex-wrap gap-2">
                {recentTools.slice(0, 6).map((path) => {
                  const tool = allTools.find(t => t.path === path);
                  if (!tool) return null;
                  return (
                    <Link key={path} href={path} className="btn-secondary text-sm">{tool.name}</Link>
                  );
                })}
              </div>
            </section>
          )}

          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: <Shield className="w-5 h-5" />, title: '100% Free', desc: 'No registration required. All tools are completely free.' },
              { icon: <Zap className="w-5 h-5" />, title: 'Blazing Fast', desc: 'Client-side processing means instant results.' },
              { icon: <Eye className="w-5 h-5" />, title: 'Privacy First', desc: 'All processing happens in your browser. Nothing leaves your device.' },
              { icon: <Smartphone className="w-5 h-5" />, title: 'Mobile Friendly', desc: 'Works seamlessly on all devices and screen sizes.' },
            ].map((feature) => (
              <Card key={feature.title} className="p-5 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">{feature.icon}</div>
                <div>
                  <h3 className="font-semibold text-text-primary">{feature.title}</h3>
                  <p className="text-sm text-text-secondary mt-0.5">{feature.desc}</p>
                </div>
              </Card>
            ))}
          </section>
        </>
      )}
    </div>
  );
}
