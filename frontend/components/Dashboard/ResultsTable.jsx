'use client';

import React, { useState } from 'react';
import { Download, Search, TrendingUp, BarChart2, Filter } from 'lucide-react';

export default function ResultsTable({ results, onResearchKeyword }) {
  const [filterQuery, setFilterQuery] = useState('');
  const [sortBy, setSortBy] = useState('volume');

  // Filter & Sort
  const filtered = results.filter(item =>
    item.keyword.toLowerCase().includes(filterQuery.toLowerCase())
  ).sort((a, b) => {
    if (sortBy === 'volume') return b.searchVolume - a.searchVolume;
    if (sortBy === 'difficulty') return b.difficulty - a.difficulty;
    return 0;
  });

  // CSV Export handler
  const exportToCSV = () => {
    if (filtered.length === 0) return;

    const headers = ['Keyword', 'Search Volume', 'Trend Direction', 'Competition', 'Difficulty (%)', 'Suggestions'];
    const rows = filtered.map(item => [
      `"${item.keyword}"`,
      item.searchVolume,
      `"${item.trendDirection || '➡️ Stable'}"`,
      item.competition,
      item.difficulty,
      `"${(item.suggestions || []).join('; ')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `kws_seo_keywords_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getTrendBadge = (direction, trendArray) => {
    // Determine trend direction if not pre-calculated
    let dir = direction;
    if (!dir && Array.isArray(trendArray) && trendArray.length >= 2) {
      const firstHalf = trendArray.slice(0, 6).reduce((a, b) => a + b, 0) / 6;
      const secondHalf = trendArray.slice(6).reduce((a, b) => a + b, 0) / 6;
      if (secondHalf - firstHalf > 10) dir = '📈 Upward';
      else if (firstHalf - secondHalf > 10) dir = '📉 Downward';
      else dir = '➡️ Stable';
    } else if (!dir) {
      dir = '📈 Upward';
    }

    if (dir.includes('Upward')) return <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg">📈 Upward</span>;
    if (dir.includes('Downward')) return <span className="px-2.5 py-1 text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg">📉 Downward</span>;
    return <span className="px-2.5 py-1 text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg">➡️ Stable</span>;
  };

  return (
    <div className="glass-panel rounded-3xl border border-gray-800 shadow-xl overflow-hidden">
      
      {/* Header Controls */}
      <div className="p-6 border-b border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div>
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <BarChart2 className="w-5 h-5 text-emerald-400" />
            <span>Keyword Intelligence ({filtered.length})</span>
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">Real-time volume estimates, trend direction & competition breakdown</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          
          {/* Search Filter Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter list..."
              className="bg-dark-800 border border-gray-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 w-44"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center space-x-1.5 bg-dark-800 border border-gray-700/80 px-3 py-1.5 rounded-xl text-xs text-gray-300">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-emerald-400 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="volume" className="bg-dark-800">Search Volume</option>
              <option value="difficulty" className="bg-dark-800">Difficulty Score</option>
            </select>
          </div>

          {/* CSV Export Button */}
          <button
            onClick={exportToCSV}
            className="px-4 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

        </div>

      </div>

      {/* Results Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-dark-800/80 text-[11px] font-mono uppercase tracking-wider text-gray-400 border-b border-gray-800">
            <tr>
              <th className="px-6 py-3.5">Keyword Phrase</th>
              <th className="px-6 py-3.5 text-right">Est. Search Volume</th>
              <th className="px-6 py-3.5 text-center">Trend Direction</th>
              <th className="px-6 py-3.5 text-center">Competition Level</th>
              <th className="px-6 py-3.5">Autocomplete Suggestions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500 text-sm">
                  No keywords found. Enter a keyword above or upload a CSV file.
                </td>
              </tr>
            ) : (
              filtered.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-800/40 transition-colors group">
                  
                  {/* Keyword */}
                  <td className="px-6 py-4 font-semibold text-white">
                    <span
                      onClick={() => onResearchKeyword && onResearchKeyword([item.keyword])}
                      className="hover:text-emerald-400 cursor-pointer"
                    >
                      {item.keyword}
                    </span>
                  </td>

                  {/* Search Volume */}
                  <td className="px-6 py-4 text-right font-mono font-bold text-gray-100">
                    {item.searchVolume.toLocaleString()} /mo
                  </td>

                  {/* Trend Direction */}
                  <td className="px-6 py-4 text-center font-mono">
                    {getTrendBadge(item.trendDirection, item.trend)}
                  </td>

                  {/* Competition Level */}
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 text-xs font-mono font-semibold rounded-md ${
                      item.competition === 'LOW' ? 'text-emerald-400 bg-emerald-500/10' :
                      item.competition === 'MEDIUM' ? 'text-amber-400 bg-amber-500/10' : 'text-rose-400 bg-rose-500/10'
                    }`}>
                      {item.competition} ({item.competitionScore || 50})
                    </span>
                  </td>

                  {/* Suggestions */}
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5 max-w-xs">
                      {(item.suggestions || []).slice(0, 3).map((sug, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => onResearchKeyword && onResearchKeyword([sug])}
                          className="px-2 py-0.5 rounded bg-dark-800 hover:bg-emerald-500/20 hover:text-emerald-300 text-[11px] text-gray-400 border border-gray-800 transition-colors"
                        >
                          + {sug}
                        </button>
                      ))}
                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
