'use client';

import React, { useEffect, useState, useRef } from 'react';
import { ArrowUp } from 'lucide-react';

interface BlogReadingProgressBarProps {
  totalMinutes?: number;
}

export function BlogReadingProgressBar({ totalMinutes = 7 }: BlogReadingProgressBarProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const [hudProgress, setHudProgress] = useState(0);
  const [showHud, setShowHud] = useState(false);

  useEffect(() => {
    // Check if browser natively supports compositor-driven scroll animations
    const supportsScrollTimeline =
      typeof CSS !== 'undefined' &&
      typeof CSS.supports === 'function' &&
      CSS.supports('animation-timeline', 'scroll()');

    function calculateProgress(): number {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return 0;
      const scrolled = window.scrollY || document.documentElement.scrollTop;
      return Math.min(1, Math.max(0, scrolled / scrollable));
    }

    // Direct scroll sync handler (Continuous, 0ms lag, no waiting for scroll end)
    function handleScroll() {
      const progress = calculateProgress();
      const percent = Math.round(progress * 100);

      // If browser doesn't have native CSS scroll-timeline, update GPU transform directly
      if (!supportsScrollTimeline && barRef.current) {
        barRef.current.style.transform = `scaleX(${progress})`;
      }

      // Update HUD percentage
      setHudProgress(percent);
      setShowHud(window.scrollY > 250);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const minutesLeft = Math.max(
    1,
    Math.ceil((1 - hudProgress / 100) * totalMinutes)
  );

  return (
    <>
      {/* 
        1. Continuous Real-Time Laser Reading Progress Bar
        Docked DIRECTLY BELOW the sticky navbar (top-16 on mobile = 64px, top-[72px] on sm/desktop).
        Uses native CSS scroll-driven animation (runs directly on browser compositor thread at 120 FPS).
        Continuous tracking with ZERO waiting for scroll stop!
      */}
      <div
        className="fixed top-16 sm:top-[72px] left-0 right-0 h-[3px] z-50 bg-slate-200/20 dark:bg-slate-800/30 pointer-events-none"
        aria-hidden="true"
      >
        {/* GPU Compositor-Driven Laser Bar */}
        <div
          ref={barRef}
          className="scroll-driven-bar h-full w-full relative bg-gradient-to-r from-[var(--accent-color)]/70 via-[var(--accent-color)] to-[var(--accent-color)] shadow-[0_0_12px_var(--accent-color),_0_0_20px_var(--accent-color)]"
        >
          {/* Laser Tip Sparkle Dot (Tracks tip without layout reflows) */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_var(--accent-color)] ring-2 ring-[var(--accent-color)]" />
        </div>
      </div>

      {/* 2. Floating Companion HUD (Circular Progress + Remaining Minutes + Scroll-To-Top) */}
      {showHud && (
        <aside
          aria-label="Reading progress HUD"
          className="fixed bottom-6 right-6 z-40 hidden sm:flex items-center space-x-3 p-2 pr-4 rounded-full bg-white/95 dark:bg-[#131C31]/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl animate-fade-in text-xs font-mono"
        >
          {/* Circular SVG Progress Ring */}
          <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-200 dark:text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[var(--accent-color)] transition-all duration-75"
                strokeDasharray={`${hudProgress}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-[9px] font-bold text-slate-800 dark:text-slate-200">
              {hudProgress}%
            </span>
          </div>

          {/* Reading Time Remaining */}
          <div className="flex flex-col text-[11px] leading-tight">
            <span className="font-bold text-slate-900 dark:text-white">
              {hudProgress >= 96 ? 'Completed 🎉' : `~${minutesLeft}m remaining`}
            </span>
            <span className="text-[9px] text-slate-400">
              {hudProgress >= 96 ? 'Thanks for reading' : 'Live read sync'}
            </span>
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />

          {/* Smooth Back to Top Button */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-[var(--accent-color)] transition-colors cursor-pointer"
            title="Scroll to Top"
            aria-label="Back to Top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </aside>
      )}
    </>
  );
}
