'use client';

import { useState, useMemo } from 'react';
import Breadcrumb from '@/components/breadcrumb';
import NewsletterCard from '@/components/newsletter-card';

interface SIEMPlatform {
  name: string;
  color: string;
  logo: string;
  model: 'per-gb' | 'per-day' | 'per-host' | 'open-source';
  pricePerGB?: number;       // per GB ingested
  pricePerDay?: number;      // per GB/day indexed
  pricePerHost?: number;     // per monitored host/month
  retentionModel: 'included' | 'extra' | 'storage-only';
  computeCostMonth?: number; // self-hosted compute baseline
  fteCostFraction: number;   // FTE hours/month to manage (at $150/hr)
  storagePricePerGBMonth: number;  // additional storage cost
  retentionIncludedDays: number;
  tagline: string;
  hiddenCosts: string[];
  strengths: string[];
}

const HOURLY_RATE = 150; // $150/hr engineering time

const PLATFORMS: SIEMPlatform[] = [
  {
    name: 'Splunk Enterprise',
    color: '#65A637',
    logo: '🟢',
    model: 'per-gb',
    pricePerGB: 150,       // Splunk licenses per GB/day ~$150-300/GB/day annualized → per GB ingested
    retentionModel: 'included',
    fteCostFraction: 40,   // 40 hrs/month
    storagePricePerGBMonth: 0,
    retentionIncludedDays: 90,
    tagline: 'Industry standard — powerful but expensive at scale',
    hiddenCosts: ['Professional services ($50K+ typical)', 'Infrastructure (self-hosted)', 'Training and certification', 'Premium support contracts'],
    strengths: ['Most integrations (2,400+)', 'SPL query language', 'Mature ecosystem', 'On-prem or cloud'],
  },
  {
    name: 'Microsoft Sentinel',
    color: '#00A4EF',
    logo: '🔵',
    model: 'per-gb',
    pricePerGB: 2.76,      // Commitment tiers start ~$2.46/GB; pay-as-you-go $2.76/GB
    retentionModel: 'extra',
    fteCostFraction: 20,
    storagePricePerGBMonth: 0.023, // Log Analytics basic retention after 90 days
    retentionIncludedDays: 90,
    tagline: 'Native Azure SIEM — great if already in Microsoft stack',
    hiddenCosts: ['Log Analytics workspace charges', 'Data connector licensing (M365 E5)', 'Azure Monitor costs', 'Long-term retention ($0.023/GB/mo after 90 days)'],
    strengths: ['Native Microsoft integration', 'KQL query language', 'Built-in SOAR (Playbooks)', 'UEBA included'],
  },
  {
    name: 'Elastic SIEM',
    color: '#FEC514',
    logo: '🟡',
    model: 'per-host',
    pricePerHost: 95,      // Security subscription ~$95/host/month (managed cloud)
    retentionModel: 'storage-only',
    computeCostMonth: 800, // Self-hosted: 2× r6g.2xlarge
    fteCostFraction: 30,
    storagePricePerGBMonth: 0.10, // Warm tier Elasticsearch
    retentionIncludedDays: 30,
    tagline: 'Flexible open-core — strong for log analytics',
    hiddenCosts: ['Elasticsearch cluster sizing (RAM-heavy)', 'Kibana server costs', 'Snapshot storage for cold data', 'Index management complexity'],
    strengths: ['Full-text search power', 'Open-source core', 'EQL detection language', 'Scalable architecture'],
  },
  {
    name: 'Wazuh (Open Source)',
    color: '#3EADCF',
    logo: '🩵',
    model: 'open-source',
    pricePerGB: 0,
    retentionModel: 'storage-only',
    computeCostMonth: 400, // Manager: c5.xlarge ~$140/mo + indexer: r6g.2xlarge ~$260/mo
    fteCostFraction: 60,   // More self-management required
    storagePricePerGBMonth: 0.023,
    retentionIncludedDays: 90,
    tagline: 'Free and powerful — high engineering investment required',
    hiddenCosts: ['Dedicated ops engineer (partial FTE)', 'HA infrastructure (multi-node)', 'Index tuning at scale', 'Custom rule development'],
    strengths: ['Zero license cost', 'Agent-based detection', 'HIPAA/PCI rule packs', 'Active open-source community'],
  },
];

