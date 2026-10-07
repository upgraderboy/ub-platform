'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Trophy,
  Share2,
  Check,
  Heart,
  Flame,
  Sparkles,
} from 'lucide-react';
import type { Memory } from '@ub/types';

interface MemoryDossierModalProps {
  memory: Memory | null;
  initialPhotoIndex?: number;
  onClose: () => void;
}

export function MemoryDossierModal({
  memory,
  initialPhotoIndex = 0,
  onClose,
}: MemoryDossierModalProps) {
  const [activePhotoIndex, setActivePhotoIndex] = useState(initialPhotoIndex);
  const [isCopied, setIsCopied] = useState(false);
  const [modalReactions, setModalReactions] = useState({
    love: 184,
    fire: 142,
    vibe: 98,
  });
  const [hasReacted, setHasReacted] = useState<Record<string, boolean>>({});

  const photos =
    memory?.gallery && memory.gallery.length > 0
      ? memory.gallery
      : memory?.images || [];

  const handleNextPhoto = useCallback(() => {
    if (photos.length > 1) {
      setActivePhotoIndex((prev) => (prev + 1) % photos.length);
    }
  }, [photos.length]);

  const handlePrevPhoto = useCallback(() => {
    if (photos.length > 1) {
      setActivePhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
    }
  }, [photos.length]);

  // Keyboard controls
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNextPhoto();
      } else if (e.key === 'ArrowLeft') {
        handlePrevPhoto();
      }
    }

    if (memory && typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown);
      window.document.body.style.overflow = 'hidden';
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('keydown', handleKeyDown);
        window.document.body.style.overflow = 'auto';
      }
    };
  }, [memory, onClose, handleNextPhoto, handlePrevPhoto]);

  if (!memory) return null;

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/memories#${memory.id}`;
      navigator.clipboard.writeText(url).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
    }
  };

  const handleHeartReact = (type: 'love' | 'fire' | 'vibe') => {
    if (hasReacted[type]) return;
    setModalReactions((prev) => ({
      ...prev,
      [type]: prev[type] + 1,
    }));
    setHasReacted((prev) => ({
      ...prev,
      [type]: true,
    }));
  };

  const formattedDate = new Date(memory.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const activePhotoUrl = photos[activePhotoIndex] || memory.coverImage || '';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-2 sm:p-4 lg:p-6 overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      {/* Ambient Halo reflecting the current active photo behind the modal */}
      {activePhotoUrl && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 opacity-30">
          <Image
            src={activePhotoUrl}
            alt="Ambient blur"
            fill
            sizes="100vw"
            className="object-cover blur-3xl scale-125"
          />
        </div>
      )}

      {/* Main Lightbox Card */}
      <div
        className="relative w-full max-w-5xl bg-[#0B0F19]/95 border border-white/10 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden my-auto flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ======================================================== */}
        {/* TOP BAR: TITLE, LOCATION, SHARE & CLOSE                   */}
        {/* ======================================================== */}
        <div className="px-5 py-4 sm:px-6 flex items-center justify-between border-b border-white/10 bg-black/40 backdrop-blur-md z-30">
          <div className="flex items-center space-x-3 overflow-hidden">
            {memory.badge && (
              <span className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold tracking-wider shrink-0">
                <Trophy className="w-3 h-3 text-amber-300" />
                <span>{memory.badge}</span>
              </span>
            )}
            <div className="truncate">
              <h2 className="text-sm sm:text-base font-heading font-black text-white truncate">
                {memory.title}
              </h2>
              <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-400">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3 text-[var(--accent-color)]" />
                  <span>{formattedDate}</span>
                </span>
                {memory.location && (
                  <>
                    <span>•</span>
                    <span className="flex items-center space-x-1 text-slate-300 truncate">
                      <MapPin className="w-3 h-3 text-rose-400" />
                      <span className="truncate">{memory.location}</span>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer text-xs font-mono flex items-center space-x-1.5"
              title="Share link to this memory"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{isCopied ? 'Copied' : 'Share'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* CENTER STAGE: VIBRANT HIGH-RES PHOTO SHOWCASE            */}
        {/* ======================================================== */}
        <div className="relative flex-1 w-full bg-black/60 flex items-center justify-center min-h-[300px] sm:min-h-[440px] lg:min-h-[500px] overflow-hidden select-none">
          {photos.length > 0 ? (
            <div className="relative w-full h-full min-h-[300px] sm:min-h-[440px] lg:min-h-[500px] p-2 sm:p-4 flex items-center justify-center">
              <Image
                src={activePhotoUrl}
                alt={`${memory.title} - Photo ${activePhotoIndex + 1}`}
                fill
                sizes="(max-width: 1024px) 100vw, 85vw"
                className="object-contain transition-all duration-500 rounded-xl"
                priority
              />
            </div>
          ) : (
            <div className="text-slate-500 font-mono text-xs">No media preview available</div>
          )}

          {/* Retro Film Timestamp */}
          <div className="absolute bottom-4 right-4 z-20 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md font-mono font-bold text-amber-400 text-xs tracking-widest border border-amber-500/30 select-none shadow-lg">
            &apos;{memory.date.slice(2, 4)} {memory.date.slice(5, 7)} {memory.date.slice(8, 10)}
          </div>

          {/* Photo Counter Pill in upper-left */}
          <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md font-mono font-bold text-slate-200 text-xs border border-white/15 select-none shadow-md">
            {activePhotoIndex + 1} of {photos.length}
          </div>

          {/* Carousel Next / Prev Arrows */}
          {photos.length > 1 && (
            <>
              <button
                onClick={handlePrevPhoto}
                className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/70 hover:bg-white/20 text-white border border-white/20 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer z-30 shadow-xl"
                title="Previous Photo (Left Arrow)"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNextPhoto}
                className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/70 hover:bg-white/20 text-white border border-white/20 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer z-30 shadow-xl"
                title="Next Photo (Right Arrow)"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

        {/* ======================================================== */}
        {/* BOTTOM FILMSTRIP & STORY SECTION                         */}
        {/* ======================================================== */}
        <div className="p-4 sm:p-6 bg-black/50 border-t border-white/10 space-y-4">
          {/* Thumbnail Filmstrip */}
          {photos.length > 1 && (
            <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none pb-1">
              {photos.map((url, idx) => (
                <button
                  key={url + idx}
                  onClick={() => setActivePhotoIndex(idx)}
                  className={`relative w-16 h-12 sm:w-20 sm:h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    activePhotoIndex === idx
                      ? 'border-[var(--accent-color)] ring-2 ring-[var(--accent-color)]/30 scale-105 shadow-lg'
                      : 'border-white/10 opacity-50 hover:opacity-100 hover:border-white/30'
                  }`}
                >
                  <Image
                    src={url}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Narrative Story & Interactive Reactions Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed max-w-2xl">
              {memory.description}
            </p>

            {/* Quick Cheer / Love Reaction Buttons */}
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => handleHeartReact('love')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                  hasReacted.love
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold scale-105'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10 hover:border-rose-400/40'
                }`}
                title="Send Love"
              >
                <Heart className={`w-3.5 h-3.5 ${hasReacted.love ? 'fill-rose-400 text-rose-400' : 'text-rose-400'}`} />
                <span>{modalReactions.love}</span>
              </button>

              <button
                onClick={() => handleHeartReact('fire')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                  hasReacted.fire
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold scale-105'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10 hover:border-amber-400/40'
                }`}
                title="That's Fire"
              >
                <Flame className={`w-3.5 h-3.5 ${hasReacted.fire ? 'fill-amber-400 text-amber-400' : 'text-amber-400'}`} />
                <span>{modalReactions.fire}</span>
              </button>

              <button
                onClick={() => handleHeartReact('vibe')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                  hasReacted.vibe
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 font-bold scale-105'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10 hover:border-purple-400/40'
                }`}
                title="Pure Vibe"
              >
                <Sparkles className={`w-3.5 h-3.5 text-purple-400`} />
                <span>{modalReactions.vibe}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
