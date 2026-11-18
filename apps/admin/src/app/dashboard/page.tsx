'use client';

import React from 'react';
import {
  Inbox,
  FileText,
  Briefcase,
  BookOpen,
  TrendingUp,
  ArrowUpRight,
  Clock,
  Sparkles,
  Camera,
  MessageCircle,
  Mail,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Stat Cards                                                        */
/* ------------------------------------------------------------------ */

interface StatCard {
  label: string;
  value: string;
  change: string;
  changeType: 'positive' | 'neutral';
  icon: React.ReactNode;
}

const STATS: StatCard[] = [
  {
    label: 'Incoming Leads',
    value: '3',
    change: '2 unread from /contact',
    changeType: 'positive',
    icon: <Inbox className="w-4 h-4 text-[var(--accent-color)]" />,
  },
  {
    label: 'Published Blogs',
    value: '4',
    change: '12.4K total reads',
    changeType: 'neutral',
    icon: <FileText className="w-4 h-4 text-sky-400" />,
  },
  {
    label: 'Shipped Projects',
    value: '15+',
    change: 'SIH 2024 Winner 🏆',
    changeType: 'positive',
    icon: <Briefcase className="w-4 h-4 text-amber-400" />,
  },
  {
    label: 'Study Resources',
    value: '24',
    change: 'DSA, DBMS, GATE CS',
    changeType: 'neutral',
    icon: <BookOpen className="w-4 h-4 text-purple-400" />,
  },
];

/* ------------------------------------------------------------------ */
/*  Quick Access Modules                                              */
/* ------------------------------------------------------------------ */

interface QuickModule {
  title: string;
  description: string;
  href: string;
  cta: string;
  icon: React.ReactNode;
  accentClass: string;
  borderHover: string;
  tag: string;
}

const MODULES: QuickModule[] = [
  {
    title: 'Inquiries & Strategy Calls',
    description:
      'Review submitted client project scopes, budgets, and scheduled consultation slots.',
    href: '/dashboard/leads',
    cta: 'Manage Inquiries',
    icon: <Inbox className="w-5 h-5" />,
    accentClass: 'bg-[var(--accent-color)]/10 text-[var(--accent-color)]',
    borderHover: 'hover:border-[var(--accent-color)]/40',
    tag: 'Real-Time',
  },
  {
    title: 'Technical Blog Publisher',
    description:
      'Create and edit deep-dive architecture articles with live preview and syntax highlighting.',
    href: '/dashboard/blogs',
    cta: 'Open Blog Studio',
    icon: <FileText className="w-5 h-5" />,
    accentClass: 'bg-sky-500/10 text-sky-400',
    borderHover: 'hover:border-sky-500/40',
    tag: 'Markdown',
  },
  {
    title: 'Resources & Study Vault',
    description:
      'Organize B.Tech & GATE category folder trees, upload study PDFs, and manage permalinks.',
    href: '/dashboard/resources',
    cta: 'Manage Study Vault',
    icon: <BookOpen className="w-5 h-5" />,
    accentClass: 'bg-purple-500/10 text-purple-400',
    borderHover: 'hover:border-purple-500/40',
    tag: 'Tree Hierarchy',
  },
  {
    title: 'Projects & Case Studies',
    description:
      'Manage portfolio projects with live demos, architecture diagrams, and tech stack tags.',
    href: '/dashboard/projects',
    cta: 'Manage Projects',
    icon: <Briefcase className="w-5 h-5" />,
    accentClass: 'bg-amber-500/10 text-amber-400',
    borderHover: 'hover:border-amber-500/40',
    tag: 'Portfolio',
  },
  {
    title: 'Memories & Photo Album',
    description:
      'Upload photos, tag events, and manage the visual life album with mood engine.',
    href: '/dashboard/memories',
    cta: 'Manage Photos',
    icon: <Camera className="w-5 h-5" />,
    accentClass: 'bg-pink-500/10 text-pink-400',
    borderHover: 'hover:border-pink-500/40',
    tag: 'Media',
  },
];

/* ------------------------------------------------------------------ */
/*  Sample Leads (will be replaced by Supabase queries)               */
/* ------------------------------------------------------------------ */

interface LeadSummary {
  id: string;
  name: string;
  email: string;
  service: string;
  scopeType: string;
  budgetRange: string;
  status: 'new' | 'in_review' | 'contacted' | 'closed';
  date: string;
}

const SAMPLE_LEADS: LeadSummary[] = [
  {
    id: 'lead-1',
    name: 'Vikram Mehta',
    email: 'vikram.mehta@fintechcorp.io',
    service: 'Full-Stack Web App',
    scopeType: 'Next.js 15 Monorepo + Cloud Architecture',
    budgetRange: '₹1.5L - ₹3.0L',
    status: 'new',
    date: 'Today, 10:14 AM',
  },
  {
    id: 'lead-2',
    name: 'Sarah Jenkins',
    email: 'sarah@healthtrack.ai',
    service: 'Cross-Platform Mobile',
    scopeType: 'React Native 120 FPS Mobile App',
    budgetRange: '$2,500 - $5,000',
    status: 'new',
    date: 'Yesterday, 4:30 PM',
  },
  {
    id: 'lead-3',
    name: 'Aman Singhania',
    email: 'aman@singhanialabs.in',
    service: 'Tech Consulting',
    scopeType: '1-on-1 45-min Deep Dive Strategy Call',
    budgetRange: 'Consultation',
    status: 'contacted',
    date: '08 Oct 2026',
  },
];

/* ------------------------------------------------------------------ */
/*  Dashboard Overview Page                                           */
/* ------------------------------------------------------------------ */

export default function DashboardOverviewPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-950/80 border border-white/[0.06] p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-72 h-72 bg-[var(--accent-color)]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-color)] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>COMMAND CENTER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
            Welcome back, Upgrader Boy.
          </h1>
          <p className="text-sm text-slate-400 mt-1.5 max-w-lg">
            Your public portfolio is serving globally via Vercel Edge CDN. All systems operational.
          </p>
        </div>
      </div>

      {/* Stat Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4 sm:p-5 hover:border-white/[0.1] transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wide">
                {stat.label}
              </span>
              {stat.icon}
            </div>
            <span className="text-2xl sm:text-3xl font-heading font-bold text-white">
              {stat.value}
            </span>
            <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-mono">
              {stat.changeType === 'positive' && (
                <TrendingUp className="w-3 h-3 text-emerald-400" />
              )}
              <span
                className={
                  stat.changeType === 'positive'
                    ? 'text-emerald-400'
                    : 'text-slate-500'
                }
              >
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Access Modules */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">
            Content Management
          </h2>
          <span className="text-[10px] font-mono text-slate-500">
            Phase 3 CMS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {MODULES.map((mod) => (
            <a
              key={mod.href}
              href={mod.href}
              className={`group rounded-xl bg-white/[0.02] border border-white/[0.06] p-5 transition-all ${mod.borderHover} hover:bg-white/[0.03]`}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${mod.accentClass}`}
                >
                  {mod.icon}
                </div>
                <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full border border-white/[0.06] text-slate-500">
                  {mod.tag}
                </span>
              </div>
              <h3 className="text-[13px] font-semibold text-white group-hover:text-slate-100 mb-1">
                {mod.title}
              </h3>
              <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
                {mod.description}
              </p>
              <div className="flex items-center gap-1 text-[11px] font-mono font-medium text-slate-400 group-hover:text-white transition-colors">
                <span>{mod.cta}</span>
                <ArrowUpRight className="w-3 h-3" />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Recent Leads */}
      <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div>
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[var(--accent-color)]" />
              Recent Inquiries
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Captured from /contact via LeadSchema validation
            </p>
          </div>
          <span className="text-[10px] font-mono font-semibold text-[var(--accent-color)] bg-[var(--accent-color)]/10 px-2.5 py-1 rounded-full border border-[var(--accent-color)]/20">
            {SAMPLE_LEADS.length} Inquiries
          </span>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {SAMPLE_LEADS.map((lead) => (
            <div
              key={lead.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 hover:bg-white/[0.02] transition-colors"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[13px] font-medium text-white">
                    {lead.name}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 truncate">
                    {lead.email}
                  </span>
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                      lead.status === 'new'
                        ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                        : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                    }`}
                  >
                    {lead.status}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-500 mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <span className="text-slate-400">{lead.service}</span>
                  <span className="text-slate-600">·</span>
                  <span>{lead.scopeType}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-amber-400/70">{lead.budgetRange}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={`https://wa.me/918890309622?text=Hi%20${encodeURIComponent(lead.name)},%20thank%20you%20for%20contacting%20Upgrader%20Boy!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[11px] text-slate-400 hover:text-emerald-400 hover:border-emerald-500/20 transition-all"
                  title="Reply on WhatsApp"
                >
                  <MessageCircle className="w-3 h-3" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </a>
                <a
                  href={`mailto:${lead.email}?subject=Upgrader%20Boy%20Proposal%20Discussion`}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[11px] text-slate-400 hover:text-sky-400 hover:border-sky-500/20 transition-all"
                  title="Send Email"
                >
                  <Mail className="w-3 h-3" />
                  <span className="hidden sm:inline">Email</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
