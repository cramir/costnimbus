'use client';

import { useState } from 'react';

interface TocHeading {
  id: string;
  text: string;
  level: number;
}

function extractHeadings(markdown: string): TocHeading[] {
  const headings: TocHeading[] = [];
  const lines = markdown.split('\n');
  let inCodeBlock = false;

  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].replace(/\*\*/g, '').replace(/`/g, '').trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      headings.push({ id, text, level });
    }
  }

  return headings;
}

interface TableOfContentsProps {
  markdown: string;
}

export default function TableOfContents({ markdown }: TableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const headings = extractHeadings(markdown);

  if (headings.length < 3) return null;

  return (
    <nav aria-label="Table of contents" className="toc">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="toc-toggle"
      >
        <span>Table of Contents</span>
        <span
          style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            transition: 'transform 0.2s ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          ▼
        </span>
      </button>
      {isOpen && (
        <ol className="toc-list">
          {headings.map((h, i) => (
            <li key={i}>
              <a
                href={`#${h.id}`}
                className={`toc-link ${h.level === 2 ? 'toc-link-h2' : 'toc-link-h3'}`}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ol>
      )}
    </nav>
  );
}
