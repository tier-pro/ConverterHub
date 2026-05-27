'use client';
import React, { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

function hslToRgb(h: number, s: number, l: number) {
  s /= 100; l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  return { r: Math.round((r + m) * 255), g: Math.round((g + m) * 255), b: Math.round((b + m) * 255) };
}

function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('');
}

function rgbToHsl(r: number, g: number, b: number) {
  const rr = r / 255, gg = g / 255, bb = b / 255;
  const max = Math.max(rr, gg, bb), min = Math.min(rr, gg, bb);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rr: h = ((gg - bb) / d + (gg < bb ? 6 : 0)) * 60; break;
      case gg: h = ((bb - rr) / d + 2) * 60; break;
      case bb: h = ((rr - gg) / d + 4) * 60; break;
    }
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hexToRgb(hex: string) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!m) return null;
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
}

function generateMonochromatic(r: number, g: number, b: number) {
  const hsl = rgbToHsl(r, g, b);
  return [20, 40, 60, 80, 100].map(l => {
    const c = hslToRgb(hsl.h, hsl.s, l);
    return rgbToHex(c.r, c.g, c.b);
  });
}

function generateAnalogous(r: number, g: number, b: number) {
  const hsl = rgbToHsl(r, g, b);
  return [-60, -30, 0, 30, 60].map(offset => {
    const h = ((hsl.h + offset) % 360 + 360) % 360;
    const c = hslToRgb(h, hsl.s, hsl.l);
    return rgbToHex(c.r, c.g, c.b);
  });
}

function generateComplementary(r: number, g: number, b: number) {
  const hsl = rgbToHsl(r, g, b);
  const base = rgbToHex(r, g, b);
  const comp = hslToRgb((hsl.h + 180) % 360, hsl.s, hsl.l);
  return [base, rgbToHex(comp.r, comp.g, comp.b)];
}

function generateTriadic(r: number, g: number, b: number) {
  const hsl = rgbToHsl(r, g, b);
  return [0, 120, 240].map(offset => {
    const h = ((hsl.h + offset) % 360 + 360) % 360;
    const c = hslToRgb(h, hsl.s, hsl.l);
    return rgbToHex(c.r, c.g, c.b);
  });
}

function generateTetradic(r: number, g: number, b: number) {
  const hsl = rgbToHsl(r, g, b);
  return [0, 90, 180, 270].map(offset => {
    const h = ((hsl.h + offset) % 360 + 360) % 360;
    const c = hslToRgb(h, hsl.s, hsl.l);
    return rgbToHex(c.r, c.g, c.b);
  });
}

function generateSplitComplementary(r: number, g: number, b: number) {
  const hsl = rgbToHsl(r, g, b);
  return [0, 150, 210].map(offset => {
    const h = ((hsl.h + offset) % 360 + 360) % 360;
    const c = hslToRgb(h, hsl.s, hsl.l);
    return rgbToHex(c.r, c.g, c.b);
  });
}

type Scheme = { label: string; colors: string[] };

