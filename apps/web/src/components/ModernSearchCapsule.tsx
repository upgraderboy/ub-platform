'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  Search,
  Calendar as CalendarIcon,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  RotateCcw,
  ArrowRight,
  Mic,
  MicOff,
  ArrowUpDown,
  History,
  TrendingUp,
  Sparkles,
  Share2,
  BookmarkPlus,
  Bookmark,
  Volume2,
  VolumeX,
  Filter,
  Trash2,
  HelpCircle,
  Command,
  CheckCheck,
  Copy,
} from 'lucide-react';
import { DateRange } from './DateRangePicker';

export type SearchScopeField = 'title' | 'tags' | 'description' | 'category';

export interface CategoryOption {
  id: string;
  label: string;
  count: number;
}

export interface SortOption {
  id: string;
  label: string;
  icon?: string;
}

export interface SavedSearchPreset {
  id: string;
  name: string;
  query: string;
  categoryId: string;
  dateRange: DateRange;
  sortBy?: string;
  createdAt: string;
}

export interface ModernSearchCapsuleProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedFields: SearchScopeField[];
  onToggleField: (field: SearchScopeField) => void;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  categories: CategoryOption[];
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  onResetFilters: () => void;
  totalFilteredCount: number;
  placeholder?: string;
  fieldOptions?: { id: SearchScopeField; label: string; desc: string }[];
  // Powerful features with intelligent defaults
  sortBy?: string;
  onSortChange?: (sortId: string) => void;
  sortOptions?: SortOption[];
  popularSearches?: string[];
  itemTypeLabel?: string;
  showActiveFilterPills?: boolean;
}

const DEFAULT_SEARCH_FIELDS: { id: SearchScopeField; label: string; desc: string }[] = [
  { id: 'title', label: 'Title & Name', desc: 'Headline & milestone names' },
  { id: 'tags', label: 'Tags & Badges', desc: 'Locations, trophies & tags' },
  { id: 'description', label: 'Story & Summary', desc: 'Narrative notes & memory context' },
  { id: 'category', label: 'Category', desc: 'Domain & chapter classification' },
];

const DEFAULT_SORT_OPTIONS: SortOption[] = [
  { id: 'newest', label: 'Newest First', icon: '⚡' },
  { id: 'oldest', label: 'Oldest First', icon: '⏳' },
  { id: 'featured', label: 'Milestones & Badges', icon: '🏆' },
  { id: 'alpha', label: 'Alphabetical (A - Z)', icon: '🔤' },
];

const DEFAULT_POPULAR_SEARCHES: string[] = [
  'SIH 2024 National Win',
  'Hostel Rooftop 3 AM',
  'Keynote Spotlight',
  'Next.js 15 Monorepos',
  'Mountain Roadtrip',
  'Studio HQ Launch',
];

// Lightweight synthesized acoustic UI tactile feedback (Web Audio API)
function playTactileAudio(type: 'click' | 'toggle' | 'clear' | 'listen' | 'save' = 'click') {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(820, now);
      osc.frequency.exponentialRampToValueAtTime(420, now + 0.035);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
      osc.start(now);
      osc.stop(now + 0.035);
    } else if (type === 'toggle') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(720, now + 0.05);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'clear') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(460, now);
      osc.frequency.exponentialRampToValueAtTime(230, now + 0.07);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      osc.start(now);
      osc.stop(now + 0.07);
    } else if (type === 'listen') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(620, now);
      osc.frequency.exponentialRampToValueAtTime(940, now + 0.09);
      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc.start(now);
      osc.stop(now + 0.09);
    } else if (type === 'save') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(500, now);
      osc.frequency.exponentialRampToValueAtTime(1000, now + 0.08);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    }
  } catch {
    // Audio context not allowed or blocked
  }
}

