'use client';

import React from 'react';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] font-sans antialiased selection:bg-[#112240] selection:text-[#38bdf8] flex flex-col justify-between">
      
      {/* 1. OFFICIAL SITE HEADER */}
      <SiteHeader />

      {/* 2. HERO / HEADER SECTION */}
      <section className="relative pt-12 pb-10 bg-white border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-4">
            Legal &amp; Compliance
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-3">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Last updated: October 16, 2026
          </p>
        </div>
      </section>

      {/* 3. MAIN CONTENT */}
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-12 text-slate-700 text-[15px] sm:text-base leading-relaxed space-y-8">
          
          <p className="text-base sm:text-lg text-slate-800 leading-relaxed font-normal">
            This Privacy Policy explains how KWEveryWhere (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;), available at{' '}
            <a href="https://www.kweverywhere.com/" className="text-[#2563eb] hover:underline font-medium">
              https://www.kweverywhere.com
            </a>{' '}
            (the &ldquo;Service&rdquo;), collects, uses, shares and protects information when you use our keyword research and search analytics tool. By using the Service you agree to the practices described here.
          </p>

          <hr className="border-slate-100" />

          {/* 1 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              1. What the Service does
            </h2>
            <p>
              KWEveryWhere is a keyword research tool. You enter one or more keywords, choose a country and language, and the Service returns search-related metrics such as average monthly search volume, competition level, estimated cost-per-click ranges and a 12-month search trend, together with related keyword ideas. These metrics are obtained from Google through the Google Ads API (Keyword Planner data), using credentials owned and controlled by us.
            </p>
          </section>

          {/* 2 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              2. Information we collect
            </h2>
            <ul className="list-disc pl-5 sm:pl-6 space-y-2">
              <li>
                <strong className="text-slate-900 font-semibold">Account information.</strong> If you create an account or sign in, we collect the details you provide, such as your name (if given), email address and a password, which we store only in hashed form. Using the keyword research features may also work without an account, depending on the feature.
              </li>
              <li>
                <strong className="text-slate-900 font-semibold">Keywords and search settings.</strong> The keywords, country, language and other settings you submit are sent to our servers and forwarded to the Google Ads API to retrieve results. If you are signed in, your recent searches may be saved to your account so you can view them again.
              </li>
              <li>
                <strong className="text-slate-900 font-semibold">Technical and usage data.</strong> Our servers and security tools may automatically record your IP address, browser type, device information, referring page, pages visited and request timestamps. We use this for security, abuse prevention, rate limiting, analytics and troubleshooting.
              </li>
              <li>
                <strong className="text-slate-900 font-semibold">Local browser storage.</strong> The Service may store items such as your recent searches or preferences in your own browser (for example in localStorage). This stays on your device and you can clear it at any time in your browser settings.
              </li>
              <li>
                <strong className="text-slate-900 font-semibold">Messages you send us.</strong> If you contact us, we keep your message and email address so we can respond.
              </li>
            </ul>
          </section>

          {/* 3 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              3. Information we do not collect
            </h2>
            <ul className="list-disc pl-5 sm:pl-6 space-y-2">
              <li>
                We do not ask for, access or store your Google account or Google Ads account data. The Google Ads API is accessed only with our own credentials, to retrieve keyword metrics. Visitors are never asked to connect their Google account to use the Service.
              </li>
              <li>
                We do not collect payment card details on our own servers. If paid features are offered, payments are handled by a third-party payment processor.
              </li>
              <li>
                We do not knowingly collect sensitive personal information such as government identifiers, health or biometric data.
              </li>
            </ul>
          </section>

          {/* 4 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              4. How we use information
            </h2>
            <ul className="list-disc pl-5 sm:pl-6 space-y-2">
              <li>To provide, operate and maintain the Service and show you keyword results;</li>
              <li>To create and manage your account and keep your search history, where applicable;</li>
              <li>To protect the Service against abuse, spam, fraud and security threats, including rate limiting;</li>
              <li>To understand how the Service is used and to improve its performance and features;</li>
              <li>To communicate with you about the Service, such as support replies and important notices;</li>
              <li>To comply with legal obligations.</li>
            </ul>
            <p className="font-semibold text-slate-900 pt-1">
              We do not sell your personal information.
            </p>
          </section>

          {/* 5 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              5. Cookies and similar technologies
            </h2>
            <p>
              We use cookies and similar technologies that are necessary for the Service to function and remain secure, such as keeping you signed in and protecting forms against bots. We may also use analytics and advertising technologies, which may set their own cookies subject to their providers&apos; policies. You can block or delete cookies in your browser settings; some features may not work correctly if you do.
            </p>
          </section>

          {/* 6 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              6. Sharing of information
            </h2>
            <p>We share information only in these situations:</p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-2">
              <li>
                <strong className="text-slate-900 font-semibold">Google.</strong> The keywords you submit are sent to the Google Ads API to obtain results.
              </li>
              <li>
                <strong className="text-slate-900 font-semibold">Service providers</strong> that help us run the Service, such as hosting, security, bot protection, analytics, advertising and payment providers, who may process data only on our behalf and for those purposes.
              </li>
              <li>
                <strong className="text-slate-900 font-semibold">Legal and safety reasons,</strong> if required by law or to protect the rights, property or safety of our users, us or the public.
              </li>
              <li>
                <strong className="text-slate-900 font-semibold">Business transfers,</strong> if we are involved in a merger, acquisition or sale of assets.
              </li>
            </ul>
          </section>

          {/* 7 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              7. Google API Services
            </h2>
            <p>
              The Service uses the Google Ads API. Our use of information received from Google APIs adheres to the{' '}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2563eb] hover:underline font-semibold"
              >
                Google API Services User Data Policy
              </a>
              , including the Limited Use requirements. Because the Service does not access any visitor&apos;s Google user data, no such data is collected, stored, shared or used for advertising by us. The Service does not use Google APIs to generate or process AI-generated intimate imagery or any similar content.
            </p>
          </section>

          {/* 8 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              8. Data retention
            </h2>
            <p>
              We keep account information for as long as your account is active. Saved searches and results are kept only as long as needed to provide the feature and are deleted or anonymized afterward. Server logs are kept for a limited period for security and troubleshooting. We may keep information longer where the law requires it. Data stored in your own browser remains until you clear it.
            </p>
          </section>

          {/* 9 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              9. Security
            </h2>
            <p>
              We use reasonable technical and organizational measures to protect information, including HTTPS encryption in transit and hashed password storage. No method of transmission or storage is completely secure, so we cannot guarantee absolute security.
            </p>
          </section>

          {/* 10 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              10. Your choices and rights
            </h2>
            <p>
              Depending on where you live, you may have the right to access, correct, export or delete personal information we hold about you, or to object to or restrict certain processing. You can update your account details in your account, clear locally stored data in your browser, and ask us to delete your account and associated data by contacting us at the address below. We will respond within a reasonable time and as required by applicable law.
            </p>
          </section>

          {/* 11 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              11. International transfers
            </h2>
            <p>
              Our service providers may process information in countries other than your own. Where required, we take steps to ensure your information remains protected in line with this policy.
            </p>
          </section>

          {/* 12 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              12. Children&apos;s privacy
            </h2>
            <p>
              The Service is not directed to children under 13, and we do not knowingly collect personal information from children. If you believe a child has provided us with personal information, contact us and we will delete it.
            </p>
          </section>

          {/* 13 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              13. Third-party links
            </h2>
            <p>
              The Service may link to third-party websites. We are not responsible for their content or privacy practices.
            </p>
          </section>

          {/* 14 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              14. Changes to this policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. The &ldquo;Last updated&rdquo; date at the top shows when it was last revised. Continued use of the Service after changes means you accept the updated policy.
            </p>
          </section>

          {/* 15 */}
          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              15. Contact us
            </h2>
            <p>
              If you have questions about this Privacy Policy or want to exercise your rights, contact us at:{' '}
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
          <p>© {new Date().getFullYear()} KWEveryWhere &middot; <Link href="/" className="hover:text-slate-300 underline underline-offset-2">Home</Link></p>
          <p className="text-[11px]">Google Ads is a trademark of Google LLC. KWEveryWhere is not affiliated with or endorsed by Google.</p>
        </div>
      </footer>

    </div>
  );
}
