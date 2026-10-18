'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Zap, LayoutDashboard, Home } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-40 glass-panel border-b border-gray-800/60 bg-dark-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-3 cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Search className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-xl tracking-tight text-white">
                KWS Pulse
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 font-mono">
                NEXT.JS 2026
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-mono -mt-1">SEO Intelligence Platform</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-1 bg-dark-800/70 p-1.5 rounded-xl border border-gray-800">
          <Link
            href="/"
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              pathname === '/' ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <Link
            href="/dashboard"
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              pathname === '/dashboard' ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
        </div>

        {/* Right — Free badge only, no login */}
        <div className="flex items-center">
          <div className="flex items-center space-x-2 bg-dark-800 px-3 py-1.5 rounded-xl border border-gray-800">
            <Zap className="w-4 h-4 text-emerald-400 animate-pulse" />
            <div className="text-left">
              <div className="text-[9px] text-gray-400 uppercase font-mono tracking-wider">100% Free</div>
              <div className="text-xs font-bold text-white font-mono leading-tight">No Login Needed</div>
            </div>
          </div>
        </div>

      </div>
    </nav>
  );
}
