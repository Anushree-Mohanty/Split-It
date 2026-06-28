'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  DollarSign, Sun, Moon, Users, Wallet, TrendingUp,
  Eye, EyeOff, Loader2, AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

type Tab = 'login' | 'signup';

export default function LandingPage() {
  const router = useRouter();
  const { user, loading, login, signup } = useAuth();
  const { isDark, toggle } = useTheme();
  const [tab, setTab] = useState<Tab>('login');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');
  const [showSignupPw, setShowSignupPw] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace('/dashboard');
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-green-600 dark:text-orange-400 animate-spin" />
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      await login(loginEmail.trim(), loginPassword);
      router.push('/dashboard');
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');
    if (!signupName.trim()) { setSignupError('Full name is required'); return; }
    if (signupPassword.length < 6) { setSignupError('Password must be at least 6 characters'); return; }
    if (signupPassword !== signupConfirm) { setSignupError('Passwords do not match'); return; }
    setSignupLoading(true);
    try {
      await signup(signupName.trim(), signupEmail.trim(), signupPassword);
      router.push('/dashboard');
    } catch (err) {
      setSignupError(err instanceof Error ? err.message : 'Sign up failed');
    } finally {
      setSignupLoading(false);
    }
  };

  const inputBase =
    'w-full px-4 py-3 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 ' +
    'border bg-white/70 border-white/80 text-gray-900 placeholder-gray-400 focus:ring-green-500 focus:border-transparent backdrop-blur-sm ' +
    'dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder-gray-500 dark:focus:ring-orange-500';

  const btnPrimary =
    'w-full py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg ' +
    'bg-green-600 hover:bg-green-700 text-white shadow-green-500/30 ' +
    'dark:bg-gradient-to-r dark:from-orange-500 dark:to-amber-400 dark:hover:from-orange-600 dark:hover:to-amber-500 dark:text-gray-900 dark:shadow-orange-500/30';

  const features = [
    { Icon: Users,      title: 'Group Splitting', desc: 'Create groups and split bills equally with friends or family.' },
    { Icon: Wallet,     title: 'Personal Tracker', desc: 'Log your own income and expenses by category.' },
    { Icon: TrendingUp, title: 'Live Balances',    desc: 'Real-time settlement calculation for every group.' },
  ];

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">

      {/* ══════════════════════════════════════════
          BACKGROUND BLOBS
      ══════════════════════════════════════════ */}
      <div className="pointer-events-none select-none absolute inset-0 z-0 overflow-hidden">
        {/* top-left large blob */}
        <div className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-green-400/30 dark:bg-orange-500/10 blur-3xl" />
        {/* top-right blob */}
        <div className="absolute -top-10 right-0 w-72 h-72 rounded-full bg-emerald-300/25 dark:bg-amber-400/8 blur-3xl" />
        {/* bottom-left blob */}
        <div className="absolute bottom-0 -left-10 w-64 h-64 rounded-full bg-teal-300/20 dark:bg-orange-600/8 blur-3xl" />
        {/* bottom-right blob */}
        <div className="absolute -bottom-20 right-1/4 w-80 h-80 rounded-full bg-green-200/30 dark:bg-amber-500/6 blur-3xl" />

        {/* Desktop only: faded centered icon + rings */}
        <div className="hidden lg:flex absolute inset-0 items-center justify-center">
          <div className="absolute w-[600px] h-[600px] rounded-full border border-green-400/15 dark:border-orange-500/10" />
          <div className="absolute w-[400px] h-[400px] rounded-full border border-green-400/20 dark:border-orange-500/15" />
          <div className="relative w-52 h-52 rounded-[3rem] bg-green-600/[0.06] dark:bg-gradient-to-br dark:from-orange-500/12 dark:to-amber-400/6 border border-green-400/15 dark:border-orange-500/15 flex items-center justify-center">
            <DollarSign strokeWidth={1.2} className="w-28 h-28 text-green-600/15 dark:text-orange-400/15" />
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          HEADER
      ══════════════════════════════════════════ */}
      <header className="relative z-10 flex items-center justify-between px-5 sm:px-8 py-5 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-green-600 dark:bg-gradient-to-br dark:from-orange-500 dark:to-amber-400 flex items-center justify-center shadow-lg shadow-green-500/30 dark:shadow-orange-500/40">
            <DollarSign className="w-5 h-5 text-white dark:text-gray-900" />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            Split<span className="text-green-600 dark:text-orange-400">It</span>
          </span>
        </div>
        <button
          onClick={toggle}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/50 dark:bg-white/5 backdrop-blur-md border border-white/70 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-white/80 dark:hover:bg-white/10 transition-all shadow-sm"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </header>

      {/* ══════════════════════════════════════════
          MOBILE HERO (glass card)
      ══════════════════════════════════════════ */}
      <div className="lg:hidden relative z-10 px-4 pb-5">
        <div className="rounded-3xl overflow-hidden bg-white/40 dark:bg-white/5 backdrop-blur-2xl border border-white/70 dark:border-white/10 shadow-2xl shadow-green-200/40 dark:shadow-orange-500/10 p-6 pt-8 flex flex-col items-center text-center">

          {/* Icon with concentric glow rings */}
          <div className="relative w-52 h-52 flex items-center justify-center mb-7">
            {/* outer ring */}
            <div className="absolute w-52 h-52 rounded-full border border-green-400/25 dark:border-orange-500/15 bg-green-300/[0.07] dark:bg-orange-500/[0.05]" />
            {/* middle ring */}
            <div className="absolute w-36 h-36 rounded-full border border-green-500/30 dark:border-orange-500/20 bg-green-300/[0.10] dark:bg-orange-500/[0.07]" />
            {/* glow behind icon */}
            <div className="absolute w-24 h-24 rounded-[1.6rem] bg-green-400/20 dark:bg-orange-500/20 blur-xl" />
            {/* icon card */}
            <div className="relative z-10 w-20 h-20 rounded-[1.5rem] bg-green-600 dark:bg-gradient-to-br dark:from-orange-500 dark:to-amber-400 flex items-center justify-center shadow-2xl shadow-green-600/40 dark:shadow-orange-500/50">
              <DollarSign strokeWidth={1.5} className="w-10 h-10 text-white dark:text-gray-900" />
            </div>
          </div>

          {/* Labels */}
          <p className="text-xs font-bold tracking-widest uppercase text-green-600 dark:text-orange-400 mb-2">
            Expense Splitter
          </p>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white leading-tight mb-3">
            Welcome to{' '}
            <span className="text-green-600 dark:text-transparent dark:bg-gradient-to-r dark:from-orange-400 dark:to-amber-300 dark:bg-clip-text">
              SplitIt
            </span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xs mb-6">
            The simplest way to split group expenses and track personal finances — all in Indian Rupees.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-2">
            {features.map(({ Icon, title }) => (
              <div
                key={title}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/60 dark:bg-orange-500/10 backdrop-blur-sm border border-white/80 dark:border-orange-500/20 text-green-700 dark:text-orange-400 shadow-sm"
              >
                <Icon className="w-3.5 h-3.5" />
                {title}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════════ */}
      <div className="relative z-10 flex-1 flex items-start lg:items-center justify-center px-4 pb-10 lg:py-6">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-6 lg:gap-16 items-center">

          {/* Desktop left branding */}
          <div className="hidden lg:block">
            <p className="text-sm font-semibold tracking-widest uppercase text-green-600 dark:text-orange-400 mb-3">
              Expense Splitter
            </p>
            <h1 className="text-5xl font-black text-gray-900 dark:text-white leading-tight mb-5">
              Welcome to{' '}
              <span className="text-green-600 dark:text-transparent dark:bg-gradient-to-r dark:from-orange-400 dark:to-amber-300 dark:bg-clip-text">
                SplitIt
              </span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-base mb-10 leading-relaxed max-w-sm">
              The simplest way to split group expenses and track personal finances — all in Indian Rupees.
            </p>
            <div className="space-y-5">
              {features.map(({ Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/60 dark:bg-orange-500/10 backdrop-blur-sm border border-white/80 dark:border-orange-500/20 shadow-sm">
                    <Icon className="w-5 h-5 text-green-700 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{title}</p>
                    <p className="text-gray-500 dark:text-gray-500 text-sm mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Auth glass card ── */}
          <div className="w-full">
            <div className="rounded-2xl shadow-2xl shadow-green-200/50 dark:shadow-black/40 bg-white/60 dark:bg-white/5 backdrop-blur-2xl border border-white/80 dark:border-white/10">

              {/* SIGN IN */}
              {tab === 'login' && (
                <div className="p-6 sm:p-7">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Sign In</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Welcome back! Enter your details below.</p>

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                        Email address
                      </label>
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        autoFocus
                        className={inputBase}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showLoginPw ? 'text' : 'password'}
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          className={`${inputBase} pr-12`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPw((v) => !v)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {showLoginPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    {loginError && (
                      <div className="flex items-center gap-2 text-sm text-rose-600 dark:text-rose-400 bg-rose-50/80 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 px-4 py-2.5 rounded-xl">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" /> {loginError}
                      </div>
                    )}
                    <button type="submit" disabled={loginLoading} className={`${btnPrimary} mt-2`}>
                      {loginLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                      {loginLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                  </form>

                  <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
                    Don&apos;t have an account?{' '}
                    <button
                      onClick={() => { setTab('signup'); setLoginError(''); }}
                      className="font-semibold text-green-600 dark:text-orange-400 hover:underline"
                    >
                      Create one
                    </button>
                  </p>
                </div>
              )}

              {/* SIGN UP */}
              {tab === 'signup' && (
                <div className="p-6 sm:p-7">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Create Account</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Fill in your details to get started.</p>

                  <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        placeholder="Rahul Sharma"
                        required
                        autoFocus
                        className={inputBase}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className={inputBase}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showSignupPw ? 'text' : 'password'}
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          placeholder="Min. 6 characters"
                          required
                          className={`${inputBase} pr-12`}
                        />
                        <button type="button" onClick={() => setShowSignupPw((v) => !v)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          {showSignupPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                        Confirm Password
                      </label>
                      <input
                        type={showSignupPw ? 'text' : 'password'}
                        value={signupConfirm}
                        onChange={(e) => setSignupConfirm(e.target.value)}
                        placeholder="Re-enter password"
                        required
                        className={inputBase}
                      />
                    </div>
                    {signupError && (
                      <div className="flex items-center gap-2 text-sm text-rose-600 dark:text-rose-400 bg-rose-50/80 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 px-4 py-2.5 rounded-xl">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" /> {signupError}
                      </div>
                    )}
                    <button type="submit" disabled={signupLoading} className={`${btnPrimary} mt-2`}>
                      {signupLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                      {signupLoading ? 'Creating account...' : 'Create Account'}
                    </button>
                  </form>

                  <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
                    Already have an account?{' '}
                    <button
                      onClick={() => { setTab('login'); setSignupError(''); }}
                      className="font-semibold text-green-600 dark:text-orange-400 hover:underline"
                    >
                      Sign in
                    </button>
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
