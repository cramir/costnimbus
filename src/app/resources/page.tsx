import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'FinOps Resources & Open Source Tools',
  description: 'Curated open-source FinOps tools and resources: cost visibility, optimization, governance, and more. No paywalls, no vendor lock-in.',
};

interface Resource {
  name: string;
  url: string;
  description: string;
  tags: string[];
  stars?: string;
  license: string;
  highlight?: string;
}

interface Category {
  id: string;
  label: string;
  icon: string;
  color: string;
  description: string;
  resources: Resource[];
}

const categories: Category[] = [
  {
    id: 'visibility',
    label: 'Cost Visibility',
    icon: '🔍',
    color: '#00d4ff',
    description: 'See where your cloud spend actually goes — by team, service, or resource.',
    resources: [
      {
        name: 'Infracost',
        url: 'https://github.com/infracost/infracost',
        description: 'Cloud cost estimates for Terraform in pull requests. See cost impact before you ship infrastructure changes.',
        tags: ['Terraform', 'CI/CD', 'IaC'],
        stars: '10.5k',
        license: 'Apache 2.0',
        highlight: 'Integrates with GitHub Actions, GitLab CI, Jenkins',
      },
      {
        name: 'OpenCost',
        url: 'https://github.com/opencost/opencost',
        description: 'Kubernetes-native cost monitoring by CNCF. Real-time cost allocation for workloads, namespaces, and labels.',
        tags: ['Kubernetes', 'CNCF', 'Real-time'],
        stars: '5.2k',
        license: 'Apache 2.0',
        highlight: 'CNCF sandbox project — production-ready',
      },
      {
        name: 'Komiser',
        url: 'https://github.com/tailwarden/komiser',
        description: 'Cloud-agnostic cost dashboard. Inventory and cost analysis across AWS, Azure, GCP, OCI, and more.',
        tags: ['Multi-cloud', 'Dashboard', 'AWS', 'GCP', 'Azure'],
        stars: '3.8k',
        license: 'Elastic License 2.0',
        highlight: 'Supports 14+ cloud providers',
      },
      {
        name: 'Cloud Custodian',
        url: 'https://github.com/cloud-custodian/cloud-custodian',
        description: 'Rules engine for cloud resource management. Find orphaned resources, enforce tagging policies, and auto-remediate.',
        tags: ['Policy', 'Multi-cloud', 'Automation'],
        stars: '5.6k',
        license: 'Apache 2.0',
        highlight: 'Used at Netflix, Capital One, Amazon',
      },
    ],
  },
  {
    id: 'optimization',
    label: 'Optimization',
    icon: '⚡',
    color: '#a855f7',
    description: 'Right-size, schedule, and eliminate waste automatically.',
    resources: [
      {
        name: 'Kubecost',
        url: 'https://github.com/kubecost/cost-analyzer-helm-chart',
        description: 'Kubernetes cost allocation with rightsizing recommendations. Identify overprovisioned pods and namespaces.',
        tags: ['Kubernetes', 'Rightsizing', 'Helm'],
        stars: '2.1k',
        license: 'Apache 2.0',
        highlight: 'Free tier covers 1 cluster',
      },
      {
        name: 'aws-nuke',
        url: 'https://github.com/rebuy-de/aws-nuke',
        description: 'Remove all AWS resources from an account. Essential for cleaning up dev/test environments before they bleed cost.',
        tags: ['AWS', 'Cleanup', 'Dev/Test'],
        stars: '5.8k',
        license: 'MIT',
        highlight: '⚠ Use with care — destructive by design',
      },
      {
        name: 'ec2instances.info',
        url: 'https://github.com/vantage-sh/ec2instances.info',
        description: 'Interactive EC2 instance type comparison. Filter by vCPU, RAM, network, and price. Indispensable for rightsizing.',
        tags: ['AWS', 'EC2', 'Comparison'],
        stars: '3.9k',
        license: 'MIT',
        highlight: 'Also covers RDS, ElastiCache, Lambda',
      },
      {
        name: 'Spot Ocean (Ocean Controller)',
        url: 'https://github.com/spotinst/spot-ocean-controller',
        description: 'Intelligent Spot Instance management for Kubernetes. Automatically replaces on-demand with spot nodes, handles interruptions.',
        tags: ['Kubernetes', 'Spot', 'AWS', 'GCP'],
        stars: '98',
        license: 'Apache 2.0',
        highlight: 'Up to 80% compute cost reduction',
      },
    ],
  },
  {
    id: 'governance',
    label: 'Governance',
    icon: '🏛️',
    color: '#f59e0b',
    description: 'Enforce policies, tag everything, and prevent cost surprises before they happen.',
    resources: [
      {
        name: 'Steampipe',
        url: 'https://github.com/turbot/steampipe',
        description: 'SQL queries across AWS, Azure, GCP, and 140+ providers. Query your entire cloud estate with familiar SQL.',
        tags: ['SQL', 'Multi-cloud', 'Compliance'],
        stars: '7.1k',
        license: 'AGPL 3.0',
        highlight: 'Plugin ecosystem for every major cloud',
      },
      {
        name: 'Terracost',
        url: 'https://github.com/cycloidio/terracost',
        description: 'Terraform cost estimation library. Embed cost awareness directly into your IaC pipelines and automation.',
        tags: ['Terraform', 'Library', 'IaC'],
        stars: '840',
        license: 'Apache 2.0',
        highlight: 'Go library — embed in any tool',
      },
      {
        name: 'Goldilocks',
        url: 'https://github.com/FairwindsOps/goldilocks',
        description: 'Kubernetes resource request/limit recommendations using Vertical Pod Autoscaler. Stop guessing at container sizes.',
        tags: ['Kubernetes', 'VPA', 'Rightsizing'],
        stars: '4.5k',
        license: 'Apache 2.0',
        highlight: 'Dashboard + namespace-level recommendations',
      },
      {
        name: 'Kube-Green',
        url: 'https://github.com/kube-green/kube-green',
        description: 'Automatically suspend Kubernetes workloads when not in use. Perfect for dev/staging clusters that don\'t need to run overnight.',
        tags: ['Kubernetes', 'Scheduling', 'Dev'],
        stars: '1.2k',
        license: 'MIT',
        highlight: 'Up to 40% savings on dev/staging',
      },
    ],
  },
  {
    id: 'calculators',
    label: 'Our Calculators',
    icon: '🧮',
    color: '#4ade80',
    description: 'Interactive cost calculators built by Cost Nimbus — free, no account required.',
    resources: [
      {
        name: 'NAT Gateway Calculator',
        url: '/calculators/nat-gateway',
        description: 'Calculate exact savings from replacing AWS NAT Gateway with VPC endpoints. See the 91% savings scenario with your actual numbers.',
        tags: ['AWS', 'Networking', 'VPC'],
        license: 'Free',
        highlight: 'Shows before/after architecture',
      },
      {
        name: 'Storage Cost Calculator',
        url: '/calculators/storage',
        description: 'S3 vs Cloudflare R2 vs Backblaze B2 — compare real monthly costs for your storage workload including egress.',
        tags: ['S3', 'R2', 'B2', 'Egress'],
        license: 'Free',
        highlight: 'Zero-egress R2 advantage visualized',
      },
      {
        name: 'SIEM TCO Calculator',
        url: '/calculators/siem',
        description: 'True cost comparison: Splunk vs Sentinel vs Elastic vs Wazuh. Includes license + compute + storage + engineering time.',
        tags: ['SIEM', 'Splunk', 'Wazuh', 'Security'],
        license: 'Free',
        highlight: 'Includes hidden costs most ignore',
      },
    ],
  },
];

