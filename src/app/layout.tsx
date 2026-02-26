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

const SITE_URL = 'https://costnimbus.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
    url: SITE_URL,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Cost Nimbus - Cloud Cost Intelligence' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cost Nimbus - Cloud Cost Intelligence',
    description: 'Real cloud cost optimization strategies built by engineers, for engineers. Save thousands monthly with battle-tested techniques.',
    images: ['/og-image.png'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Cost Nimbus',
  url: SITE_URL,
  description: 'Cloud cost intelligence built by engineers, for engineers. Real numbers, no vendor fluff.',
  logo: `${SITE_URL}/og-image.png`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="alternate" type="application/rss+xml" title="Cost Nimbus" href="/feed.xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${nunito.variable} ${jetbrainsMono.variable} antialiased`}
        style={{
          fontFamily: 'var(--font-nunito)',
        }}
      >
        <a href="#main-content" className="skip-to-content">Skip to content</a>
        <Nav />
        <main id="main-content">
          {children}
        </main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
