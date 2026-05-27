'use client';
import React, { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Trash2, Download, FileText, AlertCircle } from 'lucide-react';

interface LineItem {
  description: string;
  qty: number;
  rate: number;
}

const emptyItem: LineItem = { description: '', qty: 1, rate: 0 };

export default function InvoiceGeneratorClient() {
  const [companyName, setCompanyName] = useState('Your Company');
  const [clientName, setClientName] = useState('Client Name');
  const [clientAddress, setClientAddress] = useState('');
  const [invoiceNum, setInvoiceNum] = useState('INV-001');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [taxRate, setTaxRate] = useState('0');
  const [currency, setCurrency] = useState('USD');
  const [items, setItems] = useState<LineItem[]>([{ ...emptyItem }]);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const updateItem = (i: number, field: keyof LineItem, value: string) => {
    const updated = items.map((item, idx) =>
      idx === i ? { ...item, [field]: field === 'description' ? value : Number(value) || 0 } : item
    );
    setItems(updated);
  };

  const addItem = () => setItems([...items, { ...emptyItem }]);
  const removeItem = (i: number) => items.length > 1 && setItems(items.filter((_, idx) => idx !== i));

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.qty * item.rate, 0), [items]);
  const tax = useMemo(() => subtotal * (Number(taxRate) / 100), [subtotal, taxRate]);
  const total = useMemo(() => subtotal + tax, [subtotal, tax]);

  const generatePdf = async () => {
    if (!items.some(i => i.description.trim() && i.qty > 0 && i.rate > 0)) {
      setError('Add at least one item with description, quantity, and rate.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib');
      const doc = await PDFDocument.create();
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const bold = await doc.embedFont(StandardFonts.HelveticaBold);
      const page = doc.addPage([612, 792]);
      const { width, height } = page.getSize();
      const gray = rgb(0.4, 0.4, 0.4);
      const black = rgb(0, 0, 0);
      const blue = rgb(0.23, 0.51, 0.96);
      let y = height - 50;

      page.drawText('INVOICE', { x: 50, y, size: 28, font: bold, color: blue });
      y -= 14;
      page.drawText(`#${invoiceNum}`, { x: 50, y, size: 12, font, color: gray });
      page.drawText(`Date: ${date}`, { x: width - 150, y, size: 10, font, color: gray });

      y -= 30;
      page.drawLine({ start: { x: 50, y }, end: { x: width - 50, y }, thickness: 1, color: rgb(0.9, 0.9, 0.9) });

      y -= 20;
      page.drawText('From:', { x: 50, y, size: 10, font: bold, color: gray });
      page.drawText(companyName, { x: 50, y: y - 14, size: 12, font: bold, color: black });
      y -= 50;
      page.drawText('Bill To:', { x: 50, y, size: 10, font: bold, color: gray });
      page.drawText(clientName, { x: 50, y: y - 14, size: 12, font: bold, color: black });
      if (clientAddress) page.drawText(clientAddress, { x: 50, y: y - 28, size: 10, font, color: gray });

      y = y - 60;
      page.drawLine({ start: { x: 50, y }, end: { x: width - 50, y }, thickness: 1, color: rgb(0.9, 0.9, 0.9) });

      y -= 16;
      page.drawText('Description', { x: 50, y, size: 10, font: bold, color: blue });
      page.drawText('Qty', { x: 380, y, size: 10, font: bold, color: blue });
      page.drawText('Rate', { x: 440, y, size: 10, font: bold, color: blue });
      page.drawText('Amount', { x: 510, y, size: 10, font: bold, color: blue });

      y -= 8;
      page.drawLine({ start: { x: 50, y }, end: { x: width - 50, y }, thickness: 0.5, color: rgb(0.9, 0.9, 0.9) });

      for (const item of items) {
        y -= 18;
        const desc = item.description.length > 40 ? item.description.slice(0, 37) + '...' : item.description;
        page.drawText(desc, { x: 50, y, size: 10, font, color: black });
        page.drawText(String(item.qty), { x: 380, y, size: 10, font, color: black });
        page.drawText(`${currency} ${item.rate.toFixed(2)}`, { x: 440, y, size: 10, font, color: black });
        page.drawText(`${currency} ${(item.qty * item.rate).toFixed(2)}`, { x: 510, y, size: 10, font, color: black });
      }

      y -= 24;
      page.drawLine({ start: { x: 320, y }, end: { x: width - 50, y }, thickness: 1, color: rgb(0.9, 0.9, 0.9) });

      y -= 16;
      page.drawText('Subtotal:', { x: 380, y, size: 10, font, color: gray });
      page.drawText(`${currency} ${subtotal.toFixed(2)}`, { x: 510, y, size: 10, font, color: black });

      if (Number(taxRate) > 0) {
        y -= 16;
        page.drawText(`Tax (${taxRate}%):`, { x: 380, y, size: 10, font, color: gray });
        page.drawText(`${currency} ${tax.toFixed(2)}`, { x: 510, y, size: 10, font, color: black });
      }

      y -= 18;
      page.drawText('Total:', { x: 380, y, size: 14, font: bold, color: black });
      page.drawText(`${currency} ${total.toFixed(2)}`, { x: 510, y, size: 14, font: bold, color: black });

      if (notes) {
        y -= 30;
        page.drawText('Notes:', { x: 50, y, size: 10, font: bold, color: gray });
        page.drawText(notes, { x: 50, y: y - 14, size: 10, font, color: gray });
      }

      const pdfBytes = await doc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `Invoice-${invoiceNum}.pdf`;
      a.click();
    } catch {
      setError('Failed to generate invoice.');
    }
    setLoading(false);
  };

  const faq = [
    { question: 'Is this legally binding?', answer: 'This tool generates a professional-looking invoice but does not replace accounting software. Verify with your local tax authority.' },
    { question: 'Can I add a logo?', answer: 'Logo support is not available yet. You can add your company name in the Company field.' },
    { question: 'Are my details saved?', answer: 'No data is stored or sent anywhere. Everything is processed locally in your browser.' },
  ];

  const relatedTools = [
    { name: 'Percentage Calculator', path: '/financial-tools/percentage-calculator' },
    { name: 'Discount Calculator', path: '/financial-tools/discount-calculator' },
    { name: 'Loan Calculator', path: '/financial-tools/loan-calculator' },
  ];

  return (
    <ToolLayout title="Invoice Generator" description="Create professional invoices with line items, tax, and totals — download as PDF. Free, private, no signup." faq={faq} relatedTools={relatedTools}>
      <div className="space-y-6 max-w-2xl">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          <Input label="Invoice Number" value={invoiceNum} onChange={(e) => setInvoiceNum(e.target.value)} />
          <Input label="Client Name" value={clientName} onChange={(e) => setClientName(e.target.value)} />
          <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <Input label="Client Address" value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} />
          <div className="grid grid-cols-2 gap-2">
            <Input label="Tax Rate (%)" type="number" min="0" max="100" step="0.5" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} />
            <Input label="Currency" value={currency} onChange={(e) => setCurrency(e.target.value)} />
          </div>
        </div>

        <Card hover={false} className="p-4">
          <h3 className="text-sm font-semibold text-text-primary mb-3">Line Items</h3>
          <div className="space-y-3">
            {items.map((item, i) => (
              <div key={i} className="flex gap-2 items-end">
                <div className="flex-1">
                  <label className="label-text text-xs">Description</label>
                  <input className="input-field text-sm" value={item.description} onChange={(e) => updateItem(i, 'description', e.target.value)} placeholder="Item description" />
                </div>
                <div className="w-20">
                  <label className="label-text text-xs">Qty</label>
                  <input className="input-field text-sm" type="number" min="1" value={item.qty} onChange={(e) => updateItem(i, 'qty', e.target.value)} />
                </div>
                <div className="w-24">
                  <label className="label-text text-xs">Rate</label>
                  <input className="input-field text-sm" type="number" min="0" step="0.01" value={item.rate} onChange={(e) => updateItem(i, 'rate', e.target.value)} />
                </div>
                <div className="text-sm font-medium text-text-primary w-20 pb-2.5 text-right">{currency} {(item.qty * item.rate).toFixed(2)}</div>
                <Button size="sm" variant="ghost" onClick={() => removeItem(i)} className="mb-1"><Trash2 className="w-4 h-4 text-error" /></Button>
              </div>
            ))}
          </div>
          <Button size="sm" variant="secondary" onClick={addItem} className="mt-3"><Plus className="w-4 h-4" /> Add Item</Button>
        </Card>

        <div>
          <label className="label-text">Notes (optional)</label>
          <textarea className="input-field w-full mt-1" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Payment terms, thanks, etc." />
        </div>

        <Card hover={false} className="p-4 bg-primary/5 border-primary/20">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-text-secondary">Subtotal: {currency} {subtotal.toFixed(2)}</p>
              {Number(taxRate) > 0 && <p className="text-sm text-text-secondary">Tax ({taxRate}%): {currency} {tax.toFixed(2)}</p>}
              <p className="text-lg font-bold text-text-primary mt-1">Total: {currency} {total.toFixed(2)}</p>
            </div>
            <Button onClick={generatePdf} loading={loading}><Download className="w-4 h-4" /> Download PDF</Button>
          </div>
        </Card>

        {error && <div className="flex items-center gap-2 text-sm text-error bg-error/10 rounded-lg p-3"><AlertCircle className="w-4 h-4" />{error}</div>}
      </div>
    </ToolLayout>
  );
}
