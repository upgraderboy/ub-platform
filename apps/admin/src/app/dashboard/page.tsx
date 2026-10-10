'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  LogOut,
  LayoutDashboard,
  Inbox,
  FileText,
  Briefcase,
  BookOpen,
  Sparkles,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ExternalLink,
  MessageCircle,
  Mail,
} from 'lucide-react';
import { getSupabaseBrowserClient } from '@ub/api';

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

export default function AdminDashboardPage() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<{ email?: string; username?: string } | null>(null);

  useEffect(() => {
    async function verifyAdminAuth() {
      const supabase = getSupabaseBrowserClient();
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
        } else {
          setAdminUser({ email: user.email, username: user.user_metadata?.username || 'upgraderboy' });
        }
      } else {
        const localSession = localStorage.getItem('ub_admin_session');
        if (!localSession) {
          router.push('/login');
        } else {
          try {
            const parsed = JSON.parse(localSession);
            setAdminUser(parsed.user);
          } catch {
            router.push('/login');
          }
        }
      }
    }

    void verifyAdminAuth();
  }, [router]);

  const handleSignOut = async () => {
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('ub_admin_session');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#070A11] text-slate-100 flex flex-col">
      
      {/* Top Cockpit Navbar */}
      <header className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="w-8 h-8 rounded-xl bg-[var(--accent-color)]/20 border border-[var(--accent-color)]/40 flex items-center justify-center font-black text-sm text-[var(--accent-color)]">
              UB
            </span>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-sm tracking-tight text-white">
                  UB Platform CMS
                </span>
                <span className="text-[10px] font-mono text-[var(--accent-color)] bg-[var(--accent-color)]/10 px-1.5 py-0.5 rounded border border-[var(--accent-color)]/30">
                  PROD v2.0
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-400">admin.upgraderboy.com</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="https://upgraderboy.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center space-x-1 text-xs font-mono text-slate-400 hover:text-white transition-colors"
            >
              <span>View Public Web</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <div className="h-4 w-px bg-slate-800 hidden sm:block" />

            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs text-[var(--accent-color)] font-mono font-bold">
                AB
              </div>
              <div className="hidden md:block text-left">
                <span className="block text-xs font-bold text-white leading-none">
                  Ankit Bhuria
                </span>
                <span className="text-[10px] font-mono text-[var(--accent-color)]">
                  {adminUser?.email || 'admin@upgraderboy.com'}
                </span>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-500/30 transition-all text-xs"
              title="Sign Out"
              aria-label="Sign out of admin portal"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Mission Control Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Welcome & Overview Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--accent-color)]/5 rounded-full blur-3xl pointer-events-none" />
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-[var(--accent-color)] mb-1">
              <Sparkles className="w-4 h-4 text-[var(--accent-color)]" />
              <span>COMMAND COCKPIT ACTIVE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-white">
              Welcome back, Ankit.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              All systems online. Your public portfolio is serving sub-100ms globally via Vercel Edge CDN.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <span className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>PostgreSQL & Auth Connected</span>
            </span>
          </div>
        </div>

        {/* 4 Key Performance Metric Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
              <span>INCOMING LEADS</span>
              <Inbox className="w-4 h-4 text-[var(--accent-color)]" />
            </div>
            <span className="text-3xl font-heading font-black text-white">3</span>
            <div className="mt-2 flex items-center space-x-1.5 text-[11px] font-mono text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>2 unread from /contact</span>
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
              <span>PUBLISHED BLOGS</span>
              <FileText className="w-4 h-4 text-sky-400" />
            </div>
            <span className="text-3xl font-heading font-black text-white">4</span>
            <div className="mt-2 flex items-center space-x-1.5 text-[11px] font-mono text-slate-400">
              <span>12.4K Reads • High ToC Engagement</span>
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
              <span>SHIPPED PROJECTS</span>
              <Briefcase className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-3xl font-heading font-black text-white">15+</span>
            <div className="mt-2 flex items-center space-x-1.5 text-[11px] font-mono text-amber-400">
              <span>SIH 2024 Winner Included 🏆</span>
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
              <span>STUDY VAULT & NOTES</span>
              <BookOpen className="w-4 h-4 text-purple-400" />
            </div>
            <span className="text-3xl font-heading font-black text-white">24</span>
            <div className="mt-2 flex items-center space-x-1.5 text-[11px] font-mono text-slate-400">
              <span>DSA 109p + DBMS + GATE CS</span>
            </div>
          </div>
        </div>

        {/* CMS Modules Quick Access Deck */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <LayoutDashboard className="w-4 h-4 text-[var(--accent-color)]" />
              <span>Platform Management Hubs</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">Phase 3 CMS Active</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Leads Manager Card */}
            <div className="bg-slate-900/80 border border-slate-800 hover:border-[var(--accent-color)]/50 p-5 rounded-2xl transition-all group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-color)]/10 text-[var(--accent-color)] flex items-center justify-center">
                  <Inbox className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  Real-Time
                </span>
              </div>
              <h4 className="font-bold text-sm text-white group-hover:text-[var(--accent-color)] transition-colors">
                Inquiries & Strategy Calls
              </h4>
              <p className="text-xs text-slate-400 mt-1 mb-4 leading-relaxed">
                Review submitted client project scopes, budgets, and scheduled consultation slots.
              </p>
              <div className="flex items-center text-xs font-mono text-[var(--accent-color)] font-semibold space-x-1">
                <span>Manage Inquiries</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Blog Articles Card */}
            <div className="bg-slate-900/80 border border-slate-800 hover:border-sky-500/50 p-5 rounded-2xl transition-all group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/30">
                  Markdown
                </span>
              </div>
              <h4 className="font-bold text-sm text-white group-hover:text-sky-400 transition-colors">
                Technical Blog Publisher
              </h4>
              <p className="text-xs text-slate-400 mt-1 mb-4 leading-relaxed">
                Create and edit deep-dive architecture articles with live preview and syntax highlighting.
              </p>
              <div className="flex items-center text-xs font-mono text-sky-400 font-semibold space-x-1">
                <span>Open Blog Studio</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Study Vault & Tree Builder */}
            <div className="bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 p-5 rounded-2xl transition-all group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/30">
                  Tree Hierarchy
                </span>
              </div>
              <h4 className="font-bold text-sm text-white group-hover:text-purple-400 transition-colors">
                Resources & Study Vault
              </h4>
              <p className="text-xs text-slate-400 mt-1 mb-4 leading-relaxed">
                Organize B.Tech & GATE category folder trees, upload study PDFs, and manage permalinks.
              </p>
              <div className="flex items-center text-xs font-mono text-purple-400 font-semibold space-x-1">
                <span>Manage Study Vault</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>

          </div>
        </div>

        {/* Live Inquiries Stream (from /contact) */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-white flex items-center space-x-2">
                <Clock className="w-4 h-4 text-[var(--accent-color)]" />
                <span>Recent Client Inquiries & Strategy Requests</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Automatically captured from /contact via strict LeadSchema validation
              </p>
            </div>
            <span className="text-xs font-mono text-[var(--accent-color)] bg-[var(--accent-color)]/10 px-2.5 py-1 rounded-full border border-[var(--accent-color)]/30">
              3 Inquiries
            </span>
          </div>

          <div className="divide-y divide-slate-800">
            {SAMPLE_LEADS.map((lead) => (
              <div key={lead.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-white">{lead.name}</span>
                    <span className="text-xs font-mono text-slate-400">({lead.email})</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                      lead.status === 'new'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {lead.status}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-slate-400 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="text-[var(--accent-color)]">{lead.service}</span>
                    <span>•</span>
                    <span>{lead.scopeType}</span>
                    <span>•</span>
                    <span className="text-amber-400">{lead.budgetRange}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <a
                    href={`https://wa.me/919166271496?text=Hi%20${encodeURIComponent(lead.name)},%20thank%20you%20for%20contacting%20Upgrader%20Boy!`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-slate-800 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 border border-slate-700 hover:border-emerald-500/30 transition-all text-xs flex items-center space-x-1"
                    title="Reply on WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </a>
                  <a
                    href={`mailto:${lead.email}?subject=Upgrader%20Boy%20Proposal%20Discussion`}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-sky-500/20 text-slate-300 hover:text-sky-400 border border-slate-700 hover:border-sky-500/30 transition-all text-xs flex items-center space-x-1"
                    title="Send Email"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Email</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
