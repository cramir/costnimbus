import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <h1 className="text-3xl font-bold text-gray-900">Cost Nimbus</h1>
            <p className="text-gray-600 mt-2">Cloud cost intelligence and optimization</p>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Save money on cloud costs
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Real strategies that work. No fluff, no vague advice—just concrete 
            implementations with actual ROI numbers.
          </p>
        </div>

        {/* Featured Article */}
        <section className="mb-16">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-6">
            Featured Article
          </h3>
          <Link 
            href="/article/how-i-saved-50k-month-cloud-costs" 
            className="block group"
          >
            <article className="border border-gray-200 rounded-lg p-8 hover:border-gray-300 transition-colors">
              <h4 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-3">
                How I Saved $50K/Month in Cloud Costs
              </h4>
              <p className="text-gray-600 mb-4 text-lg">
                Two specific solutions: a custom alert management system ($30K/mo) 
                and cloud resource cleanup automation ($20K/mo). Complete with 
                architecture, code examples, and implementation details.
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <span>15 min read</span>
                <span className="mx-2">•</span>
                <span>Cloud Cost Optimization</span>
              </div>
            </article>
          </Link>
        </section>

        {/* Newsletter CTA */}
        <section className="bg-gray-50 border border-gray-200 rounded-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Get cloud cost tips in your inbox
          </h3>
          <p className="text-gray-600 mb-6">
            Weekly insights on reducing cloud spend, optimizing infrastructure, 
            and building cost-conscious engineering teams.
          </p>
          <a 
            href="https://costnimbus.com/newsletter" 
            className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            Subscribe (it's free)
          </a>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-16">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <p className="text-gray-500 text-sm text-center">
            © 2026 Cost Nimbus. Built by engineers, for engineers.
          </p>
        </div>
      </footer>
    </main>
  );
}
