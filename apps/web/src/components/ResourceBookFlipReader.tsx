'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize2,
  Minimize2,
  Bookmark,
  Sparkles,
  CheckCircle2,
  Volume2,
  VolumeX,
  BookOpen,
  List,
  FileText,
  FileCode2,
  Presentation,
  Share2,
  Check,
  Code2,
  Copy,
} from 'lucide-react';
import type { ResourceDocument } from '@ub/types';

interface ResourceBookFlipReaderProps {
  doc: ResourceDocument | null;
  onClose: () => void;
}

export type BookPaperTheme = 'obsidian' | 'parchment' | 'classic';

// Web Audio API Synchronized Paper Rustle & Settle Synthesizer
function playPageFlipSound(isForward: boolean = true) {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // STAGE 1: Paper Lift & Air Glide (starts at t = 0.05s into flip arc)
    const sweepStart = ctx.currentTime + 0.05;
    const sweepDuration = 0.22;
    const sweepBuffer = ctx.createBuffer(
      1,
      Math.floor(ctx.sampleRate * sweepDuration),
      ctx.sampleRate
    );
    const sweepData = sweepBuffer.getChannelData(0);
    for (let i = 0; i < sweepData.length; i++) {
      sweepData[i] = (Math.random() * 2 - 1) * Math.sin((i / sweepData.length) * Math.PI);
    }
    const sweepSource = ctx.createBufferSource();
    sweepSource.buffer = sweepBuffer;
    const sweepFilter = ctx.createBiquadFilter();
    sweepFilter.type = 'bandpass';
    sweepFilter.frequency.setValueAtTime(isForward ? 1250 : 1050, sweepStart);
    sweepFilter.frequency.exponentialRampToValueAtTime(650, sweepStart + sweepDuration);
    sweepFilter.Q.setValueAtTime(1.8, sweepStart);
    const sweepGain = ctx.createGain();
    sweepGain.gain.setValueAtTime(0.001, sweepStart);
    sweepGain.gain.linearRampToValueAtTime(0.07, sweepStart + 0.07);
    sweepGain.gain.exponentialRampToValueAtTime(0.001, sweepStart + sweepDuration);
    sweepSource.connect(sweepFilter);
    sweepFilter.connect(sweepGain);
    sweepGain.connect(ctx.destination);
    sweepSource.start(sweepStart);

    // STAGE 2: Tactile Page Landing Settle Slap (starts at t = 0.35s as leaf touches down)
    const snapStart = ctx.currentTime + 0.35;
    const snapDuration = 0.12;
    const snapBuffer = ctx.createBuffer(
      1,
      Math.floor(ctx.sampleRate * snapDuration),
      ctx.sampleRate
    );
    const snapData = snapBuffer.getChannelData(0);
    for (let i = 0; i < snapData.length; i++) {
      snapData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (snapData.length * 0.25));
    }
    const snapSource = ctx.createBufferSource();
    snapSource.buffer = snapBuffer;
    const snapFilter = ctx.createBiquadFilter();
    snapFilter.type = 'highpass';
    snapFilter.frequency.setValueAtTime(1900, snapStart);
    const snapGain = ctx.createGain();
    snapGain.gain.setValueAtTime(0.065, snapStart);
    snapGain.gain.exponentialRampToValueAtTime(0.001, snapStart + snapDuration);
    snapSource.connect(snapFilter);
    snapFilter.connect(snapGain);
    snapGain.connect(ctx.destination);
    snapSource.start(snapStart);
  } catch {}
}

