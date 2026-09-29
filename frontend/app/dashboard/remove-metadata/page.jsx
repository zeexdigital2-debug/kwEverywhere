'use client';

import { useState, useEffect, useMemo } from 'react';
import JSZip from 'jszip';
import {
  ShieldOff,
  Sparkles,
  Layers,
  Download,
  FileArchive,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Lock,
  Cpu,
  Info
} from 'lucide-react';
import UploadZone from '@/components/remove-metadata/UploadZone';
import FileList from '@/components/remove-metadata/FileList';
import MetadataTable from '@/components/remove-metadata/MetadataTable';
import ActionButtons from '@/components/remove-metadata/ActionButtons';
import HelpSection from '@/components/remove-metadata/HelpSection';
import { inspectMetadata, cleanImageMetadata } from '@/utils/metadataRemover';

export default function RemoveMetadataPage() {
  const [images, setImages] = useState([]);
  const [activeImageId, setActiveImageId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [notification, setNotification] = useState(null); // { type: 'success' | 'error' | 'info', message: '' }

  // Active Image object
  const activeImage = useMemo(() => {
    return images.find((img) => img.id === activeImageId) || null;
  }, [images, activeImageId]);

  // Clean up object URLs on component unmount
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img.previewUrl) URL.revokeObjectURL(img.previewUrl);
        if (img.cleanedPreviewUrl) URL.revokeObjectURL(img.cleanedPreviewUrl);
      });
    };
  }, []);

  // When files are selected / dropped
  const handleFilesSelected = async (newFiles) => {
    const newItems = [];

    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const previewUrl = URL.createObjectURL(file);
      const ext = file.name.split('.').pop()?.toUpperCase() || 'IMG';

      // Inspect metadata in browser using exifr
      const meta = await inspectMetadata(file);

      newItems.push({
        id,
        file,
        name: file.name,
        size: file.size,
        format: ext,
        previewUrl,
        metadata: meta,
        status: meta.count === 0 ? 'unprocessed' : 'unprocessed', // unprocessed | processing | cleaned
        cleanedBlob: null,
        cleanedFileName: null,
        cleanedPreviewUrl: null,
        cleanedSize: null,
        cleanedMeta: null,
      });
    }

    setImages((prev) => {
      const updated = [...prev, ...newItems];
      return updated;
    });

    if (!activeImageId && newItems.length > 0) {
      setActiveImageId(newItems[0].id);
    }

    setNotification({
      type: 'info',
      message: `Loaded ${newItems.length} image${newItems.length === 1 ? '' : 's'}. Click on any thumbnail to inspect hidden EXIF data.`
    });
  };

  // Select active image
  const handleSelectImage = (id) => {
    setActiveImageId(id);
  };

  // Remove single image from batch
  const handleRemoveImage = (id) => {
    setImages((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) {
        if (target.previewUrl) URL.revokeObjectURL(target.previewUrl);
        if (target.cleanedPreviewUrl) URL.revokeObjectURL(target.cleanedPreviewUrl);
      }
      return prev.filter((item) => item.id !== id);
    });

    if (activeImageId === id) {
      const remaining = images.filter((item) => item.id !== id);
      setActiveImageId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  // Clean active image metadata
  const handleCleanActive = async () => {
    if (!activeImage || isProcessing) return;

    setIsProcessing(true);
    setProcessingStep('Cleaning metadata...');

    try {
      // Mark as processing
      setImages((prev) =>
        prev.map((img) =>
          img.id === activeImage.id ? { ...img, status: 'processing' } : img
        )
      );

      const cleanResult = await cleanImageMetadata(activeImage.file);
      const cleanedPreviewUrl = URL.createObjectURL(cleanResult.cleanedBlob);

      // Re-inspect to build structured metadata display of remaining safe tags
      const verifiedMeta = await inspectMetadata(cleanResult.cleanedBlob);

      setImages((prev) =>
        prev.map((img) => {
          if (img.id === activeImage.id) {
            return {
              ...img,
              status: 'cleaned',
              cleanedBlob: cleanResult.cleanedBlob,
              cleanedFileName: cleanResult.cleanFileName,
              cleanedPreviewUrl,
              cleanedSize: cleanResult.cleanedSize,
              cleanedMeta: cleanResult,
              // Update tags display to verified cleaned state
              metadata: verifiedMeta
            };
          }
          return img;
        })
      );

      setNotification({
        type: 'success',
        message: `Metadata removed successfully from "${activeImage.name}" (${cleanResult.tagsRemaining} tags remaining). Ready to save!`
      });
    } catch (err) {
      console.error('Error cleaning image metadata:', err);
      setImages((prev) =>
        prev.map((img) =>
          img.id === activeImage.id ? { ...img, status: 'unprocessed' } : img
        )
      );
      setNotification({
        type: 'error',
        message: `Failed to remove metadata from ${activeImage.name}: ${err.message || 'Unknown error'}`
      });
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  // Clean all images in batch
  const handleCleanAll = async () => {
    const uncleaned = images.filter((img) => img.status !== 'cleaned');
    if (uncleaned.length === 0 || isProcessing) return;

    setIsProcessing(true);

    try {
      for (let i = 0; i < uncleaned.length; i++) {
        const item = uncleaned[i];
        setProcessingStep(`Cleaning image ${i + 1} of ${uncleaned.length}...`);

        // Mark as processing
        setImages((prev) =>
          prev.map((img) =>
            img.id === item.id ? { ...img, status: 'processing' } : img
          )
        );

        try {
          const cleanResult = await cleanImageMetadata(item.file);
          const cleanedPreviewUrl = URL.createObjectURL(cleanResult.cleanedBlob);
          const verifiedMeta = await inspectMetadata(cleanResult.cleanedBlob);

          setImages((prev) =>
            prev.map((img) => {
              if (img.id === item.id) {
                return {
                  ...img,
                  status: 'cleaned',
                  cleanedBlob: cleanResult.cleanedBlob,
                  cleanedFileName: cleanResult.cleanFileName,
                  cleanedPreviewUrl,
                  cleanedSize: cleanResult.cleanedSize,
                  cleanedMeta: cleanResult,
                  metadata: verifiedMeta
                };
              }
              return img;
            })
          );
        } catch (fileErr) {
          console.error(`Failed to clean ${item.name}:`, fileErr);
          setImages((prev) =>
            prev.map((img) =>
              img.id === item.id ? { ...img, status: 'unprocessed' } : img
            )
          );
        }
      }

      setNotification({
        type: 'success',
        message: `Bulk cleaning complete! All ${uncleaned.length} images have been sanitized.`
      });
    } catch (err) {
      console.error('Bulk clean error:', err);
      setNotification({
        type: 'error',
        message: `An error occurred during bulk cleaning: ${err.message}`
      });
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  // Download single active cleaned file
  const handleDownloadActive = () => {
    if (!activeImage || !activeImage.cleanedBlob) return;

    const link = document.createElement('a');
    const url = URL.createObjectURL(activeImage.cleanedBlob);
    link.href = url;
    link.download = activeImage.cleanedFileName || 'image-clean.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // Download all cleaned files as ZIP
  const handleDownloadAllZip = async () => {
    const cleanedImages = images.filter((img) => img.status === 'cleaned' && img.cleanedBlob);
    if (cleanedImages.length === 0) return;

    setIsProcessing(true);
    setProcessingStep('Generating ZIP archive...');

    try {
      const zip = new JSZip();

      // Add each cleaned file to zip
      cleanedImages.forEach((item) => {
        const fileName = item.cleanedFileName || `${item.name.replace(/\.[^/.]+$/, '')}-clean.jpg`;
        zip.file(fileName, item.cleanedBlob);
      });

      const zipBlob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      });

      const zipUrl = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = zipUrl;
      link.download = `sanitized-images-${new Date().toISOString().slice(0, 10)}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(zipUrl), 1000);

      setNotification({
        type: 'success',
        message: `Downloaded ZIP containing ${cleanedImages.length} sanitized images!`
      });
    } catch (err) {
      console.error('Error generating zip:', err);
      setNotification({
        type: 'error',
        message: `Failed to create ZIP package: ${err.message}`
      });
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  // Clear all images
  const handleClearAll = () => {
    images.forEach((img) => {
      if (img.previewUrl) URL.revokeObjectURL(img.previewUrl);
      if (img.cleanedPreviewUrl) URL.revokeObjectURL(img.cleanedPreviewUrl);
    });
    setImages([]);
    setActiveImageId(null);
    setNotification(null);
  };

  return (
    <div className="space-y-7 animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <ShieldOff className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Remove Metadata & EXIF
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Inspect and strip hidden GPS coordinates, camera models, serial numbers, and personal timestamps 100% in your browser.
              </p>
            </div>
          </div>
        </div>

        {/* Security & Client-Side Badge */}
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-semibold text-emerald-700 shadow-xs">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Zero-Upload Client Processing</span>
          </span>
        </div>
      </div>

      {/* Global Status Notification Banner */}
      {notification && (
        <div
          className={`p-3.5 rounded-2xl border flex items-start justify-between space-x-3 text-xs sm:text-sm animate-in fade-in duration-200 ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : notification.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}
        >
          <div className="flex items-center space-x-2 font-medium">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : notification.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-xs font-bold opacity-60 hover:opacity-100 px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Upload Zone */}
      <UploadZone
        onFilesSelected={handleFilesSelected}
        currentCount={images.length}
      />

      {/* File List / Batch Queue */}
      {images.length > 0 && (
        <FileList
          images={images}
          activeImageId={activeImageId}
          onSelectImage={handleSelectImage}
          onRemoveImage={handleRemoveImage}
          maxFiles={20}
        />
      )}

      {/* Action Buttons Toolbar */}
      {images.length > 0 && (
        <ActionButtons
          activeImage={activeImage}
          images={images}
          isProcessing={isProcessing}
          processingStep={processingStep}
          onCleanActive={handleCleanActive}
          onCleanAll={handleCleanAll}
          onDownloadActive={handleDownloadActive}
          onDownloadAllZip={handleDownloadAllZip}
          onClearAll={handleClearAll}
        />
      )}

      {/* Metadata Table Inspector */}
      {images.length > 0 && (
        <MetadataTable activeImage={activeImage} />
      )}

      {/* Help Section / Privacy Explainer */}
      <HelpSection />

    </div>
  );
}
