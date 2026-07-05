export type ProductVariantData = {
  id: string;
  sku: string;
  size: string | null;
  color: string | null;
  colorHex: string | null;
  stock: number;
  isDefault: boolean;
};

export type ProductReviewData = {
  id: string;
  rating: number;
  title: string | null;
  comment: string;
  isVerifiedPurchase: boolean;
  authorName: string;
  createdAt: string;
};

export type ProductDetailData = {
  id: string;
  slug: string;
  name: string;
  brand: string | null;
  description: string;
  materials: string | null;
  careInstructions: string | null;
  videoUrl: string | null;
  price: number;
  compareAtPrice: number | null;
  isNewArrival: boolean;
  isBestSeller: boolean;
  categorySlug: string | null;
  categoryName: string | null;
  images: { id: string; url: string; alt: string | null }[];
  variants: ProductVariantData[];
  reviews: ProductReviewData[];
  averageRating: number;
  reviewCount: number;
};
