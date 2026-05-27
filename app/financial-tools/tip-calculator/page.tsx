'use client';
import React, { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const presetTips = [5, 10, 15, 18, 20, 25];

export default function TipCalculatorPage() {
  const [bill, setBill] = useState('');
  const [tipPercent, setTipPercent] = useState<number | null>(15);
  const [customTip, setCustomTip] = useState('');
  const [people, setPeople] = useState('1');
  const [roundUp, setRoundUp] = useState(false);

  const result = useMemo(() => {
    const billAmount = parseFloat(bill);
    if (isNaN(billAmount) || billAmount <= 0) return null;
    const pct = tipPercent !== null ? tipPercent : (parseFloat(customTip) || 0);
    const numPeople = parseInt(people, 10) || 1;
    const tipAmount = billAmount * (pct / 100);
    let totalAmount = billAmount + tipAmount;
    if (roundUp) totalAmount = Math.ceil(totalAmount);
    const perPerson = totalAmount / numPeople;
    return { tipAmount, totalAmount, perPerson, pct };
  }, [bill, tipPercent, customTip, people, roundUp]);

  const handleTipSelect = (pct: number) => {
    setTipPercent(pct);
    setCustomTip('');
  };

  const faq = [
    { question: 'How is the tip calculated?', answer: 'The tip is calculated as a percentage of the bill amount. For example, a 15% tip on a $50 bill is $7.50.' },
    { question: 'How is the per-person amount calculated?', answer: 'The total amount (bill + tip) is divided by the number of people sharing the bill.' },
  ];

  const relatedTools = [
    { name: 'Discount Calculator', path: '/financial-tools/discount-calculator' },
    { name: 'Percentage Calculator', path: '/financial-tools/percentage-calculator' },
    { name: 'Loan Calculator', path: '/financial-tools/loan-calculator' },
  ];

  return (
    <ToolLayout title="Tip Calculator" description="Calculate tips, split bills, and round up totals with ease." faq={faq} relatedTools={relatedTools}>
      <div className="space-y-4">
        <Input label="Bill Amount ($)" type="number" placeholder="50.00" value={bill} onChange={(e) => setBill(e.target.value)} />

        <div>
          <label className="label-text block mb-2">Tip Percentage</label>
          <div className="flex flex-wrap gap-2">
            {presetTips.map((pct) => (
              <button key={pct} onClick={() => handleTipSelect(pct)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tipPercent === pct ? 'bg-primary text-white' : 'bg-background text-text-secondary hover:text-text-primary border border-border'}`}>{pct}%</button>
            ))}
            <button onClick={() => { setTipPercent(null); setCustomTip(''); }} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tipPercent === null ? 'bg-primary text-white' : 'bg-background text-text-secondary hover:text-text-primary border border-border'}`}>Custom</button>
          </div>
          {tipPercent === null && (
            <Input type="number" placeholder="Enter custom %" value={customTip} onChange={(e) => setCustomTip(e.target.value)} className="mt-2" />
          )}
        </div>

        <Input label="Number of People" type="number" min="1" placeholder="1" value={people} onChange={(e) => setPeople(e.target.value)} />

        <label className="flex items-center gap-2 text-sm text-text-primary cursor-pointer">
          <input type="checkbox" checked={roundUp} onChange={(e) => setRoundUp(e.target.checked)} className="rounded border-border" />
          Round up total
        </label>

        {result && (
          <Card hover={false} className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-background rounded-lg p-4">
                <p className="text-xs text-text-secondary">Tip Amount</p>
                <p className="text-xl font-bold text-primary">${result.tipAmount.toFixed(2)}</p>
              </div>
              <div className="bg-background rounded-lg p-4">
                <p className="text-xs text-text-secondary">Total Amount</p>
                <p className="text-xl font-bold text-primary">${result.totalAmount.toFixed(2)}</p>
              </div>
              <div className="bg-background rounded-lg p-4">
                <p className="text-xs text-text-secondary">Per Person</p>
                <p className="text-xl font-bold text-primary">${result.perPerson.toFixed(2)}</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </ToolLayout>
  );
}
