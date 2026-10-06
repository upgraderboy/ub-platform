'use client';

import React, { useState } from 'react';
import { Copy, Check, Share2 } from 'lucide-react';

interface BlogShareWidgetProps {
  title: string;
  url?: string;
}

export function BlogShareWidget({ title }: BlogShareWidgetProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareX = () => {
    if (typeof window !== 'undefined') {
      const shareUrl = encodeURIComponent(window.location.href);
      const shareText = encodeURIComponent(`"${title}" by @upgraderboy`);
      window.open(`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`, '_blank');
    }
  };

  const handleShareLinkedIn = () => {
    if (typeof window !== 'undefined') {
      const shareUrl = encodeURIComponent(window.location.href);
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`, '_blank');
    }
  };

  const handleShareWhatsApp = () => {
    if (typeof window !== 'undefined') {
      const shareUrl = encodeURIComponent(window.location.href);
      const shareText = encodeURIComponent(`Check out this engineering guide: ${title} - `);
      window.open(`https://api.whatsapp.com/send?text=${shareText}${shareUrl}`, '_blank');
    }
  };

  return (
    <div className="p-4 rounded-2xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
      <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        <Share2 className="w-3.5 h-3.5 text-[var(--accent-color)]" />
        <span>Share Article</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleCopyLink}
          className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[var(--accent-color)] text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-2xs"
          title="Copy Link to Clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[var(--accent-color)]" />
              <span className="text-[var(--accent-color)]">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy Link</span>
            </>
          )}
        </button>

        <button
          onClick={handleShareWhatsApp}
          className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
          title="Share to WhatsApp"
        >
          <span>WhatsApp</span>
        </button>

        <button
          onClick={handleShareLinkedIn}
          className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
          title="Share to LinkedIn"
        >
          <span>LinkedIn</span>
        </button>

        <button
          onClick={handleShareX}
          className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-600 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
          title="Share to X / Twitter"
        >
          <span>X / Post</span>
        </button>
      </div>
    </div>
  );
}
