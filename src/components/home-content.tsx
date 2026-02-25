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
      <section className="hero" style={{
        padding: '10rem 2rem 6rem',
        maxWidth: '1100px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
        animation: 'fadeInUp 0.9s ease-out 0.2s both',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.6rem 1.3rem',
          background: 'rgba(168, 85, 247, 0.1)',
          border: '1px solid rgba(168, 85, 247, 0.25)',
          borderRadius: '30px',
          fontFamily: 'var(--font-jetbrains-mono)',
          fontSize: '0.75rem',
          fontWeight: 600,
          color: 'var(--accent-purple)',
          marginBottom: '2rem',
          animation: 'pulse 3s ease-in-out infinite',
        }}>
          ⚡ From the engineer who cut $50K/month
        </div>

        <h1 style={{
          fontFamily: 'var(--font-space-grotesk)',
          fontSize: 'clamp(2.2rem, 6vw, 4rem)',
          fontWeight: 700,
          lineHeight: 1.15,
          marginBottom: '1.5rem',
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
        }}>
          Your cloud bill is <span style={{
            background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-purple) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>lying to you</span>
        </h1>

        <p style={{
          fontSize: '1.15rem',
          color: 'var(--text-secondary)',
          marginBottom: '3rem',
          maxWidth: '650px',
          lineHeight: 1.8,
        }}>
          I&apos;m a cloud infrastructure engineer who slashed $50K/month from a real production bill — and documented every step. Here you&apos;ll find battle-tested guides, open source tools, and free calculators to help you do the same.
        </p>

        {/* CTA Buttons */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          marginTop: '0.5rem',
        }}>
          <Link href="/calculators" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.85rem 2rem',
            background: 'linear-gradient(135deg, var(--accent-cyan) 0%, #0099bb 100%)',
            color: '#0d1117',
            borderRadius: '10px',
            fontFamily: 'var(--font-nunito)',
            fontSize: '0.95rem',
            fontWeight: 700,
            textDecoration: 'none',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 20px rgba(0, 212, 255, 0.3)',
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 212, 255, 0.45)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 212, 255, 0.3)';
            }}
          >
            Explore Calculators →
          </Link>
          <Link href="/articles" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.85rem 2rem',
            background: 'transparent',
            color: 'var(--accent-cyan)',
            border: '1.5px solid var(--accent-cyan)',
            borderRadius: '10px',
            fontFamily: 'var(--font-nunito)',
            fontSize: '0.95rem',
            fontWeight: 700,
            textDecoration: 'none',
            transition: 'all 0.3s ease',
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.background = 'rgba(0, 212, 255, 0.08)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 212, 255, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Read the Guides →
          </Link>
        </div>

        {/* Stats cards */}
        <div style={{
          display: 'flex',
          gap: '2rem',
          flexWrap: 'wrap',
          marginTop: '3rem',
        }}>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '2rem',
            minWidth: '180px',
            flex: 1,
            textAlign: 'center',
            transition: 'all 0.4s ease',
            position: 'relative',
            overflow: 'hidden',
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.3)';
              e.currentTarget.style.boxShadow = '0 20px 50px rgba(0, 212, 255, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{
              fontFamily: 'var(--font-space-grotesk)',
              fontSize: '2.5rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-purple) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '0.3rem',
            }}>$600K+</div>
            <div style={{
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              fontWeight: 600,
            }}>Annual Savings Documented</div>
          </div>

          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '2rem',
            minWidth: '180px',
            flex: 1,
            textAlign: 'center',
            transition: 'all 0.4s ease',
            position: 'relative',
            overflow: 'hidden',
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.3)';
              e.currentTarget.style.boxShadow = '0 20px 50px rgba(0, 212, 255, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{
              fontFamily: 'var(--font-space-grotesk)',
              fontSize: '2.5rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-purple) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '0.3rem',
            }}>9</div>
            <div style={{
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              fontWeight: 600,
            }}>Free Calculators</div>
          </div>

          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '2rem',
            minWidth: '180px',
            flex: 1,
            textAlign: 'center',
            transition: 'all 0.4s ease',
            position: 'relative',
            overflow: 'hidden',
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.3)';
              e.currentTarget.style.boxShadow = '0 20px 50px rgba(0, 212, 255, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{
              fontFamily: 'var(--font-space-grotesk)',
              fontSize: '2.5rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-purple) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '0.3rem',
            }}>15K+</div>
            <div style={{
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              fontWeight: 600,
            }}>Words of Guides</div>
          </div>
        </div>
      </section>

      {/* Featured Calculators */}
      <section style={{
        padding: '5rem 2rem',
        position: 'relative',
        zIndex: 1,
        animation: 'fadeInUp 0.9s ease-out 0.35s both',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <p style={{
              fontFamily: 'var(--font-jetbrains-mono)',
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              margin: 0,
            }}>
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
              {
                href: '/calculators/nat-gateway',
                icon: '🔀',
                title: 'NAT Gateway Calculator',
                desc: 'See how much VPC endpoints save vs. NAT Gateway. Most teams cut 80–91%.',
                badge: 'Popular',
                badgeColor: 'var(--accent-cyan)',
                saving: 'Up to 91% off',
              },
              {
                href: '/calculators/storage',
                icon: '🗄️',
                title: 'S3 vs R2 vs Backblaze',
                desc: 'R2\'s zero-egress model saves 60–80% vs S3 for most storage workloads.',
                badge: 'New',
                badgeColor: '#4ade80',
                saving: 'Up to 80% off',
              },
              {
                href: '/calculators/managed-db',
                icon: '🗃️',
                title: 'Managed Database TCO',
                desc: 'RDS vs Aurora vs PlanetScale vs Neon — real cost for your instance + I/O mix.',
                badge: 'New',
                badgeColor: '#4ade80',
                saving: 'Find the cheapest DB',
              },
              {
                href: '/calculators/cloud-compare',
                icon: '⚖️',
                title: 'AWS vs Azure vs GCP',
                desc: 'Compare compute, storage, and egress across all three major clouds.',
                badge: 'New',
                badgeColor: '#4ade80',
                saving: 'Pick the winner',
              },
              {
                href: '/calculators/serverless',
                icon: '⚡',
                title: 'Serverless Calculator',
                desc: 'Lambda vs Azure Functions vs GCP vs Cloudflare Workers — real cost for your invocations + duration.',
                badge: 'New',
                badgeColor: '#4ade80',
                saving: 'Find cheapest FaaS',
              },
              {
                href: '/calculators/ec2-pricing',
                icon: '💰',
                title: 'EC2: On-Demand vs RI vs Spot',
                desc: 'See exact savings from Reserved Instances and Spot across 20+ instance types.',
                badge: 'New',
                badgeColor: '#4ade80',
                saving: 'Up to 60% off',
              },
              {
                href: '/calculators/ebs-storage',
                icon: '💾',
                title: 'EBS Volume Cost Calculator',
                desc: 'gp3 vs gp2 vs io2 — with full IOPS and throughput breakdowns. Stop paying gp2 prices.',
                badge: 'New',
                badgeColor: '#4ade80',
                saving: 'gp3 saves ~20%',
              },
              {
                href: '/calculators/cdn',
                icon: '🌐',
                title: 'CDN Cost Calculator',
                desc: 'CloudFront vs Cloudflare vs Fastly vs BunnyCDN — real costs for your bandwidth.',
                badge: 'New',
                badgeColor: '#4ade80',
                saving: 'Up to 85% savings',
              },
              {
                href: '/calculators/finops-maturity',
                icon: '📋',
                title: 'FinOps Maturity Assessment',
                desc: '15 questions, 5 dimensions — score your cloud financial management maturity and get a personalized action plan.',
                badge: 'New',
                badgeColor: '#a855f7',
                saving: 'Find your gaps',
              },
            ].map(c => (
              <Link key={c.href} href={c.href} style={{ textDecoration: 'none', display: 'block' }}>
                <div
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    height: '100%',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,212,255,0.3)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 50px rgba(0,212,255,0.1)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)';
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '1.75rem' }}>{c.icon}</span>
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
                  <div style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    {c.title}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                    {c.desc}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
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
      <section style={{
        padding: '5rem 2rem',
        position: 'relative',
        zIndex: 1,
        animation: 'fadeInUp 0.9s ease-out 0.4s both',
      }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
        }}>
          <p style={{
            fontFamily: 'var(--font-jetbrains-mono)',
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--text-muted)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}>
            <span style={{ color: 'var(--accent-cyan)' }}>{" //"}</span> Featured Story
          </p>

          {featuredArticle && (
            <Link href={`/article/${featuredArticle?.slug}`} style={{
              textDecoration: 'none',
              display: 'block',
            }}>
              <article style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '20px',
                padding: '3rem',
                transition: 'all 0.4s ease',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(8px) translateY(-4px)';
                  e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.3)';
                  e.currentTarget.style.boxShadow = '0 25px 70px rgba(0, 212, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0) translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <h2 style={{
                  fontFamily: 'var(--font-space-grotesk)',
                  fontSize: '2rem',
                  fontWeight: 700,
                  lineHeight: 1.25,
                  marginBottom: '1.5rem',
                  color: 'var(--text-primary)',
                  position: 'relative',
                  zIndex: 1,
                }}>{featuredArticle?.title}</h2>
                <p style={{
                  fontSize: '1rem',
                  color: 'var(--text-secondary)',
                  marginBottom: '1.5rem',
                  lineHeight: 1.7,
                  position: 'relative',
                  zIndex: 1,
                }}>{featuredArticle?.description}</p>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  fontFamily: 'var(--font-jetbrains-mono)',
                  position: 'relative',
                  zIndex: 1,
                }}>
                  <span style={{
                    padding: '0.5rem 1.3rem',
                    background: 'rgba(0, 212, 255, 0.1)',
                    color: 'var(--accent-cyan)',
                    border: '1px solid rgba(0, 212, 255, 0.3)',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}>{featuredArticle?.category}</span>
                  <span style={{
                    padding: '0.5rem 1.3rem',
                    background: 'rgba(168, 85, 247, 0.1)',
                    color: 'var(--accent-purple)',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}>{featuredArticle?.readTime}</span>
                </div>
              </article>
            </Link>
          )}
        </div>
      </section>

      {/* Recent Articles */}
      {recentArticles.length > 0 && (
        <section style={{
          padding: '5rem 2rem',
          position: 'relative',
          zIndex: 1,
          animation: 'fadeInUp 0.9s ease-out 0.6s both',
        }}>
          <div style={{
            maxWidth: '1100px',
            margin: '0 auto',
          }}>
            <p style={{
              fontFamily: 'var(--font-jetbrains-mono)',
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--text-muted)',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}>
              <span style={{ color: 'var(--accent-cyan)' }}>{" //"}</span> Recent Articles
            </p>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
            }}>
              {recentArticles.map((article) => (
                <Link key={article.slug} href={`/article/${article.slug}`} style={{
                  textDecoration: 'none',
                  display: 'block',
                }}>
                  <article style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '16px',
                    padding: '2rem',
                    transition: 'all 0.4s ease',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateX(8px)';
                      e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.3)';
                      e.currentTarget.style.boxShadow = '0 20px 50px rgba(0, 212, 255, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <h3 style={{
                      fontFamily: 'var(--font-space-grotesk)',
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      lineHeight: 1.3,
                      marginBottom: '1rem',
                      color: 'var(--text-primary)',
                      position: 'relative',
                      zIndex: 1,
                    }}>{article.title}</h3>
                    <p style={{
                      fontSize: '0.95rem',
                      color: 'var(--text-secondary)',
                      marginBottom: '1rem',
                      lineHeight: 1.6,
                      position: 'relative',
                      zIndex: 1,
                    }}>{article.description}</p>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      fontFamily: 'var(--font-jetbrains-mono)',
                      position: 'relative',
                      zIndex: 1,
                    }}>
                      <span style={{
                        padding: '0.4rem 1rem',
                        background: 'rgba(0, 212, 255, 0.1)',
                        color: 'var(--accent-cyan)',
                        border: '1px solid rgba(0, 212, 255, 0.3)',
                        borderRadius: '20px',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                      }}>{article.category}</span>
                      <span style={{
                        padding: '0.4rem 1rem',
                        background: 'rgba(168, 85, 247, 0.1)',
                        color: 'var(--accent-purple)',
                        border: '1px solid rgba(168, 85, 247, 0.3)',
                        borderRadius: '20px',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                      }}>{article.readTime}</span>
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
