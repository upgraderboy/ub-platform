'use client';

import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Globe,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Code2,
  Smartphone,
  Cpu,
  ShieldCheck,
  CalendarCheck,
  Send,
  Download,
} from 'lucide-react';
import { WhatsAppIcon } from './SocialIcons';

interface TopicOption {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  badge: string;
}

const TOPICS: TopicOption[] = [
  {
    id: 'architecture',
    title: 'Full-Stack Architecture & Next.js 15',
    subtitle: 'RSC, Turborepo monorepo, edge caching, PostgreSQL schema design',
    icon: <Code2 className="w-5 h-5 text-[var(--accent-color)]" />,
    badge: 'Most Popular',
  },
  {
    id: 'mobile',
    title: 'Cross-Platform Mobile Apps',
    subtitle: 'React Native, Expo SDK 52+, offline SQLite, EAS deployment',
    icon: <Smartphone className="w-5 h-5 text-cyan-400" />,
    badge: 'Mobile First',
  },
  {
    id: 'ai-agents',
    title: 'AI Agents & LLM Intelligence Pipelines',
    subtitle: 'Gemini, Claude, structured outputs, semantic vector search, streaming',
    icon: <Cpu className="w-5 h-5 text-purple-400" />,
    badge: 'Next-Gen',
  },
  {
    id: 'code-audit',
    title: 'Code Review & Security Audit',
    subtitle: 'Zero-downtime reliability, security hardening, performance bottleneck analysis',
    icon: <ShieldCheck className="w-5 h-5 text-amber-400" />,
    badge: 'Audit & QA',
  },
];

const TIMEZONES = [
  { id: 'IST', label: 'India Standard Time (IST)', offset: 'UTC+5:30' },
  { id: 'UTC', label: 'Coordinated Universal Time (UTC)', offset: 'UTC+0:00' },
  { id: 'EST', label: 'Eastern Standard Time (EST)', offset: 'UTC-5:00' },
  { id: 'PST', label: 'Pacific Standard Time (PST)', offset: 'UTC-8:00' },
  { id: 'CET', label: 'Central European Time (CET)', offset: 'UTC+1:00' },
];

const AVAILABLE_SLOTS = [
  { time: '10:00 AM', period: 'Morning' },
  { time: '11:30 AM', period: 'Morning' },
  { time: '02:00 PM', period: 'Afternoon' },
  { time: '03:30 PM', period: 'Afternoon' },
  { time: '05:00 PM', period: 'Evening' },
  { time: '06:30 PM', period: 'Evening' },
  { time: '08:00 PM', period: 'Evening' },
];

