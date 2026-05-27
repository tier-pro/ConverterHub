'use client';
import React, { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Card } from '@/components/ui/Card';

function countOccurrences(text: string, word: string): number {
  const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
  const matches = text.match(regex);
  return matches ? matches.length : 0;
}

export default function WordCounterPage() {
  const [input, setInput] = useState('');

  const stats = useMemo(() => {
    const charsWithSpaces = input.length;
    const charsWithoutSpaces = input.replace(/\s/g, '').length;
    const words = input.trim() ? input.trim().split(/\s+/).length : 0;
    const sentences = input ? input.split(/[.!?]+/).filter(s => s.trim()).length : 0;
    const paragraphs = input ? input.split(/\n\s*\n/).filter(p => p.trim()).length : 0;
    const lines = input ? input.split('\n').length : 0;
    const avgWordLength = words > 0 ? charsWithoutSpaces / words : 0;
    const readingTime = Math.max(1, Math.ceil(words / 200));
    const speakingTime = Math.max(1, Math.ceil(words / 150));

    const wordFreq: Record<string, number> = {};
    if (input.trim()) {
      input.toLowerCase().match(/\b\w+\b/g)?.forEach(w => {
        wordFreq[w] = (wordFreq[w] || 0) + 1;
      });
    }
    const topWords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    const totalWords = words;
    const keywordDensity = topWords.map(([word, count]) => ({
      word,
      count,
      density: totalWords > 0 ? ((count / totalWords) * 100).toFixed(2) + '%' : '0%',
    }));

    return { charsWithSpaces, charsWithoutSpaces, words, sentences, paragraphs, lines, avgWordLength, readingTime, speakingTime, keywordDensity };
  }, [input]);

  const faq = [
    { question: 'How is reading time calculated?', answer: 'Reading time is calculated based on an average reading speed of 200 words per minute (wpm).' },
    { question: 'How is speaking time calculated?', answer: 'Speaking time is calculated based on an average speaking speed of 150 words per minute (wpm).' },
    { question: 'What is keyword density?', answer: 'Keyword density is the percentage of times a specific word appears in the text relative to the total word count.' },
  ];

  const relatedTools = [
    { name: 'Case Converter', path: '/text-tools/case-converter' },
    { name: 'Text Formatter', path: '/text-tools/text-formatter' },
    { name: 'Lorem Ipsum Generator', path: '/text-tools/lorem-ipsum' },
  ];

  return (
    <ToolLayout title="Word & Character Counter" description="Count words, characters, sentences, paragraphs, and analyze keyword density." faq={faq} relatedTools={relatedTools}>
      <textarea
        className="input-field min-h-[150px] w-full resize-y font-mono"
        placeholder="Type or paste your text here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card hover={false} className="p-4"><p className="text-xs text-text-secondary">Total Characters (with spaces)</p><p className="text-xl font-bold text-text-primary">{stats.charsWithSpaces}</p></Card>
        <Card hover={false} className="p-4"><p className="text-xs text-text-secondary">Total Characters (no spaces)</p><p className="text-xl font-bold text-text-primary">{stats.charsWithoutSpaces}</p></Card>
        <Card hover={false} className="p-4"><p className="text-xs text-text-secondary">Total Words</p><p className="text-xl font-bold text-text-primary">{stats.words}</p></Card>
        <Card hover={false} className="p-4"><p className="text-xs text-text-secondary">Total Sentences</p><p className="text-xl font-bold text-text-primary">{stats.sentences}</p></Card>
        <Card hover={false} className="p-4"><p className="text-xs text-text-secondary">Total Paragraphs</p><p className="text-xl font-bold text-text-primary">{stats.paragraphs}</p></Card>
        <Card hover={false} className="p-4"><p className="text-xs text-text-secondary">Total Lines</p><p className="text-xl font-bold text-text-primary">{stats.lines}</p></Card>
        <Card hover={false} className="p-4"><p className="text-xs text-text-secondary">Avg. Word Length</p><p className="text-xl font-bold text-text-primary">{stats.avgWordLength.toFixed(2)}</p></Card>
        <Card hover={false} className="p-4"><p className="text-xs text-text-secondary">Reading Time (200 wpm)</p><p className="text-xl font-bold text-text-primary">{stats.readingTime} min</p></Card>
        <Card hover={false} className="p-4"><p className="text-xs text-text-secondary">Speaking Time (150 wpm)</p><p className="text-xl font-bold text-text-primary">{stats.speakingTime} min</p></Card>
      </div>
      {stats.keywordDensity.length > 0 && (
        <Card className="mt-6 p-4">
          <h3 className="text-sm font-semibold text-text-primary mb-3">Top 10 Words & Keyword Density</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-text-secondary font-medium">#</th>
                  <th className="text-left py-2 text-text-secondary font-medium">Word</th>
                  <th className="text-right py-2 text-text-secondary font-medium">Frequency</th>
                  <th className="text-right py-2 text-text-secondary font-medium">Density</th>
                </tr>
              </thead>
              <tbody>
                {stats.keywordDensity.map((item, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-2 text-text-secondary">{i + 1}</td>
                    <td className="py-2 font-medium text-text-primary">{item.word}</td>
                    <td className="py-2 text-right text-text-primary">{item.count}</td>
                    <td className="py-2 text-right text-text-primary">{item.density}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </ToolLayout>
  );
}
