'use client';
import React, { useState, useMemo, useCallback } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function RandomGeneratorPage() {
  const [min, setMin] = useState('1');
  const [max, setMax] = useState('100');
  const [count, setCount] = useState('5');
  const [unique, setUnique] = useState(true);
  const [sortResults, setSortResults] = useState(false);
  const [generated, setGenerated] = useState<number[]>([]);
  const [history, setHistory] = useState<number[][]>([]);

  const generate = useCallback(() => {
    const minVal = parseInt(min, 10);
    const maxVal = parseInt(max, 10);
    const countVal = parseInt(count, 10);
    if (isNaN(minVal) || isNaN(maxVal) || isNaN(countVal)) return;
    if (minVal > maxVal) return;
    const validCount = Math.min(countVal, 100);
    const maxPossible = maxVal - minVal + 1;

    let results: number[];
    if (unique && validCount > maxPossible) {
      results = Array.from({ length: maxPossible }, (_, i) => minVal + i);
    } else if (unique) {
      const pool = Array.from({ length: maxPossible }, (_, i) => minVal + i);
      results = [];
      for (let i = 0; i < validCount; i++) {
        const idx = Math.floor(Math.random() * pool.length);
        results.push(pool[idx]);
        pool.splice(idx, 1);
      }
    } else {
      results = Array.from({ length: validCount }, () => Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal);
    }

    if (sortResults) results.sort((a, b) => a - b);
    setGenerated(results);
    setHistory((prev) => [results, ...prev].slice(0, 5));
  }, [min, max, count, unique, sortResults]);

  const error = useMemo(() => {
    const minVal = parseInt(min, 10);
    const maxVal = parseInt(max, 10);
    const countVal = parseInt(count, 10);
    if (isNaN(minVal) || isNaN(maxVal) || isNaN(countVal)) return '';
    if (minVal > maxVal) return 'Min must be less than or equal to Max';
    if (unique && countVal > (maxVal - minVal + 1)) return `Cannot generate ${countVal} unique numbers in range ${minVal}-${maxVal}`;
    return '';
  }, [min, max, count, unique]);

  const faq = [
    { question: 'Can I generate truly random numbers?', answer: 'This tool uses JavaScript Math.random(), which is a pseudo-random number generator suitable for most everyday uses.' },
    { question: 'What is the maximum range?', answer: 'Numbers are generated as JavaScript integers. The practical range is from -2^53 to 2^53.' },
  ];

  const relatedTools = [
    { name: 'BMI Calculator', path: '/misc-tools/bmi-calculator' },
    { name: 'Stopwatch Timer', path: '/misc-tools/stopwatch-timer' },
  ];

  return (
    <ToolLayout title="Random Number Generator" description="Generate random numbers with customizable range, count, and options for uniqueness and sorting." faq={faq} relatedTools={relatedTools}>
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <Input label="Min Value" type="number" placeholder="1" value={min} onChange={(e) => setMin(e.target.value)} />
          <Input label="Max Value" type="number" placeholder="100" value={max} onChange={(e) => setMax(e.target.value)} />
          <Input label="Count (1-100)" type="number" min="1" max="100" placeholder="5" value={count} onChange={(e) => setCount(e.target.value)} />
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <label className="flex items-center gap-2 text-sm text-text-primary cursor-pointer">
            <input type="checkbox" checked={unique} onChange={(e) => setUnique(e.target.checked)} className="rounded border-border" />
            Unique only (no duplicates)
          </label>
          <label className="flex items-center gap-2 text-sm text-text-primary cursor-pointer">
            <input type="checkbox" checked={sortResults} onChange={(e) => setSortResults(e.target.checked)} className="rounded border-border" />
            Sort results
          </label>
        </div>

        {error && <p className="text-xs text-error">{error}</p>}

        <Button onClick={generate}>Generate Numbers</Button>

        {generated.length > 0 && (
          <Card hover={false} className="p-4">
            <h3 className="text-sm font-semibold text-text-primary mb-2">Generated Numbers</h3>
            <div className="flex flex-wrap gap-2">
              {generated.map((num, i) => (
                <span key={i} className="px-3 py-1.5 bg-background rounded-lg font-mono text-sm font-semibold text-primary border border-border">{num}</span>
              ))}
            </div>
          </Card>
        )}

        {history.length > 0 && (
          <Card hover={false} className="p-4">
            <h3 className="text-sm font-semibold text-text-primary mb-2">History (Last 5 Sets)</h3>
            <div className="space-y-2">
              {history.map((set, i) => (
                <div key={i} className="flex flex-wrap gap-1.5">
                  {set.slice(0, 20).map((num, j) => (
                    <span key={j} className="px-2 py-0.5 bg-background rounded font-mono text-xs text-text-secondary">{num}</span>
                  ))}
                  {set.length > 20 && <span className="text-xs text-text-secondary">+{set.length - 20} more</span>}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </ToolLayout>
  );
}
