'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Category } from '@uw-marketplace/shared';

export default function FilterPanel({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page');
    router.push(`/listings?${params.toString()}`);
  }

  return (
    <aside className="w-52 shrink-0">
      <div className="bg-surface rounded-xl border border-border p-4 space-y-5 card-shadow">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">Category</h3>
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm cursor-pointer text-fg/70 hover:text-fg transition-colors">
              <input
                type="radio"
                name="category"
                value=""
                checked={!searchParams.get('category')}
                onChange={() => update('category', '')}
                className="accent-gold"
              />
              All categories
            </label>
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-2 text-sm cursor-pointer text-fg/70 hover:text-fg transition-colors">
                <input
                  type="radio"
                  name="category"
                  value={cat.slug}
                  checked={searchParams.get('category') === cat.slug}
                  onChange={() => update('category', cat.slug)}
                  className="accent-gold"
                />
                {cat.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">Price range</h3>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              defaultValue={searchParams.get('minPrice') || ''}
              onBlur={(e) => update('minPrice', e.target.value)}
              className="w-full border border-border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 bg-card text-fg placeholder-muted"
            />
            <input
              type="number"
              placeholder="Max"
              defaultValue={searchParams.get('maxPrice') || ''}
              onBlur={(e) => update('maxPrice', e.target.value)}
              className="w-full border border-border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 bg-card text-fg placeholder-muted"
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
