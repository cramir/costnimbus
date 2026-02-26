'use client';

import { useState, useMemo } from 'react';
import Breadcrumb from '@/components/breadcrumb';
import NewsletterCard from '@/components/newsletter-card';

interface StoragePricing {
  name: string;
  color: string;
  storagePerGB: number;       // $/GB/month
  egressPerGB: number;        // $/GB egress
  getRequestPer10k: number;   // $/10k GET
  putRequestPer1k: number;    // $/1k PUT
  freeEgressGB: number;       // free egress monthly
  freeStorageGB: number;      // free tier storage
  notes: string;
  logo: string;
}

const PROVIDERS: StoragePricing[] = [
  {
    name: 'AWS S3',
    color: '#FF9900',
    storagePerGB: 0.023,
    egressPerGB: 0.09,
    getRequestPer10k: 0.004,
    putRequestPer1k: 0.005,
    freeEgressGB: 100,
    freeStorageGB: 0,
    notes: 'First 100GB egress/month free to internet. $0.023/GB storage (Standard).',
    logo: '☁️',
  },
  {
    name: 'Cloudflare R2',
    color: '#F38020',
    storagePerGB: 0.015,
    egressPerGB: 0,
    getRequestPer10k: 0.00036,
    putRequestPer1k: 0.0045,
    freeEgressGB: 999999, // effectively unlimited free egress
    freeStorageGB: 10,
    notes: 'Zero egress fees. 10GB storage + 1M Class A + 10M Class B free/month.',
    logo: '🔶',
  },
  {
    name: 'Backblaze B2',
    color: '#E84045',
    storagePerGB: 0.006,
    egressPerGB: 0.01,
    getRequestPer10k: 0.004,
    putRequestPer1k: 0,
    freeEgressGB: 3,
    freeStorageGB: 0,
    notes: 'Cheapest storage. Free egress to Cloudflare/Fastly partners. $0.01/GB otherwise.',
    logo: '🔴',
  },
];

function calcCost(p: StoragePricing, storageGB: number, getReqs: number, putReqs: number, egressGB: number) {
  const storageCost = Math.max(0, storageGB - p.freeStorageGB) * p.storagePerGB;
  const billableEgress = Math.max(0, egressGB - p.freeEgressGB);
  const egressCost = billableEgress * p.egressPerGB;
  const getCost = (getReqs / 10000) * p.getRequestPer10k;
  const putCost = (putReqs / 1000) * p.putRequestPer1k;
  const total = storageCost + egressCost + getCost + putCost;
  return { storageCost, egressCost, getCost, putCost, total };
}

