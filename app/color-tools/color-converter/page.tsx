'use client';
import React, { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!match) return null;
  return { r: parseInt(match[1], 16), g: parseInt(match[2], 16), b: parseInt(match[3], 16) };
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

function rgbToCmyk(r: number, g: number, b: number) {
  const rr = r / 255, gg = g / 255, bb = b / 255;
  const k = 1 - Math.max(rr, gg, bb);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  const c = ((1 - rr - k) / (1 - k)) * 100;
  const m = ((1 - gg - k) / (1 - k)) * 100;
  const y = ((1 - bb - k) / (1 - k)) * 100;
  return { c: Math.round(c), m: Math.round(m), y: Math.round(y), k: Math.round(k * 100) };
}

function rgbToHsv(r: number, g: number, b: number) {
  const rr = r / 255, gg = g / 255, bb = b / 255;
  const max = Math.max(rr, gg, bb), min = Math.min(rr, gg, bb);
  let h = 0, s = 0, v = max;
  const d = max - min;
  s = max === 0 ? 0 : d / max;
  if (max !== min) {
    switch (max) {
      case rr: h = ((gg - bb) / d + (gg < bb ? 6 : 0)) * 60; break;
      case gg: h = ((bb - rr) / d + 2) * 60; break;
      case bb: h = ((rr - gg) / d + 4) * 60; break;
    }
  }
  return { h: Math.round(h), s: Math.round(s * 100), v: Math.round(v * 100) };
}

const namedColors: Record<string, string> = {
  '000000': 'Black', 'ffffff': 'White', 'ff0000': 'Red', '00ff00': 'Lime',
  '0000ff': 'Blue', 'ffff00': 'Yellow', '00ffff': 'Cyan', 'ff00ff': 'Magenta',
  'c0c0c0': 'Silver', '808080': 'Gray', '800000': 'Maroon', '808000': 'Olive',
  '008000': 'Green', '800080': 'Purple', '008080': 'Teal', '000080': 'Navy',
  'ffa500': 'Orange', 'ffc0cb': 'Pink', 'a52a2a': 'Brown', 'f0f8ff': 'AliceBlue',
  'faebd7': 'AntiqueWhite', '7fffd4': 'Aquamarine', 'f5f5dc': 'Beige',
  'ffe4c4': 'Bisque', '8a2be2': 'BlueViolet', 'deb887': 'BurlyWood',
  '5f9ea0': 'CadetBlue', '7fff00': 'Chartreuse', 'd2691e': 'Chocolate',
  'ff7f50': 'Coral', '6495ed': 'CornflowerBlue', 'fff8dc': 'Cornsilk',
  'dc143c': 'Crimson', '00bfff': 'DeepSkyBlue', '696969': 'DimGray',
  'ff1493': 'DeepPink', '1e90ff': 'DodgerBlue', 'b22222': 'FireBrick',
  '228b22': 'ForestGreen', 'dcdcdc': 'Gainsboro', 'ffd700': 'Gold',
  'adff2f': 'GreenYellow', 'f0fff0': 'HoneyDew', 'ff69b4': 'HotPink',
  'cd5c5c': 'IndianRed', 'fffff0': 'Ivory', 'f0e68c': 'Khaki',
  'e6e6fa': 'Lavender', 'fffacd': 'LemonChiffon', 'add8e6': 'LightBlue',
  '90ee90': 'LightGreen', 'ffb6c1': 'LightPink', '87cefa': 'LightSkyBlue',
  'dda0dd': 'Plum', 'ff6347': 'Tomato', 'ee82ee': 'Violet', 'f5deb3': 'Wheat',
};

function getColorName(hex: string): string {
  const key = hex.replace('#', '').toLowerCase();
  return namedColors[key] || '';
}

export default function ColorConverterPage() {
  const [hex, setHex] = useState('#1e90ff');
  const [copied, copy] = useCopyToClipboard();

  const rgb = useMemo(() => hexToRgb(hex), [hex]);
  const error = useMemo(() => {
    if (!hex) return '';
    const v = hex.trim();
    if (!v.startsWith('#')) return 'Hex must start with #';
    if (!/^#[a-f\d]{6}$/i.test(v)) return 'Enter a valid 6-digit hex color (e.g. #ff6600)';
    return '';
  }, [hex]);

  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;
  const cmyk = rgb ? rgbToCmyk(rgb.r, rgb.g, rgb.b) : null;
  const hsv = rgb ? rgbToHsv(rgb.r, rgb.g, rgb.b) : null;
  const colorName = rgb ? getColorName(hex) : '';

  const values = rgb ? [
    { label: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { label: 'RGBA', value: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)` },
    { label: 'HSL', value: `hsl(${hsl!.h}, ${hsl!.s}%, ${hsl!.l}%)` },
    { label: 'HSLA', value: `hsla(${hsl!.h}, ${hsl!.s}%, ${hsl!.l}%, 1)` },
    { label: 'CMYK', value: `cmyk(${cmyk!.c}%, ${cmyk!.m}%, ${cmyk!.y}%, ${cmyk!.k}%)` },
    { label: 'HSV', value: `hsv(${hsv!.h}, ${hsv!.s}%, ${hsv!.v}%)` },
  ] : [];

  const faq = [
    { question: 'What is a color converter?', answer: 'A color converter translates colors between different color models like HEX, RGB, HSL, CMYK, and HSV.' },
    { question: 'Why do different color models exist?', answer: 'Different color models serve different purposes: RGB for screens, CMYK for printing, HSL/HSV for human-friendly adjustments.' },
  ];

  const relatedTools = [
    { name: 'Color Picker', path: '/color-tools/color-picker' },
    { name: 'Gradient Generator', path: '/color-tools/gradient-generator' },
    { name: 'Contrast Checker', path: '/color-tools/contrast-checker' },
  ];

  return (
    <ToolLayout title="Color Converter" description="Convert colors between HEX, RGB, HSL, CMYK, HSV and more with live preview." faq={faq} relatedTools={relatedTools}>
      <Input
        label="HEX Color"
        placeholder="#1e90ff"
        value={hex}
        onChange={(e) => setHex(e.target.value)}
        error={error}
      />

      <div className="mt-4 rounded-lg border border-border overflow-hidden" style={{ height: 200, backgroundColor: rgb ? `#${hex.replace('#', '')}` : '#e5e7eb' }}>
        {!rgb && !error && <div className="flex items-center justify-center h-full text-text-secondary text-sm">Enter a valid hex color</div>}
      </div>

      {colorName && (
        <p className="mt-2 text-sm text-text-secondary">
          Color Name: <span className="font-semibold text-text-primary">{colorName}</span>
        </p>
      )}

      {rgb && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {values.map((v) => (
            <Card key={v.label} hover={false} className="p-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-semibold text-text-primary">{v.label}</h3>
                <Button size="sm" variant="ghost" onClick={() => copy(v.value)}>{copied ? 'Copied!' : 'Copy'}</Button>
              </div>
              <p className="text-sm font-mono text-text-secondary break-all">{v.value}</p>
            </Card>
          ))}
        </div>
      )}
    </ToolLayout>
  );
}
