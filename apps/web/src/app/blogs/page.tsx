'use client';

import React, { useState, useMemo } from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { BLOGS_DATA } from '../../data/blogsData';
import { BlogCard } from '../../components/BlogCard';
import { Search, Sparkles, BookOpen, Layers, X } from 'lucide-react';

export default function BlogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');

  // Extract all unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    BLOGS_DATA.forEach((b) => b.tags.forEach((t) => set.add(t)));
    return ['all', ...Array.from(set)];
  }, []);

  // Filter blogs by search query and tag
  const filteredBlogs = useMemo(() => {
    return BLOGS_DATA.filter((blog) => {
      const matchesTag =
        selectedTag === 'all' ||
        blog.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase());

      const query = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !query ||
        blog.title.toLowerCase().includes(query) ||
        blog.excerpt.toLowerCase().includes(query) ||
        blog.tags.some((t) => t.toLowerCase().includes(query));

      return matchesTag && matchesQuery;
    });
  }, [searchQuery, selectedTag]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-800 dark:text-slate-100 flex flex-col transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 w-full space-y-10 sm:space-y-12">
        
        {/* Page Header */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-[var(--accent-color)] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ENGINEERING LOGS & SYSTEM DESIGN</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            Engineering In Public. <br />
            <span className="text-[var(--accent-color)] glow-text">Zero Compromises.</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Deep-dive technical post-mortems, full-stack architecture patterns, and battle-tested code from national hackathons and enterprise client builds.
          </p>
        </section>

        {/* Search & Tag Filter Bar */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles by title, tech stack, or topic..."
                className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[var(--accent-color)] transition-colors shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Total Articles Counter */}
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-500 dark:text-slate-400 shrink-0 self-end sm:self-center">
              <BookOpen className="w-3.5 h-3.5 text-[var(--accent-color)]" />
              <span>
                Found <strong className="text-slate-900 dark:text-white font-bold">{filteredBlogs.length}</strong> article{filteredBlogs.length === 1 ? '' : 's'}
              </span>
            </div>
          </div>

          {/* Tags Rail */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-xs font-mono text-slate-400 shrink-0 flex items-center space-x-1 pl-1">
              <Layers className="w-3 h-3 text-[var(--accent-color)]" />
              <span>Topics:</span>
            </span>

            {allTags.map((tag) => {
              const isSelected = selectedTag.toLowerCase() === tag.toLowerCase();
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--accent-color)] text-slate-950 font-bold shadow-xs'
                      : 'bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-600'
                  }`}
                >
                  {tag === 'all' ? 'All Topics' : `#${tag}`}
                </button>
              );
            })}
          </div>
        </section>

        {/* Articles Grid */}
        <section>
          {filteredBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 p-8 rounded-3xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-heading font-bold text-slate-900 dark:text-white">
                No matching articles found
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                We couldn&apos;t find any articles matching &quot;{searchQuery}&quot; under the selected topic.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTag('all');
                }}
                className="px-4 py-2 rounded-xl bg-[var(--accent-color)] text-slate-950 text-xs font-bold glow-btn cursor-pointer inline-block"
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
