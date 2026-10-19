'use client';

import React from 'react';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] font-sans antialiased selection:bg-[#112240] selection:text-[#38bdf8] flex flex-col justify-between">
      
      {/* 1. OFFICIAL SITE HEADER */}
      <SiteHeader />

      {/* 2. HERO / HEADER SECTION */}
      <section className="relative pt-12 pb-10 bg-white border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-4">
            Legal &amp; Agreement
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-3">
            Terms of Service
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Last updated: October 17, 2026
          </p>
        </div>
      </section>

      {/* 3. MAIN CONTENT */}
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-12 text-slate-700 text-[15px] sm:text-base leading-relaxed space-y-8">
          
          <p className="text-base sm:text-lg text-slate-800 leading-relaxed font-normal">
            These Terms of Service (&ldquo;Terms&rdquo;) govern your use of KWEveryWhere (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;), available at{' '}
            <a href="https://www.kweverywhere.com/" className="text-[#2563eb] hover:underline font-medium">
              https://www.kweverywhere.com
            </a>{' '}
            (the &ldquo;Service&rdquo;). By accessing or using the Service you agree to these Terms. If you do not agree, please do not use the Service.
          </p>

          <hr className="border-slate-100" />

          {/* 1 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              1. About the Service
            </h2>
            <p>
              KWEveryWhere is a keyword research tool. You enter keywords and choose a country and language, and the Service returns search-related metrics such as average monthly search volume, competition level, estimated cost-per-click ranges, a 12-month search trend and related keyword ideas. These metrics are obtained from Google through the Google Ads API (Keyword Planner data). KWEveryWhere is an independent service and is not affiliated with, endorsed by or sponsored by Google.
            </p>
          </section>

          {/* 2 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              2. Eligibility and accounts
            </h2>
            <p>
              You must be at least 13 years old to use the Service. Some features may require an account. You are responsible for providing accurate information, keeping your login details confidential and for all activity under your account. Tell us promptly if you suspect unauthorized use.
            </p>
          </section>

          {/* 3 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              3. Acceptable use
            </h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-2">
              <li>use the Service for anything unlawful, or in violation of the rights of others;</li>
              <li>attempt to disrupt, overload, probe or gain unauthorized access to the Service or its systems;</li>
              <li>use bots, scrapers or automated tools to access the Service, or bypass rate limits, CAPTCHA or other protections, without our written permission;</li>
              <li>resell, redistribute or republish bulk data from the Service as a competing product or data feed;</li>
              <li>reverse engineer or copy the Service, except as allowed by law;</li>
              <li>submit content that is unlawful, harmful or infringes intellectual property rights.</li>
            </ul>
            <p>
              We may apply usage limits and may suspend or restrict access that we reasonably believe breaches these Terms or threatens the Service.
            </p>
          </section>

          {/* 3A */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              3A. Fees
            </h2>
            <p>
              The Service is currently offered free of charge. We may introduce paid features or plans in the future. If we do, we will state the price and terms clearly before you are charged.
            </p>
          </section>

          {/* 4 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              4. Data accuracy
            </h2>
            <p>
              Keyword metrics are estimates provided by Google and may differ from actual search activity. Search volumes are often shown as averages or ranges and may change over time. The Service is provided for research and informational purposes. You are responsible for decisions you make based on the data, and we do not guarantee that results are accurate, complete or suitable for any particular purpose.
            </p>
          </section>

          {/* 5 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              5. Intellectual property
            </h2>
            <p>
              The Service, including its design, text, graphics, logos and software, is owned by us or our licensors and protected by intellectual property laws. We grant you a limited, non-exclusive, non-transferable, revocable right to use the Service for your own lawful purposes in accordance with these Terms. Keyword data originates from Google and remains subject to Google&apos;s terms. You keep ownership of the keywords and content you submit.
            </p>
          </section>

          {/* 6 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              6. Privacy
            </h2>
            <p>
              Your use of the Service is also governed by our{' '}
              <Link href="/privacy" className="text-[#2563eb] hover:underline font-semibold">
                Privacy Policy
              </Link>
              , which explains how we handle information.
            </p>
          </section>

          {/* 7 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              7. Third-party services and links
            </h2>
            <p>
              The Service relies on third-party services (including Google) and may link to third-party websites. We do not control them and are not responsible for their availability, content or practices. The Service may become limited or unavailable if a third-party service changes or stops working.
            </p>
          </section>

          {/* 8 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              8. Disclaimer of warranties
            </h2>
            <p>
              The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;, without warranties of any kind, whether express or implied, including warranties of merchantability, fitness for a particular purpose, accuracy and non-infringement. We do not warrant that the Service will be uninterrupted, error-free or secure.
            </p>
          </section>

          {/* 9 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              9. Limitation of liability
            </h2>
            <p>
              To the maximum extent permitted by law, we will not be liable for any indirect, incidental, special, consequential or punitive damages, or for any loss of profits, revenue, data or business opportunities, arising out of or related to your use of or inability to use the Service. Our total liability for any claim relating to the Service will not exceed the amount you paid us for the Service in the twelve months before the claim, or USD 50 if you have paid nothing.
            </p>
          </section>

          {/* 10 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              10. Termination
            </h2>
            <p>
              You may stop using the Service at any time. We may suspend or terminate your access at any time, with or without notice, if we reasonably believe you have breached these Terms or to protect the Service. Sections that by their nature should survive termination will survive.
            </p>
          </section>

          {/* 11 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              11. Changes to the Service and these Terms
            </h2>
            <p>
              We may modify or discontinue the Service or any feature at any time. We may update these Terms from time to time. The &ldquo;Last updated&rdquo; date shows the latest revision, and continuing to use the Service after changes means you accept the updated Terms.
            </p>
          </section>

          {/* 12 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              12. Governing law
            </h2>
            <p>
              These Terms are governed by the laws applicable in the jurisdiction in which the Service operator is established, without regard to conflict-of-law rules. Any dispute will be handled by the competent courts of that jurisdiction, unless mandatory law gives you other rights.
            </p>
          </section>

          {/* 13 */}
          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              13. Contact us
            </h2>
            <p>
              If you have questions about these Terms, contact us at:{' '}
              <a href="mailto:support@kweverywhere.com" className="text-[#2563eb] hover:underline font-semibold font-mono">
                support@kweverywhere.com
              </a>
            </p>
          </section>

        </div>
      </main>

      {/* 4. OFFICIAL SITE FOOTER */}
      <footer className="bg-[#070e1c] text-slate-400 py-16 border-t border-[#162646] mt-16">
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
              <li><Link href="/dashboard/keywords-finder" className="hover:text-white transition-colors">Keywords Finder</Link></li>
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
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-white font-medium hover:underline">Terms of Service</Link></li>
            </ul>
          </div>

        </div>

        {/* Legal Disclaimer */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-800/80 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} KWEveryWhere &middot; <Link href="/" className="hover:text-slate-300 underline underline-offset-2">Home</Link></p>
          <p className="text-[11px]">Google Ads is a trademark of Google LLC. KWEveryWhere is not affiliated with or endorsed by Google.</p>
        </div>
      </footer>

    </div>
  );
}
