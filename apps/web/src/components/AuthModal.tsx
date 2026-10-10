'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { getSupabaseBrowserClient } from '@ub/api';

function createTempUserId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `usr-${crypto.randomUUID()}`;
  }
  return `usr-local-${Math.floor(Math.random() * 1000000)}`;
}

export function AuthModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  
  // Form states
  const [identifier, setIdentifier] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Global event listener to open auth modal from anywhere (Navbar, bookmarks, etc.)
  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ mode?: 'signin' | 'signup' }>;
      if (customEvent.detail?.mode) {
        setMode(customEvent.detail.mode);
      }
      setIsOpen(true);
      setErrorMessage('');
      setSuccessMessage('');
    };

    window.addEventListener('open-auth-modal', handleOpen);
    return () => window.removeEventListener('open-auth-modal', handleOpen);
  }, []);

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        // Local simulation if keys are pending in development
        const mockUser = {
          id: 'user-google-1',
          email: 'developer@gmail.com',
          fullName: 'Community Developer',
          username: 'dev_user',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
          role: 'user',
        };
        localStorage.setItem('ub_user_session', JSON.stringify(mockUser));
        window.dispatchEvent(new CustomEvent('auth-state-changed', { detail: mockUser }));
        setSuccessMessage('Signed in successfully with Google!');
        setTimeout(() => setIsOpen(false), 800);
        return;
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.href,
        },
      });

      if (error) throw error;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google authentication failed';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const supabase = getSupabaseBrowserClient();

      if (mode === 'signin') {
        if (!identifier.trim() || !password.trim()) {
          throw new Error('Please enter your email, username or phone, and your password.');
        }

        if (supabase) {
          // Resolve identifier (if username, map to email)
          const isEmail = identifier.includes('@');
          let emailToUse = identifier;

          if (!isEmail) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('email')
              .or(`username.eq.${identifier},phone.eq.${identifier}`)
              .single();

            if (profile?.email) {
              emailToUse = profile.email;
            }
          }

          const { data, error } = await supabase.auth.signInWithPassword({
            email: emailToUse,
            password,
          });

          if (error) throw error;

          const userPayload = {
            id: data.user.id,
            email: data.user.email,
            username: data.user.user_metadata?.username || identifier,
            fullName: data.user.user_metadata?.full_name || 'Community Member',
            role: 'user',
          };
          localStorage.setItem('ub_user_session', JSON.stringify(userPayload));
          window.dispatchEvent(new CustomEvent('auth-state-changed', { detail: userPayload }));
        } else {
          // Local fallback in dev mode
          const mockUser = {
            id: createTempUserId(),
            email: identifier.includes('@') ? identifier : `${identifier}@community.ub`,
            username: identifier,
            fullName: identifier,
            role: 'user',
          };
          localStorage.setItem('ub_user_session', JSON.stringify(mockUser));
          window.dispatchEvent(new CustomEvent('auth-state-changed', { detail: mockUser }));
        }

        setSuccessMessage('Signed in successfully!');
        setTimeout(() => setIsOpen(false), 700);
      } else {
        // Sign Up
        if (!emailValid(identifier) && !identifier.includes('@')) {
          throw new Error('Please provide a valid email address.');
        }

        if (supabase) {
          const { data, error } = await supabase.auth.signUp({
            email: identifier,
            password,
            options: {
              data: {
                username,
                full_name: fullName,
                phone,
              },
            },
          });

          if (error) throw error;

          const userPayload = {
            id: data.user?.id || createTempUserId(),
            email: identifier,
            username,
            fullName,
            role: 'user',
          };
          localStorage.setItem('ub_user_session', JSON.stringify(userPayload));
          window.dispatchEvent(new CustomEvent('auth-state-changed', { detail: userPayload }));
        } else {
          const mockUser = {
            id: createTempUserId(),
            email: identifier,
            username,
            fullName,
            role: 'user',
          };
          localStorage.setItem('ub_user_session', JSON.stringify(mockUser));
          window.dispatchEvent(new CustomEvent('auth-state-changed', { detail: mockUser }));
        }

        setSuccessMessage('Account created successfully! Welcome to UB Platform.');
        setTimeout(() => setIsOpen(false), 900);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const emailValid = (str: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        
        {/* Top Gradient Stripe */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[var(--accent-color)] via-blue-500 to-purple-500" />

        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-200 bg-slate-100 dark:bg-slate-800/80 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-mono text-[var(--accent-color)] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent-color)]" />
            <span>UB COMMUNITY AUTH</span>
          </div>
          <h3 className="text-2xl font-heading font-black text-slate-900 dark:text-white">
            {mode === 'signin' ? 'Welcome Back' : 'Create Your Account'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
            {mode === 'signin'
              ? 'Access saved DSA notes, track inquiries & bookmarks'
              : 'Join the Upgrader Boy developer ecosystem'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMessage('');
            }}
            className={`flex-1 py-2 text-xs font-mono rounded-xl font-bold transition-all ${
              mode === 'signin'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMessage('');
            }}
            className={`flex-1 py-2 text-xs font-mono rounded-xl font-bold transition-all ${
              mode === 'signup'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Status Alerts */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start space-x-2 text-xs text-rose-500 dark:text-rose-400">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start space-x-2 text-xs text-emerald-500 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Google 1-Click Button */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-xs sm:text-sm flex items-center justify-center space-x-2.5 transition-all shadow-sm hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
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
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase font-mono">
            <span className="bg-white dark:bg-slate-900 px-3 text-slate-400">
              or with credentials
            </span>
          </div>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Rahul Sharma"
                    required
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[var(--accent-color)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-1">
                  Username
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="coder_dev"
                    required
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[var(--accent-color)] font-mono"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-1">
              {mode === 'signin' ? 'Email, Username or Phone' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={mode === 'signin' ? 'username or email@domain.com' : 'you@example.com'}
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[var(--accent-color)] font-mono"
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-1">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[var(--accent-color)] font-mono"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[var(--accent-color)] font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-3 py-3 px-4 rounded-xl bg-[var(--accent-color)] text-slate-950 font-extrabold text-xs sm:text-sm flex items-center justify-center space-x-2 glow-btn transition-all disabled:opacity-50"
          >
            <span>{isLoading ? 'Processing...' : mode === 'signin' ? 'Sign In' : 'Create Free Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
