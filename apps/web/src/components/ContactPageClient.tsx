'use client';

import React, { useState, useSyncExternalStore, useRef } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Paperclip,
  X,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  ArrowUpRight,
  Loader2,
} from 'lucide-react';
import {
  WhatsAppIcon,
  GithubIcon,
  LinkedinIcon,
  YoutubeIcon,
  TwitterXIcon,
  InstagramIcon,
  FacebookIcon,
} from './SocialIcons';

/* ─── Auth state (same pattern as Navbar) ─── */
interface SessionUser {
  email?: string;
  username?: string;
  fullName?: string;
  phone?: string;
}

function subscribeAuth(callback: () => void) {
  window.addEventListener('auth-state-changed', callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener('auth-state-changed', callback);
    window.removeEventListener('storage', callback);
  };
}

let cachedRaw: string | null = null;
let cachedUser: SessionUser | null = null;

function getUserSnapshot(): SessionUser | null {
  try {
    const raw = localStorage.getItem('ub_user_session');
    if (raw === cachedRaw) return cachedUser;
    cachedRaw = raw;
    cachedUser = raw ? JSON.parse(raw) : null;
    return cachedUser;
  } catch {
    return null;
  }
}

function getServerUserSnapshot(): SessionUser | null {
  return null;
}

/* ─── Social Handles Config ─── */
const SOCIAL_HANDLES = [
  {
    name: 'Instagram',
    handle: '@upgraderboy',
    url: 'https://instagram.com/upgraderboy',
    Icon: InstagramIcon,
    hoverBg: 'hover:bg-gradient-to-br hover:from-purple-600 hover:via-pink-500 hover:to-orange-400',
    hoverBorder: 'hover:border-pink-500/50',
    hoverText: 'group-hover:text-white',
    color: 'text-pink-400',
  },
  {
    name: 'LinkedIn',
    handle: 'in/upgraderboy',
    url: 'https://linkedin.com/in/upgraderboy/',
    Icon: LinkedinIcon,
    hoverBg: 'hover:bg-[#0A66C2]',
    hoverBorder: 'hover:border-[#0A66C2]/50',
    hoverText: 'group-hover:text-white',
    color: 'text-[#0A66C2]',
  },
  {
    name: 'GitHub',
    handle: 'upgraderboy',
    url: 'https://github.com/upgraderboy',
    Icon: GithubIcon,
    hoverBg: 'hover:bg-slate-700 dark:hover:bg-slate-200',
    hoverBorder: 'hover:border-slate-500/50',
    hoverText: 'group-hover:text-white dark:group-hover:text-slate-900',
    color: 'text-slate-600 dark:text-slate-300',
  },
  {
    name: 'YouTube',
    handle: '@upgraderboy',
    url: 'https://youtube.com/@upgraderboy',
    Icon: YoutubeIcon,
    hoverBg: 'hover:bg-[#FF0000]',
    hoverBorder: 'hover:border-[#FF0000]/50',
    hoverText: 'group-hover:text-white',
    color: 'text-[#FF0000]',
  },
  {
    name: 'Twitter / X',
    handle: '@upgraderboy',
    url: 'https://x.com/upgraderboy',
    Icon: TwitterXIcon,
    hoverBg: 'hover:bg-slate-800 dark:hover:bg-white',
    hoverBorder: 'hover:border-slate-600/50',
    hoverText: 'group-hover:text-white dark:group-hover:text-black',
    color: 'text-slate-800 dark:text-slate-200',
  },
  {
    name: 'Facebook',
    handle: 'upgraderboy',
    url: 'https://facebook.com/upgraderboy',
    Icon: FacebookIcon,
    hoverBg: 'hover:bg-[#1877F2]',
    hoverBorder: 'hover:border-[#1877F2]/50',
    hoverText: 'group-hover:text-white',
    color: 'text-[#1877F2]',
  },
  {
    name: 'WhatsApp',
    handle: '+91 88903 09622',
    url: 'https://wa.me/918890309622',
    Icon: WhatsAppIcon,
    hoverBg: 'hover:bg-[#25D366]',
    hoverBorder: 'hover:border-[#25D366]/50',
    hoverText: 'group-hover:text-white',
    color: 'text-[#25D366]',
  },
];

