import { notFound } from 'next/navigation';
import { getArticle, getAllArticles } from '@/lib/articles';
import InnerHeader from '@/components/inner-header';

interface PageProps {
  params: Promise<{ slug: string }>;
}

function parseMarkdown(content: string) {
  return content
    // Code blocks
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Bold
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // Headers
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$2</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Lists
    .replace(/^- \*\*(.+?)\*\*[:\s]/gm, '<li><strong>$1</strong> ')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
    // Paragraphs
    .replace(/\n\n/g, '</p><p>')
    // Line breaks
    .replace(/\n/g, '<br/>');
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
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) {
    notFound();
  }

  const htmlContent = parseMarkdown(article.content);

  return (
    <>
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
          style={{
            lineHeight: 1.8,
            color: 'var(--text-primary)',
            fontSize: '1.05rem',
          }}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* Newsletter CTA */}
        <div style={{
          marginTop: '5rem',
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '24px',
          padding: '3.5rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'var(--card-shadow)',
        }}>
          <div style={{
            position: 'absolute',
            top: '-2px',
            left: '-2px',
            right: '-2px',
            bottom: '-2px',
            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple), var(--accent-cyan))',
            borderRadius: '26px',
            zIndex: -1,
            opacity: 0.3,
          }}></div>

          <h2 style={{
            fontFamily: 'var(--font-space-grotesk)',
            fontSize: '2rem',
            fontWeight: 700,
            marginBottom: '0.75rem',
            color: 'var(--text-primary)',
            position: 'relative',
            zIndex: 1,
          }}>Get weekly cloud cost tips</h2>
          <p style={{
            color: 'var(--text-secondary)',
            marginBottom: '2rem',
            fontSize: '1rem',
            lineHeight: 1.8,
            position: 'relative',
            zIndex: 1,
          }}>Join engineers saving money on cloud costs. Actionable strategies every Friday.</p>

          <a
            href="https://sendfox.com/form/3qdz96/36enr2"
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-nunito)',
              fontSize: '1rem',
              fontWeight: 700,
              padding: '1.2rem 2rem',
              background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-purple) 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              position: 'relative',
              zIndex: 1,
            }}
          >
            Subscribe (free)
          </a>
        </div>
      </article>

      {/* Footer */}
      <footer style={{
        padding: '3rem 2rem',
        textAlign: 'center',
        borderTop: '1px solid var(--border-subtle)',
        position: 'relative',
        zIndex: 1,
        animation: 'fadeInUp 0.9s ease-out 0.4s both',
      }}>
        <p style={{
          fontFamily: 'var(--font-nunito)',
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
        }}>© 2026 Cost Nimbus. Built by engineers, for engineers.</p>
      </footer>
    </>
  );
}
