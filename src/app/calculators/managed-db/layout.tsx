import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Managed Database Cost Calculator — RDS vs Aurora vs PlanetScale vs Neon',
  description: 'Compare true costs of Amazon RDS, Aurora Provisioned, Aurora Serverless v2, PlanetScale, and Neon for your database workload. Includes storage, IOPS, replicas, and hidden costs.',
  keywords: 'RDS vs Aurora, PlanetScale pricing, Neon database cost, managed database comparison, Aurora Serverless v2, database TCO',
  openGraph: {
    title: 'Managed DB Calculator: RDS vs Aurora vs PlanetScale vs Neon | Cost Nimbus',
    description: 'See exact costs for 5 managed database providers. Enter your instance size, storage, and replicas.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Managed Database Cost Calculator | Cost Nimbus',
    description: 'RDS vs Aurora vs PlanetScale vs Neon — total cost for your exact database workload.',
  },
};

export default function ManagedDBLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
