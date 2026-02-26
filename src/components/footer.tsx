'use client';

import Link from 'next/link';

export default function Footer({ animationDelay = '0.4s' }: { animationDelay?: string }) {
  return (
    <footer className="site-footer" style={{ animation: `fadeInUp 0.9s ease-out ${animationDelay} both` }}>
      <div className="footer-grid">
        {/* Brand column */}
        <div>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
              <span className="nav-logo-symbol" style={{ fontSize: '1.2rem', fontWeight: 700 }} aria-hidden="true">$</span>
              <span style={{
                fontFamily: 'var(--font-space-grotesk)',
                fontSize: '1.2rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
              }}>Cost Nimbus</span>
            </div>
          </Link>
          <p className="brand-tagline">
            Cloud cost intelligence built by engineers, for engineers. Real numbers, no vendor fluff.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {[
              { label: 'Free Tools', color: 'var(--accent-cyan)' },
              { label: 'No Login', color: 'var(--accent-purple)' },
            ].map(b => (
              <span
                key={b.label}
                className="badge"
                style={{ color: b.color, border: `1px solid ${b.color}33`, background: `${b.color}10` }}
              >
                {b.label}
              </span>
            ))}
          </div>
        </div>

        {/* Calculators column */}
        <div>
          <h4 className="footer-col-heading" style={{ color: 'var(--accent-cyan)' }}>Calculators</h4>
          <nav className="footer-col-nav">
            {[
              { href: '/calculators/nat-gateway', label: 'NAT Gateway' },
              { href: '/calculators/storage', label: 'S3 vs R2 vs Backblaze' },
              { href: '/calculators/siem', label: 'SIEM TCO' },
              { href: '/calculators/cloud-compare', label: 'AWS vs Azure vs GCP' },
              { href: '/calculators/managed-db', label: 'Managed Database' },
              { href: '/calculators', label: 'All Calculators →' },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`footer-link ${link.label.includes('→') ? 'footer-link-accent' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Resources column */}
        <div>
          <h4 className="footer-col-heading" style={{ color: 'var(--accent-purple)' }}>Resources</h4>
          <nav className="footer-col-nav">
            {[
              { href: '/resources', label: 'Open-Source FinOps Tools' },
              { href: '/tools', label: 'SOC Platform Comparison' },
              { href: '/methodology', label: 'Pricing Methodology' },
              { href: '/about', label: 'About' },
            ].map(link => (
              <Link key={link.href} href={link.href} className="footer-link">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Articles column */}
        <div>
          <h4 className="footer-col-heading" style={{ color: '#4ade80' }}>Articles</h4>
          <nav className="footer-col-nav">
            {[
              { href: '/article/hidden-costs-aws-nat-gateways', label: 'Hidden NAT Gateway Costs' },
              { href: '/article/how-i-saved-50k-month-cloud-costs', label: 'How I Saved $50K/month' },
              { href: '/article/how-to-cut-aws-egress-costs', label: 'Cut AWS Egress Costs' },
              { href: '/article/azure-vs-aws-dotnet', label: 'Azure vs AWS for .NET' },
              { href: '/articles', label: 'All Articles →' },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`footer-link ${link.label.includes('→') ? '' : ''}`}
                style={link.label.includes('→') ? { color: '#4ade80' } : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <p className="footer-bottom-text">
          © 2026 Cost Nimbus. Built by engineers, for engineers. Pricing data updated Q1 2026.
        </p>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {[
            { href: '/methodology', label: 'Methodology' },
            { href: '/sitemap.xml', label: 'Sitemap' },
          ].map(link => (
            <Link key={link.href} href={link.href} className="footer-bottom-link">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
