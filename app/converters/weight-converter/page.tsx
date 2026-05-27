'use client';
import React from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { UniversalConverter } from '@/components/converters/UniversalConverter';
import { convertWeight, weightUnits, getWeightFormula } from '@/lib/converters/weight';

export default function WeightConverterPage() {
  const faq = [
    { question: 'How many grams are in a pound?', answer: 'One pound is equal to approximately 453.592 grams. This is the standard conversion factor used internationally.' },
    { question: 'What is the difference between a metric ton and a US ton?', answer: 'A metric ton (tonne) equals 1,000 kg or approximately 2,204.62 lbs. A US ton equals 2,000 lbs or approximately 907.185 kg. The metric ton is about 10% heavier.' },
    { question: 'How many ounces are in a kilogram?', answer: 'There are approximately 35.274 ounces in a kilogram. Since 1 kg = 1,000 g and 1 oz = 28.3495 g, simply divide 1000 by 28.3495.' },
  ];

  const relatedTools = [
    { name: 'Length Converter', path: '/converters/length-converter' },
    { name: 'Volume Converter', path: '/converters/volume-converter' },
    { name: 'Temperature Converter', path: '/converters/temperature-converter' },
  ];

  const conversionTable = [
    { label: '1 Milligram', value: '0.001 g' },
    { label: '1 Gram', value: '1 g' },
    { label: '1 Kilogram', value: '1,000 g' },
    { label: '1 Metric Ton', value: '1,000,000 g' },
    { label: '1 Ounce', value: '28.3495 g' },
    { label: '1 Pound', value: '453.592 g' },
    { label: '1 Stone', value: '6,350.29 g' },
    { label: '1 US Ton', value: '907,185 g' },
  ];

  return (
    <ToolLayout
      title="Weight Converter"
      description="Convert between milligrams, grams, kilograms, metric tons, ounces, pounds, stones, and US tons."
      faq={faq}
      relatedTools={relatedTools}
      conversionTable={conversionTable}
    >
      <UniversalConverter
        title="Weight"
        units={weightUnits}
        convert={convertWeight}
        getFormula={getWeightFormula}
        defaultFrom="kilogram"
        defaultTo="pound"
      />
    </ToolLayout>
  );
}
