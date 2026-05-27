'use client';
import React, { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { numberToRoman, romanToNumber, isValidRoman } from '@/lib/converters/romanNumerals';

export default function RomanNumeralPage() {
  const [tab, setTab] = useState('toRoman');
  const [numInput, setNumInput] = useState('');
  const [romanInput, setRomanInput] = useState('');

  const romanResult = useMemo(() => {
    const n = parseInt(numInput, 10);
    if (isNaN(n) || n < 1 || n > 3999) return null;
    return numberToRoman(n);
  }, [numInput]);

  const numResult = useMemo(() => {
    if (!romanInput) return null;
    const upper = romanInput.toUpperCase();
    if (!isValidRoman(upper)) return null;
    return romanToNumber(upper);
  }, [romanInput]);

  const faq = [
    { question: 'What are Roman numerals?', answer: 'Roman numerals use combinations of letters from the Latin alphabet (I, V, X, L, C, D, M) to represent numbers.' },
    { question: 'Why is there a 1-3999 limit?', answer: 'Traditional Roman numerals do not have standard representations for numbers larger than 3999 (MMMCMXCIX).' },
  ];

  const relatedTools = [
    { name: 'Number Base Converter', path: '/number-tools/number-base-converter' },
    { name: 'Fraction to Decimal', path: '/number-tools/fraction-decimal' },
  ];

  return (
    <ToolLayout title="Roman Numeral Converter" description="Convert between Roman numerals and Arabic numbers with validation." faq={faq} relatedTools={relatedTools}>
      <div className="space-y-4">
        <div className="flex gap-2">
          <button onClick={() => setTab('toRoman')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'toRoman' ? 'bg-primary text-white' : 'bg-background text-text-secondary hover:text-text-primary border border-border'}`}>Number to Roman</button>
          <button onClick={() => setTab('toNumber')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'toNumber' ? 'bg-primary text-white' : 'bg-background text-text-secondary hover:text-text-primary border border-border'}`}>Roman to Number</button>
        </div>

        {tab === 'toRoman' && (
          <div className="space-y-4">
            <Input label="Number (1-3999)" type="number" min="1" max="3999" placeholder="2024" value={numInput} onChange={(e) => setNumInput(e.target.value)} error={numInput && (parseInt(numInput) < 1 || parseInt(numInput) > 3999) ? 'Enter a number between 1 and 3999' : ''} />
            {romanResult && (
              <Card hover={false} className="p-4 text-center">
                <p className="text-sm text-text-secondary">Roman Numeral</p>
                <p className="text-3xl font-bold text-primary mt-1">{romanResult}</p>
              </Card>
            )}
          </div>
        )}

        {tab === 'toNumber' && (
          <div className="space-y-4">
            <Input label="Roman Numeral" placeholder="MMXXIV" value={romanInput} onChange={(e) => setRomanInput(e.target.value.toUpperCase())} error={romanInput && !isValidRoman(romanInput.toUpperCase()) ? 'Invalid Roman numeral' : ''} />
            {numResult !== null && (
              <Card hover={false} className="p-4 text-center">
                <p className="text-sm text-text-secondary">Number</p>
                <p className="text-3xl font-bold text-primary mt-1">{numResult}</p>
              </Card>
            )}
          </div>
        )}

        <Card hover={false} className="p-4">
          <h3 className="text-sm font-semibold text-text-primary mb-2">Conversion Rules</h3>
          <ul className="text-sm text-text-secondary space-y-1 list-disc list-inside">
            <li>I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1000</li>
            <li>When a smaller numeral precedes a larger one, it is subtracted (e.g., IV = 4)</li>
            <li>When a smaller numeral follows a larger one, it is added (e.g., VI = 6)</li>
            <li>Only powers of 10 (I, X, C, M) can be repeated up to 3 times</li>
            <li>Subtraction pairs: IV (4), IX (9), XL (40), XC (90), CD (400), CM (900)</li>
          </ul>
        </Card>
      </div>
    </ToolLayout>
  );
}
