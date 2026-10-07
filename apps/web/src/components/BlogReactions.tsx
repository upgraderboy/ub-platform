'use client';

import React, { useState, useEffect } from 'react';
import { Flame, Lightbulb, Rocket, Brain, Share2, Check } from 'lucide-react';

interface BlogReactionsProps {
  slug: string;
  title: string;
}

interface ReactionState {
  fire: number;
  lightbulb: number;
  rocket: number;
  brain: number;
  userVoted: Record<string, boolean>;
}

const DEFAULT_REACTIONS: ReactionState = {
  fire: 42,
  lightbulb: 28,
  rocket: 35,
  brain: 19,
  userVoted: {},
};

export function BlogReactions({ slug, title }: BlogReactionsProps) {
  const [reactions, setReactions] = useState<ReactionState>(DEFAULT_REACTIONS);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`ub-reactions-${slug}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        setTimeout(() => {
          setReactions((prev) => ({
            ...prev,
            ...parsed,
          }));
        }, 0);
      }
    } catch {}
  }, [slug]);

  const handleVote = (type: 'fire' | 'lightbulb' | 'rocket' | 'brain') => {
    setReactions((prev) => {
      const alreadyVoted = !!prev.userVoted[type];
      const nextCount = alreadyVoted ? prev[type] - 1 : prev[type] + 1;
      const nextVoted = { ...prev.userVoted, [type]: !alreadyVoted };

      const updated = {
        ...prev,
        [type]: Math.max(0, nextCount),
        userVoted: nextVoted,
      };

      try {
        localStorage.setItem(`ub-reactions-${slug}`, JSON.stringify(updated));
      } catch {}

      return updated;
    });
  };

  const handleShare = async () => {
    if (typeof window !== 'undefined') {
      if (navigator.share) {
        try {
          await navigator.share({
            title: title,
            url: window.location.href,
          });
          return;
        } catch {}
      }
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const reactionButtons = [
    {
      id: 'fire' as const,
      icon: Flame,
      label: 'Insightful',
      count: reactions.fire,
      color: 'hover:text-amber-500 hover:border-amber-500/50 hover:bg-amber-500/10',
      activeColor: 'text-amber-500 border-amber-500 bg-amber-500/15 font-bold',
    },
    {
      id: 'lightbulb' as const,
      icon: Lightbulb,
      label: 'Brilliant',
      count: reactions.lightbulb,
      color: 'hover:text-yellow-400 hover:border-yellow-400/50 hover:bg-yellow-400/10',
      activeColor: 'text-yellow-400 border-yellow-400 bg-yellow-400/15 font-bold',
    },
    {
      id: 'rocket' as const,
      icon: Rocket,
      label: 'Production Ready',
      count: reactions.rocket,
      color: 'hover:text-[var(--accent-color)] hover:border-[var(--accent-color)]/50 hover:bg-[var(--accent-glow)]',
      activeColor: 'text-[var(--accent-color)] border-[var(--accent-color)] bg-[var(--accent-glow)] font-bold',
    },
    {
      id: 'brain' as const,
      icon: Brain,
      label: 'Deep Tech',
      count: reactions.brain,
      color: 'hover:text-purple-400 hover:border-purple-400/50 hover:bg-purple-400/10',
      activeColor: 'text-purple-400 border-purple-400 bg-purple-400/15 font-bold',
    },
  ];

  return (
    <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            Reader Feedback & Reactions
          </span>
        </div>
        <button
          onClick={handleShare}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[var(--accent-color)]" />
              <span className="text-[var(--accent-color)]">Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {reactionButtons.map((btn) => {
          const Icon = btn.icon;
          const isActive = !!reactions.userVoted[btn.id];

          return (
            <button
              key={btn.id}
              onClick={() => handleVote(btn.id)}
              className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-2xl border transition-all duration-200 cursor-pointer text-xs ${
                isActive
                  ? btn.activeColor
                  : `border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 ${btn.color}`
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'scale-110' : ''}`} />
              <span className="font-semibold">{btn.label}</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                {btn.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
