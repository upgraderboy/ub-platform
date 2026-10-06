'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Globe, Brain, Smartphone, ArrowRight } from 'lucide-react';

interface Project {
  id: string;
  category: 'mern' | 'ai' | 'mobile';
  badge: string;
  version: string;
  title: string;
  description: string;
  tags: string[];
  status: string;
  icon: typeof Globe;
}

export function PortfolioSection() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'mern' | 'ai' | 'mobile'>('all');

  const projects: Project[] = [
    {
      id: 'devflow',
      category: 'mern',
      badge: 'Next.js SaaS Platform',
      version: 'v2.4',
      title: 'DevFlow Enterprise Dashboard',
      description:
        'Full-stack analytics and developer productivity platform featuring real-time telemetry and cloud sync.',
      tags: ['Next.js 15', 'Tailwind', 'MongoDB'],
      status: 'Live Production',
      icon: Globe,
    },
    {
      id: 'upgraderai',
      category: 'ai',
      badge: 'AI Code Assistant',
      version: 'v1.0',
      title: 'UpgraderAI Code Copilot',
      description:
        'AI-powered tool providing instant code refactoring, bug fixing, and MERN boilerplate generation.',
      tags: ['Python', 'Gemini / AI', 'React'],
      status: 'Open Source',
      icon: Brain,
    },
    {
      id: 'learninpublic',
      category: 'mobile',
      badge: 'Cross-Platform App',
      version: 'v1.2',
      title: 'LearnInPublic Community App',
      description:
        'Mobile app for developers to share daily progress, code snippets, and connect with mentors across India.',
      tags: ['React Native', 'Firebase', 'Node.js'],
      status: 'Play Store',
      icon: Smartphone,
    },
  ];

  const filteredProjects =
    activeFilter === 'all'
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  return (
    <section id="portfolio" className="py-24 bg-slate-100/70 dark:bg-slate-800/50 border-y border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-[var(--accent-color)] font-mono text-xs font-bold uppercase tracking-widest bg-[var(--accent-color)]/10 px-3 py-1 rounded-full border border-[var(--accent-color)]/20">
            # Featured Work
          </span>
          <h2 className="text-3xl sm:text-5xl font-heading font-extrabold tracking-tight text-slate-900 dark:text-white">
            Recent Projects & Creations
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
            Explore our top-tier web applications, developer tools, and client solutions engineered with precision.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center space-x-2 sm:space-x-4 mb-12 flex-wrap gap-y-2">
          {(
            [
              { key: 'all', label: 'All Projects' },
              { key: 'mern', label: 'MERN & Next.js' },
              { key: 'ai', label: 'AI & Tools' },
              { key: 'mobile', label: 'Mobile Apps' },
            ] as const
          ).map((tab) => {
            const isActive = activeFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm ${
                  isActive
                    ? 'bg-[var(--accent-color)] text-slate-900 font-bold'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-[var(--accent-color)] border border-slate-200 dark:border-slate-700'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.id}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden hover:border-[var(--accent-color)] hover:shadow-xl transition-all group"
              >
                {/* Project Header Visual */}
                <div className="h-48 bg-slate-950 relative overflow-hidden flex items-center justify-center p-6 border-b border-slate-200 dark:border-slate-700">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-color)]/20 to-transparent" />
                  <Icon className="text-[var(--accent-color)] w-16 h-16 group-hover:scale-110 transition-transform relative z-10" />
                </div>

                {/* Project Content */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-[var(--accent-color)] font-semibold">{p.badge}</span>
                    <span className="text-xs text-slate-400 font-mono">{p.version}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{p.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{p.description}</p>
                  
                  <div className="flex flex-wrap gap-2 pt-2">
                    {p.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 bg-slate-100 dark:bg-slate-900 rounded text-xs font-mono text-slate-700 dark:text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-700">
                    <Link
                      href="#contact"
                      className="text-sm font-semibold text-[var(--accent-color)] hover:underline flex items-center space-x-1"
                    >
                      <span>Request Demo</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <span className="text-xs font-mono text-slate-400">{p.status}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
