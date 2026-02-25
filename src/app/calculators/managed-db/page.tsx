'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/components/breadcrumb';

// ─── Pricing Data (Q1 2026, us-east-1) ─────────────────────────────────────

interface InstanceTier {
  label: string;
  vcpus: number;
  ramGB: number;
  rds: number;       // $/hr on-demand
  aurora: number;    // $/hr provisioned
  auroraACU: number; // Aurora Serverless v2 min ACUs needed (rough estimate)
}

const INSTANCE_TIERS: InstanceTier[] = [
  { label: 'db.t3.micro (2 vCPU / 1GB)', vcpus: 2, ramGB: 1, rds: 0.017, aurora: 0.073, auroraACU: 0.5 },
  { label: 'db.t3.small (2 vCPU / 2GB)', vcpus: 2, ramGB: 2, rds: 0.034, aurora: 0.073, auroraACU: 1 },
  { label: 'db.t3.medium (2 vCPU / 4GB)', vcpus: 2, ramGB: 4, rds: 0.068, aurora: 0.082, auroraACU: 2 },
  { label: 'db.r6g.large (2 vCPU / 16GB)', vcpus: 2, ramGB: 16, rds: 0.192, aurora: 0.260, auroraACU: 4 },
  { label: 'db.r6g.xlarge (4 vCPU / 32GB)', vcpus: 4, ramGB: 32, rds: 0.384, aurora: 0.519, auroraACU: 8 },
  { label: 'db.r6g.2xlarge (8 vCPU / 64GB)', vcpus: 8, ramGB: 64, rds: 0.768, aurora: 1.038, auroraACU: 16 },
  { label: 'db.r6g.4xlarge (16 vCPU / 128GB)', vcpus: 16, ramGB: 128, rds: 1.536, aurora: 2.076, auroraACU: 32 },
];

// Pricing constants
const RDS_STORAGE_PER_GB = 0.115;          // gp2 $/GB/month
const RDS_MULTIAZ_MULTIPLIER = 2;
const RDS_REPLICA_MULTIPLIER = 0.9;        // read replicas ~90% of primary cost
const RDS_IO_PER_MILLION = 0.20;           // I/O cost for gp2

const AURORA_STORAGE_PER_GB = 0.10;        // $/GB/month
const AURORA_IO_PER_MILLION = 0.20;
const AURORA_SERVERLESS_ACU_PRICE = 0.12;  // $/ACU-hour (v2)
const AURORA_SERVERLESS_STORAGE = 0.10;

const PLANETSCALE_TIERS = [
  { name: 'Hobby', price: 0, rows_reads_B: 1, rows_writes_M: 10, storage_GB: 5, note: 'Free tier' },
  { name: 'Scaler', price: 39, rows_reads_B: 100, rows_writes_B: 50, storage_GB: 25, note: '$39/mo base' },
  { name: 'Scaler Pro', price: 39, rows_reads_B: Infinity, rows_writes_B: Infinity, storage_GB: 10, note: 'Pay-per-use beyond base' },
];
const PLANETSCALE_EXTRA_STORAGE = 2.50;    // $/GB beyond included
const PLANETSCALE_READ_BILLION = 1.00;     // $1/billion row reads
const PLANETSCALE_WRITE_MILLION = 1.50;    // $1.50/million row writes

// Neon: compute + storage
const NEON_FREE = { compute_hours: 191.9, storage_GB: 0.5 };
const NEON_LAUNCH = { price: 19, compute_hours: 300, storage_GB: 10 };
const NEON_SCALE = { price: 69, compute_hours: 750, storage_GB: 50 };
const NEON_EXTRA_COMPUTE = 0.16;           // per compute-hour (0.25 vCPU)
const NEON_EXTRA_STORAGE = 0.18;           // $/GB/month
// 1 CU = 0.25 vCPU / 1GB RAM — maps to ACU-equivalent compute

