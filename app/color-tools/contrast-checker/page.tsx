'use client';
import React, { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!m) return null;
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
}

function relativeLuminance(r: number, g: number, b: number): number {
  const toLinear = (c: number) => {
    const srgb = c / 255;
    return srgb <= 0.03928 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function contrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function isValidHex(v: string) {
  return /^#[a-f\d]{6}$/i.test(v);
}

export default function ContrastCheckerPage() {
  const [fg, setFg] = useState('#000000');
  const [bg, setBg] = useState('#ffffff');

  const fgRgb = useMemo(() => hexToRgb(fg), [fg]);
  const bgRgb = useMemo(() => hexToRgb(bg), [bg]);
  const fgValid = isValidHex(fg);
  const bgValid = isValidHex(bg);

  const ratio = useMemo(() => {
    if (!fgRgb || !bgRgb) return null;
    const l1 = relativeLuminance(fgRgb.r, fgRgb.g, fgRgb.b);
    const l2 = relativeLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
    return contrastRatio(l1, l2);
  }, [fgRgb, bgRgb]);

  const wcag = useMemo(() => {
    if (!ratio) return null;
    return {
      aaNormal: ratio >= 4.5,
      aaLarge: ratio >= 3,
      aaaNormal: ratio >= 7,
      aaaLarge: ratio >= 4.5,
    };
  }, [ratio]);

  const sampleStyle = useMemo(() => {
    if (!fgRgb || !bgRgb) return {};
    return { color: fg, backgroundColor: bg };
  }, [fg, bg]);

  const faq = [
    { question: 'What is color contrast?', answer: 'Color contrast measures the difference in luminance between foreground and background colors, affecting readability and accessibility.' },
    { question: 'What is WCAG?', answer: 'WCAG (Web Content Accessibility Guidelines) provides standards for web accessibility, including minimum contrast ratios for text.' },
    { question: 'What contrast ratio do I need?', answer: 'For AA compliance: 4.5:1 for normal text, 3:1 for large text. For AAA: 7:1 for normal text, 4.5:1 for large text.' },
  ];

  const relatedTools = [
    { name: 'Color Converter', path: '/color-tools/color-converter' },
    { name: 'Color Picker', path: '/color-tools/color-picker' },
    { name: 'Gradient Generator', path: '/color-tools/gradient-generator' },
  ];

  return (
    <ToolLayout title="Contrast Checker" description="Check color contrast ratios and WCAG compliance for accessible web design." faq={faq} relatedTools={relatedTools}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="w-12 h-12 rounded border border-border cursor-pointer" />
            <Input label="Foreground" placeholder="#000000" value={fg} onChange={(e) => setFg(e.target.value)} error={fg && !fgValid ? 'Invalid hex' : ''} />
          </div>
          <div className="flex items-center gap-3">
            <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="w-12 h-12 rounded border border-border cursor-pointer" />
            <Input label="Background" placeholder="#ffffff" value={bg} onChange={(e) => setBg(e.target.value)} error={bg && !bgValid ? 'Invalid hex' : ''} />
          </div>

          {ratio !== null && (
            <Card hover={false} className="p-4">
              <div className="text-center">
                <p className="text-4xl font-bold text-text-primary">{ratio.toFixed(2)}<span className="text-lg font-normal text-text-secondary">:1</span></p>
                <p className="text-sm text-text-secondary mt-1">Contrast Ratio</p>
              </div>
            </Card>
          )}

          {wcag && (
            <Card hover={false} className="p-4">
              <h3 className="text-sm font-semibold text-text-primary mb-3">WCAG Compliance</h3>
              <div className="space-y-2 text-sm">
                {[
                  { label: 'AA Normal Text (≥ 4.5:1)', pass: wcag.aaNormal },
                  { label: 'AA Large Text (≥ 3:1)', pass: wcag.aaLarge },
                  { label: 'AAA Normal Text (≥ 7:1)', pass: wcag.aaaNormal },
                  { label: 'AAA Large Text (≥ 4.5:1)', pass: wcag.aaaLarge },
                ].map(({ label, pass }) => (
                  <div key={label} className="flex items-center justify-between py-1">
                    <span className="text-text-secondary">{label}</span>
                    <span className={`font-semibold ${pass ? 'text-green-600 dark:text-green-400' : 'text-error'}`}>
                      {pass ? 'PASS' : 'FAIL'}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card hover={false} className="p-4 overflow-hidden">
            <div className="rounded-lg p-6 text-center" style={sampleStyle}>
              <p className="text-2xl font-bold mb-2">Sample Text</p>
              <p className="text-sm">The quick brown fox jumps over the lazy dog.</p>
              <p className="text-xs mt-2">ABC abc 123 | The five boxing wizards jump quickly.</p>
            </div>
          </Card>

          <Card hover={false} className="p-4">
            <h3 className="text-sm font-semibold text-text-primary mb-3">Preview</h3>
            <div className="space-y-3">
              <div className="rounded-lg p-4" style={{ backgroundColor: bg, color: fg }}>
                <p className="font-bold">Sample Text on Your Colors</p>
                <p className="text-sm mt-1">Normal text sample for readability check.</p>
              </div>
              <div className="rounded-lg p-4 border border-border" style={{ backgroundColor: bg }}>
                <p className="font-bold" style={{ color: '#000000' }}>Black Text</p>
                <p className="text-sm mt-1" style={{ color: '#000000' }}>Sample black text on selected background.</p>
              </div>
              <div className="rounded-lg p-4 border border-border" style={{ backgroundColor: bg }}>
                <p className="font-bold" style={{ color: '#ffffff' }}>White Text</p>
                <p className="text-sm mt-1" style={{ color: '#ffffff' }}>Sample white text on selected background.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
