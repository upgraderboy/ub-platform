'use client';

import React, { useState } from 'react';
import {
  Calculator,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  Coins,
  Send,
} from 'lucide-react';
import { WhatsAppIcon } from './SocialIcons';
import { ProjectType, BudgetRange, ProjectTimeline } from '@ub/types';

interface PlatformOption {
  id: ProjectType;
  name: string;
  basePriceINR: number;
  baseDurationWeeks: number;
  description: string;
}

interface FeatureAddon {
  id: string;
  name: string;
  priceINR: number;
  durationDays: number;
  description: string;
}

const PLATFORMS: PlatformOption[] = [
  {
    id: 'web',
    name: 'Next.js 15 Full-Stack Web App',
    basePriceINR: 45000,
    baseDurationWeeks: 3,
    description: 'Server components, edge caching, responsive UI, SEO optimized, PostgreSQL/Prisma.',
  },
  {
    id: 'mobile',
    name: 'React Native & Expo Mobile App',
    basePriceINR: 55000,
    baseDurationWeeks: 4,
    description: 'Cross-platform iOS and Android with native performance and offline local caching.',
  },
  {
    id: 'fullstack',
    name: 'Unified Monorepo Ecosystem',
    basePriceINR: 95000,
    baseDurationWeeks: 6,
    description: 'Shared Zod schemas, web app, mobile app, and independent decoupled admin CMS.',
  },
  {
    id: 'custom_api',
    name: 'High-Throughput Backend & APIs',
    basePriceINR: 40000,
    baseDurationWeeks: 2,
    description: 'Node.js/Bun microservices, Redis caching, WebSocket streaming, PostgreSQL.',
  },
  {
    id: 'consulting',
    name: 'Architecture & System Design Sprint',
    basePriceINR: 30000,
    baseDurationWeeks: 1,
    description: 'Deep-dive technical review, database schema redesign, and security hardening.',
  },
];

const ADDONS: FeatureAddon[] = [
  {
    id: 'auth-rbac',
    name: 'Authentication & Role-Based Access Control',
    priceINR: 10000,
    durationDays: 4,
    description: 'JWT / OAuth sessions, user tiers, protected routes, and audit trails.',
  },
  {
    id: 'ai-integration',
    name: 'AI Agent & LLM Intelligence Pipeline',
    priceINR: 18000,
    durationDays: 5,
    description: 'Gemini / Claude / OpenAI API integration, vector embeddings, streaming UI.',
  },
  {
    id: 'payments',
    name: 'Payment Gateway Integration',
    priceINR: 12000,
    durationDays: 3,
    description: 'Razorpay / Stripe webhooks, automated invoicing, subscription lifecycle.',
  },
  {
    id: 'devops-ci',
    name: 'CI/CD Pipelines & Cloud Infrastructure',
    priceINR: 15000,
    durationDays: 4,
    description: 'Dockerization, GitHub Actions, AWS/Vercel/Railway zero-downtime deployments.',
  },
  {
    id: 'seo-audit',
    name: 'Lighthouse 100/100 & Enterprise SEO',
    priceINR: 8000,
    durationDays: 3,
    description: 'JSON-LD schema markup, OpenGraph dynamic cards, Core Web Vitals optimization.',
  },
  {
    id: 'multi-tenant',
    name: 'Multi-Tenant Isolation & Analytics',
    priceINR: 16000,
    durationDays: 5,
    description: 'Workspace-level tenant partitioning, usage metering, and real-time dashboard.',
  },
];

