'use client';

import React from 'react';
import Link from 'next/link';
import { Check, Sparkles, Zap } from 'lucide-react';

export default function Pricing() {
  const plans = [
    {
      name: 'Free Starter',
      price: '$0',
      period: 'forever',
      description: 'Ideal for trying out basic keyword research and domain metrics.',
      credits: '250 Free Credits',
      features: [
        'Single & Bulk Keyword Search',
        'Search Volume Estimates',
        'Trend Direction Indicators',
        'Basic Domain Authority Check',
        'CSV Export'
      ],
      popular: false,
      cta: 'Start Free Now',
      href: '/dashboard'
    },
    {
      name: 'Pro Marketer',
      price: '$29',
      period: 'per month',
      description: 'For growth marketers, bloggers, and SEO professionals.',
      credits: '10,000 Credits / mo',
      features: [
        'Everything in Free Plan',
        'Google Autocomplete Long-Tails',
        'Priority API Speed',
        'Unlimited CSV Exports',
        'OpenPageRank Domain Scores',
        'History Search Logs'
      ],
      popular: true,
      cta: 'Upgrade to Pro',
      href: '/signup'
    },
    {
      name: 'Agency Scale',
      price: '$99',
      period: 'per month',
      description: 'Designed for agencies and high-volume content teams.',
      credits: '50,000 Credits / mo',
      features: [
        'Everything in Pro Plan',
        'Dedicated API Rate Limit',
        'Multi-User Team Access',
        'Custom Data Exporters',
        '24/7 Priority Support'
      ],
      popular: false,
      cta: 'Contact Sales',
      href: '/signup'
    }
  ];

  return (
    <section className="py-20 bg-dark-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Simple, Transparent Pricing Tiers
          </h2>
          <p className="mt-4 text-base text-gray-400">
            Start free with 250 API credits. Upgrade whenever you need higher volume limits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`glass-panel p-8 rounded-3xl border transition-all flex flex-col justify-between relative ${
                plan.popular ? 'border-emerald-500/80 shadow-2xl shadow-emerald-500/10' : 'border-gray-800'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-500 text-white text-[11px] font-bold uppercase tracking-wider shadow-md">
                  Most Popular
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-xs text-gray-400 mb-6">{plan.description}</p>
                
                <div className="flex items-baseline mb-2">
                  <span className="text-4xl font-extrabold text-white font-mono">{plan.price}</span>
                  <span className="text-xs text-gray-400 ml-2">/ {plan.period}</span>
                </div>
                
                <div className="inline-block px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-mono font-semibold mb-6 border border-emerald-500/20">
                  {plan.credits}
                </div>

                <div className="space-y-3 mb-8">
                  {plan.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center space-x-2 text-xs text-gray-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href={plan.href}
                className={`w-full py-3 rounded-xl text-center text-xs font-bold transition-all shadow-md ${
                  plan.popular
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/25'
                    : 'bg-dark-800 hover:bg-gray-800 text-white border border-gray-700'
                }`}
              >
                {plan.cta}
              </Link>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
