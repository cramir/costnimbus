'use client';

import Link from 'next/link';
import Newsletter from './newsletter';

const SERVICES = [
  {
    title: 'Cloud Cost Audit',
    description: 'Deep-dive analysis of your AWS, GCP, or Azure spend. Identify waste, right-size resources, and build a savings roadmap with specific dollar targets.',
    result: 'Typical finding: 30-40% reducible spend',
  },
  {
    title: 'FinOps Maturity Assessment',
    description: 'Evaluate your cost management practices against the FinOps Foundation framework. Get a scored assessment with prioritized action items.',
    result: 'Baseline → roadmap in 2 weeks',
  },
  {
    title: 'SOC Infrastructure Optimization',
    description: 'Reduce SIEM, SOAR, and security tooling costs without sacrificing coverage. Consolidate overlapping tools and optimize data ingestion.',
    result: 'Average: $30K-50K/month in tool consolidation',
  },
  {
    title: 'Migration Cost Planning',
    description: 'Moving cloud providers or going multi-cloud? Get accurate cost projections before you commit, not after you\'re locked in.',
    result: 'Prevent cost surprises before they happen',
  },
  {
    title: 'GPU & ML Workload Optimization',
    description: 'Spot instances, reserved capacity, scheduling, and architecture changes for ML training and inference workloads.',
    result: 'GPU spend reductions of 40-70%',
  },
];

export default function ConsultingContent() {
  return (
    <>
      <div className="cloud cloud-1"></div>
      <div className="cloud cloud-2"></div>
      <div className="cloud cloud-3"></div>

      <article className="page-wrapper">
        {/* Hero */}
        <header style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <h1 className="heading-hero">Cloud Cost Consulting</h1>
          <p className="text-lead" style={{ maxWidth: '640px', margin: '0 auto' }}>
            Stop overpaying for cloud. Get an engineer who&apos;s actually done it — not a slide deck from a vendor.
          </p>
        </header>

        {/* Proof bar */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem',
            padding: '2rem',
            borderRadius: '12px',
            background: 'var(--card-bg, rgba(255,255,255,0.03))',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {[
            { stat: '$50K+', label: 'Saved per month (documented)' },
            { stat: '90 Days', label: 'Average time to first savings' },
            { stat: '10+', label: 'Years in infrastructure' },
          ].map((item) => (
            <div key={item.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                {item.stat}
              </div>
              <div style={{ fontSize: '0.875rem', opacity: 0.7, marginTop: '0.25rem' }}>
                {item.label}
              </div>
            </div>
          ))}
        </section>

        {/* Services */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 className="heading-section">Services</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem',
              marginTop: '1.5rem',
            }}
          >
            {SERVICES.map((service) => (
              <div
                key={service.title}
                style={{
                  padding: '1.5rem',
                  borderRadius: '12px',
                  background: 'var(--card-bg, rgba(255,255,255,0.03))',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                  {service.title}
                </h3>
                <p className="body-text" style={{ marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                  {service.description}
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 500 }}>
                  → {service.result}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 className="heading-section">How It Works</h2>
          <div className="body-text">
            <div style={{ display: 'grid', gap: '1.5rem', marginTop: '1.5rem' }}>
              {[
                {
                  step: '1',
                  title: 'Discovery Call (Free, 30 min)',
                  detail: 'We talk about your cloud environment, current spend, and where you think the waste is. No pitch — just diagnosis.',
                },
                {
                  step: '2',
                  title: 'Cost Audit',
                  detail: 'I get read-only access to your billing data and infrastructure. Within 1-2 weeks, you get a detailed report with specific savings targets and implementation steps.',
                },
                {
                  step: '3',
                  title: 'Implementation Support',
                  detail: 'Optional: I help your team execute the changes. Right-sizing, reserved instance strategy, architecture changes — whatever moves the needle.',
                },
              ].map((item) => (
                <div key={item.step} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      minWidth: '2.5rem',
                      height: '2.5rem',
                      borderRadius: '50%',
                      background: 'var(--accent-cyan)',
                      color: '#000',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '1rem',
                      flexShrink: 0,
                    }}
                  >
                    {item.step}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 className="heading-section">Pricing</h2>
          <div className="body-text">
            <p style={{ marginBottom: '1rem' }}>
              I price based on the value delivered, not hours spent. If I find $50K/month in savings, a few thousand for the engagement is a rounding error.
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem',
                marginTop: '1.5rem',
              }}
            >
              <div
                style={{
                  padding: '1.5rem',
                  borderRadius: '12px',
                  background: 'var(--card-bg, rgba(255,255,255,0.03))',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  Cost Audit
                </h3>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '0.5rem' }}>
                  $2,500 – $5,000
                </div>
                <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                  Full environment audit with actionable savings roadmap. Flat fee based on environment complexity.
                </p>
              </div>
              <div
                style={{
                  padding: '1.5rem',
                  borderRadius: '12px',
                  background: 'var(--card-bg, rgba(255,255,255,0.03))',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  Implementation Support
                </h3>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '0.5rem' }}>
                  $300 – $500/hr
                </div>
                <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                  Hands-on engineering support to execute savings. Most engagements pay for themselves within the first week.
                </p>
              </div>
              <div
                style={{
                  padding: '1.5rem',
                  borderRadius: '12px',
                  background: 'var(--card-bg, rgba(255,255,255,0.03))',
                  border: '2px solid var(--accent-cyan)',
                }}
              >
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  Retainer
                </h3>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '0.5rem' }}>
                  Custom
                </div>
                <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                  Ongoing cost optimization, architecture review, and FinOps coaching. For teams that want continuous improvement.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          style={{
            textAlign: 'center',
            padding: '3rem 2rem',
            borderRadius: '12px',
            background: 'var(--card-bg, rgba(255,255,255,0.03))',
            border: '1px solid rgba(255,255,255,0.06)',
            marginBottom: '4rem',
          }}
        >
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
            Ready to stop overpaying?
          </h2>
          <p style={{ marginBottom: '1.5rem', opacity: 0.8, maxWidth: '480px', margin: '0 auto 1.5rem' }}>
            Schedule a free 30-minute discovery call. No pitch, no commitment — just a conversation about your cloud costs.
          </p>
          <a
            href="mailto:consulting@costnimbus.com"
            style={{
              display: 'inline-block',
              padding: '0.875rem 2rem',
              background: 'var(--accent-cyan)',
              color: '#000',
              fontWeight: 700,
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '1rem',
            }}
          >
            consulting@costnimbus.com
          </a>
          <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', opacity: 0.5 }}>
            Or{' '}
            <Link href="/about" style={{ color: 'var(--accent-cyan)', textDecoration: 'none' }}>
              learn more about me first
            </Link>
          </p>
        </section>

        {/* Newsletter */}
        <Newsletter />
      </article>
    </>
  );
}
