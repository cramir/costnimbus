import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPlaybooks, getPlaybookById, generateMermaidFlowchart } from '@/lib/playbooks';
import PlaybookDetailClient from './PlaybookDetailClient';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const playbooks = getAllPlaybooks();
  return playbooks.map(p => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const playbook = getPlaybookById(id);
  if (!playbook) return { title: 'Playbook Not Found' };
  return {
    title: `${playbook.name} – IR Playbook`,
    description: `Step-by-step incident response playbook for ${playbook.name}. ${playbook.steps.length} steps covering ${playbook.mitre_attack.join(', ')}.`,
    alternates: { canonical: `/playbooks/${id}/` },
  };
}

export default async function PlaybookDetailPage({ params }: Props) {
  const { id } = await params;
  const playbook = getPlaybookById(id);

  if (!playbook) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</p>
          <h1 style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: '1.5rem', marginBottom: '0.75rem' }}>Playbook not found</h1>
          <Link href="/playbooks/" style={{ color: 'var(--accent-cyan)' }}>← Back to Playbooks</Link>
        </div>
      </div>
    );
  }

  const mermaidChart = generateMermaidFlowchart(playbook);

  return <PlaybookDetailClient playbook={playbook} mermaidChart={mermaidChart} />;
}
