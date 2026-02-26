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
    <main className="calc-main min-h-screen pt-20">
      {/* Hero */}
      <section className="method-section px-8 pt-16 pb-12" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="method-hero-pill">Transparent by design</div>
        <h1 className="method-heading">Pricing Methodology</h1>
        <p className="method-lead">
          Every number in our calculators comes from a verifiable public source. No estimates, no sponsor adjustments, no hidden assumptions. Here&apos;s exactly where each price comes from — and what we assume when data is ambiguous.
        </p>
      </section>

      {/* Update cadence */}
      <section className="method-section px-8 py-12">
        <div className="cadence-card">
          <div className="cadence-bar" />
          <div className="flex-1 min-w-[200px]">
            <div className="cadence-label cadence-label-cyan">Last Updated</div>
            <div className="cadence-value">Q1 2026</div>
            <div className="cadence-subtext">February 2026</div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="cadence-label cadence-label-purple">Update Frequency</div>
            <div className="cadence-body">
              Prices reviewed quarterly. AWS, Azure, and GCP rarely change list prices — when they do (spot, savings plans, new SKUs), we update within 30 days.
            </div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="cadence-label cadence-label-green">Report an Error</div>
            <div className="cadence-body">
              Found a price discrepancy? We take accuracy seriously. Open an issue on{' '}
              <a
                href="https://github.com/cramir/costnimbus"
                target="_blank"
                rel="noopener noreferrer"
                className="link-accent-cyan"
              >GitHub</a>.
            </div>
          </div>
        </div>
      </section>

      {/* Assumptions */}
      <section className="method-section px-8 pb-12">
        <h2 className="method-section-heading mb-6">Standard Assumptions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {assumptions.map((item) => (
            <div key={item.title} className="assumption-card">
              <div className="assumption-dot" />
              <div>
                <div className="assumption-title">{item.title}</div>
                <div className="assumption-detail">{item.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Data sources */}
      <section className="method-section px-8 pb-16">
        <h2 className="method-section-heading mb-8">Data Sources by Provider</h2>
        <div className="flex flex-col gap-6">
          {sources.map((provider) => (
            <div key={provider.provider} className="provider-card">
              <div className="provider-header">
                <span className="text-xl" aria-hidden="true">{provider.icon}</span>
                <h3 className="provider-name">{provider.provider}</h3>
                <div className="w-8 h-[3px] rounded-sm ml-auto" style={{ background: provider.color }} />
              </div>
              <div className="px-6 py-4">
                {provider.sources.map((source, idx) => (
                  <div key={idx} className="source-row" style={{
                    borderBottom: idx < provider.sources.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  }}>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="source-link"
                    >
                      {source.label} ↗
                    </a>
                    <span className="source-note">{source.note}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What we don&apos;t model */}
      <section className="method-section px-8 pb-16">
        <h2 className="method-section-heading mb-4">What We Don&apos;t Model</h2>
        <div className="warning-box">
          <p className="warning-text">
            The following cost drivers are real and significant but not included in our calculators. Your actual bill will likely be higher:
          </p>
          <ul className="warning-list">
            <li><strong>Reserved Instances / Savings Plans</strong> — can reduce compute by 20–40%; our on-demand numbers represent worst-case</li>
            <li><strong>Support Plans</strong> — AWS Business Support alone can add 3–10% of monthly spend</li>
            <li><strong>Data Transfer In</strong> — ingress is generally free from the internet but not between regions or services</li>
            <li><strong>Tax / VAT</strong> — varies by country and entity type</li>
            <li><strong>Engineering / Migration Cost</strong> — switching cloud providers or SIEM platforms requires significant engineering time</li>
            <li><strong>License Fees</strong> — OS, database engine, middleware licenses not included</li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="method-section px-8 pb-24 text-center">
        <p className="method-lead mx-auto mb-6">Ready to run the numbers?</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/calculators" className="btn-pill-primary">
            Open Calculators →
          </Link>
          <Link href="/resources" className="btn-pill-outline">
            Browse FinOps Tools
          </Link>
        </div>
      </section>
    </main>
  );
}
