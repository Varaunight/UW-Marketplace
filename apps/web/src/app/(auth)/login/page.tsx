'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const justReset = searchParams.get('reset') === '1';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await signIn('credentials', { email: form.email, password: form.password, redirect: false });
    setLoading(false);
    if (result?.error) {
      setError('Invalid email or password.');
    } else {
      router.push(searchParams.get('callbackUrl') || '/');
    }
  }

  const inputClass =
    'w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 bg-card text-fg placeholder-muted transition-shadow';

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-surface border border-border rounded-2xl p-8 w-full max-w-md">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-fg">Welcome back</h1>
          <p className="text-muted text-sm mt-1">Log in to UW Marketplace</p>
        </div>

        {justReset && (
          <div className="bg-gold-muted text-gold-ink border border-gold/20 px-4 py-3 rounded-lg mb-4 text-sm font-medium">
            Password updated — log in with your new password.
          </div>
        )}
        {error && (
          <div className="bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-fg/70 mb-1.5">UW Email</label>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} placeholder="jsmith@uwaterloo.ca" />
          </div>
          <div>
            <label className="block text-sm font-medium text-fg/70 mb-1.5">Password</label>
            <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={inputClass} />
          </div>
          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-xs text-muted hover:text-fg transition-colors">
              Forgot password?
            </Link>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-gold hover:bg-gold-dark text-black font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50">
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-gold-ink hover:text-gold font-medium transition-colors">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
