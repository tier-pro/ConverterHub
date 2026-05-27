'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Repeat, RefreshCw, AlertCircle } from 'lucide-react';

const API_BASE = 'https://api.frankfurter.dev/v2';

const FALLBACK_CURRENCIES: Record<string, string> = {
  USD: 'US Dollar', EUR: 'Euro', GBP: 'British Pound', JPY: 'Japanese Yen',
  AUD: 'Australian Dollar', CAD: 'Canadian Dollar', CHF: 'Swiss Franc',
  CNY: 'Chinese Yuan', INR: 'Indian Rupee',
};

const FALLBACK_RATES: Record<string, number> = {
  USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.5, AUD: 1.54, CAD: 1.36, CHF: 0.88, CNY: 7.24, INR: 83.1,
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$', EUR: '€', GBP: '£', JPY: '¥', AUD: 'A$', CAD: 'C$',
  CHF: 'Fr', CNY: '¥', INR: '₹', KRW: '₩', MXN: 'Mex$', BRL: 'R$',
  SEK: 'kr', NOK: 'kr', DKK: 'kr', PLN: 'zł', TRY: '₺', RUB: '₽',
  ZAR: 'R', HKD: 'HK$', SGD: 'S$', NZD: 'NZ$', THB: '฿', MYR: 'RM',
  PHP: '₱', IDR: 'Rp', VND: '₫', CZK: 'Kč', HUF: 'Ft', ILS: '₪',
  CLP: 'CLP$', AED: 'د.إ', SAR: '﷼',
};

export default function CurrencyConverterPage() {
  const [amount, setAmount] = useState('1');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('EUR');
  const [currencies, setCurrencies] = useState<Record<string, string>>(FALLBACK_CURRENCIES);
  const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchRates = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [currenciesRes, ratesRes] = await Promise.all([
        fetch(`${API_BASE}/currencies`),
        fetch(`${API_BASE}/rates?base=USD`),
      ]);
      if (!currenciesRes.ok || !ratesRes.ok) throw new Error('Failed to fetch');
      const currenciesArr: { iso_code: string; name: string }[] = await currenciesRes.json();
      const ratesArr: { date: string; base: string; quote: string; rate: number }[] = await ratesRes.json();
      const currenciesMap: Record<string, string> = {};
      for (const c of currenciesArr) currenciesMap[c.iso_code] = c.name;
      const ratesMap: Record<string, number> = { USD: 1 };
      let latestDate = '';
      for (const r of ratesArr) {
        ratesMap[r.quote] = r.rate;
        if (r.date > latestDate) latestDate = r.date;
      }
      setCurrencies(currenciesMap);
      setRates(ratesMap);
      setLastUpdated(latestDate);
    } catch {
      setError('Could not fetch live rates. Using fallback.');
      setCurrencies(FALLBACK_CURRENCIES);
      setRates(FALLBACK_RATES);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchRates(); }, [fetchRates]);

  const currencyOptions = useMemo(() =>
    Object.entries(currencies)
      .map(([code, name]) => ({ value: code, label: `${code} - ${name}` }))
      .sort((a, b) => a.value.localeCompare(b.value)),
  [currencies]);

  const result = useMemo(() => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) return null;
    const inUSD = amt / rates[from];
    const converted = inUSD * rates[to];
    return { converted, rate: rates[to] / rates[from] };
  }, [amount, from, to, rates]);

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const getSymbol = (code: string) => CURRENCY_SYMBOLS[code] || code + ' ';

  const faq = [
    { question: 'How accurate are the exchange rates?', answer: 'Rates are sourced from the European Central Bank and 55+ central banks via the Frankfurter API, updated daily on business days.' },
    { question: 'How is the conversion calculated?', answer: 'Amount is converted to USD (base), then to the target currency using the live exchange rate.' },
    { question: 'How often are rates updated?', answer: 'The Frankfurter API updates rates every business day from central bank data.' },
  ];

  const relatedTools = [
    { name: 'Percentage Calculator', path: '/financial-tools/percentage-calculator' },
    { name: 'Discount Calculator', path: '/financial-tools/discount-calculator' },
    { name: 'Loan Calculator', path: '/financial-tools/loan-calculator' },
  ];

  return (
    <ToolLayout title="Currency Converter" description="Convert between 200+ world currencies using live exchange rates from the European Central Bank." faq={faq} relatedTools={relatedTools}>
      <div className="space-y-4">
        <Input label="Amount" type="number" placeholder="1.00" value={amount} onChange={(e) => setAmount(e.target.value)} />

        <div className="flex items-center gap-2 text-xs text-text-secondary">
          {loading ? (
            <RefreshCw className="w-3 h-3 animate-spin" />
          ) : (
            <RefreshCw className="w-3 h-3" />
          )}
          {lastUpdated ? `Rates as of ${lastUpdated}` : loading ? 'Loading...' : ''}
          {!loading && <Button size="sm" variant="ghost" onClick={fetchRates} className="p-1 h-auto"><RefreshCw className="w-3 h-3" /></Button>}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-xs text-warning">
            <AlertCircle className="w-3 h-3" />
            {error}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-[1fr,auto,1fr] items-end">
          <Select label="From" options={currencyOptions} value={from} onChange={(e) => setFrom(e.target.value)} />
          <Button variant="ghost" size="sm" onClick={handleSwap} className="mb-1.5 self-end">
            <Repeat className="w-5 h-5" />
          </Button>
          <Select label="To" options={currencyOptions} value={to} onChange={(e) => setTo(e.target.value)} />
        </div>

        {result && (
          <Card hover={false} className="p-4">
            <div className="text-center">
              <p className="text-sm text-text-secondary">
                {getSymbol(from)}{parseFloat(amount).toFixed(2)} {from} =
              </p>
              <p className="text-3xl font-bold text-primary mt-1">
                {getSymbol(to)}{result.converted.toFixed(2)} {to}
              </p>
              <p className="text-xs text-text-secondary mt-2">
                1 {from} = {result.rate.toFixed(4)} {to} • 1 {to} = {(1 / result.rate).toFixed(4)} {from}
              </p>
            </div>
          </Card>
        )}
      </div>
    </ToolLayout>
  );
}
