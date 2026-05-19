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
  { slug: 'subletting', label: 'Subletting', icon: '🏠' },
];

export default async function HomePage() {
  const data = await apiClient()
    .get<ListingsResponse>('/listings?limit=8')
    .catch(() => ({ listings: [], total: 0, page: 1, limit: 8 }));

  return (
    <div>
      {/* Hero */}
      <section className="bg-yellow-400 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-black mb-3">
            The marketplace for Warriors
          </h1>
          <p className="text-black/70 mb-8 text-lg">
            Buy and sell with fellow UW students — textbooks, furniture, bikes, and more.
          </p>
          <div className="flex justify-center">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Browse by category</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/listings?category=${cat.slug}`}
              className="flex flex-col items-center gap-2 bg-white rounded-xl py-4 px-2 border border-gray-100 hover:border-yellow-400 hover:shadow-sm transition text-center"
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-xs font-medium text-gray-600">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent listings */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Recent listings</h2>
          <Link href="/listings" className="text-sm text-yellow-600 hover:underline font-medium">
            View all
          </Link>
        </div>
        <ListingGrid listings={data.listings} />
      </section>
    </div>
  );
}
