import type { DataUnit } from '@/types';

export const dataUnits = {
  bit: { label: 'Bit', symbol: 'b' },
  byte: { label: 'Byte', symbol: 'B' },
  kilobyte: { label: 'Kilobyte (1000 bytes)', symbol: 'KB' },
  kibibyte: { label: 'Kibibyte (1024 bytes)', symbol: 'KiB' },
  megabyte: { label: 'Megabyte (1000²)', symbol: 'MB' },
  mebibyte: { label: 'Mebibyte (1024²)', symbol: 'MiB' },
  gigabyte: { label: 'Gigabyte (1000³)', symbol: 'GB' },
  gibibyte: { label: 'Gibibyte (1024³)', symbol: 'GiB' },
  terabyte: { label: 'Terabyte (1000⁴)', symbol: 'TB' },
  tebibyte: { label: 'Tebibyte (1024⁴)', symbol: 'TiB' },
  petabyte: { label: 'Petabyte (1000⁵)', symbol: 'PB' },
  pebibyte: { label: 'Pebibyte (1024⁵)', symbol: 'PiB' },
};

const decimalToByte: Record<DataUnit, number> = {
  bit: 0.125,
  byte: 1,
  kilobyte: 1000,
  kibibyte: 1024,
  megabyte: 1000000,
  mebibyte: 1048576,
  gigabyte: 1000000000,
  gibibyte: 1073741824,
  terabyte: 1000000000000,
  tebibyte: 1099511627776,
  petabyte: 1000000000000000,
  pebibyte: 1125899906842624,
};

export function convertData(value: number, from: DataUnit, to: DataUnit): number {
  const bytes = value * decimalToByte[from];
  return bytes / decimalToByte[to];
}

export function getDataFormula(from: DataUnit, to: DataUnit): string {
  const rate = decimalToByte[to] / decimalToByte[from];
  return `1 ${from} = ${Math.abs(rate).toFixed(6)} ${to}`;
}
