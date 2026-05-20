'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { Category } from '@uw-marketplace/shared';
import Link from 'next/link';

export const metadata = {
  title: 'List an Item — UW Marketplace',
};

export default function NewListingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({ title: '', description: '', price: '', categoryId: '' });
  const [images, setImages] = useState<File[]>([]);
  const [acknowledged, setAcknowledged] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login?callbackUrl=/listings/new');
    apiClient().get<Category[]>('/listings/categories').then(setCategories).catch(() => {});
  }, [status, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session) return;
    setError('');
    setLoading(true);

    try {
      const { id } = await apiClient(session.accessToken).post<{ id: string }>('/listings', {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        categoryId: Number(form.categoryId),
      });

      for (const image of images) {
        const fd = new FormData();
        fd.append('image', image);
        await apiClient(session.accessToken).postForm(`/listings/${id}/images`, fd);
      }

      router.push(`/listings/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create listing.');
      setLoading(false);
    }
  }

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) setImages(Array.from(e.target.files).slice(0, 5));
  }

  if (status === 'loading') return null;

  const inputClass =
    'w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 bg-card text-fg placeholder-muted transition-shadow';

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-fg mb-1">List an item</h1>
      <p className="text-sm text-muted mb-6">Fill in the details below to post your item.</p>

      {error && (
        <div className="bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 bg-surface rounded-xl p-6 border border-border card-shadow">
        <div>
          <label className="block text-sm font-medium text-fg/70 mb-1.5">Title</label>
          <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} placeholder="e.g. MATH 137 Textbook" />
        </div>

        <div>
          <label className="block text-sm font-medium text-fg/70 mb-1.5">Category</label>
          <select required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className={inputClass}>
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-fg/70 mb-1.5">Price ($)</label>
          <input type="number" required min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputClass} placeholder="0.00" />
        </div>

        <div>
          <label className="block text-sm font-medium text-fg/70 mb-1.5">Description</label>
          <textarea required rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputClass} resize-none`} placeholder="Describe the item's condition, what's included, pickup location, etc." />
        </div>

        <div>
          <label className="block text-sm font-medium text-fg/70 mb-1.5">Photos (up to 5)</label>
          <input type="file" accept="image/*" multiple onChange={handleFiles} className="text-sm text-muted" />
          {images.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {images.map((f, i) => (
                <div key={i} className="w-16 h-16 rounded-lg overflow-hidden bg-card border border-border">
                  <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Prohibited items acknowledgment */}
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs font-semibold text-fg/70 uppercase tracking-wide mb-2">Before you publish</p>
          <p className="text-xs text-muted mb-3 leading-relaxed">
            Listing prohibited items (weapons, drugs, counterfeit goods, etc.) will result in permanent account suspension and may be reported to authorities.{' '}
            <Link href="/safety#prohibited" className="text-gold-ink hover:text-gold underline transition-colors">View full list</Link>.
          </p>
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              className="accent-gold mt-0.5 shrink-0"
            />
            <span className="text-xs text-fg/70 leading-relaxed">
              I confirm this item is <strong className="text-fg">not prohibited</strong> and I agree to the{' '}
              <Link href="/terms" className="text-gold-ink hover:text-gold underline transition-colors">Terms of Service</Link>.
            </span>
          </label>
        </div>

        <button type="submit" disabled={loading || !acknowledged} className="w-full bg-gold hover:bg-gold-dark text-black font-semibold py-3 rounded-xl transition-colors disabled:opacity-50">
          {loading ? 'Publishing...' : 'Publish listing'}
        </button>
      </form>
    </div>
  );
}
