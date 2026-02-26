'use client';

import Link from 'next/link';
import type { Article } from '@/lib/articles';

interface RelatedArticlesProps {
  articles: Article[];
}

export default function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <section className="related-articles">
      <h2 className="related-articles-heading">Related Articles</h2>
      <div style={{ display: 'grid', gap: '1.25rem' }}>
        {articles.map((article) => (
          <Link key={article.slug} href={`/article/${article.slug}`} className="related-article-card">
            <h3 className="related-article-title">{article.title}</h3>
            <p className="related-article-desc">{article.description}</p>
            <div className="related-article-meta">
              <span>{article.readTime} read</span>
              <span style={{ color: 'var(--accent-cyan)' }}>{article.category}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
