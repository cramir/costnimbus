---
title: "The Complete SOC 2 Compliance Checklist: Evidence for Your SOC 2 Audit"
description: "The practical SOC 2 compliance checklist for evidence collection — organized by Trust Service Criteria, covering all SOC 2 requirements auditors expect, with sources, frequency, and manual vs automated time estimates."
publishDate: "2026-02-28"
readTime: "11 min"
category: "Security"
---

Getting SOC 2 certified is one thing. Actually collecting the evidence that proves your controls work — consistently, over months — is the operational challenge nobody prepares you for.

Every compliance vendor shows you a dashboard. Nobody shows you the actual SOC 2 compliance checklist of what auditors will ask for, where to find it, and how long it takes to collect manually versus with automation.

Until now.

This is the SOC 2 audit checklist I wish I'd had before my first SOC 2 audit. It covers all core SOC 2 requirements, organized by the Trust Service Criteria that SOC 2 reports are structured around, with the specific evidence types auditors actually request, where to find it in common infrastructure, and honest time estimates for collection.

## How to Use This SOC 2 Compliance Checklist

SOC 2 compliance is based on the **AICPA Trust Service Criteria (TSC)**. Your SOC 2 audit will cover some or all of the following criteria:

- **CC1–CC9:** Common Criteria (Security) — required for all SOC 2 reports
- **A-series:** Availability — add if uptime/SLA is part of your offering
- **C-series:** Confidentiality — add if you handle confidential data
- **PI-series:** Processing Integrity — add for transactional systems
- **P-series:** Privacy — add if you process personal data under privacy regulations

Most startups start with Security (CC-series) only. That's what this SOC 2 compliance checklist covers in depth.

**SOC 2 Type 1 vs SOC 2 Type 2:** The evidence requirements differ by SOC 2 type. A SOC 2 Type 1 audit only requires point-in-time evidence — screenshots and exports showing controls exist on a single date. A SOC 2 Type 2 audit requires evidence collected throughout the 6–12 month observation period. This checklist is primarily designed for SOC 2 Type 2 (the one enterprise buyers actually want), though it works as a foundation for Type 1 as well.

**Two notes before you start:**

First, evidence needs to be current. A screenshot from eight months ago doesn't demonstrate a control is working today. For ongoing controls (access reviews, monitoring), auditors want to see evidence from throughout the audit period.

Second, the goal isn't just collecting the artifacts — it's demonstrating a *consistent process*. "We did an access review once" isn't enough. "We did access reviews quarterly, here are the four records with dates and reviewer signatures" is what passes the SOC 2 audit.

---

## CC1: Control Environment

**What auditors are evaluating:** Does your organization have the foundational governance structure for security? Policies, accountability, and oversight.

### Evidence to Collect

**Organization Chart**
- What: Current org chart showing reporting structure, especially security-relevant roles
- Where: HR system (Rippling, Gusto, BambooHR), or create one manually
- Frequency: Updated as organizational changes happen; provide current version at audit
- Manual time: 1–2 hours to create/maintain
- Automated: Auto-generated from HR system export

**Information Security Policy**
- What: Documented policy covering acceptable use, data handling, incident response
- Where: Your internal wiki (Notion, Confluence), Google Drive, or policy management tool
- Frequency: Annual review minimum; document the review date and approver
- Manual time: 4–8 hours to write initially; 1–2 hours for annual review
- Automated: Policy management tools track versions and review dates automatically

**Background Check Records**
- What: Evidence that employees with access to sensitive systems underwent background checks
- Where: Background check vendor (Checkr, First Advantage) — export reports or completion certificates
- Frequency: At hire; store records permanently
- Manual time: 15–30 min per employee to pull and organize
- Automated: Most HR platforms have background check integrations with audit trail

**Code of Conduct / Ethics Policy**
- What: Signed acknowledgment that employees received and accepted your code of conduct
- Where: HR system, DocuSign records, onboarding checklist
- Frequency: At hire; annual re-attestation
- Manual time: 1–2 hours to collect signed copies
- Automated: HR onboarding workflows track completion

**Board Oversight Evidence** (if applicable)
- What: Board meeting minutes showing security/risk topics were discussed
- Where: Board management software or company secretary records
- Frequency: Per board meeting; keep relevant excerpts
- Manual time: 30 min per meeting to extract and file relevant sections

