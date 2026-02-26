'use client';

import Link from 'next/link';

export default function Footer({ animationDelay = '0.4s' }: { animationDelay?: string }) {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-subtle)',
      position: 'relative',
      zIndex: 1,
      animation: `fadeInUp 0.9s ease-out ${animationDelay} both`,
      background: 'var(--bg-secondary)',
    }}>
      {/* Main footer content */}
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '4rem 2rem 3rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '3rem',
      }}>
        {/* Brand column */}
        <div style={{ gridColumn: 'span 1' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              marginBottom: '1rem',
            }}>
              <span style={{
                fontFamily: 'var(--font-jetbrains-mono)',
                color: 'var(--accent-cyan)',
                fontSize: '1.2rem',
                fontWeight: 700,
              }}>$</span>
              <span style={{
                fontFamily: 'var(--font-space-grotesk)',
                fontSize: '1.2rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
              }}>Cost Nimbus</span>
            </div>
          </Link>
          <p style={{
            fontFamily: 'var(--font-nunito)',
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            marginBottom: '1.5rem',
          }}>
            Cloud cost intelligence built by engineers, for engineers. Real numbers, no vendor fluff.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {[
              { label: 'Free Tools', color: 'var(--accent-cyan)' },
              { label: 'No Login', color: 'var(--accent-purple)' },
            ].map(badge => (
              <span key={badge.label} style={{
                fontFamily: 'var(--font-nunito)',
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: badge.color,
                padding: '0.25rem 0.6rem',
                borderRadius: '6px',
                border: `1px solid ${badge.color}33`,
                background: `${badge.color}10`,
              }}>{badge.label}</span>
            ))}
          </div>
        </div>

        {/* Calculators column */}
        <div>
          <h4 style={{
            fontFamily: 'var(--font-space-grotesk)',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--accent-cyan)',
            marginBottom: '1.25rem',
          }}>Calculators</h4>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {[
              { href: '/calculators/nat-gateway', label: 'NAT Gateway' },
              { href: '/calculators/storage', label: 'S3 vs R2 vs Backblaze' },
              { href: '/calculators/siem', label: 'SIEM TCO' },
              { href: '/calculators/cloud-compare', label: 'AWS vs Azure vs GCP' },
              { href: '/calculators/managed-db', label: 'Managed Database' },
              { href: '/calculators', label: 'All Calculators →' },
            ].map(link => (
              <Link key={link.href} href={link.href} style={{
                fontFamily: 'var(--font-nunito)',
                fontSize: '0.875rem',
                color: link.label.includes('→') ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = link.label.includes('→') ? 'var(--accent-cyan)' : 'var(--text-secondary)'}
              >{link.label}</Link>
            ))}
          </nav>
        </div>

        {/* Resources column */}
        <div>
          <h4 style={{
            fontFamily: 'var(--font-space-grotesk)',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--accent-purple)',
            marginBottom: '1.25rem',
          }}>Resources</h4>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {[
              { href: '/resources', label: 'Open-Source FinOps Tools' },
              { href: '/tools', label: 'SOC Platform Comparison' },
              { href: '/methodology', label: 'Pricing Methodology' },
              { href: '/about', label: 'About' },
            ].map(link => (
              <Link key={link.href} href={link.href} style={{
                fontFamily: 'var(--font-nunito)',
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
              >{link.label}</Link>
            ))}
          </nav>
        </div>

        {/* Articles column */}
        <div>
          <h4 style={{
            fontFamily: 'var(--font-space-grotesk)',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#4ade80',
            marginBottom: '1.25rem',
          }}>Articles</h4>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {[
              { href: '/article/hidden-costs-aws-nat-gateways', label: 'Hidden NAT Gateway Costs' },
              { href: '/article/how-i-saved-50k-month-cloud-costs', label: 'How I Saved $50K/month' },
              { href: '/article/how-to-cut-aws-egress-costs', label: 'Cut AWS Egress Costs' },
              { href: '/article/azure-vs-aws-dotnet', label: 'Azure vs AWS for .NET' },
              { href: '/articles', label: 'All Articles →' },
            ].map(link => (
              <Link key={link.href} href={link.href} style={{
                fontFamily: 'var(--font-nunito)',
                fontSize: '0.875rem',
                color: link.label.includes('→') ? '#4ade80' : 'var(--text-secondary)',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = link.label.includes('→') ? '#4ade80' : 'var(--text-secondary)'}
              >{link.label}</Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '1.5rem 2rem',
        maxWidth: '1100px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <p style={{
          fontFamily: 'var(--font-nunito)',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          margin: 0,
        }}>
          © 2026 Cost Nimbus. Built by engineers, for engineers. Pricing data updated Q1 2026.
        </p>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {[
            { href: '/methodology', label: 'Methodology' },
            { href: '/sitemap.xml', label: 'Sitemap' },
          ].map(link => (
            <Link key={link.href} href={link.href} style={{
              fontFamily: 'var(--font-nunito)',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >{link.label}</Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
