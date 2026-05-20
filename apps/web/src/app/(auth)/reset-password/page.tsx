'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') ?? '';
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-surface border border-border rounded-2xl p-10 w-full max-w-md text-center">
          <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl text-red-500">✕</div>
          <h2 className="text-xl font-bold text-fg mb-2">Invalid link</h2>
          <p className="text-muted text-sm mb-5">This reset link is missing a token.</p>
          <Link href="/forgot-password" className="text-sm text-gold-ink hover:text-gold font-medium transition-colors">Request a new link</Link>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    try {
      await apiClient().post('/auth/reset-password', { token, password: form.password });
      router.push('/login?reset=1');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'This link is invalid or has expired.');
      setLoading(false);
    }
  }

  const inputClass = 'w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 bg-card text-fg placeholder-muted transition-shadow';

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-surface border border-border rounded-2xl p-8 w-full max-w-md">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-fg">Set new password</h1>
          <p className="text-muted text-sm mt-1">Choose a strong password for your account.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}{' '}
            {error.includes('expired') && <Link href="/forgot-password" className="underline font-medium">Request a new link.</Link>}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-fg/70 mb-1.5">New password</label>
            <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={inputClass} placeholder="At least 8 characters" />
          </div>
          <div>
            <label className="block text-sm font-medium text-fg/70 mb-1.5">Confirm password</label>
            <input type="password" required value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} className={inputClass} />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-gold hover:bg-gold-dark text-black font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50">
            {loading ? 'Saving...' : 'Save new password'}
          </button>
        </form>
      </div>
    </div>
  );
}
