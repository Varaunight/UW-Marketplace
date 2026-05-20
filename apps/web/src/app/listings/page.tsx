import { apiClient } from '@/lib/api-client';
import { ListingsResponse, Category } from '@uw-marketplace/shared';
import ListingGrid from '@/components/listings/ListingGrid';
import SearchBar from '@/components/search/SearchBar';
import FilterPanel from '@/components/search/FilterPanel';

interface Props {
  searchParams: Promise<{ q?: string; category?: string; minPrice?: string; maxPrice?: string; page?: string }>;
}

export default async function ListingsPage({ searchParams }: Props) {
  const params = await searchParams;
  const qs = new URLSearchParams();
  if (params.q) qs.set('q', params.q);
  if (params.category) qs.set('category', params.category);
  if (params.minPrice) qs.set('minPrice', params.minPrice);
  if (params.maxPrice) qs.set('maxPrice', params.maxPrice);
  if (params.page) qs.set('page', params.page);

  const [data, categories] = await Promise.all([
    apiClient()
      .get<ListingsResponse>(`/listings?${qs.toString()}`)
      .catch(() => ({ listings: [], total: 0, page: 1, limit: 24 })),
    apiClient()
      .get<Category[]>('/listings/categories')
      .catch(() => []),
  ]);

  const page = Number(params.page || 1);
  const totalPages = Math.ceil(data.total / data.limit);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <SearchBar defaultValue={params.q || ''} />
      </div>

      <div className="flex gap-6">
        <FilterPanel categories={categories} />

        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-400">
              {data.total} listing{data.total !== 1 ? 's' : ''} found
            </p>
          </div>

          <ListingGrid listings={data.listings} />

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                const pqs = new URLSearchParams(qs);
                pqs.set('page', String(p));
                return (
                  <a
                    key={p}
                    href={`/listings?${pqs.toString()}`}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                      p === page
                        ? 'bg-gold border-gold text-black'
                        : 'bg-surface border-border text-gray-600 hover:border-gold'
                    }`}
                  >
                    {p}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
