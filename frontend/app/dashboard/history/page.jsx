'use client';
import { useState, useEffect } from 'react';
import { seoApi } from '@/lib/api';
import { History, Clock, FileText, Search, Target, Globe, BarChart3, GitCompare, Trash2, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';
import Link from 'next/link';

const TOOL_CONFIG = {
  'Keyword Research': {
    icon: Search,
    color: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    href: '/dashboard/keyword-research',
  },
  'Keywords Finder': {
    icon: Target,
    color: 'bg-brand-500/10 text-brand-400 border border-brand-500/20',
    href: '/dashboard/keywords-finder',
  },
  'Local Keywords': {
    icon: Globe,
    color: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    href: '/dashboard/local-keywords',
  },
  'Domain Metrics': {
    icon: BarChart3,
    color: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
    href: '/dashboard/domain-metrics',
  },
  'Competitor Gap': {
    icon: GitCompare,
    color: 'bg-pink-500/10 text-pink-400 border border-pink-500/20',
    href: '/dashboard/competitor-gap',
  },
};

function relativeTime(ts) {
  const diff = Date.now() - new Date(ts).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTool, setFilterTool] = useState('all');
  const [saveHistory, setSaveHistory] = useState(true);

  const loadHistory = () => {
    setLoading(true);
    seoApi.getHistory()
      .then(res => setHistory(res.history || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const tools = ['all', ...Object.keys(TOOL_CONFIG)];

  const filtered = filterTool === 'all'
    ? history
    : history.filter(h => h.tool === filterTool);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1 flex items-center gap-2">
            <History className="w-7 h-7 text-gray-400" />
            Search History
          </h1>
          <p className="text-gray-400 text-sm">Your recent tool usage across the platform.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Refresh */}
          <button
            onClick={loadHistory}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Refresh history"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {/* Save History Toggle */}
          <label className="flex items-center space-x-2 bg-dark-800 border border-white/5 px-4 py-2 rounded-lg cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={saveHistory}
                onChange={e => setSaveHistory(e.target.checked)}
              />
              <div className={`w-10 h-5 rounded-full transition-colors ${saveHistory ? 'bg-brand-500' : 'bg-gray-700'}`} />
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${saveHistory ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
            <span className="text-sm font-medium text-gray-300">Save History</span>
          </label>
        </div>
      </div>

      {/* Stats */}
      {history.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="glass-card p-4 rounded-xl">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Total Searches</p>
            <p className="text-2xl font-bold text-white">{history.length}</p>
          </div>
          {Object.entries(TOOL_CONFIG).slice(0, 3).map(([name, config]) => {
            const count = history.filter(h => h.tool === name).length;
            const Icon = config.icon;
            return (
              <div key={name} className="glass-card p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="w-3.5 h-3.5 text-gray-400" />
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold truncate">{name.split(' ')[0]}</p>
                </div>
                <p className="text-2xl font-bold text-white">{count}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Filter Tabs */}
      {history.length > 0 && (
        <div className="flex space-x-1 p-1 bg-dark-900/50 rounded-lg w-fit border border-white/5 overflow-x-auto">
          {tools.map(t => (
            <button
              key={t}
              onClick={() => setFilterTool(t)}
              className={clsx(
                'px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap',
                filterTool === t
                  ? 'bg-brand-500/20 text-brand-400'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
            >
              {t === 'all' ? `All (${history.length})` : `${t.split(' ')[0]} (${history.filter(h => h.tool === t).length})`}
            </button>
          ))}
        </div>
      )}

      {/* History List */}
      <div className="glass-card rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-14 text-center">
            <History className="w-14 h-14 text-gray-700 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-1">No History Yet</h3>
            <p className="text-gray-500 text-sm mb-6">
              {filterTool !== 'all' ? `No ${filterTool} searches found.` : 'Run some tools to see your past searches here.'}
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-500 text-white rounded-xl text-sm font-medium hover:bg-brand-600 transition-all"
            >
              Start a Search
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {filtered.map((item) => {
              const config = TOOL_CONFIG[item.tool] || TOOL_CONFIG['Keyword Research'];
              const Icon = config.icon;
              return (
                <li
                  key={item.id}
                  className="p-4 hover:bg-white/[0.03] transition-colors flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-center space-x-4 min-w-0">
                    <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', config.color)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-white text-sm">{item.tool}</p>
                      <p className="text-xs text-gray-400 truncate max-w-[200px] sm:max-w-sm md:max-w-lg">{item.query}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right hidden sm:block">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-dark-900 border border-white/5 text-gray-300">
                        {item.resultsCount} results
                      </span>
                      <div className="flex items-center text-xs text-gray-500 justify-end mt-1">
                        <Clock className="w-3 h-3 mr-1" />
                        <span title={new Date(item.timestamp).toLocaleString()}>
                          {relativeTime(item.timestamp)}
                        </span>
                      </div>
                    </div>
                    {/* Re-run Link */}
                    <Link
                      href={config.href}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-gray-500 hover:text-brand-400 hover:bg-brand-500/10 transition-all"
                      title="Go to tool"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
