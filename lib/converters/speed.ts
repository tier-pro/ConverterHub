import type { SpeedUnit } from '@/types';

export const speedUnits = {
  mps: { label: 'Meter/second', symbol: 'm/s' },
  kmph: { label: 'Kilometer/hour', symbol: 'km/h' },
  mph: { label: 'Mile/hour', symbol: 'mph' },
  fps: { label: 'Foot/second', symbol: 'ft/s' },
  knot: { label: 'Knot', symbol: 'kn' },
};

const toMps: Record<SpeedUnit, number> = {
  mps: 1,
  kmph: 0.277778,
  mph: 0.44704,
  fps: 0.3048,
  knot: 0.514444,
};

export function convertSpeed(value: number, from: SpeedUnit, to: SpeedUnit): number {
  const mps = value * toMps[from];
  return mps / toMps[to];
}

export function getSpeedFormula(from: SpeedUnit, to: SpeedUnit): string {
  const rate = toMps[to] / toMps[from];
  return `1 ${from} = ${Math.abs(rate).toFixed(6)} ${to}`;
}

export function getMachNumber(speedMps: number): number {
  return speedMps / 343;
}
