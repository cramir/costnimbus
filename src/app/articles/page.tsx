import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllArticles } from '@/lib/articles';

export const metadata: Metadata = {
  title: 'Cloud Cost Guides & Articles',
  description: 'Battle-tested cloud cost optimization guides written by engineers who\'ve cut real production bills. Deep dives on AWS, storage, networking, and FinOps.',
};

export default function ArticlesPage() {
  const articles = getAllArticles(); // already sorted newest first

  return (
    <main className="min-h-screen pt-28 pb-20" style={{ background: 'var(--bg-primary)' }}>
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-10 pb-12 text-center">
        <span
          className="inline-block mb-4 text-xs font-bold uppercase tracking-[0.2em] px-5 py-2 rounded-full"
          style={{
            color: 'var(--accent-purple)',
            background: 'rgba(168,85,247,0.08)',
            border: '1px solid rgba(168,85,247,0.2)',
          }}
        >
          Guides &amp; Deep Dives
        </span>
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-5"
          style={{
            fontFamily: 'var(--font-space-grotesk)',
            background: 'linear-gradient(135deg, var(--text-primary) 40%, var(--accent-cyan) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          All Articles
        </h1>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          Real-world playbooks for cutting cloud spend — no vendor fluff, no vague advice.
          Every article is written by engineers who&apos;ve actually done it.
        </p>
      </section>

      {/* Article list */}
      <section className="max-w-4xl mx-auto px-6">
        {articles.length === 0 ? (
          <p className="text-center" style={{ color: 'var(--text-muted)' }}>No articles yet — check back soon.</p>
        ) : (
          <div className="flex flex-col gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function ArticleCard({ article }: { article: { slug: string; title: string; description: string; category: string; readTime: string; publishDate: string } }) {
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
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </article>
    </Link>
  );
}
