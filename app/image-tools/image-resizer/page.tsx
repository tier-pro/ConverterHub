'use client';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FileUpload } from '@/components/ui/FileUpload';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { readFileAsDataURL, downloadFile, loadImage } from '@/lib/utils/helpers';
import { validateFile } from '@/lib/utils/validation';
import { Lock, Unlock, Download, Image as ImageIcon, Maximize2 } from 'lucide-react';

type ResizeMode = 'percentage' | 'width' | 'height' | 'custom';
type PresetKey = '' | 'instagram' | 'facebook' | 'twitter' | 'profile64' | 'profile128' | 'profile256' | 'thumbnail';

const PRESETS: Record<string, { label: string; w: number; h: number }> = {
  instagram: { label: 'Instagram (1080x1080)', w: 1080, h: 1080 },
  facebook: { label: 'Facebook (1200x630)', w: 1200, h: 630 },
  twitter: { label: 'Twitter (1200x675)', w: 1200, h: 675 },
  profile64: { label: 'Profile (64x64)', w: 64, h: 64 },
  profile128: { label: 'Profile (128x128)', w: 128, h: 128 },
  profile256: { label: 'Profile (256x256)', w: 256, h: 256 },
  thumbnail: { label: 'Thumbnail (150x150)', w: 150, h: 150 },
};

