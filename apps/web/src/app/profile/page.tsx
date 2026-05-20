'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { User, Listing } from '@uw-marketplace/shared';
import ListingGrid from '@/components/listings/ListingGrid';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/login'); return; }
    if (!session) return;

    const client = apiClient(session.accessToken);
    client.get<User>('/users/me').then((u) => {
      setUser(u);
      setDisplayName(u.displayName);
      client.get<{ listings: Listing[] }>(`/listings?sellerId=${u.id}&limit=48`).then((d) => setListings(d.listings));
    });
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
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  if (!user) return <div className="max-w-3xl mx-auto px-4 py-8 text-gray-400 text-sm">Loading...</div>;

  const inputClass = 'w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold bg-base transition-shadow';

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      <div className="bg-surface rounded-xl p-6 border border-border mb-8">
        <form onSubmit={saveProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Display name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <p className="text-sm text-gray-500 bg-base px-3 py-2.5 rounded-lg border border-border">{user.email}</p>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-gold hover:bg-gold-dark text-black font-semibold px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50 text-sm"
          >
            {saved ? 'Saved!' : saving ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>

      <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-4">My listings</h2>
      <ListingGrid listings={listings} />
    </div>
  );
}
