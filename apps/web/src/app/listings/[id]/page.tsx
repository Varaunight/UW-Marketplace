import { apiClient } from '@/lib/api-client';
import { Listing } from '@uw-marketplace/shared';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import ContactSellerButton from './ContactSellerButton';
import ReportModal from '@/components/ui/ReportModal';
import SellerActions from './SellerActions';

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const listing = await apiClient().get<Listing>(`/listings/${id}`).catch(() => null);
  if (!listing) return { title: 'Listing not found — UW Marketplace' };
  return {
    title: `${listing.title} — UW Marketplace`,
    description: `${listing.description.slice(0, 150)} — $${listing.price.toFixed(2)}`,
  };
}

export default async function ListingDetailPage({ params }: Props) {
  const { id } = await params;
  const listing = await apiClient()
    .get<Listing>(`/listings/${id}`)
    .catch(() => null);

  if (!listing) notFound();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          {listing.images.length > 0 ? (
            <div className="space-y-2">
              <div className="relative h-80 rounded-xl overflow-hidden bg-card">
                <Image
                  src={listing.images[0].url.replace('/upload/', '/upload/w_800,f_auto,q_auto/')}
                  alt={listing.title}
                  fill
                  className="object-cover"
                />
              </div>
              {listing.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {listing.images.slice(1).map((img) => (
                    <div key={img.id} className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden bg-card">
                      <Image src={img.url.replace('/upload/', '/upload/w_100,f_auto,q_auto/')} alt="" fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="h-80 rounded-xl bg-card flex items-center justify-center text-6xl">📦</div>
          )}
        </div>

        {/* Details */}
        <div>
          <span className="inline-block bg-gold-muted text-gold-ink text-xs font-semibold px-2.5 py-1 rounded-full mb-3 border border-gold/20">
            {listing.categoryLabel}
          </span>
          <h1 className="text-2xl font-bold text-fg mb-2">{listing.title}</h1>
          <p className="text-3xl font-bold text-gold-ink mb-4">${listing.price.toFixed(2)}</p>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-sm text-muted">
              <span>Listed by</span>
              <a href={`/profile/${listing.sellerId}`} className="font-medium text-fg/70 hover:text-fg transition-colors hover:underline">
                {listing.sellerName}
              </a>
            </div>
            <ReportModal reportedListingId={listing.id} label="Report listing" />
          </div>

          <div className="bg-surface rounded-xl p-4 mb-5 border border-border card-shadow">
            <h2 className="font-semibold text-xs uppercase tracking-widest text-muted mb-2">Description</h2>
            <p className="text-fg/70 text-sm whitespace-pre-wrap leading-relaxed">{listing.description}</p>
          </div>

          {listing.status === 'sold' && (
            <div className="bg-red-500/10 text-red-500 border border-red-500/20 text-sm font-medium px-4 py-3 rounded-lg mb-4">
              This item has been sold.
            </div>
          )}

          <ContactSellerButton listing={listing} />
          <SellerActions listing={listing} />

          {/* Safe meetup callout */}
          <div className="mt-5 bg-gold-muted border border-gold/20 rounded-xl px-4 py-3">
            <p className="text-xs font-semibold text-gold-ink mb-1">📍 Meet safely on campus</p>
            <p className="text-xs text-fg/60 leading-relaxed">
              Suggested spots: <strong className="text-fg/80">SLC main floor</strong>, <strong className="text-fg/80">DC lobby</strong>, or <strong className="text-fg/80">DP Library entrance</strong>.
              {' '}<Link href="/safety#meetups" className="text-gold-ink hover:text-gold underline font-medium transition-colors">View all safe spots →</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
