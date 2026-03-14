import type { Metadata } from 'next';
import { getAllArticles } from '@/lib/articles';
import ArticleFilter from '@/components/article-filter';

export const metadata: Metadata = {
  title: 'Cloud Cost Guides & Articles',
  description: 'Battle-tested cloud cost optimization guides written by engineers who\'ve cut real production bills. Deep dives on AWS, storage, networking, and FinOps.',
  alternates: {
    canonical: '/articles/',
  },
};

export default function ArticlesPage() {
  const articles = getAllArticles(); // already sorted newest first

  return (
    <main className="calc-main min-h-screen pt-28 pb-20">
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

      {/* Article list with category filter */}
      <section className="max-w-4xl mx-auto px-6">
        <ArticleFilter articles={articles} />
      </section>
    </main>
  );
}
