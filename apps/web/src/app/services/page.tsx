import React from 'react';
import type { Metadata } from 'next';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import {
  Code2,
  Smartphone,
  Cloud,
  Cpu,
  CheckCircle,
  ShieldCheck,
  Zap,
  ArrowRight,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { WhatsAppIcon } from '../../components/SocialIcons';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Services & Engineering Capabilities | Upgrader Boy',
  description:
    'Full-Stack Web Development, Cross-Platform Mobile Apps, AI Pipelines, and Cloud Architectures engineered by Upgrader Boy (Ankit Bhuria).',
};

const SERVICES = [
  {
    title: 'Full-Stack Web Applications',
    subtitle: 'Next.js 15 • React 19 • TypeScript • PostgreSQL',
    icon: <Code2 className="w-6 h-6 text-[var(--accent-color)]" />,
    badge: 'Core Offering',
    turnaround: '2 – 4 Weeks typical sprint',
    description:
      'High-performance web applications built with Next.js 15 App Router, React Server Components, server actions, and type-safe databases.',
    deliverables: [
      'Sub-second page speeds with Edge caching & ISR',
      'End-to-end type safety with TypeScript & Zod schemas',
      '100/100 Core Web Vitals target across mobile & desktop',
      'SEO-optimized architecture with dynamic metadata',
    ],
  },
  {
    title: 'Cross-Platform Mobile Apps',
    subtitle: 'React Native • Expo SDK 52 • SQLite Offline',
    icon: <Smartphone className="w-6 h-6 text-[var(--accent-color)]" />,
    badge: 'Native Speed',
    turnaround: '3 – 5 Weeks typical sprint',
    description:
      'Smooth, responsive iOS and Android apps built with Expo SDK 52+, offline-first SQLite local caching, and fluid gesture animations.',
    deliverables: [
      'Single TypeScript codebase for iOS and Android',
      'Instant Over-The-Air (OTA) updates via EAS',
      'Reliable offline data caching and background sync',
      'App Store & Play Store deployment management',
    ],
  },
  {
    title: 'AI Agents & LLM Pipelines',
    subtitle: 'Gemini API • Claude • Vector Embeddings',
    icon: <Cpu className="w-6 h-6 text-[var(--accent-color)]" />,
    badge: 'Next-Gen',
    turnaround: '1 – 3 Weeks integration',
    description:
      'Production-grade AI intelligence pipelines, autonomous review workers, semantic search, and streaming interactive chat experiences.',
    deliverables: [
      'Custom LLM agent orchestration with structured output',
      'Context retrieval (RAG) and vector similarity search',
      'Strict confidence filters preventing hallucinations',
      'Low-latency streaming UI components',
    ],
  },
  {
    title: 'Decoupled Cloud & Architecture',
    subtitle: 'Turborepo • Docker • Microservices • CI/CD',
    icon: <Cloud className="w-6 h-6 text-[var(--accent-color)]" />,
    badge: 'Enterprise Grade',
    turnaround: 'Continuous Architecture',
    description:
      'Fault-isolated system designs with dedicated administrative portals, microservices, containerization, and automated CI/CD pipelines.',
    deliverables: [
      'Blast-radius isolation: Admin CMS decoupling protects public apps',
      'Multi-package Turborepo monorepo setup',
      'Zero-downtime blue/green deployments',
      'Audit logging and role-based access control (RBAC)',
    ],
  },
];

