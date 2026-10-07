'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import {
  Trophy,
  GitBranch,
  ShieldCheck,
  Sparkles,
  Camera,
  Cpu,
  Flame,
  ExternalLink,
} from 'lucide-react';
import { LinkedinIcon, GithubIcon } from './SocialIcons';

type AvatarMode = '3d' | 'real' | 'cyber';

interface ModeConfig {
  id: AvatarMode;
  label: string;
  icon: React.ReactNode;
  src: string;
  alt: string;
  tagline: string;
  accent: string;
}

const MODES: ModeConfig[] = [
  {
    id: '3d',
    label: '3D Avatar',
    icon: <Sparkles className="w-3.5 h-3.5" />,
    src: '/assets/upgraderboy-3d-avatar.jpg',
    alt: 'Ankit Bhuria - 3D Cyber Developer Avatar (Upgrader Boy)',
    tagline: '3D Pixar-Rendered Cyber Developer Persona',
    accent: 'var(--accent-color)',
  },
  {
    id: 'real',
    label: 'Real Life',
    icon: <Camera className="w-3.5 h-3.5" />,
    src: '/assets/Ankit%20Bhuria.jpeg',
    alt: 'Ankit Bhuria - Founder & Full-Stack Architect',
    tagline: 'Lead Architect & Agency Founder',
    accent: '#38bdf8',
  },
  {
    id: 'cyber',
    label: 'Brand Emblem',
    icon: <Cpu className="w-3.5 h-3.5" />,
    src: '/assets/upgraderboy-cyber-badge.png',
    alt: 'Upgrader Boy - Official Cyber Dev Identity & Monogram',
    tagline: 'Tech That Makes Trends • Dev Identity',
    accent: '#a855f7',
  },
];

