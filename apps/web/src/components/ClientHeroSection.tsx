'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Send,
  ArrowRight,
  FileDown,
  Trophy,
  Briefcase,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import {
  GithubIcon,
  LinkedinIcon,
  InstagramIcon,
  TwitterXIcon,
} from './SocialIcons';

const SOCIAL_LINKS = [
  { icon: GithubIcon, label: 'GitHub', href: 'https://github.com/upgraderboy' },
  { icon: LinkedinIcon, label: 'LinkedIn', href: 'https://linkedin.com/in/upgraderboy' },
  { icon: InstagramIcon, label: 'Instagram', href: 'https://instagram.com/upgraderboy' },
  { icon: TwitterXIcon, label: 'Twitter / X', href: 'https://x.com/upgraderboy' },
];

export function ClientHeroSection() {
  return (
    <section id="home" className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left: Floating Social Rail (Hidden on small mobile, visible sm+) */}
          <div className="hidden sm:flex lg:col-span-1 flex-col items-center space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 -rotate-90 origin-center mb-6">
              Connect
            </span>
            {SOCIAL_LINKS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white dark:bg-[#171F38] border border-slate-200 dark:border-slate-700/80 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-[var(--accent-color)] hover:border-[var(--accent-color)] hover:scale-110 transition-all shadow-xs"
                title={item.label}
                aria-label={item.label}
              >
                <item.icon className="w-4 h-4" />
              </a>
            ))}
            <div className="w-px h-12 bg-slate-300 dark:bg-slate-700" />
          </div>

          {/* Center/Left: Human Agency Pitch & Greeting */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            
            {/* Live Availability Badge */}
            <div className="inline-flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-3.5 py-1.5 rounded-full text-xs shadow-2xs">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-800 dark:text-emerald-300 font-semibold">
                Available for New Projects & Product Advisory
              </span>
            </div>

            {/* Main Greeting with Iconic Waving Hand */}
            <div>
              <div className="flex items-center justify-center lg:justify-start space-x-3 mb-2">
                <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-heading font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                  Hi, I&apos;m <span className="text-[var(--accent-color)]">Ankit Bhuria</span>
                </h1>
                
                {/* Waving Hand SVG from Original Portfolio */}
                <span className="inline-block animate-wave text-3xl sm:text-4xl select-none" role="img" aria-label="Waving hand">
                  👋
                </span>
              </div>

              {/* Signature Horizontal Accent Rule Subtitle */}
              <div className="flex items-center justify-center lg:justify-start space-x-3 text-slate-700 dark:text-slate-300 font-heading text-lg sm:text-xl font-bold">
                <span className="w-8 sm:w-12 h-0.5 bg-[var(--accent-color)] rounded-full" />
                <span>Full-Stack Web &amp; Mobile Architect</span>
              </div>
            </div>

            {/* High-Impact Human Copywriting */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Founder of <strong className="text-slate-900 dark:text-white font-semibold">Upgrader Boy</strong>. I architect high-performance web platforms and native mobile apps that help founders and businesses turn ambitious ideas into reality.
            </p>

            {/* Client Deliverable Badges */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 pt-1">
              {[
                'Next.js 15 Web Platforms',
                'iOS & Android Mobile',
                'Cloud Architecture & APIs',
                '100% On-Time SLA',
              ].map((badge) => (
                <span
                  key={badge}
                  className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-[#171F38] border border-slate-200 dark:border-slate-700/80 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5 shadow-2xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                  <span>{badge}</span>
                </span>
              ))}
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <Link
                href="/contact"
                className="w-full sm:w-auto px-7 py-3.5 bg-[var(--accent-color)] text-slate-950 font-extrabold rounded-xl glow-btn text-center flex items-center justify-center space-x-2 text-sm shadow-md"
              >
                <span>Say Hello</span>
                <Send className="w-4 h-4" />
              </Link>
              
              <Link
                href="#projects"
                className="w-full sm:w-auto px-6 py-3.5 bg-white dark:bg-[#171F38] border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold rounded-xl hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] transition-all text-center flex items-center justify-center space-x-2 text-sm shadow-2xs"
              >
                <span>View Portfolio</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="/assets/UB-Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                download="Ankit_Bhuria_Resume.pdf"
                className="w-full sm:w-auto px-5 py-3.5 bg-transparent border border-slate-300 dark:border-slate-700/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl transition-all text-center flex items-center justify-center space-x-2 text-xs font-semibold"
              >
                <FileDown className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                <span>Resume</span>
              </a>
            </div>

            {/* Client Proof Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
              <div className="text-left">
                <span className="block text-2xl sm:text-3xl font-heading font-black text-slate-900 dark:text-white">
                  15+
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Shipped Products
                </span>
              </div>
              <div className="text-left">
                <span className="block text-2xl sm:text-3xl font-heading font-black text-[var(--accent-color)]">
                  1st Prize
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Smart India Hackathon
                </span>
              </div>
              <div className="text-left">
                <span className="block text-2xl sm:text-3xl font-heading font-black text-slate-900 dark:text-white">
                  100%
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Delivery Guarantee
                </span>
              </div>
            </div>

          </div>

          {/* Right: Modern Organic Portrait Card with Floating Achievement Badges */}
          <div className="lg:col-span-5 relative flex items-center justify-center pt-4 lg:pt-0">
            
            {/* Ambient Background Glow Halo */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--accent-color)]/25 via-emerald-500/15 to-blue-500/10 rounded-3xl blur-3xl -z-10 transform scale-95" />

            <div className="relative w-full max-w-[340px] sm:max-w-[380px]">
              
              {/* Profile Card Container with Midnight Navy Frame */}
              <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-[#171F38] border-2 border-slate-200 dark:border-slate-700/80 shadow-2xl p-3">
                <div className="relative h-[340px] sm:h-[400px] w-full rounded-2xl overflow-hidden bg-slate-900">
                  <Image
                    src="/assets/Ankit Bhuria.jpeg"
                    alt="Ankit Bhuria - Founder & Software Architect"
                    fill
                    priority
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 340px, 400px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  {/* Name overlay at bottom */}
                  <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-heading font-bold text-slate-900 dark:text-white">Ankit Bhuria</p>
                      <p className="text-[10px] font-mono text-[var(--accent-color)]">Founder @ Upgrader Boy</p>
                    </div>
                    <span className="text-[10px] font-mono bg-[var(--accent-color)]/10 text-[var(--accent-color)] px-2 py-0.5 rounded-full border border-[var(--accent-color)]/20 font-bold">
                      Jhunjhunu, IN
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Chip 1: SIH 2024 Winner (Top Left) */}
              <div className="absolute -top-3 -left-3 sm:-left-6 px-3 py-2 rounded-2xl bg-white/95 dark:bg-[#171F38]/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700 shadow-xl flex items-center space-x-2 animate-bounce-subtle">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                  <Trophy className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-slate-400 leading-none">National Champion</p>
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">SIH 2024 Winner</p>
                </div>
              </div>

              {/* Floating Chip 2: 3+ Years Exp (Bottom Right) */}
              <div className="absolute -bottom-4 -right-3 sm:-right-4 px-3.5 py-2 rounded-2xl bg-white/95 dark:bg-[#171F38]/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700 shadow-xl flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/30 flex items-center justify-center text-[var(--accent-color)]">
                  <Briefcase className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-slate-400 leading-none">Commercial Tech</p>
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">3+ Years Shipped</p>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Bottom: Smooth Scroll Down Prompt */}
        <div className="mt-12 flex flex-col items-center justify-center text-center">
          <a
            href="#about"
            className="group flex flex-col items-center space-y-1 text-slate-400 hover:text-[var(--accent-color)] transition-colors"
            aria-label="Scroll to about section"
          >
            <span className="text-[10px] font-mono tracking-widest uppercase">Scroll Down</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </a>
        </div>

      </div>
    </section>
  );
}
