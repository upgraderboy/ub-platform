'use client';

import React, { useState } from 'react';
import { Calculator, CheckCircle2, ArrowRight, ShieldCheck, Zap, Sparkles } from 'lucide-react';

interface PlatformOption {
  id: string;
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
    id: 'fullstack-ecosystem',
    name: 'Full Ecosystem (Web + Mobile + Decoupled CMS)',
    basePriceINR: 95000,
    baseDurationWeeks: 6,
    description: 'Unified monorepo, shared Zod schemas, web app, mobile app, and independent admin panel.',
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
];

export function BudgetEstimator() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('web');
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['auth-rbac']);
  const [urgency, setUrgency] = useState<'standard' | 'express'>('standard');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

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

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-xl">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-[var(--accent-glow)] border border-[var(--accent-border)] flex items-center justify-center text-[var(--accent-color)]">
          <Calculator className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl md:text-2xl font-heading font-black text-slate-900 dark:text-white">
            Interactive Project Budget Estimator
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Configure your technical scope to calculate transparent pricing and sprint turnaround.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Scope Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Platform */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3">
              Step 1: Choose Primary Architecture & Platform
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {PLATFORMS.map((item) => {
                const isSelected = selectedPlatform === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedPlatform(item.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[var(--accent-color)] bg-[var(--accent-glow)] ring-1 ring-[var(--accent-color)]'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="font-heading font-bold text-sm text-slate-900 dark:text-white mb-1">
                      {item.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-2">
                      {item.description}
                    </div>
                    <div className="text-xs font-mono font-bold text-[var(--accent-color)]">
                      from ₹{item.basePriceINR.toLocaleString('en-IN')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Add-on Capabilities */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3">
              Step 2: Select Technical Add-ons & Integrations
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ADDONS.map((addon) => {
                const isSelected = selectedAddons.includes(addon.id);
                return (
                  <div
                    key={addon.id}
                    onClick={() => toggleAddon(addon.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer flex items-start space-x-3 transition-all ${
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
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                        {addon.description}
                      </div>
                      <div className="text-[11px] font-mono text-[var(--accent-color)] font-semibold mt-1">
                        +₹{addon.priceINR.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 3: Speed & Timeline */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3">
              Step 3: Sprint Delivery Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUrgency('standard')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  urgency === 'standard'
                    ? 'border-[var(--accent-color)] bg-[var(--accent-glow)]'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40'
                }`}
              >
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-[var(--accent-color)]" />
                  <span>Standard Sprint</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Standard agile cadence with weekly reviews
                </div>
              </button>

              <button
                type="button"
                onClick={() => setUrgency('express')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  urgency === 'express'
                    ? 'border-[var(--accent-color)] bg-[var(--accent-glow)]'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40'
                }`}
              >
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Express Sprint (+25%)</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Dedicated priority capacity with rapid delivery
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Estimate & Brief Intake Form */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
              Scope Calculation Summary
            </div>

            <div className="space-y-3 mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 dark:text-slate-400">Core Platform</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  ₹{platform.basePriceINR.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 dark:text-slate-400">Add-ons ({selectedAddons.length})</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  ₹{addonsTotalINR.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 dark:text-slate-400">Estimated Delivery</span>
                <span className="font-mono font-bold text-[var(--accent-color)]">
                  ~{totalWeeks} Weeks
                </span>
              </div>
            </div>

            <div className="mb-6">
              <div className="text-xs text-slate-500 dark:text-slate-400">Total Investment (Estimated):</div>
              <div className="text-3xl md:text-4xl font-heading font-black text-slate-900 dark:text-white mt-1">
                ₹{totalPriceINR.toLocaleString('en-IN')}
              </div>
              <div className="text-xs font-mono text-slate-400 mt-1">
                (~${Math.round(totalPriceINR / 85).toLocaleString('en-US')} USD)
              </div>
            </div>

            {submitted ? (
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 text-sm">
                <div className="font-bold flex items-center space-x-1.5 mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>Brief Received!</span>
                </div>
                <p className="text-xs">
                  Ankit Bhuria will review your scope configuration and reply within 4 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Your Name / Organization"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[var(--accent-color)]"
                />
                <input
                  type="email"
                  required
                  placeholder="Your Work Email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[var(--accent-color)]"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[var(--accent-color)] text-slate-900 font-bold text-xs flex items-center justify-center space-x-2 glow-btn"
                >
                  <span>Lock Estimate & Submit Brief</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 text-center">
            🔒 Fixed-price guarantee & NDA signed prior to code kickoff.
          </div>
        </div>
      </div>
    </div>
  );
}
