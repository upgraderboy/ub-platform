import React from 'react';
import { GithubIcon, LinkedinIcon, YoutubeIcon } from './SocialIcons';

export function Footer() {
  return (
    <footer className="bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* Brand identity */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[var(--accent-color)] font-mono font-bold text-sm shadow-sm">
            &lt;UB&gt;
          </div>
          <span className="text-sm font-heading font-black tracking-wider text-slate-900 dark:text-white">
            UPGRADER BOY
          </span>
        </div>

        {/* Copyright notice */}
        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono text-center">
          © 2024–2026 Upgrader Boy (Led by Ankit Bhuria). All rights reserved. Jhunjhunu, Rajasthan.
        </p>

        {/* Social icons */}
        <div className="flex items-center space-x-4 text-slate-500 dark:text-slate-400">
          <a
            href="https://github.com/upgraderboy"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--accent-color)] transition-colors"
            aria-label="GitHub"
          >
            <GithubIcon className="w-5 h-5" />
          </a>
          <a
            href="https://linkedin.com/in/upgraderboy/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--accent-color)] transition-colors"
            aria-label="LinkedIn"
          >
            <LinkedinIcon className="w-5 h-5" />
          </a>
          <a
            href="https://youtube.com/@upgraderboy"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--accent-color)] transition-colors"
            aria-label="YouTube"
          >
            <YoutubeIcon className="w-5 h-5" />
          </a>
        </div>

      </div>
    </footer>
  );
}
