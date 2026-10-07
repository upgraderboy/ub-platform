'use client';

import React, { useEffect } from 'react';
import { X, Download, ExternalLink, FileText, CheckCircle2, Calendar } from 'lucide-react';
import type { ResourceDocument } from '@ub/types';

interface ResourcePdfModalProps {
  resourceDoc: ResourceDocument | null;
  onClose: () => void;
}

export function ResourcePdfModal({ resourceDoc, onClose }: ResourcePdfModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }

    if (resourceDoc && typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown);
      window.document.body.style.overflow = 'hidden';
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('keydown', handleKeyDown);
        window.document.body.style.overflow = 'auto';
      }
    };
  }, [resourceDoc, onClose]);

  if (!resourceDoc) return null;

  const formattedSize = resourceDoc.fileSizeBytes
    ? (resourceDoc.fileSizeBytes / (1024 * 1024)).toFixed(1) + ' MB'
    : 'Standard PDF';

  const formattedDate = new Date(resourceDoc.publishedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl h-[90vh] flex flex-col bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md">
          <div className="flex items-center space-x-3 truncate pr-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent-color)] text-slate-950 flex items-center justify-center shrink-0 shadow-sm">
              <FileText className="w-5 h-5" />
            </div>
            <div className="truncate">
              <h3 className="font-heading font-black text-sm sm:text-base text-slate-900 dark:text-white truncate">
                {resourceDoc.title}
              </h3>
              <div className="flex items-center space-x-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                <span>{formattedSize}</span>
                <span>•</span>
                <span>{resourceDoc.source}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {/* Open in new tab */}
            <a
              href={resourceDoc.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              title="Open External"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            {/* Direct Download */}
            <a
              href={resourceDoc.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[var(--accent-color)] text-slate-950 text-xs font-bold glow-btn transition-colors cursor-pointer shadow-xs"
              title="Download Document"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </a>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              title="Close Modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body: Embedded PDF Document Preview */}
        <div className="flex-1 w-full bg-slate-100 dark:bg-slate-950 relative overflow-hidden">
          <iframe
            src={`${resourceDoc.pdfUrl}#toolbar=0&navpanes=0`}
            className="w-full h-full border-none"
            title={resourceDoc.title}
          />
        </div>

        {/* Modal Footer Info Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131C31] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-[var(--accent-color)]" />
              <span>Published {formattedDate}</span>
            </span>
            <span className="flex items-center space-x-1 text-emerald-500 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verified Authentic</span>
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {resourceDoc.tags.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px]"
              >
                #{t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
