'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  return (
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
            href="/dashboard/keyword-research"
            className="px-4 py-2 text-sm font-medium text-white bg-[#0a192f] hover:bg-[#112240] rounded-lg shadow-sm hover:shadow-md transition-all flex items-center space-x-2"
          >
            <svg className="w-4 h-4 text-[#38bdf8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.5" y2="16.5" />
              <line x1="8" y1="11" x2="14" y2="11" />
              <line x1="11" y1="8" x2="11" y2="14" />
            </svg>
            <span>Keyword Research</span>
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
              href="/dashboard/keyword-research"
              className="w-full text-center py-2 text-sm font-medium text-white bg-[#0a192f] hover:bg-[#112240] rounded-lg"
            >
              Keyword Research
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
