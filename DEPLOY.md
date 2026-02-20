# Deploy Cost Nimbus

## Option 1: Vercel (Recommended)

**Fastest path to live.**

1. **Push to GitHub:**
   ```bash
   # Create GitHub repo
   gh repo create costnimbus --public --source=. --push
   ```

2. **Connect to Vercel:**
   - Go to https://vercel.com/new
   - Import your GitHub repo
   - Framework preset: Next.js
   - Deploy

3. **Add custom domain:**
   - Project Settings → Domains
   - Add: `costnimbus.com`

## Option 2: Cloudflare Pages

**Free tier is more generous.**

1. **Build locally:**
   ```bash
   npm run build
   ```

2. **Deploy via Wrangler:**
   ```bash
   npx wrangler pages deploy .next/static --project-name=costnimbus
   ```

   Or connect GitHub repo in Cloudflare dashboard.

## Option 3: Cloudflare (Static Export)

Simplest - just HTML.

```bash
# Update next.config.ts for static export
# Add: output: 'export'

npm run export
# Deploy public/ folder to Cloudflare Pages
```

## Current Status

- ✅ Next.js 16 + TypeScript + Tailwind
- ✅ Homepage with featured article
- ✅ Article page: /article/how-i-saved-50k-month-cloud-costs
- ✅ 15K word article content loaded
- ✅ Git repo initialized
- ⏳ Needs deployment

## Files

- `src/app/page.tsx` - Homepage
- `src/app/article/[slug]/page.tsx` - Article template
- `src/lib/articles.ts` - Content (684 lines)
