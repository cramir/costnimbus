import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing Methodology',
  description: 'How Cost Nimbus sources and validates cloud pricing data. Transparent methodology for AWS, Azure, GCP, and SaaS tool pricing used in our calculators.',
  openGraph: {
    title: 'Pricing Methodology | Cost Nimbus',
    description: 'Transparent methodology for how we source, validate, and update cloud pricing data in our calculators.',
    type: 'website',
  },
};

export default function MethodologyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
