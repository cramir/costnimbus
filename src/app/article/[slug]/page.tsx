import { notFound } from 'next/navigation';
import { getArticle, getAllArticles } from '@/lib/articles';
import InnerHeader from '@/components/inner-header';
import Newsletter from '@/components/newsletter';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map(article => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) {
    return { title: 'Article Not Found' };
  }

  return {
    title: `${article.title} | Cost Nimbus`,
    description: article.description,
    keywords: `${article.category}, cloud costs, AWS optimization, FinOps, cloud savings, cost management`,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.publishDate,
      authors: ['Cost Nimbus'],
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.publishDate,
    author: { '@type': 'Organization', name: 'Cost Nimbus' },
    publisher: {
      '@type': 'Organization',
      name: 'Cost Nimbus',
      url: 'https://costnimbus.com',
    },
    mainEntityOfPage: `https://costnimbus.com/article/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <InnerHeader />

      {/* Article */}
      <article style={{
        padding: '10rem 2rem 6rem',
        maxWidth: '900px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
        animation: 'fadeInUp 0.9s ease-out 0.2s both',
      }}>
        <header style={{ marginBottom: '4rem' }}>
          <h1 style={{
            fontFamily: 'var(--font-space-grotesk)',
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 700,
            lineHeight: 1.2,
            marginBottom: '1.5rem',
            color: 'var(--text-primary)',
          }}>
            {article.title}
          </h1>
          <p style={{
            fontSize: '1.15rem',
            color: 'var(--text-secondary)',
            marginBottom: '1.5rem',
            lineHeight: 1.8,
          }}>
            {article.description}
          </p>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-jetbrains-mono)',
          }}>
            <span style={{
              padding: '0.4rem 1rem',
              background: 'rgba(0, 212, 255, 0.1)',
              color: 'var(--accent-cyan)',
              border: '1px solid rgba(0, 212, 255, 0.2)',
              borderRadius: '20px',
            }}>{article.readTime} read</span>
            <span style={{
              padding: '0.4rem 1rem',
              background: 'rgba(168, 85, 247, 0.1)',
              color: 'var(--accent-purple)',
              border: '1px solid rgba(168, 85, 247, 0.2)',
              borderRadius: '20px',
            }}>{article.category}</span>
          </div>
        </header>

        <div
          className="article-content"
          style={{
            lineHeight: 1.8,
            color: 'var(--text-primary)',
            fontSize: '1.05rem',
          }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {article.content}
          </ReactMarkdown>
        </div>

        {/* Newsletter CTA */}
        <Newsletter wrapInSection={false} />
      </article>

    </>
  );
}
