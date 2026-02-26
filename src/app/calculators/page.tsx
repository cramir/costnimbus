import Link from 'next/link';
import type { Metadata } from 'next';
import NewsletterCard from '@/components/newsletter-card';

export const metadata: Metadata = {
  title: 'Cloud Cost Calculators',
  description: 'Free interactive calculators for AWS, cloud storage, SIEM, and more. Real numbers, no fluff.',
};

const calculators = [
  {
    href: '/calculators/nat-gateway',
    title: 'NAT Gateway Cost Calculator',
    description: 'See how much you can save by replacing NAT Gateway with VPC endpoints for S3, DynamoDB, and other AWS services. Engineers routinely cut 80–91% off their NAT bills.',
    icon: '🔀',
    badge: 'Popular',
    badgeColor: 'var(--accent-cyan)',
    savings: 'Up to 91% savings',
    tags: ['AWS', 'Networking', 'VPC'],
  },
  {
    href: '/calculators/storage',
    title: 'S3 vs R2 vs Backblaze B2',
    description: 'Compare real monthly costs for your storage workload across AWS S3, Cloudflare R2, and Backblaze B2. R2\'s zero-egress model saves most teams 60–80% vs S3.',
    icon: '🗄️',
    badge: 'New',
    badgeColor: '#4ade80',
    savings: 'Up to 80% savings',
    tags: ['Storage', 'Egress', 'S3', 'R2'],
  },
  {
    href: '/calculators/siem',
    title: 'SIEM Total Cost Calculator',
    description: 'True TCO comparison across Splunk, Microsoft Sentinel, Elastic SIEM, and Wazuh — including hidden costs: compute, storage, and engineering time.',
    icon: '🛡️',
    badge: 'New',
    badgeColor: '#4ade80',
    savings: 'Quantify the switch',
    tags: ['SIEM', 'Security', 'Splunk', 'Wazuh'],
  },
  {
    href: '/calculators/cloud-compare',
    title: 'Cloud Provider Comparison',
    description: 'AWS vs Azure vs GCP for compute, storage, managed databases, and egress — side by side. Enter your workload, see exactly which provider wins for your numbers.',
    icon: '⚖️',
    badge: 'New',
    badgeColor: '#4ade80',
    savings: 'Find the cheapest cloud',
    tags: ['AWS', 'Azure', 'GCP', 'Multi-cloud'],
  },
  {
    href: '/calculators/managed-db',
    title: 'Managed Database Calculator',
    description: 'Real monthly TCO: RDS vs Aurora vs Aurora Serverless vs PlanetScale vs Neon. See which managed database is actually cheapest for your compute, storage, and I/O mix.',
    icon: '🗃️',
    badge: 'New',
    badgeColor: '#4ade80',
    savings: 'Find the cheapest DB',
    tags: ['RDS', 'Aurora', 'PlanetScale', 'Neon', 'Database'],
  },
  {
    href: '/calculators/serverless',
    title: 'Serverless Cost Calculator',
    description: 'Lambda vs Azure Functions vs GCP Cloud Functions vs Cloudflare Workers vs Vercel. Enter your invocations, duration, and memory — see the real monthly cost per platform.',
    icon: '⚡',
    badge: 'New',
    badgeColor: '#4ade80',
    savings: 'Find the cheapest FaaS',
    tags: ['Lambda', 'Serverless', 'Azure Functions', 'GCP', 'Cloudflare'],
  },
  {
    href: '/calculators/ec2-pricing',
    title: 'EC2 Pricing Calculator',
    description: 'On-Demand vs Reserved Instances (1yr/3yr No/Partial/All Upfront) vs Spot — side by side for any instance type and usage pattern. See your exact annual savings.',
    icon: '💰',
    badge: 'New',
    badgeColor: '#4ade80',
    savings: 'Up to 60% savings',
    tags: ['EC2', 'Reserved Instances', 'Spot', 'AWS Compute'],
  },
  {
    href: '/calculators/ebs-storage',
    title: 'EBS Volume Cost Calculator',
    description: 'Compare gp3, gp2, io2, io1, st1, sc1 — with full IOPS and throughput breakdowns. See exactly why gp3 beats gp2 and when to use io2 Block Express.',
    icon: '💾',
    badge: 'New',
    badgeColor: '#4ade80',
    savings: 'gp3 saves ~20% vs gp2',
    tags: ['EBS', 'AWS', 'Block Storage', 'IOPS'],
  },
  {
    href: '/calculators/cdn',
    title: 'CDN Cost Calculator',
    description: 'CloudFront vs Cloudflare vs Fastly vs BunnyCDN — real monthly costs for your bandwidth and request volume. BunnyCDN is often 85%+ cheaper than CloudFront.',
    icon: '🌐',
    badge: 'New',
    badgeColor: '#4ade80',
    savings: 'Up to 85% savings',
    tags: ['CDN', 'CloudFront', 'Cloudflare', 'Egress'],
  },
  {
    href: '/calculators/finops-maturity',
    title: 'FinOps Maturity Assessment',
    description: '15 questions across 5 dimensions — Visibility, Optimization, Planning, Governance, and Culture. Get your maturity score and a personalized action plan.',
    icon: '📋',
    badge: 'New',
    badgeColor: '#4ade80',
    savings: 'Find your gaps',
    tags: ['FinOps', 'Maturity', 'Assessment', 'Governance'],
  },
];

