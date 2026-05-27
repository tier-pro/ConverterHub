'use client';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FileUpload } from '@/components/ui/FileUpload';
import { Input } from '@/components/ui/Input';
import { readFileAsDataURL, downloadFile, loadImage } from '@/lib/utils/helpers';
import { validateFile } from '@/lib/utils/validation';
import { Download, Image as ImageIcon, RotateCw, FlipHorizontal, FlipVertical, Maximize2 } from 'lucide-react';

const ASPECT_RATIOS = [
  { label: 'Free', value: 'free', w: 0, h: 0 },
  { label: 'Square (1:1)', value: '1:1', w: 1, h: 1 },
  { label: '16:9', value: '16:9', w: 16, h: 9 },
  { label: '9:16', value: '9:16', w: 9, h: 16 },
  { label: '4:3', value: '4:3', w: 4, h: 3 },
  { label: '3:2', value: '3:2', w: 3, h: 2 },
];

export default function ImageCropperPage() {
  const [file, setFile] = useState<File | null>(null);
  const [dataUrl, setDataUrl] = useState('');
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [aspectRatio, setAspectRatio] = useState('free');
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [cropW, setCropW] = useState(200);
  const [cropH, setCropH] = useState(200);
  const [imgW, setImgW] = useState(0);
  const [imgH, setImgH] = useState(0);
  const [croppedUrl, setCroppedUrl] = useState('');
  const [canvasW, setCanvasW] = useState(600);
  const [canvasH, setCanvasH] = useState(400);
  const displayCanvasRef = useRef<HTMLCanvasElement>(null);
  const cropCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return;
    const f = files[0];
    const validation = validateFile(f, ['jpg', 'jpeg', 'png', 'webp', 'bmp', 'gif'], 10 * 1024 * 1024);
    if (!validation.valid) { alert(validation.error); return; }
    setFile(f);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setAspectRatio('free');
    setCroppedUrl('');
    const url = await readFileAsDataURL(f);
    setDataUrl(url);
    const img = await loadImage(url);
    setImage(img);
    const nw = img.naturalWidth;
    const nh = img.naturalHeight;
    setImgW(nw);
    setImgH(nh);
    const maxW = 600, maxH = 400;
    const scale = Math.min(maxW / nw, maxH / nh, 1);
    const dw = Math.round(nw * scale);
    const dh = Math.round(nh * scale);
    setCanvasW(dw);
    setCanvasH(dh);
    setCropX(0);
    setCropY(0);
    setCropW(Math.min(200, nw));
    setCropH(Math.min(200, nh));
  };

  const drawDisplay = useCallback(() => {
    if (!image || !displayCanvasRef.current) return;
    const canvas = displayCanvasRef.current;
    canvas.width = canvasW;
    canvas.height = canvasH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, canvasW, canvasH);
    ctx.save();
    ctx.translate(canvasW / 2, canvasH / 2);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.rotate((rotation * Math.PI) / 180);
    const swap = (rotation % 360) === 90 || (rotation % 360) === 270;
    const srcW = swap ? imgH : imgW;
    const srcH = swap ? imgW : imgH;
    const scale = Math.min(canvasW / srcW, canvasH / srcH, 1);
    const drawW = srcW * scale;
    const drawH = srcH * scale;
    ctx.drawImage(image, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();
  }, [image, canvasW, canvasH, imgW, imgH, flipH, flipV, rotation]);

  useEffect(() => { drawDisplay(); }, [drawDisplay]);

  const doCrop = useCallback(() => {
    if (!image || !cropCanvasRef.current || !displayCanvasRef.current) return;
    const srcCanvas = displayCanvasRef.current;
    const dstCanvas = cropCanvasRef.current;
    const w = Math.max(1, cropW);
    const h = Math.max(1, cropH);
    dstCanvas.width = w;
    dstCanvas.height = h;
    const ctx = dstCanvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(srcCanvas, Math.max(0, cropX), Math.max(0, cropY), w, h, 0, 0, w, h);
    const url = dstCanvas.toDataURL('image/png');
    if (url.length > 100) setCroppedUrl(url);
  }, [image, cropX, cropY, cropW, cropH, canvasW, canvasH]);

  useEffect(() => { if (image) doCrop(); }, [doCrop, image]);

  const applyAspectRatio = (value: string) => {
    setAspectRatio(value);
    if (value !== 'free') {
      const ratio = ASPECT_RATIOS.find((a) => a.value === value);
      if (ratio && ratio.w > 0 && ratio.h > 0) {
        setCropH(Math.round(cropW * (ratio.h / ratio.w)));
      }
    }
  };

  const handleDownload = () => {
    const canvas = cropCanvasRef.current;
    if (!canvas) return;
    const name = file ? file.name.replace(/\.[^.]+$/, '') : 'image';
    canvas.toBlob((blob) => {
      if (blob) downloadFile(blob, `${name}_cropped.png`);
    }, 'image/png');
  };

  const faq = [
    { question: 'What aspect ratio presets are available?', answer: 'Free, Square (1:1), 16:9, 9:16, 4:3, and 3:2.' },
    { question: 'Can I rotate the image before cropping?', answer: 'Yes, rotate by 90°/180°/270° and flip horizontally/vertically.' },
    { question: 'How does the coordinate system work?', answer: 'X/Y are measured from the top-left of the visible (transformed) canvas. The crop automatically maps to the correct pixels even after rotation.' },
  ];

  const relatedTools = [
    { name: 'Image Resizer', path: '/image-tools/image-resizer' },
    { name: 'Image Compressor', path: '/image-tools/image-compressor' },
    { name: 'Image Format Converter', path: '/image-tools/image-format-converter' },
  ];

  return (
    <ToolLayout title="Image Cropper" description="Crop, rotate, and flip images with aspect ratio presets and live preview." faq={faq} relatedTools={relatedTools}>
      <div className="space-y-6">
        <FileUpload accept="image/jpeg,image/png,image/webp,image/bmp,image/gif" maxSize={10 * 1024 * 1024} onFiles={handleFiles} label="Upload Image" />

        {image && (
          <>
            <div className="flex flex-wrap gap-3">
              {ASPECT_RATIOS.map((ar) => (
                <Button key={ar.value} size="sm" variant={aspectRatio === ar.value ? 'primary' : 'secondary'} onClick={() => applyAspectRatio(ar.value)}>
                  {ar.label}
                </Button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" onClick={() => setRotation((r) => (r + 90) % 360)}><RotateCw className="w-4 h-4" /> 90°</Button>
              <Button size="sm" variant="secondary" onClick={() => setRotation((r) => (r + 180) % 360)}>180°</Button>
              <Button size="sm" variant="secondary" onClick={() => setRotation((r) => (r + 270) % 360)}>270°</Button>
              <Button size="sm" variant={flipH ? 'primary' : 'secondary'} onClick={() => setFlipH((f) => !f)}><FlipHorizontal className="w-4 h-4" /> Flip H</Button>
              <Button size="sm" variant={flipV ? 'primary' : 'secondary'} onClick={() => setFlipV((f) => !f)}><FlipVertical className="w-4 h-4" /> Flip V</Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Input label="X Position" type="number" min={0} value={cropX} onChange={(e) => setCropX(Number(e.target.value))} />
              <Input label="Y Position" type="number" min={0} value={cropY} onChange={(e) => setCropY(Number(e.target.value))} />
              <Input label="Width" type="number" min={1} value={cropW} onChange={(e) => {
                const w = Number(e.target.value);
                setCropW(w);
                if (aspectRatio !== 'free') {
                  const ratio = ASPECT_RATIOS.find((a) => a.value === aspectRatio);
                  if (ratio && ratio.w > 0 && ratio.h > 0) setCropH(Math.round(w * (ratio.h / ratio.w)));
                }
              }} />
              <Input label="Height" type="number" min={1} value={cropH} onChange={(e) => {
                const h = Number(e.target.value);
                setCropH(h);
                if (aspectRatio !== 'free') {
                  const ratio = ASPECT_RATIOS.find((a) => a.value === aspectRatio);
                  if (ratio && ratio.w > 0 && ratio.h > 0) setCropW(Math.round(h * (ratio.w / ratio.h)));
                }
              }} />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <Card hover={false} className="p-4">
                <h3 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Source</h3>
                <div className="rounded-lg border border-border overflow-hidden bg-gray-50 dark:bg-slate-800 flex items-center justify-center" style={{ minHeight: 200 }}>
                  <canvas ref={displayCanvasRef} className="max-w-full max-h-[350px]" />
                </div>
                <p className="mt-1 text-xs text-text-secondary">{imgW} x {imgH} px (original)</p>
              </Card>
              <Card hover={false} className="p-4">
                <h3 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2"><Maximize2 className="w-4 h-4" /> Crop Preview</h3>
                <div className="rounded-lg border border-border overflow-hidden bg-gray-50 dark:bg-slate-800 flex items-center justify-center" style={{ minHeight: 200 }}>
                  <canvas ref={cropCanvasRef} className="max-w-full max-h-[350px]" />
                </div>
                {croppedUrl && (
                  <p className="mt-1 text-xs text-text-secondary">{cropCanvasRef.current?.width} x {cropCanvasRef.current?.height} px</p>
                )}
              </Card>
            </div>

            <div className="flex justify-center">
              <Button onClick={handleDownload} disabled={!croppedUrl}>
                <Download className="w-4 h-4" /> Download Cropped Image (PNG)
              </Button>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
