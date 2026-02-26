import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="not-found">
      <h1 className="not-found-title">404</h1>
      <p className="not-found-desc">
        This page doesn&apos;t exist — but your cloud savings opportunity does.
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <Link href="/" className="not-found-btn not-found-btn-primary">Home</Link>
        <Link href="/calculators" className="not-found-btn not-found-btn-cyan">Calculators</Link>
        <Link href="/articles" className="not-found-btn not-found-btn-purple">Articles</Link>
      </div>
    </div>
  );
}
