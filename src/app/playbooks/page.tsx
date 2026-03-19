import type { Metadata } from 'next';
import { getAllPlaybooks, getAllCategories, getAllSeverities } from '@/lib/playbooks';
import PlaybooksClient from './PlaybooksClient';

export const metadata: Metadata = {
  title: 'SOC Incident Response Playbooks',
  description: 'Free, open-source SOC incident response playbooks covering ransomware, phishing, cloud attacks, and more. Built for modern security teams.',
  alternates: {
    canonical: '/playbooks/',
  },
};

export default function PlaybooksPage() {
  const playbooks = getAllPlaybooks();
  const categories = getAllCategories();
  const severities = getAllSeverities();

  return (
    <PlaybooksClient
      playbooks={playbooks}
      categories={categories}
      severities={severities}
    />
  );
}
