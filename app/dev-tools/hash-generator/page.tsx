'use client';
import React, { useState, useMemo } from 'react';
import CryptoJS from 'crypto-js';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { Copy, Hash, Key } from 'lucide-react';

const hashAlgorithms = [
  { id: 'MD5', fn: (t: string) => CryptoJS.MD5(t).toString() },
  { id: 'SHA-1', fn: (t: string) => CryptoJS.SHA1(t).toString() },
  { id: 'SHA-256', fn: (t: string) => CryptoJS.SHA256(t).toString() },
  { id: 'SHA-512', fn: (t: string) => CryptoJS.SHA512(t).toString() },
  { id: 'RIPEMD-160', fn: (t: string) => CryptoJS.RIPEMD160(t).toString() },
];

export default function HashGeneratorPage() {
  const [input, setInput] = useState('');
  const [hmacKey, setHmacKey] = useState('');
  const [hmacMode, setHmacMode] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const results = useMemo(() => {
    if (!input) return [];
    return hashAlgorithms.map((algo) => {
      const text = hmacMode && hmacKey ? CryptoJS.HmacMD5(input, hmacKey).toString() : algo.fn(input);
      if (hmacMode && hmacKey) {
        let hash: string;
        switch (algo.id) {
          case 'MD5': hash = CryptoJS.HmacMD5(input, hmacKey).toString(); break;
          case 'SHA-1': hash = CryptoJS.HmacSHA1(input, hmacKey).toString(); break;
          case 'SHA-256': hash = CryptoJS.HmacSHA256(input, hmacKey).toString(); break;
          case 'SHA-512': hash = CryptoJS.HmacSHA512(input, hmacKey).toString(); break;
          case 'RIPEMD-160': hash = CryptoJS.HmacRIPEMD160(input, hmacKey).toString(); break;
          default: hash = algo.fn(input);
        }
        return { ...algo, hash };
      }
      return { ...algo, hash: algo.fn(input) };
    });
  }, [input, hmacKey, hmacMode]);

  const copyHash = async (hash: string, index: number) => {
    await navigator.clipboard.writeText(hash);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <ToolLayout
      title="Hash Generator"
      description="Generate MD5, SHA-1, SHA-256, SHA-512, and RIPEMD-160 hashes instantly. Supports HMAC with a secret key."
      faq={[
        { question: 'What is a hash?', answer: 'A hash is a fixed-size string generated from input data using a one-way mathematical function. It is commonly used for data integrity verification, password storage, and digital signatures.' },
        { question: 'What is HMAC?', answer: 'HMAC (Hash-based Message Authentication Code) combines a cryptographic hash function with a secret key. It ensures both data integrity and authenticity.' },
      ]}
      relatedTools={[
        { name: 'Password Generator', path: '/dev-tools/password-generator' },
        { name: 'Base64 Encoder', path: '/dev-tools/base64-encoder' },
        { name: 'QR Code Generator', path: '/dev-tools/qr-code-generator' },
      ]}
    >
      <div className="space-y-4">
        <div className="space-y-3">
          <label className="label-text">Input Text</label>
          <textarea
            className="input-field min-h-[100px] font-mono text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to hash..."
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="hmac-mode"
            checked={hmacMode}
            onChange={(e) => setHmacMode(e.target.checked)}
            className="rounded border-border"
          />
          <label htmlFor="hmac-mode" className="text-sm text-text-primary font-medium flex items-center gap-1">
            <Key className="w-4 h-4" /> HMAC Mode
          </label>
        </div>

        {hmacMode && (
          <Input
            label="Secret Key"
            value={hmacKey}
            onChange={(e) => setHmacKey(e.target.value)}
            placeholder="Enter HMAC secret key..."
            icon={<Key className="w-4 h-4" />}
          />
        )}

        {results.length > 0 && (
          <div className="space-y-3">
            {results.map((item, index) => (
              <div key={item.id} className="rounded-lg border border-border bg-surface p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-primary flex items-center gap-1">
                    <Hash className="w-4 h-4" />{item.id}
                  </span>
                  <Button size="sm" variant="ghost" onClick={() => copyHash(item.hash, index)}>
                    <Copy className="w-4 h-4" />{copiedIndex === index ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
                <p className="text-xs font-mono text-text-primary break-all select-all">{item.hash}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
