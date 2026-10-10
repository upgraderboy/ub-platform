'use client';

import React, { useState, useEffect, useSyncExternalStore, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Moon, Sun, Menu, X, ArrowRight, Terminal, Search, Palette, Check, Sparkles, User, LogOut, Bookmark, ShieldCheck, Briefcase, Code2 } from 'lucide-react';
import { useExperienceMode } from '@/hooks/useExperienceMode';

interface AccentTheme {
  name: string;
  color: string;
  glow: string;
  border: string;
}

const ACCENT_PRESETS: AccentTheme[] = [
  { name: 'Neon Green', color: '#00FF1E', glow: 'rgba(0, 255, 30, 0.25)', border: 'rgba(0, 255, 30, 0.4)' },
  { name: 'Cyan Blue', color: '#00D2FF', glow: 'rgba(0, 210, 255, 0.25)', border: 'rgba(0, 210, 255, 0.4)' },
  { name: 'Electric Purple', color: '#BD5FFF', glow: 'rgba(189, 95, 255, 0.25)', border: 'rgba(189, 95, 255, 0.4)' },
  { name: 'Rose Pink', color: '#FF3366', glow: 'rgba(255, 51, 102, 0.25)', border: 'rgba(255, 51, 102, 0.4)' },
  { name: 'Amber Orange', color: '#FF9900', glow: 'rgba(255, 153, 0, 0.25)', border: 'rgba(255, 153, 0, 0.4)' },
];

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/projects', label: 'Projects' },
  { href: '/blogs', label: 'Blogs' },
  { href: '/resources', label: 'Resources' },
  { href: '/memories', label: 'Memories' },
];

