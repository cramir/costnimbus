import ConsultingContent from '@/components/consulting-content';

export const metadata = {
  title: 'Cloud Cost Consulting — Cost Nimbus',
  description: 'Expert cloud cost optimization consulting. Average client saves $50K+ in the first 90 days. AWS, GCP, Azure cost audits, FinOps assessments, and GPU workload optimization.',
  keywords: 'cloud cost consulting, AWS cost optimization, FinOps consulting, cloud audit, GPU cost management, SOC infrastructure',
  alternates: {
    canonical: '/consulting/',
  },
  openGraph: {
    title: 'Cloud Cost Consulting — Cost Nimbus',
    description: 'Expert cloud cost optimization consulting. Average client saves $50K+ in the first 90 days.',
    url: 'https://costnimbus.com/consulting',
  },
};

export default function ConsultingPage() {
  return <ConsultingContent />;
}
