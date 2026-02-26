'use client';

import { useState, useMemo } from 'react';
import Breadcrumb from '@/components/breadcrumb';
import NewsletterCard from '@/components/newsletter-card';

// ─── Pricing Data — us-east-1 / eastus / us-east1, Q1 2026 ───────────────

interface InstanceType {
  id: string;
  label: string;
  aws: { name: string; hr: number };
  azure: { name: string; hr: number };
  gcp: { name: string; hr: number };
}

const INSTANCE_TYPES: InstanceType[] = [
  {
    id: 'micro',
    label: '1 vCPU / 1 GB — Micro',
    aws:   { name: 't3.micro',        hr: 0.0104 },
    azure: { name: 'B1s',             hr: 0.0104 },
    gcp:   { name: 'e2-micro',        hr: 0.0084 },
  },
  {
    id: 'small',
    label: '2 vCPU / 4 GB — Small',
    aws:   { name: 't3.medium',       hr: 0.0416 },
    azure: { name: 'B2s',             hr: 0.0416 },
    gcp:   { name: 'e2-small',        hr: 0.0168 },
  },
  {
    id: 'standard-2',
    label: '2 vCPU / 8 GB — Standard',
    aws:   { name: 'm5.large',        hr: 0.0960 },
    azure: { name: 'D2s v5',          hr: 0.0960 },
    gcp:   { name: 'n2-standard-2',   hr: 0.0971 },
  },
  {
    id: 'standard-4',
    label: '4 vCPU / 16 GB — Standard',
    aws:   { name: 'm5.xlarge',       hr: 0.1920 },
    azure: { name: 'D4s v5',          hr: 0.1920 },
    gcp:   { name: 'n2-standard-4',   hr: 0.1942 },
  },
  {
    id: 'standard-8',
    label: '8 vCPU / 32 GB — Standard',
    aws:   { name: 'm5.2xlarge',      hr: 0.3840 },
    azure: { name: 'D8s v5',          hr: 0.3840 },
    gcp:   { name: 'n2-standard-8',   hr: 0.3884 },
  },
  {
    id: 'compute-4',
    label: '4 vCPU / 8 GB — Compute Optimized',
    aws:   { name: 'c5.xlarge',       hr: 0.1700 },
    azure: { name: 'F4s v2',          hr: 0.1690 },
    gcp:   { name: 'c2-standard-4',   hr: 0.2088 },
  },
  {
    id: 'memory-4',
    label: '4 vCPU / 32 GB — Memory Optimized',
    aws:   { name: 'r5.xlarge',       hr: 0.2520 },
    azure: { name: 'E4s v5',          hr: 0.2520 },
    gcp:   { name: 'n2-highmem-4',    hr: 0.2725 },
  },
];

const STORAGE_RATES = {
  aws:   { perGB: 0.0230, egressPerGB: 0.0900, freeTierGB: 100 },
  azure: { perGB: 0.0180, egressPerGB: 0.0870, freeTierGB: 5   },
  gcp:   { perGB: 0.0200, egressPerGB: 0.1200, freeTierGB: 1   },
};

const DB_RATES = {
  aws:   { computeHr: 0.190, storageGBMo: 0.115, service: 'RDS db.m5.large'         },
  azure: { computeHr: 0.107, storageGBMo: 0.115, service: 'MySQL Flex 2 vCPU'       },
  gcp:   { computeHr: 0.124, storageGBMo: 0.170, service: 'Cloud SQL db-standard-2' },
};

const CLOUDS = [
  { id: 'aws'   as const, label: 'AWS',   color: '#FF9900', bg: 'rgba(255,153,0,0.1)',    border: 'rgba(255,153,0,0.3)'   },
  { id: 'azure' as const, label: 'Azure', color: '#00A4EF', bg: 'rgba(0,164,239,0.1)',    border: 'rgba(0,164,239,0.3)'   },
  { id: 'gcp'   as const, label: 'GCP',   color: '#34A853', bg: 'rgba(52,168,83,0.1)',    border: 'rgba(52,168,83,0.3)'   },
] as const;

