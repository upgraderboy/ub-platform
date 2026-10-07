'use client';

import React, { useState, useEffect } from 'react';
import { Type, Eye, EyeOff, BookOpen } from 'lucide-react';

interface BlogReaderToolbarProps {
  readingTimeMinutes: number;
}

export function BlogReaderToolbar({
  readingTimeMinutes,
}: BlogReaderToolbarProps) {
  const [fontSize, setFontSize] = useState<'normal' | 'comfortable' | 'large'>('comfortable');
  const [focusMode, setFocusMode] = useState(false);

  useEffect(() => {
    const article = document.querySelector('article');
    if (!article) return;

    article.classList.remove('text-sm', 'text-base', 'text-lg', 'text-xl');

    if (fontSize === 'normal') {
      article.classList.add('text-sm');
    } else if (fontSize === 'comfortable') {
      article.classList.add('text-base');
    } else {
      article.classList.add('text-lg');
    }
  }, [fontSize]);

  useEffect(() => {
    const sidebar = document.querySelector('aside');
    if (!sidebar) return;

    if (focusMode) {
      sidebar.classList.add('opacity-30', 'pointer-events-none', 'transition-opacity', 'duration-300');
    } else {
      sidebar.classList.remove('opacity-30', 'pointer-events-none');
    }
  }, [focusMode]);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 sm:p-3 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 text-xs font-mono shadow-2xs backdrop-blur-sm">
      {/* Left: Article Reading Diagnostics */}
      <div className="flex items-center space-x-2.5 text-slate-500 dark:text-slate-400">
        <span className="flex items-center space-x-1.5 text-slate-700 dark:text-slate-300 font-semibold">
          <BookOpen className="w-3.5 h-3.5 text-[var(--accent-color)]" />
          <span>Reader Controls</span>
        </span>
        <span className="text-slate-300 dark:text-slate-700">•</span>
        <span className="text-[11px] hidden sm:inline">
          {readingTimeMinutes} min estimated at 220 wpm
        </span>
      </div>

      {/* Right: Font Size & Focus Mode Toggles */}
      <div className="flex items-center space-x-2">
        {/* Font Size Pills */}
        <div className="flex items-center p-0.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <span className="pl-2 pr-1 text-slate-400 flex items-center">
            <Type className="w-3 h-3" />
          </span>
          <button
            onClick={() => setFontSize('normal')}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
              fontSize === 'normal'
                ? 'bg-[var(--accent-color)] text-slate-950 font-bold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Standard Font Size"
          >
            A-
          </button>
          <button
            onClick={() => setFontSize('comfortable')}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
              fontSize === 'comfortable'
                ? 'bg-[var(--accent-color)] text-slate-950 font-bold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Comfortable Font Size"
          >
            A
          </button>
          <button
            onClick={() => setFontSize('large')}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
              fontSize === 'large'
                ? 'bg-[var(--accent-color)] text-slate-950 font-bold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Large Font Size"
          >
            A+
          </button>
        </div>

        {/* Zen Focus Mode Button */}
        <button
          onClick={() => setFocusMode(!focusMode)}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
            focusMode
              ? 'bg-[var(--accent-color)] border-[var(--accent-color)] text-slate-950 shadow-xs'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400'
          }`}
          title="Toggle Zen Focus Mode"
        >
          {focusMode ? (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span>Zen Active</span>
            </>
          ) : (
            <>
              <EyeOff className="w-3.5 h-3.5 text-slate-400" />
              <span>Zen Mode</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