/* ─── FAQ Data ─── */
const FAQ_ITEMS = [
  {
    q: 'How quickly will I get a response?',
    a: 'Upgrader Boy personally reviews every inquiry and responds within 4 hours during IST business hours (08:00–20:00). Urgent requests via WhatsApp are typically answered faster.',
  },
  {
    q: 'Can we sign an NDA before discussing my project?',
    a: 'Absolutely. We provide a mutual non-disclosure agreement upfront to protect your ideas, business logic, and intellectual property before any in-depth discussions.',
  },
  {
    q: 'What kind of projects do you take on?',
    a: 'Full-stack web apps (Next.js, React), cross-platform mobile apps (React Native), AI/ML integrations, cloud architecture consulting, and end-to-end product engineering.',
  },
  {
    q: 'Do you offer post-launch support?',
    a: 'Every project includes a 30-day post-launch warranty with complimentary bug fixes, performance monitoring, and comprehensive developer handover documentation.',
  },
];

/* ─── Main Component ─── */
export function ContactPageClient() {
  const user = useSyncExternalStore(subscribeAuth, getUserSnapshot, getServerUserSnapshot);

  /* Form state */
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [prefilled, setPrefilled] = useState(false);

  /* Pre-fill from auth session (once) */
  if (user && !prefilled) {
    if (user.fullName && !name) setName(user.fullName);
    if (user.email && !email) setEmail(user.email);
    if (user.phone && !phone) setPhone(user.phone);
    setPrefilled(true);
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.size > 10 * 1024 * 1024) {
        setSubmitStatus('error');
        setStatusMessage('File size must be under 10 MB.');
        return;
      }
      setFile(selected);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone: phone || undefined,
          subject,
          message,
          fileName: file?.name,
          fileSize: file?.size,
        }),
      });

      const data: { success: boolean; message?: string; error?: string } = await res.json();

      if (data.success) {
        setSubmitStatus('success');
        setStatusMessage(data.message ?? 'Message sent successfully!');
        setName('');
        setEmail('');
        setPhone('');
        setSubject('');
        setMessage('');
        setFile(null);
        setPrefilled(false);
      } else {
        setSubmitStatus('error');
        setStatusMessage(data.error ?? 'Something went wrong.');
      }
    } catch {
      setSubmitStatus('error');
      setStatusMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-20">
      {/* ════════════════════════════════════════════════════════ */}
      {/* HERO                                                    */}
      {/* ════════════════════════════════════════════════════════ */}
      <section className="text-center max-w-2xl mx-auto space-y-5">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[var(--accent-glow)] border border-[var(--accent-border)] text-xs font-mono font-bold text-[var(--accent-color)]">
          <Mail className="w-3.5 h-3.5" />
          <span>LET&apos;S CONNECT</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-heading font-black tracking-tight text-slate-900 dark:text-white leading-tight">
          Got a Project Idea?{' '}
          <span className="bg-gradient-to-r from-[var(--accent-color)] to-purple-400 bg-clip-text text-transparent">
            Let&apos;s Talk.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl mx-auto">
          Whether it&apos;s a startup MVP, a full-stack rebuild, or a quick consultation — reach out and I&apos;ll get back to you within 4 hours.
        </p>
      </section>

      {/* ════════════════════════════════════════════════════════ */}
      {/* SOCIAL HANDLES GRID                                     */}
      {/* ════════════════════════════════════════════════════════ */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-slate-900 dark:text-white">
            Find Me Everywhere
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Connect on your preferred platform
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {SOCIAL_HANDLES.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative flex flex-col items-center justify-center p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 transition-all duration-300 ${social.hoverBg} ${social.hoverBorder} hover:scale-[1.03] hover:shadow-xl`}
            >
              <social.Icon
                className={`w-7 h-7 sm:w-8 sm:h-8 mb-3 transition-colors duration-300 ${social.color} ${social.hoverText}`}
              />
              <span className={`font-heading font-bold text-sm text-slate-800 dark:text-white transition-colors duration-300 ${social.hoverText}`}>
                {social.name}
              </span>
              <span className={`text-xs text-slate-500 dark:text-slate-400 mt-0.5 transition-colors duration-300 ${social.hoverText} opacity-80`}>
                {social.handle}
              </span>
              <ArrowUpRight
                className={`absolute top-3 right-3 w-4 h-4 text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-all duration-300 ${social.hoverText}`}
              />
            </a>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════ */}
      {/* CONTACT FORM + INFO CARDS GRID                          */}
      {/* ════════════════════════════════════════════════════════ */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* ── Contact Form (spans 3 cols) ── */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8">
            <div className="flex items-center space-x-2 mb-6">
              <Send className="w-5 h-5 text-[var(--accent-color)]" />
              <h2 className="text-xl font-heading font-bold text-slate-900 dark:text-white">
                Send a Message
              </h2>
            </div>

            {user && (
              <div className="mb-5 flex items-center space-x-2 px-3 py-2 rounded-xl bg-[var(--accent-glow)] border border-[var(--accent-border)] text-xs text-[var(--accent-color)]">
                <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Signed in as <strong>{user.fullName ?? user.email}</strong> — details pre-filled</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name + Email row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    minLength={2}
                    placeholder="Your name"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/40 focus:border-[var(--accent-color)] transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                    Email <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/40 focus:border-[var(--accent-color)] transition-all"
                  />
                </div>
              </div>

              {/* Phone + Subject row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-phone" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                    Phone <span className="text-slate-400">(optional)</span>
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/40 focus:border-[var(--accent-color)] transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="contact-subject" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                    Subject <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    minLength={3}
                    placeholder="What's this about?"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/40 focus:border-[var(--accent-color)] transition-all"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="contact-message" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                  Message <span className="text-rose-400">*</span>
                </label>
                <textarea
                  id="contact-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  minLength={10}
                  rows={5}
                  placeholder="Tell me about your project, idea, or question..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/40 focus:border-[var(--accent-color)] transition-all resize-none"
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                  Attachment <span className="text-slate-400">(optional, max 10 MB)</span>
                </label>
                {file ? (
                  <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center space-x-2 text-sm">
                      <Paperclip className="w-4 h-4 text-[var(--accent-color)]" />
                      <span className="text-slate-700 dark:text-slate-200 truncate max-w-[200px]">{file.name}</span>
                      <span className="text-xs text-slate-400">({formatFileSize(file.size)})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-rose-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400 hover:border-[var(--accent-color)]/50 hover:text-[var(--accent-color)] transition-all"
                  >
                    <Paperclip className="w-4 h-4" />
                    <span>Click to attach a file</span>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.zip,.txt"
                />
              </div>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-sm text-emerald-400">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{statusMessage}</span>
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-sm text-rose-400">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{statusMessage}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-[var(--accent-color)] text-slate-900 font-heading font-bold text-sm hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[var(--accent-glow)]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* ── Info Cards Sidebar (spans 2 cols) ── */}
        <div className="lg:col-span-2 space-y-4">
          {/* HQ Card */}
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 hover:border-[var(--accent-color)]/40 transition-all">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[var(--accent-color)]">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-white">Headquarters</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Near Toll Tax, Sikar Road, Jhunjhunu, Rajasthan 333001
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 font-mono">08:00 – 20:00 IST</span>
              <a
                href="https://maps.google.com/?q=Jhunjhunu,+Rajasthan"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent-color)] font-bold hover:underline flex items-center space-x-1"
              >
                <span>View Map</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Phone & WhatsApp Card */}
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 hover:border-emerald-500/40 transition-all">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-white">Direct Line</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">+91 88903 09622</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 font-mono">Replies &lt; 4h</span>
              <a
                href="https://wa.me/918890309622"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 font-bold hover:underline flex items-center space-x-1"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" />
                <span>Chat Now</span>
              </a>
            </div>
          </div>

          {/* Email Card */}
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 hover:border-sky-500/40 transition-all">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-white">Email</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">upgraderboy@gmail.com</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 font-mono">For proposals &amp; docs</span>
              <a
                href="mailto:upgraderboy@gmail.com"
                className="text-sky-400 font-bold hover:underline flex items-center space-x-1"
              >
                <Mail className="w-3 h-3" />
                <span>Send Email</span>
              </a>
            </div>
          </div>

          {/* SLA Trust Badges */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center space-x-2 px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs">
              <Clock className="w-4 h-4 text-[var(--accent-color)] shrink-0" />
              <span className="text-slate-600 dark:text-slate-300 font-medium">&le; 4h Response</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-slate-600 dark:text-slate-300 font-medium">NDA Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════ */}
      {/* FAQ                                                     */}
      {/* ════════════════════════════════════════════════════════ */}
      <section className="bg-slate-100 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 space-y-8">
        <div className="text-center max-w-lg mx-auto space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300">
            <HelpCircle className="w-3.5 h-3.5 text-[var(--accent-color)]" />
            <span>FAQ</span>
          </div>
          <h2 className="text-2xl font-heading font-bold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {FAQ_ITEMS.map((item) => (
            <div
              key={item.q}
              className="p-5 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2"
            >
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-[var(--accent-color)] shrink-0 mt-0.5" />
                <span>{item.q}</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-6">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

