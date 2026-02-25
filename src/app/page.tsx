'use client';

import HomeContent from '@/components/home-content';
import { useState, useEffect } from 'react';
import { Article } from '@/lib/articles';

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    // In static export mode, we can't use fs at build time
    // For now, pass empty articles array - the featured article will gracefully handle it
    setArticles([]);
  }, []);

  return <HomeContent articles={articles} />;
}
