'use client';
import React, { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { downloadFile } from '@/lib/utils/helpers';
import { Copy, Download, Eye, Minimize, CheckCircle, AlertCircle, FileSpreadsheet } from 'lucide-react';

function jsonToCsv(obj: any, prefix = ''): string {
  if (obj === null || obj === undefined) return '';
  if (typeof obj !== 'object' || obj instanceof Date) return `"${String(obj)}"`;
  if (Array.isArray(obj)) {
    if (obj.length === 0) return '';
    const headers = new Set<string>();
    obj.forEach((item) => { if (typeof item === 'object' && item !== null) Object.keys(item).forEach((k) => headers.add(k)); });
    const h = Array.from(headers);
    const rows = obj.map((item) => {
      if (typeof item === 'object' && item !== null) return h.map((k) => `"${item[k] ?? ''}"`).join(',');
      return `"${item}"`;
    });
    return [h.join(','), ...rows].join('\n');
  }
  return Object.entries(obj).map(([k, v]) => `${prefix}${k}: ${typeof v === 'object' ? jsonToCsv(v, prefix + '  ') : v}`).join(', ');
}

function renderTreeView(obj: any, depth = 0): string {
  if (obj === null) return 'null';
  if (obj === undefined) return 'undefined';
  if (typeof obj === 'string') return `"${obj}"`;
  if (typeof obj === 'number' || typeof obj === 'boolean') return String(obj);
  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]';
    const indent = '  '.repeat(depth + 1);
    const closingIndent = '  '.repeat(depth);
    const items = obj.map((item, i) => `${indent}[${i}]: ${renderTreeView(item, depth + 1).split('\n')[0]}`).join('\n');
    return `[\n${items}\n${closingIndent}]`;
  }
  if (typeof obj === 'object') {
    const keys = Object.keys(obj);
    if (keys.length === 0) return '{}';
    const indent = '  '.repeat(depth + 1);
    const closingIndent = '  '.repeat(depth);
    const items = keys.map((k) => {
      const val = obj[k];
      if (typeof val === 'object' && val !== null) {
        const firstLine = renderTreeView(val, depth + 1).split('\n')[0];
        return `${indent}"${k}": ${firstLine}`;
      }
      return `${indent}"${k}": ${renderTreeView(val, depth + 1)}`;
    }).join('\n');
    return `{\n${items}\n${closingIndent}}`;
  }
  return String(obj);
}

export default function JsonFormatterPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [treeView, setTreeView] = useState(false);
  const [copied, copy] = useCopyToClipboard();

  const parsed = useMemo(() => {
    if (!input.trim()) return null;
    try { return JSON.parse(input); }
    catch { return null; }
  }, [input]);

  const validate = () => {
    if (!input.trim()) { setError('Please enter JSON'); setOutput(''); return; }
    try {
      JSON.parse(input);
      setError('');
      setOutput('Valid JSON!');
    } catch (e: any) {
      setError(e.message);
      setOutput('');
    }
  };

  const prettify = () => {
    if (!input.trim()) return;
    try {
      const obj = JSON.parse(input);
      setOutput(JSON.stringify(obj, null, 2));
      setError('');
    } catch (e: any) {
      setError(e.message);
    }
  };

  const minify = () => {
    if (!input.trim()) return;
    try {
      const obj = JSON.parse(input);
      setOutput(JSON.stringify(obj));
      setError('');
    } catch (e: any) {
      setError(e.message);
    }
  };

  const convertToCsv = () => {
    if (!input.trim()) return;
    try {
      const obj = JSON.parse(input);
      setOutput(jsonToCsv(obj));
      setError('');
    } catch (e: any) {
      setError(e.message);
    }
  };

  const downloadJson = () => {
    if (output) {
      downloadFile(output, 'formatted.json', 'application/json');
    }
  };

  return (
    <ToolLayout
      title="JSON Formatter & Validator"
      description="Format, validate, minify, and convert JSON. View JSON in a tree structure and export to CSV."
      faq={[
        { question: 'What is JSON?', answer: 'JSON (JavaScript Object Notation) is a lightweight data interchange format that is easy for humans to read and machines to parse. It is widely used in APIs and configuration files.' },
        { question: 'Why format JSON?', answer: 'Formatting (or pretty-printing) JSON adds proper indentation and line breaks, making it much easier to read and debug. Minifying reduces file size for production use.' },
      ]}
      relatedTools={[
        { name: 'Base64 Encoder', path: '/dev-tools/base64-encoder' },
        { name: 'HTML Encoder', path: '/dev-tools/html-encoder' },
        { name: 'URL Encoder', path: '/dev-tools/url-encoder' },
      ]}
    >
      <div className="space-y-4">
        <div className="space-y-3">
          <label className="label-text">JSON Input</label>
          <textarea
            className="input-field min-h-[150px] font-mono text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"key": "value"}'
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-error p-3 rounded-lg bg-error/10">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {output === 'Valid JSON!' && (
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 p-3 rounded-lg bg-green-500/10">
            <CheckCircle className="w-4 h-4 shrink-0" />
            Valid JSON!
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button onClick={validate}><CheckCircle className="w-4 h-4" />Validate</Button>
          <Button variant="secondary" onClick={prettify}><Eye className="w-4 h-4" />Prettify</Button>
          <Button variant="secondary" onClick={minify}><Minimize className="w-4 h-4" />Minify</Button>
          <Button variant="secondary" onClick={convertToCsv}><FileSpreadsheet className="w-4 h-4" />JSON to CSV</Button>
        </div>

        {output && output !== 'Valid JSON!' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="label-text">
                {treeView ? 'Tree View' : 'Output'}
              </label>
              {parsed && (
                <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                  <input type="checkbox" checked={treeView} onChange={() => setTreeView(!treeView)} className="rounded border-border" />
                  Tree View
                </label>
              )}
            </div>
            <div className="relative">
              {treeView && parsed ? (
                <pre className="input-field min-h-[150px] font-mono text-sm overflow-auto whitespace-pre">
                  {renderTreeView(parsed)}
                </pre>
              ) : (
                <textarea className="input-field min-h-[150px] font-mono text-sm" value={output} readOnly />
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => copy(output)}>
                <Copy className="w-4 h-4" />{copied ? 'Copied!' : 'Copy'}
              </Button>
              <Button variant="secondary" onClick={downloadJson}>
                <Download className="w-4 h-4" />Download .json
              </Button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
