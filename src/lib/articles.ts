import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const articlesDirectory = path.join(process.cwd(), 'src/content');

export interface Article {
  slug: string;
  title: string;
  description: string;
  publishDate: string;
  readTime: string;
  category: string;
  tags: string[];
  author: string;
  content: string;
}

function deriveCategory(data: Record<string, unknown>): string {
  if (data.category && typeof data.category === 'string') return data.category;
  const tags = Array.isArray(data.tags) ? (data.tags as string[]) : [];
  if (tags.length === 0) return '';
  // Map common tags to display categories
  const tagLower = tags.map((t) => t.toLowerCase());
  if (tagLower.some((t) => t.includes('finops') || t.includes('fin ops'))) return 'FinOps';
  if (tagLower.some((t) => t.includes('kubernetes') || t === 'k8s')) return 'Kubernetes';
  if (tagLower.some((t) => t.includes('machine learning') || t.includes('ml') || t === 'gpu' || t.includes('ai/ml'))) return 'AI/ML';
  if (tagLower.some((t) => t === 'aws' || t.includes('amazon web'))) return 'AWS';
  if (tagLower.some((t) => t.includes('soc') || t.includes('security'))) return 'Security';
  if (tagLower.some((t) => t.includes('cloud cost') || t.includes('cloud costs'))) return 'Cloud Costs';
  return tags[0];
}

function parseArticle(slug: string, fileContents: string): Article {
  const matterResult = matter(fileContents);
  const data = matterResult.data as Record<string, unknown>;

  // Support both pubDate and publishDate
  const publishDate =
    (data.publishDate as string) ||
    (data.pubDate instanceof Date
      ? (data.pubDate as Date).toISOString().split('T')[0]
      : typeof data.pubDate === 'string'
      ? (data.pubDate as string)
      : '');

  return {
    slug,
    title: (data.title as string) || '',
    description: (data.description as string) || '',
    publishDate,
    readTime: (data.readTime as string) || '8 min',
    category: deriveCategory(data),
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    author: (data.author as string) || 'Cesar',
    content: matterResult.content,
  };
}

export function getAllArticles(): Article[] {
  let fileNames: string[];
  try {
    fileNames = fs.readdirSync(articlesDirectory);
  } catch {
    return [];
  }

  const allArticlesData = fileNames
    .filter((fileName) => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx?$/, '');
      const fullPath = path.join(articlesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      return parseArticle(slug, fileContents);
    })
    .filter((a) => a.title); // skip files without a title

  return allArticlesData.sort((a, b) => {
    const da = a.publishDate ? new Date(a.publishDate).getTime() : 0;
    const db = b.publishDate ? new Date(b.publishDate).getTime() : 0;
    return db - da;
  });
}

export function getArticle(slug: string): Article | null {
  let fileNames: string[];
  try {
    fileNames = fs.readdirSync(articlesDirectory);
  } catch {
    return null;
  }

  for (const file of fileNames) {
    if (file.replace(/\.mdx?$/, '') === slug) {
      const fullPath = path.join(articlesDirectory, file);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      return parseArticle(slug, fileContents);
    }
  }
  return null;
}

export function getAdjacentArticles(slug: string): { prev: Article | null; next: Article | null } {
  const articles = getAllArticles(); // sorted newest first
  const idx = articles.findIndex((a) => a.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  // "next" in terms of UI = older article (higher index = older)
  // "prev" in terms of UI = newer article (lower index = newer)
  return {
    prev: idx > 0 ? articles[idx - 1] : null,       // newer
    next: idx < articles.length - 1 ? articles[idx + 1] : null, // older
  };
}
