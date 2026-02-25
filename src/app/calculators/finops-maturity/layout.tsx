import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FinOps Maturity Assessment — Where Does Your Team Stand?',
  description: 'Free 15-question assessment that scores your FinOps maturity across 5 dimensions: Visibility, Optimization, Planning, Governance, and Culture. Get actionable recommendations.',
  keywords: 'FinOps maturity model, cloud cost maturity assessment, FinOps framework, cloud financial management, FinOps Crawl Walk Run, cloud cost optimization maturity',
  openGraph: {
    title: 'FinOps Maturity Assessment | Cost Nimbus',
    description: 'Score your FinOps maturity across 5 dimensions and get a personalized action plan.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FinOps Maturity Assessment | Cost Nimbus',
    description: '15 questions. 5 dimensions. Your FinOps maturity score + action plan — free.',
  },
};

export default function FinOpsMaturityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
