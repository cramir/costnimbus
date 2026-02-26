'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/components/breadcrumb';
import NewsletterCard from '@/components/newsletter-card';

// ─── Volume Type Definitions ─────────────────────────────────────────────────

interface VolumeType {
  key: string;
  name: string;
  provider: string;
  providerColor: string;
  basePerGB: number;
  iopsIncluded: number;
  iopsMax: number;
  iopsAdjustable: boolean;
  iopsCostAbove: number;
  iopsCostTier2?: { above: number; rate: number };
  throughputIncludedMBs: number;
  throughputMax: number;
  throughputAdjustable: boolean;
  throughputCostAbove: number;
  bestFor: string;
}

const VOLUME_TYPES: VolumeType[] = [
  {
    key: 'gp3', name: 'gp3 (General Purpose SSD)', provider: 'AWS', providerColor: '#FF9900',
    basePerGB: 0.08, iopsIncluded: 3000, iopsMax: 16000, iopsAdjustable: true,
    iopsCostAbove: 0.005, throughputIncludedMBs: 125, throughputMax: 1000,
    throughputAdjustable: true, throughputCostAbove: 0.04,
    bestFor: 'Most workloads — best price/performance',
  },
  {
    key: 'gp2', name: 'gp2 (General Purpose SSD)', provider: 'AWS', providerColor: '#FF9900',
    basePerGB: 0.10, iopsIncluded: 16000, iopsMax: 16000, iopsAdjustable: false,
    iopsCostAbove: 0, throughputIncludedMBs: 250, throughputMax: 250,
    throughputAdjustable: false, throughputCostAbove: 0,
    bestFor: 'Legacy — gp3 is almost always cheaper',
  },
  {
    key: 'io2', name: 'io2 (Provisioned IOPS SSD)', provider: 'AWS', providerColor: '#FF9900',
    basePerGB: 0.125, iopsIncluded: 0, iopsMax: 64000, iopsAdjustable: true,
    iopsCostAbove: 0.065,
    iopsCostTier2: { above: 32000, rate: 0.046 },
    throughputIncludedMBs: 1000, throughputMax: 1000,
    throughputAdjustable: false, throughputCostAbove: 0,
    bestFor: 'Databases needing >16K IOPS, 99.999% durability',
  },
  {
    key: 'io1', name: 'io1 (Provisioned IOPS SSD)', provider: 'AWS', providerColor: '#FF9900',
    basePerGB: 0.125, iopsIncluded: 0, iopsMax: 64000, iopsAdjustable: true,
    iopsCostAbove: 0.065, throughputIncludedMBs: 1000, throughputMax: 1000,
    throughputAdjustable: false, throughputCostAbove: 0,
    bestFor: 'Legacy — io2 has same price + better durability',
  },
  {
    key: 'st1', name: 'st1 (Throughput Optimized HDD)', provider: 'AWS', providerColor: '#FF9900',
    basePerGB: 0.045, iopsIncluded: 500, iopsMax: 500, iopsAdjustable: false,
    iopsCostAbove: 0, throughputIncludedMBs: 40, throughputMax: 40,
    throughputAdjustable: false, throughputCostAbove: 0,
    bestFor: 'Big data, Kafka, data warehouses',
  },
  {
    key: 'sc1', name: 'sc1 (Cold HDD)', provider: 'AWS', providerColor: '#FF9900',
    basePerGB: 0.015, iopsIncluded: 250, iopsMax: 250, iopsAdjustable: false,
    iopsCostAbove: 0, throughputIncludedMBs: 12, throughputMax: 12,
    throughputAdjustable: false, throughputCostAbove: 0,
    bestFor: 'Cold archives, infrequent access',
  },
  {
    key: 'azure-premium-v2', name: 'Premium SSD v2', provider: 'Azure', providerColor: '#0078D4',
    basePerGB: 0.113, iopsIncluded: 3000, iopsMax: 80000, iopsAdjustable: true,
    iopsCostAbove: 0.0057, throughputIncludedMBs: 125, throughputMax: 1200,
    throughputAdjustable: true, throughputCostAbove: 0.048,
    bestFor: 'Azure equivalent of gp3 — flexible performance',
  },
  {
    key: 'azure-standard-ssd', name: 'Standard SSD', provider: 'Azure', providerColor: '#0078D4',
    basePerGB: 0.06, iopsIncluded: 500, iopsMax: 500, iopsAdjustable: false,
    iopsCostAbove: 0, throughputIncludedMBs: 60, throughputMax: 60,
    throughputAdjustable: false, throughputCostAbove: 0,
    bestFor: 'Azure budget option for light I/O workloads',
  },
  {
    key: 'gcp-pd-balanced', name: 'PD-Balanced', provider: 'GCP', providerColor: '#4285F4',
    basePerGB: 0.10, iopsIncluded: 15000, iopsMax: 15000, iopsAdjustable: false,
    iopsCostAbove: 0, throughputIncludedMBs: 240, throughputMax: 240,
    throughputAdjustable: false, throughputCostAbove: 0,
    bestFor: 'GCP general purpose — balanced price/performance',
  },
  {
    key: 'gcp-pd-ssd', name: 'PD-SSD', provider: 'GCP', providerColor: '#4285F4',
    basePerGB: 0.17, iopsIncluded: 3000, iopsMax: 100000, iopsAdjustable: true,
    iopsCostAbove: 0.005, throughputIncludedMBs: 240, throughputMax: 1200,
    throughputAdjustable: false, throughputCostAbove: 0,
    bestFor: 'GCP high-performance SSD',
  },
];

