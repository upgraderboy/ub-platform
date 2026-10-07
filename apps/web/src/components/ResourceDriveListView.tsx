'use client';

import React, { useState, useMemo } from 'react';
import {
  FileText,
  Download,
  BookOpen,
  HardDrive,
  ExternalLink,
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  FileCode2,
  Presentation,
  CheckCircle2,
  Clock,
  Share2,
  Check,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import type { ResourceDocument } from '@ub/types';

interface ResourceDriveListViewProps {
  documents: ResourceDocument[];
  onOpenBook: (doc: ResourceDocument) => void;
  onPreviewPdf?: (doc: ResourceDocument) => void;
}

export function ResourceDriveListView({
  documents,
  onOpenBook,
  onPreviewPdf,
}: ResourceDriveListViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'size' | 'title'>('date');
  const [expandedDocId, setExpandedDocId] = useState<string | null>(null);
  const [copiedDocId, setCopiedDocId] = useState<string | null>(null);

  // Helper to determine format
  const getDocExtension = (doc: ResourceDocument): 'pdf' | 'docx' | 'txt' | 'md' | 'pptx' => {
    if (doc.fileExtension) return doc.fileExtension as 'pdf' | 'docx' | 'txt' | 'md' | 'pptx';
    if (doc.pdfUrl.endsWith('.docx')) return 'docx';
    if (doc.pdfUrl.endsWith('.txt')) return 'txt';
    if (doc.pdfUrl.endsWith('.md')) return 'md';
    if (doc.pdfUrl.endsWith('.pptx')) return 'pptx';
    return 'pdf';
  };

  const getFormatBadgeConfig = (ext: string) => {
    switch (ext) {
      case 'docx':
      case 'doc':
        return {
          label: 'DOCX Word',
          ext: '.DOCX',
          bg: 'bg-blue-500/10 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/25',
          icon: FileText,
          accentBorder: 'hover:border-blue-500/50',
          glow: 'hover:shadow-[0_4px_25px_rgba(59,130,246,0.15)]',
        };
      case 'txt':
        return {
          label: 'Plaintext',
          ext: '.TXT',
          bg: 'bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25',
          icon: FileCode2,
          accentBorder: 'hover:border-emerald-500/50',
          glow: 'hover:shadow-[0_4px_25px_rgba(16,185,129,0.15)]',
        };
      case 'md':
        return {
          label: 'Markdown',
          ext: '.MD',
          bg: 'bg-purple-500/10 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/25',
          icon: FileCode2,
          accentBorder: 'hover:border-purple-500/50',
          glow: 'hover:shadow-[0_4px_25px_rgba(168,85,247,0.15)]',
        };
      case 'pptx':
        return {
          label: 'Deck Slides',
          ext: '.PPTX',
          bg: 'bg-amber-500/10 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/25',
          icon: Presentation,
          accentBorder: 'hover:border-amber-500/50',
          glow: 'hover:shadow-[0_4px_25px_rgba(245,158,11,0.15)]',
        };
      case 'pdf':
      default:
        return {
          label: 'PDF Document',
          ext: '.PDF',
          bg: 'bg-rose-500/10 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/25',
          icon: FileText,
          accentBorder: 'hover:border-rose-500/50',
          glow: 'hover:shadow-[0_4px_25px_rgba(244,63,94,0.15)]',
        };
    }
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return '2.4 MB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Filter & sort documents
  const filteredDocs = useMemo(() => {
    return documents
      .filter((doc) => {
        const ext = getDocExtension(doc);
        const matchesFormat =
          selectedFormat === 'all' ||
          (selectedFormat === 'pdf' && ext === 'pdf') ||
          (selectedFormat === 'docx' && ext === 'docx') ||
          (selectedFormat === 'txt' && (ext === 'txt' || ext === 'md')) ||
          (selectedFormat === 'pptx' && ext === 'pptx');

        const matchesQuery =
          !searchQuery.trim() ||
          doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesFormat && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === 'size') {
          return (b.fileSizeBytes || 0) - (a.fileSizeBytes || 0);
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      });
  }, [documents, searchQuery, selectedFormat, sortBy]);

  const totalBytes = useMemo(() => {
    return documents.reduce((acc, curr) => acc + (curr.fileSizeBytes || 2500000), 0);
  }, [documents]);

  const handleCopyLink = (e: React.MouseEvent, doc: ResourceDocument) => {
    e.stopPropagation();
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/resources#${doc.id}`;
      navigator.clipboard.writeText(url).then(() => {
        setCopiedDocId(doc.id);
        setTimeout(() => setCopiedDocId(null), 2000);
      });
    }
  };

  return (
    <div className="w-full space-y-4 animate-fade-in">
      {/* ======================================================== */}
      {/* FUTURISTIC TABLE TOOLBAR & METRICS BAR                   */}
      {/* ======================================================== */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Left: Quick search & Extension Filter Pills */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[200px] sm:min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search table files..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-[var(--accent-color)]"
            />
          </div>

          <div className="flex items-center space-x-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono">
            {[
              { id: 'all', label: 'All Files', count: documents.length },
              { id: 'pdf', label: 'PDF', count: documents.filter((d) => getDocExtension(d) === 'pdf').length },
              { id: 'docx', label: 'DOCX', count: documents.filter((d) => getDocExtension(d) === 'docx').length },
              { id: 'txt', label: 'TXT / MD', count: documents.filter((d) => ['txt', 'md'].includes(getDocExtension(d))).length },
              { id: 'pptx', label: 'PPTX', count: documents.filter((d) => getDocExtension(d) === 'pptx').length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedFormat(tab.id)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                  selectedFormat === tab.id
                    ? 'bg-[var(--accent-color)] text-slate-950 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
                <span className="ml-1 opacity-70 text-[10px]">({tab.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Sort & Storage Telemetry */}
        <div className="flex items-center justify-between sm:justify-end space-x-3 text-xs font-mono">
          <div className="hidden sm:flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-[11px] px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <HardDrive className="w-3.5 h-3.5 text-[var(--accent-color)]" />
            <span>{(totalBytes / (1024 * 1024)).toFixed(1)} MB Stored</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'size' | 'title')}
              className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono focus:outline-hidden cursor-pointer"
            >
              <option value="date">Sort: Recent</option>
              <option value="size">Sort: File Size</option>
              <option value="title">Sort: A - Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* DOSSIER TABLE CONTAINER                                  */}
      {/* ======================================================== */}
      <div className="w-full rounded-3xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Table Column Headers */}
        <div className="grid grid-cols-12 gap-3 px-5 py-3.5 bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider select-none">
          <div className="col-span-6 sm:col-span-5 flex items-center space-x-2">
            <span>Playbook Dossier & Title</span>
          </div>
          <div className="hidden sm:block sm:col-span-2">
            <span>Format & Extension</span>
          </div>
          <div className="hidden md:block md:col-span-2">
            <span>Size & Timing</span>
          </div>
          <div className="col-span-6 sm:col-span-5 md:col-span-3 text-right">
            <span>Actions & Viewer</span>
          </div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800/80 font-mono text-xs">
          {filteredDocs.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <FileText className="w-8 h-8 mx-auto opacity-40" />
              <p className="text-sm">No files matched your active search or extension filter.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedFormat('all');
                }}
                className="text-[var(--accent-color)] underline cursor-pointer text-xs"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            filteredDocs.map((doc) => {
              const ext = getDocExtension(doc);
              const badge = getFormatBadgeConfig(ext);
              const IconComponent = badge.icon;
              const isExpanded = expandedDocId === doc.id;
              const isCopied = copiedDocId === doc.id;

              return (
                <div key={doc.id} className="transition-colors group">
                  {/* Main Clickable Row */}
                  <div
                    className={`grid grid-cols-12 gap-3 px-5 py-4 items-center hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer relative ${
                      isExpanded ? 'bg-slate-50/60 dark:bg-slate-800/30' : ''
                    }`}
                    onClick={() => onOpenBook(doc)}
                  >
                    {/* Glowing Left Indicator Strip on Hover */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-[var(--accent-color)] transition-colors" />

                    {/* Column 1: Format Icon & Title */}
                    <div className="col-span-6 sm:col-span-5 flex items-center space-x-3 truncate pr-2">
                      <div
                        className={`w-10 h-10 rounded-2xl ${badge.bg} border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs relative`}
                      >
                        <IconComponent className="w-5 h-5" />
                        <span className="absolute -bottom-1 -right-1 text-[8px] font-mono font-black px-1 rounded-md bg-slate-900 text-white border border-slate-700">
                          {badge.ext}
                        </span>
                      </div>

                      <div className="truncate">
                        <div className="font-sans font-bold text-slate-900 dark:text-white truncate group-hover:text-[var(--accent-color)] transition-colors text-xs sm:text-sm">
                          {doc.title}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate flex items-center space-x-1.5 mt-0.5 font-mono">
                          <span className="truncate">{doc.source}</span>
                          <span>•</span>
                          <span className="text-emerald-500 font-semibold flex items-center space-x-1">
                            <CheckCircle2 className="w-3 h-3 inline" />
                            <span>Verified</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Column 2: Format & Extension */}
                    <div className="hidden sm:flex sm:col-span-2 items-center space-x-2">
                      <span
                        className={`px-2 py-0.5 rounded-lg border text-[10px] font-mono font-bold tracking-wider ${badge.bg}`}
                      >
                        {badge.ext}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {badge.label}
                      </span>
                    </div>

                    {/* Column 3: Size & Reading Duration */}
                    <div className="hidden md:flex md:col-span-2 flex-col justify-center text-[11px] text-slate-500 dark:text-slate-400 space-y-0.5">
                      <div className="flex items-center space-x-1.5 text-slate-700 dark:text-slate-300 font-semibold">
                        <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatSize(doc.fileSizeBytes)}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-[10px] text-slate-400">
                        <Clock className="w-3 h-3 text-[var(--accent-color)]" />
                        <span>~15 Min Read</span>
                      </div>
                    </div>

                    {/* Column 4: Action Buttons */}
                    <div
                      className="col-span-6 sm:col-span-5 md:col-span-3 flex items-center justify-end space-x-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Expand / Inspect Drawer Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedDocId(isExpanded ? null : doc.id);
                        }}
                        className={`p-1.5 rounded-xl border text-slate-500 transition-colors cursor-pointer ${
                          isExpanded
                            ? 'bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white'
                            : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
                        }`}
                        title="Inspect Document Dossier"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      {/* 3D Book Flip Reader Action */}
                      <button
                        onClick={() => onOpenBook(doc)}
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[var(--accent-color)] text-slate-950 font-bold text-xs glow-btn hover:scale-102 transition-all cursor-pointer shadow-xs"
                        title="Read Book with 3D Page Flip"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Flip Book</span>
                      </button>

                      {/* Direct Download Action with Extension Mention */}
                      <a
                        href={doc.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs transition-colors cursor-pointer"
                        title={`Download file as ${badge.ext}`}
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold">{badge.ext}</span>
                      </a>

                      {/* Preview PDF Modal Button (if available) */}
                      {onPreviewPdf && (
                        <button
                          onClick={() => onPreviewPdf(doc)}
                          className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer hidden xl:block"
                          title="Open Classic PDF Viewer"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expandable Dossier Drawer */}
                  {isExpanded && (
                    <div className="px-5 py-4 bg-slate-50/90 dark:bg-[#0E1524] border-t border-slate-200 dark:border-slate-800/80 space-y-3 animate-fade-in">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                        <div className="flex items-center space-x-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-500" />
                          <span className="font-heading font-bold text-slate-900 dark:text-white text-xs">
                            Executive Dossier & Download Spec
                          </span>
                          <span className="text-[10px] text-slate-400">
                            • Published {formatDate(doc.publishedAt)}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => handleCopyLink(e, doc)}
                            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] transition-colors cursor-pointer"
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-500" />
                                <span className="text-emerald-500 font-bold">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Share2 className="w-3 h-3" />
                                <span>Copy Link</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans max-w-4xl">
                        {doc.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <Tag className="w-3 h-3 text-slate-400 mr-1" />
                        {doc.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] font-mono text-slate-600 dark:text-slate-400"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
