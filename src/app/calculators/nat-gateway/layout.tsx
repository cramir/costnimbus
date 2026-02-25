import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NAT Gateway Cost Calculator',
  description: 'Calculate how much you can save by replacing AWS NAT Gateway with VPC endpoints. Engineers routinely cut 80–91% off their NAT bills. Free, real numbers.',
  keywords: 'NAT gateway cost, AWS NAT gateway savings, VPC endpoints, AWS cost optimization, NAT gateway calculator',
  openGraph: {
    title: 'NAT Gateway Cost Calculator | Cost Nimbus',
    description: 'See your exact NAT Gateway savings with VPC endpoints. Up to 91% cost reduction. No signup required.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NAT Gateway Cost Calculator | Cost Nimbus',
    description: 'See your exact NAT Gateway savings with VPC endpoints. Up to 91% cost reduction.',
  },
};

export default function NatGatewayLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
