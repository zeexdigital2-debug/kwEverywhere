'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const SERP_DATA = [
  {
    kw: 'ai seo optimization tools',
    vol: '74,000/mo',
    cpc: '$4.20',
    comp: '0.65',
    kd: 46,
    kdLabel: 'Moderate',
    kdColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    intent: 'Commercial',
    intentColor: 'text-sky-400 border-sky-400/30 bg-sky-500/10',
    trendPct: '+34% YoY',
    country: 'United States',
    flag: '🇺🇸',
    resultsCount: '184,000,000',
    speed: '0.42s',
    topSnippet: {
      site: 'searchengineland.com',
      url: 'https://searchengineland.com › ai-seo-tools-guide',
      title: 'Top AI SEO Optimization Tools & Software for 2026 Rankings',
      desc: 'Comprehensive evaluation of automated SERP intelligence, NLP entity analysis, and generative keyword clustering transforming modern search visibility.',
      metrics: { da: 88, pa: 64, backlinks: '18.4K', refDomains: '2.1K', traffic: '52.3K/mo' }
    },
    relatedKw: ['ai keyword research free', 'best seo tools 2026', 'automated serp scraper', 'semantic search audit'],
    bars: [12, 14, 16, 19, 21, 23, 24, 22, 20, 18, 16, 14]
  },
  {
    kw: 'ecommerce growth strategy',
    vol: '27,100/mo',
    cpc: '$3.80',
    comp: '0.42',
    kd: 38,
    kdLabel: 'Low',
    kdColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    intent: 'Informational',
    intentColor: 'text-emerald-400 border-emerald-400/30 bg-emerald-500/10',
    trendPct: '+18% YoY',
    country: 'United States',
    flag: '🇺🇸',
    resultsCount: '92,400,000',
    speed: '0.38s',
    topSnippet: {
      site: 'shopify.com',
      url: 'https://www.shopify.com › blog › ecommerce-growth-framework',
      title: 'The Ultimate eCommerce Growth Strategy Blueprint (With Playbooks)',
      desc: 'Learn how multi-channel conversion rate optimization, organic customer acquisition, and high-intent product search terms compound store revenue.',
      metrics: { da: 96, pa: 82, backlinks: '94.6K', refDomains: '12.8K', traffic: '180K/mo' }
    },
    relatedKw: ['dtc marketing strategy', 'ecommerce seo checklist', 'shopify customer acquisition', 'organic conversion rate'],
    bars: [14, 16, 18, 20, 21, 19, 17, 15, 13, 14, 16, 18]
  },
  {
    kw: 'high cpc keyword research',
    vol: '18,900/mo',
    cpc: '$7.50',
    comp: '0.78',
    kd: 62,
    kdLabel: 'Competitive',
    kdColor: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
    intent: 'Transactional',
    intentColor: 'text-purple-400 border-purple-400/30 bg-purple-500/10',
    trendPct: '+52% YoY',
    country: 'United States',
    flag: '🇺🇸',
    resultsCount: '41,800,000',
    speed: '0.45s',
    topSnippet: {
      site: 'wordstream.com',
      url: 'https://wordstream.com › high-cpc-keywords-monetization',
      title: 'Top High-Paying CPC Keywords in Google Ads & How to Target Them',
      desc: 'Maximize Google AdSense & affiliate ROI. Find lucrative high-intent bidding queries across legal, insurance, finance, and enterprise software.',
      metrics: { da: 91, pa: 71, backlinks: '34.2K', refDomains: '4.8K', traffic: '89.1K/mo' }
    },
    relatedKw: ['most expensive google keywords', 'best adsense niches', 'affiliate cpc list', 'ppc bidding benchmark'],
    bars: [16, 18, 15, 17, 19, 21, 20, 18, 19, 21, 23, 22]
  },
  {
    kw: 'local seo ranking factors',
    vol: '14,200/mo',
    cpc: '$5.10',
    comp: '0.35',
    kd: 29,
    kdLabel: 'Easy',
    kdColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    intent: 'Informational',
    intentColor: 'text-sky-400 border-sky-400/30 bg-sky-500/10',
    trendPct: '+22% YoY',
    country: 'United States',
    flag: '🇺🇸',
    resultsCount: '36,100,000',
    speed: '0.35s',
    topSnippet: {
      site: 'moz.com',
      url: 'https://moz.com › learn › local-ranking-factors-study',
      title: 'Google Local Search Ranking Factors: 2026 Empirical Study',
      desc: 'Explore the breakdown of Google Business Profile optimization, localized backlink signals, citation consistency, and review sentiment metrics.',
      metrics: { da: 92, pa: 78, backlinks: '62.1K', refDomains: '8.4K', traffic: '67.4K/mo' }
    },
    relatedKw: ['gbp optimization guide', 'local citation building', 'google map pack rankings', 'near me search algorithm'],
    bars: [12, 14, 16, 18, 16, 18, 20, 22, 23, 21, 19, 17]
  }
];


