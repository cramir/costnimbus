---
title: "Azure vs AWS for .NET Shops: A Cost and DX Deep-Dive"
description: "You can run .NET on AWS. But Azure is purpose-built for it — and in most cases, dramatically cheaper. A rigorous comparison of managed services, pricing, and DX for teams migrating from on-prem or choosing a cloud for their .NET stack."
publishDate: "2026-02-25"
readTime: "14 min"
category: "Cloud Strategy"
---

# Azure vs AWS for .NET Shops: A Cost and DX Deep-Dive

You can run .NET on AWS. But you'll be swimming upstream — every managed service you reach for was designed with Java or Python in mind, and the integration tax adds up fast. Azure, by contrast, is the natural home for .NET: same vendor (Microsoft), shared identity layer (Entra ID), native SDK support, and pricing models that make sense for Windows/SQL workloads.

This is not a brand loyalty argument. It's a cost and operations argument. Here's what the numbers actually look like.

---

## The Integration Tax Is Real

Before we get to pricing, understand the structural advantage Azure has for .NET:

**Identity**: Azure Entra ID (formerly AAD) is your identity layer for M365, Teams, and Windows endpoints. If you're already paying for it (and you likely are — it's bundled with E3/E5), using AWS SSO requires setting up a separate SAML federation. That's not catastrophic, but it's overhead.

**SQL Server**: Azure SQL Managed Instance is SQL Server, running the same engine your dev team knows. On AWS, RDS for SQL Server is SQL Server too — but AWS doesn't build SQL Server, Microsoft does. When a CVE drops or a new feature ships, Azure gets it first.

**Visual Studio / Azure DevOps / GitHub Actions**: The toolchain integrates tightly. Publish from Visual Studio, deploy with GitHub Actions, monitor with App Insights — it all uses the same auth tokens and produces traces that connect.

None of this is impossible to replicate on AWS. But replication costs time and money.

---

## Compute: Windows VMs and .NET Hosting

### App Service vs Elastic Beanstalk vs ECS

For containerized or traditional ASP.NET Core apps, you have three models:

| Option | Azure | AWS |
|--------|-------|-----|
| PaaS app hosting | App Service | Elastic Beanstalk |
| Containers | Container Apps / AKS | ECS / EKS |
| Serverless | Azure Functions | Lambda |

**App Service vs Elastic Beanstalk**: App Service is genuinely PaaS — you choose a plan, deploy a zip or container, done. Elastic Beanstalk is a wrapper around EC2 that adds complexity without the same level of abstraction. For .NET teams wanting to deploy fast without managing infrastructure, App Service wins.

**Real pricing (P1v3 tier, equivalent capacity):**

```
Azure App Service (P1v3): $0.173/hr (~$126/month)
  → 2 vCPU, 8GB RAM, included SSL, custom domains

AWS Elastic Beanstalk on t3.large: $0.0832/hr (~$61/month)
  + Load balancer: ~$18/month
  + Elastic IP, logging, etc: ~$10/month
  Total: ~$89/month
```

AWS wins on raw compute cost. But App Service includes a load balancer, auto-scaling, SSL, and deployment slots (blue/green deploys). When you price an equivalent AWS setup — ALB + target group + Auto Scaling Group + EC2 — the gap narrows significantly.

For **blue/green deployment slots** alone (zero-downtime swaps), App Service's built-in feature saves you the cost of a second environment or a deployment strategy you'd otherwise have to build.

### Azure Functions vs AWS Lambda

For .NET serverless:

```
Azure Functions Consumption Plan:
  - First 1M executions/month: FREE
  - $0.000016/GB-second (memory × duration)
  - $0.20 per additional 1M executions

AWS Lambda:
  - First 1M requests/month: FREE  
  - $0.0000166667/GB-second
  - $0.20 per additional 1M requests
```

**Pricing is nearly identical.** The difference is in DX:

- Azure Functions in .NET have first-class tooling: `func init --worker-runtime dotnet-isolated`, local debugging works out of the box, and Application Insights integration is one NuGet package
- Lambda for .NET works well but requires Lambda Power Tools for structured logging and tracing, and cold starts are slightly worse for .NET 8 runtime vs the isolated worker model on Azure

---

## SQL Server: The Biggest Cost Difference

This is where Azure wins decisively for .NET shops with SQL Server workloads.

### Azure SQL vs Amazon RDS for SQL Server

