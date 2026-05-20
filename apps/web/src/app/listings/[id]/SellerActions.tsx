'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { Listing } from '@uw-marketplace/shared';

export default function SellerActions({ listing }: { listing: Listing }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [status, setStatus] = useState(listing.status);
  const [loading, setLoading] = useState<string | null>(null);

  if (!session || session.userId !== listing.sellerId) return null;

  async function markSold() {
    if (!session) return;
    setLoading('sold');
    try {
      await apiClient(session.accessToken).patch(`/listings/${listing.id}`, { status: 'sold' });
      setStatus('sold');
    } finally {
      setLoading(null);
    }
  }

  async function markActive() {
    if (!session) return;
    setLoading('active');
    try {
      await apiClient(session.accessToken).patch(`/listings/${listing.id}`, { status: 'active' });
      setStatus('active');
    } finally {
      setLoading(null);
    }
  }

  async function deleteListing() {
    if (!session || !confirm('Delete this listing? This cannot be undone.')) return;
    setLoading('delete');
    try {
      await apiClient(session.accessToken).delete(`/listings/${listing.id}`);
      router.push('/profile');
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="mt-4 bg-card border border-border rounded-xl p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">Manage listing</p>
      <div className="flex flex-wrap gap-2">
        <Link
          href={`/listings/${listing.id}/edit`}
          className="flex-1 text-center text-sm font-medium py-2 px-4 rounded-lg border border-border bg-surface hover:border-gold/40 text-fg transition-colors"
        >
          Edit listing
        </Link>
        {status === 'active' ? (
          <button
            onClick={markSold}
            disabled={loading !== null}
            className="flex-1 text-sm font-medium py-2 px-4 rounded-lg border border-border bg-surface hover:border-gold/40 text-fg transition-colors disabled:opacity-50"
          >
            {loading === 'sold' ? 'Updating...' : 'Mark as sold'}
          </button>
        ) : (
          <button
            onClick={markActive}
            disabled={loading !== null}
            className="flex-1 text-sm font-medium py-2 px-4 rounded-lg border border-border bg-surface hover:border-gold/40 text-fg transition-colors disabled:opacity-50"
          >
            {loading === 'active' ? 'Updating...' : 'Relist'}
          </button>
        )}
        <button
          onClick={deleteListing}
          disabled={loading !== null}
          className="text-sm font-medium py-2 px-4 rounded-lg border border-red-500/20 text-red-500/80 hover:bg-red-500/5 hover:text-red-500 transition-colors disabled:opacity-50"
        >
          {loading === 'delete' ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}
