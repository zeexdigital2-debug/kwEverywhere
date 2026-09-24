'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminService } from '@/lib/adminApi';
import {
  FileText,
  FolderTree,
  Image as ImageIcon,
  Users,
  Eye,
  Search,
  Sparkles,
  TrendingUp,
  Plus,
  ArrowUpRight,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadStats = async () => {
    try {
      setError('');
      const res = await adminService.getStats();
      if (res && res.success) {
        setData(res);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadStats();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-3" />
        <p className="text-xs text-slate-400 font-medium">Loading metrics...</p>
      </div>
    );
  }

  const stats = data?.stats || {
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    totalCategories: 0,
    totalMedia: 0,
    totalUsers: 0,
    proUsers: 0,
    totalViews: 0,
    totalKeywordsQueried: 0
  };

  const statCards = [
    {
      title: 'Total Articles',
      value: stats.totalArticles,
      subtext: `${stats.publishedArticles} Published · ${stats.draftArticles} Drafts`,
      icon: FileText,
      color: 'from-blue-500/20 to-blue-600/5',
      iconColor: 'text-blue-400',
      border: 'border-blue-500/20',
      link: '/admin/articles'
    },
    {
      title: 'Categories',
      value: stats.totalCategories,
      subtext: 'Content Taxonomies',
      icon: FolderTree,
      color: 'from-purple-500/20 to-purple-600/5',
      iconColor: 'text-purple-400',
      border: 'border-purple-500/20',
      link: '/admin/categories'
    },
    {
      title: 'Media Files',
      value: stats.totalMedia,
      subtext: 'Images & Assets',
      icon: ImageIcon,
      color: 'from-amber-500/20 to-amber-600/5',
      iconColor: 'text-amber-400',
      border: 'border-amber-500/20',
      link: '/admin/media'
    },
    {
      title: 'Registered Clients',
      value: stats.totalUsers,
      subtext: `${stats.proUsers} Pro & Agency`,
      icon: Users,
      color: 'from-emerald-500/20 to-emerald-600/5',
      iconColor: 'text-emerald-400',
      border: 'border-emerald-500/20',
      link: '/admin/users'
    },
    {
      title: 'Total Article Views',
      value: stats.totalViews.toLocaleString(),
      subtext: 'Lifetime Reader Traffic',
      icon: Eye,
      color: 'from-cyan-500/20 to-cyan-600/5',
      iconColor: 'text-cyan-400',
      border: 'border-cyan-500/20'
    },
    {
      title: 'Live Searches Logged',
      value: stats.totalKeywordsQueried.toLocaleString(),
      subtext: 'Keywords Analyzed',
      icon: Search,
      color: 'from-pink-500/20 to-pink-600/5',
      iconColor: 'text-pink-400',
      border: 'border-pink-500/20'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Website Overview</span>
            <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
              Live System
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitor content publishing, reader traffic, subscriber accounts, and SEO settings.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-medium transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Syncing...' : 'Refresh'}</span>
          </button>

          <Link
            href="/admin/articles/new"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Article</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400">
          {error}
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          const CardContent = (
            <div
              className={`p-5 rounded-2xl bg-gradient-to-br ${card.color} bg-slate-900/60 border ${card.border} backdrop-blur-sm relative overflow-hidden group hover:border-slate-700 transition-all duration-200`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-400 tracking-wide uppercase">{card.title}</p>
                  <p className="text-2xl font-bold text-white mt-1.5">{card.value}</p>
                  <p className="text-[11px] text-slate-400 mt-1">{card.subtext}</p>
                </div>
                <div className={`p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 ${card.iconColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              {card.link && (
                <div className="mt-4 pt-3 border-t border-slate-800/50 flex items-center justify-between text-[11px] font-medium text-blue-400 group-hover:text-blue-300">
                  <span>Manage</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              )}
            </div>
          );

          return card.link ? (
            <Link key={idx} href={card.link}>
              {CardContent}
            </Link>
          ) : (
            <div key={idx}>{CardContent}</div>
          );
        })}
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Articles */}
        <div className="lg:col-span-2 bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white">Recent Articles</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">Latest published posts and drafts</p>
            </div>
            <Link
              href="/admin/articles"
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="pb-2.5 font-semibold">Title</th>
                  <th className="pb-2.5 font-semibold">Category</th>
                  <th className="pb-2.5 font-semibold">Status</th>
                  <th className="pb-2.5 font-semibold">Views</th>
                  <th className="pb-2.5 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {(data?.recentArticles || []).map((art) => (
                  <tr key={art._id} className="group hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 pr-3 font-medium text-slate-200">
                      <span className="line-clamp-1 group-hover:text-blue-400 transition-colors">
                        {art.title}
                      </span>
                    </td>
                    <td className="py-3 pr-3">
                      <span
                        className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium"
                        style={{
                          backgroundColor: `${art.category?.color || '#2563eb'}20`,
                          color: art.category?.color || '#60a5fa'
                        }}
                      >
                        {art.category?.name || 'General'}
                      </span>
                    </td>
                    <td className="py-3 pr-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          art.status === 'published'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {art.status}
                      </span>
                    </td>
                    <td className="py-3 pr-3 text-slate-400">{art.views || 0}</td>
                    <td className="py-3 text-right">
                      <Link
                        href={`/admin/articles/${art._id}`}
                        className="text-blue-400 hover:text-blue-300 font-semibold text-[11px] underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
                {(!data?.recentArticles || data.recentArticles.length === 0) && (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-500 text-xs">
                      No articles created yet. Click "Create Article" to publish your first post.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Registered Clients */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white">Recent Clients</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">Active client registrations</p>
            </div>
            <Link
              href="/admin/users"
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              All <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {(data?.recentUsers || []).map((user) => (
              <div
                key={user._id}
                className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/60 flex items-center justify-between text-xs"
              >
                <div className="overflow-hidden pr-2">
                  <p className="font-semibold text-slate-200 truncate">{user.email}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{user.credits || 0} credits</p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    user.plan === 'agency'
                      ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      : user.plan === 'pro'
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {user.plan || 'Free'}
                </span>
              </div>
            ))}
            {(!data?.recentUsers || data.recentUsers.length === 0) && (
              <div className="py-8 text-center text-slate-500 text-xs">
                No client registrations recorded yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
