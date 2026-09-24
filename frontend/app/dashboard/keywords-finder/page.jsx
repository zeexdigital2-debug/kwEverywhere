'use client';
import { useState } from 'react';
import { seoApi } from '@/lib/api';
import { DataTable } from '@/components/ui/DataTable';
import { SparklineChart } from '@/components/ui/SparklineChart';
import { Target, Loader2, Link2, Search } from 'lucide-react';
import { clsx } from 'clsx';

export default function KeywordsFinderPage() {
  const [mode, setMode] = useState('seed'); // seed, url, domain
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError('');

    const payload = { type: mode };
    if (mode === 'seed') payload.seed = input.trim();
    if (mode === 'url') payload.url = input.trim();
    if (mode === 'domain') payload.domain = input.trim();

    try {
      const res = await seoApi.findKeywords(payload);
      setResults(res.results);
      seoApi.saveHistory({ tool: 'Keywords Finder', query: input.trim(), resultsCount: res.results.length }).catch(console.error);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to find keywords.');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'keyword', label: 'Keyword', render: (val) => <span className="font-semibold text-slate-900">{val}</span> },
    { key: 'volume', label: 'Volume' },
    { 
      key: 'intent', 
      label: 'Intent',
      render: (val) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
          val === 'transactional' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
          val === 'commercial' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
          val === 'local' ? 'bg-purple-50 text-purple-700 border-purple-200' : 
          'bg-slate-100 text-slate-700 border-slate-200' // informational
        }`}>
          {val.charAt(0).toUpperCase() + val.slice(1)}
        </span>
      )
    },
    { key: 'cpc', label: 'Est. CPC', render: (val) => `$${val.toFixed(2)}` },
    { 
      key: 'sparkline', 
      label: '12m Trend', 
      render: (val, row) => <SparklineChart data={val} trend={row.trend} /> 
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-1">Keywords Finder</h1>
        <p className="text-sm text-slate-500">Extract high-intent keywords from competitor URLs, domains, or seed keywords.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex space-x-2 mb-6 p-1 bg-slate-100 rounded-xl w-fit border border-slate-200">
          {[
            { id: 'seed', icon: Search, label: 'Seed Keyword' },
            { id: 'url', icon: Link2, label: 'Competitor URL' },
            { id: 'domain', icon: Target, label: 'Domain Root' }
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => { setMode(m.id); setInput(''); setResults(null); }}
              className={clsx(
                'flex items-center space-x-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all',
                mode === m.id
                  ? 'bg-[#0a192f] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              )}
            >
              <m.icon className="w-3.5 h-3.5" />
              <span>{m.label}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              {mode === 'seed' ? 'Enter a seed keyword (e.g. coffee beans)' : 
               mode === 'url' ? 'Enter a specific page URL (e.g. example.com/best-coffee)' : 
               'Enter a root domain (e.g. example.com)'}
            </label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'url' ? 'https://...' : ''}
              className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading || !input.trim()}
            className="flex items-center justify-center space-x-2 px-8 py-3 bg-gradient-to-r from-[#0a192f] via-[#11244e] to-[#1e3a8a] hover:from-[#060e1d] hover:to-[#0f2347] disabled:opacity-50 text-white font-semibold rounded-xl transition-all shadow-md shadow-[#0a192f]/20 whitespace-nowrap"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin text-[#38bdf8]" /> : <Target className="w-4 h-4 text-[#38bdf8]" />}
            <span>{loading ? 'Finding...' : 'Find Keywords'}</span>
          </button>
        </div>
        
        <p className="text-xs text-emerald-600 font-semibold">✓ 100% Free · Unlimited Searches</p>
        
        {error && <p className="mt-4 text-sm text-rose-700 bg-rose-50 p-3.5 rounded-xl border border-rose-200">{error}</p>}
      </div>

      {results && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Found Keywords ({results.length})</h2>
          <DataTable columns={columns} data={results} filename={`finder_${mode}.csv`} />
        </div>
      )}
    </div>
  );
}
