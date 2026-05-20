import { apiClient } from '@/lib/api-client';
import { ListingsResponse } from '@uw-marketplace/shared';
import ListingGrid from '@/components/listings/ListingGrid';
import SearchBar from '@/components/search/SearchBar';
import Link from 'next/link';

const CATEGORIES = [
  { slug: 'textbooks', label: 'Textbooks', icon: '📚' },
  { slug: 'electronics', label: 'Electronics', icon: '💻' },
  { slug: 'furniture', label: 'Furniture', icon: '🛋️' },
  { slug: 'clothing', label: 'Clothing', icon: '👕' },
  { slug: 'bikes', label: 'Bikes', icon: '🚲' },
  { slug: 'miscellaneous', label: 'Miscellaneous', icon: '📦' },
];

const FEATURES = [
  { icon: '🔒', title: 'UW Verified', desc: 'Only @uwaterloo.ca accounts. Trade with people you can trust.' },
  { icon: '⚡', title: 'Instant Messaging', desc: 'Real-time chat with sellers — no email back-and-forth.' },
  { icon: '🛡️', title: 'Secure & Private', desc: 'Your data stays on campus. No third-party tracking.' },
];

const COMPARISON = [
  { feature: 'Student Verification', theirs: 'No verification' },
  { feature: 'Co-op Term Focused', theirs: 'Generic listings' },
  { feature: 'Campus Integration', theirs: 'No campus focus' },
  { feature: 'Real-time Chat', theirs: 'External messaging' },
  { feature: 'Free to Use', theirs: 'Promoted listings cost money' },
];

export default async function HomePage() {
  const data = await apiClient()
    .get<ListingsResponse>('/listings?limit=8')
    .catch(() => ({ listings: [], total: 0, page: 1, limit: 8 }));

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-28 px-4 bg-surface dark:bg-transparent border-b border-border dark:border-transparent">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gold/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 left-1/4 w-[400px] h-[300px] bg-gold/4 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2.5 border border-gold/30 bg-gold/8 rounded-full px-4 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 bg-gold rounded-full" />
            <span className="text-gold-ink text-xs font-semibold tracking-widest uppercase">UW Students Only</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-bold text-fg mb-5 tracking-tight leading-[1.08]">
            Your trusted<br />
            <span className="text-gold-ink">marketplace</span><br />
            for Warriors.
          </h1>

          <p className="text-muted text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Buy and sell with fellow UW students — textbooks, furniture, bikes, and more.
          </p>

          <div className="flex justify-center mb-14">
            <SearchBar />
          </div>

          <div className="flex justify-center gap-12 sm:gap-20">
            {[
              { value: '500+', label: 'Active Listings' },
              { value: '1K+', label: 'UW Students' },
              { value: '6', label: 'Categories' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-fg">{stat.value}</div>
                <div className="text-muted text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4"><div className="h-px bg-border" /></div>

      {/* ── Categories ───────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted mb-6">Browse by category</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/listings?category=${cat.slug}`}
              className="group flex flex-col items-center gap-2.5 bg-surface rounded-xl py-5 px-2 border border-border hover:border-gold/40 card-shadow card-hover-glow transition-all text-center"
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-xs font-medium text-muted group-hover:text-fg transition-colors">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Recent listings ──────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted">Recent listings</h2>
          <Link href="/listings" className="text-sm text-gold-ink hover:text-gold font-medium transition-colors">
            View all →
          </Link>
        </div>
        <ListingGrid listings={data.listings} />
      </section>

      <div className="max-w-6xl mx-auto px-4"><div className="h-px bg-border" /></div>

      {/* ── Comparison table ─────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-fg">
            UW Marketplace{' '}
            <span className="text-muted font-normal">vs.</span>{' '}
            Traditional Platforms
          </h2>
          <p className="text-muted mt-3 max-w-lg mx-auto text-sm">
            See why students choose UW Marketplace over generic alternatives.
          </p>
        </div>

        <div className="bg-surface border border-border rounded-2xl overflow-hidden card-shadow">
          {/* Header */}
          <div className="grid grid-cols-3 px-6 py-4 border-b border-border bg-card">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted">Feature</span>
            <span className="text-xs font-semibold uppercase tracking-widest text-gold-ink text-center">UW Marketplace</span>
            <span className="text-xs font-semibold uppercase tracking-widest text-muted text-center">Facebook / Kijiji</span>
          </div>

          {COMPARISON.map((row, i) => (
            <div
              key={row.feature}
              className={`grid grid-cols-3 px-6 py-5 items-center${i < COMPARISON.length - 1 ? ' border-b border-border' : ''}`}
            >
              <span className="font-semibold text-fg text-sm">{row.feature}</span>

              {/* UW checkmark */}
              <div className="flex justify-center">
                <div className="w-8 h-8 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold-ink">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                </div>
              </div>

              {/* Competitor */}
              <div className="flex items-center justify-center gap-2 text-muted text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted/50 shrink-0">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
                <span>{row.theirs}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4"><div className="h-px bg-border" /></div>

      {/* ── Features ─────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">Why UW Marketplace?</h2>
        <p className="text-2xl font-bold text-fg mb-10">Built for the campus. By the campus.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-surface border border-border rounded-xl p-6 hover:border-gold/30 card-shadow card-hover-glow transition-all">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-fg mb-2">{f.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="relative overflow-hidden bg-gold rounded-2xl px-8 py-12 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.2),transparent_60%)] pointer-events-none" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-widest text-black/50 mb-2">Ready to trade?</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">
              Join UW Marketplace today.
            </h2>
            <p className="text-black/60 mb-8 max-w-md mx-auto">
              Connect with thousands of UW Warriors buying and selling on campus.
            </p>
            <div className="flex justify-center gap-3">
              <Link
                href="/register"
                className="bg-black hover:bg-black/80 text-gold font-semibold px-6 py-3 rounded-lg transition-colors text-sm"
              >
                Get started — it&apos;s free
              </Link>
              <Link
                href="/listings"
                className="bg-black/10 hover:bg-black/20 text-black font-semibold px-6 py-3 rounded-lg transition-colors text-sm border border-black/15"
              >
                Browse listings
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
