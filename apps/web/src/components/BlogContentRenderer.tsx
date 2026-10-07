'use client';

import React, { useState } from 'react';
import { Copy, Check, Terminal, Info, AlertTriangle, Lightbulb, Zap, Quote } from 'lucide-react';

interface BlogContentRendererProps {
  content: string;
}

export function BlogContentRenderer({ content }: BlogContentRendererProps) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced Code Block
    if (line.startsWith('```')) {
      const language = line.slice(3).trim() || 'typescript';
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      const codeText = codeLines.join('\n');
      elements.push(
        <CodeBlockItem key={`code-${i}`} code={codeText} language={language} />
      );
      continue;
    }

    // Callout / Blockquote (GitHub style or standard)
    if (line.startsWith('>')) {
      const calloutLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('>')) {
        calloutLines.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }

      const firstLine = calloutLines[0] || '';
      let calloutType: 'note' | 'tip' | 'warning' | 'insight' | 'quote' = 'quote';
      let title = '';
      let bodyLines = calloutLines;

      if (firstLine.startsWith('[!NOTE]')) {
        calloutType = 'note';
        title = 'Architecture Note';
        bodyLines = calloutLines.slice(1);
      } else if (firstLine.startsWith('[!TIP]')) {
        calloutType = 'tip';
        title = 'Pro Tip';
        bodyLines = calloutLines.slice(1);
      } else if (firstLine.startsWith('[!WARNING]')) {
        calloutType = 'warning';
        title = 'Production Hazard';
        bodyLines = calloutLines.slice(1);
      } else if (firstLine.startsWith('[!INSIGHT]') || firstLine.startsWith('[!IMPORTANT]')) {
        calloutType = 'insight';
        title = 'Architectural Insight';
        bodyLines = calloutLines.slice(1);
      }

      elements.push(
        <CalloutBlock
          key={`callout-${i}`}
          type={calloutType}
          title={title}
          text={bodyLines.join(' ')}
        />
      );
      continue;
    }

    // Heading 3
    if (line.startsWith('### ')) {
      const text = line.slice(4).trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      elements.push(
        <h3
          key={`h3-${i}`}
          id={id}
          className="text-xl sm:text-2xl font-heading font-black text-slate-900 dark:text-white mt-10 mb-4 scroll-mt-28 flex items-center space-x-2.5 group"
        >
          <span className="text-[var(--accent-color)] font-mono text-lg opacity-80 group-hover:opacity-100 transition-opacity">
            #
          </span>
          <span className="tracking-tight">{text}</span>
        </h3>
      );
      i++;
      continue;
    }

    // Heading 4
    if (line.startsWith('#### ')) {
      const text = line.slice(5).trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      elements.push(
        <h4
          key={`h4-${i}`}
          id={id}
          className="text-lg sm:text-xl font-heading font-bold text-slate-900 dark:text-white mt-7 mb-3 scroll-mt-28"
        >
          {text}
        </h4>
      );
      i++;
      continue;
    }

    // Horizontal Rule
    if (line.trim() === '---') {
      elements.push(
        <hr
          key={`hr-${i}`}
          className="my-10 border-slate-200 dark:border-slate-800/80"
        />
      );
      i++;
      continue;
    }

    // List item (Bullet points)
    if (line.startsWith('- ') || line.startsWith('* ')) {
      const listItems: string[] = [];
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        listItems.push(lines[i].slice(2).trim());
        i++;
      }
      elements.push(
        <ul
          key={`ul-${i}`}
          className="space-y-2.5 my-5 list-none pl-1 text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed"
        >
          {listItems.map((item, idx) => (
            <li key={idx} className="flex items-start space-x-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-color)] mt-2 shrink-0" />
              <span
                className="flex-1"
                dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(item) }}
              />
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Numbered List
    if (/^\d+\.\s/.test(line)) {
      const numItems: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        numItems.push(lines[i].replace(/^\d+\.\s/, '').trim());
        i++;
      }
      elements.push(
        <ol
          key={`ol-${i}`}
          className="space-y-2.5 my-5 list-none pl-1 text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed"
        >
          {numItems.map((item, idx) => (
            <li key={idx} className="flex items-start space-x-3">
              <span className="font-mono text-xs font-bold text-[var(--accent-color)] px-1.5 py-0.5 rounded bg-[var(--accent-glow)] border border-[var(--accent-color)]/30 mt-0.5 shrink-0">
                0{idx + 1}
              </span>
              <span
                className="flex-1"
                dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(item) }}
              />
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Regular paragraph
    if (line.trim() !== '') {
      elements.push(
        <p
          key={`p-${i}`}
          className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed my-4.5"
          dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }}
        />
      );
    }

    i++;
  }

  return <div className="prose prose-slate dark:prose-invert max-w-none">{elements}</div>;
}

function formatInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    .replace(
      /`([^`]+)`/g,
      '<code class="font-mono text-xs sm:text-sm px-1.5 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-[var(--accent-color)] border border-slate-300 dark:border-slate-700/80 font-semibold">$1</code>'
    );
}

function CalloutBlock({
  type,
  title,
  text,
}: {
  type: 'note' | 'tip' | 'warning' | 'insight' | 'quote';
  title?: string;
  text: string;
}) {
  const configs = {
    note: {
      icon: Info,
      border: 'border-blue-500/40 dark:border-blue-500/50',
      bg: 'bg-blue-50/60 dark:bg-blue-950/20',
      titleColor: 'text-blue-600 dark:text-blue-400',
      iconColor: 'text-blue-500',
    },
    tip: {
      icon: Lightbulb,
      border: 'border-emerald-500/40 dark:border-emerald-500/50',
      bg: 'bg-emerald-50/60 dark:bg-emerald-950/20',
      titleColor: 'text-emerald-600 dark:text-emerald-400',
      iconColor: 'text-emerald-500',
    },
    warning: {
      icon: AlertTriangle,
      border: 'border-amber-500/40 dark:border-amber-500/50',
      bg: 'bg-amber-50/60 dark:bg-amber-950/20',
      titleColor: 'text-amber-600 dark:text-amber-400',
      iconColor: 'text-amber-500',
    },
    insight: {
      icon: Zap,
      border: 'border-[var(--accent-color)]/50',
      bg: 'bg-[var(--accent-glow)]/40',
      titleColor: 'text-[var(--accent-color)]',
      iconColor: 'text-[var(--accent-color)]',
    },
    quote: {
      icon: Quote,
      border: 'border-slate-300 dark:border-slate-700',
      bg: 'bg-slate-100/50 dark:bg-slate-900/40',
      titleColor: 'text-slate-700 dark:text-slate-300',
      iconColor: 'text-slate-400',
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div
      className={`my-6 p-4 sm:p-5 rounded-2xl border ${config.border} ${config.bg} backdrop-blur-sm space-y-2 shadow-sm`}
    >
      <div className="flex items-center space-x-2">
        <Icon className={`w-4 h-4 ${config.iconColor} shrink-0`} />
        <span className={`text-xs font-mono font-bold uppercase tracking-wider ${config.titleColor}`}>
          {title || 'Quote'}
        </span>
      </div>
      <p
        className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed pl-6"
        dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(text) }}
      />
    </div>
  );
}

function CodeBlockItem({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-7 rounded-2xl bg-[#0D1117] border border-slate-800/90 shadow-2xl overflow-hidden font-mono text-xs sm:text-sm group">
      {/* Top Header Bar with MacOS Window Buttons */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#161B22] border-b border-slate-800">
        <div className="flex items-center space-x-3">
          {/* MacOS Window Traffic Lights */}
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] inline-block" />
          </div>

          <div className="h-4 w-px bg-slate-700/60 mx-1" />

          {/* Language / Terminal Tag */}
          <div className="flex items-center space-x-1.5 text-slate-400">
            <Terminal className="w-3.5 h-3.5 text-[var(--accent-color)]" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300">
              {language}
            </span>
          </div>
        </div>

        {/* Tactile Copy Code Button */}
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 text-xs font-sans transition-all cursor-pointer border border-slate-700/60 active:scale-95"
          title="Copy Code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[var(--accent-color)]" />
              <span className="text-[var(--accent-color)] font-semibold text-[11px]">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200 transition-colors" />
              <span className="text-[11px] font-medium">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <pre className="p-4 sm:p-5 overflow-x-auto text-slate-200 leading-relaxed font-mono selection:bg-[var(--accent-color)]/30">
        <code>{code}</code>
      </pre>
    </div>
  );
}
