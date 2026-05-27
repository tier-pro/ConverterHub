'use client';
import React from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { UniversalConverter } from '@/components/converters/UniversalConverter';
import { convertTime, timeUnits, getTimeFormula } from '@/lib/converters/time';

export default function TimeConverterPage() {
  const faq = [
    { question: 'How many seconds are in an hour?', answer: 'There are 3,600 seconds in an hour. This is calculated by multiplying 60 seconds per minute by 60 minutes per hour.' },
    { question: 'How many days are in a year?', answer: 'A standard year has 365 days, but a leap year has 366 days. For conversion purposes, the average year length of 365.25 days (or 31,557,600 seconds) is used.' },
    { question: 'What is the difference between a month and a lunar month?', answer: 'A calendar month averages about 30.44 days (365.25 / 12), while a lunar month (the time between full moons) is approximately 29.53 days.' },
  ];

  const relatedTools = [
    { name: 'Speed Converter', path: '/converters/speed-converter' },
    { name: 'Length Converter', path: '/converters/length-converter' },
    { name: 'Data Storage Converter', path: '/converters/data-storage-converter' },
  ];

  const conversionTable = [
    { label: '1 Nanosecond', value: '0.000000001 s' },
    { label: '1 Microsecond', value: '0.000001 s' },
    { label: '1 Millisecond', value: '0.001 s' },
    { label: '1 Second', value: '1 s' },
    { label: '1 Minute', value: '60 s' },
    { label: '1 Hour', value: '3,600 s' },
    { label: '1 Day', value: '86,400 s' },
    { label: '1 Week', value: '604,800 s' },
    { label: '1 Month', value: '2,629,800 s' },
    { label: '1 Year', value: '31,557,600 s' },
    { label: '1 Decade', value: '315,576,000 s' },
    { label: '1 Century', value: '3,155,760,000 s' },
  ];

  return (
    <ToolLayout
      title="Time Converter"
      description="Convert between nanoseconds, microseconds, milliseconds, seconds, minutes, hours, days, weeks, months, years, decades, and centuries."
      faq={faq}
      relatedTools={relatedTools}
      conversionTable={conversionTable}
    >
      <UniversalConverter
        title="Time"
        units={timeUnits}
        convert={convertTime}
        getFormula={getTimeFormula}
        defaultFrom="hour"
        defaultTo="minute"
      />
    </ToolLayout>
  );
}
