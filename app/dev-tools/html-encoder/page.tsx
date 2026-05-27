'use client';
import React, { useState } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { Copy, Code, RefreshCw, Table } from 'lucide-react';

const htmlEntities: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

const entityChars: { char: string; entity: string; name: string }[] = [
  { char: '&', entity: '&amp;', name: 'ampersand' },
  { char: '<', entity: '&lt;', name: 'less than' },
  { char: '>', entity: '&gt;', name: 'greater than' },
  { char: '"', entity: '&quot;', name: 'double quote' },
  { char: "'", entity: '&#39;', name: 'single quote / apostrophe' },
  { char: ' ', entity: '&nbsp;', name: 'non-breaking space' },
  { char: '©', entity: '&copy;', name: 'copyright' },
  { char: '®', entity: '&reg;', name: 'registered trademark' },
  { char: '™', entity: '&trade;', name: 'trademark' },
  { char: '€', entity: '&euro;', name: 'euro' },
  { char: '£', entity: '&pound;', name: 'pound' },
  { char: '¥', entity: '&yen;', name: 'yen' },
  { char: '°', entity: '&deg;', name: 'degree' },
  { char: '±', entity: '&plusmn;', name: 'plus-minus' },
  { char: '×', entity: '&times;', name: 'multiplication' },
  { char: '÷', entity: '&divide;', name: 'division' },
  { char: '•', entity: '&bull;', name: 'bullet' },
  { char: '…', entity: '&hellip;', name: 'ellipsis' },
];

function encodeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (ch) => htmlEntities[ch] || ch);
}

function decodeHtml(str: string): string {
  const reverse: Record<string, string> = {};
  for (const [ch, ent] of Object.entries(htmlEntities)) {
    reverse[ent] = ch;
  }
  return str.replace(/&(?:amp|lt|gt|quot|#39);/g, (match) => reverse[match] || match);
}

export default function HtmlEncoderPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, copy] = useCopyToClipboard();
  const [showTable, setShowTable] = useState(false);

  const handleEncode = () => {
    setOutput(encodeHtml(input));
  };

  const handleDecode = () => {
    setOutput(decodeHtml(input));
  };

  return (
    <ToolLayout
      title="HTML Encoder / Decoder"
      description="Encode or decode HTML entities. Convert special characters to their HTML entity equivalents and back."
      faq={[
        { question: 'What are HTML entities?', answer: 'HTML entities are special codes that represent reserved HTML characters (like <, >, &) to prevent them from being interpreted as HTML markup. They start with & and end with ;.' },
        { question: 'Why encode HTML?', answer: 'HTML encoding prevents XSS attacks, ensures special characters display correctly in web pages, and is required when inserting user-generated content into HTML.' },
      ]}
      relatedTools={[
        { name: 'URL Encoder', path: '/dev-tools/url-encoder' },
        { name: 'Base64 Encoder', path: '/dev-tools/base64-encoder' },
        { name: 'JSON Formatter', path: '/dev-tools/json-formatter' },
      ]}
    >
      <div className="space-y-4">
        <div className="space-y-3">
          <label className="label-text">Input</label>
          <textarea
            className="input-field min-h-[120px] font-mono text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to encode/decode HTML entities..."
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={handleEncode}><Code className="w-4 h-4" />Encode HTML Entities</Button>
          <Button variant="secondary" onClick={handleDecode}><RefreshCw className="w-4 h-4" />Decode HTML Entities</Button>
        </div>

        {output && (
          <div className="space-y-3">
            <label className="label-text">Output</label>
            <div className="relative">
              <textarea className="input-field min-h-[100px] font-mono text-sm" value={output} readOnly />
            </div>
            <Button variant="secondary" onClick={() => copy(output)}>
              <Copy className="w-4 h-4" />{copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        )}

        <div className="pt-4">
          <Button variant="ghost" onClick={() => setShowTable(!showTable)}>
            <Table className="w-4 h-4" />{showTable ? 'Hide' : 'Show'} Character Reference
          </Button>
          {showTable && (
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 text-text-secondary font-medium">Character</th>
                    <th className="text-left py-2 px-3 text-text-secondary font-medium">Entity</th>
                    <th className="text-left py-2 px-3 text-text-secondary font-medium">Name</th>
                  </tr>
                </thead>
                <tbody>
                  {entityChars.map((row, i) => (
                    <tr key={i} className="border-b border-border/50 font-mono">
                      <td className="py-2 px-3 text-text-primary">'{row.char}'</td>
                      <td className="py-2 px-3 text-primary">{row.entity}</td>
                      <td className="py-2 px-3 text-text-secondary">{row.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
