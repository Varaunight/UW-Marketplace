import { apiClient } from '@/lib/api-client';
import { PublicUser, ListingsResponse } from '@uw-marketplace/shared';
import { notFound } from 'next/navigation';
import ListingGrid from '@/components/listings/ListingGrid';
import Image from 'next/image';

interface Props { params: Promise<{ userId: string }> }

export default async function PublicProfilePage({ params }: Props) {
  const { userId } = await params;

  const [user, data] = await Promise.all([
    apiClient().get<PublicUser>(`/users/${userId}`).catch(() => null),
    apiClient().get<ListingsResponse>(`/listings?sellerId=${userId}`).catch(() => ({ listings: [], total: 0, page: 1, limit: 24 })),
  ]);

  if (!user) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gold-muted">
          {user.avatarUrl ? (
            <Image src={user.avatarUrl} alt={user.displayName} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xl text-gold-ink">
              {user.displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{user.displayName}</h1>
          <p className="text-sm text-gray-400">
            Member since {new Date(user.createdAt).toLocaleDateString('en-CA', { year: 'numeric', month: 'long' })}
          </p>
        </div>
      </div>

      <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-4">Active listings</h2>
      <ListingGrid listings={data.listings} />
    </div>
  );
}
