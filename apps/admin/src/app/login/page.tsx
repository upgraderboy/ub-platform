'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Terminal,
} from 'lucide-react';
import { getSupabaseBrowserClient } from '@ub/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('upgraderboy');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        // Fallback for development before Supabase keys are configured in .env
        localStorage.setItem('ub_admin_session', JSON.stringify({
          user: { email: 'upgraderboy@gmail.com', role: 'admin' },
          timestamp: Date.now(),
        }));
        router.push('/dashboard');
        return;
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google authentication failed';
      setErrorMessage(msg);
      setIsLoading(false);
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setErrorMessage('Please enter both your admin identifier and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const supabase = getSupabaseBrowserClient();

      if (supabase) {
        // If user typed username 'upgraderboy', map to admin email or query profile
        const emailToUse = identifier.includes('@')
          ? identifier
          : `${identifier}@upgraderboy.com`;

        const { data, error } = await supabase.auth.signInWithPassword({
          email: emailToUse,
          password,
        });

        if (error) {
          throw error;
        }

        // Verify admin role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profile && profile.role !== 'admin') {
          await supabase.auth.signOut();
          throw new Error('Access Denied: Your account does not have administrator privileges.');
        }

        router.push('/dashboard');
      } else {
        // Local Dev Master Passkey Fallback when Supabase keys are pending
        if (password === 'admin' || password === 'upgraderboy' || password.length >= 6) {
          localStorage.setItem('ub_admin_session', JSON.stringify({
            user: { username: identifier, role: 'admin' },
            timestamp: Date.now(),
          }));
          router.push('/dashboard');
        } else {
          throw new Error('Invalid master credentials. In local dev mode, password must be at least 6 characters.');
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      setErrorMessage(msg);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070A11] flex flex-col justify-center items-center px-4 sm:px-6 relative overflow-hidden">
      {/* Background Cybernetic Glow Circles */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[var(--accent-color)]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Back to Public Web Link */}
      <div className="absolute top-6 left-6 z-20">
        <a
          href="https://upgraderboy.com"
          className="text-xs font-mono text-slate-400 hover:text-[var(--accent-color)] flex items-center space-x-1.5 transition-colors"
        >
          <span>← Back to upgraderboy.com</span>
        </a>
      </div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Terminal Header Bar Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-slate-900/90 border border-slate-700/80 px-4 py-1.5 rounded-full text-xs font-mono text-[var(--accent-color)] shadow-lg mb-4">
            <ShieldCheck className="w-4 h-4 text-[var(--accent-color)]" />
            <span>UB PLATFORM • CMS PORTAL</span>
          </div>
          <h1 className="text-3xl font-heading font-black text-white tracking-tight">
            Admin Mission Control
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-2">
            Authorised Administrator Access • Upgrader Boy Agency
          </p>
        </div>

        {/* Auth Glass Card */}
        <div className="bg-slate-900/80 backdrop-blur-2xl border-2 border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          
          {/* Subtle Accent Edge Glow */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--accent-color)] to-transparent" />

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start space-x-2.5 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1-Click Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs sm:text-sm flex items-center justify-center space-x-3 transition-all shadow-md hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign In with Google (Admin)</span>
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase font-mono">
              <span className="bg-slate-900 px-3 text-slate-500">or admin credentials</span>
            </div>
          </div>

          {/* Username / Password Form */}
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">
                Admin Username or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="upgraderboy"
                  required
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-600 text-xs sm:text-sm focus:outline-none focus:border-[var(--accent-color)] font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono text-slate-400">
                  Password
                </label>
                <span className="text-[10px] font-mono text-slate-500">Master Secret</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-600 text-xs sm:text-sm focus:outline-none focus:border-[var(--accent-color)] font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 px-4 rounded-xl bg-[var(--accent-color)] text-slate-950 font-extrabold text-xs sm:text-sm flex items-center justify-center space-x-2 glow-btn transition-all disabled:opacity-50"
            >
              <span>{isLoading ? 'Verifying Credentials...' : 'Access Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>

        {/* Footer Security Watermark */}
        <div className="text-center mt-6">
          <p className="text-[11px] font-mono text-slate-500 flex items-center justify-center space-x-1.5">
            <Terminal className="w-3.5 h-3.5 text-[var(--accent-color)]" />
            <span>Monorepo Decoupled Portal • 100% Blast Radius Isolated</span>
          </p>
        </div>

      </div>
    </div>
  );
}
