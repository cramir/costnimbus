import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const SITE_URL = 'https://costnimbus.com';
const contentDir = path.join(process.cwd(), 'src/content');

// ── Calculator registry (matches home-content.tsx) ──
const CALCULATORS = [
  { slug: 'nat-gateway', title: 'NAT Gateway Calculator', description: 'Compare VPC endpoint costs vs NAT Gateway — most teams save 80-91%.' },
  { slug: 'storage', title: 'S3 vs R2 vs Backblaze Storage Calculator', description: 'Compare object storage costs across providers with egress pricing analysis.' },
  { slug: 'managed-db', title: 'Managed Database TCO Calculator', description: 'RDS vs Aurora vs PlanetScale vs Neon — real cost for your instance and I/O mix.' },
  { slug: 'cloud-compare', title: 'AWS vs Azure vs GCP Calculator', description: 'Compare compute, storage, and egress across all three major clouds.' },
  { slug: 'serverless', title: 'Serverless Calculator', description: 'Lambda vs Azure Functions vs GCP vs Cloudflare Workers cost comparison.' },
  { slug: 'ec2-pricing', title: 'EC2 Pricing Calculator', description: 'On-Demand vs Reserved Instances vs Spot pricing across 20+ instance types.' },
  { slug: 'ebs-storage', title: 'EBS Volume Cost Calculator', description: 'gp3 vs gp2 vs io2 with IOPS and throughput breakdowns.' },
  { slug: 'cdn', title: 'CDN Cost Calculator', description: 'CloudFront vs Cloudflare vs Fastly vs BunnyCDN bandwidth cost comparison.' },
  { slug: 'finops-maturity', title: 'FinOps Maturity Assessment', description: '15-question assessment to score your cloud financial management maturity.' },
  { slug: 'siem', title: 'SIEM Cost Calculator', description: 'Compare SIEM platform costs based on your log ingestion volume.' },
];

// ── Read all articles once ──
function getAllArticles() {
  let fileNames;
  try {
    fileNames = fs.readdirSync(contentDir);
  } catch {
    return [];
  }

  return fileNames
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
    .map((f) => {
      const slug = f.replace(/\.mdx?$/, '');
      const raw = fs.readFileSync(path.join(contentDir, f), 'utf8');
      const { data, content } = matter(raw);
      const publishDate = data.publishDate || (data.pubDate instanceof Date
        ? data.pubDate.toISOString().split('T')[0]
        : typeof data.pubDate === 'string'
        ? data.pubDate
        : '');
      return {
        slug,
        title: data.title || '',
        description: data.description || '',
        publishDate,
        category: data.category || '',
        content,
      };
    })
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
}

// ── XML helpers ──
function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// ── Generate RSS feed ──
function generateRSS(articles) {
  const now = new Date().toUTCString();
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Cost Nimbus</title>
    <link>${SITE_URL}</link>
    <description>Cloud cost intelligence built by engineers, for engineers. Real numbers, no vendor fluff.</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${articles
  .map(
    (a) => `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${SITE_URL}/article/${a.slug}/</link>
      <guid isPermaLink="true">${SITE_URL}/article/${a.slug}/</guid>
      <description>${escapeXml(a.description)}</description>
      <pubDate>${new Date(a.publishDate).toUTCString()}</pubDate>
      <category>${escapeXml(a.category)}</category>
    </item>`
  )
  .join('\n')}
  </channel>
</rss>
`;
  const out = path.join(process.cwd(), 'public/feed.xml');
  fs.writeFileSync(out, rss, 'utf8');
  console.log(`✓ feed.xml (${articles.length} articles)`);
}

// ── Generate llms.txt ──
function generateLlmsTxt(articles) {
  const lines = [
    '# Cost Nimbus',
    '',
    '> Cost Nimbus is a free resource for cloud engineers and FinOps practitioners. It provides battle-tested guides, interactive cost calculators, and open-source tools for reducing cloud infrastructure spend — built by Cesar Ramirez, a SOC infrastructure engineer who saved $50K/month in production cloud costs.',
    '',
    'The site focuses on AWS, Azure, and GCP cost optimization with real ROI numbers and step-by-step implementation details. All content is practitioner-written from production experience, not vendor marketing.',
    '',
    '## Guides',
    '',
  ];

  for (const a of articles) {
    lines.push(`- [${a.title}](${SITE_URL}/article/${a.slug}): ${a.description}`);
  }

  lines.push('', '## Calculators', '');
  for (const c of CALCULATORS) {
    lines.push(`- [${c.title}](${SITE_URL}/calculators/${c.slug}): ${c.description}`);
  }

  lines.push('', '## Optional', '');
  lines.push(`- [About](${SITE_URL}/about): Background on Cesar Ramirez and the Cost Nimbus project.`);
  lines.push(`- [All Articles](${SITE_URL}/articles): Full index of all guides and articles.`);
  lines.push(`- [All Calculators](${SITE_URL}/calculators): Full index of all interactive calculators.`);
  lines.push(`- [Resources](${SITE_URL}/resources): Curated external resources for cloud cost optimization.`);
  lines.push(`- [Methodology](${SITE_URL}/methodology): How calculator estimates and cost comparisons are derived.`);

  const out = path.join(process.cwd(), 'public/llms.txt');
  fs.writeFileSync(out, lines.join('\n') + '\n', 'utf8');
  console.log(`✓ llms.txt (${articles.length} articles, ${CALCULATORS.length} calculators)`);
}

// ── Generate llms-full.txt ──
function generateLlmsFullTxt(articles) {
  const lines = [
    '# Cost Nimbus',
    '',
    '> Cost Nimbus is a free resource for cloud engineers and FinOps practitioners. It provides battle-tested guides, interactive cost calculators, and open-source tools for reducing cloud infrastructure spend — built by Cesar Ramirez, a SOC infrastructure engineer who saved $50K/month in production cloud costs.',
    '',
  ];

  for (const a of articles) {
    lines.push(`## ${a.title}`, '');
    lines.push(`Source: ${SITE_URL}/article/${a.slug}`, '');
    lines.push(a.content.trim(), '', '---', '');
  }

  lines.push('## Calculators', '');
  for (const c of CALCULATORS) {
    lines.push(`- [${c.title}](${SITE_URL}/calculators/${c.slug}): ${c.description}`);
  }

  const out = path.join(process.cwd(), 'public/llms-full.txt');
  fs.writeFileSync(out, lines.join('\n') + '\n', 'utf8');
  console.log(`✓ llms-full.txt (${articles.length} articles with full content)`);
}

// ── Main ──
const articles = getAllArticles();
generateRSS(articles);
generateLlmsTxt(articles);
generateLlmsFullTxt(articles);
console.log('Build assets generated successfully.');
