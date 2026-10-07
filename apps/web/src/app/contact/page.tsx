import React from 'react';
import type { Metadata } from 'next';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import {
  Calendar,
  Calculator,
  MapPin,
  Phone,
  Clock,
  Mail,
  ShieldCheck,
  Zap,
  Sparkles,
  Award,
  CheckCircle,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { WhatsAppIcon, GithubIcon, LinkedinIcon, YoutubeIcon } from '../../components/SocialIcons';
import { ConsultationBookingCalendar } from '../../components/ConsultationBookingCalendar';
import { ProjectScopeEstimator } from '../../components/ProjectScopeEstimator';

export const metadata: Metadata = {
  title: 'Consultation & Lead Intake | Upgrader Boy',
  description:
    'Schedule a 1-on-1 strategy call with Ankit Bhuria (Founder & Principal Architect, Upgrader Boy) or calculate your project scope and budget with transparent fixed pricing.',
  keywords: [
    'Upgrader Boy Contact',
    'Ankit Bhuria Consultation',
    'Hire Full-Stack Developer',
    'Next.js 15 Agency',
    'React Native Mobile App Development',
    'Jhunjhunu Rajasthan Software Agency',
  ],
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-800 dark:text-slate-100 flex flex-col pt-20">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-16">
        {/* ======================================================== */}
        {/* 1. HERO SECTION & TRUST BADGES                           */}
        {/* ======================================================== */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[var(--accent-glow)] border border-[var(--accent-border)] text-xs font-mono font-bold text-[var(--accent-color)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DIRECT ARCHITECT CONSULTATION &amp; INTAKE</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-heading font-black tracking-tight text-slate-900 dark:text-white">
            Let&apos;s Engineer Your Next{' '}
            <span className="bg-gradient-to-r from-slate-900 via-slate-600 to-[var(--accent-color)] dark:from-white dark:via-slate-200 dark:to-[var(--accent-color)] bg-clip-text text-transparent">
              Competitive Advantage
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Collaborate directly with lead architect Ankit Bhuria. Book a dedicated discovery call, calculate your project scope, or connect via WhatsApp.
          </p>

          {/* SLA Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-700 dark:text-slate-300 shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-[var(--accent-color)]" />
              <span>&le; 4-Hour Response SLA</span>
            </div>

            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-700 dark:text-slate-300 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mutual NDA Upfront</span>
            </div>

            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-700 dark:text-slate-300 shadow-2xs">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>SIH 2024 National Winners</span>
            </div>

            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-700 dark:text-slate-300 shadow-2xs">
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              <span>Fixed Milestone Pricing</span>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 2. DUAL INTERACTIVE WORKSPACES: CALL & ESTIMATOR         */}
        {/* ======================================================== */}
        <section className="space-y-12">
          {/* Track 1: Interactive Strategy Call Scheduler */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent-color)]">
              <Calendar className="w-4 h-4" />
              <span>Track 1: Schedule Strategy Session</span>
            </div>
            <ConsultationBookingCalendar />
          </div>

          {/* Track 2: Scope & Budget Estimator */}
          <div className="space-y-4 pt-6">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent-color)]">
              <Calculator className="w-4 h-4" />
              <span>Track 2: Interactive Project Scope Estimator</span>
            </div>
            <ProjectScopeEstimator />
          </div>
        </section>

        {/* ======================================================== */}
        {/* 3. PHYSICAL HQ, DIRECT CHANNELS & FOUNDER PROFILE        */}
        {/* ======================================================== */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Agency HQ Card */}
          <div className="bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm hover:border-[var(--accent-color)]/60 transition-all">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-[var(--accent-color)]">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                HQ Location
              </span>
            </div>

            <div>
              <h3 className="font-heading font-black text-base text-slate-900 dark:text-white">
                Agency Headquarters
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Near Toll Tax, Sikar Road, Jhunjhunu, Rajasthan, 333001, India
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono">08:00 – 20:00 IST</span>
              <a
                href="https://maps.google.com/?q=Jhunjhunu,+Rajasthan"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent-color)] font-bold hover:underline flex items-center space-x-1"
              >
                <span>View Map</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Direct Founder Access Card */}
          <div className="bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm hover:border-[var(--accent-color)]/60 transition-all">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-emerald-400">
                <Phone className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400">
                Direct Line
              </span>
            </div>

            <div>
              <h3 className="font-heading font-black text-base text-slate-900 dark:text-white">
                Phone &amp; WhatsApp
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                +91 91662 71496 (Ankit Bhuria)
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                ankit@upgraderboy.com
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono">Replies &lt; 4h</span>
              <a
                href="https://wa.me/919166271496"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 font-bold hover:underline flex items-center space-x-1"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" />
                <span>Chat Now</span>
              </a>
            </div>
          </div>

          {/* Social Developer Matrix */}
          <div className="bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm hover:border-[var(--accent-color)]/60 transition-all">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-purple-400">
                <Mail className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                Community
              </span>
            </div>

            <div>
              <h3 className="font-heading font-black text-base text-slate-900 dark:text-white">
                Public Developer Hub
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Follow our open-source repositories, case studies, and video engineering breakdowns.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center space-x-3 text-slate-500 dark:text-slate-400">
              <a
                href="https://github.com/upgraderboy"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--accent-color)] transition-colors"
                title="GitHub"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com/in/upgraderboy/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--accent-color)] transition-colors"
                title="LinkedIn"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com/@upgraderboy"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--accent-color)] transition-colors"
                title="YouTube"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 4. CLIENT FREQUENTLY ASKED QUESTIONS (FAQ)               */}
        {/* ======================================================== */}
        <section className="bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300">
              <HelpCircle className="w-3.5 h-3.5 text-[var(--accent-color)]" />
              <span>TRANSPARENT COLLABORATION</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 dark:text-white">
              Consultation &amp; Client FAQ
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Everything you need to know about starting a project with Upgrader Boy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 space-y-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-[var(--accent-color)] shrink-0" />
                <span>What happens after I schedule a call?</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                You will receive an instant Google Calendar invitation with a Google Meet link. Ankit Bhuria personally conducts the strategy session to understand your architecture and deliver high-impact advice.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 space-y-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-[var(--accent-color)] shrink-0" />
                <span>How does fixed-price milestone billing work?</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                We break projects into weekly verifiable sprints (e.g., Sprint 1: DB &amp; Auth, Sprint 2: Core Features, Sprint 3: Polish &amp; Deploy). Payments are linked to accepted milestone deliverables, with zero surprise fees.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 space-y-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-[var(--accent-color)] shrink-0" />
                <span>Can we sign an NDA before discussions?</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Yes, absolutely. We provide a mutual non-disclosure agreement (NDA) to protect your proprietary ideas, business logic, and intellectual property prior to in-depth technical discussions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 space-y-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-[var(--accent-color)] shrink-0" />
                <span>Do you offer post-launch support &amp; warranty?</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Every project includes a 30-day post-launch warranty covering complimentary bug fixes, performance monitoring, and comprehensive developer handover documentation.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
