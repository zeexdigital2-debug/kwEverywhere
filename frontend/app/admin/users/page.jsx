'use client';

import React, { useEffect, useState } from 'react';
import { adminService } from '@/lib/adminApi';
import {
  Users,
  Search,
  Edit,
  Trash2,
  Key,
  Shield,
  Coins,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Sparkles
} from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [notification, setNotification] = useState(null);

  // Edit User Modal
  const [editingUser, setEditingUser] = useState(null);
  const [editCredits, setEditCredits] = useState(0);
  const [editPlan, setEditPlan] = useState('free');
  const [submitting, setSubmitting] = useState(false);

  // Delete User Modal
  const [deleteModalId, setDeleteModalId] = useState(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getUsers({
        page,
        search,
        plan: planFilter,
        limit: 10
      });
      if (res && res.success) {
        setUsers(res.users || []);
        setPagination(res.pagination || { total: 0, totalPages: 1 });
      }
    } catch (err) {
      console.error(err);
      setNotification({ type: 'error', message: 'Failed to load user accounts.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [page, planFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadUsers();
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setEditCredits(user.credits || 0);
    setEditPlan(user.plan || 'free');
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    setSubmitting(true);
    try {
      const res = await adminService.updateUser(editingUser._id, {
        credits: editCredits,
        plan: editPlan
      });
      if (res && res.success) {
        setNotification({ type: 'success', message: 'User account updated successfully.' });
        setEditingUser(null);
        loadUsers();
      }
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to update user.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteModalId) return;

    setSubmitting(true);
    try {
      const res = await adminService.deleteUser(deleteModalId);
      if (res && res.success) {
        setNotification({ type: 'success', message: 'User account deleted.' });
        setDeleteModalId(null);
        loadUsers();
      }
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to delete user.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-400" />
            <span>Client Management & Accounts</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage registered clients, allocate search credits, and upgrade subscription tiers.
          </p>
        </div>
      </div>

      {notification && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center justify-between ${
            notification.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
              : 'bg-red-500/10 border border-red-500/20 text-red-400'
          }`}
        >
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white">
            &times;
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by email or API key..."
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

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Plan:</span>
          <div className="flex bg-slate-950/60 p-1 rounded-xl border border-slate-800">
            {['', 'free', 'pro', 'agency'].map((p) => (
              <button
                key={p}
                onClick={() => { setPlanFilter(p); setPage(1); }}
                className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                  planFilter === p ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {p === '' ? 'All' : p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/50 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5 font-semibold">Client Email</th>
                <th className="p-3.5 font-semibold">Plan Tier</th>
                <th className="p-3.5 font-semibold">Credits</th>
                <th className="p-3.5 font-semibold">API Key</th>
                <th className="p-3.5 font-semibold">Joined Date</th>
                <th className="p-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-3.5 font-semibold text-slate-200">
                    {u.email}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        u.plan === 'agency'
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                          : u.plan === 'pro'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {u.plan || 'Free'}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="inline-flex items-center gap-1 font-bold text-amber-400">
                      <Coins className="w-3.5 h-3.5" />
                      {(u.credits || 0).toLocaleString()}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-slate-500 text-[11px]">
                    {u.apiKey ? `${u.apiKey.slice(0, 10)}...` : 'None'}
                  </td>
                  <td className="p-3.5 text-slate-400 text-[11px]">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(u)}
                      className="p-1.5 text-slate-400 hover:text-blue-400 transition-colors cursor-pointer"
                      title="Adjust Credits & Plan"
                    >
                      <Edit className="w-4 h-4 inline" />
                    </button>
                    <button
                      onClick={() => setDeleteModalId(u._id)}
                      className="p-1.5 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                      title="Delete User"
                    >
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}

              {users.length === 0 && !loading && (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500 text-xs">
                    No user accounts found matching query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-3.5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>
            Showing {users.length} of {pagination.total} registered users
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

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Adjust Client Account</h3>
            <p className="text-xs text-slate-400">{editingUser.email}</p>

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Plan Tier
                </label>
                <select
                  value={editPlan}
                  onChange={(e) => setEditPlan(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="free">Free (250 credits/mo)</option>
                  <option value="pro">Pro (10,000 credits/mo)</option>
                  <option value="agency">Agency (100,000 credits/mo)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Available Credits
                </label>
                <input
                  type="number"
                  value={editCredits}
                  onChange={(e) => setEditCredits(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Saving...' : 'Update Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {deleteModalId && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Delete Client Account?</h3>
            <p className="text-xs text-slate-400">
              The client account and API access will be permanently revoked.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteModalId(null)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={submitting}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
