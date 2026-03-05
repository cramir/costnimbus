import { notFound } from 'next/navigation';
import { getArticle, getAllArticles } from '@/lib/articles';
import InnerHeader from '@/components/inner-header';
import Newsletter from '@/components/newsletter';
import TableOfContents from '@/components/table-of-contents';
import RelatedArticles from '@/components/related-articles';
import Breadcrumb from '@/components/breadcrumb';
import ShareButtons from '@/components/share-buttons';
import AuthorBio from '@/components/author-bio';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

function getTextContent(children: React.ReactNode): string {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) return children.map(getTextContent).join('');
  if (children && typeof children === 'object' && 'props' in children) {
    return getTextContent((children as React.ReactElement<{ children?: React.ReactNode }>).props.children);
  }
  return '';
}

const headingComponents = {
  h2: ({ children, ...props }: React.ComponentProps<'h2'>) => {
    const id = slugify(getTextContent(children));
    return <h2 id={id} {...props}>{children}</h2>;
  },
  h3: ({ children, ...props }: React.ComponentProps<'h3'>) => {
    const id = slugify(getTextContent(children));
    return <h3 id={id} {...props}>{children}</h3>;
  },
};

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
    alternates: {
      canonical: `/article/${slug}/`,
    },
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.publishDate,
      authors: ['Cost Nimbus'],
      url: `https://costnimbus.com/article/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) {
    notFound();
  }

  const allArticles = getAllArticles();
  const relatedArticles = allArticles
    .filter((a) => a.slug !== slug && a.category === article.category)
    .slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.publishDate,
    author: {
      '@type': 'Person',
      name: 'Cesar Ramirez',
      url: 'https://costnimbus.com/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Cost Nimbus',
      url: 'https://costnimbus.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://costnimbus.com/og-image.png',
      },
    },
    mainEntityOfPage: `https://costnimbus.com/article/${slug}`,
    image: 'https://costnimbus.com/og-image.png',
  };

  const howToJsonLd = slug === 'how-i-saved-50k-month-cloud-costs' ? {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Save $50K/Month in Cloud Costs',
    description: 'Step-by-step guide to cutting cloud infrastructure costs through custom tooling and automation.',
    totalTime: 'P30D',
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'USD',
      value: '0',
    },
    author: {
      '@type': 'Person',
      name: 'Cesar Ramirez',
      url: 'https://costnimbus.com/about',
    },
    tool: [
      { '@type': 'HowToTool', name: 'AWS Cost Explorer' },
      { '@type': 'HowToTool', name: 'Custom alert management system' },
      { '@type': 'HowToTool', name: 'Infrastructure automation scripts' },
    ],
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Audit cloud environment for waste',
        text: 'Review your cloud bill line by line. Identify the largest cost centers and categorize spending into essential vs. wasteful. Look for underutilized resources, orphaned volumes, and redundant services.',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Build custom alert management system',
        text: 'Replace expensive third-party alert management tools with a custom solution tailored to your workflow. This single change saved $30K/month by eliminating a tool that did not fit the team\'s actual needs.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Inventory and tag all cloud resources',
        text: 'Create a complete inventory of every cloud resource. Implement a tagging strategy to track ownership, purpose, and lifecycle stage for each resource.',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Automate resource cleanup',
        text: 'Build automation to identify and remove neglected and underutilized cloud resources. Automated cleanup of orphaned resources saved an additional $20K/month.',
      },
      {
        '@type': 'HowToStep',
        position: 5,
        name: 'Implement ongoing automation and monitoring',
        text: 'Set up continuous monitoring and automated enforcement to prevent cost creep from returning. Establish alerts for anomalous spending and automated policies for resource lifecycle management.',
      },
    ],
  } : null;

  const articleUrl = `https://costnimbus.com/article/${slug}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {howToJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
        />
      )}
      <InnerHeader />

      <article className="article-wrapper">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Articles', href: '/articles' },
            { label: article.title },
          ]}
        />

        <header style={{ marginBottom: '4rem' }}>
          <h1 className="article-title">{article.title}</h1>
          <p className="article-description">{article.description}</p>
          <ul className="article-meta" role="list">
            <li className="article-meta-badge article-meta-badge-cyan">{article.readTime} read</li>
            <li className="article-meta-badge article-meta-badge-purple">{article.category}</li>
            {article.publishDate && (
              <li className="article-meta-badge" style={{
                background: 'rgba(255,255,255,0.04)',
                color: 'var(--text-muted)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}>
                {new Date(article.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </li>
            )}
          </ul>
        </header>

        <TableOfContents markdown={article.content} />

        <div className="article-content article-body">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={headingComponents}
          >
            {article.content}
          </ReactMarkdown>
        </div>

        <ShareButtons url={articleUrl} title={article.title} />

        <AuthorBio />

        <Newsletter wrapInSection={false} />
        <RelatedArticles articles={relatedArticles} />
      </article>
    </>
  );
}
