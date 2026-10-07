'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles } from 'lucide-react';

interface BlogAudioPlayerProps {
  title: string;
  excerpt: string;
  readingTimeMinutes: number;
}

export function BlogAudioPlayer({
  title,
  excerpt,
  readingTimeMinutes,
}: BlogAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const startPlayback = () => {
    if (typeof window === 'undefined') return;

    if (!('speechSynthesis' in window)) {
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();

    const narrationText = `You are listening to an engineering dispatch from Upgrader Boy. Title: ${title}. ${excerpt}`;
    const utterance = new SpeechSynthesisUtterance(narrationText);
    utterance.rate = playbackRate;
    utterance.volume = isMuted ? 0 : 1;

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (typeof window === 'undefined') return;

    if (!('speechSynthesis' in window)) {
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPlaying(true);
      } else {
        startPlayback();
      }
    }
  };

  const handleReset = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  const toggleRate = () => {
    const nextRate = playbackRate === 1 ? 1.25 : playbackRate === 1.25 ? 1.5 : 1;
    setPlaybackRate(nextRate);
    if (isPlaying) {
      startPlayback();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (utteranceRef.current && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      utteranceRef.current.volume = !isMuted ? 0 : 1;
    }
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#131C31]/80 border border-slate-200 dark:border-slate-800 shadow-md backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 transition-all">
      {/* Left: Player Badge & Waveform */}
      <div className="flex items-center space-x-3.5 w-full sm:w-auto">
        <button
          onClick={togglePlay}
          className="w-11 h-11 rounded-2xl bg-[var(--accent-color)] text-slate-950 flex items-center justify-center shrink-0 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer glow-btn"
          aria-label={isPlaying ? 'Pause Narration' : 'Listen to Article'}
        >
          {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
        </button>

        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
              {isPlaying ? 'Now Playing Narration' : 'Listen to Audio Dispatch'}
            </span>
            <span className="flex items-center space-x-1 px-1.5 py-0.5 rounded-full bg-[var(--accent-glow)] text-[10px] font-mono text-[var(--accent-color)] border border-[var(--accent-color)]/30">
              <Sparkles className="w-2.5 h-2.5" />
              <span>AI Voice</span>
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            {readingTimeMinutes} min article overview • Narrated audio
          </span>
        </div>
      </div>

      {/* Middle: Equalizer Animation */}
      <div className="flex items-center space-x-1 h-6 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <span
          className={`w-1 rounded-full bg-[var(--accent-color)] transition-all duration-300 ${
            isPlaying ? 'h-5 animate-pulse' : 'h-1.5 opacity-40'
          }`}
        />
        <span
          className={`w-1 rounded-full bg-[var(--accent-color)] transition-all duration-200 ${
            isPlaying ? 'h-3.5 animate-pulse' : 'h-2.5 opacity-40'
          }`}
          style={{ animationDelay: '150ms' }}
        />
        <span
          className={`w-1 rounded-full bg-[var(--accent-color)] transition-all duration-300 ${
            isPlaying ? 'h-6 animate-pulse' : 'h-1.5 opacity-40'
          }`}
          style={{ animationDelay: '300ms' }}
        />
        <span
          className={`w-1 rounded-full bg-[var(--accent-color)] transition-all duration-200 ${
            isPlaying ? 'h-4 animate-pulse' : 'h-3 opacity-40'
          }`}
          style={{ animationDelay: '450ms' }}
        />
        <span
          className={`w-1 rounded-full bg-[var(--accent-color)] transition-all duration-300 ${
            isPlaying ? 'h-2.5 animate-pulse' : 'h-1.5 opacity-40'
          }`}
          style={{ animationDelay: '600ms' }}
        />
      </div>

      {/* Right: Audio Controls */}
      <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
        {/* Speed toggle */}
        <button
          onClick={toggleRate}
          className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          title="Playback Speed"
        >
          {playbackRate}x
        </button>

        {/* Mute toggle */}
        <button
          onClick={toggleMute}
          className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Reset button */}
        {isPlaying && (
          <button
            onClick={handleReset}
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            title="Stop & Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