function fmt(n: number): string {
  if (n >= 10000) return `$${Math.round(n).toLocaleString()}`;
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}
function fmtD(n: number): string {
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

interface Results {
  rds: { compute: number; storage: number; io: number; multiaz: number; replicas: number; total: number };
  aurora: { compute: number; storage: number; io: number; replicas: number; total: number };
  auroraServerless: { compute: number; storage: number; total: number; note: string };
  planetscale: { base: number; storage: number; reads: number; writes: number; total: number; tier: string };
  neon: { compute: number; storage: number; total: number; tier: string };
  winner: { name: string; total: number; color: string };
}

export default function ManagedDBCalculator() {
  const [tierIdx, setTierIdx] = useState(2);
  const [storageGB, setStorageGB] = useState(100);
  const [hoursMonth, setHoursMonth] = useState(730);
  const [replicaCount, setReplicaCount] = useState(1);
  const [multiAZ, setMultiAZ] = useState(true);
  const [ioMillions, setIoMillions] = useState(100);
  const [psRowReadsB, setPsRowReadsB] = useState(50);   // billion row reads
  const [psRowWritesM, setPsRowWritesM] = useState(50); // million row writes
  const [activeTab, setActiveTab] = useState<'inputs' | 'breakdown'>('inputs');

  const results = useMemo<Results>(() => {
    const tier = INSTANCE_TIERS[tierIdx];

    // ── RDS ──────────────────────────────────────────────────────────────
    const rdsBaseCompute = tier.rds * hoursMonth;
    const rdsMultiAZCost = multiAZ ? rdsBaseCompute * (RDS_MULTIAZ_MULTIPLIER - 1) : 0;
    const rdsReplicaCost = replicaCount * tier.rds * RDS_REPLICA_MULTIPLIER * hoursMonth;
    const rdsStorage = storageGB * RDS_STORAGE_PER_GB;
    const rdsIO = (ioMillions / 1_000_000) * ioMillions * RDS_IO_PER_MILLION; // simplified
    const rdsIOCost = ioMillions * RDS_IO_PER_MILLION;
    const rdsTotal = rdsBaseCompute + rdsMultiAZCost + rdsReplicaCost + rdsStorage + rdsIOCost;

    // ── Aurora Provisioned ────────────────────────────────────────────────
    const auroraBaseCompute = tier.aurora * hoursMonth;
    const auroraMultiAZCost = multiAZ ? auroraBaseCompute * 0.5 : 0; // Aurora writer + reader in different AZ is cheaper
    const auroraReplicaCost = replicaCount * tier.aurora * 0.85 * hoursMonth;
    const auroraStorage = storageGB * AURORA_STORAGE_PER_GB;
    const auroraIOCost = ioMillions * AURORA_IO_PER_MILLION;
    const auroraTotal = auroraBaseCompute + auroraMultiAZCost + auroraReplicaCost + auroraStorage + auroraIOCost;

    // ── Aurora Serverless v2 ──────────────────────────────────────────────
    const minACU = tier.auroraACU;
    const maxACU = minACU * 4;
    // Assume average 60% utilization between min and max
    const avgACU = minACU + (maxACU - minACU) * 0.4;
    const serverlessCompute = avgACU * AURORA_SERVERLESS_ACU_PRICE * hoursMonth;
    const serverlessMultiAZ = multiAZ ? serverlessCompute * 0.5 : 0;
    const serverlessStorage = storageGB * AURORA_SERVERLESS_STORAGE;
    const serverlessTotal = serverlessCompute + serverlessMultiAZ + serverlessStorage + auroraIOCost;
    const serverlessNote = `${minACU}–${maxACU} ACUs, avg ${avgACU.toFixed(1)} ACUs @ $${AURORA_SERVERLESS_ACU_PRICE}/ACU-hr`;

    // ── PlanetScale ───────────────────────────────────────────────────────
    // Scaler Pro at $39/mo base, then per-use
    const psBase = 39;
    const psStorageCost = Math.max(0, storageGB - 10) * PLANETSCALE_EXTRA_STORAGE;
    const psReadsCost = Math.max(0, psRowReadsB - 100) * PLANETSCALE_READ_BILLION;
    const psWritesCost = Math.max(0, psRowWritesM - 50_000) * (PLANETSCALE_WRITE_MILLION / 1_000_000);
    // PlanetScale charges per billion reads: psRowReadsB is already in billions
    const psReadsCostB = psRowReadsB > 100 ? (psRowReadsB - 100) * PLANETSCALE_READ_BILLION : 0;
    const psWritesCostM = psRowWritesM > 50_000 ? (psRowWritesM - 50_000) * (1.50 / 1_000_000) : 0;
    const psTotal = psBase + psStorageCost + psReadsCostB + psWritesCostM;

    // ── Neon ──────────────────────────────────────────────────────────────
    // Scale plan: $69/mo includes 750 compute-hours + 50GB storage
    // Compute: map instance vCPUs to Neon compute hours (1 vCPU = 4 CU)
    const neonComputeHoursNeeded = (tier.vcpus / 0.25) * hoursMonth; // 0.25 vCPU per CU
    const neonIncludedCompute = 750; // Scale plan
    const neonExtraCompute = Math.max(0, neonComputeHoursNeeded - neonIncludedCompute) * NEON_EXTRA_COMPUTE;
    const neonExtraStorage = Math.max(0, storageGB - 50) * NEON_EXTRA_STORAGE;
    const neonBase = 69; // Scale plan
    const neonTotal = neonBase + neonExtraCompute + neonExtraStorage;
    const neonTier = neonComputeHoursNeeded <= 750 && storageGB <= 50 ? 'Scale (included)' : 'Scale + overage';

    // ── Winner ────────────────────────────────────────────────────────────
    const contenders = [
      { name: 'RDS', total: rdsTotal, color: '#f97316' },
      { name: 'Aurora Provisioned', total: auroraTotal, color: '#a855f7' },
      { name: 'Aurora Serverless', total: serverlessTotal, color: '#8b5cf6' },
      { name: 'PlanetScale', total: psTotal, color: '#22c55e' },
      { name: 'Neon', total: neonTotal, color: '#00d4ff' },
    ];
    const winner = contenders.reduce((a, b) => a.total < b.total ? a : b);

    return {
      rds: { compute: rdsBaseCompute, storage: rdsStorage, io: rdsIOCost, multiaz: rdsMultiAZCost, replicas: rdsReplicaCost, total: rdsTotal },
      aurora: { compute: auroraBaseCompute, storage: auroraStorage, io: auroraIOCost, replicas: auroraReplicaCost, total: auroraTotal },
      auroraServerless: { compute: serverlessCompute + serverlessMultiAZ, storage: serverlessStorage, total: serverlessTotal, note: serverlessNote },
      planetscale: { base: psBase, storage: psStorageCost, reads: psReadsCostB, writes: psWritesCostM, total: psTotal, tier: 'Scaler Pro' },
      neon: { compute: neonBase + neonExtraCompute, storage: neonExtraStorage, total: neonTotal, tier: neonTier },
      winner,
    };
  }, [tierIdx, storageGB, hoursMonth, replicaCount, multiAZ, ioMillions, psRowReadsB, psRowWritesM]);

  const maxTotal = Math.max(results.rds.total, results.aurora.total, results.auroraServerless.total, results.planetscale.total, results.neon.total);

  const providers = [
    { name: 'RDS MySQL/PG', total: results.rds.total, color: '#f97316', icon: '🟠', tagline: 'Workhorse. Most compatible.' },
    { name: 'Aurora Provisioned', total: results.aurora.total, color: '#a855f7', icon: '🟣', tagline: 'High perf, AWS-native.' },
    { name: 'Aurora Serverless', total: results.auroraServerless.total, color: '#8b5cf6', icon: '⚡', tagline: 'Scale to zero. Variable workloads.' },
    { name: 'PlanetScale', total: results.planetscale.total, color: '#22c55e', icon: '🟢', tagline: 'Serverless MySQL + branching.' },
    { name: 'Neon', total: results.neon.total, color: '#00d4ff', icon: '🔵', tagline: 'Serverless Postgres. Scale-to-zero.' },
  ];

  const sliderClass = "w-full h-1.5 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:cursor-pointer";

  return (
    <main className="min-h-screen pt-28 pb-20" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto px-6 pt-6">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Calculators', href: '/calculators' }, { label: 'Managed Database' }]} />
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
          Managed Database Cost Calculator
        </h1>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          Compare real monthly costs: <strong style={{ color: 'var(--text-primary)' }}>RDS vs Aurora vs Aurora Serverless vs PlanetScale vs Neon.</strong> {' '}
          See which managed database is actually cheapest for your workload.
        </p>
        {/* Breadcrumb */}
        <div className="flex items-center justify-center gap-2 mt-4 text-xs" style={{ color: 'var(--text-muted)' }}>
          <Link href="/calculators" className="hover:text-cyan-400 transition-colors">← All Calculators</Link>
        </div>
      </section>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[1fr_400px] gap-8">

        {/* Left — Inputs */}
        <div className="space-y-6">

          {/* Tab toggle */}
          <div className="flex gap-2 p-1 rounded-xl w-fit" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
            {(['inputs', 'breakdown'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className="px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all"
                style={{
                  background: activeTab === tab ? 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(0,212,255,0.2))' : 'transparent',
                  color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-muted)',
                  border: activeTab === tab ? '1px solid rgba(168,85,247,0.3)' : '1px solid transparent',
                }}>
                {tab === 'inputs' ? '⚙️ Inputs' : '📊 Breakdown'}
              </button>
            ))}
          </div>

          {activeTab === 'inputs' && (
            <div className="space-y-5">
              {/* Instance Size */}
              <div className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                <h3 className="text-sm font-bold uppercase tracking-[0.15em] mb-4" style={{ color: 'var(--accent-purple)' }}>
                  Instance Size
                </h3>
                <div className="space-y-2">
                  {INSTANCE_TIERS.map((t, i) => (
                    <button key={i} onClick={() => setTierIdx(i)}
                      className="w-full text-left px-4 py-3 rounded-xl text-sm transition-all"
                      style={{
                        background: tierIdx === i ? 'rgba(168,85,247,0.12)' : 'rgba(255,255,255,0.02)',
                        border: tierIdx === i ? '1px solid rgba(168,85,247,0.4)' : '1px solid var(--border-subtle)',
                        color: tierIdx === i ? 'var(--text-primary)' : 'var(--text-secondary)',
                      }}>
                      <span className="font-mono text-xs">{t.label}</span>
                      <span className="float-right text-xs" style={{ color: 'var(--text-muted)' }}>
                        RDS: {fmtD(t.rds)}/hr
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Infrastructure Settings */}
              <div className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                <h3 className="text-sm font-bold uppercase tracking-[0.15em] mb-5" style={{ color: 'var(--accent-purple)' }}>
                  Infrastructure Settings
                </h3>
                <div className="space-y-6">

                  {/* Storage */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Storage</label>
                      <span className="text-sm font-bold" style={{ color: 'var(--accent-purple)', fontFamily: 'var(--font-jetbrains-mono)' }}>
                        {storageGB} GB
                      </span>
                    </div>
                    <input type="range" min={10} max={10000} step={10} value={storageGB}
                      onChange={e => setStorageGB(+e.target.value)}
                      className={sliderClass}
                      style={{ background: `linear-gradient(to right, var(--accent-purple) ${(storageGB - 10) / (10000 - 10) * 100}%, rgba(255,255,255,0.1) 0%)` }} />
                    <div className="flex justify-between text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                      <span>10 GB</span><span>10 TB</span>
                    </div>
                  </div>

                  {/* Hours */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Hours / Month</label>
                      <span className="text-sm font-bold" style={{ color: 'var(--accent-purple)', fontFamily: 'var(--font-jetbrains-mono)' }}>
                        {hoursMonth} hrs
                      </span>
                    </div>
                    <input type="range" min={1} max={730} step={1} value={hoursMonth}
                      onChange={e => setHoursMonth(+e.target.value)}
                      className={sliderClass}
                      style={{ background: `linear-gradient(to right, var(--accent-purple) ${(hoursMonth - 1) / 729 * 100}%, rgba(255,255,255,0.1) 0%)` }} />
                    <div className="flex justify-between text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                      <span>1 hr</span><span>730 hrs (full month)</span>
                    </div>
                  </div>

                  {/* Read Replicas */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Read Replicas</label>
                      <span className="text-sm font-bold" style={{ color: 'var(--accent-purple)', fontFamily: 'var(--font-jetbrains-mono)' }}>
                        {replicaCount}
                      </span>
                    </div>
                    <input type="range" min={0} max={5} step={1} value={replicaCount}
                      onChange={e => setReplicaCount(+e.target.value)}
                      className={sliderClass}
                      style={{ background: `linear-gradient(to right, var(--accent-purple) ${replicaCount / 5 * 100}%, rgba(255,255,255,0.1) 0%)` }} />
                    <div className="flex justify-between text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                      <span>0</span><span>5</span>
                    </div>
                  </div>

                  {/* I/O Millions */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>I/O Requests</label>
                      <span className="text-sm font-bold" style={{ color: 'var(--accent-purple)', fontFamily: 'var(--font-jetbrains-mono)' }}>
                        {ioMillions.toLocaleString()}M / month
                      </span>
                    </div>
                    <input type="range" min={1} max={2000} step={10} value={ioMillions}
                      onChange={e => setIoMillions(+e.target.value)}
                      className={sliderClass}
                      style={{ background: `linear-gradient(to right, var(--accent-purple) ${(ioMillions - 1) / 1999 * 100}%, rgba(255,255,255,0.1) 0%)` }} />
                    <div className="flex justify-between text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                      <span>1M</span><span>2,000M</span>
                    </div>
                  </div>

                  {/* Multi-AZ toggle */}
                  <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                    <div>
                      <div className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Multi-AZ Deployment</div>
                      <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>High availability, 2× compute for RDS</div>
                    </div>
                    <button onClick={() => setMultiAZ(!multiAZ)}
                      className="relative w-12 h-6 rounded-full transition-all flex-shrink-0"
                      style={{ background: multiAZ ? 'var(--accent-purple)' : 'rgba(255,255,255,0.1)' }}>
                      <span className="absolute top-1 w-4 h-4 bg-white rounded-full transition-all"
                        style={{ left: multiAZ ? '28px' : '4px' }} />
                    </button>
                  </div>
                </div>
              </div>

              {/* PlanetScale-specific */}
              <div className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <h3 className="text-sm font-bold uppercase tracking-[0.15em] mb-1" style={{ color: '#22c55e' }}>
                  PlanetScale Inputs
                </h3>
                <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>PlanetScale charges per row reads/writes, not compute time.</p>
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Row Reads</label>
                      <span className="text-sm font-bold font-mono" style={{ color: '#22c55e' }}>{psRowReadsB}B / month</span>
                    </div>
                    <input type="range" min={1} max={1000} step={1} value={psRowReadsB}
                      onChange={e => setPsRowReadsB(+e.target.value)}
                      className={sliderClass}
                      style={{ background: `linear-gradient(to right, #22c55e ${(psRowReadsB - 1) / 999 * 100}%, rgba(255,255,255,0.1) 0%)` }} />
                    <div className="flex justify-between text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}><span>1B</span><span>1,000B</span></div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Row Writes</label>
                      <span className="text-sm font-bold font-mono" style={{ color: '#22c55e' }}>{psRowWritesM.toLocaleString()}M / month</span>
                    </div>
                    <input type="range" min={1} max={200000} step={100} value={psRowWritesM}
                      onChange={e => setPsRowWritesM(+e.target.value)}
                      className={sliderClass}
                      style={{ background: `linear-gradient(to right, #22c55e ${(psRowWritesM - 1) / 199999 * 100}%, rgba(255,255,255,0.1) 0%)` }} />
                    <div className="flex justify-between text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}><span>1M</span><span>200,000M</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'breakdown' && (
            <div className="space-y-4">
              {/* RDS Breakdown */}
              <CostBreakdownCard
                name="Amazon RDS" color="#f97316" icon="🟠"
                total={results.rds.total}
                rows={[
                  { label: 'Compute (instance)', value: results.rds.compute },
                  { label: 'Multi-AZ surcharge', value: results.rds.multiaz },
                  { label: `Read replicas (×${replicaCount})`, value: results.rds.replicas },
                  { label: `Storage (${storageGB} GB gp2)`, value: results.rds.storage },
                  { label: `I/O (${ioMillions}M ops)`, value: results.rds.io },
                ]}
              />
              {/* Aurora Provisioned */}
              <CostBreakdownCard
                name="Aurora Provisioned" color="#a855f7" icon="🟣"
                total={results.aurora.total}
                rows={[
                  { label: 'Compute (writer)', value: results.aurora.compute },
                  { label: `Read replicas (×${replicaCount})`, value: results.aurora.replicas },
                  { label: `Storage (${storageGB} GB)`, value: results.aurora.storage },
                  { label: `I/O (${ioMillions}M ops)`, value: results.aurora.io },
                ]}
              />
              {/* Aurora Serverless */}
              <CostBreakdownCard
                name="Aurora Serverless v2" color="#8b5cf6" icon="⚡"
                total={results.auroraServerless.total}
                note={results.auroraServerless.note}
                rows={[
                  { label: 'Compute (ACU-hours)', value: results.auroraServerless.compute },
                  { label: `Storage (${storageGB} GB)`, value: results.auroraServerless.storage },
                ]}
              />
              {/* PlanetScale */}
              <CostBreakdownCard
                name="PlanetScale (Scaler Pro)" color="#22c55e" icon="🟢"
                total={results.planetscale.total}
                rows={[
                  { label: 'Base plan', value: results.planetscale.base },
                  { label: 'Extra storage', value: results.planetscale.storage },
                  { label: `Row reads (${psRowReadsB}B)`, value: results.planetscale.reads },
                  { label: `Row writes (${psRowWritesM.toLocaleString()}M)`, value: results.planetscale.writes },
                ]}
              />
              {/* Neon */}
              <CostBreakdownCard
                name={`Neon (${results.neon.tier})`} color="#00d4ff" icon="🔵"
                total={results.neon.total}
                rows={[
                  { label: 'Base + compute', value: results.neon.compute },
                  { label: 'Extra storage', value: results.neon.storage },
                ]}
              />
            </div>
          )}
        </div>

        {/* Right — Results (sticky) */}
        <div className="space-y-5 lg:self-start lg:sticky lg:top-28">
          {/* Winner Banner */}
          <div className="rounded-2xl p-6 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${results.winner.color}18 0%, rgba(0,0,0,0) 100%)`,
              border: `1px solid ${results.winner.color}40`,
            }}>
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-2xl opacity-20" style={{ background: results.winner.color }} />
            <div className="text-xs font-bold uppercase tracking-[0.2em] mb-2" style={{ color: 'var(--text-muted)' }}>Cheapest For Your Workload</div>
            <div className="text-2xl font-extrabold mb-1 relative" style={{ fontFamily: 'var(--font-space-grotesk)', color: results.winner.color }}>
              {results.winner.name}
            </div>
            <div className="text-3xl font-black relative" style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--text-primary)' }}>
              {fmt(results.winner.total)}<span className="text-base font-normal ml-1" style={{ color: 'var(--text-muted)' }}>/mo</span>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] mb-4" style={{ color: 'var(--text-muted)' }}>
              Monthly Cost Comparison
            </h3>
            <div className="space-y-3">
              {providers.sort((a, b) => a.total - b.total).map(p => (
                <div key={p.name}>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{p.icon}</span>
                      <span className="text-xs font-semibold" style={{ color: p.total === results.winner.total ? p.color : 'var(--text-secondary)' }}>
                        {p.name}
                        {p.total === results.winner.total && (
                          <span className="ml-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                            style={{ background: `${p.color}20`, color: p.color, border: `1px solid ${p.color}40` }}>
                            CHEAPEST
                          </span>
                        )}
                      </span>
                    </div>
                    <span className="text-xs font-bold" style={{ color: p.color, fontFamily: 'var(--font-jetbrains-mono)' }}>
                      {fmt(p.total)}/mo
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${(p.total / maxTotal) * 100}%`, background: p.color, opacity: 0.8 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Annual Projection */}
          <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] mb-4" style={{ color: 'var(--text-muted)' }}>Annual Cost</h3>
            <div className="grid grid-cols-2 gap-3">
              {providers.map(p => (
                <div key={p.name} className="rounded-xl p-3 text-center"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
                  <div className="text-[10px] mb-1" style={{ color: 'var(--text-muted)' }}>{p.name.split(' ')[0]}</div>
                  <div className="text-sm font-bold" style={{ color: p.color, fontFamily: 'var(--font-jetbrains-mono)' }}>
                    {fmt(p.total * 12)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Use Case Guide */}
          <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] mb-4" style={{ color: 'var(--text-muted)' }}>When to Use Each</h3>
            <div className="space-y-2 text-xs" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              <div><span style={{ color: '#f97316' }}>● RDS</span> — Stable load, broad engine support, lift-and-shift. Best if you need Oracle, MSSQL.</div>
              <div><span style={{ color: '#a855f7' }}>● Aurora</span> — 5× faster than RDS MySQL, global clusters, demanding OLTP workloads.</div>
              <div><span style={{ color: '#8b5cf6' }}>● Aurora Serverless</span> — Variable/bursty traffic, dev environments, scale-to-zero need.</div>
              <div><span style={{ color: '#22c55e' }}>● PlanetScale</span> — Read-heavy MySQL apps, schema branching, no-downtime migrations.</div>
              <div><span style={{ color: '#00d4ff' }}>● Neon</span> — Postgres-only, previews/branches per PR, low-traffic apps needing scale-to-zero.</div>
            </div>
          </div>

          {/* Deep-dive article link */}
          <Link href="/article/rds-vs-aurora-cost-comparison"
            className="block rounded-2xl p-5"
            style={{ background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.2)', textDecoration: 'none', transition: 'all 0.2s ease' }}>
            <div className="text-xs font-bold uppercase tracking-[0.15em] mb-1" style={{ color: '#a855f7' }}>DEEP DIVE</div>
            <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>RDS vs Aurora: The Real Cost Difference</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              When Aurora saves money vs when RDS wins — with real Q1 2026 pricing and I/O math →
            </div>
          </Link>

          {/* Newsletter CTA */}
          <div className="rounded-2xl p-5 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(168,85,247,0.08) 0%, rgba(0,212,255,0.08) 100%)',
              border: '1px solid rgba(168,85,247,0.2)',
            }}>
            <div className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              Get more cost breakdowns
            </div>
            <div className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
              Weekly FinOps teardowns. Real numbers from real teams.
            </div>
            <form action="https://sendfox.com/form/3qdz96/36enr2" method="post" target="_blank" className="space-y-2">
              <input type="email" name="email" placeholder="you@company.com" required
                className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none"
                style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }} />
              <button type="submit" className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
                style={{ background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))', color: '#0d1117' }}>
                Get Free Access →
              </button>
            </form>
          </div>

          {/* Pricing note */}
          <p className="text-[10px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Prices: Q1 2026, us-east-1 / on-demand. RDS gp2 storage. Aurora I/O pricing mode.
            PlanetScale Scaler Pro. Neon Scale plan. Egress not included.{' '}
            <Link href="/resources" className="hover:text-cyan-400 underline transition-colors">Methodology →</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

// ─── Cost Breakdown Card ─────────────────────────────────────────────────────

function CostBreakdownCard({
  name, color, icon, total, rows, note,
}: {
  name: string;
  color: string;
  icon: string;
  total: number;
  rows: { label: string; value: number }[];
  note?: string;
}) {
  return (
    <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: `1px solid ${color}30` }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span>{icon}</span>
          <span className="font-bold text-sm" style={{ color, fontFamily: 'var(--font-space-grotesk)' }}>{name}</span>
        </div>
        <span className="text-lg font-black" style={{ color, fontFamily: 'var(--font-jetbrains-mono)' }}>
          {fmt(total)}<span className="text-xs font-normal ml-1" style={{ color: 'var(--text-muted)' }}>/mo</span>
        </span>
      </div>
      {note && <p className="text-xs mb-3 italic" style={{ color: 'var(--text-muted)' }}>{note}</p>}
      <div className="space-y-1">
        {rows.map(r => (
          <div key={r.label} className="flex justify-between items-center text-xs py-1" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>{r.label}</span>
            <span style={{ color: r.value === 0 ? 'var(--text-muted)' : 'var(--text-primary)', fontFamily: 'var(--font-jetbrains-mono)' }}>
              {r.value === 0 ? 'free' : fmt(r.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
