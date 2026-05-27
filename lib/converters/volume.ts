import type { VolumeUnit } from '@/types';

export const volumeUnits = {
  milliliter: { label: 'Milliliter', symbol: 'mL' },
  liter: { label: 'Liter', symbol: 'L' },
  'cubic-meter': { label: 'Cubic Meter', symbol: 'm³' },
  'gallon-us': { label: 'Gallon (US)', symbol: 'gal' },
  'gallon-uk': { label: 'Gallon (UK)', symbol: 'gal UK' },
  quart: { label: 'Quart', symbol: 'qt' },
  pint: { label: 'Pint', symbol: 'pt' },
  cup: { label: 'Cup', symbol: 'cup' },
  'fluid-ounce': { label: 'Fluid Ounce', symbol: 'fl oz' },
  tablespoon: { label: 'Tablespoon', symbol: 'tbsp' },
  teaspoon: { label: 'Teaspoon', symbol: 'tsp' },
};

const toMilliliter: Record<VolumeUnit, number> = {
  milliliter: 1,
  liter: 1000,
  'cubic-meter': 1000000,
  'gallon-us': 3785.41,
  'gallon-uk': 4546.09,
  quart: 946.353,
  pint: 473.176,
  cup: 240,
  'fluid-ounce': 29.5735,
  tablespoon: 14.7868,
  teaspoon: 4.92892,
};

export function convertVolume(value: number, from: VolumeUnit, to: VolumeUnit): number {
  const ml = value * toMilliliter[from];
  return ml / toMilliliter[to];
}

export function getVolumeFormula(from: VolumeUnit, to: VolumeUnit): string {
  const rate = toMilliliter[to] / toMilliliter[from];
  return `1 ${from} = ${Math.abs(rate).toFixed(6)} ${to}`;
}
