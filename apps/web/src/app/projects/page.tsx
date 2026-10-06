'use client';

import React, { useState, useMemo } from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { PROJECTS_DATA } from '../../data/projectsData';
import {
  ProjectSearchBar,
  SearchScopeField,
  CategoryOption,
} from '../../components/ProjectSearchBar';
import { DateRange } from '../../components/DateRangePicker';
import { GooglePhotosProjectGrid } from '../../components/GooglePhotosProjectGrid';
import { Sparkles } from 'lucide-react';

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFields, setSelectedFields] = useState<SearchScopeField[]>([
    'title',
    'tags',
    'description',
    'category',
  ]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });

  // Calculate dynamic category list with actual counts
  const categoryOptions: CategoryOption[] = useMemo(() => {
    const counts: Record<string, number> = {};
    PROJECTS_DATA.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });

    const categoryLabels: Record<string, string> = {
      all: 'All Projects',
      fullstack: 'Full-Stack',
      ai: 'AI & Tools',
      mobile: 'Mobile Apps',
      iot: 'IoT & Hardware',
      devops: 'DevOps & Cloud',
      opensource: 'Open Source',
    };

    const list: CategoryOption[] = [
      { id: 'all', label: 'All Projects', count: PROJECTS_DATA.length },
    ];

    Object.entries(counts).forEach(([catId, count]) => {
      list.push({
        id: catId,
        label: categoryLabels[catId] || catId.toUpperCase(),
        count,
      });
    });

    return list;
  }, []);

  const handleToggleField = (field: SearchScopeField) => {
    setSelectedFields((prev) => {
      if (prev.includes(field)) {
        return prev.length > 1 ? prev.filter((f) => f !== field) : prev;
      } else {
        return [...prev, field];
      }
    });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedFields(['title', 'tags', 'description', 'category']);
    setSelectedCategory('all');
    setDateRange({ startDate: null, endDate: null });
  };

  // Filter projects by Search Query + Checkbox Fields + Category + Date Range
  const filteredProjects = useMemo(() => {
    return PROJECTS_DATA.filter((project) => {
      // 1. Category Filter
      if (selectedCategory !== 'all' && project.category !== selectedCategory) {
        return false;
      }

      // 2. Airbnb-Style Date Range Filter
      const projectDate = project.createdAt.slice(0, 10); // 'YYYY-MM-DD'
      if (dateRange.startDate && projectDate < dateRange.startDate) {
        return false;
      }
      if (dateRange.endDate && projectDate > dateRange.endDate) {
        return false;
      }

      // 3. Multi-Field Search
      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;

      let matches = false;
      if (selectedFields.includes('title') && project.title.toLowerCase().includes(q)) {
        matches = true;
      }
      if (
        selectedFields.includes('tags') &&
        project.tags.some((t) => t.toLowerCase().includes(q))
      ) {
        matches = true;
      }
      if (
        selectedFields.includes('description') &&
        (project.shortDescription.toLowerCase().includes(q) ||
          project.caseStudy?.problem?.toLowerCase().includes(q) ||
          project.caseStudy?.solution?.toLowerCase().includes(q))
      ) {
        matches = true;
      }
      if (selectedFields.includes('category') && project.category.toLowerCase().includes(q)) {
        matches = true;
      }

      return matches;
    });
  }, [searchQuery, selectedFields, selectedCategory, dateRange]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-800 dark:text-slate-100 flex flex-col pt-20">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-10">
        {/* Hero Header */}
        <section className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[var(--accent-glow)] border border-[var(--accent-border)] text-xs font-mono font-bold text-[var(--accent-color)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ARCHITECTURAL CHRONOLOGY</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-heading font-black tracking-tight text-slate-900 dark:text-white">
            Engineering Milestones.{' '}
            <span className="bg-gradient-to-r from-slate-900 via-slate-600 to-[var(--accent-color)] dark:from-white dark:via-slate-200 dark:to-[var(--accent-color)] bg-clip-text text-transparent">
              Built in Public.
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Browse our work grouped chronologically by month like Google Photos. Select dates using the calendar or filter by technology and domain.
          </p>
        </section>

        {/* Mobile-Friendly Search & Airbnb Date Range Filter Bar */}
        <section className="sticky top-20 z-30">
          <ProjectSearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedFields={selectedFields}
            onToggleField={handleToggleField}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            categories={categoryOptions}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onResetFilters={handleResetFilters}
            totalFilteredCount={filteredProjects.length}
          />
        </section>

        {/* Google Photos-Style Chronological Multi-Card Grid */}
        <section>
          <GooglePhotosProjectGrid projects={filteredProjects} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
