'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Search, Lightbulb, Camera, ShieldOff, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';
import ExtensionInstallModal from '@/components/ExtensionInstallModal';
import { CHROME_STORE_URL } from '@/lib/extensionConfig';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Keyword Research', href: '/dashboard/keyword-research', icon: Search },
  { name: 'Keywords Finder', href: '/dashboard/keywords-finder', icon: Lightbulb },
  { name: 'Geotag Photos', href: '/dashboard/geotag', icon: Camera },
  { name: 'Remove Metadata', href: '/dashboard/remove-metadata', icon: ShieldOff },
];

export function Sidebar() {
  const pathname = usePathname();
  const [modalOpen, setModalOpen] = useState(false);

  const handleExtensionClick = (e) => {
    if (e) e.preventDefault();
    if (CHROME_STORE_URL && CHROME_STORE_URL.trim().length > 0) {
      window.open(CHROME_STORE_URL, '_blank', 'noopener,noreferrer');
    } else {
      setModalOpen(true);
    }
  };

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:top-[73px] md:bottom-0 bg-white border-r border-slate-200/80 shadow-xs z-30">
      <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
        
        {/* Section Header */}
        <div className="px-5 mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            SEO Intelligence Suite
          </span>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  isActive
                    ? 'bg-[#0a192f] text-white shadow-sm shadow-[#0a192f]/20 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 font-medium',
                  'group flex items-center px-3.5 py-2.5 text-sm rounded-xl transition-all duration-150'
                )}
              >
                <item.icon
                  className={clsx(
                    isActive ? 'text-[#38bdf8]' : 'text-slate-400 group-hover:text-slate-600',
                    'mr-3 flex-shrink-0 h-4.5 w-4.5 transition-colors'
                  )}
                />
                <span className="truncate">{item.name}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-pulse"></span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Chrome Extension Promo Card */}
      <div className="p-3 mx-3 mb-2.5 bg-[#0b1528] rounded-xl border border-[#1a2b49] text-xs text-white shadow-sm">
        <div className="flex items-center space-x-2 mb-1.5">
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#fff" />
            <path d="M12 2a10 10 0 0 1 8.66 5H12a5 5 0 0 0-4.33 2.5L3.34 7A10 10 0 0 1 12 2z" fill="#EA4335" />
            <path d="M3.34 7l4.33 2.5A5 5 0 0 0 7.67 14.5L3.34 17A10 10 0 0 1 3.34 7z" fill="#FBBC05" />
            <path d="M12 22a10 10 0 0 1-8.66-5l4.33-2.5A5 5 0 0 0 12 17h8.66A10 10 0 0 1 12 22z" fill="#34A853" />
            <circle cx="12" cy="12" r="4" fill="#4285F4" />
          </svg>
          <span className="font-bold text-white text-[11px]">Chrome Extension</span>
        </div>
        <p className="text-[10px] text-slate-400 mb-2 leading-tight">
          Get real-time Google search metrics inline.
        </p>
        <button
          type="button"
          onClick={handleExtensionClick}
          className="w-full py-1.5 px-2 bg-[#112240] hover:bg-[#1a3660] text-sky-400 hover:text-white border border-[#203960] rounded-lg text-[11px] font-semibold transition-colors flex items-center justify-center space-x-1"
        >
          <span>Get Extension</span>
        </button>
      </div>

      {/* Free Plan Badge */}
      <div className="p-3 mx-3 mb-4 bg-gradient-to-r from-blue-50/70 to-indigo-50/50 rounded-xl border border-blue-100 text-xs">
        <div className="flex items-center justify-between mb-1">
          <span className="font-semibold text-slate-800">Free Tier</span>
          <span className="px-1.5 py-0.2 text-[10px] font-bold bg-emerald-100 text-emerald-700 rounded-full border border-emerald-200">
            Active
          </span>
        </div>
        <p className="text-[11px] text-slate-500 leading-tight">
          Free to use · No login required
        </p>
      </div>

      <ExtensionInstallModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </aside>
  );
}
