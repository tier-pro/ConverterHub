import type { WeightUnit } from '@/types';

export const weightUnits = {
  milligram: { label: 'Milligram', symbol: 'mg' },
  gram: { label: 'Gram', symbol: 'g' },
  kilogram: { label: 'Kilogram', symbol: 'kg' },
  'metric-ton': { label: 'Metric Ton', symbol: 't' },
  ounce: { label: 'Ounce', symbol: 'oz' },
  pound: { label: 'Pound', symbol: 'lb' },
  stone: { label: 'Stone', symbol: 'st' },
  'us-ton': { label: 'US Ton', symbol: 'ton' },
};

const toGram: Record<WeightUnit, number> = {
  milligram: 0.001,
  gram: 1,
  kilogram: 1000,
  'metric-ton': 1000000,
  ounce: 28.3495,
  pound: 453.592,
  stone: 6350.29,
  'us-ton': 907185,
};

export function convertWeight(value: number, from: WeightUnit, to: WeightUnit): number {
  const grams = value * toGram[from];
  return grams / toGram[to];
}

export function getWeightFormula(from: WeightUnit, to: WeightUnit): string {
  const rate = toGram[to] / toGram[from];
  return `1 ${from} = ${Math.abs(rate).toFixed(6)} ${to}`;
}
