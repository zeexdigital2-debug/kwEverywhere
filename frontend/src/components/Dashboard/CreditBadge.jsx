import React from 'react';
import { Zap, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function CreditBadge() {
  const { credits, plan } = useAuth();

  return (
    <div className="glass-card p-4 rounded-2xl border border-gray-800 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
          <Zap className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <div className="text-xs text-gray-400 font-medium">Research Credits Remaining</div>
          <div className="text-xl font-extrabold text-white font-mono">{credits} / 1,000</div>
        </div>
      </div>
      <div className="text-right">
        <span className="px-2.5 py-1 text-xs font-semibold bg-brand-500/10 text-brand-400 rounded-lg border border-brand-500/20 uppercase font-mono">
          {plan} Tier
        </span>
        <div className="text-[10px] text-gray-500 mt-1">1 credit per query</div>
      </div>
    </div>
  );
}
