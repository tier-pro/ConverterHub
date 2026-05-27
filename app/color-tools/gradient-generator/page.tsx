'use client';
import React, { useState, useMemo, useCallback } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

interface ColorStop {
  color: string;
  position: number;
}

const presets: { name: string; stops: ColorStop[]; type: 'linear' | 'radial'; angle: number }[] = [
  { name: 'Sunset', stops: [{ color: '#ff7e5f', position: 0 }, { color: '#feb47b', position: 100 }], type: 'linear', angle: 135 },
  { name: 'Ocean', stops: [{ color: '#2193b0', position: 0 }, { color: '#6dd5ed', position: 100 }], type: 'linear', angle: 90 },
  { name: 'Forest', stops: [{ color: '#134e5e', position: 0 }, { color: '#71b280', position: 100 }], type: 'linear', angle: 45 },
  { name: 'Midnight', stops: [{ color: '#232526', position: 0 }, { color: '#414345', position: 100 }], type: 'linear', angle: 0 },
  { name: 'Neon', stops: [{ color: '#f953c6', position: 0 }, { color: '#b91d73', position: 50 }, { color: '#f953c6', position: 100 }], type: 'linear', angle: 90 },
  { name: 'Candy', stops: [{ color: '#d53369', position: 0 }, { color: '#daae51', position: 100 }], type: 'linear', angle: 45 },
  { name: 'Aurora', stops: [{ color: '#00b4db', position: 0 }, { color: '#0083b0', position: 100 }], type: 'linear', angle: 135 },
  { name: 'Peach', stops: [{ color: '#fdcbf1', position: 0 }, { color: '#e6dee9', position: 100 }], type: 'radial', angle: 0 },
];

export default function GradientGeneratorPage() {
  const [stops, setStops] = useState<ColorStop[]>([
    { color: '#ff7e5f', position: 0 },
    { color: '#feb47b', position: 100 },
  ]);
  const [type, setType] = useState<'linear' | 'radial'>('linear');
  const [angle, setAngle] = useState(135);
  const [copied, copy] = useCopyToClipboard();

  const addStop = useCallback(() => {
    if (stops.length >= 10) return;
    const mid = stops.length;
    const avgPos = Math.round(stops.reduce((a, s) => a + s.position, 0) / stops.length);
    setStops([...stops, { color: '#888888', position: Math.min(avgPos + 10, 100) }]);
  }, [stops]);

  const removeStop = useCallback((index: number) => {
    if (stops.length <= 2) return;
    setStops(stops.filter((_, i) => i !== index));
  }, [stops]);

  const updateStop = useCallback((index: number, updates: Partial<ColorStop>) => {
    setStops(stops.map((s, i) => i === index ? { ...s, ...updates } : s));
  }, [stops]);

  const sortedStops = useMemo(() => [...stops].sort((a, b) => a.position - b.position), [stops]);

  const gradientCss = useMemo(() => {
    const parts = sortedStops.map(s => `${s.color} ${s.position}%`).join(', ');
    if (type === 'radial') return `background: radial-gradient(circle, ${parts});`;
    return `background: linear-gradient(${angle}deg, ${parts});`;
  }, [sortedStops, type, angle]);

  const applyPreset = useCallback((preset: typeof presets[number]) => {
    setStops(preset.stops.map(s => ({ ...s })));
    setType(preset.type);
    setAngle(preset.angle);
  }, []);

  const faq = [
    { question: 'What is a gradient generator?', answer: 'A gradient generator creates smooth color transitions between multiple color stops in linear or radial directions.' },
    { question: 'What is the difference between linear and radial gradients?', answer: 'Linear gradients transition colors along a straight line, while radial gradients transition outward from a central point in a circular pattern.' },
  ];

  const relatedTools = [
    { name: 'Color Picker', path: '/color-tools/color-picker' },
    { name: 'Color Converter', path: '/color-tools/color-converter' },
    { name: 'Contrast Checker', path: '/color-tools/contrast-checker' },
  ];

  return (
    <ToolLayout title="Gradient Generator" description="Create beautiful CSS gradients with custom color stops, directions, and live preview." faq={faq} relatedTools={relatedTools}>
      <div className="flex gap-2 mb-4 flex-wrap">
        {presets.map((p) => (
          <Button key={p.name} size="sm" variant="secondary" onClick={() => applyPreset(p)}>{p.name}</Button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="flex gap-3">
            <Button variant={type === 'linear' ? 'primary' : 'secondary'} onClick={() => setType('linear')}>Linear</Button>
            <Button variant={type === 'radial' ? 'primary' : 'secondary'} onClick={() => setType('radial')}>Radial</Button>
          </div>

          {type === 'linear' && (
            <div>
              <label className="label-text">Angle: {angle}°</label>
              <input type="range" min={0} max={360} value={angle} onChange={(e) => setAngle(+e.target.value)} className="w-full" />
            </div>
          )}

          <div className="space-y-3">
            {stops.map((stop, i) => (
              <Card key={i} hover={false} className="p-3">
                <div className="flex items-center gap-3">
                  <input type="color" value={stop.color} onChange={(e) => updateStop(i, { color: e.target.value })} className="w-10 h-10 rounded border border-border cursor-pointer" />
                  <div className="flex-1">
                    <label className="label-text">Position: {stop.position}%</label>
                    <input type="range" min={0} max={100} value={stop.position} onChange={(e) => updateStop(i, { position: +e.target.value })} className="w-full" />
                  </div>
                  <span className="text-xs font-mono text-text-secondary w-16 truncate">{stop.color}</span>
                  {stops.length > 2 && (
                    <Button size="sm" variant="ghost" onClick={() => removeStop(i)}>✕</Button>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {stops.length < 10 && (
            <Button variant="secondary" onClick={addStop}>+ Add Color Stop</Button>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-border overflow-hidden" style={{ height: 250, ...(type === 'linear'
            ? { background: `linear-gradient(${angle}deg, ${sortedStops.map(s => `${s.color} ${s.position}%`).join(', ')})` }
            : { background: `radial-gradient(circle, ${sortedStops.map(s => `${s.color} ${s.position}%`).join(', ')})` })
          }} />

          <Card hover={false} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-text-primary">CSS Code</h3>
              <Button size="sm" variant="ghost" onClick={() => copy(gradientCss)}>{copied ? 'Copied!' : 'Copy'}</Button>
            </div>
            <pre className="bg-gray-50 dark:bg-slate-800 p-3 rounded-lg text-xs font-mono text-text-secondary overflow-x-auto">{gradientCss}</pre>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
