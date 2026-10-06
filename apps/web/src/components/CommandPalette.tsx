'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Laptop,
  BookOpen,
  FolderTree,
  Camera,
  Wrench,
  Mail,
  Sun,
  Terminal,
  ExternalLink,
  Sparkles,
  X,
} from 'lucide-react';

interface PaletteItem {
  id: string;
  category: 'Navigation' | 'Actions' | 'External' | 'Theme';
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  action: () => void;
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  const togglePalette = useCallback(() => {
    setIsOpen((prev) => !prev);
    setQuery('');
    setSelectedIndex(0);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        togglePalette();
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => {
      setIsOpen(true);
      setQuery('');
      setSelectedIndex(0);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-cmdk', handleCustomOpen);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-cmdk', handleCustomOpen);
    };
  }, [isOpen, togglePalette]);

  const items: PaletteItem[] = [
    // Navigation
    {
      id: 'nav-home',
      category: 'Navigation',
      title: 'Home & Brand Overview',
      subtitle: 'Hero, live counters, and tech stacks',
      icon: <Sparkles className="w-4 h-4 text-[var(--accent-color)]" />,
      action: () => { router.push('/'); setIsOpen(false); },
    },
    {
      id: 'nav-services',
      category: 'Navigation',
      title: 'Services & Project Estimator',
      subtitle: 'Full-stack apps, mobile solutions & budget calculator',
      icon: <Laptop className="w-4 h-4 text-[var(--accent-color)]" />,
      action: () => { router.push('/services'); setIsOpen(false); },
    },
    {
      id: 'nav-projects',
      category: 'Navigation',
      title: 'Projects & Case Studies',
      subtitle: 'Deep-dive architectural case studies',
      icon: <Laptop className="w-4 h-4 text-[var(--accent-color)]" />,
      action: () => { router.push('/projects'); setIsOpen(false); },
    },
    {
      id: 'nav-blogs',
      category: 'Navigation',
      title: 'Technical Blogs & Engineering Insights',
      subtitle: 'System design, MERN guides, and tutorials',
      icon: <BookOpen className="w-4 h-4 text-[var(--accent-color)]" />,
      action: () => { router.push('/blogs'); setIsOpen(false); },
    },
    {
      id: 'nav-resources',
      category: 'Navigation',
      title: 'Resource Library & Engineering Notes',
      subtitle: 'Curated DSA notes, DBMS, and college curriculum',
      icon: <FolderTree className="w-4 h-4 text-[var(--accent-color)]" />,
      action: () => { router.push('/resources'); setIsOpen(false); },
    },
    {
      id: 'nav-memories',
      category: 'Navigation',
      title: 'Visual Journey & Memories',
      subtitle: 'Smart India Hackathon, meetups & milestones',
      icon: <Camera className="w-4 h-4 text-[var(--accent-color)]" />,
      action: () => { router.push('/memories'); setIsOpen(false); },
    },
    {
      id: 'nav-tools',
      category: 'Navigation',
      title: 'Developer Micro-Tools Playground',
      subtitle: 'JSON to TS, glassmorphism generator & utilities',
      icon: <Wrench className="w-4 h-4 text-[var(--accent-color)]" />,
      action: () => { router.push('/tools'); setIsOpen(false); },
    },
    {
      id: 'nav-contact',
      category: 'Navigation',
      title: 'Book a Consultation / Contact HQ',
      subtitle: 'Jhunjhunu, Rajasthan & online consultations',
      icon: <Mail className="w-4 h-4 text-[var(--accent-color)]" />,
      action: () => { router.push('/contact'); setIsOpen(false); },
    },
    {
      id: 'nav-terminal',
      category: 'Navigation',
      title: 'Upgrader Shell v3.0 Terminal',
      subtitle: 'Jump to embedded interactive developer terminal',
      icon: <Terminal className="w-4 h-4 text-[var(--accent-color)]" />,
      action: () => { router.push('/#terminal'); setIsOpen(false); },
    },
    // Themes
    {
      id: 'theme-toggle',
      category: 'Theme',
      title: 'Toggle Light / Dark Mode',
      subtitle: 'Switch display surface brightness',
      icon: <Sun className="w-4 h-4 text-amber-400" />,
      action: () => {
        const current = localStorage.getItem('ub-theme-mode') ?? 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        localStorage.setItem('ub-theme-mode', next);
        if (next === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        window.dispatchEvent(new Event('storage'));
        setIsOpen(false);
      },
    },
    // External
    {
      id: 'ext-github',
      category: 'External',
      title: 'GitHub Profile',
      subtitle: 'github.com/upgraderboy',
      icon: <ExternalLink className="w-4 h-4 text-slate-400" />,
      action: () => { window.open('https://github.com/upgraderboy', '_blank'); setIsOpen(false); },
    },
    {
      id: 'ext-linkedin',
      category: 'External',
      title: 'LinkedIn Profile',
      subtitle: 'linkedin.com/in/ankitbhuria',
      icon: <ExternalLink className="w-4 h-4 text-slate-400" />,
      action: () => { window.open('https://linkedin.com/in/ankitbhuria', '_blank'); setIsOpen(false); },
    },
    {
      id: 'ext-youtube',
      category: 'External',
      title: 'YouTube Channel',
      subtitle: '@upgraderboy official tutorials',
      icon: <ExternalLink className="w-4 h-4 text-slate-400" />,
      action: () => { window.open('https://youtube.com/@upgraderboy', '_blank'); setIsOpen(false); },
    },
  ];

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    (item.subtitle && item.subtitle.toLowerCase().includes(query.toLowerCase())) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (item: PaletteItem) => {
    item.action();
  };

  const handleKeyDownList = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-slide-down"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDownList}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, route, or search topic..."
            autoFocus
            className="flex-1 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none"
          />
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 mr-2">
            ESC to close
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-sm">
              No matching commands or pages found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer text-sm transition-colors ${
                    isSelected
                      ? 'bg-[var(--accent-glow)] text-slate-900 dark:text-white border border-[var(--accent-border)]'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      {item.icon}
                    </div>
                    <div className="truncate">
                      <div className="font-semibold truncate">{item.title}</div>
                      {item.subtitle && (
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {item.subtitle}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 ml-2 shrink-0">
                    {item.category}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
          <div className="flex items-center space-x-3">
            <span>↑↓ navigate</span>
            <span>↵ select</span>
            <span>esc close</span>
          </div>
          <span className="text-[var(--accent-color)] font-semibold">UB Command Palette</span>
        </div>
      </div>
    </div>
  );
}
