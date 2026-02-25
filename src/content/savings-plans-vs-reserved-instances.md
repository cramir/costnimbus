---
title: "AWS Savings Plans vs Reserved Instances: Which Saves More in 2026?"
description: "Savings Plans are more flexible, but Reserved Instances can save 5–10% more in specific scenarios. Here is the complete decision guide with real numbers."
publishDate: "2026-02-25"
readTime: "10 min"
category: "AWS Cost Optimization"
---

AWS offers two commitment-based discount programs: Savings Plans and Reserved Instances. Both require a 1-year or 3-year commitment in exchange for significant discounts over On-Demand pricing. But they work differently, cover different services, and the right choice depends on your workload profile.

This guide breaks down exactly when each option saves more money, with real pricing numbers and a decision framework you can apply to your own fleet.

## The Core Difference

**Reserved Instances (RIs)** are a commitment to a specific instance configuration: instance family, region, OS, and tenancy. You're essentially pre-paying for a specific EC2 box.

**Savings Plans (SPs)** are a commitment to a dollar-per-hour spend level. You're promising to spend at least $X/hour on eligible compute, and AWS gives you a discount on everything up to that commitment.

Both offer the same discount tiers (No Upfront, Partial Upfront, All Upfront) and terms (1-year, 3-year). The difference is what you're committing to.

## Reserved Instances Explained

### Types of Reserved Instances

**Standard RIs:**
- Locked to a specific instance family, region, and OS
- Can modify within the same instance family (e.g., split one m6i.xlarge into two m6i.large)
- Cannot change instance family, region, or OS
- Highest discount: up to 72% off On-Demand (3yr All Upfront)
- Can be sold on the RI Marketplace if no longer needed

**Convertible RIs:**
- Can be exchanged for a different instance family, OS, or tenancy
- Must exchange for equal or greater value
- Lower discount: up to 66% off On-Demand (3yr All Upfront)
- Cannot be sold on the RI Marketplace

### RI Pricing Table (m6i.large, us-east-1, Linux)

| Term | Payment | Effective $/hr | vs On-Demand | Annual Cost |
|---|---|---|---|---|
| On-Demand | — | $0.0960 | — | $700.80 |
| 1yr Standard No Upfront | Hourly | $0.0608 | 37% off | $443.84 |
| 1yr Standard Partial Upfront | $271 + hourly | $0.0571 | 41% off | $416.85 |
| 1yr Standard All Upfront | $485 | $0.0553 | 42% off | $485.00 |
| 3yr Standard No Upfront | Hourly | $0.0430 | 55% off | $313.90 |
| 3yr Standard All Upfront | $1,005 | $0.0384 | 60% off | $335.00/yr |
| 3yr Convertible All Upfront | $1,123 | $0.0428 | 55% off | $374.33/yr |

### Payment Options

- **No Upfront:** No money due today. Billed monthly at the discounted rate. Lowest commitment risk, lowest discount.
- **Partial Upfront:** Pay ~50% now, rest billed monthly. Middle ground.
- **All Upfront:** Pay 100% now. Highest discount, highest cash outlay.

## Savings Plans Explained

### Types of Savings Plans

**Compute Savings Plans:**
- Applies to EC2, Fargate, and Lambda across ALL regions, instance families, sizes, OS, and tenancy
- Most flexible option
- Discount: up to 66% off On-Demand (3yr All Upfront)
- The "set it and forget it" choice

**EC2 Instance Savings Plans:**
- Applies to a specific EC2 instance family in a specific region
- More restrictive than Compute SP, but deeper discount
- Discount: up to 72% off On-Demand (3yr All Upfront) — matches Standard RI
- Automatically applies to any size within that family

**SageMaker Savings Plans:**
- Applies to SageMaker ML instances
- Similar flexibility to Compute SP but for ML workloads
- Not relevant to this comparison

### How Savings Plans Apply

You commit to a dollar-per-hour amount. AWS automatically applies the discount to your highest-cost eligible usage first.

Example: You commit to $10/hr Compute Savings Plan.
- Your EC2 On-Demand cost this hour: $15/hr across various instances
- SP covers the first $10/hr worth of usage at the discounted rate
- Remaining $5/hr is billed at On-Demand
- If you move to a different instance family next month, the SP still applies

