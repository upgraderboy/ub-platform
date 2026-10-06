'use client';

import React, { useState, useRef, useEffect } from 'react';

interface TerminalLine {
  id: string;
  type: 'system' | 'user' | 'output' | 'error';
  content: string;
}

export function TerminalSection() {
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