export function ModernSearchCapsule({
  searchQuery,
  onSearchChange,
  selectedFields,
  onToggleField,
  dateRange,
  onDateRangeChange,
  categories,
  selectedCategory,
  onSelectCategory,
  onResetFilters,
  totalFilteredCount,
  placeholder,
  fieldOptions,
  sortBy = 'newest',
  onSortChange,
  sortOptions = DEFAULT_SORT_OPTIONS,
  popularSearches = DEFAULT_POPULAR_SEARCHES,
  itemTypeLabel = 'items',
  showActiveFilterPills = true,
}: ModernSearchCapsuleProps) {
  const activeFieldsList = fieldOptions || DEFAULT_SEARCH_FIELDS;

  // Dropdown states (desktop)
  const [activeDropdown, setActiveDropdown] = useState<'calendar' | 'fields' | 'sort' | null>(null);

  // Mobile bottom sheets state
  const [mobileModal, setMobileModal] = useState<'calendar' | 'fields' | 'sort' | 'save' | null>(null);

  // Suggestions popover state & tabs
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [popoverTab, setPopoverTab] = useState<'trending' | 'recent' | 'saved'>('trending');
  const [showHelpTips, setShowHelpTips] = useState(false);

  // Keyboard navigation index in popover
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  // Voice Search states
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  // Audio UI feedback state
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('ub_capsule_sound_enabled');
        if (stored !== null) return stored === 'true';
      } catch {
        // Fallback
      }
    }
    return true;
  });

  const playFeedback = useCallback(
    (type: 'click' | 'toggle' | 'clear' | 'listen' | 'save' = 'click') => {
      if (soundEnabled) {
        playTactileAudio(type);
      }
    },
    [soundEnabled]
  );

  // Recent Searches state
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('ub_capsule_recent_searches');
        if (stored) return JSON.parse(stored);
      } catch {
        // Fallback
      }
    }
    return [];
  });

  // Saved Presets state
  const [savedPresets, setSavedPresets] = useState<SavedSearchPreset[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('ub_capsule_saved_presets');
        if (stored) return JSON.parse(stored);
      } catch {
        // Fallback
      }
    }
    return [];
  });

  // Save preset inline modal
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');

  // Share & copy feedback states
  const [isCopiedShare, setIsCopiedShare] = useState(false);
  const [isCopiedSummary, setIsCopiedSummary] = useState(false);

  // Airbnb calendar viewing month state
  const [calendarViewDate, setCalendarViewDate] = useState(() => {
    return dateRange.startDate ? new Date(dateRange.startDate) : new Date('2024-12-01');
  });
  const [calendarHoverDate, setCalendarHoverDate] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const toggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('ub_capsule_sound_enabled', String(nextVal));
      } catch {
        // Ignore
      }
    }
    if (nextVal) {
      playTactileAudio('toggle');
    }
  };

  const saveRecentSearch = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed || typeof window === 'undefined') return;
    setRecentSearches((prev) => {
      const updated = [
        trimmed,
        ...prev.filter((q) => q.toLowerCase() !== trimmed.toLowerCase()),
      ].slice(0, 6);
      try {
        localStorage.setItem('ub_capsule_recent_searches', JSON.stringify(updated));
      } catch {
        // LocalStorage write error
      }
      return updated;
    });
  }, []);

  const clearRecentSearches = () => {
    setRecentSearches([]);
    playFeedback('clear');
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('ub_capsule_recent_searches');
      } catch {
        // Ignore
      }
    }
  };

  // Save current filter setup as a preset
  const handleSaveCurrentPreset = () => {
    const trimmedName = newPresetName.trim();
    const finalName =
      trimmedName ||
      (searchQuery
        ? `"${searchQuery}"`
        : selectedCategory !== 'all'
        ? categories.find((c) => c.id === selectedCategory)?.label || 'Category View'
        : dateRange.startDate
        ? `Timeline (${dateRange.startDate})`
        : `Custom Filter ${savedPresets.length + 1}`);

    const newPreset: SavedSearchPreset = {
      id: `preset_${Date.now()}`,
      name: finalName,
      query: searchQuery,
      categoryId: selectedCategory,
      dateRange: { ...dateRange },
      sortBy,
      createdAt: new Date().toISOString(),
    };

    const updated = [newPreset, ...savedPresets.slice(0, 9)];
    setSavedPresets(updated);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('ub_capsule_saved_presets', JSON.stringify(updated));
      } catch {
        // Ignore
      }
    }
    playFeedback('save');
    setNewPresetName('');
    setIsSaveModalOpen(false);
    setMobileModal(null);
  };

  const handleDeletePreset = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const updated = savedPresets.filter((p) => p.id !== id);
    setSavedPresets(updated);
    playFeedback('clear');
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('ub_capsule_saved_presets', JSON.stringify(updated));
      } catch {
        // Ignore
      }
    }
  };

  const handleApplyPreset = useCallback(
    (preset: SavedSearchPreset) => {
      playFeedback('click');
      onSearchChange(preset.query);
      onSelectCategory(preset.categoryId);
      onDateRangeChange(preset.dateRange);
      if (preset.sortBy && onSortChange) {
        onSortChange(preset.sortBy);
      }
      setShowSuggestions(false);
    },
    [onSearchChange, onSelectCategory, onDateRangeChange, onSortChange, playFeedback]
  );

  // Navigable list calculation for keyboard navigation
  const currentNavList = useMemo(() => {
    if (popoverTab === 'recent') return recentSearches;
    if (popoverTab === 'saved') return savedPresets.map((p) => p.name);
    return popularSearches;
  }, [popoverTab, recentSearches, savedPresets, popularSearches]);

  // Keyboard shortcut listener: ⌘K or / or Arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘K or / focus
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setShowSuggestions(true);
        playFeedback('click');
      } else if (
        e.key === '/' &&
        document.activeElement !== inputRef.current &&
        !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName || '')
      ) {
        e.preventDefault();
        inputRef.current?.focus();
        setShowSuggestions(true);
        playFeedback('click');
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
        setActiveDropdown(null);
        setShowHelpTips(false);
        setIsSaveModalOpen(false);
        setHighlightedIndex(-1);
      } else if (showSuggestions && currentNavList.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setHighlightedIndex((prev) => (prev + 1) % currentNavList.length);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setHighlightedIndex((prev) => (prev - 1 + currentNavList.length) % currentNavList.length);
        } else if (e.key === 'Tab' && highlightedIndex >= 0) {
          e.preventDefault();
          const target = currentNavList[highlightedIndex];
          if (target) {
            onSearchChange(target);
          }
        } else if (e.key === 'Enter' && highlightedIndex >= 0) {
          e.preventDefault();
          if (popoverTab === 'saved') {
            const preset = savedPresets[highlightedIndex];
            if (preset) handleApplyPreset(preset);
          } else {
            const target = currentNavList[highlightedIndex];
            if (target) {
              onSearchChange(target);
              saveRecentSearch(target);
              setShowSuggestions(false);
            }
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    showSuggestions,
    highlightedIndex,
    currentNavList,
    popoverTab,
    savedPresets,
    onSearchChange,
    playFeedback,
    saveRecentSearch,
    handleApplyPreset,
  ]);

  // Close desktop dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
        setShowSuggestions(false);
        setShowHelpTips(false);
        setHighlightedIndex(-1);
      }
    }
    if (activeDropdown || showSuggestions || showHelpTips) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [activeDropdown, showSuggestions, showHelpTips]);

  // Voice Search Handler via Web Speech Recognition API
  const handleToggleVoice = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    if (typeof window === 'undefined') return;

    interface SpeechEventResultItem {
      transcript?: string;
    }
    interface SpeechEventResult {
      [index: number]: SpeechEventResultItem;
    }
    interface SpeechEventResultList {
      results?: {
        [index: number]: SpeechEventResult;
      };
    }
    interface SpeechRecognitionInstance {
      lang: string;
      continuous: boolean;
      interimResults: boolean;
      onstart: (() => void) | null;
      onresult: ((event: SpeechEventResultList) => void) | null;
      onerror: (() => void) | null;
      onend: (() => void) | null;
      start: () => void;
      stop?: () => void;
    }
    type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

    const windowWithSpeech = window as unknown as {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    const SpeechClass = windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;

    if (!SpeechClass) {
      setVoiceNotice('Voice recognition not supported in your browser');
      setTimeout(() => setVoiceNotice(null), 3000);
      return;
    }

    try {
      playFeedback('listen');
      const recognition = new SpeechClass();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceNotice('Listening... Speak now');
      };

      recognition.onresult = (event: SpeechEventResultList) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          onSearchChange(transcript);
          saveRecentSearch(transcript);
          playFeedback('save');
          setVoiceNotice(`Heard: "${transcript}"`);
          setTimeout(() => setVoiceNotice(null), 2500);
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setVoiceNotice('Could not recognize voice input');
        setTimeout(() => setVoiceNotice(null), 2500);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
      setVoiceNotice('Microphone access blocked');
      setTimeout(() => setVoiceNotice(null), 2500);
    }
  };

  // Deep Link Share URL to clipboard
  const handleShareSearch = () => {
    if (typeof window === 'undefined') return;
    playFeedback('click');
    const url = new URL(window.location.href);
    if (searchQuery.trim()) url.searchParams.set('q', searchQuery.trim());
    else url.searchParams.delete('q');

    if (selectedCategory !== 'all') url.searchParams.set('cat', selectedCategory);
    else url.searchParams.delete('cat');

    if (dateRange.startDate) url.searchParams.set('from', dateRange.startDate);
    if (dateRange.endDate) url.searchParams.set('to', dateRange.endDate);

    if (sortBy && sortBy !== 'newest') url.searchParams.set('sort', sortBy);
    else url.searchParams.delete('sort');

    navigator.clipboard.writeText(url.toString()).then(() => {
      setIsCopiedShare(true);
      setTimeout(() => setIsCopiedShare(false), 2200);
    });
  };

  // Copy Filter Summary in Markdown format
  const handleCopySummary = () => {
    if (typeof window === 'undefined') return;
    playFeedback('click');
    const catName =
      selectedCategory === 'all'
        ? 'All Categories'
        : categories.find((c) => c.id === selectedCategory)?.label || selectedCategory;
    const dateStr = dateRange.startDate
      ? `${dateRange.startDate}${dateRange.endDate ? ` to ${dateRange.endDate}` : ''}`
      : 'Anytime';
    const queryStr = searchQuery.trim() ? `"${searchQuery.trim()}"` : 'All';

    const summary = `🔍 **UB Search Query:** ${queryStr} | 🏷️ **Category:** ${catName} | 📅 **Date:** ${dateStr} | ⚡ **Matched:** ${totalFilteredCount} ${itemTypeLabel}`;

    navigator.clipboard.writeText(summary).then(() => {
      setIsCopiedSummary(true);
      setTimeout(() => setIsCopiedSummary(false), 2200);
    });
  };

  // Quick Preset Date Filters
  const handleQuickPreset = (preset: '2025' | '2024' | 'last30') => {
    playFeedback('click');
    const now = new Date();
    if (preset === '2025') {
      onDateRangeChange({ startDate: '2025-01-01', endDate: '2025-12-31' });
    } else if (preset === '2024') {
      onDateRangeChange({ startDate: '2024-01-01', endDate: '2024-12-31' });
    } else if (preset === 'last30') {
      const prior30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      onDateRangeChange({
        startDate: prior30.toISOString().slice(0, 10),
        endDate: now.toISOString().slice(0, 10),
      });
    }
    setActiveDropdown(null);
    setMobileModal(null);
  };

  // Calendar Math
  const year = calendarViewDate.getFullYear();
  const month = calendarViewDate.getMonth();
  const monthName = calendarViewDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const handleCalendarClick = (dateStr: string) => {
    playFeedback('click');
    if (!dateRange.startDate || (dateRange.startDate && dateRange.endDate)) {
      onDateRangeChange({ startDate: dateStr, endDate: null });
    } else {
      if (dateStr < dateRange.startDate) {
        onDateRangeChange({ startDate: dateStr, endDate: dateRange.startDate });
      } else {
        onDateRangeChange({ startDate: dateRange.startDate, endDate: dateStr });
      }
      setActiveDropdown(null);
      setMobileModal(null);
    }
  };

  const isInRange = (dateStr: string) => {
    if (dateRange.startDate && dateRange.endDate) {
      return dateStr > dateRange.startDate && dateStr < dateRange.endDate;
    }
    if (dateRange.startDate && calendarHoverDate && !dateRange.endDate) {
      const min = dateRange.startDate < calendarHoverDate ? dateRange.startDate : calendarHoverDate;
      const max = dateRange.startDate > calendarHoverDate ? dateRange.startDate : calendarHoverDate;
      return dateStr > min && dateStr < max;
    }
    return false;
  };

  const scrollCategoryChips = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      playFeedback('click');
      const offset = direction === 'left' ? -220 : 220;
      categoryScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'all' ||
    Boolean(dateRange.startDate || dateRange.endDate) ||
    selectedFields.length < activeFieldsList.length ||
    (sortBy && sortBy !== 'newest');

  const activeFilterCount =
    (searchQuery.trim() ? 1 : 0) +
    (selectedCategory !== 'all' ? 1 : 0) +
    (dateRange.startDate ? 1 : 0) +
    (selectedFields.length < activeFieldsList.length ? 1 : 0) +
    (sortBy && sortBy !== 'newest' ? 1 : 0);

  const dateLabel = dateRange.startDate
    ? `${new Date(dateRange.startDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })}${
        dateRange.endDate
          ? ` – ${new Date(dateRange.endDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}`
          : ' → End'
      }`
    : 'Anytime';

  const currentSortLabel = sortOptions.find((s) => s.id === sortBy)?.label || 'Newest';

  return (
    <div className="w-full space-y-3 relative" ref={containerRef}>
      {/* ======================================================== */}
      {/* 1. DESKTOP & TABLET: Glowing Kinetic Search Capsule      */}
      {/* ======================================================== */}
      <div
        className={`hidden md:flex items-center bg-white/95 dark:bg-[#0e1320]/95 backdrop-blur-2xl border rounded-full shadow-lg p-2 transition-all relative z-30 ${
          isListening
            ? 'border-rose-500 ring-4 ring-rose-500/20 shadow-rose-500/20'
            : hasActiveFilters
            ? 'border-[var(--accent-color)]/70 ring-2 ring-[var(--accent-glow)]'
            : 'border-slate-200/90 dark:border-slate-800 hover:border-[var(--accent-color)]/60'
        }`}
      >
        {/* Segment 1: Keyword Search with Voice, Help & Shortcuts */}
        <div className="flex-1 flex items-center px-4 space-x-3 border-r border-slate-200 dark:border-slate-800 min-w-0">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Keywords & Queries
              </span>
              {/* Power Search Syntax Help Trigger */}
              <button
                type="button"
                onClick={() => setShowHelpTips(!showHelpTips)}
                className="text-slate-400 hover:text-[var(--accent-color)] transition-colors p-0.5 cursor-pointer"
                title="Power Search Syntax Tips"
              >
                <HelpCircle className="w-3 h-3" />
              </button>
            </div>
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onFocus={() => {
                setShowSuggestions(true);
                setHighlightedIndex(-1);
              }}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setShowSuggestions(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && highlightedIndex === -1) {
                  saveRecentSearch(searchQuery);
                  setShowSuggestions(false);
                  playFeedback('click');
                }
              }}
              placeholder={placeholder || 'Search keywords, locations, topics...'}
              className="w-full bg-transparent text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden"
            />
          </div>

          {/* Voice Search Button */}
          <button
            type="button"
            onClick={handleToggleVoice}
            className={`p-1.5 rounded-full transition-all cursor-pointer ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse shadow-md'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={isListening ? 'Stop listening' : 'Search by Voice'}
          >
            {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
          </button>

          {/* Keyboard Shortcut Badge */}
          {!searchQuery && (
            <kbd className="hidden lg:inline-flex items-center text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 select-none">
              ⌘K
            </kbd>
          )}

          {/* Clear button */}
          {searchQuery && (
            <button
              onClick={() => {
                onSearchChange('');
                playFeedback('clear');
                setShowSuggestions(false);
              }}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 cursor-pointer"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Segment 2: Airbnb Date Picker Trigger */}
        <div
          onClick={() => {
            playFeedback('click');
            setActiveDropdown(activeDropdown === 'calendar' ? null : 'calendar');
            setShowSuggestions(false);
            setShowHelpTips(false);
          }}
          className={`px-4 lg:px-5 py-1.5 border-r border-slate-200 dark:border-slate-800 cursor-pointer select-none transition-colors ${
            activeDropdown === 'calendar' || dateRange.startDate
              ? 'text-[var(--accent-color)]'
              : 'text-slate-700 dark:text-slate-300'
          }`}
        >
          <div className="flex items-center space-x-2">
            <CalendarIcon className="w-4 h-4 text-[var(--accent-color)] shrink-0" />
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Date Range
              </div>
              <div className="text-xs font-semibold truncate max-w-[110px] lg:max-w-[130px]">
                {dateLabel}
              </div>
            </div>
          </div>
        </div>

        {/* Segment 3: Fields Selector Trigger */}
        <div
          onClick={() => {
            playFeedback('click');
            setActiveDropdown(activeDropdown === 'fields' ? null : 'fields');
            setShowSuggestions(false);
            setShowHelpTips(false);
          }}
          className={`px-4 lg:px-5 py-1.5 border-r border-slate-200 dark:border-slate-800 cursor-pointer select-none transition-colors ${
            activeDropdown === 'fields' || selectedFields.length < activeFieldsList.length
              ? 'text-[var(--accent-color)]'
              : 'text-slate-700 dark:text-slate-300'
          }`}
        >
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="w-4 h-4 text-[var(--accent-color)] shrink-0" />
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Match In
              </div>
              <div className="text-xs font-semibold">
                {selectedFields.length === activeFieldsList.length
                  ? `All Fields (${activeFieldsList.length})`
                  : `${selectedFields.length} Fields`}
              </div>
            </div>
          </div>
        </div>

        {/* Segment 4: Sort Matrix Trigger */}
        <div
          onClick={() => {
            playFeedback('click');
            setActiveDropdown(activeDropdown === 'sort' ? null : 'sort');
            setShowSuggestions(false);
            setShowHelpTips(false);
          }}
          className={`px-4 lg:px-5 py-1.5 cursor-pointer select-none transition-colors ${
            activeDropdown === 'sort' || (sortBy && sortBy !== 'newest')
              ? 'text-[var(--accent-color)]'
              : 'text-slate-700 dark:text-slate-300'
          }`}
        >
          <div className="flex items-center space-x-2">
            <ArrowUpDown className="w-4 h-4 text-[var(--accent-color)] shrink-0" />
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Sort By
              </div>
              <div className="text-xs font-semibold truncate max-w-[95px]">
                {currentSortLabel}
              </div>
            </div>
          </div>
        </div>

        {/* Action Button: Reset / Save Preset / Search Indicator */}
        <div className="pl-2 pr-1 shrink-0 flex items-center space-x-1">
          {hasActiveFilters ? (
            <button
              onClick={() => {
                playFeedback('clear');
                onResetFilters();
              }}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-full bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 text-xs font-bold transition-colors cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset ({activeFilterCount})</span>
            </button>
          ) : (
            <div className="w-9 h-9 rounded-full bg-[var(--accent-color)] text-slate-900 flex items-center justify-center font-bold text-xs shadow-md">
              <Search className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>

      {/* Voice Recognition Live Notice Banner */}
      {voiceNotice && (
        <div className="px-4 py-2 rounded-2xl bg-slate-900 text-white text-xs font-mono flex items-center justify-between animate-fade-in border border-[var(--accent-color)]/40 shadow-lg">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span>{voiceNotice}</span>
          </div>
          <button onClick={() => setVoiceNotice(null)} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Power Search Syntax Help Popover */}
      {showHelpTips && (
        <div className="hidden md:block absolute left-8 top-14 z-50 w-80 bg-white/95 dark:bg-[#111728]/95 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-4 space-y-3 animate-scale-up">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-900 dark:text-white">
              <Sparkles className="w-3.5 h-3.5 text-[var(--accent-color)]" />
              <span>Power Search Syntax</span>
            </div>
            <button onClick={() => setShowHelpTips(false)} className="text-slate-400 hover:text-white cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-start space-x-2">
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-mono font-bold text-[var(--accent-color)]">
                ⌘K / /
              </code>
              <span className="text-slate-600 dark:text-slate-300">Quick-focus search anywhere</span>
            </div>
            <div className="flex items-start space-x-2">
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-mono font-bold text-[var(--accent-color)]">
                &ldquo;phrase&rdquo;
              </code>
              <span className="text-slate-600 dark:text-slate-300">Exact phrase matching in notes</span>
            </div>
            <div className="flex items-start space-x-2">
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-mono font-bold text-[var(--accent-color)]">
                ↑ ↓ ↵
              </code>
              <span className="text-slate-600 dark:text-slate-300">Navigate &amp; select suggestions</span>
            </div>
            <div className="flex items-start space-x-2">
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-mono font-bold text-[var(--accent-color)]">
                Tab
              </code>
              <span className="text-slate-600 dark:text-slate-300">Autocomplete search input</span>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. SUGGESTIONS, HISTORY & SAVED PRESETS POPOVER (Desktop)  */}
      {/* ======================================================== */}
      {showSuggestions && (
        <div className="hidden md:block absolute left-4 top-14 z-50 w-[420px] bg-white/95 dark:bg-[#111728]/95 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-4 space-y-3.5 animate-scale-up">
          {/* Navigation Tabs Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
            <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-xl">
              <button
                onClick={() => {
                  setPopoverTab('trending');
                  setHighlightedIndex(-1);
                  playFeedback('click');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1 ${
                  popoverTab === 'trending'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <TrendingUp className="w-3 h-3 text-[var(--accent-color)]" />
                <span>Trending</span>
              </button>

              <button
                onClick={() => {
                  setPopoverTab('recent');
                  setHighlightedIndex(-1);
                  playFeedback('click');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1 ${
                  popoverTab === 'recent'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <History className="w-3 h-3 text-[var(--accent-color)]" />
                <span>History ({recentSearches.length})</span>
              </button>

              <button
                onClick={() => {
                  setPopoverTab('saved');
                  setHighlightedIndex(-1);
                  playFeedback('click');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1 ${
                  popoverTab === 'saved'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Bookmark className="w-3 h-3 text-[var(--accent-color)]" />
                <span>Saved ({savedPresets.length})</span>
              </button>
            </div>

            <button
              onClick={() => setShowSuggestions(false)}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* TAB 1: Trending Suggestions */}
          {popoverTab === 'trending' && (
            <div className="space-y-2">
              <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Popular Discoveries</span>
                <span className="text-[10px] text-slate-500">Press ↵ or Tab</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {popularSearches.map((term, idx) => {
                  const isHighlighted = highlightedIndex === idx;
                  return (
                    <button
                      key={term}
                      onClick={() => {
                        onSearchChange(term);
                        saveRecentSearch(term);
                        playFeedback('click');
                        setShowSuggestions(false);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border cursor-pointer ${
                        isHighlighted
                          ? 'bg-[var(--accent-color)] text-slate-950 border-[var(--accent-color)] shadow-sm'
                          : 'bg-white dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-[var(--accent-color)]/60'
                      }`}
                    >
                      {term}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: Recent Searches */}
          {popoverTab === 'recent' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                <span>Recent Queries</span>
                {recentSearches.length > 0 && (
                  <button
                    onClick={clearRecentSearches}
                    className="text-[10px] text-rose-400 hover:underline cursor-pointer flex items-center space-x-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                )}
              </div>

              {recentSearches.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400 font-mono">
                  No recent searches yet. Type and press Enter to save!
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {recentSearches.map((item, idx) => {
                    const isHighlighted = highlightedIndex === idx;
                    return (
                      <button
                        key={item}
                        onClick={() => {
                          onSearchChange(item);
                          playFeedback('click');
                          setShowSuggestions(false);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all border cursor-pointer flex items-center space-x-1.5 ${
                          isHighlighted
                            ? 'bg-[var(--accent-color)] text-slate-950 border-[var(--accent-color)]'
                            : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[var(--accent-color)]'
                        }`}
                      >
                        <History className="w-3 h-3 opacity-60" />
                        <span>{item}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Saved Filter Presets */}
          {popoverTab === 'saved' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                <span>Custom Saved Views</span>
                {hasActiveFilters && (
                  <button
                    onClick={() => setIsSaveModalOpen(true)}
                    className="text-[10px] text-[var(--accent-color)] hover:underline cursor-pointer flex items-center space-x-1"
                  >
                    <BookmarkPlus className="w-3 h-3" />
                    <span>Save Current View</span>
                  </button>
                )}
              </div>

              {savedPresets.length === 0 ? (
                <div className="py-6 text-center space-y-2">
                  <p className="text-xs text-slate-400 font-mono">No saved views yet.</p>
                  <p className="text-[11px] text-slate-500">
                    Apply some filters and click &ldquo;Save View&rdquo; to bookmark your favorite view!
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {savedPresets.map((preset, idx) => {
                    const isHighlighted = highlightedIndex === idx;
                    return (
                      <div
                        key={preset.id}
                        onClick={() => handleApplyPreset(preset)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isHighlighted
                            ? 'bg-[var(--accent-color)] text-slate-950 border-[var(--accent-color)]'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-[var(--accent-color)]/60 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <div className="text-xs font-bold truncate flex items-center space-x-1.5">
                            <Bookmark className="w-3 h-3 text-[var(--accent-color)] shrink-0" />
                            <span>{preset.name}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 truncate mt-0.5">
                            {preset.query ? `"${preset.query}"` : 'All topics'} •{' '}
                            {preset.categoryId !== 'all' ? preset.categoryId : 'All categories'}
                          </div>
                        </div>

                        <button
                          onClick={(e) => handleDeletePreset(preset.id, e)}
                          className="p-1 rounded-md text-slate-400 hover:text-rose-500 transition-colors"
                          title="Delete saved view"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Raycast Keyboard Shortcuts Legend Footer */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400 select-none">
            <div className="flex items-center space-x-3">
              <span>↑↓ Navigate</span>
              <span>↵ Apply</span>
              <span>Tab Fill</span>
              <span>Esc Close</span>
            </div>
            <div className="flex items-center space-x-1 text-[var(--accent-color)]">
              <Command className="w-3 h-3" />
              <span>Omni-Search</span>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Save Current View Dialog */}
      {isSaveModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-fade-in"
          onClick={() => setIsSaveModalOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-white dark:bg-[#111728] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-2xl animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BookmarkPlus className="w-4 h-4 text-[var(--accent-color)]" />
                <h4 className="font-heading font-black text-sm text-slate-900 dark:text-white">
                  Save Filter Preset
                </h4>
              </div>
              <button onClick={() => setIsSaveModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Bookmark this active filter configuration for one-click access anytime:
            </p>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs font-mono space-y-1 text-slate-600 dark:text-slate-300">
              <div>Query: {searchQuery || 'None (All)'}</div>
              <div>Category: {categories.find((c) => c.id === selectedCategory)?.label || selectedCategory}</div>
              <div>Date: {dateLabel}</div>
              <div>Sort: {currentSortLabel}</div>
            </div>

            <input
              type="text"
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
              placeholder="e.g. SIH 2024 Wins or Next.js Notes..."
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:border-[var(--accent-color)]"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveCurrentPreset();
              }}
            />

            <div className="flex gap-2">
              <button
                onClick={() => setIsSaveModalOpen(false)}
                className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCurrentPreset}
                className="flex-1 py-2 rounded-xl bg-[var(--accent-color)] text-slate-900 text-xs font-bold hover:shadow-md transition-all cursor-pointer"
              >
                Save Preset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. MOBILE VIEW (< md): Touch-First Floating Capsule       */}
      {/* ======================================================== */}
      <div className="md:hidden flex flex-col space-y-2">
        <div
          className={`flex items-center bg-white/95 dark:bg-[#111728]/95 backdrop-blur-2xl border rounded-2xl p-2 shadow-md space-x-2 transition-all ${
            isListening
              ? 'border-rose-500 ring-2 ring-rose-500/20'
              : 'border-slate-200 dark:border-slate-800 focus-within:border-[var(--accent-color)]'
          }`}
        >
          <div className="flex-1 flex items-center space-x-2 px-2 min-w-0">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={placeholder || 'Search...'}
              className="w-full bg-transparent text-base sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  onSearchChange('');
                  playFeedback('clear');
                }}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Voice Search Button (Mobile) */}
          <button
            type="button"
            onClick={handleToggleVoice}
            className={`p-2.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
            title="Voice Search"
          >
            <Mic className="w-4 h-4" />
          </button>

          {/* Date Range Button (Mobile) */}
          <button
            onClick={() => {
              playFeedback('click');
              setMobileModal('calendar');
            }}
            className={`p-2.5 rounded-xl text-xs font-semibold flex items-center space-x-1 shrink-0 transition-all cursor-pointer ${
              dateRange.startDate
                ? 'bg-[var(--accent-color)] text-slate-900 font-bold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
            title="Filter by Date"
          >
            <CalendarIcon className="w-4 h-4" />
          </button>

          {/* Fields Button (Mobile) */}
          <button
            onClick={() => {
              playFeedback('click');
              setMobileModal('fields');
            }}
            className={`p-2.5 rounded-xl text-xs font-semibold flex items-center space-x-1 shrink-0 transition-all cursor-pointer ${
              selectedFields.length < activeFieldsList.length
                ? 'bg-[var(--accent-color)] text-slate-900 font-bold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
            title="Search Fields"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          {/* Sort Button (Mobile) */}
          <button
            onClick={() => {
              playFeedback('click');
              setMobileModal('sort');
            }}
            className={`p-2.5 rounded-xl text-xs font-semibold flex items-center space-x-1 shrink-0 transition-all cursor-pointer ${
              sortBy !== 'newest'
                ? 'bg-[var(--accent-color)] text-slate-900 font-bold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
            title="Sort"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>

          {/* Reset Button (Mobile) */}
          {hasActiveFilters && (
            <button
              onClick={() => {
                playFeedback('clear');
                onResetFilters();
              }}
              className="p-2.5 rounded-xl text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 shrink-0 cursor-pointer"
              title="Reset Filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. CATEGORY SWIPING RAIL & QUICK PRESETS                 */}
      {/* ======================================================== */}
      <div className="relative flex items-center pt-0.5">
        <button
          onClick={() => scrollCategoryChips('left')}
          className="hidden sm:flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white shrink-0 mr-1.5 border border-slate-200 dark:border-slate-700 shadow-2xs cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <div
          ref={categoryScrollRef}
          className="flex-1 flex items-center space-x-2 overflow-x-auto scrollbar-none py-1 touch-pan-x"
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  playFeedback('click');
                  onSelectCategory(cat.id);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all flex items-center space-x-1.5 cursor-pointer select-none ${
                  isSelected
                    ? 'bg-[var(--accent-color)] text-slate-900 shadow-md font-mono'
                    : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-400'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-slate-900/20 text-slate-900'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}

          {/* Quick Date Presets Chips */}
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-1 shrink-0" />
          <button
            onClick={() => handleQuickPreset('2025')}
            className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold shrink-0 transition-all cursor-pointer border ${
              dateRange.startDate === '2025-01-01'
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                : 'bg-slate-100 dark:bg-slate-900/90 text-slate-500 border-slate-200 dark:border-slate-800 hover:text-white'
            }`}
          >
            📅 2025
          </button>
          <button
            onClick={() => handleQuickPreset('2024')}
            className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold shrink-0 transition-all cursor-pointer border ${
              dateRange.startDate === '2024-01-01'
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                : 'bg-slate-100 dark:bg-slate-900/90 text-slate-500 border-slate-200 dark:border-slate-800 hover:text-white'
            }`}
          >
            📅 2024
          </button>
          <button
            onClick={() => handleQuickPreset('last30')}
            className="px-2.5 py-1 rounded-xl text-xs font-mono font-bold shrink-0 transition-all cursor-pointer border bg-slate-100 dark:bg-slate-900/90 text-slate-500 border-slate-200 dark:border-slate-800 hover:text-white"
          >
            ⏱️ 30 Days
          </button>
        </div>

        <button
          onClick={() => scrollCategoryChips('right')}
          className="hidden sm:flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white shrink-0 ml-1.5 border border-slate-200 dark:border-slate-700 shadow-2xs cursor-pointer"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ======================================================== */}
      {/* 5. INTERACTIVE ACTIVE FILTER BREADCRUMBS RAIL             */}
      {/* ======================================================== */}
      {hasActiveFilters && showActiveFilterPills && (
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5 animate-fade-in">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mr-1 flex items-center space-x-1">
            <Filter className="w-3 h-3 text-[var(--accent-color)]" />
            <span>Active Filters:</span>
          </span>

          {/* Active Query Pill */}
          {searchQuery.trim() && (
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-[var(--accent-glow)] text-slate-900 dark:text-white border border-[var(--accent-color)]/40 shadow-2xs">
              <Search className="w-3 h-3 text-[var(--accent-color)]" />
              <span>&ldquo;{searchQuery}&rdquo;</span>
              <button
                onClick={() => {
                  onSearchChange('');
                  playFeedback('clear');
                }}
                className="hover:text-rose-400 p-0.5 cursor-pointer"
                title="Clear query"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {/* Active Category Pill */}
          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30">
              <span>🏷️ {categories.find((c) => c.id === selectedCategory)?.label || selectedCategory}</span>
              <button
                onClick={() => {
                  onSelectCategory('all');
                  playFeedback('clear');
                }}
                className="hover:text-rose-400 p-0.5 cursor-pointer"
                title="Clear category filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {/* Active Date Range Pill */}
          {dateRange.startDate && (
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/30">
              <span>📅 {dateLabel}</span>
              <button
                onClick={() => {
                  onDateRangeChange({ startDate: null, endDate: null });
                  playFeedback('clear');
                }}
                className="hover:text-rose-400 p-0.5 cursor-pointer"
                title="Clear date range"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {/* Active Scoped Fields Pill */}
          {selectedFields.length < activeFieldsList.length && (
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/30">
              <span>🎯 {selectedFields.length} of {activeFieldsList.length} Fields</span>
              <button
                onClick={() => {
                  activeFieldsList.forEach((f) => {
                    if (!selectedFields.includes(f.id)) onToggleField(f.id);
                  });
                  playFeedback('clear');
                }}
                className="hover:text-rose-400 p-0.5 cursor-pointer"
                title="Reset to all fields"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {/* Active Sort Pill */}
          {sortBy && sortBy !== 'newest' && (
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/30">
              <span>⚡ {currentSortLabel}</span>
              <button
                onClick={() => {
                  if (onSortChange) onSortChange('newest');
                  playFeedback('clear');
                }}
                className="hover:text-rose-400 p-0.5 cursor-pointer"
                title="Reset to newest first"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {/* Save Current View Preset Button */}
          <button
            onClick={() => {
              playFeedback('click');
              setIsSaveModalOpen(true);
            }}
            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 transition-colors cursor-pointer"
            title="Save this search setup as a preset"
          >
            <BookmarkPlus className="w-3 h-3" />
            <span>Save View</span>
          </button>

          {/* Reset All */}
          <button
            onClick={() => {
              playFeedback('clear');
              onResetFilters();
            }}
            className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-bold text-rose-500 hover:text-rose-400 hover:underline transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. STATUS BAR: Filter Counters, Audio Toggle & Utilities   */}
      {/* ======================================================== */}
      <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-1">
        <div className="flex items-center space-x-2 truncate">
          <span>
            Found <strong className="text-slate-900 dark:text-white font-bold">{totalFilteredCount}</strong> {itemTypeLabel}
          </span>
          {dateRange.startDate && (
            <span className="text-[var(--accent-color)] font-semibold truncate hidden sm:inline">
              • 📅 {dateLabel}
            </span>
          )}
          {hasActiveFilters && (
            <span className="text-slate-500 text-[11px] hidden md:inline">
              ({activeFilterCount} active)
            </span>
          )}
        </div>

        {/* Right Utilities: Tactile Sound, Copy Markdown, Deep-Link Share */}
        <div className="flex items-center space-x-3 shrink-0">
          {/* Sound Effects Toggle */}
          <button
            onClick={toggleSound}
            className={`flex items-center space-x-1 transition-colors cursor-pointer text-[11px] ${
              soundEnabled
                ? 'text-[var(--accent-color)]'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
            title={soundEnabled ? 'Tactile sound effects ON' : 'Tactile sound effects OFF'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Audio On' : 'Muted'}</span>
          </button>

          {/* Copy Summary as Markdown */}
          <button
            onClick={handleCopySummary}
            className="flex items-center space-x-1 text-slate-400 hover:text-[var(--accent-color)] transition-colors cursor-pointer text-[11px]"
            title="Copy search query summary as markdown"
          >
            {isCopiedSummary ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isCopiedSummary ? 'Summary Copied!' : 'Copy Summary'}</span>
          </button>

          {/* Share Search Deep-Link */}
          <button
            onClick={handleShareSearch}
            className="flex items-center space-x-1.5 text-slate-400 hover:text-[var(--accent-color)] transition-colors cursor-pointer text-[11px]"
            title="Copy shareable link with current filters"
          >
            {isCopiedShare ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{isCopiedShare ? 'Link Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 7. DESKTOP POPOVERS (Calendar, Fields & Sort)             */}
      {/* ======================================================== */}
      {/* Desktop Calendar Popover */}
      {activeDropdown === 'calendar' && (
        <div className="hidden md:block absolute left-1/4 mt-2 z-50 w-[360px] bg-white dark:bg-[#111728] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-5 space-y-4 animate-scale-up">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                playFeedback('click');
                setCalendarViewDate(new Date(year, month - 1, 1));
              }}
              className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-white cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-heading font-black text-sm text-slate-900 dark:text-white">
              {monthName}
            </span>
            <button
              onClick={() => {
                playFeedback('click');
                setCalendarViewDate(new Date(year, month + 1, 1));
              }}
              className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-white cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-mono font-bold text-slate-400 uppercase">
            <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`p-${i}`} className="h-8 flex items-center justify-center text-xs text-slate-300 dark:text-slate-700">
                {prevMonthDays - firstDayOfWeek + i + 1}
              </div>
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const selected = dStr === dateRange.startDate || dStr === dateRange.endDate;
              const inRange = isInRange(dStr);

              return (
                <button
                  key={dStr}
                  onClick={() => handleCalendarClick(dStr)}
                  onMouseEnter={() => setCalendarHoverDate(dStr)}
                  onMouseLeave={() => setCalendarHoverDate(null)}
                  className={`h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                    selected
                      ? 'bg-[var(--accent-color)] text-slate-900 font-bold shadow-md'
                      : inRange
                      ? 'bg-[var(--accent-glow)] text-slate-900 dark:text-white'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <button
              onClick={() => handleQuickPreset('2025')}
              className="text-[var(--accent-color)] font-bold hover:underline cursor-pointer"
            >
              Year 2025
            </button>
            <button
              onClick={() => handleQuickPreset('2024')}
              className="text-[var(--accent-color)] font-bold hover:underline cursor-pointer"
            >
              Year 2024
            </button>
            <button
              onClick={() => {
                playFeedback('clear');
                onDateRangeChange({ startDate: null, endDate: null });
                setActiveDropdown(null);
              }}
              className="text-slate-400 hover:text-rose-500 cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Desktop Scope Fields Popover */}
      {activeDropdown === 'fields' && (
        <div className="hidden md:block absolute right-32 mt-2 z-50 w-72 bg-white dark:bg-[#111728] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-4 space-y-2 animate-scale-up">
          <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Match Search In:</span>
            <span className="text-[var(--accent-color)]">{selectedFields.length} active</span>
          </div>
          {activeFieldsList.map((f) => {
            const checked = selectedFields.includes(f.id);
            return (
              <div
                key={f.id}
                onClick={() => {
                  playFeedback('toggle');
                  onToggleField(f.id);
                }}
                className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  checked
                    ? 'border-[var(--accent-color)] bg-[var(--accent-glow)] text-slate-900 dark:text-white'
                    : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-400'
                }`}
              >
                <div>
                  <div className="text-xs font-bold">{f.label}</div>
                  <div className="text-[10px] text-slate-400">{f.desc}</div>
                </div>
                <div
                  className={`w-4 h-4 rounded-md flex items-center justify-center border shrink-0 ${
                    checked
                      ? 'bg-[var(--accent-color)] border-[var(--accent-color)] text-slate-900'
                      : 'border-slate-300 dark:border-slate-600'
                  }`}
                >
                  {checked && <Check className="w-3 h-3" />}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Desktop Sort Matrix Popover */}
      {activeDropdown === 'sort' && (
        <div className="hidden md:block absolute right-8 mt-2 z-50 w-64 bg-white dark:bg-[#111728] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-4 space-y-1.5 animate-scale-up">
          <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent-color)]" />
            <span>Sort Timeline By:</span>
          </div>
          {sortOptions.map((opt) => {
            const isSelected = sortBy === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => {
                  playFeedback('click');
                  if (onSortChange) onSortChange(opt.id);
                  setActiveDropdown(null);
                }}
                className={`w-full p-2.5 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-[var(--accent-color)] text-slate-950 shadow-xs'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span>{opt.icon || '•'}</span>
                  <span>{opt.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
      )}

      {/* ======================================================== */}
      {/* 8. MOBILE BOTTOM SHEETS: Calendar, Fields, Sort & Save   */}
      {/* ======================================================== */}
      {mobileModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="md:hidden fixed inset-0 z-50 flex items-end justify-center bg-slate-950/70 backdrop-blur-xs animate-fade-in"
          onClick={() => setMobileModal(null)}
        >
          <div
            className="w-full max-h-[85vh] overflow-y-auto bg-white dark:bg-[#111728] border-t border-slate-200 dark:border-slate-800 rounded-t-3xl p-5 space-y-5 shadow-2xl animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 mx-auto" />

            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-black text-base text-slate-900 dark:text-white">
                {mobileModal === 'calendar' && '📅 Date Range'}
                {mobileModal === 'fields' && '⚡ Match Search Scope'}
                {mobileModal === 'sort' && '🎯 Sort By'}
                {mobileModal === 'save' && '⭐ Save View Preset'}
              </h3>
              <button
                onClick={() => setMobileModal(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content: Calendar */}
            {mobileModal === 'calendar' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-900">
                  <button
                    onClick={() => {
                      playFeedback('click');
                      setCalendarViewDate(new Date(year, month - 1, 1));
                    }}
                    className="p-2 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    {monthName}
                  </span>
                  <button
                    onClick={() => {
                      playFeedback('click');
                      setCalendarViewDate(new Date(year, month + 1, 1));
                    }}
                    className="p-2 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-mono font-bold text-slate-400 uppercase">
                  <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                    <div key={`mp-${i}`} className="h-10 flex items-center justify-center text-xs text-slate-300 dark:text-slate-700">
                      {prevMonthDays - firstDayOfWeek + i + 1}
                    </div>
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const selected = dStr === dateRange.startDate || dStr === dateRange.endDate;
                    const inRange = isInRange(dStr);

                    return (
                      <button
                        key={dStr}
                        onClick={() => handleCalendarClick(dStr)}
                        className={`h-10 rounded-xl text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                          selected
                            ? 'bg-[var(--accent-color)] text-slate-900 font-bold shadow-md'
                            : inRange
                            ? 'bg-[var(--accent-glow)] text-slate-900 dark:text-white'
                            : 'bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleQuickPreset('2025')}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold cursor-pointer"
                  >
                    Year 2025
                  </button>
                  <button
                    onClick={() => handleQuickPreset('2024')}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold cursor-pointer"
                  >
                    Year 2024
                  </button>
                  <button
                    onClick={() => {
                      playFeedback('clear');
                      onDateRangeChange({ startDate: null, endDate: null });
                      setMobileModal(null);
                    }}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-rose-500 font-bold cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}

            {/* Content: Fields */}
            {mobileModal === 'fields' && (
              <div className="space-y-2.5">
                {activeFieldsList.map((f) => {
                  const checked = selectedFields.includes(f.id);
                  return (
                    <button
                      key={f.id}
                      onClick={() => {
                        playFeedback('toggle');
                        onToggleField(f.id);
                      }}
                      className={`w-full p-3.5 rounded-2xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                        checked
                          ? 'border-[var(--accent-color)] bg-[var(--accent-glow)] text-slate-900 dark:text-white font-bold'
                          : 'border-slate-200 dark:border-slate-800 text-slate-400'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold">{f.label}</div>
                        <div className="text-[10px] text-slate-400">{f.desc}</div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border shrink-0 ${
                          checked
                            ? 'bg-[var(--accent-color)] border-[var(--accent-color)] text-slate-900'
                            : 'border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {checked && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Content: Sort */}
            {mobileModal === 'sort' && (
              <div className="space-y-2">
                {sortOptions.map((opt) => {
                  const isSelected = sortBy === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        playFeedback('click');
                        if (onSortChange) onSortChange(opt.id);
                        setMobileModal(null);
                      }}
                      className={`w-full p-3.5 rounded-2xl text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[var(--accent-color)] text-slate-950 font-bold shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span>{opt.icon || '•'}</span>
                        <span>{opt.label}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4" />}
                    </button>
                  );
                })}
              </div>
            )}

            <button
              onClick={() => setMobileModal(null)}
              className="w-full py-3.5 rounded-2xl bg-[var(--accent-color)] text-slate-900 font-bold text-xs flex items-center justify-center space-x-2 glow-btn cursor-pointer"
            >
              <span>Apply Filters ({totalFilteredCount} Found)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
