'use client';
import React, { useState } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'ut', 'aliquip', 'ex', 'ea',
  'commodo', 'consequat', 'duis', 'aute', 'irure', 'dolor', 'in', 'reprehenderit',
  'in', 'voluptate', 'velit', 'esse', 'cillum', 'dolore', 'eu', 'fugiat', 'nulla',
  'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident',
  'sunt', 'in', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id',
  'est', 'laborum',
];

const LOREM_START = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateWord() {
  return LOREM_WORDS[randInt(0, LOREM_WORDS.length - 1)];
}

function generateSentence(minWords = 8, maxWords = 20) {
  const count = randInt(minWords, maxWords);
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    words.push(generateWord());
  }
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(' ') + '.';
}

function generateParagraph(sentences = 5) {
  const parts: string[] = [];
  for (let i = 0; i < sentences; i++) {
    parts.push(generateSentence());
  }
  return parts.join(' ');
}

export default function LoremIpsumPage() {
  const [mode, setMode] = useState<'paragraphs' | 'words' | 'bytes'>('paragraphs');
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [generated, setGenerated] = useState('');
  const [copied, copy] = useCopyToClipboard();

  const maxForMode: Record<string, number> = { paragraphs: 100, words: 10000, bytes: 100000 };

  const handleGenerate = () => {
    let result = '';

    if (mode === 'paragraphs') {
      const paragraphs: string[] = [];
      for (let i = 0; i < count; i++) {
        paragraphs.push(generateParagraph());
      }
      result = paragraphs.join('\n\n');
      if (startWithLorem) {
        const rest = paragraphs.slice(1).join('\n\n');
        result = paragraphs.length > 1 ? LOREM_START + '\n\n' + rest : LOREM_START;
      }
    } else if (mode === 'words') {
      const words: string[] = [];
      for (let i = 0; i < count; i++) {
        words.push(generateWord());
      }
      result = words.join(' ');
      if (startWithLorem) {
        result = 'Lorem ipsum dolor sit amet' + result.slice(26);
      }
    } else if (mode === 'bytes') {
      let str = '';
      while (new TextEncoder().encode(str).length < count) {
        str += generateWord() + ' ';
      }
      const encoder = new TextEncoder();
      while (encoder.encode(str).length > count) {
        str = str.slice(0, -1);
      }
      result = str.trim();
      if (startWithLorem) {
        result = 'Lorem ipsum dolor sit amet' + result.slice(26);
      }
    }

    setGenerated(result);
  };

  const faq = [
    { question: 'What is Lorem Ipsum?', answer: 'Lorem Ipsum is placeholder text commonly used in the printing and typesetting industry. It has been the industry standard since the 1500s.' },
    { question: 'Why is Lorem Ipsum used?', answer: 'It provides a realistic text layout without distracting readers with meaningful content. It helps focus on design elements rather than the text itself.' },
    { question: 'What is the difference between words and bytes mode?', answer: 'Words mode generates a specific number of words, while bytes mode generates text that takes up a specific number of bytes (characters) in memory.' },
  ];

  const relatedTools = [
    { name: 'Word Counter', path: '/text-tools/word-counter' },
    { name: 'Text Formatter', path: '/text-tools/text-formatter' },
    { name: 'Case Converter', path: '/text-tools/case-converter' },
  ];

  return (
    <ToolLayout title="Lorem Ipsum Generator" description="Generate Lorem Ipsum placeholder text by paragraphs, words, or bytes." faq={faq} relatedTools={relatedTools}>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4">
          {(['paragraphs', 'words', 'bytes'] as const).map((m) => (
            <label key={m} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="mode"
                className="accent-primary"
                checked={mode === m}
                onChange={() => { setMode(m); setCount(m === 'paragraphs' ? 3 : m === 'words' ? 50 : 500); }}
              />
              <span className="text-sm text-text-primary capitalize">{m}</span>
            </label>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1 max-w-xs">
            <label className="label-text">Number of {mode}: {count}</label>
            <input
              type="range"
              min={1}
              max={maxForMode[mode]}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="accent-primary"
              checked={startWithLorem}
              onChange={(e) => setStartWithLorem(e.target.checked)}
            />
            <span className="text-sm text-text-primary">Start with "Lorem ipsum"</span>
          </label>
        </div>
        <Button onClick={handleGenerate}>Generate</Button>
      </div>
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-text-primary">Generated Text</h3>
          {generated && (
            <Button size="sm" variant="ghost" onClick={() => copy(generated)}>
              {copied ? 'Copied!' : 'Copy All'}
            </Button>
          )}
        </div>
        <textarea
          className="input-field min-h-[200px] w-full resize-y font-mono text-sm"
          readOnly
          value={generated}
          placeholder="Click Generate to create Lorem Ipsum text..."
        />
      </div>
    </ToolLayout>
  );
}
