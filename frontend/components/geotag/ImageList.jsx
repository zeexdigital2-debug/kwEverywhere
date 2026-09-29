'use client';

import { Trash2, MapPin, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function ImageList({
  images,
  activeImageId,
  onSelectImage,
  onRemoveImage,
  onClearAll
}) {
  if (!images || images.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Uploaded Photos
          </span>
          <span className="px-2 py-0.5 text-xs font-semibold bg-blue-50 text-blue-700 rounded-full border border-blue-200">
            {images.length} {images.length === 1 ? 'Photo' : 'Photos'}
          </span>
        </div>

        <button
          type="button"
          onClick={onClearAll}
          className="text-xs text-rose-600 hover:text-rose-700 font-medium hover:underline transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-72 overflow-y-auto pr-1">
        {images.map((img) => {
          const isActive = img.id === activeImageId;
          const hasGps = img.latitude !== null && img.longitude !== null;

          return (
            <div
              key={img.id}
              onClick={() => onSelectImage(img.id)}
              className={`group relative rounded-xl border-2 p-1.5 cursor-pointer transition-all duration-150 flex flex-col justify-between ${
                isActive
                  ? 'border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-500/20'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-white'
              }`}
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center">
                <img
                  src={img.previewUrl}
                  alt={img.originalName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />

                {/* Status Badges */}
                <div className="absolute top-1 left-1 flex flex-col gap-1">
                  {img.isExifWritten ? (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold bg-emerald-600 text-white rounded-md flex items-center space-x-0.5 shadow-xs">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      <span>Saved</span>
                    </span>
                  ) : hasGps ? (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold bg-blue-600 text-white rounded-md flex items-center space-x-0.5 shadow-xs">
                      <MapPin className="w-2.5 h-2.5" />
                      <span>GPS</span>
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold bg-slate-700/80 text-white rounded-md flex items-center space-x-0.5 shadow-xs">
                      <AlertCircle className="w-2.5 h-2.5" />
                      <span>No GPS</span>
                    </span>
                  )}
                </div>

                {/* Delete overlay button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveImage(img.id);
                  }}
                  className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-rose-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove image"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>

              {/* Title & info */}
              <div className="mt-1.5 px-0.5">
                <p className="text-[11px] font-medium text-slate-800 truncate" title={img.originalName}>
                  {img.originalName}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>{(img.size / 1024).toFixed(0)} KB</span>
                  {img.converted && (
                    <span className="text-amber-600 font-semibold" title="Converted to JPEG">
                      JPG
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
