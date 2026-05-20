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
    <nav className="bg-surface border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl tracking-tight text-gray-900">
          UW <span className="text-gold-ink">Marketplace</span>
        </Link>

        <div className="flex items-center gap-5">
          <Link href="/listings" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            Browse
          </Link>

          {session ? (
            <>
              <Link
                href="/listings/new"
                className="text-sm bg-gold hover:bg-gold-dark text-black font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                + List Item
              </Link>
              <Link href="/messages" className="relative text-sm text-gray-500 hover:text-gray-900 transition-colors">
                Messages
                {unread > 0 && (
                  <span className="absolute -top-1.5 -right-3.5 bg-black text-gold text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </Link>
              <Link href="/profile" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                Profile
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                Log in
              </Link>
              <Link
                href="/register"
                className="text-sm bg-gold hover:bg-gold-dark text-black font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
