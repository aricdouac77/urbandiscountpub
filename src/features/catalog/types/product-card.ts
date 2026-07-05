export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  brand: string | null;
  imageUrl: string;
  imageAlt: string;
  price: number;
  compareAtPrice: number | null;
  isNewArrival: boolean;
  isBestSeller: boolean;
};
