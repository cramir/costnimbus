---
title: "RDS vs Aurora: The Real Cost Difference in 2026"
description: "Aurora can cost 3× more than RDS at small scale, or save you money at high I/O. Here's the complete decision framework with real pricing numbers."
publishDate: "2026-02-25"
readTime: "11 min"
category: "AWS Databases"
---

Aurora's marketing promises enterprise reliability at cloud-native prices. RDS offers familiar managed MySQL and PostgreSQL without the Aurora premium. But which actually costs less for your workload?

The answer changes dramatically based on three variables: instance size, I/O volume, and whether you enable Aurora Serverless v2. This guide gives you the real numbers.

## The Core Pricing Difference

At baseline — before a single query runs — here's what you're paying:

| Configuration | Hourly Rate | Monthly (730 hrs) |
|---------------|-------------|-------------------|
| RDS db.t3.micro (MySQL) | $0.017/hr | $12.41 |
| RDS db.t3.medium (MySQL) | $0.068/hr | $49.64 |
| RDS db.r6g.large (MySQL) | $0.240/hr | $175.20 |
| Aurora db.t3.medium | $0.082/hr | $59.86 |
| Aurora db.r6g.large | $0.290/hr | $211.70 |
| Aurora Serverless v2 (min 0.5 ACU) | $0.012/hr | $8.74 |

**Key insight:** Aurora instances run approximately 20–25% more expensive than equivalent RDS instances at the same size tier.

But that's only part of the story.

## The I/O Cost That Changes Everything

RDS charges I/O separately for io1 and io2 volumes. Aurora charges **$0.20 per million I/O requests** — a line item that explodes for database-heavy workloads.

### Low I/O Scenario (dev/staging, light CRUD app)

**Monthly I/O:** 10 million requests

| Engine | Storage Cost | I/O Cost | Total Add-on |
|--------|-------------|----------|--------------|
| RDS gp3 (500 GB) | $40.00 | $0.00 | $40.00 |
| Aurora (500 GB) | $57.50 | $2.00 | $59.50 |

In low-I/O scenarios, **RDS gp3 wins** on storage too: $0.08/GB vs Aurora's $0.115/GB.

### High I/O Scenario (analytics, SaaS product database)

**Monthly I/O:** 5 billion requests

| Engine | Storage Cost | I/O Cost | Total Add-on |
|--------|-------------|----------|--------------|
| RDS io2 (500 GB, 10K IOPS) | $62.50 | $0 (included) | $62.50 |
| RDS gp3 (500 GB, provisioned IOPS) | $40.00 + $75.00 | $0 | $115.00 |
| Aurora Standard (500 GB) | $57.50 | $1,000 | $1,057.50 |
| **Aurora I/O-Optimized** | **$86.25** | **$0** | **$86.25** |

This is where **Aurora I/O-Optimized** (launched 2023) changes the math entirely. At a 25% storage premium, it eliminates per-I/O charges. The break-even point is approximately **1 million I/Os per GB of storage per month**.

If your workload is read-heavy or you're running an OLTP database serving real users, Aurora I/O-Optimized often beats every alternative.

## Aurora Serverless v2: The Wildcard

Aurora Serverless v2 scales ACUs (Aurora Capacity Units) between your configured minimum and maximum, billing per second.

**Pricing:** $0.12 per ACU-hour. Each ACU ≈ 2 GB RAM + proportional CPU.

```
Cost = (average_ACU_utilization × hours) × $0.12/ACU-hr
```

### When Serverless v2 wins

**Scenario:** Development database, used 8 hours/day weekdays

```
Traditional Aurora db.t3.medium: $59.86/month (always on)
Serverless v2 (min 0.5 ACU, avg 2 ACU for 8hr/day):
  = 2 ACU × 8hr × 22days × $0.12 = $42.24/month
  = 0.5 ACU × 16hr × 22days × $0.12 + weekends = $21.12/month
Serverless v2 total: ~$30-45/month
```

**Savings: 25–50% for dev databases** that aren't running 24/7.

### When Serverless v2 loses

**Scenario:** Production OLTP database, steady 24/7 load

Serverless v2 at 4 ACU average:
```
4 ACU × 730 hrs × $0.12 = $350.40/month
```

Aurora db.r6g.large (provisioned): $211.70/month

**Provisioned wins by ~40% for steady-state production load.** Serverless v2 is optimized for variable or intermittent workloads, not consistent baseline load.

## Multi-AZ: Where Aurora Has a Real Advantage

This is Aurora's actual architectural advantage, and it's underappreciated:

| Feature | RDS Multi-AZ | Aurora |
|---------|-------------|--------|
| Standby replica | Passive (no reads) | Active (readable) |
| Failover time | 60–120 seconds | 30 seconds |
| Read replicas included | 0 (pay per replica) | Up to 15 (cluster endpoint) |
| Storage replication | Synchronous, 2 AZs | 6 copies across 3 AZs |
| Storage cost for HA | ~2× (standby has own storage) | 1× (shared storage layer) |

If you need read replicas for scaling, **Aurora becomes cost-competitive quickly**:

