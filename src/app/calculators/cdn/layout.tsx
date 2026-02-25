import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CDN Cost Calculator — CloudFront vs Cloudflare vs BunnyCDN vs Fastly',
  description: 'Compare monthly CDN costs: CloudFront, Cloudflare, Fastly, BunnyCDN, KeyCDN, Azure CDN. See when Cloudflare zero-egress saves you real money.',
  keywords: 'CDN cost calculator, CloudFront pricing, Cloudflare vs CloudFront, BunnyCDN pricing, Fastly cost, CDN comparison, Azure CDN pricing',
  openGraph: {
    title: 'CDN Cost Calculator | Cost Nimbus',
    description: 'Compare CDN costs: CloudFront, Cloudflare, Fastly, BunnyCDN, KeyCDN, Azure CDN side by side.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CDN Cost Calculator | Cost Nimbus',
    description: 'CloudFront vs Cloudflare vs BunnyCDN vs Fastly — real monthly CDN cost comparison.',
  },
};

export default function CDNLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