export function HeroAvatarCard() {
  const [currentMode, setCurrentMode] = useState<AvatarMode>('3d');
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const playCyberBlip = useCallback(() => {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Audio context policy fallback
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -9;
    const rotateY = ((x - centerX) / centerX) * 9;
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ rotateX, rotateY, glareX, glareY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const activeConfig = MODES.find((m) => m.id === currentMode) || MODES[0];

  return (
    <div className="relative w-full max-w-md mx-auto perspective-1000">
      
      {/* Top-Left Floating Badge: SIH Winner */}
      <div className="absolute -top-6 -left-4 sm:-left-6 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-2xl shadow-xl flex items-center space-x-3 animate-float pointer-events-none">
        <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-500 flex items-center justify-center text-lg shadow-inner">
          <Trophy className="w-5 h-5 text-amber-500" />
        </div>
        <div>
          <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">National Milestone</span>
          <span className="text-xs font-bold text-slate-900 dark:text-white">SIH Winner 2024 🏆</span>
        </div>
      </div>

      {/* Main Interactive 3D Card */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) ${
            isHovered ? 'scale3d(1.02, 1.02, 1.02)' : 'scale3d(1, 1, 1)'
          }`,
          transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.4s ease-out',
        }}
        className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-950 p-1 border-2 border-slate-300 dark:border-slate-700/80 glow-box shadow-2xl group transition-all"
      >
        {/* Holographic Dynamic Glare Follower */}
        <div
          className="absolute inset-0 pointer-events-none z-20 rounded-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 240px at ${tilt.glareX}% ${tilt.glareY}%, rgba(255, 255, 255, 0.35), transparent 70%)`,
          }}
        />

        {/* Card Header Bar with Interactive Avatar Mode Switcher */}
        <div className="bg-slate-100 dark:bg-slate-900/95 px-3.5 py-2.5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 z-10 relative">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
          </div>

          {/* Mode Switcher Segmented Control */}
          <div className="flex items-center bg-slate-200/80 dark:bg-slate-800/80 p-0.5 rounded-xl border border-slate-300 dark:border-slate-700">
            {MODES.map((mode) => {
              const isSelected = currentMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => {
                    setCurrentMode(mode.id);
                    playCyberBlip();
                  }}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all ${
                    isSelected
                      ? 'bg-[var(--accent-color)] text-slate-950 font-bold shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  aria-label={`Switch to ${mode.label}`}
                >
                  {mode.icon}
                  <span className="hidden sm:inline">{mode.label}</span>
                </button>
              );
            })}
          </div>

          {/* Live Pulse Indicator */}
          <div className="flex items-center space-x-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[10px] font-mono text-emerald-500 dark:text-emerald-400 font-bold hidden sm:inline">
              LIVE
            </span>
          </div>
        </div>

        {/* Visual Frame */}
        <div className="relative h-[380px] sm:h-[420px] w-full overflow-hidden bg-slate-950">
          <Image
            key={activeConfig.src}
            src={activeConfig.src}
            alt={activeConfig.alt}
            fill
            sizes="(max-width: 768px) 100vw, 420px"
            className="object-cover object-center group-hover:scale-105 transition-all duration-700 ease-out"
            priority
          />

          {/* Holographic Cyber Scanline Effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--accent-color)]/[0.04] to-transparent pointer-events-none opacity-60 animate-pulse" />

          {/* Dark Vignette and Depth Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90 pointer-events-none" />

          {/* Top-Right Pill on Image */}
          <div className="absolute top-3 right-3 z-10 bg-slate-900/80 backdrop-blur-md border border-slate-700/80 px-2.5 py-1 rounded-full text-[10px] font-mono text-[var(--accent-color)] flex items-center space-x-1 shadow-md">
            <Flame className="w-3 h-3 text-[var(--accent-color)]" />
            <span>DEV MODE: ON</span>
          </div>

          {/* Bottom Interactive Glass Deck */}
          <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-3.5 rounded-2xl text-white shadow-2xl z-10 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                    Ankit Bhuria
                  </h4>
                  <span className="text-[10px] font-mono bg-[var(--accent-color)]/20 text-[var(--accent-color)] px-1.5 py-0.5 rounded border border-[var(--accent-color)]/30">
                    @upgraderboy
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-mono mt-0.5">
                  {activeConfig.tagline}
                </p>
              </div>

              {/* Social Channels Fast Access */}
              <div className="flex items-center space-x-1.5">
                <a
                  href="https://linkedin.com/in/upgraderboy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-[var(--accent-color)] hover:border-[var(--accent-color)] transition-all"
                  aria-label="LinkedIn Profile"
                >
                  <LinkedinIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://github.com/upgraderboy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-[var(--accent-color)] hover:border-[var(--accent-color)] transition-all"
                  aria-label="GitHub Profile"
                >
                  <GithubIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://x.com/upgraderboy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-[var(--accent-color)] hover:border-[var(--accent-color)] transition-all"
                  aria-label="X Twitter Profile"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Micro Specs Bar */}
            <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3 text-[var(--accent-color)]" />
                <span>Next.js 15 • React Native • AI</span>
              </span>
              <span className="text-slate-500">Jhunjhunu, IN</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom-Right Floating Glass Badge */}
      <div className="absolute -bottom-6 -right-4 sm:-right-6 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-2xl shadow-xl flex items-center space-x-3 animate-float-reverse pointer-events-none">
        <div className="w-10 h-10 rounded-xl bg-[var(--accent-color)]/20 text-[var(--accent-color)] flex items-center justify-center text-lg">
          <GitBranch className="w-5 h-5 text-[var(--accent-color)]" />
        </div>
        <div>
          <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">Dev Philosophy</span>
          <span className="text-xs font-bold text-slate-900 dark:text-white">Learn In Public 🇮🇳</span>
        </div>
      </div>

      {/* Bottom-Left Micro Floating Badge */}
      <div className="absolute bottom-16 -left-6 z-30 hidden sm:flex items-center space-x-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl shadow-lg text-[11px] font-mono text-slate-800 dark:text-slate-200 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>THINK &gt; BUILD &gt; UPGRADE</span>
      </div>

    </div>
  );
}
