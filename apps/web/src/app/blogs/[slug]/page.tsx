import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { BLOGS_DATA } from '../../../data/blogsData';
import { BlogReadingProgressBar } from '../../../components/BlogReadingProgressBar';
import { BlogTableOfContents, TocItem } from '../../../components/BlogTableOfContents';
import { BlogShareWidget } from '../../../components/BlogShareWidget';
import { BlogContentRenderer } from '../../../components/BlogContentRenderer';
import { BlogCard } from '../../../components/BlogCard';
import {
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return BLOGS_DATA.map((blog) => ({
    slug: blog.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = BLOGS_DATA.find((b) => b.slug === slug);
  if (!blog) {
    return {
      title: 'Article Not Found | Upgrader Boy',
    };
  }

  return {
    title: `${blog.title} | Upgrader Boy`,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      images: [{ url: blog.coverImage }],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const blog = BLOGS_DATA.find((b) => b.slug === slug);

  if (!blog) {
    notFound();
  }

  // Extract ToC items from content
  const tocItems: TocItem[] = [];
  const lines = blog.content.split('\n');
  lines.forEach((line) => {
    if (line.startsWith('### ')) {
      const text = line.slice(4).trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      tocItems.push({ id, text, level: 2 });
    } else if (line.startsWith('#### ')) {
      const text = line.slice(5).trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      tocItems.push({ id, text, level: 3 });
    }
  });

  // Find related blogs
  const relatedBlogs = BLOGS_DATA.filter((b) => b.id !== blog.id).slice(0, 2);

  const formattedDate = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recently Published';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-800 dark:text-slate-100 flex flex-col transition-colors">
      <BlogReadingProgressBar />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-20 w-full space-y-10 sm:space-y-12">
        
        {/* Breadcrumb Row */}
        <nav className="flex items-center space-x-2 text-xs font-mono text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-[var(--accent-color)] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/blogs" className="hover:text-[var(--accent-color)] transition-colors">
            Blogs
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-xs font-semibold">
            {blog.title}
          </span>
        </nav>

        {/* Article Hero Header */}
        <header className="max-w-4xl space-y-6">
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono">
            <span className="px-3 py-1 rounded-full bg-[var(--accent-color)] text-slate-950 font-bold shadow-xs">
              {blog.tags[0] || 'Technical Post'}
            </span>
            <span className="flex items-center space-x-1.5 text-slate-500 dark:text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formattedDate}</span>
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="flex items-center space-x-1.5 text-slate-500 dark:text-slate-400">
              <Clock className="w-3.5 h-3.5 text-[var(--accent-color)]" />
              <span>{blog.readingTimeMinutes} min read</span>
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-5xl font-heading font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            {blog.title}
          </h1>

          {/* Lead Excerpt */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            {blog.excerpt}
          </p>

          {/* Author Badge */}
          <div className="flex items-center space-x-3 pt-2">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-[var(--accent-color)] font-mono font-bold text-sm shadow-sm">
              &lt;UB&gt;
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-sm font-bold text-slate-900 dark:text-white">Ankit Bhuria</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent-color)]" />
              </div>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                Lead Architect & Agency Founder • Upgrader Boy
              </span>
            </div>
          </div>
        </header>

        {/* Featured Cover Image */}
        <div className="relative h-64 sm:h-96 lg:h-[440px] w-full rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl">
          <Image
            src={blog.coverImage}
            alt={blog.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
        </div>

        {/* Article Body + Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Main Content Column */}
          <article className="lg:col-span-8 space-y-10">
            {/* Structured Content */}
            <BlogContentRenderer content={blog.content} />

            {/* Tags Footer */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Related Topics & Tech Stack:
              </span>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blogs?topic=${encodeURIComponent(tag)}`}
                    className="text-xs font-mono px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] transition-colors shadow-2xs"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Author Profile & CTA Card */}
            <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-100 via-white to-slate-100 dark:from-slate-900 dark:via-[#131C31] dark:to-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--accent-color)] text-slate-950 font-mono font-black text-base flex items-center justify-center shadow-sm">
                    UB
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                      <span>Ankit Bhuria</span>
                      <CheckCircle2 className="w-4 h-4 text-[var(--accent-color)]" />
                    </h4>
                    <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                      Founder, Upgrader Boy • National SIH 2024 Winner
                    </p>
                  </div>
                </div>

                <Link
                  href="/contact"
                  className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-[var(--accent-color)] text-slate-950 font-bold text-xs glow-btn shrink-0"
                >
                  <span>Book Consultation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                We design and ship high-performance MERN & Next.js 15 platforms, IoT telematics architectures, and real-time distributed backends for ambitious startups and enterprises.
              </p>

              <div className="pt-2 flex flex-wrap gap-2 sm:hidden">
                <Link
                  href="/contact"
                  className="w-full inline-flex items-center justify-center space-x-1.5 py-2.5 rounded-xl bg-[var(--accent-color)] text-slate-950 font-bold text-xs glow-btn"
                >
                  <span>Book Architecture Consultation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </section>

            {/* Back to Blogs Link */}
            <div className="pt-4 flex items-center justify-between">
              <Link
                href="/blogs"
                className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-slate-600 dark:text-slate-400 hover:text-[var(--accent-color)] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to All Technical Logs</span>
              </Link>
            </div>
          </article>

          {/* Sticky Sidebar (Desktop) */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* Table of Contents */}
            {tocItems.length > 0 && <BlogTableOfContents items={tocItems} />}

            {/* Share Widget */}
            <BlogShareWidget title={blog.title} />

            {/* Agency Consulting Pill */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[var(--accent-color)]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>NEED ARCHITECTURE REVIEW?</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Have an ambitious web or mobile product? Schedule a direct 30-min discovery session with lead engineer Ankit Bhuria.
              </p>
              <Link
                href="/contact"
                className="block text-center py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[var(--accent-color)] hover:text-slate-950 font-semibold text-xs transition-colors border border-slate-200 dark:border-slate-700"
              >
                Schedule Session →
              </Link>
            </div>
          </aside>
        </div>

        {/* Related Articles Rail */}
        {relatedBlogs.length > 0 && (
          <section className="pt-16 border-t border-slate-200 dark:border-slate-800 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-heading font-bold text-slate-900 dark:text-white">
                  Continue Reading
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  More engineering deep-dives from the Upgrader Boy team
                </p>
              </div>

              <Link
                href="/blogs"
                className="text-xs font-mono font-bold text-[var(--accent-color)] hover:underline flex items-center space-x-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {relatedBlogs.map((b) => (
                <BlogCard key={b.id} blog={b} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