## Side-by-Side Comparison

| Feature | Standard RI | Convertible RI | EC2 Instance SP | Compute SP |
|---|---|---|---|---|
| Max discount (3yr All Up) | 72% | 66% | 72% | 66% |
| Instance family flexibility | No | Yes (exchange) | No | Yes |
| Region flexibility | No | No | No | Yes |
| Size flexibility | Yes (within family) | Yes | Yes | Yes |
| OS flexibility | No | Yes (exchange) | No | Yes |
| Covers Fargate/Lambda | No | No | No | Yes |
| Sellable on marketplace | Yes | No | No | No |
| Automatic application | Per-instance | Per-instance | Automatic | Automatic |
| Scope | Regional or Zonal | Regional | Regional | Global |

## When Reserved Instances Win

RIs beat Savings Plans in specific scenarios:

### 1. Single instance family, steady-state fleet

If you're running 50 m6i.2xlarge instances 24/7 and have zero plans to change, Standard RIs give you the deepest discount (up to 72% off vs 66% for Compute SP).

**Savings difference:** On a $100K annual EC2 bill, that's $6K more savings per year with Standard RIs.

### 2. Zonal capacity reservation

Standard RIs purchased for a specific Availability Zone include a capacity reservation — AWS guarantees your instances will launch in that AZ. This is critical for:
- Compliance requirements (data residency)
- Applications requiring specific AZ placement
- DR scenarios where capacity must be available

Savings Plans provide no capacity reservation.

### 3. RI Marketplace liquidity

If your plans change, you can sell Standard RIs on the AWS RI Marketplace and recover some of your investment. You can't sell Savings Plans — they're non-transferable.

### 4. Large homogeneous fleet

The more homogeneous your fleet (same instance family, same region, same OS), the more Standard RIs save over Compute SP. The gap is 5–10%.

## When Savings Plans Win

### 1. Mixed workloads across services

If your compute spans EC2, Fargate, and Lambda, Compute Savings Plans cover all of them with a single commitment. RIs only cover EC2.

**Real example:** A team running:
- $8,000/mo EC2
- $3,000/mo Fargate
- $1,000/mo Lambda

Compute SP covers all $12,000/mo. RIs only cover the $8,000 EC2 portion.

### 2. Frequent instance family changes

If you're actively migrating from Intel to Graviton, or experimenting with different instance types, Compute SP automatically adjusts. Standard RIs lock you in.

### 3. Multi-region deployment

Compute Savings Plans work across all AWS regions. If you're expanding from us-east-1 to eu-west-1, the same SP applies. RIs require separate purchases per region.

### 4. Variable instance sizes

As you scale up and down (m6i.large today, m6i.4xlarge tomorrow), Savings Plans apply automatically. RIs require modification or exchange.

### 5. Simplicity

Savings Plans require zero management after purchase. AWS automatically applies the discount to your most expensive eligible usage. RIs require matching specific instances and managing exchanges/modifications.

## Stacking: Can You Use Both?

**Yes.** Many teams layer both for maximum savings:

1. **EC2 Instance SP** for your predictable base load (same discount as Standard RI, but automatic size flexibility)
2. **Compute SP** for the variable portion (covers Fargate, Lambda, and any EC2 overflow)
3. **Standard RI** for zonal capacity reservation where required

AWS applies discounts in this order:
1. Zonal RIs (most specific)
2. Regional RIs
3. EC2 Instance Savings Plans
4. Compute Savings Plans
5. On-Demand (everything else)

**Pro tip:** Start with Compute SP for broad coverage, then layer EC2 Instance SP or Standard RIs for your most predictable workloads where the extra 5–6% discount matters.

## Calculating Your Break-Even

Both RIs and SPs require minimum utilization to beat On-Demand. The break-even point depends on the payment option:

**1yr No Upfront:**
- Break-even: ~67% utilization (4,891 hrs/yr out of 8,760)
- Monthly: ~489 hrs/mo out of 730

**1yr All Upfront:**
- Break-even: ~55% utilization (higher commitment risk)

**3yr All Upfront:**
- Break-even: ~38% utilization (very forgiving)

**Rule of thumb:** If your workload runs 60%+ of the time, a 1yr No Upfront commitment saves money vs On-Demand with minimal risk.