**Total CC1 manual time estimate: 8–16 hours initial; 2–4 hours/year ongoing**

---

## CC2: Communication and Information

**What auditors are evaluating:** Does your organization communicate security responsibilities to employees? Do you have channels to receive external security information?

### Evidence to Collect

**Security Awareness Training Records**
- What: Completion records showing employees completed security awareness training during the audit period
- Where: KnowBe4, Proofpoint Security Awareness, or your LMS; export completion reports with employee names and dates
- Frequency: Annual training minimum; quarterly is better; export completion report each cycle
- Manual time: 1–2 hours to pull and organize reports
- Automated: Training platforms generate completion reports; connect to your audit evidence folder

**Security Policy Acknowledgment Records**
- What: Signed records that employees have read and acknowledged security policies
- Where: DocuSign, HR system, or manual sign-off sheets
- Frequency: Annual; export records showing all employees
- Manual time: 2–3 hours to collect and verify completeness
- Automated: Policy management platforms with e-signature integration track this automatically

**Vulnerability Disclosure Policy**
- What: Documented process for external parties to report security vulnerabilities
- Where: Your public website (security.txt or /security page), internal documentation
- Frequency: One-time; verify it's still current and accessible
- Manual time: 1 hour to verify and screenshot
- Automated: N/A (mostly a one-time setup)

**Total CC2 manual time estimate: 4–6 hours initial; 2–3 hours/year ongoing**

---

## CC3: Risk Assessment

**What auditors are evaluating:** Does your organization systematically identify and address security risks?

### Evidence to Collect

**Risk Register**
- What: Document identifying security risks, their likelihood/impact ratings, and your mitigation approach
- Where: Your GRC tool, or a maintained spreadsheet in Google Sheets/Notion
- Frequency: Annual review minimum; major changes trigger updates
- Manual time: 8–16 hours initially; 3–5 hours annually
- Automated: GRC platforms (Drata, Vanta) have risk register modules; still requires human input on risk identification

**Vulnerability Scan Reports**
- What: Output from automated vulnerability scanning tools showing findings and remediation status
- Where: Qualys, Nessus, AWS Inspector, GitHub Dependabot, Snyk — export reports
- Frequency: At minimum quarterly; monthly is better; export and store each scan report
- Manual time: 2–4 hours/quarter to pull, review, and file scan reports
- Automated: Scanning tools generate reports on schedule; integrate output into your evidence system

**Penetration Test Reports**
- What: Third-party penetration test report and evidence of remediation tracking
- Where: Your pentest vendor delivers a report; remediation tracked in Jira or equivalent
- Frequency: Annual is standard for Type II; keep reports permanently
- Manual time: 1–2 hours to file report and pull remediation evidence
- Automated: Link pentest findings to Jira tickets; export ticket status as remediation evidence

**Risk Assessment Meeting Notes / Records**
- What: Evidence that risk assessment was a deliberate, documented process with stakeholder involvement
- Where: Meeting notes in Notion/Confluence, calendar invites showing attendance, email records
- Frequency: Annual; keep meeting records
- Manual time: 2 hours to pull and organize
- Automated: Calendar integrations can capture meeting records

**Total CC3 manual time estimate: 12–25 hours initial; 8–12 hours/year ongoing**

---

## CC5: Control Activities

**What auditors are evaluating:** Are there specific controls in place and are they operating consistently?

### Evidence to Collect

**Access Review Records**
- What: Documentation that you periodically review who has access to systems and whether access is appropriate
- Where: AWS IAM access reports, Okta admin console exports, GitHub organization member lists, database access lists
- Frequency: Quarterly access reviews; keep all review records
- Manual time: 4–8 hours/quarter to pull access lists from all systems, document reviewer, record decisions
- Automated: Some GRC tools automate pulling access lists; still requires human review sign-off

**Change Management / Change Approval Records**
- What: Evidence that changes to production systems go through an approval process
- Where: GitHub/GitLab PR records (merged PRs with reviewer approval), Jira change tickets, deployment logs
- Frequency: Ongoing; pull sample from audit period
- Manual time: 3–5 hours to pull representative samples and organize
- Automated: GitHub/GitLab APIs can export PR approval records; CI/CD logs capture deployment history

