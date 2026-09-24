'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Coins, User, Sun, Moon, ChevronDown, LogOut, Settings, BarChart2, Home, Search, Target, Globe, BarChart3, History, GitCompare, LayoutDashboard, X, Menu } from 'lucide-react';
import { seoApi } from '@/lib/api';
import { useTheme } from '@/components/ThemeProvider';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Keyword Research', href: '/dashboard/keyword-research', icon: Search },
  { name: 'Keywords Finder', href: '/dashboard/keywords-finder', icon: Target },
  { name: 'Competitor Gap', href: '/dashboard/competitor-gap', icon: GitCompare },
  { name: 'Local Keywords', href: '/dashboard/local-keywords', icon: Globe },
  { name: 'Domain Metrics', href: '/dashboard/domain-metrics', icon: BarChart3 },
  { name: 'History', href: '/dashboard/history', icon: History },
];

export function Navbar() {
  const [credits, setCredits] = useState(0);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    seoApi.getCredits()
      .then(res => setCredits(res.credits))
      .catch(console.error);
  }, []);

  // Close menus on outside click
  useEffect(() => {
    const handler = () => { setUserMenuOpen(false); setMobileNavOpen(false); };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 flex-shrink-0 bg-[#060e1d]/95 backdrop-blur-md border-b border-white/8 shadow-lg shadow-black/20">
        <div className="flex flex-1 items-center justify-between px-4 sm:px-6">

          {/* ── LEFT: Logo + Brand + Back to Home ── */}
          <div className="flex items-center gap-4">

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setMobileNavOpen(!mobileNavOpen); }}
              className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Open navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Logo + Name */}
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <img
                src="/logo.png"
                alt="KWEveryWhere Logo"
                className="h-9 w-auto object-contain bg-white rounded-lg p-1 shadow-sm group-hover:scale-105 transition-transform"
              />
              <span className="hidden sm:block text-sm font-bold text-white tracking-tight">
                KW<span className="text-[#38bdf8]">Every</span>Where
              </span>
            </Link>

            {/* Divider */}
            <div className="hidden md:block w-px h-5 bg-white/10" />

            {/* Back to Home */}
            <Link
              href="/"
              className="hidden md:flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-[#38bdf8] transition-colors group"
            >
              <Home className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span>Back to Home</span>
            </Link>
          </div>

          {/* ── RIGHT: Credits + Theme + Bell + User ── */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Credits Badge */}
            <div className="flex items-center gap-1.5 bg-[#38bdf8]/10 border border-[#38bdf8]/20 px-3 py-1.5 rounded-full">
              <Coins className="w-4 h-4 text-[#38bdf8]" />
              <span className="text-xs sm:text-sm font-medium text-[#38bdf8]">{credits} Credits</span>
            </div>

            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              <div className="relative w-5 h-5">
                <Sun className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${theme === 'dark' ? 'opacity-100 rotate-0 scale-100 text-amber-400' : 'opacity-0 rotate-90 scale-50'}`} />
                <Moon className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${theme === 'light' ? 'opacity-100 rotate-0 scale-100 text-[#38bdf8]' : 'opacity-0 -rotate-90 scale-50'}`} />
              </div>
            </button>

            {/* Notifications */}
            <button type="button" className="relative p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#38bdf8] rounded-full ring-2 ring-[#060e1d]" />
            </button>

            {/* User Menu */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5 text-sm hover:bg-white/10 hover:border-white/20 transition-all focus:outline-none"
              >
                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[#38bdf8] to-[#0a192f] flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-gray-300 font-medium hidden sm:block">Guest</span>
                <ChevronDown className={`h-3.5 w-3.5 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-[#0b1528] border border-white/10 rounded-xl shadow-2xl z-50 py-1">
                  <div className="px-4 py-2.5 border-b border-white/8">
                    <p className="text-xs text-gray-400">Signed in as</p>
                    <p className="text-sm font-semibold text-white truncate">Guest User</p>
                  </div>
                  <Link href="/dashboard" className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                    <BarChart2 className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  <button className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <div className="border-t border-white/8 mt-1">
                    <Link href="/" className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                      <Home className="w-4 h-4" />
                      <span>Back to Home</span>
                    </Link>
                    <button className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── MOBILE SLIDE-DOWN NAV ── */}
      {mobileNavOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileNavOpen(false)}
        >
          <div
            className="absolute top-16 left-0 right-0 bg-[#060e1d] border-b border-white/10 px-4 pt-3 pb-6 space-y-1 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#38bdf8]/10 text-[#38bdf8]'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  {item.name}
                </Link>
              );
            })}
            <div className="border-t border-white/8 pt-2 mt-2">
              <Link
                href="/"
                onClick={() => setMobileNavOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
              >
                <Home className="w-4 h-4" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
