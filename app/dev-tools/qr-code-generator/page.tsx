'use client';
import React, { useState, useCallback } from 'react';
import QRCode from 'qrcode';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { downloadFile } from '@/lib/utils/helpers';
import { QrCode, Download, Copy } from 'lucide-react';

const inputTypes = [
  { value: 'text', label: 'Text' },
  { value: 'url', label: 'URL' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'sms', label: 'SMS' },
  { value: 'vcard', label: 'vCard' },
];

const errorLevels = [
  { value: 'L', label: 'L (7%)' },
  { value: 'M', label: 'M (15%)' },
  { value: 'Q', label: 'Q (25%)' },
  { value: 'H', label: 'H (30%)' },
];

export default function QrCodeGeneratorPage() {
  const [inputType, setInputType] = useState('text');
  const [content, setContent] = useState('');
  const [size, setSize] = useState(256);
  const [errorLevel, setErrorLevel] = useState('M');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [vcard, setVcard] = useState({ firstName: '', lastName: '', phone: '', email: '', org: '', title: '', url: '' });
  const [copied, copy] = useCopyToClipboard();

  const buildContent = useCallback(() => {
    switch (inputType) {
      case 'url': return content;
      case 'email': return `mailto:${content}`;
      case 'phone': return `tel:${content}`;
      case 'sms': return `SMSTO:${content}`;
      case 'vcard': {
        const v = vcard;
        return `BEGIN:VCARD
VERSION:3.0
FN:${v.firstName} ${v.lastName}
N:${v.lastName};${v.firstName};;;
TEL:${v.phone}
EMAIL:${v.email}
ORG:${v.org}
TITLE:${v.title}
URL:${v.url}
END:VCARD`;
      }
      default: return content;
    }
  }, [inputType, content, vcard]);

  const generate = useCallback(async () => {
    const text = buildContent();
    if (!text.trim()) return;
    try {
      const url = await QRCode.toDataURL(text, {
        width: size,
        margin: 2,
        color: { dark: fgColor, light: bgColor },
        errorCorrectionLevel: errorLevel as 'L' | 'M' | 'Q' | 'H',
      });
      setQrDataUrl(url);
    } catch { /* ignore */ }
  }, [buildContent, size, fgColor, bgColor, errorLevel]);

  const downloadQR = () => {
    if (qrDataUrl) {
      downloadFile(qrDataUrl, 'qrcode.png', 'image/png');
    }
  };

  return (
    <ToolLayout
      title="QR Code Generator"
      description="Generate custom QR codes for text, URLs, emails, phone numbers, SMS, and vCards. Customize size, colors, and error correction."
      faq={[
        { question: 'What is a QR Code?', answer: 'QR (Quick Response) codes are two-dimensional barcodes that can be scanned by smartphones to quickly access information like URLs, text, or contact details.' },
        { question: 'What is error correction?', answer: 'Error correction allows QR codes to be read even if partially damaged. L (7%) recovers 7% damage, M (15%), Q (25%), H (30%). Higher levels mean more data redundancy.' },
      ]}
      relatedTools={[
        { name: 'Base64 Encoder', path: '/dev-tools/base64-encoder' },
        { name: 'Password Generator', path: '/dev-tools/password-generator' },
        { name: 'Hash Generator', path: '/dev-tools/hash-generator' },
      ]}
    >
      <div className="space-y-4">
        <Select
          label="Input Type"
          value={inputType}
          onChange={(e) => setInputType(e.target.value)}
          options={inputTypes}
        />

        {inputType !== 'vcard' && (
          <Input
            label={inputType === 'url' ? 'URL' : inputType === 'email' ? 'Email Address' : inputType === 'phone' ? 'Phone Number' : inputType === 'sms' ? 'Phone Number' : 'Text Content'}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`Enter ${inputType}...`}
          />
        )}

        {inputType === 'vcard' && (
          <div className="grid grid-cols-2 gap-3">
            <Input label="First Name" value={vcard.firstName} onChange={(e) => setVcard({ ...vcard, firstName: e.target.value })} />
            <Input label="Last Name" value={vcard.lastName} onChange={(e) => setVcard({ ...vcard, lastName: e.target.value })} />
            <Input label="Phone" value={vcard.phone} onChange={(e) => setVcard({ ...vcard, phone: e.target.value })} />
            <Input label="Email" value={vcard.email} onChange={(e) => setVcard({ ...vcard, email: e.target.value })} />
            <Input label="Organization" value={vcard.org} onChange={(e) => setVcard({ ...vcard, org: e.target.value })} />
            <Input label="Title" value={vcard.title} onChange={(e) => setVcard({ ...vcard, title: e.target.value })} />
            <Input label="URL" value={vcard.url} onChange={(e) => setVcard({ ...vcard, url: e.target.value })} className="col-span-2" />
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="label-text">Size: {size}px</label>
            <input type="range" min={128} max={1024} step={16} value={size} onChange={(e) => setSize(parseInt(e.target.value))} className="w-full accent-primary" />
          </div>
          <Select label="Error Correction" value={errorLevel} onChange={(e) => setErrorLevel(e.target.value)} options={errorLevels} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="label-text">Foreground Color</label>
            <div className="flex items-center gap-2">
              <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-10 h-10 rounded border border-border cursor-pointer" />
              <span className="text-sm font-mono text-text-secondary">{fgColor}</span>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="label-text">Background Color</label>
            <div className="flex items-center gap-2">
              <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-10 h-10 rounded border border-border cursor-pointer" />
              <span className="text-sm font-mono text-text-secondary">{bgColor}</span>
            </div>
          </div>
        </div>

        <Button onClick={generate} className="w-full">
          <QrCode className="w-4 h-4" />Generate QR Code
        </Button>

        {qrDataUrl && (
          <div className="space-y-3">
            <div className="flex justify-center p-4 bg-white rounded-lg border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrDataUrl} alt="QR Code" style={{ width: size, height: size, maxWidth: '100%' }} />
            </div>
            <div className="flex gap-2 justify-center">
              <Button variant="secondary" onClick={downloadQR}>
                <Download className="w-4 h-4" />Download PNG
              </Button>
              <Button variant="secondary" onClick={() => copy(qrDataUrl)}>
                <Copy className="w-4 h-4" />{copied ? 'Copied!' : 'Copy Data URL'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
