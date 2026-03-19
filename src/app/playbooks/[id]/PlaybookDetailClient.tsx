'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import type { Playbook } from '@/lib/playbooks';

const SEVERITY_COLORS: Record<string, string> = {
  low: '#22c55e',
  medium: '#f59e0b',
  high: '#ef4444',
  critical: '#dc2626',
};

const STEP_TYPE_COLORS: Record<string, { border: string; bg: string; icon: string; label: string }> = {
  investigation: { border: '#00d4ff', bg: 'rgba(0,212,255,0.06)', icon: '🔍', label: 'Investigation' },
  action: { border: '#a855f7', bg: 'rgba(168,85,247,0.06)', icon: '⚡', label: 'Action' },
  notification: { border: '#f59e0b', bg: 'rgba(245,158,11,0.06)', icon: '📣', label: 'Notification' },
  containment: { border: '#ef4444', bg: 'rgba(239,68,68,0.06)', icon: '🛑', label: 'Containment' },
  remediation: { border: '#22c55e', bg: 'rgba(34,197,94,0.06)', icon: '🔧', label: 'Remediation' },
};

function MermaidChart({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          themeVariables: {
            background: '#0d1117',
            primaryColor: '#161b22',
            primaryTextColor: '#f0f6fc',
            primaryBorderColor: '#00d4ff',
            lineColor: '#8b949e',
            secondaryColor: '#1c2128',
            tertiaryColor: '#1c2128',
            edgeLabelBackground: '#161b22',
            fontFamily: 'var(--font-nunito), sans-serif',
            fontSize: '13px',
          },
          flowchart: {
            htmlLabels: true,
            curve: 'basis',
            diagramPadding: 24,
            nodeSpacing: 50,
            rankSpacing: 60,
          },
        });

        const id = `mermaid-${Date.now()}`;
        const { svg } = await mermaid.render(id, chart);
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
          setRendered(true);
        }
      } catch (e) {
        if (!cancelled) {
          console.error('Mermaid render error:', e);
          setError('Could not render flowchart.');
        }
      }
    }

    render();
    return () => { cancelled = true; };
  }, [chart]);

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        ⚠️ {error}
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      {!rendered && (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Rendering flowchart…
        </div>
      )}
      <div
        ref={ref}
        style={{
          display: rendered ? 'block' : 'none',
          overflow: 'auto',
          padding: '1rem',
        }}
      />
    </div>
  );
}

