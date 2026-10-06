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
  Info,
  Trophy,
} from 'lucide-react';
import { GithubIcon } from './SocialIcons';

interface MonthGroup {
  id: string;
  monthYearTitle: string;
  badge: 'featured' | 'in_development' | 'month';
  projects: Project[];
}

interface GooglePhotosProjectGridProps {
  projects: Project[];
}

export function GooglePhotosProjectGrid({ projects }: GooglePhotosProjectGridProps) {
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  // Group projects like Google Photos:
  // 1. Featured Flagships (pinned at top if any match)
  // 2. Chronological groups by Month & Year (December 2024, November 2024, October 2024, etc.)
  const groups: MonthGroup[] = [];

  // Pinned: Featured
  const featured = projects.filter((p) => p.featured);
  if (featured.length > 0) {
    groups.push({
      id: 'featured-flagships',
      monthYearTitle: '⭐ Featured & Flagships',
      badge: 'featured',
      projects: featured,
    });
  }

  // Active Builds (not already in featured)
  const inDev = projects.filter((p) => p.status === 'in_development' && !p.featured);
  if (inDev.length > 0) {
    groups.push({
      id: 'in-development',
      monthYearTitle: '🚧 In Active Development',
      badge: 'in_development',
      projects: inDev,
    });
  }

  // Chronological Month Buckets (excluding featured & inDev above to avoid duplication)
  const remaining = projects.filter(
    (p) => !(p.featured || (p.status === 'in_development' && !p.featured))
  );

  const monthBuckets: Record<string, Project[]> = {};
  remaining.forEach((p) => {
    const d = new Date(p.createdAt);
    const key = d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    if (!monthBuckets[key]) monthBuckets[key] = [];
    monthBuckets[key].push(p);
  });

  Object.entries(monthBuckets).forEach(([monthYear, projs]) => {
    groups.push({
      id: monthYear.toLowerCase().replace(/\s+/g, '-'),
      monthYearTitle: monthYear,
      badge: 'month',
      projects: projs,
    });
  });

  if (projects.length === 0) {
    return (
      <div className="py-24 text-center bg-white dark:bg-[#131C31] rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
          <Layers className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-heading font-black text-slate-900 dark:text-white">
          No projects found in this interval
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Try expanding your date range in the calendar picker or clearing active filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {groups.map((group) => (
        <section key={group.id} className="space-y-4">
          {/* Google Photos Month Timestamp Header */}
          <div className="py-2.5 px-4 rounded-2xl bg-slate-100/70 dark:bg-[#131C31]/70 border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-2">
              <span className="font-heading font-black text-base sm:text-lg text-slate-900 dark:text-white tracking-tight">
                {group.monthYearTitle}
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                {group.projects.length}
              </span>
            </div>

            <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
              {group.badge === 'featured' && (
                <span className="flex items-center space-x-1 text-amber-500 font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Curated</span>
                </span>
              )}
              {group.badge === 'in_development' && (
                <span className="flex items-center space-x-1 text-cyan-400 font-bold">
                  <Hammer className="w-3.5 h-3.5" />
                  <span>Lab Builds</span>
                </span>
              )}
              {group.badge === 'month' && (
                <span className="flex items-center space-x-1 text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Milestone</span>
                </span>
              )}
            </div>
          </div>

          {/* Compact Multi-Card Grid (3 to 4 cards per row on desktop!) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {group.projects.map((project) => {
              const formattedDate = new Date(project.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              });

              return (
                <div
                  key={project.id}
                  className="group bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 hover:border-[var(--accent-color)] rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between"
                >
                  <div>
                    {/* Compact Image Container with Badges */}
                    <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={project.coverImage}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 uppercase">
                          {project.category}
                        </span>

                        {project.status === 'winner' && (
                          <span className="inline-flex items-center space-x-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 shadow-md">
                            <Trophy className="w-3 h-3" />
                            <span>Winner</span>
                          </span>
                        )}
                        {project.status === 'in_development' && (
                          <span className="inline-flex items-center space-x-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-400 text-slate-950 shadow-md">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-900 animate-ping" />
                            <span>In Dev</span>
                          </span>
                        )}
                      </div>

                      {/* Bottom Image Date Label */}
                      <div className="absolute bottom-2.5 right-3 text-[11px] font-mono text-white/90 drop-shadow">
                        {formattedDate}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 space-y-3">
                      <h3 className="font-heading font-black text-base text-slate-900 dark:text-white group-hover:text-[var(--accent-color)] transition-colors line-clamp-1">
                        {project.title}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {project.shortDescription}
                      </p>

                      {/* Tech Stack Pills */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60"
                          >
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-400">
                            +{project.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 mt-1">
                    <button
                      onClick={() => setActiveModalProject(project)}
                      className="inline-flex items-center space-x-1 text-xs font-bold text-[var(--accent-color)] hover:underline cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>Quick Details</span>
                    </button>

                    <div className="flex items-center space-x-1.5">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-[var(--accent-color)] transition-colors"
                          title="GitHub Repository"
                        >
                          <GithubIcon className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-[var(--accent-color)] transition-colors"
                          title="Live Demo"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {/* Quick Details Modal */}
      {activeModalProject && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setActiveModalProject(null)}
        >
          <div
            className="w-full max-w-xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-7 space-y-5 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--accent-color)]">
                  {activeModalProject.category} • {new Date(activeModalProject.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <h3 className="text-lg sm:text-xl font-heading font-black text-slate-900 dark:text-white mt-1">
                  {activeModalProject.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalProject(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Problem & Solution Cards */}
            {activeModalProject.caseStudy && (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[11px] font-mono font-bold text-rose-500 uppercase">
                    Challenge Addressed
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {activeModalProject.caseStudy.problem}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--accent-glow)]/15 border border-[var(--accent-border)] space-y-1">
                  <span className="text-[11px] font-mono font-bold text-[var(--accent-color)] uppercase">
                    Engineering Solution
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                    {activeModalProject.caseStudy.solution}
                  </p>
                </div>

                {activeModalProject.caseStudy.keyFeatures && (
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[11px] font-mono font-bold text-slate-400 uppercase">
                      Key Highlights:
                    </div>
                    {activeModalProject.caseStudy.keyFeatures.map((feat, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent-color)] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {activeModalProject.tags.slice(0, 3).map((t) => (
                  <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                {activeModalProject.githubUrl && (
                  <a
                    href={activeModalProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold hover:text-[var(--accent-color)]"
                  >
                    GitHub
                  </a>
                )}
                {activeModalProject.demoUrl && (
                  <a
                    href={activeModalProject.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-1.5 rounded-xl bg-[var(--accent-color)] text-slate-900 text-xs font-bold glow-btn"
                  >
                    Launch Live
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
