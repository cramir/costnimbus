'use client';

import Link from 'next/link';
import Newsletter from './newsletter';
import { Article } from '@/lib/articles';

export default function HomeContent({ articles }: { articles: Article[] }) {
  const featuredArticle = articles.find(a => a.slug === 'how-i-saved-50k-month-cloud-costs');
  const recentArticles = articles.filter(a => a.slug !== 'how-i-saved-50k-month-cloud-costs').slice(0, 2);

  return (
    <>
      {/* Cloud decorations */}
      <div className="cloud cloud-1"></div>
      <div className="cloud cloud-2"></div>
      <div className="cloud cloud-3"></div>
      <div className="cloud cloud-4"></div>

      {/* Hero */}
      <section className="page-wrapper" style={{ maxWidth: '1100px' }}>
        <div className="hero-pill">
          ⚡ From the engineer who cut $50K/month
        </div>

        <h1 className="heading-hero">
          Your cloud bill is <span className="text-gradient">lying to you</span>
        </h1>

        <p className="text-lead" style={{ marginBottom: '3rem' }}>
          I&apos;m a cloud infrastructure engineer who slashed $50K/month from a real production bill — and documented every step. Here you&apos;ll find battle-tested guides, open source tools, and free calculators to help you do the same.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
          <Link href="/calculators" className="btn-primary">
            Explore Calculators →
          </Link>
          <Link href="/articles" className="btn-outline">
            Read the Guides →
          </Link>
        </div>

        {/* Stats cards */}
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginTop: '3rem' }}>
          {[
            { value: '$600K+', label: 'Annual Savings Documented' },
            { value: '9', label: 'Free Calculators' },
            { value: '15K+', label: 'Words of Guides' },
          ].map(stat => (
            <div key={stat.label} className="stat-card">
              <div className="stat-value text-gradient">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Calculators */}
      <section className="page-section" style={{ animation: 'fadeInUp 0.9s ease-out 0.35s both' }}>
        <div className="page-section-inner">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <p className="section-label" style={{ margin: 0 }}>
              <span style={{ color: 'var(--accent-cyan)' }}>{" //"}</span> Free Calculators
            </p>
            <Link href="/calculators" style={{
              fontFamily: 'var(--font-jetbrains-mono)',
              fontSize: '0.7rem',
              fontWeight: 600,
              color: 'var(--accent-cyan)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}>
              View all calculators →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {[
              { href: '/calculators/nat-gateway', icon: '🔀', title: 'NAT Gateway Calculator', desc: 'See how much VPC endpoints save vs. NAT Gateway. Most teams cut 80–91%.', badge: 'Popular', badgeColor: 'var(--accent-cyan)', saving: 'Up to 91% off' },
              { href: '/calculators/storage', icon: '🗄️', title: 'S3 vs R2 vs Backblaze', desc: "R2's zero-egress model saves 60–80% vs S3 for most storage workloads.", badge: 'New', badgeColor: '#4ade80', saving: 'Up to 80% off' },
              { href: '/calculators/managed-db', icon: '🗃️', title: 'Managed Database TCO', desc: 'RDS vs Aurora vs PlanetScale vs Neon — real cost for your instance + I/O mix.', badge: 'New', badgeColor: '#4ade80', saving: 'Find the cheapest DB' },
              { href: '/calculators/cloud-compare', icon: '⚖️', title: 'AWS vs Azure vs GCP', desc: 'Compare compute, storage, and egress across all three major clouds.', badge: 'New', badgeColor: '#4ade80', saving: 'Pick the winner' },
              { href: '/calculators/serverless', icon: '⚡', title: 'Serverless Calculator', desc: 'Lambda vs Azure Functions vs GCP vs Cloudflare Workers — real cost for your invocations + duration.', badge: 'New', badgeColor: '#4ade80', saving: 'Find cheapest FaaS' },
              { href: '/calculators/ec2-pricing', icon: '💰', title: 'EC2: On-Demand vs RI vs Spot', desc: 'See exact savings from Reserved Instances and Spot across 20+ instance types.', badge: 'New', badgeColor: '#4ade80', saving: 'Up to 60% off' },
              { href: '/calculators/ebs-storage', icon: '💾', title: 'EBS Volume Cost Calculator', desc: 'gp3 vs gp2 vs io2 — with full IOPS and throughput breakdowns. Stop paying gp2 prices.', badge: 'New', badgeColor: '#4ade80', saving: 'gp3 saves ~20%' },
              { href: '/calculators/cdn', icon: '🌐', title: 'CDN Cost Calculator', desc: 'CloudFront vs Cloudflare vs Fastly vs BunnyCDN — real costs for your bandwidth.', badge: 'New', badgeColor: '#4ade80', saving: 'Up to 85% savings' },
              { href: '/calculators/finops-maturity', icon: '📋', title: 'FinOps Maturity Assessment', desc: '15 questions, 5 dimensions — score your cloud financial management maturity and get a personalized action plan.', badge: 'New', badgeColor: '#a855f7', saving: 'Find your gaps' },
            ].map(c => (
              <Link key={c.href} href={c.href} style={{ textDecoration: 'none', display: 'block' }}>
                <div className="card" style={{ height: '100%', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '1.75rem' }} aria-hidden="true">{c.icon}</span>
                    <span style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '0.25rem 0.6rem',
                      borderRadius: '20px',
                      background: `${c.badgeColor}15`,
                      color: c.badgeColor,
                      border: `1px solid ${c.badgeColor}40`,
                    }}>{c.badge}</span>
                  </div>
                  <div className="card-title" style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
                    {c.title}
                  </div>
                  <p className="card-desc" style={{ fontSize: '0.8rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                    {c.desc}
                  </p>
                  <div className="calc-card-footer">
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#4ade80' }}>{c.saving}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>Open →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="page-section" style={{ animation: 'fadeInUp 0.9s ease-out 0.4s both' }}>
        <div className="page-section-inner">
          <p className="section-label">
            <span style={{ color: 'var(--accent-cyan)' }}>{" //"}</span> Featured Story
          </p>

          <Link href={`/article/${featuredArticle?.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
            <article className="card card-lg">
              <h2 className="card-title" style={{ fontSize: '2rem', lineHeight: 1.25, marginBottom: '1.5rem' }}>
                {featuredArticle?.title}
              </h2>
              <p className="card-desc" style={{ fontSize: '1rem', marginBottom: '1.5rem', lineHeight: 1.7 }}>
                {featuredArticle?.description}
              </p>
              <div className="article-card-meta">
                <span className="article-card-badge article-card-badge-cyan" style={{ padding: '0.5rem 1.3rem', fontSize: '0.75rem' }}>
                  {featuredArticle?.category}
                </span>
                <span className="article-card-badge article-card-badge-purple" style={{ padding: '0.5rem 1.3rem', fontSize: '0.75rem' }}>
                  {featuredArticle?.readTime}
                </span>
              </div>
            </article>
          </Link>
        </div>
      </section>

      {/* Recent Articles */}
      {recentArticles.length > 0 && (
        <section className="page-section" style={{ animation: 'fadeInUp 0.9s ease-out 0.6s both' }}>
          <div className="page-section-inner">
            <p className="section-label">
              <span style={{ color: 'var(--accent-cyan)' }}>{" //"}</span> Recent Articles
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {recentArticles.map((article) => (
                <Link key={article.slug} href={`/article/${article.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                  <article className="article-card">
                    <h3 className="card-title" style={{ fontSize: '1.5rem', lineHeight: 1.3, marginBottom: '1rem' }}>
                      {article.title}
                    </h3>
                    <p className="card-desc" style={{ fontSize: '0.95rem', marginBottom: '1rem', lineHeight: 1.6 }}>
                      {article.description}
                    </p>
                    <div className="article-card-meta">
                      <span className="article-card-badge article-card-badge-cyan">{article.category}</span>
                      <span className="article-card-badge article-card-badge-purple">{article.readTime}</span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <Newsletter wrapInSection={true} />
    </>
  );
}
