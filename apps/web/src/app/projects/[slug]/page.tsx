import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { PROJECTS_DATA } from '../../../data/projectsData';
import {
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Trophy,
  Layers,
  Sparkles,
} from 'lucide-react';
import { GithubIcon } from '../../../components/SocialIcons';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PROJECTS_DATA.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS_DATA.find((p) => p.slug === slug);
  if (!project) return { title: 'Project Not Found | Upgrader Boy' };

  return {
    title: `${project.title} - Architectural Case Study | Upgrader Boy`,
    description: project.shortDescription,
  };
}

export default async function ProjectCaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = PROJECTS_DATA.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const { caseStudy } = project;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-800 dark:text-slate-100 flex flex-col pt-20">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Back navigation */}
        <Link
          href="/projects"
          className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-slate-500 hover:text-[var(--accent-color)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Projects</span>
        </Link>

        {/* Hero Section */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[var(--accent-glow)] text-[var(--accent-color)] text-xs font-mono font-bold border border-[var(--accent-border)]">
              {project.category.toUpperCase()}
            </span>
            {project.featured && (
              <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-mono font-bold border border-amber-500/30 flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>Featured Architecture</span>
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-heading font-black tracking-tight text-slate-900 dark:text-white">
            {project.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
            {project.shortDescription}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-lg text-xs font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center space-x-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[var(--accent-color)] text-xs font-bold transition-all"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>View Repository</span>
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[var(--accent-color)] text-slate-900 text-xs font-bold glow-btn transition-all"
                >
                  <span>Launch Live System</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Cover Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl h-80 sm:h-96">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.coverImage}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Case Study Breakdown Grid */}
        {caseStudy && (
          <div className="space-y-10">
            {/* Problem & Solution Dual Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 rounded-3xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center space-x-2 text-rose-500 font-mono text-xs font-bold uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4" />
                  <span>The Engineering Problem</span>
                </div>
                <h2 className="text-xl font-heading font-black text-slate-900 dark:text-white">
                  The Operational Bottleneck
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {caseStudy.problem}
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-white dark:bg-[#131C31] border border-[var(--accent-border)] bg-[var(--accent-glow)]/10 space-y-3">
                <div className="flex items-center space-x-2 text-[var(--accent-color)] font-mono text-xs font-bold uppercase tracking-wider">
                  <Layers className="w-4 h-4" />
                  <span>The Architectural Solution</span>
                </div>
                <h2 className="text-xl font-heading font-black text-slate-900 dark:text-white">
                  System Design & Implementation
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {caseStudy.solution}
                </p>
              </div>
            </div>

            {/* Key Engineering Features */}
            <div className="p-8 rounded-3xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 space-y-6">
              <div className="flex items-center space-x-2 font-mono text-xs font-bold text-slate-400 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-[var(--accent-color)]" />
                <span>Core Technical Capabilities</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {caseStudy.keyFeatures.map((feat, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 flex items-start space-x-3"
                  >
                    <span className="w-6 h-6 rounded-lg bg-[var(--accent-glow)] text-[var(--accent-color)] font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      0{index + 1}
                    </span>
                    <span className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {feat}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Challenges & Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {caseStudy.challenges && (
                <div className="p-8 rounded-3xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="text-xs font-mono font-bold text-amber-500 uppercase tracking-wider">
                    Edge Case & Concurrency Challenges
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {caseStudy.challenges}
                  </p>
                </div>
              )}

              {caseStudy.results && (
                <div className="p-8 rounded-3xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center space-x-2 text-[var(--accent-color)] font-mono text-xs font-bold uppercase tracking-wider">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>Impact & Verification Metrics</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {caseStudy.results}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CTA Banner */}
        <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 text-center space-y-4">
          <h2 className="text-2xl font-heading font-black">
            Have a project with similar technical complexity?
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            We architect end-to-end platforms with clean boundaries, high performance, and rapid sprint execution.
          </p>
          <Link
            href="/services#estimator"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-[var(--accent-color)] text-slate-900 font-bold text-xs glow-btn"
          >
            <span>Estimate Your Architecture</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