function fmt(n: number): string {
  if (n >= 10000) return `$${Math.round(n).toLocaleString()}`;
  if (n >= 1000) return `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function calcMonthlyCost(vol: VolumeType, sizeGB: number, iops: number, throughputMBs: number, hours: number): number {
  const fraction = hours / 730;
  let cost = vol.basePerGB * sizeGB * fraction;

  // IOPS cost
  if (vol.iopsCostAbove > 0) {
    const billableIops = Math.max(0, iops - vol.iopsIncluded);
    if (vol.iopsCostTier2 && iops > vol.iopsCostTier2.above) {
      const tier1Iops = Math.min(billableIops, vol.iopsCostTier2.above - vol.iopsIncluded);
      const tier2Iops = iops - vol.iopsCostTier2.above;
      cost += (tier1Iops * vol.iopsCostAbove + tier2Iops * vol.iopsCostTier2.rate) * fraction;
    } else {
      cost += billableIops * vol.iopsCostAbove * fraction;
    }
  }

  // Throughput cost
  if (vol.throughputCostAbove > 0 && vol.throughputAdjustable) {
    const billableThroughput = Math.max(0, throughputMBs - vol.throughputIncludedMBs);
    cost += billableThroughput * vol.throughputCostAbove * fraction;
  }

  return cost;
}

function getEffectiveIops(vol: VolumeType, sizeGB: number, iops: number): number {
  if (vol.iopsAdjustable) return Math.min(iops, vol.iopsMax);
  if (vol.key === 'gp2') return Math.min(Math.max(3 * sizeGB, 100), 16000);
  return vol.iopsIncluded;
}

function getEffectiveThroughput(vol: VolumeType, throughputMBs: number): number {
  if (vol.throughputAdjustable) return Math.min(throughputMBs, vol.throughputMax);
  return vol.throughputIncludedMBs;
}

export default function EBSStorageCalculator() {
  const [sizeGB, setSizeGB] = useState(500);
  const [iops, setIops] = useState(3000);
  const [throughputMBs, setThroughputMBs] = useState(125);
  const [volumes, setVolumes] = useState(1);
  const [hours, setHours] = useState(730);

  const results = useMemo(() => {
    const costs = VOLUME_TYPES.map(vol => {
      const effectiveIops = getEffectiveIops(vol, sizeGB, iops);
      const effectiveThroughput = getEffectiveThroughput(vol, throughputMBs);
      const perVolume = calcMonthlyCost(vol, sizeGB, effectiveIops, effectiveThroughput, hours);
      const total = perVolume * volumes;
      return {
        ...vol,
        effectiveIops,
        effectiveThroughput,
        perVolume,
        total,
        annual: total * 12,
      };
    }).sort((a, b) => a.total - b.total);

    const cheapest = costs[0];
    const gp3 = costs.find(c => c.key === 'gp3')!;
    const gp2 = costs.find(c => c.key === 'gp2')!;
    const io2 = costs.find(c => c.key === 'io2')!;
    const io1 = costs.find(c => c.key === 'io1')!;

    const gp3VsGp2Savings = gp2.total > 0 ? ((gp2.total - gp3.total) / gp2.total) * 100 : 0;

    return { costs, cheapest, gp3, gp2, io2, io1, gp3VsGp2Savings };
  }, [sizeGB, iops, throughputMBs, volumes, hours]);

  const maxCost = Math.max(...results.costs.map(c => c.total));

  return (
    <main className="min-h-screen pt-28 pb-20" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <Breadcrumb items={[
          { label: 'Calculators', href: '/calculators' },
          { label: 'EBS Storage Calculator' },
        ]} />

        {/* Header */}
        <div className="mb-10 mt-6">
          <span className="inline-block mb-4 text-xs font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full"
            style={{ color: 'var(--accent-purple)', background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)' }}>
            💾 EBS Storage Calculator
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight"
            style={{
              fontFamily: 'var(--font-space-grotesk)',
              background: 'linear-gradient(135deg, var(--text-primary) 40%, var(--accent-purple) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
            gp3 vs gp2 vs io2 vs Azure vs GCP
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Compare monthly costs across AWS EBS volume types, Azure Managed Disks, and GCP Persistent Disks.
            gp3 saves ~20% vs gp2 at baseline — enter your specs and see your exact number.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Left: Inputs */}
          <div className="lg:col-span-2 space-y-5">
            {/* Storage Size */}
            <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  Storage Size
                </label>
                <span className="text-sm font-bold font-mono" style={{ color: 'var(--accent-cyan)' }}>
                  {sizeGB.toLocaleString()} GB
                </span>
              </div>
              <input type="range" min={10} max={16000} step={10} value={sizeGB} onChange={e => setSizeGB(+e.target.value)}
                className="w-full accent-cyan-400 mb-2" />
              <div className="grid grid-cols-4 gap-1.5">
                {[100, 500, 2000, 8000].map(v => (
                  <button key={v} onClick={() => setSizeGB(v)}
                    className="py-1.5 text-xs rounded-lg font-semibold transition-all"
                    style={{
                      background: sizeGB === v ? 'rgba(0,212,255,0.15)' : 'var(--bg-tertiary)',
                      color: sizeGB === v ? 'var(--accent-cyan)' : 'var(--text-muted)',
                      border: `1px solid ${sizeGB === v ? 'rgba(0,212,255,0.3)' : 'transparent'}`,
                    }}>
                    {v >= 1000 ? `${v / 1000}TB` : `${v}GB`}
                  </button>
                ))}
              </div>
            </div>

            {/* IOPS */}
            <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  Provisioned IOPS
                </label>
                <span className="text-sm font-bold font-mono" style={{ color: 'var(--accent-purple)' }}>
                  {iops.toLocaleString()}
                </span>
              </div>
              <input type="range" min={100} max={64000} step={100} value={iops} onChange={e => setIops(+e.target.value)}
                className="w-full accent-purple-400 mb-2" />
              <div className="grid grid-cols-4 gap-1.5">
                {[3000, 8000, 16000, 64000].map(v => (
                  <button key={v} onClick={() => setIops(v)}
                    className="py-1.5 text-xs rounded-lg font-semibold transition-all"
                    style={{
                      background: iops === v ? 'rgba(168,85,247,0.15)' : 'var(--bg-tertiary)',
                      color: iops === v ? 'var(--accent-purple)' : 'var(--text-muted)',
                      border: `1px solid ${iops === v ? 'rgba(168,85,247,0.3)' : 'transparent'}`,
                    }}>
                    {v >= 1000 ? `${v / 1000}K` : v}
                  </button>
                ))}
              </div>
              <p className="text-[10px] mt-2" style={{ color: 'var(--text-muted)' }}>
                gp3: 3K–16K adjustable · gp2: 3×GB (auto) · io2: up to 64K · HDD types: fixed
              </p>
            </div>

            {/* Throughput */}
            <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  Throughput (MB/s)
                </label>
                <span className="text-sm font-bold font-mono" style={{ color: 'var(--accent-cyan)' }}>
                  {throughputMBs} MB/s
                </span>
              </div>
              <input type="range" min={12} max={1200} step={1} value={throughputMBs} onChange={e => setThroughputMBs(+e.target.value)}
                className="w-full accent-cyan-400 mb-2" />
              <div className="grid grid-cols-4 gap-1.5">
                {[125, 250, 500, 1000].map(v => (
                  <button key={v} onClick={() => setThroughputMBs(v)}
                    className="py-1.5 text-xs rounded-lg font-semibold transition-all"
                    style={{
                      background: throughputMBs === v ? 'rgba(0,212,255,0.15)' : 'var(--bg-tertiary)',
                      color: throughputMBs === v ? 'var(--accent-cyan)' : 'var(--text-muted)',
                      border: `1px solid ${throughputMBs === v ? 'rgba(0,212,255,0.3)' : 'transparent'}`,
                    }}>
                    {v} MB/s
                  </button>
                ))}
              </div>
              <p className="text-[10px] mt-2" style={{ color: 'var(--text-muted)' }}>
                gp3: 125–1,000 adjustable · Azure Premium v2: 125–1,200 · Others: fixed
              </p>
            </div>

            {/* Number of Volumes */}
            <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  Number of Volumes
                </label>
                <span className="text-sm font-bold font-mono" style={{ color: 'var(--accent-purple)' }}>
                  {volumes}x
                </span>
              </div>
              <input type="range" min={1} max={100} step={1} value={volumes} onChange={e => setVolumes(+e.target.value)}
                className="w-full accent-purple-400 mb-2" />
              <div className="grid grid-cols-4 gap-1.5">
                {[1, 5, 10, 50].map(v => (
                  <button key={v} onClick={() => setVolumes(v)}
                    className="py-1.5 text-xs rounded-lg font-semibold transition-all"
                    style={{
                      background: volumes === v ? 'rgba(168,85,247,0.15)' : 'var(--bg-tertiary)',
                      color: volumes === v ? 'var(--accent-purple)' : 'var(--text-muted)',
                      border: `1px solid ${volumes === v ? 'rgba(168,85,247,0.3)' : 'transparent'}`,
                    }}>
                    {v}x
                  </button>
                ))}
              </div>
            </div>

            {/* Hours/month */}
            <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  Hours / Month
                </label>
                <span className="text-sm font-bold font-mono" style={{ color: 'var(--accent-cyan)' }}>
                  {hours}h
                </span>
              </div>
              <input type="range" min={1} max={730} step={1} value={hours} onChange={e => setHours(+e.target.value)}
                className="w-full accent-cyan-400 mb-2" />
              <div className="grid grid-cols-3 gap-1.5">
                {[160, 480, 730].map(v => (
                  <button key={v} onClick={() => setHours(v)}
                    className="py-1.5 text-xs rounded-lg font-semibold transition-all"
                    style={{
                      background: hours === v ? 'rgba(0,212,255,0.15)' : 'var(--bg-tertiary)',
                      color: hours === v ? 'var(--accent-cyan)' : 'var(--text-muted)',
                      border: `1px solid ${hours === v ? 'rgba(0,212,255,0.3)' : 'transparent'}`,
                    }}>
                    {v === 160 ? '20% (dev)' : v === 480 ? '66% (partial)' : '100% (full)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Config summary */}
            <div className="rounded-2xl p-5" style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.15)' }}>
              <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--accent-cyan)' }}>
                Configuration
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  ['Storage', `${sizeGB.toLocaleString()} GB`],
                  ['IOPS', iops.toLocaleString()],
                  ['Throughput', `${throughputMBs} MB/s`],
                  ['Volumes', `${volumes}x`],
                  ['Usage', `${hours}h/mo`],
                  ['Total Storage', `${(sizeGB * volumes / 1000).toFixed(1)} TB`],
                ].map(([label, val]) => (
                  <div key={String(label)}>
                    <span style={{ color: 'var(--text-muted)' }}>{label}: </span>
                    <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Results */}
          <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-28">
            {/* gp3 vs gp2 callout */}
            {results.gp3VsGp2Savings > 0 && (
              <div className="rounded-2xl p-6 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(74,222,128,0.08) 0%, rgba(0,212,255,0.06) 100%)',
                  border: '1px solid rgba(74,222,128,0.25)',
                }}>
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20" style={{ background: '#4ade80' }} />
                <div className="relative flex items-center gap-4">
                  <span className="text-3xl">💡</span>
                  <div>
                    <div className="text-sm font-bold mb-1" style={{ color: '#4ade80' }}>
                      gp3 saves {results.gp3VsGp2Savings.toFixed(1)}% vs gp2
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      You&apos;d save <span className="font-bold" style={{ color: '#4ade80' }}>{fmt((results.gp2.total - results.gp3.total) * 12)}/year</span> by
                      switching from gp2 to gp3. gp3 is cheaper at baseline with independently adjustable IOPS and throughput.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* io2 vs io1 note */}
            <div className="rounded-2xl p-4"
              style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.15)' }}>
              <div className="flex items-center gap-3">
                <span className="text-xl">📌</span>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <span className="font-bold" style={{ color: 'var(--accent-cyan)' }}>io2 vs io1:</span> Same price per GB and IOPS, but io2 offers 99.999% durability (vs 99.8–99.9% for io1). Always pick io2 over io1 for new deployments.
                </div>
              </div>
            </div>

            {/* Sorted bar chart */}
            <div className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-5" style={{ color: 'var(--text-muted)' }}>
                Monthly Cost by Volume Type (sorted cheapest first)
              </h3>
              <div className="space-y-3">
                {results.costs.map((vol, i) => {
                  const pct = maxCost > 0 ? (vol.total / maxCost) * 100 : 0;
                  const isCheapest = i === 0;
                  const barColor = vol.provider === 'AWS' ? '#FF9900' : vol.provider === 'Azure' ? '#0078D4' : '#4285F4';
                  return (
                    <div key={vol.key}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          {isCheapest && <span className="text-sm">🏆</span>}
                          <span className="text-sm font-semibold" style={{ color: isCheapest ? '#4ade80' : 'var(--text-primary)' }}>
                            {vol.name}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                            style={{ background: `${barColor}20`, color: barColor, border: `1px solid ${barColor}40` }}>
                            {vol.provider}
                          </span>
                        </div>
                        <span className="text-sm font-bold font-mono" style={{ color: isCheapest ? '#4ade80' : 'var(--text-primary)' }}>
                          {fmt(vol.total)}/mo
                        </span>
                      </div>
                      <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${Math.max(2, pct)}%`, background: isCheapest ? '#4ade80' : barColor + 'AA' }} />
                      </div>
                      <div className="flex justify-between mt-1 text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        <span>{vol.effectiveIops.toLocaleString()} IOPS · {vol.effectiveThroughput} MB/s</span>
                        <span>{fmt(vol.annual)}/yr</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Annual projection by provider */}
            <div className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{ color: 'var(--text-muted)' }}>
                Annual Projection by Provider
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      {['Volume Type', 'Provider', '/mo', 'Annual'].map(h => (
                        <th key={h} className="pb-3 text-left font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.costs.map((vol, i) => {
                      const barColor = vol.provider === 'AWS' ? '#FF9900' : vol.provider === 'Azure' ? '#0078D4' : '#4285F4';
                      return (
                        <tr key={vol.key} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td className="py-2.5 font-semibold" style={{ color: i === 0 ? '#4ade80' : 'var(--text-primary)' }}>
                            {i === 0 && '🏆 '}{vol.key}
                          </td>
                          <td className="py-2.5" style={{ color: barColor }}>{vol.provider}</td>
                          <td className="py-2.5 font-mono font-bold" style={{ color: 'var(--text-primary)' }}>{fmt(vol.total)}</td>
                          <td className="py-2.5 font-mono" style={{ color: 'var(--text-secondary)' }}>{fmt(vol.annual)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Decision guide */}
            <div className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{ color: 'var(--text-muted)' }}>
                Best For... Decision Guide
              </h3>
              <div className="space-y-3">
                {[
                  { color: '#FF9900', label: 'gp3', text: 'Most workloads. Best price/performance for general SSDs. Independently tune IOPS + throughput.' },
                  { color: '#FF9900', label: 'io2', text: 'Databases needing >16K IOPS or 99.999% durability. Production MySQL, PostgreSQL, Oracle.' },
                  { color: '#FF9900', label: 'st1', text: 'Big data, Kafka, data warehouses, log processing. Sequential read/write at low cost.' },
                  { color: '#FF9900', label: 'sc1', text: 'Cold archives, infrequent access. Cheapest AWS block storage.' },
                  { color: '#0078D4', label: 'Azure Premium v2', text: 'Azure workloads needing flexible IOPS/throughput tuning, like gp3 on AWS.' },
                  { color: '#4285F4', label: 'GCP PD-Balanced', text: 'GCP general purpose with solid included IOPS. Good default choice.' },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-3 p-3 rounded-xl"
                    style={{ background: 'var(--bg-tertiary)' }}>
                    <div className="w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0" style={{ background: item.color }} />
                    <div>
                      <span className="text-xs font-bold" style={{ color: item.color }}>{item.label}: </span>
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{item.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter CTA */}
            <NewsletterCard
              headline="EBS pricing changes. We track it."
              description="Get alerts when block storage prices drop or new volume types launch."
            />

            {/* Pricing notes */}
            <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
                Pricing Notes
              </div>
              <ul className="text-xs space-y-1.5" style={{ color: 'var(--text-muted)' }}>
                <li>• AWS prices: us-east-1 region. Azure/GCP: US equivalent regions</li>
                <li>• gp2 IOPS calculated as min(3 × GB, 16,000) — included in base price</li>
                <li>• io2 IOPS pricing: $0.065/IOPS up to 32K, $0.046/IOPS above 32K</li>
                <li>• HDD types (st1/sc1) have fixed IOPS and throughput limits</li>
                <li>• Snapshot costs not included (add ~$0.05/GB-month for AWS)</li>
                <li>• Prices updated Q1 2026 — verify at provider pricing pages</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related */}
        <section className="mt-16 pt-10" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <h2 className="text-lg font-bold mb-5" style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--text-secondary)' }}>
            Related Calculators
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { href: '/calculators/cloud-compare', icon: '⚖️', title: 'Cloud Provider Comparison', desc: 'AWS vs Azure vs GCP across all services' },
              { href: '/calculators/managed-db', icon: '🗃️', title: 'Managed Database Calculator', desc: 'RDS vs Aurora vs PlanetScale vs Neon' },
              { href: '/calculators/ec2-pricing', icon: '💰', title: 'EC2 Pricing Calculator', desc: 'On-Demand vs Reserved vs Spot pricing' },
            ].map(r => (
              <Link key={r.href} href={r.href}
                className="group rounded-xl p-4 flex items-start gap-3 transition-all hover:-translate-y-0.5"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                <span className="text-2xl">{r.icon}</span>
                <div>
                  <div className="text-sm font-semibold mb-0.5 group-hover:text-cyan-400 transition-colors"
                    style={{ color: 'var(--text-primary)' }}>{r.title}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{r.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
