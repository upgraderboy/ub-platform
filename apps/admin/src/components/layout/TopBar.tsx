'use client';

import React from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  LogOut,
  ExternalLink,
  Bell,
  PanelLeftClose,
  PanelLeft,
  Globe,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Breadcrumb helpers                                                */
/* ------------------------------------------------------------------ */

const ROUTE_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  blogs: 'Blogs',
  projects: 'Projects',
  resources: 'Resources',
  memories: 'Memories',
  leads: 'Leads',
  services: 'Services',
  seo: 'SEO & Metadata',
  terminal: 'Terminal',
  settings: 'Settings',
};

function useBreadcrumbs(): { label: string; href: string }[] {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  return segments.map((seg, i) => ({
    label: ROUTE_LABELS[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1),
    href: '/' + segments.slice(0, i + 1).join('/'),
  }));
}

/* ------------------------------------------------------------------ */
/*  TopBar Component                                                  */
/* ------------------------------------------------------------------ */

interface TopBarProps {
  adminEmail?: string;
  isCollapsed: boolean;
  onMenuToggle: () => void;
  onCollapseToggle: () => void;
  onSignOut: () => void;
}

export default function TopBar({
  adminEmail,
  isCollapsed,
  onMenuToggle,
  onCollapseToggle,
  onSignOut,
}: TopBarProps) {
  const router = useRouter();
  const breadcrumbs = useBreadcrumbs();

  return (
    <header className="sticky top-0 z-30 h-14 flex items-center justify-between gap-4 px-4 lg:px-6 bg-[#0a0d14]/80 backdrop-blur-xl border-b border-white/[0.06]">
      {/* Left cluster */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile hamburger */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop collapse toggle */}
        <button
          onClick={onCollapseToggle}
          className="hidden lg:flex p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.06] transition-colors"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <PanelLeft className="w-4 h-4" />
          ) : (
            <PanelLeftClose className="w-4 h-4" />
          )}
        </button>

        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1 text-xs font-mono min-w-0">
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={crumb.href}>
              {i > 0 && <span className="text-slate-600 select-none">/</span>}
              {i === breadcrumbs.length - 1 ? (
                <span className="text-slate-200 font-medium truncate">{crumb.label}</span>
              ) : (
                <button
                  onClick={() => router.push(crumb.href)}
                  className="text-slate-500 hover:text-slate-300 transition-colors truncate"
                >
                  {crumb.label}
                </button>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right cluster */}
      <div className="flex items-center gap-2">
        {/* View public site */}
        <a
          href="https://upgraderboy.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-mono text-slate-500 hover:text-white hover:bg-white/[0.04] border border-transparent hover:border-white/[0.06] transition-all"
        >
          <Globe className="w-3 h-3" />
          <span>upgraderboy.com</span>
          <ExternalLink className="w-3 h-3" />
        </a>

        {/* Notifications */}
        <button
          className="relative p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.06] transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[var(--accent-color)]" />
        </button>

        {/* Divider */}
        <div className="h-5 w-px bg-white/[0.06] mx-1 hidden sm:block" />

        {/* Admin user chip */}
        <button
          onClick={onSignOut}
          className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors group"
          title="Sign out"
        >
          <div className="w-7 h-7 rounded-lg overflow-hidden bg-slate-800 border border-white/[0.08] flex items-center justify-center shrink-0">
            <Image
              src="/favicon.png"
              alt="Admin"
              width={28}
              height={28}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="hidden md:block text-left min-w-0">
            <span className="block text-[11px] font-medium text-white leading-none truncate">
              Ankit Bhuria
            </span>
            <span className="block text-[10px] font-mono text-slate-500 mt-0.5 truncate">
              {adminEmail ?? 'upgraderboy@gmail.com'}
            </span>
          </div>
          <LogOut className="w-3.5 h-3.5 text-slate-600 group-hover:text-rose-400 transition-colors shrink-0" />
        </button>
      </div>
    </header>
  );
}
