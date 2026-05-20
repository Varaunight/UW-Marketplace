'use client';

import { useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await apiClient().post('/auth/forgot-password', { email });
      setSent(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-surface border border-border rounded-2xl p-10 w-full max-w-md shadow-sm text-center">
          <div className="w-12 h-12 bg-gold-muted rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            📬
          </div>
          <h2 className="text-xl font-bold mb-2">Check your inbox</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            If an account exists for <strong className="text-gray-800">{email}</strong>, we sent a
            password reset link. It expires in 1 hour.
          </p>
          <Link href="/login" className="inline-block mt-6 text-sm text-gold-ink hover:underline font-medium">
            Back to log in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-surface border border-border rounded-2xl p-8 w-full max-w-md shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Forgot password?</h1>
          <p className="text-gray-400 text-sm mt-1">
            Enter your UW email and we&apos;ll send you a reset link.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">UW Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold bg-base transition-shadow"
              placeholder="jsmith@uwaterloo.ca"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold hover:bg-gold-dark text-black font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Remembered it?{' '}
          <Link href="/login" className="text-gold-ink hover:underline font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
