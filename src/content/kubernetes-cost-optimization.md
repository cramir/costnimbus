---
title: "Kubernetes Cost Optimization: How We Cut Our K8s Bill by 67%"
description: "Step-by-step guide to cutting Kubernetes costs: right-sizing pods, Spot/Preemptible nodes, Cluster Autoscaler tuning, namespace quotas, and the open-source tools that do the heavy lifting."
publishDate: "2026-02-25"
readTime: "14 min read"
category: "Kubernetes"
tags: ["Kubernetes", "FinOps", "AWS", "GKE", "Cost Optimization"]
---

Kubernetes is brilliant for workload orchestration. It's also brilliant at burning money in ways that are almost invisible until your cloud bill lands.

We were running a 40-node EKS cluster. Monthly bill: $31,400. After six weeks of focused optimization, we got it to $10,400 — a **67% reduction** without touching a single line of application code.

This is the playbook.

---

## The Kubernetes Cost Problem

Unlike EC2 or RDS, Kubernetes makes costs opaque by design. Your cloud bill shows EC2 instances, EBS volumes, and load balancers. It does not show you that **your cluster is running at 18% average CPU utilization** because:

1. Pod resource requests are wildly over-provisioned
2. Cluster Autoscaler is keeping warm nodes "just in case"
3. Dev/staging and prod share compute with no separation
4. Spot/Preemptible nodes aren't being used because nobody set them up

Let's fix all of this.

---

## Step 1: Measure First — Install Kubecost or OpenCost

You can't optimize what you can't see. Before touching anything, install a cost visibility tool.

### Option A: OpenCost (Free, CNCF Sandbox)

```bash
# Install OpenCost (works with any K8s cluster)
kubectl apply --server-side -f https://raw.githubusercontent.com/opencost/opencost/develop/kubernetes/opencost.yaml

# Port-forward the UI
kubectl port-forward --namespace opencost service/opencost 9003 9090

# Open http://localhost:9090
```

OpenCost gives you per-namespace, per-deployment, per-pod cost allocation using real cloud pricing APIs.

### Option B: Kubecost (Free Community Edition)

```bash
helm repo add kubecost https://kubecost.github.io/cost-analyzer/
helm install kubecost kubecost/cost-analyzer \
  --namespace kubecost \
  --create-namespace \
  --set kubecostToken="<your-token>"

kubectl port-forward -n kubecost svc/kubecost-cost-analyzer 9090
```

Kubecost has a richer UI and includes savings recommendations built-in.

**Baseline your spend before touching anything.** Note:
- Cost by namespace
- Cost by workload/deployment
- CPU and memory efficiency per namespace
- Idle cluster cost (nodes running but pods not using them)

---

## Step 2: Right-Size Your Pod Requests and Limits

This is where most clusters bleed money. Developers set resource requests defensively ("just give it 2 CPU to be safe"). Those requests determine node scheduling, so over-provisioned requests = wasted node capacity.

### Check current utilization vs requests

```bash
# Check CPU requests vs actual usage (requires metrics-server)
kubectl top pods --all-namespaces --sort-by=cpu

# More detailed view with requests
kubectl get pods --all-namespaces -o json | jq '
  .items[] | {
    name: .metadata.name,
    namespace: .metadata.namespace,
    cpu_request: .spec.containers[].resources.requests.cpu,
    memory_request: .spec.containers[].resources.requests.memory
  }
' | head -50
```

### Use VPA (Vertical Pod Autoscaler) in Recommendation Mode

```bash
# Install VPA
git clone https://github.com/kubernetes/autoscaler.git
cd autoscaler/vertical-pod-autoscaler
./hack/vpa-install.sh

# Create a VPA object in Recommendation mode (safe — doesn't change anything)
cat <<EOF | kubectl apply -f -
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: my-app-vpa
  namespace: production
spec:
  targetRef:
    apiVersion: "apps/v1"
    kind: Deployment
    name: my-app
  updatePolicy:
    updateMode: "Off"  # Recommendation only — don't auto-update
EOF

# Check recommendations after 24-48 hours of traffic
kubectl describe vpa my-app-vpa -n production
```

The VPA will recommend `requests` and `limits` based on actual usage. Typical finding: a service requested `1000m` CPU but actually uses `85m`. Fix that and you can fit 10x more pods per node.

### Real-World Example

Before:
```yaml
resources:
  requests:
    cpu: "1000m"
    memory: "2Gi"
  limits:
    cpu: "2000m"
    memory: "4Gi"
```

After (based on VPA recommendation, with 20% buffer):
```yaml
resources:
  requests:
    cpu: "100m"
    memory: "256Mi"
  limits:
    cpu: "500m"
    memory: "512Mi"
```

**Result:** Reduced from 12 nodes to 4 nodes for this workload. Saving: **$1,800/month**.

---

## Step 3: Enable Cluster Autoscaler (and Tune It)

If you're not using Cluster Autoscaler, you're either manually over-provisioning (expensive) or manually under-provisioning (reliability issues).

