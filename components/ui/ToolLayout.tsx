'use client';
import React from 'react';
import { Card } from './Card';
import { useStore } from '@/store/useStore';
import { ChevronDown } from 'lucide-react';

interface ToolLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  faq?: { question: string; answer: string }[];
  relatedTools?: { name: string; path: string }[];
  formula?: string;
  conversionTable?: { label: string; value: string }[];
}

export function ToolLayout({ title, description, children, faq, relatedTools, formula, conversionTable }: ToolLayoutProps) {
  const { addRecentTool } = useStore();

  React.useEffect(() => {
    if (typeof window !== 'undefined') addRecentTool(window.location.pathname);
  }, [addRecentTool]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">{title}</h1>
        <p className="mt-2 text-text-secondary leading-relaxed">{description}</p>
      </div>

      <Card>{children}</Card>

      {formula && (
        <div className="rounded-xl bg-surface-secondary p-5 border border-border">
          <h2 className="text-sm font-semibold text-text-primary mb-3 uppercase tracking-wider">Conversion Formula</h2>
          <div className="font-mono text-sm text-text-primary leading-relaxed">{formula}</div>
        </div>
      )}

      {conversionTable && conversionTable.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-text-primary mb-3 uppercase tracking-wider">Common Conversions</h2>
          <div className="overflow-x-auto rounded-xl border border-border bg-surface">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-text-secondary font-medium text-xs uppercase tracking-wider">Unit</th>
                  <th className="text-right py-3 px-4 text-text-secondary font-medium text-xs uppercase tracking-wider">Value</th>
                </tr>
              </thead>
              <tbody>
                {conversionTable.map((row, i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0">
                    <td className="py-2.5 px-4 text-text-primary">{row.label}</td>
                    <td className="py-2.5 px-4 text-right font-mono text-text-primary">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {faq && faq.length > 0 && (
        <div className="rounded-xl border border-border bg-surface divide-y divide-border">
          <h2 className="text-sm font-semibold text-text-primary px-5 py-4 uppercase tracking-wider">Frequently Asked Questions</h2>
          {faq.map((item, i) => (
            <details key={i} className="group px-5 py-3">
              <summary className="cursor-pointer font-medium text-text-primary list-none flex items-center justify-between gap-4">
                <span className="text-sm">{item.question}</span>
                <ChevronDown className="w-4 h-4 shrink-0 text-text-secondary transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-2 text-sm text-text-secondary leading-relaxed">{item.answer}</p>
            </details>
          ))}
        </div>
      )}

      {relatedTools && relatedTools.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-text-primary mb-3 uppercase tracking-wider">Related Tools</h2>
          <div className="flex flex-wrap gap-2">
            {relatedTools.map((tool) => (
              <a key={tool.path} href={tool.path} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-text-secondary hover:bg-surface-secondary hover:text-text-primary transition-colors">{tool.name}</a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