export default function CalculatorsPage() {
  return (
    <main className="min-h-screen pt-28 pb-20 calc-main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Cloud Cost Calculators",
          "description": "Free interactive calculators for AWS, cloud storage, SIEM, and more. Real numbers, no fluff.",
          "url": "https://costnimbus.com/calculators",
          "creator": {
            "@type": "Organization",
            "name": "Cost Nimbus",
            "url": "https://costnimbus.com"
          },
          "hasPart": calculators.map((c) => ({
            "@type": "WebApplication",
            "name": c.title,
            "description": c.description,
            "url": `https://costnimbus.com${c.href}`,
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          }))
        }) }}
      />
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-10 pb-12 text-center">
        <span className="inline-block mb-4 text-xs font-bold uppercase tracking-[0.2em] px-5 py-2 rounded-full"
          style={{ color: 'var(--accent-cyan)', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)' }}>
          Free Tools
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-5"
          style={{
            fontFamily: 'var(--font-space-grotesk)',
            background: 'linear-gradient(135deg, var(--text-primary) 40%, var(--accent-cyan) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
          Cloud Cost Calculators
        </h1>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          Real numbers. No vendor BS. Built by engineers who&apos;ve actually cut these bills.
          Enter your numbers and see exactly where your money goes — and how to keep more of it.
        </p>
      </section>

      {/* Calculator Cards */}
      <section className="max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-6">
          {calculators.map((c) => (
            <CalculatorCard key={c.href} {...c} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-6 mt-20">
        <NewsletterCard
          size="md"
          headline="Want more calculators?"
          description="We ship new tools every week. Subscribe to get early access."
        />
      </section>
    </main>
  );
}

function CalculatorCard({
  href, title, description, icon, badge, badgeColor, savings, tags, disabled,
}: {
  href: string; title: string; description: string; icon: string;
  badge: string; badgeColor: string; savings: string; tags: string[]; disabled?: boolean;
}) {
  const Inner = (
    <div className="rounded-2xl p-6 h-full flex flex-col transition-all duration-300 group-hover:shadow-lg"
      style={{ background: 'var(--bg-card)', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <span className="text-4xl">{icon}</span>
        <span className="text-xs font-bold px-3 py-1 rounded-full"
          style={{
            background: disabled ? 'rgba(255,255,255,0.05)' : `${badgeColor}15`,
            color: badgeColor,
            border: `1px solid ${badgeColor}40`,
          }}>
          {badge}
        </span>
      </div>

      {/* Title */}
      <h2 className="text-xl font-bold mb-3 group-hover:text-cyan-400 transition-colors"
        style={{ fontFamily: 'var(--font-space-grotesk)', color: disabled ? 'var(--text-muted)' : 'var(--text-primary)' }}>
        {title}
      </h2>

      {/* Description */}
      <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: 'var(--text-secondary)' }}>
        {description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map(t => (
          <span key={t} className="text-[10px] px-2.5 py-1 rounded-full font-semibold"
            style={{ background: 'rgba(0,212,255,0.06)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }}>
            {t}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <span className="text-xs font-semibold" style={{ color: disabled ? 'var(--text-muted)' : '#4ade80' }}>
          {savings}
        </span>
        {!disabled && (
          <span className="text-xs flex items-center gap-1.5 font-semibold transition-all group-hover:gap-2.5"
            style={{ color: 'var(--accent-cyan)' }}>
            Open Calculator
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        )}
      </div>
    </div>
  );

  if (disabled) {
    return (
      <div className="rounded-2xl p-[1px] opacity-50" style={{ background: 'var(--border-subtle)' }}>
        {Inner}
      </div>
    );
  }

  return (
    <Link href={href} className="group rounded-2xl p-[1px] block transition-all duration-300 hover:-translate-y-1"
      style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.25), rgba(168,85,247,0.25))' }}>
      {Inner}
    </Link>
  );
}
