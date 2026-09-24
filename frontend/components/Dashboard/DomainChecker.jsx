'use client';

import React, { useState } from 'react';
import { Shield, Search, Loader2, Globe, Award, BarChart3 } from 'lucide-react';
import api from '../../lib/api';

export default function DomainChecker() {
  const [domainInput, setDomainInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!domainInput.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/domain/metrics', { domain: domainInput.trim() });
      if (res.data && res.data.data) {
        setResult(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch domain authority metrics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-gray-800 shadow-xl">
      
      <div className="flex items-center space-x-3 mb-6 border-b border-gray-800 pb-4">
        <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Domain Authority Checker</h3>
          <p className="text-xs text-gray-400">Powered by OpenPageRank API algorithm</p>
        </div>
      </div>

      <form onSubmit={handleCheck} className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Globe className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
          <input
            type="text"
            required
            value={domainInput}
            onChange={(e) => setDomainInput(e.target.value)}
            placeholder="Enter domain URL (e.g., github.com, nytimes.com)..."
            className="w-full bg-dark-800 border border-gray-700/80 rounded-2xl pl-12 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 font-medium"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center space-x-2 shrink-0"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Querying...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>Check DA Score</span>
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          {error}
        </div>
      )}

      {result && (
        <div className="bg-dark-800/80 p-6 rounded-2xl border border-gray-700/80 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-gray-700/60 pb-4 mb-4">
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-purple-400" />
              <span className="font-extrabold text-white text-lg">{result.domain}</span>
            </div>
            <span className="px-2.5 py-1 text-[11px] font-mono bg-purple-500/10 text-purple-400 rounded-md border border-purple-500/20">
              {result.source}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-dark-900 p-4 rounded-xl border border-gray-800">
              <Award className="w-5 h-5 text-amber-400 mx-auto mb-1" />
              <div className="text-2xl font-extrabold text-white font-mono">{result.domainAuthority} / 100</div>
              <div className="text-xs text-gray-400 mt-1">Domain Authority (DA)</div>
            </div>

            <div className="bg-dark-900 p-4 rounded-xl border border-gray-800">
              <BarChart3 className="w-5 h-5 text-purple-400 mx-auto mb-1" />
              <div className="text-2xl font-extrabold text-purple-300 font-mono">{result.pageRank} / 10</div>
              <div className="text-xs text-gray-400 mt-1">OpenPageRank Score</div>
            </div>

            <div className="bg-dark-900 p-4 rounded-xl border border-gray-800">
              <Globe className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <div className="text-xl font-extrabold text-emerald-400 font-mono">{result.globalRank}</div>
              <div className="text-xs text-gray-400 mt-1">Global Web Rank</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
