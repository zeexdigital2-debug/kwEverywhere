'use client';
import { useState } from 'react';
import { seoApi } from '@/lib/api';
import { DataTable } from '@/components/ui/DataTable';
import { SparklineChart } from '@/components/ui/SparklineChart';
import { Lightbulb, Loader2, Globe, AlertTriangle } from 'lucide-react';

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

const MULTI_KEYWORD_WARNING =
  'Keywords Finder works with one keyword at a time. Enter a single keyword to get related ideas. To check data for your own list of keywords, use Keyword Research.';

export default function KeywordsFinderPage() {
  const [input, setInput] = useState('');
  const [country, setCountry] = useState('US');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInput(val);

    // Live validation: check if user typed or pasted comma or new line
    if (val.includes(',') || val.includes('\n') || val.includes('\r')) {
      setWarning(MULTI_KEYWORD_WARNING);
      setResults(null);
    } else {
      setWarning('');
    }
  };

  const handleSearch = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    // Strict single-keyword check: do NOT call Google Ads API if multiple keywords entered
    if (trimmed.includes(',') || trimmed.includes('\n') || trimmed.includes('\r')) {
      setWarning(MULTI_KEYWORD_WARNING);
      setResults(null);
      return;
    }

    setLoading(true);
    setError('');
    setWarning('');

    try {
      const res = await seoApi.findKeywords({
        seed: trimmed,
        country
      });

      setResults(res.results || []);

      seoApi.saveHistory({
        tool: 'Keywords Finder',
        query: `${trimmed} in ${country}`,
        resultsCount: res.results?.length || 0
      }).catch(console.error);
    } catch (err) {
      const errMsg = err.response?.data?.error || err.message || 'Failed to find keyword ideas.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const selectedCountry = COUNTRIES.find(c => c.code === country);

  const columns = [
    {
      key: 'keyword',
      label: 'Keyword Idea',
      render: (val) => <span className="font-semibold text-slate-900">{val}</span>
    },
    {
      key: 'volume',
      label: 'Volume',
      render: (val) => (typeof val === 'number' ? val.toLocaleString() : (val ?? 0))
    },
    {
      key: 'competition',
      label: 'Competition',
      render: (val, row) => {
        const vol = Number(row?.volume) || 0;
        if (vol <= 0 || !val || val === 'unspecified') {
          return <span className="text-slate-400 font-medium">—</span>;
        }
        return (
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
            val === 'low' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
            val === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
            'bg-rose-50 text-rose-700 border-rose-200'
          }`}>
            {String(val || 'medium').charAt(0).toUpperCase() + String(val || 'medium').slice(1)}
          </span>
        );
      }
    },
    {
      key: 'cpc',
      label: 'Est. CPC',
      render: (val, row) => {
        const vol = Number(row?.volume) || 0;
        if (vol <= 0 || !val || Number(val) <= 0) {
          return <span className="text-slate-400 font-medium">—</span>;
        }
        return `$${Number(val).toFixed(2)}`;
      }
    },
    {
      key: 'opportunity',
      label: 'Opportunity Score',
      render: (val, row) => {
        const vol = Number(row?.volume) || 0;
        if (vol <= 0 || !val || Number(val) <= 0) {
          return <span className="text-slate-400 font-medium">—</span>;
        }
        return (
          <div className="flex items-center space-x-2">
            <div className="w-full bg-slate-100 rounded-full h-2 max-w-[100px] border border-slate-200 overflow-hidden">
              <div
                className={`h-2 rounded-full ${val > 70 ? 'bg-emerald-500' : val > 40 ? 'bg-amber-500' : 'bg-rose-500'}`}
                style={{ width: `${Math.min(100, Math.max(0, val))}%` }}
              />
            </div>
            <span className="text-xs text-slate-500 font-mono font-medium">{val}/100</span>
          </div>
        );
      }
    },
    {
      key: 'sparkline',
      label: '12m Trend',
      render: (val, row) => {
        const vol = Number(row?.volume) || 0;
        if (vol <= 0 || !val || val.length === 0 || val.every(v => v === 0)) {
          return <span className="text-slate-400 font-medium">—</span>;
        }
        return <SparklineChart data={val} monthlyVolumes={row.monthlyVolumes} trend={row.trend} />;
      }
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
          Keywords Finder
        </h1>
        <p className="text-sm text-slate-500">
          Enter a single seed keyword to discover up to 200 related keyword ideas and search trends from Google Ads.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        {/* Country Selector Row */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Globe className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-slate-700">Target Country:</span>
          </div>
          <select
            value={country}
            onChange={e => setCountry(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3.5 py-1.5 text-xs sm:text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-xs min-w-[200px]"
          >
            {COUNTRIES.map(c => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name} ({c.code})
              </option>
            ))}
          </select>
        </div>

        {/* Input & Action */}
        <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Enter a Single Seed Keyword
              <span className="ml-2 text-xs text-slate-400 font-normal">
                (One keyword only, e.g. coffee beans)
              </span>
            </label>
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
              placeholder="e.g. coffee beans, running shoes, web hosting..."
              className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading || !input.trim()}
            className="flex items-center justify-center space-x-2 px-8 py-3 bg-gradient-to-r from-[#0a192f] via-[#11244e] to-[#1e3a8a] hover:from-[#060e1d] hover:to-[#0f2347] disabled:opacity-50 text-white font-semibold rounded-xl transition-all shadow-md shadow-[#0a192f]/20 whitespace-nowrap"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin text-[#38bdf8]" /> : <Lightbulb className="w-4 h-4 text-[#38bdf8]" />}
            <span>{loading ? 'Finding Ideas...' : 'Find Keywords'}</span>
          </button>
        </div>

        {/* Multi-keyword Warning Notification / Toast */}
        {warning && (
          <div className="flex items-start space-x-3 bg-amber-50 border border-amber-300 text-amber-900 px-4 py-3 rounded-xl text-sm animate-in fade-in">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-950">Single Keyword Only</p>
              <p className="text-amber-800 text-xs mt-0.5">{warning}</p>
            </div>
          </div>
        )}

        <div className="pt-1">
          <p className="text-xs text-emerald-600 font-semibold">
            ✓ 100% Free · Real Google Ads Ideas · Up to 200 Suggestions · {COUNTRIES.length}+ Countries
          </p>
        </div>

        {error && (
          <p className="text-sm text-rose-700 bg-rose-50 p-3.5 rounded-xl border border-rose-200">
            {error}
          </p>
        )}
      </div>

      {results && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">
            Found Keywords ({results.length})
            {selectedCountry && (
              <span className="ml-2 text-sm text-slate-500 font-normal">
                for {selectedCountry.flag} {selectedCountry.name}
              </span>
            )}
          </h2>
          <DataTable columns={columns} data={results} filename={`finder_${input.trim().replace(/\s+/g, '_')}_${country}.csv`} />
        </div>
      )}
    </div>
  );
}
