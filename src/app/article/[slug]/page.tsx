import { notFound } from 'next/navigation';
import { getArticle, getAllArticles } from '@/lib/articles';
import Link from 'next/link';

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
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
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
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm">
            ← Cost Nimbus
          </Link>
        </div>
      </header>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-6 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {article.title}
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            {article.description}
          </p>
          <div className="flex items-center text-sm text-gray-500">
            <span>{article.readTime} read</span>
            <span className="mx-2">•</span>
            <span>{article.category}</span>
          </div>
        </header>

        <div 
          className="prose prose-lg max-w-none
            prose-headings:text-gray-900 prose-headings:font-bold
            prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-gray-700 prose-p:leading-relaxed
            prose-li:text-gray-700
            prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded
            prose-pre:bg-gray-900 prose-pre:text-gray-100
            prose-strong:text-gray-900
          "
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* Newsletter CTA */}
        <div className="mt-16 p-8 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Get weekly cloud cost tips
          </h3>
          <p className="text-gray-600 mb-4">
            Join engineers saving money on cloud costs. Actionable strategies every Friday.
          </p>
          <a 
            href="https://costnimbus.com/newsletter"
            className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Subscribe (free)
          </a>
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-16">
        <div className="max-w-3xl mx-auto px-6 py-8 text-center text-gray-500 text-sm">
          © 2026 Cost Nimbus. Built by engineers, for engineers.
        </div>
      </footer>
    </main>
  );
}
