'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FileUpload } from '@/components/ui/FileUpload';
import { downloadFile } from '@/lib/utils/helpers';
import { Download, Loader2 } from 'lucide-react';

interface PageInfo {
  index: number;
  width: number;
  height: number;
}

export default function PdfToImagesPage() {
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [format, setFormat] = useState<'PNG' | 'JPG'>('PNG');
  const [quality, setQuality] = useState(92);
  const [pageRange, setPageRange] = useState('all');
  const [status, setStatus] = useState('');
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

  const handleFiles = useCallback(async (files: File[]) => {
    if (files.length === 0) { setPages([]); setPdfDoc(null); return; }
    setLoading(true);
    setStatus('Loading PDF.js...');
    try {
      const pdfjsMod = await import('pdfjs-dist');
      const pdfjsLib = pdfjsMod.default || pdfjsMod;
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

      setStatus('Reading PDF...');
      const buffer = await files[0].arrayBuffer();
      const doc = await pdfjsLib.getDocument({ data: buffer }).promise;
      setPdfDoc(doc);
      const count = doc.numPages;
      const info: PageInfo[] = [];
      for (let i = 1; i <= count; i++) {
        const page = await doc.getPage(i);
        const viewport = page.getViewport({ scale: 1 });
        info.push({ index: i, width: viewport.width, height: viewport.height });
      }
      setPages(info);
      setStatus(`Loaded ${count} page${count !== 1 ? 's' : ''}`);
    } catch (e: any) {
      setStatus(e?.message || 'Failed to load PDF');
    }
    setLoading(false);
  }, []);

  const renderPage = async (pageIndex: number, canvas: HTMLCanvasElement, scale: number = 0.4) => {
    if (!pdfDoc) return;
    try {
      const pdfPage = await pdfDoc.getPage(pageIndex + 1);
      const vp = pdfPage.getViewport({ scale });
      canvas.width = vp.width;
      canvas.height = vp.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      await pdfPage.render({ canvas: canvas, viewport: vp }).promise;
    } catch {}
  };

  useEffect(() => {
    if (!pdfDoc) return;
    pages.forEach((_, i) => {
      const canvas = canvasRefs.current[i];
      if (canvas) renderPage(i, canvas);
    });
  }, [pages, pdfDoc]);

  const getSelectedIndices = useCallback((): number[] => {
    if (pageRange === 'all') return pages.map((_, i) => i + 1);
    const indices: number[] = [];
    for (const part of pageRange.split(',')) {
      const t = part.trim();
      if (t.includes('-')) {
        const [a, b] = t.split('-').map(s => parseInt(s.trim()));
        if (!isNaN(a) && !isNaN(b)) {
          for (let i = Math.max(1, a); i <= Math.min(b, pages.length); i++) indices.push(i);
        }
      } else {
        const n = parseInt(t);
        if (!isNaN(n) && n >= 1 && n <= pages.length) indices.push(n);
      }
    }
    return Array.from(new Set(indices)).sort((a, b) => a - b);
  }, [pageRange, pages]);

  const downloadPage = async (pageIndex: number) => {
    if (!pdfDoc) return;
    try {
      const pdfPage = await pdfDoc.getPage(pageIndex + 1);
      const vp = pdfPage.getViewport({ scale: 2 });
      const canvas = document.createElement('canvas');
      canvas.width = vp.width;
      canvas.height = vp.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      await pdfPage.render({ canvas, viewport: vp }).promise;
      const mime = format === 'PNG' ? 'image/png' : 'image/jpeg';
      canvas.toBlob((blob) => {
        if (blob) downloadFile(blob, `page-${pageIndex + 1}.${format.toLowerCase()}`, mime);
      }, mime, quality / 100);
    } catch {
      setStatus('Failed to render page for download.');
    }
  };

  const downloadAll = async () => {
    const indices = getSelectedIndices();
    for (const idx of indices) {
      await downloadPage(idx - 1);
      await new Promise((r) => setTimeout(r, 500));
    }
  };

  const faq = [
    { question: 'Can I convert all pages at once?', answer: 'Yes. By default, "all" pages are selected. You can also specify a range like "1-5" or specific pages like "1,3,5".' },
    { question: 'What image formats are supported?', answer: 'PNG (lossless) and JPG (lossy compression). JPG produces smaller files but may lose some quality.' },
    { question: 'Is the PDF content preserved?', answer: 'Yes. PDF.js renders the actual PDF content including text, images, and graphics onto the canvas.' },
  ];

  const relatedTools = [
    { name: 'Merge PDF', path: '/pdf-tools/merge-pdf' },
    { name: 'Split PDF', path: '/pdf-tools/split-pdf' },
    { name: 'PDF Page Remover', path: '/pdf-tools/pdf-page-remover' },
  ];

  return (
    <ToolLayout title="PDF to Images" description="Convert PDF pages to PNG or JPG images with adjustable quality and page range selection." faq={faq} relatedTools={relatedTools}>
      <FileUpload accept=".pdf" onFiles={handleFiles} label="Upload PDF File" maxSize={50 * 1024 * 1024} />

      {loading && (
        <div className="flex items-center gap-2 mt-4 text-text-secondary">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{status}</span>
        </div>
      )}

      {status && !loading && (
        <p className="mt-3 text-sm text-text-secondary">{status}</p>
      )}

      {pages.length > 0 && (
        <>
          <Card className="mt-6 p-4 space-y-4">
            <div className="flex flex-wrap gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Output Format</label>
                <select className="input-field" value={format} onChange={(e) => setFormat(e.target.value as 'PNG' | 'JPG')}>
                  <option value="PNG">PNG</option>
                  <option value="JPG">JPG</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Quality ({quality}%)</label>
                <input type="range" min={10} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-32" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Page Range</label>
                <input className="input-field w-36" value={pageRange} onChange={(e) => setPageRange(e.target.value)} placeholder='e.g. "1-3" or "all"' />
              </div>
              <Button onClick={downloadAll}>
                <Download className="w-4 h-4" />
                Download All Selected
              </Button>
            </div>
          </Card>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {pages.map((page, i) => (
              <Card key={i} hover={false} className="p-3">
                <canvas ref={(el) => { canvasRefs.current[i] = el; }} className="w-full rounded border border-border" />
                <p className="text-xs text-text-secondary mt-2 text-center">Page {i + 1}</p>
                <Button size="sm" variant="secondary" className="w-full mt-2" onClick={() => downloadPage(i)}>
                  <Download className="w-3 h-3" />
                  Download
                </Button>
              </Card>
            ))}
          </div>
        </>
      )}
    </ToolLayout>
  );
}
