'use client';
import React, { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

export default function TextFormatterPage() {
  const [input, setInput] = useState('');
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [copied, copy] = useCopyToClipboard();

  const operations: { label: string; action: (s: string) => string }[] = useMemo(() => [
    { label: 'Remove extra spaces', action: (s) => s.replace(/ +/g, ' ') },
    { label: 'Remove all spaces', action: (s) => s.replace(/\s/g, '') },
    { label: 'Remove line breaks', action: (s) => s.replace(/\n/g, ' ') },
    { label: 'Add line breaks after sentences', action: (s) => s.replace(/\.\s*/g, '.\n') },
    { label: 'Remove duplicate lines', action: (s) => Array.from(new Set(s.split('\n'))).join('\n') },
    { label: 'Sort lines A-Z', action: (s) => [...s.split('\n')].sort((a, b) => a.localeCompare(b)).join('\n') },
    { label: 'Sort lines Z-A', action: (s) => [...s.split('\n')].sort((a, b) => b.localeCompare(a)).join('\n') },
    { label: 'Reverse text', action: (s) => [...s].reverse().join('') },
    { label: 'Remove accents', action: (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '') },
    { label: 'Remove special characters', action: (s) => s.replace(/[^a-zA-Z0-9\s]/g, '') },
    { label: 'Remove numbers', action: (s) => s.replace(/[0-9]/g, '') },
    { label: 'Trim whitespace', action: (s) => s.trim() },
  ], []);

  const [activeOp, setActiveOp] = useState<string | null>(null);

  const result = useMemo(() => {
    if (activeOp === 'replace' && findText) {
      return input.split(findText).join(replaceText);
    }
    if (!activeOp || !input) return '';
    const op = operations.find((o) => o.label === activeOp);
    return op ? op.action(input) : '';
  }, [activeOp, input, findText, replaceText, operations]);

  const handleOperation = (label: string) => {
    setActiveOp((prev) => prev === label ? null : label);
  };

  const handleFindReplace = () => {
    if (!findText) return;
    setActiveOp('replace');
  };

  const faq = [
    { question: 'What can I use text formatter for?', answer: 'You can clean up copied text, remove unwanted formatting, sort lines, and perform bulk find-and-replace operations.' },
    { question: 'Does remove duplicate lines work with exact matches only?', answer: 'Yes, it removes exact duplicate lines. Lines that differ by even a single character will be kept.' },
    { question: 'How does remove accents work?', answer: 'It uses Unicode normalization (NFD) to decompose accented characters into base characters and combining marks, then removes the combining marks.' },
  ];

  const relatedTools = [
    { name: 'Case Converter', path: '/text-tools/case-converter' },
    { name: 'Word Counter', path: '/text-tools/word-counter' },
    { name: 'Text Reverser', path: '/text-tools/text-reverser' },
  ];

  return (
    <ToolLayout title="Text Formatter & Cleaner" description="Remove extra spaces, line breaks, duplicates, sort lines, and clean text." faq={faq} relatedTools={relatedTools}>
      <textarea
        className="input-field min-h-[150px] w-full resize-y font-mono"
        placeholder="Type or paste your text here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div className="mt-4 flex flex-wrap gap-2">
        {operations.map((op) => (
          <Button key={op.label} size="sm" variant={activeOp === op.label ? 'primary' : 'secondary'} onClick={() => handleOperation(op.label)}>
            {op.label}
          </Button>
        ))}
      </div>
      <Card className="mt-6 p-4">
        <h3 className="text-sm font-semibold text-text-primary mb-3">Find & Replace</h3>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[150px]">
            <label className="label-text">Find</label>
            <input className="input-field w-full" value={findText} onChange={(e) => setFindText(e.target.value)} />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="label-text">Replace with</label>
            <input className="input-field w-full" value={replaceText} onChange={(e) => setReplaceText(e.target.value)} />
          </div>
          <Button variant={activeOp === 'replace' ? 'primary' : 'primary'} onClick={handleFindReplace}>Replace All</Button>
        </div>
      </Card>
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-text-primary">Result</h3>
          <Button size="sm" variant="ghost" onClick={() => copy(result)}>
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
        <textarea
          className="input-field min-h-[150px] w-full resize-y font-mono"
          readOnly
          value={result}
          placeholder="Result will appear here..."
        />
      </div>
    </ToolLayout>
  );
}
