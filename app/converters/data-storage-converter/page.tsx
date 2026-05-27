'use client';
import React, { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { UniversalConverter } from '@/components/converters/UniversalConverter';
import { convertData, dataUnits, getDataFormula } from '@/lib/converters/data';

const decimalUnits: Record<string, { label: string; symbol: string }> = {
  bit: dataUnits.bit,
  byte: dataUnits.byte,
  kilobyte: dataUnits.kilobyte,
  megabyte: dataUnits.megabyte,
  gigabyte: dataUnits.gigabyte,
  terabyte: dataUnits.terabyte,
  petabyte: dataUnits.petabyte,
};

const binaryUnits: Record<string, { label: string; symbol: string }> = {
  bit: dataUnits.bit,
  byte: dataUnits.byte,
  kibibyte: dataUnits.kibibyte,
  mebibyte: dataUnits.mebibyte,
  gibibyte: dataUnits.gibibyte,
  tebibyte: dataUnits.tebibyte,
  pebibyte: dataUnits.pebibyte,
};

export default function DataStorageConverterPage() {
  const [mode, setMode] = useState<'decimal' | 'binary'>('decimal');

  const currentUnits = useMemo(() => mode === 'decimal' ? decimalUnits : binaryUnits, [mode]);

  const faq = [
    { question: 'What is the difference between a kilobyte and a kibibyte?', answer: 'A kilobyte (KB) is 1,000 bytes (decimal), while a kibibyte (KiB) is 1,024 bytes (binary). Hard drive manufacturers use decimal units, while operating systems often report in binary units.' },
    { question: 'Why is there confusion between GB and GiB?', answer: 'Most operating systems display file sizes in binary (GiB) but label them as GB. A 500 GB hard drive actually has 500 billion bytes (decimal), which the OS shows as approximately 465 GB (actually GiB).' },
    { question: 'How many bytes are in a gigabyte?', answer: 'In decimal (used by drive manufacturers): 1 GB = 1,000,000,000 bytes (10⁹). In binary (used by RAM and OS): 1 GiB = 1,073,741,824 bytes (2³⁰).' },
  ];

  const relatedTools = [
    { name: 'Time Converter', path: '/converters/time-converter' },
    { name: 'Speed Converter', path: '/converters/speed-converter' },
    { name: 'Length Converter', path: '/converters/length-converter' },
  ];

  const conversionTable = [
    { label: '1 Bit', value: '0.125 B' },
    { label: '1 Byte', value: '1 B' },
    { label: '1 Kilobyte', value: '1,000 B' },
    { label: '1 Kibibyte', value: '1,024 B' },
    { label: '1 Megabyte', value: '1,000,000 B' },
    { label: '1 Mebibyte', value: '1,048,576 B' },
    { label: '1 Gigabyte', value: '1,000,000,000 B' },
    { label: '1 Gibibyte', value: '1,073,741,824 B' },
    { label: '1 Terabyte', value: '1,000,000,000,000 B' },
    { label: '1 Tebibyte', value: '1,099,511,627,776 B' },
    { label: '1 Petabyte', value: '1,000,000,000,000,000 B' },
    { label: '1 Pebibyte', value: '1,125,899,906,842,624 B' },
  ];

  return (
    <ToolLayout
      title="Data Storage Converter"
      description="Convert between bits, bytes, kilobytes, megabytes, gigabytes, terabytes, petabytes and their binary equivalents (kibibytes, mebibytes, gibibytes, tebibytes, pebibytes)."
      faq={faq}
      relatedTools={relatedTools}
      conversionTable={conversionTable}
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="text-sm font-medium text-text-primary">Unit System:</span>
        <div className="flex rounded-lg border border-border overflow-hidden">
          <button
            onClick={() => setMode('decimal')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${mode === 'decimal' ? 'bg-primary text-white' : 'bg-surface text-text-secondary hover:bg-gray-100 dark:hover:bg-slate-700'}`}
          >
            Decimal (KB, MB, GB)
          </button>
          <button
            onClick={() => setMode('binary')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${mode === 'binary' ? 'bg-primary text-white' : 'bg-surface text-text-secondary hover:bg-gray-100 dark:hover:bg-slate-700'}`}
          >
            Binary (KiB, MiB, GiB)
          </button>
        </div>
      </div>
      <UniversalConverter
        title="Data Storage"
        units={currentUnits}
        convert={convertData}
        getFormula={getDataFormula}
        defaultFrom={mode === 'decimal' ? 'megabyte' : 'mebibyte'}
        defaultTo={mode === 'decimal' ? 'gigabyte' : 'gibibyte'}
      />
    </ToolLayout>
  );
}