function StepAccordion({ step, index, total }: { step: Playbook['steps'][0]; index: number; total: number }) {
  const [open, setOpen] = useState(index === 0);
  const type = STEP_TYPE_COLORS[step.type] || { border: '#8b949e', bg: 'rgba(139,148,158,0.06)', icon: '▶', label: step.type };

  return (
    <div
      style={{
        border: `1px solid ${open ? type.border : 'var(--border-subtle)'}`,
        borderRadius: '0.75rem',
        overflow: 'hidden',
        background: open ? type.bg : 'var(--bg-card)',
        transition: 'border-color 0.2s, background 0.2s',
        marginBottom: '0.75rem',
      }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '1rem 1.25rem',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        {/* Step number */}
        <span style={{
          flexShrink: 0,
          width: '2rem',
          height: '2rem',
          borderRadius: '50%',
          background: open ? type.border : 'var(--bg-tertiary)',
          color: open ? '#0d1117' : 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.8rem',
          fontWeight: 700,
          fontFamily: 'var(--font-space-grotesk)',
          transition: 'background 0.2s, color 0.2s',
        }}>
          {index + 1}
        </span>

        {/* Icon + name */}
        <span style={{ flex: 1 }}>
          <span style={{ fontSize: '1rem', marginRight: '0.5rem' }}>{type.icon}</span>
          <span style={{
            fontFamily: 'var(--font-space-grotesk)',
            fontWeight: 600,
            fontSize: '0.95rem',
            color: open ? 'var(--text-primary)' : 'var(--text-secondary)',
          }}>
            {step.name}
          </span>
        </span>

        {/* Type + tool badges */}
        <span style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexShrink: 0 }}>
          <span style={{
            fontSize: '0.68rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            padding: '2px 7px',
            borderRadius: '999px',
            background: `${type.border}20`,
            color: type.border,
            border: `1px solid ${type.border}40`,
          }}>{type.label}</span>
          {step.tool && (
            <span style={{
              fontSize: '0.68rem',
              padding: '2px 7px',
              borderRadius: '999px',
              background: 'var(--bg-tertiary)',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-subtle)',
            }}>{step.tool}</span>
          )}
        </span>

        {/* Chevron */}
        <span style={{
          flexShrink: 0,
          color: 'var(--text-muted)',
          transform: open ? 'rotate(180deg)' : 'rotate(0)',
          transition: 'transform 0.2s',
          fontSize: '0.75rem',
        }}>▼</span>
      </button>

      {open && (
        <div style={{ padding: '0 1.25rem 1.25rem 1.25rem' }}>
          {/* Divider */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', marginBottom: '1rem' }} />

          {/* Description */}
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.75, marginBottom: step.automation_hint ? '1.25rem' : 0 }}>
            {step.description}
          </p>

          {/* Automation hint */}
          {step.automation_hint && (
            <div style={{ marginBottom: step.outputs?.length ? '1.25rem' : 0 }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-cyan)', marginBottom: '0.5rem' }}>
                ⚡ Automation Hint
              </p>
              <pre style={{
                background: 'var(--code-bg)',
                borderRadius: '0.5rem',
                padding: '1rem',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-jetbrains-mono)',
                color: 'var(--code-text)',
                overflowX: 'auto',
                lineHeight: 1.6,
                border: '1px solid var(--border-subtle)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}>
                {step.automation_hint}
              </pre>
            </div>
          )}

          {/* Outputs */}
          {step.outputs && step.outputs.length > 0 && (
            <div>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-purple)', marginBottom: '0.5rem' }}>
                📤 Outputs
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {step.outputs.map(o => (
                  <span key={o} style={{
                    fontSize: '0.72rem',
                    padding: '3px 9px',
                    background: 'rgba(168,85,247,0.1)',
                    border: '1px solid rgba(168,85,247,0.25)',
                    color: '#a855f7',
                    borderRadius: '0.375rem',
                    fontFamily: 'var(--font-jetbrains-mono)',
                  }}>{o}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface Props {
  playbook: Playbook;
  mermaidChart: string;
}

export default function PlaybookDetailClient({ playbook, mermaidChart }: Props) {
  const [activeTab, setActiveTab] = useState<'steps' | 'flowchart' | 'postincident'>('steps');
  const [yamlDownloaded, setYamlDownloaded] = useState(false);

  function handleDownload() {
    const link = document.createElement('a');
    link.href = `/playbooks/${playbook.filename}`;
    link.download = playbook.filename;
    link.click();
    setYamlDownloaded(true);
    setTimeout(() => setYamlDownloaded(false), 2000);
  }

  const tabs: { id: 'steps' | 'flowchart' | 'postincident'; label: string; icon: string }[] = [
    { id: 'steps', label: 'Steps', icon: '📋' },
    { id: 'flowchart', label: 'Flowchart', icon: '🗺️' },
    { id: 'postincident', label: 'Post-Incident', icon: '📝' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: '5rem' }}>
      <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>

        {/* Breadcrumb */}
        <nav style={{ marginBottom: '2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <Link href="/playbooks/" style={{ color: 'var(--accent-cyan)', textDecoration: 'none' }}>
            ← Playbooks
          </Link>
          <span style={{ margin: '0 0.5rem' }}>/</span>
          <span style={{ color: 'var(--text-secondary)' }}>{playbook.category}</span>
          <span style={{ margin: '0 0.5rem' }}>/</span>
          <span style={{ color: 'var(--text-primary)' }}>{playbook.id}</span>
        </nav>

        {/* Header card */}
        <div className="playbook-detail-header">
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <span className="playbook-id-badge" style={{ fontSize: '0.85rem', padding: '4px 12px' }}>{playbook.id}</span>
            <span className="playbook-category-badge" style={{ fontSize: '0.85rem', padding: '4px 12px' }}>{playbook.category}</span>
            <span style={{ padding: '4px 12px', borderRadius: '999px', fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }}>
              v{playbook.version}
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-space-grotesk)',
            fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            marginBottom: '1.25rem',
            lineHeight: 1.2,
          }}>
            {playbook.name}
          </h1>

          {/* Severity badges */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {playbook.severity.map(s => {
              const color = SEVERITY_COLORS[s.toLowerCase()] || '#8b949e';
              return (
                <span key={s} style={{
                  background: `${color}18`,
                  border: `1px solid ${color}50`,
                  color,
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}>⚠️ {s}</span>
              );
            })}
          </div>

          {/* Metrics strip */}
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {[
              { icon: '⏱', label: 'Est. Time', value: playbook.estimated_time },
              { icon: '📋', label: 'Steps', value: `${playbook.steps.length} steps` },
              { icon: '🔧', label: 'Tools', value: `${playbook.tools_required.length} required` },
              { icon: '🔗', label: 'Integrations', value: `${playbook.integrations.length} platforms` },
              ...(playbook.metrics.avg_resolution_time ? [{ icon: '📊', label: 'Avg Resolution', value: playbook.metrics.avg_resolution_time }] : []),
            ].map(m => (
              <div key={m.label} style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', fontWeight: 600 }}>{m.icon} {m.label}</span>
                <span style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-space-grotesk)' }}>{m.value}</span>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleDownload}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1.25rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--accent-cyan)',
                background: 'rgba(0,212,255,0.08)',
                color: 'var(--accent-cyan)',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              {yamlDownloaded ? '✅ Downloaded!' : '⬇ Download YAML'}
            </button>
            <a
              href={playbook.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1.25rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--border-subtle)',
                background: 'transparent',
                color: 'var(--text-secondary)',
                fontSize: '0.875rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'border-color 0.2s, color 0.2s',
              }}
            >
              ★ View on GitHub
            </a>
          </div>
        </div>

        {/* Info grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {/* MITRE ATT&CK */}
          <div className="playbook-info-card">
            <h3 className="playbook-info-card-title">🎯 MITRE ATT&CK</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {playbook.mitre_attack.map(t => (
                <a
                  key={t}
                  href={`https://attack.mitre.org/techniques/${t.replace('.', '/')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}
                >
                  <span className="playbook-mitre-tag" style={{ cursor: 'pointer' }}>{t}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Tools Required */}
          <div className="playbook-info-card">
            <h3 className="playbook-info-card-title">🔧 Tools Required</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {playbook.tools_required.map(t => (
                <span key={t} className="playbook-tag">{t.replace(/_/g, ' ')}</span>
              ))}
            </div>
          </div>

          {/* Triggers */}
          {playbook.trigger.length > 0 && (
            <div className="playbook-info-card">
              <h3 className="playbook-info-card-title">⚡ Triggers</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {playbook.trigger.map(t => (
                  <span key={t} style={{
                    fontSize: '0.72rem',
                    padding: '3px 9px',
                    background: 'rgba(0,212,255,0.07)',
                    border: '1px solid rgba(0,212,255,0.2)',
                    color: 'var(--accent-cyan)',
                    borderRadius: '0.375rem',
                    fontFamily: 'var(--font-jetbrains-mono)',
                  }}>{t}</span>
                ))}
              </div>
            </div>
          )}

          {/* Integrations */}
          {playbook.integrations.length > 0 && (
            <div className="playbook-info-card">
              <h3 className="playbook-info-card-title">🔌 Integrations</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {playbook.integrations.map(i => (
                  <div key={i.platform} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <span style={{
                      flexShrink: 0,
                      fontSize: '0.65rem',
                      padding: '2px 6px',
                      borderRadius: '999px',
                      background: i.optional ? 'rgba(139,148,158,0.1)' : 'rgba(0,212,255,0.1)',
                      border: `1px solid ${i.optional ? 'rgba(139,148,158,0.2)' : 'rgba(0,212,255,0.25)'}`,
                      color: i.optional ? 'var(--text-muted)' : 'var(--accent-cyan)',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}>
                      {i.optional ? 'opt' : 'req'}
                    </span>
                    <div>
                      <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.1rem' }}>
                        {i.platform.replace(/_/g, ' ')}
                      </p>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{i.notes}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', gap: '0' }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '0.75rem 1.25rem',
                  background: 'none',
                  border: 'none',
                  borderBottom: `2px solid ${activeTab === tab.id ? 'var(--accent-cyan)' : 'transparent'}`,
                  color: activeTab === tab.id ? 'var(--accent-cyan)' : 'var(--text-muted)',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'color 0.2s, border-color 0.2s',
                  fontFamily: 'var(--font-space-grotesk)',
                  marginBottom: '-1px',
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        {activeTab === 'steps' && (
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Click each step to expand the full procedure, automation hints, and expected outputs.
            </p>
            {playbook.steps.map((step, i) => (
              <StepAccordion key={step.id} step={step} index={i} total={playbook.steps.length} />
            ))}
          </div>
        )}

        {activeTab === 'flowchart' && (
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Visual flowchart of all {playbook.steps.length} steps with color-coded step types.
            </p>
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '1rem',
              overflow: 'hidden',
            }}>
              {/* Legend */}
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {Object.entries(STEP_TYPE_COLORS).map(([type, cfg]) => (
                  <span key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: cfg.border, display: 'inline-block' }} />
                    {cfg.icon} {cfg.label}
                  </span>
                ))}
              </div>
              <MermaidChart chart={mermaidChart} />
            </div>
          </div>
        )}

        {activeTab === 'postincident' && (
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Actions to take after the incident is resolved to improve future response.
            </p>
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '1rem',
              padding: '1.5rem',
            }}>
              {playbook.post_incident.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {playbook.post_incident.map((item, i) => (
                    <li key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      <span style={{
                        flexShrink: 0,
                        width: '1.4rem',
                        height: '1.4rem',
                        borderRadius: '50%',
                        background: 'rgba(0,212,255,0.1)',
                        border: '1px solid rgba(0,212,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        color: 'var(--accent-cyan)',
                        marginTop: '0.1rem',
                      }}>{i + 1}</span>
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No post-incident actions defined.</p>
              )}

              {/* Metrics */}
              {playbook.metrics && (
                <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <h4 style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
                    📊 Playbook Metrics
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                    {playbook.metrics.avg_resolution_time && (
                      <div style={{ background: 'var(--bg-tertiary)', borderRadius: '0.5rem', padding: '1rem', textAlign: 'center' }}>
                        <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Avg Resolution</p>
                        <p style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent-cyan)' }}>{playbook.metrics.avg_resolution_time}</p>
                      </div>
                    )}
                    {playbook.metrics.false_positive_rate && (
                      <div style={{ background: 'var(--bg-tertiary)', borderRadius: '0.5rem', padding: '1rem', textAlign: 'center' }}>
                        <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>False Positive Rate</p>
                        <p style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 700, fontSize: '1.1rem', color: '#f59e0b' }}>{playbook.metrics.false_positive_rate}</p>
                      </div>
                    )}
                    {playbook.metrics.escalation_rate && (
                      <div style={{ background: 'var(--bg-tertiary)', borderRadius: '0.5rem', padding: '1rem', textAlign: 'center' }}>
                        <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Escalation Rate</p>
                        <p style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 700, fontSize: '1.1rem', color: '#ef4444' }}>{playbook.metrics.escalation_rate}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
