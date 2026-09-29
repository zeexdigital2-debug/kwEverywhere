'use client';

import { X, CheckCircle2, ShieldAlert, Sparkles, Loader2, MapPin, Image as ImageIcon } from 'lucide-react';
import { formatBytes } from '@/utils/metadataRemover';

export default function FileList({
  images,
  activeImageId,
  onSelectImage,
  onRemoveImage,
  maxFiles = 20
}) {
  if (!images || images.length === 0) return null;

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h4 className="text-sm font-bold text-slate-800 tracking-tight">
            Batch Queue
          </h4>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {images.length} / {maxFiles}
          </span>
        </div>
        <p className="text-xs text-slate-400 hidden sm:block">
          Select any thumbnail to inspect and preview
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 max-h-[460px] overflow-y-auto pr-1">
        {images.map((item) => {
          const isActive = item.id === activeImageId;
          const isCleaned = item.status === 'cleaned';
          const isProcessing = item.status === 'processing';
          const hasGps = item.metadata?.hasGps;
          const tagCount = item.metadata?.count || 0;

          return (
            <div
              key={item.id}
              onClick={() => onSelectImage(item.id)}
              className={`group relative rounded-xl border-2 transition-all duration-150 cursor-pointer overflow-hidden flex flex-col ${
                isActive
                  ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-md bg-blue-50/20'
                  : 'border-slate-200/80 hover:border-slate-300 hover:shadow-xs bg-white'
              }`}
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full bg-slate-100 flex items-center justify-center overflow-hidden">
                {item.previewUrl ? (
                  <img
                    src={item.previewUrl}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                ) : (
                  <ImageIcon className="w-6 h-6 text-slate-400" />
                )}

                {/* Remove button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveImage(item.id);
                  }}
                  title="Remove from batch"
                  className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/60 hover:bg-rose-600 text-white transition-colors opacity-90 sm:opacity-0 group-hover:opacity-100 z-10"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                {/* GPS Flag overlay */}
                {hasGps && !isCleaned && (
                  <span
                    title="Contains precise GPS geolocation"
                    className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold flex items-center shadow-xs"
                  >
                    <MapPin className="w-2.5 h-2.5 mr-0.5" /> GPS
                  </span>
                )}

                {/* Cleaned Badge overlay */}
                {isCleaned && (
                  <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold flex items-center shadow-xs">
                    <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" /> Cleaned
                  </span>
                )}

                {/* Processing overlay */}
                {isProcessing && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center space-x-1">
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                  </div>
                )}
              </div>

              {/* Card Footer details */}
              <div className="p-2.5 flex-1 flex flex-col justify-between">
                <div>
                  <p
                    className="text-xs font-semibold text-slate-800 truncate"
                    title={item.name}
                  >
                    {item.name}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {formatBytes(item.size)}
                  </p>
                </div>

                <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  {isCleaned ? (
                    <span className="text-emerald-600 font-semibold flex items-center">
                      <Sparkles className="w-3 h-3 mr-1" />
                      0 tags
                    </span>
                  ) : tagCount > 0 ? (
                    <span className="text-amber-600 font-semibold flex items-center">
                      <ShieldAlert className="w-3 h-3 mr-1" />
                      {tagCount} tags
                    </span>
                  ) : (
                    <span className="text-slate-500 font-medium">
                      No EXIF
                    </span>
                  )}

                  <span className="uppercase text-[10px] text-slate-400 font-bold">
                    {item.format}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
