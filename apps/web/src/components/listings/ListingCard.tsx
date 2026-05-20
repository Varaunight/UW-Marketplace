import Link from 'next/link';
import Image from 'next/image';
import { Listing } from '@uw-marketplace/shared';

export default function ListingCard({ listing }: { listing: Listing }) {
  const image = listing.images[0];

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group block bg-surface rounded-xl overflow-hidden border border-border hover:border-gold/40 card-shadow card-hover-glow transition-all"
    >
      <div className="relative h-48 bg-card">
        {image ? (
          <Image
            src={image.url.replace('/upload/', '/upload/w_400,f_auto,q_auto/')}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="h-full flex items-center justify-center text-muted text-4xl">📦</div>
        )}
        <span className="absolute top-2 left-2 bg-surface/90 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded-full text-muted border border-border">
          {listing.categoryLabel}
        </span>
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-fg text-sm line-clamp-1">{listing.title}</h3>
        <p className="text-gold-ink font-bold mt-0.5">${listing.price.toFixed(2)}</p>
        <p className="text-muted text-xs mt-1">{listing.sellerName}</p>
      </div>
    </Link>
  );
}
