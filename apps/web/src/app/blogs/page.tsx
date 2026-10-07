'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { BLOGS_DATA } from '../../data/blogsData';
import { BlogCard } from '../../components/BlogCard';
import {
  ModernSearchCapsule,
  SearchScopeField,
  CategoryOption,
} from '../../components/ModernSearchCapsule';
import { DateRange } from '../../components/DateRangePicker';
import {
  Sparkles,
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle2,
  Trophy,
  ShieldCheck,
  Cpu,
  Search,
} from 'lucide-react';
import type { Blog } from '@ub/types';

const BLOG_FIELD_OPTIONS: { id: SearchScopeField; label: string; desc: string }[] = [
  { id: 'title', label: 'Article Headline', desc: 'Title & main subject' },
  { id: 'tags', label: 'Tech Stack & Tags', desc: 'Frameworks (Next.js 15, IoT, Security...)' },
  { id: 'description', label: 'Excerpt & Abstract', desc: 'Architectural summary & insights' },
  { id: 'category', label: 'Topic Category', desc: 'Domain & system design classification' },
];

export default function BlogsPage() {
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
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Build dynamic categories list from blog tags
  const categories: CategoryOption[] = useMemo(() => {
    const counts: Record<string, number> = {};
    BLOGS_DATA.forEach((b) => {
      b.tags.forEach((tag) => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });

    // Primary curated topic pills
    const curatedTopics = ['Next.js 15', 'IoT', 'Security', 'Architecture', 'System Design'];
    const options: CategoryOption[] = [
      { id: 'all', label: 'All Topics', count: BLOGS_DATA.length },
    ];

    curatedTopics.forEach((topic) => {
      if (counts[topic]) {
        options.push({
          id: topic.toLowerCase(),
          label: topic,
          count: counts[topic],
        });
      }
    });

    return options;
  }, []);

  const handleToggleField = (field: SearchScopeField) => {
    if (selectedFields.includes(field)) {
      if (selectedFields.length > 1) {
        setSelectedFields(selectedFields.filter((f) => f !== field));
      }
    } else {
      setSelectedFields([...selectedFields, field]);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedFields(['title', 'tags', 'description', 'category']);
    setDateRange({ startDate: null, endDate: null });
    setSelectedCategory('all');
  };

  // Filter blogs according to search query, selected fields, category, and date range
  const filteredBlogs = useMemo(() => {
    return BLOGS_DATA.filter((blog) => {
      // 1. Topic Category filter
      if (selectedCategory !== 'all') {
        const matchesCategory = blog.tags.some(
          (t) => t.toLowerCase() === selectedCategory.toLowerCase()
        );
        if (!matchesCategory) return false;
      }

      // 2. Date Range filter (Airbnb Interval Picker)
      if (dateRange.startDate && blog.publishedAt) {
        const pubDate = blog.publishedAt.slice(0, 10);
        if (pubDate < dateRange.startDate) return false;
      }
      if (dateRange.endDate && blog.publishedAt) {
        const pubDate = blog.publishedAt.slice(0, 10);
        if (pubDate > dateRange.endDate) return false;
      }

      // 3. Multi-Scope Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        let matches = false;

        if (selectedFields.includes('title') && blog.title.toLowerCase().includes(q)) {
          matches = true;
        }
        if (
          selectedFields.includes('tags') &&
          blog.tags.some((t) => t.toLowerCase().includes(q))
        ) {
          matches = true;
        }
        if (
          selectedFields.includes('description') &&
          blog.excerpt.toLowerCase().includes(q)
        ) {
          matches = true;
        }
        if (
          selectedFields.includes('category') &&
          blog.tags.some((t) => t.toLowerCase().includes(q))
        ) {
          matches = true;
        }

        if (!matches) return false;
      }

      return true;
    });
  }, [searchQuery, selectedFields, dateRange, selectedCategory]);

  // Group filtered blogs chronologically by month & year (Google Photos style)
  const groupedBlogs = useMemo(() => {
    const groups: Record<string, { label: string; blogs: Blog[] }> = {};

    filteredBlogs.forEach((blog) => {
      const date = blog.publishedAt ? new Date(blog.publishedAt) : new Date();
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

      if (!groups[key]) {
        groups[key] = { label, blogs: [] };
      }
      groups[key].blogs.push(blog);
    });

    return Object.entries(groups)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([, val]) => val);
  }, [filteredBlogs]);

  const flagshipBlog = BLOGS_DATA[0];
  const isFilteringActive =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'all' ||
    dateRange.startDate !== null ||
    dateRange.endDate !== null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-800 dark:text-slate-100 flex flex-col transition-colors relative overflow-hidden">
      <Navbar />

      {/* Background Ambient Glow Spheres */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--accent-glow)] rounded-full blur-[140px] pointer-events-none opacity-50 -z-10" />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-24 w-full space-y-12 sm:space-y-16">
        
        {/* ======================================================== */}
        {/* 1. HERO SECTION: Headline, Live Metrics & Pitch         */}
        {/* ======================================================== */}
        <section className="text-center max-w-4xl mx-auto space-y-6 pt-4">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs font-mono text-[var(--accent-color)] shadow-xs">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span className="font-bold tracking-wider">PRODUCTION LOGS & DISTRIBUTED SYSTEMS</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-black tracking-tight text-slate-900 dark:text-white leading-[1.08]">
            Engineering In Public. <br />
            <span className="text-[var(--accent-color)] glow-text">Zero Compromises.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            Deep-dive post-mortems, full-stack monorepo blueprints, and battle-tested code from national hackathons and client enterprise rollouts.
          </p>

          {/* Live System Metrics Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
            <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 shadow-2xs">
              <Cpu className="w-3.5 h-3.5 text-[var(--accent-color)]" />
              <span>React 19 & Turbopack</span>
            </div>
            <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 shadow-2xs">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>SIH 2024 Winner (1st Prize)</span>
            </div>
            <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Production Tested 100%</span>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 2. FLAGSHIP DISPATCH SPOTLIGHT (Magazine Hero Banner)    */}
        {/* ======================================================== */}
        {!isFilteringActive && flagshipBlog && (
          <section className="relative rounded-3xl bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-[#131C31] dark:via-[#0E1524] dark:to-[#131C31] border border-slate-200 dark:border-slate-800 p-6 sm:p-8 lg:p-10 shadow-2xl overflow-hidden group">
            {/* Ambient Corner Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--accent-glow)] rounded-full blur-3xl -z-10 pointer-events-none opacity-60" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Headline, Abstract & CTA */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                  <span className="px-3 py-1 rounded-full bg-[var(--accent-color)] text-slate-950 font-bold shadow-xs">
                    ★ FLAGSHIP DISPATCH
                  </span>
                  <span className="flex items-center space-x-1.5 text-slate-500 dark:text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                    <span>{flagshipBlog.readingTimeMinutes} min deep dive</span>
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="text-slate-500 dark:text-slate-400">
                    January 2025
                  </span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-heading font-black tracking-tight text-slate-900 dark:text-white group-hover:text-[var(--accent-color)] transition-colors leading-[1.15]">
                  <Link href={`/blogs/${flagshipBlog.slug}`}>
                    {flagshipBlog.title}
                  </Link>
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {flagshipBlog.excerpt}
                </p>

                {/* Tags Row */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {flagshipBlog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Author & Read Action */}
                <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-950 text-[var(--accent-color)] font-mono font-black text-sm flex items-center justify-center shadow-xs">
                      &lt;UB&gt;
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-900 dark:text-white">
                        <span>Ankit Bhuria</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                      </div>
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        Lead Architect • Upgrader Boy
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/blogs/${flagshipBlog.slug}`}
                    className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-[var(--accent-color)] text-slate-950 font-bold text-xs sm:text-sm glow-btn cursor-pointer shadow-md"
                  >
                    <span>Read Architecture Breakdown</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Hero Cover Image */}
              <div className="lg:col-span-5 relative h-64 sm:h-80 lg:h-96 w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl group-hover:shadow-2xl transition-all">
                <Link href={`/blogs/${flagshipBlog.slug}`} className="block h-full w-full">
                  <Image
                    src={flagshipBlog.coverImage}
                    alt={flagshipBlog.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 right-4 flex items-center space-x-1 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-white text-xs font-mono">
                    <BookOpen className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                    <span>Featured Article</span>
                  </div>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ======================================================== */}
        {/* 3. UNIVERSAL BATTERIES-INCLUDED SEARCH & FILTER CAPSULE  */}
        {/* ======================================================== */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              <Search className="w-3.5 h-3.5 text-[var(--accent-color)]" />
              <span>Full-Spectrum Dispatch Search</span>
            </div>
            <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
              Showing <strong className="text-slate-900 dark:text-white font-bold">{filteredBlogs.length}</strong> of{' '}
              {BLOGS_DATA.length} logs
            </div>
          </div>

          <ModernSearchCapsule
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedFields={selectedFields}
            onToggleField={handleToggleField}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onResetFilters={handleResetFilters}
            totalFilteredCount={filteredBlogs.length}
            placeholder="Search blogs by title, Next.js 15, IoT, Redis, WebSockets, security..."
            fieldOptions={BLOG_FIELD_OPTIONS}
          />
        </section>

        {/* ======================================================== */}
        {/* 4. CHRONOLOGICAL TIMELINE DISPATCHES (Google Photos)    */}
        {/* ======================================================== */}
        <section className="space-y-12">
          {filteredBlogs.length > 0 ? (
            groupedBlogs.map((group) => (
              <div key={group.label} className="space-y-6">
                {/* Month/Year Timeline Header */}
                <div className="flex items-center space-x-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[var(--accent-color)]">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-heading font-black text-slate-900 dark:text-white">
                      {group.label}
                    </h3>
                    <p className="text-xs font-mono text-slate-400">
                      {group.blogs.length} technical publication{group.blogs.length === 1 ? '' : 's'}
                    </p>
                  </div>
                </div>

                {/* Article Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {group.blogs.map((blog) => (
                    <BlogCard key={blog.id} blog={blog} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            /* Empty State */
            <div className="text-center py-20 p-8 rounded-3xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-7 h-7 text-[var(--accent-color)]" />
              </div>
              <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white">
                No matching dispatches found
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                We couldn&apos;t find any articles matching your search criteria or selected date interval.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-xl bg-[var(--accent-color)] text-slate-950 text-xs sm:text-sm font-bold glow-btn cursor-pointer inline-block"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
