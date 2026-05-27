'use client';
import React from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { UniversalConverter } from '@/components/converters/UniversalConverter';
import { convertVolume, volumeUnits, getVolumeFormula } from '@/lib/converters/volume';

export default function VolumeConverterPage() {
  const faq = [
    { question: 'How many liters are in a gallon?', answer: 'A US gallon equals approximately 3.78541 liters. A UK (imperial) gallon equals approximately 4.54609 liters. The US gallon is about 20% smaller than the UK gallon.' },
    { question: 'How many milliliters are in a cup?', answer: 'One US cup equals 240 milliliters. This is the standard used in cooking and recipe measurements in the United States.' },
    { question: 'What is the difference between a US gallon and a UK gallon?', answer: 'The US gallon (3785.41 mL) is based on the wine gallon, while the UK gallon (4546.09 mL) is based on the imperial gallon used historically in the British Empire.' },
  ];

  const relatedTools = [
    { name: 'Weight Converter', path: '/converters/weight-converter' },
    { name: 'Area Converter', path: '/converters/area-converter' },
    { name: 'Temperature Converter', path: '/converters/temperature-converter' },
  ];

  const conversionTable = [
    { label: '1 Milliliter', value: '1 mL' },
    { label: '1 Liter', value: '1,000 mL' },
    { label: '1 Cubic Meter', value: '1,000,000 mL' },
    { label: '1 Gallon (US)', value: '3,785.41 mL' },
    { label: '1 Gallon (UK)', value: '4,546.09 mL' },
    { label: '1 Quart', value: '946.353 mL' },
    { label: '1 Pint', value: '473.176 mL' },
    { label: '1 Cup', value: '240 mL' },
    { label: '1 Fluid Ounce', value: '29.5735 mL' },
    { label: '1 Tablespoon', value: '14.7868 mL' },
    { label: '1 Teaspoon', value: '4.92892 mL' },
  ];

  return (
    <ToolLayout
      title="Volume Converter"
      description="Convert between milliliters, liters, cubic meters, US gallons, UK gallons, quarts, pints, cups, fluid ounces, tablespoons, and teaspoons."
      faq={faq}
      relatedTools={relatedTools}
      conversionTable={conversionTable}
    >
      <UniversalConverter
        title="Volume"
        units={volumeUnits}
        convert={convertVolume}
        getFormula={getVolumeFormula}
        defaultFrom="liter"
        defaultTo="gallon-us"
      />
    </ToolLayout>
  );
}