function calcTCO(p: SIEMPlatform, gbPerDay: number, agents: number, retentionDays: number) {
  const gbPerMonth = gbPerDay * 30;

  let licenseCost = 0;
  if (p.model === 'per-gb') {
    // Splunk: per GB/day annualized to monthly
    if (p.name.includes('Splunk')) {
      licenseCost = gbPerDay * p.pricePerGB!; // per GB/day × daily volume
    } else {
      licenseCost = gbPerMonth * p.pricePerGB!;
    }
  } else if (p.model === 'per-host') {
    licenseCost = agents * p.pricePerHost!;
  } else if (p.model === 'open-source') {
    licenseCost = 0;
  }

  const computeCost = p.computeCostMonth || 0;
  const extraRetentionDays = Math.max(0, retentionDays - p.retentionIncludedDays);
  const storageCost = extraRetentionDays > 0
    ? gbPerMonth * (extraRetentionDays / 30) * p.storagePricePerGBMonth
    : 0;

  const fteCost = p.fteCostFraction * HOURLY_RATE;
  const total = licenseCost + computeCost + storageCost + fteCost;

  return { licenseCost, computeCost, storageCost, fteCost, total, gbPerMonth };
}

export default function SIEMCalculator() {
  const [gbPerDay, setGbPerDay] = useState(10);
  const [agents, setAgents] = useState(100);
  const [retentionDays, setRetentionDays] = useState(180);
  const [showHidden, setShowHidden] = useState<string | null>(null);

  const results = useMemo(() =>
    PLATFORMS.map(p => ({ ...p, tco: calcTCO(p, gbPerDay, agents, retentionDays) })),
    [gbPerDay, agents, retentionDays]
  );

  const cheapest = results.reduce((a, b) => a.tco.total < b.tco.total ? a : b);
  const splunkCost = results.find(r => r.name.includes('Splunk'))!.tco.total;

  const fmt = (n: number) => `$${Math.round(n).toLocaleString()}`;
  const fmtK = (n: number) => n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : fmt(n);

  return (
    <main className="min-h-screen pt-28 pb-20 calc-main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "SIEM Total Cost of Ownership Calculator",
          "description": "True TCO comparison across Splunk, Microsoft Sentinel, Elastic SIEM, and Wazuh — including compute, storage, and FTE costs. Find the cheapest SIEM for your log volume.",
          "url": "https://costnimbus.com/calculators/siem",
          "applicationCategory": "FinanceApplication",
          "operatingSystem": "Web",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "creator": {
            "@type": "Organization",
            "name": "Cost Nimbus",
            "url": "https://costnimbus.com"
          }
        }) }}
      />
      <div className="max-w-4xl mx-auto px-6 pt-6">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Calculators', href: '/calculators' }, { label: 'SIEM TCO' }]} />
      </div>
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-4 pb-8 text-center">
        <span className="inline-block mb-4 text-xs font-bold uppercase tracking-[0.2em] px-5 py-2 rounded-full calc-badge-purple">
          Calculator
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4"
          style={{
            fontFamily: 'var(--font-space-grotesk)',
            background: 'linear-gradient(135deg, var(--text-primary) 40%, var(--accent-purple) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
          SIEM Total Cost Calculator
        </h1>
        <p className="text-lg max-w-2xl mx-auto calc-hero-subtitle">
          Compare true monthly TCO across Splunk, Microsoft Sentinel, Elastic, and Wazuh — including hidden costs:
          compute, storage, and engineering time.
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-[360px_1fr] gap-8 items-start">
        {/* Left: Inputs */}
        <div className="space-y-6 lg:sticky lg:top-28">
          <div className="rounded-2xl p-[1px] calc-gradient-bar">
            <div className="rounded-2xl p-8 calc-bg-card">
              <div className="text-xs font-bold uppercase tracking-[0.2em] mb-6 calc-text-purple">
                Your Environment
              </div>
              <div className="space-y-6">
                <SliderInput label="Log Volume" unit="GB/day" value={gbPerDay} min={1} max={1000} step={1}
                  onChange={setGbPerDay}
                  hint={`${(gbPerDay * 30).toLocaleString()} GB/month ingested`} />
                <SliderInput label="Monitored Agents / Hosts" unit="" value={agents} min={1} max={5000} step={10}
                  onChange={setAgents} hint="Servers, endpoints, network devices"
                  accentColor="var(--accent-purple)" />
                <SliderInput label="Retention Period" unit="days" value={retentionDays} min={30} max={730} step={30}
                  onChange={setRetentionDays}
                  hint={`${(retentionDays / 30).toFixed(0)} months — compliance often requires 12+ months`} />
              </div>
            </div>
          </div>

          {/* Engineering cost note */}
          <div className="rounded-2xl p-5 calc-panel">
            <div className="text-xs font-bold uppercase tracking-[0.2em] mb-3 calc-text-muted">
              Engineering Cost Assumption
            </div>
            <div className="text-sm calc-text-secondary">
              Engineer time valued at <span className="font-bold calc-text-primary">$150/hr</span> — fully burdened.
              Wazuh requires more ops effort than managed SaaS.
            </div>
          </div>

          {/* Winner */}
          <div className="rounded-2xl p-6 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(74,222,128,0.06) 0%, rgba(74,222,128,0.02) 100%)',
              border: '1px solid rgba(74,222,128,0.2)',
            }}>
            <div className="text-xs font-bold uppercase tracking-[0.2em] mb-2 calc-text-green">🏆 Lowest TCO</div>
            <div className="text-xl font-extrabold mb-1" style={{ fontFamily: 'var(--font-space-grotesk)', color: cheapest.color }}>
              {cheapest.name}
            </div>
            <div className="text-2xl font-bold mb-2 calc-text-green">
              {fmtK(cheapest.tco.total)}<span className="text-sm font-normal calc-text-muted">/mo</span>
            </div>
            {cheapest.name !== 'Splunk Enterprise' && (
              <div className="text-xs calc-text-secondary">
                Saves {fmtK(splunkCost - cheapest.tco.total)}/mo vs Splunk
                <span className="ml-2 font-bold calc-text-green">
                  ({splunkCost > 0 ? ((1 - cheapest.tco.total / splunkCost) * 100).toFixed(0) : 0}% less)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Results */}
        <div className="space-y-5" aria-live="polite" role="region" aria-label="Calculation results">
          {results.map((r) => {
            const isWinner = r.name === cheapest.name;
            const expanded = showHidden === r.name;
            return (
              <div key={r.name}
                className="rounded-2xl p-[1px] transition-all duration-300"
                style={{
                  background: isWinner
                    ? 'linear-gradient(135deg, #4ade80, var(--accent-cyan))'
                    : 'var(--border-subtle)',
                }}>
                <div className="rounded-2xl p-6 calc-bg-card">
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{r.logo}</span>
                      <div>
                        <div className="font-bold text-lg" style={{ fontFamily: 'var(--font-space-grotesk)', color: r.color }}>
                          {r.name}
                        </div>
                        <div className="text-xs mt-0.5 calc-text-muted">{r.tagline}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-extrabold" style={{
                        fontFamily: 'var(--font-space-grotesk)',
                        color: isWinner ? '#4ade80' : 'var(--text-primary)',
                      }}>
                        {fmtK(r.tco.total)}
                      </div>
                      <div className="text-xs calc-text-muted">/month TCO</div>
                      <div className="text-xs font-semibold mt-1 calc-text-muted">
                        {fmtK(r.tco.total * 12)}/year
                      </div>
                    </div>
                  </div>

                  {/* Cost breakdown */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                    <CostTile label="License" value={fmtK(r.tco.licenseCost)} color="#60a5fa"
                      note={r.model === 'open-source' ? 'FREE' : undefined} />
                    <CostTile label="Compute" value={fmtK(r.tco.computeCost)} color="#a78bfa"
                      note={!r.computeCostMonth ? 'Managed' : undefined} />
                    <CostTile label="Storage" value={fmtK(r.tco.storageCost)} color="#fb923c" />
                    <CostTile label="Engineering" value={fmtK(r.tco.fteCost)} color="#f87171"
                      note={`${r.fteCostFraction}h/mo`} />
                  </div>

                  {/* Visual bar */}
                  <div className="flex rounded-lg overflow-hidden h-2 mb-5">
                    {[
                      { v: r.tco.licenseCost, color: '#60a5fa' },
                      { v: r.tco.computeCost, color: '#a78bfa' },
                      { v: r.tco.storageCost, color: '#fb923c' },
                      { v: r.tco.fteCost, color: '#f87171' },
                    ].map(({ v, color }, i) => (
                      r.tco.total > 0 ? (
                        <div key={i} style={{ width: `${(v / r.tco.total) * 100}%`, background: color }} />
                      ) : null
                    ))}
                  </div>

                  {/* Strengths & hidden costs toggle */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {r.strengths.map(s => (
                      <span key={s} className="text-[10px] px-2.5 py-1 rounded-full font-semibold"
                        style={{ background: `${r.color}15`, color: r.color, border: `1px solid ${r.color}30` }}>
                        {s}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowHidden(expanded ? null : r.name)}
                    className="text-xs flex items-center gap-1.5 transition-colors"
                    style={{ color: expanded ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>
                    <span>{expanded ? '▾' : '▸'}</span>
                    {expanded ? 'Hide' : 'Show'} hidden costs ({r.hiddenCosts.length})
                  </button>

                  {expanded && (
                    <div className="mt-4 pt-4 calc-border-top">
                      <div className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3 calc-text-red">
                        ⚠ Hidden / Often-Missed Costs
                      </div>
                      <ul className="space-y-2">
                        {r.hiddenCosts.map((c, i) => (
                          <li key={i} className="text-xs flex items-start gap-2 calc-text-secondary">
                            <span className="calc-text-red">⚠</span> {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Comparison table */}
          <div className="rounded-2xl overflow-hidden calc-panel">
            <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(0,212,255,0.03)' }}>
              <div className="text-xs font-bold uppercase tracking-[0.2em] calc-text-muted">
                TCO at Scale
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="calc-border-row">
                    <th className="px-4 py-3 text-left text-xs font-semibold calc-text-muted">Scenario</th>
                    {PLATFORMS.map(p => (
                      <th key={p.name} className="px-4 py-3 text-right text-xs font-semibold" style={{ color: p.color }}>
                        {p.name.split(' ')[0]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: 'Startup (1 GB/day, 20 agents)', gb: 1, ag: 20, ret: 90 },
                    { label: 'SMB (10 GB/day, 100 agents)', gb: 10, ag: 100, ret: 180 },
                    { label: 'Mid-market (50 GB/day, 500 agents)', gb: 50, ag: 500, ret: 365 },
                    { label: 'Enterprise (200 GB/day, 2K agents)', gb: 200, ag: 2000, ret: 365 },
                  ].map(({ label, gb, ag, ret }) => {
                    const rowCosts = PLATFORMS.map(p => calcTCO(p, gb, ag, ret));
                    const minCost = Math.min(...rowCosts.map(c => c.total));
                    return (
                      <tr key={label} className="calc-border-row">
                        <td className="px-4 py-3 text-xs calc-text-secondary">{label}</td>
                        {rowCosts.map((c, i) => (
                          <td key={i} className="px-4 py-3 text-right font-semibold text-xs"
                            style={{ color: c.total === minCost ? '#4ade80' : 'var(--text-primary)' }}>
                            {fmtK(c.total)}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Decision guide */}
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: 'Choose Wazuh if…', color: '#3EADCF', points: ['< 50 GB/day ingestion', 'You have ops engineering capacity', 'Open-source is a hard requirement', 'Compliance-driven (HIPAA, PCI rules included)'] },
              { title: 'Choose Sentinel if…', color: '#00A4EF', points: ['Microsoft/Azure shop', 'M365 E5 already licensed', 'Need native Azure integrations', 'Want managed SOAR (Playbooks)'] },
              { title: 'Choose Elastic if…', color: '#FEC514', points: ['Need powerful full-text search', 'Mixed SIEM + observability use case', 'Comfortable managing Elasticsearch', 'Per-host pricing fits your environment'] },
              { title: 'Choose Splunk if…', color: '#65A637', points: ['Enterprise with compliance mandate', 'Need 2,400+ integrations', 'Budget is not the primary concern', 'Complex SPL queries and dashboards'] },
            ].map(({ title, color, points }) => (
              <div key={title} className="rounded-xl p-5" style={{ background: 'var(--bg-card)', border: `1px solid ${color}30` }}>
                <div className="font-bold text-sm mb-3" style={{ color }}>{title}</div>
                <ul className="space-y-1.5">
                  {points.map(p => (
                    <li key={p} className="text-xs flex items-start gap-2 calc-text-secondary">
                      <span style={{ color }}>✓</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <NewsletterCTA />
        </div>
      </div>
    </main>
  );
}

function SliderInput({
  label, unit, value, min, max, step, onChange, hint, accentColor = 'var(--accent-purple)',
}: {
  label: string; unit: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; hint?: string; accentColor?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-semibold calc-text-primary">{label}</label>
        <span className="text-sm font-bold font-mono px-3 py-1 rounded-lg"
          style={{ background: 'rgba(168,85,247,0.08)', color: accentColor, border: '1px solid rgba(168,85,247,0.15)' }}>
          {value.toLocaleString()} {unit}
        </span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        aria-label={label}
        style={{ accentColor }}
      />
      {hint && <div className="text-xs mt-2 calc-text-muted">{hint}</div>}
    </div>
  );
}

function CostTile({ label, value, color, note }: { label: string; value: string; color: string; note?: string }) {
  return (
    <div className="rounded-xl p-3 text-center" style={{ background: `${color}0d`, border: `1px solid ${color}25` }}>
      <div className="text-[10px] font-bold uppercase tracking-wider mb-1 calc-text-muted">{label}</div>
      <div className="font-bold text-sm" style={{ color: note === 'FREE' || note === 'Managed' ? '#4ade80' : color }}>
        {note === 'FREE' ? 'FREE' : note === 'Managed' ? 'Managed' : value}
      </div>
      {note && note !== 'FREE' && note !== 'Managed' && (
        <div className="text-[10px] mt-0.5 calc-text-muted">{note}</div>
      )}
    </div>
  );
}

function NewsletterCTA() {
  return (
    <NewsletterCard
      size="md"
      headline="SIEM cost tactics in your inbox"
      description="Real savings from engineers — SIEM pricing breakdowns, migration strategies, and optimization tips every Friday."
    />
  );
}
