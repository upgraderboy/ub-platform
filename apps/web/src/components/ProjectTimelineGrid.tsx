'use client';

import React, { useState } from 'react';
import { Project } from '@ub/types';
import {
  Sparkles,
  Hammer,
  ExternalLink,
  Calendar,
  X,
  CheckCircle2,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { GithubIcon } from './SocialIcons';

interface TimelineGroup {
  id: string;
  title: string;
  subtitle: string;
  badgeType: 'featured' | 'in_development' | 'timeline';
  projects: Project[];
}

interface ProjectTimelineGridProps {
  projects: Project[];
  selectedCategory: string;
}

export function ProjectTimelineGrid({
  projects,
  selectedCategory,
}: ProjectTimelineGridProps) {
  const [activeProjectModal, setActiveProjectModal] = useState<Project | null>(null);

  // 1. Group projects by Featured, In Development, and Month/Year
  const groups: TimelineGroup[] = [];

  // Group A: Featured / Handpicked Flagship
  const featured = projects.filter((p) => p.featured);
  if (featured.length > 0) {
    groups.push({
      id: 'featured',
      title: 'Featured Flagships & Award Winners',
      subtitle: 'High-impact architectures handpicked by Ankit Bhuria',
      badgeType: 'featured',
      projects: featured,
    });
  }

  // Group B: In Active Development / In The Lab
  const inDev = projects.filter((p) => p.status === 'in_development' && !p.featured);
  if (inDev.length > 0) {
    groups.push({
      id: 'in-dev',
      title: 'In Active Development (Lab R&D)',
      subtitle: 'Current prototypes and architectural experiments under active engineering',
      badgeType: 'in_development',
      projects: inDev,
    });
  }

  // Group C: Chronological Monthly Historical Milestones
  // We sort remaining projects by createdAt descending and bucket them by month-year
  const historical = projects.filter(
    (p) => !(p.featured || (p.status === 'in_development' && !p.featured))
  );

  const monthBuckets: Record<string, Project[]> = {};
  historical.forEach((p) => {
    const d = new Date(p.createdAt);
    const key = d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    if (!monthBuckets[key]) monthBuckets[key] = [];
    monthBuckets[key].push(p);
  });

  Object.entries(monthBuckets).forEach(([monthYear, projs]) => {
    groups.push({
      id: monthYear.toLowerCase().replace(/\s+/g, '-'),
      title: monthYear,
      subtitle: `${projs.length} verified project release${projs.length === 1 ? '' : 's'}`,
      badgeType: 'timeline',
      projects: projs,
    });
  });

  if (projects.length === 0) {
    return (
      <div className="py-20 text-center bg-white dark:bg-[#131C31] rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
          <Layers className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-heading font-bold text-slate-800 dark:text-white">
          No projects found
        </h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          Try clearing your search query or switching to &ldquo;All Time&rdquo; in the filters above.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {groups.map((group) => (
        <section key={group.id} className="relative">
          {/* Timeline Section Header */}
          <div className="flex items-center space-x-3 mb-8">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm shrink-0 border ${
                group.badgeType === 'featured'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                  : group.badgeType === 'in_development'
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                  : 'bg-[var(--accent-glow)] border-[var(--accent-border)] text-[var(--accent-color)]'
              }`}
            >
              {group.badgeType === 'featured' && <Sparkles className="w-5 h-5" />}
              {group.badgeType === 'in_development' && <Hammer className="w-5 h-5" />}
              {group.badgeType === 'timeline' && <Calendar className="w-5 h-5" />}
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl md:text-2xl font-heading font-black text-slate-900 dark:text-white tracking-tight">
                  {group.title}
                </h2>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                  {group.projects.length}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {group.subtitle}
                {selectedCategory !== 'all' && ` • in ${selectedCategory}`}
              </p>
            </div>
          </div>

          {/* Connected Timeline Rail Container */}
          <div className="relative pl-4 sm:pl-8 border-l-2 border-slate-200 dark:border-slate-800 space-y-8 ml-4 sm:ml-5">
            {group.projects.map((project) => {
              const dateLabel = new Date(project.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric',
              });

              return (
                <div key={project.id} className="relative group">
                  {/* Glowing Node on Timeline Rail */}
                  <div className="absolute -left-[23px] sm:-left-[39px] top-6 w-3.5 h-3.5 rounded-full bg-white dark:bg-slate-900 border-2 border-[var(--accent-color)] group-hover:scale-125 transition-transform shadow-[0_0_8px_var(--accent-color)]" />

                  {/* Clean Project Card */}
                  <div className="bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 hover:border-[var(--accent-color)] rounded-3xl p-6 md:p-8 transition-all shadow-sm hover:shadow-xl space-y-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      
                      {/* Left: Thumbnail & Core Info */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 min-w-0 flex-1">
                        {/* Compact Visual Preview */}
                        <div className="relative w-full sm:w-44 h-32 sm:h-28 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={project.coverImage}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {project.status === 'winner' && (
                            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-mono font-bold text-[10px] shadow">
                              SIH Winner
                            </div>
                          )}
                          {project.status === 'in_development' && (
                            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-cyan-400 text-slate-950 font-mono font-bold text-[10px] shadow">
                              In Dev
                            </div>
                          )}
                        </div>

                        {/* Title & Short Bio */}
                        <div className="space-y-1.5 min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[var(--accent-glow)] text-[var(--accent-color)] border border-[var(--accent-border)] uppercase">
                              {project.category}
                            </span>
                            <span className="text-[11px] font-mono text-slate-400">
                              {dateLabel}
                            </span>
                          </div>

                          <h3 className="text-lg md:text-xl font-heading font-black text-slate-900 dark:text-white group-hover:text-[var(--accent-color)] transition-colors">
                            {project.title}
                          </h3>

                          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                            {project.shortDescription}
                          </p>
                        </div>
                      </div>

                      {/* Right: Action Buttons & Quick View */}
                      <div className="flex items-center space-x-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-[var(--accent-color)] border border-slate-200 dark:border-slate-700 transition-colors"
                            title="GitHub Repository"
                          >
                            <GithubIcon className="w-4 h-4" />
                          </a>
                        )}

                        {project.demoUrl && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-[var(--accent-color)] border border-slate-200 dark:border-slate-700 transition-colors"
                            title="Live Demo"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}

                        <button
                          onClick={() => setActiveProjectModal(project)}
                          className="px-4 py-2.5 rounded-xl bg-[var(--accent-color)] text-slate-900 font-bold text-xs flex items-center space-x-1.5 glow-btn transition-transform hover:scale-105 cursor-pointer"
                        >
                          <span>Quick Breakdown</span>
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Tech Badges Row */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                      {project.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[11px] font-mono px-2.5 py-0.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {/* Lightweight Quick Breakdown Modal (Clean & Non-Overwhelming) */}
      {activeProjectModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setActiveProjectModal(null)}
        >
          <div
            className="w-full max-w-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--accent-color)]">
                  {activeProjectModal.category} • Milestone Review
                </span>
                <h3 className="text-xl sm:text-2xl font-heading font-black text-slate-900 dark:text-white mt-1">
                  {activeProjectModal.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveProjectModal(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Problem & Solution Clean 2-Card Layout */}
            {activeProjectModal.caseStudy && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[11px] font-mono font-bold text-rose-500 uppercase">
                    Problem Solved
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {activeProjectModal.caseStudy.problem}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--accent-glow)]/15 border border-[var(--accent-border)] space-y-1">
                  <span className="text-[11px] font-mono font-bold text-[var(--accent-color)] uppercase">
                    Architectural Solution
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                    {activeProjectModal.caseStudy.solution}
                  </p>
                </div>
              </div>
            )}

            {/* Key Deliverables */}
            {activeProjectModal.caseStudy?.keyFeatures && (
              <div className="space-y-2">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  Key Technical Features:
                </div>
                <div className="space-y-1.5">
                  {activeProjectModal.caseStudy.keyFeatures.map((feat, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent-color)] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex flex-wrap gap-1.5">
                {activeProjectModal.tags.slice(0, 3).map((t) => (
                  <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                {activeProjectModal.githubUrl && (
                  <a
                    href={activeProjectModal.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold hover:text-[var(--accent-color)]"
                  >
                    GitHub
                  </a>
                )}
                {activeProjectModal.demoUrl && (
                  <a
                    href={activeProjectModal.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-1.5 rounded-xl bg-[var(--accent-color)] text-slate-900 text-xs font-bold glow-btn"
                  >
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
