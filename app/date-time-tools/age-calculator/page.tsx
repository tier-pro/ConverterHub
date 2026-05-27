'use client';
import React, { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { differenceInDays, differenceInMonths, differenceInYears, format, addDays, parseISO } from 'date-fns';

const zodiacSigns = [
  { name: 'Capricorn', start: '01-01', end: '01-19' }, { name: 'Aquarius', start: '01-20', end: '02-18' },
  { name: 'Pisces', start: '02-19', end: '03-20' }, { name: 'Aries', start: '03-21', end: '04-19' },
  { name: 'Taurus', start: '04-20', end: '05-20' }, { name: 'Gemini', start: '05-21', end: '06-20' },
  { name: 'Cancer', start: '06-21', end: '07-22' }, { name: 'Leo', start: '07-23', end: '08-22' },
  { name: 'Virgo', start: '08-23', end: '09-22' }, { name: 'Libra', start: '09-23', end: '10-22' },
  { name: 'Scorpio', start: '10-23', end: '11-21' }, { name: 'Sagittarius', start: '11-22', end: '12-21' },
  { name: 'Capricorn', start: '12-22', end: '12-31' },
];

const chineseZodiac = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];

function getZodiac(date: Date): string {
  const mmdd = format(date, 'MM-dd');
  for (const s of zodiacSigns) {
    if (mmdd >= s.start && mmdd <= s.end) return s.name;
  }
  return 'Unknown';
}

function getChineseZodiac(year: number): string {
  return chineseZodiac[(year - 4) % 12];
}

function daysUntilNextBirthday(dob: Date): number {
  const now = new Date();
  const currentYear = now.getFullYear();
  let nextBirthday = new Date(currentYear, dob.getMonth(), dob.getDate());
  if (nextBirthday < now) nextBirthday = new Date(currentYear + 1, dob.getMonth(), dob.getDate());
  return differenceInDays(nextBirthday, now);
}

function getDayOfWeek(date: Date): string {
  return format(date, 'EEEE');
}

export default function AgeCalculatorPage() {
  const [dob, setDob] = useState('');
  const [calculated, setCalculated] = useState(false);

  const result = useMemo(() => {
    if (!dob) return null;
    const birthDate = parseISO(dob);
    const now = new Date();
    const years = differenceInYears(now, birthDate);
    const months = differenceInMonths(now, birthDate);
    const days = differenceInDays(now, birthDate);
    const totalMonths = years * 12 + (differenceInMonths(now, addDays(birthDate, years * 365)) % 12);
    return { years, months, totalMonths, totalWeeks: Math.floor(days / 7), totalDays: days, totalHours: days * 24, totalMinutes: days * 1440, birthDate, nextBirthdayDays: daysUntilNextBirthday(birthDate), dayOfWeek: getDayOfWeek(birthDate), zodiac: getZodiac(birthDate), chineseZodiac: getChineseZodiac(birthDate.getFullYear()) };
  }, [dob, calculated]);

  const handleCalculate = () => setCalculated((prev) => !prev);

  const faq = [
    { question: 'How is the exact age calculated?', answer: 'The exact age is calculated by comparing the date of birth to the current date using date-fns library functions for precise year, month, and day differences.' },
    { question: 'How accurate is the next birthday countdown?', answer: 'The countdown shows the exact number of days until your next birthday based on the current date.' },
  ];

  const relatedTools = [
    { name: 'Date Difference', path: '/date-time-tools/date-difference' },
    { name: 'Unix Timestamp', path: '/date-time-tools/unix-timestamp' },
    { name: 'World Clock', path: '/date-time-tools/world-clock' },
  ];

  return (
    <ToolLayout title="Age Calculator" description="Calculate your exact age in years, months, and days with additional details like zodiac sign and next birthday countdown." faq={faq} relatedTools={relatedTools}>
      <div className="space-y-4">
        <Input label="Date of Birth" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
        <Button onClick={handleCalculate}>Calculate Age</Button>

        {result && (
          <div className="mt-6 space-y-4">
            <Card hover={false} className="p-4">
              <h3 className="text-lg font-semibold text-text-primary mb-3">Exact Age</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-background rounded-lg p-3"><div className="text-2xl font-bold text-primary">{result.years}</div><div className="text-xs text-text-secondary">Years</div></div>
                <div className="bg-background rounded-lg p-3"><div className="text-2xl font-bold text-primary">{result.months % 12}</div><div className="text-xs text-text-secondary">Months</div></div>
                <div className="bg-background rounded-lg p-3"><div className="text-2xl font-bold text-primary">{Math.abs(differenceInDays(new Date(), addDays(new Date(new Date().getFullYear(), result.birthDate.getMonth(), result.birthDate.getDate()), -result.years * 365)))}</div><div className="text-xs text-text-secondary">Days</div></div>
              </div>
            </Card>

            <Card hover={false} className="p-4">
              <h3 className="text-sm font-semibold text-text-primary mb-2">Total Duration</h3>
              <div className="grid grid-cols-5 gap-2 text-center text-sm">
                <div className="bg-background rounded p-2"><div className="font-bold">{result.totalMonths}</div><div className="text-xs text-text-secondary">Months</div></div>
                <div className="bg-background rounded p-2"><div className="font-bold">{result.totalWeeks.toLocaleString()}</div><div className="text-xs text-text-secondary">Weeks</div></div>
                <div className="bg-background rounded p-2"><div className="font-bold">{result.totalDays.toLocaleString()}</div><div className="text-xs text-text-secondary">Days</div></div>
                <div className="bg-background rounded p-2"><div className="font-bold">{result.totalHours.toLocaleString()}</div><div className="text-xs text-text-secondary">Hours</div></div>
                <div className="bg-background rounded p-2"><div className="font-bold">{result.totalMinutes.toLocaleString()}</div><div className="text-xs text-text-secondary">Minutes</div></div>
              </div>
            </Card>

            <Card hover={false} className="p-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div><span className="text-text-secondary">Next Birthday: </span><span className="font-semibold text-text-primary">{result.nextBirthdayDays} days</span></div>
                <div><span className="text-text-secondary">Born on: </span><span className="font-semibold text-text-primary">{result.dayOfWeek}</span></div>
                <div><span className="text-text-secondary">Zodiac: </span><span className="font-semibold text-text-primary">{result.zodiac}</span></div>
                <div><span className="text-text-secondary">Chinese Zodiac: </span><span className="font-semibold text-text-primary">{result.chineseZodiac}</span></div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
