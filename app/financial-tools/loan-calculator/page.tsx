'use client';
import React, { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

function calculateEMI(principal: number, annualRate: number, years: number) {
  const months = years * 12;
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) return { emi: principal / months, totalPayment: principal, totalInterest: 0, schedule: [] };
  const factor = Math.pow(1 + monthlyRate, months);
  const emi = principal * (monthlyRate * factor) / (factor - 1);
  const totalPayment = emi * months;
  const totalInterest = totalPayment - principal;

  const schedule: { year: number; principalPaid: number; interestPaid: number; remainingBalance: number }[] = [];
  let balance = principal;
  for (let y = 1; y <= years; y++) {
    let yearPrincipal = 0;
    let yearInterest = 0;
    for (let m = 1; m <= 12; m++) {
      if (balance <= 0) break;
      const interestPart = balance * monthlyRate;
      const principalPart = emi - interestPart;
      yearPrincipal += principalPart;
      yearInterest += interestPart;
      balance -= principalPart;
    }
    schedule.push({ year: y, principalPaid: Math.round(yearPrincipal * 100) / 100, interestPaid: Math.round(yearInterest * 100) / 100, remainingBalance: Math.max(0, Math.round(balance * 100) / 100) });
  }
  return { emi: Math.round(emi * 100) / 100, totalPayment: Math.round(totalPayment * 100) / 100, totalInterest: Math.round(totalInterest * 100) / 100, schedule };
}

export default function LoanCalculatorPage() {
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('');
  const [term, setTerm] = useState('');

  const result = useMemo(() => {
    const p = parseFloat(amount);
    const r = parseFloat(rate);
    const t = parseFloat(term);
    if (isNaN(p) || isNaN(r) || isNaN(t) || p <= 0 || r < 0 || t <= 0) return null;
    return calculateEMI(p, r, t);
  }, [amount, rate, term]);

  const faq = [
    { question: 'How is EMI calculated?', answer: 'EMI uses the formula: M = P × [r(1+r)^n] / [(1+r)^n - 1], where r is the monthly interest rate and n is the number of months.' },
    { question: 'What is an amortization schedule?', answer: 'It shows the breakdown of each payment into principal and interest over the loan term.' },
  ];

  const relatedTools = [
    { name: 'Percentage Calculator', path: '/financial-tools/percentage-calculator' },
    { name: 'Tip Calculator', path: '/financial-tools/tip-calculator' },
    { name: 'Currency Converter', path: '/financial-tools/currency-converter' },
  ];

  return (
    <ToolLayout title="Loan Calculator" description="Calculate monthly EMI, total payment, total interest, and view the full amortization schedule." faq={faq} relatedTools={relatedTools}>
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <Input label="Loan Amount ($)" type="number" placeholder="250000" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <Input label="Annual Interest Rate (%)" type="number" placeholder="5.5" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} />
          <Input label="Loan Term (Years)" type="number" placeholder="30" value={term} onChange={(e) => setTerm(e.target.value)} />
        </div>

        {result && (
          <div className="space-y-4">
            <Card hover={false} className="p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-background rounded-lg p-4"><p className="text-xs text-text-secondary">Monthly EMI</p><p className="text-xl font-bold text-primary">${result.emi.toFixed(2)}</p></div>
                <div className="bg-background rounded-lg p-4"><p className="text-xs text-text-secondary">Total Payment</p><p className="text-xl font-bold text-primary">${result.totalPayment.toFixed(2)}</p></div>
                <div className="bg-background rounded-lg p-4"><p className="text-xs text-text-secondary">Total Interest</p><p className="text-xl font-bold text-warning">${result.totalInterest.toFixed(2)}</p></div>
              </div>
            </Card>

            {result.schedule.length > 0 && (
              <Card hover={false} className="p-4">
                <h3 className="text-sm font-semibold text-text-primary mb-3">Amortization Schedule</h3>
                <div className="overflow-x-auto max-h-64 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 text-text-secondary font-medium">Year</th>
                        <th className="text-right py-2 text-text-secondary font-medium">Principal Paid</th>
                        <th className="text-right py-2 text-text-secondary font-medium">Interest Paid</th>
                        <th className="text-right py-2 text-text-secondary font-medium">Remaining Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.schedule.map((row) => (
                        <tr key={row.year} className="border-b border-border/50">
                          <td className="py-2 font-semibold text-text-primary">{row.year}</td>
                          <td className="py-2 text-right font-mono text-text-primary">${row.principalPaid.toFixed(2)}</td>
                          <td className="py-2 text-right font-mono text-text-primary">${row.interestPaid.toFixed(2)}</td>
                          <td className="py-2 text-right font-mono text-text-primary">${row.remainingBalance.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