function subscribeStorage(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getThemeSnapshot(): string {
  return localStorage.getItem('ub-theme-mode') ?? 'dark';
}

function getServerThemeSnapshot(): string {
  return 'dark';
}

function getAccentSnapshot(): string {
  return localStorage.getItem('ub-accent-color') ?? '#00FF1E';
}

function getServerAccentSnapshot(): string {
  return '#00FF1E';
}

function applyAccent(color: string, glow: string, border: string) {
  if (typeof document === 'undefined') return;
  document.documentElement.style.setProperty('--accent-color', color);
  document.documentElement.style.setProperty('--accent-glow', glow);
  document.documentElement.style.setProperty('--accent-border', border);
  localStorage.setItem('ub-accent-color', color);
  localStorage.setItem('ub-accent-glow', glow);
  localStorage.setItem('ub-accent-border', border);
  window.dispatchEvent(new Event('storage'));
}

interface CurrentUserData {
  email?: string;
  username?: string;
  fullName?: string;
}

function subscribeAuth(callback: () => void) {
  window.addEventListener('auth-state-changed', callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener('auth-state-changed', callback);
    window.removeEventListener('storage', callback);
  };
}

let cachedUserSnapshotRaw: string | null = null;
let cachedUserData: CurrentUserData | null = null;

function getUserSnapshot(): CurrentUserData | null {
  try {
    const raw = localStorage.getItem('ub_user_session');
    if (raw === cachedUserSnapshotRaw) {
      return cachedUserData;
    }
    cachedUserSnapshotRaw = raw;
    cachedUserData = raw ? JSON.parse(raw) : null;
    return cachedUserData;
  } catch {
    return null;
  }
}

function getServerUserSnapshot(): CurrentUserData | null {
  return null;
}

export function Navbar() {
  const pathname = usePathname();
  const currentTheme = useSyncExternalStore(subscribeStorage, getThemeSnapshot, getServerThemeSnapshot);
  const activeColor = useSyncExternalStore(subscribeStorage, getAccentSnapshot, getServerAccentSnapshot);
  const currentUser = useSyncExternalStore(subscribeAuth, getUserSnapshot, getServerUserSnapshot);
  const { mode: experienceMode, setExperienceMode } = useExperienceMode();
  const isDark = currentTheme === 'dark';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [paletteMenuOpen, setPaletteMenuOpen] = useState(false);
  const paletteRef = useRef<HTMLDivElement>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    const savedColor = localStorage.getItem('ub-accent-color');
    const savedGlow = localStorage.getItem('ub-accent-glow');
    const savedBorder = localStorage.getItem('ub-accent-border');
    if (savedColor && savedGlow && savedBorder) {
      document.documentElement.style.setProperty('--accent-color', savedColor);
      document.documentElement.style.setProperty('--accent-glow', savedGlow);
      document.documentElement.style.setProperty('--accent-border', savedBorder);
    }
  }, []);

  // Close palette menu on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (paletteRef.current && !paletteRef.current.contains(e.target as Node)) {
        setPaletteMenuOpen(false);
      }
    }
    if (paletteMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [paletteMenuOpen]);

  // Close user menu on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [userMenuOpen]);

  const toggleTheme = () => {
    const nextTheme = isDark ? 'light' : 'dark';
    localStorage.setItem('ub-theme-mode', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    window.dispatchEvent(new Event('storage'));
  };

  const handleSelectAccent = (preset: AccentTheme) => {
    applyAccent(preset.color, preset.glow, preset.border);
    setPaletteMenuOpen(false);
  };

  const handleSignOut = () => {
    localStorage.removeItem('ub_user_session');
    setUserMenuOpen(false);
    window.dispatchEvent(new CustomEvent('auth-state-changed', { detail: null }));
    window.dispatchEvent(new Event('storage'));
  };

  const openAuthModal = (mode: 'signin' | 'signup') => {
    window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode } }));
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-xl border-b border-slate-200/70 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Brand Identity */}
        <Link href="/" className="flex items-center space-x-2.5 sm:space-x-3 group shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-300/80 dark:border-slate-700/80 flex items-center justify-center text-[var(--accent-color)] font-mono font-black text-xs sm:text-sm group-hover:border-[var(--accent-color)] group-hover:scale-105 transition-all shadow-2xs">
            &lt;UB&gt;
          </div>
          <div className="flex flex-col">
            <span className="text-sm sm:text-base lg:text-lg font-heading font-black tracking-wider bg-gradient-to-r from-slate-900 via-slate-700 to-[var(--accent-color)] dark:from-white dark:via-slate-200 dark:to-[var(--accent-color)] bg-clip-text text-transparent leading-none">
              UPGRADER BOY
            </span>
            <span className="hidden sm:inline-block text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-0.5 tracking-tight">
              Ankit Bhuria
            </span>
          </div>
        </Link>

        {/* Center: Clean Floating Island Capsule for Core Routes (Desktop) */}
        <nav className="hidden lg:flex items-center p-1 rounded-full bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/90 shadow-2xs backdrop-blur-md">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-white dark:bg-slate-800 text-[var(--accent-color)] shadow-xs border border-slate-200/60 dark:border-slate-700/60'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/40 dark:hover:bg-slate-800/40'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/#terminal"
            className="px-2.5 py-1.5 rounded-full text-xs font-mono font-medium text-slate-500 dark:text-slate-400 hover:text-[var(--accent-color)] transition-colors flex items-center space-x-1"
            title="Interactive Terminal"
          >
            <Terminal className="w-3 h-3 text-[var(--accent-color)]" />
            <span className="hidden xl:inline">CLI</span>
          </Link>
        </nav>

        {/* Right: Sleek Minimalist Controls Dock */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          
          {/* Compact ⌘K Shortcut Button (Requested: Button with shortcut cmd logo + k) */}
          <button
            id="cmdk-trigger"
            onClick={() => {
              window.dispatchEvent(new CustomEvent('open-cmdk'));
            }}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:border-[var(--accent-color)] hover:text-slate-900 dark:hover:text-white transition-all shadow-2xs cursor-pointer group"
            title="Command Palette (⌘K)"
            aria-label="Open Command Palette"
          >
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-[var(--accent-color)] transition-colors" />
            <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-white dark:bg-slate-700/90 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 shadow-2xs">
              ⌘K
            </span>
          </button>

          {/* Experience Mode Switcher: Client View vs Developer View */}
          <div className="hidden sm:flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-2xs">
            <button
              onClick={() => setExperienceMode('client')}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                experienceMode === 'client'
                  ? 'bg-white dark:bg-[#171F38] text-[var(--accent-color)] shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Client View: Clean, welcoming agency portfolio"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Client</span>
            </button>
            <button
              onClick={() => setExperienceMode('developer')}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                experienceMode === 'developer'
                  ? 'bg-white dark:bg-slate-900 text-[var(--accent-color)] shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Developer View: Interactive terminal & cyber telemetry"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Dev</span>
            </button>
          </div>

          {/* Single Elegant Color Palette Dropdown Button (Hidden on tiny <640px screens where it lives in drawer) */}
          <div className="relative hidden sm:block" ref={paletteRef}>
            <button
              onClick={() => setPaletteMenuOpen(!paletteMenuOpen)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:border-[var(--accent-color)] transition-all shadow-2xs cursor-pointer relative"
              title="Change Theme Accent Color"
              aria-label="Theme Color Palette"
            >
              <Palette className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              {/* Active Color Dot Indicator */}
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full ring-1 ring-white dark:ring-slate-900 shadow-xs"
                style={{ backgroundColor: activeColor }}
              />
            </button>

            {paletteMenuOpen && (
              <div className="absolute right-0 mt-2 z-50 p-2 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 shadow-2xl space-y-1 w-44 animate-scale-up">
                <div className="flex items-center justify-between px-2 py-1 border-b border-slate-100 dark:border-slate-800/60 pb-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Accent Theme
                  </span>
                  <Sparkles className="w-3 h-3 text-[var(--accent-color)]" />
                </div>
                {ACCENT_PRESETS.map((preset) => {
                  const isSelected = activeColor === preset.color;
                  return (
                    <button
                      key={preset.name}
                      onClick={() => handleSelectAccent(preset)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span
                          className="w-3 h-3 rounded-full shadow-2xs"
                          style={{ backgroundColor: preset.color }}
                        />
                        <span>{preset.name}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[var(--accent-color)]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Light / Dark Mode Toggle Button */}
          <button
            id="theme-toggle"
            onClick={toggleTheme}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 flex items-center justify-center text-slate-700 dark:text-amber-400 hover:border-[var(--accent-color)] transition-all shadow-2xs cursor-pointer"
            title="Toggle Light / Dark Mode"
            aria-label="Toggle theme mode"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* User Account / Profile Button */}
          <div className="relative" ref={userMenuRef}>
            {currentUser ? (
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 hover:border-[var(--accent-color)] text-slate-800 dark:text-slate-200 transition-all cursor-pointer"
                aria-label="User account menu"
              >
                <div className="w-5 h-5 rounded-full bg-[var(--accent-color)]/20 border border-[var(--accent-color)]/40 text-[var(--accent-color)] flex items-center justify-center text-[10px] font-bold">
                  {(currentUser.fullName || currentUser.username || 'U').charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:inline text-xs font-semibold max-w-[80px] truncate">
                  {currentUser.username || currentUser.fullName?.split(' ')[0] || 'Account'}
                </span>
              </button>
            ) : (
              <button
                onClick={() => openAuthModal('signin')}
                className="flex items-center space-x-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 hover:border-[var(--accent-color)] text-slate-700 dark:text-slate-300 hover:text-[var(--accent-color)] transition-all text-xs font-semibold cursor-pointer"
                aria-label="Sign In"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Sign In</span>
              </button>
            )}

            {/* User Dropdown Menu */}
            {userMenuOpen && currentUser && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 animate-slide-down">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800/80">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {currentUser.fullName || 'Community Member'}
                  </p>
                  <p className="text-[11px] font-mono text-slate-500 truncate">
                    {currentUser.email || `@${currentUser.username}`}
                  </p>
                  {currentUser.email?.includes('upgraderboy') && (
                    <span className="inline-flex items-center space-x-1 mt-1 text-[10px] font-mono font-bold text-[var(--accent-color)] bg-[var(--accent-color)]/10 px-1.5 py-0.5 rounded-md">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Admin Account</span>
                    </span>
                  )}
                </div>

                <div className="py-1">
                  <Link
                    href="/resources"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                    <span>Saved Resources</span>
                  </Link>
                  <a
                    href="http://localhost:3001"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                    <span>Admin Mission Control</span>
                  </a>
                </div>

                <div className="pt-1 border-t border-slate-100 dark:border-slate-800/80">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Desktop CTA Button */}
          <Link
            href="/contact"
            className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-[var(--accent-color)] text-slate-950 font-bold text-xs glow-btn shrink-0 hover:scale-[1.02] transition-transform"
          >
            <span>Let&apos;s Talk</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {/* Mobile Drawer Menu Toggle (Clean and spacious on small screens) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-[var(--accent-color)] cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu (Slides down when hamburger is tapped) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-2xl border-b border-slate-200 dark:border-slate-800 px-5 py-5 space-y-4 shadow-2xl animate-slide-down">
          
          {/* Mobile User Profile / Auth State Card */}
          <div className="p-3 rounded-2xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between">
            {currentUser ? (
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-[var(--accent-color)]/20 border border-[var(--accent-color)]/40 text-[var(--accent-color)] flex items-center justify-center text-xs font-bold">
                  {(currentUser.fullName || currentUser.username || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {currentUser.fullName || currentUser.username}
                  </p>
                  <p className="text-[10px] font-mono text-slate-500 truncate">
                    {currentUser.email || `@${currentUser.username}`}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Community Access</p>
                  <p className="text-[10px] text-slate-500">Sign in for bookmarks & notes</p>
                </div>
              </div>
            )}

            {currentUser ? (
              <button
                onClick={handleSignOut}
                className="px-2.5 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-semibold border border-rose-200 dark:border-rose-900/40"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('signin');
                }}
                className="px-3 py-1.5 rounded-xl bg-[var(--accent-color)] text-slate-950 text-xs font-extrabold shadow-sm"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Experience Switcher Pill */}
          <div className="p-2.5 rounded-2xl bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
              <span>View Mode:</span>
            </span>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setExperienceMode('client')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  experienceMode === 'client'
                    ? 'bg-[var(--accent-color)] text-slate-950 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                💼 Client
              </button>
              <button
                onClick={() => setExperienceMode('developer')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  experienceMode === 'developer'
                    ? 'bg-[var(--accent-color)] text-slate-950 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                ⚡ Dev
              </button>
            </div>
          </div>

          {/* Mobile Command Palette Trigger Button */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              window.dispatchEvent(new CustomEvent('open-cmdk'));
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-medium text-xs border border-slate-200 dark:border-slate-700"
          >
            <span className="flex items-center space-x-2">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search or Commands...</span>
            </span>
            <span className="font-mono text-[10px] font-bold bg-white dark:bg-slate-700 px-2 py-0.5 rounded-md text-slate-700 dark:text-slate-200 shadow-2xs">
              ⌘K
            </span>
          </button>

          {/* Navigation Links Grid/List */}
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-800 text-[var(--accent-color)] border border-slate-200/80 dark:border-slate-700'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/#terminal"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-xs font-mono font-medium text-slate-600 dark:text-slate-400 hover:text-[var(--accent-color)] flex items-center space-x-1.5"
            >
              <Terminal className="w-3.5 h-3.5 text-[var(--accent-color)]" />
              <span>Terminal CLI</span>
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-xs font-bold text-[var(--accent-color)] hover:underline flex items-center space-x-1"
            >
              <span>Let&apos;s Talk</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          
          {/* Mobile Color Palette Full Selector */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono block">
              Theme Accent Color:
            </span>
            <div className="flex items-center justify-between gap-2">
              {ACCENT_PRESETS.map((preset) => {
                const isSelected = activeColor === preset.color;
                return (
                  <button
                    key={preset.name}
                    onClick={() => handleSelectAccent(preset)}
                    className={`flex-1 py-1.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                      isSelected
                        ? 'border-[var(--accent-color)] bg-slate-100 dark:bg-slate-800/80 scale-105'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                    title={preset.name}
                  >
                    <span
                      className="w-4 h-4 rounded-full shadow-2xs"
                      style={{ backgroundColor: preset.color }}
                    />
                    <span className="text-[9px] font-mono font-medium text-slate-600 dark:text-slate-400 truncate max-w-[50px]">
                      {preset.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
