import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AWS vs Azure vs GCP Cloud Cost Calculator',
  description: 'Compare AWS, Microsoft Azure, and Google Cloud Platform costs for your exact workload — compute, storage, databases, and egress. Find the cheapest cloud for your use case.',
  keywords: 'AWS vs Azure vs GCP, cloud cost comparison, AWS pricing, Azure pricing, GCP pricing, multi-cloud calculator',
  openGraph: {
    title: 'AWS vs Azure vs GCP Cloud Cost Calculator | Cost Nimbus',
    description: 'Enter your workload specs and see exactly which cloud provider costs less. Real Q1 2026 pricing.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AWS vs Azure vs GCP Calculator | Cost Nimbus',
    description: 'Find the cheapest cloud for your workload. Compute, storage, databases, and egress compared.',
  },
};

export default function CloudCompareLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