export default function ColorPickerPage() {
  const [hex, setHex] = useState('#1e90ff');
  const [r, setR] = useState(30);
  const [g, setG] = useState(144);
  const [b, setB] = useState(255);
  const [h, setH] = useState(210);
  const [s, setS] = useState(100);
  const [l, setL] = useState(50);

  const syncFromHex = (value: string) => {
    setHex(value);
    const rgb = hexToRgb(value);
    if (rgb) {
      setR(rgb.r); setG(rgb.g); setB(rgb.b);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      setH(hsl.h); setS(hsl.s); setL(hsl.l);
    }
  };

  const syncFromRgb = (rr: number, gg: number, bb: number) => {
    setR(rr); setG(gg); setB(bb);
    const hexVal = rgbToHex(rr, gg, bb);
    setHex(hexVal);
    const hsl = rgbToHsl(rr, gg, bb);
    setH(hsl.h); setS(hsl.s); setL(hsl.l);
  };

  const syncFromHsl = (hh: number, ss: number, ll: number) => {
    setH(hh); setS(ss); setL(ll);
    const c = hslToRgb(hh, ss, ll);
    setR(c.r); setG(c.g); setB(c.b);
    setHex(rgbToHex(c.r, c.g, c.b));
  };

  const schemes: Scheme[] = useMemo(() => {
    const rgb = hexToRgb(hex);
    if (!rgb) return [];
    return [
      { label: 'Monochromatic', colors: generateMonochromatic(rgb.r, rgb.g, rgb.b) },
      { label: 'Analogous', colors: generateAnalogous(rgb.r, rgb.g, rgb.b) },
      { label: 'Complementary', colors: generateComplementary(rgb.r, rgb.g, rgb.b) },
      { label: 'Triadic', colors: generateTriadic(rgb.r, rgb.g, rgb.b) },
      { label: 'Tetradic (Square)', colors: generateTetradic(rgb.r, rgb.g, rgb.b) },
      { label: 'Split Complementary', colors: generateSplitComplementary(rgb.r, rgb.g, rgb.b) },
    ];
  }, [hex]);

  const faq = [
    { question: 'What is a color picker?', answer: 'A color picker is a tool that helps you select and manipulate colors using different color models like RGB, HSL, and HEX.' },
    { question: 'What are color schemes?', answer: 'Color schemes are predefined sets of colors that work well together based on color theory principles like complementary, analogous, and triadic relationships.' },
  ];

  const relatedTools = [
    { name: 'Color Converter', path: '/color-tools/color-converter' },
    { name: 'Gradient Generator', path: '/color-tools/gradient-generator' },
    { name: 'Contrast Checker', path: '/color-tools/contrast-checker' },
  ];

  return (
    <ToolLayout title="Color Picker" description="Pick and explore colors with RGB and HSL sliders. Generate harmonious color schemes." faq={faq} relatedTools={relatedTools}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <input type="color" value={hex} onChange={(e) => syncFromHex(e.target.value)} className="w-14 h-14 rounded-lg cursor-pointer border border-border" />
            <Input label="HEX" placeholder="#000000" value={hex} onChange={(e) => syncFromHex(e.target.value)} />
          </div>

          <Card hover={false} className="p-4">
            <h3 className="text-sm font-semibold text-text-primary mb-3">RGB</h3>
            <div className="space-y-3">
              <div><label className="label-text">R: {r}</label><input type="range" min={0} max={255} value={r} onChange={(e) => syncFromRgb(+e.target.value, g, b)} className="w-full accent-red-500" /></div>
              <div><label className="label-text">G: {g}</label><input type="range" min={0} max={255} value={g} onChange={(e) => syncFromRgb(r, +e.target.value, b)} className="w-full accent-green-500" /></div>
              <div><label className="label-text">B: {b}</label><input type="range" min={0} max={255} value={b} onChange={(e) => syncFromRgb(r, g, +e.target.value)} className="w-full accent-blue-500" /></div>
            </div>
          </Card>

          <Card hover={false} className="p-4">
            <h3 className="text-sm font-semibold text-text-primary mb-3">HSL</h3>
            <div className="space-y-3">
              <div><label className="label-text">H: {h}°</label><input type="range" min={0} max={360} value={h} onChange={(e) => syncFromHsl(+e.target.value, s, l)} className="w-full" /></div>
              <div><label className="label-text">S: {s}%</label><input type="range" min={0} max={100} value={s} onChange={(e) => syncFromHsl(h, +e.target.value, l)} className="w-full" /></div>
              <div><label className="label-text">L: {l}%</label><input type="range" min={0} max={100} value={l} onChange={(e) => syncFromHsl(h, s, +e.target.value)} className="w-full" /></div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-border overflow-hidden" style={{ height: 200, backgroundColor: hex }} />

          <Card hover={false} className="p-4">
            <h3 className="text-sm font-semibold text-text-primary mb-3">Color Info</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-text-secondary">HEX:</span><span className="font-mono">{hex}</span>
              <span className="text-text-secondary">RGB:</span><span className="font-mono">{r}, {g}, {b}</span>
              <span className="text-text-secondary">HSL:</span><span className="font-mono">{h}°, {s}%, {l}%</span>
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        <h2 className="text-lg font-semibold text-text-primary">Color Schemes</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {schemes.map((scheme) => (
            <Card key={scheme.label} hover={false} className="p-4">
              <h3 className="text-sm font-semibold text-text-primary mb-3">{scheme.label}</h3>
              <div className="flex rounded-lg overflow-hidden h-10 border border-border">
                {scheme.colors.map((c, i) => (
                  <div key={i} className="flex-1" style={{ backgroundColor: c }} title={c} />
                ))}
              </div>
              <div className="flex mt-2 gap-1">
                {scheme.colors.map((c, i) => (
                  <span key={i} className="text-[10px] font-mono text-text-secondary truncate flex-1 text-center">{c}</span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
