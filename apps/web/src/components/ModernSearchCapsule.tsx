'use client';

import React, { useState, useRef, useEffect } from 'react';
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
} from 'lucide-react';
import { DateRange } from './DateRangePicker';

export type SearchScopeField = 'title' | 'tags' | 'description' | 'category';

export interface CategoryOption {
  id: string;
  label: string;
  count: number;
}

interface ModernSearchCapsuleProps {
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
}

const SEARCH_FIELDS: { id: SearchScopeField; label: string; desc: string }[] = [
  { id: 'title', label: 'Project Name', desc: 'Title and project name' },
  { id: 'tags', label: 'Tech Stack', desc: 'Frameworks, libraries and tools' },
  { id: 'description', label: 'Problem & Summary', desc: 'Challenges solved & architectural notes' },
  { id: 'category', label: 'Domain Category', desc: 'Category (IoT, AI, Full-Stack...)' },
];

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
}: ModernSearchCapsuleProps) {
  // Desktop popover dropdown state
  const [activeDropdown, setActiveDropdown] = useState<'calendar' | 'fields' | null>(null);

  // Mobile bottom sheets state
  const [mobileModal, setMobileModal] = useState<'calendar' | 'fields' | null>(null);

  // Airbnb calendar viewing month state
  const [calendarViewDate, setCalendarViewDate] = useState(() => {
    return dateRange.startDate ? new Date(dateRange.startDate) : new Date('2024-12-01');
  });
  const [calendarHoverDate, setCalendarHoverDate] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  // Close desktop dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    }
    if (activeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [activeDropdown]);

  // Calendar Math
  const year = calendarViewDate.getFullYear();
  const month = calendarViewDate.getMonth();
  const monthName = calendarViewDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const handleCalendarClick = (dateStr: string) => {
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
      const offset = direction === 'left' ? -220 : 220;
      categoryScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'all' ||
    Boolean(dateRange.startDate || dateRange.endDate) ||
    selectedFields.length < 4;

  const dateLabel = dateRange.startDate
    ? `${new Date(dateRange.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}${
        dateRange.endDate
          ? ` – ${new Date(dateRange.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
          : ' → End'
      }`
    : 'Anytime';

  return (
    <div className="w-full space-y-3.5" ref={containerRef}>
      
      {/* ======================================================== */}
      {/* 1. DESKTOP & TABLET: Airbnb-Style Floating Pill Capsule */}
      {/* ======================================================== */}
      <div className="hidden md:flex items-center bg-white/90 dark:bg-[#131C31]/95 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800 rounded-full shadow-lg p-2 transition-all hover:border-[var(--accent-color)] hover:shadow-xl">
        
        {/* Segment 1: Keyword Search */}
        <div className="flex-1 flex items-center px-4 space-x-3 border-r border-slate-200 dark:border-slate-800">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Keywords
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search projects, stack, problem..."
              className="w-full bg-transparent text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            />
          </div>
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Segment 2: Airbnb Date Picker Trigger */}
        <div
          onClick={() => setActiveDropdown(activeDropdown === 'calendar' ? null : 'calendar')}
          className={`px-5 py-1.5 border-r border-slate-200 dark:border-slate-800 cursor-pointer select-none transition-colors ${
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
              <div className="text-xs font-semibold truncate max-w-[130px]">
                {dateLabel}
              </div>
            </div>
          </div>
        </div>

        {/* Segment 3: Fields Selector Trigger */}
        <div
          onClick={() => setActiveDropdown(activeDropdown === 'fields' ? null : 'fields')}
          className={`px-5 py-1.5 cursor-pointer select-none transition-colors ${
            activeDropdown === 'fields' || selectedFields.length < 4
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
                {selectedFields.length === 4 ? 'All Fields (4)' : `${selectedFields.length} Fields`}
              </div>
            </div>
          </div>
        </div>

        {/* Action Button: Reset / Search Badge */}
        <div className="pl-2 pr-1">
          {hasActiveFilters ? (
            <button
              onClick={onResetFilters}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-full bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 text-xs font-bold transition-colors cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          ) : (
            <div className="w-9 h-9 rounded-full bg-[var(--accent-color)] text-slate-900 flex items-center justify-center font-bold text-xs shadow-md">
              <Search className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. MOBILE VIEW (< md): Touch-First Floating Capsule     */}
      {/* ======================================================== */}
      <div className="md:hidden flex flex-col space-y-2">
        {/* Floating Touch Input Pill */}
        <div className="flex items-center bg-white/95 dark:bg-[#131C31]/95 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-md space-x-2 transition-all focus-within:border-[var(--accent-color)] focus-within:ring-2 focus-within:ring-[var(--accent-glow)]">
          <div className="flex-1 flex items-center space-x-2.5 px-2 min-w-0">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search projects..."
              /* text-base prevents iOS Safari from zooming in on input focus */
              className="w-full bg-transparent text-base sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Date Range Button on Mobile */}
          <button
            onClick={() => setMobileModal('calendar')}
            className={`p-2.5 rounded-xl text-xs font-semibold flex items-center space-x-1 shrink-0 transition-all ${
              dateRange.startDate
                ? 'bg-[var(--accent-color)] text-slate-900 font-bold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
            title="Filter by Date"
          >
            <CalendarIcon className="w-4 h-4" />
            {dateRange.startDate && (
              <span className="text-[10px] font-mono max-w-[65px] truncate">
                {new Date(dateRange.startDate).toLocaleDateString('en-US', { month: 'short' })}
              </span>
            )}
          </button>

          {/* Quick Fields Button on Mobile */}
          <button
            onClick={() => setMobileModal('fields')}
            className={`p-2.5 rounded-xl text-xs font-semibold flex items-center space-x-1 shrink-0 transition-all ${
              selectedFields.length < 4
                ? 'bg-[var(--accent-color)] text-slate-900 font-bold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
            title="Search Fields"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-[10px] font-mono">{selectedFields.length}</span>
          </button>

          {/* Reset on Mobile */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="p-2.5 rounded-xl text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 shrink-0"
              title="Reset Filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. CATEGORY SWIPING RAIL (Mobile & Desktop)              */}
      {/* ======================================================== */}
      <div className="relative flex items-center pt-0.5">
        <button
          onClick={() => scrollCategoryChips('left')}
          className="hidden sm:flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white shrink-0 mr-1.5 border border-slate-200 dark:border-slate-700 shadow-xs"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <div
          ref={categoryScrollRef}
          className="flex-1 flex items-center space-x-2 overflow-x-auto no-scrollbar scroll-smooth py-1 touch-pan-x"
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all flex items-center space-x-1.5 cursor-pointer select-none ${
                  isSelected
                    ? 'bg-[var(--accent-color)] text-slate-900 shadow-md font-mono'
                    : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-400'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
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
        </div>

        <button
          onClick={() => scrollCategoryChips('right')}
          className="hidden sm:flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white shrink-0 ml-1.5 border border-slate-200 dark:border-slate-700 shadow-xs"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Filter Status Badge Bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-1">
        <span>
          Found <strong className="text-slate-900 dark:text-white">{totalFilteredCount}</strong> project{totalFilteredCount === 1 ? '' : 's'}
        </span>
        {dateRange.startDate && (
          <span className="text-[var(--accent-color)] font-semibold truncate max-w-[200px]">
            📅 {dateLabel}
          </span>
        )}
      </div>

      {/* ======================================================== */}
      {/* 4. DESKTOP POPOVERS (Calendar & Fields)                  */}
      {/* ======================================================== */}
      {/* Desktop Calendar Popover */}
      {activeDropdown === 'calendar' && (
        <div className="hidden md:block absolute left-1/3 mt-2 z-40 w-[360px] bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-5 space-y-4 animate-scale-up">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCalendarViewDate(new Date(year, month - 1, 1))}
              className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-heading font-black text-sm text-slate-900 dark:text-white">
              {monthName}
            </span>
            <button
              onClick={() => setCalendarViewDate(new Date(year, month + 1, 1))}
              className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-white"
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
                  className={`h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${
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
              onClick={() => {
                onDateRangeChange({ startDate: '2024-01-01', endDate: '2024-12-31' });
                setActiveDropdown(null);
              }}
              className="text-[var(--accent-color)] font-bold hover:underline"
            >
              Year 2024
            </button>
            <button
              onClick={() => {
                onDateRangeChange({ startDate: '2024-10-01', endDate: '2024-12-31' });
                setActiveDropdown(null);
              }}
              className="text-[var(--accent-color)] font-bold hover:underline"
            >
              Q4 2024
            </button>
            <button
              onClick={() => {
                onDateRangeChange({ startDate: null, endDate: null });
                setActiveDropdown(null);
              }}
              className="text-slate-400 hover:text-rose-500"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Desktop Scope Fields Popover */}
      {activeDropdown === 'fields' && (
        <div className="hidden md:block absolute right-16 mt-2 z-40 w-72 bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-4 space-y-2 animate-scale-up">
          <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">
            Search Matches Against:
          </div>
          {SEARCH_FIELDS.map((f) => {
            const checked = selectedFields.includes(f.id);
            return (
              <div
                key={f.id}
                onClick={() => onToggleField(f.id)}
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
                  className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
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

      {/* ======================================================== */}
      {/* 5. MOBILE BOTTOM SHEETS: Touch-Friendly Calendar & Fields */}
      {/* ======================================================== */}
      {mobileModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="md:hidden fixed inset-0 z-50 flex items-end justify-center bg-slate-950/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setMobileModal(null)}
        >
          <div
            className="w-full max-h-[85vh] overflow-y-auto bg-white dark:bg-[#131C31] border-t border-slate-200 dark:border-slate-800 rounded-t-3xl p-5 space-y-5 shadow-2xl animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Touch Grabber Handle */}
            <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 mx-auto" />

            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-black text-base text-slate-900 dark:text-white">
                {mobileModal === 'calendar' ? '📅 Airbnb Date Range Picker' : '⚡ Search Field Scope'}
              </h3>
              <button
                onClick={() => setMobileModal(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content: Calendar */}
            {mobileModal === 'calendar' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-900">
                  <button
                    onClick={() => setCalendarViewDate(new Date(year, month - 1, 1))}
                    className="p-2 text-slate-400 hover:text-white"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    {monthName}
                  </span>
                  <button
                    onClick={() => setCalendarViewDate(new Date(year, month + 1, 1))}
                    className="p-2 text-slate-400 hover:text-white"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Day of Week */}
                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-mono font-bold text-slate-400 uppercase">
                  <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                </div>

                {/* Big Touch-Friendly Day Grid */}
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
                        className={`h-10 rounded-xl text-xs font-semibold flex items-center justify-center transition-all ${
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

                {/* Presets */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      onDateRangeChange({ startDate: '2024-01-01', endDate: '2024-12-31' });
                      setMobileModal(null);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold"
                  >
                    Year 2024
                  </button>
                  <button
                    onClick={() => {
                      onDateRangeChange({ startDate: '2024-10-01', endDate: '2024-12-31' });
                      setMobileModal(null);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold"
                  >
                    Q4 2024
                  </button>
                  <button
                    onClick={() => {
                      onDateRangeChange({ startDate: null, endDate: null });
                      setMobileModal(null);
                    }}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-rose-500 font-bold"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}

            {/* Modal Content: Fields */}
            {mobileModal === 'fields' && (
              <div className="space-y-2.5">
                {SEARCH_FIELDS.map((f) => {
                  const checked = selectedFields.includes(f.id);
                  return (
                    <button
                      key={f.id}
                      onClick={() => onToggleField(f.id)}
                      className={`w-full p-3.5 rounded-2xl border text-left text-xs transition-all flex items-center justify-between ${
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

            {/* Close Button */}
            <button
              onClick={() => setMobileModal(null)}
              className="w-full py-3.5 rounded-2xl bg-[var(--accent-color)] text-slate-900 font-bold text-xs flex items-center justify-center space-x-2 glow-btn"
            >
              <span>Done ({totalFilteredCount} Projects Found)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