**Privileged Access Management Evidence**
- What: Evidence that privileged access (admin accounts, root access, production database access) is controlled and minimal
- Where: AWS IAM, Azure AD privileged identity management, your PAM tool (CyberArk, HashiCorp Vault)
- Frequency: Quarterly review; export privileged role assignments
- Manual time: 2–4 hours/quarter
- Automated: AWS IAM access advisor exports; Azure AD access reports

**Security Configuration Standards**
- What: Documentation that systems are configured to security baselines (CIS benchmarks, etc.)
- Where: AWS Security Hub findings, Azure Security Center, configuration management documentation
- Frequency: Annual review; scan-based evidence ongoing
- Manual time: 4–6 hours to pull and document
- Automated: AWS Security Hub, Azure Security Center, or CIS benchmark scanning tools generate continuous reports

**Total CC5 manual time estimate: 12–20 hours initial; 12–20 hours/year ongoing**

---

## CC6: Logical and Physical Access Controls

**What auditors are evaluating:** Is access to your systems and infrastructure properly controlled, authenticated, and audited?

### Evidence to Collect

**SSO Configuration Evidence**
- What: Screenshots/exports showing SSO is configured and enforced for critical applications
- Where: Okta, Azure AD, Google Workspace admin console
- Frequency: Annual; capture current configuration
- Manual time: 1–2 hours to screenshot and document
- Automated: Directory tool exports; API-based configuration snapshots

**MFA Enforcement Evidence**
- What: Evidence that MFA is required for access to sensitive systems
- Where: Okta MFA enrollment report, AWS IAM MFA status, Google Workspace security settings
- Frequency: Quarterly; export MFA enrollment status for all users
- Manual time: 2–3 hours to pull enrollment reports and flag non-compliant users
- Automated: Directory integrations can auto-export MFA status; GRC tools flag users without MFA

**Access Provisioning and Deprovisioning Records**
- What: Evidence that access is granted based on role/business need and revoked promptly on termination
- Where: HR system offboarding checklists, Okta lifecycle management logs, ticket records for access requests
- Frequency: Ongoing; pull samples from audit period
- Manual time: 3–6 hours to pull and organize records
- Automated: HRIS + SSO integration with automated deprovisioning logs everything; dramatically reduces manual collection

**User Authentication Logs**
- What: Evidence that access to critical systems is logged
- Where: AWS CloudTrail, Azure Activity Log, Okta system log, application authentication logs
- Frequency: Ongoing; provide samples showing logging is active
- Manual time: 2–3 hours to pull sample logs and demonstrate logging is configured
- Automated: Log aggregation tools (Splunk, Datadog, Elastic) make this trivial to export

**Physical Access Controls** (if applicable)
- What: Evidence for any physical access controls at office locations or data centers
- Where: Keycard system records, data center visitor logs (if you have co-lo), building security records
- Frequency: Annual review; keep entry/exit logs
- Manual time: 1–3 hours depending on your environment
- Automated: Physical access systems often have reporting exports

**Encryption at Rest and In Transit**
- What: Documentation or configuration evidence that data is encrypted at rest and in transit
- Where: AWS S3 bucket encryption settings, RDS encryption config, SSL certificate records, network security group configs
- Frequency: Annual review; capture configuration screenshots
- Manual time: 2–4 hours to document and screenshot
- Automated: AWS Config rules can continuously monitor encryption settings

**Total CC6 manual time estimate: 12–22 hours initial; 10–16 hours/year ongoing**

---

## CC7: System Operations

**What auditors are evaluating:** Do you monitor your systems for security events and respond appropriately?

### Evidence to Collect

**Monitoring Dashboard Evidence**
- What: Evidence that security monitoring is active (SIEM dashboard screenshots, alert configuration exports)
- Where: Splunk, Datadog, AWS Security Hub, Sentinel — screenshot dashboards, export alert configurations
- Frequency: Annual; supplement with incident records from audit period
- Manual time: 2–4 hours
- Automated: Most monitoring platforms have report export functions

**Incident Response Records**
- What: For any security incidents during the audit period, documentation of detection, response, and resolution
- Where: Incident tickets in Jira/ServiceNow, post-mortems in Confluence, email records, Slack/Teams threads
- Frequency: Per incident; no incidents is fine (just document your IR test)
- Manual time: 1–3 hours per incident to compile documentation
- Automated: Incident management platforms (PagerDuty, OpsGenie) capture response timelines automatically

