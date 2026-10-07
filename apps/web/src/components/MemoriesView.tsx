'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  Sparkles,
  Trophy,
  MapPin,
  Camera,
  ChevronRight,
  Volume2,
  VolumeX,
  Compass,
  Calendar,
  Grid3X3,
  LayoutGrid,
  Images,
} from 'lucide-react';
import type { Memory, MemoryCategory, MemoryMood } from '@ub/types';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { MemoryDossierModal } from './MemoryDossierModal';
import {
  ModernSearchCapsule,
  SearchScopeField,
  CategoryOption,
} from './ModernSearchCapsule';
import { DateRange } from './DateRangePicker';

interface MemoriesViewProps {
  initialMemories: Memory[];
}

export type MemoryViewPerspective = 'polaroid' | 'chronicle' | 'photos';

export interface MoodOption {
  id: string;
  label: string;
  icon: string;
  tagline: string;
  glowColor: string;
  accentColor: string;
  gradient: string;
}

interface PhotoItem {
  id: string;
  memory: Memory;
  photoUrl: string;
  photoIndex: number;
  totalPhotos: number;
  date: string;
  title: string;
  location?: string;
  mood?: MemoryMood;
  badge?: string;
}

interface MonthPhotoGroup {
  monthKey: string;
  year: string;
  photos: PhotoItem[];
}

const MOOD_OPTIONS: MoodOption[] = [
  {
    id: 'all',
    label: 'All Vibes',
    icon: '✨',
    tagline: 'The full life album across every milestone and trip',
    glowColor: 'var(--accent-glow)',
    accentColor: 'var(--accent-color)',
    gradient: 'from-[var(--accent-color)] via-cyan-400 to-blue-500',
  },
  {
    id: 'triumph',
    label: 'Winning Moments',
    icon: '🏆',
    tagline: 'National trophies, auditorium stage cheers & celebrations',
    glowColor: 'rgba(245, 158, 11, 0.45)',
    accentColor: '#f59e0b',
    gradient: 'from-amber-400 via-yellow-400 to-orange-500',
  },
  {
    id: 'grit',
    label: 'Late Night Energy',
    icon: '⚡',
    tagline: '3 AM hostel chai, 36hr hackathons & deep brotherhood',
    glowColor: 'rgba(6, 182, 212, 0.45)',
    accentColor: '#06b6d4',
    gradient: 'from-cyan-400 via-teal-400 to-emerald-500',
  },
  {
    id: 'nostalgia',
    label: 'Nostalgic Roots',
    icon: '☕',
    tagline: 'College roadtrips, campus laughter, farewells & golden days',
    glowColor: 'rgba(249, 115, 22, 0.45)',
    accentColor: '#f97316',
    gradient: 'from-orange-400 via-rose-400 to-pink-500',
  },
  {
    id: 'visionary',
    label: 'Spotlight & Talks',
    icon: '💡',
    tagline: 'Stage keynotes, studio launches & big dream conversations',
    glowColor: 'rgba(168, 85, 247, 0.45)',
    accentColor: '#a855f7',
    gradient: 'from-purple-400 via-violet-400 to-indigo-500',
  },
];

const WASHI_TAPES = [
  'bg-rose-300/80 dark:bg-rose-400/40 border-rose-400/50',
  'bg-amber-300/80 dark:bg-amber-400/40 border-amber-400/50',
  'bg-emerald-300/80 dark:bg-emerald-400/40 border-emerald-400/50',
  'bg-purple-300/80 dark:bg-purple-400/40 border-purple-400/50',
  'bg-cyan-300/80 dark:bg-cyan-400/40 border-cyan-400/50',
];

const MEMORY_SEARCH_FIELDS: { id: SearchScopeField; label: string; desc: string }[] = [
  { id: 'title', label: 'Memory Title', desc: 'Event, chapter or headline' },
  { id: 'tags', label: 'Locations & Badges', desc: 'Cities, venues or award tags' },
  { id: 'description', label: 'Stories & Feelings', desc: 'Narrative notes & memory context' },
  { id: 'category', label: 'Categories', desc: 'College, hackathons, roadtrips, etc.' },
];

