'use client';
import React, { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

function simplifyFraction(num: number, den: number): [number, number] {
  if (den === 0) return [num, den];
  const g = gcd(num, den);
  return [num / g, den / g];
}

function decimalToFraction(decimal: number): [number, number] {
  const tolerance = 1.0e-9;
  let h1 = 1, h2 = 0, k1 = 0, k2 = 1;
  let b = decimal;
  do {
    const a = Math.floor(b);
    [h1, h2] = [a * h1 + h2, h1];
    [k1, k2] = [a * k1 + k2, k1];
    b = 1 / (b - a);
  } while (Math.abs(decimal - h1 / k1) > decimal * tolerance);
  return simplifyFraction(h1, k1);
}

export default function FractionDecimalPage() {
  const [tab, setTab] = useState('fractionToDecimal');
  const [numerator, setNumerator] = useState('');
  const [denominator, setDenominator] = useState('');
  const [decimalInput, setDecimalInput] = useState('');
  const [simplifiedNum, setSimplifiedNum] = useState<number | null>(null);
  const [simplifiedDen, setSimplifiedDen] = useState<number | null>(null);

  const fractionResult = useMemo(() => {
    const n = parseInt(numerator, 10);
    const d = parseInt(denominator, 10);
    if (isNaN(n) || isNaN(d) || d === 0) return null;
    return n / d;
  }, [numerator, denominator]);

  const decimalResult = useMemo(() => {
    const d = parseFloat(decimalInput);
    if (isNaN(d) || d <= 0) return null;
    const [num, den] = decimalToFraction(d);
    return { numerator: num, denominator: den };
  }, [decimalInput]);

  const handleSimplify = () => {
    const n = parseInt(numerator, 10);
    const d = parseInt(denominator, 10);
    if (isNaN(n) || isNaN(d) || d === 0) return;
    const [sn, sd] = simplifyFraction(n, d);
    setSimplifiedNum(sn);
    setSimplifiedDen(sd);
  };

  const gcdSteps = useMemo(() => {
    const n = parseInt(numerator, 10);
    const d = parseInt(denominator, 10);
    if (isNaN(n) || isNaN(d) || d === 0) return [];
    const g = gcd(n, d);
    return [
      `GCD of ${n} and ${d} = ${g}`,
      `${n} ÷ ${g} = ${n / g}`,
      `${d} ÷ ${g} = ${d / g}`,
      `Simplified: ${n / g}/${d / g}`,
    ];
  }, [numerator, denominator, simplifiedNum, simplifiedDen]);

  const faq = [
    { question: 'How do you convert a fraction to a decimal?', answer: 'Divide the numerator by the denominator. For example, 3/4 = 0.75.' },
    { question: 'How do you convert a decimal to a fraction?', answer: 'Use continued fraction approximation to find the closest fractional representation.' },
  ];

  const relatedTools = [
    { name: 'Number Base Converter', path: '/number-tools/number-base-converter' },
    { name: 'Roman Numeral Converter', path: '/number-tools/roman-numeral' },
  ];

  return (
    <ToolLayout title="Fraction to Decimal Converter" description="Convert between fractions and decimals with simplification steps." faq={faq} relatedTools={relatedTools}>
      <div className="space-y-4">
        <div className="flex gap-2">
          <button onClick={() => setTab('fractionToDecimal')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'fractionToDecimal' ? 'bg-primary text-white' : 'bg-background text-text-secondary hover:text-text-primary border border-border'}`}>Fraction to Decimal</button>
          <button onClick={() => setTab('decimalToFraction')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'decimalToFraction' ? 'bg-primary text-white' : 'bg-background text-text-secondary hover:text-text-primary border border-border'}`}>Decimal to Fraction</button>
        </div>

        {tab === 'fractionToDecimal' && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Numerator" type="number" placeholder="3" value={numerator} onChange={(e) => { setNumerator(e.target.value); setSimplifiedNum(null); setSimplifiedDen(null); }} />
              <Input label="Denominator" type="number" placeholder="4" value={denominator} onChange={(e) => { setDenominator(e.target.value); setSimplifiedNum(null); setSimplifiedDen(null); }} />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSimplify}>Simplify Fraction</Button>
            </div>

            {simplifiedNum !== null && simplifiedDen !== null && (
              <Card hover={false} className="p-4">
                <h3 className="text-sm font-semibold text-text-primary mb-2">Simplified Fraction</h3>
                <p className="text-xl font-bold text-primary">{simplifiedNum}/{simplifiedDen}</p>
                <div className="mt-2 text-xs text-text-secondary space-y-0.5">
                  {gcdSteps.map((s, i) => <p key={i}>{s}</p>)}
                </div>
              </Card>
            )}

            {fractionResult !== null && (
              <Card hover={false} className="p-4 text-center">
                <p className="text-sm text-text-secondary">{numerator}/{denominator}</p>
                <p className="text-3xl font-bold text-primary mt-1">{fractionResult}</p>
              </Card>
            )}
          </div>
        )}

        {tab === 'decimalToFraction' && (
          <div className="space-y-4">
            <Input label="Decimal" type="number" step="any" placeholder="0.75" value={decimalInput} onChange={(e) => setDecimalInput(e.target.value)} />
            {decimalResult && (
              <Card hover={false} className="p-4 text-center">
                <p className="text-sm text-text-secondary">{decimalInput}</p>
                <p className="text-3xl font-bold text-primary mt-1">{decimalResult.numerator}/{decimalResult.denominator}</p>
              </Card>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
