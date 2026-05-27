'use client';
import React, { useState, useCallback, useRef } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Upload, Download, Film, Loader2, AlertCircle, Play, Square } from 'lucide-react';

export default function VideoToGifClient() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [gifUrl, setGifUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [startTime, setStartTime] = useState(0);
  const [duration, setDuration] = useState(3);
  const [fps, setFps] = useState(10);
  const [gifWidth, setGifWidth] = useState(480);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith('video/')) { setError('Please upload a video file.'); return; }
    setFile(f);
    setError('');
    setGifUrl('');
    setProgress(0);
    setPreviewUrl(URL.createObjectURL(f));
  }, []);

  const generateGif = useCallback(async () => {
    if (!file || !videoRef.current) return;
    setLoading(true);
    setError('');
    setProgress(5);

    try {
      const video = videoRef.current;
      video.currentTime = startTime;
      await new Promise<void>((r) => { video.onseeked = () => r(); });

      const totalFrames = Math.ceil(duration * fps);
      const frameDelay = Math.round(1000 / fps);
      const scale = gifWidth / video.videoWidth;
      const height = Math.round(video.videoHeight * scale);
      const canvas = document.createElement('canvas');
      canvas.width = gifWidth;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;

      const GIF = (await import('gif.js')).default;
      const gif = new GIF({
        workers: 4,
        quality: 10,
        width: gifWidth,
        height,
        workerScript: '/gif.worker.js',
      });

      for (let i = 0; i < totalFrames; i++) {
        const t = startTime + (i / fps);
        video.currentTime = t;
        await new Promise<void>((r) => { video.onseeked = () => r(); });
        ctx.drawImage(video, 0, 0, gifWidth, height);
        gif.addFrame(ctx, { delay: frameDelay, copy: true });
        setProgress(Math.round((i + 1) / totalFrames * 95));
      }

      await new Promise<void>((resolve, reject) => {
        gif.on('progress', (p: number) => setProgress(95 + Math.round(p * 5)));
        gif.on('finished', (blob: Blob) => {
          setGifUrl(URL.createObjectURL(blob));
          resolve();
        });
        (gif as any).on('error', reject);
        gif.render();
      });

      setProgress(100);
    } catch (e) {
      setError('Failed to generate GIF. Try a shorter duration or lower resolution.');
    }
    setLoading(false);
  }, [file, startTime, duration, fps, gifWidth]);

  const handleDownload = () => {
    if (!gifUrl) return;
    const a = document.createElement('a');
    a.href = gifUrl;
    a.download = (file?.name.replace(/\.[^.]+$/, '') || 'video') + '.gif';
    a.click();
  };

  const faq = [
    { question: 'What video formats are supported?', answer: 'MP4, WebM, MOV, and AVI videos are supported. The video is processed entirely in your browser.' },
    { question: 'How long can the GIF be?', answer: 'We recommend 3-10 seconds. Longer durations produce large files and take more time to process.' },
    { question: 'Is there a watermark?', answer: 'No watermark, completely free with no limits.' },
  ];

  const relatedTools = [
    { name: 'Background Remover', path: '/image-tools/background-remover' },
    { name: 'Image Resizer', path: '/image-tools/image-resizer' },
    { name: 'Image to Base64', path: '/image-tools/image-to-base64' },
  ];

  return (
    <ToolLayout title="Video to GIF Maker" description="Convert any video clip to an animated GIF. Free, private, no watermark — all processing happens in your browser." faq={faq} relatedTools={relatedTools}>
      <div className="space-y-6">
        {!previewUrl ? (
          <div className="border-2 border-dashed border-border rounded-2xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer" onClick={() => document.getElementById('gif-file-input')?.click()}>
            <Film className="w-12 h-12 mx-auto text-text-secondary mb-4" />
            <p className="text-text-primary font-medium">Upload a video to convert to GIF</p>
            <p className="text-text-secondary text-sm mt-1">MP4, WebM, MOV — Max 50MB</p>
            <input id="gif-file-input" type="file" accept="video/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <Card hover={false} className="p-3">
              <h3 className="text-sm font-semibold text-text-primary mb-2 text-center">Preview</h3>
              <video ref={videoRef} src={previewUrl} controls className="w-full rounded-lg max-h-72" />
            </Card>
            <Card hover={false} className="p-3">
              <h3 className="text-sm font-semibold text-text-primary mb-2 text-center">GIF Result</h3>
              {gifUrl ? (
                <img src={gifUrl} alt="Generated GIF" className="w-full rounded-lg max-h-72 mx-auto" />
              ) : (
                <div className="flex items-center justify-center h-48 text-text-secondary text-sm">Generated GIF will appear here</div>
              )}
            </Card>
          </div>
        )}

        {previewUrl && !loading && (
          <div className="grid gap-4 sm:grid-cols-4">
            <Input label="Start (seconds)" type="number" min="0" step="0.5" value={String(startTime)} onChange={(e) => setStartTime(Number(e.target.value))} />
            <Input label="Duration (seconds)" type="number" min="0.5" max="30" step="0.5" value={String(duration)} onChange={(e) => setDuration(Number(e.target.value))} />
            <Input label="Frames per sec" type="number" min="1" max="30" value={String(fps)} onChange={(e) => setFps(Number(e.target.value))} />
            <Input label="Width (px)" type="number" min="100" max="1920" step="10" value={String(gifWidth)} onChange={(e) => setGifWidth(Number(e.target.value))} />
          </div>
        )}

        {error && <div className="flex items-center gap-2 text-sm text-error bg-error/10 rounded-lg p-3"><AlertCircle className="w-4 h-4" />{error}</div>}

        {loading && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-text-secondary"><Loader2 className="w-4 h-4 animate-spin" />Generating GIF... {progress}%</div>
            <div className="w-full bg-border rounded-full h-2"><div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} /></div>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          {previewUrl && !gifUrl && !loading && <Button onClick={generateGif}><Play className="w-4 h-4" /> Generate GIF</Button>}
          {previewUrl && <Button variant="secondary" onClick={() => { setPreviewUrl(''); setGifUrl(''); setFile(null); setProgress(0); }}>Choose Another</Button>}
          {gifUrl && <Button onClick={handleDownload}><Download className="w-4 h-4" /> Download GIF</Button>}
        </div>
      </div>
    </ToolLayout>
  );
}
