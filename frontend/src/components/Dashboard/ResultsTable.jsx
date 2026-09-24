import React, { useState } from 'react';
import { Download, Search, TrendingUp, BarChart2, Sparkles, Filter, ChevronDown, Tag } from 'lucide-react';
import { useKeywords } from '../../context/KeywordContext';

export default function ResultsTable() {
  const { results, setActiveTrendItem, performResearch } = useKeywords();
  const [filterQuery, setFilterQuery] = useState('');
  const [sortBy, setSortBy] = useState('volume'); // 'volume' | 'difficulty' | 'cpc'

  // Filter & Sort
  const filtered = results.filter(item =>
    item.keyword.toLowerCase().includes(filterQuery.toLowerCase())
  ).sort((a, b) => {
    if (sortBy === 'volume') return b.searchVolume - a.searchVolume;
    if (sortBy === 'difficulty') return b.difficulty - a.difficulty;
    if (sortBy === 'cpc') return b.cpc - a.cpc;
    return 0;
  });

  // CSV Export handler
  const exportToCSV = () => {
    if (filtered.length === 0) return;

    const headers = ['Keyword', 'Search Volume', 'Competition', 'Competition Score', 'Difficulty (%)', 'CPC ($)', 'Suggestions'];
    const rows = filtered.map(item => [
      `"${item.keyword}"`,
      item.searchVolume,
      item.competition,
      item.competitionScore,
      item.difficulty,
      item.cpc,
      `"${(item.suggestions || []).join('; ')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `kws_keyword_research_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getDifficultyBadge = (score) => {
    if (score < 35) return <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md">Easy ({score}%)</span>;
    if (score < 65) return <span className="px-2 py-0.5 text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-md">Medium ({score}%)</span>;
    return <span className="px-2 py-0.5 text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-md">Hard ({score}%)</span>;
  };

  return (
    <div className="glass-panel rounded-3xl border border-gray-800 shadow-xl overflow-hidden">
      
      {/* Header controls */}
      <div className="p-6 border-b border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div>
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <BarChart2 className="w-5 h-5 text-brand-400" />
            <span>Keyword Intelligence ({filtered.length})</span>
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">Real-time volume estimates, difficulty ratings & Google Autocomplete long-tails</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          
          {/* Search Filter Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter results..."
              className="bg-dark-800 border border-gray-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 w-44"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center space-x-1.5 bg-dark-800 border border-gray-700/80 px-3 py-1.5 rounded-xl text-xs text-gray-300">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-brand-400 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="volume" className="bg-dark-800">Search Volume</option>
              <option value="difficulty" className="bg-dark-800">Difficulty (KD)</option>
              <option value="cpc" className="bg-dark-800">CPC ($)</option>
            </select>
          </div>

          {/* CSV Export Button */}
          <button
            onClick={exportToCSV}
            className="px-4 py-1.5 bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 border border-brand-500/30 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

        </div>

      </div>

      {/* Results Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-dark-800/80 text-[11px] font-mono uppercase tracking-wider text-gray-400 border-b border-gray-800">
            <tr>
              <th className="px-6 py-3.5">Keyword Phrase</th>
              <th className="px-6 py-3.5 text-right">Est. Volume</th>
              <th className="px-6 py-3.5 text-center">12-Mo Trend</th>
              <th className="px-6 py-3.5 text-center">Competition</th>
              <th className="px-6 py-3.5 text-center">Difficulty</th>
              <th className="px-6 py-3.5 text-right">CPC ($)</th>
              <th className="px-6 py-3.5">Autocomplete Suggestions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500 text-sm">
                  No keywords found. Enter a keyword above or upload a CSV file.
                </td>
              </tr>
            ) : (
              filtered.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-800/40 transition-colors group">
                  
                  {/* Keyword */}
                  <td className="px-6 py-4 font-semibold text-white">
                    <div className="flex items-center space-x-2">
                      <span className="hover:text-brand-400 cursor-pointer" onClick={() => performResearch(item.keyword)}>
                        {item.keyword}
                      </span>
                    </div>
                  </td>

                  {/* Search Volume */}
                  <td className="px-6 py-4 text-right font-mono font-bold text-gray-100">
                    {item.searchVolume.toLocaleString()} /mo
                  </td>

                  {/* 12-Month Sparkline Button */}
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => setActiveTrendItem(item)}
                      className="inline-flex items-center space-x-1.5 px-3 py-1 bg-dark-800 hover:bg-gray-700/80 rounded-lg text-xs text-brand-400 font-mono transition-all border border-gray-700/50 group-hover:border-brand-500/40"
                    >
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>View Chart</span>
                    </button>
                  </td>

                  {/* Competition */}
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-0.5 text-xs font-mono font-semibold rounded-md ${
                      item.competition === 'LOW' ? 'text-emerald-400 bg-emerald-500/10' :
                      item.competition === 'MEDIUM' ? 'text-amber-400 bg-amber-500/10' : 'text-rose-400 bg-rose-500/10'
                    }`}>
                      {item.competition} ({item.competitionScore})
                    </span>
                  </td>

                  {/* Difficulty */}
                  <td className="px-6 py-4 text-center font-mono">
                    {getDifficultyBadge(item.difficulty)}
                  </td>

                  {/* CPC */}
                  <td className="px-6 py-4 text-right font-mono text-emerald-400 font-semibold">
                    ${item.cpc.toFixed(2)}
                  </td>

                  {/* Suggestions tags */}
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5 max-w-xs">
                      {(item.suggestions || []).slice(0, 3).map((sug, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => performResearch(sug)}
                          className="px-2 py-0.5 rounded bg-dark-800 hover:bg-brand-500/20 hover:text-brand-300 text-[11px] text-gray-400 border border-gray-800 transition-colors"
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
