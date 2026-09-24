'use client';

import React, { useState } from 'react';
import { Search, Upload, FileText, Sparkles, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';

export default function KeywordInput({ onResearch, loading, error }) {
  const [activeTab, setActiveTab] = useState('single');
  const [singleKw, setSingleKw] = useState('');
  const [bulkText, setBulkText] = useState('');
  const [csvFileName, setCsvFileName] = useState('');
  const [csvKeywords, setCsvKeywords] = useState([]);

  const handleSingleSubmit = (e) => {
    e.preventDefault();
    if (singleKw.trim()) {
      onResearch([singleKw.trim()]);
      setSingleKw('');
    }
  };

  const handleBulkSubmit = (e) => {
    e.preventDefault();
    let kwList = [];
    if (csvKeywords.length > 0) {
      kwList = csvKeywords;
    } else if (bulkText.trim()) {
      kwList = bulkText.split('\n').map(k => k.trim()).filter(k => k.length > 0);
    }

    if (kwList.length > 0) {
      onResearch(kwList);
      setBulkText('');
      setCsvKeywords([]);
      setCsvFileName('');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCsvFileName(file.name);
    Papa.parse(file, {
      complete: (results) => {
        const parsedList = [];
        results.data.forEach(row => {
          if (Array.isArray(row)) {
            row.forEach(cell => {
              if (typeof cell === 'string' && cell.trim() && !cell.toLowerCase().includes('keyword')) {
                parsedList.push(cell.trim());
              }
            });
          } else if (typeof row === 'object' && row !== null) {
            Object.values(row).forEach(val => {
              if (typeof val === 'string' && val.trim()) {
                parsedList.push(val.trim());
              }
            });
          }
        });
        setCsvKeywords(parsedList.slice(0, 50));
      }
    });
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-gray-800 shadow-xl">
      
      {/* Tab Switcher */}
      <div className="flex items-center justify-between mb-5 border-b border-gray-800 pb-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('single')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'single'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                : 'bg-dark-800 text-gray-400 hover:text-white'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Single Keyword</span>
          </button>
          <button
            onClick={() => setActiveTab('bulk')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'bulk'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                : 'bg-dark-800 text-gray-400 hover:text-white'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Bulk CSV / Text Upload</span>
          </button>
        </div>

        <span className="text-[11px] font-mono text-gray-400 hidden sm:inline">
          Google Autocomplete & Trend Direction Integrated
        </span>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Single Search Form */}
      {activeTab === 'single' ? (
        <form onSubmit={handleSingleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
            <input
              type="text"
              required
              value={singleKw}
              onChange={(e) => setSingleKw(e.target.value)}
              placeholder="Enter target keyword (e.g. 'seo tools', 'digital marketing')..."
              className="w-full bg-dark-800 border border-gray-700/80 rounded-2xl pl-12 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center space-x-2 shrink-0"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Research Keyword</span>
              </>
            )}
          </button>
        </form>
      ) : (
        /* Bulk Form */
        <form onSubmit={handleBulkSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-2 border-dashed border-gray-700 hover:border-emerald-500/80 rounded-2xl p-5 text-center bg-dark-800/50 transition-colors relative flex flex-col items-center justify-center min-h-[140px]">
              <input
                type="file"
                accept=".csv,.txt"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <Upload className="w-8 h-8 text-emerald-400 mb-2" />
              <p className="text-xs font-semibold text-gray-200">
                {csvFileName ? `File Loaded: ${csvFileName}` : 'Drag & drop CSV file or click to browse'}
              </p>
              {csvKeywords.length > 0 && (
                <span className="mt-1 text-[11px] text-emerald-400 font-mono flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  {csvKeywords.length} keywords ready
                </span>
              )}
            </div>

            <div>
              <textarea
                rows={5}
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder="Or paste list of keywords (one per line)..."
                className="w-full bg-dark-800 border border-gray-700/80 rounded-2xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 font-mono resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || (!bulkText.trim() && csvKeywords.length === 0)}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing Bulk Batch...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>Analyze Bulk List</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

    </div>
  );
}
