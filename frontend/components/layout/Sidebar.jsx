'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Search, Target, Globe, BarChart3, History, LogOut, GitCompare } from 'lucide-react';
import { clsx } from 'clsx';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Keyword Research', href: '/dashboard/keyword-research', icon: Search },
  { name: 'Keywords Finder', href: '/dashboard/keywords-finder', icon: Target },
  { name: 'Competitor Gap', href: '/dashboard/competitor-gap', icon: GitCompare },
  { name: 'Local Keywords', href: '/dashboard/local-keywords', icon: Globe },
  { name: 'Domain Metrics', href: '/dashboard/domain-metrics', icon: BarChart3 },
  { name: 'History', href: '/dashboard/history', icon: History },
];

export function Sidebar() {
  const pathname = usePathname();

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

      {/* Account / Plan Status Box */}
      <div className="p-3 mx-3 mb-2 bg-gradient-to-r from-blue-50/70 to-indigo-50/50 rounded-xl border border-blue-100 text-xs">
        <div className="flex items-center justify-between mb-1">
          <span className="font-semibold text-slate-800">Free Tier</span>
          <span className="px-1.5 py-0.2 text-[10px] font-bold bg-emerald-100 text-emerald-700 rounded-full border border-emerald-200">
            Active
          </span>
        </div>
        <p className="text-[11px] text-slate-500 leading-tight">
          Unlimited queries · No credit card required
        </p>
      </div>
      
      <div className="flex-shrink-0 p-3 border-t border-slate-100">
        <button className="flex w-full items-center px-3.5 py-2 text-sm font-medium text-slate-500 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-colors">
          <LogOut className="mr-3 h-4.5 w-4.5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
