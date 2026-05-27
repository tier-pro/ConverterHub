'use client';
import React, { useState, useCallback } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { Select } from '@/components/ui/Select';
import { Copy, RefreshCw, Eye, EyeOff, Trash2 } from 'lucide-react';

const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~';
const AMBIGUOUS = '{}[]()/\\\'"`~,;:.<>|';
const SIMILAR = 'il1Lo0O';

function generatePassword(length: number, useUpper: boolean, useLower: boolean, useNumbers: boolean, useSymbols: boolean, excludeSimilar: boolean, excludeAmbiguous: boolean): string {
  let chars = '';
  if (useLower) chars += LOWERCASE;
  if (useUpper) chars += UPPERCASE;
  if (useNumbers) chars += NUMBERS;
  if (useSymbols) chars += SYMBOLS;

  if (excludeSimilar) chars = chars.split('').filter(c => !SIMILAR.includes(c)).join('');
  if (excludeAmbiguous) chars = chars.split('').filter(c => !AMBIGUOUS.includes(c)).join('');

  if (!chars) chars = LOWERCASE;

  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }
  return password;
}

function calculateEntropy(pw: string): number {
  let pool = 0;
  if (/[a-z]/.test(pw)) pool += 26;
  if (/[A-Z]/.test(pw)) pool += 26;
  if (/[0-9]/.test(pw)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(pw)) pool += 33;
  if (pool === 0) pool = 26;
  return pw.length * Math.log2(pool);
}

function getStrength(entropy: number): { label: string; color: string; percent: number } {
  if (entropy < 28) return { label: 'Weak', color: 'bg-error', percent: 25 };
  if (entropy < 50) return { label: 'Medium', color: 'bg-yellow-500', percent: 50 };
  if (entropy < 70) return { label: 'Strong', color: 'bg-green-500', percent: 75 };
  return { label: 'Very Strong', color: 'bg-primary', percent: 100 };
}

export default function PasswordGeneratorPage() {
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [count, setCount] = useState('1');
  const [passwords, setPasswords] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [copied, copy] = useCopyToClipboard();

  const generate = useCallback(() => {
    const n = parseInt(count);
    const generated: string[] = [];
    for (let i = 0; i < n; i++) {
      generated.push(generatePassword(length, useUpper, useLower, useNumbers, useSymbols, excludeSimilar, excludeAmbiguous));
    }
    setPasswords(generated);
    setHistory((prev) => [...generated, ...prev].slice(0, 50));
  }, [length, useUpper, useLower, useNumbers, useSymbols, excludeSimilar, excludeAmbiguous, count]);

  const entropy = passwords.length > 0 ? calculateEntropy(passwords[0]) : 0;
  const strength = getStrength(entropy);

  return (
    <ToolLayout
      title="Password Generator"
      description="Generate strong, secure random passwords with customizable options. Supports bulk generation and password strength analysis."
      faq={[
        { question: 'What makes a password strong?', answer: 'A strong password is long (16+ characters), includes a mix of uppercase, lowercase, numbers, and symbols, and avoids common words or patterns. High entropy means higher strength.' },
        { question: 'What is password entropy?', answer: 'Entropy measures how unpredictable a password is, expressed in bits. Each bit doubles the number of attempts needed to guess the password. 50+ bits is considered strong.' },
      ]}
      relatedTools={[
        { name: 'Hash Generator', path: '/dev-tools/hash-generator' },
        { name: 'Base64 Encoder', path: '/dev-tools/base64-encoder' },
      ]}
    >
      <div className="space-y-5">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="label-text">Password Length: {length}</label>
            <input
              type="range"
              min={4}
              max={64}
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-text-secondary">
              <span>4</span><span>64</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'upper', label: 'Uppercase (A-Z)', value: useUpper, set: setUseUpper },
              { id: 'lower', label: 'Lowercase (a-z)', value: useLower, set: setUseLower },
              { id: 'numbers', label: 'Numbers (0-9)', value: useNumbers, set: setUseNumbers },
              { id: 'symbols', label: 'Symbols (!@#$)', value: useSymbols, set: setUseSymbols },
            ].map((item) => (
              <label key={item.id} className="flex items-center gap-2 text-sm text-text-primary cursor-pointer">
                <input type="checkbox" checked={item.value} onChange={() => item.set(!item.value)} className="rounded border-border" />
                {item.label}
              </label>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <label className="flex items-center gap-2 text-sm text-text-primary cursor-pointer">
              <input type="checkbox" checked={excludeSimilar} onChange={() => setExcludeSimilar(!excludeSimilar)} className="rounded border-border" />
              Exclude similar (il1Lo0O)
            </label>
            <label className="flex items-center gap-2 text-sm text-text-primary cursor-pointer">
              <input type="checkbox" checked={excludeAmbiguous} onChange={() => setExcludeAmbiguous(!excludeAmbiguous)} className="rounded border-border" />
              Exclude ambiguous symbols
            </label>
          </div>

          <Select
            label="Generate count"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            options={[
              { value: '1', label: '1 password' },
              { value: '5', label: '5 passwords' },
              { value: '10', label: '10 passwords' },
              { value: '20', label: '20 passwords' },
            ]}
          />

          <Button onClick={generate} className="w-full">
            <RefreshCw className="w-4 h-4" />Generate Password{count !== '1' ? 's' : ''}
          </Button>
        </div>

        {passwords.length > 0 && (
          <div className="space-y-3">
            <label className="label-text">Generated Password{passwords.length > 1 ? 's' : ''}</label>

            {entropy > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Strength: <span className="font-semibold" style={{ color: strength.percent >= 75 ? undefined : undefined }}>{strength.label}</span></span>
                  <span className="text-text-secondary">{entropy.toFixed(1)} bits</span>
                </div>
                <div className="h-2 rounded-full bg-gray-200 dark:bg-slate-700 overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-300 ${strength.color}`} style={{ width: `${strength.percent}%` }} />
                </div>
              </div>
            )}

            <div className="space-y-2">
              {passwords.map((pw, i) => (
                <div key={i} className="flex items-center gap-2 rounded-lg border border-border bg-surface p-3">
                  <span className="flex-1 font-mono text-sm break-all select-all">{pw}</span>
                  <Button size="sm" variant="ghost" onClick={() => copy(pw)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="label-text">History</label>
              <Button size="sm" variant="ghost" onClick={() => setHistory([])}>
                <Trash2 className="w-4 h-4" />Clear
              </Button>
            </div>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {history.map((pw, i) => (
                <div key={i} className="flex items-center gap-2 text-sm font-mono text-text-secondary bg-surface rounded p-2">
                  <span className="flex-1 break-all">{pw}</span>
                  <Button size="sm" variant="ghost" onClick={() => copy(pw)}>
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
