'use client';

import React from 'react';
import { Zap } from 'lucide-react';

export default function CreditsDisplay({ credits }) {
  return (
    <div className="glass-card p-4 rounded-2xl border border-gray-800 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
          <Zap className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <div className="text-xs text-gray-400 font-medium">Free API Credits</div>
          <div className="text-xl font-extrabold text-white font-mono">{credits ?? 250} Remaining</div>
        </div>
      </div>
      <div className="text-right">
        <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20 uppercase font-mono">
          Free Tier
        </span>
        <div className="text-[10px] text-gray-500 mt-1">1 credit per query</div>
      </div>
    </div>
  );
}
