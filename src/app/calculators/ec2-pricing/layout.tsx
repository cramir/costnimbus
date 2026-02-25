import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EC2 Pricing Calculator — On-Demand vs Reserved vs Spot Instances',
  description: 'Compare EC2 On-Demand, Reserved Instance (1yr/3yr), and Spot pricing side by side. See exact savings for your instance type, count, and usage hours. Free, no signup.',
  keywords: 'EC2 pricing calculator, reserved instance savings, spot instance cost, AWS EC2 on-demand vs reserved, EC2 pricing comparison',
  openGraph: {
    title: 'EC2 Pricing Calculator | Cost Nimbus',
    description: 'On-Demand vs Reserved vs Spot — see exactly how much you save with each EC2 purchasing option.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EC2 Pricing Calculator | Cost Nimbus',
    description: 'On-Demand vs Reserved Instances vs Spot — real EC2 cost comparison for your workload.',
  },
};

export default function EC2PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
