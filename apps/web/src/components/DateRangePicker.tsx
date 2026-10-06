'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
  RotateCcw,
} from 'lucide-react';

export interface DateRange {
  startDate: string | null; // 'YYYY-MM-DD'
  endDate: string | null;   // 'YYYY-MM-DD'
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  // Current viewing month in calendar
  const [viewDate, setViewDate] = useState(() => {
    return value.startDate ? new Date(value.startDate) : new Date('2024-12-01');
  });

  const [hoverDate, setHoverDate] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const monthName = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Compute days in month
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonthDays = new Date(year, month, 0).getDate();

  const prevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const handleDateClick = (dateStr: string) => {
    if (!value.startDate || (value.startDate && value.endDate)) {
      // Pick start date
      onChange({ startDate: dateStr, endDate: null });
    } else {
      // Pick end date
      if (dateStr < value.startDate) {
        onChange({ startDate: dateStr, endDate: value.startDate });
      } else {
        onChange({ startDate: value.startDate, endDate: dateStr });
      }
      setIsOpen(false);
    }
  };

  const formatDateLabel = (d: string | null) => {
    if (!d) return '';
    const dateObj = new Date(d);
    return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isSelected = (dateStr: string) => {
    return dateStr === value.startDate || dateStr === value.endDate;
  };

  const isInRange = (dateStr: string) => {
    if (value.startDate && value.endDate) {
      return dateStr > value.startDate && dateStr < value.endDate;
    }
    if (value.startDate && hoverDate && !value.endDate) {
      const min = value.startDate < hoverDate ? value.startDate : hoverDate;
      const max = value.startDate > hoverDate ? value.startDate : hoverDate;
      return dateStr > min && dateStr < max;
    }
    return false;
  };

  const hasRangeSelected = Boolean(value.startDate || value.endDate);

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button - Airbnb Style Pill */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-2xl border text-xs font-semibold transition-all cursor-pointer shadow-sm select-none ${
          hasRangeSelected
            ? 'border-[var(--accent-color)] bg-[var(--accent-glow)] text-slate-900 dark:text-white ring-1 ring-[var(--accent-color)]'
            : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-400'
        }`}
      >
        <CalendarIcon className="w-3.5 h-3.5 text-[var(--accent-color)] shrink-0" />
        <span className="truncate">
          {hasRangeSelected ? (
            <>
              {formatDateLabel(value.startDate)}
              {value.endDate ? ` → ${formatDateLabel(value.endDate)}` : ' → Pick End Date'}
            </>
          ) : (
            'Date Interval'
          )}
        </span>
        {hasRangeSelected && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onChange({ startDate: null, endDate: null });
            }}
            className="p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 ml-1 text-slate-400 hover:text-slate-700"
            title="Clear date filter"
          >
            <X className="w-3 h-3" />
          </span>
        )}
      </button>

      {/* Airbnb-style Date Range Modal / Popover */}
      {isOpen && (
        <div className="absolute right-0 sm:left-0 sm:right-auto mt-2 z-50 w-[320px] sm:w-[360px] bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-5 space-y-4 animate-scale-up">
          {/* Header with Navigation */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-heading font-black text-sm text-slate-900 dark:text-white">
              {monthName}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Day of Week Labels */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-mono font-bold text-slate-400 uppercase">
            <span>Su</span>
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
          </div>

          {/* Calendar Day Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Previous month filler days */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => {
              const dayNum = prevMonthDays - firstDayOfWeek + i + 1;
              return (
                <div
                  key={`prev-${i}`}
                  className="h-8 flex items-center justify-center text-xs text-slate-300 dark:text-slate-700 select-none"
                >
                  {dayNum}
                </div>
              );
            })}

            {/* Current month days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const monthStr = String(month + 1).padStart(2, '0');
              const dayStr = String(day).padStart(2, '0');
              const dateStr = `${year}-${monthStr}-${dayStr}`;

              const selected = isSelected(dateStr);
              const inRange = isInRange(dateStr);
              const isStart = dateStr === value.startDate;
              const isEnd = dateStr === value.endDate;

              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => handleDateClick(dateStr)}
                  onMouseEnter={() => setHoverDate(dateStr)}
                  onMouseLeave={() => setHoverDate(null)}
                  className={`h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${
                    selected
                      ? 'bg-[var(--accent-color)] text-slate-900 font-bold shadow-md scale-105'
                      : inRange
                      ? 'bg-[var(--accent-glow)] text-slate-900 dark:text-white'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  } ${isStart ? 'rounded-l-lg' : ''} ${isEnd ? 'rounded-r-lg' : ''}`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Quick Presets Bar */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              Quick Intervals:
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => {
                  onChange({ startDate: '2024-01-01', endDate: '2024-12-31' });
                  setIsOpen(false);
                }}
                className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 dark:bg-slate-800 hover:bg-[var(--accent-glow)] text-slate-700 dark:text-slate-300"
              >
                Year 2024
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange({ startDate: '2024-10-01', endDate: '2024-12-31' });
                  setIsOpen(false);
                }}
                className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 dark:bg-slate-800 hover:bg-[var(--accent-glow)] text-slate-700 dark:text-slate-300"
              >
                Q4 2024
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange({ startDate: '2024-06-01', endDate: '2024-12-31' });
                  setIsOpen(false);
                }}
                className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 dark:bg-slate-800 hover:bg-[var(--accent-glow)] text-slate-700 dark:text-slate-300"
              >
                H2 2024
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange({ startDate: null, endDate: null });
                  setIsOpen(false);
                }}
                className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-slate-400 hover:text-rose-500 ml-auto flex items-center space-x-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
