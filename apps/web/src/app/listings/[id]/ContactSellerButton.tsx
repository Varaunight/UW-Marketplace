'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Listing } from '@uw-marketplace/shared';

export default function ContactSellerButton({ listing }: { listing: Listing }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (listing.status !== 'active') return null;

  async function handleContact() {
    if (!session) {
      router.push(`/login?callbackUrl=/listings/${listing.id}`);
      return;
    }
    setLoading(true);
    try {
      const { id } = await apiClient(session.accessToken).post<{ id: string }>('/conversations', {
        listingId: listing.id,
      });
      router.push(`/messages/${id}`);
    } catch {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleContact}
      disabled={loading}
      className="w-full bg-gold hover:bg-gold-dark text-black font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
    >
      {loading ? 'Opening chat...' : 'Contact Seller'}
    </button>
  );
}
