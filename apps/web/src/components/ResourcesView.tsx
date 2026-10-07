'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import {
  RESOURCE_CATEGORIES,
  RESOURCE_DOCUMENTS,
} from '../data/resourcesData';
import { ResourceDocumentCard } from './ResourceDocumentCard';
import { ResourceDriveListView } from './ResourceDriveListView';
import { ResourceFolderExplorerView } from './ResourceFolderExplorerView';
import { ResourcePdfModal } from './ResourcePdfModal';
import { ResourceBookFlipReader } from './ResourceBookFlipReader';
import { ResourceFolderTree } from './ResourceFolderTree';
import {
  computeRecursiveCategoryCounts,
  findCategoryById,
  getAllCategoryDescendantIds,
  getCategoryBreadcrumbPath,
} from '../data/categoryUtils';
import {
  ModernSearchCapsule,
  SearchScopeField,
  CategoryOption,
} from './ModernSearchCapsule';
import { DateRange } from './DateRangePicker';
import {
  Sparkles,
  BookOpen,
  Folder,
  Trophy,
  ShieldCheck,
  ChevronRight,
  Search,
  FileText,
  LayoutGrid,
  List,
  Grid,
  Layers,
  X,
  Tag,
} from 'lucide-react';
import type { ResourceDocument } from '@ub/types';

export type ResourceViewMode = 'cards' | 'drive-grid' | 'drive-list';

const RESOURCE_FIELD_OPTIONS: { id: SearchScopeField; label: string; desc: string }[] = [
  { id: 'title', label: 'Document Title', desc: 'Title & subject' },
  { id: 'tags', label: 'Topic & Tags', desc: 'Tags (DSA, Redis, SIH 2024...)' },
  { id: 'description', label: 'Overview & Abstract', desc: 'Summary of notes & playbooks' },
  { id: 'category', label: 'Category & Path', desc: 'Folder directory structure' },
];

const POPULAR_TAGS = [
  'DSA',
  'Redis',
  'System Design',
  'SIH 2024',
  'Next.js 15',
  'SQL',
  'Security',
  'Turbopack',
];

interface ResourcesViewProps {
  initialCategoryId?: string;
  initialSlugPath?: string[];
}

