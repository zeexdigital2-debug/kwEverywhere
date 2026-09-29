'use client';

import { ShieldCheck, HelpCircle, EyeOff, Layers, CheckCircle2, AlertTriangle, Cpu, Lock } from 'lucide-react';

export default function HelpSection() {
  return (
    <div className="w-full space-y-6 pt-4">
      {/* 5-Step How to Use Guide */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs">
        <div className="flex items-center space-x-2.5 mb-5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <HelpCircle className="w-4.5 h-4.5" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            How to Use Metadata & EXIF Remover
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col justify-between">
            <div>
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mb-2.5">
                1
              </span>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Add Photos
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Drag and drop or select up to 20 images (JPEG, PNG, WebP, HEIC) up to 50MB each.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col justify-between">
            <div>
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mb-2.5">
                2
              </span>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Inspect Tags
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Click any thumbnail to preview its hidden EXIF headers, GPS coordinates, and camera profiles.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col justify-between">
            <div>
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mb-2.5">
                3
              </span>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Search & Audit
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Filter tags in real time to locate sensitive markers like exact GPS position or serial numbers.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col justify-between">
            <div>
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mb-2.5">
                4
              </span>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Purge Metadata
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Click Remove Metadata for a single file or Bulk Remove to sanitize the entire batch at once.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col justify-between">
            <div>
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center mb-2.5">
                5
              </span>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Save Clean Files
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Download your sanitized images individually or bundled together in a single convenient ZIP archive.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Explainer: What is EXIF, Privacy Risks, and What is Preserved */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Why EXIF Metadata Matters for Privacy */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-rose-600 mb-3">
              <EyeOff className="w-5 h-5" />
              <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                Understanding EXIF and Privacy Vulnerabilities
              </h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Modern smartphones and digital cameras silently append extensive metadata whenever you capture a photograph. Known as <strong>Exchangeable Image File Format (EXIF)</strong>, this data travels with the image wherever it is uploaded, shared, or published.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Without sanitization, anyone downloading your photo can uncover:
            </p>
            <ul className="space-y-1.5 text-xs text-slate-600 mb-2 pl-1">
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 mr-2 flex-shrink-0" />
                <span><strong>Precise GPS Coordinates:</strong> Pinpointing the exact physical location of your home, workplace, or travel stops.</span>
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 mr-2 flex-shrink-0" />
                <span><strong>Hardware Serial Identifiers:</strong> Unique equipment and sensor serial numbers linking photos to your specific camera body.</span>
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 mr-2 flex-shrink-0" />
                <span><strong>Timestamps & Creation Logs:</strong> Exact calendar dates, times, and second-level time zones of when you were present.</span>
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 mr-2 flex-shrink-0" />
                <span><strong>Software & Host Info:</strong> Operating system versions, editing software names, and computer profile usernames.</span>
              </li>
            </ul>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-center space-x-2">
            <Lock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Sanitizing files before sharing safeguards personal security and digital anonymity.</span>
          </div>
        </div>

        {/* What Gets Removed vs What is Safely Preserved */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-emerald-600 mb-3">
              <ShieldCheck className="w-5 h-5" />
              <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                What Is Stripped vs. What Is Preserved
              </h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Our sanitization engine strips all identifying baggage while maintaining complete optical integrity of your imagery.
            </p>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200/80">
                <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider block mb-1">
                  100% Stripped & Purged
                </span>
                <p className="text-xs text-rose-900 leading-relaxed">
                  GPS coordinates, camera model, lens metadata, author names, copyright notices, software signatures, creation timestamps, and embedded thumbnail images.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                  Safely Preserved
                </span>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  Original pixel data, color rendition, image dimensions, and display orientation. Your photos will never appear sideways or distorted after cleaning.
                </p>
              </div>
            </div>
          </div>

          {/* In-Browser Security Seal */}
          <div className="mt-4 p-3 rounded-xl bg-blue-50/80 border border-blue-200 text-[11px] text-blue-900 flex items-center space-x-2.5">
            <Cpu className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span>
              <strong>100% Browser Execution:</strong> All parsing and rewriting runs in your browser engine. Zero images are ever uploaded to any cloud or remote server.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
