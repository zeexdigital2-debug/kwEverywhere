'use client';

import { Sparkles, Layers, Download, FileArchive, Trash2, Loader2, CheckCircle2 } from 'lucide-react';

export default function ActionButtons({
  activeImage,
  images = [],
  isProcessing,
  processingStep,
  onCleanActive,
  onCleanAll,
  onDownloadActive,
  onDownloadAllZip,
  onClearAll
}) {
  const hasImages = images.length > 0;
  const isSingleCleaned = activeImage?.status === 'cleaned';
  const cleanedCount = images.filter((img) => img.status === 'cleaned').length;
  const uncleanedCount = images.filter((img) => img.status !== 'cleaned').length;
  const allCleaned = hasImages && uncleanedCount === 0;

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4">
        
        {/* Left Side: Removal Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Clean Active File */}
          <button
            type="button"
            onClick={onCleanActive}
            disabled={!activeImage || isProcessing || isSingleCleaned}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center space-x-2 transition-all ${
              !activeImage || isProcessing || isSingleCleaned
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm hover:shadow-md'
            }`}
          >
            {isProcessing && activeImage?.status === 'processing' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Cleaning Image...</span>
              </>
            ) : isSingleCleaned ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Active File Cleaned</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-blue-200" />
                <span>Remove Metadata</span>
              </>
            )}
          </button>

          {/* Bulk Clean All */}
          <button
            type="button"
            onClick={onCleanAll}
            disabled={!hasImages || isProcessing || allCleaned}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center space-x-2 transition-all ${
              !hasImages || isProcessing || allCleaned
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : 'bg-[#0a192f] hover:bg-[#11244e] text-white shadow-sm hover:shadow-md'
            }`}
          >
            {isProcessing && activeImage?.status !== 'processing' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>{processingStep || 'Bulk Sanitizing...'}</span>
              </>
            ) : allCleaned ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>All {images.length} Cleaned</span>
              </>
            ) : (
              <>
                <Layers className="w-4 h-4 text-[#38bdf8]" />
                <span>Bulk Remove All ({uncleanedCount})</span>
              </>
            )}
          </button>
        </div>

        {/* Right Side: Download & Reset Actions */}
        <div className="flex flex-wrap items-center gap-2.5 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
          {/* Download Active File */}
          <button
            type="button"
            onClick={onDownloadActive}
            disabled={!isSingleCleaned || isProcessing}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center space-x-2 transition-all ${
              !isSingleCleaned || isProcessing
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Save Cleaned</span>
          </button>

          {/* Download All as ZIP */}
          <button
            type="button"
            onClick={onDownloadAllZip}
            disabled={cleanedCount === 0 || isProcessing}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center space-x-2 transition-all ${
              cleanedCount === 0 || isProcessing
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : 'bg-slate-800 hover:bg-slate-900 text-white shadow-sm hover:shadow-md'
            }`}
          >
            <FileArchive className="w-4 h-4 text-amber-300" />
            <span>Save All as ZIP ({cleanedCount})</span>
          </button>

          {/* Clear All */}
          <button
            type="button"
            onClick={onClearAll}
            disabled={!hasImages || isProcessing}
            className="px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title="Reset and clear all uploaded images"
          >
            <Trash2 className="w-4 h-4 sm:mr-1 inline" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>

      </div>
    </div>
  );
}