const externalLinks = [
  { label: 'AWS Pricing Calculator', url: 'https://calculator.aws/pricing/2/home', desc: 'Official AWS cost estimator' },
  { label: 'GCP Pricing Calculator', url: 'https://cloud.google.com/products/calculator', desc: 'Google Cloud cost estimator' },
  { label: 'Azure Pricing Calculator', url: 'https://azure.microsoft.com/en-us/pricing/calculator/', desc: 'Microsoft Azure cost estimator' },
  { label: 'FinOps Foundation', url: 'https://www.finops.org', desc: 'Community standards and training' },
  { label: 'CloudForecast', url: 'https://cloudforecast.io', desc: 'AWS cost reports via Slack' },
  { label: 'Vantage', url: 'https://www.vantage.sh', desc: 'Cloud cost platform with free tier' },
];

export default function ResourcesPage() {
  return (
    <main className="calc-main min-h-screen pt-28 pb-20">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-10 pb-12 text-center">
        <span className="inline-block mb-4 text-xs font-bold uppercase tracking-[0.2em] px-5 py-2 rounded-full"
          style={{ color: 'var(--accent-cyan)', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)' }}>
          Open Source FinOps
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-5"
          style={{
            fontFamily: 'var(--font-space-grotesk)',
            background: 'linear-gradient(135deg, var(--text-primary) 40%, var(--accent-cyan) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
          FinOps Resource Directory
        </h1>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          The best open-source tools for cloud cost visibility, optimization, and governance.
          Curated by engineers — no vendor sponsorships, no paywalls.
        </p>
      </section>

      {/* Categories */}
      <div className="max-w-6xl mx-auto px-6 space-y-16">
        {categories.map((cat) => (
          <CategorySection key={cat.id} category={cat} />
        ))}

        {/* External links */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <span className="text-2xl" aria-hidden="true">🔗</span>
            <div>
              <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--text-primary)' }}>
                More Resources
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Official tools and community platforms</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {externalLinks.map(({ label, url, desc }) => (
              <a key={label} href={url} target="_blank" rel="noopener noreferrer"
                className="group flex items-start gap-3 rounded-xl p-4 transition-all hover:-translate-y-0.5"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                <svg className="mt-0.5 shrink-0 transition-transform group-hover:translate-x-0.5" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M5 3h8v8M13 3L3 13" stroke="var(--accent-cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{desc}</div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Newsletter CTA */}
        <div className="rounded-3xl p-10 md:p-12 text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(0,212,255,0.06) 0%, rgba(168,85,247,0.06) 100%)',
            border: '1px solid rgba(0,212,255,0.15)',
          }}>
          <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full opacity-20 blur-3xl" style={{ background: 'var(--accent-cyan)' }} />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full opacity-20 blur-3xl" style={{ background: 'var(--accent-purple)' }} />
          <h2 className="relative text-2xl md:text-3xl font-bold mb-3"
            style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--text-primary)' }}>
            Suggest a Tool
          </h2>
          <p className="relative text-base mb-8 max-w-md mx-auto" style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            Know an open-source FinOps tool we should add? Subscribe and reply to any email — we read every one.
          </p>
          <form action="https://sendfox.com/form/3qdz96/36enr2" method="post" target="_blank"
            className="relative flex flex-col sm:flex-row gap-4 max-w-sm mx-auto">
            <label htmlFor="suggest-email" className="sr-only">Email address</label>
            <input id="suggest-email" type="email" name="email" placeholder="you@company.com" required
              className="flex-1 px-5 py-3.5 rounded-xl text-sm focus:outline-none"
              style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }} />
            <button type="submit"
              className="px-8 py-3.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.03]"
              style={{ background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))', color: '#0d1117' }}>
              Subscribe
            </button>
          </form>
          <p className="relative text-xs mt-4" style={{ color: 'var(--text-muted)' }}>No spam. Unsubscribe anytime.</p>
        </div>
      </div>
    </main>
  );
}

function CategorySection({ category: cat }: { category: Category }) {
  return (
    <section>
      {/* Category header */}
      <div className="flex items-start gap-4 mb-8">
        <span className="text-3xl" aria-hidden="true">{cat.icon}</span>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--text-primary)' }}>
              {cat.label}
            </h2>
            <span className="h-px flex-1 max-w-[60px]" style={{ background: cat.color, opacity: 0.4 }} />
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{cat.description}</p>
        </div>
      </div>

      {/* Resource cards */}
      <div className="grid md:grid-cols-2 gap-5">
        {cat.resources.map((r) => (
          <ResourceCard key={r.name} resource={r} accentColor={cat.color} />
        ))}
      </div>
    </section>
  );
}

