'use client';

import { useState, useMemo } from 'react';
import {
  Search,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  Calendar,
  Camera,
  Cpu,
  Sparkles,
  Info,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';
import { formatBytes } from '@/utils/metadataRemover';

export default function MetadataTable({ activeImage }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedKey, setCopiedKey] = useState(null);

  const tags = useMemo(() => {
    return activeImage?.metadata?.tags || [];
  }, [activeImage]);

  const isCleaned = activeImage?.status === 'cleaned';
  const remainingCount = activeImage?.cleanedMeta?.tagsRemaining ?? (isCleaned ? 0 : tags.length);

  // Filtered tags based on search
  const filteredTags = useMemo(() => {
    if (!searchTerm.trim()) return tags;
    const term = searchTerm.toLowerCase().trim();
    return tags.filter(
      (t) =>
        t.key.toLowerCase().includes(term) ||
        String(t.value).toLowerCase().includes(term) ||
        (t.category && t.category.toLowerCase().includes(term))
    );
  }, [tags, searchTerm]);

  const handleCopy = (text, key) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1800);
    }
  };

  if (!activeImage) {
    return (
      <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-10 text-center shadow-xs flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
          <Info className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-slate-700">No Image Selected</h4>
        <p className="text-xs text-slate-400 mt-1 max-w-sm">
          Select an image from the batch above to inspect all embedded EXIF tags, GPS coordinates, and camera specifications.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Table Header / Overview Card */}
      <div className="p-5 border-b border-slate-200/80 bg-gradient-to-b from-slate-50/70 to-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-slate-900 truncate max-w-md">
                {activeImage.name}
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {formatBytes(activeImage.size)}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Format: <span className="uppercase font-semibold text-slate-700">{activeImage.format}</span>
              {isCleaned && activeImage.cleanedSize && (
                <span className="ml-2 text-emerald-600 font-semibold">
                  · Cleaned: {formatBytes(activeImage.cleanedSize)}
                </span>
              )}
            </p>
          </div>

          {/* Status Badge */}
          <div>
            {isCleaned ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                Metadata Removed (0 tags)
              </span>
            ) : tags.length > 0 ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                <ShieldAlert className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
                {tags.length} Metadata Tags Detected
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                No EXIF In Original File
              </span>
            )}
          </div>
        </div>

        {/* Cleaned Confirmation Banner */}
        {isCleaned && (
          <div className="mt-4 p-3.5 rounded-xl bg-emerald-50/90 border border-emerald-200 flex items-start space-x-3 text-xs text-emerald-900 animate-in fade-in duration-300">
            <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold">Sanitization Complete: </span>
              All GPS coordinates, device serial numbers, personal creator data, and timestamps have been purged.
              {activeImage.cleanedMeta?.preservedOrientation && (
                <span className="block mt-0.5 text-emerald-700 font-medium">
                  Note: Safe display orientation flag was retained so the image remains correctly oriented.
                </span>
              )}
            </div>
          </div>
        )}

        {/* Privacy Risk Quick Chips (before cleaning) */}
        {!isCleaned && activeImage.metadata?.summary && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {/* GPS */}
            <div className={`p-2.5 rounded-xl border text-xs flex items-center space-x-2.5 ${
              activeImage.metadata.summary.gps
                ? 'bg-rose-50/80 border-rose-200 text-rose-900'
                : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}>
              <MapPin className={`w-4 h-4 flex-shrink-0 ${activeImage.metadata.summary.gps ? 'text-rose-600' : 'text-slate-400'}`} />
              <div className="truncate">
                <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">GPS Location</span>
                <span className="font-semibold truncate block">
                  {activeImage.metadata.summary.gps || 'Not Present'}
                </span>
              </div>
            </div>

            {/* Camera Model */}
            <div className={`p-2.5 rounded-xl border text-xs flex items-center space-x-2.5 ${
              activeImage.metadata.summary.camera
                ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}>
              <Camera className={`w-4 h-4 flex-shrink-0 ${activeImage.metadata.summary.camera ? 'text-amber-600' : 'text-slate-400'}`} />
              <div className="truncate">
                <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">Device Model</span>
                <span className="font-semibold truncate block">
                  {activeImage.metadata.summary.camera || 'Not Present'}
                </span>
              </div>
            </div>

            {/* Timestamp */}
            <div className={`p-2.5 rounded-xl border text-xs flex items-center space-x-2.5 ${
              activeImage.metadata.summary.date
                ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}>
              <Calendar className={`w-4 h-4 flex-shrink-0 ${activeImage.metadata.summary.date ? 'text-amber-600' : 'text-slate-400'}`} />
              <div className="truncate">
                <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">Date / Time</span>
                <span className="font-semibold truncate block">
                  {activeImage.metadata.summary.date || 'Not Present'}
                </span>
              </div>
            </div>

            {/* Software / Host */}
            <div className={`p-2.5 rounded-xl border text-xs flex items-center space-x-2.5 ${
              activeImage.metadata.summary.software
                ? 'bg-slate-100 border-slate-200 text-slate-800'
                : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}>
              <Cpu className="w-4 h-4 flex-shrink-0 text-slate-500" />
              <div className="truncate">
                <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">Software / Host</span>
                <span className="font-semibold truncate block">
                  {activeImage.metadata.summary.software || 'Not Present'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search and Table Controls */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tags or values (e.g. GPS, Date, Model, Sony, ISO)..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-500">
          <span>Showing <strong>{filteredTags.length}</strong> of {tags.length} tags</span>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
            >
              Clear filter
            </button>
          )}
        </div>
      </div>

      {/* Metadata Table */}
      <div className="overflow-x-auto max-h-[480px]">
        {tags.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-800">
              No metadata found in this file
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              This photo does not contain any embedded EXIF, GPS, camera manufacturer, or IPTC metadata chunks.
            </p>
          </div>
        ) : filteredTags.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-600">
              No tags match &ldquo;{searchTerm}&rdquo;
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="mt-2 text-xs font-semibold text-blue-600 hover:underline"
            >
              Reset search filter
            </button>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200/80 sticky top-0 z-10 backdrop-blur-xs">
                <th className="py-2.5 px-4">Tag</th>
                <th className="py-2.5 px-4">Value</th>
                <th className="py-2.5 px-4 text-right">Sensitivity / Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredTags.map((tag) => {
                const isHighRisk = tag.riskLevel === 'high';
                const isMediumRisk = tag.riskLevel === 'medium';

                return (
                  <tr
                    key={tag.key}
                    className={`transition-colors ${
                      isHighRisk
                        ? 'bg-rose-50/40 hover:bg-rose-50/80'
                        : isMediumRisk
                        ? 'bg-amber-50/30 hover:bg-amber-50/60'
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    {/* Tag Key */}
                    <td className="py-2.5 px-4 font-mono font-semibold text-slate-800 align-top whitespace-nowrap">
                      <div className="flex items-center space-x-1.5">
                        {isHighRisk && (
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                        )}
                        {isMediumRisk && (
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                        )}
                        <span>{tag.label}</span>
                      </div>
                    </td>

                    {/* Tag Value */}
                    <td className="py-2.5 px-4 text-slate-700 align-top max-w-md break-words">
                      <div className="flex items-start justify-between group">
                        <span className="font-mono text-[11.5px] leading-relaxed">
                          {tag.value}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(tag.value, tag.key)}
                          title="Copy value"
                          className="opacity-0 group-hover:opacity-100 ml-2 p-1 text-slate-400 hover:text-slate-700 transition-opacity"
                        >
                          {copiedKey === tag.key ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Category & Sensitivity */}
                    <td className="py-2.5 px-4 text-right align-top whitespace-nowrap">
                      {isHighRisk ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                          {tag.category} · High Risk
                        </span>
                      ) : isMediumRisk ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          {tag.category}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                          {tag.category}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
