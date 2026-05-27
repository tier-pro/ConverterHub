'use client';
import React, { useState } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { downloadFile, readFileAsText, readFileAsDataURL } from '@/lib/utils/helpers';
import { Copy, Download, Upload, Repeat, FileText, Type } from 'lucide-react';

export default function Base64EncoderPage() {
  const [mode, setMode] = useState<'encode-text' | 'encode-file' | 'decode'>('encode-text');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [fileName, setFileName] = useState('');
  const [copied, copy] = useCopyToClipboard();

  const encodeText = () => {
    try { setOutput(btoa(input)); } catch { setOutput('Invalid input'); }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    try {
      const dataUrl = await readFileAsDataURL(file);
      setOutput(dataUrl.split(',')[1] || '');
    } catch { setOutput('Error reading file'); }
  };

  const decode = () => {
    try {
      const decoded = atob(input);
      if (mode === 'decode' && fileName) {
        downloadFile(decoded, fileName.replace(/\.[^.]+$/, '') + '_decoded');
      } else {
        setOutput(decoded);
      }
    } catch { setOutput('Invalid Base64 input'); }
  };

  React.useEffect(() => {
    if (mode === 'encode-text' && input) encodeText();
    else if (mode === 'encode-text') setOutput('');
  }, [input, mode]);

  const tabs = [
    { id: 'encode-text', label: 'Encode Text', icon: <Type className="w-4 h-4" /> },
    { id: 'encode-file', label: 'Encode File', icon: <FileText className="w-4 h-4" /> },
    { id: 'decode', label: 'Decode', icon: <Repeat className="w-4 h-4" /> },
  ];

  return (
    <ToolLayout
      title="Base64 Encoder / Decoder"
      description="Encode text or files to Base64, or decode Base64 back to text/files"
      faq={[
        { question: 'What is Base64?', answer: 'Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format. It is commonly used for embedding images or files in web pages and data URIs.' },
        { question: 'Why use Base64?', answer: 'Base64 is useful for transmitting binary data over text-based protocols like HTTP, embedding files in HTML/CSS, and storing binary data in JSON.' },
      ]}
      relatedTools={[
        { name: 'URL Encoder', path: '/dev-tools/url-encoder' },
        { name: 'HTML Encoder', path: '/dev-tools/html-encoder' },
        { name: 'Hash Generator', path: '/dev-tools/hash-generator' },
      ]}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={mode === tab.id ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => { setMode(tab.id as typeof mode); setOutput(''); setInput(''); setFileName(''); }}
            >
              {tab.icon}
              {tab.label}
            </Button>
          ))}
        </div>

        {mode === 'encode-text' && (
          <div className="space-y-3">
            <label className="label-text">Text to Encode</label>
            <textarea
              className="input-field min-h-[120px] font-mono text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text to encode to Base64..."
            />
          </div>
        )}

        {mode === 'encode-file' && (
          <div className="space-y-3">
            <label className="label-text">Upload File</label>
            <input type="file" onChange={handleFileUpload} className="w-full" />
            {fileName && <p className="text-sm text-text-secondary">File: {fileName}</p>}
          </div>
        )}

        {mode === 'decode' && (
          <div className="space-y-3">
            <label className="label-text">Base64 String to Decode</label>
            <textarea
              className="input-field min-h-[120px] font-mono text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter Base64 string to decode..."
            />
            <Input label="Output filename (optional)" value={fileName} onChange={(e) => setFileName(e.target.value)} placeholder="decoded_file.ext" />
            <Button onClick={decode}><Repeat className="w-4 h-4" />Decode</Button>
          </div>
        )}

        {output && (
          <div className="space-y-3">
            <label className="label-text">Output</label>
            <div className="relative">
              <textarea
                className="input-field min-h-[120px] font-mono text-sm"
                value={output}
                readOnly
              />
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => copy(output)}>
                <Copy className="w-4 h-4" />{copied ? 'Copied!' : 'Copy'}
              </Button>
              {mode === 'encode-text' && (
                <Button variant="secondary" onClick={() => downloadFile(output, 'base64_output.txt')}>
                  <Download className="w-4 h-4" />Download
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
