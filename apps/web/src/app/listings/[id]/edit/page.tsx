'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { apiClient } from '@/lib/api-client';
import { Listing, Category } from '@uw-marketplace/shared';

export default function EditListingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [listing, setListing] = useState<Listing | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({ title: '', description: '', price: '', categoryId: '', status: 'active' });
  const [newImages, setNewImages] = useState<File[]>([]);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/login'); return; }
    if (!session) return;

    const client = apiClient(session.accessToken);

    Promise.all([
      client.get<Listing>(`/listings/${id}`),
      client.get<Category[]>('/listings/categories'),
      client.get<{ id: string }>('/users/me'),
    ]).then(([l, cats, me]) => {
      if (l.sellerId !== me.id) {
        router.replace(`/listings/${id}`);
        return;
      }
      setListing(l);
      setCategories(cats);
      setForm({
        title: l.title,
        description: l.description,
        price: String(l.price),
        categoryId: String(l.categoryId),
        status: l.status,
      });
    }).catch(() => router.replace(`/listings/${id}`));
  }, [session, status, id, router]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!session) return;
    setSaving(true);
    setError('');
    try {
      await apiClient(session.accessToken).patch(`/listings/${id}`, {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        categoryId: Number(form.categoryId),
        status: form.status,
      });

      for (const image of newImages) {
        const fd = new FormData();
        fd.append('image', image);
        await apiClient(session.accessToken).postForm(`/listings/${id}/images`, fd);
      }

      router.push(`/listings/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes.');
      setSaving(false);
    }
  }

  async function handleDeleteImage(imageId: string) {
    if (!session) return;
    setDeletingImageId(imageId);
    try {
      await apiClient(session.accessToken).delete(`/listings/${id}/images/${imageId}`);
      setListing((prev) => prev ? { ...prev, images: prev.images.filter((img) => img.id !== imageId) } : prev);
    } finally {
      setDeletingImageId(null);
    }
  }

  async function handleDelete() {
    if (!session || !confirm('Delete this listing? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await apiClient(session.accessToken).delete(`/listings/${id}`);
      router.push('/profile');
    } catch {
      setDeleting(false);
    }
  }

  if (!listing) return <div className="max-w-2xl mx-auto px-4 py-8 text-gray-400 text-sm">Loading...</div>;

  const inputClass = 'w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold bg-base transition-shadow';

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Edit listing</h1>
          <p className="text-sm text-gray-400 mt-1">Changes are saved immediately.</p>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors disabled:opacity-50"
        >
          {deleting ? 'Deleting...' : 'Delete listing'}
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}

      <form onSubmit={handleSave} className="space-y-5 bg-surface rounded-xl p-6 border border-border">

        {/* Status toggle */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div>
            <p className="text-sm font-medium text-gray-700">Listing status</p>
            <p className="text-xs text-gray-400 mt-0.5">Sold items are hidden from browse results</p>
          </div>
          <div className="flex gap-2">
            {(['active', 'sold'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setForm({ ...form, status: s })}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors capitalize ${
                  form.status === s
                    ? 'bg-gold border-gold text-black'
                    : 'bg-base border-border text-gray-500 hover:border-gold'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
          <select
            required
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className={inputClass}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Price ($)</label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
          <textarea
            required
            rows={5}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Current images */}
        {listing.images.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Current photos</label>
            <div className="flex gap-2 flex-wrap">
              {listing.images.map((img) => (
                <div key={img.id} className="relative w-20 h-20 rounded-lg overflow-hidden bg-base border border-border group">
                  <Image
                    src={img.url.replace('/upload/', '/upload/w_100,f_auto,q_auto/')}
                    alt=""
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(img.id)}
                    disabled={deletingImageId === img.id}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-medium"
                  >
                    {deletingImageId === img.id ? '...' : 'Remove'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add new images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Add photos {listing.images.length > 0 && `(${listing.images.length} existing)`}
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setNewImages(e.target.files ? Array.from(e.target.files).slice(0, 5 - listing.images.length) : [])}
            className="text-sm text-gray-500"
          />
          {newImages.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {newImages.map((f, i) => (
                <div key={i} className="w-20 h-20 rounded-lg overflow-hidden bg-base border border-border">
                  <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-gold hover:bg-gold-dark text-black font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save changes'}
          </button>
          <button
            type="button"
            onClick={() => router.push(`/listings/${id}`)}
            className="px-6 py-3 rounded-xl border border-border text-sm font-medium text-gray-600 hover:border-gold transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
