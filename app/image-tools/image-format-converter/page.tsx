'use client';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FileUpload } from '@/components/ui/FileUpload';
import { Select } from '@/components/ui/Select';
import { readFileAsDataURL, downloadFile, loadImage } from '@/lib/utils/helpers';
import { validateFile } from '@/lib/utils/validation';
import { Download, Image as ImageIcon, RefreshCw } from 'lucide-react';

const INPUT_FORMATS = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp', 'image/gif'];
const OUTPUT_FORMATS = [
  { value: 'image/jpeg', label: 'JPEG (.jpg)', lossy: true },
  { value: 'image/png', label: 'PNG (.png)', lossy: false },
  { value: 'image/webp', label: 'WEBP (.webp)', lossy: true },
  { value: 'image/bmp', label: 'BMP (.bmp)', lossy: false },
  { value: 'image/gif', label: 'GIF (.gif)', lossy: false },
];

const FORMAT_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/bmp': 'bmp',
  'image/gif': 'gif',
};

export default function ImageFormatConverterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [dataUrl, setDataUrl] = useState('');
  const [outputFormat, setOutputFormat] = useState('image/png');
  const [quality, setQuality] = useState(90);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [convertedUrl, setConvertedUrl] = useState('');
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const currentFormat = OUTPUT_FORMATS.find((f) => f.value === outputFormat);

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return;
    const f = files[0];
    const validation = validateFile(f, ['jpg', 'jpeg', 'png', 'webp', 'bmp', 'gif'], 10 * 1024 * 1024);
    if (!validation.valid) { alert(validation.error); return; }
    setFile(f);
    setConvertedUrl('');
    setConvertedBlob(null);
    const url = await readFileAsDataURL(f);
    setDataUrl(url);
  };

  const handleConvert = useCallback(async () => {
    if (!file || !dataUrl) return;
    const img = await loadImage(dataUrl);
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (outputFormat === 'image/jpeg') {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, 0, 0);

    const mimeType = outputFormat;
    const q = currentFormat?.lossy ? quality / 100 : undefined;
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob((b) => resolve(b), mimeType, q));
    if (!blob) return;
    setConvertedBlob(blob);
    setConvertedUrl(URL.createObjectURL(blob));
  }, [file, dataUrl, outputFormat, quality, bgColor, currentFormat]);

  useEffect(() => { if (file && dataUrl) handleConvert(); }, [handleConvert]);

  const handleDownload = () => {
    if (!convertedBlob) return;
    const name = file ? file.name.replace(/\.[^.]+$/, '') : 'image';
    const ext = FORMAT_EXT[outputFormat] || 'png';
    downloadFile(convertedBlob, `${name}.${ext}`);
  };

  const faq = [
    { question: 'What input formats are supported?', answer: 'We accept JPEG, PNG, WEBP, BMP, and GIF images.' },
    { question: 'What output formats are available?', answer: 'You can convert to JPEG, PNG, WEBP, BMP, and GIF formats.' },
    { question: 'Why do I need a background color for JPEG output?', answer: 'JPEG does not support transparency. If your source image has transparent areas, a background color fills those areas.' },
    { question: 'What is the quality slider for?', answer: 'The quality slider applies to lossy formats (JPEG, WEBP). Higher values give better quality but larger file sizes.' },
  ];

  const relatedTools = [
    { name: 'Image Resizer', path: '/image-tools/image-resizer' },
    { name: 'Image Compressor', path: '/image-tools/image-compressor' },
    { name: 'Image Cropper', path: '/image-tools/image-cropper' },
    { name: 'Image to Base64', path: '/image-tools/image-to-base64' },
  ];

  return (
    <ToolLayout title="Image Format Converter" description="Convert images between JPEG, PNG, WEBP, BMP, and GIF formats with customizable quality and background color." faq={faq} relatedTools={relatedTools}>
      <div className="space-y-6">
        <canvas ref={canvasRef} className="hidden" />

        <FileUpload accept="image/jpeg,image/png,image/webp,image/bmp,image/gif" maxSize={10 * 1024 * 1024} onFiles={handleFiles} label="Upload Image" />

        {file && dataUrl && (
          <>
            <div className="flex flex-wrap gap-4">
              <Select
                label="Output Format"
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
                options={OUTPUT_FORMATS.map((f) => ({ value: f.value, label: f.label }))}
              />
              {currentFormat?.lossy && (
                <div className="flex-1 min-w-[200px]">
                  <label className="label-text">Quality: {quality}%</label>
                  <input type="range" min={1} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full" />
                </div>
              )}
              {outputFormat === 'image/jpeg' && (
                <div>
                  <label className="label-text">Background Color</label>
                  <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-10 w-20 rounded-lg border border-border cursor-pointer" />
                </div>
              )}
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <Card hover={false} className="p-4">
                <h3 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Original</h3>
                <div className="rounded-lg border border-border overflow-hidden bg-gray-50 dark:bg-slate-800 flex items-center justify-center h-48">
                  <img src={dataUrl} alt="Original" className="max-w-full max-h-full object-contain" />
                </div>
                <p className="mt-2 text-xs text-text-secondary">{file.name} ({(file.size / 1024).toFixed(1)} KB)</p>
              </Card>
              <Card hover={false} className="p-4">
                <h3 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2"><RefreshCw className="w-4 h-4" /> Converted</h3>
                <div className="rounded-lg border border-border overflow-hidden bg-gray-50 dark:bg-slate-800 flex items-center justify-center h-48">
                  {convertedUrl ? (
                    <img src={convertedUrl} alt="Converted" className="max-w-full max-h-full object-contain" />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full text-text-secondary text-sm">Converting...</div>
                  )}
                </div>
                {convertedBlob && (
                  <p className="mt-2 text-xs text-text-secondary">
                    {FORMAT_EXT[outputFormat]?.toUpperCase()} ({(convertedBlob.size / 1024).toFixed(1)} KB)
                  </p>
                )}
              </Card>
            </div>

            <div className="flex justify-center">
              <Button onClick={handleDownload} disabled={!convertedBlob}>
                <Download className="w-4 h-4" /> Download Converted Image
              </Button>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
