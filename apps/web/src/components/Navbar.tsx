'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { Moon, Sun, Menu, X, ArrowRight, Terminal, Search } from 'lucide-react';

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

function applyAccent(color: string, glow: string, border: string) {
  if (typeof document === 'undefined') return;
  document.documentElement.style.setProperty('--accent-color', color);
  document.documentElement.style.setProperty('--accent-glow', glow);
  document.documentElement.style.setProperty('--accent-border', border);
  localStorage.setItem('ub-accent-color', color);
  localStorage.setItem('ub-accent-glow', glow);
  localStorage.setItem('ub-accent-border', border);
}

function subscribeTheme(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getThemeSnapshot(): string {
  return localStorage.getItem('ub-theme-mode') ?? 'dark';
}

function getServerThemeSnapshot(): string {
  return 'dark';
}

export function Navbar() {
  const currentTheme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerThemeSnapshot);
  const isDark = currentTheme === 'dark';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      applyAccent(savedColor, savedGlow, savedBorder);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = isDark ? 'light' : 'dark';
    localStorage.setItem('ub-theme-mode', nextTheme);
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/85 dark:bg-[#0B0F19]/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="#home" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-[var(--accent-color)] font-mono font-bold text-lg group-hover:border-[var(--accent-color)] group-hover:scale-105 transition-all shadow-sm">
            &lt;UB&gt;
          </div>
          <div>
            <span className="text-xl font-heading font-black tracking-wider bg-gradient-to-r from-slate-900 via-slate-700 to-[var(--accent-color)] dark:from-white dark:via-slate-200 dark:to-[var(--accent-color)] bg-clip-text text-transparent">
              UPGRADER BOY
            </span>
            <span className="block text-xs font-mono text-slate-500 dark:text-slate-400">by Ankit Bhuria</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6 font-medium text-sm text-slate-600 dark:text-slate-300">
          <Link href="/" className="hover:text-[var(--accent-color)] transition-colors">Home</Link>
          <Link href="/services" className="hover:text-[var(--accent-color)] transition-colors">Services</Link>
          <Link href="/projects" className="hover:text-[var(--accent-color)] transition-colors">Projects</Link>
          <Link href="/blogs" className="hover:text-[var(--accent-color)] transition-colors">Blogs</Link>
          <Link href="/resources" className="hover:text-[var(--accent-color)] transition-colors">Resources</Link>
          <Link href="/memories" className="hover:text-[var(--accent-color)] transition-colors">Memories</Link>
          <Link href="/#terminal" className="hover:text-[var(--accent-color)] transition-colors font-mono flex items-center space-x-1">
            <Terminal className="w-3.5 h-3.5 text-[var(--accent-color)] inline" />
            <span>Terminal</span>
          </Link>
          <Link href="/contact" className="hover:text-[var(--accent-color)] transition-colors">Contact</Link>
        </nav>

        {/* Controls: Theme Color Presets + Light/Dark Toggle + CTA */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          
          {/* Accent Color Palette */}
          <div className="hidden sm:flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-1.5 rounded-full shadow-inner">
            {ACCENT_PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyAccent(preset.color, preset.glow, preset.border)}
                style={{ backgroundColor: preset.color }}
                className="w-5 h-5 rounded-full transition-transform hover:scale-125 focus:ring-2 focus:ring-offset-1 focus:ring-slate-400"
                title={preset.name}
                aria-label={`Switch to ${preset.name} theme`}
              />
            ))}
          </div>

          {/* Command Palette Trigger Button */}
          <button
            id="cmdk-trigger"
            onClick={() => {
              window.dispatchEvent(new CustomEvent('open-cmdk'));
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 hover:border-[var(--accent-color)] hover:text-slate-800 dark:hover:text-white transition-all shadow-sm cursor-pointer"
            title="Search & Commands (⌘K)"
            aria-label="Open command palette"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-mono text-[10px] font-bold bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded text-slate-600 dark:text-slate-300">⌘K</span>
            <span className="hidden xl:inline">Search</span>
          </button>

          {/* Light / Dark Mode Toggle Button */}
          <button
            id="theme-toggle"
            onClick={toggleTheme}
            className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-amber-400 hover:border-[var(--accent-color)] transition-all shadow-sm"
            title="Toggle Light / Dark Mode"
            aria-label="Toggle theme mode"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-700" />
            )}
          </button>

          {/* CTA Button */}
          <Link
            href="#contact"
            className="hidden lg:inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[var(--accent-color)] text-slate-900 font-bold text-xs glow-btn"
          >
            <span>Let&apos;s Talk</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-700 dark:text-slate-300 hover:text-[var(--accent-color)] p-2"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-[#0B0F19] border-b border-slate-200 dark:border-slate-800 px-6 py-6 space-y-4 shadow-xl">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              window.dispatchEvent(new CustomEvent('open-cmdk'));
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs border border-slate-200 dark:border-slate-700"
          >
            <span className="flex items-center space-x-2">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search & Command Palette</span>
            </span>
            <span className="font-mono text-[10px] font-bold bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">⌘K</span>
          </button>

          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block text-slate-700 dark:text-slate-300 hover:text-[var(--accent-color)] font-medium">Home</Link>
          <Link href="/services" onClick={() => setMobileMenuOpen(false)} className="block text-slate-700 dark:text-slate-300 hover:text-[var(--accent-color)] font-medium">Services</Link>
          <Link href="/projects" onClick={() => setMobileMenuOpen(false)} className="block text-slate-700 dark:text-slate-300 hover:text-[var(--accent-color)] font-medium">Projects</Link>
          <Link href="/blogs" onClick={() => setMobileMenuOpen(false)} className="block text-slate-700 dark:text-slate-300 hover:text-[var(--accent-color)] font-medium">Blogs</Link>
          <Link href="/resources" onClick={() => setMobileMenuOpen(false)} className="block text-slate-700 dark:text-slate-300 hover:text-[var(--accent-color)] font-medium">Resources</Link>
          <Link href="/memories" onClick={() => setMobileMenuOpen(false)} className="block text-slate-700 dark:text-slate-300 hover:text-[var(--accent-color)] font-medium">Memories</Link>
          <Link href="/#terminal" onClick={() => setMobileMenuOpen(false)} className="block text-slate-700 dark:text-slate-300 hover:text-[var(--accent-color)] font-mono font-medium">Terminal</Link>
          <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block text-slate-700 dark:text-slate-300 hover:text-[var(--accent-color)] font-medium">Contact</Link>
          
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Accent Theme:</span>
            <div className="flex items-center space-x-2.5">
              {ACCENT_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyAccent(preset.color, preset.glow, preset.border)}
                  style={{ backgroundColor: preset.color }}
                  className="w-6 h-6 rounded-full"
                  aria-label={preset.name}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
