'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Sparkles, ArrowRight, ShieldCheck, Database, TrendingUp, Zap } from 'lucide-react';

export default function Hero() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/dashboard?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-Time Search Volume, Trend Directions & Domain Authority</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
          AI-Powered Keyword Research & <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            SEO Intelligence Engine
          </span>
        </h1>

        <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto font-normal leading-relaxed">
          Uncover search volume estimates, 12-month trend direction metrics (📈 Upward / ➡️ Stable / 📉 Downward), competition levels, and OpenPageRank domain authority.
        </p>

        {/* Quick Search Bar */}
        <div className="mt-10 max-w-2xl mx-auto">
          <form onSubmit={handleSearch} className="relative flex items-center glass-panel p-2 rounded-2xl border border-gray-700/80 shadow-2xl focus-within:border-emerald-500/80 transition-all">
            <Search className="w-6 h-6 text-gray-400 ml-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter seed keyword (e.g., 'seo software', 'best laptops')..."
              className="w-full bg-transparent px-4 py-3 text-white placeholder-gray-500 focus:outline-none text-base font-medium"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-500/30 flex items-center space-x-2 shrink-0"
            >
              <span>Explore Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-gray-400">
            <span className="text-gray-500">Popular:</span>
            {['digital marketing 2026', 'ai keyword generator', 'domain authority check', 'content strategy'].map((tag) => (
              <button
                key={tag}
                onClick={() => router.push(`/dashboard?q=${encodeURIComponent(tag)}`)}
                className="px-2.5 py-1 rounded-md bg-dark-800 hover:bg-gray-800 text-gray-300 hover:text-emerald-400 border border-gray-800 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Feature stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { label: 'Keyword Database', value: '1.5B+', icon: Database },
            { label: 'Trend Direction', value: '📈 Up/Down/Stable', icon: TrendingUp },
            { label: 'Domain Authority', value: 'OpenPageRank', icon: ShieldCheck },
            { label: 'Free Trial Credits', value: '250 Free', icon: Zap },
          ].map((stat, idx) => (
            <div key={idx} className="glass-card p-4 rounded-2xl text-center border border-gray-800">
              <stat.icon className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-white font-mono">{stat.value}</div>
              <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
