'use client';

import { useState, useRef } from 'react';

interface ImageUploaderProps {
  label: string;
  required?: boolean;
  onImageUpload: (base64: string) => void;
  accept?: string;
  helpText?: string;
}

export default function ImageUploader({
  label,
  required = false,
  onImageUpload,
  accept = 'image/jpeg,image/jpg,image/png,image/webp',
  helpText,
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPreview(base64);
      onImageUpload(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileChange(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div>
      <label className="block text-[13px] font-semibold text-[#37322F] font-sans mb-2">
        {label} {required && <span className="text-[oklch(0.6_0.2_45)]">*</span>}
      </label>

      <div
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${isDragging
            ? 'border-[oklch(0.6_0.2_45)] bg-[oklch(0.6_0.2_45/0.04)]'
            : preview
              ? 'border-emerald-400 bg-emerald-50/30'
              : 'border-[rgba(55,50,47,0.15)] hover:border-[rgba(55,50,47,0.30)] hover:bg-[rgba(55,50,47,0.02)]'
          }`}
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {preview ? (
          <div className="space-y-3">
            <img
              src={preview}
              alt="Preview"
              className="max-h-48 mx-auto rounded-lg object-contain"
            />
            <p className="text-[12px] text-emerald-600 font-medium font-sans flex items-center justify-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Image uploaded
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPreview(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="text-[12px] text-[#847971] hover:text-[#37322F] font-sans font-medium transition-colors"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="w-10 h-10 mx-auto rounded-lg bg-[rgba(55,50,47,0.04)] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#847971" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>
            <p className="text-[13px] text-[#605A57] font-sans">
              <span className="font-medium text-[oklch(0.6_0.2_45)]">Click to upload</span> or drag and drop
            </p>
            <p className="text-[11px] text-[#B2AEA9] font-sans">PNG, JPG, WEBP (max 10MB)</p>
          </div>
        )}
      </div>

      {helpText && <p className="text-[11px] text-[#847971] mt-2 font-sans">{helpText}</p>}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileChange(file);
        }}
        className="hidden"
      />
    </div>
  );
}
