'use client';
import React, { useState, useCallback } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { Upload, Download, Loader2, Wand2, AlertCircle, CheckCircle } from 'lucide-react';

export default function BackgroundRemoverClient() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [resultUrl, setResultUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [copied, copy] = useCopyToClipboard();

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith('image/')) { setError('Please upload an image file.'); return; }
    setFile(f);
    setError('');
    setResultUrl('');
    setProgress(0);
    setPreviewUrl(URL.createObjectURL(f));
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const removeBg = useCallback(async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setProgress(10);
    try {
      // @ts-expect-error - CDN import with webpackIgnore
      const { removeBackground } = await import(/* webpackIgnore: true */ 'https://esm.sh/@imgly/background-removal@1.7.0?bundle');
      setProgress(30);
      const blob = await removeBackground(file, { progress: (p: number) => setProgress(30 + p * 60) });
      setProgress(95);
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      setProgress(100);
    } catch (e) {
      setError('Failed to remove background. Error: ' + (e instanceof Error ? e.message : 'Unknown'));
      console.error('Background removal error:', e);
    }
    setLoading(false);
  }, [file]);

  const handleDownload = () => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = (file?.name.replace(/\.[^.]+$/, '') || 'image') + '_no-bg.png';
    a.click();
  };

  const faq = [
    { question: 'How does the background remover work?', answer: 'It uses a neural network running entirely in your browser via WebAssembly. No image data is ever sent to any server.' },
    { question: 'What image formats are supported?', answer: 'JPEG, PNG, WebP, and BMP. The result is always PNG with transparency.' },
    { question: 'Does it work on mobile?', answer: 'Yes, but on slower devices the initial model download (~8MB) and processing may take longer.' },
  ];

  const relatedTools = [
    { name: 'Image Resizer', path: '/image-tools/image-resizer' },
    { name: 'Image Compressor', path: '/image-tools/image-compressor' },
    { name: 'Video to GIF', path: '/image-tools/video-to-gif' },
  ];

  return (
    <ToolLayout title="Background Remover" description="Remove image backgrounds instantly using AI - 100% free, private, and runs entirely in your browser." faq={faq} relatedTools={relatedTools}>
      <div className="space-y-6">
        {!previewUrl ? (
          <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} className="border-2 border-dashed border-border rounded-2xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer" onClick={() => document.getElementById('bg-file-input')?.click()}>
            <Upload className="w-12 h-12 mx-auto text-text-secondary mb-4" />
            <p className="text-text-primary font-medium">Drop an image here or click to browse</p>
            <p className="text-text-secondary text-sm mt-1">JPEG, PNG, WebP - Max 10MB</p>
            <input id="bg-file-input" type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            <Card hover={false} className="p-3">
              <h3 className="text-sm font-semibold text-text-primary mb-2 text-center">Original</h3>
              <img src={previewUrl} alt="Original" className="w-full h-auto rounded-lg max-h-80 object-contain mx-auto" />
            </Card>
            <Card hover={false} className="p-3">
              <h3 className="text-sm font-semibold text-text-primary mb-2 text-center">Result</h3>
              {resultUrl ? (
                <img src={resultUrl} alt="Background removed" className="w-full h-auto rounded-lg max-h-80 object-contain mx-auto" style={{ backgroundImage: 'repeating-conic-gradient(#c0c0c0 0% 25%, #fff 0% 50%) 50%/16px 16px' }} />
              ) : (
                <div className="flex items-center justify-center h-60 text-text-secondary text-sm">Result will appear here</div>
              )}
            </Card>
          </div>
        )}

        {error && <div className="flex items-center gap-2 text-sm text-error bg-error/10 rounded-lg p-3"><AlertCircle className="w-4 h-4" />{error}</div>}

        {loading && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-text-secondary"><Loader2 className="w-4 h-4 animate-spin" />Processing... {Math.round(progress)}%</div>
            <div className="w-full bg-border rounded-full h-2"><div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} /></div>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          {previewUrl && !resultUrl && !loading && (
            <Button onClick={removeBg}><Wand2 className="w-4 h-4" /> Remove Background</Button>
          )}
          {previewUrl && <Button variant="secondary" onClick={() => { setPreviewUrl(''); setResultUrl(''); setFile(null); setProgress(0); }}>Choose Another</Button>}
          {resultUrl && <Button onClick={handleDownload}><Download className="w-4 h-4" /> Download PNG</Button>}
          {resultUrl && <Button variant="ghost" onClick={() => copy(resultUrl)}>{copied ? <CheckCircle className="w-4 h-4" /> : <Upload className="w-4 h-4" />} Copy Image</Button>}
        </div>
      </div>
    </ToolLayout>
  );
}
