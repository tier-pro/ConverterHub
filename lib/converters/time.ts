import type { TimeUnit } from '@/types';

export const timeUnits = {
  nanosecond: { label: 'Nanosecond', symbol: 'ns' },
  microsecond: { label: 'Microsecond', symbol: 'µs' },
  millisecond: { label: 'Millisecond', symbol: 'ms' },
  second: { label: 'Second', symbol: 's' },
  minute: { label: 'Minute', symbol: 'min' },
  hour: { label: 'Hour', symbol: 'h' },
  day: { label: 'Day', symbol: 'd' },
  week: { label: 'Week', symbol: 'wk' },
  month: { label: 'Month', symbol: 'mo' },
  year: { label: 'Year', symbol: 'yr' },
  decade: { label: 'Decade', symbol: 'dec' },
  century: { label: 'Century', symbol: 'cent' },
};

const toSecond: Record<TimeUnit, number> = {
  nanosecond: 1e-9,
  microsecond: 1e-6,
  millisecond: 0.001,
  second: 1,
  minute: 60,
  hour: 3600,
  day: 86400,
  week: 604800,
  month: 2629800,
  year: 31557600,
  decade: 315576000,
  century: 3155760000,
};

export function convertTime(value: number, from: TimeUnit, to: TimeUnit): number {
  const seconds = value * toSecond[from];
  return seconds / toSecond[to];
}

export function getTimeFormula(from: TimeUnit, to: TimeUnit): string {
  const rate = toSecond[to] / toSecond[from];
  return `1 ${from} = ${Math.abs(rate).toFixed(6)} ${to}`;
}
