import React, { useState } from 'react';
import { Search, Sparkles, TrendingUp, ShieldCheck, ArrowRight, Zap, Database, Chrome } from 'lucide-react';
import { useKeywords } from '../context/KeywordContext';

export default function Hero({ onExploreDashboard, onOpenExtensionModal }) {
  const [quickInput, setQuickInput] = useState('');
  const { performResearch } = useKeywords();

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    if (quickInput.trim()) {
      performResearch(quickInput.trim());
      onExploreDashboard();
    }
  };

  return (
    <div className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-accent-blue/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Top Tagline Pill */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold tracking-wide mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-Time Search Volume, Trends & DA Engine</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
          Uncover High-Profit Keywords <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-emerald-300 to-accent-cyan">
            Directly on Google Search
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto font-normal leading-relaxed">
          AI-driven keyword metrics, 12-month search trends, competition breakdown, OpenPageRank domain authority check, and a seamless Chrome Extension overlay.
        </p>

        {/* Quick Search Input Bar */}
        <div className="mt-10 max-w-2xl mx-auto">
          <form onSubmit={handleQuickSubmit} className="relative flex items-center glass-panel p-2 rounded-2xl border border-gray-700/80 shadow-2xl focus-within:border-brand-500/80 transition-all">
            <Search className="w-6 h-6 text-gray-400 ml-3" />
            <input
              type="text"
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              placeholder="Enter seed keyword (e.g., 'seo software', 'best laptops')..."
              className="w-full bg-transparent px-4 py-3 text-white placeholder-gray-500 focus:outline-none text-base font-medium"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-semibold text-sm transition-all shadow-lg shadow-brand-500/30 flex items-center space-x-2 shrink-0"
            >
              <span>Analyze Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-gray-400">
            <span className="text-gray-500">Popular seeds:</span>
            {['ai keyword research', 'domain authority check', 'content strategy', 'e-commerce seo'].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setQuickInput(tag);
                  performResearch(tag);
                  onExploreDashboard();
                }}
                className="px-2.5 py-1 rounded-md bg-dark-800 hover:bg-gray-800 text-gray-300 hover:text-brand-400 border border-gray-800 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap justify-center items-center gap-4">
          <button
            onClick={onExploreDashboard}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold text-sm shadow-xl shadow-brand-500/20 transition-all flex items-center space-x-2"
          >
            <Database className="w-4 h-4" />
            <span>Open Research Dashboard</span>
          </button>
          
          <button
            onClick={onOpenExtensionModal}
            className="px-8 py-3.5 rounded-xl bg-dark-800 hover:bg-gray-800 text-amber-400 font-semibold text-sm border border-amber-500/30 hover:border-amber-400 transition-all flex items-center space-x-2 shadow-lg"
          >
            <Chrome className="w-4 h-4 text-amber-400" />
            <span>Get Chrome Extension</span>
          </button>
        </div>

        {/* Stats Strip */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { label: 'Keyword Database', value: '1.2B+', icon: Database },
            { label: 'Google Autocomplete', value: 'Instant', icon: Sparkles },
            { label: 'PageRank & DA', value: 'OpenPageRank', icon: ShieldCheck },
            { label: 'Google Search Overlay', value: 'Chrome MV3', icon: Chrome },
          ].map((stat, idx) => (
            <div key={idx} className="glass-card p-4 rounded-2xl text-center border border-gray-800">
              <stat.icon className="w-5 h-5 text-brand-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white font-mono">{stat.value}</div>
              <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
