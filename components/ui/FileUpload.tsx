'use client';
import React, { useCallback, useState } from 'react';
import { Upload, X, File as FileIcon } from 'lucide-react';

interface FileUploadProps {
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  label?: string;
}

export function FileUpload({ accept = 'image/*,.pdf', maxSize = 10 * 1024 * 1024, multiple = false, onFiles, label = 'Upload File' }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState('');

  const handleFiles = useCallback((newFiles: FileList | File[]) => {
    setError('');
    const valid: File[] = [];
    for (const f of Array.from(newFiles)) {
      if (f.size > maxSize) { setError(`"${f.name}" exceeds ${(maxSize / 1024 / 1024).toFixed(0)}MB limit`); continue; }
      valid.push(f);
    }
    const updated = multiple ? [...files, ...valid] : valid.slice(0, 1);
    setFiles(updated);
    onFiles(updated);
  }, [files, maxSize, multiple, onFiles]);

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onFiles(updated);
  };

  return (
    <div className="space-y-3">
      <div
        className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-colors ${isDragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'} ${error ? 'border-error' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragOver(false); handleFiles(e.dataTransfer.files); }}
      >
        <input type="file" accept={accept} multiple={multiple} className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => e.target.files && handleFiles(e.target.files)} />
        <Upload className="w-10 h-10 text-text-secondary mb-3" />
        <p className="font-medium text-text-primary">{label}</p>
        <p className="text-sm text-text-secondary mt-1">Drag & drop or click to browse</p>
        <p className="text-xs text-text-secondary mt-2">Max size: {(maxSize / 1024 / 1024).toFixed(0)}MB | {accept}</p>
      </div>
      {error && <p className="text-sm text-error">{error}</p>}
      {files.map((f, i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3">
          <FileIcon className="w-5 h-5 text-primary" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">{f.name}</p>
            <p className="text-xs text-text-secondary">{(f.size / 1024).toFixed(1)} KB</p>
          </div>
          <button onClick={() => removeFile(i)} className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700"><X className="w-4 h-4 text-text-secondary" /></button>
        </div>
      ))}
    </div>
  );
}
