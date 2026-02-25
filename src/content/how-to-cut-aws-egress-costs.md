---
title: "How to Cut Your AWS Egress Bill by 80% (Without Changing Your App)"
description: "AWS charges $0.09/GB to move data out. Here are five proven techniques—VPC endpoints, Cloudflare R2, CloudFront, PrivateLink, and S3 Transfer Acceleration avoidance—that teams use to cut egress by 70–91%."
publishDate: "2026-02-25"
readTime: "12 min"
category: "AWS Cost Optimization"
---

AWS data transfer pricing is a trap. You build an elegant distributed system, deploy it, and then the bill arrives. $0.09 per GB leaving the region. Multiply that by terabytes of analytics, API responses, log exports, and media delivery—and you're looking at one of the fastest-growing line items in your AWS bill.

Here's the thing: most of that egress is avoidable. Not by changing your application logic, but by changing *where traffic flows*.

This guide walks through five concrete techniques that teams use to cut egress bills by 70–91%. Real numbers, real architectures, no vendor fluff.

## Why Egress Costs Are So Brutal

Before we fix it, let's quantify the problem. AWS data transfer pricing (us-east-1, 2026):

| Traffic Type | Cost |
|---|---|
| Internet egress (first 10 TB) | $0.09/GB |
| Internet egress (next 40 TB) | $0.085/GB |
| Cross-AZ traffic | $0.01/GB each way |
| Cross-region replication | $0.02–$0.08/GB |
| EC2 → S3 (same region) | **Free** |
| EC2 → S3 (cross-region) | $0.09/GB |

A team running 100 TB/month of internet egress pays **$8,500/month**—just for data leaving. That's $102K/year. And that's before cross-AZ traffic between microservices.

The kicker: you pay even when you're moving your own data between your own AWS services in different AZs.

## Technique 1: Replace NAT Gateway with VPC Endpoints (Save 80–91%)

This is the highest-ROI change most teams can make, and it takes about 30 minutes to implement.

**The problem:** If your EC2 instances or Lambda functions communicate with S3, DynamoDB, SQS, SNS, or other AWS services via a NAT Gateway, you're paying:
- $0.045/hr per NAT Gateway (×3 for Multi-AZ = $97.20/month just for the gateways)
- $0.045/GB for all data passing through the NAT Gateway

**The fix:** VPC Endpoints route traffic directly between your VPC and AWS services over the AWS backbone—no internet, no NAT Gateway.

**Gateway Endpoints (completely free):**
- Amazon S3
- Amazon DynamoDB

For most teams, 60–75% of their NAT Gateway traffic is going to S3. That's zero cost with a Gateway Endpoint.

**Interface Endpoints ($0.01/AZ/hr + $0.01/GB):**
- SQS, SNS, Secrets Manager, SSM, ECR, CloudWatch, Kinesis, and 100+ other services

Even Interface Endpoints are dramatically cheaper than routing through NAT Gateway at $0.045/GB.

**Implementation:**

```bash
# Create S3 Gateway Endpoint (free)
aws ec2 create-vpc-endpoint \
  --vpc-id vpc-xxxxxxxx \
  --service-name com.amazonaws.us-east-1.s3 \
  --route-table-ids rtb-xxxxxxxx

# Create DynamoDB Gateway Endpoint (free)
aws ec2 create-vpc-endpoint \
  --vpc-id vpc-xxxxxxxx \
  --service-name com.amazonaws.us-east-1.dynamodb \
  --route-table-ids rtb-xxxxxxxx
```

**What this costs:** $0 for S3 and DynamoDB. ~$21.60/month per Interface Endpoint (3 AZs × $0.01/hr × 730 hrs).

**What you save:** At 10 TB/month through NAT Gateway, you're paying $459/month. With Gateway Endpoints handling 75% of that, you're down to $115/month. **74% reduction with a 30-minute change.**

Use our [NAT Gateway Calculator](/calculators/nat-gateway) to model your exact savings.

