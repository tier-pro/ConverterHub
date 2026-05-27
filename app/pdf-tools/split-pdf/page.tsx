'use client';
import { useState, useCallback } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FileUpload } from '@/components/ui/FileUpload';
import { downloadFile } from '@/lib/utils/helpers';
import { validateFile } from '@/lib/utils/validation';
import { PDFDocument } from 'pdf-lib';
import { FileText, Download, Loader2, Scissors, Layers, List, Repeat } from 'lucide-react';

type SplitMode = 'specific' | 'ranges' | 'individual' | 'every';

interface PageInfo {
  index: number;
  width: number;
  height: number;
}

export default function SplitPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [buffer, setBuffer] = useState<ArrayBuffer | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [splitting, setSplitting] = useState(false);
  const [status, setStatus] = useState('');
  const [splitMode, setSplitMode] = useState<SplitMode>('specific');
  const [specificPages, setSpecificPages] = useState('');
  const [pageRanges, setPageRanges] = useState('');
  const [everyX, setEveryX] = useState(2);

  const handleFiles = useCallback(async (files: File[]) => {
    if (files.length === 0) { setFile(null); setBuffer(null); setPageCount(0); setPages([]); return; }
    const f = files[0];
    setFile(f);
    setLoading(true);
    setStatus('Reading PDF...');
    try {
      const buf = await f.arrayBuffer();
      const doc = await PDFDocument.load(buf);
      const count = doc.getPageCount();
      const info: PageInfo[] = [];
      for (let i = 0; i < count; i++) {
        const { width, height } = doc.getPage(i).getSize();
        info.push({ index: i, width, height });
      }
      setBuffer(buf);
      setPageCount(count);
      setPages(info);
      setStatus(`Loaded ${count} page${count !== 1 ? 's' : ''}`);
    } catch {
      setStatus('Failed to load PDF.');
    }
    setLoading(false);
  }, []);

  const parseSpecific = useCallback((): number[][] => {
    const nums = specificPages.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n >= 1 && n <= pageCount);
    if (nums.length === 0) return [];
    return nums.map(n => [n - 1]);
  }, [specificPages, pageCount]);

  const parseRanges = useCallback((): number[][] => {
    const result: number[][] = [];
    for (const part of pageRanges.split(',')) {
      const t = part.trim();
      const m = t.match(/^(\d+)\s*-\s*(\d+)$/);
      if (m) {
        const start = Math.max(1, parseInt(m[1]));
        const end = Math.min(pageCount, parseInt(m[2]));
        if (start <= end) {
          const range: number[] = [];
          for (let i = start; i <= end; i++) range.push(i - 1);
          result.push(range);
        }
      }
    }
    return result;
  }, [pageRanges, pageCount]);

  const parseEvery = useCallback((): number[][] => {
    const result: number[][] = [];
    for (let i = 0; i < pageCount; i += everyX) {
      const chunk: number[] = [];
      for (let j = i; j < Math.min(i + everyX, pageCount); j++) chunk.push(j);
      result.push(chunk);
    }
    return result;
  }, [pageCount, everyX]);

  const parseIndividual = useCallback((): number[][] => {
    return pages.map(p => [p.index]);
  }, [pages]);

  const getSplitPlan = useCallback((): { label: string; indices: number[] }[] => {
    switch (splitMode) {
      case 'specific': return parseSpecific().map((indices, i) => ({ label: `pages-${indices.map(i => i + 1).join('-')}`, indices }));
      case 'ranges': return parseRanges().map((indices, i) => ({ label: `part-${i + 1}`, indices }));
      case 'individual': return parseIndividual().map((indices, i) => ({ label: `page-${i + 1}`, indices }));
      case 'every': return parseEvery().map((indices, i) => ({ label: `part-${i + 1}`, indices }));
      default: return [];
    }
  }, [splitMode, parseSpecific, parseRanges, parseIndividual, parseEvery]);

  const splitPdf = async () => {
    if (!buffer) return;
    const plan = getSplitPlan();
    if (plan.length === 0 || plan.some(p => p.indices.length === 0)) {
      setStatus('No valid pages to split. Check your input.');
      return;
    }
    setSplitting(true);
    setStatus('Splitting PDF...');
    try {
      for (const part of plan) {
        const sourceDoc = await PDFDocument.load(buffer);
        const newDoc = await PDFDocument.create();
        const copiedPages = await newDoc.copyPages(sourceDoc, part.indices);
        for (const page of copiedPages) newDoc.addPage(page);
        const bytes = await newDoc.save();
        downloadFile(new Blob([bytes as BlobPart], { type: 'application/pdf' }), `${part.label}.pdf`);
      }
      setStatus(`Split into ${plan.length} file${plan.length !== 1 ? 's' : ''}!`);
    } catch {
      setStatus('Failed to split PDF.');
    }
    setSplitting(false);
  };

  const faq = [
    { question: 'What is the difference between split modes?', answer: '"Specific pages" extracts individually listed pages. "Page ranges" splits into grouped sections. "Individual pages" creates one file per page. "Every X pages" splits into chunks of X pages each.' },
    { question: 'Will split files preserve formatting?', answer: 'Yes. Each split file is a valid PDF that preserves all original content and formatting.' },
    { question: 'Can I split a PDF without losing quality?', answer: 'Yes. pdf-lib copies pages without re-encoding content, so quality is preserved exactly.' },
  ];

  const relatedTools = [
    { name: 'PDF to Images', path: '/pdf-tools/pdf-to-images' },
    { name: 'Merge PDF', path: '/pdf-tools/merge-pdf' },
    { name: 'PDF Page Remover', path: '/pdf-tools/pdf-page-remover' },
  ];

  const modeIcon = { specific: Scissors, ranges: Layers, individual: List, every: Repeat };

  return (
    <ToolLayout title="Split PDF" description="Split a PDF file into multiple documents by page ranges, specific pages, or individual pages." faq={faq} relatedTools={relatedTools}>
      <FileUpload accept=".pdf" onFiles={handleFiles} label="Upload PDF File" maxSize={50 * 1024 * 1024} />

      {loading && (
        <div className="flex items-center gap-2 mt-4 text-text-secondary">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{status}</span>
        </div>
      )}

      {status && !loading && !splitting && (
        <p className="mt-3 text-sm text-text-secondary">{status}</p>
      )}

      {pages.length > 0 && (
        <>
          <Card className="mt-6 p-4">
            <h3 className="text-sm font-semibold text-text-primary mb-3">Split Mode</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {([['specific', 'Specific Pages'], ['ranges', 'Page Ranges'], ['individual', 'Individual Pages'], ['every', 'Every X Pages']] as [SplitMode, string][]).map(([mode, label]) => {
                const Icon = modeIcon[mode];
                return (
                  <button key={mode} onClick={() => setSplitMode(mode)} className={`flex items-center gap-2 p-3 rounded-lg border text-sm transition-colors ${splitMode === mode ? 'border-primary bg-primary/5 text-primary' : 'border-border text-text-secondary hover:border-primary/50'}`}>
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                );
              })}
            </div>

            <div className="mt-4">
              {splitMode === 'specific' && (
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Enter page numbers</label>
                  <input className="input-field w-full" value={specificPages} onChange={(e) => setSpecificPages(e.target.value)} placeholder="e.g. 1, 3, 5, 7" />
                  <p className="text-xs text-text-secondary mt-1">Comma-separated list of page numbers to extract individually</p>
                </div>
              )}
              {splitMode === 'ranges' && (
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Enter page ranges</label>
                  <input className="input-field w-full" value={pageRanges} onChange={(e) => setPageRanges(e.target.value)} placeholder="e.g. 1-3, 4-6, 7-9" />
                  <p className="text-xs text-text-secondary mt-1">Comma-separated ranges. Each range becomes a separate PDF</p>
                </div>
              )}
              {splitMode === 'individual' && (
                <p className="text-sm text-text-secondary">Each of the {pageCount} pages will be saved as a separate PDF file.</p>
              )}
              {splitMode === 'every' && (
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-text-primary">Every</label>
                  <input type="number" min={1} max={pageCount} className="input-field w-20" value={everyX} onChange={(e) => setEveryX(Math.max(1, parseInt(e.target.value) || 1))} />
                  <span className="text-sm text-text-secondary">page(s) &rarr; {Math.ceil(pageCount / everyX)} file{Math.ceil(pageCount / everyX) !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          </Card>

          <div className="mt-6 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {pages.map((page, i) => (
              <Card key={i} hover={false} className="p-2 text-center">
                <div className="aspect-[3/4] rounded border border-border bg-white flex items-center justify-center">
                  <span className="text-xs text-text-secondary font-mono">{i + 1}</span>
                </div>
                <p className="text-xs text-text-secondary mt-1 truncate">{Math.round(page.width)}×{Math.round(page.height)}</p>
              </Card>
            ))}
          </div>

          <div className="mt-6">
            <Button onClick={splitPdf} loading={splitting} size="lg">
              <Download className="w-4 h-4" />
              Split PDF
            </Button>
            {splitting && <span className="ml-3 text-sm text-text-secondary">{status}</span>}
          </div>
        </>
      )}
    </ToolLayout>
  );
}
