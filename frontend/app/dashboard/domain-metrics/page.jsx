'use client';
import { useState } from 'react';
import { seoApi } from '@/lib/api';
import { DataTable } from '@/components/ui/DataTable';
import { BarChart3, Loader2 } from 'lucide-react';

export default function DomainMetricsPage() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    
    // Split by comma or newline
    const domains = input.split(/[\n,]+/).map(k => k.trim()).filter(Boolean);
    if (domains.length === 0) return;

    setLoading(true);
    setError('');

    try {
      const res = await seoApi.getDomainMetrics(domains);
      setResults(res.results);
      seoApi.saveHistory({ tool: 'Domain Metrics', query: `${domains.length} domains`, resultsCount: res.results.length }).catch(console.error);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch domain metrics.');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'domain', label: 'Domain', render: (val) => <span className="font-semibold text-slate-900">{val}</span> },
    { key: 'pageRank', label: 'Authority Score (0-10)', render: (val) => (
      <div className="flex items-center space-x-2">
        <div className="font-mono text-blue-600 font-bold w-8">{val.toFixed(1)}</div>
        <div className="w-full bg-slate-100 rounded-full h-1.5 max-w-[100px] border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-sky-400 h-1.5 rounded-full" style={{ width: `${(val / 10) * 100}%` }}></div>
        </div>
      </div>
    )},
    { 
      key: 'authorityTier', 
      label: 'Tier',
      render: (val) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
          val === 'Very High' || val === 'High' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
          val === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
          'bg-slate-100 text-slate-700 border-slate-200'
        }`}>
          {val}
        </span>
      )
    },
    { key: 'rank', label: 'Global Rank' },
    { key: 'status', label: 'Data Source', render: (val) => <span className="text-slate-400 text-xs uppercase font-medium">{val}</span> }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-1">Bulk Domain Metrics</h1>
        <p className="text-sm text-slate-500">Check OpenPageRank authority scores and ranks for up to 50 domains at once.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Domains <span className="text-xs text-slate-400 font-normal">(comma or newline separated)</span>
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. apple.com, google.com, amazon.com..."
          className="w-full h-32 bg-slate-50/70 border border-slate-200 rounded-xl p-4 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y mb-4 font-mono text-sm transition-all"
        />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-xs text-emerald-600 font-semibold">✓ 100% Free · Unlimited Domains</p>
          <button
            onClick={handleAnalyze}
            disabled={loading || !input.trim()}
            className="flex items-center justify-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-[#0a192f] via-[#11244e] to-[#1e3a8a] hover:from-[#060e1d] hover:to-[#0f2347] disabled:opacity-50 text-white font-semibold rounded-xl transition-all shadow-md shadow-[#0a192f]/20"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin text-[#38bdf8]" /> : <BarChart3 className="w-4 h-4 text-[#38bdf8]" />}
            <span>{loading ? 'Analyzing...' : 'Analyze Domains'}</span>
          </button>
        </div>
        
        {error && <p className="mt-4 text-sm text-rose-700 bg-rose-50 p-3.5 rounded-xl border border-rose-200">{error}</p>}
      </div>

      {results && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Results ({results.length})</h2>
          <DataTable columns={columns} data={results} filename="domain_metrics.csv" />
        </div>
      )}
    </div>
  );
}
