'use client';
import { useState, useCallback, useMemo } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FileUpload } from '@/components/ui/FileUpload';
import { downloadFile } from '@/lib/utils/helpers';
import { validateFile } from '@/lib/utils/validation';
import { PDFDocument } from 'pdf-lib';
import { FileText, Download, Loader2, Trash2, Eye, EyeOff, CheckSquare, Square } from 'lucide-react';

interface PageInfo {
  index: number;
  width: number;
  height: number;
}

export default function PdfPageRemoverPage() {
  const [file, setFile] = useState<File | null>(null);
  const [buffer, setBuffer] = useState<ArrayBuffer | null>(null);
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [selectedToRemove, setSelectedToRemove] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [previewMode, setPreviewMode] = useState(false);

  const handleFiles = useCallback(async (files: File[]) => {
    if (files.length === 0) { setFile(null); setBuffer(null); setPages([]); setSelectedToRemove(new Set()); return; }
    const f = files[0];
    setFile(f);
    setLoading(true);
    setStatus('Reading PDF...');
    setError('');
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
      setPages(info);
      setStatus(`Loaded ${count} page${count !== 1 ? 's' : ''}`);
    } catch {
      setError('Failed to load PDF. Ensure it is a valid file.');
    }
    setLoading(false);
  }, []);

  const togglePage = (index: number) => {
    setSelectedToRemove(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const selectAll = () => {
    setSelectedToRemove(new Set(pages.map(p => p.index)));
  };

  const deselectAll = () => {
    setSelectedToRemove(new Set());
  };

  const togglePreview = () => setPreviewMode(p => !p);

  const keptPages = useMemo(() => pages.filter(p => !selectedToRemove.has(p.index)), [pages, selectedToRemove]);
  const removedCount = selectedToRemove.size;
  const keptCount = pages.length - removedCount;

  const removePages = async () => {
    if (!buffer || removedCount === 0) { setError('Select at least one page to remove.'); return; }
    if (keptCount === 0) { setError('Cannot remove all pages. At least one page must remain.'); return; }
    setProcessing(true);
    setStatus('Removing pages...');
    setError('');
    try {
      const sourceDoc = await PDFDocument.load(buffer);
      const newDoc = await PDFDocument.create();
      const keepIndices = keptPages.map(p => p.index);
      const copiedPages = await newDoc.copyPages(sourceDoc, keepIndices);
      for (const page of copiedPages) newDoc.addPage(page);
      const bytes = await newDoc.save();
      downloadFile(new Blob([bytes as BlobPart], { type: 'application/pdf' }), 'cleaned.pdf');
      setStatus(`Removed ${removedCount} page${removedCount !== 1 ? 's' : ''}. Downloaded as cleaned.pdf`);
    } catch {
      setError('Failed to process PDF.');
    }
    setProcessing(false);
  };

  const faq = [
    { question: 'Can I undo a page selection?', answer: 'Yes. Click a selected page again to deselect it. Use the "Deselect All" button to clear all selections.' },
    { question: 'What happens to the remaining pages?', answer: 'All content, formatting, and structure of kept pages is preserved exactly as in the original PDF.' },
    { question: 'Is there a limit on file size?', answer: 'The tool works entirely in your browser. Very large PDFs may impact performance depending on your device memory.' },
  ];

  const relatedTools = [
    { name: 'PDF to Images', path: '/pdf-tools/pdf-to-images' },
    { name: 'Merge PDF', path: '/pdf-tools/merge-pdf' },
    { name: 'Split PDF', path: '/pdf-tools/split-pdf' },
  ];

  return (
    <ToolLayout title="PDF Page Remover" description="Remove unwanted pages from your PDF by selecting them from the thumbnail grid." faq={faq} relatedTools={relatedTools}>
      <FileUpload accept=".pdf" onFiles={handleFiles} label="Upload PDF File" maxSize={50 * 1024 * 1024} />

      {loading && (
        <div className="flex items-center gap-2 mt-4 text-text-secondary">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{status}</span>
        </div>
      )}

      {error && <p className="mt-3 text-sm text-error">{error}</p>}
      {status && !loading && !processing && <p className="mt-3 text-sm text-text-secondary">{status}</p>}

      {pages.length > 0 && (
        <>
          <Card className="mt-6 p-4">
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm" variant="secondary" onClick={selectAll}>
                <CheckSquare className="w-4 h-4" />
                Select All
              </Button>
              <Button size="sm" variant="secondary" onClick={deselectAll}>
                <Square className="w-4 h-4" />
                Deselect All
              </Button>
              <Button size="sm" variant="ghost" onClick={togglePreview}>
                {previewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {previewMode ? 'Hide Preview' : 'Preview Kept Pages'}
              </Button>
              <div className="ml-auto text-sm text-text-secondary">
                <span className="text-error font-medium">{removedCount}</span> selected to remove &middot; <span className="text-primary font-medium">{keptCount}</span> will remain
              </div>
            </div>
          </Card>

          {previewMode && (
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-text-primary mb-3">Pages That Will Remain ({keptCount})</h3>
              {keptPages.length === 0 ? (
                <p className="text-sm text-error">No pages will remain. Deselect some pages to keep at least one.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {keptPages.map(p => (
                    <span key={p.index} className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-medium">
                      Page {p.index + 1}
                    </span>
                  ))}
                </div>
              )}
            </Card>
          )}

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {pages.map((page, i) => {
              const isSelected = selectedToRemove.has(i);
              return (
                <Card key={i} hover={false} className={`p-2 cursor-pointer transition-all ${isSelected ? 'ring-2 ring-error bg-error/5 opacity-60' : 'hover:ring-2 hover:ring-primary/30'}`} onClick={() => togglePage(i)}>
                  <div className="relative">
                    <div className="aspect-[3/4] rounded border border-border bg-white flex items-center justify-center">
                      <span className="text-xs text-text-secondary font-mono">{i + 1}</span>
                    </div>
                    <div className={`absolute top-1 right-1 w-5 h-5 rounded flex items-center justify-center ${isSelected ? 'bg-error text-white' : 'bg-white border border-border'}`}>
                      {isSelected ? (
                        <Trash2 className="w-3 h-3" />
                      ) : (
                        <span className="text-xs text-text-secondary">{i + 1}</span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-text-secondary mt-1 text-center truncate">{Math.round(page.width)}×{Math.round(page.height)}</p>
                  <p className="text-xs text-center mt-0.5">{isSelected ? 'Will remove' : 'Keep'}</p>
                </Card>
              );
            })}
          </div>

          <div className="mt-6 flex items-center gap-4">
            <Button onClick={removePages} loading={processing} variant="danger" size="lg" disabled={removedCount === 0 || keptCount === 0}>
              <Trash2 className="w-4 h-4" />
              Remove Selected ({removedCount})
            </Button>
            <span className="text-sm text-text-secondary">
              {keptCount} page{keptCount !== 1 ? 's' : ''} will remain
            </span>
          </div>
        </>
      )}
    </ToolLayout>
  );
}
