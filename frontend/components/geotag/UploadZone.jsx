'use client';

import { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, AlertCircle, FileCheck2, Info } from 'lucide-react';
import { convertToJpegBlob, readImageMetadata, fileToDataURL } from '@/utils/exifHelper';

const MAX_FILE_SIZE_MB = 20;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export default function UploadZone({ onImagesUploaded, isProcessing }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const fileInputRef = useRef(null);

  const processFiles = async (files) => {
    if (!files || files.length === 0) return;
    setErrorMsg('');
    setUploadStatus('Reading and processing files...');

    const validNewImages = [];
    const errors = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileNameLower = file.name.toLowerCase();

      // Check for HEIC / HEIF
      if (fileNameLower.endsWith('.heic') || fileNameLower.endsWith('.heif') || file.type.includes('heic')) {
        errors.push(`"${file.name}": HEIC format is not natively supported in browser geotagging. Please save or export as JPG.`);
        continue;
      }

      // Check max size
      if (file.size > MAX_FILE_SIZE_BYTES) {
        errors.push(`"${file.name}": Exceeds maximum size of ${MAX_FILE_SIZE_MB}MB.`);
        continue;
      }

      // Validate allowed types
      const isJpg = file.type === 'image/jpeg' || fileNameLower.endsWith('.jpg') || fileNameLower.endsWith('.jpeg');
      const isPng = file.type === 'image/png' || fileNameLower.endsWith('.png');
      const isWebp = file.type === 'image/webp' || fileNameLower.endsWith('.webp');

      if (!isJpg && !isPng && !isWebp) {
        errors.push(`"${file.name}": Unsupported format. Please upload JPG, PNG, or WebP.`);
        continue;
      }

      try {
        setUploadStatus(`Processing ${file.name} (${i + 1}/${files.length})...`);
        
        // 1. Read existing EXIF from the original file before conversion
        const existingMeta = await readImageMetadata(file);

        // 2. Convert to JPEG blob if needed (PNG/WebP)
        const { blob: jpegBlob, converted } = await convertToJpegBlob(file);

        // 3. Create preview URL and base64 dataUrl
        const previewUrl = URL.createObjectURL(jpegBlob);
        const dataUrl = await fileToDataURL(jpegBlob);

        const imageItem = {
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          originalName: file.name,
          baseName: file.name.replace(/\.[^/.]+$/, ''),
          size: jpegBlob.size,
          converted,
          previewUrl,
          dataUrl,
          // Metadata state for this image
          latitude: existingMeta.hasGps ? existingMeta.latitude : null,
          longitude: existingMeta.hasGps ? existingMeta.longitude : null,
          hasExistingGps: existingMeta.hasGps,
          description: existingMeta.description || '',
          keywords: existingMeta.keywords || '',
          title: existingMeta.title || '',
          isExifWritten: false,
          writtenCoordinates: null
        };

        validNewImages.push(imageItem);
      } catch (err) {
        console.error('Failed processing file:', file.name, err);
        errors.push(`Failed to process "${file.name}": ${err.message || 'Corrupt or unreadable image'}`);
      }
    }

    setUploadStatus('');

    if (errors.length > 0) {
      setErrorMsg(errors.join(' | '));
    }

    if (validNewImages.length > 0) {
      onImagesUploaded(validNewImages);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer && e.dataTransfer.files) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      processFiles(Array.from(e.target.files));
    }
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 group ${
          isDragOver
            ? 'border-blue-500 bg-blue-50/70 scale-[1.01]'
            : 'border-slate-300 hover:border-blue-400 bg-white hover:bg-slate-50/70 shadow-xs'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp,.heic,.heif"
          onChange={handleFileChange}
          className="hidden"
          disabled={isProcessing}
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#0a192f] to-[#1e3a8a] text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
            <UploadCloud className="w-6 h-6 text-[#38bdf8]" />
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-800">
              Drag & Drop Photos Here, or{' '}
              <span className="text-blue-600 underline underline-offset-2">Browse</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Supports <strong className="text-slate-700">JPEG/JPG</strong> (recommended),{' '}
              <strong className="text-slate-700">PNG</strong>, and{' '}
              <strong className="text-slate-700">WebP</strong>. Max 20MB per photo.
            </p>
          </div>

          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-slate-100 rounded-full text-[11px] font-medium text-slate-600">
            <Info className="w-3.5 h-3.5 text-blue-500" />
            <span>100% Client-side processing — No photos uploaded to server</span>
          </div>
        </div>

        {uploadStatus && (
          <div className="mt-3 text-xs font-semibold text-blue-600 animate-pulse">
            {uploadStatus}
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="flex items-start space-x-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-500" />
          <div className="flex-1 break-words">{errorMsg}</div>
        </div>
      )}
    </div>
  );
}
