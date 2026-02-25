import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SIEM Total Cost of Ownership Calculator',
  description: 'True TCO comparison across Splunk, Microsoft Sentinel, Elastic SIEM, and Wazuh — including compute, storage, and FTE costs. Find the cheapest SIEM for your log volume.',
  keywords: 'SIEM cost calculator, Splunk pricing, Microsoft Sentinel cost, Elastic SIEM, Wazuh TCO, SIEM comparison',
  openGraph: {
    title: 'SIEM TCO Calculator: Splunk vs Sentinel vs Elastic vs Wazuh | Cost Nimbus',
    description: 'See the true total cost of each SIEM including hidden costs. Enter your log volume and get real numbers.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SIEM TCO Calculator | Cost Nimbus',
    description: 'Splunk vs Sentinel vs Elastic vs Wazuh — true TCO including compute, storage, and FTE costs.',
  },
};

export default function SIEMLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
