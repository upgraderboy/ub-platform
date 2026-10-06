'use client';

import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

interface BlogContentRendererProps {
  content: string;
}

export function BlogContentRenderer({ content }: BlogContentRendererProps) {
  // Simple, robust parser for markdown headings, code blocks, lists, and paragraphs
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

    // Heading 3
    if (line.startsWith('### ')) {
      const text = line.slice(4).trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      elements.push(
        <h3
          key={`h3-${i}`}
          id={id}
          className="text-xl sm:text-2xl font-heading font-bold text-slate-900 dark:text-white mt-8 mb-4 scroll-mt-28 flex items-center space-x-2"
        >
          <span className="text-[var(--accent-color)] font-mono text-lg">#</span>
          <span>{text}</span>
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
          className="text-lg sm:text-xl font-heading font-semibold text-slate-900 dark:text-white mt-6 mb-3 scroll-mt-28"
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
          className="my-8 border-slate-200 dark:border-slate-800"
        />
      );
      i++;
      continue;
    }

    // List item
    if (line.startsWith('- ') || line.startsWith('* ')) {
      const listItems: string[] = [];
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        listItems.push(lines[i].slice(2).trim());
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="space-y-2 my-4 list-disc list-inside text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          {listItems.map((item, idx) => (
            <li key={idx} className="marker:text-[var(--accent-color)] pl-1">
              <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(item) }} />
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
        <ol key={`ol-${i}`} className="space-y-2 my-4 list-decimal list-inside text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          {numItems.map((item, idx) => (
            <li key={idx} className="marker:font-mono marker:text-[var(--accent-color)] pl-1">
              <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(item) }} />
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
          className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed my-4"
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
      '<code class="font-mono text-xs sm:text-sm px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[var(--accent-color)] border border-slate-300 dark:border-slate-700">$1</code>'
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
    <div className="my-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl overflow-hidden font-mono text-xs sm:text-sm">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Terminal className="w-3.5 h-3.5 text-[var(--accent-color)]" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {language}
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-sans transition-colors cursor-pointer"
          title="Copy Code to Clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[var(--accent-color)]" />
              <span className="text-[var(--accent-color)] font-semibold text-[11px]">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px]">Copy Code</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <pre className="p-4 overflow-x-auto text-slate-200 leading-relaxed font-mono">
        <code>{code}</code>
      </pre>
    </div>
  );
}
