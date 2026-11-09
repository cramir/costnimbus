# Cost Nimbus

Cloud cost intelligence and optimization. Live at **https://costnimbus.com** (custom domain; also reachable at costnimbus.vercel.app).

## What's on the site

- **39 published articles** on cloud cost optimization and security operations, 17 of them in the Security category. RSS feed, sitemap, and llms.txt / llms-full.txt are generated at build time.
- **10 interactive calculators** — NAT Gateway, object storage (S3 vs R2 vs Backblaze), managed database TCO, AWS vs Azure vs GCP, serverless, EC2 pricing, EBS volumes, CDN costs, FinOps maturity, SIEM cost.
- **/tools** — side-by-side comparison of 21 AI SOC, SOAR, and SIEM platforms.
- **/consulting** — cloud cost consulting with published pricing ($2,500–$5,000 engagements, $300–$500/hr).
- **/playbooks** — in-browser viewer for the 15 machine-readable incident response playbooks from [soc-playbooks](https://github.com/cramir/soc-playbooks).
- **Newsletter** — email signup form on the site.

## Content pipeline

Articles live in `src/content/` as Markdown with gray-matter frontmatter (title, description, pubDate, author, tags, category, readTime). `scripts/generate-build-assets.mjs` runs as part of `npm run build` and regenerates `public/feed.xml`, `public/llms.txt`, and `public/llms-full.txt` — these are build artifacts, not hand-maintained files.

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Deployed on Vercel

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deployment

Deployed automatically via Vercel on pushes to `master`.

---

Built by engineers, for engineers.