export function ResourcesView({ initialCategoryId = 'all' }: ResourcesViewProps) {
  const [viewMode, setViewMode] = useState<ResourceViewMode>('drive-grid');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
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
  const [activeCategoryId, setActiveCategoryId] = useState<string>(initialCategoryId);
  const [selectedPdfDoc, setSelectedPdfDoc] = useState<ResourceDocument | null>(null);
  const [readingBookDoc, setReadingBookDoc] = useState<ResourceDocument | null>(null);

  // Restore view mode preference from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('ub-resources-view');
      if (stored) {
        setTimeout(() => {
          if (stored === 'cards' || stored === 'drive-grid' || stored === 'drive-list') {
            setViewMode(stored as ResourceViewMode);
          } else if (stored === 'grid') {
            setViewMode('cards');
          } else if (stored === 'drive') {
            setViewMode('drive-grid');
          }
        }, 0);
      }
    } catch {}
  }, []);

  const handleSetViewMode = (mode: ResourceViewMode) => {
    setViewMode(mode);
    try {
      localStorage.setItem('ub-resources-view', mode);
    } catch {}
  };

  // Compute recursive document count per category (supports arbitrary nesting)
  const documentCountsByCat = useMemo(() => {
    const directCounts: Record<string, number> = {};
    RESOURCE_DOCUMENTS.forEach((doc) => {
      doc.categoryPath.forEach((catId) => {
        directCounts[catId] = (directCounts[catId] || 0) + 1;
      });
    });
    return computeRecursiveCategoryCounts(RESOURCE_CATEGORIES, directCounts);
  }, []);

  // Compute dynamic category rail options for ModernSearchCapsule
  const categoryRailOptions: CategoryOption[] = useMemo(() => {
    const options: CategoryOption[] = [
      { id: 'all', label: 'All Curricula', count: RESOURCE_DOCUMENTS.length },
    ];

    RESOURCE_CATEGORIES.forEach((cat) => {
      options.push({
        id: cat.id,
        label: cat.name,
        count: documentCountsByCat[cat.id] || 0,
      });
    });

    return options;
  }, [documentCountsByCat]);

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
    setActiveCategoryId('all');
  };

  // Filter documents by search, category, and date range
  const filteredDocuments = useMemo(() => {
    return RESOURCE_DOCUMENTS.filter((doc) => {
      // 1. Category Tree Filter (recursively includes all subcategories)
      if (activeCategoryId !== 'all') {
        const activeCat = findCategoryById(RESOURCE_CATEGORIES, activeCategoryId);
        const validCatIds = activeCat
          ? getAllCategoryDescendantIds(activeCat)
          : [activeCategoryId];
        const matchesCat = doc.categoryPath.some((id) => validCatIds.includes(id));
        if (!matchesCat) return false;
      }

      // 2. Date Range Filter
      if (dateRange.startDate && doc.publishedAt) {
        const pubDate = doc.publishedAt.slice(0, 10);
        if (pubDate < dateRange.startDate) return false;
      }
      if (dateRange.endDate && doc.publishedAt) {
        const pubDate = doc.publishedAt.slice(0, 10);
        if (pubDate > dateRange.endDate) return false;
      }

      // 3. Multi-Scope Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        let matches = false;

        if (selectedFields.includes('title') && doc.title.toLowerCase().includes(q)) {
          matches = true;
        }
        if (selectedFields.includes('tags') && doc.tags.some((t) => t.toLowerCase().includes(q))) {
          matches = true;
        }
        if (selectedFields.includes('description') && doc.description.toLowerCase().includes(q)) {
          matches = true;
        }
        if (
          selectedFields.includes('category') &&
          doc.categoryPath.some((catId) => catId.toLowerCase().includes(q))
        ) {
          matches = true;
        }

        if (!matches) return false;
      }

      return true;
    });
  }, [searchQuery, selectedFields, dateRange, activeCategoryId]);

  // Find active category label for breadcrumb (full path)
  const activeCategoryName = useMemo(() => {
    if (activeCategoryId === 'all') return 'Root Directory';
    const path = getCategoryBreadcrumbPath(RESOURCE_CATEGORIES, activeCategoryId);
    if (path && path.length > 0) {
      return path.map((c) => c.name).join(' > ');
    }
    return 'Directory';
  }, [activeCategoryId]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-800 dark:text-slate-100 flex flex-col transition-colors relative overflow-x-clip">
      <Navbar />

      {/* Top Ambient Glow Orb */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-[var(--accent-glow)] rounded-full blur-[140px] pointer-events-none opacity-45 -z-10" />

      {/* ======================================================== */}
      {/* MOBILE / LAPTOP SLIDE-OVER DRAWER (< 1680px)             */}
      {/* ======================================================== */}
      {isMobileDrawerOpen && (
        <div className="min-[1680px]:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileDrawerOpen(false)}
          />

          {/* Slide-out drawer panel */}
          <div className="relative w-84 max-w-[85vw] bg-white dark:bg-[#0E1524] p-5 shadow-2xl flex flex-col h-full border-r border-slate-200 dark:border-slate-800 z-10 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-[var(--accent-color)]" />
                <h3 className="font-heading font-black text-sm uppercase tracking-wider text-slate-900 dark:text-white">
                  Knowledge Directory
                </h3>
              </div>
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-5 sidebar-scroll-container">
              {/* Component 1: Folder Tree */}
              <ResourceFolderTree
                categories={RESOURCE_CATEGORIES}
                activeCategoryId={activeCategoryId}
                onSelectCategory={(catId) => {
                  setActiveCategoryId(catId);
                  setIsMobileDrawerOpen(false);
                }}
                documentCountsByCat={documentCountsByCat}
              />

              {/* Component 2: Popular Topic Tags */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
                <div className="flex items-center space-x-2 text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  <Tag className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                  <span>Topic Shortcuts</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        setSearchQuery(tag);
                        setIsMobileDrawerOpen(false);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-[var(--accent-color)] hover:text-slate-950 text-slate-600 dark:text-slate-300 text-[10px] font-mono transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Component 3: Suggest Playbook */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-100 via-white to-slate-100 dark:from-[#131C31] dark:via-[#0E1524] dark:to-[#131C31] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
                <div className="flex items-center space-x-2 text-[11px] font-mono font-bold text-[var(--accent-color)]">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>SUGGEST A PLAYBOOK</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  Looking for architecture breakdowns or national hackathon problem statements? Suggest a playbook.
                </p>
                <Link
                  href="/contact"
                  className="block text-center py-1.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[var(--accent-color)] hover:text-slate-950 font-semibold text-[11px] transition-colors border border-slate-200 dark:border-slate-700"
                >
                  Request Playbook →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MAIN CONTAINER: ALIGNED EXACTLY WITH MAX-W-7XL NAVBAR     */}
      {/* ======================================================== */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-24 w-full space-y-10 sm:space-y-12 min-h-[calc(100vh-12rem)]">
        
        {/* HERO SECTION */}
        <section className="text-center max-w-4xl mx-auto space-y-6 pt-2">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs font-mono text-[var(--accent-color)] shadow-xs">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span className="font-bold tracking-wider">FREE OPEN KNOWLEDGE & PLAYBOOKS</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-black tracking-tight text-slate-900 dark:text-white leading-[1.08]">
            Engineering Curricula. <br />
            <span className="text-[var(--accent-color)] glow-text">Zero Gatekeeping.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            Handcrafted computer science visual notes, SIH 2024 national winning blueprints, distributed systems architectures, and production readiness checklists.
          </p>

          {/* Metrics Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-1">
            <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 shadow-2xs">
              <FileText className="w-3.5 h-3.5 text-[var(--accent-color)]" />
              <span>7 Verified Documents</span>
            </div>
            <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 shadow-2xs">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>National SIH 2024 Decks</span>
            </div>
            <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>100% Free & Open Access</span>
            </div>
          </div>
        </section>

        {/* FULL SPECTRUM SEARCH CAPSULE (Uses whole width under navbar) */}
        <section className="space-y-4 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              <Search className="w-3.5 h-3.5 text-[var(--accent-color)]" />
              <span>Full-Spectrum Document Search</span>
            </div>
            <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
              Showing <strong className="text-slate-900 dark:text-white font-bold">{filteredDocuments.length}</strong> of{' '}
              {RESOURCE_DOCUMENTS.length} documents
            </div>
          </div>

          <ModernSearchCapsule
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedFields={selectedFields}
            onToggleField={handleToggleField}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            categories={categoryRailOptions}
            selectedCategory={activeCategoryId}
            onSelectCategory={setActiveCategoryId}
            onResetFilters={handleResetFilters}
            totalFilteredCount={filteredDocuments.length}
            placeholder="Search notes by DSA, Redis, Next.js 15, SIH 2024, SQL..."
            fieldOptions={RESOURCE_FIELD_OPTIONS}
          />
        </section>

        {/* ======================================================== */}
        {/* RESOURCES SECTION: WITH STICKY SCROLL OUTER SIDEBAR      */}
        {/* ======================================================== */}
        <section className="relative w-full min-h-[820px]">
          
          {/* ======================================================== */}
          {/* OUTER STICKY SIDEBAR (Resides OUTSIDE navbar-sized width) */}
          {/* - Starts at top-0 alongside resources section (natural flow) */}
          {/* - Sticks at top-24 below navbar as user scrolls down      */}
          {/* - Contains multiple rich components                      */}
          {/* - Has independent scroll container (overscroll-contain)  */}
          {/*   so user can scroll it separately without affecting page */}
          {/* ======================================================== */}
          <aside className="hidden min-[1680px]:block absolute -left-[324px] 2xl:-left-[338px] top-0 bottom-0 w-[296px] 2xl:w-[310px] pointer-events-auto">
            <div className="sticky top-24 sidebar-scroll-container pr-2 space-y-4">
              
              {/* Component 1: Knowledge Directory Tree */}
              <ResourceFolderTree
                categories={RESOURCE_CATEGORIES}
                activeCategoryId={activeCategoryId}
                onSelectCategory={setActiveCategoryId}
                documentCountsByCat={documentCountsByCat}
              />

              {/* Component 2: Topic Shortcuts & Filter Tags */}
              <div className="p-4 rounded-3xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center space-x-2 text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  <Tag className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                  <span>Topic Shortcuts</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-mono transition-all border cursor-pointer ${
                        searchQuery.toLowerCase() === tag.toLowerCase()
                          ? 'bg-[var(--accent-color)] text-slate-950 border-[var(--accent-color)] font-bold shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[var(--accent-color)] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/80'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Component 3: Student / Developer Contribution Card */}
              <div className="p-4 rounded-3xl bg-gradient-to-br from-slate-100 via-white to-slate-100 dark:from-[#131C31] dark:via-[#0E1524] dark:to-[#131C31] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5">
                <div className="flex items-center space-x-2 text-[11px] font-mono font-bold text-[var(--accent-color)]">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>SUGGEST A PLAYBOOK</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  Looking for architecture breakdowns or national hackathon problem statements? Suggest a playbook.
                </p>
                <Link
                  href="/contact"
                  className="block text-center py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[var(--accent-color)] hover:text-slate-950 font-semibold text-[11px] transition-colors border border-slate-200 dark:border-slate-700"
                >
                  Request Playbook →
                </Link>
              </div>

              {/* Component 4: Curricula Health Indicator */}
              <div className="p-3.5 rounded-2xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Live Sync Ready</span>
                </span>
                <span>{filteredDocuments.length} Indexed</span>
              </div>
            </div>
          </aside>

          {/* ======================================================== */}
          {/* MAIN RESOURCES CANVAS (Uses whole width under navbar)     */}
          {/* ======================================================== */}
          <div className="w-full space-y-6">
            
            {/* Breadcrumb Path & View Mode Switcher Banner */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 shadow-2xs text-xs font-mono">
              <div className="flex items-center space-x-3 truncate">
                {/* Directory Drawer Button for Viewports < 1680px */}
                <button
                  onClick={() => setIsMobileDrawerOpen(true)}
                  className="min-[1680px]:hidden flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-mono font-semibold transition-all cursor-pointer"
                  title="Open Knowledge Directory"
                >
                  <Layers className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                  <span>Knowledge Directory</span>
                </button>

                <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 truncate">
                  <button
                    onClick={() => setActiveCategoryId('all')}
                    className="hover:text-[var(--accent-color)] transition-colors cursor-pointer"
                  >
                    Drive Root
                  </button>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-[var(--accent-color)] font-semibold truncate">
                    {activeCategoryName}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="text-slate-700 dark:text-slate-300 font-bold shrink-0">
                    {filteredDocuments.length} Item{filteredDocuments.length === 1 ? '' : 's'}
                  </span>
                </div>
              </div>

              {/* 3 View Mode Switchers: Drive Explorer (Grid), Cards Grid, Table List */}
              <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => handleSetViewMode('drive-grid')}
                  className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    viewMode === 'drive-grid'
                      ? 'bg-white dark:bg-slate-900 text-[var(--accent-color)] font-bold shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Google Drive / Desktop Folder Explorer Grid"
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span>Drive Explorer</span>
                </button>

                <button
                  onClick={() => handleSetViewMode('cards')}
                  className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    viewMode === 'cards'
                      ? 'bg-white dark:bg-slate-900 text-[var(--accent-color)] font-bold shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Editorial Showcase Cards View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Cards Grid</span>
                </button>

                <button
                  onClick={() => handleSetViewMode('drive-list')}
                  className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    viewMode === 'drive-list'
                      ? 'bg-white dark:bg-slate-900 text-[var(--accent-color)] font-bold shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Google Drive / File Explorer Details Table"
                >
                  <List className="w-3.5 h-3.5" />
                  <span>Table List</span>
                </button>
              </div>
            </div>

            {/* Documents Content Renderers - Uses 100% of the max-w-7xl navbar width */}
            {filteredDocuments.length > 0 ? (
              viewMode === 'drive-grid' ? (
                /* VIEW 1: Google Drive / Desktop Folder & File Square Tiles Grid */
                <ResourceFolderExplorerView
                  categories={RESOURCE_CATEGORIES}
                  activeCategoryId={activeCategoryId}
                  onSelectCategory={setActiveCategoryId}
                  documents={filteredDocuments}
                  documentCountsByCat={documentCountsByCat}
                  onOpenBook={(d) => setReadingBookDoc(d)}
                  onPreviewPdf={(d) => setSelectedPdfDoc(d)}
                />
              ) : viewMode === 'cards' ? (
                /* VIEW 2: Editorial Showcase Cards Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 animate-fade-in">
                  {filteredDocuments.map((doc) => (
                    <ResourceDocumentCard
                      key={doc.id}
                      document={doc}
                      onPreview={(d) => setSelectedPdfDoc(d)}
                      onOpenBook={(d) => setReadingBookDoc(d)}
                    />
                  ))}
                </div>
              ) : (
                /* VIEW 3: Google Drive Table List */
                <ResourceDriveListView
                  documents={filteredDocuments}
                  onOpenBook={(d) => setReadingBookDoc(d)}
                  onPreviewPdf={(d) => setSelectedPdfDoc(d)}
                />
              )
            ) : (
              /* Empty State */
              <div className="text-center py-20 p-8 rounded-3xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 flex items-center justify-center mx-auto">
                  <Folder className="w-7 h-7 text-[var(--accent-color)]" />
                </div>
                <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white">
                  No documents found in this folder
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  We couldn&apos;t find any study materials matching your search query or selected category filter.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 rounded-xl bg-[var(--accent-color)] text-slate-950 text-xs sm:text-sm font-bold glow-btn cursor-pointer inline-block"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* 3D Realistic Book Flip Reader Modal */}
      <ResourceBookFlipReader
        doc={readingBookDoc}
        onClose={() => setReadingBookDoc(null)}
      />

      {/* Embedded PDF Document Preview Modal */}
      <ResourcePdfModal
        resourceDoc={selectedPdfDoc}
        onClose={() => setSelectedPdfDoc(null)}
      />

      <Footer />
    </div>
  );
}
