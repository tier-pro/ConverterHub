'use client';
import React, { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const modes = [
  { id: 'pctOf', label: 'What is X% of Y?' },
  { id: 'isWhatPct', label: 'X is what percent of Y?' },
  { id: 'isPctOf', label: 'X is Y% of what?' },
  { id: 'increase', label: 'Percentage increase' },
  { id: 'decrease', label: 'Percentage decrease' },
  { id: 'difference', label: 'Percentage difference' },
  { id: 'addPct', label: 'Add X% to Y' },
  { id: 'subPct', label: 'Subtract X% from Y' },
];

export default function PercentageCalculatorPage() {
  const [mode, setMode] = useState('pctOf');
  const [val1, setVal1] = useState('');
  const [val2, setVal2] = useState('');

  const result = useMemo(() => {
    const a = parseFloat(val1);
    const b = parseFloat(val2);
    if (isNaN(a) || isNaN(b)) return null;
    let value: number;
    let formula = '';
    let steps: string[] = [];
    switch (mode) {
      case 'pctOf':
        value = (a / 100) * b;
        formula = `${a}% of ${b} = (${a}/100) × ${b}`;
        steps = [`Step 1: ${a} ÷ 100 = ${a / 100}`, `Step 2: ${a / 100} × ${b} = ${value}`];
        return { value, formula, steps, label: `${a}% of ${b}` };
      case 'isWhatPct':
        value = (a / b) * 100;
        formula = `${a} is what % of ${b} = (${a}/${b}) × 100`;
        steps = [`Step 1: ${a} ÷ ${b} = ${a / b}`, `Step 2: ${a / b} × 100 = ${value}%`];
        return { value, formula, steps, label: `${a} is ${value.toFixed(2)}% of ${b}` };
      case 'isPctOf':
        value = (a / b) * 100;
        formula = `${a} is ${b}% of what = (${a}/${b}) × 100`;
        steps = [`Step 1: ${a} ÷ ${b} = ${a / b}`, `Step 2: ${a / b} × 100 = ${value}`];
        return { value, formula, steps, label: `${a} is ${b}% of ${value.toFixed(2)}` };
      case 'increase':
        value = ((b - a) / a) * 100;
        formula = `Increase from ${a} to ${b} = ((${b} - ${a})/${a}) × 100`;
        steps = [`Step 1: ${b} - ${a} = ${b - a}`, `Step 2: ${b - a} ÷ ${a} = ${(b - a) / a}`, `Step 3: ${(b - a) / a} × 100 = ${value}%`];
        return { value, formula, steps, label: `${value.toFixed(2)}% increase` };
      case 'decrease':
        value = ((a - b) / a) * 100;
        formula = `Decrease from ${a} to ${b} = ((${a} - ${b})/${a}) × 100`;
        steps = [`Step 1: ${a} - ${b} = ${a - b}`, `Step 2: ${a - b} ÷ ${a} = ${(a - b) / a}`, `Step 3: ${(a - b) / a} × 100 = ${value}%`];
        return { value, formula, steps, label: `${value.toFixed(2)}% decrease` };
      case 'difference':
        value = (Math.abs(a - b) / ((a + b) / 2)) * 100;
        formula = `Difference between ${a} and ${b} = (|${a} - ${b}| / ((${a} + ${b})/2)) × 100`;
        steps = [`Step 1: |${a} - ${b}| = ${Math.abs(a - b)}`, `Step 2: (${a} + ${b}) / 2 = ${(a + b) / 2}`, `Step 3: ${Math.abs(a - b)} ÷ ${(a + b) / 2} = ${Math.abs(a - b) / ((a + b) / 2)}`, `Step 4: × 100 = ${value}%`];
        return { value, formula, steps, label: `${value.toFixed(2)}% difference` };
      case 'addPct':
        value = a + (a / 100) * b;
        formula = `Add ${b}% to ${a} = ${a} + (${a} × ${b}/100)`;
        steps = [`Step 1: ${a} × ${b} ÷ 100 = ${(a / 100) * b}`, `Step 2: ${a} + ${(a / 100) * b} = ${value}`];
        return { value, formula, steps, label: `${a} + ${b}% = ${value}` };
      case 'subPct':
        value = a - (a / 100) * b;
        formula = `Subtract ${b}% from ${a} = ${a} - (${a} × ${b}/100)`;
        steps = [`Step 1: ${a} × ${b} ÷ 100 = ${(a / 100) * b}`, `Step 2: ${a} - ${(a / 100) * b} = ${value}`];
        return { value, formula, steps, label: `${a} - ${b}% = ${value}` };
      default:
        return null;
    }
  }, [mode, val1, val2]);

  const getLabels = () => {
    switch (mode) {
      case 'pctOf': return { label1: 'Percentage (%)', label2: 'Value (Y)', placeholder1: 'e.g. 20', placeholder2: 'e.g. 200' };
      case 'isWhatPct': return { label1: 'Part (X)', label2: 'Whole (Y)', placeholder1: 'e.g. 30', placeholder2: 'e.g. 150' };
      case 'isPctOf': return { label1: 'Part (X)', label2: 'Percentage (%)', placeholder1: 'e.g. 30', placeholder2: 'e.g. 20' };
      case 'increase': return { label1: 'Original (X)', label2: 'New (Y)', placeholder1: 'e.g. 100', placeholder2: 'e.g. 150' };
      case 'decrease': return { label1: 'Original (X)', label2: 'New (Y)', placeholder1: 'e.g. 200', placeholder2: 'e.g. 150' };
      case 'difference': return { label1: 'Value A (X)', label2: 'Value B (Y)', placeholder1: 'e.g. 100', placeholder2: 'e.g. 120' };
      case 'addPct': return { label1: 'Value (Y)', label2: 'Percentage (%)', placeholder1: 'e.g. 200', placeholder2: 'e.g. 15' };
      case 'subPct': return { label1: 'Value (Y)', label2: 'Percentage (%)', placeholder1: 'e.g. 200', placeholder2: 'e.g. 15' };
      default: return { label1: '', label2: '', placeholder1: '', placeholder2: '' };
    }
  };

  const labels = getLabels();

  const faq = [
    { question: 'How is percentage increase calculated?', answer: 'Percentage increase = ((New - Original) / Original) × 100.' },
    { question: 'How is percentage difference calculated?', answer: 'Percentage difference = (|A - B| / ((A + B) / 2)) × 100.' },
  ];

  const relatedTools = [
    { name: 'Discount Calculator', path: '/financial-tools/discount-calculator' },
    { name: 'Tip Calculator', path: '/financial-tools/tip-calculator' },
    { name: 'Loan Calculator', path: '/financial-tools/loan-calculator' },
  ];

  return (
    <ToolLayout title="Percentage Calculator" description="Calculate percentages in 8 different modes with step-by-step solutions." faq={faq} relatedTools={relatedTools}>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {modes.map((m) => (
            <button key={m.id} onClick={() => { setMode(m.id); setVal1(''); setVal2(''); }} className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${mode === m.id ? 'bg-primary text-white' : 'bg-background text-text-secondary hover:text-text-primary'}`}>{m.label}</button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input label={labels.label1} type="number" placeholder={labels.placeholder1} value={val1} onChange={(e) => setVal1(e.target.value)} />
          <Input label={labels.label2} type="number" placeholder={labels.placeholder2} value={val2} onChange={(e) => setVal2(e.target.value)} />
        </div>

        {result && (
          <Card hover={false} className="p-4">
            <div className="text-center mb-3">
              <p className="text-sm text-text-secondary">{result.label}</p>
              <p className="text-3xl font-bold text-primary">{result.value % 1 === 0 ? result.value : result.value.toFixed(4)}</p>
            </div>
            <div className="text-sm space-y-1">
              <p className="font-mono text-xs text-text-secondary bg-background p-2 rounded">{result.formula}</p>
              {result.steps.map((s, i) => <p key={i} className="text-text-secondary text-xs">{s}</p>)}
            </div>
          </Card>
        )}
      </div>
    </ToolLayout>
  );
}