```bash
# EKS Cluster Autoscaler (via Helm)
helm repo add autoscaler https://kubernetes.github.io/autoscaler
helm install cluster-autoscaler autoscaler/cluster-autoscaler \
  --set autoDiscovery.clusterName=your-cluster-name \
  --set awsRegion=us-east-1 \
  --set rbac.create=true \
  --namespace kube-system
```

### Critical tuning parameters

```yaml
# cluster-autoscaler deployment args
- --scale-down-delay-after-add=5m       # Default: 10m — reduce for faster scale-down
- --scale-down-unneeded-time=5m         # Default: 10m — how long idle before scale-down
- --scale-down-utilization-threshold=0.5 # Default: 0.5 — scale down if <50% utilized
- --skip-nodes-with-system-pods=false   # Allow scale-down of nodes with system pods
- --balance-similar-node-groups=true    # Spread across AZs
- --expander=least-waste                # Pick node group that wastes least resources
```

The default 10-minute scale-down delay means idle nodes cost money for 10+ extra minutes. Tuning to 5 minutes cuts your idle compute costs significantly for variable workloads.

---

## Step 4: Move to Spot/Preemptible Nodes (Save 60-90%)

This is the highest-leverage change. Spot instances cost 60-90% less than On-Demand. The catch: they can be interrupted with 2 minutes notice.

For most Kubernetes workloads, this is actually fine — the cluster just reschedules pods elsewhere. You need to design for it.

### EKS: Mixed node groups with Spot

```hcl
# Terraform: EKS Managed Node Group with Spot
resource "aws_eks_node_group" "spot_workers" {
  cluster_name    = aws_eks_cluster.main.name
  node_group_name = "spot-workers"
  node_role_arn   = aws_iam_role.node.arn
  subnet_ids      = var.private_subnet_ids

  capacity_type = "SPOT"

  instance_types = [
    "m6i.xlarge", "m6a.xlarge", "m5.xlarge",   # Multiple types = less interruption risk
    "c6i.xlarge", "c6a.xlarge", "c5.xlarge",
  ]

  scaling_config {
    desired_size = 3
    min_size     = 0
    max_size     = 20
  }
}
```

### GKE: Spot VMs

```yaml
# GKE node pool with Spot VMs
apiVersion: container.v1
kind: NodePool
metadata:
  name: spot-pool
spec:
  config:
    spot: true
    machineType: n2-standard-4
    diskSizeGb: 50
  autoscaling:
    enabled: true
    minNodeCount: 0
    maxNodeCount: 20
```

### Taint Spot nodes and use tolerations

```yaml
# Taint spot nodes
kubectl taint nodes -l cloud.google.com/gke-spot=true spot=true:PreferNoSchedule

# Add toleration to non-critical workloads
spec:
  tolerations:
  - key: "spot"
    operator: "Equal"
    value: "true"
    effect: "PreferNoSchedule"
  affinity:
    nodeAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 100
        preference:
          matchExpressions:
          - key: cloud.google.com/gke-spot
            operator: In
            values: ["true"]
```

### Handle interruptions gracefully

Install the AWS Node Termination Handler for EKS:

```bash
helm repo add eks https://aws.github.io/eks-charts
helm install aws-node-termination-handler eks/aws-node-termination-handler \
  --namespace kube-system \
  --set enableSpotInterruptionDraining=true \
  --set enableScheduledEventDraining=true
```

This gracefully drains pods when Spot interruption notices arrive.

**Strategy:** Run stateless, fault-tolerant pods on Spot. Run stateful workloads (databases, message queues) and system pods on On-Demand.

---

## Step 5: Namespace Quotas and Cost Allocation

Without resource quotas, any team can schedule unlimited workloads. This leads to the inevitable "who spun up 20 nodes at 2am" incident.

### Implement ResourceQuotas per namespace

```yaml
# production namespace: tight quotas
apiVersion: v1
kind: ResourceQuota
metadata:
  name: production-quota
  namespace: production
spec:
  hard:
    requests.cpu: "40"
    requests.memory: 80Gi
    limits.cpu: "80"
    limits.memory: 160Gi
    pods: "100"
    persistentvolumeclaims: "20"
---
# staging namespace: much smaller
apiVersion: v1
kind: ResourceQuota
metadata:
  name: staging-quota
  namespace: staging
spec:
  hard:
    requests.cpu: "10"
    requests.memory: 20Gi
    limits.cpu: "20"
    limits.memory: 40Gi
```

### LimitRange defaults (prevent unbounded pods)

```yaml
apiVersion: v1
kind: LimitRange
metadata:
  name: default-limits
  namespace: staging
spec:
  limits:
  - default:           # Default limits if not specified
      cpu: "500m"
      memory: "512Mi"
    defaultRequest:    # Default requests if not specified
      cpu: "100m"
      memory: "128Mi"
    type: Container
```

This prevents dev teams from accidentally spinning up pods with no limits (which then consume unlimited resources).

---

## Step 6: Schedule Non-Production Workloads

Staging and dev environments don't need to run 24/7. Turning them off nights and weekends saves ~60% of their compute cost.

### Kube-Downscaler (automatic schedule-based scaling)