export default function StorageCalculator() {
  const [storageGB, setStorageGB] = useState(1000);
  const [egressGB, setEgressGB] = useState(500);
  const [getReqs, setGetReqs] = useState(1000000);
  const [putReqs, setPutReqs] = useState(100000);

  const results = useMemo(() =>
    PROVIDERS.map(p => ({ ...p, costs: calcCost(p, storageGB, getReqs, putReqs, egressGB) })),
    [storageGB, egressGB, getReqs, putReqs]
  );

  const cheapest = results.reduce((a, b) => a.costs.total < b.costs.total ? a : b);
  const mostExpensive = results.reduce((a, b) => a.costs.total > b.costs.total ? a : b);
  const s3Cost = results.find(r => r.name === 'AWS S3')!.costs.total;

  const fmt = (n: number) => `$${n.toFixed(2)}`;
  const fmtK = (n: number) => n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : fmt(n);

  return (
    <main className="min-h-screen pt-28 pb-20" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto px-6 pt-6">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Calculators', href: '/calculators' }, { label: 'Storage: S3 vs R2 vs Backblaze' }]} />
      </div>
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-4 pb-8 text-center">
        <span className="inline-block mb-4 text-xs font-bold uppercase tracking-[0.2em] px-5 py-2 rounded-full"
          style={{ color: 'var(--accent-purple)', background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)' }}>
          Calculator
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4"
          style={{
            fontFamily: 'var(--font-space-grotesk)',
            background: 'linear-gradient(135deg, var(--text-primary) 40%, var(--accent-purple) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
          S3 vs R2 vs Backblaze B2
        </h1>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          Compare real monthly costs for your storage workload. Cloudflare R2&apos;s zero-egress model
          saves most teams 60–80% vs S3.
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-[380px_1fr] gap-8 items-start">
        {/* Left: Inputs */}
        <div className="space-y-6 lg:sticky lg:top-28">
          <div className="rounded-2xl p-[1px]"
            style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.3), rgba(0,212,255,0.3))' }}>
            <div className="rounded-2xl p-8" style={{ background: 'var(--bg-card)' }}>
              <div className="text-xs font-bold uppercase tracking-[0.2em] mb-6" style={{ color: 'var(--accent-purple)' }}>
                Your Workload
              </div>
              <div className="space-y-6">
                <SliderInput label="Storage" unit="GB" value={storageGB} min={1} max={100000} step={100}
                  onChange={setStorageGB} hint="Total stored data" />
                <SliderInput label="Monthly Egress" unit="GB" value={egressGB} min={0} max={50000} step={100}
                  onChange={setEgressGB} hint="Data downloaded by users/apps" accentColor="var(--accent-purple)" />
                <SliderInput label="GET Requests" unit="" value={getReqs} min={0} max={100000000} step={100000}
                  onChange={setGetReqs} hint={`${(getReqs / 1000000).toFixed(1)}M reads/month`} />
                <SliderInput label="PUT Requests" unit="" value={putReqs} min={0} max={10000000} step={10000}
                  onChange={setPutReqs} hint={`${(putReqs / 1000).toFixed(0)}K writes/month`} accentColor="var(--accent-purple)" />
              </div>
            </div>
          </div>

          {/* Winner Card */}
          {cheapest && (
            <div className="rounded-2xl p-6 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(74,222,128,0.06) 0%, rgba(74,222,128,0.02) 100%)',
                border: '1px solid rgba(74,222,128,0.2)',
              }}>
              <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-20 blur-3xl" style={{ background: '#4ade80' }} />
              <div className="relative">
                <div className="text-xs font-bold uppercase tracking-[0.2em] mb-2" style={{ color: '#4ade80' }}>🏆 Best Value</div>
                <div className="text-2xl font-extrabold mb-1" style={{ fontFamily: 'var(--font-space-grotesk)', color: cheapest.color }}>
                  {cheapest.name}
                </div>
                <div className="text-3xl font-bold mb-2" style={{ color: '#4ade80' }}>
                  {fmtK(cheapest.costs.total)}<span className="text-sm font-normal text-gray-400">/mo</span>
                </div>
                {cheapest.name !== 'AWS S3' && (
                  <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Saves {fmtK(s3Cost - cheapest.costs.total)}/mo vs S3
                    <span className="ml-2 font-bold" style={{ color: '#4ade80' }}>
                      ({s3Cost > 0 ? ((1 - cheapest.costs.total / s3Cost) * 100).toFixed(0) : 0}% off)
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Key Insight */}
          <div className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
            <div className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--text-muted)' }}>Egress Impact</div>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>S3 egress cost</span>
                <span className="font-bold" style={{ color: '#ef4444' }}>{fmtK(Math.max(0, egressGB - 100) * 0.09)}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>R2 egress cost</span>
                <span className="font-bold" style={{ color: '#4ade80' }}>$0.00</span>
              </div>
              <div className="h-px my-2" style={{ background: 'var(--border-subtle)' }} />
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>Egress savings with R2</span>
                <span className="font-bold" style={{ color: 'var(--accent-cyan)' }}>{fmtK(Math.max(0, egressGB - 100) * 0.09)}/mo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Results */}
        <div className="space-y-6">
          {/* Cost Cards */}
          <div className="grid gap-4">
            {results.map((r) => {
              const isWinner = r.name === cheapest.name;
              const isMost = r.name === mostExpensive.name;
              return (
                <div key={r.name}
                  className="rounded-2xl p-[1px] transition-all duration-300"
                  style={{
                    background: isWinner
                      ? 'linear-gradient(135deg, #4ade80, var(--accent-cyan))'
                      : isMost
                        ? 'linear-gradient(135deg, rgba(239,68,68,0.4), rgba(239,68,68,0.1))'
                        : 'var(--border-subtle)',
                  }}>
                  <div className="rounded-2xl p-6" style={{ background: 'var(--bg-card)' }}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{r.logo}</span>
                        <div>
                          <div className="font-bold text-lg" style={{ fontFamily: 'var(--font-space-grotesk)', color: r.color }}>
                            {r.name}
                          </div>
                          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{r.notes}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-extrabold" style={{
                          fontFamily: 'var(--font-space-grotesk)',
                          color: isWinner ? '#4ade80' : isMost ? '#ef4444' : 'var(--text-primary)',
                        }}>
                          {fmtK(r.costs.total)}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>/month</div>
                        {isWinner && r.name !== 'AWS S3' && (
                          <div className="text-xs font-bold mt-1" style={{ color: '#4ade80' }}>
                            🏆 Best value
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Cost breakdown bar */}
                    <div className="space-y-2">
                      <CostRow label="Storage" value={r.costs.storageCost} total={r.costs.total} color="#60a5fa" fmt={fmt} />
                      <CostRow label="Egress" value={r.costs.egressCost} total={r.costs.total} color="#f87171"
                        badge={r.egressPerGB === 0 ? 'FREE' : undefined} fmt={fmt} />
                      <CostRow label="GET requests" value={r.costs.getCost} total={r.costs.total} color="#a78bfa" fmt={fmt} />
                      <CostRow label="PUT requests" value={r.costs.putCost} total={r.costs.total} color="#34d399" fmt={fmt} />
                    </div>

                    {/* Pricing reference */}
                    <div className="mt-4 pt-4 grid grid-cols-3 gap-3 text-center" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                      <PriceTag label="Storage" value={`$${r.storagePerGB}/GB`} />
                      <PriceTag label="Egress" value={r.egressPerGB === 0 ? 'FREE' : `$${r.egressPerGB}/GB`}
                        highlight={r.egressPerGB === 0} />
                      <PriceTag label="Free tier" value={r.freeStorageGB > 0 ? `${r.freeStorageGB}GB` : r.freeEgressGB > 1000 ? '∞ egress' : `${r.freeEgressGB}GB egress`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Comparison Table */}
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border-subtle)', background: 'var(--bg-card)' }}>
            <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(0,212,255,0.03)' }}>
              <div className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--text-muted)' }}>
                Monthly Cost at Different Scales
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Scale</th>
                    {PROVIDERS.map(p => (
                      <th key={p.name} className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider" style={{ color: p.color }}>{p.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: '100GB storage, 50GB egress', gb: 100, eg: 50, gets: 100000, puts: 10000 },
                    { label: '1TB storage, 500GB egress', gb: 1000, eg: 500, gets: 1000000, puts: 100000 },
                    { label: '10TB storage, 5TB egress', gb: 10000, eg: 5000, gets: 10000000, puts: 1000000 },
                    { label: '100TB storage, 20TB egress', gb: 100000, eg: 20000, gets: 50000000, puts: 5000000 },
                  ].map(({ label, gb, eg, gets, puts }) => {
                    const rowCosts = PROVIDERS.map(p => calcCost(p, gb, gets, puts, eg));
                    const minCost = Math.min(...rowCosts.map(c => c.total));
                    return (
                      <tr key={label} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>{label}</td>
                        {rowCosts.map((c, i) => (
                          <td key={i} className="px-4 py-3 text-right font-semibold text-xs"
                            style={{ color: c.total === minCost ? '#4ade80' : 'var(--text-primary)' }}>
                            {fmtK(c.total)}
                            {c.total === minCost && ' 🏆'}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* When to use each */}
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                name: 'Use S3 when…',
                color: '#FF9900',
                points: ['Already deep in AWS ecosystem', 'Need Lambda integration', 'S3 features (versioning, lifecycle, replication)', 'Internal traffic (no egress)'],
              },
              {
                name: 'Use R2 when…',
                color: '#F38020',
                points: ['High egress workloads', 'Public media / CDN origin', 'Cost is the #1 concern', 'Cloudflare Workers integration'],
              },
              {
                name: 'Use B2 when…',
                color: '#E84045',
                points: ['Absolute lowest storage price', 'Paired with Cloudflare (free egress)', 'Cold/archival data', 'Backups and disaster recovery'],
              },
            ].map(({ name, color, points }) => (
              <div key={name} className="rounded-xl p-5" style={{ background: 'var(--bg-card)', border: `1px solid ${color}30` }}>
                <div className="font-bold text-sm mb-3" style={{ color }}>{name}</div>
                <ul className="space-y-2">
                  {points.map(p => (
                    <li key={p} className="text-xs flex items-start gap-2" style={{ color: 'var(--text-secondary)' }}>
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
  label, unit, value, min, max, step, onChange, hint, accentColor = 'var(--accent-cyan)',
}: {
  label: string; unit: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; hint?: string; accentColor?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</label>
        <span className="text-sm font-bold font-mono px-3 py-1 rounded-lg"
          style={{ background: 'rgba(168,85,247,0.08)', color: accentColor, border: '1px solid rgba(168,85,247,0.15)' }}>
          {value >= 1000000 ? `${(value / 1000000).toFixed(1)}M` : value >= 1000 ? `${(value / 1000).toFixed(0)}K` : value} {unit}
        </span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{ accentColor }}
      />
      {hint && <div className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>{hint}</div>}
    </div>
  );
}

function CostRow({ label, value, total, color, badge, fmt }: {
  label: string; value: number; total: number; color: string; badge?: string; fmt: (n: number) => string;
}) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3 text-xs">
      <span className="w-20 shrink-0" style={{ color: 'var(--text-muted)' }}>{label}</span>
      <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="w-16 text-right font-medium" style={{ color: badge === 'FREE' ? '#4ade80' : 'var(--text-secondary)' }}>
        {badge === 'FREE' ? 'FREE' : fmt(value)}
      </span>
    </div>
  );
}

function PriceTag({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>{label}</div>
      <div className="text-xs font-semibold" style={{ color: highlight ? '#4ade80' : 'var(--text-secondary)' }}>{value}</div>
    </div>
  );
}

function NewsletterCTA() {
  return (
    <NewsletterCard
      size="md"
      headline="Cloud storage cost tips in your inbox"
      description="Real savings tactics from engineers — storage migration strategies, pricing breakdowns, and optimization tips."
    />
  );
}