**Incident Response Tabletop or Test Records**
- What: Evidence that you've tested your incident response plan
- Where: Meeting notes, tabletop exercise records, documented simulated scenario
- Frequency: Annual
- Manual time: 3–5 hours to facilitate and document a tabletop exercise
- Automated: N/A (requires human participation)

**Uptime and Availability Reports**
- What: Evidence of system availability during the audit period
- Where: AWS CloudWatch, Datadog metrics, status page (PagerDuty Status, Statuspage.io), uptime monitoring (Better Uptime, Uptime Robot)
- Frequency: Monthly/quarterly summaries; pull for audit period
- Manual time: 1–2 hours to pull and format
- Automated: Status page tools generate availability reports automatically

**Security Event Log Retention Evidence**
- What: Proof that security logs are retained for appropriate periods (12 months is standard)
- Where: AWS CloudTrail settings, SIEM configuration, S3 lifecycle policies
- Frequency: Annual review; screenshot retention configuration
- Manual time: 1–2 hours
- Automated: AWS Config, SIEM configuration exports

**Total CC7 manual time estimate: 8–16 hours initial; 6–12 hours/year ongoing**

---

## CC8: Change Management

**What auditors are evaluating:** Are changes to your systems controlled, reviewed, and tested before deployment?

### Evidence to Collect

**Pull Request / Code Review Records**
- What: Evidence that code changes are reviewed before deployment
- Where: GitHub/GitLab — export PR records showing review and approval; branch protection rule configuration
- Frequency: Ongoing; pull samples from audit period (10–20 PRs covering different types of changes)
- Manual time: 2–3 hours to pull sample PRs and document the process
- Automated: GitHub API can export PR review history; GitHub Actions/GitLab CI logs deployment history

**Deployment Logs**
- What: Records of what was deployed, when, and by whom
- Where: CI/CD platform (GitHub Actions, CircleCI, GitLab CI, AWS CodePipeline) — export run history; deployment tracking in Jira
- Frequency: Ongoing; export relevant period
- Manual time: 2–4 hours to pull and organize
- Automated: CI/CD APIs export deployment history; connect to ticketing system for change records

**Rollback Procedures Documentation**
- What: Evidence that you have and have tested rollback capabilities
- Where: Runbooks in Confluence/Notion, CI/CD configuration showing rollback mechanisms, evidence of a rollback having occurred
- Frequency: Annual review; demonstrate capability
- Manual time: 2–4 hours to document and screenshot configuration
- Automated: N/A (documentation work)

**Emergency Change Procedures**
- What: Evidence of how emergency changes (hotfixes, incident response changes) are handled differently but still controlled
- Where: Your incident management records, emergency change tickets, post-mortem documentation
- Frequency: Per event; document your emergency change process once
- Manual time: 2–3 hours
- Automated: Incident management tools capture emergency change context

**Total CC8 manual time estimate: 8–14 hours initial; 6–10 hours/year ongoing**

---

## CC9: Risk Mitigation

**What auditors are evaluating:** Do you manage risks from your business relationships (vendors, partners) and have plans for business continuity?

### Evidence to Collect

**Vendor Risk Assessment Records**
- What: Documentation that you've reviewed the security posture of your critical vendors
- Where: Vendor SOC2 reports (request from each critical vendor), security questionnaire responses, trust center screenshots
- Frequency: Annual; collect for all "material" vendors (your cloud provider, major SaaS tools, any vendor with access to customer data)
- Manual time: 2–4 hours per vendor to collect and file; 8–20 hours total depending on vendor count
- Automated: Some GRC platforms request and track vendor documentation automatically

**Business Continuity Plan (BCP)**
- What: Documented plan for continuing operations after a significant disruption
- Where: Internal documentation in Confluence/Notion; keep dated versions
- Frequency: Annual review; document the review
- Manual time: 8–16 hours to write initially; 2–4 hours annually
- Automated: N/A (documentation work)

**Disaster Recovery Plan (DRP) and Test Evidence**
- What: Plan for recovering technical systems after failure; evidence that you've tested it
- Where: AWS/Azure/GCP documentation, internal runbooks, DR test results
- Frequency: Annual test minimum; document each test
- Manual time: 8–20 hours to write and test initially; 4–8 hours/year ongoing
- Automated: Cloud provider DR capabilities can be documented via infrastructure-as-code; still requires test documentation

