'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Megaphone } from 'lucide-react';

const ANNOUNCEMENT = {
  id: 'ann-001',
  message: '🎉 KWEveryWhere is 100% Free — Unlimited keyword research, domain metrics, and local SEO tools with no credit card required!',
  linkUrl: '/dashboard',
  linkText: 'Start Free →',
};

export function AnnouncementBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(`ann-dismissed-${ANNOUNCEMENT.id}`);
      if (!dismissed) setVisible(true);
    } catch (e) {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(`ann-dismissed-${ANNOUNCEMENT.id}`, '1');
    } catch (e) {}
  };

  if (!visible) return null;

  return (
    <div className="relative z-50 bg-gradient-to-r from-[#060e1d] via-[#0c1a36] to-[#12264e] text-white border-b border-[#1a2c4e]">
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Megaphone className="w-4 h-4 flex-shrink-0 text-sky-400" />
            <p className="text-xs sm:text-sm font-medium text-white/95 truncate">
              {ANNOUNCEMENT.message}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            {ANNOUNCEMENT.linkUrl && (
              <Link
                href={ANNOUNCEMENT.linkUrl}
                className="text-xs sm:text-sm font-bold whitespace-nowrap underline underline-offset-2 text-sky-300 hover:text-white transition-colors"
              >
                {ANNOUNCEMENT.linkText}
              </Link>
            )}
            <button
              onClick={dismiss}
              className="p-1 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Dismiss announcement"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
