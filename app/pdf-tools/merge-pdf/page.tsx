'use client';
import { useState, useCallback } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FileUpload } from '@/components/ui/FileUpload';
import { downloadFile } from '@/lib/utils/helpers';
import { validateFile } from '@/lib/utils/validation';
import { PDFDocument } from 'pdf-lib';
import { FileText, GripVertical, ChevronUp, ChevronDown, Loader2, Download } from 'lucide-react';

interface PdfFileInfo {
  file: File;
  buffer: ArrayBuffer;
  pageCount: number;
}

export default function MergePdfPage() {
  const [pdfs, setPdfs] = useState<PdfFileInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [merging, setMerging] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const handleFiles = useCallback(async (files: File[]) => {
    setError('');
    setStatus('');
    const infos: PdfFileInfo[] = [];
    setLoading(true);
    for (const f of files) {
      try {
        const buffer = await f.arrayBuffer();
        const doc = await PDFDocument.load(buffer);
        infos.push({ file: f, buffer, pageCount: doc.getPageCount() });
      } catch {
        setError(`Failed to read "${f.name}". Ensure it is a valid PDF.`);
      }
    }
    setPdfs(prev => [...prev, ...infos]);
    setLoading(false);
  }, []);

  const moveItem = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= pdfs.length) return;
    const updated = [...pdfs];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setPdfs(updated);
  };

  const removeItem = (index: number) => {
    setPdfs(prev => prev.filter((_, i) => i !== index));
  };

  const mergePdfs = async () => {
    if (pdfs.length < 2) { setError('Please upload at least 2 PDF files to merge.'); return; }
    setMerging(true);
    setStatus('Merging PDFs...');
    setError('');
    try {
      const mergedDoc = await PDFDocument.create();
      for (const pdf of pdfs) {
        const sourceDoc = await PDFDocument.load(pdf.buffer);
        const pageIndices = sourceDoc.getPageIndices();
        const copiedPages = await mergedDoc.copyPages(sourceDoc, pageIndices);
        for (const page of copiedPages) mergedDoc.addPage(page);
      }
      const mergedBytes = await mergedDoc.save();
      downloadFile(new Blob([mergedBytes as BlobPart], { type: 'application/pdf' }), 'merged.pdf');
      setStatus('PDFs merged successfully!');
    } catch {
      setError('Failed to merge PDFs. Please try again.');
    }
    setMerging(false);
  };

  const faq = [
    { question: 'How many PDFs can I merge?', answer: 'You can merge any number of PDF files. The only limit is your browser memory.' },
    { question: 'Will the merged PDF preserve formatting?', answer: 'Yes. pdf-lib preserves all content, fonts, and formatting from the original PDFs.' },
    { question: 'Can I reorder pages before merging?', answer: 'Yes. Use the arrow buttons to reorder entire PDF documents. For page-level reordering, use Split PDF or a dedicated tool.' },
  ];

  const relatedTools = [
    { name: 'PDF to Images', path: '/pdf-tools/pdf-to-images' },
    { name: 'Split PDF', path: '/pdf-tools/split-pdf' },
    { name: 'PDF Page Remover', path: '/pdf-tools/pdf-page-remover' },
  ];

  return (
    <ToolLayout title="Merge PDF" description="Combine multiple PDF files into a single document. Drag to reorder or use the arrow buttons." faq={faq} relatedTools={relatedTools}>
      <FileUpload accept=".pdf" multiple onFiles={handleFiles} label="Upload PDF Files" maxSize={50 * 1024 * 1024} />

      {loading && (
        <div className="flex items-center gap-2 mt-4 text-text-secondary">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Reading PDFs...</span>
        </div>
      )}

      {error && <p className="mt-3 text-sm text-error">{error}</p>}
      {status && <p className="mt-3 text-sm text-text-secondary">{status}</p>}

      {pdfs.length > 0 && (
        <>
          <div className="mt-6 space-y-2">
            {pdfs.map((pdf, i) => (
              <Card key={i} hover={false} className="p-3">
                <div className="flex items-center gap-3">
                  <GripVertical className="w-5 h-5 text-text-secondary shrink-0" />
                  <FileText className="w-5 h-5 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{pdf.file.name}</p>
                    <p className="text-xs text-text-secondary">{pdf.pageCount} page{pdf.pageCount !== 1 ? 's' : ''} | {(pdf.file.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="ghost" disabled={i === 0} onClick={() => moveItem(i, -1)}>
                      <ChevronUp className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" disabled={i === pdfs.length - 1} onClick={() => moveItem(i, 1)}>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => removeItem(i)} className="text-error hover:bg-error/10">
                      Remove
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-4">
            <Button onClick={mergePdfs} loading={merging} size="lg" disabled={pdfs.length < 2}>
              <Download className="w-4 h-4" />
              Merge {pdfs.length} PDFs
            </Button>
            <span className="text-sm text-text-secondary">
              Total: {pdfs.reduce((sum, p) => sum + p.pageCount, 0)} pages
            </span>
          </div>
        </>
      )}
    </ToolLayout>
  );
}