function ResourceCard({ resource: r, accentColor }: { resource: Resource; accentColor: string }) {
  const isInternal = r.url.startsWith('/');

  const inner = (
    <div className="rounded-2xl p-6 h-full flex flex-col transition-colors"
      style={{ background: 'var(--bg-card)', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}>

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-bold text-base group-hover:text-cyan-400 transition-colors"
            style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--text-primary)' }}>
            {r.name}
          </h3>
          {r.stars && (
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>⭐ {r.stars} GitHub stars</span>
          )}
        </div>
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0"
          style={{
            background: `${accentColor}15`,
            color: accentColor,
            border: `1px solid ${accentColor}30`,
          }}>
          {r.license}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: 'var(--text-secondary)' }}>
        {r.description}
      </p>

      {/* Highlight */}
      {r.highlight && (
        <div className="rounded-lg px-3 py-2 mb-4 text-xs font-medium"
          style={{ background: `${accentColor}0d`, color: accentColor, border: `1px solid ${accentColor}20` }}>
          {r.highlight}
        </div>
      )}

      {/* Tags + arrow */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {r.tags.slice(0, 3).map(t => (
            <span key={t} className="text-[10px] px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }}>
              {t}
            </span>
          ))}
        </div>
        <svg className="shrink-0 transition-transform group-hover:translate-x-1" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 8h10M9 4l4 4-4 4" stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );

  const wrapperClass = "group block rounded-2xl p-[1px] transition-all duration-300 hover:-translate-y-1";
  const wrapperStyle = { background: `linear-gradient(135deg, ${accentColor}30, transparent 60%)` };

  if (isInternal) {
    return (
      <Link href={r.url} className={wrapperClass} style={wrapperStyle}>
        {inner}
      </Link>
    );
  }

  return (
    <a href={r.url} target="_blank" rel="noopener noreferrer" className={wrapperClass} style={wrapperStyle}>
      {inner}
    </a>
  );
}
