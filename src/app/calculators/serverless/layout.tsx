import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Serverless Cost Calculator — Lambda vs Azure Functions vs GCP vs Cloudflare Workers',
  description: 'Free interactive calculator comparing monthly costs for AWS Lambda, Azure Functions, GCP Cloud Functions, Cloudflare Workers, and Vercel Functions. Real pricing, free tier included.',
  keywords: 'serverless cost calculator, AWS Lambda pricing, Azure Functions cost, GCP Cloud Functions, Cloudflare Workers pricing, serverless comparison',
  openGraph: {
    title: 'Serverless Cost Calculator | Cost Nimbus',
    description: 'Compare Lambda vs Azure Functions vs GCP vs Cloudflare Workers. Real monthly costs for your invocation + duration mix.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Serverless Cost Calculator | Cost Nimbus',
    description: 'Lambda vs Azure Functions vs GCP vs Cloudflare Workers — real monthly cost comparison.',
  },
};

export default function ServerlessLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
