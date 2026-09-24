'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminService } from '@/lib/adminApi';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit,
  Eye,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, limit: 10 });
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteModalId, setDeleteModalId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [artRes, catRes] = await Promise.all([
        adminService.getArticles({
          page,
          search,
          status: statusFilter,
          category: categoryFilter,
          limit: 10
        }),
        adminService.getCategories()
      ]);

      if (artRes && artRes.success) {
        setArticles(artRes.articles || []);
        setPagination(artRes.pagination || { total: 0, totalPages: 1, limit: 10 });
      }
      if (catRes && catRes.success) {
        setCategories(catRes.categories || []);
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to load articles.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, statusFilter, categoryFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadData();
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === articles.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(articles.map(a => a._id));
    }
  };

  const toggleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedIds.length === 0) return;
    if (action === 'delete' && !confirm(`Are you sure you want to delete ${selectedIds.length} articles?`)) {
      return;
    }

    setActionLoading(true);
    try {
      const res = await adminService.bulkArticles(selectedIds, action);
      if (res && res.success) {
        setMessage({ type: 'success', text: res.message || 'Bulk operation completed.' });
        setSelectedIds([]);
        loadData();
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Bulk action failed.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModalId) return;
    setActionLoading(true);
    try {
      const res = await adminService.deleteArticle(deleteModalId);
      if (res && res.success) {
        setMessage({ type: 'success', text: 'Article deleted successfully.' });
        setDeleteModalId(null);
        loadData();
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete article.' });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-500" />
            <span>Articles & Content Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Create, edit, publish, and optimize your blog posts and organic SEO articles.
          </p>
        </div>

        <Link
          href="/admin/articles/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Article</span>
        </Link>
      </div>

      {/* Notification Message */}
      {message && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center justify-between ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
              : 'bg-red-500/10 border border-red-500/20 text-red-400'
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-white">
            &times;
          </button>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search articles by title or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-20 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium rounded-lg"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Filters */}
          <div className="flex bg-slate-950/60 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => { setStatusFilter(''); setPage(1); }}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === '' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => { setStatusFilter('published'); setPage(1); }}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === 'published' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Published
            </button>
            <button
              onClick={() => { setStatusFilter('draft'); setPage(1); }}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === 'draft' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Drafts
            </button>
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            className="bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bulk Actions Banner */}
      {selectedIds.length > 0 && (
        <div className="bg-blue-950/40 border border-blue-800/40 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-blue-300 animate-fadeIn">
          <span className="font-semibold">
            {selectedIds.length} article{selectedIds.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkAction('publish')}
              disabled={actionLoading}
              className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-lg font-medium transition-colors"
            >
              Publish
            </button>
            <button
              onClick={() => handleBulkAction('draft')}
              disabled={actionLoading}
              className="px-2.5 py-1 bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-500/30 rounded-lg font-medium transition-colors"
            >
              Move to Draft
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              disabled={actionLoading}
              className="px-2.5 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded-lg font-medium transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Articles Table */}
      <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/50 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={articles.length > 0 && selectedIds.length === articles.length}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0"
                  />
                </th>
                <th className="p-3.5 font-semibold">Title & Excerpt</th>
                <th className="p-3.5 font-semibold">Category</th>
                <th className="p-3.5 font-semibold">Status</th>
                <th className="p-3.5 font-semibold">Views</th>
                <th className="p-3.5 font-semibold">Date</th>
                <th className="p-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {articles.map((art) => (
                <tr key={art._id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-3.5 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(art._id)}
                      onChange={() => toggleSelectOne(art._id)}
                      className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0"
                    />
                  </td>
                  <td className="p-3.5 max-w-xs">
                    <Link
                      href={`/admin/articles/${art._id}`}
                      className="font-bold text-slate-200 hover:text-blue-400 transition-colors line-clamp-1 text-xs"
                    >
                      {art.title}
                    </Link>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      /{art.slug}
                    </p>
                  </td>
                  <td className="p-3.5">
                    {art.category ? (
                      <span
                        className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold"
                        style={{
                          backgroundColor: `${art.category.color || '#2563eb'}20`,
                          color: art.category.color || '#60a5fa'
                        }}
                      >
                        {art.category.name}
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[11px]">Uncategorized</span>
                    )}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        art.status === 'published'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {art.status === 'published' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      <span className="capitalize">{art.status}</span>
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-400 font-medium">
                    {art.views || 0}
                  </td>
                  <td className="p-3.5 text-slate-400 text-[11px]">
                    {art.createdAt ? new Date(art.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    <Link
                      href={`/admin/articles/${art._id}`}
                      className="inline-p-1 text-slate-400 hover:text-blue-400 transition-colors"
                      title="Edit Article"
                    >
                      <Edit className="w-4 h-4 inline" />
                    </Link>
                    <button
                      onClick={() => setDeleteModalId(art._id)}
                      className="inline-p-1 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                      title="Delete Article"
                    >
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}

              {articles.length === 0 && !loading && (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500 text-xs">
                    No articles found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-3.5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>
            Showing {articles.length} of {pagination.total} articles
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 disabled:opacity-30 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-slate-300 font-semibold">
              {page} / {pagination.totalPages || 1}
            </span>
            <button
              onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
              disabled={page >= pagination.totalPages}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 disabled:opacity-30 hover:text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalId && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Delete Article?</h3>
            <p className="text-xs text-slate-400">
              This action cannot be undone. This post will be permanently removed from the website and index.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteModalId(null)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={actionLoading}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
              >
                {actionLoading ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
