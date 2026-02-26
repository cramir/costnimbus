import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const SITE_URL = 'https://costnimbus.com';
const contentDir = path.join(process.cwd(), 'src/content');
const outputPath = path.join(process.cwd(), 'public/feed.xml');

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function getAllArticles() {
  let fileNames;
  try {
    fileNames = fs.readdirSync(contentDir);
  } catch {
    return [];
  }

  return fileNames
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
    .map((f) => {
      const slug = f.replace(/\.mdx?$/, '');
      const content = fs.readFileSync(path.join(contentDir, f), 'utf8');
      const { data } = matter(content);
      return {
        slug,
        title: data.title || '',
        description: data.description || '',
        publishDate: data.publishDate || '',
        category: data.category || '',
      };
    })
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
}

const articles = getAllArticles();
const now = new Date().toUTCString();

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Cost Nimbus</title>
    <link>${SITE_URL}</link>
    <description>Cloud cost intelligence built by engineers, for engineers. Real numbers, no vendor fluff.</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${articles
  .map(
    (a) => `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${SITE_URL}/article/${a.slug}/</link>
      <guid isPermaLink="true">${SITE_URL}/article/${a.slug}/</guid>
      <description>${escapeXml(a.description)}</description>
      <pubDate>${new Date(a.publishDate).toUTCString()}</pubDate>
      <category>${escapeXml(a.category)}</category>
    </item>`
  )
  .join('\n')}
  </channel>
</rss>
`;

fs.writeFileSync(outputPath, rss, 'utf8');
console.log(`RSS feed generated: ${outputPath} (${articles.length} articles)`);
