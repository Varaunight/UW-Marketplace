export type ListingStatus = 'active' | 'sold' | 'deleted';

export interface Category {
  id: number;
  slug: string;
  label: string;
}

export interface ListingImage {
  id: string;
  cloudinaryId: string;
  url: string;
  displayOrder: number;
}

export interface Listing {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string | null;
  categoryId: number;
  categoryLabel: string;
  title: string;
  description: string;
  price: number;
  status: ListingStatus;
  images: ListingImage[];
  createdAt: string;
  updatedAt: string;
}

export interface ListingsQuery {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sellerId?: string;
}

export interface ListingsResponse {
  listings: Listing[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateListingBody {
  title: string;
  description: string;
  price: number;
  categoryId: number;
}

export interface UpdateListingBody {
  title?: string;
  description?: string;
  price?: number;
  categoryId?: number;
  status?: ListingStatus;
}
