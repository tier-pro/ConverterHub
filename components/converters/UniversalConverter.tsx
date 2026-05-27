'use client';
import React, { useState, useMemo, useCallback } from 'react';
import { ArrowDownUp, Copy, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

interface UnitOption {
  value: string;
  label: string;
  symbol: string;
}

type UnitDef = { label: string; symbol: string };

interface UniversalConverterProps {
  title?: string;
  units: Record<string, UnitDef>;
  convert: (value: number, from: any, to: any) => number;
  getFormula: (from: any, to: any) => string;
  defaultFrom?: string;
  defaultTo?: string;
}

export function UniversalConverter({ title, units, convert, getFormula, defaultFrom, defaultTo }: UniversalConverterProps) {
  const unitArray = useMemo(() => Object.entries(units).map(([value, u]) => ({ value, ...u })), [units]);
  const [fromUnit, setFromUnit] = useState(defaultFrom || unitArray[0]?.value || '');
  const [toUnit, setToUnit] = useState(defaultTo || (unitArray.length > 1 ? unitArray[1]?.value : unitArray[0]?.value) || '');
  const [value, setValue] = useState('1');
  const [copied, copyToClipboard] = useCopyToClipboard();

  const result = useMemo(() => {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : convert(num, fromUnit, toUnit);
  }, [value, fromUnit, toUnit, convert]);

  const formula = useMemo(() => getFormula(fromUnit, toUnit), [fromUnit, toUnit, getFormula]);

  const handleSwap = useCallback(() => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  }, [fromUnit, toUnit]);

  const handleReset = useCallback(() => {
    setValue('1');
  }, []);

  const fromSymbol = units[fromUnit]?.symbol || '';
  const toSymbol = units[toUnit]?.symbol || '';

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="label-text">From</label>
          <div className="flex gap-2">
            <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="select-field flex-1">
              {unitArray.map((u) => <option key={u.value} value={u.value}>{u.label} ({u.symbol})</option>)}
            </select>
          </div>
          <div className="relative">
            <input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="input-field pr-12" placeholder="Enter value" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-text-secondary font-mono">{fromSymbol}</span>
          </div>
        </div>
        <div className="space-y-2">
          <label className="label-text">To</label>
          <div className="flex gap-2">
            <select value={toUnit} onChange={(e) => setToUnit(e.target.value)} className="select-field flex-1">
              {unitArray.map((u) => <option key={u.value} value={u.value}>{u.label} ({u.symbol})</option>)}
            </select>
          </div>
          <div className="relative">
            <input type="text" value={isNaN(result as number) ? '0' : result.toPrecision(10).replace(/\.?0+$/, '')} className="input-field pr-12 font-mono font-bold text-primary bg-primary/5" readOnly />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-text-secondary font-mono">{toSymbol}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button onClick={handleSwap} className="btn-secondary p-3 rounded-full" title="Swap units">
          <ArrowDownUp className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={() => copyToClipboard(String(result))} size="sm" variant="secondary">
          <Copy className="w-4 h-4" /> {copied ? 'Copied!' : 'Copy Result'}
        </Button>
        <Button onClick={handleReset} size="sm" variant="ghost">
          <RotateCcw className="w-4 h-4" /> Reset
        </Button>
      </div>

      {formula && (
        <div className="rounded-lg bg-gray-50 dark:bg-slate-800 p-3">
          <p className="text-xs text-text-secondary font-medium mb-1">Formula</p>
          <p className="text-sm font-mono text-text-primary">{formula}</p>
        </div>
      )}
    </div>
  );
}
