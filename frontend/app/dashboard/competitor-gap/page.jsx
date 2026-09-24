'use client';
import { useState } from 'react';
import { seoApi } from '@/lib/api';
import { DataTable } from '@/components/ui/DataTable';
import { SparklineChart } from '@/components/ui/SparklineChart';
import { GitCompare, Loader2, Plus, X, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const INTENT_COLORS = {
  transactional: 'bg-amber-50 text-amber-700 border-amber-200',
  commercial: 'bg-blue-50 text-blue-700 border-blue-200',
  informational: 'bg-slate-100 text-slate-700 border-slate-200',
  local: 'bg-purple-50 text-purple-700 border-purple-200',
};

export default function CompetitorGapPage() {
  const [yourDomain, setYourDomain] = useState('');
  const [competitors, setCompetitors] = useState(['', '']);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // all | missing | weak | strong

  const addCompetitor = () => {
    if (competitors.length < 4) setCompetitors([...competitors, '']);
  };

  const removeCompetitor = (i) => {
    if (competitors.length <= 1) return;
    setCompetitors(competitors.filter((_, idx) => idx !== i));
  };

  const updateCompetitor = (i, val) => {
    const updated = [...competitors];
    updated[i] = val;
    setCompetitors(updated);
  };

  const handleAnalyze = async () => {
    const your = yourDomain.trim();
    const comps = competitors.map(c => c.trim()).filter(Boolean);
    if (!your || comps.length === 0) return;

    setLoading(true);
    setError('');
    setResults(null);

    try {
      // Use keywords finder as a proxy — fetch keywords for each domain and find gaps
      const [yourData, ...competitorData] = await Promise.all([
        seoApi.findKeywords({ type: 'domain', domain: your }),
        ...comps.map(c => seoApi.findKeywords({ type: 'domain', domain: c })),
      ]);

      const yourKeywords = new Set((yourData.results || []).map(r => r.keyword.toLowerCase()));
      
      // Merge competitor keywords with gap analysis
      const gapMap = new Map();
      competitorData.forEach((cd, idx) => {
        (cd.results || []).forEach(kw => {
          const key = kw.keyword.toLowerCase();
          if (!gapMap.has(key)) {
            gapMap.set(key, { ...kw, sources: [], inYourSite: yourKeywords.has(key) });
          }
          gapMap.get(key).sources.push(comps[idx]);
        });
      });

      const gapResults = Array.from(gapMap.values())
        .sort((a, b) => b.volume - a.volume);

      setResults({
        yourDomain: your,
        competitors: comps,
        total: gapResults.length,
        missing: gapResults.filter(r => !r.inYourSite).length,
        keywords: gapResults,
      });

      seoApi.saveHistory({
        tool: 'Competitor Gap',
        query: `${your} vs ${comps.join(', ')}`,
        resultsCount: gapResults.length
      }).catch(console.error);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to analyze competitor gap.');
    } finally {
      setLoading(false);
    }
  };

  const filteredKeywords = results?.keywords?.filter(kw => {
    if (activeFilter === 'missing') return !kw.inYourSite;
    if (activeFilter === 'have') return kw.inYourSite;
    return true;
  }) ?? [];

  const columns = [
    {
      key: 'keyword',
      label: 'Keyword',
      render: (val) => <span className="font-semibold text-slate-900">{val}</span>
    },
    {
      key: 'inYourSite',
      label: 'Gap Status',
      render: (val) => val ? (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <Minus className="w-3 h-3" /> You Rank
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <TrendingDown className="w-3 h-3" /> Gap
        </span>
      )
    },
    { key: 'volume', label: 'Volume' },
    {
      key: 'intent',
      label: 'Intent',
      render: (val) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${INTENT_COLORS[val] || INTENT_COLORS.informational}`}>
          {val ? val.charAt(0).toUpperCase() + val.slice(1) : 'Informational'}
        </span>
      )
    },
    { key: 'cpc', label: 'Est. CPC', render: (val) => `$${(val || 0).toFixed(2)}` },
    {
      key: 'sources',
      label: 'Competitors',
      render: (val) => (
        <div className="flex flex-wrap gap-1">
          {(val || []).map((s, i) => (
            <span key={i} className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-slate-100 border border-slate-200 text-slate-700 truncate max-w-[120px]">
              {s}
            </span>
          ))}
        </div>
      )
    },
    {
      key: 'sparkline',
      label: '12m Trend',
      render: (val, row) => <SparklineChart data={val} trend={row?.trend} />
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-1 flex items-center gap-2">
          <GitCompare className="w-6 h-6 text-blue-600" />
          Competitor Gap Analysis
        </h1>
        <p className="text-sm text-slate-500">
          Find keywords your competitors rank for but you don't — uncover hidden traffic opportunities.
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
        {/* Your Domain */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Your Domain
          </label>
          <input
            type="text"
            value={yourDomain}
            onChange={e => setYourDomain(e.target.value)}
            placeholder="e.g. yourdomain.com"
            className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
          />
        </div>

        {/* Competitor Domains */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Competitor Domains
            <span className="ml-2 text-xs text-slate-400 font-normal">(max 4)</span>
          </label>
          <div className="space-y-2">
            {competitors.map((comp, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={comp}
                  onChange={e => updateCompetitor(i, e.target.value)}
                  placeholder={`Competitor ${i + 1} (e.g. competitor.com)`}
                  className="flex-1 bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
                />
                {competitors.length > 1 && (
                  <button
                    onClick={() => removeCompetitor(i)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          {competitors.length < 4 && (
            <button
              onClick={addCompetitor}
              className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Competitor
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <p className="text-xs text-emerald-600 font-semibold">✓ 100% Free · Unlimited Analyses</p>
          <button
            onClick={handleAnalyze}
            disabled={loading || !yourDomain.trim() || !competitors.some(c => c.trim())}
            className="flex items-center justify-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-[#0a192f] via-[#11244e] to-[#1e3a8a] hover:from-[#060e1d] hover:to-[#0f2347] disabled:opacity-50 text-white font-semibold rounded-xl transition-all shadow-md shadow-[#0a192f]/20"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin text-[#38bdf8]" /> : <GitCompare className="w-4 h-4 text-[#38bdf8]" />}
            <span>{loading ? 'Analyzing...' : 'Find Keyword Gaps'}</span>
          </button>
        </div>

        {error && (
          <p className="text-sm text-rose-700 bg-rose-50 p-3.5 rounded-xl border border-rose-200">{error}</p>
        )}
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-5">
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Total Keywords</p>
              <p className="text-2xl font-bold text-slate-900">{results.total.toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-xs">
              <p className="text-xs text-rose-600 uppercase tracking-wider font-semibold mb-1">Keyword Gaps</p>
              <p className="text-2xl font-bold text-rose-600">{results.missing.toLocaleString()}</p>
              <p className="text-xs text-slate-400">you don't rank for</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-xs">
              <p className="text-xs text-emerald-700 uppercase tracking-wider font-semibold mb-1">You Rank For</p>
              <p className="text-2xl font-bold text-emerald-700">{(results.total - results.missing).toLocaleString()}</p>
              <p className="text-xs text-slate-400">shared keywords</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1.5 p-1 bg-slate-100 rounded-xl w-fit border border-slate-200">
            {[
              { id: 'all', label: `All (${results.total})` },
              { id: 'missing', label: `Gaps (${results.missing})` },
              { id: 'have', label: `You Rank (${results.total - results.missing})` },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeFilter === f.id
                    ? 'bg-[#0a192f] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <DataTable
            columns={columns}
            data={filteredKeywords}
            filename={`competitor_gap_${results.yourDomain}.csv`}
          />
        </div>
      )}
    </div>
  );
}
