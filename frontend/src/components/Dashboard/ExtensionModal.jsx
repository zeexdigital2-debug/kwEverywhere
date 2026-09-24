import React, { useState } from 'react';
import { X, Chrome, Copy, Check, Key, ShieldCheck, Download, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ExtensionModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const { apiKey, generateApiKey } = useAuth();
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handleCopy = () => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerate = async () => {
    setGenerating(true);
    await generateApiKey();
    setGenerating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="relative w-full max-w-xl glass-panel p-8 rounded-3xl border border-gray-700/80 shadow-2xl animate-in fade-in zoom-in-95">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Chrome className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white">Connect Chrome Extension</h3>
            <p className="text-xs text-gray-400">Inject live keyword metrics bar directly on Google Search</p>
          </div>
        </div>

        {/* Extension Token Box */}
        <div className="bg-dark-800 p-5 rounded-2xl border border-gray-700/80 mb-6">
          <label className="block text-xs font-semibold text-gray-300 mb-2 flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>Your Personal API Token</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">Manifest V3 Token</span>
          </label>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={apiKey || 'Click Generate to create API Token'}
              className="w-full bg-dark-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono focus:outline-none"
            />
            
            {apiKey ? (
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl transition-all shrink-0 flex items-center space-x-1.5 shadow-md shadow-amber-500/20"
              >
                {copied ? <Check className="w-4 h-4 text-black" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="px-4 py-2 bg-brand-500 hover:bg-brand-400 text-white font-bold text-xs rounded-xl transition-all shrink-0"
              >
                <span>Generate Token</span>
              </button>
            )}
          </div>
        </div>

        {/* Step-by-step instructions */}
        <div className="space-y-3 mb-6 text-xs text-gray-300">
          <div className="font-semibold text-gray-200 uppercase tracking-wider text-[11px]">Installation Steps:</div>
          <div className="flex items-start space-x-3 bg-dark-800/40 p-2.5 rounded-xl border border-gray-800">
            <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 font-bold flex items-center justify-center text-[11px] shrink-0">1</span>
            <p>Open Chrome and navigate to <code className="bg-dark-900 px-1.5 py-0.5 rounded text-amber-300 font-mono">chrome://extensions</code></p>
          </div>
          <div className="flex items-start space-x-3 bg-dark-800/40 p-2.5 rounded-xl border border-gray-800">
            <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 font-bold flex items-center justify-center text-[11px] shrink-0">2</span>
            <p>Enable <strong>Developer mode</strong> toggle switch in top-right corner.</p>
          </div>
          <div className="flex items-start space-x-3 bg-dark-800/40 p-2.5 rounded-xl border border-gray-800">
            <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 font-bold flex items-center justify-center text-[11px] shrink-0">3</span>
            <p>Click <strong>Load unpacked</strong> and select the <code className="bg-dark-900 px-1.5 py-0.5 rounded text-amber-300 font-mono">/extension</code> directory from this project.</p>
          </div>
          <div className="flex items-start space-x-3 bg-dark-800/40 p-2.5 rounded-xl border border-gray-800">
            <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 font-bold flex items-center justify-center text-[11px] shrink-0">4</span>
            <p>Click extension icon, paste your token above, and open Google Search!</p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl text-xs font-semibold"
          >
            Got It
          </button>
        </div>

      </div>
    </div>
  );
}
