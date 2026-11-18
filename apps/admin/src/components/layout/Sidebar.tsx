'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Inbox,
  FileText,
  Briefcase,
  BookOpen,
  Camera,
  Wrench,
  Settings,
  Search,
  Terminal,
  Globe,
  X,
  type LucideIcon,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Navigation Configuration                                          */
/* ------------------------------------------------------------------ */

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  accentClass?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Overview',
    items: [
      {
        label: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        accentClass: 'text-emerald-400',
      },
    ],
  },
  {
    title: 'Content',
    items: [
      {
        label: 'Blogs',
        href: '/dashboard/blogs',
        icon: FileText,
        accentClass: 'text-sky-400',
      },
      {
        label: 'Projects',
        href: '/dashboard/projects',
        icon: Briefcase,
        accentClass: 'text-amber-400',
      },
      {
        label: 'Resources',
        href: '/dashboard/resources',
        icon: BookOpen,
        accentClass: 'text-purple-400',
      },
      {
        label: 'Memories',
        href: '/dashboard/memories',
        icon: Camera,
        accentClass: 'text-pink-400',
      },
    ],
  },
  {
    title: 'Business',
    items: [
      {
        label: 'Leads',
        href: '/dashboard/leads',
        icon: Inbox,
        badge: 'Live',
        accentClass: 'text-[var(--accent-color)]',
      },
      {
        label: 'Services',
        href: '/dashboard/services',
        icon: Wrench,
        accentClass: 'text-orange-400',
      },
    ],
  },
  {
    title: 'System',
    items: [
      {
        label: 'SEO & Metadata',
        href: '/dashboard/seo',
        icon: Globe,
        accentClass: 'text-cyan-400',
      },
      {
        label: 'Terminal',
        href: '/dashboard/terminal',
        icon: Terminal,
        accentClass: 'text-emerald-400',
      },
      {
        label: 'Settings',
        href: '/dashboard/settings',
        icon: Settings,
        accentClass: 'text-slate-400',
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Sidebar Component                                                 */
/* ------------------------------------------------------------------ */

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}

export default function Sidebar({
  isOpen,
  isCollapsed,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <nav
      className="flex flex-col h-full"
      aria-label="Admin navigation"
    >
      {/* Logo Area */}
      <div className={`flex items-center h-16 px-4 border-b border-white/[0.06] shrink-0 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed && (
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/20 flex items-center justify-center text-[var(--accent-color)] font-mono font-bold text-xs">
              UB
            </div>
            <div>
              <span className="block text-[13px] font-semibold text-white leading-none tracking-tight">
                UB Platform
              </span>
              <span className="block text-[10px] font-mono text-slate-500 mt-0.5">
                Admin CMS
              </span>
            </div>
          </Link>
        )}
        {isCollapsed && (
          <Link href="/dashboard" className="flex items-center justify-center">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/20 flex items-center justify-center text-[var(--accent-color)] font-mono font-bold text-xs">
              UB
            </div>
          </Link>
        )}

        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          aria-label="Close navigation"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Search Trigger */}
      {!isCollapsed && (
        <div className="px-3 py-3 shrink-0">
          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-slate-500 hover:text-slate-400 hover:border-white/[0.1] transition-all text-xs">
            <Search className="w-3.5 h-3.5" />
            <span className="font-mono">Search...</span>
            <kbd className="ml-auto text-[10px] font-mono text-slate-600 bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/[0.06]">
              ⌘K
            </kbd>
          </button>
        </div>
      )}

      {/* Nav Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-5 scrollbar-thin">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title}>
            {!isCollapsed && (
              <p className="px-2 mb-1.5 text-[10px] font-mono font-medium text-slate-500/80 uppercase tracking-widest">
                {section.title}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`
                        group flex items-center gap-2.5 rounded-lg transition-all duration-150
                        ${isCollapsed ? 'justify-center px-2 py-2.5' : 'px-2.5 py-2'}
                        ${
                          active
                            ? 'bg-white/[0.07] text-white shadow-sm'
                            : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                        }
                      `}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <Icon
                        className={`w-[18px] h-[18px] shrink-0 transition-colors ${
                          active ? item.accentClass ?? 'text-[var(--accent-color)]' : 'group-hover:text-slate-300'
                        }`}
                      />
                      {!isCollapsed && (
                        <>
                          <span className={`text-[13px] leading-none ${active ? 'font-medium' : ''}`}>
                            {item.label}
                          </span>
                          {item.badge && (
                            <span className="ml-auto text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded-full bg-[var(--accent-color)]/10 text-[var(--accent-color)] border border-[var(--accent-color)]/20">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                      {/* Active indicator line */}
                      {active && !isCollapsed && (
                        <span className="ml-auto w-0.5 h-4 rounded-full bg-[var(--accent-color)]" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom System Status */}
      {!isCollapsed && (
        <div className="px-3 py-3 border-t border-white/[0.06] shrink-0">
          <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-emerald-500/[0.06] border border-emerald-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono text-emerald-400/80">
              Systems Operational
            </span>
          </div>
        </div>
      )}
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`
          hidden lg:flex flex-col fixed left-0 top-0 h-dvh z-40
          bg-[#0a0d14]/95 backdrop-blur-xl
          border-r border-white/[0.06]
          transition-[width] duration-200 ease-out
          ${isCollapsed ? 'w-[60px]' : 'w-[240px]'}
        `}
      >
        {sidebarContent}
      </aside>

      {/* Mobile drawer overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          {/* Drawer panel */}
          <aside
            className="relative w-[280px] h-dvh bg-[#0a0d14] border-r border-white/[0.06] shadow-2xl animate-slide-in"
            role="dialog"
            aria-label="Navigation drawer"
          >
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
