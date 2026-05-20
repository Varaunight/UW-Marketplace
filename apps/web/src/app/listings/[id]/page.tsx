import { apiClient } from '@/lib/api-client';
import { Listing } from '@uw-marketplace/shared';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import ContactSellerButton from './ContactSellerButton';

interface Props { params: Promise<{ id: string }> }

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
              <div className="relative h-80 rounded-xl overflow-hidden bg-base">
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
                    <div key={img.id} className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden bg-base">
                      <Image
                        src={img.url.replace('/upload/', '/upload/w_100,f_auto,q_auto/')}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="h-80 rounded-xl bg-base flex items-center justify-center text-6xl">📦</div>
          )}
        </div>

        {/* Details */}
        <div>
          <span className="inline-block bg-gold-muted text-gold-ink text-xs font-semibold px-2.5 py-1 rounded-full mb-3">
            {listing.categoryLabel}
          </span>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{listing.title}</h1>
          <p className="text-3xl font-bold text-gold-ink mb-4">${listing.price.toFixed(2)}</p>

          <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
            <span>Listed by</span>
            <a href={`/profile/${listing.sellerId}`} className="font-medium text-gray-700 hover:underline">
              {listing.sellerName}
            </a>
          </div>

          <div className="bg-base rounded-xl p-4 mb-6 border border-border">
            <h2 className="font-semibold text-xs uppercase tracking-widest text-gray-400 mb-2">Description</h2>
            <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">{listing.description}</p>
          </div>

          {listing.status === 'sold' && (
            <div className="bg-red-50 text-red-700 text-sm font-medium px-4 py-3 rounded-lg mb-4">
              This item has been sold.
            </div>
          )}

          <ContactSellerButton listing={listing} />
        </div>
      </div>
    </div>
  );
}
