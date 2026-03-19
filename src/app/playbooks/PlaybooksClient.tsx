'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { Playbook } from '@/lib/playbooks';

const CATEGORY_ICONS: Record<string, string> = {
  identity: '🪪',
  'ai-ml': '🤖',
  'api-security': '🔌',
  cloud: '☁️',
  'data-loss': '💾',
  'email-security': '📧',
  endpoint: '💻',
  ransomware: '🔒',
  'supply-chain': '🔗',
};

const SEVERITY_COLORS: Record<string, string> = {
  low: '#22c55e',
  medium: '#f59e0b',
  high: '#ef4444',
  critical: '#dc2626',
};

function SeverityBadge({ severity }: { severity: string }) {
  const color = SEVERITY_COLORS[severity.toLowerCase()] || '#8b949e';
  return (
    <span
      style={{
        background: `${color}18`,
        border: `1px solid ${color}40`,
        color,
        fontSize: '0.7rem',
        fontWeight: 700,
        padding: '2px 8px',
        borderRadius: '999px',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
      }}
    >
      {severity}
    </span>
  );
}

function PlaybookCard({ playbook }: { playbook: Playbook }) {
  const icon = CATEGORY_ICONS[playbook.category] || '📋';
  return (
    <Link href={`/playbooks/${playbook.id}/`} style={{ textDecoration: 'none' }}>
      <div className="playbook-card">
        <div className="playbook-card-inner">
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.75rem', lineHeight: 1, flexShrink: 0 }}>{icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                {playbook.severity.map(s => <SeverityBadge key={s} severity={s} />)}
              </div>
              <h3 className="playbook-card-title">{playbook.name}</h3>
            </div>
          </div>

          {/* ID + Category */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.875rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span className="playbook-id-badge">{playbook.id}</span>
            <span className="playbook-category-badge">{playbook.category}</span>
          </div>

          {/* Meta row */}
          <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>⏱ {playbook.estimated_time}</span>
            <span>📋 {playbook.steps.length} steps</span>
            <span>🔧 {playbook.tools_required.length} tools</span>
          </div>

          {/* MITRE tags */}
          {playbook.mitre_attack.length > 0 && (
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {playbook.mitre_attack.slice(0, 3).map(t => (
                <span key={t} className="playbook-mitre-tag">{t}</span>
              ))}
              {playbook.mitre_attack.length > 3 && (
                <span className="playbook-mitre-tag">+{playbook.mitre_attack.length - 3}</span>
              )}
            </div>
          )}

          {/* Tags */}
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            {playbook.tags.slice(0, 4).map(t => (
              <span key={t} className="playbook-tag">{t}</span>
            ))}
          </div>

          {/* Footer arrow */}
          <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
            <span className="playbook-card-arrow">View Playbook →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

interface Props {
  playbooks: Playbook[];
  categories: string[];
  severities: string[];
}

export default function PlaybooksClient({ playbooks, categories, severities }: Props) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    return playbooks.filter(p => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (selectedSeverity !== 'all' && !p.severity.includes(selectedSeverity)) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.tags.some(t => t.toLowerCase().includes(q)) ||
          p.mitre_attack.some(m => m.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [playbooks, selectedCategory, selectedSeverity, searchQuery]);

  return (
    <div className="playbooks-page min-h-screen" style={{ background: 'var(--bg-primary)', paddingTop: '5rem' }}>
      {/* Hero */}
      <section style={{ maxWidth: '56rem', margin: '0 auto', padding: '3.5rem 1.5rem 2.5rem', textAlign: 'center' }}>
        <span className="playbooks-hero-badge">
          🛡️ Open Source
        </span>
        <h1 className="playbooks-hero-heading">
          SOC Incident Response<br />Playbooks
        </h1>
        <p className="playbooks-hero-desc">
          Battle-tested incident response playbooks for modern security teams. Covering 9 attack
          categories with step-by-step procedures, automation hints, and MITRE ATT&amp;CK mappings.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.5rem' }}>
          <a
            href="https://github.com/costnimbus/soc-playbooks"
            target="_blank"
            rel="noopener noreferrer"
            className="playbooks-hero-btn-secondary"
          >
            ★ GitHub
          </a>
          <span className="playbooks-hero-stat">{playbooks.length} playbooks across {categories.length} categories</span>
        </div>
      </section>

      {/* Filters */}
      <section style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1.5rem 2rem' }}>
        {/* Search */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative', maxWidth: '36rem', margin: '0 auto' }}>
            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '1rem' }}>🔍</span>
            <input
              type="text"
              placeholder="Search by name, ID, tag, or MITRE technique..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="playbooks-search"
            />
          </div>
        </div>

        {/* Category filters */}
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Category</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`playbooks-filter-btn ${selectedCategory === 'all' ? 'playbooks-filter-active' : ''}`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`playbooks-filter-btn ${selectedCategory === cat ? 'playbooks-filter-active' : ''}`}
              >
                {CATEGORY_ICONS[cat] || '📋'} {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Severity filters */}
        <div>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Severity</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            <button
              onClick={() => setSelectedSeverity('all')}
              className={`playbooks-filter-btn ${selectedSeverity === 'all' ? 'playbooks-filter-active' : ''}`}
            >
              All
            </button>
            {severities.map(sev => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`playbooks-filter-btn ${selectedSeverity === sev ? 'playbooks-filter-active' : ''}`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results count */}
      <section style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1.5rem 1.5rem' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Showing <strong style={{ color: 'var(--accent-cyan)' }}>{filtered.length}</strong> of {playbooks.length} playbooks
        </p>
      </section>

      {/* Grid */}
      <section style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1.5rem 4rem' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1.5rem', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🔍</p>
            <p>No playbooks match your filters. Try adjusting the search.</p>
          </div>
        ) : (
          <div className="playbooks-grid">
            {filtered.map(p => <PlaybookCard key={p.id} playbook={p} />)}
          </div>
        )}
      </section>
    </div>
  );
}
