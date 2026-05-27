'use client';
import React, { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { differenceInDays, differenceInMonths, differenceInYears, parseISO } from 'date-fns';

function countWorkingDays(start: Date, end: Date, excludeEnd: boolean): number {
  let count = 0;
  const d = new Date(start);
  const endDate = excludeEnd ? new Date(end.getTime() - 86400000) : new Date(end);
  while (d <= endDate) {
    const day = d.getDay();
    if (day !== 0 && day !== 6) count++;
    d.setDate(d.getDate() + 1);
  }
  return count;
}

export default function DateDifferencePage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [excludeEnd, setExcludeEnd] = useState(false);

  const result = useMemo(() => {
    if (!startDate || !endDate) return null;
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    if (end < start) return null;
    const actualEnd = excludeEnd ? new Date(end.getTime() - 86400000) : end;
    const totalDays = differenceInDays(actualEnd, start) + 1;
    const years = differenceInYears(actualEnd, start);
    const months = differenceInMonths(actualEnd, start);
    const totalHours = totalDays * 24;
    const totalMinutes = totalDays * 1440;
    const totalWeeks = Math.floor(totalDays / 7);
    const workingDays = countWorkingDays(start, end, excludeEnd);
    return { totalDays, years, months, totalHours, totalMinutes, totalWeeks, workingDays };
  }, [startDate, endDate, excludeEnd]);

  const faq = [
    { question: 'How is the date difference calculated?', answer: 'The difference is calculated by subtracting the start date from the end date using date-fns library for precise results.' },
    { question: 'What are working days?', answer: 'Working days are Monday through Friday, excluding weekends (Saturday and Sunday).' },
  ];

  const relatedTools = [
    { name: 'Age Calculator', path: '/date-time-tools/age-calculator' },
    { name: 'Unix Timestamp', path: '/date-time-tools/unix-timestamp' },
    { name: 'World Clock', path: '/date-time-tools/world-clock' },
  ];

  return (
    <ToolLayout title="Date Difference" description="Calculate the exact difference between two dates in years, months, days, and more." faq={faq} relatedTools={relatedTools}>
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Start Date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <Input label="End Date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <label className="flex items-center gap-2 text-sm text-text-primary cursor-pointer">
          <input type="checkbox" checked={excludeEnd} onChange={(e) => setExcludeEnd(e.target.checked)} className="rounded border-border" />
          Exclude end date
        </label>

        {result && (
          <div className="mt-6 space-y-4">
            <Card hover={false} className="p-4">
              <h3 className="text-sm font-semibold text-text-primary mb-2">Difference</h3>
              <div className="grid grid-cols-3 gap-4 text-center mb-4">
                <div className="bg-background rounded-lg p-3"><div className="text-2xl font-bold text-primary">{result.years}</div><div className="text-xs text-text-secondary">Years</div></div>
                <div className="bg-background rounded-lg p-3"><div className="text-2xl font-bold text-primary">{result.months % 12}</div><div className="text-xs text-text-secondary">Months</div></div>
                <div className="bg-background rounded-lg p-3"><div className="text-2xl font-bold text-primary">{result.totalDays}</div><div className="text-xs text-text-secondary">Days</div></div>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-sm">
                <div className="bg-background rounded p-2"><div className="font-bold">{result.totalWeeks.toLocaleString()}</div><div className="text-xs text-text-secondary">Weeks</div></div>
                <div className="bg-background rounded p-2"><div className="font-bold">{result.totalHours.toLocaleString()}</div><div className="text-xs text-text-secondary">Hours</div></div>
                <div className="bg-background rounded p-2"><div className="font-bold">{result.totalMinutes.toLocaleString()}</div><div className="text-xs text-text-secondary">Minutes</div></div>
                <div className="bg-background rounded p-2"><div className="font-bold">{result.workingDays.toLocaleString()}</div><div className="text-xs text-text-secondary">Working Days</div></div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