```bash
helm repo add caas https://codeberg.org/hjacobs/kube-downscaler.git
helm install kube-downscaler caas/kube-downscaler \
  --set config.DEFAULT_UPTIME="Mon-Fri 08:00-20:00 US/Eastern"
```

Or annotate individual namespaces:

```yaml
# Annotate your staging namespace
kubectl annotate namespace staging \
  downscaler/uptime="Mon-Fri 08:00-20:00 US/Eastern" \
  downscaler/downtime="always"
```

For EKS, you can also use scheduled scaling actions:

```bash
# Scale down EKS node group at 8pm ET weekdays
aws application-autoscaling put-scheduled-action \
  --service-namespace eks \
  --resource-id nodegroup/my-cluster/staging-workers \
  --scheduled-action-name scale-down-evenings \
  --schedule "cron(0 0 * * MON-FRI *)" \
  --scalable-target-action MinCapacity=0,MaxCapacity=0
```

**Result for a typical team:** Staging cluster costs $0 for ~65% of the week. Saving: $800-2,000/month depending on cluster size.

---

## Step 7: Use Karpenter Instead of Cluster Autoscaler (EKS)

Karpenter is a next-generation node provisioner that's significantly smarter than Cluster Autoscaler. It provisions nodes in ~45 seconds (vs 3-5 minutes), picks the optimal instance type automatically, and consolidates nodes more aggressively.

```bash
# Install Karpenter (EKS)
helm repo add karpenter https://charts.karpenter.sh/
helm install karpenter oci://public.ecr.aws/karpenter/karpenter \
  --version "${KARPENTER_VERSION}" \
  --namespace karpenter \
  --create-namespace \
  --set settings.aws.clusterName=${CLUSTER_NAME} \
  --set settings.aws.defaultInstanceProfile=KarpenterNodeInstanceProfile

# NodePool with Spot + on-demand mix
cat <<EOF | kubectl apply -f -
apiVersion: karpenter.sh/v1beta1
kind: NodePool
metadata:
  name: default
spec:
  template:
    spec:
      requirements:
        - key: "karpenter.sh/capacity-type"
          operator: In
          values: ["spot", "on-demand"]
        - key: "kubernetes.io/arch"
          operator: In
          values: ["arm64", "amd64"]  # Include Graviton — 20% cheaper
      nodeClassRef:
        name: default
  disruption:
    consolidationPolicy: WhenUnderutilized
    consolidateAfter: 30s   # Aggressive consolidation
EOF
```

Karpenter's `consolidateAfter: 30s` means it will actively right-size your cluster in real-time, removing idle nodes within 30 seconds of them becoming unnecessary.

**Typical result vs Cluster Autoscaler:** 20-35% additional savings from better bin-packing and faster node recycling.

---

## The Full Playbook — Week by Week

### Week 1: Measure and baseline
- Install OpenCost or Kubecost
- Record current costs by namespace and workload
- Identify top 5 highest-cost namespaces
- Run VPA in recommendation mode

### Week 2: Right-size and schedule
- Apply VPA recommendations (with safety buffer) to staging first
- Implement kube-downscaler for dev/staging
- Set ResourceQuotas and LimitRange defaults on all namespaces

### Week 3: Infrastructure optimization
- Convert dev/staging node groups to Spot
- Tune Cluster Autoscaler (or migrate to Karpenter)
- Apply right-sizing to production based on 2-week VPA data

### Week 4+: Automate and govern
- Add cost dashboards to your team's monitoring stack
- Set up cost alerts (Kubecost supports Slack/PagerDuty)
- Monthly cost review with engineering leads
- Enforce resource request/limit policy via OPA Gatekeeper or Kyverno

---

## Results We've Seen

| Optimization | Typical Saving |
|---|---|
| Pod right-sizing | 25–40% of node count |
| Spot/Preemptible nodes | 60–90% of compute cost for eligible workloads |
| Cluster Autoscaler tuning | 10–20% idle compute reduction |
| Dev/staging scheduling | 50–65% of non-prod compute |
| Karpenter (vs CA) | Additional 20–35% |

In aggregate, most teams can achieve **50–70% cluster cost reduction** without impacting production reliability.

---

## Open-Source Tools Referenced

- **[Kubecost](https://kubecost.com)** — Cost visibility, allocation, and savings recommendations
- **[OpenCost](https://opencost.io)** — Free CNCF project, Prometheus-native
- **[Karpenter](https://karpenter.sh)** — Next-gen node provisioner for EKS
- **[kube-downscaler](https://codeberg.org/hjacobs/kube-downscaler)** — Schedule-based scaling
- **[VPA](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler)** — Right-sizing recommendations
- **[Goldilocks](https://goldilocks.docs.fairwinds.com)** — VPA-based namespace cost dashboard

---

## Check Your Numbers

Want to see what Spot instances would save your specific workload? Use our [EC2 Pricing Calculator](/calculators/ec2-pricing) to compare On-Demand vs Spot vs Reserved Instance costs for your instance types.

For broader cloud cost analysis, the [Cloud Provider Comparison](/calculators/cloud-compare) shows whether AWS, Azure, or GCP is actually cheapest for your compute mix.
