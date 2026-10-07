import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  FileDown,
  Terminal as TerminalIcon,
  Trophy,
  GitBranch,
  ShieldCheck,
  Database,
  Cloud,
  Layers,
} from 'lucide-react';
import { LinkedinIcon, GithubIcon } from './SocialIcons';

export function HeroSection() {
  return (
    <section id="home" className="relative pt-28 pb-16 md:pt-40 md:pb-28 overflow-hidden bg-grid-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Typography & Human Agency Info */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Status / Location Badge */}
            <div className="inline-flex items-center space-x-2.5 bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-full text-xs font-mono shadow-sm">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-color)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--accent-color)]"></span>
              </span>
              <span className="text-slate-800 dark:text-slate-200 font-semibold">
                Available for Projects & Tech Consulting
              </span>
              <span className="text-slate-400">|</span>
              <span className="text-[var(--accent-color)] font-bold">Jhunjhunu, IN</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-6xl xl:text-7xl font-heading font-black tracking-tight leading-[1.08] text-slate-900 dark:text-white">
              Tech That Makes <br className="hidden sm:inline" />
              <span className="relative inline-block">
                <span className="text-[var(--accent-color)] glow-text">Trends.</span>
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-[var(--accent-color)] opacity-60"
                  viewBox="0 0 200 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M3 9C50 3 150 3 197 9" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
              <br />
              <span className="text-2xl sm:text-4xl lg:text-4xl font-extrabold text-slate-700 dark:text-slate-300">
                Engineering Scalable Realities.
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Hey, I&apos;m <strong className="text-slate-900 dark:text-white font-semibold">Ankit Bhuria</strong>, founder of{' '}
              <strong className="text-[var(--accent-color)] font-semibold">Upgrader Boy</strong>. We architect enterprise-grade
              MERN & Next.js applications, high-performance cloud backends, and lead India&apos;s energetic{' '}
              <span className="underline decoration-[var(--accent-color)] decoration-2 underline-offset-4 font-semibold">
                &ldquo;Learn in Public&rdquo;
              </span>{' '}
              developer movement.
            </p>

            {/* Tech Core Badges */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 pt-1">
              <span className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono font-medium text-slate-700 dark:text-slate-300 shadow-sm flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>React / Next.js 15</span>
              </span>
              <span className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono font-medium text-slate-700 dark:text-slate-300 shadow-sm flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5 text-green-500" />
                <span>Node.js & Express</span>
              </span>
              <span className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono font-medium text-slate-700 dark:text-slate-300 shadow-sm flex items-center space-x-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>MongoDB & SQL</span>
              </span>
              <span className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono font-medium text-slate-700 dark:text-slate-300 shadow-sm flex items-center space-x-1.5">
                <Cloud className="w-3.5 h-3.5 text-blue-400" />
                <span>DevOps & Cloud</span>
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-3">
              <Link
                href="#services"
                className="w-full sm:w-auto px-7 py-3.5 bg-[var(--accent-color)] text-slate-900 font-extrabold rounded-xl glow-btn text-center flex items-center justify-center space-x-2 text-sm shadow-md"
              >
                <span>Explore Services</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="/assets/UB-Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                download="Ankit_Bhuria_Resume.pdf"
                className="w-full sm:w-auto px-6 py-3.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-semibold rounded-xl hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] transition-all text-center flex items-center justify-center space-x-2 text-sm shadow-sm"
              >
                <FileDown className="w-4 h-4 text-[var(--accent-color)]" />
                <span>Download Resume</span>
              </a>
              <Link
                href="#terminal"
                className="w-full sm:w-auto px-5 py-3.5 bg-transparent border border-dashed border-slate-400 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:text-[var(--accent-color)] hover:border-[var(--accent-color)] font-mono text-xs rounded-xl transition-all text-center flex items-center justify-center space-x-2"
              >
                <TerminalIcon className="w-4 h-4 text-[var(--accent-color)]" />
                <span>Interactive Console</span>
              </Link>
            </div>

            {/* Credibility Metrics Bar */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
              <div className="text-left">
                <span className="block text-2xl sm:text-3xl font-heading font-black text-slate-900 dark:text-white">15+</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Shipped Projects</span>
              </div>
              <div className="text-left">
                <span className="block text-2xl sm:text-3xl font-heading font-black text-[var(--accent-color)] glow-text">1st Prize</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Smart India Hackathon</span>
              </div>
              <div className="text-left">
                <span className="block text-2xl sm:text-3xl font-heading font-black text-slate-900 dark:text-white">10K+</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Community Reach</span>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Composition with Ankit's Portrait */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            
            {/* Ambient Glow Halo */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--accent-color)]/20 via-blue-500/10 to-purple-500/10 rounded-3xl blur-2xl -z-10 transform scale-95" />

            {/* Container Frame */}
            <div className="relative w-full max-w-md mx-auto">
              
              {/* Top-Left Floating Badge: SIH Winner */}
              <div className="absolute -top-6 -left-4 sm:-left-6 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-2xl shadow-xl flex items-center space-x-3 animate-float">
                <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-500 flex items-center justify-center text-lg">
                  <Trophy className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <span className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider">Achievement</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">SIH Winner 2024</span>
                </div>
              </div>

              {/* Portrait Frame */}
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-950 p-1 border-2 border-slate-200 dark:border-slate-700 glow-box shadow-2xl transition-all">
                
                {/* Header bar */}
                <div className="bg-slate-100 dark:bg-slate-900 px-4 py-2.5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                    <span>ankit_bhuria.dev</span>
                  </span>
                  <span className="text-[10px] font-mono text-[var(--accent-color)] bg-[var(--accent-color)]/10 px-2 py-0.5 rounded">
                    Active
                  </span>
                </div>

                {/* Portrait Photo */}
                <div className="relative h-[360px] sm:h-[400px] w-full overflow-hidden bg-slate-900">
                  <Image
                    src="/assets/Ankit%20Bhuria.jpeg"
                    alt="Ankit Bhuria - Founder & Full-Stack Developer at Upgrader Boy"
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover object-top hover:scale-105 transition-transform duration-500"
                    priority
                  />
                  {/* Subtle bottom gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-85" />
                  
                  {/* Details Card Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 bg-slate-900/85 backdrop-blur-md border border-slate-700 p-3 rounded-xl text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-white">Ankit Bhuria</h4>
                        <p className="text-xs text-[var(--accent-color)] font-mono">Lead Architect & Agency Founder</p>
                      </div>
                      <div className="flex space-x-2">
                        <a
                          href="https://linkedin.com/in/upgraderboy/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 hover:text-[var(--accent-color)] hover:bg-slate-700 transition-colors"
                          aria-label="LinkedIn Profile"
                        >
                          <LinkedinIcon className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href="https://github.com/upgraderboy"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 hover:text-[var(--accent-color)] hover:bg-slate-700 transition-colors"
                          aria-label="GitHub Profile"
                        >
                          <GithubIcon className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom-Right Floating Glass Badge */}
              <div className="absolute -bottom-6 -right-4 sm:-right-6 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-2xl shadow-xl flex items-center space-x-3 animate-float-reverse">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-color)]/20 text-[var(--accent-color)] flex items-center justify-center text-lg">
                  <GitBranch className="w-5 h-5 text-[var(--accent-color)]" />
                </div>
                <div>
                  <span className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider">Mission</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Learn In Public 🇮🇳</span>
                </div>
              </div>

              {/* Bottom-Left Micro Pill */}
              <div className="absolute bottom-16 -left-6 z-20 hidden sm:flex items-center space-x-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl shadow-lg text-[11px] font-mono text-slate-800 dark:text-slate-200">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>MERN • Next.js • React Native</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
