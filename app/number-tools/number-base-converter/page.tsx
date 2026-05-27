'use client';
import React, { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

const bases = [
  { value: '2', label: 'Binary (Base 2)' },
  { value: '8', label: 'Octal (Base 8)' },
  { value: '10', label: 'Decimal (Base 10)' },
  { value: '16', label: 'Hexadecimal (Base 16)' },
];

function validateInput(value: string, base: number): boolean {
  if (!value) return true;
  const digits = '0123456789abcdefghijklmnopqrstuvwxyz';
  return value.split('').every((c) => digits.indexOf(c.toLowerCase()) < base);
}

export default function NumberBaseConverterPage() {
  const [input, setInput] = useState('255');
  const [inputBase, setInputBase] = useState('10');
  const [copied, copy] = useCopyToClipboard();

  const result = useMemo(() => {
    const base = parseInt(inputBase, 10);
    if (!input || !validateInput(input, base)) return null;
    const decimal = parseInt(input, base);
    if (isNaN(decimal)) return null;
    return {
      binary: decimal.toString(2).toUpperCase(),
      octal: decimal.toString(8).toUpperCase(),
      decimal: decimal.toString(10),
      hexadecimal: decimal.toString(16).toUpperCase(),
    };
  }, [input, inputBase]);

  const baseOptions = bases.map((b) => ({ value: b.value, label: b.label }));

  const error = useMemo(() => {
    if (!input) return '';
    const base = parseInt(inputBase, 10);
    if (!validateInput(input, base)) return `Invalid characters for base ${base}`;
    return '';
  }, [input, inputBase]);

  const faq = [
    { question: 'What is base conversion?', answer: 'Base conversion translates a number from one numeral system to another, such as decimal (base 10) to binary (base 2).' },
    { question: 'How does binary work?', answer: 'Binary uses only two digits (0 and 1), where each position represents a power of 2.' },
  ];

  const relatedTools = [
    { name: 'Roman Numeral Converter', path: '/number-tools/roman-numeral' },
    { name: 'Fraction to Decimal', path: '/number-tools/fraction-decimal' },
  ];

  return (
    <ToolLayout title="Number Base Converter" description="Convert numbers between binary, octal, decimal, and hexadecimal numeral systems." faq={faq} relatedTools={relatedTools}>
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Number" placeholder="255" value={input} onChange={(e) => setInput(e.target.value)} error={error} />
          <Select label="Input Base" options={baseOptions} value={inputBase} onChange={(e) => setInputBase(e.target.value)} />
        </div>

        {result && (
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { label: 'Binary', value: result.binary },
              { label: 'Octal', value: result.octal },
              { label: 'Decimal', value: result.decimal },
              { label: 'Hexadecimal', value: result.hexadecimal },
            ].map((item) => (
              <Card key={item.label} hover={false} className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-semibold text-text-primary">{item.label}</h3>
                  <Button size="sm" variant="ghost" onClick={() => copy(item.value)}>{copied ? 'Copied!' : 'Copy'}</Button>
                </div>
                <p className="font-mono text-lg font-bold text-primary break-all">{item.value}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
