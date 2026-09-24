'use client';
import { useState } from 'react';
import { seoApi } from '@/lib/api';
import { DataTable } from '@/components/ui/DataTable';
import { SparklineChart } from '@/components/ui/SparklineChart';
import { Globe, Loader2, MapPin, Languages } from 'lucide-react';

const COUNTRIES = [
  { code: 'US', name: 'United States', flag: '🇺🇸', lang: 'en' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', lang: 'en' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', lang: 'en' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', lang: 'en' },
  { code: 'IN', name: 'India', flag: '🇮🇳', lang: 'en' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', lang: 'en' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', lang: 'de' },
  { code: 'FR', name: 'France', flag: '🇫🇷', lang: 'fr' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', lang: 'es' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', lang: 'pt' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', lang: 'es' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', lang: 'it' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', lang: 'nl' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', lang: 'sv' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴', lang: 'no' },
  { code: 'AE', name: 'UAE', flag: '🇦🇪', lang: 'ar' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', lang: 'ar' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', lang: 'ja' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', lang: 'ko' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', lang: 'en' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', lang: 'en' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', lang: 'en' },
];

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'it', name: 'Italian' },
  { code: 'nl', name: 'Dutch' },
  { code: 'ar', name: 'Arabic' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'sv', name: 'Swedish' },
  { code: 'no', name: 'Norwegian' },
];

export default function LocalKeywordsPage() {
  const [keyword, setKeyword] = useState('');
  const [geo, setGeo] = useState('US');
  const [lang, setLang] = useState('en');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleCountryChange = (e) => {
    const code = e.target.value;
    setGeo(code);
    // Auto-select matching language
    const country = COUNTRIES.find(c => c.code === code);
    if (country) setLang(country.lang);
  };

  const handleSearch = async () => {
    if (!keyword.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await seoApi.getLocalKeywords(keyword.trim(), geo, lang);
      setResults(res.results);
      seoApi.saveHistory({
        tool: 'Local Keywords',
        query: `${keyword} in ${geo} (${lang})`,
        resultsCount: res.results.length
      }).catch(console.error);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch local data.');
    } finally {
      setLoading(false);
    }
  };

  const selectedCountry = COUNTRIES.find(c => c.code === geo);

  const columns = [
    {
      key: 'keyword',
      label: 'Keyword',
      render: (val) => <span className="font-semibold text-slate-900">{val}</span>
    },
    {
      key: 'geo',
      label: 'Location',
      render: (val) => (
        <div className="flex items-center space-x-1.5 text-slate-600">
          <MapPin className="w-3.5 h-3.5 text-blue-500" />
          <span>{val || selectedCountry?.name}</span>
        </div>
      )
    },
    { key: 'volume', label: 'Local Volume' },
    {
      key: 'competition',
      label: 'Difficulty',
      render: (val) => (
        <span className={`capitalize px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
          val === 'low' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
          val === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
          'bg-rose-50 text-rose-700 border-rose-200'
        }`}>
          {val || 'Medium'}
        </span>
      )
    },
    { key: 'cpc', label: 'Est. CPC', render: (val) => `$${(val || 0).toFixed(2)}` },
    {
      key: 'sparkline',
      label: 'Local Trend',
      render: (val, row) => <SparklineChart data={val} trend={row?.trend} />
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-1 flex items-center gap-2">
          <Globe className="w-6 h-6 text-purple-600" />
          Local Keywords Intelligence
        </h1>
        <p className="text-sm text-slate-500">
          Discover geo-targeted keyword opportunities across <span className="text-slate-800 font-semibold">{COUNTRIES.length}+ countries</span> and multiple languages.
        </p>
      </div>

      {/* Country Quick Picks */}
      <div className="flex flex-wrap gap-2">
        {COUNTRIES.slice(0, 8).map(c => (
          <button
            key={c.code}
            onClick={() => { setGeo(c.code); setLang(c.lang); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              geo === c.code
                ? 'bg-[#0a192f] text-white border-[#0a192f] shadow-xs'
                : 'bg-white text-slate-700 border-slate-200/90 hover:bg-slate-50 shadow-xs'
            }`}
          >
            <span>{c.flag}</span>
            <span>{c.name}</span>
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          {/* Keyword Input */}
          <div className="md:col-span-5">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Seed Keyword</label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="e.g. plumber, food delivery, accountant"
              className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
            />
          </div>

          {/* Country Selector */}
          <div className="md:col-span-3">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
              <span>Target Country</span>
              {selectedCountry && <span>{selectedCountry.flag}</span>}
            </label>
            <select
              value={geo}
              onChange={handleCountryChange}
              className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm cursor-pointer"
            >
              {COUNTRIES.map(c => (
                <option key={c.code} value={c.code}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>

          {/* Language Selector */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
              <Languages className="w-3.5 h-3.5 text-purple-600" />
              Language
            </label>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm cursor-pointer"
            >
              {LANGUAGES.map(l => (
                <option key={l.code} value={l.code}>{l.name}</option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <div className="md:col-span-2 flex items-end">
            <button
              onClick={handleSearch}
              disabled={loading || !keyword.trim()}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-[#0a192f] via-[#11244e] to-[#1e3a8a] hover:from-[#060e1d] hover:to-[#0f2347] disabled:opacity-50 text-white font-semibold rounded-xl transition-all shadow-md shadow-[#0a192f]/20"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin text-[#38bdf8]" /> : <Globe className="w-4 h-4 text-[#38bdf8]" />}
              <span>Search</span>
            </button>
          </div>
        </div>

        <p className="text-xs text-emerald-600 font-semibold">✓ 100% Free · {COUNTRIES.length}+ Countries · {LANGUAGES.length} Languages</p>

        {error && (
          <p className="mt-4 text-sm text-rose-700 bg-rose-50 p-3.5 rounded-xl border border-rose-200">{error}</p>
        )}
      </div>

      {results && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">
            Local Opportunities in {selectedCountry?.flag} {selectedCountry?.name} ({results.length})
          </h2>
          <DataTable columns={columns} data={results} filename={`local_keywords_${geo}_${lang}.csv`} />
        </div>
      )}
    </div>
  );
}
