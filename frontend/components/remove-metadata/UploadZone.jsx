'use client';

import { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, AlertCircle, FileCheck, ShieldCheck } from 'lucide-react';
import { formatBytes } from '@/utils/metadataRemover';

const MAX_FILES = 20;
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];

export default function UploadZone({ onFilesSelected, currentCount = 0 }) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputRef = useRef(null);

  const validateAndProcessFiles = (selectedFiles) => {
    setErrorMessage(null);
    if (!selectedFiles || selectedFiles.length === 0) return;

    const filesArray = Array.from(selectedFiles);

    // Check batch capacity limit
    const availableSlots = MAX_FILES - currentCount;
    if (availableSlots <= 0) {
      setErrorMessage(`Batch limit reached (${MAX_FILES} images max). Please clean or clear existing images first.`);
      return;
    }

    if (filesArray.length > availableSlots) {
      setErrorMessage(`You can only add ${availableSlots} more image${availableSlots === 1 ? '' : 's'} (cap is ${MAX_FILES} per batch). Extra images were omitted.`);
    }

    const eligibleFiles = filesArray.slice(0, availableSlots);
    const validFiles = [];
    const oversizedFiles = [];
    const unsupportedFiles = [];

    eligibleFiles.forEach((file) => {
      const ext = file.name.split('.').pop()?.toLowerCase();
      const isAcceptedMime = ACCEPTED_TYPES.includes(file.type.toLowerCase());
      const isAcceptedExt = ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif'].includes(ext);

      if (!isAcceptedMime && !isAcceptedExt) {
        unsupportedFiles.push(file.name);
        return;
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        oversizedFiles.push(`${file.name} (${formatBytes(file.size)})`);
        return;
      }

      validFiles.push(file);
    });

    if (oversizedFiles.length > 0) {
      setErrorMessage(`The following file(s) exceed the 50MB limit: ${oversizedFiles.join(', ')}`);
    } else if (unsupportedFiles.length > 0) {
      setErrorMessage(`Unsupported file format for: ${unsupportedFiles.join(', ')}. Supported: JPEG, PNG, WebP, HEIC.`);
    }

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      validateAndProcessFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      validateAndProcessFiles(e.target.files);
      // Reset input value so same files can be re-selected if removed
      e.target.value = '';
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`group relative cursor-pointer rounded-2xl border-2 border-dashed p-8 transition-all duration-200 text-center flex flex-col items-center justify-center ${
          isDragging
            ? 'border-blue-500 bg-blue-50/70 scale-[0.99]'
            : 'border-slate-300 hover:border-blue-400 bg-white hover:bg-slate-50/70 shadow-xs'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.webp,.heic,.heif,image/jpeg,image/png,image/webp,image/heic,image/heif"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="w-14 h-14 mb-4 rounded-2xl bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
          <UploadCloud className="w-7 h-7" />
        </div>

        <h3 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
          Drop your photos here, or <span className="text-blue-600 underline decoration-blue-300 underline-offset-4">browse files</span>
        </h3>

        <p className="mt-1.5 text-xs sm:text-sm text-slate-500 max-w-md">
          Supports JPEG, PNG, WebP, and Apple HEIC photos. Up to 20 files per batch, max 50MB each.
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
            JPG / JPEG
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
            PNG
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
            WebP
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
            HEIC / HEIF
          </span>
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 mr-1" />
            100% In-Browser Privacy
          </span>
        </div>
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div className="mt-3 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start space-x-3 text-xs sm:text-sm text-rose-800 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{errorMessage}</div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-rose-500 hover:text-rose-800 text-xs font-bold px-1"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