**Cyber Insurance Certificate**
- What: Current cyber insurance policy documentation
- Where: Your insurance provider; finance team
- Frequency: Annual renewal
- Manual time: 30 min to pull and file
- Automated: N/A

**Total CC9 manual time estimate: 24–45 hours initial; 10–20 hours/year ongoing**

---

## The Full Picture: Manual Time by Category

| Trust Service Criteria | Initial Setup | Annual Ongoing |
|---|---|---|
| CC1: Control Environment | 8–16 hrs | 2–4 hrs |
| CC2: Communication | 4–6 hrs | 2–3 hrs |
| CC3: Risk Assessment | 12–25 hrs | 8–12 hrs |
| CC5: Control Activities | 12–20 hrs | 12–20 hrs |
| CC6: Logical/Physical Access | 12–22 hrs | 10–16 hrs |
| CC7: System Operations | 8–16 hrs | 6–12 hrs |
| CC8: Change Management | 8–14 hrs | 6–10 hrs |
| CC9: Risk Mitigation | 24–45 hrs | 10–20 hrs |
| **Total** | **88–164 hrs** | **56–97 hrs** |

For a startup with a 10-person engineering team, 164 hours is roughly 4 full work weeks of someone's time — spread across multiple people, across multiple months, in small annoying chunks. It's not one person disappearing for a month. It's everyone's most experienced people being interrupted constantly to pull one more report, take one more screenshot, sign one more policy acknowledgment.

Meeting all SOC 2 requirements manually is genuinely painful — especially the first time. These hours are why the compliance tool market exists. And why there's still room for something better.

## Manual vs. Automated: Where the Hours Go

The categories that consume the most manual time when done without tooling:

**CC3 (Risk Assessment) and CC9 (Risk Mitigation)** — high cognitive load. Risk registers and vendor assessments require human judgment. Automation can help with data collection and reminders, but can't replace the thinking work.

**CC5 (Control Activities) — access reviews** are the biggest time sink. Pulling access lists from 10+ systems, cross-referencing with your HR system, documenting the review, and tracking follow-up is genuinely painful without tooling. This is the category where automation delivers the clearest ROI.

**CC6 (Logical Access)** — MFA enforcement reporting and deprovisioning audit trails are largely automatable if your HRIS talks to your directory (Okta/Azure AD). If not, this becomes hours of manual cross-referencing.

**CC7 (System Operations)** — incident response records are hard to automate (incidents require documentation), but availability metrics and log retention evidence are easy wins for automation.

## The Tool We're Building

Evidence collection is an engineering problem. The data exists in your infrastructure — AWS, GitHub, Jira, Okta, your monitoring tools. What takes 88–164 hours of manual work is largely query-able via API.

We're building a tool that connects to your existing infrastructure, continuously collects evidence, and packages it in auditor-ready format — for a price point that makes sense for startups, not just enterprise.

Early access users help shape what we build. If you're planning a SOC2 audit in the next 6–12 months and are tired of the current choice between "do it manually in spreadsheets" and "pay $15,000/year for a GRC platform," [sign up here](/contact) and we'll keep you in the loop.

## Free Starting Point

Before you buy anything or build anything, get familiar with what you're working toward.

The **[SOC Playbooks library](https://github.com/cramir/soc-playbooks)** has free, open-source templates for incident response documentation, evidence collection workflows, and control documentation. It's a solid foundation — especially for the CC7 (incident response) and CC9 (business continuity) categories where documentation quality matters most.

Use it to build your first draft. Then automate the collection.

---

**Quick reference: The 5 things auditors most commonly find missing**

1. Access review records that weren't kept consistently — a quarterly review with no documentation is treated the same as no review
2. Security awareness training with no completion tracking (sending the email isn't evidence employees read it)
3. Background checks only for some employees — needs to be consistent across all roles with sensitive access
4. Vendor risk assessments that are "we looked at their website" rather than reviewing their SOC2 report or completing a security questionnaire
5. Change management evidence limited to code changes — auditors also want to see infrastructure changes, configuration changes, and database schema changes going through a controlled process

Get these five right and you'll handle 80% of first-time SOC2 audit surprises.
