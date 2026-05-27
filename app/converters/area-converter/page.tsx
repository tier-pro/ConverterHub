'use client';
import React from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { UniversalConverter } from '@/components/converters/UniversalConverter';
import { convertArea, areaUnits, getAreaFormula } from '@/lib/converters/area';

export default function AreaConverterPage() {
  const faq = [
    { question: 'How many square feet are in an acre?', answer: 'One acre equals 43,560 square feet. This is a standard unit of area measurement used primarily in the US and UK for land measurement.' },
    { question: 'What is the difference between an acre and a hectare?', answer: 'A hectare is a metric unit equal to 10,000 square meters (about 2.471 acres). An acre is about 0.4047 hectares. Hectares are used internationally for land measurement.' },
    { question: 'How many square meters are in a square foot?', answer: 'One square foot equals approximately 0.092903 square meters. To convert from square feet to square meters, multiply by 0.092903.' },
  ];

  const relatedTools = [
    { name: 'Length Converter', path: '/converters/length-converter' },
    { name: 'Volume Converter', path: '/converters/volume-converter' },
    { name: 'Speed Converter', path: '/converters/speed-converter' },
  ];

  const conversionTable = [
    { label: '1 Square Millimeter', value: '0.000001 m²' },
    { label: '1 Square Centimeter', value: '0.0001 m²' },
    { label: '1 Square Meter', value: '1 m²' },
    { label: '1 Square Kilometer', value: '1,000,000 m²' },
    { label: '1 Square Inch', value: '0.00064516 m²' },
    { label: '1 Square Foot', value: '0.092903 m²' },
    { label: '1 Square Yard', value: '0.836127 m²' },
    { label: '1 Acre', value: '4,046.86 m²' },
    { label: '1 Hectare', value: '10,000 m²' },
    { label: '1 Square Mile', value: '2,589,990 m²' },
  ];

  return (
    <ToolLayout
      title="Area Converter"
      description="Convert between square millimeters, square centimeters, square meters, square kilometers, square feet, acres, hectares, and more."
      faq={faq}
      relatedTools={relatedTools}
      conversionTable={conversionTable}
    >
      <UniversalConverter
        title="Area"
        units={areaUnits}
        convert={convertArea}
        getFormula={getAreaFormula}
        defaultFrom="sq-m"
        defaultTo="sq-ft"
      />
    </ToolLayout>
  );
}
