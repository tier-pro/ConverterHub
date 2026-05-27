'use client';
import React from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { UniversalConverter } from '@/components/converters/UniversalConverter';
import { convertLength, lengthUnits, getLengthFormula } from '@/lib/converters/length';

export default function LengthConverterPage() {
  const faq = [
    { question: 'How many meters are in a mile?', answer: 'There are exactly 1,609.344 meters in a mile. This is based on the international mile standard adopted in 1959.' },
    { question: 'What is the difference between a nautical mile and a regular mile?', answer: 'A nautical mile is based on the Earth\'s circumference and equals 1,852 meters, while a regular (statute) mile equals 1,609.344 meters. Nautical miles are used in aviation and maritime navigation.' },
    { question: 'How many centimeters are in an inch?', answer: 'One inch is exactly 2.54 centimeters. This conversion factor is defined by international agreement and is used for all length conversions between imperial and metric systems.' },
  ];

  const relatedTools = [
    { name: 'Weight Converter', path: '/converters/weight-converter' },
    { name: 'Area Converter', path: '/converters/area-converter' },
    { name: 'Volume Converter', path: '/converters/volume-converter' },
  ];

  const conversionTable = [
    { label: '1 Millimeter', value: '0.001 m' },
    { label: '1 Centimeter', value: '0.01 m' },
    { label: '1 Meter', value: '1 m' },
    { label: '1 Kilometer', value: '1,000 m' },
    { label: '1 Inch', value: '0.0254 m' },
    { label: '1 Foot', value: '0.3048 m' },
    { label: '1 Yard', value: '0.9144 m' },
    { label: '1 Mile', value: '1,609.344 m' },
    { label: '1 Nautical Mile', value: '1,852 m' },
  ];

  return (
    <ToolLayout
      title="Length Converter"
      description="Convert between millimeters, centimeters, meters, kilometers, inches, feet, yards, miles, and nautical miles."
      faq={faq}
      relatedTools={relatedTools}
      conversionTable={conversionTable}
    >
      <UniversalConverter
        title="Length"
        units={lengthUnits}
        convert={convertLength}
        getFormula={getLengthFormula}
        defaultFrom="meter"
        defaultTo="foot"
      />
    </ToolLayout>
  );
}
