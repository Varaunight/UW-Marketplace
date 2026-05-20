'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar({ defaultValue = '' }: { defaultValue?: string }) {
  const [q, setQ] = useState(defaultValue);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    router.push(`/listings?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-2xl">
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search for textbooks, furniture, electronics..."
        className="flex-1 border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold/40 text-sm bg-surface text-fg placeholder-muted transition-shadow"
      />
      <button
        type="submit"
        className="bg-gold hover:bg-gold-dark text-black font-semibold px-6 py-3 rounded-lg transition-colors text-sm"
      >
        Search
      </button>
    </form>
  );
}
