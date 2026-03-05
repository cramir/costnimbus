import { ImageResponse } from 'next/og';
import { getAllArticles, getArticle } from '@/lib/articles';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);

  const title = article?.title || 'Cost Nimbus';
  const category = article?.category || 'Cloud Cost Intelligence';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 80px',
          background: 'linear-gradient(135deg, #0d1117 0%, #161b22 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Category badge */}
        <div style={{ display: 'flex' }}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: '#0d1117',
              background: '#00d4ff',
              padding: '8px 20px',
              borderRadius: 9999,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            {category}
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: title.length > 60 ? 42 : 52,
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.2,
            maxWidth: '90%',
          }}
        >
          {title}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 700, color: '#8b949e' }}>
            costnimbus.com
          </div>
          {/* Accent bar */}
          <div
            style={{
              width: 200,
              height: 4,
              borderRadius: 2,
              background: 'linear-gradient(90deg, #00d4ff, #a855f7)',
            }}
          />
        </div>

        {/* Bottom accent bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: 6,
            background: 'linear-gradient(90deg, #00d4ff, #a855f7)',
          }}
        />
      </div>
    ),
    { ...size }
  );
}
