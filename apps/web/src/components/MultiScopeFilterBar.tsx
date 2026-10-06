'use client';

import React, { useRef } from 'react';
import {
  Search,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter,
  Check,
  RotateCcw,
} from 'lucide-react';

export type SearchScopeField = 'title' | 'tags' | 'description' | 'category';

export interface DateIntervalOption {
  id: string;
  label: string;
  filterFn: (dateStr: string, status?: string) => boolean;
}

export const DATE_INTERVALS: DateIntervalOption[] = [
  { id: 'all', label: 'All Time', filterFn: () => true },
  { id: 'active', label: 'In Active Development', filterFn: (_, status) => status === 'in_development' },
  { id: 'last-3m', label: 'Recent (Last 3 Months)', filterFn: (d) => {
    const diff = (new Date('2025-01-20').getTime() - new Date(d).getTime()) / (1000 * 60 * 60 * 24 * 30);
    return diff <= 3;
  }},
  { id: '2024', label: 'Year 2024', filterFn: (d) => d.startsWith('2024') },
  { id: 'q4-2024', label: 'Q4 2024 (Oct - Dec)', filterFn: (d) => /2024-(10|11|12)/.test(d) },
];

export interface CategoryOption {
  id: string;
  label: string;
  count: number;
}

interface MultiScopeFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedFields: SearchScopeField[];
  onToggleField: (field: SearchScopeField) => void;
  categories: CategoryOption[];
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  selectedInterval: string;
  onSelectInterval: (intervalId: string) => void;
  onResetFilters: () => void;
  totalFilteredCount: number;
}

const SEARCH_FIELDS: { id: SearchScopeField; label: string }[] = [
  { id: 'title', label: 'Project Name' },
  { id: 'tags', label: 'Tech Stack' },
  { id: 'description', label: 'Summary & Problem' },
  { id: 'category', label: 'Domain Category' },
];

export function MultiScopeFilterBar({
  searchQuery,
  onSearchChange,
  selectedFields,
  onToggleField,
  categories,
  selectedCategory,
  onSelectCategory,
  selectedInterval,
  onSelectInterval,
  onResetFilters,
  totalFilteredCount,
}: MultiScopeFilterBarProps) {
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const [showFilterDrawer, setShowFilterDrawer] = React.useState(false);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const offset = direction === 'left' ? -220 : 220;
      categoryScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'all' ||
    selectedInterval !== 'all' ||
    selectedFields.length < 4;

  return (
    <div className="space-y-4 bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm">
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[var(--accent-color)] transition-colors"
          />
        </div>

        {/* Date Interval Selector Dropdown */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <select
              value={selectedInterval}
              onChange={(e) => onSelectInterval(e.target.value)}
              aria-label="Filter projects by time interval"
              className="appearance-none pl-9 pr-8 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-[var(--accent-color)] cursor-pointer"
            >
              {DATE_INTERVALS.map((int) => (
                <option key={int.id} value={int.id}>
                  {int.label}
                </option>
              ))}
            </select>
            <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Toggle Search Scope Checkbox Options Drawer */}
          <button
            onClick={() => setShowFilterDrawer(!showFilterDrawer)}
            className={`p-2.5 rounded-2xl border flex items-center space-x-1.5 text-xs font-bold transition-all ${
              showFilterDrawer || selectedFields.length < 4
                ? 'border-[var(--accent-color)] bg-[var(--accent-glow)] text-slate-900 dark:text-white'
                : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-400'
            }`}
            title="Configure Search Fields"
          >
            <Filter className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Fields</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
              {selectedFields.length}/4
            </span>
          </button>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-rose-500 hover:border-rose-300 transition-colors"
              title="Reset All Filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Search Scope Checkbox Selector (Expandable) */}
      {showFilterDrawer && (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 space-y-2 animate-fade-in">
          <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            <span>Search In Selected Fields:</span>
            <span className="text-[11px] font-normal text-slate-500">Matches any checked field</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {SEARCH_FIELDS.map((f) => {
              const isChecked = selectedFields.includes(f.id);
              return (
                <label
                  key={f.id}
                  onClick={() => onToggleField(f.id)}
                  className={`flex items-center space-x-2 p-2 rounded-xl border text-xs cursor-pointer select-none transition-all ${
                    isChecked
                      ? 'border-[var(--accent-color)] bg-[var(--accent-glow)] text-slate-900 dark:text-white font-bold'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
                      isChecked
                        ? 'bg-[var(--accent-color)] border-[var(--accent-color)] text-slate-900'
                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3" />}
                  </div>
                  <span className="truncate">{f.label}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Scalable Category Navigation Bar (Horizontally scrollable with count badges) */}
      <div className="relative flex items-center">
        {/* Left Scroll Arrow */}
        <button
          onClick={() => scrollCategories('left')}
          className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white shrink-0 mr-1.5 border border-slate-200 dark:border-slate-700 shadow-sm"
          title="Scroll Left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Scrollable Category Chips Container */}
        <div
          ref={categoryScrollRef}
          className="flex-1 flex items-center space-x-2 overflow-x-auto no-scrollbar scroll-smooth py-1"
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-[var(--accent-color)] text-slate-900 shadow-md font-mono'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 hover:border-slate-400'
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

        {/* Right Scroll Arrow */}
        <button
          onClick={() => scrollCategories('right')}
          className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white shrink-0 ml-1.5 border border-slate-200 dark:border-slate-700 shadow-sm"
          title="Scroll Right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Results Count Line */}
      <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-1">
        <span>
          Showing <strong className="text-slate-800 dark:text-white">{totalFilteredCount}</strong> project{totalFilteredCount === 1 ? '' : 's'}
        </span>
        {selectedInterval !== 'all' && (
          <span className="text-[var(--accent-color)] font-semibold">
            Filtered by: {DATE_INTERVALS.find((i) => i.id === selectedInterval)?.label}
          </span>
        )}
      </div>
    </div>
  );
}
