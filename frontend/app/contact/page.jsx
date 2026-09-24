'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 900);
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
            <Link href="/#features" className="hover:text-[#0a192f] transition-colors">
              Features
            </Link>
            <Link href="/about" className="hover:text-[#0a192f] transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-[#0a192f] font-semibold transition-colors">
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
            <Link href="/about" className="block py-1 text-slate-700 font-medium hover:text-[#0a192f]" onClick={() => setMobileMenuOpen(false)}>
              About
            </Link>
            <Link href="/contact" className="block py-1 text-[#0a192f] font-semibold" onClick={() => setMobileMenuOpen(false)}>
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

      {/* 2. HERO SECTION */}
      <section className="relative pt-12 pb-16 md:pt-16 md:pb-20 overflow-hidden bg-gradient-to-b from-[#f0f4f9] via-white to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Eyebrow Capsule */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#0a192f]/5 via-[#112240]/10 to-[#0a192f]/5 border border-[#0a192f]/20 text-[#0a192f] text-xs font-bold uppercase tracking-wider mb-6 shadow-sm hover:border-[#0a192f]/40 transition-all">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0a192f]"></span>
            </span>
            <span>Get In Touch • 24/7 Dedicated Support</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15] mb-6">
            We&apos;re Here to Help You{' '}
            <span className="bg-gradient-to-r from-[#0a192f] via-[#1e3a8a] to-[#2563eb] bg-clip-text text-transparent">
              Dominate Search Results.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Have questions about search volume telemetry, bulk analysis batches, or our Chrome extension? Connect directly with our engineering and support specialists.
          </p>

        </div>
      </section>

      {/* 3. CONTACT CHANNELS & INTERACTIVE FORM */}
      <section className="py-12 pb-24 bg-gradient-to-b from-white via-slate-50/70 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Direct Info Cards (Dark Navy Theme) */}
            <div className="lg:col-span-5 space-y-5">
              
              {/* Phone Card (Highlighted) */}
              <div className="p-6 rounded-3xl bg-[#0b1528] border border-[#1a2b49] text-white shadow-xl hover:border-[#2a436e] transition-all">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#112240] to-[#1d3557] border border-[#234575] text-[#38bdf8] flex items-center justify-center flex-shrink-0 shadow-md">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Direct Phone &amp; WhatsApp
                    </div>
                    <a
                      href="tel:+447414872135"
                      className="text-xl sm:text-2xl font-extrabold text-white hover:text-[#38bdf8] transition-colors font-mono tracking-tight block"
                    >
                      +44 7414 872135
                    </a>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      Available Mon–Fri, 9:00 AM – 6:00 PM GMT. Instant WhatsApp chat supported.
                    </p>
                    <div className="mt-3.5 flex items-center space-x-3">
                      <a
                        href="https://wa.me/447414872135"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] text-xs font-bold hover:bg-[#25D366]/30 transition-colors"
                      >
                        <span>Chat on WhatsApp</span>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div className="p-6 rounded-3xl bg-[#0b1528] border border-[#1a2b49] text-white shadow-xl hover:border-[#2a436e] transition-all">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#112240] to-[#1d3557] border border-[#234575] text-[#38bdf8] flex items-center justify-center flex-shrink-0 shadow-md">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Support &amp; Technical Desk
                    </div>
                    <a
                      href="mailto:support@kweverywhere.com"
                      className="text-lg font-bold text-white hover:text-[#38bdf8] transition-colors"
                    >
                      support@kweverywhere.com
                    </a>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      All tickets received are prioritized by our engineers with typical responses in under 2 hours.
                    </p>
                  </div>
                </div>
              </div>

              {/* Operations Location Card */}
              <div className="p-6 rounded-3xl bg-[#0b1528] border border-[#1a2b49] text-white shadow-xl hover:border-[#2a436e] transition-all">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#112240] to-[#1d3557] border border-[#234575] text-[#38bdf8] flex items-center justify-center flex-shrink-0 shadow-md">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Registered Presence
                    </div>
                    <div className="text-lg font-bold text-white">
                      London, United Kingdom
                    </div>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      Global operations supporting digital marketers across the UK, US, Europe, and Asia-Pacific.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Professional Contact Form (Dark Navy Card) */}
            <div className="lg:col-span-7 bg-[#0b1528] p-8 sm:p-10 rounded-3xl border border-[#1a2b49] shadow-2xl text-white">
              
              <div className="mb-8">
                <span className="inline-block px-3 py-1 rounded-full bg-[#112240] border border-[#234575] text-[#38bdf8] text-xs font-bold uppercase tracking-wider mb-3">
                  Direct Inquiries
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Send Us A Message
                </h2>
                <p className="text-sm text-slate-300">
                  Fill out the form below and our team will get back to you promptly.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-[#112240] border border-[#234575] text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">Message Received!</h3>
                  <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out to KWEveryWhere. A member of our support team will review your inquiry and follow up shortly via email.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
                    }}
                    className="inline-block px-6 py-2.5 bg-[#0a192f] hover:bg-[#162a4d] border border-[#2a436e] rounded-xl text-xs font-bold text-white transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Sarah Jenkins"
                        className="w-full px-4 py-3 rounded-xl bg-[#101e38] border border-[#1e3458] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="sarah@agency.com"
                        className="w-full px-4 py-3 rounded-xl bg-[#101e38] border border-[#1e3458] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                        Phone / WhatsApp (Optional)
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+44 7414 872135"
                        className="w-full px-4 py-3 rounded-xl bg-[#101e38] border border-[#1e3458] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                        Inquiry Topic
                      </label>
                      <select
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#101e38] border border-[#1e3458] text-white text-sm focus:outline-none focus:border-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8] transition-colors cursor-pointer"
                      >
                        <option value="General Inquiry" className="bg-[#0b1528] text-white">General Inquiry</option>
                        <option value="Chrome Extension Support" className="bg-[#0b1528] text-white">Chrome Extension Support</option>
                        <option value="Bulk Research Assistance" className="bg-[#0b1528] text-white">Bulk Research Assistance</option>
                        <option value="Feature Suggestion / Bug" className="bg-[#0b1528] text-white">Feature Suggestion / Bug</option>
                        <option value="Partnership & Press" className="bg-[#0b1528] text-white">Partnership &amp; Press</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us how we can help you or what questions you have..."
                      className="w-full px-4 py-3 rounded-xl bg-[#101e38] border border-[#1e3458] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8] transition-colors resize-y"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#112240] via-[#1d3557] to-[#2563eb] hover:from-[#0a192f] hover:to-[#1d3557] text-white font-bold text-sm shadow-xl shadow-[#0a192f]/50 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center space-x-2 border border-[#234575]"
                  >
                    {loading ? (
                      <span className="flex items-center space-x-2">
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                        </svg>
                        <span>Dispatching Message...</span>
                      </span>
                    ) : (
                      <span>Send Direct Message →</span>
                    )}
                  </button>

                  <div className="text-center">
                    <p className="text-[11px] text-slate-400">
                      🔒 Your contact information is never shared with third parties. We treat your search data with absolute confidentiality.
                    </p>
                  </div>

                </form>
              )}

            </div>

          </div>

        </div>
      </section>

      {/* 4. FREQUENT QUESTIONS QUICK-BAR */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              Frequently Asked Support Questions
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-[#0b1528] border border-[#1a2b49] text-white">
              <h4 className="text-sm font-bold text-[#38bdf8] mb-2">How fast is response time?</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Direct phone &amp; WhatsApp (+44 7414 872135) provides instant response during UK hours. Emails are handled within 2 hours.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0b1528] border border-[#1a2b49] text-white">
              <h4 className="text-sm font-bold text-[#38bdf8] mb-2">Is KWEveryWhere truly free?</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Yes, 100% free forever. No credit cards, trial expirations, or paywalls are ever required for any tool.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0b1528] border border-[#1a2b49] text-white">
              <h4 className="text-sm font-bold text-[#38bdf8] mb-2">Can I request bulk data?</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Yes! You can process up to 3,000 keywords in batches or reach out to our team for custom programmatic datasets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SITE FOOTER */}
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
            <div className="text-xs text-slate-300">
              <span className="font-semibold text-white">Direct Line:</span>{' '}
              <a href="tel:+447414872135" className="hover:text-[#38bdf8] transition-colors font-mono">
                +44 7414 872135
              </a>
            </div>
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
