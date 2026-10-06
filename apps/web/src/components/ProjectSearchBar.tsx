'use client';

import React, { useRef, useState } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Check,
  RotateCcw,
} from 'lucide-react';
import { DateRangePicker, DateRange } from './DateRangePicker';

export type SearchScopeField = 'title' | 'tags' | 'description' | 'category';

export interface CategoryOption {
  id: string;
  label: string;
  count: number;
}

interface ProjectSearchBarProps {
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

const SEARCH_FIELDS: { id: SearchScopeField; label: string }[] = [
  { id: 'title', label: 'Project Name' },
  { id: 'tags', label: 'Tech Stack' },
  { id: 'description', label: 'Challenge / Summary' },
  { id: 'category', label: 'Domain Category' },
];

export function ProjectSearchBar({
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
}: ProjectSearchBarProps) {
  const [showFieldsDrawer, setShowFieldsDrawer] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollChips = (dir: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollOffset = dir === 'left' ? -200 : 200;
      scrollContainerRef.current.scrollBy({ left: scrollOffset, behavior: 'smooth' });
    }
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'all' ||
    Boolean(dateRange.startDate || dateRange.endDate) ||
    selectedFields.length < 4;

  return (
    <div className="space-y-3.5 bg-white/80 dark:bg-[#131C31]/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-sm">
      {/* Search Input, Date Range Picker & Fields Trigger */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        {/* Main Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search projects by name, stack, or problem..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[var(--accent-color)] transition-colors"
          />
        </div>

        {/* Controls Row: Airbnb Date Range Picker + Fields Filter + Reset */}
        <div className="flex items-center space-x-2">
          {/* Airbnb-style Date Range Picker */}
          <DateRangePicker value={dateRange} onChange={onDateRangeChange} />

          {/* Search Fields Dropdown / Drawer Button */}
          <button
            type="button"
            onClick={() => setShowFieldsDrawer(!showFieldsDrawer)}
            className={`flex items-center space-x-1.5 px-3 py-2.5 rounded-2xl border text-xs font-semibold transition-all cursor-pointer select-none ${
              showFieldsDrawer || selectedFields.length < 4
                ? 'border-[var(--accent-color)] bg-[var(--accent-glow)] text-slate-900 dark:text-white'
                : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-slate-400'
            }`}
            title="Configure Search Fields"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Fields</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
              {selectedFields.length}/4
            </span>
          </button>

          {/* Reset All */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500 hover:border-rose-300 transition-colors"
              title="Reset Filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Expandable Checkbox Fields Selector */}
      {showFieldsDrawer && (
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2 animate-fade-in">
          <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            <span>Filter Search Within:</span>
            <span className="text-[10px] font-normal lowercase text-slate-500">
              uncheck fields to exclude from search
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SEARCH_FIELDS.map((f) => {
              const isChecked = selectedFields.includes(f.id);
              return (
                <label
                  key={f.id}
                  onClick={() => onToggleField(f.id)}
                  className={`flex items-center space-x-2 p-2 rounded-xl border text-xs cursor-pointer select-none transition-all ${
                    isChecked
                      ? 'border-[var(--accent-color)] bg-[var(--accent-glow)] text-slate-900 dark:text-white font-bold'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded flex items-center justify-center border shrink-0 ${
                      isChecked
                        ? 'bg-[var(--accent-color)] border-[var(--accent-color)] text-slate-900'
                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3" />}
                  </div>
                  <span className="truncate text-xs">{f.label}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Scalable Category Chips (Smooth Horizontal Scroll Rail) */}
      <div className="relative flex items-center pt-1">
        <button
          type="button"
          onClick={() => scrollChips('left')}
          className="hidden sm:flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white shrink-0 mr-1 border border-slate-200 dark:border-slate-700 shadow-xs"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex-1 flex items-center space-x-2 overflow-x-auto no-scrollbar scroll-smooth py-1"
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all flex items-center space-x-1.5 cursor-pointer ${
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

        <button
          type="button"
          onClick={() => scrollChips('right')}
          className="hidden sm:flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white shrink-0 ml-1 border border-slate-200 dark:border-slate-700 shadow-xs"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Filter Status Badge */}
      <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-0.5">
        <span>
          Showing <strong className="text-slate-800 dark:text-white">{totalFilteredCount}</strong> project{totalFilteredCount === 1 ? '' : 's'}
        </span>
        {(dateRange.startDate || dateRange.endDate) && (
          <span className="text-[var(--accent-color)] font-semibold truncate max-w-xs">
            Interval active
          </span>
        )}
      </div>
    </div>
  );
}
