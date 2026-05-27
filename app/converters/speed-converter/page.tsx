'use client';
import React from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { UniversalConverter } from '@/components/converters/UniversalConverter';
import { convertSpeed, speedUnits, getSpeedFormula, getMachNumber } from '@/lib/converters/speed';
import { Card } from '@/components/ui/Card';

export default function SpeedConverterPage() {
  const faq = [
    { question: 'How do you convert km/h to mph?', answer: 'To convert kilometers per hour to miles per hour, multiply by 0.621371. For example, 100 km/h is approximately 62.14 mph.' },
    { question: 'What is a knot?', answer: 'A knot is a unit of speed equal to one nautical mile per hour (1.852 km/h). It is used in maritime and aviation contexts because it relates directly to latitude and longitude.' },
    { question: 'What is Mach number?', answer: 'Mach number is the ratio of an object\'s speed to the speed of sound in the surrounding medium. Mach 1 equals approximately 343 m/s (1,235 km/h) at sea level and 20°C.' },
  ];

  const relatedTools = [
    { name: 'Length Converter', path: '/converters/length-converter' },
    { name: 'Time Converter', path: '/converters/time-converter' },
    { name: 'Temperature Converter', path: '/converters/temperature-converter' },
  ];

  const conversionTable = [
    { label: '1 Meter/second', value: '1 m/s' },
    { label: '1 Kilometer/hour', value: '0.277778 m/s' },
    { label: '1 Mile/hour', value: '0.44704 m/s' },
    { label: '1 Foot/second', value: '0.3048 m/s' },
    { label: '1 Knot', value: '0.514444 m/s' },
    { label: 'Mach 1 (sea level)', value: '343 m/s' },
  ];

  return (
    <ToolLayout
      title="Speed Converter"
      description="Convert between meters per second, kilometers per hour, miles per hour, feet per second, and knots."
      faq={faq}
      relatedTools={relatedTools}
      conversionTable={conversionTable}
    >
      <UniversalConverter
        title="Speed"
        units={speedUnits}
        convert={convertSpeed}
        getFormula={getSpeedFormula}
        defaultFrom="kmph"
        defaultTo="mph"
      />
    </ToolLayout>
  );
}
