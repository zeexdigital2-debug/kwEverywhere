'use client';

import React, { useEffect, useState } from 'react';
import { adminService, adminAuth } from '@/lib/adminApi';
import {
  Settings,
  Globe,
  Shield,
  Key,
  Save,
  CheckCircle,
  Share2,
  Lock,
  Mail,
  Coins,
  Server
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general'); // 'general', 'seo', 'social', 'security'
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  // Settings state
  const [general, setGeneral] = useState({
    siteName: 'Keywords Everywhere Pro',
    tagline: 'Instant Search Volume, CPC & SEO Intelligence',
    contactEmail: 'support@kweverywhere.com',
    defaultCredits: 250,
    allowRegistration: true
  });

  const [seo, setSeo] = useState({
    metaTitle: 'Keywords Everywhere — Instant SEO & Keyword Intelligence',
    metaDescription: 'Discover high-intent keywords, search volume, CPC, and competition with real-time analytics.',
    keywords: 'keyword research, seo tool, cpc checker, search volume',
    ogImageUrl: '',
    robotsTxt: 'User-agent: *\nAllow: /'
  });

  const [social, setSocial] = useState({
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com'
  });

  // Security password state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    newUsername: ''
  });

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await adminService.getSettings();
      if (res && res.success && res.settings) {
        if (res.settings.general) setGeneral(res.settings.general);
        if (res.settings.seo) setSeo(res.settings.seo);
        if (res.settings.social) setSocial(res.settings.social);
      }
    } catch (err) {
      console.error(err);
      setNotification({ type: 'error', message: 'Failed to load site settings.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSaveGroup = async (groupName, data) => {
    setSaving(true);
    setNotification(null);
    try {
      const res = await adminService.updateSettings(groupName, data);
      if (res && res.success) {
        setNotification({ type: 'success', message: `${groupName.toUpperCase()} settings saved successfully!` });
      }
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to update settings.' });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setNotification({ type: 'error', message: 'New passwords do not match.' });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setNotification({ type: 'error', message: 'New password must be at least 6 characters.' });
      return;
    }

    setSaving(true);
    setNotification(null);

    try {
      const res = await adminAuth.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        newUsername: passwordForm.newUsername || undefined
      });

      if (res && res.success) {
        setNotification({ type: 'success', message: 'Admin credentials updated successfully!' });
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
          newUsername: ''
        });
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update password.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-3" />
        <p className="text-xs text-slate-400 font-medium">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-500" />
          <span>Site Configuration & Security</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Customize global metadata, default credits, branding, and change admin credentials.
        </p>
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

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'general', name: 'General & Branding', icon: Server },
          { id: 'seo', name: 'Default SEO & Meta', icon: Globe },
          { id: 'social', name: 'Social Profiles', icon: Share2 },
          { id: 'security', name: 'Admin Security', icon: Lock }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: General Settings */}
      {activeTab === 'general' && (
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 space-y-5 max-w-2xl">
          <h2 className="text-sm font-bold text-white">General Application Settings</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Site Name / Brand
              </label>
              <input
                type="text"
                value={general.siteName || ''}
                onChange={(e) => setGeneral({ ...general, siteName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Tagline / Slogan
              </label>
              <input
                type="text"
                value={general.tagline || ''}
                onChange={(e) => setGeneral({ ...general, tagline: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Support / Contact Email
              </label>
              <input
                type="email"
                value={general.contactEmail || ''}
                onChange={(e) => setGeneral({ ...general, contactEmail: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Default Free Credits Upon Sign-up
              </label>
              <input
                type="number"
                value={general.defaultCredits || 250}
                onChange={(e) => setGeneral({ ...general, defaultCredits: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSaveGroup('general', general)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save General Settings'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: SEO Settings */}
      {activeTab === 'seo' && (
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 space-y-5 max-w-2xl">
          <h2 className="text-sm font-bold text-white">Global SEO & Search Defaults</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Default Meta Title
              </label>
              <input
                type="text"
                value={seo.metaTitle || ''}
                onChange={(e) => setSeo({ ...seo, metaTitle: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Default Meta Description
              </label>
              <textarea
                rows={3}
                value={seo.metaDescription || ''}
                onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Global Keywords (comma-separated)
              </label>
              <input
                type="text"
                value={seo.keywords || ''}
                onChange={(e) => setSeo({ ...seo, keywords: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Robots.txt Content
              </label>
              <textarea
                rows={3}
                value={seo.robotsTxt || ''}
                onChange={(e) => setSeo({ ...seo, robotsTxt: e.target.value })}
                className="w-full px-3 py-2 font-mono bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSaveGroup('seo', seo)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save SEO Defaults'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Social Settings */}
      {activeTab === 'social' && (
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 space-y-5 max-w-2xl">
          <h2 className="text-sm font-bold text-white">Social & External Profiles</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Twitter / X Profile URL
              </label>
              <input
                type="text"
                value={social.twitter || ''}
                onChange={(e) => setSocial({ ...social, twitter: e.target.value })}
                placeholder="https://twitter.com/kweverywhere"
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                LinkedIn Profile / Page URL
              </label>
              <input
                type="text"
                value={social.linkedin || ''}
                onChange={(e) => setSocial({ ...social, linkedin: e.target.value })}
                placeholder="https://linkedin.com/company/kweverywhere"
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                GitHub Repository / Org URL
              </label>
              <input
                type="text"
                value={social.github || ''}
                onChange={(e) => setSocial({ ...social, github: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSaveGroup('social', social)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Social Profiles'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Security & Master Password */}
      {activeTab === 'security' && (
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 space-y-5 max-w-2xl">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-400" />
            <span>Update Master Admin Credentials</span>
          </h2>
          <p className="text-xs text-slate-400">
            For security, update the master username and password for the admin panel. Passwords are encrypted with bcrypt.
          </p>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                New Username (Optional)
              </label>
              <input
                type="text"
                value={passwordForm.newUsername}
                onChange={(e) => setPasswordForm({ ...passwordForm, newUsername: e.target.value })}
                placeholder="Leave blank to keep current username"
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                placeholder="Enter current password"
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                New Password (Min. 6 chars)
              </label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                placeholder="Enter new password"
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                placeholder="Confirm new password"
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 disabled:opacity-50 cursor-pointer"
              >
                <Key className="w-4 h-4" />
                <span>{saving ? 'Updating...' : 'Update Password'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
