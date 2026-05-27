'use client';
import React, { useState } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { reverseText, reverseWords, reverseLines, shuffleArray, upsideDownText, mirrorText } from '@/lib/utils/formatting';

export default function TextReverserPage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [copied, copy] = useCopyToClipboard();

  const operations = [
    { label: 'Reverse entire text', action: () => setResult(reverseText(input)) },
    { label: 'Reverse each word', action: () => setResult(reverseWords(input)) },
    { label: 'Reverse each line', action: () => setResult(reverseLines(input)) },
    { label: 'Shuffle words', action: () => setResult(shuffleArray(input.split(/\s+/)).join(' ')) },
    { label: 'Shuffle lines', action: () => setResult(shuffleArray(input.split('\n')).join('\n')) },
    { label: 'Upside down text', action: () => setResult(upsideDownText(input)) },
    { label: 'Mirror text', action: () => setResult(mirrorText(input)) },
  ];

  const faq = [
    { question: 'What is upside down text?', answer: 'Upside down text uses Unicode characters that visually resemble normal letters rotated 180 degrees. Not all characters have an upside-down equivalent.' },
    { question: 'What is mirror text?', answer: 'Mirror text replaces characters with their horizontally flipped equivalents, similar to how text appears in a mirror reflection.' },
    { question: 'How does shuffle words differ from shuffle lines?', answer: 'Shuffle words randomly rearranges individual words separated by spaces, while shuffle lines randomly rearranges entire lines separated by newlines.' },
  ];

  const relatedTools = [
    { name: 'Case Converter', path: '/text-tools/case-converter' },
    { name: 'Text Formatter', path: '/text-tools/text-formatter' },
    { name: 'Word Counter', path: '/text-tools/word-counter' },
  ];

  return (
    <ToolLayout title="Text Reverser & Manipulator" description="Reverse text, words, lines, shuffle content, and create upside down text." faq={faq} relatedTools={relatedTools}>
      <textarea
        className="input-field min-h-[150px] w-full resize-y font-mono"
        placeholder="Type or paste your text here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div className="mt-4 flex flex-wrap gap-2">
        {operations.map((op) => (
          <Button key={op.label} size="sm" variant="secondary" onClick={op.action}>
            {op.label}
          </Button>
        ))}
      </div>
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-text-primary">Result</h3>
          {result && (
            <Button size="sm" variant="ghost" onClick={() => copy(result)}>
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          )}
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
