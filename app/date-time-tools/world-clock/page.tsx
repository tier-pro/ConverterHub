'use client';
import React, { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

interface City { name: string; offset: number; dst: boolean; country: string; }

const cities: City[] = [
  { name: 'New York', offset: -5, dst: true, country: 'US' },
  { name: 'London', offset: 0, dst: true, country: 'UK' },
  { name: 'Paris', offset: 1, dst: true, country: 'France' },
  { name: 'Dubai', offset: 4, dst: false, country: 'UAE' },
  { name: 'Tokyo', offset: 9, dst: false, country: 'Japan' },
  { name: 'Shanghai', offset: 8, dst: false, country: 'China' },
  { name: 'Sydney', offset: 11, dst: true, country: 'Australia' },
  { name: 'Los Angeles', offset: -8, dst: true, country: 'US' },
  { name: 'Chicago', offset: -6, dst: true, country: 'US' },
  { name: 'Toronto', offset: -5, dst: true, country: 'Canada' },
  { name: 'Singapore', offset: 8, dst: false, country: 'Singapore' },
  { name: 'Mumbai', offset: 5.5, dst: false, country: 'India' },
  { name: 'Berlin', offset: 1, dst: true, country: 'Germany' },
  { name: 'Moscow', offset: 3, dst: false, country: 'Russia' },
  { name: 'São Paulo', offset: -3, dst: true, country: 'Brazil' },
];

function isDST(): boolean {
  const now = new Date();
  const month = now.getMonth();
  return month >= 2 && month <= 9;
}

function getCityTime(city: City): string {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const dstOffset = city.dst && isDST() ? 1 : 0;
  const cityTime = new Date(utc + (city.offset + dstOffset) * 3600000);
  return cityTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
}

function getCityDate(city: City): string {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const dstOffset = city.dst && isDST() ? 1 : 0;
  const cityTime = new Date(utc + (city.offset + dstOffset) * 3600000);
  return cityTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function WorldClockPage() {
  const [time, setTime] = useState(Date.now());
  const [sourceCity, setSourceCity] = useState('New York');
  const [targetCity, setTargetCity] = useState('London');
  const [convertTime, setConvertTime] = useState('');
  const [converted, setConverted] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleConvert = () => {
    if (!convertTime) return;
    const src = cities.find((c) => c.name === sourceCity)!;
    const tgt = cities.find((c) => c.name === targetCity)!;
    const srcDst = src.dst && isDST() ? 1 : 0;
    const tgtDst = tgt.dst && isDST() ? 1 : 0;
    const diff = (tgt.offset + tgtDst) - (src.offset + srcDst);
    const [hours, minutes] = convertTime.split(':').map(Number);
    let newH = hours + diff;
    let newM = minutes;
    if (newH < 0) newH += 24;
    if (newH >= 24) newH -= 24;
    setConverted(`${String(Math.floor(newH)).padStart(2, '0')}:${String(newM).padStart(2, '0')}`);
  };

  const cityOptions = cities.map((c) => ({ value: c.name, label: `${c.name} (${c.country})` }));

  const faq = [
    { question: 'How are time zones calculated?', answer: 'Each city has a fixed UTC offset, and Daylight Saving Time (DST) is applied for cities in the Northern hemisphere between March and October.' },
    { question: 'What is DST?', answer: 'Daylight Saving Time advances clocks by 1 hour during warmer months to extend evening daylight.' },
  ];

  const relatedTools = [
    { name: 'Age Calculator', path: '/date-time-tools/age-calculator' },
    { name: 'Date Difference', path: '/date-time-tools/date-difference' },
    { name: 'Unix Timestamp', path: '/date-time-tools/unix-timestamp' },
  ];

  const dstActive = isDST();

  return (
    <ToolLayout title="World Clock" description="View current times across 15 major cities and convert times between time zones." faq={faq} relatedTools={relatedTools}>
      <div className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((city) => (
            <Card key={city.name} hover={false} className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-text-primary">{city.name}</h3>
                  <p className="text-xs text-text-secondary">{city.country} • UTC{city.offset >= 0 ? '+' : ''}{city.offset}</p>
                </div>
                {city.dst && <span className={`text-[10px] px-1.5 py-0.5 rounded ${dstActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-slate-400'}`}>{dstActive ? 'DST' : 'No DST'}</span>}
              </div>
              <p className="text-lg font-mono font-bold text-primary mt-1">{getCityTime(city)}</p>
              <p className="text-[11px] text-text-secondary">{getCityDate(city)}</p>
            </Card>
          ))}
        </div>

        <Card hover={false} className="p-4">
          <h3 className="text-sm font-semibold text-text-primary mb-3">Time Zone Converter</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <Select label="From" options={cityOptions} value={sourceCity} onChange={(e) => setSourceCity(e.target.value)} />
            <Select label="To" options={cityOptions} value={targetCity} onChange={(e) => setTargetCity(e.target.value)} />
          </div>
          <div className="mt-3 flex gap-3 items-end">
            <Input label="Time (HH:MM)" type="time" value={convertTime} onChange={(e) => setConvertTime(e.target.value)} />
            <Button onClick={handleConvert}>Convert</Button>
          </div>
          {converted && (
            <div className="mt-3 p-3 bg-background rounded-lg text-center">
              <span className="text-text-secondary text-sm">{sourceCity} time </span>
              <span className="font-bold text-primary">{convertTime}</span>
              <span className="text-text-secondary text-sm"> = </span>
              <span className="font-bold text-primary">{targetCity} time </span>
              <span className="font-bold text-primary">{converted}</span>
            </div>
          )}
        </Card>
      </div>
    </ToolLayout>
  );
}
