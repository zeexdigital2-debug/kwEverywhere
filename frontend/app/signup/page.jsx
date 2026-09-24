'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, Mail, Lock, User as UserIcon, ArrowRight, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const PASSWORD_RULES = [
  { test: (p) => p.length >= 8, label: 'At least 8 characters' },
  { test: (p) => /[A-Z]/.test(p), label: 'One uppercase letter' },
  { test: (p) => /[0-9]/.test(p), label: 'One number' },
];

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });

      if (error) throw error;
      setSuccess(true);
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

  const passwordStrength = PASSWORD_RULES.filter(r => r.test(password)).length;
  const strengthColor = ['bg-red-500', 'bg-yellow-500', 'bg-brand-500'][passwordStrength - 1] || 'bg-white/10';

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900 py-12 px-4">
        <div className="max-w-md w-full glass-card p-10 rounded-2xl text-center space-y-5">
          <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">Check your inbox!</h2>
          <p className="text-gray-400">
            We've sent a confirmation link to{' '}
            <strong className="text-white">{email}</strong>.<br />
            Click it to activate your account.
          </p>
          <div className="pt-2 space-y-3">
            <Link href="/dashboard" className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-semibold text-white bg-brand-500 hover:bg-brand-600 transition-all">
              <span>Start as Guest</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/login" className="block text-sm text-gray-400 hover:text-white transition-colors">
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-dark-900 text-white">
      
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between relative overflow-hidden bg-gradient-to-br from-teal-950 via-dark-900 to-dark-900 p-12">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-600/15 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3 pointer-events-none" />

        <div className="relative">
          <Link href="/">
            <img src="/logo.png" alt="KWEveryWhere" className="h-14 w-auto bg-white rounded-2xl p-2 shadow-lg" />
          </Link>
        </div>

        <div className="relative space-y-8">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-wider mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
              100% Free Forever
            </span>
            <h2 className="text-4xl font-extrabold tracking-tight mb-3 leading-tight">
              Start ranking higher<br />
              <span className="text-brand-400">in minutes.</span>
            </h2>
            <p className="text-gray-400 text-base leading-relaxed">
              Create your free account and get instant access to professional-grade SEO tools used by 10,000+ marketers.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { num: '3,000', label: 'Keywords per batch' },
              { num: '22+', label: 'Target countries' },
              { num: '∞', label: 'Free searches' },
              { num: '100%', label: 'No credit card' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-4">
                <p className="text-2xl font-extrabold text-brand-400">{stat.num}</p>
                <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-gray-600">
          © {new Date().getFullYear()} KWEveryWhere. Not affiliated with Google LLC.
        </p>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-brand-900/10 via-dark-900 to-dark-900" />

        <div className="relative w-full max-w-md space-y-7">

          <div className="lg:hidden text-center">
            <Link href="/">
              <img src="/logo.png" alt="KWEveryWhere" className="h-14 w-auto mx-auto bg-white rounded-2xl p-2 shadow-lg" />
            </Link>
          </div>

          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Create your account</h1>
            <p className="mt-2 text-gray-400 text-sm">
              Free forever. No credit card required.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSignup}>
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-dark-800/60 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>

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
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  minLength={6}
                  className="w-full bg-dark-800/60 border border-white/10 rounded-xl pl-10 pr-11 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  placeholder="Min. 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength */}
              {password && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <div
                        key={i}
                        className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                          i < passwordStrength ? strengthColor : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {PASSWORD_RULES.map((rule, i) => (
                      <span
                        key={i}
                        className={`text-xs flex items-center gap-1 transition-colors ${
                          rule.test(password) ? 'text-green-400' : 'text-gray-500'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${rule.test(password) ? 'bg-green-400' : 'bg-gray-600'}`} />
                        {rule.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="space-y-2">
                <p className="text-sm text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-400/20">{error}</p>
                {error.includes('Guest Mode') && (
                  <Link href="/dashboard" className="flex items-center justify-center gap-2 text-sm font-medium text-brand-400 hover:text-brand-300 bg-brand-500/10 px-4 py-2.5 rounded-xl border border-brand-500/20 transition-all">
                    Continue in Guest Mode <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-dark-900 disabled:opacity-50 transition-all shadow-lg shadow-brand-500/20 hover:-translate-y-0.5"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  <span>Create Free Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-xs text-center text-gray-500">
              By signing up you agree to our{' '}
              <Link href="/terms" className="text-gray-400 hover:text-white underline underline-offset-2">Terms</Link>
              {' '}&{' '}
              <Link href="/privacy" className="text-gray-400 hover:text-white underline underline-offset-2">Privacy Policy</Link>.
            </p>
          </form>

          <p className="text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-brand-400 hover:text-brand-300 transition-colors">
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
