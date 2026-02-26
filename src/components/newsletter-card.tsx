const SENDFOX_ACTION = 'https://sendfox.com/form/3qdz96/36enr2';

interface NewsletterCardProps {
  headline?: string;
  description?: string;
  size?: 'sm' | 'md';
}

export default function NewsletterCard({
  headline = 'More cost cuts in your inbox',
  description = "Real savings tactics from engineers who've done it.",
  size = 'sm',
}: NewsletterCardProps) {
  const isMd = size === 'md';

  return (
    <div
      className={`rounded-2xl text-center relative overflow-hidden ${isMd ? 'p-8' : 'p-6'}`}
      style={{
        background: 'linear-gradient(135deg, rgba(0,212,255,0.06) 0%, rgba(168,85,247,0.06) 100%)',
        border: '1px solid rgba(0,212,255,0.15)',
      }}
    >
      <div
        className={`absolute rounded-full opacity-20 blur-3xl ${isMd ? '-top-16 -right-16 w-32 h-32' : '-top-12 -right-12 w-24 h-24'}`}
        style={{ background: 'var(--accent-purple)' }}
      />
      <h3
        className={`relative font-bold ${isMd ? 'text-xl mb-2' : 'text-base mb-2'}`}
        style={{ fontFamily: 'var(--font-space-grotesk)', color: 'var(--text-primary)' }}
      >
        {headline}
      </h3>
      <p
        className={`relative ${isMd ? 'text-sm mb-6' : 'text-xs mb-4'}`}
        style={{ color: 'var(--text-secondary)' }}
      >
        {description}
      </p>
      <form
        action={SENDFOX_ACTION}
        method="post"
        target="_blank"
        className={`relative ${isMd ? 'flex flex-col sm:flex-row gap-4 max-w-sm mx-auto' : 'flex flex-col gap-2 max-w-xs mx-auto'}`}
      >
        <label htmlFor="card-newsletter-email" className="sr-only">Email address</label>
        <input
          id="card-newsletter-email"
          type="email"
          name="email"
          placeholder="you@company.com"
          required
          className={`rounded-xl text-sm focus:outline-none ${isMd ? 'flex-1 px-5 py-3.5' : 'w-full px-4 py-2.5'}`}
          style={{
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
          }}
        />
        <button
          type="submit"
          className={`rounded-xl text-sm font-semibold transition-all ${isMd ? 'px-8 py-3.5 hover:scale-[1.03]' : 'py-2.5 hover:opacity-90'}`}
          style={{
            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
            color: '#0d1117',
          }}
        >
          Subscribe Free
        </button>
      </form>
      {isMd && (
        <p className="relative text-xs mt-4" style={{ color: 'var(--text-muted)' }}>
          No spam. Unsubscribe anytime.
        </p>
      )}
    </div>
  );
}
