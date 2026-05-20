import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page not found — UW Marketplace',
};

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <p className="text-7xl font-bold text-gold-ink mb-4">404</p>
      <h1 className="text-2xl font-bold text-fg mb-3">Page not found</h1>
      <p className="text-muted mb-8 leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist or may have been removed.
      </p>
      <div className="flex justify-center gap-3">
        <Link
          href="/"
          className="bg-gold hover:bg-gold-dark text-black font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
        >
          Go home
        </Link>
        <Link
          href="/listings"
          className="border border-border bg-surface hover:border-gold/40 text-fg font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
        >
          Browse listings
        </Link>
      </div>
    </div>
  );
}