```
RDS Multi-AZ db.r6g.large + 2 read replicas:
= $350.40 + $175.20 + $175.20 = $700.80/month

Aurora db.r6g.large cluster + 2 read replicas:
= $211.70 + $211.70 + $211.70 = $635.10/month (+ shared storage)
```

Aurora wins when you need multiple read replicas. The shared storage layer means you pay storage once instead of once-per-instance.

## Aurora Global Database: Multi-Region for Less

For multi-region disaster recovery or global low-latency reads:

- **RDS cross-region replica:** Full instance cost × number of regions + cross-region replication data transfer ($0.02/GB)
- **Aurora Global Database:** Adds ~$0.20/million replicated I/Os + standard instance costs per region

For high-write workloads, Aurora Global can be significantly cheaper than RDS cross-region replication due to the efficient low-level replication at the storage layer.

## The Complete Decision Matrix

| Scenario | Recommendation | Reason |
|----------|---------------|--------|
| Dev/test, small budget | RDS db.t3.micro/small | 20–25% cheaper per instance, no Aurora overhead |
| Single instance, gp3 storage, low I/O | RDS gp3 | Cheaper storage, no per-I/O charges at low volume |
| Spiky/intermittent workload | Aurora Serverless v2 | Scale to zero, pay for what you use |
| High I/O (>1M I/Os/GB/month) | Aurora I/O-Optimized | Eliminates $1,000+ monthly I/O bills |
| Need 2+ read replicas | Aurora Provisioned | Shared storage makes multi-replica clusters cheaper |
| Multi-region HA | Aurora Global Database | Efficient storage replication layer |
| Mission-critical failover <30s | Aurora | Faster failover, no passive standby waste |
| Steady single-region production | RDS with reserved instances | 1yr/3yr RI saves 30–60%, simpler pricing |

## Reserved Instance Savings Apply to Both

Both RDS and Aurora support Reserved Instances, which can change the economics significantly:

```
Aurora db.r6g.large On-Demand: $211.70/month
Aurora db.r6g.large 1yr RI (no upfront): $135.48/month (36% off)
Aurora db.r6g.large 3yr RI (all upfront): $85.78/month (59% off)

RDS db.r6g.large On-Demand: $175.20/month
RDS db.r6g.large 3yr RI (all upfront): $70.08/month (60% off)
```

At 3-year RI pricing, the gap between Aurora and RDS narrows significantly because the percentage discounts are similar.

## A Real-World Migration Example

A fintech startup running a SaaS platform migrated from RDS Multi-AZ to Aurora:

**Before (RDS):**
- db.r6g.xlarge Multi-AZ: $700.80/month
- 2 read replicas db.r6g.large: $350.40/month
- 2TB gp3 storage: $160/month
- **Total: $1,211.20/month**

**After (Aurora I/O-Optimized):**
- 1 writer + 2 reader db.r6g.large (shared storage): $635.10/month
- 2TB Aurora I/O-Optimized storage: $287.50/month (25% premium on $230 baseline)
- No per-I/O charges (was ~$800/month at their I/O volume)
- **Total: $922.60/month**

**Savings: $288.60/month (24%) — plus faster failover and better read scaling.**

## How to Right-Size Before You Migrate

Before committing to either engine, use [Performance Insights](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PerfInsights.html) to measure your actual I/O:

```sql
-- Check I/O operations in CloudWatch
aws cloudwatch get-metric-statistics \
  --namespace AWS/RDS \
  --metric-name ReadIOPS \
  --dimensions Name=DBInstanceIdentifier,Value=your-db-id \
  --start-time 2026-02-01T00:00:00Z \
  --end-time 2026-02-25T00:00:00Z \
  --period 86400 \
  --statistics Sum
```

Monthly I/O = Sum of ReadIOPS × seconds + WriteIOPS × seconds

**Aurora I/O-Optimized break-even check:**
```
If (monthly_io_millions × $0.20) > (storage_gb × $0.115 × 0.25)
Then: Aurora I/O-Optimized saves money
```

## Quick Decision Tool

For most teams, the decision tree looks like this:

```
Is your workload intermittent or spiky?
  → YES: Aurora Serverless v2
  → NO: Continue...

Do you need 2+ read replicas?
  → YES: Aurora Provisioned (shared storage is cheaper at scale)
  → NO: Continue...

Are monthly I/O charges >$200?
  → YES: Aurora I/O-Optimized
  → NO: Continue...

Is this dev/test or single-instance production?
  → Dev/test: RDS t3/t4g small instance
  → Production single: RDS gp3 with Reserved Instances
```

Use the [Managed Database Calculator](/calculators/managed-db) to run these numbers for your specific instance size, storage, and I/O volume.

## Summary

- **RDS wins** for dev/test, small workloads, and single-instance steady-state production (especially with RIs)
- **Aurora wins** when you need multiple read replicas, high I/O loads, faster failover, or multi-region
- **Aurora Serverless v2** is the right answer for dev databases and variable workloads
- **Aurora I/O-Optimized** flips the economics for I/O-heavy production databases
- The 20–25% instance price premium is real — you need the architectural benefits to justify it

The biggest mistake teams make is defaulting to Aurora because it sounds better without running the numbers. Run the numbers. For your workload, they might come out very differently.
