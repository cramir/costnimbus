import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'S3 vs R2 vs Backblaze B2 Storage Calculator',
  description: 'Compare real monthly storage costs across AWS S3, Cloudflare R2, and Backblaze B2. Factor in storage GB, GET/PUT requests, and egress. R2\'s zero-egress model saves most teams 60–80% vs S3.',
  keywords: 'S3 vs R2, Backblaze B2, cloud storage cost comparison, S3 pricing, Cloudflare R2 pricing, storage calculator',
  openGraph: {
    title: 'S3 vs R2 vs Backblaze B2 Storage Calculator | Cost Nimbus',
    description: 'Find out exactly how much you\'d save switching from AWS S3 to Cloudflare R2 or Backblaze B2. Real pricing, no fluff.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'S3 vs R2 vs Backblaze B2 Storage Calculator | Cost Nimbus',
    description: 'Compare S3, R2, and Backblaze B2 costs for your exact workload. Zero-egress R2 often wins.',
  },
};

export default function StorageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
