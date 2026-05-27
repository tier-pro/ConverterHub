'use client';
import React, { useState, useMemo, useCallback } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Card } from '@/components/ui/Card';
import { convertTemperature, getTemperatureFormula, temperatureUnits, temperatureReferences } from '@/lib/converters/temperature';

type TempUnit = 'celsius' | 'fahrenheit' | 'kelvin';

export default function TemperatureConverterPage() {
  const [celsius, setCelsius] = useState('25');
  const [fahrenheit, setFahrenheit] = useState('77');
  const [kelvin, setKelvin] = useState('298.15');

  const updateAll = useCallback((value: string, from: TempUnit) => {
    const num = parseFloat(value);
    if (isNaN(num)) return;
    const c = from === 'celsius' ? num : from === 'fahrenheit' ? (num - 32) * 5 / 9 : num - 273.15;
    setCelsius(from === 'celsius' ? value : String(Math.round(c * 100) / 100));
    setFahrenheit(from === 'fahrenheit' ? value : String(Math.round((c * 9 / 5 + 32) * 100) / 100));
    setKelvin(from === 'kelvin' ? value : String(Math.round((c + 273.15) * 100) / 100));
  }, []);

  const formula = useMemo(() => getTemperatureFormula('celsius', 'fahrenheit'), []);

  const faq = [
    { question: 'How do you convert Celsius to Fahrenheit?', answer: 'To convert Celsius to Fahrenheit, multiply by 9/5 and add 32. Formula: °F = (°C × 9/5) + 32.' },
    { question: 'What is absolute zero?', answer: 'Absolute zero is the lowest possible temperature where all molecular motion stops. It is 0 K, -273.15°C, or -459.67°F.' },
    { question: 'Why does Kelvin have no degree symbol?', answer: 'Kelvin is an absolute thermodynamic scale, not a relative scale like Celsius or Fahrenheit. Temperatures in Kelvin are expressed as "K" rather than "°K" because it is an absolute measure.' },
  ];

  const relatedTools = [
    { name: 'Length Converter', path: '/converters/length-converter' },
    { name: 'Weight Converter', path: '/converters/weight-converter' },
    { name: 'Speed Converter', path: '/converters/speed-converter' },
  ];

  return (
    <ToolLayout
      title="Temperature Converter"
      description="Convert between Celsius, Fahrenheit, and Kelvin with instant real-time updates and a reference temperature table."
      faq={faq}
      relatedTools={relatedTools}
      formula={formula}
    >
      <div className="grid gap-6 sm:grid-cols-3">
        {(['celsius', 'fahrenheit', 'kelvin'] as TempUnit[]).map((unit) => {
          const labels: Record<TempUnit, { label: string; symbol: string }> = {
            celsius: { label: 'Celsius', symbol: '°C' },
            fahrenheit: { label: 'Fahrenheit', symbol: '°F' },
            kelvin: { label: 'Kelvin', symbol: 'K' },
          };
          const vals: Record<TempUnit, [string, React.Dispatch<React.SetStateAction<string>>]> = {
            celsius: [celsius, setCelsius],
            fahrenheit: [fahrenheit, setFahrenheit],
            kelvin: [kelvin, setKelvin],
          };
          const [val, setVal] = vals[unit];
          return (
            <div key={unit} className="space-y-2">
              <label className="label-text">{labels[unit].label} ({labels[unit].symbol})</label>
              <input
                type="number"
                value={val}
                onChange={(e) => { setVal(e.target.value); updateAll(e.target.value, unit); }}
                className="input-field font-mono"
                step="any"
              />
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-text-primary mb-3">Temperature Reference Points</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-text-secondary font-medium">Reference Point</th>
                <th className="text-right py-2 px-3 text-text-secondary font-medium">°C</th>
                <th className="text-right py-2 px-3 text-text-secondary font-medium">°F</th>
                <th className="text-right py-2 px-3 text-text-secondary font-medium">K</th>
              </tr>
            </thead>
            <tbody>
              {temperatureReferences.map((ref, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="py-2 px-3 text-text-primary font-medium">{ref.label}</td>
                  <td className="py-2 px-3 text-right font-mono text-text-primary">{ref.celsius}</td>
                  <td className="py-2 px-3 text-right font-mono text-text-primary">{ref.fahrenheit}</td>
                  <td className="py-2 px-3 text-right font-mono text-text-primary">{ref.kelvin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ToolLayout>
  );
}
