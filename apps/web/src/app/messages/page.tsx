'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { apiClient } from '@/lib/api-client';
import { Conversation } from '@uw-marketplace/shared';

export default function MessagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/login'); return; }
    if (!session) return;
    apiClient(session.accessToken)
      .get<Conversation[]>('/conversations')
      .then(setConversations)
      .finally(() => setLoading(false));
  }, [session, status, router]);

  if (loading) return <div className="max-w-2xl mx-auto px-4 py-8 text-gray-400 text-sm">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>

      {conversations.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">💬</div>
          <p className="font-medium text-gray-500">No conversations yet</p>
          <p className="text-sm mt-1">Contact a seller on any listing to start a chat.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map((c) => (
            <Link
              key={c.id}
              href={`/messages/${c.id}`}
              className="flex items-center gap-3 bg-surface rounded-xl p-4 border border-border hover:border-gold transition-colors"
            >
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-base shrink-0">
                {c.listingImage ? (
                  <Image src={c.listingImage} alt="" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl">📦</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900 truncate">{c.listingTitle}</p>
                <p className="text-xs text-gray-400 truncate mt-0.5">{c.lastMessage || 'No messages yet'}</p>
              </div>
              {c.unreadCount > 0 && (
                <span className="bg-black text-gold text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                  {c.unreadCount}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
