'use client';

import React, { useEffect, useState } from 'react';
import { ListCollapse, ChevronRight } from 'lucide-react';

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface BlogTableOfContentsProps {
  items: TocItem[];
}

export function BlogTableOfContents({ items }: BlogTableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (items.length === 0) return;

    const handleScroll = () => {
      const headingElements = items
        .map((item) => document.getElementById(item.id))
        .filter((el): el is HTMLElement => el !== null);

      const scrollPosition = window.scrollY + 180;

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const el = headingElements[i];
        if (el.offsetTop <= scrollPosition) {
          setActiveId(items[i].id);
          return;
        }
      }

      if (items.length > 0) {
        setActiveId(items[0].id);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [items]);

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="p-4 rounded-2xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
      <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        <ListCollapse className="w-3.5 h-3.5 text-[var(--accent-color)]" />
        <span>Table of Contents</span>
      </div>

      <nav className="space-y-1">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollToHeading(item.id)}
              className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                isActive
                  ? 'bg-white dark:bg-slate-800 text-[var(--accent-color)] font-bold shadow-2xs translate-x-1'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
              } ${item.level === 3 ? 'pl-5' : 'pl-2.5'}`}
            >
              <span className="truncate">{item.text}</span>
              {isActive && <ChevronRight className="w-3.5 h-3.5 shrink-0 text-[var(--accent-color)]" />}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
