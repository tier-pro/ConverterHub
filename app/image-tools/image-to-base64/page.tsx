'use client';
import React, { useState, useCallback } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FileUpload } from '@/components/ui/FileUpload';
import { readFileAsDataURL, downloadFile, loadImage } from '@/lib/utils/helpers';
import { validateFile } from '@/lib/utils/validation';
import { Copy, Check, Download, Image as ImageIcon, ArrowRight, ArrowLeft } from 'lucide-react';

export default function ImageToBase64Page() {
  const [file, setFile] = useState<File | null>(null);
  const [dataUrl, setDataUrl] = useState('');
  const [base64Str, setBase64Str] = useState('');
  const [copied, setCopied] = useState(false);
  const [reverseInput, setReverseInput] = useState('');
  const [reverseImageUrl, setReverseImageUrl] = useState('');
  const [reverseError, setReverseError] = useState('');

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return;
    const f = files[0];
    const validation = validateFile(f, ['jpg', 'jpeg', 'png', 'webp', 'bmp', 'gif', 'svg'], 10 * 1024 * 1024);
    if (!validation.valid) { alert(validation.error); return; }
    setFile(f);
    const url = await readFileAsDataURL(f);
    setDataUrl(url);
    setBase64Str(url);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(base64Str);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = base64Str;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadTxt = () => {
    if (!base64Str) return;
    const name = file ? file.name.replace(/\.[^.]+$/, '') : 'image';
    downloadFile(base64Str, `${name}_base64.txt`, 'text/plain');
  };

  const handleReverseConvert = useCallback(async () => {
    setReverseError('');
    setReverseImageUrl('');
    const str = reverseInput.trim();
    if (!str) { setReverseError('Please paste a Base64 string.'); return; }
    if (!str.startsWith('data:image/')) {
      setReverseError('Invalid data URL. Must start with "data:image/...".');
      return;
    }
    try {
      await loadImage(str);
      setReverseImageUrl(str);
    } catch {
      setReverseError('Could not decode the Base64 string as an image.');
    }
  }, [reverseInput]);

  const faq = [
    { question: 'What is Base64 encoding?', answer: 'Base64 is an encoding scheme that converts binary data (like images) into ASCII text format, making it safe for text-based protocols like JSON or HTML.' },
    { question: 'What is the maximum file size?', answer: 'You can upload images up to 10MB. Note that Base64 strings are about 33% larger than the original binary file.' },
    { question: 'How do I use the reverse conversion?', answer: 'Paste a data URL (starting with "data:image/...") into the textarea and click "Convert to Image" to see the decoded image.' },
    { question: 'Where is Base64 used?', answer: 'Base64 is commonly used for embedding images in HTML/CSS, JSON APIs, and email attachments.' },
  ];

  const relatedTools = [
    { name: 'Image Resizer', path: '/image-tools/image-resizer' },
    { name: 'Image Compressor', path: '/image-tools/image-compressor' },
    { name: 'Image Format Converter', path: '/image-tools/image-format-converter' },
    { name: 'Image Cropper', path: '/image-tools/image-cropper' },
  ];

  return (
    <ToolLayout title="Image to Base64" description="Convert images to Base64 data URLs and decode Base64 strings back to viewable images." faq={faq} relatedTools={relatedTools}>
      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2"><ArrowRight className="w-5 h-5" /> Image → Base64</h2>
          <FileUpload accept="image/*" maxSize={10 * 1024 * 1024} onFiles={handleFiles} label="Upload Image" />

          {file && base64Str && (
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-4">
                <div className="rounded-lg border border-border overflow-hidden bg-gray-50 dark:bg-slate-800 flex items-center justify-center" style={{ width: 120, height: 120 }}>
                  <img src={dataUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                </div>
                <div className="text-sm text-text-secondary">
                  <p>File: <span className="font-medium text-text-primary">{file.name}</span></p>
                  <p>Size: <span className="font-medium text-text-primary">{(file.size / 1024).toFixed(1)} KB</span></p>
                  <p>Base64 length: <span className="font-medium text-text-primary">{base64Str.length.toLocaleString()} chars</span></p>
                </div>
              </div>

              <div>
                <label className="label-text">Base64 Data URL</label>
                <textarea
                  className="input-field min-h-[120px] w-full font-mono text-xs resize-y"
                  value={base64Str}
                  readOnly
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <Button onClick={handleCopy}>
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy to Clipboard'}
                </Button>
                <Button variant="secondary" onClick={handleDownloadTxt}>
                  <Download className="w-4 h-4" /> Download as .txt
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-border pt-8">
          <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2"><ArrowLeft className="w-5 h-5" /> Base64 → Image</h2>
          <div className="space-y-4">
            <div>
              <label className="label-text">Paste Base64 Data URL</label>
              <textarea
                className="input-field min-h-[100px] w-full font-mono text-xs resize-y"
                placeholder="Paste a data:image/... Base64 string here..."
                value={reverseInput}
                onChange={(e) => { setReverseInput(e.target.value); setReverseImageUrl(''); setReverseError(''); }}
              />
            </div>
            <Button onClick={handleReverseConvert}>
              <ImageIcon className="w-4 h-4" /> Convert to Image
            </Button>
            {reverseError && <p className="text-sm text-error">{reverseError}</p>}
            {reverseImageUrl && (
              <Card hover={false} className="p-4">
                <h3 className="text-sm font-semibold text-text-primary mb-2">Decoded Image</h3>
                <div className="rounded-lg border border-border overflow-hidden bg-gray-50 dark:bg-slate-800 flex items-center justify-center p-4">
                  <img src={reverseImageUrl} alt="Decoded" className="max-w-full max-h-[400px] object-contain" />
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
