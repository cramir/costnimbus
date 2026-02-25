import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://costnimbus.com';

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/article/how-i-saved-50k-month-in-cloud-costs`,
      lastModified: new Date('2026-02-20'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/calculators`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/calculators/nat-gateway`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/calculators/storage`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/calculators/siem`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/calculators/cloud-compare`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/calculators/managed-db`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/article/how-to-cut-aws-egress-costs`,
      lastModified: new Date('2026-02-25'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/article/azure-vs-aws-dotnet`,
      lastModified: new Date('2026-02-25'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/methodology`,
      lastModified: new Date('2026-02-25'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/calculators/serverless`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/calculators/ec2-pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/article/kubernetes-cost-optimization`,
      lastModified: new Date('2026-02-25'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/calculators/ebs-storage`,
      lastModified: new Date('2026-02-25'),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/calculators/cdn`,
      lastModified: new Date('2026-02-25'),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/article/lambda-cold-starts`,
      lastModified: new Date('2026-02-25'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/article/savings-plans-vs-reserved-instances`,
      lastModified: new Date('2026-02-25'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/calculators/finops-maturity`,
      lastModified: new Date('2026-02-25'),
      changeFrequency: 'monthly',
      priority: 0.88,
    },
    {
      url: `${baseUrl}/article/rds-vs-aurora-cost-comparison`,
      lastModified: new Date('2026-02-25'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ];
}
