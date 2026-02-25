import HomeContent from '@/components/home-content';
import { getAllArticles } from '@/lib/articles';

export default function Home() {
  const articles = getAllArticles();
  return <HomeContent articles={articles} />;
}
