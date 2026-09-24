'use client';
import { useState } from 'react';
import { seoApi } from '@/lib/api';
import { DataTable } from '@/components/ui/DataTable';
import { SparklineChart } from '@/components/ui/SparklineChart';
import { Search, Loader2, Globe } from 'lucide-react';

const COUNTRIES = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'AE', name: 'UAE', flag: '🇦🇪' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
];

export default function KeywordResearchPage() {
  const [input, setInput] = useState('');
  const [country, setCountry] = useState('US');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    
    const keywords = input.split(/[\n,]+/).map(k => k.trim()).filter(Boolean);
    if (keywords.length === 0) return;

    setLoading(true);
    setError('');

    try {
      const res = await seoApi.researchKeywords(keywords, country);
      setResults(res.results);
      
      seoApi.saveHistory({
        tool: 'Keyword Research',
        query: `${keywords.length} keywords in ${country}`,
        resultsCount: res.results.length
      }).catch(console.error);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to analyze keywords.');
    } finally {
      setLoading(false);
    }
  };

  const selectedCountry = COUNTRIES.find(c => c.code === country);

  const columns = [
    {
      key: 'keyword',
      label: 'Keyword',
      render: (val) => <span className="font-semibold text-slate-900">{val}</span>
    },
    { key: 'volume', label: 'Volume' },
    { 
      key: 'competition', 
      label: 'Difficulty',
      render: (val) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
          val === 'low' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
          val === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
          'bg-rose-50 text-rose-700 border-rose-200'
        }`}>
          {val.charAt(0).toUpperCase() + val.slice(1)}
        </span>
      )
    },
    { key: 'cpc', label: 'Est. CPC', render: (val) => `$${val.toFixed(2)}` },
    {
      key: 'opportunity',
      label: 'Opportunity Score',
      render: (val) => (
        <div className="flex items-center space-x-2">
          <div className="w-full bg-slate-100 rounded-full h-2 max-w-[100px] border border-slate-200 overflow-hidden">
            <div
              className={`h-2 rounded-full ${val > 70 ? 'bg-emerald-500' : val > 40 ? 'bg-amber-500' : 'bg-rose-500'}`}
              style={{ width: `${val}%` }}
            />
          </div>
          <span className="text-xs text-slate-500 font-mono font-medium">{val}/100</span>
        </div>
      )
    },
    { 
      key: 'sparkline', 
      label: '12m Trend', 
      render: (val, row) => <SparklineChart data={val} trend={row.trend} /> 
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-1">Bulk Keyword Research</h1>
        <p className="text-sm text-slate-500">
          Enter up to 500 keywords to get volume, trends, and opportunity scores.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        {/* Country Selector Row */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Globe className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-slate-700">Target Country:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {COUNTRIES.slice(0, 6).map(c => (
              <button
                key={c.code}
                onClick={() => setCountry(c.code)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                  country === c.code
                    ? 'bg-[#0a192f] text-white border-[#0a192f] shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>{c.flag}</span>
                <span>{c.code}</span>
              </button>
            ))}
            <select
              value={country}
              onChange={e => setCountry(e.target.value)}
              className="bg-white border border-slate-200 rounded-full px-3 py-1 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-xs"
            >
              {COUNTRIES.map(c => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>
          {selectedCountry && (
            <span className="text-xs text-blue-600 font-semibold">
              {selectedCountry.flag} {selectedCountry.name}
            </span>
          )}
        </div>

        {/* Keywords Textarea */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Keywords
            <span className="ml-2 text-xs text-slate-400 font-normal">(comma or newline separated)</span>
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. best running shoes, cheap marathon gear, how to run faster..."
            className="w-full h-32 bg-slate-50/70 border border-slate-200 rounded-xl p-4 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y text-sm transition-all"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <p className="text-xs text-emerald-600 font-semibold">
            ✓ 100% Free · Unlimited Bulk Keywords · {COUNTRIES.length}+ Countries
          </p>
          <button
            onClick={handleAnalyze}
            disabled={loading || !input.trim()}
            className="flex items-center justify-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-[#0a192f] via-[#11244e] to-[#1e3a8a] hover:from-[#060e1d] hover:to-[#0f2347] disabled:opacity-50 text-white font-semibold rounded-xl transition-all shadow-md shadow-[#0a192f]/20"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin text-[#38bdf8]" /> : <Search className="w-4 h-4 text-[#38bdf8]" />}
            <span>{loading ? 'Analyzing...' : 'Analyze Keywords'}</span>
          </button>
        </div>
        
        {error && (
          <p className="text-sm text-rose-700 bg-rose-50 p-3.5 rounded-xl border border-rose-200">{error}</p>
        )}
      </div>

      {results && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">
            Results ({results.length})
            {selectedCountry && (
              <span className="ml-2 text-sm text-slate-500 font-normal">
                for {selectedCountry.flag} {selectedCountry.name}
              </span>
            )}
          </h2>
          <DataTable columns={columns} data={results} filename={`kwresearch_${country}.csv`} />
        </div>
      )}
    </div>
  );
}
