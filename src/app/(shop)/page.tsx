import type { Metadata } from "next";
import { HeroSection } from "@/features/home/components/hero-section";
import { PromoBanner } from "@/features/home/components/promo-banner";
import { CollectionsSection } from "@/features/home/components/collections-section";
import { TestimonialsSection } from "@/features/home/components/testimonials-section";
import { InstagramSection } from "@/features/home/components/instagram-section";
import { NewsletterSection } from "@/features/home/components/newsletter-section";
import { ProductGridSection } from "@/features/catalog/components/product-grid-section";
import {
  getBestSellers,
  getFeaturedCollections,
  getFeaturedProducts,
  getNewArrivals,
} from "@/features/catalog/queries/get-home-sections";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "UrbanDiscount — Sneakers & streetwear premium à prix discount",
  description:
    "Découvrez notre sélection de sneakers, streetwear et accessoires premium à prix discount. Livraison rapide, retours offerts.",
};

export default async function HomePage() {
  const [featured, bestSellers, newArrivals, collections] = await Promise.all([
    getFeaturedProducts(),
    getBestSellers(),
    getNewArrivals(),
    getFeaturedCollections(),
  ]);

  return (
    <>
      <HeroSection />
      <ProductGridSection
        title="Sélection populaire"
        subtitle="Les pièces qui font parler d'elles"
        href="/collections/nouveautes"
        products={featured}
      />
      <PromoBanner />
      <ProductGridSection
        title="Meilleures ventes"
        subtitle="Plébiscitées par la communauté"
        href="/collections/meilleures-ventes"
        products={bestSellers}
      />
      <CollectionsSection collections={collections} />
      <ProductGridSection
        title="Nouveautés"
        subtitle="Fraîchement arrivées"
        href="/collections/nouveautes"
        products={newArrivals}
      />
      <TestimonialsSection />
      <InstagramSection />
      <NewsletterSection />
    </>
  );
}
