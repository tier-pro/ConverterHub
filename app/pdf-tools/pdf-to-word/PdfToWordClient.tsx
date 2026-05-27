'use client';
import React, { useState, useCallback } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { Upload, Download, FileText, Loader2, AlertCircle, CheckCircle, AlignLeft } from 'lucide-react';

export default function PdfToWordClient() {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<'word' | 'text'>('word');
  const [text, setText] = useState('');
  const [pages, setPages] = useState<{ text: string; page: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [copied, copy] = useCopyToClipboard();

  const handleFile = useCallback((f: File) => {
    if (f.type !== 'application/pdf') { setError('Please upload a PDF file.'); return; }
    setFile(f);
    setError('');
    setText('');
    setPages([]);
  }, []);

  const extractText = useCallback(async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setProgress(10);
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const allPages: { text: string; page: number }[] = [];
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item: any) => item.str).join(' ');
        allPages.push({ text: pageText, page: i });
        fullText += pageText + '\n\n';
        setProgress(Math.round((i / pdf.numPages) * 90));
      }
      setPages(allPages);
      setText(fullText.trim());
      setProgress(100);
    } catch {
      setError('Failed to extract text. The PDF may be scanned or protected.');
    }
    setLoading(false);
  }, [file]);

  const downloadWord = useCallback(async () => {
    if (!text) return;
    try {
      const { Document, Packer, Paragraph, TextRun, Header, Footer } = await import('docx');
      const sections = pages.map((p) => ({
        properties: {},
        children: [
          new Paragraph({ children: [new TextRun({ text: `Page ${p.page}`, bold: true, size: 28 })] }),
          new Paragraph({ children: [new TextRun(p.text)], spacing: { before: 200 } }),
        ],
      }));
      const doc = new Document({
        title: file?.name.replace(/\.pdf$/i, '') || 'document',
        creator: 'ConverterHub',
        sections: sections.length > 0 ? sections : [{ children: [new Paragraph({ children: [new TextRun({ text })] })] }],
      });
      const blob = await Packer.toBlob(doc);
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = (file?.name.replace(/\.pdf$/i, '') || 'document') + '.docx';
      a.click();
    } catch {
      setError('Failed to create Word document.');
    }
  }, [text, pages, file]);

  const faq = [
    { question: 'Does this work with scanned PDFs?', answer: 'No, scanned PDFs are images. Use our "PDF to Images" tool first and run OCR separately.' },
    { question: 'Is the formatting preserved?', answer: 'The text is extracted as plain text. Formatting like bold, fonts, and tables are not preserved in the Word output.' },
    { question: 'Are my files uploaded to a server?', answer: 'No. Everything is processed in your browser using PDF.js. Your document never leaves your device.' },
  ];

  const relatedTools = [
    { name: 'PDF to Images', path: '/pdf-tools/pdf-to-images' },
    { name: 'Merge PDF', path: '/pdf-tools/merge-pdf' },
    { name: 'Split PDF', path: '/pdf-tools/split-pdf' },
  ];

  return (
    <ToolLayout title="PDF to Word / Text Converter" description="Extract text from PDF files and download as a Word document (.docx) or copy as plain text. Free and private." faq={faq} relatedTools={relatedTools}>
      <div className="space-y-6">
        {!file ? (
          <div className="border-2 border-dashed border-border rounded-2xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer" onClick={() => document.getElementById('pdf-file-input')?.click()}>
            <FileText className="w-12 h-12 mx-auto text-text-secondary mb-4" />
            <p className="text-text-primary font-medium">Upload a PDF to extract text</p>
            <p className="text-text-secondary text-sm mt-1">PDF files up to 20MB</p>
            <input id="pdf-file-input" type="file" accept=".pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          </div>
        ) : (
          <Card hover={false} className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-primary" />
              <div className="flex-1 min-w-0"><p className="text-sm font-medium text-text-primary truncate">{file.name}</p><p className="text-xs text-text-secondary">{(file.size / 1024 / 1024).toFixed(1)} MB</p></div>
            </div>
          </Card>
        )}

        <div className="flex gap-2">
          <Button variant={mode === 'word' ? 'primary' : 'secondary'} size="sm" onClick={() => setMode('word')}><Download className="w-4 h-4" /> Word (.docx)</Button>
          <Button variant={mode === 'text' ? 'primary' : 'secondary'} size="sm" onClick={() => setMode('text')}><AlignLeft className="w-4 h-4" /> Plain Text</Button>
        </div>

        {error && <div className="flex items-center gap-2 text-sm text-error bg-error/10 rounded-lg p-3"><AlertCircle className="w-4 h-4" />{error}</div>}

        {loading && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-text-secondary"><Loader2 className="w-4 h-4 animate-spin" />Extracting text... {progress}%</div>
            <div className="w-full bg-border rounded-full h-2"><div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} /></div>
          </div>
        )}

        {text && !loading && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-text-secondary">{pages.length} page{pages.length !== 1 ? 's' : ''} · {text.split(/\s+/).length} words</p>
              <div className="flex gap-2">
                {mode === 'word' ? (
                  <Button size="sm" onClick={downloadWord}><Download className="w-4 h-4" /> Download .docx</Button>
                ) : (
                  <Button size="sm" variant="ghost" onClick={() => copy(text)}>{copied ? <CheckCircle className="w-4 h-4" /> : null} {copied ? 'Copied!' : 'Copy Text'}</Button>
                )}
              </div>
            </div>
            <textarea className="input-field min-h-[300px] w-full resize-y font-mono text-sm" readOnly value={text} />
          </>
        )}

        {file && !text && !loading && (
          <div className="flex flex-wrap gap-3">
            <Button onClick={extractText}><FileText className="w-4 h-4" /> Extract Text</Button>
            <Button variant="secondary" onClick={() => { setFile(null); setText(''); setPages([]); }}>Choose Another</Button>
          </div>
        )}

        {text && !loading && (
          <div><Button variant="secondary" onClick={() => { setFile(null); setText(''); setPages([]); }}>Convert Another PDF</Button></div>
        )}
      </div>
    </ToolLayout>
  );
}