export default function LandingPage() {
  const [activeKeywordIdx, setActiveKeywordIdx] = useState(0);
  const [displayedQuery, setDisplayedQuery] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('metrics'); // 'metrics' | 'snippet' | 'related'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  // Google typing simulation effect
  useEffect(() => {
    let timeout;
    const currentTarget = SERP_DATA[activeKeywordIdx].kw;

    if (isTyping) {
      if (displayedQuery.length < currentTarget.length) {
        timeout = setTimeout(() => {
          setDisplayedQuery(currentTarget.slice(0, displayedQuery.length + 1));
        }, 75);
      } else {
        // Query completed, simulate quick SERP parsing pulse
        setIsSearching(true);
        timeout = setTimeout(() => {
          setIsSearching(false);
          setIsTyping(false);
        }, 400);
      }
    } else {
      // Pause on completed keyword before rotating to next
      timeout = setTimeout(() => {
        setDisplayedQuery('');
        setActiveKeywordIdx((prev) => (prev + 1) % SERP_DATA.length);
        setIsTyping(true);
      }, 3600);
    }

    return () => clearTimeout(timeout);
  }, [displayedQuery, isTyping, activeKeywordIdx]);

  const selectKeyword = (idx) => {
    setActiveKeywordIdx(idx);
    setDisplayedQuery(SERP_DATA[idx].kw);
    setIsTyping(false);
    setIsSearching(false);
  };

  const currentSerp = SERP_DATA[activeKeywordIdx];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

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
            <a href="#features" className="hover:text-[#0a192f] transition-colors">
              Features
            </a>
            <Link href="/about" className="hover:text-[#0a192f] transition-colors">
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
                {/* Chrome Icon SVG */}
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
            <a href="#features" className="block py-1 text-slate-700 font-medium hover:text-[#0a192f]" onClick={() => setMobileMenuOpen(false)}>
              Features
            </a>
            <Link href="/about" className="block py-1 text-slate-700 font-medium hover:text-[#0a192f]" onClick={() => setMobileMenuOpen(false)}>
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

      {/* 2. HERO SECTION WITH GOOGLE SERP SIMULATION */}
      <section className="relative pt-4 sm:pt-6 md:pt-8 pb-8 md:pb-12 overflow-hidden bg-gradient-to-b from-[#f0f4f9] via-white to-white">
        
        {/* Ambient Radial Glow Lighting */}
        <div className="absolute top-28 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[38rem] h-[18rem] bg-gradient-to-tr from-sky-400/20 via-[#2563eb]/20 to-indigo-500/15 blur-3xl rounded-full pointer-events-none -z-10 animate-glow-pulse" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          {/* Eyebrow Capsule */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#1e3a8a]/20 text-[#0a192f] text-xs font-bold uppercase tracking-wider mb-5 shadow-xs hover:border-[#38bdf8]/50 hover:shadow-md transition-all">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2563eb]"></span>
            </span>
            <span className="font-semibold text-slate-800">Next-Gen Search Intelligence</span>
            <span className="text-slate-300">•</span>
            <span className="text-[#2563eb] font-bold">100% Free &amp; Uncapped</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-extrabold tracking-[-0.035em] text-slate-900 leading-[1.09] mb-5 max-w-4xl mx-auto">
            Dominate Search Rankings With{' '}
            <span className="bg-gradient-to-r from-[#0a192f] via-[#1e3a8a] via-[#2563eb] to-[#0284c7] bg-clip-text text-transparent">
              Instant Search Intelligence
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-7 leading-relaxed font-normal">
            Analyze verified search demand curves, decode high-converting buyer intent, and extract live Google CPC benchmarks with zero subscription paywalls.
          </p>

          {/* Animated Mini Feature Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10 text-xs font-semibold">
            <span className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-sm border border-slate-200/90 text-slate-700 shadow-xs hover:border-[#38bdf8] hover:text-[#0a192f] hover:-translate-y-0.5 transition-all">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live Monthly Search Volume</span>
            </span>
            <span className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-sm border border-slate-200/90 text-slate-700 shadow-xs hover:border-[#38bdf8] hover:text-[#0a192f] hover:-translate-y-0.5 transition-all">
              <span className="w-2 h-2 rounded-full bg-sky-500"></span>
              <span>Commercial CPC Telemetry</span>
            </span>
            <span className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-sm border border-slate-200/90 text-slate-700 shadow-xs hover:border-[#38bdf8] hover:text-[#0a192f] hover:-translate-y-0.5 transition-all">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              <span>12-Mo Seasonality Curves</span>
            </span>
            <span className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#0a192f] to-[#1e3a8a] text-white shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all">
              <span className="text-[#38bdf8]">⚡</span>
              <span>Unlimited Bulk Queries</span>
            </span>
          </div>

          {/* Hero CTAs (Moved above Google SERP Showcase) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              href="/dashboard/keyword-research"
              className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-[#0a192f] via-[#11244e] to-[#1a3668] hover:from-[#060e1d] hover:to-[#0f2347] rounded-xl shadow-xl shadow-[#0a192f]/30 hover:shadow-2xl hover:shadow-[#0a192f]/45 hover:-translate-y-0.5 border border-[#1e3a5f]/40 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5 text-[#38bdf8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.5" y2="16.5" />
                <line x1="8" y1="11" x2="14" y2="11" />
                <line x1="11" y1="8" x2="11" y2="14" />
              </svg>
              <span>Keyword Research</span>
            </Link>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-[#0a192f] bg-white border-2 border-[#0a192f] hover:bg-[#0a192f] hover:text-white hover:-translate-y-0.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
            >
              Open Dashboard
            </Link>
          </div>

          {/* Hero Metadata Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-medium text-slate-500">
            <span className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#0b1528] rounded-full border border-[#1a2b49] text-slate-200 shadow-sm hover:border-[#38bdf8]/40 transition-colors">
              <svg className="w-4 h-4 text-[#38bdf8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="8" width="18" height="4" rx="1" />
                <path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
                <path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8M16.5 8a2.5 2.5 0 0 0 0-5C13 3 12 8 12 8" />
              </svg>
              <span className="font-semibold text-white">100% Free Forever</span>
            </span>
            <span className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#0b1528] rounded-full border border-[#1a2b49] text-slate-200 shadow-sm hover:border-[#38bdf8]/40 transition-colors">
              <svg className="w-4 h-4 text-[#38bdf8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <span className="font-semibold text-white">No Credit Card Required</span>
            </span>
            <span className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#0b1528] rounded-full border border-[#1a2b49] text-slate-200 shadow-sm hover:border-[#38bdf8]/40 transition-colors">
              <svg className="w-4 h-4 text-[#38bdf8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              <span className="font-semibold text-white">Unlimited Instant Access</span>
            </span>
          </div>

        </div>
      </section>

      {/* 2.5 LIVE GOOGLE SERP SIMULATION SHOWCASE SECTION */}
      <section id="serp-showcase" className="py-8 md:py-12 bg-gradient-to-b from-white via-slate-50/70 to-[#f8fafc] border-b border-slate-200/70">
        <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Section Eyebrow & Intro */}
          <div className="text-center max-w-3xl mx-auto mb-5 sm:mb-6">
            <span className="inline-flex items-center space-x-2 px-3 py-0.5 rounded-full bg-[#0a192f]/5 border border-[#0a192f]/20 text-[#0a192f] text-xs font-bold uppercase tracking-wider mb-2 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live In-SERP Search Engine Simulator</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Experience Real-Time Keyword Telemetry Inside Google
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto mt-1.5 leading-relaxed">
              See how verified search volume, CPC benchmarks, and competitor domain authority display directly in your search results.
            </p>
          </div>

          {/* Animated Google SERP Simulation Container (Wide & Compact Dark Navy Card) */}
          <div className="w-full max-w-5xl xl:max-w-6xl mx-auto text-left bg-[#0b1528] rounded-2xl sm:rounded-3xl shadow-2xl shadow-[#0a192f]/40 border border-[#1a2b49] p-3.5 sm:p-5 transition-all duration-300 hover:border-[#2a436e] group">
            
            {/* 1. Google Search Bar Mockup (Compact Height) */}
            <div className="flex items-center bg-[#101e38] rounded-full border border-[#1e3458] shadow-inner px-3.5 sm:px-4 py-2 sm:py-2.5 group-hover:border-[#38bdf8]/50 group-hover:shadow-md transition-all">
              
              {/* Google Wordmark Logo */}
              <div className="mr-3 flex-shrink-0">
                <svg className="w-14 sm:w-16 h-4 sm:h-5" viewBox="0 0 272 92" focusable="false">
                  <path fill="#EA4335" d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z" />
                  <path fill="#4285F4" d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" />
                  <path fill="#FBBC05" d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" />
                  <path fill="#4285F4" d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z" />
                  <path fill="#34A853" d="M225 3v65h-9.5V3h9.5z" />
                  <path fill="#EA4335" d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.06zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z" />
                </svg>
              </div>

              {/* Simulated Typed Query */}
              <div className="flex-1 flex items-center text-sm sm:text-base text-white font-medium overflow-hidden">
                <span>{displayedQuery}</span>
                <span className="w-0.5 h-4 sm:h-5 bg-[#38bdf8] ml-0.5 animate-pulse"></span>
              </div>

              {/* Google Bar Action Icons */}
              <div className="flex items-center space-x-2 text-slate-400 pl-2">
                <button
                  type="button"
                  onClick={() => setDisplayedQuery('')}
                  className="hover:text-white transition-colors"
                  title="Clear search"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="w-[1px] h-4 bg-[#233a60]"></div>
                {/* Mic */}
                <svg className="w-3.5 h-3.5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="3" width="6" height="11" rx="3" />
                  <path d="M5 11a7 7 0 0 0 14 0" />
                  <line x1="12" y1="18" x2="12" y2="21" />
                </svg>
                {/* Lens */}
                <svg className="w-3.5 h-3.5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M3 8V5a2 2 0 0 1 2-2h3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3" />
                </svg>
                {/* Search */}
                <svg className="w-3.5 h-3.5 text-sky-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="7" />
                  <line x1="21" y1="21" x2="16.5" y2="16.5" />
                </svg>
              </div>
            </div>

            {/* 2. Google SERP Nav Tabs & Results Telemetry (Compact) */}
            <div className="flex items-center justify-between border-b border-[#1a2b49] px-1 sm:px-2 pt-2 pb-1.5 text-xs text-slate-400">
              <div className="flex items-center space-x-3 sm:space-x-5">
                <span className="flex items-center space-x-1 text-[#38bdf8] font-semibold border-b-2 border-[#38bdf8] pb-1.5 -mb-2">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="7" strokeWidth="2" />
                    <line x1="21" y1="21" x2="16.5" y2="16.5" strokeWidth="2" />
                  </svg>
                  <span>All</span>
                </span>
                <span className="hover:text-slate-200 cursor-pointer transition-colors pb-1 text-[11px] sm:text-xs">Images</span>
                <span className="hover:text-slate-200 cursor-pointer transition-colors pb-1 text-[11px] sm:text-xs">Videos</span>
                <span className="hover:text-slate-200 cursor-pointer transition-colors pb-1 text-[11px] sm:text-xs">News</span>
                <span className="hover:text-slate-200 cursor-pointer transition-colors pb-1 text-[11px] sm:text-xs">Tools</span>
              </div>
              <div className="hidden sm:flex items-center space-x-1.5 text-[11px] text-slate-400 font-mono">
                {isSearching ? (
                  <span className="text-[#38bdf8] animate-pulse flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-ping"></span>
                    <span>Analyzing SERP Telemetry...</span>
                  </span>
                ) : (
                  <span>About {currentSerp.resultsCount} results ({currentSerp.speed})</span>
                )}
              </div>
            </div>

            {/* 3. WIDE 2-COLUMN TELEMETRY GRID (Left: Metrics + Trend, Right: Organic Rank Snippet + Related) */}
            <div className="mt-2.5 grid grid-cols-1 lg:grid-cols-12 gap-2.5 sm:gap-3 items-stretch">
              
              {/* LEFT COLUMN (7 COLS): KWEveryWhere In-SERP Intelligence Extension Box */}
              <div className="lg:col-span-7 bg-gradient-to-br from-[#070e1c] to-[#0d1c38] rounded-xl sm:rounded-2xl border border-[#1e3a63] p-3 sm:p-3.5 shadow-lg relative overflow-hidden flex flex-col justify-between">
                {/* Subtle Ambient Radial Glow */}
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#38bdf8]/10 rounded-full blur-2xl pointer-events-none" />

                {/* Extension Status Header */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1a2b49] text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="flex items-center space-x-1.5 px-2 py-0.5 rounded-md bg-[#0a192f] border border-[#38bdf8]/30 text-[#38bdf8] font-semibold text-[10.5px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>KWEveryWhere SERP Overlay</span>
                    </span>
                    <span className="text-slate-400 font-medium text-[10.5px]">
                      {currentSerp.flag} Google {currentSerp.country}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-slate-400 text-[10.5px]">
                    <span className={`px-2 py-0.5 rounded-full border text-[10.5px] font-semibold ${currentSerp.intentColor}`}>
                      Intent: {currentSerp.intent}
                    </span>
                    <span className="text-slate-300 font-mono hidden sm:inline">
                      USD ($)
                    </span>
                  </div>
                </div>

                {/* 4 Core SEO Metrics Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                  {/* Search Volume */}
                  <div className="bg-[#0b162b]/80 border border-[#193054] rounded-lg p-2 hover:border-[#38bdf8]/40 transition-colors">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                      <span>Search Vol</span>
                      <span className="text-[9.5px] text-emerald-400 font-medium">{currentSerp.trendPct}</span>
                    </div>
                    <div className="text-sm sm:text-base font-extrabold text-white tracking-tight">
                      {currentSerp.vol}
                    </div>
                    <div className="text-[9.5px] text-slate-400">Monthly Avg</div>
                  </div>

                  {/* CPC */}
                  <div className="bg-[#0b162b]/80 border border-[#193054] rounded-lg p-2 hover:border-[#38bdf8]/40 transition-colors">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                      <span>CPC (Bid)</span>
                      <span className="text-[9.5px] text-sky-400 font-medium">Ads</span>
                    </div>
                    <div className="text-sm sm:text-base font-extrabold text-[#38bdf8] tracking-tight">
                      {currentSerp.cpc}
                    </div>
                    <div className="text-[9.5px] text-slate-400">Commercial</div>
                  </div>

                  {/* Competition */}
                  <div className="bg-[#0b162b]/80 border border-[#193054] rounded-lg p-2 hover:border-[#38bdf8]/40 transition-colors">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                      <span>Competition</span>
                      <span className="text-[9.5px] text-slate-400 font-medium">PPC</span>
                    </div>
                    <div className="text-sm sm:text-base font-extrabold text-white tracking-tight">
                      {currentSerp.comp} <span className="text-[10px] text-slate-400 font-normal">/ 1.0</span>
                    </div>
                    <div className="w-full bg-[#1e3458] h-1 rounded-full mt-1 overflow-hidden">
                      <div className="bg-gradient-to-r from-sky-400 to-blue-500 h-full rounded-full" style={{ width: `${parseFloat(currentSerp.comp) * 100}%` }}></div>
                    </div>
                  </div>

                  {/* SEO Difficulty (KD) */}
                  <div className="bg-[#0b162b]/80 border border-[#193054] rounded-lg p-2 hover:border-[#38bdf8]/40 transition-colors">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                      <span>Difficulty</span>
                      <span className={`text-[9px] font-semibold px-1 py-0.2 rounded border ${currentSerp.kdColor}`}>
                        {currentSerp.kdLabel}
                      </span>
                    </div>
                    <div className="text-sm sm:text-base font-extrabold text-white tracking-tight">
                      {currentSerp.kd} <span className="text-[10px] text-slate-400 font-normal">/ 100</span>
                    </div>
                    <div className="w-full bg-[#1e3458] h-1 rounded-full mt-1 overflow-hidden">
                      <div className={`h-full rounded-full ${currentSerp.kd > 50 ? 'bg-rose-500' : currentSerp.kd > 35 ? 'bg-amber-400' : 'bg-emerald-400'}`} style={{ width: `${currentSerp.kd}%` }}></div>
                    </div>
                  </div>
                </div>

                {/* 12-Month Historical Trend Sparkline (Compact) */}
                <div className="flex items-center justify-between pt-1.5 border-t border-[#1a2b49] text-xs">
                  <div className="flex items-center space-x-2 text-slate-300">
                    <span className="text-[10.5px] text-slate-400 font-medium">12-Mo Trend:</span>
                    <div className="flex items-end space-x-1 h-4 sm:h-5">
                      {currentSerp.bars.map((h, i) => (
                        <div
                          key={i}
                          className="w-1.5 sm:w-2 bg-gradient-to-t from-blue-600 to-[#38bdf8] rounded-t-xs hover:brightness-125 transition-all"
                          style={{ height: `${(h / 24) * 100}%` }}
                          title={`Month ${i + 1}: ${h * 3000}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-slate-400 text-xs">
                    <span className="text-[10.5px] text-slate-400">Peak: Q4</span>
                    <button type="button" className="text-slate-400 hover:text-[#38bdf8] transition-colors" title="Bookmark keyword">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M5 3h14a2 2 0 012 2v16l-7-4-7 4V5a2 2 0 012-2z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN (5 COLS): Live Organic SERP Snippet + Related Searches */}
              <div className="lg:col-span-5 flex flex-col justify-between gap-2">
                
                {/* 4. Live Organic SERP Snippet with In-Line SEO Audit Overlay */}
                <div className="bg-[#081020] rounded-xl sm:rounded-2xl border border-[#182944] p-2.5 sm:p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-1.5 text-[10.5px] text-slate-400 truncate max-w-[180px] sm:max-w-none">
                        <span className="w-3.5 h-3.5 rounded-full bg-slate-800 flex items-center justify-center text-[8.5px] text-sky-400 font-bold">G</span>
                        <span className="truncate text-slate-400">{currentSerp.topSnippet.url}</span>
                      </div>
                      <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-[#0b1528] text-slate-300 border border-slate-700 font-mono">
                        #1 Organic
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-semibold text-[#60a5fa] hover:underline cursor-pointer mb-1 tracking-tight line-clamp-1">
                      {currentSerp.topSnippet.title}
                    </h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2 mb-1.5">
                      {currentSerp.topSnippet.desc}
                    </p>
                  </div>

                  {/* KWEveryWhere On-Page SERP Audit Bar (Compact) */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-[#15253e] text-[10px]">
                    <span className="px-1.5 py-0.5 rounded bg-[#101e38] text-slate-300 border border-[#203658]">
                      <strong className="text-[#38bdf8]">DA:</strong> {currentSerp.topSnippet.metrics.da}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-[#101e38] text-slate-300 border border-[#203658]">
                      <strong className="text-[#38bdf8]">PA:</strong> {currentSerp.topSnippet.metrics.pa}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-[#101e38] text-slate-300 border border-[#203658]">
                      <strong className="text-emerald-400">Links:</strong> {currentSerp.topSnippet.metrics.backlinks}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-[#101e38] text-slate-300 border border-[#203658]">
                      <strong className="text-purple-400">Domains:</strong> {currentSerp.topSnippet.metrics.refDomains}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-[#101e38] text-slate-300 border border-[#203658]">
                      <strong className="text-amber-400">Traffic:</strong> {currentSerp.topSnippet.metrics.traffic}
                    </span>
                  </div>
                </div>

                {/* 5. Related Search Opportunities (Compact Chip Bar) */}
                <div className="bg-[#081020] rounded-xl border border-[#182944] px-2.5 py-1.5 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center space-x-1 text-slate-400 flex-shrink-0">
                    <svg className="w-3 h-3 text-[#38bdf8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                    </svg>
                    <span className="text-[10px] font-semibold text-slate-300">Also Search:</span>
                  </div>
                  <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
                    {currentSerp.relatedKw.map((rel, idx) => (
                      <span
                        key={idx}
                        className="whitespace-nowrap inline-flex items-center px-1.5 py-0.5 rounded bg-[#0e1c36] hover:bg-[#14284d] text-slate-300 hover:text-[#38bdf8] text-[10px] border border-[#1e3458] cursor-pointer transition-colors"
                      >
                        + {rel}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

            </div>

            {/* 6. Interactive Sample Keywords Switcher (Compact Bottom Bar) */}
            <div className="mt-2.5 pt-2 border-t border-[#1a2b49]/70 flex items-center justify-between flex-wrap gap-2">
              <span className="text-[10.5px] text-slate-400 font-mono hidden sm:inline">
                Click query to preview:
              </span>
              <div className="flex items-center space-x-1.5 w-full sm:w-auto justify-center sm:justify-end flex-wrap gap-y-1">
                {SERP_DATA.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => selectKeyword(idx)}
                    className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-medium transition-all ${
                      activeKeywordIdx === idx
                        ? 'bg-[#38bdf8] text-[#0a192f] font-bold shadow-sm shadow-[#38bdf8]/40 scale-105'
                        : 'bg-[#101e38] text-slate-400 hover:text-slate-200 border border-[#1e3458]'
                    }`}
                  >
                    {item.kw}
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION (Simple 3-Step Process) */}
      <section className="pt-10 pb-24 bg-gradient-to-b from-[#f8fafc] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#0a192f]/5 border border-[#0a192f]/20 text-[#0a192f] text-xs font-bold uppercase tracking-wider mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0a192f]"></span>
              <span>Simple 3-Step Process</span>
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              From Search Discovery To{' '}
              <span className="bg-gradient-to-r from-[#0a192f] via-[#1e3a8a] to-[#2563eb] bg-clip-text text-transparent">
                Dominant Rankings.
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line on desktop */}
            <div className="hidden md:block absolute top-[2.5rem] left-[calc(33%+2rem)] right-[calc(33%+2rem)] h-px bg-gradient-to-r from-[#1a2b49] via-[#2563eb]/40 to-[#1a2b49] opacity-70" />
            
            {[
              {
                num: '01',
                title: 'Discover Seed Terms',
                desc: 'Drop in any core topic, competitor domain, or bulk list of search terms directly into our web dashboard or inline browser extension.',
                delay: '0ms'
              },
              {
                num: '02',
                title: 'Extract Search Insights',
                desc: 'Instantly evaluate search demand, competition density, commercial CPC value, and 12-month historical velocity curves.',
                delay: '100ms'
              },
              {
                num: '03',
                title: 'Execute & Rank High',
                desc: 'Organize your top-converting keywords into strategic thematic clusters, export clear briefs, and publish high-ranking content with confidence.',
                delay: '200ms'
              }
            ].map((step, i) => (
              <div key={i} className="group relative bg-[#0b1528] p-8 rounded-3xl border border-[#1a2b49] shadow-xl hover:shadow-2xl hover:shadow-[#0a192f]/40 hover:border-[#2a436e] hover:-translate-y-2 transition-all duration-300">
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-[#38bdf8] to-transparent opacity-0 group-hover:opacity-100 rounded-b-3xl transition-opacity duration-300" />
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#112240] to-[#1d3557] border border-[#234575] text-[#38bdf8] flex items-center justify-center mb-6 shadow-md shadow-[#0a192f]/50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 font-extrabold font-mono text-base tracking-tight">
                  {step.num}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#60a5fa] transition-colors duration-200 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed font-normal">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. FEATURES SECTION ("Engineered for Explosive Growth") */}
      <section id="features" className="py-24 bg-gradient-to-b from-[#f8fafc] via-slate-50 to-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#0a192f]/5 border border-[#0a192f]/20 text-[#0a192f] text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0a192f]"></span>
              <span>Engineered for Explosive Growth</span>
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-5 leading-tight">
              Transform Raw Search Volume Into{' '}
              <span className="bg-gradient-to-r from-[#0a192f] via-[#1e3a8a] to-[#2563eb] bg-clip-text text-transparent">
                Predictable Rankings.
              </span>
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              KWEveryWhere gives agencies, founders, content creators, and SEO specialists unmetered access to verified search demand, commercial CPC values, and competitor metrics — without costly paywalls.
            </p>
          </div>

          {/* 5 Professional Feature Cards in a 2+3 Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            
            {/* Card 1 - Featured Spotlight */}
            <div className="group relative bg-[#0b1528] p-7 sm:p-8 rounded-3xl border border-[#1a2b49] shadow-xl hover:shadow-2xl hover:shadow-[#0a192f]/50 hover:border-[#38bdf8]/50 hover:-translate-y-2 transition-all duration-300 ease-out overflow-hidden flex flex-col justify-between">
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-gradient-to-br from-[#1e3a8a]/30 via-[#38bdf8]/15 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none" />
              
              <div>
                {/* Header Badge & Icon */}
                <div className="flex items-center justify-between mb-6">
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#112240] border border-[#234575] text-[#38bdf8] text-[11px] font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-pulse"></span>
                    <span>Real-Time Telemetry</span>
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#112240] to-[#1d3557] border border-[#234575] text-[#38bdf8] flex items-center justify-center shadow-md group-hover:scale-110 group-hover:from-[#1d3557] group-hover:to-[#2563eb] group-hover:text-white transition-all duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 14l4-4 4 4 5-5" />
                    </svg>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#60a5fa] transition-colors tracking-tight">
                  High-Precision Volume &amp; CPC Telemetry
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed font-normal mb-6">
                  Eliminate keyword guesswork with verified Google monthly search frequency, real-time advertiser CPC bidding benchmarks, and PPC density across millions of commercial search terms.
                </p>

                {/* Micro-UI Preview Widget */}
                <div className="bg-[#070e1a] rounded-2xl border border-[#182944] p-4 shadow-inner mb-6 space-y-3">
                  <div className="flex items-center justify-between text-xs border-b border-[#14233a] pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <span className="font-mono text-slate-300">"enterprise crm software"</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#101e38] text-emerald-400 font-semibold text-[10px]">
                      High Intent
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-[#0b1528] p-2 rounded-xl border border-[#162740]">
                      <div className="text-[10px] text-slate-400">Monthly Vol</div>
                      <div className="text-sm font-extrabold text-white">148,000</div>
                      <div className="text-[9px] text-emerald-400">+42% YoY</div>
                    </div>
                    <div className="bg-[#0b1528] p-2 rounded-xl border border-[#162740]">
                      <div className="text-[10px] text-slate-400">Google CPC</div>
                      <div className="text-sm font-extrabold text-[#38bdf8]">$14.20</div>
                      <div className="text-[9px] text-slate-400">Top Bid</div>
                    </div>
                    <div className="bg-[#0b1528] p-2 rounded-xl border border-[#162740]">
                      <div className="text-[10px] text-slate-400">SEO Difficulty</div>
                      <div className="text-sm font-extrabold text-amber-400">38/100</div>
                      <div className="text-[9px] text-emerald-400">Rank Viable</div>
                    </div>
                  </div>
                </div>
              </div>

              <Link
                href="/dashboard/keyword-research"
                className="pt-4 border-t border-[#1a2b49] flex items-center justify-between text-xs font-semibold text-[#38bdf8] group-hover:text-white transition-colors"
              >
                <span>Launch keyword research</span>
                <svg className="w-4 h-4 ml-1.5 group-hover:translate-x-1.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
              </Link>
            </div>

            {/* Card 2 - Featured Spotlight */}
            <div className="group relative bg-[#0b1528] p-7 sm:p-8 rounded-3xl border border-[#1a2b49] shadow-xl hover:shadow-2xl hover:shadow-[#0a192f]/50 hover:border-[#38bdf8]/50 hover:-translate-y-2 transition-all duration-300 ease-out overflow-hidden flex flex-col justify-between">
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-gradient-to-br from-[#1e3a8a]/30 via-[#38bdf8]/15 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none" />
              
              <div>
                {/* Header Badge & Icon */}
                <div className="flex items-center justify-between mb-6">
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#112240] border border-[#234575] text-[#38bdf8] text-[11px] font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Instant In-SERP Ingestion</span>
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#112240] to-[#1d3557] border border-[#234575] text-[#38bdf8] flex items-center justify-center shadow-md group-hover:scale-110 group-hover:from-[#1d3557] group-hover:to-[#2563eb] group-hover:text-white transition-all duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#60a5fa] transition-colors tracking-tight">
                  Live Search Overlay Directly Inside Google
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed font-normal mb-6">
                  Our lightweight browser extension injects rich keyword analytics, traffic valuation, and domain authority metrics directly beneath Google, YouTube, and Amazon search results without leaving your active tab.
                </p>

                {/* Micro-UI Preview Widget */}
                <div className="bg-[#070e1a] rounded-2xl border border-[#182944] p-4 shadow-inner mb-6 space-y-2.5">
                  <div className="flex items-center space-x-2 bg-[#0d1c33] px-3 py-1.5 rounded-xl border border-[#1c3558] text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span className="text-[11px] text-slate-400 font-mono pl-1">google.com/search?q=saas+seo+tools</span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-[#101e38] rounded-xl border border-[#203960] text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#0a192f] text-[#38bdf8] font-bold border border-[#38bdf8]/30">
                        ⚡ KWEveryWhere
                      </span>
                      <span className="font-semibold text-white">49.5K/mo</span>
                    </div>
                    <div className="flex items-center space-x-2 text-[11px] text-slate-300">
                      <span>DA: <strong className="text-white">89</strong></span>
                      <span className="text-slate-600">|</span>
                      <span>PA: <strong className="text-white">62</strong></span>
                      <span className="text-slate-600">|</span>
                      <span>Links: <strong className="text-emerald-400">14.8K</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              <Link
                href="/dashboard"
                className="pt-4 border-t border-[#1a2b49] flex items-center justify-between text-xs font-semibold text-[#38bdf8] group-hover:text-white transition-colors"
              >
                <span>Install Chrome extension</span>
                <svg className="w-4 h-4 ml-1.5 group-hover:translate-x-1.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
              </Link>
            </div>


          </div>

        </div>
      </section>


      {/* 6. FAQ SECTION */}
      <section id="faq" className="py-24 bg-white border-t border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#0a192f]/5 border border-[#0a192f]/20 text-[#0a192f] text-xs font-bold uppercase tracking-wider mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0a192f]"></span>
              <span>Help &amp; Answers</span>
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-5 leading-tight">
              Frequently Asked Questions.
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Everything you need to know about our data sources, free tools, and browser extension. Have questions?{' '}
              <Link href="/contact" className="text-[#0a192f] font-semibold hover:underline underline-offset-2">Reach out to our team</Link>{' '}anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {[
              {
                q: 'What makes KWEveryWhere unique?',
                a: 'Unlike legacy SEO suites that hide essential volume data behind costly monthly plans, KWEveryWhere provides immediate, accurate search demand and live SERP intelligence 100% free with no barriers.'
              },
              {
                q: 'Is KWEveryWhere truly free to use?',
                a: 'Yes, 100% free forever. No credit cards, trial expirations, or recurring charges. You have unrestricted access to analyze keywords, build lists, and run domain metrics without spending a cent.'
              },
              {
                q: 'Where does the search volume and CPC data originate?',
                a: 'Our data engine pulls real-world search statistics and commercial bids directly from official advertising networks and search engine query indices, giving you dependable data for every brief.'
              },
              {
                q: 'How does the browser extension work?',
                a: 'Install the extension on Chrome or any Chromium browser. As you search on Google, live search volume, estimated CPC, competition index, and trend graphs appear neatly right below the search bar.'
              },
              {
                q: 'Can I analyze keywords across international markets?',
                a: 'Yes. You can switch target countries and preferred languages per query so your briefs align perfectly with localized audience demand across the US, UK, Canada, Australia, Europe, and beyond.'
              },
              {
                q: 'Can I export lists and research data for my team or clients?',
                a: 'Yes, all keyword queries, volume metrics, CPC values, and lists can be exported into standard CSV spreadsheets in a single click for easy sharing and reporting.'
              },
              {
                q: 'Is there a limit on how many keywords I can research?',
                a: 'No restrictive limits. You can explore single queries or paste bulk lists up to 3,000 keywords at a time as often as your projects require.'
              },
              {
                q: 'Do I need to install software or can I use the web dashboard?',
                a: 'You can use both! You can conduct full research, cluster keywords, and check domain authority on our web dashboard, or use the browser extension for instant inline SERP metrics.'
              }
            ].map((faq, idx) => (
              <div
                key={idx}
                className={`group relative bg-[#0b1528] rounded-3xl border p-6 cursor-pointer transition-all duration-300 shadow-lg ${openFaq === idx ? 'border-[#38bdf8]/50 shadow-2xl shadow-[#0a192f]/40 bg-[#0e1a32]' : 'border-[#1a2b49] hover:border-[#2a436e]'}`}
                onClick={() => toggleFaq(idx)}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className={`text-base font-bold leading-snug transition-colors duration-200 ${openFaq === idx ? 'text-[#38bdf8]' : 'text-white group-hover:text-[#60a5fa]'}`}>
                    {faq.q}
                  </h3>
                  <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${openFaq === idx ? 'bg-[#38bdf8] text-[#0a192f] rotate-45' : 'bg-[#112240] text-[#38bdf8] group-hover:bg-[#1d3557] group-hover:text-white'}`}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
                    </svg>
                  </div>
                </div>
                {openFaq === idx && (
                  <p className="mt-4 text-sm text-slate-300 leading-relaxed pt-4 border-t border-[#1a2b49] font-normal">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* 7. CTA BANNER */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#060e1d] via-[#0b1833] to-[#102244] border border-[#1a2b49] rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl shadow-[#0a192f]/50">
            {/* Background decoration */}
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <span className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-sky-200 text-xs font-bold uppercase tracking-wider mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                <span>Start For Free Today</span>
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-5 tracking-tight leading-tight">
                Accelerate Your Search
                <br />Visibility Today.
              </h2>
              <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed font-normal">
                Join thousands of marketers, consultants, and agencies discovering winning keywords every day with KWEveryWhere — 100% free forever.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center space-x-2 px-8 py-3.5 bg-white text-[#0a192f] hover:bg-slate-100 font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Launch Web Dashboard</span>
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center space-x-2 px-8 py-3.5 bg-[#0a192f]/70 hover:bg-[#0a192f] text-white border border-[#2a436e] hover:border-[#38bdf8]/40 font-bold rounded-xl hover:-translate-y-0.5 transition-all duration-200 backdrop-blur-sm"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/>
                  </svg>
                  <span>Get Chrome Extension</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. SITE FOOTER */}
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
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
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

