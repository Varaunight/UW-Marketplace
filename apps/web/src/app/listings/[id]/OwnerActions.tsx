'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';

export default function OwnerActions({ listingId, sellerId }: { listingId: string; sellerId: string }) {
  const { data: session } = useSession();
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (!session?.accessToken) return;
    apiClient(session.accessToken)
      .get<{ id: string }>('/users/me')
      .then((me) => setIsOwner(me.id === sellerId))
      .catch(() => {});
  }, [session, sellerId]);

  if (!isOwner) return null;

  return (
    <Link
      href={`/listings/${listingId}/edit`}
      className="w-full flex items-center justify-center gap-2 border border-border rounded-xl py-3 text-sm font-medium text-gray-700 hover:border-gold transition-colors mt-3"
    >
      Edit listing
    </Link>
  );
}