## Technique 2: Move S3-Heavy Workloads to Cloudflare R2 (Save 60–80%)

AWS S3 is excellent for storage. It's expensive for egress. Cloudflare R2 is designed around the observation that "zero egress" is a better pricing model.

**AWS S3 cost for 100 TB/month egress:**
- Storage: $0.023/GB × 10,000 GB = $230/month
- Egress: $0.09/GB × 102,400 GB = **$9,216/month**
- GET requests: $0.004/1,000 × 10,000,000 = $40/month
- **Total: ~$9,486/month**

**Cloudflare R2 for the same workload:**
- Storage: $0.015/GB × 10,000 GB = $150/month
- Egress: **$0** (zero egress fees)
- GET requests: $0.36/1,000,000 × 10,000,000 = $3.60/month
- **Total: ~$153.60/month**

That's **98% savings on egress** and **98% reduction overall** for egress-heavy workloads.

**The catch:** R2 is best suited for:
- Static assets (images, video, CSS/JS bundles)
- Backups you read infrequently
- User-generated content you serve directly
- Public data that doesn't need AWS service integrations

It's not ideal if you need Lambda event triggers, S3 Select, Intelligent-Tiering, or tight integration with other AWS services.

**Migration approach:**
1. Identify your S3 buckets by egress cost (use Cost Explorer, group by S3 bucket)
2. Move high-egress, low-integration buckets to R2 first
3. Use R2's S3-compatible API—most S3 SDKs work without code changes
4. Keep AWS S3 for operational data; use R2 for distribution

Use our [Storage Calculator](/calculators/storage) to find your break-even point.

## Technique 3: CloudFront as an Egress Escape Hatch (Save 50–70%)

If you're serving content from EC2 or S3 directly, you're paying $0.09/GB for every byte. CloudFront changes the math significantly:

- **CloudFront egress (first 10 TB):** $0.0085/GB (in US/EU)
- **EC2/ALB → CloudFront:** Free (same region)
- **CloudFront cache hit:** $0.0085/GB instead of $0.09/GB

That's a **91% reduction per cached request.**

**Best for:**
- Any HTTP/HTTPS content with >20% cache hit rate
- APIs with repetitive read patterns
- Static assets, images, videos
- SaaS dashboards with shared data

**Real impact for a 100 TB/month workload with 80% cache hit rate:**
- Old cost: 100 TB × $0.09 = $9,216/month
- With CloudFront: (20 TB origin + 100 TB CF egress) = (0 + $870) = **$870/month**
- **Savings: 90%**

The math gets even better when you factor in reduced origin server load and compute costs.

**Implementation notes:**
- Set proper Cache-Control headers (this is where most teams leave savings on the table)
- Use CloudFront Functions or Lambda@Edge for auth/manipulation at the edge
- Enable compression (gzip/brotli)—reduces bytes transferred by 60–80% for text content

```nginx
# Add to your origin server responses
Cache-Control: public, max-age=31536000, immutable  # Static assets
Cache-Control: public, max-age=300, stale-while-revalidate=60  # API responses
```

## Technique 4: Eliminate Cross-AZ Traffic (Save $0.01–$0.05/GB)

Cross-AZ traffic costs $0.01/GB in each direction. At scale, this adds up fast.

A microservices team with 10 services calling each other 1,000 times/second, passing 1 KB each:
- 10 calls × 1 KB × 86,400 sec × 30 days = **25 TB/month cross-AZ**
- Cost: $250/month in each direction = **$500/month**

And that's a relatively modest microservices footprint.

**Fixes:**

**1. Availability Zone affinity (biggest impact):**
Route traffic within the same AZ where possible. For services that call each other heavily, ensure they're in the same AZ.

In ECS/Fargate, use `awsvpc` mode with AZ-aware load balancing. In Kubernetes, use topology spread constraints:

