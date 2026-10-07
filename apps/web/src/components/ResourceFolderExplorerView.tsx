'use client';

import React, { useState, useMemo } from 'react';
import {
  Folder,
  FolderOpen,
  FileText,
  BookOpen,
  Eye,
  Download,
  ChevronRight,
  ArrowUpLeft,
  Layers,
  Trophy,
  ShieldCheck,
  Code2,
  Binary,
  Search,
} from 'lucide-react';
import type { ResourceCategory, ResourceDocument } from '@ub/types';
import {
  findCategoryById,
  getCategoryBreadcrumbPath,
} from '../data/categoryUtils';

interface ResourceFolderExplorerViewProps {
  categories: ResourceCategory[];
  activeCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
  documents: ResourceDocument[];
  documentCountsByCat: Record<string, number>;
  onOpenBook: (doc: ResourceDocument) => void;
  onPreviewPdf: (doc: ResourceDocument) => void;
}

export function ResourceFolderExplorerView({
  categories,
  activeCategoryId,
  onSelectCategory,
  documents,
  documentCountsByCat,
  onOpenBook,
  onPreviewPdf,
}: ResourceFolderExplorerViewProps) {
  const [folderSearchFilter, setFolderSearchFilter] = useState('');

  const isRoot = activeCategoryId === 'all';

  // 1. Resolve full recursive breadcrumb path from Root to Active Category
  const breadcrumbPath = useMemo(() => {
    if (isRoot) return [];
    return getCategoryBreadcrumbPath(categories, activeCategoryId) || [];
  }, [categories, activeCategoryId, isRoot]);

  // Current active category object
  const currentCategory = useMemo(() => {
    if (isRoot) return null;
    return findCategoryById(categories, activeCategoryId);
  }, [categories, activeCategoryId, isRoot]);

  // Immediate parent category in the hierarchy
  const parentCategory = useMemo(() => {
    if (breadcrumbPath.length <= 1) return null;
    return breadcrumbPath[breadcrumbPath.length - 2];
  }, [breadcrumbPath]);

  // Theme helper for category cards
  const getCategoryTheme = (id: string) => {
    if (id.includes('hackathon') || id.includes('sih')) {
      return {
        gradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
        accent: 'text-amber-500 dark:text-amber-400',
        glow: 'group-hover:shadow-[0_12px_32px_rgba(245,158,11,0.2)]',
        border: 'group-hover:border-amber-500/50',
        icon: Trophy,
      };
    }
    if (id.includes('fullstack') || id.includes('security') || id.includes('nextjs')) {
      return {
        gradient: 'from-purple-500/20 via-indigo-500/10 to-transparent',
        accent: 'text-purple-500 dark:text-purple-400',
        glow: 'group-hover:shadow-[0_12px_32px_rgba(168,85,247,0.2)]',
        border: 'group-hover:border-purple-500/50',
        icon: Code2,
      };
    }
    return {
      gradient: 'from-cyan-500/20 via-blue-500/10 to-transparent',
      accent: 'text-cyan-500 dark:text-cyan-400',
      glow: 'group-hover:shadow-[0_12px_32px_rgba(6,182,212,0.2)]',
      border: 'group-hover:border-cyan-500/50',
      icon: Binary,
    };
  };

  // 2. Resolve visible subfolders at current hierarchy level
  const rawSubfolders = useMemo(() => {
    if (isRoot) {
      return categories;
    }
    return currentCategory?.children || [];
  }, [isRoot, categories, currentCategory]);

  // Filter subfolders by in-folder search term
  const visibleSubfolders = useMemo(() => {
    const q = folderSearchFilter.trim().toLowerCase();
    return rawSubfolders.filter((sub) => {
      if (!q) return true;
      return sub.name.toLowerCase().includes(q) || sub.slug.toLowerCase().includes(q);
    });
  }, [rawSubfolders, folderSearchFilter]);

  // 3. Filter documents inside this folder
  const visibleDocuments = useMemo(() => {
    const q = folderSearchFilter.trim().toLowerCase();
    return documents.filter((doc) => {
      if (!q) return true;
      return (
        doc.title.toLowerCase().includes(q) ||
        doc.description.toLowerCase().includes(q) ||
        doc.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [documents, folderSearchFilter]);

  const formatSize = (bytes?: number) => {
    if (!bytes) return '2.4 MB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // 4. Format badge type helper
  const getDocVisualDetails = (doc: ResourceDocument) => {
    if (doc.tags.some((t) => t.toLowerCase().includes('sih') || t.toLowerCase().includes('deck'))) {
      return {
        label: 'KEYNOTE DECK',
        accentBg: 'bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/30',
        dotColor: 'bg-amber-500',
        typeIcon: Trophy,
        spineColor: 'bg-gradient-to-b from-amber-500 via-orange-500 to-amber-600',
        cardGlow: 'group-hover:shadow-[0_16px_36px_rgba(245,158,11,0.22)]',
      };
    }
    if (doc.tags.some((t) => t.toLowerCase().includes('security') || t.toLowerCase().includes('jwt'))) {
      return {
        label: 'SECURITY MATRIX',
        accentBg: 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/30',
        dotColor: 'bg-rose-500',
        typeIcon: ShieldCheck,
        spineColor: 'bg-gradient-to-b from-rose-500 via-pink-500 to-rose-600',
        cardGlow: 'group-hover:shadow-[0_16px_36px_rgba(244,63,94,0.22)]',
      };
    }
    if (doc.tags.some((t) => t.toLowerCase().includes('system') || t.toLowerCase().includes('redis'))) {
      return {
        label: 'SYSTEM ARCHITECTURE',
        accentBg: 'bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 border-cyan-500/30',
        dotColor: 'bg-cyan-500',
        typeIcon: Binary,
        spineColor: 'bg-gradient-to-b from-cyan-500 via-blue-500 to-cyan-600',
        cardGlow: 'group-hover:shadow-[0_16px_36px_rgba(6,182,212,0.22)]',
      };
    }
    return {
      label: 'STUDY PLAYBOOK',
      accentBg: 'bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border-indigo-500/30',
      dotColor: 'bg-indigo-500',
      typeIcon: Code2,
      spineColor: 'bg-gradient-to-b from-indigo-500 via-purple-500 to-indigo-600',
      cardGlow: 'group-hover:shadow-[0_16px_36px_rgba(99,102,241,0.22)]',
    };
  };

  return (
    <div className="w-full space-y-7 animate-fade-in">
      {/* ======================================================== */}
      {/* 1. INFINITE HIERARCHY BREADCRUMBS & FOLDER CONTROLS      */}
      {/* ======================================================== */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-3.5 sm:p-4 rounded-3xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 shadow-sm gap-3">
        {/* Scrollable Breadcrumb Navigation Bar */}
        <div className="flex items-center space-x-1.5 text-xs font-mono overflow-x-auto scrollbar-none py-1 max-w-full">
          {/* Root Link */}
          <button
            onClick={() => onSelectCategory('all')}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 ${
              isRoot
                ? 'bg-[var(--accent-color)] text-slate-950 font-bold shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Folder className="w-3.5 h-3.5" />
            <span>Root Drive</span>
          </button>

          {/* Ancestor Crumbs (Recursive Depth Chain) */}
          {breadcrumbPath.map((crumb, idx) => {
            const isLast = idx === breadcrumbPath.length - 1;

            return (
              <React.Fragment key={crumb.id}>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {isLast ? (
                  <div
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[var(--accent-color)]/10 text-[var(--accent-color)] border border-[var(--accent-color)]/25 font-bold shadow-2xs shrink-0 max-w-[220px] sm:max-w-[280px]"
                    title={crumb.name}
                  >
                    <FolderOpen className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{crumb.name}</span>
                  </div>
                ) : (
                  <button
                    onClick={() => onSelectCategory(crumb.id)}
                    className="px-2.5 py-1.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0 max-w-[130px] sm:max-w-[170px]"
                    title={`Jump to ${crumb.name}`}
                  >
                    <span className="truncate block">{crumb.name}</span>
                  </button>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Action Controls: Up One Level & In-Folder Filter */}
        <div className="flex items-center space-x-2 shrink-0 justify-end">
          {/* Quick filter input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={folderSearchFilter}
              onChange={(e) => setFolderSearchFilter(e.target.value)}
              placeholder="Filter folder items..."
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-[var(--accent-color)] w-36 sm:w-48 transition-all"
            />
          </div>

          {!isRoot && (
            <button
              onClick={() => {
                if (parentCategory) {
                  onSelectCategory(parentCategory.id);
                } else {
                  onSelectCategory('all');
                }
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-mono font-semibold transition-all cursor-pointer shadow-2xs shrink-0"
              title={parentCategory ? `Go up to ${parentCategory.name}` : 'Go up to Root Drive'}
            >
              <ArrowUpLeft className="w-3.5 h-3.5 text-[var(--accent-color)]" />
              <span className="hidden sm:inline">Up Level</span>
            </button>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. SUBDIRECTORIES & FOLDER TILES GRID                     */}
      {/* ======================================================== */}
      {visibleSubfolders.length > 0 && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              <Folder className="w-3.5 h-3.5 text-[var(--accent-color)]" />
              <span>
                Directories & Categories ({visibleSubfolders.length})
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Double click or tap to navigate
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {visibleSubfolders.map((folder) => {
              const theme = getCategoryTheme(folder.id);
              const CategoryIcon = theme.icon;
              const hasSubDirs = !!(folder.children && folder.children.length > 0);
              const subDirCount = folder.children?.length || 0;
              const docCount = documentCountsByCat[folder.id] || 0;

              return (
                <div
                  key={folder.id}
                  onClick={() => onSelectCategory(folder.id)}
                  className={`group relative flex flex-col justify-between p-5 rounded-3xl bg-white dark:bg-[#131C31] hover:bg-slate-50/90 dark:hover:bg-[#18233C] border border-slate-200/90 dark:border-slate-800/90 ${theme.border} shadow-sm ${theme.glow} transition-all duration-300 cursor-pointer min-h-[175px] select-none overflow-hidden`}
                  title={`${folder.name} • ${docCount} documents`}
                >
                  {/* Subtle category atmospheric gradient wash */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-40 group-hover:opacity-80 transition-opacity pointer-events-none`}
                  />

                  {/* Top Row: Layered 3D Folder Graphic + Badge */}
                  <div className="flex items-start justify-between w-full relative z-10">
                    {/* Realistic 3D Folder Capsule Icon */}
                    <div className="relative">
                      {/* Back tab */}
                      <div className="w-9 h-3.5 rounded-t-md bg-slate-300 dark:bg-slate-700 group-hover:bg-[var(--accent-color)]/70 transition-colors ml-1" />

                      {/* Main folder face */}
                      <div className="w-14 h-10 rounded-xl rounded-tl-none bg-gradient-to-br from-slate-200 via-slate-100 to-slate-300 dark:from-slate-700 dark:via-slate-800 dark:to-slate-900 border border-slate-300 dark:border-slate-600/80 shadow-md flex items-center justify-center relative overflow-hidden group-hover:scale-105 group-hover:border-[var(--accent-color)]/60 transition-all duration-300">
                        {/* Peeking Document Sheet inside folder */}
                        <div className="absolute top-1 right-2 w-7 h-5 bg-white dark:bg-slate-200 rounded-sm shadow-xs opacity-70 group-hover:-translate-y-1 transition-transform" />

                        {/* Front Folder Lip */}
                        <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-slate-300 to-slate-200 dark:from-slate-800 dark:to-slate-700 border-t border-white/20 flex items-center px-1.5">
                          <CategoryIcon className={`w-3.5 h-3.5 ${theme.accent}`} />
                        </div>
                      </div>
                    </div>

                    {/* Right Telemetry Badge */}
                    <div className="flex flex-col items-end space-y-1">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 group-hover:border-[var(--accent-color)]/50 transition-colors">
                        {docCount} {docCount === 1 ? 'doc' : 'docs'}
                      </span>
                      {hasSubDirs && (
                        <span className="text-[9px] font-mono text-[var(--accent-color)] font-semibold flex items-center space-x-1">
                          <Layers className="w-3 h-3" />
                          <span>{subDirCount} subdirs</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom: Folder Title & Navigation Hook */}
                  <div className="space-y-2 relative z-10 mt-3">
                    <h3
                      className="font-heading font-black text-sm text-slate-900 dark:text-white group-hover:text-[var(--accent-color)] transition-colors line-clamp-2 leading-snug"
                      title={folder.name}
                    >
                      {folder.name}
                    </h3>

                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1.5 border-t border-slate-100 dark:border-slate-800/80">
                      <span className="truncate max-w-[120px]">/{folder.slug}</span>
                      <div className="flex items-center space-x-1 text-[var(--accent-color)] font-bold group-hover:translate-x-1 transition-transform">
                        <span>Open</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. DOSSIER PLAYBOOK DOCUMENTS GRID                       */}
      {/* ======================================================== */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5 text-[var(--accent-color)]" />
            <span>
              {isRoot ? 'All Study Materials & Playbooks' : `${currentCategory?.name || 'Folder'} Files`}{' '}
              ({visibleDocuments.length})
            </span>
          </div>
          {folderSearchFilter && (
            <span className="text-[11px] font-mono text-slate-400">
              Filter: &ldquo;{folderSearchFilter}&rdquo;
            </span>
          )}
        </div>

        {visibleDocuments.length === 0 ? (
          <div className="text-center py-16 p-8 rounded-3xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <FolderOpen className="w-6 h-6" />
            </div>
            <h4 className="font-heading font-bold text-slate-900 dark:text-white text-base">
              No files in this view
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              {folderSearchFilter
                ? `No items matched your filter "${folderSearchFilter}". Try clearing your search.`
                : 'This directory contains subcategories above, but has no direct root files.'}
            </p>
            {folderSearchFilter && (
              <button
                onClick={() => setFolderSearchFilter('')}
                className="px-4 py-1.5 rounded-xl bg-[var(--accent-color)] text-slate-950 font-bold text-xs glow-btn cursor-pointer inline-block"
              >
                Clear Filter
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {visibleDocuments.map((doc) => {
              const visual = getDocVisualDetails(doc);
              const DocTypeIcon = visual.typeIcon;

              return (
                <div
                  key={doc.id}
                  onClick={() => onOpenBook(doc)}
                  className={`group relative flex flex-col justify-between rounded-3xl p-5 bg-white dark:bg-[#131C31] hover:bg-slate-50/90 dark:hover:bg-[#162038] border border-slate-200/90 dark:border-slate-800/90 shadow-sm ${visual.cardGlow} transition-all duration-300 cursor-pointer min-h-[290px] select-none overflow-hidden`}
                >
                  {/* Left-edge book spine accent indicator */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1.5 ${visual.spineColor} rounded-l-3xl opacity-80 group-hover:w-2 transition-all`}
                  />

                  {/* Card Top: Format Badge, Page Corner & File Size */}
                  <div className="flex items-center justify-between w-full pl-2">
                    <div className="flex items-center space-x-1.5 truncate pr-2">
                      <span className="text-[9px] font-mono font-black uppercase text-[var(--accent-color)] bg-slate-950/80 px-1.5 py-0.5 rounded-md border border-[var(--accent-color)]/30">
                        .{doc.fileExtension || 'PDF'}
                      </span>
                      <span
                        className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border truncate ${visual.accentBg}`}
                      >
                        {visual.label}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-slate-400 font-semibold shrink-0">
                      {formatSize(doc.fileSizeBytes)}
                    </span>
                  </div>

                  {/* Card Center: Visual Document Artwork Container */}
                  <div className="my-auto py-3 pl-2 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-20 rounded-2xl bg-gradient-to-b from-slate-100 via-slate-50 to-slate-200 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900 border border-slate-200 dark:border-slate-700/80 flex flex-col items-center justify-center shadow-md group-hover:scale-105 group-hover:border-[var(--accent-color)]/50 transition-all duration-300 relative overflow-hidden">
                      {/* Page Fold Corner in top right */}
                      <div className="absolute top-0 right-0 w-4 h-4 bg-slate-200 dark:bg-slate-700 rounded-bl-md border-b border-l border-slate-300 dark:border-slate-600" />

                      <DocTypeIcon className="w-7 h-7 text-[var(--accent-color)] mb-1" />

                      {/* Document text skeleton lines */}
                      <div className="w-9 h-1 rounded-full bg-slate-300 dark:bg-slate-700 mb-1" />
                      <div className="w-6 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                    </div>
                  </div>

                  {/* Card Bottom: Title, Abstract & Quick Actions */}
                  <div className="space-y-3 w-full pl-2 mt-auto">
                    <div className="space-y-1">
                      <h4
                        className="text-sm font-heading font-black text-slate-900 dark:text-white group-hover:text-[var(--accent-color)] transition-colors line-clamp-2 leading-snug"
                        title={doc.title}
                      >
                        {doc.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {doc.description}
                      </p>
                    </div>

                    {/* Quick Action Pill Bar */}
                    <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                      {/* Primary Read Book Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenBook(doc);
                        }}
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[var(--accent-color)]/10 hover:bg-[var(--accent-color)] text-[var(--accent-color)] hover:text-slate-950 font-mono font-bold text-xs transition-all cursor-pointer shadow-2xs group/btn"
                        title="Read as Realistic 3D Hardcover Book"
                      >
                        <BookOpen className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                        <span>Read Book</span>
                      </button>

                      {/* Secondary Actions: PDF Modal & Direct Download */}
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onPreviewPdf(doc);
                          }}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Preview Document"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <a
                          href={doc.pdfUrl}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title={`Download .${(doc.fileExtension || 'PDF').toUpperCase()} File`}
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Glow Beam */}
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--accent-color)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
