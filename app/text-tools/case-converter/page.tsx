'use client';
import React, { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { camelCase, snakeCase, kebabCase, titleCase, sentenceCase, alternatingCase } from '@/lib/utils/formatting';

export default function CaseConverterPage() {
  const [input, setInput] = useState('');
  const [copied, copy] = useCopyToClipboard();

  const cases = useMemo(() => ({
    'UPPERCASE': input.toUpperCase(),
    'lowercase': input.toLowerCase(),
    'Title Case': titleCase(input),
    'Sentence case': sentenceCase(input),
    'aLtErNaTiNg CaSe': alternatingCase(input),
    'camelCase': camelCase(input),
    'snake_case': snakeCase(input),
    'kebab-case': kebabCase(input),
  }), [input]);

  const chars = input.length;
  const words = input.trim() ? input.trim().split(/\s+/).length : 0;

  const faq = [
    { question: 'What is a case converter?', answer: 'A case converter is a tool that transforms text between different capitalization styles such as UPPERCASE, lowercase, Title Case, camelCase, and more.' },
    { question: 'What is camelCase used for?', answer: 'camelCase is commonly used in programming for variable and function names, where the first word is lowercase and subsequent words start with uppercase.' },
    { question: 'What is snake_case used for?', answer: 'snake_case is used in programming for variable names, file names, and database fields where words are separated by underscores.' },
  ];

  const relatedTools = [
    { name: 'Word Counter', path: '/text-tools/word-counter' },
    { name: 'Text Formatter', path: '/text-tools/text-formatter' },
    { name: 'Text Reverser', path: '/text-tools/text-reverser' },
  ];

  return (
    <ToolLayout title="Case Converter" description="Convert text between UPPERCASE, lowercase, Title Case, camelCase, snake_case, and more." faq={faq} relatedTools={relatedTools}>
      <textarea
        className="input-field min-h-[150px] w-full resize-y font-mono"
        placeholder="Type or paste your text here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div className="mt-2 text-sm text-text-secondary flex gap-4">
        <span>Characters: {chars}</span>
        <span>Words: {words}</span>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {Object.entries(cases).map(([label, value]) => (
          <Card key={label} hover={false} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-text-primary">{label}</h3>
              <Button size="sm" variant="ghost" onClick={() => copy(value)}>
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            <p className="text-sm text-text-secondary font-mono break-all">{value || '—'}</p>
          </Card>
        ))}
      </div>
    </ToolLayout>
  );
}