export function MemoriesView({ initialMemories }: MemoriesViewProps) {
  const [selectedPerspective, setSelectedPerspective] =
    useState<MemoryViewPerspective>('polaroid');
  const [activeMood, setActiveMood] = useState<string>('all');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const [showFilmGrain, setShowFilmGrain] = useState(false);
  const [soundscapePlaying, setSoundscapePlaying] = useState(false);

  // Google Photos Density state
  const [photosGridDensity, setPhotosGridDensity] = useState<'comfortable' | 'compact'>('comfortable');

  // Modern Search Capsule state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFields, setSelectedFields] = useState<SearchScopeField[]>([
    'title',
    'tags',
    'description',
    'category',
  ]);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });
  const [sortBy, setSortBy] = useState<string>('newest');

  const audioCtxRef = useRef<AudioContext | null>(null);

  const [reactions, setReactions] = useState<Record<string, number>>({
    legendary: 142,
    relentless: 98,
    inspired: 175,
  });
  const [userVoted, setUserVoted] = useState<Record<string, boolean>>({});

  // Soundscape toggle using gentle analog vinyl/tape noise generator via Web Audio API
  const toggleSoundscape = () => {
    if (soundscapePlaying) {
      if (audioCtxRef.current) {
        audioCtxRef.current.suspend().catch(() => {});
      }
      setSoundscapePlaying(false);
    } else {
      try {
        if (!audioCtxRef.current) {
          const AudioContextClass =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext })
              .webkitAudioContext;
          const ctx = new AudioContextClass();
          audioCtxRef.current = ctx;

          // Generate gentle warm projector/vinyl tape hum buffer
          const bufferSize = ctx.sampleRate * 2;
          const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const output = noiseBuffer.getChannelData(0);
          let b0 = 0,
            b1 = 0,
            b2 = 0;
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99 * b0 + white * 0.05;
            b1 = 0.95 * b1 + white * 0.05;
            b2 = 0.85 * b2 + white * 0.05;
            output[i] = (b0 + b1 + b2) * 0.12;
          }

          const whiteNoise = ctx.createBufferSource();
          whiteNoise.buffer = noiseBuffer;
          whiteNoise.loop = true;

          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(320, ctx.currentTime);

          const gainNode = ctx.createGain();
          gainNode.gain.setValueAtTime(0.035, ctx.currentTime);

          whiteNoise.connect(filter);
          filter.connect(gainNode);
          gainNode.connect(ctx.destination);
          whiteNoise.start(0);
        } else {
          audioCtxRef.current.resume().catch(() => {});
        }
        setSoundscapePlaying(true);
      } catch {
        // AudioContext unavailable or autoplay constrained
      }
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const handleReaction = (type: string) => {
    if (userVoted[type]) return;
    setReactions((prev) => ({
      ...prev,
      [type]: (prev[type] || 0) + 1,
    }));
    setUserVoted((prev) => ({
      ...prev,
      [type]: true,
    }));
  };

  const handleToggleField = (field: SearchScopeField) => {
    setSelectedFields((prev) =>
      prev.includes(field)
        ? prev.length > 1
          ? prev.filter((f) => f !== field)
          : prev
        : [...prev, field]
    );
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveCategory('all');
    setActiveMood('all');
    setDateRange({ startDate: null, endDate: null });
    setSortBy('newest');
  };

  const currentMoodMeta =
    MOOD_OPTIONS.find((m) => m.id === activeMood) || MOOD_OPTIONS[0];

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: initialMemories.length };
    initialMemories.forEach((mem) => {
      const cats = mem.categories || (mem.category ? [mem.category] : []);
      cats.forEach((cat) => {
        counts[cat] = (counts[cat] || 0) + 1;
      });
    });
    return counts;
  }, [initialMemories]);

  const CATEGORY_OPTIONS: CategoryOption[] = [
    { id: 'all', label: 'All Photos', count: categoryCounts.all || 0 },
    { id: 'college', label: 'College & Hostel', count: categoryCounts.college || 0 },
    { id: 'hackathons', label: 'Hackathons & Wins', count: categoryCounts.hackathons || 0 },
    { id: 'meetups', label: 'Stages & Keynotes', count: categoryCounts.meetups || 0 },
    { id: 'milestones', label: 'Milestones & Trips', count: categoryCounts.milestones || 0 },
    { id: 'work', label: 'Studio & Agency', count: categoryCounts.work || 0 },
  ];

  // Filter memories based on active category, active mood, search query, and date range
  const filteredMemories = useMemo(() => {
    const filtered = initialMemories.filter((mem) => {
      // Category match
      const memCategories =
        mem.categories || (mem.category ? [mem.category] : []);
      const matchesCategory =
        activeCategory === 'all' ||
        memCategories.includes(activeCategory as MemoryCategory);

      // Mood match
      const matchesMood =
        activeMood === 'all' ||
        mem.mood === activeMood ||
        Boolean(mem.moods?.includes(activeMood as MemoryMood));

      // Date range match
      const memDate = mem.date;
      const matchesDate =
        (!dateRange.startDate || memDate >= dateRange.startDate) &&
        (!dateRange.endDate || memDate <= dateRange.endDate);

      // Search query match across selected fields
      const q = searchQuery.trim().toLowerCase();
      let matchesSearch = !q;
      if (q) {
        const matchTitle =
          selectedFields.includes('title') &&
          mem.title.toLowerCase().includes(q);
        const matchTags =
          selectedFields.includes('tags') &&
          Boolean(
            (mem.location && mem.location.toLowerCase().includes(q)) ||
            (mem.badge && mem.badge.toLowerCase().includes(q))
          );
        const matchDesc =
          selectedFields.includes('description') &&
          mem.description.toLowerCase().includes(q);
        const matchCat =
          selectedFields.includes('category') &&
          memCategories.some((c) => c.toLowerCase().includes(q));

        matchesSearch = matchTitle || matchTags || matchDesc || matchCat;
      }

      return matchesCategory && matchesMood && matchesDate && matchesSearch;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      if (sortBy === 'featured') {
        const aFeat = a.badge ? 1 : 0;
        const bFeat = b.badge ? 1 : 0;
        return bFeat - aFeat;
      }
      if (sortBy === 'alpha') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [
    initialMemories,
    activeCategory,
    activeMood,
    dateRange,
    searchQuery,
    selectedFields,
    sortBy,
  ]);

  // Group filtered memories by year for the Chronicle Timeline perspective
  const memoriesByYear = useMemo(() => {
    const grouped: Record<string, Memory[]> = {};
    filteredMemories.forEach((mem) => {
      const year = mem.year || mem.date.slice(0, 4) || '2024';
      if (!grouped[year]) grouped[year] = [];
      grouped[year].push(mem);
    });
    return Object.entries(grouped).sort(([a], [b]) => Number(b) - Number(a));
  }, [filteredMemories]);

  // Extract all individual photos and group chronologically descending by Month & Year for Google Photos Stream
  const monthPhotoGroups = useMemo(() => {
    const allPhotos: PhotoItem[] = [];
    filteredMemories.forEach((mem) => {
      const list =
        mem.gallery && mem.gallery.length > 0 ? mem.gallery : mem.images;
      list.forEach((url, pIdx) => {
        allPhotos.push({
          id: `${mem.id}-photo-${pIdx}`,
          memory: mem,
          photoUrl: url,
          photoIndex: pIdx,
          totalPhotos: list.length,
          date: mem.date,
          title: mem.title,
          location: mem.location,
          mood: mem.mood,
          badge: mem.badge,
        });
      });
    });

    // Sort descending by date (latest first)
    allPhotos.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Group by Month & Year
    const groupsMap: Record<string, PhotoItem[]> = {};
    allPhotos.forEach((item) => {
      const d = new Date(item.date);
      const key = d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
      if (!groupsMap[key]) groupsMap[key] = [];
      groupsMap[key].push(item);
    });

    const result: MonthPhotoGroup[] = [];
    Object.entries(groupsMap).forEach(([monthKey, photos]) => {
      const year = photos[0]?.date.slice(0, 4) || '2024';
      result.push({
        monthKey,
        year,
        photos,
      });
    });

    return result;
  }, [filteredMemories]);

  const totalPhotosCount = useMemo(() => {
    return monthPhotoGroups.reduce((acc, g) => acc + g.photos.length, 0);
  }, [monthPhotoGroups]);

  const getMoodBadge = (mood?: MemoryMood) => {
    switch (mood) {
      case 'grit':
        return { label: '⚡ Late Night', bg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40' };
      case 'triumph':
        return { label: '🏆 Champion', bg: 'bg-amber-500/20 text-amber-400 border-amber-500/40' };
      case 'nostalgia':
        return { label: '☕ Nostalgia', bg: 'bg-orange-500/20 text-orange-400 border-orange-500/40' };
      case 'visionary':
        return { label: '💡 Spotlight', bg: 'bg-purple-500/20 text-purple-400 border-purple-500/40' };
      default:
        return null;
    }
  };

  const handleOpenMemory = (mem: Memory, photoIdx = 0) => {
    setSelectedMemory(mem);
    setSelectedPhotoIndex(photoIdx);
  };

  return (
    <div
      className={`min-h-screen bg-slate-50 dark:bg-[#070A12] text-slate-900 dark:text-slate-100 flex flex-col transition-colors relative overflow-x-clip ${
        showFilmGrain ? 'film-grain-active' : ''
      }`}
    >
      <Navbar />

      {/* Dynamic Ambient Glow Orb reacting to active Mood */}
      <div
        className="absolute top-20 left-1/2 -translate-x-1/2 w-[950px] h-[520px] rounded-full blur-[170px] pointer-events-none opacity-45 -z-10 transition-colors duration-700"
        style={{ backgroundColor: currentMoodMeta.glowColor }}
      />

      {/* ======================================================== */}
      {/* MAIN CONTAINER                                           */}
      {/* ======================================================== */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-24 w-full space-y-8 sm:space-y-10">
        {/* ======================================================== */}
        {/* HERO INTRO SECTION                                       */}
        {/* ======================================================== */}
        <section className="text-center max-w-3xl mx-auto space-y-5 pt-2">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs font-mono text-[var(--accent-color)] shadow-xs">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span className="font-bold tracking-wider">VISUAL MEMORIES • THE PERSONAL ODYSSEY</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            Moments of{' '}
            <span
              className={`text-transparent bg-clip-text bg-gradient-to-r ${currentMoodMeta.gradient} transition-all duration-500`}
            >
              Laughter, Podiums & Life
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
            From 36-hour national hackathon trophies to 3 AM hostel rooftop chai, mountain roadtrips, and convocation caps.
            The authentic story and pictures behind the journey.
          </p>

          {/* Cheer / Metric Bar */}
          <div className="pt-1 flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
              <Camera className="w-3.5 h-3.5 text-[var(--accent-color)]" />
              <span>{initialMemories.length} Chapters • {totalPhotosCount} Photos</span>
            </div>

            <button
              onClick={() => handleReaction('legendary')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                userVoted.legendary
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 font-bold'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-500/40 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span>🏆 Legendary</span>
              <span className="font-bold text-[10px] text-amber-400">({reactions.legendary})</span>
            </button>

            <button
              onClick={() => handleReaction('relentless')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                userVoted.relentless
                  ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 font-bold'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span>⚡ Fire</span>
              <span className="font-bold text-[10px] text-cyan-400">({reactions.relentless})</span>
            </button>

            <button
              onClick={() => handleReaction('inspired')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                userVoted.inspired
                  ? 'bg-purple-500/20 text-purple-400 border-purple-500/40 font-bold'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-purple-500/40 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span>✨ Vibe</span>
              <span className="font-bold text-[10px] text-purple-400">({reactions.inspired})</span>
            </button>
          </div>
        </section>

        {/* ======================================================== */}
        {/* VISITOR MOOD SELECTOR                                     */}
        {/* ======================================================== */}
        <section className="p-4 sm:p-5 rounded-3xl bg-white/80 dark:bg-[#111625]/90 border border-slate-200 dark:border-slate-800 shadow-md backdrop-blur-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--accent-color)] flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>EXPERIENCE ACCORDING TO YOUR MOOD</span>
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Choose the vibe you want to feel while browsing this visual album.
              </p>
            </div>

            {/* Atmosphere Controls: Soundscape & Film Grain */}
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleSoundscape}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-mono border transition-all cursor-pointer ${
                  soundscapePlaying
                    ? 'bg-[var(--accent-color)] text-slate-950 font-bold border-transparent shadow-xs animate-pulse'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Toggle ambient warm lo-fi tape soundscape"
              >
                {soundscapePlaying ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>{soundscapePlaying ? 'Lo-Fi Audio: ON' : 'Audio Atmosphere'}</span>
              </button>

              <button
                onClick={() => setShowFilmGrain(!showFilmGrain)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono border transition-all cursor-pointer shrink-0 ${
                  showFilmGrain
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 font-bold'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                }`}
                title="Toggle authentic 35mm film grain atmosphere"
              >
                <span>{showFilmGrain ? 'Grain: ON' : '35mm Grain'}</span>
              </button>
            </div>
          </div>

          {/* Mood Selection Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {MOOD_OPTIONS.map((m) => {
              const isActive = activeMood === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveMood(m.id)}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? 'bg-slate-950 text-white border-[var(--accent-color)] shadow-[0_0_20px_rgba(0,0,0,0.25)] ring-1 ring-[var(--accent-color)] scale-[1.02]'
                      : 'bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-lg">{m.icon}</span>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-[var(--accent-color)] animate-ping" />
                    )}
                  </div>
                  <span className="font-heading font-black text-xs block leading-tight">
                    {m.label}
                  </span>
                  <span className="text-[10px] font-sans text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {m.tagline}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Mood Status */}
          <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-mono">
            <div className="flex items-center space-x-2">
              <span className="text-slate-400">Current Vibe:</span>
              <span className="font-bold text-[var(--accent-color)] flex items-center space-x-1">
                <span>{currentMoodMeta.icon}</span>
                <span>{currentMoodMeta.label}</span>
              </span>
              <span className="text-slate-400 hidden md:inline">— {currentMoodMeta.tagline}</span>
            </div>
            <span className="text-slate-500 text-[11px]">
              Showing {filteredMemories.length} chapter{filteredMemories.length === 1 ? '' : 's'} matching vibe
            </span>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SIGNATURE CAPSULE SEARCH BAR INTEGRATION                  */}
        {/* ======================================================== */}
        <section className="space-y-4">
          <ModernSearchCapsule
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedFields={selectedFields}
            onToggleField={handleToggleField}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            categories={CATEGORY_OPTIONS}
            selectedCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            onResetFilters={handleResetFilters}
            totalFilteredCount={filteredMemories.length}
            placeholder="Search memories by event, location, emotion, vibe..."
            fieldOptions={MEMORY_SEARCH_FIELDS}
            sortBy={sortBy}
            onSortChange={setSortBy}
            itemTypeLabel="memories"
          />

          {/* Perspective View Switcher Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-3.5 sm:p-4 rounded-3xl bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800 shadow-sm gap-3">
            {/* 3 Core Perspectives: Polaroid Scrapbook, Neon Chronicle, Google Photos Stream */}
            <div className="flex items-center space-x-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs font-mono overflow-x-auto scrollbar-none">
              <button
                onClick={() => setSelectedPerspective('polaroid')}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedPerspective === 'polaroid'
                    ? 'bg-[var(--accent-color)] text-slate-950 shadow-md scale-102'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Aesthetic Vintage Polaroid Wall"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>📸 Polaroid</span>
              </button>

              <button
                onClick={() => setSelectedPerspective('chronicle')}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedPerspective === 'chronicle'
                    ? 'bg-[var(--accent-color)] text-slate-950 shadow-md scale-102'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Illuminated Neon Timeline Chronicle"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>⚡ Chronicle</span>
              </button>

              <button
                onClick={() => setSelectedPerspective('photos')}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedPerspective === 'photos'
                    ? 'bg-[var(--accent-color)] text-slate-950 shadow-md scale-102'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Google Photos Chronological Month Stream"
              >
                <Images className="w-3.5 h-3.5" />
                <span>🖼️ Photos Stream</span>
              </button>
            </div>

            {/* Quick Summary Badge */}
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-500 dark:text-slate-400 px-1">
              <span>{filteredMemories.length} Chapters</span>
              <span>•</span>
              <span className="text-[var(--accent-color)] font-bold">{totalPhotosCount} Photos</span>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* PERSPECTIVE 1: THE AESTHETIC POLAROID SCRAPBOOK WALL     */}
        {/* ======================================================== */}
        {selectedPerspective === 'polaroid' && (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 p-2 sm:p-4 animate-fade-in">
            {filteredMemories.map((mem, idx) => {
              const rotation =
                idx % 4 === 0
                  ? '-rotate-2'
                  : idx % 4 === 1
                    ? 'rotate-1.5'
                    : idx % 4 === 2
                      ? '-rotate-1'
                      : 'rotate-2';

              const washiStyle = WASHI_TAPES[idx % WASHI_TAPES.length];
              const moodBadge = getMoodBadge(mem.mood);

              return (
                <div
                  key={mem.id}
                  onClick={() => handleOpenMemory(mem, 0)}
                  className={`group relative bg-white dark:bg-[#131826] p-4 pb-6 rounded-2xl shadow-[0_12px_30px_-5px_rgba(0,0,0,0.15)] dark:shadow-[0_15px_35px_-5px_rgba(0,0,0,0.5)] border border-slate-200/90 dark:border-slate-700/70 hover:border-[var(--accent-color)]/60 transition-all duration-400 hover:scale-104 hover:rotate-0 hover:z-20 cursor-pointer select-none space-y-3.5 ${rotation}`}
                >
                  {/* Decorative Aesthetic Washi Tape pinned on top */}
                  <div
                    className={`w-20 h-5.5 mx-auto rounded-xs -mt-7 shadow-xs border-dashed border ${washiStyle} transition-transform group-hover:scale-105`}
                  />

                  {/* Photo Canvas Frame with glossy shine glide */}
                  <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden bg-slate-950 border border-black/10 dark:border-white/10 group-hover:shadow-inner">
                    <Image
                      src={mem.coverImage || mem.images[0]}
                      alt={mem.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-106 transition-transform duration-600"
                    />

                    {/* Light sheen glide across photo on hover */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none z-20" />

                    {/* Retro Orange Stamp in photo corner */}
                    <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/70 backdrop-blur-xs font-mono text-[9px] text-amber-400 font-bold border border-amber-500/30 z-20 shadow-xs">
                      &apos;{mem.date.slice(2, 4)} {mem.date.slice(5, 7)} {mem.date.slice(8, 10)}
                    </div>

                    {/* Photo count indicator */}
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md font-mono text-[9px] text-white/90 font-bold border border-white/10 z-20">
                      📸 {mem.gallery?.length || mem.images.length}
                    </div>

                    {/* Mood Badge Sticker on Photo */}
                    {moodBadge && (
                      <div className="absolute top-2.5 left-2.5 z-20">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-bold backdrop-blur-md border ${moodBadge.bg}`}
                        >
                          {moodBadge.label}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Polaroid Story Caption Details */}
                  <div className="space-y-2 pt-1 text-left">
                    <h3 className="font-heading font-black text-base text-slate-900 dark:text-white group-hover:text-[var(--accent-color)] transition-colors leading-tight line-clamp-2">
                      {mem.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-300 font-sans line-clamp-2 leading-relaxed">
                      {mem.description}
                    </p>

                    {/* Card Footer: Location & Click prompt */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      <div className="flex items-center space-x-1 truncate max-w-[180px]">
                        <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                        <span className="truncate">{mem.location}</span>
                      </div>
                      <span className="text-[var(--accent-color)] font-bold group-hover:translate-x-1 transition-transform shrink-0">
                        View Photo Reel →
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {/* ======================================================== */}
        {/* PERSPECTIVE 2: THE ILLUMINATED CHRONICLE PATH TIMELINE   */}
        {/* ======================================================== */}
        {selectedPerspective === 'chronicle' && (
          <section className="relative space-y-12 animate-fade-in py-6 max-w-4xl mx-auto">
            {/* Center Glowing Neon Conduit Line */}
            <div className="absolute left-4 sm:left-1/2 top-4 bottom-4 w-1 -translate-x-1/2 bg-gradient-to-b from-[var(--accent-color)] via-cyan-400 to-purple-600 shadow-[0_0_20px_var(--accent-color)] rounded-full hidden sm:block" />

            {memoriesByYear.map(([year, yearMemories]) => (
              <div key={year} className="space-y-6">
                {/* Year Milestone Node Pill */}
                <div className="flex items-center justify-center">
                  <div className="relative z-20 px-6 py-2 rounded-full bg-slate-950 border-2 border-[var(--accent-color)] shadow-[0_0_25px_rgba(0,255,100,0.35)] font-heading font-black text-sm text-[var(--accent-color)] tracking-wider">
                    EPOCH {year} • {yearMemories.length} MOMENTS
                  </div>
                </div>

                <div className="space-y-8 sm:space-y-10">
                  {yearMemories.map((mem, idx) => {
                    const isEven = idx % 2 === 0;
                    const moodBadge = getMoodBadge(mem.mood);

                    return (
                      <div
                        key={mem.id}
                        className={`flex flex-col sm:flex-row items-center gap-6 sm:gap-10 ${
                          isEven ? 'sm:flex-row-reverse' : ''
                        }`}
                      >
                        {/* Timeline Glassmorphism Card */}
                        <div
                          onClick={() => handleOpenMemory(mem, 0)}
                          className="w-full sm:w-1/2 p-5 sm:p-6 rounded-3xl bg-white/90 dark:bg-[#111728]/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all duration-400 cursor-pointer group hover:-translate-y-1.5 hover:border-[var(--accent-color)]/60 space-y-3.5"
                        >
                          {/* 16:9 Cinematic Photo with Hover Zoom */}
                          <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-slate-950 border border-white/10">
                            <Image
                              src={mem.coverImage || mem.images[0]}
                              alt={mem.title}
                              fill
                              sizes="(max-width: 640px) 100vw, 50vw"
                              className="object-cover group-hover:scale-108 transition-transform duration-600"
                            />

                            {/* Retro Date Stamp */}
                            <div className="absolute top-3 right-3 z-20 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md font-mono text-[9px] text-amber-400 font-bold border border-amber-500/30">
                              {new Date(mem.date).toLocaleDateString()}
                            </div>

                            {/* Mood Badge */}
                            {moodBadge && (
                              <div className="absolute top-3 left-3 z-20">
                                <span
                                  className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-bold backdrop-blur-md border ${moodBadge.bg}`}
                                >
                                  {moodBadge.label}
                                </span>
                              </div>
                            )}

                            {/* Photo Count badge */}
                            <div className="absolute bottom-3 left-3 z-20 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md font-mono text-[9px] text-white font-bold border border-white/10">
                              📸 {mem.gallery?.length || mem.images.length} Photos
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            {mem.badge && (
                              <span className="text-[11px] font-mono font-bold text-amber-400 flex items-center space-x-1">
                                <Trophy className="w-3 h-3 text-amber-400" />
                                <span>{mem.badge}</span>
                              </span>
                            )}
                            <h4 className="font-heading font-black text-lg text-slate-900 dark:text-white group-hover:text-[var(--accent-color)] transition-colors leading-snug">
                              {mem.title}
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-300 font-sans line-clamp-2 leading-relaxed">
                              {mem.description}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
                            <span className="text-slate-400 text-[11px] flex items-center space-x-1">
                              <MapPin className="w-3 h-3 text-rose-400" />
                              <span>{mem.location}</span>
                            </span>
                            <span className="text-[var(--accent-color)] font-bold group-hover:translate-x-1 transition-transform flex items-center space-x-0.5">
                              <span>Open Reel</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>

                        {/* Central Glowing Timeline Node Orb */}
                        <div className="hidden sm:flex w-8 h-8 rounded-full bg-slate-950 border-4 border-[var(--accent-color)] z-20 items-center justify-center shadow-[0_0_15px_var(--accent-color)] shrink-0 group-hover:scale-125 transition-transform">
                          <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                        </div>

                        {/* Empty Space for opposite alternating layout */}
                        <div className="hidden sm:block sm:w-1/2" />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* ======================================================== */}
        {/* PERSPECTIVE 3: GOOGLE PHOTOS CHRONOLOGICAL STREAM        */}
        {/* ======================================================== */}
        {selectedPerspective === 'photos' && (
          <section className="space-y-10 animate-fade-in">
            {/* Top Google Photos Controls: Density Selector & Total Highlights */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-3xl bg-white/70 dark:bg-[#111625]/80 backdrop-blur-md border border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-[var(--accent-color)] flex items-center space-x-1">
                  <Images className="w-4 h-4" />
                  <span>CHRONOLOGICAL MOMENTS STREAM</span>
                </span>
                <span className="text-xs font-mono text-slate-400">
                  • {totalPhotosCount} Unbundled Photos across {monthPhotoGroups.length} Month Sections
                </span>
              </div>

              {/* Density Toggle (Comfortable vs Compact) */}
              <div className="flex items-center space-x-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono">
                <button
                  onClick={() => setPhotosGridDensity('comfortable')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    photosGridDensity === 'comfortable'
                      ? 'bg-[var(--accent-color)] text-slate-950 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Comfortable Grid (Larger Preview)"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Comfortable</span>
                </button>

                <button
                  onClick={() => setPhotosGridDensity('compact')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    photosGridDensity === 'compact'
                      ? 'bg-[var(--accent-color)] text-slate-950 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Compact Grid (Dense Gallery)"
                >
                  <Grid3X3 className="w-3.5 h-3.5" />
                  <span>Compact</span>
                </button>
              </div>
            </div>

            {/* Quick Month Jump Scrubber Bar */}
            {monthPhotoGroups.length > 1 && (
              <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none py-1 text-xs font-mono">
                <span className="text-slate-400 text-[11px] shrink-0 font-bold">JUMP TO:</span>
                {monthPhotoGroups.map((group) => (
                  <a
                    key={group.monthKey}
                    href={`#month-${group.monthKey.toLowerCase().replace(/\s+/g, '-')}`}
                    className="px-3 py-1 rounded-xl bg-white dark:bg-slate-900 hover:bg-[var(--accent-color)] hover:text-slate-950 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 text-xs font-bold transition-all shrink-0"
                  >
                    {group.monthKey} ({group.photos.length})
                  </a>
                ))}
              </div>
            )}

            {/* Month Sections Stream */}
            <div className="space-y-12">
              {monthPhotoGroups.map((group) => (
                <div
                  key={group.monthKey}
                  id={`month-${group.monthKey.toLowerCase().replace(/\s+/g, '-')}`}
                  className="space-y-4 scroll-mt-24"
                >
                  {/* Sticky Month & Year Glass Header */}
                  <div className="sticky top-[72px] z-20 py-2.5 px-4 rounded-2xl backdrop-blur-xl bg-slate-50/90 dark:bg-[#070A12]/90 border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between shadow-xs">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-xl bg-[var(--accent-color)]/10 text-[var(--accent-color)] flex items-center justify-center font-bold">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-heading font-black text-base text-slate-900 dark:text-white leading-tight">
                          {group.monthKey}
                        </h3>
                        <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                          {group.photos.length} photograph{group.photos.length === 1 ? '' : 's'} recorded
                        </p>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-slate-200/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-mono text-xs font-bold">
                      {group.year}
                    </span>
                  </div>

                  {/* Individual Photos Masonry Grid */}
                  <div
                    className={
                      photosGridDensity === 'comfortable'
                        ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 sm:gap-4.5'
                        : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-2.5'
                    }
                  >
                    {group.photos.map((photo) => {
                      const moodBadge = getMoodBadge(photo.mood);

                      return (
                        <div
                          key={photo.id}
                          onClick={() => handleOpenMemory(photo.memory, photo.photoIndex)}
                          className="group relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-950 border border-black/10 dark:border-white/10 hover:border-[var(--accent-color)]/70 hover:shadow-2xl transition-all duration-300 cursor-pointer select-none"
                        >
                          <Image
                            src={photo.photoUrl}
                            alt={photo.title}
                            fill
                            sizes={
                              photosGridDensity === 'comfortable'
                                ? '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'
                                : '(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw'
                            }
                            className="object-cover group-hover:scale-108 transition-transform duration-500"
                          />

                          {/* Hover Gradient Overlay with Story & Context */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex flex-col justify-end p-3">
                            <h4 className="text-white font-heading font-black text-xs leading-tight line-clamp-1">
                              {photo.title}
                            </h4>
                            <div className="flex items-center justify-between text-[10px] font-mono text-slate-300 pt-1">
                              <span className="truncate max-w-[120px]">{photo.location}</span>
                              <span className="text-[var(--accent-color)] font-bold shrink-0">Open Lightbox ↗</span>
                            </div>
                          </div>

                          {/* Corner Floating Badges */}
                          <div className="absolute top-2 left-2 z-20 flex items-center space-x-1">
                            {photo.badge && (
                              <span className="p-1 rounded-md bg-amber-500/80 text-slate-950 shadow-xs" title={photo.badge}>
                                <Trophy className="w-2.5 h-2.5" />
                              </span>
                            )}
                          </div>

                          {/* Top-Right Mood Badge */}
                          {moodBadge && (
                            <div className="absolute top-2 right-2 z-20">
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold backdrop-blur-md border ${moodBadge.bg}`}>
                                {moodBadge.label}
                              </span>
                            </div>
                          )}

                          {/* Bottom-Right Retro Day Stamp */}
                          <div className="absolute bottom-2 right-2 z-20 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-xs font-mono text-[8px] text-amber-400 font-bold border border-amber-500/30">
                            {new Date(photo.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* ======================================================== */}
      {/* CINEMATIC AMBIENT PHOTO LIGHTBOX MODAL                   */}
      {/* ======================================================== */}
      <MemoryDossierModal
        key={selectedMemory ? `${selectedMemory.id}-${selectedPhotoIndex}` : 'none'}
        memory={selectedMemory}
        initialPhotoIndex={selectedPhotoIndex}
        onClose={() => setSelectedMemory(null)}
      />

      <Footer />
    </div>
  );
}
