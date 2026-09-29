'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import JSZip from 'jszip';
import {
  MapPin,
  Camera,
  CheckCircle2,
  Download,
  FileArchive,
  RefreshCw,
  Sparkles,
  AlertCircle,
  FileImage,
  Info
} from 'lucide-react';
import UploadZone from '@/components/geotag/UploadZone';
import ImageList from '@/components/geotag/ImageList';
import MetadataForm from '@/components/geotag/MetadataForm';
import GeotagHelpSection from '@/components/geotag/GeotagHelpSection';
import {
  writeExifToDataUrl,
  readImageMetadata,
  dataURLtoBlob,
  fileToDataURL
} from '@/utils/exifHelper';

// Dynamically load MapPicker without SSR to prevent Leaflet window errors
const MapPicker = dynamic(() => import('@/components/geotag/MapPicker'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-80 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 text-xs font-semibold animate-pulse border border-slate-200">
      Loading interactive map engine...
    </div>
  )
});

export default function GeotagPage() {
  const [images, setImages] = useState([]);
  const [activeImageId, setActiveImageId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null); // { type: 'success'|'error', text: '' }

  // Active Image object
  const activeImage = useMemo(() => {
    return images.find((img) => img.id === activeImageId) || null;
  }, [images, activeImageId]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img.previewUrl) URL.revokeObjectURL(img.previewUrl);
      });
    };
  }, []);

  // When images are uploaded
  const handleImagesUploaded = (newImages) => {
    setImages((prev) => {
      const updated = [...prev, ...newImages];
      return updated;
    });

    if (!activeImageId && newImages.length > 0) {
      setActiveImageId(newImages[0].id);
    }

    setStatusMessage({
      type: 'info',
      text: `${newImages.length} ${newImages.length === 1 ? 'image' : 'images'} loaded. Set GPS location and metadata below.`
    });
  };

  // Select active image
  const handleSelectImage = (id) => {
    setActiveImageId(id);
    setStatusMessage(null);
  };

  // Remove single image
  const handleRemoveImage = (id) => {
    setImages((prev) => {
      const filtered = prev.filter((img) => {
        if (img.id === id) {
          if (img.previewUrl) URL.revokeObjectURL(img.previewUrl);
          return false;
        }
        return true;
      });
      return filtered;
    });

    if (activeImageId === id) {
      const remaining = images.filter((img) => img.id !== id);
      setActiveImageId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  // Clear all images
  const handleClearAll = () => {
    images.forEach((img) => {
      if (img.previewUrl) URL.revokeObjectURL(img.previewUrl);
    });
    setImages([]);
    setActiveImageId(null);
    setStatusMessage(null);
  };

  // Update Coordinates for active image
  const handleCoordinatesChange = (latitude, longitude) => {
    if (!activeImageId) return;
    setImages((prev) =>
      prev.map((img) => {
        if (img.id === activeImageId) {
          return {
            ...img,
            latitude,
            longitude,
            isExifWritten: false // mark dirty
          };
        }
        return img;
      })
    );
  };

  // Apply coordinates to all uploaded images
  const handleApplyCoordinatesToAll = () => {
    if (!activeImage) return;
    const { latitude, longitude } = activeImage;
    if (latitude === null || longitude === null) {
      setStatusMessage({ type: 'error', text: 'Please set coordinates on the active photo first.' });
      return;
    }

    setImages((prev) =>
      prev.map((img) => ({
        ...img,
        latitude,
        longitude,
        isExifWritten: false
      }))
    );

    setStatusMessage({
      type: 'success',
      text: `Applied GPS coordinates (${latitude}, ${longitude}) to all ${images.length} photos.`
    });
  };

  // Update Metadata for active image
  const handleMetadataChange = (fields) => {
    if (!activeImageId) return;
    setImages((prev) =>
      prev.map((img) => {
        if (img.id === activeImageId) {
          return {
            ...img,
            ...fields,
            isExifWritten: false // mark dirty
          };
        }
        return img;
      })
    );
  };

  // Apply metadata to all uploaded images
  const handleApplyMetadataToAll = () => {
    if (!activeImage) return;
    const { title, description, keywords } = activeImage;

    setImages((prev) =>
      prev.map((img) => ({
        ...img,
        title,
        description,
        keywords,
        isExifWritten: false
      }))
    );

    setStatusMessage({
      type: 'success',
      text: `Applied Title, Description, and Keywords to all ${images.length} photos.`
    });
  };

  // Write EXIF to active image
  const handleWriteExif = async () => {
    if (!activeImage) return;

    if (activeImage.latitude === null || activeImage.longitude === null) {
      setStatusMessage({
        type: 'error',
        text: 'Please set a location on the map or input Latitude and Longitude before writing EXIF.'
      });
      return;
    }

    setIsProcessing(true);
    setStatusMessage(null);

    try {
      // 1. Write EXIF to dataUrl
      const updatedDataUrl = writeExifToDataUrl(activeImage.dataUrl, {
        latitude: activeImage.latitude,
        longitude: activeImage.longitude,
        description: activeImage.description,
        keywords: activeImage.keywords,
        title: activeImage.title
      });

      // 2. Convert to blob and verify with exifr
      const updatedBlob = dataURLtoBlob(updatedDataUrl);
      const verified = await readImageMetadata(updatedBlob);

      // 3. Update preview url
      if (activeImage.previewUrl) {
        URL.revokeObjectURL(activeImage.previewUrl);
      }
      const newPreviewUrl = URL.createObjectURL(updatedBlob);

      // 4. Update image state
      setImages((prev) =>
        prev.map((img) => {
          if (img.id === activeImage.id) {
            return {
              ...img,
              dataUrl: updatedDataUrl,
              previewUrl: newPreviewUrl,
              size: updatedBlob.size,
              isExifWritten: true,
              writtenCoordinates: {
                latitude: verified.latitude || activeImage.latitude,
                longitude: verified.longitude || activeImage.longitude
              }
            };
          }
          return img;
        })
      );

      setStatusMessage({
        type: 'success',
        text: `Geotag written successfully! Verified GPS: ${verified.latitude?.toFixed(4)}, ${verified.longitude?.toFixed(4)}`
      });
    } catch (err) {
      console.error('Failed to write EXIF tags:', err);
      setStatusMessage({
        type: 'error',
        text: `Error writing EXIF tags: ${err.message || 'Unknown error'}`
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Download active photo
  const handleDownloadActive = () => {
    if (!activeImage) return;

    let targetDataUrl = activeImage.dataUrl;

    // If user hasn't pressed Write EXIF yet but has coordinates set, write automatically before download
    if (!activeImage.isExifWritten && activeImage.latitude !== null && activeImage.longitude !== null) {
      try {
        targetDataUrl = writeExifToDataUrl(activeImage.dataUrl, {
          latitude: activeImage.latitude,
          longitude: activeImage.longitude,
          description: activeImage.description,
          keywords: activeImage.keywords,
          title: activeImage.title
        });
      } catch (e) {
        console.warn('Auto-writing EXIF prior to download:', e);
      }
    }

    const blob = dataURLtoBlob(targetDataUrl);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${activeImage.baseName}-geotagged.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  // Download all photos as ZIP
  const handleDownloadAllZip = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);
    setStatusMessage({ type: 'info', text: 'Compiling all geotagged photos into ZIP...' });

    try {
      const zip = new JSZip();

      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        let finalDataUrl = img.dataUrl;

        // Ensure EXIF is written
        if (img.latitude !== null && img.longitude !== null) {
          try {
            finalDataUrl = writeExifToDataUrl(img.dataUrl, {
              latitude: img.latitude,
              longitude: img.longitude,
              description: img.description,
              keywords: img.keywords,
              title: img.title
            });
          } catch (e) {
            console.warn(`Error writing EXIF for ${img.originalName}:`, e);
          }
        }

        const blob = dataURLtoBlob(finalDataUrl);
        const fileName = `${img.baseName || `photo-${i + 1}`}-geotagged.jpg`;
        zip.file(fileName, blob);
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'geotagged-photos.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      setStatusMessage({
        type: 'success',
        text: `Successfully downloaded ${images.length} geotagged photos as ZIP!`
      });
    } catch (err) {
      console.error('Failed to create ZIP:', err);
      setStatusMessage({
        type: 'error',
        text: `Failed to create ZIP archive: ${err.message}`
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-7 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-200">
              <Camera className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Geotag Photos (Image Geotagger)
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1.5">
            Embed GPS coordinates, targeted SEO keywords, and rich EXIF descriptions into your pictures 100% in your browser.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-semibold text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>100% Client-Side Engine</span>
          </span>
        </div>
      </div>

      {/* Upload Zone */}
      <UploadZone
        onImagesUploaded={handleImagesUploaded}
        isProcessing={isProcessing}
      />

      {/* Status Alert Banner */}
      {statusMessage && (
        <div
          className={`flex items-center space-x-2.5 p-4 rounded-xl text-xs sm:text-sm font-medium border ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : statusMessage.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}
        >
          {statusMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
          {statusMessage.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />}
          {statusMessage.type === 'info' && <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Image Thumbnail Strip */}
      {images.length > 0 && (
        <ImageList
          images={images}
          activeImageId={activeImageId}
          onSelectImage={handleSelectImage}
          onRemoveImage={handleRemoveImage}
          onClearAll={handleClearAll}
        />
      )}

      {/* Active Photo Work Area (Two Columns) */}
      {activeImage && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Active Image Preview & Metadata Form */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Active Image Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Active Photo Preview
                </span>
                {activeImage.hasExistingGps && (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                    Original Geotag Detected
                  </span>
                )}
                {!activeImage.hasExistingGps && (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-700 rounded-full border border-amber-200">
                    No Geotag Found
                  </span>
                )}
              </div>

              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center group">
                <img
                  src={activeImage.previewUrl}
                  alt={activeImage.originalName}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span className="font-semibold text-slate-800 truncate max-w-[200px]" title={activeImage.originalName}>
                  {activeImage.originalName}
                </span>
                <span>{(activeImage.size / 1024).toFixed(0)} KB (JPEG)</span>
              </div>
            </div>

            {/* Metadata Form */}
            <MetadataForm
              title={activeImage.title}
              description={activeImage.description}
              keywords={activeImage.keywords}
              onChangeMetadata={handleMetadataChange}
              onApplyMetadataToAll={handleApplyMetadataToAll}
              totalImagesCount={images.length}
            />
          </div>

          {/* Right Column: Map & Coordinates + Action Bar */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Interactive Map Picker */}
            <MapPicker
              latitude={activeImage.latitude}
              longitude={activeImage.longitude}
              onChangeCoordinates={handleCoordinatesChange}
              onApplyCoordinatesToAll={handleApplyCoordinatesToAll}
              totalImagesCount={images.length}
            />

            {/* Action Bar Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Execute EXIF Geotagging
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ready to embed coordinates and metadata into the image header.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Write EXIF Button */}
                <button
                  type="button"
                  onClick={handleWriteExif}
                  disabled={isProcessing || activeImage.latitude === null || activeImage.longitude === null}
                  className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition-all shadow-sm ${
                    activeImage.latitude !== null && activeImage.longitude !== null
                      ? 'bg-[#0a192f] hover:bg-[#11244e] text-white hover:shadow-md cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-[#38bdf8]" />
                  <span>
                    {isProcessing ? 'Writing EXIF Tags...' : 'Write EXIF Tags'}
                  </span>
                </button>

                {/* Download Single Image */}
                <button
                  type="button"
                  onClick={handleDownloadActive}
                  disabled={isProcessing}
                  className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center space-x-2 transition-all shadow-sm hover:shadow-md cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Geotagged Photo</span>
                </button>
              </div>

              {/* Multiple photos bulk download & Reset */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                {images.length > 1 ? (
                  <button
                    type="button"
                    onClick={handleDownloadAllZip}
                    disabled={isProcessing}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 transition-colors"
                  >
                    <FileArchive className="w-4 h-4 text-emerald-600" />
                    <span>Download All as ZIP ({images.length} Photos)</span>
                  </button>
                ) : (
                  <span className="text-xs text-slate-400">
                    File will download as <code className="text-slate-600">{activeImage.baseName}-geotagged.jpg</code>
                  </span>
                )}

                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-xs text-slate-500 hover:text-rose-600 font-medium transition-colors"
                >
                  Reset Workspace
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Educational & SEO Help Section */}
      <GeotagHelpSection />
    </div>
  );
}