```
Amazon RDS for SQL Server (SE, db.r6g.large):
  - Instance: $0.576/hr = $421/month
  - Storage (100GB): $23/month
  - Multi-AZ: 2x = $844/month compute
  - SQL Server License: INCLUDED (SE license adds ~70% premium vs MySQL equivalent)
  Total: ~$867/month (Multi-AZ, SE, 2 vCPU/16GB)

Azure SQL Database (Business Critical, 4 vCores):
  - $0.8435/hr with included SQL license
  - OR $0.5565/hr with Azure Hybrid Benefit (existing SQL Server license)
  - Storage (100GB): included up to 1TB
  - HA/read replica: included in Business Critical
  Total: ~$615/month (or $403/month with Azure Hybrid Benefit)
```

**Azure Hybrid Benefit is enormous.** If your organization has existing SQL Server licenses with Software Assurance — which most enterprise .NET shops do — you can bring them to Azure and cut the database compute cost by ~34%. AWS has no equivalent for SQL Server.

This single item can offset the entire compute difference between Azure and AWS for a mid-size .NET app.

### Azure SQL Managed Instance

For lift-and-shift migrations of on-prem SQL Server (especially with SQL Agent jobs, cross-database queries, linked servers), Azure SQL Managed Instance is a near-perfect target. AWS has no equivalent — RDS doesn't support SQL Agent, and you'd need EC2 with full SQL Server, which means you manage patching, HA, and backups yourself.

```
Azure SQL MI (General Purpose, 4 vCores):
  - $0.5562/hr = ~$406/month
  - Includes: SQL Agent, CLR, cross-database queries, DTC
  - With Azure Hybrid Benefit: ~$0.3412/hr = ~$249/month

AWS EC2 SQL Server (r6g.large, SE):
  - Instance: $0.207/hr = ~$151/month
  - SQL Server SE license: ~$0.40/hr = ~$292/month
  - EBS storage (100GB): ~$10/month
  - You manage: patching, HA (WSFC), backups
  Total: ~$453/month + ops overhead
```

For SQL MI vs EC2 SQL Server: Azure costs less, requires zero database administration overhead, and gives you the same SQL Server features you'd have on-prem.

---

## Azure DevOps vs AWS CodePipeline/CodeBuild

For CI/CD, the two options differ significantly in cost model and capability.

### Azure DevOps (Pipelines)

```
Free: 1 Microsoft-hosted parallel job (1,800 min/month)
$40/month: 1 additional parallel job (unlimited minutes)
$15/user/month: Basic + Test Plans (most devs only need Basic at $6/user)
```

Azure Pipelines is mature, has excellent .NET support, and integrates natively with Azure Repos, GitHub, and Artifact feeds. YAML-based pipelines, approval gates, environments — it's a complete platform.

### AWS CodePipeline + CodeBuild

```
CodePipeline: $1/active pipeline/month
CodeBuild: 
  - general1.small: $0.005/build minute
  - general1.medium: $0.01/build minute
  - general1.large: $0.02/build minute

Typical .NET build (3 min on medium): $0.03/build
100 builds/month: $3 + $1 pipeline = $4/month/pipeline
```

**AWS is cheaper for pure build cost.** But CodePipeline is significantly less capable than Azure Pipelines for complex deployment scenarios — no native test gates, limited approval workflows, and the integration with non-AWS services (Slack notifications, JIRA transitions, etc.) requires Lambda functions.

For a 5-developer team doing ~200 builds/month across 3 pipelines:
- Azure DevOps: ~$30/month (Basic plan for 5 devs) + $0 for first parallel job
- AWS CodePipeline + CodeBuild: ~$12/month for builds + dev tooling for advanced workflows

AWS is cheaper here, but the capability delta matters for enterprise .NET workflows.

---

## Application Performance Monitoring: App Insights vs CloudWatch + X-Ray

This is the least-discussed cost difference and one of the most significant.

### Application Insights

```
Data ingestion: First 5GB/month FREE
Beyond free tier: $2.30/GB
Retention: 90 days free; $0.12/GB/month beyond
```

App Insights gives you: distributed tracing, exceptions, custom metrics, live metrics stream, usage analytics, availability tests, and smart detection — all from a single NuGet package (`Microsoft.ApplicationInsights.AspNetCore`).

```csharp
// Program.cs — that's it
builder.Services.AddApplicationInsightsTelemetry();
```

### CloudWatch + X-Ray + (something for exceptions)

```
CloudWatch Logs: $0.50/GB ingestion + $0.03/GB storage
CloudWatch Metrics: $0.30/metric/month (custom metrics)
X-Ray traces: $5.00 per 1M traces recorded
              $0.50 per 1M traces retrieved

A typical mid-size .NET app:
  - 10GB logs/month: $5.00
  - 50 custom metrics: $15.00
  - X-Ray (1M traces): $5.00
  - Exception tracking (Sentry or similar): ~$26/month
  Total: ~$51/month
```

