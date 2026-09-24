'use client';

import React from 'react';
import { TrendingUp, FileSpreadsheet, Shield, Cpu, Zap, BarChart2, CheckCircle2 } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: TrendingUp,
      title: 'Trend Direction & Volume Estimates',
      description: 'Instant monthly volume estimates and trend direction indicators (📈 Upward, ➡️ Stable, 📉 Downward).',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10'
    },
    {
      icon: FileSpreadsheet,
      title: 'Bulk CSV & Multiline Input',
      description: 'Upload hundreds of keywords via CSV drag-and-drop or multiline text box for batch research.',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10'
    },
    {
      icon: Shield,
      title: 'OpenPageRank Domain Authority',
      description: 'Evaluate competitor domains with free OpenPageRank scores (DA 0-100) and global web rankings.',
      color: 'text-purple-400',
      bg: 'bg-purple-500/10'
    },
    {
      icon: Cpu,
      title: 'Google Autocomplete Expansion',
      description: 'Discover relevant long-tail search queries extracted directly from Google search suggestions.',
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10'
    },
    {
      icon: BarChart2,
      title: 'One-Click CSV Export',
      description: 'Download clean CSV reports formatted with keywords, volumes, competition levels, and trend indicators.',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10'
    },
    {
      icon: Zap,
      title: 'Rate-Limited Express REST API',
      description: 'Backend Node.js server guarded with rate limiting, credit deduction, and Mongoose schemas.',
      color: 'text-rose-400',
      bg: 'bg-rose-500/10'
    }
  ];

  return (
    <section className="py-16 bg-dark-900/60 border-t border-gray-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Built for Modern SEO & Content Strategists
          </h2>
          <p className="mt-4 text-base text-gray-400">
            Comprehensive keyword volume analytics, competition metrics, and domain authority tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, idx) => (
            <div key={idx} className="glass-card p-6 rounded-2xl border border-gray-800 glass-card-hover flex flex-col justify-between">
              <div>
                <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center mb-5`}>
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.description}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-800/60 flex items-center text-xs text-gray-500">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mr-1.5" />
                <span>Next.js Web Engine Ready</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
