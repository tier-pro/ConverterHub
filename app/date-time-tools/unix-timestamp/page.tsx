'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

function getRelativeTime(ts: number): string {
  const now = Date.now();
  const diff = now - ts;
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} months ago`;
  const years = Math.floor(days / 365);
  return `${years} years ago`;
}

function formatDate(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
}

export default function UnixTimestampPage() {
  const [currentTimestamp, setCurrentTimestamp] = useState(Date.now());
  const [tsInput, setTsInput] = useState('');
  const [milliseconds, setMilliseconds] = useState(false);
  const [datePicker, setDatePicker] = useState('');

  useEffect(() => {
    const interval = setInterval(() => setCurrentTimestamp(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const tsDate = useMemo(() => {
    if (!tsInput) return null;
    const ts = parseInt(tsInput, 10);
    if (isNaN(ts)) return null;
    const ms = milliseconds ? ts : ts * 1000;
    return { date: formatDate(ms), relative: getRelativeTime(ms), iso: new Date(ms).toISOString() };
  }, [tsInput, milliseconds]);

  const dateToTs = useMemo(() => {
    if (!datePicker) return null;
    const d = new Date(datePicker);
    if (isNaN(d.getTime())) return null;
    return { seconds: Math.floor(d.getTime() / 1000), milliseconds: d.getTime() };
  }, [datePicker]);

  const faq = [
    { question: 'What is a Unix timestamp?', answer: 'A Unix timestamp is the number of seconds (or milliseconds) that have elapsed since January 1, 1970 (UTC).' },
    { question: 'Why use milliseconds?', answer: 'Some systems use milliseconds for higher precision timestamps. JavaScript Date.now() returns milliseconds.' },
  ];

  const relatedTools = [
    { name: 'Age Calculator', path: '/date-time-tools/age-calculator' },
    { name: 'Date Difference', path: '/date-time-tools/date-difference' },
    { name: 'World Clock', path: '/date-time-tools/world-clock' },
  ];

  return (
    <ToolLayout title="Unix Timestamp Converter" description="Convert between Unix timestamps and human-readable dates with relative time display." faq={faq} relatedTools={relatedTools}>
      <div className="space-y-6">
        <Card hover={false} className="p-4">
          <h3 className="text-sm font-semibold text-text-primary mb-2">Current Timestamp</h3>
          <p className="text-xl font-mono font-bold text-primary">{currentTimestamp}</p>
          <p className="text-sm text-text-secondary mt-1">{formatDate(currentTimestamp)}</p>
        </Card>

        <Card hover={false} className="p-4">
          <h3 className="text-sm font-semibold text-text-primary mb-3">Timestamp to Date</h3>
          <Input label="Unix Timestamp" type="number" placeholder="1716500000" value={tsInput} onChange={(e) => setTsInput(e.target.value)} />
          <label className="flex items-center gap-2 mt-2 text-sm text-text-primary cursor-pointer">
            <input type="checkbox" checked={milliseconds} onChange={(e) => setMilliseconds(e.target.checked)} className="rounded border-border" />
            Input is in milliseconds
          </label>
          {tsDate && (
            <div className="mt-3 p-3 bg-background rounded-lg space-y-1 text-sm">
              <p><span className="text-text-secondary">Date: </span><span className="font-semibold text-text-primary">{tsDate.date}</span></p>
              <p><span className="text-text-secondary">ISO: </span><span className="font-mono text-text-primary">{tsDate.iso}</span></p>
              <p><span className="text-text-secondary">Relative: </span><span className="font-semibold text-text-primary">{tsDate.relative}</span></p>
            </div>
          )}
        </Card>

        <Card hover={false} className="p-4">
          <h3 className="text-sm font-semibold text-text-primary mb-3">Date to Timestamp</h3>
          <Input label="Select Date & Time" type="datetime-local" value={datePicker} onChange={(e) => setDatePicker(e.target.value)} />
          {dateToTs && (
            <div className="mt-3 p-3 bg-background rounded-lg space-y-1 text-sm">
              <p><span className="text-text-secondary">Seconds: </span><span className="font-mono font-bold text-text-primary">{dateToTs.seconds}</span></p>
              <p><span className="text-text-secondary">Milliseconds: </span><span className="font-mono font-bold text-text-primary">{dateToTs.milliseconds}</span></p>
            </div>
          )}
        </Card>
      </div>
    </ToolLayout>
  );
}
