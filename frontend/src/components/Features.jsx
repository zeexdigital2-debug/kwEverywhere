import React from 'react';
import { TrendingUp, FileSpreadsheet, Shield, Cpu, Zap, Chrome, CheckCircle2 } from 'lucide-react';

export default function Features({ onOpenExtensionModal }) {
  const features = [
    {
      icon: TrendingUp,
      title: '12-Month Search Volume & Trends',
      description: 'Accurate estimates of monthly search volume and seasonal trend graphs powered by Google data analytics.',
      color: 'text-brand-400',
      bg: 'bg-brand-500/10'
    },
    {
      icon: FileSpreadsheet,
      title: 'Bulk CSV Keyword Upload & Export',
      description: 'Import hundreds of target keywords via CSV drag-and-drop, analyze difficulty, and export clean CSV reports with one click.',
      color: 'text-accent-blue',
      bg: 'bg-blue-500/10'
    },
    {
      icon: Shield,
      title: 'OpenPageRank Domain Authority',
      description: 'Evaluate competitor URL & domain authority scores (DA 0-100) and global rank metrics instantly.',
      color: 'text-purple-400',
      bg: 'bg-purple-500/10'
    },
    {
      icon: Chrome,
      title: 'Manifest V3 Chrome Extension',
      description: 'Inject live keyword metrics bars and competitor DA badges straight onto Google Search result pages.',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10'
    },
    {
      icon: Cpu,
      title: 'Google Autocomplete Expansion',
      description: 'Discover long-tail keyword variations directly extracted from live Google search autocomplete suggestions.',
      color: 'text-accent-cyan',
      bg: 'bg-cyan-500/10'
    },
    {
      icon: Zap,
      title: 'Express REST API & Rate Limits',
      description: 'Protected Node.js backend with JWT/API Token validation and express-rate-limit protection against abuse.',
      color: 'text-rose-400',
      bg: 'bg-rose-500/10'
    }
  ];

  return (
    <section className="py-16 bg-dark-900/60 border-t border-gray-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Everything You Need for Data-Driven SEO
          </h2>
          <p className="mt-4 text-base text-gray-400">
            Engineered for digital marketers, SEO agencies, content creators, and growth hackers.
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
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 mr-1.5" />
                <span>Production Ready & Fully Tested</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
