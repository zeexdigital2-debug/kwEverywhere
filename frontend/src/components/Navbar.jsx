import React from 'react';
import Link from 'next/link';
import { Search, Sparkles, Chrome, User, LogOut, ShieldCheck, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onOpenAuth, onOpenExtensionModal, activeTab, setActiveTab }) {
  const { user, credits, logout, plan } = useAuth();

  const isGuest = !user || user.email === 'guest@kws.local';

  return (
    <nav className="sticky top-0 z-40 glass-panel border-b border-gray-800/60 bg-dark-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('landing')}>
          <img
            src="/logo.png"
            alt="KWEveryWhere Logo"
            className="h-10 w-auto object-contain bg-white/10 rounded-lg p-1"
          />
        </div>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center space-x-1 bg-dark-800/70 p-1.5 rounded-xl border border-gray-800">
          <Link href="/" className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all">
            Home
          </Link>
          <Link href="/#features" className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all">
            Features
          </Link>
          <Link href="/about" className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'about' ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}>
            About
          </Link>
          <Link href="/contact" className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'contact' ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}>
            Contact
          </Link>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'dashboard'
                ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('domain')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'domain'
                ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            Domain DA Checker
          </button>
          <button
            onClick={onOpenExtensionModal}
            className="px-4 py-1.5 rounded-lg text-sm font-medium text-amber-400 hover:bg-amber-400/10 flex items-center space-x-1.5 transition-all"
          >
            <Chrome className="w-4 h-4 text-amber-400" />
            <span>Chrome Extension</span>
          </button>
        </div>

        {/* Right Auth / Credits Info */}
        <div className="flex items-center space-x-3">
          {/* Credit Balance Badge */}
          <div className="flex items-center space-x-2 bg-dark-800/90 px-3 py-1.5 rounded-xl border border-gray-800">
            <Zap className="w-4 h-4 text-brand-400 animate-pulse" />
            <div className="text-left">
              <div className="text-[10px] text-gray-400 uppercase font-mono tracking-wider leading-none">Credits</div>
              <div className="text-xs font-bold text-white font-mono leading-tight">{credits} API</div>
            </div>
          </div>

          {/* Auth Button */}
          {isGuest ? (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white shadow-lg shadow-brand-500/25 transition-all flex items-center space-x-2"
            >
              <User className="w-4 h-4" />
              <span>Sign In / Register</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-medium text-gray-200">{user.email}</p>
                <p className="text-[10px] text-brand-400 capitalize font-mono">{plan} Plan</p>
              </div>
              <button
                onClick={logout}
                title="Sign Out"
                className="p-2 rounded-xl bg-gray-800/80 hover:bg-red-500/10 hover:text-red-400 text-gray-400 transition-all border border-gray-700/50"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}
