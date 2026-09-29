'use client';

import { Tags, AlignLeft, Heading, Copy, HelpCircle } from 'lucide-react';

const MAX_KEYWORDS_LEN = 6600;
const MAX_DESCRIPTION_LEN = 1300;
const MAX_TITLE_LEN = 500;

export default function MetadataForm({
  title,
  description,
  keywords,
  onChangeMetadata,
  onApplyMetadataToAll,
  totalImagesCount
}) {
  const keywordsLength = keywords ? keywords.length : 0;
  const descLength = description ? description.length : 0;
  const titleLength = title ? title.length : 0;

  const handleTitleChange = (val) => {
    if (val.length <= MAX_TITLE_LEN) {
      onChangeMetadata({ title: val });
    }
  };

  const handleDescChange = (val) => {
    if (val.length <= MAX_DESCRIPTION_LEN) {
      onChangeMetadata({ description: val });
    }
  };

  const handleKeywordsChange = (val) => {
    if (val.length <= MAX_KEYWORDS_LEN) {
      onChangeMetadata({ keywords: val });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Tags className="w-4 h-4 text-blue-600" />
            <span>EXIF Metadata & SEO Tags</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Add keywords, image descriptions, and titles embedded into the JPEG EXIF header.
          </p>
        </div>
      </div>

      {/* Document Name / Title */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center space-x-1">
            <Heading className="w-3.5 h-3.5 text-slate-400" />
            <span>Document Title / Subject</span>
            <span className="text-slate-400 font-normal lowercase">(optional)</span>
          </label>
          <span className="text-[10px] text-slate-400">
            {titleLength} / {MAX_TITLE_LEN}
          </span>
        </div>
        <input
          type="text"
          value={title || ''}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="e.g. Modern Dental Clinic Exterior - Chicago Downtown"
          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
        />
      </div>

      {/* Description / Alt Text */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center space-x-1">
            <AlignLeft className="w-3.5 h-3.5 text-slate-400" />
            <span>Description / Image Alt Text</span>
          </label>
          <span
            className={`text-[10px] font-medium ${
              descLength > MAX_DESCRIPTION_LEN * 0.9 ? 'text-amber-600' : 'text-slate-400'
            }`}
          >
            {descLength} / {MAX_DESCRIPTION_LEN}
          </span>
        </div>
        <textarea
          rows={3}
          value={description || ''}
          onChange={(e) => handleDescChange(e.target.value)}
          placeholder="Detailed description of the photo context, local business services, and relevant location landmarks..."
          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all resize-y"
        />
        <p className="text-[11px] text-slate-400 mt-0.5">
          Written to EXIF <code className="text-slate-600 bg-slate-100 px-1 py-0.2 rounded font-mono">ImageDescription</code> and <code className="text-slate-600 bg-slate-100 px-1 py-0.2 rounded font-mono">XPComment</code> tags.
        </p>
      </div>

      {/* Keywords */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center space-x-1">
            <Tags className="w-3.5 h-3.5 text-slate-400" />
            <span>Keywords (Comma Separated)</span>
          </label>
          <span
            className={`text-[10px] font-medium ${
              keywordsLength > MAX_KEYWORDS_LEN * 0.9 ? 'text-amber-600' : 'text-slate-400'
            }`}
          >
            {keywordsLength} / {MAX_KEYWORDS_LEN}
          </span>
        </div>
        <textarea
          rows={3}
          value={keywords || ''}
          onChange={(e) => handleKeywordsChange(e.target.value)}
          placeholder="e.g. dentist chicago, best dental clinic, teeth whitening, emergency dental care, loop chicago"
          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all resize-y"
        />
        <p className="text-[11px] text-slate-400 mt-0.5">
          Encoded into Windows Explorer / Adobe standard <code className="text-slate-600 bg-slate-100 px-1 py-0.2 rounded font-mono">XPKeywords</code> tag.
        </p>
      </div>

      {/* Apply to All Photos */}
      {totalImagesCount > 1 && (
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Use the same metadata for all uploaded photos?
          </span>
          <button
            type="button"
            onClick={onApplyMetadataToAll}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-xl border border-blue-200 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Apply to All {totalImagesCount} Photos</span>
          </button>
        </div>
      )}
    </div>
  );
}
