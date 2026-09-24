import React from 'react';
import { X, TrendingUp, Calendar, Zap } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useKeywords } from '../../context/KeywordContext';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function TrendChart() {
  const { activeTrendItem, setActiveTrendItem } = useKeywords();

  if (!activeTrendItem) return null;

  const chartData = (activeTrendItem.trend || [40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95]).map((val, idx) => ({
    month: months[idx],
    interest: val,
    volumeEstimate: Math.round(activeTrendItem.searchVolume * (val / 100))
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="relative w-full max-w-2xl glass-panel p-6 rounded-3xl border border-gray-700/80 shadow-2xl animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">
                "{activeTrendItem.keyword}"
              </h3>
              <p className="text-xs text-gray-400">12-Month Search Interest & Seasonality Index</p>
            </div>
          </div>

          <button
            onClick={() => setActiveTrendItem(null)}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-dark-800 p-3 rounded-xl border border-gray-800 text-center">
            <div className="text-[10px] text-gray-400 uppercase font-mono">Monthly Average</div>
            <div className="text-base font-bold text-white font-mono mt-0.5">{activeTrendItem.searchVolume.toLocaleString()}</div>
          </div>
          <div className="bg-dark-800 p-3 rounded-xl border border-gray-800 text-center">
            <div className="text-[10px] text-gray-400 uppercase font-mono">Difficulty Score</div>
            <div className="text-base font-bold text-emerald-400 font-mono mt-0.5">{activeTrendItem.difficulty} / 100</div>
          </div>
          <div className="bg-dark-800 p-3 rounded-xl border border-gray-800 text-center">
            <div className="text-[10px] text-gray-400 uppercase font-mono">Est. CPC</div>
            <div className="text-base font-bold text-amber-400 font-mono mt-0.5">${activeTrendItem.cpc.toFixed(2)}</div>
          </div>
        </div>

        {/* Recharts Curve */}
        <div className="h-64 w-full bg-dark-800/40 p-2 rounded-2xl border border-gray-800/80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
              <XAxis dataKey="month" stroke="#9CA3AF" fontSize={11} tickLine={false} />
              <YAxis stroke="#9CA3AF" fontSize={11} domain={[0, 100]} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                formatter={(value, name) => [name === 'interest' ? `${value} index` : value, name === 'interest' ? 'Relative Interest' : 'Search Volume']}
              />
              <Area type="monotone" dataKey="interest" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorTrend)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex items-center justify-between text-[11px] text-gray-400 font-mono">
          <span>Data Source: Google Search Trends Analytics</span>
          <span className="text-brand-400 font-semibold">100 = Peak Interest</span>
        </div>

      </div>
    </div>
  );
}
