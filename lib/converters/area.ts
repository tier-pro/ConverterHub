import type { AreaUnit } from '@/types';

export const areaUnits = {
  'sq-mm': { label: 'Square Millimeter', symbol: 'mm²' },
  'sq-cm': { label: 'Square Centimeter', symbol: 'cm²' },
  'sq-m': { label: 'Square Meter', symbol: 'm²' },
  'sq-km': { label: 'Square Kilometer', symbol: 'km²' },
  'sq-in': { label: 'Square Inch', symbol: 'in²' },
  'sq-ft': { label: 'Square Foot', symbol: 'ft²' },
  'sq-yd': { label: 'Square Yard', symbol: 'yd²' },
  acre: { label: 'Acre', symbol: 'ac' },
  hectare: { label: 'Hectare', symbol: 'ha' },
  'sq-mile': { label: 'Square Mile', symbol: 'mi²' },
};

const toSqMeter: Record<AreaUnit, number> = {
  'sq-mm': 0.000001,
  'sq-cm': 0.0001,
  'sq-m': 1,
  'sq-km': 1000000,
  'sq-in': 0.00064516,
  'sq-ft': 0.092903,
  'sq-yd': 0.836127,
  acre: 4046.86,
  hectare: 10000,
  'sq-mile': 2589990,
};

export function convertArea(value: number, from: AreaUnit, to: AreaUnit): number {
  const sqMeters = value * toSqMeter[from];
  return sqMeters / toSqMeter[to];
}

export function getAreaFormula(from: AreaUnit, to: AreaUnit): string {
  const rate = toSqMeter[to] / toSqMeter[from];
  return `1 ${from} = ${Math.abs(rate).toFixed(6)} ${to}`;
}