vs Application Insights:
```
  - 10GB ingestion: (5GB free) + 5GB × $2.30 = $11.50
  - Retention (90d): $0
  - Includes: traces, exceptions, metrics, availability tests
  Total: ~$11.50/month
```

**Application Insights is 4× cheaper** for a typical mid-size .NET app and requires zero additional services for a complete observability picture.

---

## Real-World Migration Math

A typical 5-developer .NET shop with:
- 3 ASP.NET Core apps (App Service / Elastic Beanstalk)
- 1 SQL Server database (2 vCPU / 16GB, Multi-AZ)
- CI/CD pipelines
- APM and logging

**On AWS (monthly):**
```
EC2/Beanstalk (3x t3.large + ALB):       $267
RDS SQL Server SE Multi-AZ (db.r6g.lg):  $867
CodePipeline + CodeBuild:                  $12
CloudWatch + X-Ray + Sentry:               $51
Total:                                  ~$1,197/month
```

**On Azure (monthly):**
```
App Service (3x P1v3):                    $378
Azure SQL Managed Instance (4 vCore GP):  $406
  → With Azure Hybrid Benefit:            $249
Azure DevOps (5 devs, Basic):              $30
Application Insights:                      $12
Total (with HB):                          $669/month
Total (without HB):                       $826/month
```

**Savings: 30–44% lower on Azure** for this workload — before accounting for operational overhead savings on SQL MI vs RDS management, or the integration tax of building SSO federation, cross-service tracing, etc.

---

## When AWS Makes More Sense for .NET Shops

Azure doesn't win every scenario:

1. **You're on AWS for everything else** — if your data platform, ML workloads, and security tooling are all AWS, adding Azure for .NET apps creates a multi-cloud management burden that costs more than the savings
2. **High-throughput serverless** — AWS Lambda has more runtime options, better cold start optimization tooling (SnapStart), and Graviton2 instances that can reduce Lambda cost by 20%
3. **Container-first organizations** — EKS is more mature than AKS for complex Kubernetes workloads with service mesh requirements
4. **AWS credits / startup programs** — If you have significant AWS credits, use them

---

## Migration Path: On-Prem to Azure for .NET

If you're lifting from on-prem Windows/.NET/SQL Server:

**Week 1-2: Assessment**
```bash
# Azure Migrate — free assessment tool
# Installs a lightweight discovery appliance, maps dependencies
# Outputs: recommended Azure target + estimated monthly cost

az migrate project create \
  --resource-group myRG \
  --name myMigration \
  --location eastus
```

**Week 3-4: SQL Server Migration**
- Use [Database Migration Service](https://learn.microsoft.com/en-us/azure/dms/) for online migration to SQL MI
- Near-zero downtime with continuous log shipping until cutover
- SQL MI supports the same connection strings as on-prem — apps often need zero code changes

**Month 2: App Service Migration**
- App Service Migration Assistant scans IIS-hosted apps, flags compatibility issues, and deploys directly to App Service
- Most ASP.NET Core apps work without modification
- ASP.NET 4.x apps: usually need minor compatibility fixes (HttpContext, synchronous reads)

**Month 3: Identity and CI/CD**
- Connect Azure DevOps to your Entra ID tenant for SSO
- Migrate existing Azure DevOps Server pipelines to Azure DevOps Services — direct import
- Set up Application Insights by adding one package and redeploying

---

## TL;DR

| Category | Azure Wins | AWS Wins |
|----------|-----------|---------|
| SQL Server workloads | ✅ Azure Hybrid Benefit, SQL MI | — |
| Windows identity (Entra ID) | ✅ Native integration | SAML federation needed |
| .NET developer experience | ✅ First-class tooling, App Insights | Close but more assembly |
| Serverless (.NET) | Slight Azure edge (cold starts) | Lambda has more configs |
| APM / observability | ✅ App Insights is cheaper + better | CloudWatch + X-Ray + Sentry adds up |
| Raw compute cost | — | ✅ EC2 often cheaper than App Service |
| Containers / Kubernetes | — | ✅ EKS more mature |
| Startup credits | — | ✅ AWS Activate usually more generous |

**The punchline**: If your team writes .NET, uses SQL Server, and is paying for M365/E3/E5 licenses, Azure will likely cost you 25–40% less than AWS for equivalent workloads — and save meaningful engineering time. The integration just works.

---

*Compare your specific workload with our [Cloud Cost Calculator](/calculators/cloud-compare) or [Managed Database Calculator](/calculators/managed-db). All pricing Q1 2026.*