```yaml
topologySpreadConstraints:
  - maxSkew: 1
    topologyKey: topology.kubernetes.io/zone
    whenUnsatisfiable: DoNotSchedule
    labelSelector:
      matchLabels:
        app: your-service
```

**2. Read replicas in the same AZ:**
If you have an RDS read replica, route reads to the replica in the *same AZ* as your application. Cross-AZ RDS traffic is a hidden cost many teams discover late.

**3. Use Private DNS with Interface Endpoints:**
When you add an Interface VPC Endpoint, enable Private DNS so your SDK calls automatically route to the endpoint in the same AZ, avoiding cross-AZ hops.

## Technique 5: Reconsider Reserved Capacity and Transfer Acceleration

**AWS Data Transfer discounts you probably qualify for:**

If you're consistently moving >10 TB/month, contact AWS or check your Enterprise Discount Program (EDP) terms. Large-volume commitments often unlock:
- 10–30% egress discounts
- Custom pricing for specific data flows
- CloudFront committed use discounts at $0.006–$0.007/GB instead of $0.0085

**S3 Transfer Acceleration: when NOT to use it:**

Many teams enable S3 Transfer Acceleration thinking it's a performance feature. It's actually a cost adder: $0.04–$0.08/GB *on top of* standard egress costs. It's only useful if your users are uploading large files from geographically distant locations. For most server-side workloads, disable it.

```bash
# Check which buckets have Transfer Acceleration enabled
aws s3api list-buckets --query 'Buckets[].Name' --output text | \
  xargs -I{} aws s3api get-bucket-accelerate-configuration --bucket {}
```

## Putting It Together: The Egress Optimization Playbook

Here's the order of operations for maximum ROI:

**Week 1 — Quick wins (30 min each):**
1. Add S3 and DynamoDB Gateway Endpoints to all VPCs
2. Audit S3 Transfer Acceleration and disable where not needed
3. Check CloudFront cache hit rates; fix Cache-Control headers

**Week 2 — Medium lift:**
4. Add Interface Endpoints for top 3 AWS services by traffic volume
5. Identify highest-egress S3 buckets; evaluate R2 migration

**Week 3 — Architecture:**
6. Implement AZ affinity for heavily-chattering microservices
7. Move CDN-suitable content to CloudFront
8. Contact AWS TAM about volume discounts if >50 TB/month

**Month 2+:**
9. Migrate appropriate S3 workloads to R2
10. Build egress cost reporting into your FinOps dashboards

## Real-World Savings Example

A SaaS team serving 500 TB/month to end users, with a microservices backend:

| Before | Cost |
|---|---|
| Internet egress (direct EC2) | $42,000/mo |
| NAT Gateway (data + hours) | $2,200/mo |
| Cross-AZ traffic | $1,800/mo |
| **Total** | **$46,000/mo** |

| After (3 months later) | Cost |
|---|---|
| CloudFront egress (90% cache) | $4,250/mo |
| R2 for static assets | $150/mo |
| VPC Endpoints (replaced NAT) | $400/mo |
| Cross-AZ (AZ affinity added) | $200/mo |
| **Total** | **$5,000/mo** |

**Result: 89% reduction. $492K/year saved.**

None of these changes required rewriting application code. They were infrastructure, routing, and pricing model decisions.

## The Mindset Shift

AWS built a business on charging for data movement. Every byte that crosses a billing boundary costs money. Your job is to minimize those crossings—through caching, co-location, alternative providers, and direct routing.

The teams that win at FinOps aren't necessarily running smaller workloads. They've just structured their architecture so fewer bytes cross expensive boundaries.

Start with the NAT Gateway—it's the highest ROI change with the lowest implementation risk. Then follow the playbook.

Your future self—reviewing a bill that's 80% smaller—will thank you.

---

*Use the [NAT Gateway Calculator](/calculators/nat-gateway) to estimate your specific savings. For storage optimization, try the [S3 vs R2 vs Backblaze Calculator](/calculators/storage).*
