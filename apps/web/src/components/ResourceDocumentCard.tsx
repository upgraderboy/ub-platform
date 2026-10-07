'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Download,
  Eye,
  Calendar,
  BookOpen,
  Trophy,
  ShieldCheck,
  Binary,
  Code2,
  Check,
  Share2,
} from 'lucide-react';
import type { ResourceDocument } from '@ub/types';

interface ResourceDocumentCardProps {
  document: ResourceDocument;
  onPreview: (doc: ResourceDocument) => void;
  onOpenBook?: (doc: ResourceDocument) => void;
}

export function ResourceDocumentCard({
  document,
  onPreview,
  onOpenBook,
}: ResourceDocumentCardProps) {
  const [isCopied, setIsCopied] = useState(false);

  const formattedSize = document.fileSizeBytes
    ? (document.fileSizeBytes / (1024 * 1024)).toFixed(1) + ' MB'
    : '2.4 MB';

  const formattedDate = new Date(document.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Calculate dynamic category styling & badges
  const getCardTheme = () => {
    if (document.tags.some((t) => t.toLowerCase().includes('sih') || t.toLowerCase().includes('deck'))) {
      return {
        pill: 'SIH 2024 NATIONAL 1ST PRIZE',
        pillBg: 'bg-amber-500/15 text-amber-500 dark:text-amber-400 border-amber-500/30',
        badgeDot: 'bg-amber-500',
        spineGradient: 'from-amber-500 via-orange-500 to-amber-600',
        glowHover: 'hover:shadow-[0_24px_50px_rgba(245,158,11,0.22)]',
        borderHover: 'hover:border-amber-500/60',
        accentColor: 'text-amber-500',
        icon: Trophy,
        bannerTag: 'National Winning Blueprint',
        readTime: '~18 Min Read',
      };
    }
    if (document.tags.some((t) => t.toLowerCase().includes('security') || t.toLowerCase().includes('jwt'))) {
      return {
        pill: 'SECURITY HARDENING MATRIX',
        pillBg: 'bg-rose-500/15 text-rose-500 dark:text-rose-400 border-rose-500/30',
        badgeDot: 'bg-rose-500',
        spineGradient: 'from-rose-500 via-pink-500 to-rose-600',
        glowHover: 'hover:shadow-[0_24px_50px_rgba(244,63,94,0.22)]',
        borderHover: 'hover:border-rose-500/60',
        accentColor: 'text-rose-500',
        icon: ShieldCheck,
        bannerTag: 'Defense-in-Depth Protocol',
        readTime: '~14 Min Read',
      };
    }
    if (document.tags.some((t) => t.toLowerCase().includes('system') || t.toLowerCase().includes('redis'))) {
      return {
        pill: 'DISTRIBUTED ARCHITECTURE',
        pillBg: 'bg-cyan-500/15 text-cyan-500 dark:text-cyan-400 border-cyan-500/30',
        badgeDot: 'bg-cyan-500',
        spineGradient: 'from-cyan-500 via-blue-500 to-cyan-600',
        glowHover: 'hover:shadow-[0_24px_50px_rgba(6,182,212,0.22)]',
        borderHover: 'hover:border-cyan-500/60',
        accentColor: 'text-cyan-500',
        icon: Binary,
        bannerTag: 'High-Throughput Blueprint',
        readTime: '~22 Min Read',
      };
    }
    return {
      pill: 'CORE CS PLAYBOOK',
      pillBg: 'bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 border-emerald-500/30',
      badgeDot: 'bg-emerald-500',
      spineGradient: 'from-emerald-500 via-teal-500 to-emerald-600',
      glowHover: 'hover:shadow-[0_24px_50px_rgba(16,185,129,0.22)]',
      borderHover: 'hover:border-emerald-500/60',
      accentColor: 'text-emerald-500',
      icon: Code2,
      bannerTag: 'Handcrafted Engineering Notes',
      readTime: '~16 Min Read',
    };
  };

  const theme = getCardTheme();
  const ThemeIcon = theme.icon;

  const handleCardClick = () => {
    if (onOpenBook) {
      onOpenBook(document);
    } else {
      onPreview(document);
    }
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/resources#${document.id}`;
      navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <article
      className={`group relative flex flex-col justify-between rounded-3xl bg-white dark:bg-[#131C31] border border-slate-200/90 dark:border-slate-800/90 ${theme.borderHover} shadow-sm ${theme.glowHover} transition-all duration-300 overflow-hidden hover:-translate-y-2 cursor-pointer select-none`}
      onClick={handleCardClick}
    >
      {/* 3D Realistic Bound Book Spine on left edge with stitches */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-2.5 bg-gradient-to-b ${theme.spineGradient} z-20 group-hover:w-3 transition-all shadow-inner flex flex-col justify-around py-4 items-center`}
      >
        <div className="w-0.5 h-3 rounded-full bg-white/40" />
        <div className="w-0.5 h-3 rounded-full bg-white/40" />
        <div className="w-0.5 h-3 rounded-full bg-white/40" />
        <div className="w-0.5 h-3 rounded-full bg-white/40" />
      </div>

      {/* Top Cover Visual Container */}
      <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-950 pl-2.5">
        {document.thumbnailUrl ? (
          <Image
            src={document.thumbnailUrl}
            alt={document.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-108 transition-transform duration-700 opacity-80 group-hover:opacity-95"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950">
            <BookOpen className="w-14 h-14 text-[var(--accent-color)] opacity-40" />
          </div>
        )}

        {/* Ambient Dark Gradient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10" />

        {/* Realistic Page Fold Corner in top right */}
        <div className="absolute top-0 right-0 w-8 h-8 z-20 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-bl from-slate-300 via-white to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-800 shadow-lg rounded-bl-xl border-l border-b border-white/30" />
        </div>

        {/* Top Floating Badges Bar */}
        <div className="absolute top-3.5 left-4.5 right-11 flex items-center justify-between z-20">
          <span
            className={`flex items-center space-x-1.5 text-[9px] font-mono font-bold px-3 py-1 rounded-full border backdrop-blur-md shadow-sm truncate ${theme.pillBg}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${theme.badgeDot} animate-pulse`} />
            <span className="truncate">{theme.pill}</span>
          </span>

          <div className="flex items-center space-x-1.5 shrink-0">
            <span className="text-[10px] font-mono font-black uppercase text-[var(--accent-color)] bg-slate-950/90 backdrop-blur-md px-2 py-0.5 rounded-md border border-[var(--accent-color)]/30 shadow-2xs">
              .{document.fileExtension || 'PDF'}
            </span>
            <span className="text-[10px] font-mono font-bold text-white/95 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/15 shadow-2xs">
              {formattedSize}
            </span>
          </div>
        </div>

        {/* Bottom Floating Visual Badge */}
        <div className="absolute bottom-3 left-4.5 z-20 flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-[var(--accent-color)] text-slate-950 flex items-center justify-center font-bold shadow-md group-hover:scale-110 transition-transform">
            <ThemeIcon className="w-4 h-4" />
          </div>
          <span className="text-xs font-mono font-bold text-white tracking-wide shadow-xs drop-shadow-md">
            {theme.bannerTag}
          </span>
        </div>
      </div>

      {/* Card Content & Details */}
      <div className="p-5 sm:p-6 pl-6 sm:pl-7 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Metadata Row: Date & Reading Investment */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{formattedDate}</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700">
              {theme.readTime}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base sm:text-lg font-heading font-black text-slate-900 dark:text-white group-hover:text-[var(--accent-color)] transition-colors leading-snug line-clamp-2">
            {document.title}
          </h3>

          {/* Abstract Excerpt */}
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
            {document.description}
          </p>
        </div>

        {/* Tags Rail */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {document.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-mono px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 font-medium"
            >
              #{tag}
            </span>
          ))}
          {document.tags.length > 3 && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 text-slate-400 self-center">
              +{document.tags.length - 3}
            </span>
          )}
        </div>

        {/* Actions Dock */}
        <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
          {/* Primary Read 3D Book Action */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            className="flex-1 inline-flex items-center justify-center space-x-2 py-2 px-3.5 rounded-xl bg-[var(--accent-color)] text-slate-950 text-xs font-bold font-mono glow-btn transition-all cursor-pointer shadow-xs group/btn"
            title="Read as Realistic 3D Hardcover Book"
          >
            <BookOpen className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
            <span>Read 3D Book</span>
          </button>

          {/* Secondary Action Toolset */}
          <div className="flex items-center space-x-1 shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPreview(document);
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Preview PDF Document"
            >
              <Eye className="w-4 h-4" />
            </button>

            <a
              href={document.pdfUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={`Download Original .${(document.fileExtension || 'PDF').toUpperCase()}`}
            >
              <Download className="w-4 h-4" />
            </a>

            <button
              onClick={handleCopyLink}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Copy Playbook Link"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Card Bottom Hover Accent Glow Beam */}
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--accent-color)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </article>
  );
}
