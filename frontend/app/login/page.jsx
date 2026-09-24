'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const FEATURES = [
  'Unlimited keyword research — 100% free',
  'Bulk analyze up to 3,000 keywords',
  'Competitor Gap Analysis',
  '22+ countries & language targeting',
  'Domain Authority checker',
  'CSV export for all results',
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      window.location.href = '/dashboard';
    } catch (err) {
      if (err.message === 'Failed to fetch' || err.message?.includes('fetch')) {
        setError('Supabase is not configured. Please add your credentials to .env, or use Guest Mode.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-dark-900 text-white">
      
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between relative overflow-hidden bg-gradient-to-br from-brand-950 via-dark-900 to-dark-900 p-12">
        {/* Decorative Orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

        <div className="relative">
          <Link href="/" className="inline-block">
            <img src="/logo.png" alt="KWEveryWhere" className="h-14 w-auto bg-white rounded-2xl p-2 shadow-lg" />
          </Link>
        </div>

        <div className="relative space-y-8">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight mb-3 leading-tight">
              The #1 Free<br />
              <span className="text-brand-400">Keyword Intelligence</span><br />
              Platform
            </h2>
            <p className="text-gray-400 text-base leading-relaxed">
              Join thousands of SEOs, agencies, and creators who use KWEveryWhere every day to dominate search rankings.
            </p>
          </div>

          <ul className="space-y-3">
            {FEATURES.map((f, i) => (
              <li key={i} className="flex items-center gap-2.5 text-sm text-gray-300">
                <div className="w-5 h-5 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-brand-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                {f}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-gray-600">
          © {new Date().getFullYear()} KWEveryWhere. Not affiliated with Google LLC.
        </p>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-900/10 via-dark-900 to-dark-900" />

        <div className="relative w-full max-w-md space-y-8">
          
          {/* Mobile Logo */}
          <div className="lg:hidden text-center">
            <Link href="/">
              <img src="/logo.png" alt="KWEveryWhere" className="h-14 w-auto mx-auto bg-white rounded-2xl p-2 shadow-lg" />
            </Link>
          </div>

          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Welcome back</h1>
            <p className="mt-2 text-gray-400 text-sm">
              Sign in to access your keyword dashboard.
            </p>
          </div>

          {/* Guest Mode Notice */}
          <div className="flex items-start gap-3 bg-brand-500/5 border border-brand-500/20 rounded-xl p-4">
            <Sparkles className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-brand-300">No account? No problem!</p>
              <p className="text-xs text-gray-400 mt-0.5">
                All tools are free.{' '}
                <Link href="/dashboard" className="text-brand-400 hover:text-brand-300 font-medium underline underline-offset-2">
                  Continue as Guest →
                </Link>
              </p>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-dark-800/60 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">Password</label>
                <button type="button" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-dark-800/60 border border-white/10 rounded-xl pl-10 pr-11 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="space-y-2">
                <p className="text-sm text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-400/20">{error}</p>
                {error.includes('Guest Mode') && (
                  <Link href="/dashboard" className="flex items-center justify-center gap-2 text-sm font-medium text-brand-400 hover:text-brand-300 bg-brand-500/10 px-4 py-2.5 rounded-xl border border-brand-500/20 transition-all hover:bg-brand-500/20">
                    <span>Continue in Guest Mode</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-dark-900 disabled:opacity-50 transition-all shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 hover:-translate-y-0.5"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link href="/signup" className="font-semibold text-brand-400 hover:text-brand-300 transition-colors">
              Create one free →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
