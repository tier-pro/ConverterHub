import type { TemperatureUnit } from '@/types';

export const temperatureUnits = {
  celsius: { label: 'Celsius', symbol: '°C' },
  fahrenheit: { label: 'Fahrenheit', symbol: '°F' },
  kelvin: { label: 'Kelvin', symbol: 'K' },
};

export function convertTemperature(value: number, from: TemperatureUnit, to: TemperatureUnit): number {
  let celsius: number;
  if (from === 'celsius') celsius = value;
  else if (from === 'fahrenheit') celsius = (value - 32) * 5 / 9;
  else celsius = value - 273.15;

  if (to === 'celsius') return celsius;
  if (to === 'fahrenheit') return celsius * 9 / 5 + 32;
  return celsius + 273.15;
}

export function getTemperatureFormula(from: TemperatureUnit, to: TemperatureUnit): string {
  if (from === 'celsius' && to === 'fahrenheit') return '°F = (°C × 9/5) + 32';
  if (from === 'celsius' && to === 'kelvin') return 'K = °C + 273.15';
  if (from === 'fahrenheit' && to === 'celsius') return '°C = (°F - 32) × 5/9';
  if (from === 'fahrenheit' && to === 'kelvin') return 'K = (°F - 32) × 5/9 + 273.15';
  if (from === 'kelvin' && to === 'celsius') return '°C = K - 273.15';
  if (from === 'kelvin' && to === 'fahrenheit') return '°F = (K - 273.15) × 9/5 + 32';
  return 'No conversion needed';
}

export const temperatureReferences = [
  { label: 'Absolute Zero', celsius: -273.15, fahrenheit: -459.67, kelvin: 0 },
  { label: 'Freezing Point (Water)', celsius: 0, fahrenheit: 32, kelvin: 273.15 },
  { label: 'Room Temperature', celsius: 20, fahrenheit: 68, kelvin: 293.15 },
  { label: 'Body Temperature', celsius: 37, fahrenheit: 98.6, kelvin: 310.15 },
  { label: 'Boiling Point (Water)', celsius: 100, fahrenheit: 212, kelvin: 373.15 },
];
