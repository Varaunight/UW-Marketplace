'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { User, Listing, ListingsResponse } from '@uw-marketplace/shared';
import ListingCard from '@/components/listings/ListingCard';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [listingsLoading, setListingsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/login'); return; }
    if (!session) return;
    const client = apiClient(session.accessToken);
    client.get<User>('/users/me').then((u) => {
      setUser(u);
      setDisplayName(u.displayName);
      return client.get<ListingsResponse>(`/listings?sellerId=${u.id}&limit=48`);
    }).then((d) => setListings(d.listings)).finally(() => setListingsLoading(false));
  }, [session, status, router]);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!session) return;
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('displayName', displayName);
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/me`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${session.accessToken}` },
        body: fd,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(listingId: string) {
    if (!session || !confirm('Delete this listing? This cannot be undone.')) return;
    await apiClient(session.accessToken).delete(`/listings/${listingId}`);
    setListings((prev) => prev.filter((l) => l.id !== listingId));
  }

  async function handleMarkSold(listingId: string) {
    if (!session) return;
    await apiClient(session.accessToken).patch(`/listings/${listingId}`, { status: 'sold' });
    setListings((prev) => prev.map((l) => l.id === listingId ? { ...l, status: 'sold' as const } : l));
  }

  async function handleReactivate(listingId: string) {
    if (!session) return;
    await apiClient(session.accessToken).patch(`/listings/${listingId}`, { status: 'active' });
    setListings((prev) => prev.map((l) => l.id === listingId ? { ...l, status: 'active' as const } : l));
  }

  if (!user) return <div className="max-w-3xl mx-auto px-4 py-8 text-muted text-sm">Loading...</div>;

  const inputClass = 'w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 bg-card text-fg placeholder-muted transition-shadow';
  const activeListings = listings.filter((l) => l.status === 'active');
  const soldListings = listings.filter((l) => l.status === 'sold');

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-fg mb-6">My Profile</h1>

      <div className="bg-surface rounded-xl p-6 border border-border card-shadow mb-8">
        <form onSubmit={saveProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-fg/70 mb-1.5">Display name</label>
            <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-fg/70 mb-1.5">Email</label>
            <p className="text-sm text-muted bg-card px-3 py-2.5 rounded-lg border border-border">{user.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" disabled={saving} className="bg-gold hover:bg-gold-dark text-black font-semibold px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50 text-sm">
              {saved ? '✓ Saved' : saving ? 'Saving...' : 'Save changes'}
            </button>
            <Link href="/listings/new" className="text-sm text-gold-ink hover:text-gold font-medium transition-colors">
              + List a new item
            </Link>
          </div>
        </form>
      </div>

      {listingsLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="bg-card rounded-xl h-56 animate-pulse" />)}
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-16 bg-surface rounded-xl border border-border card-shadow">
          <div className="text-5xl mb-4">🏪</div>
          <p className="font-semibold text-fg mb-1">No listings yet</p>
          <p className="text-sm text-muted mb-5">Start selling to UW students today.</p>
          <Link href="/listings/new" className="inline-block bg-gold hover:bg-gold-dark text-black font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm">
            List your first item
          </Link>
        </div>
      ) : (
        <>
          {activeListings.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">
                Active listings <span className="text-fg/40">({activeListings.length})</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {activeListings.map((listing) => (
                  <ManageListingCard key={listing.id} listing={listing} onDelete={handleDelete} onMarkSold={handleMarkSold} />
                ))}
              </div>
            </section>
          )}
          {soldListings.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">
                Sold <span className="text-fg/40">({soldListings.length})</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 opacity-60">
                {soldListings.map((listing) => (
                  <ManageListingCard key={listing.id} listing={listing} onDelete={handleDelete} onReactivate={handleReactivate} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function ManageListingCard({
  listing,
  onDelete,
  onMarkSold,
  onReactivate,
}: {
  listing: Listing;
  onDelete: (id: string) => void;
  onMarkSold?: (id: string) => void;
  onReactivate?: (id: string) => void;
}) {
  return (
    <div className="relative group">
      <ListingCard listing={listing} />
      <div className="mt-1.5 flex gap-1.5">
        <Link
          href={`/listings/${listing.id}/edit`}
          className="flex-1 text-center text-xs py-1.5 rounded-lg border border-border bg-surface hover:border-gold/40 text-fg/70 hover:text-fg transition-colors font-medium"
        >
          Edit
        </Link>
        {onMarkSold && (
          <button
            onClick={() => onMarkSold(listing.id)}
            className="flex-1 text-xs py-1.5 rounded-lg border border-border bg-surface hover:border-gold/40 text-fg/70 hover:text-fg transition-colors font-medium"
          >
            Mark sold
          </button>
        )}
        {onReactivate && (
          <button
            onClick={() => onReactivate(listing.id)}
            className="flex-1 text-xs py-1.5 rounded-lg border border-border bg-surface hover:bg-card text-fg/70 transition-colors font-medium"
          >
            Relist
          </button>
        )}
        <button
          onClick={() => onDelete(listing.id)}
          className="text-xs py-1.5 px-2.5 rounded-lg border border-red-500/20 text-red-500/70 hover:text-red-500 hover:bg-red-500/5 transition-colors font-medium"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