### Commitment Sizing Formula

```
Recommended SP commitment =
  (Avg hourly On-Demand cost over last 30 days) × 0.70

# Example:
# Avg hourly On-Demand: $50/hr
# Recommended SP: $50 × 0.70 = $35/hr commitment
# This covers your base load; spikes remain On-Demand
```

Why 70%? This accounts for daily/weekly variation and gives headroom for optimization (right-sizing may reduce your bill).

## Tools for Decision-Making

### AWS Cost Explorer Recommendations

AWS provides built-in SP and RI recommendations:

1. Go to AWS Cost Explorer → Savings Plans → Recommendations
2. Select term (1yr/3yr), payment option, and lookback period (30/60 days)
3. AWS shows recommended commitment level and projected savings

For RIs:
1. Cost Explorer → Reservations → RI Recommendations
2. Filter by instance family and payment option
3. Compare the recommended RI count with your actual usage

### Spot + RI/SP Hybrid Strategy

The optimal strategy for most teams:
- **70% base load:** Covered by Savings Plans or RIs
- **20% variable load:** On-Demand (covered by SP when active)
- **10% fault-tolerant:** Spot Instances (up to 90% discount)

This combination typically achieves 45–55% overall savings vs pure On-Demand.

## Real Example: $180K vs $156K

**Company profile:**
- 120 EC2 instances (mixed m6i, c6i, r6i families)
- Running 24/7 in us-east-1
- On-Demand annual cost: $450,000

**Option A: Compute Savings Plan (3yr Partial Upfront)**
- Commitment: $35/hr
- Annual savings: **$180,000** (40% off)
- Flexibility: can change instance families, add Fargate/Lambda

**Option B: Standard RIs (3yr Partial Upfront)**
- Purchased per instance family
- Annual savings: **$156,000** (35% off)
- Wait — shouldn't RIs save *more*?

**The nuance:** This team runs a *mixed* fleet. Standard RIs for m6i covered 50% of the fleet well, but c6i and r6i instances were partially utilized. The RI discount didn't apply when instances scaled below the reserved count. The Compute SP's flexibility to float across all usage resulted in higher *effective* coverage.

**When RIs would have won:** If this team ran 120 identical m6i instances with zero variation, Standard RIs would save ~$198,000 (44% off) — $18K more than the SP.

**Takeaway:** Mixed fleets favor Savings Plans. Homogeneous fleets favor RIs.

## Step-by-Step: How to Purchase

### Savings Plans (recommended starting point)

1. Go to **AWS Cost Explorer** → **Savings Plans** → **Recommendations**
2. Review the recommended hourly commitment
3. Choose **Compute Savings Plan** (most flexible) or **EC2 Instance SP** (deeper discount)
4. Select term: **1yr No Upfront** for first-timers (lowest risk)
5. Select hourly commitment amount
6. Click **Add to cart** → **Submit order**
7. Monitor coverage in Cost Explorer → Savings Plans → Utilization

### Reserved Instances

1. Go to **EC2 Console** → **Reserved Instances** → **Purchase Reserved Instances**
2. Filter by instance type, platform, tenancy, term
3. Review pricing and coverage
4. Click **Purchase**
5. Monitor utilization in Cost Explorer → Reservations → Utilization

**Start conservative.** Buy a 1yr No Upfront commitment covering 50–70% of your steady-state usage. Add more coverage after 30 days of monitoring utilization.

## The Verdict

For most teams in 2026, **Compute Savings Plans** are the right default:
- They cover EC2 + Fargate + Lambda
- They automatically adjust to instance family and region changes
- They're zero-management after purchase
- The discount gap vs Standard RIs (66% vs 72%) is worth the flexibility for most workloads

Use **Standard RIs** when:
- You need capacity reservation
- You have a large, homogeneous, never-changing fleet
- You want the absolute maximum discount
- You want the option to resell on the marketplace

Use **both** when your annual compute bill exceeds $100K — the stacking strategy maximizes coverage at every discount tier.

---

*Use the [EC2 Pricing Calculator](/calculators/ec2-pricing) to compare On-Demand, Reserved Instance, and Spot pricing for your specific instance types and usage patterns.*
