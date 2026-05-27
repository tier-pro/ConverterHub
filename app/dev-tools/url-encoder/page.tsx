'use client';
import React, { useState } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { Copy, Code, RefreshCw, Table } from 'lucide-react';

const charTable = [
  { char: ' ', encoded: '%20' },
  { char: '!', encoded: '%21' },
  { char: '"', encoded: '%22' },
  { char: '#', encoded: '%23' },
  { char: '$', encoded: '%24' },
  { char: '%', encoded: '%25' },
  { char: '&', encoded: '%26' },
  { char: "'", encoded: '%27' },
  { char: '(', encoded: '%28' },
  { char: ')', encoded: '%29' },
  { char: '*', encoded: '%2A' },
  { char: '+', encoded: '%2B' },
  { char: ',', encoded: '%2C' },
  { char: '/', encoded: '%2F' },
  { char: ':', encoded: '%3A' },
  { char: ';', encoded: '%3B' },
  { char: '<', encoded: '%3C' },
  { char: '=', encoded: '%3D' },
  { char: '>', encoded: '%3E' },
  { char: '?', encoded: '%3F' },
  { char: '@', encoded: '%40' },
  { char: '[', encoded: '%5B' },
  { char: '\\', encoded: '%5C' },
  { char: ']', encoded: '%5D' },
  { char: '^', encoded: '%5E' },
  { char: '{', encoded: '%7B' },
  { char: '|', encoded: '%7C' },
  { char: '}', encoded: '%7D' },
  { char: '~', encoded: '%7E' },
];

export default function UrlEncoderPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, copy] = useCopyToClipboard();
  const [showTable, setShowTable] = useState(false);

  const handleEncode = () => {
    try { setOutput(encodeURI(input)); } catch { setOutput('Error encoding'); }
  };

  const handleDecode = () => {
    try { setOutput(decodeURI(input)); } catch { setOutput('Invalid URL encoding'); }
  };

  const handleEncodeComponent = () => {
    try { setOutput(encodeURIComponent(input)); } catch { setOutput('Error encoding'); }
  };

  const handleDecodeComponent = () => {
    try { setOutput(decodeURIComponent(input)); } catch { setOutput('Invalid URL encoding'); }
  };

  return (
    <ToolLayout
      title="URL Encoder / Decoder"
      description="Encode or decode URLs and URI components. Free online URL encoder tool."
      faq={[
        { question: 'What is URL encoding?', answer: 'URL encoding converts characters into a format that can be transmitted over the internet. It replaces unsafe ASCII characters with a "%" followed by two hexadecimal digits.' },
        { question: 'What is the difference between encodeURI and encodeURIComponent?', answer: 'encodeURI encodes a full URI preserving the structure, while encodeURIComponent encodes everything including characters that have special meaning in URIs (like /, ?, &, #).' },
      ]}
      relatedTools={[
        { name: 'Base64 Encoder', path: '/dev-tools/base64-encoder' },
        { name: 'HTML Encoder', path: '/dev-tools/html-encoder' },
        { name: 'Hash Generator', path: '/dev-tools/hash-generator' },
      ]}
    >
      <div className="space-y-4">
        <div className="space-y-3">
          <label className="label-text">Input</label>
          <textarea
            className="input-field min-h-[120px] font-mono text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text or URL to encode/decode..."
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={handleEncode}><Code className="w-4 h-4" />Encode URL</Button>
          <Button variant="secondary" onClick={handleDecode}><RefreshCw className="w-4 h-4" />Decode URL</Button>
          <Button variant="secondary" onClick={handleEncodeComponent}><Code className="w-4 h-4" />Encode URI Component</Button>
          <Button variant="secondary" onClick={handleDecodeComponent}><RefreshCw className="w-4 h-4" />Decode URI Component</Button>
        </div>

        {output && (
          <div className="space-y-3">
            <label className="label-text">Result</label>
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
                    <th className="text-left py-2 px-3 text-text-secondary font-medium">Encoded</th>
                  </tr>
                </thead>
                <tbody>
                  {charTable.map((row, i) => (
                    <tr key={i} className="border-b border-border/50 font-mono">
                      <td className="py-2 px-3 text-text-primary">'{row.char}'</td>
                      <td className="py-2 px-3 text-primary">{row.encoded}</td>
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
