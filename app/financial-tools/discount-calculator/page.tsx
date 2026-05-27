'use client';
import React, { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function DiscountCalculatorPage() {
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountValue, setDiscountValue] = useState('');
  const [discountMode, setDiscountMode] = useState('percent');
  const [discount2, setDiscount2] = useState('');
  const [discount3, setDiscount3] = useState('');

  const result = useMemo(() => {
    const price = parseFloat(originalPrice);
    if (isNaN(price) || price <= 0) return null;

    const d1 = parseFloat(discountValue);
    let discountPercent = discountMode === 'percent' ? d1 : (d1 / price) * 100;
    if (isNaN(discountPercent) || discountPercent < 0) discountPercent = 0;

    let currentPrice = price;
    const discounts = [discountPercent, parseFloat(discount2), parseFloat(discount3)].filter((d) => !isNaN(d) && d > 0);

    for (const d of discounts) {
      currentPrice = currentPrice - (currentPrice * d) / 100;
    }

    const savings = price - currentPrice;

    const comparisons = [10, 15, 20, 25, 30, 40, 50].map((pct) => ({
      pct,
      finalPrice: price - (price * pct) / 100,
      savings: (price * pct) / 100,
    }));

    return { finalPrice: currentPrice, savings, comparisons };
  }, [originalPrice, discountValue, discountMode, discount2, discount3]);

  const faq = [
    { question: 'What is a discount calculator?', answer: 'It calculates the final price after applying one or more percentage or fixed discounts to an original price.' },
    { question: 'How do stacked discounts work?', answer: 'Stacked discounts are applied sequentially: each discount is applied to the already reduced price.' },
  ];

  const relatedTools = [
    { name: 'Percentage Calculator', path: '/financial-tools/percentage-calculator' },
    { name: 'Tip Calculator', path: '/financial-tools/tip-calculator' },
    { name: 'Currency Converter', path: '/financial-tools/currency-converter' },
  ];

  return (
    <ToolLayout title="Discount Calculator" description="Calculate final prices after discounts, compare savings across different discount rates." faq={faq} relatedTools={relatedTools}>
      <div className="space-y-4">
        <Input label="Original Price ($)" type="number" placeholder="100.00" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} />

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-text-primary cursor-pointer">
            <input type="radio" name="discountMode" checked={discountMode === 'percent'} onChange={() => { setDiscountMode('percent'); setDiscountValue(''); }} className="accent-primary" />
            Discount %
          </label>
          <label className="flex items-center gap-2 text-sm text-text-primary cursor-pointer">
            <input type="radio" name="discountMode" checked={discountMode === 'amount'} onChange={() => { setDiscountMode('amount'); setDiscountValue(''); }} className="accent-primary" />
            Discount $
          </label>
        </div>

        <Input label={discountMode === 'percent' ? 'Discount %' : 'Discount Amount ($)'} type="number" placeholder={discountMode === 'percent' ? '20' : '25'} value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} />

        <Card hover={false} className="p-4">
          <h3 className="text-sm font-semibold text-text-primary mb-2">Stacked Discounts (optional)</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="2nd Discount %" type="number" placeholder="10" value={discount2} onChange={(e) => setDiscount2(e.target.value)} />
            <Input label="3rd Discount %" type="number" placeholder="5" value={discount3} onChange={(e) => setDiscount3(e.target.value)} />
          </div>
        </Card>

        {result && (
          <div className="space-y-4">
            <Card hover={false} className="p-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-background rounded-lg p-4">
                  <p className="text-xs text-text-secondary">Final Price</p>
                  <p className="text-2xl font-bold text-primary">${result.finalPrice.toFixed(2)}</p>
                </div>
                <div className="bg-background rounded-lg p-4">
                  <p className="text-xs text-text-secondary">You Save</p>
                  <p className="text-2xl font-bold text-success">${result.savings.toFixed(2)}</p>
                </div>
              </div>
            </Card>

            <Card hover={false} className="p-4">
              <h3 className="text-sm font-semibold text-text-primary mb-3">Sale Price Comparison</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 text-text-secondary font-medium">Discount</th>
                      <th className="text-right py-2 text-text-secondary font-medium">Final Price</th>
                      <th className="text-right py-2 text-text-secondary font-medium">Savings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.comparisons.map((c) => (
                      <tr key={c.pct} className="border-b border-border/50">
                        <td className="py-2 font-semibold text-text-primary">{c.pct}% Off</td>
                        <td className="py-2 text-right font-mono text-text-primary">${c.finalPrice.toFixed(2)}</td>
                        <td className="py-2 text-right font-mono text-success">${c.savings.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
