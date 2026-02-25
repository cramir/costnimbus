import type { Metadata } from 'next';
import { Space_Grotesk, Nunito, JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Nav from '@/components/nav';
import Footer from '@/components/footer';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Cost Nimbus',
    default: 'Cost Nimbus - Cloud Cost Intelligence',
  },
  description: 'Real cloud cost optimization strategies built by engineers, for engineers. Save thousands monthly with battle-tested techniques.',
  keywords: 'cloud costs, AWS optimization, FinOps, cloud savings, cost management',
  openGraph: {
    title: 'Cost Nimbus - Cloud Cost Intelligence',
    description: 'Real cloud cost optimization strategies built by engineers, for engineers. Save thousands monthly with battle-tested techniques.',
    siteName: 'Cost Nimbus',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cost Nimbus - Cloud Cost Intelligence',
    description: 'Real cloud cost optimization strategies built by engineers, for engineers. Save thousands monthly with battle-tested techniques.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${nunito.variable} ${jetbrainsMono.variable} antialiased`}
        style={{
          fontFamily: 'var(--font-nunito)',
        }}
      >
        <Nav />
        {children}
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
