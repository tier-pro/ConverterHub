'use client';
import React, { useState, useCallback } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FileUpload } from '@/components/ui/FileUpload';
import { readFileAsDataURL, downloadFile } from '@/lib/utils/helpers';
import { validateFile } from '@/lib/utils/validation';
import { Download, Image as ImageIcon, X } from 'lucide-react';

interface CompressedItem {
  file: File;
  dataUrl: string;
  quality: number;
  outputFormat: 'jpeg' | 'webp';
  compressedBlob: Blob | null;
  compressedUrl: string;
  originalSize: number;
  compressedSize: number;
}

function getOutputFormat(fileType: string): 'jpeg' | 'webp' {
  return fileType === 'image/webp' ? 'webp' : 'jpeg';
}

async function compressImageFile(item: CompressedItem): Promise<CompressedItem> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) { resolve(item); return; }

      if (item.file.type === 'image/png') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);

      const mimeType = item.outputFormat === 'webp' ? 'image/webp' : 'image/jpeg';

      const tryQuality = (q: number, done: (b: Blob) => void) => {
        canvas.toBlob((b) => { if (b) done(b); }, mimeType, q / 100);
      };

      tryQuality(item.quality, (blob) => {
        if (blob.size < item.originalSize) {
          const url = URL.createObjectURL(blob);
          resolve({ ...item, compressedBlob: blob, compressedUrl: url, compressedSize: blob.size });
        } else {
          const halfQ = Math.floor(item.quality / 2);
          tryQuality(Math.max(10, halfQ), (blob2) => {
            const url = URL.createObjectURL(blob2);
            resolve({ ...item, compressedBlob: blob2, compressedUrl: url, compressedSize: blob2.size });
          });
        }
      });
    };
    img.onerror = () => resolve(item);
    img.src = item.dataUrl;
  });
}

export default function ImageCompressorPage() {
  const [items, setItems] = useState<CompressedItem[]>([]);
  const [globalQuality, setGlobalQuality] = useState(60);

  const handleFiles = async (files: File[]) => {
    const valid: File[] = [];
    for (const f of files) {
      const validation = validateFile(f, ['jpg', 'jpeg', 'png', 'webp'], 10 * 1024 * 1024);
      if (validation.valid) valid.push(f);
    }
    if (valid.length === 0) return;
    const newItems: CompressedItem[] = [];
    for (const f of valid) {
      const url = await readFileAsDataURL(f);
      newItems.push({
        file: f, dataUrl: url, quality: globalQuality,
        outputFormat: getOutputFormat(f.type),
        compressedBlob: null, compressedUrl: '',
        originalSize: f.size, compressedSize: 0,
      });
    }
    const combined = [...items, ...newItems].slice(0, 10);
    setItems(combined);
    for (let i = 0; i < combined.length; i++) {
      if (!combined[i].compressedBlob) {
        combined[i] = await compressImageFile(combined[i]);
        setItems([...combined]);
      }
    }
  };

  const handleQualityChange = async (index: number, q: number) => {
    const updated = [...items];
    updated[index] = { ...updated[index], quality: q, compressedBlob: null, compressedUrl: '' };
    setItems(updated);
    updated[index] = await compressImageFile(updated[index]);
    setItems([...updated]);
  };

  const removeItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  const handleDownload = (item: CompressedItem) => {
    if (!item.compressedBlob) return;
    const name = item.file.name.replace(/\.[^.]+$/, '');
    downloadFile(item.compressedBlob, `${name}_compressed.${item.outputFormat}`);
  };

  const faq = [
    { question: 'Why did my file get bigger?', answer: 'PNG images or already-optimized JPEGs can grow when re-encoded. PNGs are converted to JPEG for actual compression. If still larger, quality is automatically reduced.' },
    { question: 'What output formats are used?', answer: 'PNG images convert to JPEG. WebP stays WebP. Others convert to JPEG.' },
    { question: 'What quality should I use?', answer: '60% is default. For photos 50-70% works well. Try 30-40% for maximum compression.' },
  ];

  const relatedTools = [
    { name: 'Image Resizer', path: '/image-tools/image-resizer' },
    { name: 'Image Format Converter', path: '/image-tools/image-format-converter' },
    { name: 'Image Cropper', path: '/image-tools/image-cropper' },
  ];

  return (
    <ToolLayout title="Image Compressor" description="Compress images by converting to JPEG or WebP with adjustable quality." faq={faq} relatedTools={relatedTools}>
      <div className="space-y-6">
        <FileUpload accept="image/jpeg,image/png,image/webp" maxSize={10 * 1024 * 1024} multiple onFiles={handleFiles} label="Upload Images" />

        {items.length > 0 && (
          <div>
            <label className="label-text">Global Quality: {globalQuality}%</label>
            <input type="range" min={5} max={95} value={globalQuality} onChange={(e) => {
              const q = Number(e.target.value);
              setGlobalQuality(q);
              items.forEach((_, i) => handleQualityChange(i, q));
            }} className="w-full" />
            <div className="flex justify-between text-xs text-text-secondary mt-1"><span>Smaller file</span><span>Better quality</span></div>
          </div>
        )}

        <div className="space-y-4">
          {items.map((item, i) => {
            const savings = item.originalSize > 0 && item.compressedSize > 0
              ? ((1 - item.compressedSize / item.originalSize) * 100).toFixed(1) : '0';
            const isSmaller = item.compressedSize < item.originalSize;

            return (
              <Card key={i} hover={false} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <ImageIcon className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-sm font-medium text-text-primary truncate">{item.file.name}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono">→ .{item.outputFormat}</span>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => removeItem(i)}><X className="w-4 h-4" /></Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-text-secondary mb-1">Original</p>
                    <div className="rounded-lg border border-border overflow-hidden bg-gray-50 dark:bg-slate-800 flex items-center justify-center h-40">
                      <img src={item.dataUrl} alt="Original" className="max-w-full max-h-full object-contain" />
                    </div>
                    <p className="mt-1 text-xs text-text-secondary">{(item.originalSize / 1024).toFixed(1)} KB</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary mb-1">Compressed ({item.outputFormat.toUpperCase()})</p>
                    <div className="rounded-lg border border-border overflow-hidden bg-gray-50 dark:bg-slate-800 flex items-center justify-center h-40">
                      {item.compressedUrl ? (
                        <img src={item.compressedUrl} alt="Compressed" className="max-w-full max-h-full object-contain" />
                      ) : (
                        <div className="flex items-center gap-2 text-text-secondary">
                          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          <span className="text-xs">Compressing...</span>
                        </div>
                      )}
                    </div>
                    {item.compressedBlob && (
                      <div className="mt-1 space-y-1">
                        <p className="text-xs text-text-secondary">{(item.compressedSize / 1024).toFixed(1)} KB</p>
                        <p className={`text-xs font-medium ${isSmaller ? 'text-green-600' : 'text-red-500'}`}>
                          {isSmaller ? `-${savings}%` : `+${Math.abs(parseFloat(savings))}% (auto-reduced)`}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-xs text-text-secondary">Quality: {item.quality}%</label>
                    <input type="range" min={5} max={95} value={item.quality} onChange={(e) => handleQualityChange(i, Number(e.target.value))} className="w-full" />
                  </div>
                  <Button size="sm" onClick={() => handleDownload(item)} disabled={!item.compressedBlob}>
                    <Download className="w-4 h-4" /> Download
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </ToolLayout>
  );
}
