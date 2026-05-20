'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <p className="text-5xl mb-4">⚠️</p>
      <h1 className="text-2xl font-bold text-fg mb-3">Something went wrong</h1>
      <p className="text-muted mb-8 leading-relaxed">
        An unexpected error occurred. Try refreshing, or go back to the homepage.
      </p>
      <div className="flex justify-center gap-3">
        <button
          onClick={reset}
          className="bg-gold hover:bg-gold-dark text-black font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
        >
          Try again
        </button>
        <Link
          href="/"
          className="border border-border bg-surface hover:border-gold/40 text-fg font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
