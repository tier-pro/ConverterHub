import type { LengthUnit } from '@/types';

export const lengthUnits = {
  millimeter: { label: 'Millimeter', symbol: 'mm' },
  centimeter: { label: 'Centimeter', symbol: 'cm' },
  meter: { label: 'Meter', symbol: 'm' },
  kilometer: { label: 'Kilometer', symbol: 'km' },
  inch: { label: 'Inch', symbol: 'in' },
  foot: { label: 'Foot', symbol: 'ft' },
  yard: { label: 'Yard', symbol: 'yd' },
  mile: { label: 'Mile', symbol: 'mi' },
  'nautical-mile': { label: 'Nautical Mile', symbol: 'nmi' },
};

const toMeter: Record<LengthUnit, number> = {
  millimeter: 0.001,
  centimeter: 0.01,
  meter: 1,
  kilometer: 1000,
  inch: 0.0254,
  foot: 0.3048,
  yard: 0.9144,
  mile: 1609.344,
  'nautical-mile': 1852,
};

export function convertLength(value: number, from: LengthUnit, to: LengthUnit): number {
  const meters = value * toMeter[from];
  return meters / toMeter[to];
}

export function getLengthFormula(from: LengthUnit, to: LengthUnit): string {
  const rate = toMeter[to] / toMeter[from];
  return `1 ${from} = ${Math.abs(rate).toFixed(6)} ${to}`;
}
