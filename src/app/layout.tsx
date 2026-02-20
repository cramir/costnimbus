import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cost Nimbus - Cloud Cost Intelligence',
  description: 'Real cloud cost optimization strategies with concrete ROI. Save money on AWS, Azure, and GCP.',
  keywords: 'cloud costs, AWS optimization, FinOps, cloud savings, cost management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
