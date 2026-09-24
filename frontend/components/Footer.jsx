'use client';

import React from 'react';
import Link from 'next/link';
import { Search, Activity, Shield, Terminal } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-dark-900 border-t border-gray-800 text-gray-400 text-sm py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white text-base">KWS Pulse</span>
              <span className="text-xs text-gray-500 ml-2">Next.js Web Edition</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400">
            <div className="flex items-center space-x-1.5 text-emerald-400">
              <Activity className="w-3.5 h-3.5" />
              <span>Backend REST API: Active (Port 99009)</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-1.5">
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              <span>OpenPageRank Integrated</span>
            </div>
          </div>

          <p className="text-xs text-gray-500 text-center md:text-right">
            &copy; 2026 KWS Pulse. Built with Next.js, Express & Tailwind CSS.
          </p>

        </div>
      </div>
    </footer>
  );
}