export default function ImageResizerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [dataUrl, setDataUrl] = useState<string>('');
  const [originalImg, setOriginalImg] = useState<HTMLImageElement | null>(null);
  const [resizedDataUrl, setResizedDataUrl] = useState<string>('');
  const [resizedW, setResizedW] = useState(0);
  const [resizedH, setResizedH] = useState(0);
  const [mode, setMode] = useState<ResizeMode>('percentage');
  const [percent, setPercent] = useState(100);
  const [targetW, setTargetW] = useState(800);
  const [targetH, setTargetH] = useState(600);
  const [locked, setLocked] = useState(true);
  const [preset, setPreset] = useState<PresetKey>('');
  const workCanvasRef = useRef<HTMLCanvasElement>(null);

  const doResize = useCallback(async () => {
    if (!originalImg) return;
    let w = originalImg.naturalWidth;
    let h = originalImg.naturalHeight;
    if (mode === 'percentage') {
      w = Math.round(w * (percent / 100));
      h = Math.round(h * (percent / 100));
    } else if (mode === 'width') {
      h = Math.round(targetW * (originalImg.naturalHeight / originalImg.naturalWidth));
      w = targetW;
    } else if (mode === 'height') {
      w = Math.round(targetH * (originalImg.naturalWidth / originalImg.naturalHeight));
      h = targetH;
    } else {
      w = targetW;
      h = targetH;
    }
    w = Math.max(1, w);
    h = Math.max(1, h);
    setResizedW(w);
    setResizedH(h);
    const canvas = workCanvasRef.current;
    if (!canvas) return;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(originalImg, 0, 0, w, h);
    setResizedDataUrl(canvas.toDataURL('image/png'));
  }, [originalImg, mode, percent, targetW, targetH]);

  useEffect(() => { doResize(); }, [doResize]);

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return;
    const f = files[0];
    const validation = validateFile(f, ['jpg', 'jpeg', 'png', 'webp'], 10 * 1024 * 1024);
    if (!validation.valid) { alert(validation.error); return; }
    setFile(f);
    const url = await readFileAsDataURL(f);
    setDataUrl(url);
    const img = await loadImage(url);
    setOriginalImg(img);
    setTargetW(img.naturalWidth);
    setTargetH(img.naturalHeight);
    setPreset('');
    setPercent(100);
    setMode('percentage');
    setResizedDataUrl('');
  };

  const handlePreset = (val: string) => {
    setPreset(val as PresetKey);
    if (!val) return;
    const p = PRESETS[val];
    if (p) {
      setMode('custom');
      setTargetW(p.w);
      setTargetH(p.h);
    }
  };

  const handleDownload = () => {
    if (!originalImg || !workCanvasRef.current) return;
    const name = file ? file.name.replace(/\.[^.]+$/, '') : 'image';
    const canvas = workCanvasRef.current;
    canvas.toBlob((blob) => {
      if (blob) downloadFile(blob, `${name}_resized.png`);
    }, 'image/png');
  };

  const toggleLock = () => {
    if (locked && originalImg) {
      const ratio = originalImg.naturalWidth / originalImg.naturalHeight;
      setTargetH(Math.round(targetW / ratio));
    }
    setLocked(!locked);
  };

  const handleWidthChange = (v: number) => {
    setTargetW(v);
    if (locked && originalImg) {
      const ratio = originalImg.naturalWidth / originalImg.naturalHeight;
      setTargetH(v > 0 ? Math.round(v / ratio) : 0);
    }
  };

  const handleHeightChange = (v: number) => {
    setTargetH(v);
    if (locked && originalImg) {
      const ratio = originalImg.naturalWidth / originalImg.naturalHeight;
      setTargetW(v > 0 ? Math.round(v * ratio) : 0);
    }
  };

  const faq = [
    { question: 'What image formats are supported?', answer: 'We support JPG, PNG, and WEBP input images. The resized image is downloaded as PNG.' },
    { question: 'What is the maximum file size?', answer: 'You can upload images up to 10MB in size.' },
    { question: 'How does the aspect ratio lock work?', answer: 'When locked, changing either width or height automatically adjusts the other dimension to maintain the original aspect ratio.' },
    { question: 'Can I use preset sizes for social media?', answer: 'Yes, we provide preset sizes for Instagram, Facebook, Twitter, profile pictures, and thumbnails.' },
  ];

  const relatedTools = [
    { name: 'Image Compressor', path: '/image-tools/image-compressor' },
    { name: 'Image Format Converter', path: '/image-tools/image-format-converter' },
    { name: 'Image Cropper', path: '/image-tools/image-cropper' },
    { name: 'Image to Base64', path: '/image-tools/image-to-base64' },
  ];

  return (
    <ToolLayout title="Image Resizer" description="Resize your images to exact dimensions, percentages, or use preset sizes for social media." faq={faq} relatedTools={relatedTools}>
      <div className="space-y-6">
        <FileUpload accept="image/jpeg,image/png,image/webp" maxSize={10 * 1024 * 1024} onFiles={handleFiles} label="Upload Image" />

        <canvas ref={workCanvasRef} className="hidden" />

        {file && originalImg && (
          <>
            <div className="flex flex-wrap gap-3">
              <Select
                label="Resize Mode"
                value={mode}
                onChange={(e) => { setMode(e.target.value as ResizeMode); setPreset(''); }}
                options={[
                  { value: 'percentage', label: 'Percentage' },
                  { value: 'width', label: 'Width (px)' },
                  { value: 'height', label: 'Height (px)' },
                  { value: 'custom', label: 'Custom' },
                ]}
              />
              <div className="flex-1 min-w-[200px]">
                <Select
                  label="Preset Sizes"
                  value={preset}
                  onChange={(e) => handlePreset(e.target.value)}
                  options={[
                    { value: '', label: 'None' },
                    ...Object.entries(PRESETS).map(([k, v]) => ({ value: k, label: v.label })),
                  ]}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {mode === 'percentage' && (
                <div className="col-span-2">
                  <Input label={`Percentage (${percent}%)`} type="range" min={1} max={200} value={percent} onChange={(e) => setPercent(Number(e.target.value))} className="w-full" />
                </div>
              )}
              {(mode === 'width' || mode === 'custom') && (
                <div className="flex items-end gap-2">
                  <Input label="Width (px)" type="number" min={1} value={targetW} onChange={(e) => handleWidthChange(Number(e.target.value))} className="flex-1" />
                  <button onClick={toggleLock} className="mb-1.5 p-2 rounded-lg border border-border hover:bg-gray-50 dark:hover:bg-slate-700" title={locked ? 'Unlock aspect ratio' : 'Lock aspect ratio'}>
                    {locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  </button>
                </div>
              )}
              {(mode === 'height' || mode === 'custom') && (
                <Input label="Height (px)" type="number" min={1} value={targetH} onChange={(e) => handleHeightChange(Number(e.target.value))} />
              )}
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <Card hover={false} className="p-4">
                <h3 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Original</h3>
                <div className="rounded-lg border border-border overflow-hidden bg-gray-50 dark:bg-slate-800 flex items-center justify-center" style={{ minHeight: 200 }}>
                  <img src={dataUrl} alt="Original" className="max-w-full max-h-[300px] object-contain" />
                </div>
                <p className="mt-2 text-xs text-text-secondary">{originalImg.naturalWidth} x {originalImg.naturalHeight} px</p>
              </Card>
              <Card hover={false} className="p-4">
                <h3 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2"><Maximize2 className="w-4 h-4" /> Preview</h3>
                <div className="rounded-lg border border-border overflow-hidden bg-gray-50 dark:bg-slate-800 flex items-center justify-center" style={{ minHeight: 200 }}>
                  {resizedDataUrl ? (
                    <img src={resizedDataUrl} alt="Preview" className="max-w-full max-h-[300px] object-contain" />
                  ) : (
                    <span className="text-xs text-text-secondary">Processing...</span>
                  )}
                </div>
                {resizedDataUrl && (
                  <p className="mt-2 text-xs text-text-secondary">
                    {resizedW} x {resizedH} px
                    &nbsp;({originalImg.naturalWidth}x{originalImg.naturalHeight} px → {resizedW}x{resizedH} px)
                  </p>
                )}
              </Card>
            </div>

            <div className="flex justify-center">
              <Button onClick={handleDownload} disabled={!resizedDataUrl}>
                <Download className="w-4 h-4" /> Download Resized Image (PNG)
              </Button>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
