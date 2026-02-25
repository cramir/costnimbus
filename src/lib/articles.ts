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
  content: string;
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
      const matterResult = matter(fileContents);

      return {
        slug,
        title: matterResult.data.title || '',
        description: matterResult.data.description || '',
        publishDate: matterResult.data.publishDate || '',
        readTime: matterResult.data.readTime || '',
        category: matterResult.data.category || '',
        content: matterResult.content,
      };
    });

  return allArticlesData.sort((a, b) => {
    return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
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
      const matterResult = matter(fileContents);
      return {
        slug,
        title: matterResult.data.title || '',
        description: matterResult.data.description || '',
        publishDate: matterResult.data.publishDate || '',
        readTime: matterResult.data.readTime || '',
        category: matterResult.data.category || '',
        content: matterResult.content,
      };
    }
  }
  return null;
}
