import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EBS Storage Calculator — gp3 vs gp2 vs io2 vs Azure Disk vs GCP PD',
  description: 'Compare AWS EBS (gp3, gp2, io2), Azure Disk, and GCP Persistent Disk monthly costs. gp3 saves 20% vs gp2 at baseline — see your exact number.',
  keywords: 'EBS calculator, gp3 vs gp2, io2 pricing, Azure Disk cost, GCP Persistent Disk, block storage comparison, AWS EBS pricing',
  openGraph: {
    title: 'EBS Storage Calculator | Cost Nimbus',
    description: 'Compare AWS EBS (gp3, gp2, io2), Azure Disk, and GCP Persistent Disk monthly costs.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EBS Storage Calculator | Cost Nimbus',
    description: 'gp3 vs gp2 vs io2 vs Azure Disk vs GCP PD — real monthly cost comparison for your block storage.',
  },
};

export default function EBSStorageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
