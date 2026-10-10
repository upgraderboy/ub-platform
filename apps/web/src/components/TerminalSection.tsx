'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Clock, Code2, ArrowRight, Sparkles, Layers, Zap } from 'lucide-react';
import { useExperienceMode } from '@/hooks/useExperienceMode';

interface TerminalLine {
  id: string;
  type: 'system' | 'user' | 'output' | 'error';
  content: string;
}

export function TerminalSection() {
  const { mode, setExperienceMode } = useExperienceMode();
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<TerminalLine[]>([
    { id: '1', type: 'system', content: 'Welcome to Upgrader Boy Interactive Terminal v2.0.4' },
    { id: '2', type: 'output', content: 'Type help to view available system commands.' },
  ]);

  const screenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (screenRef.current) {
      screenRef.current.scrollTop = screenRef.current.scrollHeight;
    }
  }, [history]);

  if (mode === 'client') {
    return (
      <section id="process" className="py-24 bg-slate-100/50 dark:bg-[#0e1630]/60 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-[var(--accent-color)] font-mono text-xs font-bold uppercase tracking-widest bg-[var(--accent-color)]/10 px-3 py-1 rounded-full border border-[var(--accent-color)]/20">
              ⚡ How We Build &amp; Ship
            </span>
            <h2 className="text-3xl sm:text-5xl font-heading font-extrabold tracking-tight text-slate-900 dark:text-white">
              The Agency Engineering Process
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
              Clear timelines, zero surprises, and weekly deliverables from kickoff to production deployment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Discovery & Blueprint',
                time: 'Week 1',
                desc: 'Deep-dive product scope, architecture selection, and interactive Figma wireframes.',
                icon: Layers,
              },
              {
                step: '02',
                title: 'Rapid Development',
                time: 'Weeks 2-3',
                desc: 'Clean TypeScript implementation with Next.js 15, mobile sync, and live staging previews.',
                icon: Zap,
              },
              {
                step: '03',
                title: 'Security & QA Audit',
                time: 'Week 4',
                desc: 'Zero-vulnerability checks, 100/100 Core Web Vitals, and responsive cross-device testing.',
                icon: ShieldCheck,
              },
              {
                step: '04',
                title: 'Edge Deployment',
                time: 'Launch & Beyond',
                desc: 'Global CDN rollout, full code ownership transfer, and 30-day post-launch warranty.',
                icon: Sparkles,
              },
            ].map((card) => (
              <div
                key={card.step}
                className="p-6 rounded-2xl bg-white dark:bg-[#171F38] border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md hover:border-[var(--accent-color)]/60 transition-all space-y-3 relative overflow-hidden group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black font-heading text-[var(--accent-color)]">
                    {card.step}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                    {card.time}
                  </span>
                </div>
                <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Client Trust Banner & Dev Mode invitation */}
          <div className="mt-12 p-6 rounded-3xl bg-white dark:bg-[#171F38] border border-slate-200 dark:border-slate-700/80 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/30 flex items-center justify-center text-[var(--accent-color)] shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold font-heading text-slate-900 dark:text-white">
                  Guaranteed 4-Hour Response SLA &amp; Direct WhatsApp Support
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  You work directly with founder Ankit Bhuria — no junior outsourcing or communication gaps.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <button
                onClick={() => setExperienceMode('developer')}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:border-[var(--accent-color)] border border-slate-300 dark:border-slate-700 transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <Code2 className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                <span>Test Developer Terminal</span>
              </button>
              
              <Link
                href="/contact"
                className="px-5 py-2.5 rounded-xl bg-[var(--accent-color)] text-slate-950 font-extrabold text-xs glow-btn flex items-center space-x-1.5 shadow-sm"
              >
                <span>Book 15-Min Discovery Call</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>
    );
  }

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim().toLowerCase();
    if (!cmd) return;

    const newHistory: TerminalLine[] = [
      ...history,
      { id: Date.now().toString(), type: 'user', content: `upgraderboy@jhunjhunu:~$ ${inputVal}` },
    ];

    if (cmd === 'help') {
      newHistory.push({
        id: (Date.now() + 1).toString(),
        type: 'output',
        content: `Available commands:
• about: Learn about Upgrader Boy & Ankit Bhuria
• skills: View tech stack and services
• founder: Founder credentials and story
• contact: Get agency contact info & HQ
• socials: Social media channels
• clear: Clear terminal screen`,
      });
    } else if (cmd === 'about') {
      newHistory.push({
        id: (Date.now() + 1).toString(),
        type: 'output',
        content:
          "Upgrader Boy is a modern software agency founded in April 2024 in Jhunjhunu, Rajasthan. We architect high-performance full-stack web/mobile apps and lead the 'Learn in Public' movement.",
      });
    } else if (cmd === 'skills') {
      newHistory.push({
        id: (Date.now() + 1).toString(),
        type: 'output',
        content:
          'Core Tech: Next.js 15, React, Node.js, Express, MongoDB, PostgreSQL, React Native, Docker, AWS, UI/UX in Figma.',
      });
    } else if (cmd === 'founder') {
      newHistory.push({
        id: (Date.now() + 1).toString(),
        type: 'output',
        content:
          "Founder: Ankit Bhuria — Full-stack developer, Smart India Hackathon (SIH) 2024 1st Prize Winner, advocate of open learning and community mentorship.",
      });
    } else if (cmd === 'contact') {
      newHistory.push({
        id: (Date.now() + 1).toString(),
        type: 'output',
        content:
          'HQ: Near Toll Tax, Sikar Road, Jhunjhunu, Rajasthan, 333001 | Phone / WhatsApp: +91 91662 71496 | Email: ankit@upgraderboy.com',
      });
    } else if (cmd === 'socials') {
      newHistory.push({
        id: (Date.now() + 1).toString(),
        type: 'output',
        content:
          'YouTube (@upgraderboy), LinkedIn (/in/upgraderboy), X (@upgraderboy), Instagram (@upgraderboy), WhatsApp (+91 91662 71496)',
      });
    } else if (cmd === 'clear') {
      setHistory([
        { id: Date.now().toString(), type: 'system', content: 'Terminal cleared. Type help for commands.' },
      ]);
      setInputVal('');
      return;
    } else {
      newHistory.push({
        id: (Date.now() + 1).toString(),
        type: 'error',
        content: `Command not found: "${cmd}". Type help for available commands.`,
      });
    }

    setHistory(newHistory);
    setInputVal('');
  };

  return (
    <section id="terminal" className="py-24 bg-slate-100/70 dark:bg-slate-800/50 border-y border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-[var(--accent-color)] font-mono text-xs font-bold uppercase tracking-widest bg-[var(--accent-color)]/10 px-3 py-1 rounded-full border border-[var(--accent-color)]/20">
            # Interactive Console
          </span>
          <h2 className="text-3xl sm:text-5xl font-heading font-extrabold tracking-tight text-slate-900 dark:text-white">
            Try the Developer Terminal
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
            Type commands below like{' '}
            <code className="text-[var(--accent-color)] font-mono font-bold bg-[var(--accent-color)]/10 px-2 py-0.5 rounded">
              help
            </code>
            ,{' '}
            <code className="text-[var(--accent-color)] font-mono font-bold bg-[var(--accent-color)]/10 px-2 py-0.5 rounded">
              skills
            </code>
            ,{' '}
            <code className="text-[var(--accent-color)] font-mono font-bold bg-[var(--accent-color)]/10 px-2 py-0.5 rounded">
              founder
            </code>
            , or{' '}
            <code className="text-[var(--accent-color)] font-mono font-bold bg-[var(--accent-color)]/10 px-2 py-0.5 rounded">
              clear
            </code>{' '}
            to interact with our agency system.
          </p>
        </div>

        {/* Terminal Card Window */}
        <div className="bg-slate-950 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden glow-box">
          <div className="bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
            </div>
            <span className="text-xs font-mono text-slate-400">upgraderboy-bash — zsh — 80x24</span>
            <div className="w-4" />
          </div>

          {/* Terminal Screen Area */}
          <div
            ref={screenRef}
            className="p-6 font-mono text-sm text-slate-300 h-80 overflow-y-auto space-y-3 scanlines"
          >
            {history.map((line) => {
              if (line.type === 'system') {
                return (
                  <p key={line.id} className="text-[var(--accent-color)] font-bold">
                    {line.content}
                  </p>
                );
              }
              if (line.type === 'user') {
                return (
                  <p key={line.id} className="text-slate-400">
                    {line.content}
                  </p>
                );
              }
              if (line.type === 'error') {
                return (
                  <p key={line.id} className="text-red-400">
                    {line.content}
                  </p>
                );
              }
              return (
                <div key={line.id} className="text-slate-200 whitespace-pre-line">
                  {line.content}
                </div>
              );
            })}
          </div>

          {/* Terminal Input Form */}
          <form
            onSubmit={handleCommand}
            className="bg-slate-900 border-t border-slate-800 px-4 py-3 flex items-center space-x-3"
          >
            <span className="text-[var(--accent-color)] font-mono font-bold text-xs sm:text-sm">
              upgraderboy@jhunjhunu:~$
            </span>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Type a command (e.g. help, skills, contact)..."
              className="flex-1 bg-transparent text-white font-mono focus:outline-none text-sm placeholder:text-slate-600"
            />
            <button
              type="submit"
              className="px-4 py-1.5 bg-[var(--accent-color)] text-slate-900 font-bold font-mono text-xs rounded-lg glow-btn"
            >
              Run
            </button>
          </form>
        </div>

      </div>
    </section>
  );
}
