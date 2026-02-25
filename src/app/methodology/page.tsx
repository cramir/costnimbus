'use client';

import Link from 'next/link';

const sources = [
  {
    provider: 'Amazon Web Services (AWS)',
    color: '#ff9900',
    icon: '☁️',
    sources: [
      { label: 'AWS Pricing API', url: 'https://aws.amazon.com/pricing/', note: 'Machine-readable JSON bulk pricing' },
      { label: 'AWS Calculator', url: 'https://calculator.aws/pricing/2/home', note: 'Official estimate tool for cross-check' },
      { label: 'EC2 On-Demand Prices', url: 'https://aws.amazon.com/ec2/pricing/on-demand/', note: 'us-east-1 on-demand, Linux' },
      { label: 'S3 Storage Pricing', url: 'https://aws.amazon.com/s3/pricing/', note: 'Standard storage tier, us-east-1' },
      { label: 'RDS Pricing', url: 'https://aws.amazon.com/rds/pricing/', note: 'On-demand, Multi-AZ optional' },
      { label: 'NAT Gateway Pricing', url: 'https://aws.amazon.com/vpc/pricing/', note: 'Per-hour + per-GB data processed' },
    ],
  },
  {
    provider: 'Microsoft Azure',
    color: '#0078d4',
    icon: '⚡',
    sources: [
      { label: 'Azure Pricing Calculator', url: 'https://azure.microsoft.com/en-us/pricing/calculator/', note: 'Official tool' },
      { label: 'Azure Retail Prices API', url: 'https://learn.microsoft.com/en-us/rest/api/cost-management/retail-prices/azure-retail-prices', note: 'REST API for programmatic access' },
      { label: 'Virtual Machines Pricing', url: 'https://azure.microsoft.com/en-us/pricing/details/virtual-machines/linux/', note: 'East US, Pay-as-you-go' },
      { label: 'Blob Storage Pricing', url: 'https://azure.microsoft.com/en-us/pricing/details/storage/blobs/', note: 'LRS, Hot tier' },
      { label: 'Azure Database for MySQL/PostgreSQL', url: 'https://azure.microsoft.com/en-us/pricing/details/mysql/flexible-server/', note: 'Flexible Server pricing' },
    ],
  },
  {
    provider: 'Google Cloud Platform (GCP)',
    color: '#34a853',
    icon: '🌐',
    sources: [
      { label: 'Cloud Pricing Calculator', url: 'https://cloud.google.com/products/calculator', note: 'Official tool' },
      { label: 'Cloud Billing API', url: 'https://cloud.google.com/billing/docs/reference/rest', note: 'SKU-level pricing' },
      { label: 'Compute Engine Pricing', url: 'https://cloud.google.com/compute/vm-instance-pricing', note: 'us-east1, on-demand' },
      { label: 'Cloud Storage Pricing', url: 'https://cloud.google.com/storage/pricing', note: 'Standard class, us-east1' },
      { label: 'Cloud SQL Pricing', url: 'https://cloud.google.com/sql/pricing', note: 'MySQL/PostgreSQL, on-demand' },
    ],
  },
  {
    provider: 'Cloudflare R2',
    color: '#f48120',
    icon: '🔶',
    sources: [
      { label: 'R2 Pricing Page', url: 'https://developers.cloudflare.com/r2/pricing/', note: 'Storage + operations; zero egress fees' },
    ],
  },
  {
    provider: 'Backblaze B2',
    color: '#e2231a',
    icon: '🔴',
    sources: [
      { label: 'B2 Cloud Storage Pricing', url: 'https://www.backblaze.com/b2/cloud-storage-pricing.html', note: 'Storage $0.006/GB; Egress $0.01/GB (reduced)' },
    ],
  },
  {
    provider: 'SIEM Platforms',
    color: '#a855f7',
    icon: '🛡️',
    sources: [
      { label: 'Splunk Pricing', url: 'https://www.splunk.com/en_us/products/pricing.html', note: 'Ingest-based, $150–$300/GB/day (Enterprise Security)' },
      { label: 'Microsoft Sentinel', url: 'https://azure.microsoft.com/en-us/pricing/details/microsoft-sentinel/', note: 'Pay-as-you-go + commitment tiers' },
      { label: 'Elastic Security', url: 'https://www.elastic.co/pricing/', note: 'Self-managed or Elastic Cloud; compute-based' },
      { label: 'Wazuh', url: 'https://wazuh.com/pricing/', note: 'Open source; cost = compute + storage only' },
    ],
  },
  {
    provider: 'Managed Databases',
    color: '#00d4ff',
    icon: '🗃️',
    sources: [
      { label: 'PlanetScale Pricing', url: 'https://planetscale.com/pricing', note: 'Row reads/writes + storage' },
      { label: 'Neon Pricing', url: 'https://neon.tech/pricing', note: 'Compute hours + storage; branching included' },
    ],
  },
];