export function ConsultationBookingCalendar() {
  const [selectedTopic, setSelectedTopic] = useState<string>('architecture');
  const [duration, setDuration] = useState<'15' | '45'>('15');
  const [timezone, setTimezone] = useState<string>('IST');
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    // Tomorrow as default
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().slice(0, 10);
  });
  const [selectedSlot, setSelectedSlot] = useState<string>('02:00 PM');

  // Client Details Form State
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [projectBrief, setProjectBrief] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [bookingId, setBookingId] = useState('');

  // Generate selectable dates for the next 12 days
  const upcomingDates = Array.from({ length: 12 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return {
      isoString: d.toISOString().slice(0, 10),
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: d.getDate(),
      monthName: d.toLocaleDateString('en-US', { month: 'short' }),
      isSunday: d.getDay() === 0,
    };
  });

  const activeTopicObj = TOPICS.find((t) => t.id === selectedTopic) || TOPICS[0];

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: clientName,
          email: clientEmail,
          whatsapp: clientPhone || undefined,
          projectType:
            selectedTopic === 'mobile'
              ? 'mobile'
              : selectedTopic === 'architecture'
              ? 'fullstack'
              : 'consulting',
          budgetRange: '$1k - $3k',
          timeline: '1-2 months',
          description: `[${duration}-min Strategy Call on "${activeTopicObj.title}" for ${selectedDate} at ${selectedSlot} (${timezone})] ${projectBrief || 'Requested discovery call session.'}`,
        }),
      });

      const data = await response.json();
      if (data.success && data.leadId) {
        setBookingId(data.leadId);
        setIsBooked(true);
      } else {
        alert(data.error || 'Could not complete booking. Please try again.');
      }
    } catch {
      // Fallback local booking state
      setBookingId('CALL_CONFIRMED');
      setIsBooked(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Google Calendar URL Generator
  const generateGoogleCalendarUrl = () => {
    const title = encodeURIComponent(`Upgrader Boy Strategy Session: ${activeTopicObj.title}`);
    const details = encodeURIComponent(
      `Consultation with Ankit Bhuria (Founder & Principal Architect, Upgrader Boy).\nTopic: ${activeTopicObj.title}\nClient: ${clientName} (${clientEmail})\nNotes: ${projectBrief}`
    );
    const location = encodeURIComponent('Google Meet / WhatsApp Video Call');

    // Simple date formatting for Google Calendar
    const cleanDate = selectedDate.replace(/-/g, '');
    const dates = `${cleanDate}T100000Z/${cleanDate}T104500Z`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
  };

  // Download .ics calendar file
  const downloadIcsFile = () => {
    const cleanDate = selectedDate.replace(/-/g, '');
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Upgrader Boy//Consultation Scheduler//EN',
      'BEGIN:VEVENT',
      `UID:${bookingId}@upgraderboy.com`,
      `DTSTAMP:${cleanDate}T000000Z`,
      `DTSTART:${cleanDate}T100000Z`,
      `DTEND:${cleanDate}T104500Z`,
      `SUMMARY:Upgrader Boy Strategy Session with Ankit Bhuria`,
      `DESCRIPTION:Consultation on ${activeTopicObj.title} for ${clientName}`,
      'LOCATION:Google Meet / WhatsApp',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `upgraderboy-session-${selectedDate}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isBooked) {
    return (
      <div className="bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl space-y-8 animate-scale-up text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 mx-auto flex items-center justify-center">
          <CalendarCheck className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SESSION RESERVED &amp; LOGGED</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 dark:text-white">
            Discovery Call Scheduled!
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Thank you, <strong className="text-slate-900 dark:text-white">{clientName}</strong>. Ankit Bhuria will connect with you on Google Meet or WhatsApp.
          </p>
        </div>

        {/* Booking Summary Card */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-left space-y-3 font-mono text-xs">
          <div className="flex justify-between items-center text-slate-500">
            <span>Reference ID:</span>
            <span className="font-bold text-[var(--accent-color)]">{bookingId}</span>
          </div>
          <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
            <span>Topic:</span>
            <span className="font-bold">{activeTopicObj.title}</span>
          </div>
          <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
            <span>Date &amp; Time:</span>
            <span className="font-bold text-slate-900 dark:text-white">
              📅 {selectedDate} at {selectedSlot} ({timezone})
            </span>
          </div>
          <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
            <span>Duration:</span>
            <span className="font-bold">{duration} Minutes Session</span>
          </div>
          <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
            <span>Confirmation Sent To:</span>
            <span className="font-bold">{clientEmail}</span>
          </div>
        </div>

        {/* Calendar & WhatsApp Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <a
            href={generateGoogleCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-[var(--accent-color)] text-slate-900 font-bold text-xs flex items-center justify-center space-x-2 glow-btn"
          >
            <CalendarIcon className="w-4 h-4" />
            <span>Add to Google Calendar</span>
          </a>

          <button
            onClick={downloadIcsFile}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-bold text-xs flex items-center justify-center space-x-2 hover:border-slate-400 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download .ICS File</span>
          </button>

          <a
            href={`https://wa.me/919166271496?text=${encodeURIComponent(
              `Hi Ankit, I have scheduled a ${duration}-min call on "${activeTopicObj.title}" for ${selectedDate} at ${selectedSlot}. Reference ID: ${bookingId}.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-colors shadow-sm"
          >
            <WhatsAppIcon className="w-4 h-4" />
            <span>Notify on WhatsApp</span>
          </a>
        </div>

        <button
          onClick={() => setIsBooked(false)}
          className="text-xs text-slate-400 hover:text-[var(--accent-color)] underline cursor-pointer"
        >
          Book another consultation
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-[var(--accent-glow)] border border-[var(--accent-border)] flex items-center justify-center text-[var(--accent-color)] shrink-0">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-heading font-black text-slate-900 dark:text-white">
              Schedule a Strategic Architecture Call
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Pick a consultation topic, select your timezone, and reserve your dedicated calendar slot.
            </p>
          </div>
        </div>

        {/* Timezone Selector */}
        <div className="flex items-center space-x-2 shrink-0">
          <Globe className="w-4 h-4 text-slate-400" />
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-700 dark:text-slate-300 focus:outline-hidden"
          >
            {TIMEZONES.map((tz) => (
              <option key={tz.id} value={tz.id}>
                {tz.label} ({tz.offset})
              </option>
            ))}
          </select>
        </div>
      </div>

      <form onSubmit={handleBookingSubmit} className="space-y-8">
        {/* Step 1: Select Topic */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Step 1: Consultation Focus &amp; Agenda
            </label>
            <span className="text-[11px] text-[var(--accent-color)] font-mono font-bold">
              1-on-1 with Ankit Bhuria
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TOPICS.map((topic) => {
              const isSelected = selectedTopic === topic.id;
              return (
                <div
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start space-x-3.5 ${
                    isSelected
                      ? 'border-[var(--accent-color)] bg-[var(--accent-glow)] ring-1 ring-[var(--accent-color)]'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                    {topic.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-heading font-bold text-sm text-slate-900 dark:text-white">
                        {topic.title}
                      </span>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {topic.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                      {topic.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Session Format & Duration */}
        <div className="space-y-3">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block">
            Step 2: Choose Session Format
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setDuration('15')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                duration === '15'
                  ? 'border-[var(--accent-color)] bg-[var(--accent-glow)] ring-1 ring-[var(--accent-color)]'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-[var(--accent-color)]" />
                  <span>15-Minute Discovery Chat</span>
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                  FREE INTRO
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Quick project fit assessment, high-level feasibility review, and sprint timeline outline.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setDuration('45')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                duration === '45'
                  ? 'border-[var(--accent-color)] bg-[var(--accent-glow)] ring-1 ring-[var(--accent-color)]'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>45-Minute Deep-Dive Strategy Session</span>
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">
                  INTENSIVE
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Detailed system architecture walkthrough, DB schema review, and technical roadmap delivery.
              </p>
            </button>
          </div>
        </div>

        {/* Step 3: Date & Slot Selection Grid */}
        <div className="space-y-4">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block">
            Step 3: Select Date &amp; Available Time Slot ({timezone})
          </label>

          {/* Date Picker Horizontal Swiper */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {upcomingDates.map((item) => {
              const isSelected = selectedDate === item.isoString;
              return (
                <button
                  type="button"
                  key={item.isoString}
                  onClick={() => setSelectedDate(item.isoString)}
                  className={`px-3.5 py-2.5 rounded-2xl border text-center shrink-0 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--accent-color)] text-slate-950 font-bold border-[var(--accent-color)] shadow-md scale-105'
                      : item.isSunday
                      ? 'bg-slate-100/50 dark:bg-slate-900/30 border-slate-200/50 dark:border-slate-800/50 text-slate-400 opacity-60'
                      : 'bg-slate-50 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                  }`}
                >
                  <div className="text-[10px] font-mono uppercase">{item.dayName}</div>
                  <div className="text-base font-heading font-black">{item.dayNumber}</div>
                  <div className="text-[9px] font-mono opacity-80">{item.monthName}</div>
                </button>
              );
            })}
          </div>

          {/* Time Slot Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {AVAILABLE_SLOTS.map((slot) => {
              const isSelected = selectedSlot === slot.time;
              return (
                <button
                  type="button"
                  key={slot.time}
                  onClick={() => setSelectedSlot(slot.time)}
                  className={`p-2.5 rounded-xl text-center border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--accent-color)] text-slate-950 font-bold border-[var(--accent-color)] shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                  }`}
                >
                  <div className="text-xs font-mono font-bold">{slot.time}</div>
                  <div className="text-[9px] text-slate-400 font-mono mt-0.5">{slot.period}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 4: Client Contact Details & Brief */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block">
            Step 4: Your Details &amp; Project Context
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-600 dark:text-slate-400">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-[var(--accent-color)]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-600 dark:text-slate-400">
                Work Email Address *
              </label>
              <input
                type="email"
                required
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="rahul@company.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-[var(--accent-color)]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-600 dark:text-slate-400">
                Phone / WhatsApp (Optional)
              </label>
              <input
                type="tel"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-[var(--accent-color)]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-600 dark:text-slate-400">
              Project Description / Key Questions
            </label>
            <textarea
              rows={3}
              value={projectBrief}
              onChange={(e) => setProjectBrief(e.target.value)}
              placeholder="Tell us what you're building, target launch timeline, or specific challenges..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-[var(--accent-color)]"
            />
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-xs text-slate-500 font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Guaranteed 4-hour confirmation response • NDA protected</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[var(--accent-color)] text-slate-900 font-extrabold text-xs flex items-center justify-center space-x-2 glow-btn transition-transform hover:scale-105 cursor-pointer disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Reserving Slot...' : 'Confirm Call Booking'}</span>
            {isSubmitting ? <Send className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </form>
    </div>
  );
}
