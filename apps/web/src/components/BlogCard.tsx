import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowRight, BookOpen, CheckCircle2 } from 'lucide-react';
import type { Blog } from '@ub/types';

interface BlogCardProps {
  blog: Blog;
}

export function BlogCard({ blog }: BlogCardProps) {
  const formattedDate = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recently Published';

  return (
    <article className="group flex flex-col rounded-3xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 hover:border-[var(--accent-color)] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1">
      {/* Cover Image Container */}
      <Link href={`/blogs/${blog.slug}`} className="relative h-48 sm:h-52 w-full overflow-hidden block">
        <Image
          src={blog.coverImage}
          alt={blog.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

        {/* Reading Time Pill */}
        <div className="absolute top-3.5 right-3.5 flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 text-white text-[11px] font-mono font-medium">
          <Clock className="w-3 h-3 text-[var(--accent-color)]" />
          <span>{blog.readingTimeMinutes} min read</span>
        </div>

        {/* Primary Tag */}
        <div className="absolute bottom-3 left-3 flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[var(--accent-color)] text-slate-950 text-[11px] font-mono font-bold shadow-sm">
          <span>{blog.tags[0] || 'Engineering'}</span>
        </div>
      </Link>

      {/* Body Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Metadata Row */}
          <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formattedDate}</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1 text-[var(--accent-color)] font-semibold">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Deep Dive</span>
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg sm:text-xl font-heading font-bold text-slate-900 dark:text-white group-hover:text-[var(--accent-color)] transition-colors leading-snug line-clamp-2">
            <Link href={`/blogs/${blog.slug}`}>
              {blog.title}
            </Link>
          </h3>

          {/* Excerpt */}
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
            {blog.excerpt}
          </p>
        </div>

        {/* Tags Rail */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {blog.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60"
            >
              #{tag}
            </span>
          ))}
          {blog.tags.length > 3 && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 text-slate-400 self-center">
              +{blog.tags.length - 3}
            </span>
          )}
        </div>

        {/* Footer: Author & Read CTA */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-[var(--accent-color)] text-slate-950 font-mono font-bold text-[10px] flex items-center justify-center">
              UB
            </div>
            <div className="flex items-center space-x-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>Ankit Bhuria</span>
              <CheckCircle2 className="w-3 h-3 text-[var(--accent-color)]" />
            </div>
          </div>

          <Link
            href={`/blogs/${blog.slug}`}
            className="flex items-center space-x-1 text-xs font-bold text-[var(--accent-color)] group-hover:translate-x-1 transition-transform"
          >
            <span>Read</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
