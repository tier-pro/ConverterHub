'use client';
import React, { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type UnitSystem = 'metric' | 'imperial';

function getCategory(bmi: number): { label: string; color: string; className: string } {
  if (bmi < 18.5) return { label: 'Underweight', color: '#F59E0B', className: 'text-warning' };
  if (bmi < 25) return { label: 'Normal', color: '#10B981', className: 'text-success' };
  if (bmi < 30) return { label: 'Overweight', color: '#F97316', className: 'text-orange-500' };
  return { label: 'Obese', color: '#EF4444', className: 'text-error' };
}

export default function BmiCalculatorPage() {
  const [weight, setWeight] = useState('70');
  const [heightFt, setHeightFt] = useState('5');
  const [heightIn, setHeightIn] = useState('9');
  const [heightCm, setHeightCm] = useState('175');
  const [unit, setUnit] = useState<UnitSystem>('metric');
  const [calculated, setCalculated] = useState(false);

  const result = useMemo(() => {
    const w = parseFloat(weight);
    if (isNaN(w) || w <= 0) return null;
    let hInMeters: number;
    if (unit === 'metric') {
      const h = parseFloat(heightCm);
      if (isNaN(h) || h <= 0) return null;
      hInMeters = h / 100;
    } else {
      const ft = parseFloat(heightFt) || 0;
      const ins = parseFloat(heightIn) || 0;
      const totalInches = ft * 12 + ins;
      if (totalInches <= 0) return null;
      hInMeters = totalInches * 0.0254;
    }
    const weightKg = unit === 'metric' ? w : w * 0.453592;
    const bmi = weightKg / (hInMeters * hInMeters);
    const category = getCategory(bmi);
    const minNormal = 18.5 * hInMeters * hInMeters;
    const maxNormal = 24.9 * hInMeters * hInMeters;
    const idealWeightKg = unit === 'metric' ? { min: Math.round(minNormal * 10) / 10, max: Math.round(maxNormal * 10) / 10 } : { min: Math.round((minNormal / 0.453592) * 10) / 10, max: Math.round((maxNormal / 0.453592) * 10) / 10 };
    return { bmi: Math.round(bmi * 10) / 10, category, idealWeightKg };
  }, [weight, heightCm, heightFt, heightIn, unit, calculated]);

  const barPercent = result ? Math.min((result.bmi / 40) * 100, 100) : 0;

  const faq = [
    { question: 'What is BMI?', answer: 'Body Mass Index (BMI) is a measure of body fat based on height and weight. It is calculated by dividing weight in kilograms by height in meters squared.' },
    { question: 'What is a healthy BMI?', answer: 'A BMI between 18.5 and 24.9 is considered normal or healthy weight. Below 18.5 is underweight, 25-29.9 is overweight, and 30+ is obese.' },
  ];

  const relatedTools = [
    { name: 'Random Generator', path: '/misc-tools/random-generator' },
    { name: 'Stopwatch Timer', path: '/misc-tools/stopwatch-timer' },
  ];

  return (
    <ToolLayout title="BMI Calculator" description="Calculate your Body Mass Index (BMI) and check your weight category with visual feedback." faq={faq} relatedTools={relatedTools}>
      <div className="space-y-4">
        <div className="flex gap-2">
          <button onClick={() => setUnit('metric')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${unit === 'metric' ? 'bg-primary text-white' : 'bg-background text-text-secondary hover:text-text-primary border border-border'}`}>Metric (kg/cm)</button>
          <button onClick={() => setUnit('imperial')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${unit === 'imperial' ? 'bg-primary text-white' : 'bg-background text-text-secondary hover:text-text-primary border border-border'}`}>Imperial (lbs/ft)</button>
        </div>

        <Input label={`Weight (${unit === 'metric' ? 'kg' : 'lbs'})`} type="number" placeholder="70" value={weight} onChange={(e) => setWeight(e.target.value)} />

        {unit === 'metric' ? (
          <Input label="Height (cm)" type="number" placeholder="175" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Height (feet)" type="number" placeholder="5" value={heightFt} onChange={(e) => setHeightFt(e.target.value)} />
            <Input label="Height (inches)" type="number" placeholder="9" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} />
          </div>
        )}

        <Button onClick={() => setCalculated((prev) => !prev)}>Calculate BMI</Button>

        {result && (
          <div className="space-y-4">
            <Card hover={false} className="p-4 text-center">
              <p className="text-sm text-text-secondary">Your BMI</p>
              <p className="text-4xl font-bold text-primary">{result.bmi}</p>
              <p className={`text-lg font-semibold ${result.category.className}`}>{result.category.label}</p>

              <div className="mt-4 w-full bg-background rounded-full h-3 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${barPercent}%`, backgroundColor: result.category.color }} />
              </div>
              <div className="flex justify-between text-[10px] text-text-secondary mt-1">
                <span>0</span><span>18.5</span><span>25</span><span>30</span><span>40+</span>
              </div>
            </Card>

            <Card hover={false} className="p-4">
              <h3 className="text-sm font-semibold text-text-primary mb-2">Ideal Weight Range (BMI 18.5-24.9)</h3>
              <p className="text-lg font-bold text-primary">
                {result.idealWeightKg.min} - {result.idealWeightKg.max} {unit === 'metric' ? 'kg' : 'lbs'}
              </p>
            </Card>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
