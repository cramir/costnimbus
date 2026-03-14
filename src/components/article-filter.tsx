'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ArticleItem {
  slug: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  publishDate: string;
  tags: string[];
}

const CATEGORIES = ['All', 'Cloud Costs', 'AWS', 'Security', 'Kubernetes', 'AI/ML', 'FinOps'];

function matchesCategory(article: ArticleItem, category: string): boolean {
  if (category === 'All') return true;
  const cat = (article.category || '').toLowerCase();
  const tagLower = (article.tags || []).map((t) => t.toLowerCase());
  const filter = category.toLowerCase();

  if (cat === filter) return true;
  if (cat.includes(filter)) return true;

  // Tag-based matching
  if (filter === 'cloud costs') {
    return tagLower.some((t) => t.includes('cloud cost')) || cat.includes('cloud');
  }
  if (filter === 'aws') {
    return tagLower.includes('aws') || cat.includes('aws');
  }
  if (filter === 'security') {
    return (
      tagLower.some((t) => t.includes('soc') || t.includes('security')) ||
      cat.includes('security')
    );
  }
  if (filter === 'kubernetes') {
    return tagLower.some((t) => t.includes('kubernetes') || t === 'k8s') || cat.includes('kubernetes');
  }
  if (filter === 'ai/ml') {
    return (
      tagLower.some((t) =>
        t.includes('machine learning') ||
        t.includes('ml') ||
        t === 'gpu' ||
        t.includes('ai/ml') ||
        t.includes('mlops')
      ) || cat.includes('ai/ml') || cat.includes('ai') || cat.includes('ml')
    );
  }
  if (filter === 'finops') {
    return tagLower.some((t) => t.includes('finops')) || cat.includes('finops');
  }
  return false;
}

export default function ArticleFilter({ articles }: { articles: ArticleItem[] }) {
  const [active, setActive] = useState('All');

  const filtered = articles.filter((a) => matchesCategory(a, active));

  return (
    <>
      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2 mb-10">
        {CATEGORIES.map((cat) => {
          const isActive = active === cat;
          return (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className="text-xs font-bold px-4 py-2 rounded-full transition-all duration-200"
              style={
                isActive
                  ? {
                      background: 'var(--accent-cyan)',
                      color: '#000',
                      border: '1px solid var(--accent-cyan)',
                    }
                  : {
                      background: 'rgba(0,212,255,0.06)',
                      color: 'var(--text-secondary)',
                      border: '1px solid rgba(0,212,255,0.15)',
                    }
              }
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Article list */}
      {filtered.length === 0 ? (
        <p className="text-center" style={{ color: 'var(--text-muted)' }}>
          No articles in this category yet — check back soon.
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {filtered.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      )}
    </>
  );
}

function ArticleCard({ article }: { article: ArticleItem }) {
  const formattedDate = article.publishDate
    ? new Date(article.publishDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <Link href={`/article/${article.slug}`} className="group block">
      <article
        className="rounded-2xl p-[1px] transition-all duration-300 group-hover:-translate-y-1"
        style={{
          background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(168,85,247,0.2))',
        }}
      >
        <div
          className="rounded-2xl p-6 sm:p-8 h-full"
          style={{ background: 'var(--bg-card)' }}
        >
          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span
              className="text-xs font-bold px-3 py-1 rounded-full"
              style={{
                background: 'rgba(0,212,255,0.1)',
                color: 'var(--accent-cyan)',
                border: '1px solid rgba(0,212,255,0.3)',
              }}
            >
              {article.category}
            </span>
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{
                background: 'rgba(168,85,247,0.1)',
                color: 'var(--accent-purple)',
                border: '1px solid rgba(168,85,247,0.3)',
              }}
            >
              {article.readTime}
            </span>
            {formattedDate && (
              <span
                className="text-xs"
                style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains-mono)' }}
              >
                {formattedDate}
              </span>
            )}
          </div>

          {/* Title */}
          <h2
            className="text-xl sm:text-2xl font-bold mb-3 group-hover:text-cyan-400 transition-colors"
            style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--text-primary)' }}
          >
            {article.title}
          </h2>

          {/* Description */}
          <p className="text-sm sm:text-base leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>
            {article.description}
          </p>

          {/* Read link */}
          <span
            className="text-sm font-semibold flex items-center gap-2 transition-all group-hover:gap-3"
            style={{ color: 'var(--accent-cyan)' }}
          >
            Read article
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </article>
    </Link>
  );
}
