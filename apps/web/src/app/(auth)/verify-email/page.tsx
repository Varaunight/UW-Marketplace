'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) { setStatus('error'); return; }

    apiClient()
      .post('/auth/verify-email', { token })
      .then(() => {
        setStatus('success');
        setTimeout(() => router.push('/login'), 3000);
      })
      .catch(() => setStatus('error'));
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-surface border border-border rounded-2xl p-10 w-full max-w-md shadow-sm text-center">
        {status === 'loading' && (
          <>
            <div className="w-12 h-12 bg-base rounded-full flex items-center justify-center mx-auto mb-4 text-2xl animate-pulse">⏳</div>
            <h2 className="text-xl font-semibold">Verifying your email...</h2>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="w-12 h-12 bg-gold-muted rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
            <h2 className="text-xl font-bold mb-2">Email verified!</h2>
            <p className="text-gray-400 text-sm">Redirecting you to log in...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✕</div>
            <h2 className="text-xl font-bold mb-2">Verification failed</h2>
            <p className="text-gray-400 text-sm mb-5">
              This link is invalid or has expired.
            </p>
            <Link href="/login" className="text-sm text-gold-ink hover:underline font-medium">
              Back to log in
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