const assumptions = [
  { title: 'Region', detail: 'All AWS prices use us-east-1 (N. Virginia). Azure uses East US. GCP uses us-east1. These are typically the lowest-cost regions and most commonly used.' },
  { title: 'Pricing Tier', detail: 'On-demand / pay-as-you-go pricing only. Reserved instances, savings plans, committed use discounts, and spot pricing are not included unless explicitly labeled.' },
  { title: 'Operating System', detail: 'Compute prices use Linux. Windows adds a license surcharge not reflected here.' },
  { title: 'Data Transfer', detail: 'Egress pricing reflects internet egress. Data transfer between services within the same region is often free or near-free and may not be modeled.' },
  { title: 'Storage', detail: 'First-tier / standard storage tier pricing. Infrequent access, archive/Glacier, and cold storage tiers are not included.' },
  { title: 'Support Plans', detail: 'No support plan costs are included. AWS Business Support alone can add 10% of monthly spend.' },
  { title: 'Free Tier', detail: 'AWS/Azure/GCP free tier credits are not factored in — calculators assume production workloads beyond free tier limits.' },
  { title: 'Currency', detail: 'All prices in USD.' },
];

export default function MethodologyPage() {
  return (
    <main style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      paddingTop: '5rem',
    }}>
      {/* Hero */}
      <section style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '4rem 2rem 3rem',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 1rem',
          borderRadius: '20px',
          background: 'rgba(0, 212, 255, 0.08)',
          border: '1px solid rgba(0, 212, 255, 0.2)',
          marginBottom: '1.5rem',
        }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-space-grotesk)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Transparent by design</span>
        </div>
        <h1 style={{
          fontFamily: 'var(--font-space-grotesk)',
          fontSize: 'clamp(2rem, 5vw, 3.2rem)',
          fontWeight: 800,
          color: 'var(--text-primary)',
          lineHeight: 1.15,
          marginBottom: '1.25rem',
        }}>
          Pricing Methodology
        </h1>
        <p style={{
          fontFamily: 'var(--font-nunito)',
          fontSize: '1.15rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.7,
          maxWidth: '680px',
        }}>
          Every number in our calculators comes from a verifiable public source. No estimates, no sponsor adjustments, no hidden assumptions. Here's exactly where each price comes from — and what we assume when data is ambiguous.
        </p>
      </section>

      {/* Update cadence */}
      <section style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '3rem 2rem',
      }}>
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid rgba(0, 212, 255, 0.2)',
          borderRadius: '16px',
          padding: '2rem',
          display: 'flex',
          gap: '2rem',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-purple))',
          }} />
          <div style={{ flex: '1', minWidth: '200px' }}>
            <div style={{
              fontFamily: 'var(--font-space-grotesk)',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--accent-cyan)',
              marginBottom: '0.5rem',
            }}>Last Updated</div>
            <div style={{
              fontFamily: 'var(--font-space-grotesk)',
              fontSize: '1.4rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
            }}>Q1 2026</div>
            <div style={{
              fontFamily: 'var(--font-nunito)',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              marginTop: '0.3rem',
            }}>February 2026</div>
          </div>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <div style={{
              fontFamily: 'var(--font-space-grotesk)',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--accent-purple)',
              marginBottom: '0.5rem',
            }}>Update Frequency</div>
            <div style={{
              fontFamily: 'var(--font-nunito)',
              fontSize: '0.95rem',
              color: 'var(--text-primary)',
              lineHeight: 1.5,
            }}>
              Prices reviewed quarterly. AWS, Azure, and GCP rarely change list prices — when they do (spot, savings plans, new SKUs), we update within 30 days.
            </div>
          </div>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <div style={{
              fontFamily: 'var(--font-space-grotesk)',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#4ade80',
              marginBottom: '0.5rem',
            }}>Report an Error</div>
            <div style={{
              fontFamily: 'var(--font-nunito)',
              fontSize: '0.95rem',
              color: 'var(--text-primary)',
              lineHeight: 1.5,
            }}>
              Found a price discrepancy? We take accuracy seriously. Open an issue on{' '}
              <a
                href="https://github.com/cramir/costnimbus"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--accent-cyan)', textDecoration: 'none' }}
              >GitHub</a>.
            </div>
          </div>
        </div>
      </section>

      {/* Assumptions */}
      <section style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '0 2rem 3rem',
      }}>
        <h2 style={{
          fontFamily: 'var(--font-space-grotesk)',
          fontSize: '1.5rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '1.5rem',
        }}>Standard Assumptions</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
          gap: '1rem',
        }}>
          {assumptions.map((item) => (
            <div key={item.title} style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              gap: '1rem',
              alignItems: 'flex-start',
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--accent-cyan)',
                marginTop: '0.45rem',
                flexShrink: 0,
              }} />
              <div>
                <div style={{
                  fontFamily: 'var(--font-space-grotesk)',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: '0.35rem',
                }}>{item.title}</div>
                <div style={{
                  fontFamily: 'var(--font-nunito)',
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                }}>{item.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Data sources */}
      <section style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '0 2rem 4rem',
      }}>
        <h2 style={{
          fontFamily: 'var(--font-space-grotesk)',
          fontSize: '1.5rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '2rem',
        }}>Data Sources by Provider</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {sources.map((provider) => (
            <div key={provider.provider} style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
              overflow: 'hidden',
            }}>
              <div style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                background: 'var(--bg-tertiary)',
              }}>
                <span style={{ fontSize: '1.2rem' }}>{provider.icon}</span>
                <h3 style={{
                  fontFamily: 'var(--font-space-grotesk)',
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  margin: 0,
                }}>{provider.provider}</h3>
                <div style={{
                  width: '32px',
                  height: '3px',
                  borderRadius: '2px',
                  background: provider.color,
                  marginLeft: 'auto',
                }} />
              </div>
              <div style={{ padding: '1rem 1.5rem' }}>
                {provider.sources.map((source, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    gap: '1rem',
                    padding: '0.75rem 0',
                    borderBottom: idx < provider.sources.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                    alignItems: 'flex-start',
                  }}>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: 'var(--font-nunito)',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: 'var(--accent-cyan)',
                        textDecoration: 'none',
                        minWidth: '220px',
                        flexShrink: 0,
                      }}
                    >
                      {source.label} ↗
                    </a>
                    <span style={{
                      fontFamily: 'var(--font-nunito)',
                      fontSize: '0.85rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5,
                    }}>{source.note}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What we don't model */}
      <section style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '0 2rem 4rem',
      }}>
        <h2 style={{
          fontFamily: 'var(--font-space-grotesk)',
          fontSize: '1.5rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '1rem',
        }}>What We Don't Model</h2>
        <div style={{
          background: 'rgba(168, 85, 247, 0.06)',
          border: '1px solid rgba(168, 85, 247, 0.2)',
          borderRadius: '16px',
          padding: '2rem',
        }}>
          <p style={{
            fontFamily: 'var(--font-nunito)',
            fontSize: '0.95rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            marginBottom: '1rem',
          }}>
            The following cost drivers are real and significant but not included in our calculators. Your actual bill will likely be higher:
          </p>
          <ul style={{
            fontFamily: 'var(--font-nunito)',
            fontSize: '0.9rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.8,
            paddingLeft: '1.5rem',
            margin: 0,
          }}>
            <li><strong style={{ color: 'var(--text-primary)' }}>Reserved Instances / Savings Plans</strong> — can reduce compute by 20–40%; our on-demand numbers represent worst-case</li>
            <li><strong style={{ color: 'var(--text-primary)' }}>Support Plans</strong> — AWS Business Support alone can add 3–10% of monthly spend</li>
            <li><strong style={{ color: 'var(--text-primary)' }}>Data Transfer In</strong> — ingress is generally free from the internet but not between regions or services</li>
            <li><strong style={{ color: 'var(--text-primary)' }}>Tax / VAT</strong> — varies by country and entity type</li>
            <li><strong style={{ color: 'var(--text-primary)' }}>Engineering / Migration Cost</strong> — switching cloud providers or SIEM platforms requires significant engineering time</li>
            <li><strong style={{ color: 'var(--text-primary)' }}>License Fees</strong> — OS, database engine, middleware licenses not included</li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '0 2rem 6rem',
        textAlign: 'center',
      }}>
        <p style={{
          fontFamily: 'var(--font-nunito)',
          fontSize: '1rem',
          color: 'var(--text-secondary)',
          marginBottom: '1.5rem',
        }}>Ready to run the numbers?</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/calculators" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.85rem 2rem',
            borderRadius: '30px',
            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
            color: '#fff',
            fontFamily: 'var(--font-space-grotesk)',
            fontWeight: 700,
            fontSize: '0.95rem',
            textDecoration: 'none',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 212, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          >
            Open Calculators →
          </Link>
          <Link href="/resources" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.85rem 2rem',
            borderRadius: '30px',
            background: 'transparent',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-space-grotesk)',
            fontWeight: 600,
            fontSize: '0.95rem',
            textDecoration: 'none',
            border: '1px solid var(--border-subtle)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent-cyan)';
            e.currentTarget.style.color = 'var(--accent-cyan)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
          >
            Browse FinOps Tools
          </Link>
        </div>
      </section>
    </main>
  );
}
