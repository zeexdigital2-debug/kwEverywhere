'use client';

import React, { useState, useEffect } from 'react';
import { X, Download, Copy, Check, ExternalLink, Search, FileSpreadsheet, MousePointerClick, Chrome, Sparkles } from 'lucide-react';
import { CHROME_STORE_URL, ZIP_URL, VERSION } from '@/lib/extensionConfig';

export default function ExtensionInstallModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText('chrome://extensions');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isStoreAvailable = Boolean(CHROME_STORE_URL && CHROME_STORE_URL.trim().length > 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative w-full max-w-lg bg-[#0b1528] border border-[#1a2b49] rounded-3xl shadow-2xl shadow-[#0a192f]/80 p-6 sm:p-8 text-white overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow accent */}
        <div className="absolute -top-24 -right-24 w-56 h-56 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#112240] transition-colors focus:outline-none"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3.5 mb-5 pr-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#112240] to-[#1c3761] border border-[#234575] flex items-center justify-center shrink-0 shadow-md">
            {/* Chrome Colorful Icon */}
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#fff" />
              <path d="M12 2a10 10 0 0 1 8.66 5H12a5 5 0 0 0-4.33 2.5L3.34 7A10 10 0 0 1 12 2z" fill="#EA4335" />
              <path d="M3.34 7l4.33 2.5A5 5 0 0 0 7.67 14.5L3.34 17A10 10 0 0 1 3.34 7z" fill="#FBBC05" />
              <path d="M12 22a10 10 0 0 1-8.66-5l4.33-2.5A5 5 0 0 0 12 17h8.66A10 10 0 0 1 12 22z" fill="#34A853" />
              <circle cx="12" cy="12" r="4" fill="#4285F4" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Add KWEverywhere to Chrome
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live SEO keyword intelligence directly in your browser
            </p>
          </div>
        </div>

        {/* 3 Short Features */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center space-x-3 bg-[#070e1a]/80 border border-[#162947] rounded-xl px-3.5 py-2.5 text-xs text-slate-200">
            <div className="w-6 h-6 rounded-lg bg-[#38bdf8]/10 text-[#38bdf8] flex items-center justify-center shrink-0">
              <Search className="w-3.5 h-3.5" />
            </div>
            <span>Volume + CPC + competition on Google search</span>
          </div>

          <div className="flex items-center space-x-3 bg-[#070e1a]/80 border border-[#162947] rounded-xl px-3.5 py-2.5 text-xs text-slate-200">
            <div className="w-6 h-6 rounded-lg bg-[#38bdf8]/10 text-[#38bdf8] flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-3.5 h-3.5" />
            </div>
            <span>Related keywords with Copy / CSV export</span>
          </div>

          <div className="flex items-center space-x-3 bg-[#070e1a]/80 border border-[#162947] rounded-xl px-3.5 py-2.5 text-xs text-slate-200">
            <div className="w-6 h-6 rounded-lg bg-[#38bdf8]/10 text-[#38bdf8] flex items-center justify-center shrink-0">
              <MousePointerClick className="w-3.5 h-3.5" />
            </div>
            <span>Right-click lookup on selected text</span>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="mb-6">
          {isStoreAvailable ? (
            <a
              href={CHROME_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-5 rounded-xl font-bold text-sm bg-gradient-to-r from-[#38bdf8] to-[#2563eb] hover:from-[#60a5fa] hover:to-[#1d4ed8] text-white shadow-lg shadow-sky-500/25 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5"
            >
              <Chrome className="w-4 h-4" />
              <span>Add from Chrome Web Store</span>
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          ) : (
            <a
              href={ZIP_URL}
              download
              className="w-full py-3.5 px-5 rounded-xl font-bold text-sm bg-gradient-to-r from-[#38bdf8] to-[#2563eb] hover:from-[#60a5fa] hover:to-[#1d4ed8] text-white shadow-lg shadow-sky-500/25 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5"
            >
              <Download className="w-4 h-4" />
              <span>Download extension (v{VERSION})</span>
            </a>
          )}
        </div>

        {/* Installation Steps */}
        <div className="bg-[#070e1a]/90 border border-[#182a48] rounded-2xl p-4 sm:p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Manual Installation Steps
            </span>
            <span className="text-[10px] text-sky-400 font-mono">Quick Setup</span>
          </div>

          <ol className="space-y-3 text-xs text-slate-300">
            {/* Step 1 */}
            <li className="flex items-start space-x-2.5">
              <span className="w-5 h-5 rounded-full bg-[#112240] text-[#38bdf8] border border-[#203a63] font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                1
              </span>
              <p className="leading-relaxed">
                Unzip the file.
              </p>
            </li>

            {/* Step 2 */}
            <li className="flex items-start space-x-2.5">
              <span className="w-5 h-5 rounded-full bg-[#112240] text-[#38bdf8] border border-[#203a63] font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                2
              </span>
              <div className="flex-1 flex flex-wrap items-center gap-1.5 leading-relaxed">
                <span>Open</span>
                <code className="bg-[#0b1528] text-sky-300 font-mono text-[11px] px-2 py-0.5 rounded border border-[#234575]">
                  chrome://extensions
                </code>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-[#112240] hover:bg-[#1a3660] text-slate-200 hover:text-white border border-[#234575] text-[10px] font-medium transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-300" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </li>

            {/* Step 3 */}
            <li className="flex items-start space-x-2.5">
              <span className="w-5 h-5 rounded-full bg-[#112240] text-[#38bdf8] border border-[#203a63] font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                3
              </span>
              <p className="leading-relaxed">
                Turn on <strong>Developer mode</strong>.
              </p>
            </li>

            {/* Step 4 */}
            <li className="flex items-start space-x-2.5">
              <span className="w-5 h-5 rounded-full bg-[#112240] text-[#38bdf8] border border-[#203a63] font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                4
              </span>
              <p className="leading-relaxed">
                Click <strong>&quot;Load unpacked&quot;</strong> and select the unzipped folder.
              </p>
            </li>
          </ol>
        </div>

        {/* Note */}
        {!isStoreAvailable && (
          <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-400 pt-1 text-center">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Chrome Web Store version coming soon</span>
          </div>
        )}
      </div>
    </div>
  );
}
