'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Sparkles, User, LogOut, Zap, LayoutDashboard, Home, Key } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState(250);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        const localUser = localStorage.getItem('kws_user');
        if (localUser) {
          try { setUser(JSON.parse(localUser)); } catch (e) {}
        }
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) setUser(session.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try { await supabase.auth.signOut(); } catch (e) {}
    localStorage.removeItem('kws_user');
    localStorage.removeItem('kws_token');
    setUser(null);
  };

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

        {/* Right Info / Auth */}
        <div className="flex items-center space-x-3">
          
          {/* Credit Badge */}
          <div className="flex items-center space-x-2 bg-dark-800 px-3 py-1.5 rounded-xl border border-gray-800">
            <Zap className="w-4 h-4 text-emerald-400 animate-pulse" />
            <div className="text-left">
              <div className="text-[9px] text-gray-400 uppercase font-mono tracking-wider">Free Credits</div>
              <div className="text-xs font-bold text-white font-mono leading-tight">{credits} Remaining</div>
            </div>
          </div>

          {/* Auth Actions */}
          {user ? (
            <div className="flex items-center space-x-2">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-medium text-gray-200">{user.email}</p>
                <p className="text-[10px] text-emerald-400 font-mono">Pro Member</p>
              </div>
              <button
                onClick={handleLogout}
                title="Sign Out"
                className="p-2 rounded-xl bg-dark-800 hover:bg-rose-500/10 hover:text-rose-400 text-gray-400 transition-colors border border-gray-800"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                href="/login"
                className="px-3.5 py-2 text-xs font-semibold text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20 transition-all"
              >
                Get Started
              </Link>
            </div>
          )}

        </div>

      </div>
    </nav>
  );
}