export function ResourceBookFlipReader({ doc, onClose }: ResourceBookFlipReaderProps) {
  // SPREAD MODES:
  // Desktop has 5 Spreads:
  // 0: Hardcover Front
  // 1: Spread 1 (Left: Table of Contents & Index, Right: Executive Abstract)
  // 2: Spread 2 (Left: Architectural Blueprint, Right: Implementation Schematics)
  // 3: Spread 3 (Left: Production Benchmarks, Right: Verification Checklist)
  // 4: Spread 4 (Hardcover Back & Colophon)
  const [spreadIndex, setSpreadIndex] = useState(0);

  // Mobile has 8 individual single pages (0 to 7)
  const [mobilePageIndex, setMobilePageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const [isFlipping, setIsFlipping] = useState<'next' | 'prev' | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [paperTheme, setPaperTheme] = useState<BookPaperTheme>('obsidian');
  const [showTocDrawer, setShowTocDrawer] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isRawMode, setIsRawMode] = useState(false);

  // Touch swipe tracking
  const touchStartXRef = useRef<number | null>(null);
  const flipTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const totalSpreads = 5;
  const totalMobilePages = 8;

  // Window resize check for mobile responsiveness
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Format determination
  const getFormat = () => {
    if (!doc) return 'pdf';
    if (doc.fileExtension) return doc.fileExtension;
    if (doc.pdfUrl.endsWith('.docx')) return 'docx';
    if (doc.pdfUrl.endsWith('.txt')) return 'txt';
    if (doc.pdfUrl.endsWith('.md')) return 'md';
    if (doc.pdfUrl.endsWith('.pptx')) return 'pptx';
    return 'pdf';
  };

  const fileFormat = getFormat();

  const getFormatBadge = () => {
    switch (fileFormat) {
      case 'docx':
        return {
          label: 'WORD PLAYBOOK',
          ext: '.DOCX',
          pill: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
          icon: FileText,
        };
      case 'txt':
        return {
          label: 'PLAINTEXT FILE',
          ext: '.TXT',
          pill: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
          icon: FileCode2,
        };
      case 'md':
        return {
          label: 'MARKDOWN DOC',
          ext: '.MD',
          pill: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
          icon: Code2,
        };
      case 'pptx':
        return {
          label: 'SLIDE DECK',
          ext: '.PPTX',
          pill: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
          icon: Presentation,
        };
      case 'pdf':
      default:
        return {
          label: 'PDF PLAYBOOK',
          ext: '.PDF',
          pill: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
          icon: FileText,
        };
    }
  };

  const formatConfig = getFormatBadge();

  // Navigation: Next
  const turnNext = useCallback(() => {
    if (isFlipping) return;

    if (isMobile) {
      if (mobilePageIndex < totalMobilePages - 1) {
        if (isSoundEnabled) playPageFlipSound(true);
        setIsFlipping('next');
        flipTimeoutRef.current = setTimeout(() => {
          setMobilePageIndex((prev) => prev + 1);
          setIsFlipping(null);
        }, 320);
      }
    } else {
      if (spreadIndex < totalSpreads - 1) {
        if (isSoundEnabled) playPageFlipSound(true);
        setIsFlipping('next');
        flipTimeoutRef.current = setTimeout(() => {
          setSpreadIndex((prev) => prev + 1);
          setIsFlipping(null);
        }, 520);
      }
    }
  }, [isFlipping, isMobile, mobilePageIndex, spreadIndex, isSoundEnabled, totalMobilePages, totalSpreads]);

  // Navigation: Prev
  const turnPrev = useCallback(() => {
    if (isFlipping) return;

    if (isMobile) {
      if (mobilePageIndex > 0) {
        if (isSoundEnabled) playPageFlipSound(false);
        setIsFlipping('prev');
        flipTimeoutRef.current = setTimeout(() => {
          setMobilePageIndex((prev) => prev - 1);
          setIsFlipping(null);
        }, 320);
      }
    } else {
      if (spreadIndex > 0) {
        if (isSoundEnabled) playPageFlipSound(false);
        setIsFlipping('prev');
        flipTimeoutRef.current = setTimeout(() => {
          setSpreadIndex((prev) => prev - 1);
          setIsFlipping(null);
        }, 520);
      }
    }
  }, [isFlipping, isMobile, mobilePageIndex, spreadIndex, isSoundEnabled]);

  // Direct Jump from Table of Contents
  const goToSpread = useCallback(
    (targetSpread: number) => {
      if (targetSpread === spreadIndex || isFlipping) return;
      const isForward = targetSpread > spreadIndex;
      if (isSoundEnabled) playPageFlipSound(isForward);
      setIsFlipping(isForward ? 'next' : 'prev');
      setShowTocDrawer(false);

      flipTimeoutRef.current = setTimeout(() => {
        setSpreadIndex(targetSpread);
        // Map spread to mobile page
        if (targetSpread === 0) setMobilePageIndex(0);
        else if (targetSpread === 1) setMobilePageIndex(1);
        else if (targetSpread === 2) setMobilePageIndex(3);
        else if (targetSpread === 3) setMobilePageIndex(5);
        else if (targetSpread === 4) setMobilePageIndex(7);
        setIsFlipping(null);
      }, 520);
    },
    [spreadIndex, isFlipping, isSoundEnabled]
  );

  // Jump to mobile page directly
  const goToMobilePage = useCallback(
    (page: number) => {
      if (page === mobilePageIndex || isFlipping) return;
      const isForward = page > mobilePageIndex;
      if (isSoundEnabled) playPageFlipSound(isForward);
      setIsFlipping(isForward ? 'next' : 'prev');
      setShowTocDrawer(false);

      flipTimeoutRef.current = setTimeout(() => {
        setMobilePageIndex(page);
        // Map to spread
        if (page === 0) setSpreadIndex(0);
        else if (page === 1 || page === 2) setSpreadIndex(1);
        else if (page === 3 || page === 4) setSpreadIndex(2);
        else if (page === 5 || page === 6) setSpreadIndex(3);
        else setSpreadIndex(4);
        setIsFlipping(null);
      }, 320);
    },
    [mobilePageIndex, isFlipping, isSoundEnabled]
  );

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (flipTimeoutRef.current) clearTimeout(flipTimeoutRef.current);
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (showTocDrawer) {
          setShowTocDrawer(false);
        } else if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        turnNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        turnPrev();
      }
    }

    if (doc && typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown);
      window.document.body.style.overflow = 'hidden';
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('keydown', handleKeyDown);
        window.document.body.style.overflow = 'auto';
      }
    };
  }, [doc, isFullscreen, showTocDrawer, onClose, turnNext, turnPrev]);

  if (!doc) return null;

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        turnNext();
      } else {
        turnPrev();
      }
    }
    touchStartXRef.current = null;
  };

  const toggleFullscreen = () => {
    if (typeof window === 'undefined') return;
    if (!isFullscreen) {
      const elem = window.document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {});
      }
      setIsFullscreen(true);
    } else {
      if (window.document.fullscreenElement && window.document.exitFullscreen) {
        window.document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/resources#${doc.id}`;
      navigator.clipboard.writeText(url).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
    }
  };

  const formattedSize = doc.fileSizeBytes
    ? (doc.fileSizeBytes / (1024 * 1024)).toFixed(1) + ' MB'
    : '2.4 MB';

  // Paper Theme Surface Styles
  const getPaperStyles = () => {
    switch (paperTheme) {
      case 'parchment':
        return {
          bg: 'bg-[#F9F6EE] text-[#2C2416]',
          border: 'border-[#E3DAC9]',
          subtext: 'text-[#7A6E5D]',
          cardBox: 'bg-[#EFE9DB] border border-[#DDD5C5]',
          pageLeft: 'bg-gradient-to-r from-[#F0ECE1] to-[#F9F6EE]',
          pageRight: 'bg-gradient-to-l from-[#F0ECE1] to-[#F9F6EE]',
          tabActive: 'bg-[#DCD4C0] text-[#2C2416]',
        };
      case 'classic':
        return {
          bg: 'bg-[#FFFFFF] text-[#0F172A]',
          border: 'border-slate-200',
          subtext: 'text-slate-500',
          cardBox: 'bg-slate-50 border border-slate-200',
          pageLeft: 'bg-gradient-to-r from-slate-100 to-white',
          pageRight: 'bg-gradient-to-l from-slate-100 to-white',
          tabActive: 'bg-slate-200 text-slate-900',
        };
      case 'obsidian':
      default:
        return {
          bg: 'bg-[#0B101B] text-slate-100',
          border: 'border-slate-800',
          subtext: 'text-slate-400',
          cardBox: 'bg-slate-900/90 border border-slate-800',
          pageLeft: 'bg-gradient-to-r from-[#070A12] to-[#0B101B]',
          pageRight: 'bg-gradient-to-l from-[#070A12] to-[#0B101B]',
          tabActive: 'bg-slate-800 text-white',
        };
    }
  };

  const paper = getPaperStyles();

  // Table of Contents chapters definition
  const TOC_ITEMS = [
    {
      num: '01',
      title: 'Executive Architecture Abstract',
      desc: 'High-velocity systems, blast radius boundaries, and core specifications.',
      targetSpread: 1,
      targetMobile: 2,
      pageLabel: 'P. 02',
    },
    {
      num: '02',
      title: 'Core Algorithms & Scalability',
      desc: 'Two-pointer, caching topologies, and real-time state synchronization.',
      targetSpread: 2,
      targetMobile: 3,
      pageLabel: 'P. 03',
    },
    {
      num: '03',
      title: 'Implementation Schematics',
      desc: 'Turborepo workspace wiring and runtime Zod contract validation.',
      targetSpread: 2,
      targetMobile: 4,
      pageLabel: 'P. 04',
    },
    {
      num: '04',
      title: 'Production Benchmarks & Stress Tests',
      desc: 'P99 latencies, Turbopack boot speeds, and memory consumption.',
      targetSpread: 3,
      targetMobile: 5,
      pageLabel: 'P. 05',
    },
    {
      num: '05',
      title: 'Pre-Flight Verification & Audit',
      desc: 'Zero-warning linter gates, fault isolation, and deployment seals.',
      targetSpread: 3,
      targetMobile: 6,
      pageLabel: 'P. 06',
    },
    {
      num: '06',
      title: 'Agency Colophon & Back Cover',
      desc: 'Technical credits, edition provenance, and verification stamp.',
      targetSpread: 4,
      targetMobile: 7,
      pageLabel: 'P. 08',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md transition-all duration-300 p-0 sm:p-4">
      {/* Container switches between Windowed Modal & Fullscreen View */}
      <div
        className={`w-full bg-[#070A12] border border-slate-800 flex flex-col overflow-hidden shadow-2xl relative transition-all duration-300 ${
          isFullscreen
            ? 'fixed inset-0 w-screen h-screen max-w-none max-h-none rounded-none z-[100]'
            : 'max-w-6xl h-[94vh] rounded-3xl'
        }`}
      >
        {/* ======================================================== */}
        {/* TOP BAR / READER TOOLBAR                                 */}
        {/* ======================================================== */}
        <header className="flex items-center justify-between px-4 sm:px-6 py-3 bg-[#0B0F19]/90 border-b border-slate-800/90 shrink-0 z-20">
          {/* Left: Format Badge & Title */}
          <div className="flex items-center space-x-3 truncate pr-2">
            <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-[var(--accent-color)] shrink-0 shadow-inner">
              <BookOpen className="w-4 h-4" />
            </div>

            <div className="truncate">
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-0.5 rounded-md border text-[9px] font-mono font-bold tracking-wider ${formatConfig.pill}`}
                >
                  {formatConfig.ext}
                </span>
                <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                  {formatConfig.label}
                </span>
              </div>
              <h2 className="font-heading font-bold text-xs sm:text-sm text-white truncate max-w-xs sm:max-w-md">
                {doc.title}
              </h2>
            </div>
          </div>

          {/* Right: Controls & Actions */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            {/* Table of Contents Quick Toggle */}
            <button
              onClick={() => setShowTocDrawer(!showTocDrawer)}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                showTocDrawer
                  ? 'bg-[var(--accent-color)] text-slate-950 font-bold border-transparent'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
              title="Table of Contents Index"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Contents</span>
            </button>

            {/* Plaintext / Raw Inspector for .txt / .md files */}
            {(fileFormat === 'txt' || fileFormat === 'md') && (
              <button
                onClick={() => setIsRawMode(!isRawMode)}
                className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                  isRawMode
                    ? 'bg-emerald-500 text-slate-950 font-bold border-transparent'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
                title="Toggle Plaintext Raw Inspector"
              >
                <Code2 className="w-3.5 h-3.5 inline sm:mr-1" />
                <span className="hidden sm:inline">{isRawMode ? 'Folio View' : 'Raw View'}</span>
              </button>
            )}

            {/* Paper Theme Switcher (Desktop) */}
            <div className="hidden lg:flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono">
              <button
                onClick={() => setPaperTheme('obsidian')}
                className={`px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
                  paperTheme === 'obsidian' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Dark
              </button>
              <button
                onClick={() => setPaperTheme('parchment')}
                className={`px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
                  paperTheme === 'parchment' ? 'bg-[#EFE9DB] text-[#2C2416] font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Sepia
              </button>
              <button
                onClick={() => setPaperTheme('classic')}
                className={`px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
                  paperTheme === 'classic' ? 'bg-white text-slate-900 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Light
              </button>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={() => setIsSoundEnabled(!isSoundEnabled)}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors cursor-pointer"
              title={isSoundEnabled ? 'Paper audio enabled' : 'Muted'}
            >
              {isSoundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            {/* Copy Share Link */}
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors cursor-pointer hidden sm:block"
              title="Copy Playbook Link"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Download Button Mentioning Format */}
            <a
              href={doc.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-mono font-semibold transition-colors cursor-pointer"
              title={`Download as ${formatConfig.ext}`}
            >
              <Download className="w-3.5 h-3.5 text-[var(--accent-color)]" />
              <span className="hidden md:inline">Download {formatConfig.ext}</span>
              <span className="text-[10px] text-slate-400">({formattedSize})</span>
            </a>

            {/* Fullscreen / Minimize */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors cursor-pointer hidden sm:block"
              title={isFullscreen ? 'Minimize window' : 'Full screen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4 text-[var(--accent-color)]" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors cursor-pointer"
              title="Close Reader"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* ======================================================== */}
        {/* INTERACTIVE TABLE OF CONTENTS FLYOUT DRAWER              */}
        {/* ======================================================== */}
        {showTocDrawer && (
          <div className="absolute top-14 left-0 right-0 sm:right-auto sm:left-4 sm:w-96 bg-[#0E1524] border border-slate-700 rounded-2xl shadow-2xl z-50 p-4 animate-fade-in font-mono text-xs max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <span className="font-bold text-white flex items-center space-x-1.5">
                <Bookmark className="w-4 h-4 text-[var(--accent-color)]" />
                <span>Jump to Chapter Index</span>
              </span>
              <button
                onClick={() => setShowTocDrawer(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => (isMobile ? goToMobilePage(0) : goToSpread(0))}
                className="w-full text-left p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-slate-300 transition-colors cursor-pointer"
              >
                <span className="font-bold">Front Hardcover & Emblem</span>
                <span className="text-[10px] text-[var(--accent-color)]">Cover</span>
              </button>

              {TOC_ITEMS.map((item) => (
                <button
                  key={item.num}
                  onClick={() =>
                    isMobile ? goToMobilePage(item.targetMobile) : goToSpread(item.targetSpread)
                  }
                  className="w-full text-left p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 flex flex-col space-y-1 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200 group-hover:text-[var(--accent-color)] transition-colors">
                      {item.num}. {item.title}
                    </span>
                    <span className="text-[10px] text-[var(--accent-color)] font-mono">
                      {item.pageLabel}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-sans line-clamp-1">
                    {item.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 3D BOOK STAGE & FLIP CANVAS                             */}
        {/* ======================================================== */}
        <div
          className="flex-1 w-full flex items-center justify-center p-2 sm:p-6 lg:p-8 bg-[#04060A] relative overflow-hidden [perspective:2400px]"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Ambient Gutter Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[var(--accent-glow)] rounded-full blur-[160px] pointer-events-none opacity-25" />

          {/* Desktop Left Button */}
          <button
            onClick={turnPrev}
            disabled={
              (isMobile ? mobilePageIndex === 0 : spreadIndex === 0) || !!isFlipping
            }
            className={`hidden sm:flex absolute left-3 sm:left-6 z-40 w-11 h-11 sm:w-13 sm:h-13 rounded-full items-center justify-center transition-all cursor-pointer ${
              (isMobile ? mobilePageIndex === 0 : spreadIndex === 0) || !!isFlipping
                ? 'opacity-20 cursor-not-allowed text-slate-600 bg-slate-900/50'
                : 'bg-white/90 dark:bg-slate-800/90 text-slate-900 dark:text-white shadow-2xl hover:scale-110 active:scale-95 border border-slate-700'
            }`}
            title="Previous Page (Left Arrow)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Desktop Right Button */}
          <button
            onClick={turnNext}
            disabled={
              (isMobile
                ? mobilePageIndex === totalMobilePages - 1
                : spreadIndex === totalSpreads - 1) || !!isFlipping
            }
            className={`hidden sm:flex absolute right-3 sm:left-auto sm:right-6 z-40 w-11 h-11 sm:w-13 sm:h-13 rounded-full items-center justify-center transition-all cursor-pointer ${
              (isMobile
                ? mobilePageIndex === totalMobilePages - 1
                : spreadIndex === totalSpreads - 1) || !!isFlipping
                ? 'opacity-20 cursor-not-allowed text-slate-600 bg-slate-900/50'
                : 'bg-white/90 dark:bg-slate-800/90 text-slate-900 dark:text-white shadow-2xl hover:scale-110 active:scale-95 border border-slate-700'
            }`}
            title="Next Page (Right Arrow)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* ======================================================== */}
          {/* RAW MONOSPACE INSPECTOR MODE (For .TXT and .MD)          */}
          {/* ======================================================== */}
          {isRawMode ? (
            <div className="w-full max-w-4xl h-[75vh] rounded-2xl bg-[#0A0E17] border border-slate-800 p-6 overflow-y-auto font-mono text-xs text-slate-300 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <FileCode2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-white">
                    Raw Stream: {doc.title}.{fileFormat}
                  </span>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(doc.description);
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 2000);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs flex items-center space-x-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{isCopied ? 'Copied' : 'Copy Text'}</span>
                </button>
              </div>

              <div className="text-slate-400 space-y-2 leading-relaxed">
                <p># UPGRADER BOY OFFICIAL {fileFormat.toUpperCase()} MANIFEST</p>
                <p># Title: {doc.title}</p>
                <p># Source: {doc.source}</p>
                <p># Published: {new Date(doc.publishedAt).toISOString()}</p>
                <p># Security Clearance: Production Verified (Zod Compliant)</p>
                <div className="my-4 border-t border-slate-800" />
                <p className="text-white whitespace-pre-wrap">{doc.description}</p>
                <div className="my-4 border-t border-slate-800" />
                <p>## TAGS</p>
                <p>{doc.tags.join(', ')}</p>
              </div>
            </div>
          ) : isMobile ? (
            /* ======================================================== */
            /* MOBILE SINGLE PAGE MODE (Responsive Thumb Friendly)       */
            /* ======================================================== */
            <div
              className={`w-full max-w-md h-[74vh] flex flex-col rounded-2xl ${paper.bg} ${paper.border} border p-5 overflow-y-auto shadow-2xl relative select-none ${
                isFlipping === 'next'
                  ? 'mobile-page-slide-next'
                  : isFlipping === 'prev'
                  ? 'mobile-page-slide-prev'
                  : ''
              }`}
            >
              {mobilePageIndex === 0 ? (
                /* Mobile Cover */
                <div
                  onClick={turnNext}
                  className="h-full flex flex-col justify-between cursor-pointer space-y-4"
                >
                  <div className="space-y-2">
                    <span className="px-2.5 py-1 rounded-full bg-[var(--accent-glow)] text-[10px] font-mono text-[var(--accent-color)] font-bold">
                      {formatConfig.label}
                    </span>
                    <h1 className="text-xl font-heading font-black text-white leading-tight mt-2">
                      {doc.title}
                    </h1>
                  </div>

                  <div className="w-16 h-16 rounded-2xl bg-slate-900 border-2 border-[var(--accent-color)]/60 flex items-center justify-center text-[var(--accent-color)] font-mono font-black text-2xl shadow-xl mx-auto my-auto">
                    &lt;UB&gt;
                  </div>

                  <div className="space-y-2 text-xs text-slate-300">
                    <p className="leading-relaxed">{doc.description}</p>
                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>{doc.source}</span>
                      <span className="text-[var(--accent-color)] font-bold">Tap to Start →</span>
                    </div>
                  </div>
                </div>
              ) : mobilePageIndex === 1 ? (
                /* Mobile Page 1: Interactive Table of Contents */
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-inherit pb-2">
                    <span className={`text-[10px] font-mono ${paper.subtext}`}>Chapter Index</span>
                    <span className="text-[10px] font-mono text-[var(--accent-color)] font-bold">P. 01</span>
                  </div>

                  <h2 className="text-lg font-heading font-black">Table of Contents</h2>

                  <div className="space-y-2">
                    {TOC_ITEMS.slice(0, 5).map((item) => (
                      <button
                        key={item.num}
                        onClick={() => goToMobilePage(item.targetMobile)}
                        className={`w-full text-left p-2.5 rounded-xl ${paper.cardBox} flex items-center justify-between cursor-pointer hover:border-[var(--accent-color)] transition-colors`}
                      >
                        <div className="truncate pr-2">
                          <span className="font-bold text-xs">{item.num}. {item.title}</span>
                        </div>
                        <span className="text-[10px] font-mono text-[var(--accent-color)] font-bold">
                          {item.pageLabel}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : mobilePageIndex === 2 ? (
                /* Mobile Page 2: Executive Abstract */
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-inherit pb-2">
                    <span className="text-[10px] font-mono text-[var(--accent-color)] font-bold">P. 02</span>
                    <span className={`text-[10px] font-mono ${paper.subtext}`}>Executive Abstract</span>
                  </div>

                  <h3 className="text-lg font-heading font-black">System Architecture Spec</h3>
                  <p className="text-xs leading-relaxed font-sans">{doc.description}</p>

                  <div className={`p-3 rounded-xl ${paper.cardBox} space-y-2 text-xs`}>
                    <div className="flex items-center justify-between">
                      <span className={paper.subtext}>Distribution:</span>
                      <span className="font-mono font-bold">Public Verified</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={paper.subtext}>Primary Extension:</span>
                      <span className="font-mono text-[var(--accent-color)] font-bold">{formatConfig.ext}</span>
                    </div>
                  </div>
                </div>
              ) : mobilePageIndex === 3 ? (
                /* Mobile Page 3: Architectural Blueprints */
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-inherit pb-2">
                    <span className={`text-[10px] font-mono ${paper.subtext}`}>Blueprint</span>
                    <span className="text-[10px] font-mono text-[var(--accent-color)] font-bold">P. 03</span>
                  </div>

                  <h3 className="text-lg font-heading font-black">Architectural Constraints</h3>
                  <ul className="space-y-2.5 font-mono text-xs">
                    <li className="flex items-start space-x-2">
                      <span className="text-[var(--accent-color)] font-bold">01.</span>
                      <span>Blast-Radius Isolation between decoupled monorepo packages.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[var(--accent-color)] font-bold">02.</span>
                      <span>Runtime Zod Schema Ingestion on all payloads.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[var(--accent-color)] font-bold">03.</span>
                      <span>Sub-second hot module reload with zero drift.</span>
                    </li>
                  </ul>
                </div>
              ) : mobilePageIndex === 4 ? (
                /* Mobile Page 4: Implementation Schematics */
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-inherit pb-2">
                    <span className="text-[10px] font-mono text-[var(--accent-color)] font-bold">P. 04</span>
                    <span className={`text-[10px] font-mono ${paper.subtext}`}>Schematics</span>
                  </div>

                  <h3 className="text-lg font-heading font-black">Workspace Boundaries</h3>
                  <div className={`p-3 rounded-xl ${paper.cardBox} space-y-2 text-xs font-mono`}>
                    <div>apps/web: Next.js 15 Client</div>
                    <div>apps/admin: Decoupled CMS</div>
                    <div>packages/types: Shared Zod Schemas</div>
                    <div>packages/ui: Canonical Design Tokens</div>
                  </div>
                </div>
              ) : mobilePageIndex === 5 ? (
                /* Mobile Page 5: Benchmarks */
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-inherit pb-2">
                    <span className={`text-[10px] font-mono ${paper.subtext}`}>Benchmarks</span>
                    <span className="text-[10px] font-mono text-[var(--accent-color)] font-bold">P. 05</span>
                  </div>

                  <h3 className="text-lg font-heading font-black">Production Benchmarks</h3>
                  <div className="space-y-2 font-mono text-xs">
                    <div className={`p-2.5 rounded-xl ${paper.cardBox} flex items-center justify-between`}>
                      <span>P99 Latency</span>
                      <span className="text-emerald-500 font-bold">&lt; 42ms</span>
                    </div>
                    <div className={`p-2.5 rounded-xl ${paper.cardBox} flex items-center justify-between`}>
                      <span>Cold Boot</span>
                      <span className="text-cyan-400 font-bold">180ms</span>
                    </div>
                    <div className={`p-2.5 rounded-xl ${paper.cardBox} flex items-center justify-between`}>
                      <span>Cache Hit Rate</span>
                      <span className="text-amber-400 font-bold">99.4%</span>
                    </div>
                  </div>
                </div>
              ) : mobilePageIndex === 6 ? (
                /* Mobile Page 6: Verification */
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-inherit pb-2">
                    <span className="text-[10px] font-mono text-[var(--accent-color)] font-bold">P. 06</span>
                    <span className={`text-[10px] font-mono ${paper.subtext}`}>Verification</span>
                  </div>

                  <h3 className="text-lg font-heading font-black">Pre-Flight Audit Checklist</h3>
                  <div className="space-y-2 font-mono text-xs text-emerald-500">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>0 TypeScript compiler errors</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>0 ESLint warnings across monorepo</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>100% Passing Bun Test Suites</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Mobile Page 7: Colophon */
                <div className="h-full flex flex-col justify-between text-center space-y-4">
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-[var(--accent-color)] font-mono font-black mx-auto">
                      &lt;UB&gt;
                    </div>
                    <h3 className="text-lg font-heading font-black text-white">Upgrader Boy Engineering</h3>
                    <p className="text-xs text-slate-400">Edition I • 2024–2025</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-emerald-400 flex items-center justify-center space-x-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verified Production Readiness</span>
                  </div>

                  <button
                    onClick={() => goToMobilePage(0)}
                    className="w-full py-2 rounded-xl bg-slate-800 text-xs font-mono text-white cursor-pointer"
                  >
                    ← Back to Cover
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* ======================================================== */
            /* DESKTOP 3D DUAL-PAGE SPREAD                              */
            /* ======================================================== */
            <div
              className={`relative w-full ${
                isFullscreen ? 'max-w-6xl h-[82vh]' : 'max-w-4xl h-[70vh] sm:h-[75vh]'
              } flex rounded-2xl shadow-[0_25px_70px_-15px_rgba(0,0,0,0.9)] [transform-style:preserve-3d] select-none transition-all duration-300`}
            >
              {spreadIndex === 0 ? (
                /* SPREAD 0: Hardcover Front */
                <div
                  onClick={turnNext}
                  className="w-full h-full max-w-lg mx-auto rounded-2xl bg-gradient-to-br from-[#121B2B] via-[#0D1522] to-[#0A0F1A] border-4 border-slate-800 p-8 sm:p-12 flex flex-col justify-between shadow-[0_30px_60px_-12px_rgba(0,0,0,0.95)] relative overflow-hidden cursor-pointer group hover:scale-[1.01] transition-transform"
                >
                  {/* Book Spine Crease Effect */}
                  <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/80 via-black/30 to-transparent border-r border-white/5" />
                  <div className="absolute right-0 top-0 bottom-0 w-3 bg-[repeating-linear-gradient(to_bottom,#1E293B,#1E293B_2px,#0F172A_2px,#0F172A_4px)] shadow-inner" />

                  {/* Bookmark Ribbon */}
                  <div className="absolute top-0 right-12 w-6 h-20 bg-[var(--accent-color)] shadow-lg flex flex-col items-center justify-end pb-1.5">
                    <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[10px] border-b-[#0D1522] -mb-1" />
                  </div>

                  {/* Top Cover Header */}
                  <div className="space-y-3 z-10 pl-6">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[var(--accent-glow)] border border-[var(--accent-color)]/40 text-[10px] font-mono text-[var(--accent-color)] font-bold">
                      <Sparkles className="w-3 h-3" />
                      <span>{formatConfig.label}</span>
                    </div>
                    <div className="text-xs font-mono text-slate-400">
                      VOLUME 2024–2025 • FORMAT: {formatConfig.ext}
                    </div>
                  </div>

                  {/* Center Book Title & Emblem */}
                  <div className="space-y-6 z-10 pl-6 my-auto text-left">
                    <div className="w-16 h-16 rounded-2xl bg-slate-900 border-2 border-[var(--accent-color)]/60 flex items-center justify-center text-[var(--accent-color)] font-mono font-black text-2xl shadow-xl">
                      &lt;UB&gt;
                    </div>

                    <h1 className="text-2xl sm:text-4xl font-heading font-black tracking-tight text-white leading-tight">
                      {doc.title}
                    </h1>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans max-w-sm">
                      {doc.description}
                    </p>
                  </div>

                  {/* Bottom Cover Metadata */}
                  <div className="pt-6 border-t border-slate-800/80 z-10 pl-6 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Source: {doc.source}</span>
                    <div className="flex items-center space-x-1 text-[var(--accent-color)] font-bold group-hover:translate-x-1 transition-transform">
                      <span>Click to turn page</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              ) : spreadIndex === 4 ? (
                /* SPREAD 4: Hardcover Back */
                <div
                  onClick={turnPrev}
                  className="w-full h-full max-w-lg mx-auto rounded-2xl bg-gradient-to-bl from-[#121B2B] via-[#0D1522] to-[#0A0F1A] border-4 border-slate-800 p-8 sm:p-12 flex flex-col justify-between shadow-[0_30px_60px_-12px_rgba(0,0,0,0.95)] relative overflow-hidden cursor-pointer group hover:scale-[1.01] transition-transform"
                >
                  <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/80 via-black/30 to-transparent border-l border-white/5" />

                  <div className="space-y-3 z-10 pr-6 text-right">
                    <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                      Agency Colophon & Distribution
                    </div>
                  </div>

                  <div className="space-y-6 z-10 pr-6 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-slate-900 border-2 border-[var(--accent-color)]/60 flex items-center justify-center text-[var(--accent-color)] font-mono font-black text-2xl shadow-xl mx-auto">
                      &lt;UB&gt;
                    </div>

                    <h3 className="text-xl sm:text-2xl font-heading font-black text-white">
                      Upgrader Boy Engineering
                    </h3>

                    <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                      Designed and audited for students, founders, and engineers scaling modern distributed architectures.
                    </p>

                    <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Verified Production Readiness</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-800/80 z-10 pr-6 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        goToSpread(0);
                      }}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      ← Jump to Cover
                    </button>
                    <span className="text-[var(--accent-color)] font-bold">End of Playbook</span>
                  </div>
                </div>
              ) : (
                /* DUAL-PAGE SPREADS (Spread 1: TOC & Abstract, Spread 2: Architecture, Spread 3: Benchmarks) */
                <div
                  className={`w-full h-full flex rounded-2xl ${paper.bg} ${paper.border} border overflow-hidden shadow-2xl relative [transform-style:preserve-3d]`}
                >
                  {/* Spine Crease */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-8 -translate-x-1/2 bg-gradient-to-r from-black/25 via-black/40 to-black/25 z-30 pointer-events-none shadow-inner" />
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-16 bg-[var(--accent-color)] z-40 pointer-events-none shadow-md" />

                  {/* ======================================================== */}
                  {/* LEFT PAGE                                                */}
                  {/* ======================================================== */}
                  <div
                    className={`w-1/2 h-full p-6 sm:p-10 border-r ${paper.border} flex flex-col justify-between ${paper.pageLeft} relative cursor-pointer group`}
                    onClick={turnPrev}
                  >
                    {spreadIndex === 1 ? (
                      /* SPREAD 1 LEFT: INTERACTIVE TABLE OF CONTENTS (INDEX) */
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-inherit pb-2.5">
                          <span className={`text-[10px] font-mono ${paper.subtext}`}>Interactive Index</span>
                          <span className="text-[10px] font-mono text-[var(--accent-color)] font-bold">P. 01</span>
                        </div>

                        <div>
                          <h2 className="text-xl sm:text-2xl font-heading font-black">
                            Table of Contents
                          </h2>
                          <p className={`text-[11px] font-mono ${paper.subtext} mt-0.5`}>
                            Click any chapter to jump directly to its page:
                          </p>
                        </div>

                        {/* Clickable Topics Index Cards */}
                        <div className="space-y-2 font-mono text-xs pt-1">
                          {TOC_ITEMS.slice(0, 4).map((item) => (
                            <button
                              key={item.num}
                              onClick={(e) => {
                                e.stopPropagation();
                                goToSpread(item.targetSpread);
                              }}
                              className={`w-full text-left p-2.5 rounded-xl ${paper.cardBox} hover:border-[var(--accent-color)] hover:scale-[1.01] transition-all flex items-center justify-between group/item cursor-pointer`}
                            >
                              <div className="truncate pr-2">
                                <span className="font-bold group-hover/item:text-[var(--accent-color)] transition-colors">
                                  {item.num}. {item.title}
                                </span>
                              </div>
                              <span className="text-[10px] font-bold text-[var(--accent-color)] shrink-0">
                                {item.pageLabel} →
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : spreadIndex === 2 ? (
                      /* SPREAD 2 LEFT: Architectural Blueprint */
                      <div className="space-y-5">
                        <div className="flex items-center justify-between border-b border-inherit pb-3">
                          <span className={`text-[10px] font-mono ${paper.subtext}`}>Engineering Blueprint</span>
                          <span className="text-[10px] font-mono text-[var(--accent-color)] font-bold">P. 03</span>
                        </div>

                        <h3 className="text-lg sm:text-xl font-heading font-black">
                          Architectural Constraints
                        </h3>

                        <ul className="space-y-3 font-mono text-xs">
                          <li className="flex items-start space-x-2">
                            <span className="text-[var(--accent-color)] font-bold">01.</span>
                            <span>Strict Blast-Radius Isolation: Decouple admin modules from public consumers.</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="text-[var(--accent-color)] font-bold">02.</span>
                            <span>Runtime Contract Validation: Ingest external payloads exclusively via Zod schemas.</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="text-[var(--accent-color)] font-bold">03.</span>
                            <span>In-Memory Streaming Buffers: Bypass disk locks on high-velocity state syncs.</span>
                          </li>
                        </ul>
                      </div>
                    ) : (
                      /* SPREAD 3 LEFT: Benchmarks */
                      <div className="space-y-5">
                        <div className="flex items-center justify-between border-b border-inherit pb-3">
                          <span className={`text-[10px] font-mono ${paper.subtext}`}>Performance Audit</span>
                          <span className="text-[10px] font-mono text-[var(--accent-color)] font-bold">P. 05</span>
                        </div>

                        <h3 className="text-lg sm:text-xl font-heading font-black">
                          Production Benchmarks
                        </h3>

                        <div className="space-y-2.5 font-mono text-xs">
                          <div className={`p-3 rounded-xl ${paper.cardBox} flex items-center justify-between`}>
                            <span>P99 API Latency</span>
                            <span className="text-emerald-500 font-bold">&lt; 42ms</span>
                          </div>
                          <div className={`p-3 rounded-xl ${paper.cardBox} flex items-center justify-between`}>
                            <span>Turbopack Cold Boot</span>
                            <span className="text-cyan-400 font-bold">180ms</span>
                          </div>
                          <div className={`p-3 rounded-xl ${paper.cardBox} flex items-center justify-between`}>
                            <span>Redis Cache Hit Rate</span>
                            <span className="text-amber-400 font-bold">99.4%</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className={`text-[10px] font-mono ${paper.subtext} pt-4 border-t border-inherit flex items-center justify-between`}>
                      <span>Upgrader Boy Engineering</span>
                      <span className="group-hover:text-[var(--accent-color)] transition-colors">← Previous Page</span>
                    </div>
                  </div>

                  {/* ======================================================== */}
                  {/* RIGHT PAGE                                               */}
                  {/* ======================================================== */}
                  <div
                    className={`w-1/2 h-full p-6 sm:p-10 flex flex-col justify-between ${paper.pageRight} relative cursor-pointer group`}
                    onClick={turnNext}
                  >
                    {spreadIndex === 1 ? (
                      /* SPREAD 1 RIGHT: Executive Abstract */
                      <div className="space-y-5">
                        <div className="flex items-center justify-between border-b border-inherit pb-3">
                          <span className="text-[10px] font-mono text-[var(--accent-color)] font-bold">P. 02</span>
                          <span className={`text-[10px] font-mono ${paper.subtext}`}>Executive Abstract</span>
                        </div>

                        <h3 className="text-lg sm:text-xl font-heading font-black">
                          Systems Specification
                        </h3>

                        <p className="text-xs sm:text-sm font-sans leading-relaxed">
                          {doc.description}
                        </p>

                        <div className={`p-4 rounded-xl ${paper.cardBox} space-y-2 text-xs font-mono`}>
                          <div className="flex items-center justify-between">
                            <span className={paper.subtext}>File Format:</span>
                            <span className="text-[var(--accent-color)] font-bold">{formatConfig.ext} ({formatConfig.label})</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={paper.subtext}>Published On:</span>
                            <span>{new Date(doc.publishedAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={paper.subtext}>Verification:</span>
                            <span className="text-emerald-500 font-bold">Production Ready</span>
                          </div>
                        </div>
                      </div>
                    ) : spreadIndex === 2 ? (
                      /* SPREAD 2 RIGHT: Schematics & Code */
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-inherit pb-3">
                          <span className="text-[10px] font-mono text-[var(--accent-color)] font-bold">P. 04</span>
                          <span className={`text-[10px] font-mono ${paper.subtext}`}>Implementation Code</span>
                        </div>

                        <h4 className="text-base sm:text-lg font-heading font-bold">
                          Zod Runtime Schema Guard
                        </h4>

                        <div className="p-3.5 rounded-xl bg-slate-950 text-slate-300 font-mono text-[11px] overflow-x-auto border border-slate-800">
                          <code>{`export const ResourceSchema = z.object({
  id: z.string(),
  title: z.string().min(3),
  fileExtension: z.enum(['pdf','docx','txt','md']),
  verified: z.boolean().default(true),
});`}</code>
                        </div>

                        <p className="text-xs leading-relaxed font-sans">
                          Every inbound payload is strictly verified before hitting persistent memory or storage buffers.
                        </p>
                      </div>
                    ) : (
                      /* SPREAD 3 RIGHT: Verification Checklist */
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-inherit pb-3">
                          <span className="text-[10px] font-mono text-[var(--accent-color)] font-bold">P. 06</span>
                          <span className={`text-[10px] font-mono ${paper.subtext}`}>Pre-Flight Verification</span>
                        </div>

                        <h4 className="text-base sm:text-lg font-heading font-bold">
                          Readiness Checklist
                        </h4>

                        <div className="space-y-2 font-mono text-[11px]">
                          <div className="flex items-center space-x-2 text-emerald-500">
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            <span>0 TypeScript / Linter compiler warnings</span>
                          </div>
                          <div className="flex items-center space-x-2 text-emerald-500">
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            <span>Decoupled monorepo fault-isolation boundaries</span>
                          </div>
                          <div className="flex items-center space-x-2 text-emerald-500">
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            <span>Sub-second cold restart with Turbopack</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className={`text-[10px] font-mono ${paper.subtext} pt-4 border-t border-inherit flex items-center justify-between`}>
                      <span className="group-hover:text-[var(--accent-color)] transition-colors">Next Page →</span>
                      <span>Format: {formatConfig.ext}</span>
                    </div>
                  </div>

                  {/* ======================================================== */}
                  {/* 3D DYNAMIC FLIPPING LEAF (Realistic Dual-Face Turn)       */}
                  {/* ======================================================== */}
                  {isFlipping === 'next' && (
                    <div className="absolute right-0 top-0 bottom-0 w-1/2 page-flip-forward z-50 pointer-events-none rounded-r-2xl overflow-hidden shadow-2xl">
                      <div
                        className={`w-full h-full p-6 sm:p-10 ${paper.pageRight} border-l border-black/25 flex flex-col justify-between shadow-2xl`}
                      >
                        <div className="flex items-center justify-between border-b border-inherit pb-3">
                          <span className="text-[10px] font-mono text-[var(--accent-color)] font-bold">
                            Turning...
                          </span>
                          <span className={`text-[10px] font-mono ${paper.subtext}`}>Page Flip</span>
                        </div>
                        <div className="my-auto text-center space-y-2 opacity-70">
                          <Sparkles className="w-8 h-8 text-[var(--accent-color)] mx-auto animate-spin" />
                          <div className="text-xs font-mono">Flipping forward...</div>
                        </div>
                        <div className="h-4" />
                      </div>
                    </div>
                  )}

                  {isFlipping === 'prev' && (
                    <div className="absolute left-0 top-0 bottom-0 w-1/2 page-flip-backward z-50 pointer-events-none rounded-l-2xl overflow-hidden shadow-2xl">
                      <div
                        className={`w-full h-full p-6 sm:p-10 ${paper.pageLeft} border-r border-black/25 flex flex-col justify-between shadow-2xl`}
                      >
                        <div className="flex items-center justify-between border-b border-inherit pb-3">
                          <span className={`text-[10px] font-mono ${paper.subtext}`}>Turning...</span>
                          <span className="text-[10px] font-mono text-[var(--accent-color)] font-bold">
                            Page Flip
                          </span>
                        </div>
                        <div className="my-auto text-center space-y-2 opacity-70">
                          <Sparkles className="w-8 h-8 text-[var(--accent-color)] mx-auto animate-spin" />
                          <div className="text-xs font-mono">Flipping backward...</div>
                        </div>
                        <div className="h-4" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* BOTTOM NAVIGATION & JUMP SCRUBBER                         */}
        {/* ======================================================== */}
        <footer className="flex items-center justify-between px-4 sm:px-6 py-2.5 bg-[#0B0F19]/90 border-t border-slate-800/90 shrink-0 z-20 text-xs font-mono">
          {/* Left Thumb / Mobile Controls */}
          {isMobile ? (
            <div className="flex items-center justify-between w-full">
              <button
                onClick={turnPrev}
                disabled={mobilePageIndex === 0 || !!isFlipping}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white disabled:opacity-30 cursor-pointer"
              >
                ← Prev
              </button>

              <span className="text-slate-400 font-bold">
                {mobilePageIndex === 0 ? 'Cover' : `Page ${mobilePageIndex} of 7`}
              </span>

              <button
                onClick={turnNext}
                disabled={mobilePageIndex === totalMobilePages - 1 || !!isFlipping}
                className="px-3 py-1.5 rounded-xl bg-[var(--accent-color)] text-slate-950 font-bold disabled:opacity-30 cursor-pointer"
              >
                Next →
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-1.5 overflow-x-auto py-1 scrollbar-none">
                {['Cover', 'Index & Abstract', 'Architecture', 'Benchmarks', 'Colophon'].map(
                  (label, idx) => (
                    <button
                      key={label}
                      onClick={() => goToSpread(idx)}
                      className={`px-3 py-1 rounded-xl text-[10px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                        spreadIndex === idx
                          ? 'bg-[var(--accent-color)] text-slate-950 font-bold shadow-xs'
                          : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      {label}
                    </button>
                  )
                )}
              </div>

              <div className="flex items-center space-x-3 text-slate-400 text-[11px]">
                <span className="hidden lg:inline">Use Arrow Keys (← / →) or click page edges</span>
                <span className="hidden lg:inline text-slate-600">•</span>
                <span className="text-white font-bold">
                  {Math.round(((spreadIndex + 1) / totalSpreads) * 100)}% Read
                </span>
              </div>
            </>
          )}
        </footer>
      </div>
    </div>
  );
}
