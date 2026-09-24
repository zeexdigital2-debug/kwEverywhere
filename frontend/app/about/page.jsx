'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function AboutPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-[#0f172a] font-sans antialiased selection:bg-[#112240] selection:text-[#38bdf8]">
      
      {/* 1. TOP HEADER / NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between py-3.5">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <img
              src="/logo.png"
              alt="KWEveryWhere Logo"
              className="h-11 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-7 text-sm font-medium text-slate-600">
            <Link href="/" className="hover:text-[#0a192f] transition-colors">
              Home
            </Link>
            <Link href="/#features" className="hover:text-[#0a192f] transition-colors">
              Features
            </Link>
            <Link href="/about" className="text-[#0a192f] font-semibold transition-colors">
              About
            </Link>
            <Link href="/contact" className="hover:text-[#0a192f] transition-colors">
              Contact
            </Link>

            {/* Tools Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setToolsOpen(!toolsOpen)}
                className="flex items-center space-x-1 hover:text-[#0a192f] transition-colors focus:outline-none"
              >
                <span>Tools</span>
                <svg className={`w-3.5 h-3.5 transition-transform ${toolsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {toolsOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <Link
                    href="/dashboard/keyword-research"
                    className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-[#0b1528] hover:text-white transition-colors"
                    onClick={() => setToolsOpen(false)}
                  >
                    Keyword Research
                  </Link>
                  <Link
                    href="/dashboard/keywords-finder"
                    className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-[#0b1528] hover:text-white transition-colors"
                    onClick={() => setToolsOpen(false)}
                  >
                    Keywords Finder
                  </Link>
                  <Link
                    href="/dashboard/local-keywords"
                    className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-[#0b1528] hover:text-white transition-colors"
                    onClick={() => setToolsOpen(false)}
                  >
                    Local Keywords
                  </Link>
                  <Link
                    href="/dashboard/domain-metrics"
                    className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-[#0b1528] hover:text-white transition-colors"
                    onClick={() => setToolsOpen(false)}
                  >
                    Bulk DR / Domain Metrics
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-white border border-[#0a192f]/30 rounded-lg hover:bg-[#0a192f] hover:border-[#0a192f] transition-all"
            >
              Sign in
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 text-sm font-medium text-white bg-[#0a192f] hover:bg-[#112240] rounded-lg shadow-sm hover:shadow-md transition-all flex items-center space-x-2"
            >
              <span className="flex items-center space-x-1">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#fff" />
                  <path d="M12 2a10 10 0 0 1 8.66 5H12a5 5 0 0 0-4.33 2.5L3.34 7A10 10 0 0 1 12 2z" fill="#EA4335" />
                  <path d="M3.34 7l4.33 2.5A5 5 0 0 0 7.67 14.5L3.34 17A10 10 0 0 1 3.34 7z" fill="#FBBC05" />
                  <path d="M12 22a10 10 0 0 1-8.66-5l4.33-2.5A5 5 0 0 0 12 17h8.66A10 10 0 0 1 12 22z" fill="#34A853" />
                  <circle cx="12" cy="12" r="4" fill="#4285F4" />
                </svg>
              </span>
              <span>Get Extension</span>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
            <Link href="/" className="block py-1 text-slate-700 font-medium hover:text-[#0a192f]" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link href="/#features" className="block py-1 text-slate-700 font-medium hover:text-[#0a192f]" onClick={() => setMobileMenuOpen(false)}>
              Features
            </Link>
            <Link href="/about" className="block py-1 text-[#0a192f] font-semibold" onClick={() => setMobileMenuOpen(false)}>
              About
            </Link>
            <Link href="/contact" className="block py-1 text-slate-700 font-medium hover:text-[#0a192f]" onClick={() => setMobileMenuOpen(false)}>
              Contact
            </Link>
            <Link href="/dashboard" className="block py-1 text-slate-700 font-medium hover:text-[#0a192f]" onClick={() => setMobileMenuOpen(false)}>
              Dashboard
            </Link>
            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/login"
                className="w-full text-center py-2 text-sm font-medium text-slate-700 border border-[#0a192f]/30 rounded-lg hover:bg-[#0a192f] hover:text-white"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="w-full text-center py-2 text-sm font-medium text-white bg-[#0a192f] hover:bg-[#112240] rounded-lg"
              >
                Get Extension
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO / ABOUT INTRO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-16 md:pb-24 overflow-hidden bg-gradient-to-b from-[#f0f4f9] via-white to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Eyebrow Capsule */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#0a192f]/5 via-[#112240]/10 to-[#0a192f]/5 border border-[#0a192f]/20 text-[#0a192f] text-xs font-bold uppercase tracking-wider mb-6 shadow-sm hover:border-[#0a192f]/40 transition-all">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0a192f]"></span>
            </span>
            <span>About KWEveryWhere • The Free SEO Intelligence Platform</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15] mb-6">
            Democratizing Search Data For{' '}
            <span className="bg-gradient-to-r from-[#0a192f] via-[#1e3a8a] to-[#2563eb] bg-clip-text text-transparent">
              Every Creator &amp; Marketer.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal mb-8">
            Traditional SEO suites lock essential search volume behind expensive paywalls and restrictive monthly subscriptions. 
            <strong> KWEveryWhere</strong> was built on a singular conviction: <em>every founder, blogger, agency, and digital specialist deserves unlimited, unmetered access to real-time search demand and SERP intelligence — 100% free forever.</em>
          </p>

          {/* Key Stat Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="bg-[#0b1528] rounded-2xl p-5 border border-[#1a2b49] text-white shadow-xl">
              <div className="text-3xl font-extrabold text-[#38bdf8] mb-1 font-mono">100%</div>
              <div className="text-xs text-slate-300 font-medium uppercase tracking-wider">Free Forever</div>
            </div>
            <div className="bg-[#0b1528] rounded-2xl p-5 border border-[#1a2b49] text-white shadow-xl">
              <div className="text-3xl font-extrabold text-[#38bdf8] mb-1 font-mono">3,000</div>
              <div className="text-xs text-slate-300 font-medium uppercase tracking-wider">Batch Lookups</div>
            </div>
            <div className="bg-[#0b1528] rounded-2xl p-5 border border-[#1a2b49] text-white shadow-xl">
              <div className="text-3xl font-extrabold text-[#38bdf8] mb-1 font-mono">150+</div>
              <div className="text-xs text-slate-300 font-medium uppercase tracking-wider">Target Regions</div>
            </div>
            <div className="bg-[#0b1528] rounded-2xl p-5 border border-[#1a2b49] text-white shadow-xl">
              <div className="text-3xl font-extrabold text-[#38bdf8] mb-1 font-mono">0</div>
              <div className="text-xs text-slate-300 font-medium uppercase tracking-wider">Cards Needed</div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. OUR MISSION & CORE VALUES (Dark Navy Cards) */}
      <section className="py-24 bg-gradient-to-b from-white via-slate-50 to-[#f8fafc] border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#0a192f]/5 border border-[#0a192f]/20 text-[#0a192f] text-xs font-bold uppercase tracking-wider mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0a192f]"></span>
              <span>Our Foundational Pillars</span>
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-5 leading-tight">
              Why We Built{' '}
              <span className="bg-gradient-to-r from-[#0a192f] via-[#1e3a8a] to-[#2563eb] bg-clip-text text-transparent">
                KWEveryWhere.
              </span>
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              We empower modern search pioneers with unmetered access to verified volume benchmarks, commercial CPC projections, and domain strength metrics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Pillar 1 */}
            <div className="group relative bg-[#0b1528] p-8 rounded-3xl border border-[#1a2b49] shadow-xl hover:shadow-2xl hover:shadow-[#0a192f]/40 hover:border-[#2a436e] hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#112240] to-[#1d3557] border border-[#234575] text-[#38bdf8] flex items-center justify-center mb-6 shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="8" width="18" height="4" rx="1" />
                    <path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
                    <path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8M16.5 8a2.5 2.5 0 0 0 0-5C13 3 12 8 12 8" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#60a5fa] transition-colors">
                  Radical Price Freedom
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed font-normal">
                  No subscriptions, credit gates, trial countdowns, or sudden paywalls. We believe core search intelligence should be a public utility for digital growth, not an exorbitant monopoly.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#1a2b49] text-xs font-semibold text-[#38bdf8]">
                100% Free Forever Promise
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="group relative bg-[#0b1528] p-8 rounded-3xl border border-[#1a2b49] shadow-xl hover:shadow-2xl hover:shadow-[#0a192f]/40 hover:border-[#2a436e] hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#112240] to-[#1d3557] border border-[#234575] text-[#38bdf8] flex items-center justify-center mb-6 shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#60a5fa] transition-colors">
                  Live SERP Precision
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed font-normal">
                  Our telemetry pulls directly from verified query feeds and advertising networks, delivering genuine monthly volume, commercial CPC benchmarks, and 12-month trend velocity curves.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#1a2b49] text-xs font-semibold text-[#38bdf8]">
                Reliable Real-World Signals
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="group relative bg-[#0b1528] p-8 rounded-3xl border border-[#1a2b49] shadow-xl hover:shadow-2xl hover:shadow-[#0a192f]/40 hover:border-[#2a436e] hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#112240] to-[#1d3557] border border-[#234575] text-[#38bdf8] flex items-center justify-center mb-6 shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#60a5fa] transition-colors">
                  Everywhere You Browse
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed font-normal">
                  Whether using our full web workspace or our lightweight Chromium extension directly inside Google SERPs, KWEveryWhere surfaces rich data directly where your workflow happens.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#1a2b49] text-xs font-semibold text-[#38bdf8]">
                Web App + Chrome Extension
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. PLATFORM SUITE OVERVIEW */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block px-3 py-1 rounded-full bg-[#0a192f]/10 text-[#0a192f] text-xs font-bold uppercase tracking-wider mb-4 border border-[#0a192f]/15">
              Comprehensive SEO Tooling
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
              Everything You Need to Rank #1
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Explore the fully integrated suite of tools included completely free in your KWEveryWhere account.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            
            {/* Tool 1 */}
            <div className="p-6 rounded-2xl bg-[#0b1528] border border-[#1a2b49] text-white shadow-md flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-[#112240] text-[#38bdf8] flex items-center justify-center flex-shrink-0 border border-[#234575]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Keyword Research &amp; Volume Analyzer</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Analyze single terms or paste batches up to 3,000 queries. Get monthly search volumes, CPC rates, competition density, and seasonal sparklines.
                </p>
                <Link href="/dashboard/keyword-research" className="mt-3 inline-block text-xs font-semibold text-[#38bdf8] hover:underline">
                  Launch Tool →
                </Link>
              </div>
            </div>

            {/* Tool 2 */}
            <div className="p-6 rounded-2xl bg-[#0b1528] border border-[#1a2b49] text-white shadow-md flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-[#112240] text-[#38bdf8] flex items-center justify-center flex-shrink-0 border border-[#234575]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Long-Tail Keywords Finder</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Expand seed keywords into high-converting long-tail variants, buyer-intent queries, and question phrases that are easy to rank for.
                </p>
                <Link href="/dashboard/keywords-finder" className="mt-3 inline-block text-xs font-semibold text-[#38bdf8] hover:underline">
                  Launch Tool →
                </Link>
              </div>
            </div>

            {/* Tool 3 */}
            <div className="p-6 rounded-2xl bg-[#0b1528] border border-[#1a2b49] text-white shadow-md flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-[#112240] text-[#38bdf8] flex items-center justify-center flex-shrink-0 border border-[#234575]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Local Keywords Explorer</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Tailored local SEO intelligence for regional businesses, agencies, and service providers. Benchmark city and state-level consumer demand.
                </p>
                <Link href="/dashboard/local-keywords" className="mt-3 inline-block text-xs font-semibold text-[#38bdf8] hover:underline">
                  Launch Tool →
                </Link>
              </div>
            </div>

            {/* Tool 4 */}
            <div className="p-6 rounded-2xl bg-[#0b1528] border border-[#1a2b49] text-white shadow-md flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-[#112240] text-[#38bdf8] flex items-center justify-center flex-shrink-0 border border-[#234575]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Bulk DR &amp; Domain Authority</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Audit hundreds of competitor domains simultaneously. Benchmark OpenPageRank authority, backlink strength, and ranking viability.
                </p>
                <Link href="/dashboard/domain-metrics" className="mt-3 inline-block text-xs font-semibold text-[#38bdf8] hover:underline">
                  Launch Tool →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. CTA BANNER */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#060e1d] via-[#0b1833] to-[#102244] border border-[#1a2b49] rounded-3xl p-10 md:p-14 text-center text-white shadow-2xl shadow-[#0a192f]/50">
            <div className="relative">
              <span className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-sky-200 text-xs font-bold uppercase tracking-wider mb-6">
                <span>Start In Seconds</span>
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
                Unlock Unmetered Keyword Intelligence.
              </h2>
              <p className="text-slate-300 text-sm sm:text-base max-w-lg mx-auto mb-8 leading-relaxed font-normal">
                No credit cards. No trial countdowns. Jump straight into the dashboard or install our lightweight Chrome extension today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center space-x-2 px-8 py-3.5 bg-white text-[#0a192f] hover:bg-slate-100 font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                >
                  <span>Launch Dashboard</span>
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center space-x-2 px-8 py-3.5 bg-[#0a192f]/70 hover:bg-[#0a192f] text-white border border-[#2a436e] hover:border-[#38bdf8]/40 font-bold rounded-xl hover:-translate-y-0.5 transition-all duration-200"
                >
                  <span>Back to Home</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SITE FOOTER */}
      <footer className="bg-[#070e1c] text-slate-400 py-16 border-t border-[#162646]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <img
                src="/logo.png"
                alt="KWEveryWhere Logo"
                className="h-12 w-auto object-contain bg-white rounded-xl p-1.5 shadow-sm"
              />
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Next-generation keyword intelligence and search discovery engineered for modern digital creators.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/#features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="/#faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/signup" className="hover:text-white transition-colors">Sign up</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Sign in</Link></li>
            </ul>
          </div>

          {/* Free Tools */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Free Tools</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/dashboard/domain-metrics" className="hover:text-white transition-colors">Bulk DR Checker</Link></li>
              <li><Link href="/dashboard/keyword-research" className="hover:text-white transition-colors">Keyword Research</Link></li>
              <li><Link href="/dashboard/keywords-finder" className="hover:text-white transition-colors">Keywords Finder</Link></li>
              <li><Link href="/dashboard/local-keywords" className="hover:text-white transition-colors">Local Keywords</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
            </ul>
          </div>

        </div>

        {/* Legal Disclaimer */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-800/80 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} KWEveryWhere. Google Ads is a trademark of Google LLC. KWEveryWhere is not affiliated with or endorsed by Google.</p>
        </div>
      </footer>

    </div>
  );
}
