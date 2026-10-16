'use client';

import React from 'react';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import { ShieldCheck, Lock, EyeOff, FileText, Server, Globe, ExternalLink, Mail, CheckCircle2 } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white text-[#0f172a] font-sans antialiased selection:bg-[#112240] selection:text-[#38bdf8]">
      
      {/* 1. SITE HEADER */}
      <SiteHeader />

      {/* 2. HERO / PAGE TITLE */}
      <section className="relative pt-12 pb-14 bg-gradient-to-b from-[#f0f4f9] via-white to-white border-b border-slate-200/70">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#1e3a8a]/20 text-[#0a192f] text-xs font-bold uppercase tracking-wider mb-5 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-[#2563eb]" />
            <span>Official Policy &amp; Compliance</span>
            <span className="text-slate-300">•</span>
            <span className="text-[#2563eb]">Updated Oct 15, 2026</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
            Privacy Policy
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            This Privacy Policy explains how <Link href="/" className="font-semibold text-[#0a192f] hover:underline">KW Everywhere</Link> (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;), available at{' '}
            <a href="https://www.kweverywhere.com" className="text-[#2563eb] hover:underline font-medium">https://www.kweverywhere.com</a> (the &ldquo;Service&rdquo;), handles information when you use our keyword research tool. We keep data collection to the minimum needed to run the Service.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-slate-500">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
              <EyeOff className="w-3.5 h-3.5 text-emerald-600" />
              <span>No Account Required</span>
            </span>
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
              <Lock className="w-3.5 h-3.5 text-blue-600" />
              <span>No Google User Data Accessed</span>
            </span>
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>Google API Limited Use Compliant</span>
            </span>
          </div>

        </div>
      </section>

      {/* 3. POLICY CONTENT BODY */}
      <main className="py-12 pb-24 bg-gradient-to-b from-white via-slate-50/50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 space-y-10">

            {/* Section 1 */}
            <section className="space-y-3">
              <div className="flex items-center space-x-3 pb-2 border-b border-slate-100">
                <span className="w-8 h-8 rounded-xl bg-[#0a192f] text-white flex items-center justify-center font-bold text-sm">1</span>
                <h2 className="text-xl font-bold text-slate-900">What the Service does</h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed pl-11">
                KW Everywhere lets you enter keywords and view search-related metrics for them, such as average monthly search volume, competition level and a 12-month search trend. These metrics are obtained from Google through the Google Ads API (Keyword Planner data).
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
              <div className="flex items-center space-x-3 pb-2 border-b border-slate-100">
                <span className="w-8 h-8 rounded-xl bg-[#0a192f] text-white flex items-center justify-center font-bold text-sm">2</span>
                <h2 className="text-xl font-bold text-slate-900">Information we process</h2>
              </div>
              <div className="pl-11 space-y-3 text-sm text-slate-600 leading-relaxed">
                <div>
                  <strong className="text-slate-900">Keywords you submit:</strong> The keywords and settings (such as country and language) you enter are sent to our server and forwarded to the Google Ads API to retrieve results. We do not link them to your identity.
                </div>
                <div>
                  <strong className="text-slate-900">Technical data:</strong> Like most websites, our servers may automatically log your IP address, browser type, device information, pages visited and request timestamps. We use this for security, abuse prevention, rate limiting and troubleshooting.
                </div>
                <div>
                  <strong className="text-slate-900">Local browser storage:</strong> The Service may store items such as your recent searches in your own browser (for example in localStorage). This stays on your device and you can clear it at any time through your browser settings.
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <div className="flex items-center space-x-3 pb-2 border-b border-slate-100">
                <span className="w-8 h-8 rounded-xl bg-[#0a192f] text-white flex items-center justify-center font-bold text-sm">3</span>
                <h2 className="text-xl font-bold text-slate-900">Information we do not collect</h2>
              </div>
              <div className="pl-11 space-y-2.5 text-sm text-slate-600 leading-relaxed">
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>You do not need to create an account or sign in to use the Service.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>We do not ask for, access or store your Google account, Google Ads account or any other Google user data. The Google Ads API is accessed only with credentials owned and controlled by us, to retrieve keyword metrics. Visitors are never asked to connect their Google account.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>We do not collect payment card details, government identifiers or sensitive personal information.</span>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <div className="flex items-center space-x-3 pb-2 border-b border-slate-100">
                <span className="w-8 h-8 rounded-xl bg-[#0a192f] text-white flex items-center justify-center font-bold text-sm">4</span>
                <h2 className="text-xl font-bold text-slate-900">Cookies and similar technologies</h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed pl-11">
                We may use cookies or similar technologies that are necessary for the Service to function and stay secure, and to measure how the Service is used (for example, basic analytics). Third-party services that we use may set their own cookies subject to their own policies. You can block or delete cookies in your browser settings; some features may not work correctly if you do.
              </p>
            </section>

            {/* Section 5 */}
            <section className="space-y-3">
              <div className="flex items-center space-x-3 pb-2 border-b border-slate-100">
                <span className="w-8 h-8 rounded-xl bg-[#0a192f] text-white flex items-center justify-center font-bold text-sm">5</span>
                <h2 className="text-xl font-bold text-slate-900">How we use information</h2>
              </div>
              <div className="pl-11 space-y-2 text-sm text-slate-600 leading-relaxed">
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>To provide, maintain and improve the Service;</li>
                  <li>To protect the Service against abuse, spam and security threats;</li>
                  <li>To understand usage in aggregate and fix problems;</li>
                  <li>To comply with legal obligations.</li>
                </ul>
                <p className="pt-2 font-semibold text-slate-900">
                  We do not sell your personal information.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section className="space-y-3">
              <div className="flex items-center space-x-3 pb-2 border-b border-slate-100">
                <span className="w-8 h-8 rounded-xl bg-[#0a192f] text-white flex items-center justify-center font-bold text-sm">6</span>
                <h2 className="text-xl font-bold text-slate-900">Sharing of information</h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed pl-11">
                We share data only with service providers that help us run the Service (such as hosting, security and analytics providers) and with Google, to the extent the keywords you submit are sent to the Google Ads API to obtain results. We may also disclose information if required by law or to protect our rights and users.
              </p>
            </section>

            {/* Section 7 */}
            <section className="space-y-3">
              <div className="flex items-center space-x-3 pb-2 border-b border-slate-100">
                <span className="w-8 h-8 rounded-xl bg-[#0a192f] text-white flex items-center justify-center font-bold text-sm">7</span>
                <h2 className="text-xl font-bold text-slate-900">Google API Services</h2>
              </div>
              <div className="pl-11 text-sm text-slate-600 leading-relaxed space-y-3">
                <p>
                  The Service uses the Google Ads API. Our use of information received from Google APIs adheres to the{' '}
                  <a
                    href="https://developers.google.com/terms/api-services-user-data-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#2563eb] hover:underline font-semibold inline-flex items-center gap-1"
                  >
                    Google API Services User Data Policy
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  , including the Limited Use requirements.
                </p>
                <p className="bg-blue-50/70 border border-blue-100 rounded-xl p-3.5 text-slate-700">
                  Because the Service does not access any visitor&apos;s Google user data, no such data is collected, stored, shared or used for advertising by us.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section className="space-y-3">
              <div className="flex items-center space-x-3 pb-2 border-b border-slate-100">
                <span className="w-8 h-8 rounded-xl bg-[#0a192f] text-white flex items-center justify-center font-bold text-sm">8</span>
                <h2 className="text-xl font-bold text-slate-900">Data retention</h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed pl-11">
                Keywords and results are processed to answer your request. Server logs are kept only as long as reasonably necessary for security and troubleshooting and are then deleted or anonymized. Data stored in your own browser remains until you clear it.
              </p>
            </section>

            {/* Section 9 */}
            <section className="space-y-3">
              <div className="flex items-center space-x-3 pb-2 border-b border-slate-100">
                <span className="w-8 h-8 rounded-xl bg-[#0a192f] text-white flex items-center justify-center font-bold text-sm">9</span>
                <h2 className="text-xl font-bold text-slate-900">Security</h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed pl-11">
                We use reasonable technical and organizational measures, including HTTPS, to protect information. No method of transmission or storage is completely secure, so we cannot guarantee absolute security.
              </p>
            </section>

            {/* Section 10 */}
            <section className="space-y-3">
              <div className="flex items-center space-x-3 pb-2 border-b border-slate-100">
                <span className="w-8 h-8 rounded-xl bg-[#0a192f] text-white flex items-center justify-center font-bold text-sm">10</span>
                <h2 className="text-xl font-bold text-slate-900">Children&apos;s privacy</h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed pl-11">
                The Service is not directed to children under 13, and we do not knowingly collect personal information from children.
              </p>
            </section>

            {/* Section 11 */}
            <section className="space-y-3">
              <div className="flex items-center space-x-3 pb-2 border-b border-slate-100">
                <span className="w-8 h-8 rounded-xl bg-[#0a192f] text-white flex items-center justify-center font-bold text-sm">11</span>
                <h2 className="text-xl font-bold text-slate-900">Your choices and rights</h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed pl-11">
                Depending on where you live, you may have the right to request access to, correction of or deletion of personal information we hold about you. Because we do not require accounts, we may be unable to identify data as yours without additional information. To make a request, contact us using the details below.
              </p>
            </section>

            {/* Section 12 */}
            <section className="space-y-3">
              <div className="flex items-center space-x-3 pb-2 border-b border-slate-100">
                <span className="w-8 h-8 rounded-xl bg-[#0a192f] text-white flex items-center justify-center font-bold text-sm">12</span>
                <h2 className="text-xl font-bold text-slate-900">Third-party links</h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed pl-11">
                The Service may link to third-party websites. We are not responsible for their content or privacy practices.
              </p>
            </section>

            {/* Section 13 */}
            <section className="space-y-3">
              <div className="flex items-center space-x-3 pb-2 border-b border-slate-100">
                <span className="w-8 h-8 rounded-xl bg-[#0a192f] text-white flex items-center justify-center font-bold text-sm">13</span>
                <h2 className="text-xl font-bold text-slate-900">Changes to this policy</h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed pl-11">
                We may update this Privacy Policy from time to time. The &ldquo;Last updated&rdquo; date at the top shows when it was last revised. Continued use of the Service after changes means you accept the updated policy.
              </p>
            </section>

            {/* Section 14 */}
            <section className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center space-x-3 pb-2">
                <span className="w-8 h-8 rounded-xl bg-[#0a192f] text-white flex items-center justify-center font-bold text-sm">14</span>
                <h2 className="text-xl font-bold text-slate-900">Contact us</h2>
              </div>
              <div className="pl-11 space-y-3">
                <p className="text-sm text-slate-600 leading-relaxed">
                  If you have questions about this Privacy Policy, contact us at:
                </p>
                <div className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#0b1528] text-white text-sm font-medium">
                  <Mail className="w-4 h-4 text-[#38bdf8]" />
                  <a href="mailto:support@kweverywhere.com" className="hover:text-[#38bdf8] transition-colors font-mono">
                    support@kweverywhere.com
                  </a>
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>

      {/* 4. FOOTER */}
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
              <li><Link href="/dashboard/keyword-research" className="hover:text-white transition-colors">Keyword Research</Link></li>
              <li><Link href="/dashboard/geotag" className="hover:text-white transition-colors">Geotag Photos</Link></li>
              <li><Link href="/dashboard/remove-metadata" className="hover:text-white transition-colors">Remove Metadata</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="text-white font-medium hover:underline">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
            </ul>
          </div>

        </div>

        {/* Legal Disclaimer */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-800/80 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} KW Everywhere · <Link href="/" className="hover:text-slate-300 underline underline-offset-2">Home</Link></p>
          <p className="text-[11px]">Google Ads is a trademark of Google LLC. KW Everywhere is not affiliated with or endorsed by Google.</p>
        </div>
      </footer>

    </div>
  );
}
