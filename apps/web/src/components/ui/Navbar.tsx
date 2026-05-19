'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Conversation } from '@uw-marketplace/shared';

export default function Navbar() {
  const { data: session } = useSession();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!session?.accessToken) return;
    const check = async () => {
      try {
        const convos = await apiClient(session.accessToken).get<Conversation[]>('/conversations');
        setUnread(convos.reduce((sum, c) => sum + c.unreadCount, 0));
      } catch {}
    };
    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, [session]);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-gray-900">
          UW <span className="text-yellow-500">Marketplace</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/listings" className="text-sm text-gray-600 hover:text-gray-900">Browse</Link>

          {session ? (
            <>
              <Link href="/listings/new" className="text-sm bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded-lg transition">
                + List Item
              </Link>
              <Link href="/messages" className="relative text-sm text-gray-600 hover:text-gray-900">
                Messages
                {unread > 0 && (
                  <span className="absolute -top-1 -right-3 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </Link>
              <Link href="/profile" className="text-sm text-gray-600 hover:text-gray-900">Profile</Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">Log in</Link>
              <Link href="/register" className="text-sm bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded-lg transition">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