const VALUES = [
  {
    title: 'Zero Shortcut Engineering',
    desc: 'No TypeScript `any`, zero unvetted dependencies, and clean code that is easy to maintain.',
    icon: <ShieldCheck className="w-5 h-5 text-[var(--accent-color)]" />,
  },
  {
    title: 'Direct Architect Communication',
    desc: 'You work directly with lead architect Ankit Bhuria — no middle management or communication delays.',
    icon: <MessageSquare className="w-5 h-5 text-cyan-400" />,
  },
  {
    title: 'Sprint-Based Transparency',
    desc: 'Weekly milestone demos and live staging previews so you see genuine progress every few days.',
    icon: <Zap className="w-5 h-5 text-amber-400" />,
  },
  {
    title: '30-Day Post-Launch Care',
    desc: 'Dedicated developer support post-deployment for bug fixes, performance monitoring, and team handover.',
    icon: <Sparkles className="w-5 h-5 text-purple-400" />,
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-800 dark:text-slate-100 flex flex-col pt-20">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-20">
        {/* Simple & Impactful Hero */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[var(--accent-glow)] border border-[var(--accent-border)] text-xs font-mono font-bold text-[var(--accent-color)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SOFTWARE ARCHITECTURE & ENGINEERING</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-heading font-black tracking-tight text-slate-900 dark:text-white">
            Transforming Ideas Into{' '}
            <span className="bg-gradient-to-r from-slate-900 via-slate-600 to-[var(--accent-color)] dark:from-white dark:via-slate-200 dark:to-[var(--accent-color)] bg-clip-text text-transparent">
              High-Speed Software
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            We build clean, robust web and mobile systems for startups and founders with architectural discipline, modern stacks, and zero shortcuts.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
            <Link
              href="/contact"
              className="px-6 py-3 rounded-2xl bg-[var(--accent-color)] text-slate-900 font-bold text-xs flex items-center space-x-2 glow-btn transition-transform hover:scale-105"
            >
              <span>Schedule Discovery Call</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <a
              href="https://wa.me/918000720499"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[var(--accent-color)] text-slate-800 dark:text-white font-bold text-xs flex items-center space-x-2 transition-colors shadow-sm"
            >
              <WhatsAppIcon className="w-4 h-4 text-emerald-500" />
              <span>Direct WhatsApp Chat</span>
            </a>
          </div>
        </section>

        {/* 4 Clean Services Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 hover:border-[var(--accent-color)] transition-all shadow-sm hover:shadow-xl group flex flex-col justify-between"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 group-hover:border-[var(--accent-color)] transition-colors">
                    {s.icon}
                  </div>
                  <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-[var(--accent-glow)] text-[var(--accent-color)] border border-[var(--accent-border)]">
                    {s.badge}
                  </span>
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-heading font-black text-slate-900 dark:text-white mb-1">
                    {s.title}
                  </h2>
                  <div className="text-xs font-mono text-[var(--accent-color)] mb-3">
                    {s.subtitle}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {s.description}
                  </p>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                    Core Deliverables:
                  </div>
                  {s.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-start space-x-2.5 text-xs text-slate-600 dark:text-slate-300">
                      <CheckCircle className="w-4 h-4 text-[var(--accent-color)] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-mono text-slate-500 dark:text-slate-400">
                  ⏱️ {s.turnaround}
                </span>
                <Link
                  href="/contact"
                  className="font-bold text-[var(--accent-color)] hover:underline flex items-center space-x-1"
                >
                  <span>Inquire Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </section>

        {/* Engineering Principles */}
        <section className="bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 dark:text-white">
              Why Founders Partner With Us
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              High code quality, transparent weekly sprints, and direct lead developer ownership.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="p-5 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 space-y-2"
              >
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 w-fit mb-2">
                  {v.icon}
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {v.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Clean Consultation Callout */}
        <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-8 md:p-12 text-center space-y-5 border border-slate-800 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-[var(--accent-color)]/20 border border-[var(--accent-color)] text-[var(--accent-color)] mx-auto flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-heading font-black">
              Ready to build something exceptional?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Get in touch directly with Ankit Bhuria. We will discuss your vision, provide architectural insights, and plan your milestone sprints.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/contact"
              className="px-6 py-3 rounded-2xl bg-[var(--accent-color)] text-slate-900 font-bold text-xs glow-btn"
            >
              <span>Schedule Call</span>
            </Link>
            <a
              href="https://wa.me/918000720499"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-2xl bg-slate-800 border border-slate-700 hover:border-slate-500 text-white font-bold text-xs flex items-center space-x-2"
            >
              <WhatsAppIcon className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Us (+91 80007 20499)</span>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