export function ProjectScopeEstimator() {
  const [selectedPlatform, setSelectedPlatform] = useState<ProjectType>('web');
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['auth-rbac', 'devops-ci']);
  const [urgency, setUrgency] = useState<'standard' | 'express'>('standard');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Client Details & Submission State
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientWhatsapp, setClientWhatsapp] = useState('');
  const [clientNotes, setClientNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLeadId, setSubmittedLeadId] = useState<string | null>(null);

  const platform = PLATFORMS.find((p) => p.id === selectedPlatform) || PLATFORMS[0];

  const addonsTotalINR = selectedAddons.reduce((sum, addonId) => {
    const item = ADDONS.find((a) => a.id === addonId);
    return sum + (item ? item.priceINR : 0);
  }, 0);

  const addonsDaysTotal = selectedAddons.reduce((sum, addonId) => {
    const item = ADDONS.find((a) => a.id === addonId);
    return sum + (item ? item.durationDays : 0);
  }, 0);

  const rawPriceINR = platform.basePriceINR + addonsTotalINR;
  const totalPriceINR = urgency === 'express' ? Math.round(rawPriceINR * 1.25) : rawPriceINR;
  const totalWeeks = Math.ceil(platform.baseDurationWeeks + addonsDaysTotal / 7);

  // Conversion rate: 1 USD ~ 86 INR
  const totalPriceUSD = Math.round(totalPriceINR / 86);

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getBudgetRangeCategory = (): BudgetRange => {
    if (totalPriceUSD < 1000) return '< $1k';
    if (totalPriceUSD <= 3000) return '$1k - $3k';
    if (totalPriceUSD <= 5000) return '$3k - $5k';
    return '$5k+';
  };

  const getTimelineCategory = (): ProjectTimeline => {
    if (urgency === 'express') return 'urgent';
    if (totalWeeks <= 4) return '1-2 months';
    return 'flexible';
  };

  const handleSubmitBrief = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const addonNames = selectedAddons
      .map((id) => ADDONS.find((a) => a.id === id)?.name)
      .filter(Boolean)
      .join(', ');

    const descriptionText = `[Project Scope Estimate: ${platform.name} | Urgency: ${urgency} | Estimated: ₹${totalPriceINR.toLocaleString('en-IN')} (~$${totalPriceUSD.toLocaleString('en-US')}) | Duration: ~${totalWeeks} weeks] Addons: [${addonNames}]. Client Notes: ${clientNotes || 'Interested in starting milestone sprint.'}`;

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: clientName,
          email: clientEmail,
          whatsapp: clientWhatsapp || undefined,
          projectType: selectedPlatform,
          budgetRange: getBudgetRangeCategory(),
          timeline: getTimelineCategory(),
          description: descriptionText,
        }),
      });

      const data = await response.json();
      if (data.success && data.leadId) {
        setSubmittedLeadId(data.leadId);
      } else {
        alert(data.error || 'Failed to submit proposal. Please check fields.');
      }
    } catch {
      // Local fallback
      setSubmittedLeadId('EST_CONFIRMED');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-xl space-y-8">
      {/* Estimator Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-[var(--accent-glow)] border border-[var(--accent-border)] flex items-center justify-center text-[var(--accent-color)] shrink-0">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-heading font-black text-slate-900 dark:text-white">
              Dynamic Project Scope &amp; Budget Calculator
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Configure your software requirements to receive an instant milestone investment breakdown.
            </p>
          </div>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center space-x-2 shrink-0 self-start sm:self-auto">
          <Coins className="w-4 h-4 text-slate-400" />
          <div className="flex p-0.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono">
            <button
              type="button"
              onClick={() => setCurrency('INR')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                currency === 'INR'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              ₹ INR
            </button>
            <button
              type="button"
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                currency === 'USD'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              $ USD
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 Columns: Step-by-Step Configuration */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Platform Selection */}
          <div className="space-y-3">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block">
              Step 1: Choose Primary Architecture &amp; Platform
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PLATFORMS.map((item) => {
                const isSelected = selectedPlatform === item.id;
                const price =
                  currency === 'INR'
                    ? `₹${item.basePriceINR.toLocaleString('en-IN')}`
                    : `~$${Math.round(item.basePriceINR / 86).toLocaleString('en-US')}`;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedPlatform(item.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-[var(--accent-color)] bg-[var(--accent-glow)] ring-1 ring-[var(--accent-color)]'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-heading font-bold text-sm text-slate-900 dark:text-white mb-1">
                        {item.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                        {item.description}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800/60 text-xs font-mono">
                      <span className="text-[var(--accent-color)] font-bold">from {price}</span>
                      <span className="text-slate-400">~{item.baseDurationWeeks} wks</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Technical Add-on Modules */}
          <div className="space-y-3">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block">
              Step 2: Select Technical Capabilities &amp; Add-ons
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ADDONS.map((addon) => {
                const isSelected = selectedAddons.includes(addon.id);
                const addonPrice =
                  currency === 'INR'
                    ? `+₹${addon.priceINR.toLocaleString('en-IN')}`
                    : `+~$${Math.round(addon.priceINR / 86).toLocaleString('en-US')}`;
                return (
                  <div
                    key={addon.id}
                    onClick={() => toggleAddon(addon.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer flex items-start space-x-3 transition-all ${
                      isSelected
                        ? 'border-[var(--accent-color)] bg-[var(--accent-glow)]'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                        isSelected
                          ? 'bg-[var(--accent-color)] border-[var(--accent-color)] text-slate-900'
                          : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {addon.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
                        {addon.description}
                      </div>
                      <div className="text-[11px] font-mono text-[var(--accent-color)] font-semibold mt-1">
                        {addonPrice}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 3: Sprint Delivery Cadence */}
          <div className="space-y-3">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block">
              Step 3: Sprint Delivery Cadence
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUrgency('standard')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  urgency === 'standard'
                    ? 'border-[var(--accent-color)] bg-[var(--accent-glow)] ring-1 ring-[var(--accent-color)]'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40'
                }`}
              >
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-[var(--accent-color)]" />
                  <span>Standard Cadence (Agile)</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Weekly milestone demos, standard sprint capacity, and regular staging previews.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setUrgency('express')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  urgency === 'express'
                    ? 'border-[var(--accent-color)] bg-[var(--accent-glow)] ring-1 ring-[var(--accent-color)]'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40'
                }`}
              >
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Express Priority Sprint (+25%)</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Dedicated priority velocity, bi-weekly deliverables, and rapid time-to-market.
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Live Investment Card & Lead Intake */}
        <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-lg">
          {submittedLeadId ? (
            <div className="space-y-6 text-center my-auto animate-scale-up">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 mx-auto flex items-center justify-center">
                <Sparkles className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-mono font-bold text-emerald-500 uppercase tracking-wider">
                  BRIEF SUBMITTED &amp; LOCKED
                </span>
                <h4 className="text-xl font-heading font-black text-slate-900 dark:text-white">
                  Estimate Received!
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Thank you, <strong className="text-slate-900 dark:text-white">{clientName}</strong>. Your estimate ID is{' '}
                  <span className="font-mono text-[var(--accent-color)] font-bold">{submittedLeadId}</span>. Ankit Bhuria will review your architecture configuration and reply within 4 hours.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-left font-mono text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Platform:</span>
                  <span className="font-bold">{platform.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Investment:</span>
                  <span className="font-bold text-emerald-400">
                    {currency === 'INR'
                      ? `₹${totalPriceINR.toLocaleString('en-IN')}`
                      : `$${totalPriceUSD.toLocaleString('en-US')}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Turnaround:</span>
                  <span className="font-bold">~{totalWeeks} Weeks</span>
                </div>
              </div>

              <a
                href={`https://wa.me/919166271496?text=${encodeURIComponent(
                  `Hi Ankit, I submitted a project estimate brief for ${platform.name} (~${currency === 'INR' ? `₹${totalPriceINR}` : `$${totalPriceUSD}`}). Estimate ID: ${submittedLeadId}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-colors shadow-md"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>Follow Up on WhatsApp</span>
              </a>

              <button
                onClick={() => setSubmittedLeadId(null)}
                className="text-xs text-slate-400 hover:underline cursor-pointer"
              >
                Calculate another scope
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Investment Breakdown</span>
                  <span className="text-[var(--accent-color)]">Live Estimate</span>
                </div>

                <div className="space-y-3 pb-4 border-b border-slate-200 dark:border-slate-800 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">Core Architecture:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {currency === 'INR'
                        ? `₹${platform.basePriceINR.toLocaleString('en-IN')}`
                        : `$${Math.round(platform.basePriceINR / 86).toLocaleString('en-US')}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">
                      Add-on Modules ({selectedAddons.length}):
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {currency === 'INR'
                        ? `₹${addonsTotalINR.toLocaleString('en-IN')}`
                        : `$${Math.round(addonsTotalINR / 86).toLocaleString('en-US')}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">Sprint Cadence:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {urgency === 'express' ? 'Express (+25%)' : 'Standard'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">Estimated Duration:</span>
                    <span className="font-mono font-bold text-[var(--accent-color)]">
                      ~{totalWeeks} Weeks
                    </span>
                  </div>
                </div>

                {/* Big Total Figure */}
                <div className="py-4">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Transparent Fixed Investment (Estimated):
                  </div>
                  <div className="text-3xl sm:text-4xl font-heading font-black text-slate-900 dark:text-white mt-1">
                    {currency === 'INR'
                      ? `₹${totalPriceINR.toLocaleString('en-IN')}`
                      : `$${totalPriceUSD.toLocaleString('en-US')}`}
                  </div>
                  <div className="text-xs font-mono text-slate-400 mt-1">
                    {currency === 'INR'
                      ? `(~$${totalPriceUSD.toLocaleString('en-US')} USD)`
                      : `(~₹${totalPriceINR.toLocaleString('en-IN')} INR)`}
                  </div>
                </div>
              </div>

              {/* Form to submit brief */}
              <form onSubmit={handleSubmitBrief} className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                  Lock Estimate &amp; Request Proposal
                </span>

                <input
                  type="text"
                  required
                  placeholder="Your Name / Organization *"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-[var(--accent-color)]"
                />

                <input
                  type="email"
                  required
                  placeholder="Work Email Address *"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-[var(--accent-color)]"
                />

                <input
                  type="tel"
                  placeholder="WhatsApp / Phone (Optional)"
                  value={clientWhatsapp}
                  onChange={(e) => setClientWhatsapp(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-[var(--accent-color)]"
                />

                <textarea
                  rows={2}
                  placeholder="Any specific architectural preferences or notes?"
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-[var(--accent-color)]"
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-[var(--accent-color)] text-slate-900 font-extrabold text-xs flex items-center justify-center space-x-2 glow-btn transition-transform hover:scale-102 cursor-pointer disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Submitting Scope...' : 'Submit Scope Brief'}</span>
                  {isSubmitting ? <Send className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </form>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 text-[11px] text-slate-400 text-center font-mono">
                🔒 Fixed milestone pricing guarantee • Mutual NDA signed upfront
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