type CloudId = 'aws' | 'azure' | 'gcp';
type TabId   = 'compute' | 'storage' | 'database' | 'egress';

// ─── Main Component ────────────────────────────────────────────────────────

export default function CloudCompareCalculator() {
  const [activeTab,        setActiveTab]        = useState<TabId>('compute');
  const [instanceTypeIdx,  setInstanceTypeIdx]  = useState(2);
  const [instanceCount,    setInstanceCount]    = useState(5);
  const [computeHrs,       setComputeHrs]       = useState(730);
  const [storageGB,        setStorageGB]        = useState(5000);
  const [egressGB,         setEgressGB]         = useState(500);
  const [dbInstances,      setDbInstances]      = useState(2);
  const [dbStorageGB,      setDbStorageGB]      = useState(500);
  const [dbHrs,            setDbHrs]            = useState(730);

  const inst = INSTANCE_TYPES[instanceTypeIdx];

  const costs = useMemo(() => {
    const compute: Record<CloudId, number> = {
      aws:   inst.aws.hr   * instanceCount * computeHrs,
      azure: inst.azure.hr * instanceCount * computeHrs,
      gcp:   inst.gcp.hr   * instanceCount * computeHrs,
    };

    const storage: Record<CloudId, number> = {
      aws:   STORAGE_RATES.aws.perGB   * storageGB,
      azure: STORAGE_RATES.azure.perGB * storageGB,
      gcp:   STORAGE_RATES.gcp.perGB   * storageGB,
    };

    const egress: Record<CloudId, number> = {
      aws:   Math.max(0, egressGB - STORAGE_RATES.aws.freeTierGB)   * STORAGE_RATES.aws.egressPerGB,
      azure: Math.max(0, egressGB - STORAGE_RATES.azure.freeTierGB) * STORAGE_RATES.azure.egressPerGB,
      gcp:   Math.max(0, egressGB - STORAGE_RATES.gcp.freeTierGB)   * STORAGE_RATES.gcp.egressPerGB,
    };

    const database: Record<CloudId, number> = {
      aws:   DB_RATES.aws.computeHr   * dbInstances * dbHrs + DB_RATES.aws.storageGBMo   * dbStorageGB * dbInstances,
      azure: DB_RATES.azure.computeHr * dbInstances * dbHrs + DB_RATES.azure.storageGBMo * dbStorageGB * dbInstances,
      gcp:   DB_RATES.gcp.computeHr   * dbInstances * dbHrs + DB_RATES.gcp.storageGBMo   * dbStorageGB * dbInstances,
    };

    const total: Record<CloudId, number> = {
      aws:   compute.aws   + storage.aws   + egress.aws   + database.aws,
      azure: compute.azure + storage.azure + egress.azure + database.azure,
      gcp:   compute.gcp   + storage.gcp   + egress.gcp   + database.gcp,
    };

    return { compute, storage, egress, database, total };
  }, [inst, instanceCount, computeHrs, storageGB, egressGB, dbInstances, dbStorageGB, dbHrs]);

  const fmt  = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;
  const fmtD = (n: number) => `$${n.toFixed(4)}`;

  const totals    = [costs.total.aws, costs.total.azure, costs.total.gcp];
  const maxTotal  = Math.max(...totals);
  const minTotal  = Math.min(...totals);
  const cheapestCloud = CLOUDS.find(c => costs.total[c.id] === minTotal)!;
  const savings   = maxTotal - minTotal;

  const tabs: { id: TabId; label: string; icon: string }[] = [
    { id: 'compute',  label: 'Compute',  icon: '⚙️' },
    { id: 'storage',  label: 'Storage',  icon: '🗄️' },
    { id: 'database', label: 'Database', icon: '🔌' },
    { id: 'egress',   label: 'Egress',   icon: '🌐' },
  ];

  return (
    <main className="min-h-screen pt-28 pb-20 calc-main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "AWS vs Azure vs GCP Cloud Cost Calculator",
          "description": "Compare AWS, Microsoft Azure, and Google Cloud Platform costs for your exact workload — compute, storage, databases, and egress. Find the cheapest cloud for your use case.",
          "url": "https://costnimbus.com/calculators/cloud-compare",
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
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Calculators', href: '/calculators' }, { label: 'AWS vs Azure vs GCP' }]} />
      </div>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 pt-4 pb-8 text-center">
        <span className="inline-block mb-4 text-xs font-bold uppercase tracking-[0.2em] px-5 py-2 rounded-full"
          style={{ color: 'var(--accent-cyan)', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)' }}>
          Calculator
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4"
          style={{
            fontFamily: 'var(--font-space-grotesk)',
            background: 'linear-gradient(135deg, var(--text-primary) 40%, var(--accent-cyan) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
          AWS vs Azure vs GCP
        </h1>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          Compare real monthly costs across all three major cloud providers for your actual workload.
          Compute, object storage, managed databases, and egress — side by side, no vendor spin.
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-[1fr_420px] gap-8 items-start">

        {/* ── Left: Inputs ───────────────────────────────────────────────── */}
        <div className="space-y-6">

          {/* Tab Bar */}
          <div className="flex gap-2 flex-wrap">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                style={{
                  background: activeTab === t.id
                    ? 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))'
                    : 'rgba(255,255,255,0.04)',
                  color: activeTab === t.id ? '#0d1117' : 'var(--text-secondary)',
                  border: activeTab === t.id ? 'none' : '1px solid var(--border-subtle)',
                }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* ── Compute Tab ──────────────────────────────────────────────── */}
          {activeTab === 'compute' && (
            <Panel accent="cyan" title="⚙️ Virtual Machines / Compute">
              <div className="mb-6">
                <label className="text-sm font-semibold block mb-3" style={{ color: 'var(--text-primary)' }}>
                  Instance Size
                </label>
                <div className="grid sm:grid-cols-2 gap-2">
                  {INSTANCE_TYPES.map((it, i) => (
                    <button key={it.id} onClick={() => setInstanceTypeIdx(i)}
                      className="rounded-xl p-3.5 text-left transition-all duration-200"
                      style={{
                        background: instanceTypeIdx === i ? 'rgba(0,212,255,0.08)' : 'rgba(255,255,255,0.02)',
                        border: instanceTypeIdx === i
                          ? '1px solid rgba(0,212,255,0.4)'
                          : '1px solid var(--border-subtle)',
                      }}>
                      <div className="text-xs font-semibold mb-1.5"
                        style={{ color: instanceTypeIdx === i ? 'var(--accent-cyan)' : 'var(--text-primary)' }}>
                        {it.label}
                      </div>
                      <div className="flex gap-3 text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        <span style={{ color: '#FF9900' }}>AWS ${it.aws.hr.toFixed(4)}/hr</span>
                        <span style={{ color: '#00A4EF' }}>AZ ${it.azure.hr.toFixed(4)}/hr</span>
                        <span style={{ color: '#34A853' }}>GCP ${it.gcp.hr.toFixed(4)}/hr</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <SliderInput
                  label="Number of Instances" unit="instances" value={instanceCount}
                  min={1} max={100} step={1} onChange={setInstanceCount}
                  hint={`${instanceCount}x ${inst.aws.name} (AWS equiv.)`}
                />
                <SliderInput
                  label="Hours per Month" unit="hrs" value={computeHrs}
                  min={1} max={744} step={1} onChange={setComputeHrs}
                  hint={computeHrs >= 730 ? 'Full month — always-on' : `${((computeHrs / 730) * 100).toFixed(0)}% duty cycle`}
                />
              </div>

              <CompareTable
                rows={CLOUDS.map(c => ({
                  label: c.label,
                  color: c.color,
                  cols: [
                    inst[c.id as CloudId].name,
                    `${fmtD(inst[c.id as CloudId].hr)}/hr`,
                    fmt(costs.compute[c.id as CloudId]),
                  ],
                }))}
                headers={['Provider', 'Instance', '$/hr', 'Monthly']}
              />
            </Panel>
          )}

          {/* ── Storage Tab ──────────────────────────────────────────────── */}
          {activeTab === 'storage' && (
            <Panel accent="cyan" title="🗄️ Object Storage (S3 / Azure Blob / GCS)">
              <SliderInput
                label="Storage Amount" unit="GB" value={storageGB}
                min={100} max={200000} step={100} onChange={setStorageGB}
                hint="Standard/hot tier — us-east region pricing"
              />

              <div className="mt-6 rounded-xl p-4 space-y-3"
                style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.12)' }}>
                <div className="text-xs font-bold uppercase tracking-[0.15em] mb-2" style={{ color: 'var(--accent-cyan)' }}>
                  Storage Pricing ($/GB-month)
                </div>
                {CLOUDS.map(c => (
                  <div key={c.id} className="flex items-center gap-3">
                    <span className="text-xs font-bold w-12" style={{ color: c.color }}>{c.label}</span>
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(STORAGE_RATES[c.id].perGB / 0.025) * 100}%`,
                          background: c.color,
                          opacity: 0.8,
                        }} />
                    </div>
                    <span className="text-xs font-mono w-14 text-right" style={{ color: 'var(--text-secondary)' }}>
                      ${STORAGE_RATES[c.id].perGB.toFixed(4)}
                    </span>
                    <span className="text-xs font-bold w-16 text-right" style={{ color: 'var(--text-primary)' }}>
                      {fmt(costs.storage[c.id])}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-xl p-4"
                style={{ background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.2)' }}>
                <div className="text-xs font-bold mb-2" style={{ color: '#4ade80' }}>💡 Pro Tip</div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Azure Blob LRS is the cheapest at $0.018/GB, saving ~22% vs AWS S3. But don't forget
                  egress — Azure charges significantly more than AWS for data transfer out.
                  Run the Egress tab to see the full picture.
                </p>
              </div>
            </Panel>
          )}

          {/* ── Database Tab ─────────────────────────────────────────────── */}
          {activeTab === 'database' && (
            <Panel accent="purple" title="🔌 Managed Relational Database">
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                Comparing equivalent configurations: <strong style={{ color: 'var(--text-secondary)' }}>AWS RDS db.m5.large</strong> ·{' '}
                <strong style={{ color: 'var(--text-secondary)' }}>Azure MySQL Flex 2 vCPU GP</strong> ·{' '}
                <strong style={{ color: 'var(--text-secondary)' }}>GCP Cloud SQL db-standard-2</strong>
              </p>

              <div className="space-y-6">
                <SliderInput
                  label="Database Instances" unit="instances" value={dbInstances}
                  min={1} max={20} step={1} onChange={setDbInstances}
                  hint="Use 2× for primary + replica (HA) setups"
                  accentColor="var(--accent-purple)"
                />
                <SliderInput
                  label="Storage per Instance" unit="GB" value={dbStorageGB}
                  min={20} max={10000} step={20} onChange={setDbStorageGB}
                  hint="Provisioned SSD storage"
                  accentColor="var(--accent-purple)"
                />
                <SliderInput
                  label="Hours per Month" unit="hrs" value={dbHrs}
                  min={1} max={744} step={1} onChange={setDbHrs}
                  hint={dbHrs >= 730 ? 'Always-on production' : `${((dbHrs / 730) * 100).toFixed(0)}% uptime`}
                  accentColor="var(--accent-purple)"
                />
              </div>

              <div className="mt-6 rounded-xl overflow-hidden" style={{ border: '1px solid var(--border-subtle)' }}>
                <div className="grid grid-cols-5 text-[10px] font-bold uppercase tracking-[0.1em] px-4 py-3"
                  style={{ background: 'rgba(255,255,255,0.03)', color: 'var(--text-muted)' }}>
                  <span className="col-span-1">Provider</span>
                  <span className="col-span-2">Service</span>
                  <span className="text-right">Compute</span>
                  <span className="text-right">Storage</span>
                </div>
                {CLOUDS.map(c => {
                  const computePart  = DB_RATES[c.id].computeHr * dbInstances * dbHrs;
                  const storagePart  = DB_RATES[c.id].storageGBMo * dbStorageGB * dbInstances;
                  return (
                    <div key={c.id} className="grid grid-cols-5 text-xs px-4 py-3 items-center"
                      style={{ borderTop: '1px solid var(--border-subtle)' }}>
                      <span className="font-bold" style={{ color: c.color }}>{c.label}</span>
                      <span className="col-span-2 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                        {DB_RATES[c.id].service}
                      </span>
                      <span className="text-right font-mono" style={{ color: 'var(--text-secondary)' }}>{fmt(computePart)}</span>
                      <span className="text-right font-mono" style={{ color: 'var(--text-secondary)' }}>{fmt(storagePart)}</span>
                    </div>
                  );
                })}
              </div>
            </Panel>
          )}

          {/* ── Egress Tab ───────────────────────────────────────────────── */}
          {activeTab === 'egress' && (
            <Panel accent="purple" title="🌐 Data Transfer Out (Egress to Internet)">
              <div className="rounded-xl p-4 mb-6"
                style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <div className="text-xs font-bold mb-1" style={{ color: '#f87171' }}>⚠️ The Silent Bill Killer</div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Egress is where cloud providers make up for cheap storage. AWS charges $0.09/GB,
                  GCP $0.12/GB. A startup streaming 10TB/month pays $900–$1,200 just to move data out.
                </p>
              </div>

              <SliderInput
                label="Monthly Outbound Transfer" unit="GB" value={egressGB}
                min={0} max={100000} step={100} onChange={setEgressGB}
                hint="Data transferred from cloud to the public internet"
                accentColor="var(--accent-purple)"
              />

              <div className="mt-6 grid grid-cols-3 gap-3">
                {CLOUDS.map(c => (
                  <div key={c.id} className="rounded-xl p-4 text-center"
                    style={{ background: c.bg, border: `1px solid ${c.border}` }}>
                    <div className="text-xs font-bold mb-1" style={{ color: c.color }}>{c.label}</div>
                    <div className="text-lg font-extrabold mb-1"
                      style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--text-primary)' }}>
                      {fmt(costs.egress[c.id])}
                    </div>
                    <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      ${STORAGE_RATES[c.id].egressPerGB}/GB · {STORAGE_RATES[c.id].freeTierGB}GB free
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-xl p-4"
                style={{ background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.2)' }}>
                <div className="text-xs font-bold mb-2" style={{ color: '#4ade80' }}>💡 Escape Egress Entirely</div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Cloudflare R2 and Backblaze B2 both charge <strong style={{ color: 'var(--text-primary)' }}>$0 for egress</strong>.
                  If your workload is egress-heavy, migrating object storage to R2 alone can eliminate
                  thousands in monthly bills. See our{' '}
                  <a href="/calculators/storage" className="underline" style={{ color: 'var(--accent-cyan)' }}>
                    Storage Calculator
                  </a>{' '}
                  for the comparison.
                </p>
              </div>
            </Panel>
          )}

          {/* ── Insight Cards ────────────────────────────────────────────── */}
          <InsightCards cheapest={cheapestCloud} />
        </div>

        {/* ── Right: Results (sticky) ────────────────────────────────────── */}
        <div className="space-y-6 lg:sticky lg:top-28">

          {/* Winner Banner */}
          <div className="rounded-2xl p-8 text-center relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${cheapestCloud.bg} 0%, rgba(168,85,247,0.08) 100%)`,
              border: `1px solid ${cheapestCloud.border}`,
            }}>
            <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full opacity-20 blur-3xl"
              style={{ background: cheapestCloud.color }} />
            <div className="text-xs font-bold uppercase tracking-[0.2em] mb-2" style={{ color: 'var(--text-muted)' }}>
              Cheapest for Your Workload
            </div>
            <div className="text-5xl font-extrabold mb-1"
              style={{ fontFamily: 'var(--font-space-grotesk)', color: cheapestCloud.color }}>
              {cheapestCloud.label}
            </div>
            <div className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              {fmt(minTotal)}<span className="text-sm font-normal ml-1" style={{ color: 'var(--text-muted)' }}>/mo</span>
            </div>
            <div className="text-sm" style={{ color: '#4ade80' }}>
              saves {fmt(savings)}/mo vs most expensive
            </div>
            <div className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
              {fmt(savings * 12)}/year potential savings
            </div>
          </div>

          {/* Total Cost Bars */}
          <div className="rounded-2xl p-6 calc-panel">
            <div className="text-xs font-bold uppercase tracking-[0.2em] mb-5" style={{ color: 'var(--text-muted)' }}>
              Total Monthly Cost
            </div>
            <div className="space-y-4">
              {CLOUDS.map(c => {
                const total = costs.total[c.id];
                const pct   = maxTotal > 0 ? (total / maxTotal) * 100 : 0;
                const isMin = total === minTotal;
                return (
                  <div key={c.id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold" style={{ color: c.color }}>{c.label}</span>
                        {isMin && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                            style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.3)' }}>
                            CHEAPEST
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-bold" style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--text-primary)' }}>
                        {fmt(total)}
                      </span>
                    </div>
                    <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: c.color, opacity: isMin ? 1 : 0.55 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
            <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <div className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--text-muted)' }}>
                Cost Breakdown by Category
              </div>
            </div>
            {(['compute', 'storage', 'database', 'egress'] as const).map(cat => {
              const catCosts = costs[cat];
              const maxCat   = Math.max(catCosts.aws, catCosts.azure, catCosts.gcp);
              return (
                <div key={cat} className="px-6 py-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <div className="text-[11px] font-bold uppercase tracking-[0.15em] mb-3 capitalize"
                    style={{ color: 'var(--text-secondary)' }}>
                    {cat === 'compute' ? '⚙️' : cat === 'storage' ? '🗄️' : cat === 'database' ? '🔌' : '🌐'} {cat}
                  </div>
                  <div className="space-y-1.5">
                    {CLOUDS.map(c => {
                      const val = catCosts[c.id];
                      const barPct = maxCat > 0 ? (val / maxCat) * 80 + 20 : 20;
                      return (
                        <div key={c.id} className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold w-10" style={{ color: c.color }}>{c.label}</span>
                          <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <div className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${barPct}%`, background: c.color, opacity: 0.7 }} />
                          </div>
                          <span className="text-[11px] font-mono w-14 text-right" style={{ color: 'var(--text-secondary)' }}>
                            {fmt(val)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            {/* Annual Totals */}
            <div className="px-6 py-4">
              <div className="text-[11px] font-bold uppercase tracking-[0.15em] mb-3" style={{ color: 'var(--text-muted)' }}>
                📅 Annual Projection
              </div>
              <div className="grid grid-cols-3 gap-3">
                {CLOUDS.map(c => (
                  <div key={c.id} className="rounded-xl p-3 text-center"
                    style={{ background: c.bg, border: `1px solid ${c.border}` }}>
                    <div className="text-[10px] font-bold mb-1" style={{ color: c.color }}>{c.label}</div>
                    <div className="text-sm font-extrabold" style={{ color: 'var(--text-primary)' }}>
                      {fmt(costs.total[c.id] * 12)}
                    </div>
                    <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>/year</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Newsletter CTA */}
          <NewsletterCTA />
        </div>
      </div>

      {/* ── Pricing Notes ─────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 mt-16">
        <div className="rounded-2xl p-6 calc-panel">
          <div className="text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{ color: 'var(--text-muted)' }}>
            Pricing Methodology &amp; Notes
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>Region:</strong> us-east-1 (AWS) · East US (Azure) · us-east1 (GCP).
              Prices vary by region; EU/APAC typically 10–20% higher.
            </div>
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>Pricing type:</strong> On-demand / pay-as-you-go.
              Reserved instances / committed-use discounts can reduce compute 40–70%.
            </div>
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>Database:</strong> Equivalent-tier managed MySQL/PostgreSQL instances.
              Enterprise features (HA, backups) may add cost.
            </div>
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>Last updated:</strong> Q1 2026. Cloud pricing changes frequently —
              verify current rates at each provider&rsquo;s pricing calculator.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ─── Reusable Sub-components ─────────────────────────────────────────────── */

function Panel({ accent, title, children }: { accent: 'cyan' | 'purple'; title: string; children: React.ReactNode }) {
  const gradFrom = accent === 'cyan'   ? 'rgba(0,212,255,0.3)'   : 'rgba(168,85,247,0.3)';
  const gradTo   = accent === 'cyan'   ? 'rgba(168,85,247,0.3)'  : 'rgba(0,212,255,0.3)';
  const color    = accent === 'cyan'   ? 'var(--accent-cyan)'     : 'var(--accent-purple)';
  return (
    <div className="rounded-2xl p-[1px]" style={{ background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})` }}>
      <div className="rounded-2xl p-8" style={{ background: 'var(--bg-card)' }}>
        <div className="text-xs font-bold uppercase tracking-[0.2em] mb-6" style={{ color }}>{title}</div>
        {children}
      </div>
    </div>
  );
}

function SliderInput({
  label, unit, value, min, max, step, onChange, hint, accentColor = 'var(--accent-cyan)',
}: {
  label: string; unit: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; hint?: string; accentColor?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</label>
        <span className="text-sm font-bold font-mono px-3 py-1 rounded-lg"
          style={{ background: 'rgba(0,212,255,0.08)', color: accentColor, border: '1px solid rgba(0,212,255,0.15)' }}>
          {value.toLocaleString()} {unit}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${accentColor} 0%, ${accentColor} ${pct}%, rgba(255,255,255,0.1) ${pct}%, rgba(255,255,255,0.1) 100%)`,
          accentColor,
        }}
      />
      {hint && <div className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>{hint}</div>}
    </div>
  );
}

function CompareTable({ rows, headers }: {
  rows: { label: string; color: string; cols: string[] }[];
  headers: string[];
}) {
  const cols = headers.length;
  const gridStyle = { gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` };
  return (
    <div className="mt-6 rounded-xl overflow-hidden" style={{ border: '1px solid var(--border-subtle)' }}>
      <div className="grid text-[10px] font-bold uppercase tracking-[0.1em] px-4 py-3"
        style={{ ...gridStyle, background: 'rgba(255,255,255,0.03)', color: 'var(--text-muted)' }}>
        {headers.map(h => <span key={h}>{h}</span>)}
      </div>
      {rows.map(r => (
        <div key={r.label} className="grid text-xs px-4 py-3 items-center"
          style={{ ...gridStyle, borderTop: '1px solid var(--border-subtle)' }}>
          <span className="font-bold" style={{ color: r.color }}>{r.label}</span>
          {r.cols.map((col, i) => (
            <span key={i} className={i === r.cols.length - 1 ? 'font-mono font-bold' : 'font-mono'}
              style={{ color: i === r.cols.length - 1 ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
              {col}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

function InsightCards({ cheapest }: { cheapest: (typeof CLOUDS)[number] }) {
  const tips = [
    {
      icon: '💡',
      title: 'Reserved Instances Cut Compute 40–70%',
      body: 'All three providers offer 1- or 3-year reserved/committed-use pricing. On AWS, a 3-year no-upfront reserved m5.large drops from $0.096/hr to ~$0.029/hr — a 70% reduction. The calculator shows on-demand rates; lock in for production.',
    },
    {
      icon: '🌍',
      title: 'Egress is the Hidden Multiplier',
      body: 'Cloud pricing sheets focus on compute and storage, but egress is where bills balloon. AWS\'s 100 GB free tier helps smaller workloads; at scale (10TB+), all three providers charge $900–$1,200/month just to send data to users. CDNs (Cloudflare, Fastly) can route around this.',
    },
    {
      icon: '🔄',
      title: 'Multi-Cloud Adds Ops Overhead',
      body: 'The cheapest provider on paper may not be cheapest when you factor in migration cost, retraining, and multi-cloud tooling. A 10% cost difference rarely justifies switching; a 30%+ sustained difference starts to make sense.',
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-5">
      {tips.map(t => (
        <div key={t.title} className="rounded-2xl p-6"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
          <div className="text-3xl mb-3">{t.icon}</div>
          <h3 className="font-bold text-sm mb-2" style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--text-primary)' }}>
            {t.title}
          </h3>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{t.body}</p>
        </div>
      ))}
    </div>
  );
}

function NewsletterCTA() {
  return (
    <NewsletterCard
      headline="Get cloud cost tactics in your inbox"
      description="Real saves. No vendor fluff. Engineers only."
    />
  );
}
