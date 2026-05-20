'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function SafetyBanner({ storageKey = 'uw-safety-dismissed' }: { storageKey?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(storageKey)) setVisible(true);
    } catch {}
  }, [storageKey]);

  function dismiss() {
    try { localStorage.setItem(storageKey, '1'); } catch {}
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="bg-gold-muted border border-gold/25 rounded-xl px-4 py-3 mb-4 flex items-start gap-3">
      <span className="text-lg shrink-0 mt-0.5">🔒</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gold-ink mb-0.5">Stay safe when meeting up</p>
        <p className="text-xs text-fg/60 leading-relaxed">
          Always meet in a busy, public place on campus — SLC, DC lobby, or DP Library. Never share payment info outside the platform.{' '}
          <Link href="/safety" className="text-gold-ink hover:text-gold underline font-medium transition-colors">
            View safe meetup spots →
          </Link>
        </p>
      </div>
      <button onClick={dismiss} className="text-muted hover:text-fg transition-colors shrink-0 mt-0.5" aria-label="Dismiss">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6 6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>
  );
}
